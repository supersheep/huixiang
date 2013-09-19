# /logout
import web
from util import login

class logout:
    def GET(self):
        login.logout()
        referer = web.ctx.env.get('HTTP_REFERER', '/')
        web.seeother(referer)