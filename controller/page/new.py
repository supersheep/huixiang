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
        if not self.cur_user:
            web.redirect("/login")
        else:
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
            if "link" in post:
                link = post["link"]
                url_parsed = urlparse(link)
                if not url_parsed.netloc: #相当于host
                    link = None
            else:
                link = None


            # set private
            private = "private" in post

            # set content
            content = post["content"]

            if content.strip() == "":
                error = "内容不能为空"
                return render.new(error)

            if "pics" in post:
                pics = post["pics"]
            else:
                pics = None

            # insert
            piece_id = piece.add(user_id=user_id,content=content,link=link,private=private,pics=pics)

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