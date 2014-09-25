"use strict";
/*global app, socket*/


var admin = {},
	acp = {},
	windows = {
		opened: [],
		instances: {},
		positions: [],
		zindex: 0
	};

(function() {
	var canvas,
		menu;

	acp.enableColorPicker = function(inputEl, callback) {
		(inputEl instanceof jQuery ? inputEl : $(inputEl)).each(function() {
			var $this = $(this);

			$this.ColorPicker({
				color: $this.val() || '#000',
				onChange: function(hsb, hex) {
					$this.val('#' + hex);
					if (typeof callback === 'function') {
						callback(hsb, hex);
					}
				}
			});
		});
	};

	var WINDOW_OFFSET = 20;

	

	windows.init = function() {
		var opened = JSON.parse(localStorage.getItem('acp:windows:opened')),
			instances = JSON.parse(localStorage.getItem('acp:windows:instances')),
			focused = localStorage.getItem('acp:windows:focused');

		windows.instances = instances || {};
		
		templates.parse('admin/components/window', {}, function(windowTpl) {
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

	windows.addDropdownMenuItems = function(window, items) {
		var menu = $('[data-window="' + window + '"] .window-menu .dropdown-menu');

		for (var i in items) {
			if (items.hasOwnProperty(i)) {
				var item = items[i],
					list = $('<li><a href="' + (item.href ? item.href : '#') + '">' + item.title + '</a></li>');

				list.find('a').on('click', function(ev) {
					if (item.callback) {
						item.callback();
						ev.preventDefault();
						ev.stopPropagation();
						return false;
					}
				});

				menu.append(list).parents('.navbar-nav').removeClass('hidden');
			}
		}
	};

	function fixPosition(el) {
		do {
			var position = el.position();
			
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

		templates.parse('admin/components/window', {title: $('[data-page="' + page + '"]').html()}, function(html) {
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
				templates.parse('admin/' + page, data, function(html) {
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



		$(window).on('action:connected', onConnect);

		windows.init();
	});




	// START TEMP

	admin.enableColorPicker = function(inputEl, callback) {
		(inputEl instanceof jQuery ? inputEl : $(inputEl)).each(function() {
			var $this = $(this);

			$this.ColorPicker({
				color: $this.val() || '#000',
				onChange: function(hsb, hex) {
					$this.val('#' + hex);
					if (typeof callback === 'function') {
						callback(hsb, hex);
					}
				},
				onShow: function(colpkr) {
					$(colpkr).css('z-index', 1051);
				}
			});
		});
	};

	$(function() {
		var menuEl = $('.sidebar-nav'),
			liEls = menuEl.find('li'),
			parentEl,
			activate = function(li) {
				liEls.removeClass('active');
				li.addClass('active');
			};

		// also on ready, check the pathname, maybe it was a page refresh and no item was clicked
		liEls.each(function(i, li){
			li = $(li);
			if ((li.find('a').attr('href') || '').indexOf(location.pathname) >= 0) {
				activate(li);
			}
		});

		// On menu click, change "active" state
		menuEl.on('click', function(e) {
			parentEl = $(e.target).parent();
			if (parentEl.is('li')) {
				activate(parentEl);
			}
		});
	});

	socket.emit('admin.config.get', function(err, config) {
		if(err) {
			return app.alert({
				alert_id: 'config_status',
				timeout: 2500,
				title: 'Error',
				message: 'NodeBB encountered a problem getting config',
				type: 'danger'
			});
		}

		// move this to admin.config
		app.config = config;
	});
	// END TEMP
}());