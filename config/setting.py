import web,yaml,os

if os.path.exists('config.yml'):
	config = yaml.load(open('config.yml'))
else:
	config = os.environ

render = web.template.render(config['tpl'],base="layout")
blankrender = web.template.render(config['tpl'])
db = web.database(dbn=config["db_name"],user=config["db_user"],pw=config["db_pwd"],db=config["db_database"])
web.config.debug = config['debug']

web.template.Template.globals['config'] = config
web.template.Template.globals['ENV'] = os.environ.get("ENV",None)
web.template.Template.globals['user'] = None
web.template.Template.globals['render'] = render
web.template.Template.globals['blankrender'] = blankrender