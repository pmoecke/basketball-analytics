from sklearn.manifold import TSNE
from flask import request, abort
from flask_restful import Resource
import os
import sqlite3
from .definitions import ProjQuerySchema
import pandas as pd

schema = ProjQuerySchema()


def convert_name(name: str) -> str:
    return name.replace("pct", "%").replace("-", " ")


class Projection(Resource):
    def get(self):
        # Validate arguments
        arg_dict = request.args.to_dict(flat=False)
        # Gotta make sure that we don't get a list for arguments that only
        # take single values
        if "projection" in arg_dict:
            arg_dict["projection"] = arg_dict["projection"][0]
        err = schema.validate(arg_dict)
        if err:
            abort(400, str(err))
        args = schema.dump(arg_dict)
        if "projection" not in args and "col" not in args:
            abort(400, "Must provide either a list of columns to project on "
                       "or a predefined projection")

        con = sqlite3.connect(os.path.join(os.environ["DATA_PATH"],
                                           "Players.db"))
        cur = con.cursor()

        # A precomputed projection is requested
        if "projection" in args:
            query = f"""
                SELECT player_id, {"x_" + args["projection"]} as x,
                {"y_" + args["projection"]} as y
                FROM Player
                WHERE 1 = 1
            """

            # Filtering based on player ids
            if "player_id" in args and -1 not in args["player_id"]:
                query += f"AND player_id in ({','.join('?'*len(args['player_id']))});"
                cur.execute(query, args["player_id"])
            else:
                query += ";"
                cur.execute(query)
            result = [dict(zip([col[0] for col in cur.description], row)) for
                      row in cur.fetchall()]
            con.close()
            return result

        # A user-defined projection is requested
        # Read data and make column headers consistent
        df = pd.read_csv(os.path.join(os.environ["DATA_PATH"],
                                      "train_data_yeo_new.csv"))
        df = df.rename(columns={col: col.replace("-", " ").replace(",", "")
                                for col in df.columns})

        # Get all the player_ids corresponding to the players from the database
        df.sort_values(by=["player name"], inplace=True)
        player_names = df["player name"].tolist()
        # Construct the SQL query with placeholders for parameterized query
        query = f"SELECT player_id FROM Player WHERE name IN ({', '.join(['?' for _ in player_names])}) ORDER BY name;"
        # Execute the query with the list of player names as parameters
        cur.execute(query, player_names)
        player_ids = [idx for idx, *_ in cur.fetchall()]
        # If no player_id's are provided, use all of them
        if "player_id" not in args or -1 in args["player_id"]:
            args["player_id"] = player_ids
        con.close()

        # Using only a single column is not sensible
        if len(args["col"]) < 2:
            abort(400, "Must choose at least 2 features to project on")

        # Choose the subset of columns provided and project
        df = df[[convert_name(c) for c in args["col"]]]
        proj = pd.DataFrame(TSNE().fit_transform(df)).rename({0: "x", 1: "y"},
                                                             axis="columns")
        # Use player_id as the index
        proj.insert(0, "player_id", player_ids)
        proj.set_index("player_id", inplace=True)
        proj = proj.loc[args["player_id"]]
        proj.reset_index(inplace=True)
        proj.sort_values(by=["player_id"], inplace=True)
        return [row.to_dict() for _, row in proj.iterrows()]
