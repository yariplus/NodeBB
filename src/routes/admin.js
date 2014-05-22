"use strict";


function generalRoutes(app, middleware, controllers) {
	/*app.get('/admin/', middleware.admin.buildHeader, controllers.admin.home);
	app.get('/admin/index', middleware.admin.buildHeader, controllers.admin.home);
	app.get('/api/admin/index', controllers.admin.home);*/

	app.namespace('/api/admin/general', function() {
		app.get('/home', controllers.admin.home);
		app.get('/settings', controllers.admin.settings.get);
		app.get('/languages', controllers.admin.languages.get);
		app.get('/sounds', controllers.admin.sounds.get);
	});
}

function manageRoutes(app, middleware, controllers) {
	app.namespace('/api/admin/manage', function() {
		app.get('/categories', controllers.admin.categories.active);
		app.get('/categories/disabled', controllers.admin.categories.disabled);

		app.get('/users/search', controllers.admin.users.search);
		app.get('/users/latest', controllers.admin.users.sortByJoinDate);
		app.get('/users/sort-posts', controllers.admin.users.sortByPosts);
		app.get('/users/sort-reputation', controllers.admin.users.sortByReputation);
		app.get('/users', controllers.admin.users.sortByJoinDate);

		app.get('/groups', controllers.admin.groups.get);
	});
}

function appearanceRoutes(app, middleware, controllers) {
	app.namespace('/api/admin/appearance', function() {
		app.get('/themes', controllers.admin.themes.get);
	});
}

function extendRoutes(app, middleware, controllers)  {
	app.namespace('/api/admin/extend', function() {
		app.get('/plugins', controllers.admin.plugins.get);
	});
}

function advancedRoutes(app, middleware, controllers) {
	app.namespace('/api/admin/advanced', function() {
		app.get('/database', controllers.admin.database.get);
		app.get('/events', controllers.admin.events.get);
		app.get('/logger', controllers.admin.logger.get);
	});
}


function apiRoutes(app, middleware, controllers) {
	// todo, needs to be in api namespace
	app.get('/admin/users/csv', middleware.authenticate, controllers.admin.users.getCSV);

	app.post('/admin/category/uploadpicture', middleware.authenticate, controllers.admin.uploads.uploadCategoryPicture);
	app.post('/admin/uploadfavicon', middleware.authenticate, controllers.admin.uploads.uploadFavicon);
	app.post('/admin/uploadlogo', middleware.authenticate, controllers.admin.uploads.uploadLogo);
	app.post('/admin/uploadgravatardefault', middleware.authenticate, controllers.admin.uploads.uploadGravatarDefault);
}

module.exports = function(app, middleware, controllers) {
	generalRoutes(app, middleware, controllers);
	manageRoutes(app, middleware, controllers);
	appearanceRoutes(app, middleware, controllers);
	extendRoutes(app, middleware, controllers);
	advancedRoutes(app, middleware, controllers);
	apiRoutes(app, middleware, controllers);
};
