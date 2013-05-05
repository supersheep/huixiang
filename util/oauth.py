#encoding=utf-8
from oauthbase import oauthbase


class weibo(oauthbase):
    name = "weibo"
    authorize_url = "https://api.weibo.com/oauth2/authorize"
    access_token_url = "https://api.weibo.com/oauth2/access_token"
    str_err_code = "error_code"
    str_err_msg = "error_description"
    header_str = "OAuth2"

    def get_current_user_info(self,access_token):
        self._token = access_token
        user_uid_info = self.signed_get("https://api.weibo.com/2/account/get_uid.json")
        user_info = self.signed_get("https://api.weibo.com/2/users/show.json?uid="+str(user_uid_info["uid"]))

        return user_info

    def post(self,content):
        return self.signed_post("https://api.weibo.com/2/statuses/update.json",
            data = {"status":content.encode('utf8')})



class douban(oauthbase):
    name = "douban"
    authorize_url = "https://www.douban.com/service/auth2/auth"
    access_token_url = "https://www.douban.com/service/auth2/token"
    str_err_code = "code"
    str_err_msg = "msg"
    header_str = "Bearer"

    def get_current_user_info(self,access_token):
        return self.signed_get("https://api.douban.com/v2/user/~me")

    def post(self,content):
        return self.signed_post("https://api.douban.com/shuo/v2/statuses/"
            ,data={"text":content.encode('utf8')})


def createClientWithName(name,user=None):
    if name == "douban":
        return douban(user)
    elif name == "weibo":
        return weibo(user)
    else:
        raise Exception("invalid client")
