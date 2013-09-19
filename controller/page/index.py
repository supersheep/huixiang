# /
from config.setting import render
from base import base

class index(base):
    def GET(self):
        """ app index """
        super(index,self).GET()
        return render.index()