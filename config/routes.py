page = "controller.page."
ajax = "controller.ajax."


#route settings
urls = (
    '/', page + 'index',
    '/piece/(\d+)', page + 'piece',
    '/people/(\d+)', page + 'people',
    '/login', page + 'login',
    '/logout', page +'logout',
    '/tools', page + 'tools',
    '/about', page + 'about',
    '/bookmarklet', page + 'bookmarklet',
    '/auth/(douban|weibo)', page + 'auth',
    '/auth/redirect/(douban|weibo)', page + 'auth_redirect',
    '/ajax/userinfo', ajax + 'userinfo',
    '/ajax/mine/favs', ajax + 'myfavs',
    '/ajax/authuser', ajax + 'authuser',
    '/ajax/add', ajax + 'add',
    '/ajax/fav', ajax + 'fav',
    '/ajax/unfav', ajax + 'unfav',
    '/ajax/pieces', ajax + 'pieces'
)
