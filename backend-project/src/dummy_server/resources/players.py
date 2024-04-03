from flask import request, abort
from flask_restful import Resource
from marshmallow import Schema, fields
import os
import sqlite3


class PlayerQuerySchema(Schema):
    player_ids = fields.List(fields.Int(), required=False)
    team_ids = fields.List(fields.Int(), required=False)
    league_ids = fields.List(fields.Int(), required=False)

    # @validates_schema
    # def require_one(self, data, **kwargs):
    #     if "player_ids" in data or "league_ids" in data or "team_ids" in data:
    #         return
    #     raise ValidationError("At least one type of id must be provided")


schema = PlayerQuerySchema()


class Players(Resource):
    def get(self):
        print(os.path.join(os.environ["DATA_PATH"], "Data", "Players.db"))
        con = sqlite3.connect(os.path.join(os.environ["DATA_PATH"], "Data", "Players.db"))
        cur = con.cursor()
        # Validate arguments
        err = schema.validate(request.args.to_dict(flat=False))
        if err:
            abort(400, str(err))
        args = schema.dump(request.args.to_dict(flat=False))

        # Fetch data from database
        query = "SELECT s.*, p.name as 'Player name', t.name as 'Team name', l.name as 'League' from Stats s " + \
                "INNER JOIN Player p ON p.p_id = s.player_id " + \
                "INNER JOIN League l ON l.l_id = s.league_id " + \
                "INNER JOIN Team t ON t.t_id = s.team_id WHERE 1 = 1 "

        if "player_ids" in args:
            query += f"AND p.p_id in ({', '.join([str(id) for id in args['player_ids']])}) "
        if "league_ids" in args:
            query += f"AND l.l_id in ({', '.join([str(id) for id in args['league_ids']])}) "
        if "team_ids" in args:
            query += f"AND t.t_id in ({', '.join([str(id) for id in args['team_ids']])}) "

        query += ";"
        cur.execute(query)
        zipped = [zip(cur.description, row) for row in cur.fetchall()]
        res = [{col: value for (col, *_), value in row} for row in zipped]
        return res
