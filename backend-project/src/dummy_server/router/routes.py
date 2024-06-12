from flask_restful import Api
import dummy_server.resources as res

API = "/api/"  # optional string


def add_routes(app):
    api = Api(app)
    api.add_resource(res.overview_stats.OverviewStats, API + "overview-stats/")
    api.add_resource(res.stats.Stats, API + "stats/")
    api.add_resource(res.players.Players, API + "players/")
    api.add_resource(res.projection.Projection, API + "projection/")

    return api
