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
    if not column_exists(cur, "Scores", "player_name"):
        cur.execute("ALTER TABLE Scores ADD COLUMN player_name TEXT;")
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
        player_name = row['player_name'].replace("'", "''")
        season = row['season'].replace("'", "''")
        pid = cur.execute(f"SELECT player_id FROM Player WHERE name = '{player_name}'").fetchone()
        if pid is not None:
            pid = pid[0]
            cur.execute(f"INSERT INTO Scores (player_id, season) VALUES ({pid}, '{season}');")
            cur.execute(f"UPDATE Scores SET off_score_1 = {row['off_score_1']}, off_score_2 = {row['off_score_2']}, \
                        player_name = '{player_name}', off_score_3 = {row['off_score_3']}, def_score = {row['def_score']}, \
                        reb_score = {row['reb_score']} WHERE player_id = {pid} AND season = '{season}';")
        else:
            print(f"Player {player_name} not found in the database")
            continue
    # Update database such that entries are sorted after pid and season
    cur.execute("CREATE TABLE Scores_temp AS SELECT * FROM Scores ORDER BY player_id, season;")
    cur.execute("DROP TABLE Scores;")
    cur.execute("ALTER TABLE Scores_temp RENAME TO Scores;")


if __name__ == "__main__":
    # Connect to the database
    data_path = os.environ.get("DATA_PATH")
    if data_path:   # You are in deployment (this variable is crated only in the helm chart, not in the docker)
        data_path = os.environ["DATA_PATH"]
    else: #You are in local, use local path
         print("Local environment")
         os.environ["DATA_PATH"] = "./"

    # Load the data
    scores = pd.read_csv("player_scores.csv")
    con = sqlite3.connect(os.path.join(os.environ["DATA_PATH"], "Players.db"))
    create_scores_table(con, scores)
    con.commit()
    con.close()