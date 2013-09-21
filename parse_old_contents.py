from model import piece
from model import work
from model import author
from config.setting import db

pieces = piece.get_all()
for p in pieces:
    data = piece.parse_content(p.content)

    author_name = data["author"]
    work_title = data["work"]

    if data["author"]:
        # return author_id
        data["author"] = author.add(author_name)

    if data["work"]:
        # return work_id
        data["work"] = work.add(work_title)

    # if author_name or work_title:
    #     # print p.content
    #     print "origin:\t\t" + p.content
    #     print "content:\t" + data["content"]
    #     print "author:\t\t" + (author_name and author_name or "None")
    #     print "work:\t\t" + (work_title and work_title or "None")
    #     print ""
    
    db.update("piece",where="id=$id",vars=p,**data)