from flask import request, abort
from flask_restful import Resource
from marshmallow import Schema, fields
import os
import sqlite3


class PlayerQuerySchema(Schema):
    player_name = fields.String(required=False)


schema = PlayerQuerySchema()


class Players(Resource):
    def get(self):
        con = sqlite3.connect(os.path.join(os.environ["DATA_PATH"], "Players.db"))
        cur = con.cursor()
        # Validate arguments
        err = schema.validate(request.args.to_dict())
        if err:
            abort(400, str(err))
        args = schema.dump(request.args.to_dict())
        print(args)

        # Fetch data from database
        query = "SELECT * FROM Player WHERE 1=1 "

        if "player_name" in args:
            query += "AND name LIKE :player_name "
            args["player_name"] = "%" + args["player_name"] + "%"

        query += ";"
        print(query, args)
        cur.execute(query, args)
        zipped = [zip(cur.description, row) for row in cur.fetchall()]
        res = [{col: value for (col, *_), value in row} for row in zipped]
        return res
