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
    # too many spliter
    if len(match) > 2:
        print "too many spliter: "+content
        return default_result

    # no author
    if len(match) == 1:
        print "no author: " + content
        return default_result

    # pure english content but just one word
    if re.compile(u"\w+").findall(match[0]) and len(match[0].split(" ")) == 1:
        print "pure english content but just one word: "+content
        return default_result

    if ("by" in content or "BY" in content) and not re.search(r"\s{2,}by",content):
        print "`by` issue: "+content
        return default_result

    # chinese author name or sentance larger than 5
    author = match[1]
    pattern_work = re.compile(u"([《<＜]([\u4e00-\u9fa5\w\s，]+)[》>＞])")

    # sentance
    if re.search(u"[，,。、“”？！]",author) or (len(author.split(" ")) > 2 and not re.findall(pattern_work,author)):
        print "author is sentance: " + content
        return default_result

    if re.match(u"^[\u4e00-\u9fa5]+$",author) and len(author) > 5:
        print "chinese author name too long" + content
        return default_result

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

def add(user_id,content,link=None,private=False,pics=None):
    from model import work
    from model import author
    infos = parse_content(content)
    pieces = db.select("piece",where="content=$content",vars={
        "content":infos["content"]
    })

    author_name = infos["author"]
    work_title = infos["work"]


    piece_id = None
    if not pieces:
        if infos["author"]:
            # return author_id
            infos["author"] = author.add(author_name)

        if infos["work"]:
            # return work_id
            infos["work"] = work.add(work_title)
        piece_id = db.insert("piece",content=infos["content"],author=infos["author"],work=infos["work"],user=user_id,addtime=datetime.now(),link=link,private=private,pics=pics)
    else:
        piece_id = pieces[0]["id"]

    fav.add(user_id=user_id,piece_id=piece_id)

    return piece_id

def get_by_id(id):
    row = db.select("piece",what="id,content,link,work,author,pics",where="id=$id",vars={"id":id})
    if row:
        return row[0]
    else:
        return None

def get_random(limit=100):
    pieces = db.query('select id,content,link from piece order by rand() limit ' + str(limit))
    return list(pieces)

def get_all(limit=None):
    query = 'select id,content,link,work,author from piece'
    if limit:
        query += "limit " + str(limit)
    pieces = db.query(query)
    return pieces