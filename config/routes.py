prefix = "controller.huixiang."


#route settings
urls = (
    '/', prefix + 'index',
    '/add', prefix + 'add',
    '/piece', prefix + 'piece',
    '/auth/(douban|weibo)', prefix + 'auth'
)