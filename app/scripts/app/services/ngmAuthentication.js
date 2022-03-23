/**
 * @name ngmReportHubApp.factory:ngmUser
 * @description
 * # ngmAccess
 * Manages browser local storage
 *
 * @name ngmReportHubApp.factory:ngmUser
 * @description
 * # ngmAccess
 * Manages browser local storage
 *
 */
angular.module('ngmReportHub')
	.factory('ngmUser', ['$injector', 'ngmLists', '$localForage', 'ngmLocalDB', function ($injector, ngmLists, $localForage, ngmLocalDB) {

		return {

			// get user from storage
			get: function () {
				return ngmLists.getObject('auth_token');
			},

			// set user to storage
			set: function (user) {
				// user last_logged_in & set
				user.last_logged_in = user.last_logged_in ? moment().format(user.last_logged_in) : moment().format();
				user.dashboard_visits = 0;
				localStorage.setObject('auth_token', user);
				ngmLists.setObject('auth_token', user);
				// set lists
				if (!user.guest) {
					$injector.get('ngmClusterLists').setClusterLists(user);
				}
			},

			// unset user from storage
			unset: function () {
				// remove lists / user
				localStorage.removeItem('lists');
				localStorage.removeItem('auth_token');
				ngmLists.removeItem('lists')
				ngmLists.removeItem('auth_token');
				ngmLocalDB.removeItem('lists');
			},

			// check user role
			hasRole: function (role) {
				// get from storage
				var user = ngmLists.getObject('auth_token');
				// if no user
				if (!user) return false;
				// else has role?
				return angular.uppercase(user.roles).indexOf(angular.uppercase(role)) >= 0;
			},

			// match any role
			hasAnyRole: function (roles) {
				var user = ngmLists.getObject('auth_token');
				return !!user.roles.filter(function (role) {
					return angular.uppercase(roles).indexOf(angular.uppercase(role)) >= 0;
				}).length;
			}

		};
	}])
	/**
	 * PERMISSIONs definitions array of obj for each ROLE
	 * User permission zones: adminRpcode, admin0pcode, cluster_id, organization_tag
	 * @typedef UserPermissions
	 * @type {object}
	 * @property {string} ROLE - role name.
	 * @property {boolean} EDIT - EDIT permission allowed.
	 * @property {string[]} EDIT_RESTRICTED - EDIT allowed permission user zones: allow EDIT if all hold true.
	 * @property {boolean} EDIT_USER - EDIT_USER permission allowed.
	 * @property {string[]} EDIT_USER_RESTRICTED - EDIT_USER allowed permission user zones: allow EDIT if all hold true.
	 * @property {string[]} ADMIN_RESTRICTED - ADMIN dashboard starting url params zones.
	 * @property {string[]} ADMIN_MENU - ADMIN dashboard user menu zones.
	 * @property {string[]} DASHBOARD_RESTRICTED - Generic dashboard starting url params zones.
	 * @property {string[]} DASHBOARD_MENU - Generic dashboard user menu zones.
	 * @property {number} LEVEL - ROLE priority level (for selecting filters, e.g. ADMIN dashboard uses max priority).
	 * @returns {UserPermissions[]} - Array of Roles permission definitions.
	 */
	.constant( 'ngmPermissions', [{
			ROLE: 'PUBLIC',
			EDIT: false,
			EDIT_USER: false,
			EDIT_USER_CLUSTER:false,
			EDIT_USER_CLUSTER_RESTRICTED:[],
			EDIT_USER_ORG:false,
			EDIT_USER_ORG_RESTRICTED:[],
			EDIT_ORGANIZATION:false,
			EDIT_ORGANIZATION_RESTRICTED:[],
			ADMIN: false,
			ADMIN_RESTRICTED: [ 'admin0pcode', 'organization_tag' ],
			ADMIN_MENU: [ 'cluster_id', 'report_id' ],
			DASHBOARD_RESTRICTED: [],
			DASHBOARD_MENU: [ 'adminRpcode', 'admin0pcode', 'cluster_id', 'organization_tag' ],
			TEAM_RESTRICTED: [],
			TEAM_MENU: [],
			VALIDATE: false,
			MULTICOUNTRY: false,
			LEVEL: 0,
			DESCRIPTION: 'Public Access'
		},{
			ROLE: 'USER',
			EDIT: true,
			EDIT_RESTRICTED: ['organization_tag', 'admin0pcode', 'adminRpcode' ],
			EDIT_USER: false,
			EDIT_USER_CLUSTER:false,
			EDIT_USER_CLUSTER_RESTRICTED:[],
			EDIT_USER_ORG:false,
			EDIT_USER_ORG_RESTRICTED:[],
			EDIT_USER_RESTRICTED: ['organization_tag', 'admin0pcode', 'adminRpcode'],
			EDIT_ORGANIZATION:false,
			EDIT_ORGANIZATION_RESTRICTED:[],
			ADMIN: false,
			ADMIN_RESTRICTED: [ 'adminRpcode','admin0pcode', 'organization_tag' ],
			ADMIN_MENU: [ 'cluster_id', 'report_id' ],
			DASHBOARD_RESTRICTED: [ 'adminRpcode', 'admin0pcode', 'organization_tag' ],
			DASHBOARD_MENU: [ 'cluster_id' ],
			DASHBOARD_DOWNLOAD: true,
			DASHBOARD_DOWNLOAD_RESTRICTED: ['organization_tag', 'admin0pcode', 'adminRpcode'],
			TEAM_RESTRICTED: [ 'admin0pcode', 'organization_tag' ],
			TEAM_MENU: [ 'cluster_id', 'report_id' ],
			PROJECT_RESTRICTED: ['adminRpcode','admin0pcode', 'organization_tag'],
			PROJECT_MENU: ['cluster_id'],
			VALIDATE: false,
			MULTICOUNTRY: false,
			LEVEL: 1,
			DESCRIPTION: 'The USER can add, edit and update reports for your Organization'
		},
		{
			ROLE: 'ORG',
			EDIT: true,
			EDIT_RESTRICTED: ['organization_tag', 'admin0pcode', 'adminRpcode'],
			EDIT_USER: true,
			EDIT_USER_CLUSTER:true,
			EDIT_USER_CLUSTER_RESTRICTED:[],
			EDIT_USER_ORG:false,
			EDIT_USER_ORG_RESTRICTED:[],
			EDIT_USER_ROLES: [ 'USER', 'ORG' ],
			EDIT_USER_RESTRICTED: ['organization_tag', 'admin0pcode', 'adminRpcode'],
			EDIT_ORGANIZATION:true,
			EDIT_ORGANIZATION_RESTRICTED: ['organization_tag'],
			ADMIN: true,
			ADMIN_RESTRICTED: ['adminRpcode','admin0pcode', 'organization_tag' ],
			ADMIN_MENU: [ 'cluster_id', 'report_id' ],
			DASHBOARD_RESTRICTED: [ 'adminRpcode', 'admin0pcode', 'organization_tag' ],
			DASHBOARD_MENU: [ 'cluster_id' ],
			DASHBOARD_DOWNLOAD: true,
			DASHBOARD_DOWNLOAD_RESTRICTED: ['organization_tag', 'admin0pcode', 'adminRpcode'],
			TEAM_RESTRICTED: [ 'admin0pcode', 'organization_tag' ],
			TEAM_MENU: [ 'cluster_id' ],
			PROJECT_RESTRICTED: ['adminRpcode','admin0pcode', 'organization_tag'],
			PROJECT_MENU: ['cluster_id'],
			VALIDATE: false,
			MULTICOUNTRY: false,
			LEVEL: 2,
			DESCRIPTION: 'The ORG role is to manage the USERS of your Organization'
		},
		{
			ROLE: 'CLUSTER_OBSERVER',
			EDIT: false,
			EDIT_RESTRICTED: ['cluster_id', 'admin0pcode', 'adminRpcode'],
			EDIT_USER: false,
			EDIT_USER_CLUSTER: false,
			EDIT_USER_CLUSTER_RESTRICTED: [],
			EDIT_USER_ORG: false,
			EDIT_USER_ORG_RESTRICTED: [],
			EDIT_USER_ROLES: ['USER', 'CLUSTER_OBSERVER'],
			EDIT_USER_RESTRICTED: [],
			EDIT_ORGANIZATION: false,
			EDIT_ORGANIZATION_RESTRICTED: [],
			ADMIN: true,
			ADMIN_RESTRICTED: ['adminRpcode', 'admin0pcode', 'cluster_id'],
			ADMIN_MENU: ['organization_tag', 'report_id'],
			DASHBOARD_RESTRICTED: ['adminRpcode', 'admin0pcode', 'cluster_id'],
			DASHBOARD_MENU: ['organization_tag'],
			DASHBOARD_DOWNLOAD: true,
			DASHBOARD_DOWNLOAD_RESTRICTED: ['cluster_id', 'admin0pcode', 'adminRpcode'],
			TEAM_RESTRICTED: ['admin0pcode', 'cluster_id'],
			TEAM_MENU: ['organization_tag'],
			PROJECT_RESTRICTED: ['adminRpcode', 'admin0pcode', 'cluster_id'],
			PROJECT_MENU: ['organization_tag'],
			VALIDATE: true,
			MULTICOUNTRY: false,
			LEVEL: 2,
			DESCRIPTION: 'The CLUSTER_OBSERVER role acts as an observer and can view (but not edit)  of your Sectoe'
		},
		{
			ROLE: 'CLUSTER',
			EDIT: true,
			EDIT_RESTRICTED: ['cluster_id', 'admin0pcode', 'adminRpcode'],
			EDIT_USER: true,
			EDIT_USER_CLUSTER:true,
			EDIT_USER_CLUSTER_RESTRICTED:[],
			EDIT_USER_ORG:false,
			EDIT_USER_ORG_RESTRICTED:[],
			EDIT_USER_ROLES: ['USER', 'ORG', 'CLUSTER_OBSERVER','CLUSTER' ],
			EDIT_USER_RESTRICTED: ['cluster_id', 'admin0pcode', 'adminRpcode'],
			EDIT_ORGANIZATION:true,
			EDIT_ORGANIZATION_RESTRICTED:[],
			ADMIN: true,
			ADMIN_RESTRICTED: ['adminRpcode','admin0pcode', 'cluster_id' ],
			ADMIN_MENU: [ 'organization_tag', 'report_id' ],
			DASHBOARD_RESTRICTED: [ 'adminRpcode', 'admin0pcode', 'cluster_id' ],
			DASHBOARD_MENU: [ 'organization_tag' ],
			DASHBOARD_DOWNLOAD: true,
			DASHBOARD_DOWNLOAD_RESTRICTED: ['cluster_id', 'admin0pcode', 'adminRpcode'],
			TEAM_RESTRICTED: [ 'admin0pcode', 'cluster_id' ],
			TEAM_MENU: [ 'organization_tag' ],
			PROJECT_RESTRICTED: ['adminRpcode','admin0pcode', 'cluster_id' ],
			PROJECT_MENU: ['organization_tag'],
			VALIDATE: true,
			MULTICOUNTRY: false,
			LEVEL: 3,
			DESCRIPTION: 'The CLUSTER role is to manage the partners and projects of your Sector'
		},
		{
			ROLE: 'COUNTRY',
			EDIT: false,
			EDIT_RESTRICTED: ['admin0pcode', 'adminRpcode'],
			EDIT_USER: false,
			EDIT_USER_CLUSTER:true,
			EDIT_USER_CLUSTER_RESTRICTED:[],
			EDIT_USER_ORG:false,
			EDIT_USER_ORG_RESTRICTED:[],
			EDIT_USER_ROLES: ['USER', 'ORG', 'CLUSTER_OBSERVER','CLUSTER', 'COUNTRY' ],
			EDIT_USER_RESTRICTED: ['admin0pcode', 'adminRpcode'],
			EDIT_ORGANIZATION:false,
			EDIT_ORGANIZATION_RESTRICTED:[],
			ADMIN: false,
			ADMIN_RESTRICTED: ['adminRpcode','admin0pcode' ],
			ADMIN_MENU: [ 'cluster_id', 'report_id', 'organization_tag' ],
			DASHBOARD_RESTRICTED: [ 'admin0pcode', 'adminRpcode' ],
			DASHBOARD_MENU: [ 'cluster_id', 'organization_tag' ],
			DASHBOARD_DOWNLOAD: true,
			DASHBOARD_DOWNLOAD_RESTRICTED: ['admin0pcode', 'adminRpcode'],
			TEAM_RESTRICTED: [ 'admin0pcode' ],
			TEAM_MENU: [ 'cluster_id', 'organization_tag' ],
			PROJECT_RESTRICTED: ['adminRpcode','admin0pcode'],
			PROJECT_MENU: ['cluster_id', 'organization_tag'],
			VALIDATE: true,
			MULTICOUNTRY: false,
			LEVEL: 4,
			DESCRIPTION: 'The COUNTRY role acts as an observer and can view (but not edit) all Sectors of your COUNTRY'
		},
		{
			ROLE: 'COUNTRY_ADMIN',
			EDIT: true,
			EDIT_RESTRICTED: [ 'admin0pcode', 'adminRpcode'],
			EDIT_USER: true,
			EDIT_USER_CLUSTER:true,
			EDIT_USER_CLUSTER_RESTRICTED:[],
			EDIT_USER_ORG:true,
			EDIT_USER_ORG_RESTRICTED: ['admin0pcode'],
			EDIT_USER_ROLES: ['USER', 'ORG', 'CLUSTER_OBSERVER', 'CLUSTER', 'COUNTRY', 'COUNTRY_ADMIN' ],
			EDIT_USER_RESTRICTED: ['admin0pcode', 'adminRpcode'],
			EDIT_ORGANIZATION:true,
			EDIT_ORGANIZATION_RESTRICTED:[],
			ADMIN: true,
			ADMIN_RESTRICTED: ['adminRpcode','admin0pcode' ],
			ADMIN_MENU: [ 'cluster_id', 'report_id', 'organization_tag' ],
			DASHBOARD_RESTRICTED: [ 'admin0pcode', 'adminRpcode' ],
			DASHBOARD_MENU: [ 'cluster_id', 'organization_tag' ],
			DASHBOARD_DOWNLOAD: true,
			DASHBOARD_DOWNLOAD_RESTRICTED: ['admin0pcode', 'adminRpcode'],
			TEAM_RESTRICTED: [ 'admin0pcode' ],
			TEAM_MENU: [ 'cluster_id', 'organization_tag' ],
			PROJECT_RESTRICTED: ['adminRpcode','admin0pcode'],
			PROJECT_MENU: ['cluster_id', 'organization_tag'],
			VALIDATE: false,
			MULTICOUNTRY: false,
			LEVEL: 4,
			DESCRIPTION: 'The COUNTRY_ADMIN manages the partners and projects of your COUNTRY'
		},
		{
			ROLE: 'REGION_ORG',
			EDIT: false,
			EDIT_RESTRICTED: ['organization_tag', 'adminRpcode'],
			EDIT_USER: false,
			EDIT_USER_CLUSTER:false,
			EDIT_USER_CLUSTER_RESTRICTED:[],
			EDIT_USER_ORG:false,
			EDIT_USER_ORG_RESTRICTED:[],
			EDIT_USER_RESTRICTED: ['adminRpcode', 'organization_tag'],
			EDIT_ORGANIZATION:false,
			EDIT_ORGANIZATION_RESTRICTED:[],
			ADMIN: false,
			ADMIN_RESTRICTED: [ 'adminRpcode', 'organization_tag' ],
			ADMIN_MENU: [ 'admin0pcode', 'cluster_id', 'report_id' ],
			DASHBOARD_RESTRICTED: [ 'adminRpcode', 'organization_tag' ],
			DASHBOARD_MENU: [ 'admin0pcode', 'cluster_id' ],
			DASHBOARD_DOWNLOAD: true,
			DASHBOARD_DOWNLOAD_RESTRICTED: ['organization_tag', 'adminRpcode'],
			TEAM_RESTRICTED: [ 'adminRpcode', 'organization_tag' ],
			TEAM_MENU: [ 'admin0pcode', 'cluster_id' ],
			PROJECT_RESTRICTED: ['adminRpcode', 'organization_tag'],
			PROJECT_MENU: ['admin0pcode', 'cluster_id'],
			VALIDATE: false,
			MULTICOUNTRY: true,
			LEVEL: 5,
			DESCRIPTION: 'The REGION_ORG role can view projects in your Region for your Organization'
		},
		{
			ROLE: 'REGION',
			EDIT: false,
			EDIT_RESTRICTED: ['adminRpcode'],
			EDIT_USER: false,
			EDIT_USER_CLUSTER:false,
			EDIT_USER_CLUSTER_RESTRICTED:[],
			EDIT_USER_ORG:false,
			EDIT_USER_ORG_RESTRICTED:[],
			EDIT_USER_RESTRICTED: ['adminRpcode'],
			EDIT_ORGANIZATION:false,
			EDIT_ORGANIZATION_RESTRICTED:[],
			ADMIN: false,
			ADMIN_RESTRICTED: [ 'adminRpcode' ],
			ADMIN_MENU: [ 'admin0pcode', 'cluster_id', 'report_id', 'organization_tag' ],
			DASHBOARD_RESTRICTED: [ 'adminRpcode' ],
			DASHBOARD_MENU: [ 'admin0pcode', 'cluster_id', 'organization_tag' ],
			DASHBOARD_DOWNLOAD: true,
			DASHBOARD_DOWNLOAD_RESTRICTED: ['adminRpcode'],
			TEAM_RESTRICTED: [ 'adminRpcode' ],
			TEAM_MENU: [ 'admin0pcode', 'cluster_id', 'organization_tag' ],
			PROJECT_RESTRICTED: ['adminRpcode'],
			PROJECT_MENU: ['admin0pcode', 'cluster_id', 'organization_tag'],
			VALIDATE: false,
			MULTICOUNTRY: true,
			LEVEL: 6,
			DESCRIPTION: 'The REGION role can view projects in your Region for all Sectors'
		},
		{
			ROLE: 'HQ_ORG',
			EDIT: false,
			EDIT_RESTRICTED: ['organization_tag'],
			EDIT_USER: false,
			EDIT_USER_CLUSTER:false,
			EDIT_USER_CLUSTER_RESTRICTED:[],
			EDIT_USER_ORG:false,
			EDIT_USER_ORG_RESTRICTED:[],
			EDIT_USER_RESTRICTED: ['organization_tag'],
			EDIT_ORGANIZATION:false,
			EDIT_ORGANIZATION_RESTRICTED:[],
			ADMIN: false,
			ADMIN_RESTRICTED: [ 'organization_tag' ],
			ADMIN_MENU: [ 'adminRpcode', 'admin0pcode', 'cluster_id', 'report_id' ],
			DASHBOARD_RESTRICTED: [ 'organization_tag' ],
			DASHBOARD_MENU: [ 'adminRpcode', 'admin0pcode', 'cluster_id' ],
			DASHBOARD_DOWNLOAD: true,
			DASHBOARD_DOWNLOAD_RESTRICTED: ['organization_tag'],
			TEAM_RESTRICTED: [ 'organization_tag' ],
			TEAM_MENU: [ 'adminRpcode', 'admin0pcode', 'cluster_id' ],
			PROJECT_RESTRICTED: ['organization_tag'],
			PROJECT_MENU: ['adminRpcode', 'admin0pcode', 'cluster_id'],
			VALIDATE: false,
			MULTICOUNTRY: true,
			LEVEL: 7,
			DESCRIPTION: 'The HQ_ORG role can view projects Globally for your Organisation'
		},
		{
			ROLE: 'HQ',
			EDIT: false,
			EDIT_RESTRICTED: [],
			EDIT_USER: false,
			EDIT_USER_CLUSTER:false,
			EDIT_USER_CLUSTER_RESTRICTED:[],
			EDIT_USER_ORG:false,
			EDIT_USER_ORG_RESTRICTED:[],
			EDIT_USER_RESTRICTED: [],
			EDIT_ORGANIZATION:false,
			EDIT_ORGANIZATION_RESTRICTED:[],
			ADMIN: false,
			ADMIN_RESTRICTED: [],
			ADMIN_MENU: [ 'adminRpcode', 'admin0pcode', 'cluster_id', 'report_id', 'organization_tag' ],
			DASHBOARD_RESTRICTED: [],
			DASHBOARD_MENU: [ 'adminRpcode', 'admin0pcode', 'cluster_id', 'organization_tag' ],
			DASHBOARD_DOWNLOAD: true,
			DASHBOARD_DOWNLOAD_RESTRICTED: [],
			TEAM_RESTRICTED: [],
			TEAM_MENU: [ 'adminRpcode', 'admin0pcode', 'cluster_id', 'organization_tag' ],
			PROJECT_RESTRICTED: [],
			PROJECT_MENU: ['adminRpcode', 'admin0pcode', 'cluster_id', 'organization_tag'],
			VALIDATE: false,
			MULTICOUNTRY: true,
			LEVEL: 8,
			DESCRIPTION: 'The HQ role can view projects Globally for your all Sectors'
		},
		{
			ROLE: 'SUPERADMIN',
			EDIT: true,
			EDIT_RESTRICTED: [],
			EDIT_USER: true,
			EDIT_USER_CLUSTER:false,
			EDIT_USER_CLUSTER_RESTRICTED:[],
			EDIT_USER_ORG:false,
			EDIT_USER_ORG_RESTRICTED:[],
			EDIT_USER_ROLES: ['USER', 'ORG', 'CLUSTER_OBSERVER', 'CLUSTER', 'COUNTRY', 'COUNTRY_ADMIN', 'REGION_ORG', 'REGION', 'HQ_ORG', 'HQ', 'SUPERADMIN'],
			EDIT_USER_RESTRICTED: [],
			EDIT_ORGANIZATION:true,
			EDIT_ORGANIZATION_RESTRICTED:[],
			ADMIN: true,
			ADMIN_RESTRICTED: [],
			ADMIN_MENU: [ 'adminRpcode', 'admin0pcode', 'cluster_id', 'report_id', 'organization_tag' ],
			DASHBOARD_RESTRICTED: [],
			DASHBOARD_MENU: [ 'adminRpcode', 'admin0pcode', 'cluster_id', 'organization_tag' ],
			DASHBOARD_DOWNLOAD: true,
			DASHBOARD_DOWNLOAD_RESTRICTED: [],
			TEAM_RESTRICTED: [],
			TEAM_MENU: [ 'adminRpcode', 'admin0pcode', 'cluster_id', 'organization_tag' ],
			PROJECT_RESTRICTED: [],
			PROJECT_MENU: ['adminRpcode', 'admin0pcode', 'cluster_id', 'organization_tag'],
			VALIDATE: true,
			MULTICOUNTRY: true,
			LEVEL: 9,
			DESCRIPTION: 'Beware, here be dragons!'
		}]
   )
	.factory( 'ngmAuth', [ '$q', '$route', '$http', '$location', '$timeout', 'ngmUser', 'ngmPermissions', function( $q, $route, $http, $location, $timeout, ngmUser, ngmPermissions ) {
		// auth
		var ngmAuth = {

			OK: 200,
			UNAUTHORIZED: 401,
			FORBIDDEN: 403,
			LOCATION: $location.protocol() + '://' + $location.host() + ':' + $location.port(),
			APP: $location.path().split('/')[1],
			// variable to store URL, if the user goes to a certain URL but the user, has not logged in yet
			redirectToUrlAfterLogin:'',

			// guest
			GUEST: {
				adminRpcode: 'HQ',
				adminRname: 'Global',
				admin0pcode: 'all',
				admin0name: 'All',
				guest: true,
				visits: 1,
				cluster_id: 'all',
				cluster: 'All',
				organization: 'All',
				organization_tag: 'all',
				username: 'welcome',
				email: 'public@immap.org',
				roles: ['USER', 'ADMIN', 'SUPERADMIN', 'PUBLIC']
			},

			// register
			register: function (user) {

				// set the $http object
				var register = $http({
					method: 'POST',
					url: this.LOCATION + '/api/create',
					data: user
				});

				// register success
				register.then(function (result) {

					if (!result.data.err && !result.data.summary) {
						// unset guest
						ngmUser.unset();
						// set localStorage
						ngmUser.set(result.data);
						// manage session
						ngmAuth.setSessionTimeout(result.data);
					}

				}).catch(function (err) {
					// update
					// Materialize.toast( 'Error!', 6000, 'error' );
					M.toast({ html: 'Error!', displayLength: 6000, classes: 'error' });
				});

				return register;
			},

			// update user profile
			updateProfile: function (user) {

				if (user.user['api_key'] === undefined || user.user['api_key'] === '') {
					function uniqueApiKey() {
						return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
							var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
							return v.toString(16);
						});
					}
					user.user['api_key'] = uniqueApiKey();
				}

				// set the $http object
				var update = $http({
					method: 'POST',
					url: this.LOCATION + '/api/profile/update',
					data: user
				});

				// on success store in localStorage
				update.then(function (result) {
					//  success handles in controller.authentication.js
				}).catch(function (err) {
					// update
					// Materialize.toast( 'Error!', 6000, 'error' );
					M.toast({ html: 'Error!', displayLength: 6000, classes: 'error' });
				});

				return update;
			},

			// login
			login: function (user) {

				// set the $http object
				var login = $http({
					method: 'POST',
					url: this.LOCATION + '/api/login',
					data: user
				});

				// on success store in localStorage
				login.then(function (result) {

					if (!result.data.err && !result.data.summary) {
						// unset guest
						ngmUser.unset();
						// set localStorage
						ngmUser.set(result.data);
						// manage session
						ngmAuth.setSessionTimeout(result.data);
					}

				}).catch(function (err) {
					// update
					// Materialize.toast( 'Error!', 6000, 'error' );
					M.toast({ html: 'Error!', displayLength: 6000, classes: 'error' });
				});

				return login;
			},

			passwordResetSend: function (user) {

				var reset = $http({
					method: 'POST',
					url: this.LOCATION + '/api/send-email',
					data: user
				});

				return reset;
			},

			passwordReset: function (user) {

				// set the $http object
				var reset = $http({
					method: 'POST',
					url: this.LOCATION + '/api/password-reset',
					data: user
				});

				// on success store in localStorage
				reset.then(function (result) {
					if (!result.data.err && !result.data.summary) {
						// unset guest
						ngmUser.unset();
						// set user
						ngmUser.set(result.data);
					}
				}).catch(function (err) {
					// update
					// Materialize.toast( 'Error!', 6000, 'error' );
					M.toast({ html: 'Error!', displayLength: 6000, classes: 'error' });
				});;

				return reset;
			},

			logout: function () {

				// rotate icon
				// $('.ngm-profile-icon').toggleClass('rotate');
				$('.ngm-profile-icon').toggleClass('open');
				// set class
				$('.ngm-profile').toggleClass('active');
				$('.ngm-profile-menu-content').toggleClass('active');
				// toggle menu dropdown
				$('.ngm-profile-menu-content').slideToggle();

				// unset token, backend dosnt care about logouts
				ngmUser.unset();
				$location.path('/login');
				// $location.path( '/' + $location.$$path.split('/')[1] + '/login' );

			},

			// Manages client session timeout
			setSessionTimeout: function (user) {

				// tmp fix
				if (!user || !user.last_logged_in) {
					// unset localStorage
					ngmUser.unset();
				} else {
					// get minutes since last login
					var minutes =
						moment.duration(moment().diff(user.last_logged_in)).asMinutes();

					// ( 24 * 60 ) = 1440 minutes
					if (minutes > (24 * 60)) {

						// unset localStorage
						ngmUser.unset();

						// redirect to login
						$location.path('/' + ngmAuth.APP + '/login');

					}
				}

			},

			// setup a public user
			grantPublicAccess: function (role) {

				var deferred = $q.defer();

				// if no user exists
				if (!ngmUser.get()) {
					// set guest to localStorage
					ngmUser.set(ngmAuth.GUEST);
				}

				// resolve ok
				deferred.resolve(ngmAuth.OK);

				return deferred.promise;
			},

			// has role
			hasRole: function (role) {

				var deferred = $q.defer();

				if (ngmUser.hasRole(role)) {
					deferred.resolve(ngmAuth.OK);
				} else if (ngmUser.get().guest) {
					deferred.reject(ngmAuth.UNAUTHORIZED);
				} else {
					deferred.reject(ngmAuth.FORBIDDEN);
				}

				return deferred.promise;
			},

			// has any role
			hasAnyRole: function (roles) {

				var deferred = $q.defer();

				if (ngmUser.hasAnyRole(roles)) {
					deferred.resolve(ngmAuth.OK);
				} else if (ngmUser.get().guest) {
					deferred.reject(ngmAuth.UNAUTHORIZED);
				} else {
					deferred.reject(ngmAuth.FORBIDDEN);
				}

				return deferred.promise;
			},

			// anonymous
			isAnonymous: function () {

				var deferred = $q.defer();

				if (!ngmUser.get() || ngmUser.get().guest) {
					// reset user property if the user visit as a guest
					if (ngmUser.get() && ngmUser.get().guest) {
						ngmUser.unset();
					}
					deferred.resolve(ngmAuth.OK);
				} else {
					deferred.reject(ngmAuth.FORBIDDEN);
				}

				return deferred.promise;
			},

			// authenticated
			isAuthenticated: function () {

				var deferred = $q.defer();

				if (ngmUser.get() && !ngmUser.get().guest) {
					deferred.resolve(ngmAuth.OK);
				} else {
					// set redirectToUrlAfterLogin
					if ($location.path() !== '/cluster/login' || $location.path() !== 'login'){
						ngmAuth.redirectToUrlAfterLogin = $location.path();
					}
					deferred.reject(ngmAuth.UNAUTHORIZED);
				}

				return deferred.promise;
			},

			/**
			 * @param {string} role - the User Role
			 * Returns user permissions definitions array of objs
			 * @returns {UserPermissions[]} - User permissions definitions array
			 */
			getUserRoleDescriptions: function (role) {
				return ngmPermissions.filter(function (x) { return x.ROLE === role })[0].DESCRIPTION;
			},

			/**
			 * Returns user permissions definitions array of objs
			 * @returns {UserPermissions[]} - User permissions definitions array
			 */
			userPermissions: function () {
				const user = ngmUser.get();
				return user ? ngmPermissions.filter(function (x) { return user.roles.includes(x.ROLE) }) : [];
			},

			/**
			 * Checks if user can edit in input view zones.
			 * @param {string} permission - Permission to check, accepts one of values: 'EDIT', 'EDIT_USER', defined as props on ngmPermissions.
			 * @param {Object} zones - Object containing zones and their values.
			 * @param {string} zones.adminRpcode - adminRpcode.
			 * @param {string} zones.admin0pcode - admin0pcode.
			 * @param {string} zones.cluster_id - cluster_id.
			 * @param {string} zones.organization_tag - organization_tag.
			 * @returns {boolean} User can/cannot edit for input view zones.
			 */
			canDo: function (permission, zones) {

				// check params
				if (!permission || !zones || typeof zones !== 'object' || typeof permission !== 'string') return false

				// get user obj
				const user = ngmUser.get();

				const USER_PERMISSIONS = ngmAuth.userPermissions();

				// _RESTRICTED prop on permissions conf with user restricted zones
				const permission_restricted = permission + '_RESTRICTED';

				// validation logic

				// roll over user roles definitions, use for...of in future
				for (const role of USER_PERMISSIONS) {
					// if permission active
					if (role[permission]) {
						allowed = true;
						// roll over role restricted zones
						for (const z of role[permission_restricted]) {
							// if not own zone
							if (!z || !user[z] || !zones[z] || (user[z].toLowerCase() !== zones[z].toLowerCase())) {
								// disallow access
								allowed = false;
							}
						}
						// fast return on match
						if (allowed) return allowed
					}
				}

				// otherwise if no match, no edit rights
				return false;
			},

			/**
			 * Returns array of user route restiction params
			 * @param {string} dashboard - name of dashboard defined as props on ngmPermissions.
			 * @returns {string[]} zones array e.g. ['admin0pcode', 'organization_tag']
			 */
			getRouteParams: function (dashboard) {
				// permissions filter prop
				const dashboard_filter = dashboard + '_RESTRICTED'
				const USER_PERMISSIONS = ngmAuth.userPermissions();
				// for menu get role with highest priority if user has multiple roles
				return USER_PERMISSIONS.reduce(function (max, v) { return v.LEVEL > max.LEVEL ? v : max })[dashboard_filter] || []
			},

			/**
			 * Returns array of user menu params
			 * @param {string} dashboard - name of dashboard defined as props on ngmPermissions.
			 * @returns {string[]} zones array e.g. ['cluster_id']
			 */
			getMenuParams: function (dashboard) {
				// permissions filter prop
				const dashboard_filter = dashboard + '_MENU'
				const USER_PERMISSIONS = ngmAuth.userPermissions();
				// for menu get role with highest priority if user has multiple roles
				return USER_PERMISSIONS.reduce(function (max, v) { return v.LEVEL > max.LEVEL ? v : max })[dashboard_filter]
			},

			/**
			 * Returns array of user's allowed roles to edit on users
			 * @returns {string[]} Roles array e.g. [ 'USER', 'ORG' ]
			 */
			getEditableRoles: function () {
				// filter permissions if EDIT_USER allowed
				const USER_PERMISSIONS = ngmAuth.userPermissions().filter(role => role['EDIT_USER'] && role['EDIT_USER_ROLES']);
				if (!USER_PERMISSIONS.length) return [];
				// get users allowed roles to edit highest priority if user has multiple roles
				return USER_PERMISSIONS.reduce(function (max, role) { return role.LEVEL > max.LEVEL ? role : max })['EDIT_USER_ROLES']
			},

			/**
			 * @deprecated Wrapper for canEdit, pass zones as function params.
			 */
			canEditPlain: function (permission, adminRpcode, admin0pcode, cluster_id, organization_tag) {
				const zones = {
					organization_tag,
					cluster_id,
					admin0pcode,
					adminRpcode
				}
				return this.canDo(permission, zones)
			},
			canDelete: function () {
				const USER_PERMISSIONS = ngmAuth.userPermissions();
				var asAdmin = USER_PERMISSIONS.some(role => role.ADMIN);
				return asAdmin

			},
			hideContactOnDownload: function () {
				var user = ngmUser.get()
				if (user.guest) return true;
				if (user.admin0pcode !== 'AF') return false;
				var USER_PERMISSIONS = ngmAuth.userPermissions();

				// hide contact on download file
				var hide_contact = USER_PERMISSIONS.reduce(function (max, v) { return v.LEVEL > max.LEVEL ? v : max })['LEVEL'] < 3 ? true : false;
				// hide_contact = true;
				return hide_contact;
			}
		};

		return ngmAuth;

	}])
	.factory('ngmAuthInterceptor', ['$q', '$injector', function ($q, $injector) {

		// get user
		var ngmUser = $injector.get('ngmUser');

		return {
			request: function (config) {

				var token;

				// cover external APIs
				if (ngmUser.get() && !config.externalApi) {
					token = ngmUser.get().token;
				}
				if (token) {
					config.headers.Authorization = 'Bearer ' + token;
				}

				return config;
			}
		};

	}])
	.config(function ($httpProvider) {
		$httpProvider.interceptors.push('ngmAuthInterceptor');
	});
