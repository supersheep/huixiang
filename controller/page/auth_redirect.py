# /auth/redirect/(douban|weibo)
import web
from util import oauth
class auth_redirect:
    def GET(self,name):
        try:
            client = oauth.createClientWithName(name)
            url = client.redirect()
            web.seeother(url)
        except Exception,e:
            print e
            return e