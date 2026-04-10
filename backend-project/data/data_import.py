#!/usr/bin/env python

import pandas as pd
import sqlite3
import os
import re
from pathlib import Path
from tqdm import tqdm


def clean_name(name: str) -> str:
    return name.lower() \
            .replace("'s", "") \
            .replace(",", "") \
            .replace(" ", "_") \
            .replace("-", "_")


def load_data(file_name) -> tuple[pd.DataFrame, list[str]]:
    # Extract League and Season information from filename
    # df = df.rename(columns={"Unnamed: 0": "Jersey number", "Unnamed: 1": "Player name", "Unnamed: 2": "Team name"})
    df = pd.read_csv(file_name)
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
    # ALREADY DONE IN DATA AGGREGATION STEP
    # percentages = [col for col in df.columns if ('%' in col) or ("percentage" in col)]
    # for p in percentages:
    #     df[p] = df[p].str.replace("%", "")

    return df


def create_tables(con: sqlite3.Connection, df: pd.DataFrame):
    con = sqlite3.connect("Players.db")
    cur = con.cursor()
    con.execute("DROP TABLE IF EXISTS Player;")
    con.execute("DROP TABLE IF EXISTS League;")
    con.execute("DROP TABLE IF EXISTS Team;")
    con.execute("DROP TABLE IF EXISTS Stats;")
    con.execute("CREATE TABLE Player (player_id INTEGER PRIMARY KEY AUTOINCREMENT, " + 
                "name TEXT, x_boxscore REAL DEFAULT NULL, y_boxscore REAL DEFAULT NULL, x_advanced_boxscore REAL DEFAULT NULL, y_advanced_boxscore REAL DEFAULT NULL," + 
                "x_additional_field_goal_data REAL DEFAULT NULL, y_additional_field_goal_data REAL DEFAULT NULL, " +
                "x_play_type_combinations REAL DEFAULT NULL, y_play_type_combinations REAL DEFAULT NULL, " + 
                "x_defense_against_play_type_combinations REAL DEFAULT NULL, y_defense_against_play_type_combinations REAL DEFAULT NULL, " +
                "x_drivers REAL DEFAULT NULL, y_drivers REAL DEFAULT NULL, x_drivers_defense REAL DEFAULT NULL, y_drivers_defense REAL DEFAULT NULL);")
    con.execute("CREATE TABLE League (league_id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT);")
    con.execute("CREATE TABLE Team (team_id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT);")
    # Associate each non-real column with a datatype
    # Removed the percentage columns as they are now floats (i.e. REAL) and not INTEGERs
    non_real_columns = {}
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


def insert_scores_data(con: sqlite3.Connection, scores_file: str):
    cur = con.cursor()
    scores = pd.read_csv(scores_file)
    # Add Scores data to Stats table by creating new columns for each score
    if not column_exists(cur, "Stats", "off_score_1"):
        cur.execute("ALTER TABLE Stats ADD COLUMN off_score_1 REAL;")
    if not column_exists(cur, "Stats", "off_score_2"):
        cur.execute("ALTER TABLE Stats ADD COLUMN off_score_2 REAL;")
    if not column_exists(cur, "Stats", "off_score_3"):
        cur.execute("ALTER TABLE Stats ADD COLUMN off_score_3 REAL;")
    if not column_exists(cur, "Stats", "def_score"):
        cur.execute("ALTER TABLE Stats ADD COLUMN def_score REAL;")
    if not column_exists(cur, "Stats", "reb_score"):
        cur.execute("ALTER TABLE Stats ADD COLUMN reb_score REAL;")
    if not column_exists(cur, "Stats", "player_name"):
        cur.execute("ALTER TABLE Stats ADD COLUMN player_name TEXT;")

    # Insert data from df into the Scores table
    for index, row in tqdm(scores.iterrows()):
        player_name = row['player_name'].replace("'", "''")
        season = row['season'].replace("'", "''")
        pid = cur.execute(f"SELECT player_id FROM Player WHERE name = '{player_name}'").fetchone()
        if pid is not None:
            pid = pid[0]
            # Sanity check: give warning if query player_id = {pid} AND season = '{season}' returns more than one row
            if cur.execute(f"SELECT COUNT(*) FROM Stats WHERE player_id = {pid} AND season = '{season}';").fetchone()[0] > 1:
                print(f"Player {player_name} has multiple entries for season {season}")
            cur.execute(f"UPDATE Stats SET player_name = '{player_name}', off_score_1 = {row['off_score_1']}, off_score_2 = {row['off_score_2']}, \
                        off_score_3 = {row['off_score_3']}, def_score = {row['def_score']}, \
                        reb_score = {row['reb_score']} WHERE player_id = {pid} AND season = '{season}';")
        else:
            print(f"Player {player_name} not found in the database")
            continue


def column_exists(cursor, table_name, column_name):
    cursor.execute(f"PRAGMA table_info({table_name})")
    columns = [row[1] for row in cursor.fetchall()]
    return column_name in columns


if __name__ == "__main__":
    # file = "data_aggregated.csv"
    scores_file = (
        Path(__file__).resolve().parents[2]
        / "ml-models"
        / "reports"
        / "player_scores.csv"
    )
    scores = pd.read_csv(scores_file)
    # df = load_data(file)
    # Connect to the database
    data_path = os.environ.get("DATA_PATH")
    if data_path:   # You are in deployment (this variable is crated only in the helm chart, not in the docker)
        data_path = os.environ["DATA_PATH"]
    else: #You are in local, use local path
         print("Local environment")
         os.environ["DATA_PATH"] = "./"

    con = sqlite3.connect(os.path.join(os.environ["DATA_PATH"], "Players.db"))
    # create_tables(con, df)
    # insert_data(con, df)
    insert_scores_data(con, str(scores_file))
    con.commit()
    con.close()
