#encoding=utf-8
import web
import requests
from datetime import datetime
from config import setting
from model import user
from util import login
import json

config = setting.config
render = setting.render
db = setting.db

def common_check(post=[],get=[]):
    """ 检查登录与否及参数 """
    post_data = web.input(_method="post")
    get_data = web.input(_method="get")
    user = login.logged()
    if not user:
        raise Exception(json.dumps({"code":403,"msg":"access deny"}))

    for k in post:
        if not k in post_data:
            raise Exception(json.dumps({"code":500,"msg":str(k)+" is required"}))

    for k in get:
        if not k in get_data:
            raise Exception(json.dumps({"code":500,"msg":str(k)+" is required"}))

    return {"post":post_data,"get":get_data,"user":user}


class add:
    def POST(self):
        """ add one """
        try:
            ctx = common_check(post=["content"])
        except Exception, e:
            return e

        content = ctx["post"]["content"]
        userid = ctx["user"]["id"]
        pieces = db.select("piece",where="content=$content",vars={"content":content})
        if pieces:
            piece = pieces[0];
            favrow = db.select("fav",where="pieceid=$pieceid and userid=$userid",vars={"pieceid":piece["id"],"userid":userid})
            if not favrow:
                db.insert("fav",pieceid=piece["id"],userid=userid)
            return json.dumps({"code":300,"msg":{"id":piece["id"]}})

        pieceid = db.insert("piece",content=content,user=userid,addtime=datetime.now(),link=None)
        return json.dumps({"code":200,"msg":{"id":pieceid}})

class fav:
    def POST(self):
        """ fav a piece """
        try:
            ctx = common_check(post=["pieceid"])
        except Exception, e:
            return e

        pieceid=ctx["post"]["pieceid"]
        row = db.select("fav",where="pieceid=$pieceid and userid=$userid",vars={"pieceid":pieceid,"userid":ctx["user"]["id"]})
        if row:
            return json.dumps({"code":300,"msg":"you've already fav this piece"})


        db.insert("fav",pieceid=pieceid,userid=ctx["user"]["id"])
        return json.dumps({"code":200,"msg":"ok"})

class unfav:
    def POST(self):
        """ fav a piece """
        try:
            ctx = common_check(post=["pieceid"])
        except Exception, e:
            return e

        pieceid=ctx["post"]["pieceid"]
        where={"pieceid":pieceid,"userid":ctx["user"]["id"]}
        row = db.select("fav",where="pieceid=$pieceid and userid=$userid",vars=where)
        if not row:
            return json.dumps({"code":300,"msg":"you've not faved this piece"})


        db.delete("fav",where="pieceid=$pieceid and userid=$userid",vars=where)
        return json.dumps({"code":200,"msg":"ok"})

class pieces:
    def GET(self):
        "get pieces"
        pieces_itr = db.select('piece',what="id,content",offset=0,limit=10)
        pieces=[]
        for piece in pieces_itr:
            pieces.append(piece)
        return json.dumps(pieces)