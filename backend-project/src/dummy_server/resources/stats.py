from flask import request, abort
from flask_restful import Resource
from marshmallow import Schema, fields
import os
import sqlite3


class StatsQuerySchema(Schema):
    player_id = fields.List(fields.Int(), required=False)
    team_id = fields.List(fields.Int(), required=False)
    league_id = fields.List(fields.Int(), required=False)
    point_min = fields.Int(required=False)
    point_max = fields.Int(required=False)


schema = StatsQuerySchema()


class Stats(Resource):
    def get(self):
        con = sqlite3.connect(os.path.join(os.environ["DATA_PATH"], "Players.db"))
        cur = con.cursor()
        # Validate arguments
        arg_dict = request.args.to_dict(flat=False)
        # Make sure we have lists where we need lists and single elements
        # otherwise
        if "point_min" in arg_dict:
            arg_dict["point_min"] = arg_dict["point_min"][0]
        if "point_max" in arg_dict:
            arg_dict["point_max"] = arg_dict["point_max"][0]
        err = schema.validate(arg_dict)
        if err:
            abort(400, str(err))
        args = schema.dump(arg_dict)

        # Fetch data from database
        query = "SELECT s.*, p.name as 'player-name', t.name as 'team-name', l.name as 'league' from Stats s " + \
                "INNER JOIN Player p ON p.player_id = s.player_id " + \
                "INNER JOIN League l ON l.league_id = s.league_id " + \
                "INNER JOIN Team t ON t.team_id = s.team_id WHERE 1 = 1 "

        params = {}
        if "player_id" in args:
            query += "AND p.player_id in (:pids) "
            params["pids"] = ', '.join([str(id) for id in args['player_id']])
        if "league_id" in args:
            query += "AND l.league_id in (:lids) "
            params["lids"] = ', '.join([str(id) for id in args['league_id']])
        if "point_min" in args:
            query += "AND points >= :point_min "
            params["point_min"] = args["point_min"]
        if "point_max" in args:
            query += "AND points <= :point_max "
            params["point_max"] = args["point_max"]
        if "team_id" in args:
            query += "AND t.team_id in (:tids) "
            params["tids"] = ', '.join([str(id) for id in args['team_id']])

        query += ";"
        print(query)
        cur.execute(query, params)
        zipped = [zip(cur.description, row) for row in cur.fetchall()]
        res = [{col: value for (col, *_), value in row} for row in zipped]
        return res
