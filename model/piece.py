#encoding=utf-8
# /piece/(\d+)
from config import setting
from datetime import datetime
from model import fav

db = setting.db

def parse_content(content):
    """ get author from content """
    import re
    pattern = re.compile(u"\s*(?:\-+|——|by|BY)\s*")
    match = re.split(pattern,content)
    if not match:
        return None
    if len(match) > 2:
        return None
    if re.match(u"^[\u4e00-\u9fa5]+$",match[1]) and len(match[1]) > 5:
        return None

    pattern_art = re.compile(u"《([\u4e00-\u9fa5\w\s]+)》")
    author = match[1]
    if author:
        art = pattern_art.findall(author)
        art = art and art[0] or None
        if art:
            author = filter(None,author.split(u"《" + art + u"》"))[0]

    return {"content":match[0].strip(),"author":author and author.strip() or None,"art":art and art.strip() or None}

def add(user_id,content,link=None,private=False):
    pieces = db.select("piece",where="content=$content",vars={"content":content})
    piece_id = None
    if not pieces:
        piece_id = db.insert("piece",content=content,user=user_id,addtime=datetime.now(),link=link,private=private)
    else:
        piece_id = pieces[0]["id"]

    fav.add(user_id=user_id,piece_id=piece_id)

    return piece_id

def get_all(limit=100):
    pieces = db.query('select id,content,link from piece order by rand() limit ' + str(limit)) 
    return list(pieces)