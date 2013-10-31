# /app
from base import base
from config.setting import render

class app(base):
    def GET(self):
        return render.app()