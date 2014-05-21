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
			windows.toggle('general/home');
		} else {
			for (var o in opened) {
				if (opened.hasOwnProperty(o)) {
					windows.toggle(opened[o]);
				}
			}
		}
	};

	function fixPosition(el) {
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

		bringToFront(el);
	}

	function bringToFront(el) {
		windows.zindex ++;
		el.css('zIndex', windows.zindex);
		$('.gui').css('zIndex', windows.zindex + 1);
	}

	windows.build = function(page) {
		var existing = $('[data-window="' + page + '"]');
		if (existing.length) {
			existing.show();
			fixPosition(existing);
			return;
		}

		templates.parse('window', {}, function(html) {
			var el = $(html), position;
			$('#canvas').append(el);

			fixPosition(el);

			el.attr('data-window', page);

			el.find('.btn-close').on('click', function() {
				windows.toggle($(this).parents('[data-window]').attr('data-window'), 'close');
			});

			el.on('click', function() {
				console.log('test');
				bringToFront($(this));
			});
		});
	};

	windows.hide = function(page) {
		var el = $('[data-window="' + page + '"]'),
			position = el.position();

		windows.positions[position.left][position.top] = false;
		el.hide();
	}

	windows.toggle = function(el, mode) {
		if (!(el instanceof $)) {
			el = $('[data-page="' + el + '"]');
		}

		var page = el.attr('data-page'),
			arrIndex = windows.opened.indexOf(page);

		if ((arrIndex === -1 || !el.hasClass('selected')) && mode !== 'close' || mode === 'open') {
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
			windows.toggle(windows.opened[windows.opened.length - 1], 'open');
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
			windows.toggle($(this));
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