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

        id = db.insert("piece",content=ctx["post"]["content"],addtime=datetime.now(),link=None)
        ret["code"] = 200
        ret["msg"] = {"id":id}
        return json.dumps(ret)

class fav:
    def POST(self):
        """ fav a piece """
        try:
            ctx = common_check(post=["pieceid"])
        except Exception, e:
            return e

        pieceid=ctx["post"]["pieceid"]
        row = db.select("fav",where="pieceid=$pieceid",vars={"pieceid":pieceid})
        if row:
            return json.dumps({"code":500,"msg":"you've already fav this piece"})


        db.insert("fav",pieceid=pieceid,userid=ctx["user"]["id"])
        return json.dumps({"code":200,"msg":"ok"})

class index:
    def GET(self):
        """ app index """
        piecesitr = db.select('piece',what="id,content",offset=0,limit=10)
        pieces=[]
        for piece in piecesitr:
            pieces.append(piece)
        jsdata = {"pieces":json.dumps(pieces)}
        data = {"jsdata":jsdata}

        cur_user = login.logged()
        if cur_user:
            data["user"]=cur_user
        return render.index(data)

class piece:
    def GET(self):
        return render.piece()

class logout:
    def GET(self):
        login.logout()
        web.seeother("/")

class auth:
    def GET(self,name):
        input = web.input()
        if "code" in input:
            data = {
                "client_id":config["auth"]["douban"]["key"],
                "client_secret":config["auth"]["douban"]["secret"],
                "redirect_uri":config["auth"]["douban"]["callback"],
                "grant_type":"authorization_code",
                "code":input["code"]
            }
            res_access_token = requests.post("https://www.douban.com/service/auth2/token",data=data)
            res_json = res_access_token.json()
            if "code" in res_json:
                return res_json["msg"]
            access_token = res_json["access_token"]
            res_user_info = requests.get("https://api.douban.com/v2/user/~me",headers={"Authorization":"Bearer "+access_token})
            user_info = res_user_info.json()
            user_info["access_token"] = access_token
            if not user.exist_douban_user(user_info):
                user.new_douban_user(user_info)
            user.login_douban_user(user_info)
            return render.logged(True)
        else:
            return render.logged(input)