from flask import request, abort
from flask_restful import Resource
from marshmallow import Schema, fields, validate
import os
import sqlite3

PROJECTIONS = ["boxscore", "advanced_boxscore", "additional_field_goal_data",
               "play_type_combinations",
               "defense_against_play_type_combinations",
               "drivers", "drivers_defense"]


class ProjQuerySchema(Schema):
    player_id = fields.List(fields.Int(), required=False)
    projections = fields.List(fields.String(
        validate=validate.OneOf(PROJECTIONS)), required=False)


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

        if "projections" not in args:
            args["projections"] = PROJECTIONS

        query = f"""
            SELECT player_id, {", ".join([axis + p for p in args["projections"] for axis in ["x_", "y_"]])}
            FROM Player 
            WHERE 1 = 1 
        """

        if "player_id" in args and -1 not in args["player_id"]:
            query += f"AND player_id in ({','.join('?'*len(args['player_id']))}) "

        query += ";"
        print(query, args["player_id"])
        cur.execute(query, args["player_id"])
        result = [dict(zip([col[0] for col in cur.description], row)) for row
                  in cur.fetchall()]
        con.close()
        return result
