# /piece/(\d+)
from config import setting
from datetime import datetime
from model import fav

db = setting.db
def add(user_id,content,link=None,private=False):
    pieces = db.select("piece",where="content=$content",vars={"content":content})
    piece_id = None
    if not pieces:
        piece_id = db.insert("piece",content=content,user=user_id,addtime=datetime.now(),link=link,private=private)
    else:
        piece_id = pieces[0]["id"]

    fav.add(user_id=user_id,piece_id=piece_id)

    return piece_id