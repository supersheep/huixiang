import web
from config import setting
from datetime import datetime
import json

render = setting.render
db = setting.db

class add:
    def POST(self):
        """ add one """
        return render.add()

    def GET(self):
        """ get nothing """
        return "hello"

class index:
    def GET(self):
        piecesitr = db.select('piece',what="id,content",offset=0,limit=10)
        pieces=[]
        for piece in piecesitr:
            pieces.append(piece)
        jsdata = {"pieces":json.dumps(pieces)}
        data = {"jsdata":jsdata}
        return render.index(data)

class piece:
    def GET():
        return render.piece()
