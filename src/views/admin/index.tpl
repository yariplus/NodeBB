<!DOCTYPE html>
<html>
<head>
	<title>NodeBB Administration Panel</title>
	<meta name="viewport" content="width=device-width, initial-scale=1.0">

	<link rel="stylesheet" href="{relative_path}/vendor/jquery/css/smoothness/jquery-ui-1.10.4.custom.min.css">
	<link rel="stylesheet" type="text/css" href="{relative_path}/vendor/colorpicker/colorpicker.css">
	<link rel="stylesheet" type="text/css" href="{relative_path}/admin.css?{cache-buster}" />

	<script>
		var RELATIVE_PATH = "{relative_path}";
	</script>

	<!--[if lt IE 9]>
  		<script src="//cdnjs.cloudflare.com/ajax/libs/es5-shim/2.3.0/es5-shim.min.js"></script>
  		<script src="//cdnjs.cloudflare.com/ajax/libs/html5shiv/3.7/html5shiv.js"></script>
  		<script src="//cdnjs.cloudflare.com/ajax/libs/respond.js/1.4.2/respond.js"></script>
	    <script>__lt_ie_9__ = 1;</script>
	<![endif]-->

	<script src="{relative_path}/socket.io/socket.io.js"></script>
	<script src="{relative_path}/nodebb.min.js"></script>
	<script src="{relative_path}/vendor/colorpicker/colorpicker.js"></script>
	<script src="{relative_path}/vendor/tabIndent/tabIndent.js"></script>
	<script src="{relative_path}/src/admin.js?{cache-buster}"></script>

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
</head>

<body class="admin" id="canvas">
	<div id="menu" class="gui">
		<ul class="category">
			<li class="title">General <span class="pull-right"><i class="fa fa-caret-down"></i></span></li>
			<li data-page="general/index" class="item"><i class="fa fa-fw fa-home"></i> Home</li>
			<li data-page="general/languages" class="item"><i class="fa fa-fw fa-comments-o"></i> Languages</li>
			<li data-page="general/sounds" class="item"><i class="fa fa-fw fa-volume-up"></i> Sounds</li>
		</ul>
		<ul class="category">
			<li class="title">Settings <span class="pull-right"><i class="fa fa-caret-down"></i></span></li>
			<li data-page="settings/general" class="item"><i class="fa fa-fw fa-cogs"></i> General</li>
			<li data-page="settings/reputation" class="item"><i class="fa fa-fw fa-cogs"></i> Reputation</li>
			<li data-page="settings/email" class="item"><i class="fa fa-fw fa-cogs"></i> Email</li>
			<li data-page="settings/user" class="item"><i class="fa fa-fw fa-cogs"></i> User</li>
			<li data-page="settings/post" class="item"><i class="fa fa-fw fa-cogs"></i> Post</li>
			<li data-page="settings/pagination" class="item"><i class="fa fa-fw fa-cogs"></i> Pagination</li>
			<li data-page="settings/tags" class="item"><i class="fa fa-fw fa-cogs"></i> Tags</li>
			<li data-page="settings/web" class="item"><i class="fa fa-fw fa-cogs"></i> Web</li>
			<li data-page="settings/sockets" class="item"><i class="fa fa-fw fa-cogs"></i> Sockets</li>
			<li data-page="settings/advanced" class="item"><i class="fa fa-fw fa-cogs"></i> Advanced</li>
			<li data-page="settings/sounds" class="item"><i class="fa fa-fw fa-volume-up"></i> Sounds</li>
		</ul>
		<ul class="category">
			<li class="title">Forum Management <span class="pull-right"><i class="fa fa-caret-down"></i></span></li>
			<li data-page="manage/categories" class="item"><i class="fa fa-fw fa-folder"></i> Categories</li>
			<li data-page="manage/users" class="item"><i class="fa fa-fw fa-user"></i> Users</li>
			<li data-page="manage/groups" class="item"><i class="fa fa-fw fa-group"></i> Groups</li>
		</ul>
		<ul class="category">
			<li class="title">Appearance <span class="pull-right"><i class="fa fa-caret-down"></i></span></li>
			<li data-page="appearance/themes" class="item"><i class="fa fa-fw fa-th"></i> Themes</li>
			<li data-page="appearance/skins" class="item"><i class="fa fa-fw fa-home"></i> Skins</li>
			<li data-page="appearance/customize" class="item"><i class="fa fa-fw fa-home"></i> Customize</li>
		</ul>
		<ul class="category">
			<li class="title">Extensibility <span class="pull-right"><i class="fa fa-caret-down"></i></span></li>
			<li data-page="extend/plugins" class="item"><i class="fa fa-fw fa-code-fork"></i> Plugins</li>
			<li data-page="extend/widgets" class="item"><i class="fa fa-fw fa-home"></i> Widgets</li>
		</ul>
		<ul class="category">
			<li class="title">Advanced <span class="pull-right"><i class="fa fa-caret-down"></i></span></li>
			<li data-page="advanced/events" class="item"><i class="fa fa-fw fa-calendar-o"></i> Events</li>
			<li data-page="advanced/database" class="item"><i class="fa fa-fw fa-hdd-o"></i> Database</li>
			<li data-page="advanced/logger" class="item"><i class="fa fa-fw fa-th"></i> Logger</li>
		</ul>
	</div>

	<div id="profile" class="gui">
		<img class="avatar img-circle" />
	</div>

	<img id="logo" src="{relative_path}/images/nodebb-logo.png" />

	<div class="navbar navbar-inverse navbar-fixed-top header">
		<div class="container">
			<ul id="logged-in-menu" class="nav navbar-nav navbar-right">
				<form class="navbar-form navbar-left" role="search">
					<div class="form-group" id="acp-search" >
						<div class="dropdown" >
							<input type="text" data-toggle="dropdown" class="form-control" placeholder="Search ACP...">
							<ul class="dropdown-menu" role="menu">
								<div class="found"></div>
								<li><a href="#">Separated link</a></li>
								<li><a href="search" id="search-main">Search the forum for</a></li>
							</ul>
						</div>
					</div>
				</form>

				<li id="user_label" class="dropdown">
					<a class="dropdown-toggle" data-toggle="dropdown" href="#" id="user_dropdown">
						<img src="{userpicture}"/>
					</a>
					<ul id="user-control-list" class="dropdown-menu" aria-labelledby="user_dropdown">
						<li>
							<a id="user-profile-link" href="{relative_path}/user/{userslug}" target="_top"><span>Profile</span></a>
						</li>
						<li id="logout-link">
							<a href="#">Log out</a>
						</li>
					</ul>
				</li>
			</ul>
		</div>
	</div>



	<div id="upload-picture-modal" class="modal fade" tabindex="-1" role="dialog" aria-labelledby="Upload Picture" aria-hidden="true">
		<div class="modal-dialog">
			<div class="modal-content">
				<div class="modal-header">
					<button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>
					<h3 id="myModalLabel">Upload Picture</h3>
				</div>
				<div class="modal-body">
					<form id="uploadForm" action="" method="post" enctype="multipart/form-data">
						<div class="form-group">
							<label for="userPhoto">Upload a picture</label>
							<input type="file" id="userPhotoInput"  name="userPhoto">
							<p class="help-block"></p>
						</div>
						<input type="hidden" id="params" name="params">
						<input type="hidden" id="csrfToken" name="_csrf" />
					</form>

					<div id="upload-progress-box" class="progress progress-striped">
						<div id="upload-progress-bar" class="progress-bar progress-bar-success" role="progressbar" aria-valuenow="0" aria-valuemin="0">
							<span class="sr-only"> success</span>
						</div>
					</div>

					<div id="alert-status" class="alert alert-info hide"></div>
					<div id="alert-success" class="alert alert-success hide"></div>
					<div id="alert-error" class="alert alert-danger hide"></div>
				</div>
				<div class="modal-footer">
					<button class="btn btn-default" data-dismiss="modal" aria-hidden="true">Close</button>
					<button id="pictureUploadSubmitBtn" class="btn btn-primary">Upload Picture</button>
				</div>
			</div><!-- /.modal-content -->
		</div><!-- /.modal-dialog -->
	</div><!-- /.modal -->

	<div class="alert-window alert-left-top"></div>
	<div class="alert-window alert-left-bottom"></div>
	<div class="alert-window alert-right-top"></div>
	<div class="alert-window alert-right-bottom"></div>

	<div id="footer" class="container" style="padding-top: 50px; display:none;">
		<footer class="footer">Copyright &copy; 2014 <a target="_blank" href="http://www.nodebb.com">NodeBB</a> by <a target="_blank" href="https://github.com/psychobunny">psychobunny</a>, <a href="https://github.com/julianlam" target="_blank">julianlam</a>, <a href="https://github.com/barisusakli" target="_blank">barisusakli</a> from <a target="_blank" href="http://www.designcreateplay.com">designcreateplay</a></footer>
	</div>

<script type="text/javascript">
	require(['forum/admin/footer']);
</script>

</body>
</html>