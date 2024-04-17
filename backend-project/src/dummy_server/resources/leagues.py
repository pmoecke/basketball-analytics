from flask_restful import Resource
import os
import sqlite3


class Leagues(Resource):
    def get(self):
        con = sqlite3.connect(os.path.join(os.environ["DATA_PATH"], "Players.db"))
        cur = con.cursor()

        # Fetch data from database
        query = "SELECT * FROM League;"
        cur.execute(query)
        zipped = [zip(cur.description, row) for row in cur.fetchall()]
        res = [{col: value for (col, *_), value in row} for row in zipped]
        return res
