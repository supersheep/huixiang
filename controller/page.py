#encoding=utf-8
import web
import requests
import urllib
from datetime import datetime
from config import setting
from model import user
from util import login as login_mod
from util import oauth
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
        favs = db.select(["fav","piece","user"],what="avatar,piece.id,piece.content,fav.addtime",where="fav.userid=user.id and fav.pieceid=piece.id and user.id=$id",vars={"id":id},limit=5,order="addtime DESC")
        
        # mine = db.select(["piece","user"],what="piece.id,piece.content,piece.addtime",where="piece.user=user.id and user.id=$id",vars={"id":id},limit=5)
        rows = db.select(["user"],what="avatar,name,id",where="id=$id",vars={"id":id})

        if not rows:
            web.notfound()
            return "user not found"

        user = rows[0]
        print "user",user
        return render.people(favs,user)

class piece(base):
    def GET(self,id):
        """ piece """
        super(piece,self).GET()
        pieces = db.select("piece",what="id,content,link",where="id=$id",vars={"id":id})
        cur_user = self.cur_user
        cur_user_id = cur_user and cur_user["id"] or 0
        if not pieces:
            return web.notfound("oops")

        curpiece = pieces[0]

        favs = db.select(["fav","user"],what="avatar,user.id", where="fav.userid=user.id and fav.pieceid=$id and fav.userid<>$cur_user_id",vars={"id":id,"cur_user_id":cur_user_id}, limit=5)
        
        liked = False
        where = {"id":id}
        if cur_user:
            where["userid"] = self.cur_user.id;
        if cur_user and db.select("fav",what="id",where="fav.userid=$userid and pieceid=$id",vars=where):
            liked = True
        return render.piece(curpiece,favs,liked)

class logout:
    def GET(self):
        login_mod.logout()
        referer = web.ctx.env.get('HTTP_REFERER', '/')
        web.seeother(referer)

class login:
    def GET(self):
        input = web.input()
        if login_mod.logged():
            if "redirect" in input:
                web.redirect(urllib.unquote_plus(input["redirect"]))
            else:
                web.redirect("/")

        return blankrender.login()

class tools(base):
    def GET(self):
        return render.tools()

class about(base):
    def GET(self):
        return render.about()

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
        
        return blankrender.bookmarklet(data)

class auth_redirect:
    def GET(self,name):
        try:
            client = oauth.createClientWithName(name)
            url = client.redirect()
            web.seeother(url)
        except Exception,e:
            return e

class auth:
    def GET(self,name):
        input = web.input()
        try:
            client = oauth.createClientWithName(name)
            access_token = client.get_access_token(input["code"])
            user_info = client.get_current_user_info(access_token)

            user_info["access_token"] = access_token
            oauth_user = user.exist_oauth_user(name,user_info)

            if not oauth_user:
                user.new_oauth_user(name,user_info)
            else:
                user.update_access_token(name,oauth_user[name+"_id"],access_token)
            
            user.login_oauth_user(name,user_info)
            return render.logged(True)
        except Exception, e:
            return e
