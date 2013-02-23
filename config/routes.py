prefix = "controller.huixiang."


#route settings
urls = (
    '/', prefix + 'index',
    '/add', prefix + 'add',
    '/piece', prefix + 'piece',
    '/logout', prefix +'logout',
    '/auth/(douban|weibo)', prefix + 'auth'
)