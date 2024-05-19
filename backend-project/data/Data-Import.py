#!/usr/bin/env python

import pandas as pd
import sqlite3
import os
import re
from tqdm import tqdm


def clean_name(name: str) -> str:
    return name.lower() \
            .replace("'s", "") \
            .replace(",", "") \
            .replace(" ", "_") \
            .replace("-", "_")


def load_data() -> tuple[pd.DataFrame, list[str]]:
    # Extract League and Season information from filename
    regex = r".+\. (.+) \- (\d{4}-\d{4}).xls$"
    frames = []
    s = 0
    for file in os.listdir("Data"):
        filename = os.fsdecode(file)
        m = re.match(regex, filename)
        if m is not None:
            s += 1
            xl = pd.ExcelFile(os.path.join("Data", filename))
            # Select the right sheet
            df = xl.parse("Box score")
            # Add information contained in filename
            df.insert(0, "Season", [m.group(2)] * len(df), False)
            df.insert(0, "League", [m.group(1)] * len(df), False)
            print(f"Processed {m.group(1)} - {m.group(2)}")
            frames.append(df)

    df = pd.concat(frames, ignore_index=True)

    # Clean up the data
    df = df.replace("-", "0")
    df = df.rename(columns={"Unnamed: 0": "Jersey number", "Unnamed: 1": "Player name", "Unnamed: 2": "Team name"})

    clean_col_names = {col: clean_name(col) for col in df.columns}
    df = df.rename(columns=clean_col_names)

    # Find inconsistent rows and drop them
    grouped = df.groupby(["player_name", "team_name", "league", "season"]).count()
    inconsistent_players = [player for player, *_ in grouped[grouped["games_played"] > 1].index]
    df = df.drop(df[df["player_name"].isin(inconsistent_players)].index)

    # Drop columns containing percenteges as we can just recalculate them if needed
    percentage_cols = list(filter(lambda x: "%" in x, df.columns))
    percentage_cols.append("usage_percentage")
    df = df.drop(columns=percentage_cols)

    # Remove percentage sign so the data can be stored as an int into the database
    percentages = [col for col in df.columns if ('%' in col) or ("percentage" in col)]
    for p in percentages:
        df[p] = df[p].str.replace("%", "")

    return df, percentages


def create_tables(con: sqlite3.Connection, df: pd.DataFrame, percentages: list[str]):
    con = sqlite3.connect("Players.db")
    cur = con.cursor()
    con.execute("DROP TABLE IF EXISTS Player;")
    con.execute("DROP TABLE IF EXISTS League;")
    con.execute("DROP TABLE IF EXISTS Team;")
    con.execute("DROP TABLE IF EXISTS Stats;")
    con.execute("CREATE TABLE Player (player_id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT);")
    con.execute("CREATE TABLE League (league_id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT);")
    con.execute("CREATE TABLE Team (team_id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT);")
    # Associate each non-real column with a datatype
    non_real_columns = { p: "INTEGER" for p in percentages }
    non_real_columns["season"] = "TEXT"
    # TODO: Change dtype
    non_real_columns["minutes"] = "TEXT"
    non_real_columns["jersey_number"] = "INTEGER"
    non_real_columns["games_played"] = "INTEGER"
    non_real_columns["number_of_player_possessions"] = "INTEGER"
    non_real_columns["team_points_with_player"] = "INTEGER"
    non_real_columns["offensive_rating"] = "INTEGER"
    non_real_columns["opponent_possessions_played"] = "INTEGER"
    non_real_columns["opponent_points_with_player"] = "INTEGER"
    non_real_columns["defensive_rating"] = "INTEGER"

    # Combine real and non-real columns
    cols = [f"\"{colname}\" REAL" for colname in df.drop(columns=["league", "player_name", "team_name"]).columns if colname not in non_real_columns]
    cols += [f"\"{colname}\" {dtype}" for colname, dtype in non_real_columns.items()]

    # Create stats table with all columns and correct datatypes
    col_str = "player_id INTEGER, team_id INTEGER, league_id INTEGER, " + ", ".join(cols).replace("'s", "")
    con.execute(f"CREATE TABLE Stats ({col_str}, PRIMARY KEY (season, player_id, team_id, league_id));")


def create_scores_table(con: sqlite3.Connection, df: pd.DataFrame):
    # Assumes con is already connected to the database
    cur = con.cursor()
    cur.execute("DROP TABLE IF EXISTS Scores;")
    # Primary key for the Scores table should be player and season
    # Set up the Scores table with the correct columns
    cur.execute("CREATE TABLE Scores (player_id INTEGER, season TEXT, PRIMARY KEY (player_id, season));")
    if not column_exists(cur, "Scores", "off_score_1"):
        cur.execute("ALTER TABLE Scores ADD COLUMN off_score_1 REAL;")
    if not column_exists(cur, "Scores", "off_score_2"):
        cur.execute("ALTER TABLE Scores ADD COLUMN off_score_2 REAL;")
    if not column_exists(cur, "Scores", "off_score_3"):
        cur.execute("ALTER TABLE Scores ADD COLUMN off_score_3 REAL;")
    if not column_exists(cur, "Scores", "def_score"):
        cur.execute("ALTER TABLE Scores ADD COLUMN def_score REAL;")
    if not column_exists(cur, "Scores", "reb_score"):
        cur.execute("ALTER TABLE Scores ADD COLUMN reb_score REAL;")

    # Insert data from df into the Scores table
    for index, row in tqdm(df.iterrows()):
        player_name = row['player name'].replace("'", "''")
        season = row['season'].replace("'", "''")
        pid = cur.execute(f"select player_id from Player where name = '{player_name}'").fetchone()
        if pid is not None:
            pid = pid[0]
            cur.execute(f"INSERT INTO Scores (player_id, season) VALUES ({pid}, '{season}');")
            cur.execute(f"UPDATE Scores SET off_score_1 = {row['off_score_1']}, off_score_2 = {row['off_score_2']}, \
                        off_score_3 = {row['off_score_3']}, def_score = {row['def_score']}, \
                        reb_score = {row['reb_score']} WHERE player_id = {pid} AND season = '{season}';")
        else:
            print(f"Player {player_name} not found in the database")
            continue


def insert_data(con: sqlite3.Connection, df: pd.DataFrame):
    cur = con.cursor()
    # Insert team, league and player data
    teams = [f"'{name}'" for name in df["team_name"].str.replace("'", "''").unique()]
    players = [f"'{name}'" for name in df["player_name"].str.replace("'", "''").unique()]
    leagues = [f"'{name}'" for name in df["league"].str.replace("'", "''").unique()]

    cur.execute(f"INSERT INTO Player(name) VALUES({'), ('.join(players)});")
    cur.execute(f"INSERT INTO Team(name) VALUES({'), ('.join(teams)});")
    cur.execute(f"INSERT INTO League(name) VALUES({'), ('.join(leagues)});")

    # Insert stat data
    df_cols = [col for col in df.drop(columns=["league", "player_name", "team_name", "season", "minutes"]).columns]
    cols = "\"player_id\", \"team_id\", \"league_id\", \"season\", \"minutes\", \"" + "\", \"".join(df_cols) + "\""
    for index, row in tqdm(df.iterrows()):
        player_name = row['player_name'].replace("'", "''")
        team_name = row['team_name'].replace("'", "''")
        league_name = row['league'].replace("'", "''")
        pid = cur.execute(f"select player_id from Player where name = '{player_name}'").fetchone()[0]
        tid = cur.execute(f"select team_id from Team where name = '{team_name}'").fetchone()[0]
        lid = cur.execute(f"select league_id from League where name = '{league_name}'").fetchone()[0]
        vals = [str(val) for val in row.drop(["league", "player_name", "team_name", "season", "minutes"]).values]
        cur.execute(f"INSERT INTO Stats ({cols}) VALUES ({pid}, {tid}, {lid}, '{row['season']}', '{row['minutes']}', {', '.join(vals)});")


def insert_cluster_data(con: sqlite3.Connection, off_file: str, def_file: str):
    cur = con.cursor()
    off_cluster = pd.read_csv(off_file)
    def_cluster = pd.read_csv(def_file)
    cluster_data = off_cluster.copy().rename(columns={"player name": "player_name"})
    # Add defensive cluster to the data so we have omly one dataframe
    cluster_data['def_cluster'] = def_cluster['def_cluster']
    # Add two new columns to the Stats table: off_cluster (INTEGER) and def_cluster (STRING)
    # Create columns def_cluster and off_cluster if they don't exist
    if not column_exists(cur, "Stats", "off_cluster"):
        cur.execute("ALTER TABLE Stats ADD COLUMN off_cluster INTEGER;")
    if not column_exists(cur, "Stats", "def_cluster"):
        cur.execute("ALTER TABLE Stats ADD COLUMN def_cluster TEXT CHECK (def_cluster IN ('A', 'B'));")
    # Insert cluster data
    for index, row in tqdm(cluster_data.iterrows()):
        player_name = row['player_name'].replace("'", "''")
        pid = cur.execute(f"select player_id from Player where name = '{player_name}'").fetchone()
        if pid is not None:
            pid = pid[0]
            cur.execute(f"UPDATE Stats SET off_cluster = {row['off_cluster']}, def_cluster = '{row['def_cluster']}' WHERE player_id = {pid};")
        else:
            print(f"Player {player_name} not found in the database")
            continue

def column_exists(cursor, table_name, column_name):
    cursor.execute(f"PRAGMA table_info({table_name})")
    columns = [row[1] for row in cursor.fetchall()]
    return column_name in columns


if __name__ == "__main__":
    # df, p = load_data()
    con = sqlite3.connect("Players.db")
    # create_tables(con, df, p)
    scores_df = pd.read_csv("player_scores.csv")
    create_scores_table(con, scores_df)
    # insert_data(con, df)
    # insert_cluster_data(con, "player_cluster_off.csv", "player_cluster_def.csv")
    con.commit()
    con.close()
