from config import setting
from datetime import datetime

db = setting.db

def add(user_id,piece_id):
    fav = db.select("fav",where="userid=$userid and pieceid=$pieceid",vars={
        "userid":user_id,
        "pieceid":piece_id
    })

    if fav:
        fav_id = fav[0]["id"]
    else:
        fav_id = db.insert("fav",pieceid=piece_id,userid=user_id,addtime=datetime.now())
    
    return fav_id

def remove(user_id,piece_id):
    where = {
        "userid":user_id,
        "pieceid":piece_id
    }
    
    db.delete("fav",where="userid=$userid and pieceid=$pieceid",vars=where)
