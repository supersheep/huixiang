# /auth/(douban|weibo)
import web
from util import login,oauth
from model import user
from config.setting import blankrender

class auth:
    def GET(self,name):
        input = web.input()
        new_user = None
        cur_user = login.logged()
        try:
            client = oauth.createClientWithName(name)
            access_token = client.get_access_token(input["code"])
            user_info = client.get_current_user_info(access_token)

            user_info["access_token"] = access_token
            


            if cur_user:
                user.update_oauth_userid(name,cur_user["id"],user_info["id"])
                user.update_access_token(name,user_info["id"],access_token)
            if not cur_user:
                oauth_user = user.exist_oauth_user(name,user_info)
                if not oauth_user:
                    new_user = user.new_oauth_user(name,user_info)
                else:
                    user.update_access_token(name,oauth_user[name+"_id"],access_token)
                user.login_oauth_user(name,user_info)

            return blankrender.logged(True,new_user)
        except Exception:
            return blankrender.logged(True,None)
