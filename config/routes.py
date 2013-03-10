page = "controller.page."
ajax = "controller.ajax."

#route settings
urls = (
    '/', page + 'index',
    '/piece', page + 'piece',
    '/logout', page +'logout',
    '/auth/(douban|weibo)', page + 'auth',
    '/ajax/add', ajax + 'add',
    '/ajax/fav', ajax + 'fav',
    '/ajax/pieces', ajax + 'pieces'
)