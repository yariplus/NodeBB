<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="utf-8">
	<meta http-equiv="X-UA-Compatible" content="IE=edge">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<title>NodeBB ACP</title>

	<link href="http://code.jquery.com/ui/1.10.4/themes/black-tie/jquery-ui.css" rel="stylesheet">
	<link href="../admin/stylesheet.css" rel="stylesheet">
	<link href="//netdna.bootstrapcdn.com/font-awesome/4.1.0/css/font-awesome.min.css" rel="stylesheet">
	
</head>
<body id="canvas">
	<div id="menu" class="gui">
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

	<div id="profile" class="gui">
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


	<!-- TODO START,  move into partial -->
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
						<input id="imageUploadCsrf" type="hidden" name="_csrf" value="" />
						<input type="hidden" id="params" name="params">
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
	<script type="text/javascript">
		require(['forum/admin/footer']);
	</script>
	<!-- TODO STOP,  move into partial -->
</body>
</html>
