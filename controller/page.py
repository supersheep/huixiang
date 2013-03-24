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

class base(object):
    def __init__(self):
        pass
    def GET(self):
        cur_user = login.logged()
        self.cur_user = None
        self.cur_user = cur_user
        web.template.Template.globals['user'] = cur_user



class index(base):
    def GET(self):
        """ app index """
        super(index,self).GET()
        return render.index()

class people(base):
    def GET(self,id):
        """ people """
        super(people,self).GET()
        favs = db.select(["fav","piece","user"],what="avatar,piece.id,piece.content,fav.addtime",where="fav.userid=user.id and fav.pieceid=piece.id and user.id=$id",vars={"id":id},limit=5)
        print 1
        mine = db.select(["piece","user"],what="piece.id,piece.content,piece.addtime",where="piece.user=user.id and user.id=$id",vars={"id":id},limit=5)
        print 2
        return render.people(favs,mine)

class piece(base):
    def GET(self,id):
        """ piece """
        super(piece,self).GET()
        pieces = db.select("piece",what="id,content",where="id=$id",vars={"id":id})
        if not pieces:
            return web.notfound("oops")

        curpiece = pieces[0]

        favs = db.select(["fav","user"],what="avatar,user.id", where="fav.userid=user.id and fav.pieceid=$id",vars={"id":id}, limit=5)
        
        liked = False
        where = {"id":id,"userid":self.cur_user.id}
        if self.cur_user and db.select("fav",what="id",where="fav.userid=$userid and pieceid=$id",vars=where):
            liked = True
        return render.piece(curpiece,favs,liked)

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