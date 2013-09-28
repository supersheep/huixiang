#encoding=utf-8
import web
import config.routes

app = web.application(config.routes.urls,globals())

if __name__ == "__main__":
    app.run()
else:
    application = app.wsgifunc()
