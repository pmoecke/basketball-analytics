import os
import sys
import psutil

from flask_restful import Resource, reqparse

parser = reqparse.RequestParser()
parser.add_argument("player_ids", type=int,
                    help="Coma seperated list of player ids")
parser.add_argument("team_ids", type=int,
                    help="Coma seperated list of team ids")
parser.add_argument("league_ids", type=int,
                    help="Coma seperated list of league ids")

# TODO: remove
class Environment(Resource):

    def get(self):
        dict(psutil.virtual_memory()._asdict())
        appInfo = {
            "job-id": os.environ['JOB_ID'],
            "commit-id": os.environ['COMMIT_ID'],
            "python": sys.version,
            "cpus": os.cpu_count(),
            "memory-total": psutil.virtual_memory().total,
            "memory-used": psutil.virtual_memory().used
        }
        return appInfo


class Players(Resource):
    def get(self):
        print(parser.parse_args())
        return None
