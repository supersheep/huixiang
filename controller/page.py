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

class base:
    def __init__(self):
        cur_user = login.logged()
        self.cur_user = None
        if cur_user:
            self.cur_user = cur_user
            web.template.Template.globals['user'] = cur_user



class index(base):
    def GET(self):
        """ app index """
        return render.index()

class piece(base):
    def GET(self,id):
        """ piece """
        pieces = db.select("piece",where="id=$id",vars={"id":id})
        if not pieces:
            return web.notfound("oops")

        piece = pieces[0]

        favs = db.select(["fav","user"], where="fav.userid=user.id and fav.pieceid=$id",vars={"id":id}, limit=5)
        
        liked = False
        where = {"id":id,"userid":self.cur_user.id}
        if self.cur_user and db.select("fav",where="fav.userid=$userid and pieceid=$id",vars=where):
            liked = True
        return render.piece(piece,favs,liked)

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