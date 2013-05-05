#encoding=utf-8
import web
from config import setting
import hashlib
from datetime import datetime

config = setting.config
salt = config["salt"]
db = setting.db

def sha1(str):
    m = hashlib.sha1()
    m.update(str)
    return m.hexdigest()


def logged():
    # 1. 去除cookie cu
    hash = web.cookies().get("cu")
    if not hash:
        logout()
        return False

    # 2. login token中找出对应记录，得到userid
    rows=db.select("login",what="userid,time,hash",vars={"hash":hash},where="hash=$hash and discard=0")

    if not rows:
        logout()
        return False

    # 3. 对比sha1(salt+ip+userid)
    session=rows[0]
    userid=str(session["userid"])
    time=session["time"]

    # 3.1 不匹配则视为未登录
    if not sha1(salt+web.ctx.ip+userid+time) == session["hash"]:
        logout()
        return False

    # 3.2 匹配后寻找用户，未找到视为未登录
    user = db.select("user",what="id,avatar,douban_id,weibo_id,douban_access_token,weibo_access_token",where="id=$id",vars={"id":session["userid"]})
    if not user:
        logout()
        return False

    # 4. 否则返回该用户
    return user[0]

    
def login(userid):
    # 1. sha1(salt+ip+userid+now)
    now=str(datetime.now())
    userid=str(userid)
    hash=sha1(salt+web.ctx.ip+userid+now)
    # 2. 储存hash id,userid,hash
    db.insert("login",userid=userid,hash=hash,time=now,discard=0)
    # 3. write cookie ua:sha1
    web.setcookie('cu', hash, 3600*24*30)
    

def logout():
    hash = web.cookies().get("cu")
    if hash:
    # 1. login token中找出记录，清除
        print hash
        db.update("login",vars={"hash":hash},where="hash=$hash",discard=1)
    # 2. 清除cookie
        web.setcookie('cu', hash, expires=-1)