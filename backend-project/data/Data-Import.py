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
            .replace(" ", "_")


def load_data() -> tuple[pd.DataFrame, [str]]:
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
    percentage_cols.append("usage-percentage")
    df = df.drop(columns=percentage_cols)

    # Remove percentage sign so the data can be stored as an int into the database
    percentages = [col for col in df.columns if ('%' in col) or ("percentage" in col)]
    for p in percentages:
        df[p] = df[p].str.replace("%", "")

    return df, percentages


def create_tables(con: sqlite3.Connection, df: pd.DataFrame, percentages: [str]):
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


if __name__ == "__main__":
    df, p = load_data()
    con = sqlite3.connect("Players.db")
    create_tables(con, df, p)
    insert_data(con, df)
    con.commit()
    con.close()
