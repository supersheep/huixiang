#encoding=utf-8
import web
import config.routes

app = web.application(config.routes.urls,globals())
application = app.wsgifunc()