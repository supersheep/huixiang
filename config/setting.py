import web,yaml


config = yaml.load(open('config.yml'))
dbcfg = config['db']
render = web.template.render(config['tpl'],base="layout")
db = web.database(dbn=dbcfg["name"],user=dbcfg["user"],pw=dbcfg["pwd"],db=dbcfg["db"])
web.config.debug = config['debug']

web.template.Template.globals['config'] = config
web.template.Template.globals['user'] = None
web.template.Template.globals['render'] = render