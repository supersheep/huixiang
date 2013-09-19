# /bookmarklet
from base import base
import web
import urllib
from config.setting import blankrender

class bookmarklet(base):
    def GET(self):
        super(bookmarklet,self).GET()
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