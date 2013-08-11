GET /api/pieces 获取一批句子
返回
[{
  content: "王冠上的苍蝇，并不比厕所里的苍蝇更可贵。", 
  link: "http://www.zreading.cn/archives/3890.html", 
  id: 121
}]
一次随机取一百条


/api/authuser 通过第三方验证登录，如果未登录过会创建用户
参数
- name (weibo|douban)
- access_token 
返回
{
    "id": 1
    "douban_id": 1594444,
    "weibo_id": 1643126073,
    "name": "山大芋早就想",
    "client_hash": "xxx",
    "weibo_access_token": "xxx",
    "douban_access_token": "xxx",
    "email": null,
    "avatar": "http://img3.douban.com/icon/u1594444-37.jpg",
    "password": null,
}
其中client_hash也可以从set-cookie里获取，这里只是为了方便。
需要登录的请求通过附带cu这个cookie，值为client_hash即可


GET /api/userinfo 获取当前登录用户信息
返回
{
  name: "山大芋早就想",
  avatar: "http://img3.douban.com/icon/u1594444-37.jpg",
  id: 1
}


GET /api/mine/favs 获取当前登录用户
参数
- page 默认 1
- per 默认 5
返回
[{
  content: "如若不能真正做到什么，不如什么都不做。",
  addtime: "2013-07-19",
  link: null,
  id: 141
}]


POST /api/add 添加一条句子
参数
- content
- id
- link(可选)
- share(可选，形式为 douban|weibo|douban,weibo )


POST /api/fav 添加一条收藏
参数
- pieceid


POST /api/unfav 取消一条收藏
- pieceid 
