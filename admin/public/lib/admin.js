var admin = {};

(function() {
	var canvas,
		menu;

	var WINDOW_OFFSET = 20;

	var windows = {
		opened: [],
		positions: [],
		zindex: 0
	};

	windows.init = function() {
		var opened = JSON.parse(localStorage.getItem('acp:windows:opened'));
		
		if (!opened || !opened.length) {
			windows.open('general/home');
		} else {
			for (var o in opened) {
				if (opened.hasOwnProperty(o)) {
					windows.open(opened[o]);
				}
			}
		}
	};

	function fixWindowPosition(el) {
		windows.zindex ++;

		do {
			position = el.position();
			
			if (windows.positions[position.left]) {
				if (windows.positions[position.left][position.top] === true) {
					el.css({top: position.top + WINDOW_OFFSET, left: position.left + WINDOW_OFFSET})
				} else {
					break;
				}
			} else {
				break;
			}
		} while(true);

		position = el.position();
		if (windows.positions[position.left]) {
			windows.positions[position.left][position.top] = true;
		} else {
			windows.positions[position.left] = [];
			windows.positions[position.left][position.top] = true;
		}

		el.css('zIndex', windows.zindex);
		$('.gui').css('zIndex', windows.zindex + 1);
	}

	windows.build = function(page) {
		var existing = $('[data-window="' + page + '"]');
		if (existing.length) {
			existing.show();
			fixWindowPosition(existing);
			return;
		}

		templates.parse('window', {}, function(html) {
			var el = $(html), position;
			$('#canvas').append(el);

			fixWindowPosition(el);

			el.attr('data-window', page);
		});
	};

	windows.hide = function(page) {
		var el = $('[data-window="' + page + '"]'),
			position = el.position();

		windows.positions[position.left][position.top] = false;
		el.hide();
	}

	windows.open = function(el) {
		if (!(el instanceof $)) {
			el = $('[data-page="' + el + '"]');
		}

		if (!el.length) {
			console.error('Page does not exist: ' + el);
			return false;
		}

		var page = el.attr('data-page'),
			arrIndex = windows.opened.indexOf(page);

		if (arrIndex === -1 || !el.hasClass('selected')) {
			if (arrIndex === -1) {
				windows.opened.push(page);	
				windows.build(page);
			}
			
			$('#menu .item').removeClass('selected');
			el.addClass('selected active');
			el.parents('.category').addClass('active');
		} else {
			windows.opened.splice(arrIndex, 1);
			el.removeClass('selected active');
			windows.open(windows.opened[windows.opened.length - 1]);
			windows.hide(page);
		}

		localStorage.setItem('acp:windows:opened', JSON.stringify(windows.opened));
	};


	function onConnect() {
		$('#profile').addClass('active').children('.avatar').attr('src', app.userpicture);
	}

	$(function() {
		canvas = canvas || $('#canvas');
		menu = menu || $('#menu');

		$('#menu .title').on('click', function() {
			$(this).parent().toggleClass('active');
		});

		$('#menu .item').on('click', function() {
			windows.open($(this));
		});

		templates.registerLoader(function(template, callback) {
			if (templates.cache[template]) {
				callback(templates.cache[template]);
			} else {
				$.ajax({
					url: RELATIVE_PATH + '/admin/templates/' + template + '.tpl' + (config['cache-buster'] ? '?v=' + config['cache-buster'] : ''),
					type: 'GET',
					success: function(data) {
						callback(data.toString());
					},
					error: function(error) {
						throw new Error("Unable to load template: " + template + " (" + error.statusText + ")");
					}
				});
			}
		});



		$(window).on('action:connected', onConnect);

		windows.init();
	});
}());