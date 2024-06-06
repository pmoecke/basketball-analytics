from flask import request, abort
from flask_restful import Resource
import os
import sqlite3
from .definitions import ProjQuerySchema
import pandas as pd

schema = ProjQuerySchema()


class Projection(Resource):
    def get(self):
        con = sqlite3.connect(os.path.join(os.environ["DATA_PATH"], "Players.db"))
        cur = con.cursor()
        # Validate arguments
        arg_dict = request.args.to_dict(flat=False)
        err = schema.validate(arg_dict)
        if err:
            abort(400, str(err))
        args = schema.dump(arg_dict)
        columns = ["player_id"] + args["projections"]

        query = f"""
            SELECT {", ".join(columns)}
            FROM Stats
            WHERE 1 = 1
        """

        if "player_id" in args and -1 not in args["player_id"]:
            query += f" AND player_id in ({','.join('?'*len(args['player_id']))}) "

        query += ";"
        print(query)
        cur.execute(query, args["player_id"])
        df = pd.DataFrame(cur.fetchall(), columns=columns).set_index("player_id")
        print(df)
        return df.to_json()
        # result = [dict(zip([col[0] for col in cur.description], row)) for row
        #           in cur.fetchall()]
        con.close()
        # return result
