#encoding=utf-8
import web
from config.routes import urls

app = web.application(urls,globals())
application = app.wsgifunc()