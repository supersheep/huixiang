#encoding=utf-8
from config.setting import db

def has(name):
    row = db.select("author",where="name=$name",vars={"name":name});
    return row and row[0]["id"] or None 

def add(name):
    id = has(name)
    if id:
        return id
    else:
        return db.insert("author",name=name) 