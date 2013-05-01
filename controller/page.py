#encoding=utf-8
import web
import requests
import urllib
from datetime import datetime
from config import setting
from model import user
from util import login as login_mod
import json

config = setting.config
render = setting.render
blankrender = setting.blankrender
db = setting.db

class base(object):
    def __init__(self):
        pass
    def GET(self):
        cur_user = login_mod.logged()
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
        
        # mine = db.select(["piece","user"],what="piece.id,piece.content,piece.addtime",where="piece.user=user.id and user.id=$id",vars={"id":id},limit=5)
        rows = db.select(["user"],what="avatar,name",where="id=$id",vars={"id":id})
        user = rows[0]
        return render.people(favs,user)

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
        where = {"id":id}
        if self.cur_user:
            where["userid"] = self.cur_user.id;
        if self.cur_user and db.select("fav",what="id",where="fav.userid=$userid and pieceid=$id",vars=where):
            liked = True
        return render.piece(curpiece,favs,liked)

class logout:
    def GET(self):
        login_mod.logout()
        web.seeother("/")

class login:
    def GET(self):
        input = web.input()
        if login_mod.logged():
            if "redirect" in input:
                web.redirect(urllib.unquote_plus(input["redirect"]))
            else:
                web.redirect("/")

        return blankrender.login()

class tools:
    def GET(self):
        return render.tools()

class bookmarklet(base):
    def GET(self):
        super(bookmarklet,self).GET()
        ctx = web.ctx
        input = web.input()
        url = input["url"]
        title = urllib.unquote(input["title"])
        data = {"url":url,"title":title}
        if len(url) > 36:
            shorturl = url[:36]+"..."
        else:
            shorturl = url

        data["shorturl"] = shorturl
        # return ctx.home + ctx.fullpath
        if not self.cur_user:
            web.seeother("/login?redirect_uri="+urllib.quote_plus(ctx.home + ctx.fullpath))
        return blankrender.bookmarklet(data)

class auth_redirect:
    def GET(self,name):
        if not name in ("weibo","douban"):
            return "invalid sitename"
        else:
            key = config["auth"][name]["key"]
            secret = config["auth"][name]["secret"]
            callback = config["auth"][name]["callback"]
            base = {
                "douban":"https://www.douban.com/service/auth2/auth",
                "weibo":"https://api.weibo.com/oauth2/authorize"
            }   
            qs = urllib.urlencode({"redirect_uri":callback,"client_id":key,"response_type":"code"})
            url = base[name]+"?"+qs
        web.seeother(url)

class auth:
    def GET(self,name):
        input = web.input()
        if "code" in input:
            if not name in ("douban","weibo"):
                return "invalid sitename"

            data = {
                "client_id":config["auth"][name]["key"],
                "client_secret":config["auth"][name]["secret"],
                "redirect_uri":config["auth"][name]["callback"],
                "grant_type":"authorization_code",
                "code":input["code"]
            }


            access_token = {
                "douban":"https://www.douban.com/service/auth2/token",
                "weibo":"https://api.weibo.com/oauth2/access_token"
            }

            user_info_url = {
                "douban": ("https://api.douban.com/v2/user/~me","Bearer"),
                "weibo" : ("","OAuth2")
            }

            res_access_token = requests.post(access_token[name],data=data)
            res_json = res_access_token.json()

            # douban error
            if "code" in res_json:
                return res_json["msg"]
            if "error_code" in res_json:
                return res_json["error_description"]
            access_token = res_json["access_token"]

            # 得到token
            if name == "douban":
                res_user_info = requests.get("https://api.douban.com/v2/user/~me",
                    headers={"Authorization":"Bearer "+access_token})
                user_info = res_user_info.json()
            if name == "weibo":
                res_user_uid_info = requests.get("https://api.weibo.com/2/account/get_uid.json"
                    ,headers={"Authorization":"OAuth2 "+access_token})
                user_uid_info = res_user_uid_info.json()
                res_user_info = requests.get("https://api.weibo.com/2/users/show.json?uid="+str(user_uid_info["uid"])
                    ,headers={"Authorization":"OAuth2 "+access_token})
                user_info = res_user_info.json()
                                
            if "code" in user_info:
                return user_info["msg"]
            if "error_code" in user_info:
                return user_info["error"]


            user_info["access_token"] = access_token

            if not user.exist_oauth_user(name,user_info):
                user.new_oauth_user(name,user_info)
            user.login_oauth_user(name,user_info)
            return render.logged(True)
        else:
            return render.logged(input)