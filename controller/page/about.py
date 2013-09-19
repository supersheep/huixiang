# /about
from base import base
from config.setting import render

class about(base):
    def GET(self):
        return render.about()