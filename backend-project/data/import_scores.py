import pandas as pd
import sqlite3
import os
from tqdm import tqdm

def column_exists(cursor, table_name, column_name):
    cursor.execute(f"PRAGMA table_info({table_name})")
    columns = [row[1] for row in cursor.fetchall()]
    return column_name in columns

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

if __name__ == "__main__":
    # Load the data
    scores = pd.read_csv("data/scores.csv")
    # Connect to the database
    con = sqlite3.connect(os.path.join(os.environ["DATA_PATH"], "Players.db"))
    create_scores_table(con, scores)
    con.commit()
    con.close()