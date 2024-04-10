from flask import request, abort
from flask_restful import Resource
from marshmallow import Schema, fields
import os
import sqlite3

class TeamQuerySchema(Schema):
    player_id = fields.Int(required=False)
    league_id = fields.Int(required=False)
    season = fields.String(required=False)


schema = TeamQuerySchema()


class Teams(Resource):
    def get(self):
        con = sqlite3.connect(os.path.join(os.environ["DATA_PATH"], "Players.db"))
        cur = con.cursor()

        # Validate arguments
        err = schema.validate(request.args.to_dict(flat=False))
        if err:
            abort(400, str(err))
        args = schema.dump(request.args.to_dict(flat=False))

        # TODO: actually use given parameters to filter data from db

        # Fetch data from database
        query = "SELECT * FROM Team;"
        cur.execute(query)
        zipped = [zip(cur.description, row) for row in cur.fetchall()]
        res = [{col: value for (col, *_), value in row} for row in zipped]
        return res
