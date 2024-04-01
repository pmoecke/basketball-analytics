#!/usr/bin/env python

import pandas as pd
import sqlite3
import os
import re
from tqdm import tqdm


def load_data() -> tuple[pd.DataFrame, [str]]:
    # Extract League and Season information from filename
    regex = r".+\. (.+) \- (\d{4}-\d{4}).xls$"
    frames = []
    s = 0
    for file in os.listdir("."):
        filename = os.fsdecode(file)
        m = re.match(regex, filename)
        if m is not None:
            s += 1
            xl = pd.ExcelFile(filename)
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

    # Find inconsistent rows and drop them
    grouped = df.groupby(["Player name", "Team name", "League", "Season"]).count()
    inconsistent_players = [player for player, *_ in grouped[grouped["Games played"] > 1].index]
    df = df.drop(df[df["Player name"].isin(inconsistent_players)].index)

    # Remove percentage sign so the data can be stored as an int into the database
    percentages = [col for col in df.columns if ('%' in col) or ("percentage" in col)]
    for p in percentages:
        df[p] = df[p].str.replace("%", "")

    return df, percentages


def create_tables(con: sqlite3.Connection, df: pd.DataFrame, percentages: [str]):
    con.execute("DROP TABLE IF EXISTS Player;")
    con.execute("DROP TABLE IF EXISTS League;")
    con.execute("DROP TABLE IF EXISTS Team;")
    con.execute("DROP TABLE IF EXISTS Stats;")
    con.execute("CREATE TABLE Player (p_id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT);")
    con.execute("CREATE TABLE League (l_id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT);")
    con.execute("CREATE TABLE Team (t_id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT);")
    # Associate each non-real column with a datatype
    non_real_columns = { p: "INTEGER" for p in percentages }
    non_real_columns["Season"] = "TEXT"
    # TODO: Change dtype
    non_real_columns["Minutes"] = "TEXT"
    non_real_columns["Jersey number"] = "INTEGER"
    non_real_columns["Games played"] = "INTEGER"
    non_real_columns["Number of player's possessions"] = "INTEGER"
    non_real_columns["Team points with player"] = "INTEGER"
    non_real_columns["Offensive rating"] = "INTEGER"
    non_real_columns["Opponent possessions played"] = "INTEGER"
    non_real_columns["Opponent's points with player"] = "INTEGER"
    non_real_columns["Defensive rating"] = "INTEGER"

    # Combine real and non-real columns
    cols = [f"\"{colname}\" REAL" for colname in df.drop(columns=["League", "Player name", "Team name"]).columns if colname not in non_real_columns]
    cols += [f"\"{colname}\" {dtype}" for colname, dtype in non_real_columns.items()]

    # Create stats table with all columns and correct datatypes
    col_str = "player_id INTEGER, team_id INTEGER, league_id INTEGER, " + ", ".join(cols).replace("'s", "")
    con.execute(f"CREATE TABLE Stats ({col_str}, PRIMARY KEY (Season, player_id, team_id, league_id));")


def insert_data(con: sqlite3.Connection, df: pd.DataFrame):
    cur = con.cursor()
    # Insert team, league and player data
    teams = [f"'{name}'" for name in df["Team name"].str.replace("'", "''").unique()]
    players = [f"'{name}'" for name in df["Player name"].str.replace("'", "''").unique()]
    leagues = [f"'{name}'" for name in df["League"].str.replace("'", "''").unique()]
    cur.execute(f"INSERT INTO Player(name) VALUES({'), ('.join(players)});")
    cur.execute(f"INSERT INTO Team(name) VALUES({'), ('.join(teams)});")
    cur.execute(f"INSERT INTO League(name) VALUES({'), ('.join(leagues)});")

    # Insert stat data
    df_cols = [col.replace("'s", "") for col in df.drop(columns=["League", "Player name", "Team name", "Season", "Minutes"]).columns]
    cols = "\"player_id\", \"team_id\", \"league_id\", \"Season\", \"Minutes\", \"" + "\", \"".join(df_cols) + "\""
    for index, row in tqdm(df.iterrows()):
        player_name = row['Player name'].replace("'", "''")
        team_name = row['Team name'].replace("'", "''")
        league_name = row['League'].replace("'", "''")
        pid = cur.execute(f"select p_id from Player where name = '{player_name}'").fetchone()[0]
        tid = cur.execute(f"select t_id from Team where name = '{team_name}'").fetchone()[0]
        lid = cur.execute(f"select l_id from League where name = '{league_name}'").fetchone()[0]
        vals = [str(val) for val in row.drop(["League", "Player name", "Team name", "Season", "Minutes"]).values]
        cur.execute(f"INSERT INTO Stats ({cols}) VALUES ({pid}, {tid}, {lid}, '{row['Season']}', '{row['Minutes']}', {', '.join(vals)});")


if __name__ == "__main__":
    df, p = load_data()
    con = sqlite3.connect("Players.db")
    create_tables(con, df, p)
    insert_data(con, df)
    con.commit()
    con.close()

