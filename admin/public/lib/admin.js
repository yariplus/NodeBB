var admin = {};

(function() {
	var canvas,
		menu;


	var windows = {};
	windows.init = function() {

	};




	$(function() {
		canvas = canvas || $('#canvas');
		menu = menu || $('#menu');

		$('.menu .category .title').on('click', function() {
			$(this).parent().toggleClass('active');
		});

		/*templates.registerLoader(function(template, callback) {
			if (templates.cache[template]) {
				callback(templates.cache[template]);
			} else {
				$.ajax({
					url: RELATIVE_PATH + '/templates/' + template + '.tpl' + (config['cache-buster'] ? '?v=' + config['cache-buster'] : ''),
					type: 'GET',
					success: function(data) {
						callback(data.toString());
					},
					error: function(error) {
						throw new Error("Unable to load template: " + template + " (" + error.statusText + ")");
					}
				});
			}
		});*/

		windows.init();
	});
}());