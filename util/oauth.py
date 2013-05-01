#encoding=utf-8
import requests
import urllib

clients=("weibo","douban")

class weibo:
    def __init__(self,user=None):
        self.set_user(user)
    def set_user(self,user):
        if "weibo_access_token" in user:
            self._token = user["weibo_access_token"]    
    def post(self,content):
        if not self._token:
            return
        res = requests.post("https://api.weibo.com/2/statuses/update.json"
            ,data={"status":content.encode('utf8')}
            ,headers={"Authorization":"OAuth2 "+self._token})
        print res.json()




class douban:
    def __init__(self,user=None):
        self.set_user(user)
    def set_user(self,user):
        if "douban_access_token" in user:
            self._token = user["douban_access_token"]
    def post(self,content):
        if not self._token:
            return
        res = requests.post("https://api.douban.com/shuo/v2/statuses/"
            ,data={"text":content.encode('utf8')}
            ,headers={"Authorization":"Bearer "+self._token})
        res_json = res.json()
        print res_json



