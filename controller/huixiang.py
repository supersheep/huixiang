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

class add:
    def POST(self):
        """ add one """

        ret = {}
        if login.logged():
            data = web.input(_method="post")
            id = db.insert("piece",content=data["content"],addtime=datetime.now(),link=None)
            ret["code"] = 200
            ret["msg"] = {"id":id}
        else:
            ret["code"] = 403
            ret["msg"] = "access deny"
        return json.dumps(ret)

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
            return "logged"
        else:
            return "wrong"