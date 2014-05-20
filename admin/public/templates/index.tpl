<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="utf-8">
	<meta http-equiv="X-UA-Compatible" content="IE=edge">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<title>NodeBB ACP</title>

	<link href="../admin/stylesheet.css" rel="stylesheet">
	<link href="//netdna.bootstrapcdn.com/font-awesome/4.1.0/css/font-awesome.min.css" rel="stylesheet">
</head>
<body id="canvas">
	<div id="menu">
		<ul class="category">
			<li class="title">General <span class="pull-right"><i class="fa fa-caret-down"></i></span></li>
			<li data-page="general/home" class="item"><i class="fa fa-fw fa-home"></i> Home</i></li>
			<li data-page="general/settings" class="item"><i class="fa fa-fw fa-cogs"></i> Settings</i></li>
			<li data-page="general/languages" class="item"><i class="fa fa-fw fa-comments-o"></i> Languages</i></li>
			<li data-page="general/sounds" class="item"><i class="fa fa-fw fa-volume-up"></i> Sounds</i></li>
		</ul>
		<ul class="category">
			<li class="title">Forum Management <span class="pull-right"><i class="fa fa-caret-down"></i></span></li>
			<li data-page="manage/categories" class="item"><i class="fa fa-fw fa-folder"></i> Categories</i></li>
			<li data-page="manage/users" class="item"><i class="fa fa-fw fa-user"></i> Users</i></li>
			<li data-page="manage/groups" class="item"><i class="fa fa-fw fa-group"></i> Groups</i></li>
		</ul>
		<ul class="category">
			<li class="title">Appearance <span class="pull-right"><i class="fa fa-caret-down"></i></span></li>
			<li data-page="appearance/themes" class="item"><i class="fa fa-fw fa-th"></i> Themes</i></li>
			<li data-page="appearance/skins" class="item"><i class="fa fa-fw fa-home"></i> Skins</i></li>
			<li data-page="appearance/customize" class="item"><i class="fa fa-fw fa-home"></i> Customize</i></li>
		</ul>
		<ul class="category">
			<li class="title">Extensibility <span class="pull-right"><i class="fa fa-caret-down"></i></span></li>
			<li data-page="extend/plugins" class="item"><i class="fa fa-fw fa-code-fork"></i> Plugins</i></li>
			<li data-page="extend/widgets" class="item"><i class="fa fa-fw fa-home"></i> Widgets</i></li>
		</ul>
		<ul class="category">
			<li class="title">Advanced <span class="pull-right"><i class="fa fa-caret-down"></i></span></li>
			<li data-page="advanced/events" class="item"><i class="fa fa-fw fa-calendar-o"></i> Events</i></li>
			<li data-page="advanced/database" class="item"><i class="fa fa-fw fa-hdd-o"></i> Database</i></li>
			<li data-page="advanced/logger" class="item"><i class="fa fa-fw fa-th"></i> Logger</i></li>
		</ul>
	</div>

	<div class="window panel">
		<div class="panel-heading pointer">
			<h3 class="panel-title">Panel title <span class="pull-right pointer"><i class="fa fa-circle"></i></span></h3>
		</div>
		<div class="panel-body">
			<nav class="navbar navbar-inverse" role="navigation">
				<div class="container-fluid">
					<ul class="nav navbar-nav">
						<li class="active"><a href="#">Link</a></li>
						<li><a href="#">Link</a></li>
						<li class="dropdown">
						<a href="#" class="dropdown-toggle" data-toggle="dropdown">Dropdown <b class="caret"></b></a>
							<ul class="dropdown-menu">
								<li><a href="#">Action</a></li>
								<li><a href="#">Another action</a></li>
								<li><a href="#">Something else here</a></li>
								<li class="divider"></li>
								<li><a href="#">Separated link</a></li>
								<li class="divider"></li>
								<li><a href="#">One more separated link</a></li>
							</ul>
						</li>
					</ul>
				</div>
			</nav>

			Panel content
		</div>
	</div>

	<div id="profile">
		<img class="avatar img-circle" />
	</div>

	<img id="logo" src="{relative_path}/admin/images/nodebb-logo.png" />

	<script>var RELATIVE_PATH = "{relative_path}";</script>
	<script type="text/javascript" src="//code.jquery.com/jquery-2.1.1.min.js"></script>
	<script type="text/javascript" src="//code.jquery.com/ui/1.10.4/jquery-ui.min.js"></script>
	<script src="{relative_path}/vendor/bootstrap/js/bootstrap.min.js"></script>
	<script src="{relative_path}/socket.io/socket.io.js"></script>
	<script type="text/javascript" src="{relative_path}/src/templates.js"></script>
	<script type="text/javascript" src="{relative_path}/src/translator.js?{cache-buster}"></script>
	<script type="text/javascript" src="{relative_path}/src/ajaxify.js?{cache-buster}"></script>
	<script type="text/javascript" src="{relative_path}/src/variables.js?{cache-buster}"></script>
	<script type="text/javascript" src="{relative_path}/src/widgets.js?{cache-buster}"></script>
	<script type="text/javascript" src="{relative_path}/vendor/jquery/timeago/jquery.timeago.min.js"></script>
	<script type="text/javascript" src="{relative_path}/vendor/jquery/js/jquery.form.min.js"></script>
	<script type="text/javascript" src="{relative_path}/vendor/jquery/deserialize/jquery.deserialize.min.js"></script>
	<script type="text/javascript" src="{relative_path}/vendor/jquery/serializeObject/jquery.ba-serializeobject.min.js"></script>
	<script type="text/javascript" src="{relative_path}/vendor/requirejs/require.js"></script>
	<script type="text/javascript" src="{relative_path}/vendor/bootbox/bootbox.min.js"></script>
	<script type="text/javascript" src="{relative_path}/vendor/colorpicker/colorpicker.js"></script>
	<script type="text/javascript" src="{relative_path}/vendor/xregexp/xregexp.js"></script>
	<script type="text/javascript" src="{relative_path}/vendor/xregexp/unicode/unicode-base.js"></script>
	<script type="text/javascript" src="{relative_path}/vendor/tabIndent/tabIndent.js"></script>
	<script type="text/javascript" src="{relative_path}/src/utils.js"></script>
	<script type="text/javascript" src="{relative_path}/src/app.js?{cache-buster}"></script>
	<script type="text/javascript" src="{relative_path}/admin/lib/admin.js?{cache-buster}"></script>

	<script>
		require.config({
			baseUrl: "{relative_path}/src/modules",
			waitSeconds: 3,
			urlArgs: "{cache-buster}",
			paths: {
				'forum': '../forum',
				'vendor': '../../vendor',
				'buzz': '../../vendor/buzz/buzz.min'
			}
		});
	</script>

	<!-- BEGIN scripts -->
	<script type="text/javascript" src="{scripts.src}"></script>
	<!-- END scripts -->
</body>
</html>
