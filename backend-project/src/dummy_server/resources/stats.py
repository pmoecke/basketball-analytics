from flask import request, abort
from flask_restful import Resource
from marshmallow import Schema, fields
import os
import sqlite3


class StatsQuerySchema(Schema):
    player_ids = fields.List(fields.Int(), required=False)
    team_ids = fields.List(fields.Int(), required=False)
    league_ids = fields.List(fields.Int(), required=False)


schema = StatsQuerySchema()


class Stats(Resource):
    def get(self):
        con = sqlite3.connect(os.path.join(os.environ["DATA_PATH"], "Players.db"))
        cur = con.cursor()
        # Validate arguments
        err = schema.validate(request.args.to_dict(flat=False))
        if err:
            abort(400, str(err))
        args = schema.dump(request.args.to_dict(flat=False))

        # Fetch data from database
        query = "SELECT s.*, p.name as 'player-name', t.name as 'team-name', l.name as 'league' from Stats s " + \
                "INNER JOIN Player p ON p.player_id = s.player_id " + \
                "INNER JOIN League l ON l.league_id = s.league_id " + \
                "INNER JOIN Team t ON t.team_id = s.team_id WHERE 1 = 1 "

        params = {}
        if "player_ids" in args:
            query += "AND p.player_id in (:pids) "
            params["pids"] = ', '.join([str(id) for id in args['player_ids']])
        if "league_ids" in args:
            query += "AND l.league_id in (:lids) "
            params["lids"] = ', '.join([str(id) for id in args['league_ids']])
        if "team_ids" in args:
            query += "AND t.team_id in (:tids) "
            params["tids"] = ', '.join([str(id) for id in args['team_ids']])

        query += ";"
        print(query)
        cur.execute(query, params)
        zipped = [zip(cur.description, row) for row in cur.fetchall()]
        res = [{col: value for (col, *_), value in row} for row in zipped]
        return res
