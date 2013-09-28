#encoding=utf-8
from config.setting import db

def get_by_id(id):
    row = db.select("work",what="id,title",where="id=$id",vars={"id":id})
    if row:
        return row[0]
    else:
        return None

def has(title):
    row = db.select("work",where="title=$title",vars={"title":title});
    return row and row[0]["id"] or None 

def add(title):
    id = has(title)
    if id:
        return id
    else:
        return db.insert("work",title=title) 