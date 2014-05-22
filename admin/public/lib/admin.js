var admin = {};

(function() {
	var canvas,
		menu;

	var acp =  {};

	acp.loadTemplate = function(template, callback) {
		if (templates.cache[template]) {
			callback(templates.cache[template]);
		} else {
			$.ajax({
				url: RELATIVE_PATH + '/admin/templates/' + template + '.tpl' + (config['cache-buster'] ? '?v=' + config['cache-buster'] : ''),
				type: 'GET',
				success: function(data) {
					templates.cache[template] = data.toString();
					callback(data.toString());
				},
				error: function(error) {
					throw new Error("Unable to load template: " + template + " (" + error.statusText + ")");
				}
			});
		}
	};

	var WINDOW_OFFSET = 20;

	var windows = {
		opened: [],
		instances: {},
		positions: [],
		zindex: 0
	};

	windows.init = function() {
		var opened = JSON.parse(localStorage.getItem('acp:windows:opened')),
			instances = JSON.parse(localStorage.getItem('acp:windows:instances')),
			focused = localStorage.getItem('acp:windows:focused');

		windows.instances = instances;
		
		acp.loadTemplate('components/window', function() {
			if (!opened || !opened.length) {
				windows.toggle('general/home');
			} else {
				for (var o in opened) {
					if (opened.hasOwnProperty(o)) {
						windows.toggle(opened[o]);
					}
				}
			}
			
			if (focused) {
				windows.toggle(focused, 'open');
				bringToFront($('[data-window="' + focused + '"]'));
			}

			for (var i in instances) {
				if (instances.hasOwnProperty(i)) {
					var el = $('[data-window="' + i + '"]');

					el.css({
						width: instances[i].width + 'px',
						height: instances[i].height + 'px',
						top: instances[i].top + 'px',
						left: instances[i].left + 'px',
						zIndex: instances[i].zIndex
					});

					el.find('.panel-body > .content').css({
						height: instances[i].height - 145 + 'px'
					});

					if (instances[i].maximized) {
						maximizeWindow(el);
					}
				}
			}
		});
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
	}

	function bringToFront(el) {
		windows.zindex ++;
		el.css('zIndex', windows.zindex);
		$('.gui').css('zIndex', windows.zindex + 1);
		localStorage.setItem('acp:windows:focused', el.attr('data-window'));
	}

	function startTracking(el) {
		el.on('resize', function() {
			$(this).find('.panel-body > .content').css({
				height: $(this).height() - 145 + 'px'
			});

			setInstanceDimensions($(this));
			saveInstances();
		});

		el.on('drag', function() {
			setInstanceDimensions($(this));
			saveInstances();
		});
	}

	function setInstanceDimensions(el) {
		if (!el.length) {
			return;
		}

		var position = el.position();

		windows.instances[el.attr('data-window')] = windows.instances[el.attr('data-window')] || {};

		windows.instances[el.attr('data-window')].width = el.width();
		windows.instances[el.attr('data-window')].height = el.height();
		windows.instances[el.attr('data-window')].top = position.top;
		windows.instances[el.attr('data-window')].left = position.left;
		windows.instances[el.attr('data-window')].zIndex = el.css('zIndex');
	}

	function saveInstances() {
		localStorage.setItem('acp:windows:instances', JSON.stringify(windows.instances));
	}

	function maximizeWindow(el) {
		setInstanceDimensions(el);

		if (el.hasClass('maximized')) {
			el.resizable().draggable({handle: '.panel-heading.draggable'}).removeClass('maximized');
			windows.instances[el.attr('data-window')].maximized = false;
			setInstanceDimensions(el);
		} else {
			el.resizable('destroy').draggable('destroy').addClass('maximized');
			windows.instances[el.attr('data-window')].maximized = true;
		}

		var zindex = el.css('zIndex');
		windows.zindex = windows.zindex < zindex ? zindex : windows.zindex;
		$('.gui').css('zIndex', windows.zindex + 1);
		
		saveInstances();
	}

	windows.build = function(page) {
		var existing = $('[data-window="' + page + '"]');
		if (existing.length) {
			existing.removeClass('hidden');
			fixPosition(existing);
			bringToFront(existing);

			startTracking(existing);
			return;
		}

		templates.parse('components/window', {title: $('[data-page="' + page + '"]').html()}, function(html) {
			var el = $(html), position;
			$('#canvas').append(el);

			el.addClass('invisible');

			fixPosition(el);

			el.attr('data-window', page);

			el.find('.btn-close').on('click', function(ev) {
				windows.toggle($(this).parents('[data-window]').attr('data-window'), 'close');
				ev.stopPropagation();
				ev.preventDefault();
				return false;
			});

			el.on('mousedown', function() {
				windows.toggle($(this).attr('data-window'), 'open');
				bringToFront($(this));
			});

			el.draggable({
				handle: '.panel-heading.draggable'
			}).resizable();

			el.find('.panel-heading').on('dblclick', function() {
				maximizeWindow($(this));
			});

			$.get(RELATIVE_PATH + '/api/admin/' + page, function(data) {
				templates.parse(page, data, function(html) {
					el.find('.content').html(html);

					ajaxify.loadScript('admin/' + page, function() {
						el.removeClass('invisible');

						bringToFront(el);
						startTracking(el);
					});
				});
			});
		});
	};

	windows.hide = function(page) {
		var el = $('[data-window="' + page + '"]'),
			position = el.position();

		if (windows.positions[position.left]) {
			windows.positions[position.left][position.top] = false;	
		}
		
		el.addClass('hidden');
	}

	windows.toggle = function(el, mode) {
		if (!(el instanceof $)) {
			el = $('[data-page="' + el + '"]');
		}

		var page = el.attr('data-page'),
			arrIndex = windows.opened.indexOf(page);

		if (!page) {
			return;
		}

		if ((arrIndex === -1 || !el.hasClass('selected')) && mode !== 'close' || mode === 'open') {
			if (arrIndex === -1) {
				windows.opened.push(page);	
				windows.build(page);
			} else {
				bringToFront($('[data-window="' + page + '"]'));
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

		templates.registerLoader(acp.loadTemplate);



		$(window).on('action:connected', onConnect);

		windows.init();
	});
}());