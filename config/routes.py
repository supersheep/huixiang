page = "controller.page."
ajax = "controller.ajax."

#route settings
urls = (
    '/', page + 'index',
    '/piece/(\d+)', page + 'piece',
    '/people/(\d+)', page + 'people',
    '/logout', page +'logout',
    '/auth/(douban|weibo)', page + 'auth',
    '/ajax/add', ajax + 'add',
    '/ajax/fav', ajax + 'fav',
    '/ajax/unfav', ajax + 'unfav',
    '/ajax/pieces', ajax + 'pieces'
)