from config import setting
from util import login

db = setting.db

# 404 no name
# 405 no avatar
# 406 no id
# 407 no access token
def check(info):
    for key in ["name","avatar","id","access_token"]:
        if not info[key]:
            return "no "+key
    return True

def new_douban_user(info):
    if check(info):
        db.insert("user",name=info["name"],avatar=info["avatar"],douban_access_token=info["access_token"],douban_id=info["id"])


def exist_douban_user(info):
    if not check(info):
        return False

    rows = db.select("user",where="douban_id="+info["id"])
    if rows:
        return True
    else:
        return False


def login_douban_user(info):
    if not check(info):
        print "login arguments error"
        return False

    users = db.select("user",where="douban_id="+info["id"])
    if not users:
        print "user not found"
        return False

    login.login(users[0]["id"])