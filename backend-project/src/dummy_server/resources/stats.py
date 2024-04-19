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
        
        args = {key.rstrip('[]'): request.args.getlist(key) for key in request.args.keys()}
        
        errors = schema.validate(args)
        if errors:
            abort(400, str(errors))
        
        validated_args = schema.dump(args)

        query = """
            SELECT s.*, p.name as 'player-name', t.name as 'team-name', l.name as 'league'
            FROM Stats s
            INNER JOIN Player p ON p.player_id = s.player_id
            INNER JOIN League l ON l.league_id = s.league_id
            INNER JOIN Team t ON t.team_id = s.team_id
            WHERE 1 = 1
        """
        
        params = []
        if "player_id" in validated_args:
            placeholders = ', '.join(['?'] * len(validated_args['player_id']))
            query += f" AND p.player_id IN ({placeholders})"
            params.extend(validated_args['player_id'])

        if "league_id" in validated_args:
            placeholders = ', '.join(['?'] * len(validated_args['league_id']))
            query += f" AND l.league_id IN ({placeholders})"
            params.extend(validated_args['league_id'])

        if "team_id" in validated_args:
            placeholders = ', '.join(['?'] * len(validated_args['team_id']))
            query += f" AND t.team_id IN ({placeholders})"
            params.extend(validated_args['team_id'])

        if "point_min" in validated_args:
            query += " AND points >= ?"
            params.append(validated_args['point_min'])

        if "point_max" in validated_args:
            query += " AND points <= ?"
            params.append(validated_args['point_max'])

        cur.execute(query, params)
        result = [dict(zip([col[0] for col in cur.description], row)) for row in cur.fetchall()]
        con.close()
        return result
