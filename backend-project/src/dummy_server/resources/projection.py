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
        if "player_id" in args and -1 not in args["player_id"]:
            cur.execute(f"SELECT name FROM Player WHERE player_id in ({
                ", ".join(["?" for _ in range(len(args["player_id"]))])});",
                        args["player_id"])

            names = [name for name, *_ in cur.fetchall()]
            df = df[df["player name"].isin(names)]
        else:
            cur.execute(f"SELECT player_id FROM Player WHERE name in ({
                ", ".join(["?" for _ in range(len(df))])}) ORDER BY name;",
                        df["player name"])

            args["player_id"] = [idx for idx, *_ in cur.fetchall()]

        con.close()

        print([col for col in df.columns])
        df = df[[convert_name(c) for c in args["col"]]]
        proj = pd.DataFrame(TSNE().fit_transform(df)).rename({
                    0: "x", 1: "y"}, axis="columns")
        proj.insert(0, "player_id", args["player_id"])
        proj.set_index("player_id", inplace=True)
        # TODO: check this, what if perplexity < len(args[player_id])
        print(proj.head())
        return proj.to_json()
        # result = [dict(zip([col[0] for col in cur.description], row)) for row
        #           in cur.fetchall()]
        # return result
