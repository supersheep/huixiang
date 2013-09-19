import web
from base import base
from config.setting import db
from config.setting import render


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