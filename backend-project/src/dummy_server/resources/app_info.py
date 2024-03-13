import os
import sys
import psutil
import json

class Environment(Resource):

    def get(self):
        dict(psutil.virtual_memory()._asdict())
        appInfo = {
            "job-id": os.environ['JOB_ID'],
            "commit-id": os.environ['COMMIT_ID'],
            "python": sys.version,
            "cpus": os-cpu_count(),
            "memory-total": psutil.virtual_memory().total,
            "memory-used": psutil.virtual_memory().used
        }
        return json.dumps(appInfo)