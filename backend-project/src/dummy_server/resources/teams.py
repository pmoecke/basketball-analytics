from flask import request, abort
from flask_restful import Resource
from marshmallow import Schema, fields
import os
import sqlite3


class TeamQuerySchema(Schema):
    player_id = fields.Int(required=False)
    league_id = fields.Int(required=False)
    season = fields.String(required=False)
    team_name = fields.String(required=False)


schema = TeamQuerySchema()


class Teams(Resource):
    def get(self):
        # Validate arguments
        print(schema.dump(request.args.to_dict()))
        err = schema.validate(request.args.to_dict())
        if err:
            abort(400, str(err))
        args = schema.dump(request.args.to_dict())

        con = sqlite3.connect(os.path.join(os.environ["DATA_PATH"], "Players.db"))
        cur = con.cursor()

        # Fetch data from database
        query = "SELECT DISTINCT(t.team_id), t.name FROM Team t " + \
                "INNER JOIN Stats s on s.team_id = t.team_id " + \
                "WHERE 1 = 1 "

        if "player_id" in args:
            query += "AND s.player_id = :player_id "
        if "league_id" in args:
            query += "AND s.league_id = :league_id "
        if "season" in args:
            query += "AND s.season = :season "
        if "team_name" in args:
            query += "AND t.name LIKE :team_name "
            args["team_name"] = "%" + args["team_name"] + "%"

        query += "ORDER BY t.name;"
        print(query, args)
        cur.execute(query, args)

        zipped = [zip(cur.description, row) for row in cur.fetchall()]
        res = [{col: value for (col, *_), value in row} for row in zipped]
        return res
