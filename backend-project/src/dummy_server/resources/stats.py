from flask import request, abort
from flask_restful import Resource
from marshmallow import Schema, fields
import os
import sqlite3

class StatsQuerySchema(Schema):
    player_id = fields.List(fields.Int(), required=False)

schema = StatsQuerySchema()

class Stats(Resource):
    def get(self):
        con = sqlite3.connect(os.path.join(os.environ["DATA_PATH"], "Players.db"))
        cur = con.cursor()
        # Validate arguments
        arg_dict = request.args.to_dict(flat=False)
        err = schema.validate(arg_dict)
        if err:
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

        params = {}
        if "player_id" in args and -1 not in args["player_id"]:
            query += f"AND p.player_id in ({','.join('?'*len(args['player_id']))}) "

        query += ";"
        print(query, args["player_id"])
        cur.execute(query, args["player_id"])
        result = [dict(zip([col[0] for col in cur.description], row)) for row
                  in cur.fetchall()]
        con.close()
        return result
