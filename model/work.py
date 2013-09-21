#encoding=utf-8
from config.setting import db

def has(title):
    row = db.select("work",where="title=$title",vars={"title":title});
    return row and row[0]["id"] or None 

def add(title):
    id = has(title)
    if id:
        return id
    else:
        return db.insert("work",title=title) 