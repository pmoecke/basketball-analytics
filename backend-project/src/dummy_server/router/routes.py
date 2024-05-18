from flask_restful import Api
import dummy_server.resources as res

API = "/api/"  # optional string


def add_routes(app):
    api = Api(app)
    api.add_resource(res.stats_old.StatsOld, API + "stats-old/")
    api.add_resource(res.overview_stats.OverviewStats, API + "overview-stats/")
    api.add_resource(res.stats.Stats, API + "stats/")
    api.add_resource(res.players.Players, API + "players/")
    api.add_resource(res.leagues.Leagues, API + "leagues/")
    api.add_resource(res.teams.Teams, API + "teams/")
    api.add_resource(res.projection.Projection, API + "projection/")

    return api
