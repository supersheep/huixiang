rule_map = {
    "page":{
        "/": "index",
        '/new': 'new',
        '/piece/(\d+)': 'piece',
        '/people/(\d+)': 'people',
        '/login': 'login',
        '/logout': 'logout',
        '/tools': 'tools',
        '/about': 'about',
        '/bookmarklet': 'bookmarklet',
        '/auth/(douban|weibo)': 'auth',
        '/auth/redirect/(douban|weibo)': 'auth_redirect',
    },
    "ajax":{
        '/userinfo':'userinfo',
        '/mine/favs':'myfavs',
        '/authuser':'authuser',
        '/add':'add',
        '/fav':'fav',
        '/unfav':'unfav',
        '/pieces':'pieces',
    },
    "api":{
        '/userinfo':'userinfo',
        '/mine/favs':'myfavs',
        '/authuser':'authuser',
        '/add':'add',
        '/fav':'fav',
        '/unfav':'unfav',
        '/pieces':'pieces'
    }
}

urls = []

def make_rule(url_prefix,class_prefix,submap):
    #route settings
    for key in submap:
        urls.append(url_prefix + key)
        urls.append("controller." + class_prefix + "." + submap[key])

make_rule("","page",rule_map["page"])
make_rule("/ajax","ajax",rule_map["ajax"])
make_rule("/api","api",rule_map["api"])


urls = tuple(urls)
# (
#     '/', page + 'index.index',
#     '/new', page + 'new',
#     '/piece/(\d+)', page + 'piece',
#     '/people/(\d+)', page + 'people',
#     '/login', page + 'login',
#     '/logout', page +'logout',
#     '/tools', page + 'tools',
#     '/about', page + 'about',
#     '/bookmarklet', page + 'bookmarklet',
#     '/auth/(douban|weibo)', page + 'auth',
#     '/auth/redirect/(douban|weibo)', page + 'auth_redirect',

#     '/ajax/userinfo', ajax + 'userinfo',
#     '/ajax/mine/favs', ajax + 'myfavs',
#     '/ajax/authuser', ajax + 'authuser',
#     '/ajax/add', ajax + 'add',
#     '/ajax/fav', ajax + 'fav',
#     '/ajax/unfav', ajax + 'unfav',
#     '/ajax/pieces', ajax + 'pieces',

#     '/api/userinfo', api + 'userinfo',
#     '/api/mine/favs', api + 'myfavs',
#     '/api/authuser', api + 'authuser',
#     '/api/add', api + 'add',
#     '/api/fav', api + 'fav',
#     '/api/unfav', api + 'unfav',
#     '/api/pieces', api + 'pieces'
# )
