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
        err = schema.validate(arg_dict)
        if err:
            abort(400, str(err))
        args = schema.dump(arg_dict)

        # Read data and make column headers consistent
        df = pd.read_csv(os.path.join(os.environ["DATA_PATH"],
                                      "train_data_yeo_new.csv"))
        df = df.rename(columns={col: col.replace("-", " ").replace(",", "")
                                for col in df.columns})

        # Filter by player_id, gotta fetch the names from the database
        # as the dataframe only includes names
        con = sqlite3.connect(os.path.join(os.environ["DATA_PATH"],
                                           "Players.db"))
        cur = con.cursor()
        # In case we're provided with player_ids from the frontend
        if "player_id" in args and -1 not in args["player_id"]:
            cur.execute(f"SELECT name FROM Player WHERE player_id in ({
                ", ".join(["?" for _ in range(len(args["player_id"]))])});",
                        args["player_id"])

            names = [name for name, *_ in cur.fetchall()]
            df = df[df["player name"].isin(names)]
        else:  # Else get the id's using the names in the df
            cur.execute(f"SELECT player_id FROM Player WHERE name in ({
                ", ".join(["?" for _ in range(len(df))])}) ORDER BY name;",
                        df["player name"])
            args["player_id"] = [idx for idx, *_ in cur.fetchall()]
        con.close()

        # Ensure we don't get an error when performing tSNE
        if len(args["player_id"]) < 10:
            abort(400, "Must include at least 10 players in the projection")
        if len(args["col"]) < 2:
            abort(400, "Must choose at least 2 features to project on")

        # Choose the subset of columns provided
        df = df[[convert_name(c) for c in args["col"]]]
        proj = pd.DataFrame(TSNE(perplexity=min(len(args["player_id"])-1, 30))
                            .fit_transform(df)).rename({0: "x", 1: "y"},
                                                       axis="columns")
        # Use player_id as the index
        proj.insert(0, "player_id", args["player_id"])
        proj.set_index("player_id", inplace=True)

        return proj.to_json()
