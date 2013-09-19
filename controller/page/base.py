import web
from util import login

class base(object):
    def __init__(self):
        pass
    def GET(self):
        cur_user = login.logged()
        self.cur_user = cur_user
        web.template.Template.globals['user'] = cur_user