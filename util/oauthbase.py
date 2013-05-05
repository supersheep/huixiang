import requests
import urllib
from config import setting

config = setting.config

class oauthbase(object):
    def __init__(self,user=None):
        self.set_user(user)
        
    def check_err(self,json):
        code = self.str_err_code
        msg = self.str_err_msg
        if code in json:
            raise Exception(json[msg])

    def signed_request(self,method,url,data={}):
        if not self._token:
            return
        req = requests.request(method,url,data=data,headers={"Authorization":self.header_str + " "+self._token})
        json = req.json()
        self.check_err(json)
        return json

    def signed_post(self,url,data={}):
        return self.signed_request("post",url,data=data)

    def signed_get(self,url):
        return self.signed_request("get",url)

    def get_access_token(self,code):
        name = self.name
        data = {
            "client_id":config["auth"][name]["key"],
            "client_secret":config["auth"][name]["secret"],
            "redirect_uri":config["auth"][name]["callback"],
            "grant_type":"authorization_code",
            "code":code
        }
        res_access_token = requests.post(self.access_token_url,data=data)
        res_json = res_access_token.json()
        try:
            self.check_err(res_json)
        except Exception,e:
            return e
        return res_json["access_token"]

    def set_user(self,user):
        token_name = self.name + "_access_token"
        if user and token_name in user:
            self._token = user[token_name]

    def redirect(self):
        name = self.name
        base = self.authorize_url

        key = config["auth"][name]["key"]
        secret = config["auth"][name]["secret"]
        callback = config["auth"][name]["callback"]
        qs = urllib.urlencode({"redirect_uri":callback,"client_id":key,"response_type":"code"})
        url = base+"?"+qs
        return url