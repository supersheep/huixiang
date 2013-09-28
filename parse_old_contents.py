from model import piece
from model import work
from model import author
from config.setting import db

pieces = piece.get_all()
for p in pieces:
    data = piece.parse_content(p.content)
    print data
    author_name = data["author"]
    work_title = data["work"]

    if p["author"]:
        data["author"] = p["author"]
    elif data["author"]:
        # return author_id
        data["author"] = author.add(author_name)
    
    if p["work"]:
        data["work"] = p["work"]
    elif data["work"]:
        # return work_id
        data["work"] = work.add(work_title)

    db.update("piece",where="id=$id",vars=p,**data)