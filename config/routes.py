prefix = "controller.huixiang."


#route settings
urls = (
    '/', prefix + 'index',
    '/add', prefix + 'add',
    '/fav', prefix + 'fav',
    '/piece', prefix + 'piece',
    '/logout', prefix +'logout',
    '/auth/(douban|weibo)', prefix + 'auth'
)