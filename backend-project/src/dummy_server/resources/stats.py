from flask import request, abort
from flask_restful import Resource
from marshmallow import Schema, fields, validate
import os
import sqlite3

class StatsQuerySchema(Schema):
    player_id = fields.List(fields.Int(), required=False)
    season = fields.List(fields.String(validate=validate.Regexp(r'^\d{4}-\d{4}$')), required=False)

schema = StatsQuerySchema()

class Stats(Resource):
    def get(self):
        con = sqlite3.connect(os.path.join(os.environ["DATA_PATH"], "Players.db"))
        cur = con.cursor()
        # Validate arguments
        arg_dict = request.args.to_dict(flat=False)
        
        # Debug: Print the incoming arguments
        print("Incoming arguments:", arg_dict)
        
        err = schema.validate(arg_dict)
        
        # Debug: Print validation errors if any
        if err:
            print("Validation errors:", err)
            abort(400, str(err))
            
        args = schema.dump(arg_dict)

        query = """
            SELECT s.*, p.name as 'player_name', t.name as 'team_name', l.name as 'league'
            FROM Stats s
            INNER JOIN Player p ON p.player_id = s.player_id
            INNER JOIN League l ON l.league_id = s.league_id
            INNER JOIN Team t ON t.team_id = s.team_id
            WHERE 1 = 1
        """

        params = []

        if "player_id" in args and args["player_id"]:
            query += "AND p.player_id IN ({}) ".format(','.join('?' * len(args["player_id"])))
            params.extend(args["player_id"])

        if "season" in args and args["season"]:
            query += "AND s.season IN ({}) ".format(','.join('?' * len(args["season"])))
            params.extend(args["season"])

        query += ";"
        
        # Debug: Print the final query and parameters
        print("Executing query:", query)
        print("With parameters:", params)

        cur.execute(query, params)
        result = [dict(zip([col[0] for col in cur.description], row)) for row in cur.fetchall()]
        con.close()
        return result
