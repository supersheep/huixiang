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

class index:
    def GET(self):
        """ app index """
        data = {}
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