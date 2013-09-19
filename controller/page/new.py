#encoding=utf-8
# /new
from config.setting import render
from util import oauth
from base import base
import web

class new(base):
    def GET(self):
        """ write new piece """
        super(new,self).GET()
        return render.new()
    def POST(self):
        """ post the piece """
        super(new,self).GET()
        from model import piece
        from urlparse import urlparse

        post = web.input(_method="post",share=[])

        if self.cur_user:
            # get cur_user
            cur_user = self.cur_user

            # set user_id
            user_id = cur_user["id"]

            # set link
            link = post["link"]
            url_parsed = urlparse(link)
            if not url_parsed.netloc:
                link = None

            # set private
            if "private" in post:
                private = True
            else:
                private = False

            # set content
            content = post["content"]

            # insert
            piece_id = piece.add(user_id=user_id,content=content,link=link,private=private)
            
            # share
            if not private:
                share = post["share"]
                share_content = u"「" + content + u"」" + " http://" + web.ctx.host + "/piece/" + str(piece_id)
                if "weibo" in share:
                    client = oauth.createClientWithName("weibo",cur_user)
                    client.post(share_content)

                if "douban" in share:
                    client = oauth.createClientWithName("douban",cur_user)
                    client.post(share_content)

            # redirect
            web.redirect("/people/"+str(user_id))
        else:
            return render.new()