#encoding=utf-8
# /people/(\d+)
import web
import math
from base import base
from model import user
from config.setting import render

class people(base):
    def GET(self,user_id):
        """ people """
        super(people,self).GET()

        # get current user
        cur_user = self.cur_user

        # get page user
        the_user = user.get_by_id(user_id)

        if not the_user:
            web.notfound()
            return "user not found"

        # set private
        if not cur_user or the_user.id == cur_user.id:
            show_private = 1
        else:
            show_private = 0

        # get page from url
        try:
            page = int(web.input(page=1)["page"])
        except Exception:
            page = 1

        if page < 1:
            page = 1

        per = 5

        # get favs
        favs = user.favs_of_page(page=page,per=per,user_id=user_id,show_private=show_private)
        
        if len(favs) == 0:
            favs = [{"content":"如果有收藏过喜欢的句子，他们会出现在这里。","id":None}]
        
        pages_count = user.fav_pages(user_id=user_id,per=5,show_private=show_private)

        pages = math.ceil(float(pages_count)/per)
        pages = int(pages)

        return render.people(favs,the_user,pages,page)