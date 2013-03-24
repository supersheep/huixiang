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

# 这里的安全性还是稍弱，但也尚可，先用起来吧
def logged():
    # 1. 去除cookie cu
    hash = web.cookies().get("cu")
    if not hash:
        logout()
        return False

    # 2. login token中找出对应记录，得到userid
    rows=db.select("login",what="userid,time,hash",vars={"hash":hash},where="hash=$hash")

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
    user = db.select("user",what="id,avatar",where="id=$id",vars={"id":session["userid"]})
    if not user:
        logout()
        return False

    # 4. 否则返回该用户
    return user[0]

    
def login(userid):
    # 1. sha1(salt+ip+userid+now)
    now=datetime.now()
    hash=sha1(salt+web.ctx.ip+str(userid)+str(now))
    # 2. 储存hash id,userid,hash
    db.insert("login",userid=userid,hash=hash,time=now)
    # 3. write cookie ua:sha1
    web.setcookie('cu', hash, 3600*24*30)
    

def logout():
    hash = web.cookies().get("cu")
    if hash:
    # 1. login token中找出记录，清除
        print hash
        db.delete("login",vars={"hash":hash},where="hash=$hash")
    # 2. 清除cookie
        web.setcookie('cu', hash)