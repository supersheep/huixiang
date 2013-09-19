from config.setting import render
from base import base
class tools(base):
    def GET(self):
        return render.tools()