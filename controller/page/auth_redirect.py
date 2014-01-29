# /auth/redirect/(douban|weibo)
import web
import traceback
from util import oauth
class auth_redirect:
    def GET(self,name):
        try:
            client = oauth.createClientWithName(name)
            url = client.redirect()
            web.seeother(url)
        except Exception:
            return traceback.format_exc()
