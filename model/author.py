#encoding=utf-8
from config.setting import db

def get_by_id(id):
    row = db.select("author",what="id,name",where="id=$id",vars={"id":id})
    if row:
        return row[0]
    else:
        return None

def has(name):
    row = db.select("author",where="name=$name",vars={"name":name});
    return row and row[0]["id"] or None 

def add(name):
    id = has(name)
    if id:
        return id
    else:
        return db.insert("author",name=name) 