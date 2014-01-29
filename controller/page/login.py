import web
import urllib
from util import login as login_mod
from config.setting import blankrender,render

class login:
    def GET(self):
        input = web.input()
        if login_mod.logged():
            if "redirect" in input:
                web.redirect(urllib.unquote_plus(input["redirect"]))
            else:
                web.redirect("/")

        return render.login()
