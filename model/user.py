#encoding=utf-8
from config import setting
from util import login

db = setting.db


def check(name,info):
    for key in ["name","avatar",name+"_id",name+"_access_token"]:
        if not info[key]:
            return "no "+key
    return True

def get_by_id(id):
    rows = db.select(["user"],what="avatar,name,id",where="id=$id",vars={"id":id})
    if rows:
        return rows[0]
    else:
        return False

def fav_pages(user_id=None,show_private=False,per=5):
    where = "fav.userid=user.id and fav.pieceid=piece.id and user.id=$user_id"
    if not show_private:
        where += " and private=0"
    pages = db.select(["fav","piece","user"]
        ,what="COUNT(piece.id) as count"
        ,where=where
        ,vars={"user_id":user_id}
    )[0]["count"]
    return pages

def favs_of_page(page=1,per=5,user_id=0,show_private=False):

    sql = """
    select piece.id, piece.private, piece.addtime, piece.id, piece.content,piece.pics,
    author.name as author_name, work.title as work_title
    from fav
    join piece on piece.id=fav.pieceid
    join user on user.id=fav.userid
    left join work on work.id=piece.work
    left join author on author.id=piece.author
    where user.id=$user_id
    """

    if not show_private:
        sql += " and private=0 "
    sql += "order by piece.addtime DESC "
    sql += "limit $per "
    sql += "offset $offset"

    print sql
    favs = db.query(sql,vars={
        "user_id":user_id,
        "offset": (page-1) * per,
        "per": per
    })
    return favs

# 择日移入oauth相关
def parse_data(name,info):
    data = {}

    data[name+"_id"] = str(info["id"])
    data["name"] = info["name"]
    data[name+"_access_token"] = info["access_token"]

    if name == "douban":
        data["avatar"] = info["avatar"]
    elif name == "weibo":
        data["avatar"] = info["profile_image_url"]
    return data

def new_oauth_user(name,info):
    data = parse_data(name,info)

    if check(name,data):
        return db.insert("user",**data)

def update_oauth_userid(name,id,oauth_id):
    data = {}
    data[name+"_id"] = oauth_id
    db.update("user",where="id=$id",vars={"id":id},**data)

def update_access_token(name,id,token):
    data = {}
    data[name+"_access_token"] = token
    db.update("user",where=name+"_id=$id",vars={"id":id},**data)

def exist_oauth_user(name,info):
    data = parse_data(name,info)
    if not check(name,data):
        return False

    rows = db.select("user",where=name+"_id=$id",vars={"id":data[name+"_id"]})
    if rows:
        return rows[0]
    else:
        return False

def login_oauth_user(name,info):
    data = parse_data(name,info)
    if not check(name,data):
        raise Exception("login arguments error")

    users = db.select("user",where=name+"_id="+data[name+"_id"])
    if not users:
        raise Exception("user not found")

    return login.login(users[0]["id"])