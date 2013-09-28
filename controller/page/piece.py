import web
from base import base
from config.setting import render
from model import fav as fav_model
from model import piece as piece_model
from model import author as author_model
from model import work as work_model


class piece(base):
    def GET(self,id):
        """ piece """
        super(piece,self).GET()

        cur_piece = piece_model.get_by_id(id)
        if not cur_piece:
            return web.notfound()

        work_id = cur_piece["work"]
        work = work_model.get_by_id(work_id)
        cur_piece["work_title"] = work and work["title"] or None


        author_id = cur_piece["author"]
        print "authorid" + str(author_id)
        author = author_model.get_by_id(author_id)
        cur_piece["author_name"] = author and author["name"] or None




        cur_user = self.cur_user
        cur_user_id = cur_user and cur_user["id"] or 0

        favs = fav_model.get_by_piece_id(id)

        favs = list(favs)

        fav_count = len(favs)

        favs = favs[0:8]

        liked = False
        if cur_user and fav_model.is_user_faved(cur_user_id,id):
            liked = True
        else:
            liked = False

        return render.piece(cur_piece,favs,liked,fav_count)