from flask import request, abort 
from flask_restful import Resource 
from marshmallow import Schema, fields 
import os 
import sqlite3


class ScoresQuerySchema(Schema):
    player_id = fields.List(fields.Int(), required=False)
    season = fields.String(required=False)
    player_name = fields.String(required=False)

schema = ScoresQuerySchema()

class Scores(Resource):
    def get(self):
        con = sqlite3.connect(os.path.join(os.environ["DATA_PATH"], "Players.db"))
        cur = con.cursor()
        # Validate arguments
        arg_dict = request.args.to_dict(flat=False)
        err = schema.validate(arg_dict)
        if err:
            abort(400, str(err))
        args = schema.dump(arg_dict)

        query = "SELECT * FROM Scores;"
        if "player_name" in args:
            query += "AND name LIKE :player_name "
            args["player_name"] = "%" + args["player_name"] + "%"
        query += ";"

        print(query, args)
        cur.execute(query)

        zipped = [zip(cur.description, row) for row in cur.fetchall()]
        res = [{col: value for (col, *_), value in row} for row in zipped]
        return res