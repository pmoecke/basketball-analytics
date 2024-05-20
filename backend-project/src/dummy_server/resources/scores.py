from flask import request, abort 
from flask_restful import Resource 
from marshmallow import Schema, fields 
import os 
import sqlite3

class ScoresQuerySchema(Schema):
    # player_id = fields.List(fields.Int(), required=False)
    player_id = fields.Integer(required=False)
    season = fields.String(required=False)
    player_name = fields.String(required=False)
    min_def_score = fields.Float(required=False)
    max_def_score = fields.Float(required=False)
    min_off_score_1 = fields.Float(required=False)
    max_off_score_1 = fields.Float(required=False)
    min_off_score_2 = fields.Float(required=False)
    max_off_score_2 = fields.Float(required=False)
    min_off_score_3 = fields.Float(required=False)
    max_off_score_3 = fields.Float(required=False)
    min_reb_score = fields.Float(required=False)
    max_reb_score = fields.Float(required=False)

schema = ScoresQuerySchema()

class Scores(Resource):
    def get(self):
        con = sqlite3.connect(os.path.join(os.environ["DATA_PATH"], "Players.db"))
        cur = con.cursor()
        
        # Validate arguments
        arg_dict = request.args.to_dict(flat=True)
        err = schema.validate(arg_dict)
        if err:
            abort(400, str(err))
        args = schema.load(arg_dict)
        
        query = "SELECT * FROM Scores"
        conditions = []
        
        if "player_name" in args:
            conditions.append("LOWER(player_name) LIKE LOWER(:player_name)")
            args["player_name"] = "%" + args["player_name"].lower() + "%"
        if "player_id" in args:
            conditions.append("player_id = :player_id")
        if "season" in args:
            conditions.append("season = :season")
        
        # Handle range filters for scores
        if "min_def_score" in args:
            conditions.append("def_score >= :min_def_score")
        if "max_def_score" in args:
            conditions.append("def_score <= :max_def_score")
        if "min_off_score_1" in args:
            conditions.append("off_score_1 >= :min_off_score_1")
        if "max_off_score_1" in args:
            conditions.append("off_score_1 <= :max_off_score_1")
        if "min_off_score_2" in args:
            conditions.append("off_score_2 >= :min_off_score_2")
        if "max_off_score_2" in args:
            conditions.append("off_score_2 <= :max_off_score_2")
        if "min_off_score_3" in args:
            conditions.append("off_score_3 >= :min_off_score_3")
        if "max_off_score_3" in args:
            conditions.append("off_score_3 <= :max_off_score_3")
        if "min_reb_score" in args:
            conditions.append("reb_score >= :min_reb_score")
        if "max_reb_score" in args:
            conditions.append("reb_score <= :max_reb_score")
        
        if conditions:
            query += " WHERE " + " AND ".join(conditions)
        
        query += ";"

        # Debug print statement to see the final query and arguments
        print("SQL Query:", query)
        print("Arguments:", args)

        cur.execute(query, args)

        zipped = [zip(cur.description, row) for row in cur.fetchall()]
        res = [{col: value for (col, *_), value in row} for row in zipped]
        return res
