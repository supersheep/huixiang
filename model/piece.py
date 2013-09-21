#encoding=utf-8
from config import setting
from datetime import datetime
from model import fav

db = setting.db

def parse_content(content):
    """ get author from content """
    import re
    pattern = re.compile(u"\s*(?:\-+|——|by|BY)\s*")
    match = re.split(pattern,content)
    default_result = {"content":content,"author":None,"work":None}
    if not match:
        return default_result
    # to many spliter
    if len(match) > 2:
        return default_result
    # no author
    if len(match) == 1:
        return default_result

    # pure english content but just one word
    if re.compile(u"\w+").findall(match[0]) and len(match[0].split(" ")) == 1:
        return default_result

    if "by" in content or "BY" in content and not re.search(r"\s{2,}$",match[0]):
        return default_result

    # chinese author name or sentance larger than 5
    author = match[1]

    # sentance
    if re.search(u"[，,。、“”？！]",author) or len(author.split(" ")) > 2:
        return default_result
    if re.match(u"^[\u4e00-\u9fa5\w]+$",author) and len(author) > 5:
        return default_result

    pattern_work = re.compile(u"([《<＜]([\u4e00-\u9fa5\w\s，]+)[》>＞])")
    author = match[1]

    if author:
        work = pattern_work.findall(author)
        work = work and work[0] or None
        if work:
            author = filter(None,author.split(work[0]))
            work = work[1]
            if len(author):
                author = author[0]
            else:
                author = None

    return {"content":match[0].strip(),"author":author and author.strip() or None,"work":work and work.strip() or None}

def add(user_id,content,link=None,private=False):
    pieces = db.select("piece",where="content=$content",vars={"content":content})
    piece_id = None
    if not pieces:
        piece_id = db.insert("piece",content=content,user=user_id,addtime=datetime.now(),link=link,private=private)
    else:
        piece_id = pieces[0]["id"]

    fav.add(user_id=user_id,piece_id=piece_id)

    return piece_id

def get_random(limit=100):
    pieces = db.query('select id,content,link from piece order by rand() limit ' + str(limit)) 
    return list(pieces)

def get_all(limit=None):
    query = 'select id,content,link from piece'
    if limit:
        query += "limit " + str(limit) 
    pieces = db.query(query)
    return pieces