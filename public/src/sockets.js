'use strict';


app = window.app || {};
socket = window.socket;

(function () {
	var reconnecting = false;

	var ioParams = {
		reconnectionAttempts: config.maxReconnectionAttempts,
		reconnectionDelay: config.reconnectionDelay,
		transports: config.socketioTransports,
		path: config.relative_path + '/socket.io',
	};

	socket = io(config.websocketAddress, ioParams);

	var oEmit = socket.emit;
	socket.emit = function (event, data, callback) {
		if (typeof data === 'function') {
			callback = data;
			data = null;
		}
		if (typeof callback === 'function') {
			oEmit.apply(socket, [event, data, callback]);
			return;
		}

		return new Promise(function (resolve, reject) {
			oEmit.apply(socket, [event, data, function (err, result) {
				if (err) reject(err);
				else resolve(result);
			}]);
		});
	};

	if (parseInt(app.user.uid, 10) >= 0) {
		addHandlers();
	}

	function addHandlers() {
		socket.on('connect', onConnect);

		socket.on('reconnecting', function () {
			// Wait 2s before firing
			setTimeout(function () {
				if (socket.disconnected) {
					onReconnecting();
				}
			}, 2000);
		});

		socket.on('disconnect', onDisconnect);

		socket.on('reconnect_failed', function () {
			// Wait ten times the reconnection delay and then start over
			setTimeout(socket.connect.bind(socket), parseInt(config.reconnectionDelay, 10) * 10);
		});

		socket.on('checkSession', function (uid) {
			if (parseInt(uid, 10) !== parseInt(app.user.uid, 10)) {
				app.handleInvalidSession();
			}
		});

		socket.on('setHostname', function (hostname) {
			app.upstreamHost = hostname;
		});

		socket.on('event:banned', onEventBanned);
		socket.on('event:alert', function (params) {
			app.alert(params);
		});

		socket.removeAllListeners('event:nodebb.ready');
		socket.on('event:nodebb.ready', function (data) {
			if ((data.hostname === app.upstreamHost) && (!app.cacheBuster || app.cacheBuster !== data['cache-buster'])) {
				app.cacheBuster = data['cache-buster'];

				app.alert({
					alert_id: 'forum_updated',
					title: '[[global:updated.title]]',
					message: '[[global:updated.message]]',
					clickfn: function () {
						window.location.reload();
					},
					type: 'warning',
				});
			}
		});
		socket.on('event:livereload', function () {
			if (app.user.isAdmin && !ajaxify.currentPage.match(/admin/)) {
				window.location.reload();
			}
		});
	}

	function onConnect() {
		if (!reconnecting) {
			app.showMessages();
			$(window).trigger('action:connected');
		}

		if (reconnecting) {
			var reconnectEl = $('#reconnect');
			var reconnectAlert = $('#reconnect-alert');

			reconnectEl.tooltip('destroy');
			reconnectEl.html('<i class="fa fa-check"></i>');
			reconnectAlert.fadeOut(500);
			reconnecting = false;

			reJoinCurrentRoom();

			socket.emit('meta.reconnected');

			$(window).trigger('action:reconnected');

			setTimeout(function () {
				reconnectEl.removeClass('active').addClass('hide');
			}, 3000);
		}
	}

	function reJoinCurrentRoom() {
		var	url_parts = window.location.pathname.slice(config.relative_path.length).split('/').slice(1);
		var room;

		switch (url_parts[0]) {
			case 'user':
				room = 'user/' + (ajaxify.data ? ajaxify.data.theirid : 0);
				break;
			case 'topic':
				room = 'topic_' + url_parts[1];
				break;
			case 'category':
				room = 'category_' + url_parts[1];
				break;
			case 'recent':
				room = 'recent_topics';
				break;
			case 'unread':
				room = 'unread_topics';
				break;
			case 'popular':
				room = 'popular_topics';
				break;
			case 'admin':
				room = 'admin';
				break;
			case 'categories':
				room = 'categories';
				break;
		}
		app.currentRoom = '';
		app.enterRoom(room);
	}

	function onReconnecting() {
		reconnecting = true;
		var reconnectEl = $('#reconnect');
		var reconnectAlert = $('#reconnect-alert');

		if (!reconnectEl.hasClass('active')) {
			reconnectEl.html('<i class="fa fa-spinner fa-spin"></i>');
			reconnectAlert.fadeIn(500).removeClass('hide');
		}

		reconnectEl.addClass('active').removeClass('hide').tooltip({
			placement: 'bottom',
		});
	}

	function onDisconnect() {
		$(window).trigger('action:disconnected');
	}

	function onEventBanned(data) {
		var message = data.until ? '[[error:user-banned-reason-until, ' + $.timeago(data.until) + ', ' + data.reason + ']]' : '[[error:user-banned-reason, ' + data.reason + ']]';

		bootbox.alert({
			title: '[[error:user-banned]]',
			message: message,
			closeButton: false,
			callback: function () {
				window.location.href = config.relative_path + '/';
			},
		});
	}

	if (
		config.socketioOrigins &&
		config.socketioOrigins !== '*:*' &&
		config.socketioOrigins.indexOf(location.hostname) === -1
	) {
		console.error(
			'You are accessing the forum from an unknown origin. This will likely result in websockets failing to connect. \n' +
			'To fix this, set the `"url"` value in `config.json` to the URL at which you access the site. \n' +
			'For more information, see this FAQ topic: https://community.nodebb.org/topic/13388'
		);
	}
}());
