/**
 * @ngdoc overview
 * @name ngmReportHubApp
 * @description
 * # ngmReportHubApp
 *
 * Main module of the application.
 */
angular
	.module('ngmCluster',[])
	.config([ '$routeProvider', '$compileProvider', function ( $routeProvider, $compileProvider) {

		// https://medium.com/swlh/improving-angular-performance-with-1-line-of-code-a1fb814a6476#.ufea9sjt1
		$compileProvider.debugInfoEnabled( false );

		var clusterResolves = {
			// lists: [ 'ngmClusterLists', function( ngmClusterLists ) {
			// 	return ngmClusterLists.areListsFetched();
			// }],
			db: [ 'ngmLocalDB', function( ngmLocalDB ) {
				return ngmLocalDB.isVirtualDBLoaded;
			}]
		};

		var clusterRouteProvider = angular.extend({}, $routeProvider, {
			when: function (path, route) {
					route.resolve = (route.resolve) ? route.resolve : {};
					angular.extend(route.resolve, clusterResolves);
					$routeProvider.when(path, route);
					return this;
			}
		});

		var page = {
			start_date: function() {
				var date;
				if ( moment.utc().date() <= 20 ) {
					date = moment.utc().startOf( 'M' ).subtract( 1, 'M').format( 'YYYY-MM-DD' )
				} else {
					date = moment.utc().startOf( 'M' ).format( 'YYYY-MM-DD' );
				}
				return date;
			},
			end_date: function() {
				var date;
				if ( moment.utc().date() <= 20 ) {
					date = moment.utc().endOf( 'M' ).subtract( 1, 'M').format( 'YYYY-MM-DD' )
				} else {
					date = moment.utc().endOf( 'M' ).format( 'YYYY-MM-DD' );
				}
				return date;
			},
			dashboards_start_date:function(){
				var year = moment().subtract(2, 'M').year();
				var date = moment([year]).format('YYYY-MM-DD');
				return date;
			}
		}
		const page_start_date = page.start_date();
		const page_end_date = page.end_date();
		const dashboards_start_date = page.dashboards_start_date();

		// app routes with access rights
		clusterRouteProvider
			// login
			.when( '/cluster/login', {
				templateUrl: '/views/app/dashboard.html',
				controller: 'DashboardLoginCtrl',
				resolve: {
					access: [ 'ngmAuth', function(ngmAuth) {
						return ngmAuth.isAnonymous();
					}],
				}
			})
			// register
			.when( '/cluster/register', {
				templateUrl: '/views/app/dashboard.html',
				controller: 'DashboardRegisterCtrl',
				resolve: {
					access: [ 'ngmAuth', function(ngmAuth) {
						return ngmAuth.isAnonymous();
					}],
				}
			})
			// reset with token
			.when( '/cluster/find/:token', {
				templateUrl: '/views/app/dashboard.html',
				controller: 'DashboardResetCtrl',
				resolve: {
					access: [ 'ngmAuth', function(ngmAuth) {
						return ngmAuth.isAnonymous();
					}],
				}
			})
			// reset with token
			.when('/cluster/pending/', {
				templateUrl: '/views/app/dashboard.html',
				controller: 'DashboardPendingUserCtrl',
				resolve: {
					access: ['ngmAuth', function (ngmAuth) {
						return ngmAuth.grantPublicAccess();
					}],
				}
			})
			// forbidden
			.when( '/cluster/forbidden', {
				templateUrl: '/views/app/dashboard.html',
				controller: 'DashboardForbiddenCtrl',
				resolve: {
					access: [ 'ngmAuth', function(ngmAuth) {
							return !ngmAuth.isAuthenticated();
					}],
				}
			})
			// guides
			.when( '/cluster/guides', {
				templateUrl: '/views/app/dashboard.html',
				controller: 'DashboardGuidesMenuCtrl',
				resolve: {
					access: [ 'ngmAuth', function(ngmAuth) {
							return ngmAuth.grantPublicAccess();
					}],
				}
			})
			// feedback
			.when( '/cluster/guides/feedback', {
				templateUrl: '/views/app/dashboard.html',
				controller: 'DashboardGuidesFeedbackCtrl',
				resolve: {
					access: [ 'ngmAuth', function(ngmAuth) {
							return ngmAuth.grantPublicAccess();
					}],
				}
			})
			// screencasts
			.when( '/cluster/guides/screens', {
				templateUrl: '/views/app/dashboard.html',
				controller: 'DashboardGuidesScreenCtrl',
				resolve: {
					access: [ 'ngmAuth', function(ngmAuth) {
							return ngmAuth.grantPublicAccess();
					}],
				}
			})
			// organization
			.when( '/cluster/organization', {
				templateUrl: '/views/app/dashboard.html',
				controller: 'ClusterAppCtrl',
				resolve: {
					access: [ 'ngmAuth', function(ngmAuth) {
						return ngmAuth.isAuthenticated();
					}],
				}
			})
			// project list by organization
			.when( '/cluster/organization/:organization_id', {
				templateUrl: '/views/app/dashboard.html',
				controller: 'ClusterAppCtrl',
				resolve: {
					access: [ 'ngmAuth', function( ngmAuth ) {
						return ngmAuth.isAuthenticated();
					}],
				}
			})
			// stock reports
			// .when( '/cluster/stocks', {
			// 	templateUrl: '/views/app/dashboard.html',
			// 	controller: 'ClusterOrganizationStocksListCtrl',
			// 	resolve: {
			// 		access: [ 'ngmAuth', function(ngmAuth) {
			// 			return ngmAuth.isAuthenticated();
			// 		}],
			// 	}
			// })
			.when('/cluster/stocks', {
				redirectTo: '/cluster/stocks/' + moment().format('YYYY')
			})
			.when('/cluster/stocks/:year', {
				templateUrl: '/views/app/dashboard.html',
				controller: 'ClusterOrganizationStocksListCtrl',
				resolve: {
					access: ['ngmAuth', function (ngmAuth) {
						return ngmAuth.isAuthenticated();
					}],
				}
			})
			// stock reports list by organization
			// .when( '/cluster/stocks/:organization_id', {
			// 	templateUrl: '/views/app/dashboard.html',
			// 	controller: 'ClusterOrganizationStocksListCtrl',
			// 	resolve: {
			// 		access: [ 'ngmAuth', function( ngmAuth ) {
			// 			return ngmAuth.isAuthenticated();
			// 		}],
			// 	}
			// })
			.when('/cluster/stocks/organization/:organization_id', {
				redirectTo: '/cluster/stocks/organization/:organization_id/' + moment().format('YYYY')
			})
			// .when('/cluster/stocks/:organization_id/:year', {
			// 	templateUrl: '/views/app/dashboard.html',
			// 	controller: 'ClusterOrganizationStocksListCtrl',
			// 	resolve: {
			// 		access: ['ngmAuth', function (ngmAuth) {
			// 			return ngmAuth.isAuthenticated();
			// 		}],
			// 	}
			// })
			.when('/cluster/stocks/organization/:organization_id/:year', {
				templateUrl: '/views/app/dashboard.html',
				controller: 'ClusterOrganizationStocksListCtrl',
				resolve: {
					access: ['ngmAuth', function (ngmAuth) {
						return ngmAuth.isAuthenticated();
					}],
				}
			})
			// stock report
			.when( '/cluster/stocks/report/:organization_id/:report_id', {
				templateUrl: '/views/app/dashboard.html',
				controller: 'ClusterOrganizationStockReportCtrl',
				resolve: {
					access: [ 'ngmAuth', function( ngmAuth ) {
						return ngmAuth.isAuthenticated();
					}],
				}
			})

			// Syria FSAC Demo
			.when( '/cluster/syria/fsac', {
				templateUrl: '/views/app/dashboard.html',
				controller: 'ClusterSyriaDashboard',
				resolve: {
					access: [ 'ngmAuth', function(ngmAuth) {
						return ngmAuth.isAuthenticated();
					}],
				}
			})

			// project list
			// .when( '/cluster/projects', {
			// 	redirectTo: '/cluster/projects/all'
			// })
			// // project list
			// .when( '/cluster/projects/:cluster_id', {
			// 	templateUrl: '/views/app/dashboard.html',
			// 	controller: 'ClusterProjectProjectsCtrl',
			// 	resolve: {
			// 		access: [ 'ngmAuth', function(ngmAuth) {
			// 			return ngmAuth.isAuthenticated();
			// 		}],
			// 	}
			// })
			// // project organization
			// .when( '/cluster/projects/organization/:organization_id', {
			// 	redirectTo: '/cluster/projects/organization/:organization_id/all'
			// })
			// // project organization
			// .when( '/cluster/projects/organization/:organization_id/:cluster_id', {
			// 	templateUrl: '/views/app/dashboard.html',
			// 	controller: 'ClusterProjectProjectsCtrl',
			// 	resolve: {
			// 		access: [ 'ngmAuth', function( ngmAuth ) {
			// 			return ngmAuth.isAuthenticated();
			// 		}],
			// 	}
			// })
			// project list
			.when( '/cluster/projects', {
				redirectTo: '/cluster/projects/list'
			})
			.when('/cluster/projects/list', {
				resolve: {
					access: ['$location', 'ngmUser', 'ngmAuth', function ($location, ngmUser, ngmAuth) {

						// redirect to user init route
						const userInitRouteParams = ngmAuth.getRouteParams('PROJECT');
						const user = ngmUser.get();
						const adminRpcode = userInitRouteParams.includes('adminRpcode') && user && user.adminRpcode ? user.adminRpcode.toLowerCase() : 'all';
						const admin0pcode = userInitRouteParams.includes('admin0pcode') && user && user.admin0pcode ? user.admin0pcode.toLowerCase() : 'all';
						const cluster_id = userInitRouteParams.includes('cluster_id') && user && user.cluster_id ? user.cluster_id.toLowerCase() : 'all';
						const organization_tag = userInitRouteParams.includes('organization_tag') && user && user.organization_tag ? user.organization_tag.toLowerCase() : 'all';
						const year = moment().subtract(1, 'month').year();
						const url = '/cluster/projects/list/' + adminRpcode + '/' + admin0pcode + '/' + organization_tag + '/' + cluster_id+'/'+year;
						$location.path(url);
					}]
				},
			})
			.when('/cluster/projects/list/:adminRpcode/:admin0pcode/:organization_tag/:cluster_id/:year', {
				templateUrl: '/views/app/dashboard.html',
				controller: 'ClusterProjectProjectsCtrl',
				resolve: {
					access: ['ngmAuth', function (ngmAuth) {
						return ngmAuth.isAuthenticated();
					}],
				}
			})
			// project summary
			.when( '/cluster/projects/summary/:project', {
				templateUrl: '/views/app/dashboard.html',
				controller: 'ClusterProjectSummaryCtrl',
				resolve: {
					access: [ 'ngmAuth', function(ngmAuth) {
						return ngmAuth.isAuthenticated();
					}],
				}
			})
			// project details
			.when( '/cluster/projects/details/:project/:copy_project_id?', {
				templateUrl: '/views/app/dashboard.html',
				controller: 'ClusterProjectDetailsCtrl',
				resolve: {
					lists: [ 'ngmClusterLists', function( ngmClusterLists ) {
						return ngmClusterLists.areListsFetched();
					}],
					access: [ 'ngmAuth', function(ngmAuth) {
						return ngmAuth.isAuthenticated();
					}],
				}
			})
			// project reports
			.when( '/cluster/projects/report/:project', {
				templateUrl: '/views/app/dashboard.html',
				controller: 'ClusterProjectReportsListCtrl',
				resolve: {
					access: [ 'ngmAuth', function(ngmAuth) {
						return ngmAuth.isAuthenticated();
					}],
				}
			})
			// project reports
			.when( '/cluster/projects/report/:project/:report', {
				templateUrl: '/views/app/dashboard.html',
				controller: 'ClusterProjectReportCtrl',
				resolve: {
					lists: [ 'ngmClusterLists', function( ngmClusterLists ) {
						return ngmClusterLists.areListsFetched();
					}],
					access: [ 'ngmAuth', function( ngmAuth ) {
						return ngmAuth.isAuthenticated();
					}],
				}
			})
			// project reports
			.when( '/cluster/projects/report/:project/:report/:location_group', {
				templateUrl: '/views/app/dashboard.html',
				controller: 'ClusterProjectReportCtrl',
				resolve: {
					access: [ 'ngmAuth', function( ngmAuth ) {
						return ngmAuth.isAuthenticated();
					}],
				}
			})
			// project reports groupings
			.when( '/cluster/projects/group/:project/:report', {
				templateUrl: '/views/app/dashboard.html',
				controller: 'ClusterProjectReportGroupCtrl',
				resolve: {
					access: [ 'ngmAuth', function( ngmAuth ) {
						return ngmAuth.isAuthenticated();
					}],
				}
			})
			// project financials
			.when( '/cluster/projects/financials/:project', {
				templateUrl: '/views/app/dashboard.html',
				controller: 'ClusterProjectFinancialsCtrl',
				resolve: {
					access: [ 'ngmAuth', function( ngmAuth ) {
						return ngmAuth.isAuthenticated();
					}],
				}
			})
			// project documents
			.when('/cluster/projects/upload/:project', {
				templateUrl: '/views/app/dashboard.html',
				controller: 'ClusterProjectDocumentCtrl',
				resolve: {
					access: ['ngmAuth', function (ngmAuth) {
						return ngmAuth.isAuthenticated();
					}],
				}
			})

			// DEFAULT
			.when( '/cluster/admin', {
				redirectTo: '/cluster/admin/all/all/all/all/all/activity/' + page_start_date + '/' + page_end_date
			})

			// HQ SUPERADMIN BY CLUSTER
			.when( '/cluster/admin/all/all/agriculture', {
				redirectTo: '/cluster/admin/all/all/all/agriculture/all/activity/' + page_start_date + '/' + page_end_date
			})
			.when( '/cluster/admin/all/all/education', {
				redirectTo: '/cluster/admin/all/all/all/education/all/activity/' + page_start_date + '/' + page_end_date
			})
			.when( '/cluster/admin/all/all/esnfi', {
				redirectTo: '/cluster/admin/all/all/all/esnfi/all/activity/' + page_start_date + '/' + page_end_date
			})
			.when( '/cluster/admin/all/all/fsac', {
				redirectTo: '/cluster/admin/all/all/all/fsac/all/activity/' + page_start_date + '/' + page_end_date
			})
			.when( '/cluster/admin/all/all/health', {
				redirectTo: '/cluster/admin/all/all/all/health/all/activity/' + page_start_date + '/' + page_end_date
			})
			.when( '/cluster/admin/all/all/nutrition', {
				redirectTo: '/cluster/admin/all/all/all/nutrition/all/activity/' + page_start_date + '/' + page_end_date
			})
			.when( '/cluster/admin/all/all/cvwg', {
				redirectTo: '/cluster/admin/all/all/all/cvwg/all/activity/' + page_start_date + '/' + page_end_date
			})
			.when( '/cluster/admin/all/all/protection', {
				redirectTo: '/cluster/admin/all/all/all/protection/all/activity/' + page_start_date + '/' + page_end_date
			})
			.when( '/cluster/admin/all/all/wash', {
				redirectTo: '/cluster/admin/all/all/all/wash/all/activity/' + page_start_date + '/' + page_end_date
			})

			// AFRO
			.when( '/cluster/admin/afro', {
				redirectTo: '/cluster/admin/afro/all/all/all/all/activity/' + page_start_date + '/' + page_end_date
			})
			.when( '/cluster/admin/afro/cd', {
				redirectTo: '/cluster/admin/afro/cd/all/all/all/activity/' + page_start_date + '/' + page_end_date
			})
			.when( '/cluster/admin/afro/et', {
				redirectTo: '/cluster/admin/afro/et/all/all/all/activity/' + page_start_date + '/' + page_end_date
			})
			.when( '/cluster/admin/afro/ng', {
				redirectTo: '/cluster/admin/afro/ng/all/all/all/activity/' + page_start_date + '/' + page_end_date
			})
			.when( '/cluster/admin/afro/ss', {
				redirectTo: '/cluster/admin/afro/ss/all/all/all/activity/' + page_start_date + '/' + page_end_date
			})

			// EMRO
			.when( '/cluster/admin/emro', {
				redirectTo: '/cluster/admin/emro/all/all/all/all/activity/' + page_start_date + '/' + page_end_date
			})
			.when( '/cluster/admin/emro/af', {
				redirectTo: '/cluster/admin/emro/af/all/all/all/activity/' + page_start_date + '/' + page_end_date
			})
			.when('/cluster/admin/emro/iq', {
				redirectTo: '/cluster/admin/emro/iq/all/all/all/activity/' + page_start_date + '/' + page_end_date
			})
			.when( '/cluster/admin/emro/so', {
				redirectTo: '/cluster/admin/emro/so/all/all/all/activity/' + page_start_date + '/' + page_end_date
			})
			.when( '/cluster/admin/emro/sy', {
				redirectTo: '/cluster/admin/emro/sy/all/all/all/activity/' + page_start_date + '/' + page_end_date
			})
			.when( '/cluster/admin/emro/ur', {
				redirectTo: '/cluster/admin/emro/ur/all/all/all/activity/' + page_start_date + '/' + page_end_date
			})
			.when( '/cluster/admin/emro/ye', {
				redirectTo: '/cluster/admin/emro/ye/all/all/all/activity/' + page_start_date + '/' + page_end_date
			})

			// EURO
			.when( '/cluster/admin/euro', {
				redirectTo: '/cluster/admin/euro/all/all/all/all/activity/' + page_start_date + '/' + page_end_date
			})
			.when( '/cluster/admin/euro/ua', {
				redirectTo: '/cluster/admin/euro/ua/all/all/all/activity/' + page_start_date + '/' + page_end_date
			})

			// SEARO
			.when( '/cluster/admin/searo', {
				redirectTo: '/cluster/admin/searo/all/all/all/all/activity/' + page_start_date + '/' + page_end_date
			})
			.when( '/cluster/admin/searo/bd', {
				redirectTo: '/cluster/admin/searo/bd/all/all/all/activity/' + page_start_date + '/' + page_end_date
			})
			.when( '/cluster/admin/searo/cb', {
				redirectTo: '/cluster/admin/searo/cb/all/all/all/activity/' + page_start_date + '/' + page_end_date
			})
			.when( '/cluster/admin/searo/cb/protection/cp', {
				redirectTo: '/cluster/admin/searo/cb/protection/cp/all/activity/' + page_start_date + '/' + page_end_date
			})
			.when( '/cluster/admin/searo/cb/protection/gbv', {
				redirectTo: '/cluster/admin/searo/cb/protection/gbv/all/activity/' + page_start_date + '/' + page_end_date
			})
			.when( '/cluster/admin/searo/cb/protection/protection', {
				redirectTo: '/cluster/admin/searo/cb/protection/protection/all/activity/' + page_start_date + '/' + page_end_date
			})

			//AMER
			.when('/cluster/admin/amer/',{
				redirectTo:'/cluster/admin/amer/all/all/all/all/activity' + page_start_date + '/' + page_end_date
			})
			.when('/cluster/admin/amer/col',{
				redirectTo: '/cluster/admin/amer/col/all/all/all/activity' + page_start_date + '/' + page_end_date
			})

			//AMER
			.when('/cluster/admin/amer',{
				redirectTo:'/cluster/admin/amer/all/all/all/all/activity/' + page_start_date + '/' + page_end_date
			})
			.when('/cluster/admin/amer/col',{
				redirectTo: '/cluster/admin/amer/col/all/all/all/activity/' + page_start_date + '/' + page_end_date
			})

			// WPRO
			.when('/cluster/admin/wpro',{
				redirectTo:'/cluster/admin/wpro/all/all/all/all/activity/' + page_start_date + '/' + page_end_date
			})
			.when('/cluster/admin/wpro/pg',{
				redirectTo: '/cluster/admin/wpro/pg/all/all/all/activity/' + page_start_date + '/' + page_end_date
			})
			.when('/cluster/admin/wpro/phl',{
				redirectTo: '/cluster/admin/wpro/phl/all/all/all/activity/' + page_start_date + '/' + page_end_date
			})

			// ADMIN
			.when( '/cluster/admin/:adminRpcode/:admin0pcode/:cluster_id/:activity_type_id/:organization_tag/:report_type/:start/:end/:project_detail?/:response?/:report_period_type_id?/:week?', {
			// .when( '/cluster/admin/:adminRpcode/:admin0pcode/:cluster_id/:activity_type_id/:organization_tag/:report_type/:start/:end/:project_detail?/:response?', {
				templateUrl: '/views/app/dashboard.html',
				controller: 'DashboardClusterAdminCtrl',
				resolve: {
					access: [ 'ngmAuth', function( ngmAuth ) {
						return ngmAuth.isAuthenticated();
					}],
				}
			})

			// hct dashboard 2017
			.when( '/cluster/health/hct', {
				redirectTo: '/cluster/health/hct/all'
			})
			.when( '/cluster/health/hct/:province', {
				templateUrl: '/views/app/dashboard.html',
				controller: 'DashboardHctCtrl',
				resolve: {
					access: [ 'ngmAuth', function(ngmAuth) {
						return ngmAuth.grantPublicAccess();
					}],
				}
			})

			// cluster dashboard default
			.when( '/cluster/4w', {
				redirectTo: '/cluster/5w'
			})
			.when( '/cluster/5w/', {
				redirectTo: '/cluster/5w'
			})
			.when( '/cluster/5w//', {
				redirectTo: '/cluster/5w'
			})
			.when( '/cluster/5w', {
				resolve: {
					access: [ '$location', 'ngmUser', 'ngmAuth', function( $location, ngmUser, ngmAuth ) {
						ngmAuth.grantPublicAccess();
						// redirect to user init route
						const userInitRouteParams = ngmAuth.getRouteParams('DASHBOARD');
						const user = ngmUser.get();
						const adminRpcode = userInitRouteParams.includes('adminRpcode') && user && user.adminRpcode ? user.adminRpcode.toLowerCase() : 'hq';
						const admin0pcode = userInitRouteParams.includes('admin0pcode') && user && user.admin0pcode ? user.admin0pcode.toLowerCase() : 'all';
						const cluster_id = userInitRouteParams.includes('cluster_id') && user && user.cluster_id ? user.cluster_id.toLowerCase() : 'all';
						const organization_tag = userInitRouteParams.includes('organization_tag') && user && user.organization_tag ? user.organization_tag.toLowerCase() : 'all';
						const year_by_admin0pcode = {
							'AF': moment().subtract(2, 'M').year().toString(),
							'PG': moment().subtract(2, 'M').year().toString(),
							'default': moment().subtract(2, 'M').year().toString()
						};
						const year = year_by_admin0pcode[user.admin0pcode] || year_by_admin0pcode['default'];
						const url = '/cluster/5w/' + adminRpcode + '/' + admin0pcode + '/all/all/' + cluster_id + '/all/all/' + organization_tag + '/all/' + year + '-01-01/' + moment().format('YYYY-MM-DD');
						$location.path( url );
					}]
				},
			})

			// cluster dashboard HQ
			.when( '/cluster/5w/hq', {
				redirectTo: '/cluster/5w/hq/all/all/all/all/all/all/all/all/'+dashboards_start_date+'/' + moment().format('YYYY-MM-DD')
			})
			.when( '/cluster/5w/hq/all', {
				redirectTo: '/cluster/5w/hq/all/all/all/all/all/all/all/all/'+dashboards_start_date+'/' + moment().format('YYYY-MM-DD')
			})

			// cluster dashboard AFRO
			.when( '/cluster/5w/afro', {
				redirectTo: '/cluster/5w/afro/all/all/all/all/all/all/all/all/'+dashboards_start_date+'/' + moment().format('YYYY-MM-DD')
			})
			.when( '/cluster/5w/afro/all', {
				redirectTo: '/cluster/5w/afro/all/all/all/all/all/all/all/all/'+dashboards_start_date+'/' + moment().format('YYYY-MM-DD')
			})
			.when( '/cluster/5w/afro/cd', {
				redirectTo: '/cluster/5w/afro/cd/all/all/all/all/all/all/all/'+dashboards_start_date+'/' + moment().format('YYYY-MM-DD')
			})
			.when( '/cluster/5w/afro/et', {
				redirectTo: '/cluster/5w/afro/et/all/all/all/all/all/all/all/'+dashboards_start_date+'/' + moment().format('YYYY-MM-DD')
			})
			.when( '/cluster/5w/afro/ng', {
				redirectTo: '/cluster/5w/afro/ng/all/all/all/all/all/all/all/'+dashboards_start_date+'/' + moment().format('YYYY-MM-DD')
			})
			.when( '/cluster/5w/afro/ss', {
				redirectTo: '/cluster/5w/afro/ss/all/all/all/all/all/all/all/'+dashboards_start_date+'/' + moment().format('YYYY-MM-DD')
			})

			// EURO
			.when( '/cluster/5w/euro', {
				redirectTo: '/cluster/5w/euro/all/all/all/all/all/all/all/all/'+dashboards_start_date+'/' + moment().format('YYYY-MM-DD')
			})
			.when( '/cluster/5w/euro/all', {
				redirectTo: '/cluster/5w/euro/all/all/all/all/all/all/all/all/'+dashboards_start_date+'/' + moment().format('YYYY-MM-DD')
			})
			.when( '/cluster/5w/euro/ua', {
				redirectTo: '/cluster/5w/euro/ua/all/all/all/all/all/all/all/'+dashboards_start_date+'/' + moment().format('YYYY-MM-DD')
			})

			// cluster dashboard EMRO
			.when( '/cluster/5w/emro', {
				redirectTo: '/cluster/5w/emro/all/all/all/all/all/all/all/all/'+dashboards_start_date+'/' + moment().format('YYYY-MM-DD')
			})
			.when( '/cluster/5w/emro/all', {
				redirectTo: '/cluster/5w/emro/all/all/all/all/all/all/all/all/'+dashboards_start_date+'/' + moment().format('YYYY-MM-DD')
			})
			.when( '/cluster/5w/emro/af', {
				redirectTo: '/cluster/5w/emro/af/all/all/all/all/all/all/all/'+dashboards_start_date+'/' + moment().format('YYYY-MM-DD')
			})
			.when('/cluster/5w/emro/iq', {
				redirectTo: '/cluster/5w/emro/iq/all/all/all/all/all/all/all/'+dashboards_start_date+'/' + moment().format('YYYY-MM-DD')
			})
			.when( '/cluster/5w/emro/so', {
				redirectTo: '/cluster/5w/emro/so/all/all/all/all/all/all/all/'+dashboards_start_date+'/' + moment().format('YYYY-MM-DD')
			})
			.when( '/cluster/5w/emro/sy', {
				redirectTo: '/cluster/5w/emro/sy/all/all/all/all/all/all/all/'+dashboards_start_date+'/' + moment().format('YYYY-MM-DD')
			})
			.when( '/cluster/5w/emro/ur', {
				redirectTo: '/cluster/5w/emro/ur/all/all/all/all/all/all/all/'+dashboards_start_date+'/' + moment().format('YYYY-MM-DD')
			})
			.when( '/cluster/5w/emro/ye', {
				redirectTo: '/cluster/5w/emro/ye/all/all/all/all/all/all/all/'+dashboards_start_date+'/' + moment().format('YYYY-MM-DD')
			})

			// SEARO
			.when( '/cluster/5w/searo', {
				redirectTo: '/cluster/5w/searo/all/all/all/all/all/all/all/all/'+dashboards_start_date+'/' + moment().format('YYYY-MM-DD')
			})
			.when( '/cluster/5w/searo/all', {
				redirectTo: '/cluster/5w/searo/all/all/all/all/all/all/all/all/'+dashboards_start_date+'/' + moment().format('YYYY-MM-DD')
			})
			.when( '/cluster/5w/searo/bd', {
				redirectTo: '/cluster/5w/searo/bd/all/all/all/all/all/all/all/'+dashboards_start_date+'/' + moment().format('YYYY-MM-DD')
			})
			.when( '/cluster/5w/searo/cb', {
				redirectTo: '/cluster/5w/searo/cb/all/all/all/all/all/all/all/'+dashboards_start_date+'/' + moment().format('YYYY-MM-DD')
			})

			//AMER
			.when('/cluster/5w/amer', {
				redirectTo: '/cluster/5w/amer/all/all/all/all/all/all/all/all/'+dashboards_start_date+'/' + moment().format('YYYY-MM-DD')
			})
			.when('/cluster/5w/amer/all', {
				redirectTo: '/cluster/5w/amer/all/all/all/all/all/all/all/all/'+dashboards_start_date+'/' + moment().format('YYYY-MM-DD')
			})
			.when('/cluster/5w/amer/col',{
				redirectTo: '/cluster/5w/amer/col/all/all/all/all/all/all/all/'+dashboards_start_date+'/' + moment().format('YYYY-MM-DD')
			})

			// WRPO
			.when('/cluster/5w/wpro', {
				redirectTo: '/cluster/5w/wpro/all/all/all/all/all/all/all/all/'+dashboards_start_date+'/' + moment().format('YYYY-MM-DD')
			})
			.when('/cluster/5w/wpro/all', {
				redirectTo: '/cluster/5w/wpro/all/all/all/all/all/all/all/all/'+dashboards_start_date+'/' + moment().format('YYYY-MM-DD')
			})
			.when('/cluster/5w/wpro/pg',{
				redirectTo: '/cluster/5w/wpro/pg/all/all/all/all/all/all/all/'+dashboards_start_date+'/' + moment().format('YYYY-MM-DD')
			})
			.when('/cluster/5w/wpro/phl',{
				redirectTo: '/cluster/5w/wpro/phl/all/all/all/all/all/all/all/'+dashboards_start_date+'/' + moment().format('YYYY-MM-DD')
			})

			// health dashboard
			// .when( '/cluster/5w/:adminRpcode/:admin0pcode/:admin1pcode/:admin2pcode/:cluster_id/:activity_type_id/:activity_description_id/:organization_tag/:beneficiaries/:start/:end/:hrp?/:project_detail?/:response?', {
			// .when( '/cluster/5w/:adminRpcode/:admin0pcode/:admin1pcode/:admin2pcode/:cluster_id/:activity_type_id/:activity_description_id/:organization_tag/:beneficiaries/:start/:end/:hrp?/:report_type_id?', {
			.when( '/cluster/5w/:adminRpcode/:admin0pcode/:admin1pcode/:admin2pcode/:cluster_id/:activity_type_id/:activity_description_id/:organization_tag/:beneficiaries/:start/:end/:hrp?/:project_detail?/:response?/:report_type_id?', {
				templateUrl: '/views/app/dashboard.html',
				controller: 'DashboardClusterCtrl',
				resolve: {
					access: [ 'ngmAuth', function(ngmAuth) {
							return ngmAuth.grantPublicAccess();
					}],
				}
			})

			// health dashboard
			.when( '/cluster/health', {
				// redirectTo: '/cluster/health/5w/hq/all/all/all/all/all/all/2016-01-01/' + moment().format('YYYY-MM-DD')
				redirectTo: '/cluster/health/4w/hq/all/all/all/all/all/all/2016-01-01/2016-12-31'
			})
			// health dashboard
			.when( '/cluster/health/4w', {
				// redirectTo: '/cluster/health/4w/hq/all/all/all/all/all/all/2016-01-01/' + moment().format('YYYY-MM-DD')
				redirectTo: '/cluster/health/4w/hq/all/all/all/all/all/all/2016-01-01/2016-12-31'
			})
			// health dashboard
			.when( '/cluster/health/4w/:adminR/:admin0/:organization_tag/:admin1/:admin2/:project/:beneficiaries/:start/:end', {
				templateUrl: '/views/app/dashboard.html',
				controller: 'DashboardHealthCtrl',
				resolve: {
					access: [ 'ngmAuth', function(ngmAuth) {
						return ngmAuth.grantPublicAccess();
					}],
				}
			})


			// 4w project plan dashboard

			// health dashboard
			.when( '/cluster/4wprojectplan/', {
				redirectTo: '/cluster/4wprojectplan'
			})
			// health dashboard
			.when( '/cluster/4wprojectplan//', {
				// redirectTo: '/cluster/health/4w/hq/all/all/all/all/all/all/2016-01-01/' + moment().format('YYYY-MM-DD')
				redirectTo: '/cluster/4wprojectplan'
			})
			// health dashboard
			.when( '/cluster/4wprojectplan', {
				resolve: {
					access: [ '$location', 'ngmUser', 'ngmAuth', function( $location, ngmUser, ngmAuth ) {
						ngmAuth.grantPublicAccess();
						// redirect to user init route
						const userInitRouteParams = ngmAuth.getRouteParams('DASHBOARD');
						const user = ngmUser.get();
						const adminRpcode = userInitRouteParams.includes('adminRpcode') && user && user.adminRpcode ? user.adminRpcode.toLowerCase() : 'hq';
						const admin0pcode = userInitRouteParams.includes('admin0pcode') && user && user.admin0pcode ? user.admin0pcode.toLowerCase() : 'all';
						const cluster_id = userInitRouteParams.includes('cluster_id') && user && user.cluster_id ? user.cluster_id.toLowerCase() : 'all';
						const organization_tag = userInitRouteParams.includes('organization_tag') && user && user.organization_tag ? user.organization_tag.toLowerCase() : 'all';
						year = moment().subtract(2, 'M').year();
						date = moment([year]).format('YYYY-MM-DD');
						const startDate = date;
						const url = '/cluster/4wprojectplan/' + adminRpcode + '/' + admin0pcode + '/all/all/' + cluster_id + '/all/' + organization_tag + '/all/all/all/all' + '/' + startDate+'/' + moment().format('YYYY-MM-DD');
						$location.path( url );
					}]
				},
			})
			// cluster dashboard HQ
			.when( '/cluster/4wprojectplan/hq', {
				redirectTo: '/cluster/4wprojectplan/hq/all/all/all/all/all/all/all/all/all/all/'+dashboards_start_date+'/' + moment().format('YYYY-MM-DD')
			})
			.when( '/cluster/4wprojectplan/hq/all', {
				redirectTo: '/cluster/4wprojectplan/hq/all/all/all/all/all/all/all/all/all/all/'+dashboards_start_date+'/' + moment().format('YYYY-MM-DD')
			})

			// 4wdashboardprojectplan AMER
			.when( '/cluster/4wprojectplan/amer', {
				redirectTo: '/cluster/4wprojectplan/amer/all/all/all/all/all/all/all/all/all/all/'+dashboards_start_date+'/' + moment().format('YYYY-MM-DD')
			})
			.when( '/cluster/4wprojectplan/amer/all', {
				redirectTo: '/cluster/4wprojectplan/amer/all/all/all/all/all/all/all/all/all/all/'+dashboards_start_date+'/' + moment().format('YYYY-MM-DD')
			})
			.when( '/cluster/4wprojectplan/amer/col', {
				redirectTo: '/cluster/4wprojectplan/amer/col/all/all/all/all/all/all/all/all/all/'+dashboards_start_date+'/' + moment().format('YYYY-MM-DD')
			})

			//4wdashboardprojectplan AFRO

			.when( '/cluster/4wprojectplan/afro', {
				redirectTo: '/cluster/4wprojectplan/afro/all/all/all/all/all/all/all/all/all/all/'+dashboards_start_date+'/' + moment().format('YYYY-MM-DD')
			})
			.when( '/cluster/4wprojectplan/afro/all', {
				redirectTo: '/cluster/4wprojectplan/afro/all/all/all/all/all/all/all/all/all/all/'+dashboards_start_date+'/' + moment().format('YYYY-MM-DD')
			})
			.when( '/cluster/4wprojectplan/afro/cd', {
				redirectTo: '/cluster/4wprojectplan/afro/cd/all/all/all/all/all/all/all/all/all/'+dashboards_start_date+'/' + moment().format('YYYY-MM-DD')
			})
			.when( '/cluster/4wprojectplan/afro/et', {
				redirectTo: '/cluster/4wprojectplan/afro/et/all/all/all/all/all/all/all/all/all/'+dashboards_start_date+'/' + moment().format('YYYY-MM-DD')
			})
			.when( '/cluster/4wprojectplan/afro/ng', {
				redirectTo: '/cluster/4wprojectplan/afro/ng/all/all/all/all/all/all/all/all/all/'+dashboards_start_date+'/' + moment().format('YYYY-MM-DD')
			})
			.when( '/cluster/4wprojectplan/afro/ss', {
				redirectTo: '/cluster/4wprojectplan/afro/ss/all/all/all/all/all/all/all/all/all/'+dashboards_start_date+'/' + moment().format('YYYY-MM-DD')
			})

			// EURO
			.when( '/cluster/4wprojectplan/euro', {
				redirectTo: '/cluster/4wprojectplan/euro/all/all/all/all/all/all/all/all/all/all/'+dashboards_start_date+'/' + moment().format('YYYY-MM-DD')
			})
			.when( '/cluster/4wprojectplan/euro/all', {
				redirectTo: '/cluster/4wprojectplan/euro/all/all/all/all/all/all/all/all/all/all/'+dashboards_start_date+'/' + moment().format('YYYY-MM-DD')
			})
			.when( '/cluster/4wprojectplan/euro/ua', {
				redirectTo: '/cluster/4wprojectplan/euro/ua/all/all/all/all/all/all/all/all/all/'+dashboards_start_date+'/' + moment().format('YYYY-MM-DD')
			})

			// cluster dashboard EMRO
			.when( '/cluster/4wprojectplan/emro', {
				redirectTo: '/cluster/4wprojectplan/emro/all/all/all/all/all/all/all/all/all/all/'+dashboards_start_date+'/' + moment().format('YYYY-MM-DD')
			})
			.when( '/cluster/4wprojectplan/emro/all', {
				redirectTo: '/cluster/4wprojectplan/emro/all/all/all/all/all/all/all/all/all/all/'+dashboards_start_date+'/' + moment().format('YYYY-MM-DD')
			})
			.when( '/cluster/4wprojectplan/emro/af', {
				redirectTo: '/cluster/4wprojectplan/emro/af/all/all/all/all/all/all/all/all/all/'+dashboards_start_date+'/' + moment().format('YYYY-MM-DD')
			})
			.when('/cluster/4wprojectplan/emro/iq', {
				redirectTo: '/cluster/4wprojectplan/emro/iq/all/all/all/all/all/all/all/all/all/2020-01-01/' + moment().format('YYYY-MM-DD')
			})
			.when( '/cluster/4wprojectplan/emro/so', {
				redirectTo: '/cluster/4wprojectplan/emro/so/all/all/all/all/all/all/all/all/all/'+dashboards_start_date+'/' + moment().format('YYYY-MM-DD')
			})
			.when( '/cluster/4wprojectplan/emro/sy', {
				redirectTo: '/cluster/4wprojectplan/emro/sy/all/all/all/all/all/all/all/all/all/'+dashboards_start_date+'/' + moment().format('YYYY-MM-DD')
			})
			.when( '/cluster/4wprojectplan/emro/ur', {
				redirectTo: '/cluster/4wprojectplan/emro/ur/all/all/all/all/all/all/all/all/all/'+dashboards_start_date+'/' + moment().format('YYYY-MM-DD')
			})
			.when( '/cluster/4wprojectplan/emro/ye', {
				redirectTo: '/cluster/4wprojectplan/emro/ye/all/all/all/all/all/all/all/all/all/'+dashboards_start_date+'/' + moment().format('YYYY-MM-DD')
			})

			// SEARO
			.when( '/cluster/4wprojectplan/searo', {
				redirectTo: '/cluster/4wprojectplan/searo/all/all/all/all/all/all/all/all/all/all/'+dashboards_start_date+'/' + moment().format('YYYY-MM-DD')
			})
			.when( '/cluster/4wprojectplan/searo/all', {
				redirectTo: '/cluster/4wprojectplan/searo/all/all/all/all/all/all/all/all/all/all/'+dashboards_start_date+'/' + moment().format('YYYY-MM-DD')
			})
			.when( '/cluster/4wprojectplan/searo/bd', {
				redirectTo: '/cluster/4wprojectplan/searo/bd/all/all/all/all/all/all/all/all/all/'+dashboards_start_date+'/' + moment().format('YYYY-MM-DD')
			})
			.when( '/cluster/4wprojectplan/searo/cb', {
				redirectTo: '/cluster/4wprojectplan/searo/cb/all/all/all/all/all/all/all/all/all/'+dashboards_start_date+'/' + moment().format('YYYY-MM-DD')
			})

			// WPRO
			.when( '/cluster/4wprojectplan/wpro', {
				redirectTo: '/cluster/4wprojectplan/wpro/all/all/all/all/all/all/all/all/all/all/'+dashboards_start_date+'/' + moment().format('YYYY-MM-DD')
			})
			.when( '/cluster/4wprojectplan/wpro/all', {
				redirectTo: '/cluster/4wprojectplan/wpro/all/all/all/all/all/all/all/all/all/all/'+dashboards_start_date+'/' + moment().format('YYYY-MM-DD')
			})
			.when( '/cluster/4wprojectplan/wpro/pg', {
				redirectTo: '/cluster/4wprojectplan/wpro/pg/all/all/all/all/all/all/all/all/all/'+dashboards_start_date+'/' + moment().format('YYYY-MM-DD')
			})
			.when( '/cluster/4wprojectplan/wpro/phl', {
				redirectTo: '/cluster/4wprojectplan/wpro/phl/all/all/all/all/all/all/all/all/all/'+dashboards_start_date+'/' + moment().format('YYYY-MM-DD')
			})

			// health dashboard
			.when( '/cluster/4wprojectplan/:adminRpcode/:admin0pcode/:admin1pcode/:admin2pcode/:cluster_id/:activity_type/:organization_tag/:project_type_component/:hrpplan/:implementer_tag/:donor_tag/:start/:end', {
				templateUrl: '/views/app/dashboard.html',
				controller: 'Dashboard4wProjectPlanCtrl',
				resolve: {
					access: [ 'ngmAuth', function(ngmAuth) {
							return ngmAuth.grantPublicAccess();
					}],
				}
			})


			// 4wplus dashboard

			.when( '/cluster/dashboard4wplus/', {
				redirectTo: '/cluster/dashboard4wplus'
			})

			.when( '/cluster/dashboard4wplus//', {
				redirectTo: '/cluster/dashboard4wplus'
			})
			// health dashboard
			.when( '/cluster/dashboard4wplus', {
				resolve: {
					access: [ '$location', 'ngmUser', 'ngmAuth', function( $location, ngmUser, ngmAuth ) {
						ngmAuth.grantPublicAccess();
						// redirect to user init route
						const userInitRouteParams = ngmAuth.getRouteParams('DASHBOARD');
						const user = ngmUser.get();
						const adminRpcode = userInitRouteParams.includes('adminRpcode') && user && user.adminRpcode ? user.adminRpcode.toLowerCase() : 'hq';
						const admin0pcode = userInitRouteParams.includes('admin0pcode') && user && user.admin0pcode ? user.admin0pcode.toLowerCase() : 'all';
						const cluster_id = userInitRouteParams.includes('cluster_id') && user && user.cluster_id ? user.cluster_id.toLowerCase() : 'all';
						const organization_tag = userInitRouteParams.includes('organization_tag') && user && user.organization_tag ? user.organization_tag.toLowerCase() : 'all';
						year = moment().subtract(2, 'M').year();
						date = moment([year]).format('YYYY-MM-DD');
						const starDate = date;
							
						const url = '/cluster/dashboard4wplus/' + adminRpcode + '/' + admin0pcode + '/all/all/' + cluster_id + '/all/'+organization_tag +'/all/all/all/all'+'/'+starDate+'/' + moment().format('YYYY-MM-DD');
						$location.path( url );
					}]
				},
			})
			// 4wplus dashboard HQ
			.when( '/cluster/dashboard4wplus/hq', {
				redirectTo: '/cluster/dashboard4wplus/hq/all/all/all/all/all/all/all/all/all/all/'+dashboards_start_date+'/' + moment().format('YYYY-MM-DD')
			})
			.when( '/cluster/dashboard4wplus/hq/all', {
				redirectTo: '/cluster/dashboard4wplus/hq/all/all/all/all/all/all/all/all/all/all/'+dashboards_start_date+'/' + moment().format('YYYY-MM-DD')
			})

			// 4wplus dashboard AMER
			.when( '/cluster/dashboard4wplus/amer', {
				redirectTo: '/cluster/dashboard4wplus/amer/all/all/all/all/all/all/all/all/all/all/'+dashboards_start_date+'/' + moment().format('YYYY-MM-DD')
			})
			.when( '/cluster/dashboard4wplus/amer/all', {
				redirectTo: '/cluster/dashboard4wplus/amer/all/all/all/all/all/all/all/all/all/all/'+dashboards_start_date+'/' + moment().format('YYYY-MM-DD')
			})
			.when( '/cluster/dashboard4wplus/amer/col', {
				redirectTo: '/cluster/dashboard4wplus/amer/col/all/all/all/all/all/all/all/all/all/'+dashboards_start_date+'/' + moment().format('YYYY-MM-DD')
			})

			//4wplus dashboard AFRO

			.when( '/cluster/dashboard4wplus/afro', {
				redirectTo: '/cluster/dashboard4wplus/afro/all/all/all/all/all/all/all/all/all/all/'+dashboards_start_date+'/' + moment().format('YYYY-MM-DD')
			})
			.when( '/cluster/dashboard4wplus/afro/all', {
				redirectTo: '/cluster/dashboard4wplus/afro/all/all/all/all/all/all/all/all/all/all/'+dashboards_start_date+'/' + moment().format('YYYY-MM-DD')
			})
			.when( '/cluster/dashboard4wplus/afro/cd', {
				redirectTo: '/cluster/dashboard4wplus/afro/cd/all/all/all/all/all/all/all/all/all/'+dashboards_start_date+'/' + moment().format('YYYY-MM-DD')
			})
			.when( '/cluster/dashboard4wplus/afro/et', {
				redirectTo: '/cluster/dashboard4wplus/afro/et/all/all/all/all/all/all/all/all/all/'+dashboards_start_date+'/' + moment().format('YYYY-MM-DD')
			})
			.when( '/cluster/dashboard4wplus/afro/ng', {
				redirectTo: '/cluster/dashboard4wplus/afro/ng/all/all/all/all/all/all/all/all/all/'+dashboards_start_date+'/' + moment().format('YYYY-MM-DD')
			})
			.when( '/cluster/dashboard4wplus/afro/ss', {
				redirectTo: '/cluster/dashboard4wplus/afro/ss/all/all/all/all/all/all/all/all/all/'+dashboards_start_date+'/' + moment().format('YYYY-MM-DD')
			})

			// EURO
			.when( '/cluster/dashboard4wplus/euro', {
				redirectTo: '/cluster/dashboard4wplus/euro/all/all/all/all/all/all/all/all/all/all/'+dashboards_start_date+'/' + moment().format('YYYY-MM-DD')
			})
			.when( '/cluster/dashboard4wplus/euro/all', {
				redirectTo: '/cluster/dashboard4wplus/euro/all/all/all/all/all/all/all/all/all/all/'+dashboards_start_date+'/' + moment().format('YYYY-MM-DD')
			})
			.when( '/cluster/dashboard4wplus/euro/ua', {
				redirectTo: '/cluster/dashboard4wplus/euro/ua/all/all/all/all/all/all/all/all/all/'+dashboards_start_date+'/' + moment().format('YYYY-MM-DD')
			})

			// cluster dashboard EMRO
			.when( '/cluster/dashboard4wplus/emro', {
				redirectTo: '/cluster/dashboard4wplus/emro/all/all/all/all/all/all/all/all/all/all/'+dashboards_start_date+'/' + moment().format('YYYY-MM-DD')
			})
			.when( '/cluster/dashboard4wplus/emro/all', {
				redirectTo: '/cluster/dashboard4wplus/emro/all/all/all/all/all/all/all/all/all/all/'+dashboards_start_date+'/' + moment().format('YYYY-MM-DD')
			})
			.when( '/cluster/dashboard4wplus/emro/af', {
				redirectTo: '/cluster/dashboard4wplus/emro/af/all/all/all/all/all/all/all/all/all/'+dashboards_start_date+'/' + moment().format('YYYY-MM-DD')
			})
			.when('/cluster/dashboard4wplus/emro/iq', {
				redirectTo: '/cluster/dashboard4wplus/emro/iq/all/all/all/all/all/all/all/all/all/2020-01-01/' + moment().format('YYYY-MM-DD')
			})
			.when( '/cluster/dashboard4wplus/emro/so', {
				redirectTo: '/cluster/dashboard4wplus/emro/so/all/all/all/all/all/all/all/all/all/'+dashboards_start_date+'/' + moment().format('YYYY-MM-DD')
			})
			.when( '/cluster/dashboard4wplus/emro/sy', {
				redirectTo: '/cluster/dashboard4wplus/emro/sy/all/all/all/all/all/all/all/all/all/'+dashboards_start_date+'/' + moment().format('YYYY-MM-DD')
			})
			.when( '/cluster/dashboard4wplus/emro/ur', {
				redirectTo: '/cluster/dashboard4wplus/emro/ur/all/all/all/all/all/all/all/all/all/'+dashboards_start_date+'/' + moment().format('YYYY-MM-DD')
			})
			.when( '/cluster/dashboard4wplus/emro/ye', {
				redirectTo: '/cluster/dashboard4wplus/emro/ye/all/all/all/all/all/all/all/all/all/'+dashboards_start_date+'/' + moment().format('YYYY-MM-DD')
			})

			// SEARO
			.when( '/cluster/dashboard4wplus/searo', {
				redirectTo: '/cluster/dashboard4wplus/searo/all/all/all/all/all/all/all/all/all/all/'+dashboards_start_date+'/' + moment().format('YYYY-MM-DD')
			})
			.when( '/cluster/dashboard4wplus/searo/all', {
				redirectTo: '/cluster/dashboard4wplus/searo/all/all/all/all/all/all/all/all/all/all/'+dashboards_start_date+'/' + moment().format('YYYY-MM-DD')
			})
			.when( '/cluster/dashboard4wplus/searo/bd', {
				redirectTo: '/cluster/dashboard4wplus/searo/bd/all/all/all/all/all/all/all/all/all/'+dashboards_start_date+'/' + moment().format('YYYY-MM-DD')
			})
			.when( '/cluster/dashboard4wplus/searo/cb', {
				redirectTo: '/cluster/dashboard4wplus/searo/cb/all/all/all/all/all/all/all/all/all/'+dashboards_start_date+'/' + moment().format('YYYY-MM-DD')
			})

			// WPRO
			.when( '/cluster/dashboard4wplus/wpro', {
				redirectTo: '/cluster/dashboard4wplus/wpro/all/all/all/all/all/all/all/all/all/all/'+dashboards_start_date+'/' + moment().format('YYYY-MM-DD')
			})
			.when( '/cluster/dashboard4wplus/wpro/all', {
				redirectTo: '/cluster/dashboard4wplus/wpro/all/all/all/all/all/all/all/all/all/all/'+dashboards_start_date+'/' + moment().format('YYYY-MM-DD')
			})
			.when( '/cluster/dashboard4wplus/wpro/pg', {
				redirectTo: '/cluster/dashboard4wplus/wpro/pg/all/all/all/all/all/all/all/all/all/'+dashboards_start_date+'/' + moment().format('YYYY-MM-DD')
			})
			.when( '/cluster/dashboard4wplus/wpro/phl', {
				redirectTo: '/cluster/dashboard4wplus/wpro/phl/all/all/all/all/all/all/all/all/all/'+dashboards_start_date+'/' + moment().format('YYYY-MM-DD')
			})


			.when( '/cluster/dashboard4wplus/:adminRpcode/:admin0pcode/:admin1pcode/:admin2pcode/:cluster_id/:activity_type_id/:organization_tag/:project_type_component/:hrpplan/:implementer_tag/:donor_tag/:start/:end', {
				templateUrl: '/views/app/dashboard.html',
				controller: 'Dashboard4wPlusCtrl',
				resolve: {
					access: [ 'ngmAuth', function(ngmAuth) {
							return ngmAuth.grantPublicAccess();
					}],
				}
			})
			.when('/cluster/lists/admin/',{
				redirectTo: '/cluster/lists/admin/all/all'
			})
			.when('/cluster/lists/admin/:admin0pcode/:cluster_id', {
				templateUrl: '/views/app/dashboard.html',
				controller: 'DashboardListAdminCtrl',
				resolve: {
					access: ['ngmAuth', function (ngmAuth) {
						return ngmAuth.isAuthenticated();
					}],
				}
			})

			.when('/cluster/admin/list/organization/:admin0pcode?', {
				templateUrl: '/views/app/dashboard.html',
				controller: 'ListOrgCtrl',
				resolve: {
					access: ['ngmAuth', function (ngmAuth) {
						return ngmAuth.isAuthenticated();
					}]
				}
			})

			.when('/cluster/record-admin/',{
				redirectTo: '/cluster/record-admin/beneficiaries/hq/all/all/all/'+ page_start_date + '/' + page_end_date
			})
			.when('/cluster/record-admin/beneficiaries/', {
				redirectTo: '/cluster/record-admin/beneficiaries/hq/all/all/all/'+ page_start_date + '/' + page_end_date
			})
			.when('/cluster/record-admin/stocks/', {
				redirectTo: '/cluster/record-admin/stocks/hq/all/all/all/' + page_start_date + '/' + page_end_date
			})

			// AFRO
			.when('/cluster/record-admin/beneficiaries/afro', {
				redirectTo: '/cluster/record-admin/beneficiaries/afro/all/all/all/' + page_start_date + '/' + page_end_date
			})
			.when('/cluster/record-admin/beneficiaries/afro/cd', {
				redirectTo: '/cluster/record-admin/beneficiaries/afro/cd/all/all/' + page_start_date + '/' + page_end_date
			})
			.when('/cluster/record-admin/beneficiaries/afro/et', {
				redirectTo: '/cluster/record-admin/beneficiaries/afro/et/all/all/' + page_start_date + '/' + page_end_date
			})
			.when('/cluster/record-admin/beneficiaries/afro/ng', {
				redirectTo: '/cluster/record-admin/beneficiaries/afro/ng/all/all/' + page_start_date + '/' + page_end_date
			})
			.when('/cluster/record-admin/beneficiaries/afro/ss', {
				redirectTo: '/cluster/record-admin/beneficiaries/afro/ss/all/all/' + page_start_date + '/' + page_end_date
			})
			// stocks
			.when('/cluster/record-admin/stocks/afro', {
				redirectTo: '/cluster/record-admin/stocks/afro/all/all/all/' + page_start_date + '/' + page_end_date
			})
			.when('/cluster/record-admin/stocks/afro/cd', {
				redirectTo: '/cluster/record-admin/stocks/afro/cd/all/all/' + page_start_date + '/' + page_end_date
			})
			.when('/cluster/record-admin/stocks/afro/et', {
				redirectTo: '/cluster/record-admin/stocks/afro/et/all/all/' + page_start_date + '/' + page_end_date
			})
			.when('/cluster/record-admin/stocks/afro/ng', {
				redirectTo: '/cluster/record-admin/stocks/afro/ng/all/all/' + page_start_date + '/' + page_end_date
			})
			.when('/cluster/record-admin/stocks/afro/ss', {
				redirectTo: '/cluster/record-admin/stocks/afro/ss/all/all/' + page_start_date + '/' + page_end_date
			})
			// EMRO
			.when('/cluster/record-admin/beneficiaries/emro/', {
				redirectTo: '/cluster/record-admin/beneficiaries/emro/all/all/all/' + page_start_date + '/' + page_end_date
			})
			.when('/cluster/record-admin/beneficiaries/emro/af', {
				redirectTo: '/cluster/record-admin/beneficiaries/emro/af/all/all/' + page_start_date + '/' + page_end_date
			})
			.when('/cluster/record-admin/beneficiaries/emro/iq', {
				redirectTo: '/cluster/record-admin/beneficiaries/emro/iq/all/all/' + page_start_date + '/' + page_end_date
			})
			.when('/cluster/record-admin/beneficiaries/emro/so', {
				redirectTo: '/cluster/record-admin/beneficiaries/emro/so/all/all/' + page_start_date + '/' + page_end_date
			})
			.when('/cluster/record-admin/beneficiaries/emro/sy', {
				redirectTo: '/cluster/record-admin/beneficiaries/emro/sy/all/all/' + page_start_date + '/' + page_end_date
			})
			.when('/cluster/record-admin/beneficiaries/emro/ur', {
				redirectTo: '/cluster/record-admin/beneficiaries/emro/ur/all/all/' + page_start_date + '/' + page_end_date
			})
			.when('/cluster/record-admin/beneficiaries/emro/ye', {
				redirectTo: '/cluster/record-admin/beneficiaries/emro/ye/all/all/' + page_start_date + '/' + page_end_date
			})
			// stocks
			.when('/cluster/record-admin/stocks/emro/', {
				redirectTo: '/cluster/record-admin/stocks/emro/all/all/all/' + page_start_date + '/' + page_end_date
			})
			.when('/cluster/record-admin/stocks/emro/af', {
				redirectTo: '/cluster/record-admin/stocks/emro/af/all/all/' + page_start_date + '/' + page_end_date
			})
			.when('/cluster/record-admin/stocks/emro/iq', {
				redirectTo: '/cluster/record-admin/stocks/emro/iq/all/all/' + page_start_date + '/' + page_end_date
			})
			.when('/cluster/record-admin/stocks/emro/so', {
				redirectTo: '/cluster/record-admin/stocks/emro/so/all/all/' + page_start_date + '/' + page_end_date
			})
			.when('/cluster/record-admin/stocks/emro/sy', {
				redirectTo: '/cluster/record-admin/stocks/emro/sy/all/all/' + page_start_date + '/' + page_end_date
			})
			.when('/cluster/record-admin/stocks/emro/ur', {
				redirectTo: '/cluster/record-admin/stocks/emro/ur/all/all/' + page_start_date + '/' + page_end_date
			})
			.when('/cluster/record-admin/stocks/emro/ye', {
				redirectTo: '/cluster/record-admin/stocks/emro/ye/all/all/' + page_start_date + '/' + page_end_date
			})
			// EURO
			.when('/cluster/record-admin/beneficiaries/euro', {
				redirectTo: '/cluster/record-admin/beneficiaries/euro/all/all/all/' + page_start_date + '/' + page_end_date
			})
			.when('/cluster/record-admin/beneficiaries/euro/ua', {
				redirectTo: '/cluster/record-admin/beneficiaries/euro/ua/all/all/' + page_start_date + '/' + page_end_date
			})
			// stock
			.when('/cluster/record-admin/stocks/euro', {
				redirectTo: '/cluster/record-admin/stocks/euro/all/all/all/' + page_start_date + '/' + page_end_date
			})
			.when('/cluster/record-admin/stocks/euro/ua', {
				redirectTo: '/cluster/record-admin/stocks/euro/ua/all/all/' + page_start_date + '/' + page_end_date
			})

			// SEARO
			.when('/cluster/record-admin/beneficiaries/searo', {
				redirectTo: '/cluster/record-admin/beneficiaries/searo/all/all/all/' + page_start_date + '/' + page_end_date
			})
			.when('/cluster/record-admin/beneficiaries/searo/bd', {
				redirectTo: '/cluster/record-admin/beneficiaries/searo/bd/all/all/' + page_start_date + '/' + page_end_date
			})
			.when('/cluster/record-admin/beneficiaries/searo/cb', {
				redirectTo: '/cluster/record-admin/beneficiaries/searo/cb/all/all/' + page_start_date + '/' + page_end_date
			})
			//stocks
			.when('/cluster/record-admin/stocks/searo', {
				redirectTo: '/cluster/record-admin/stocks/searo/all/all/all/' + page_start_date + '/' + page_end_date
			})
			.when('/cluster/record-admin/stocks/searo/bd', {
				redirectTo: '/cluster/record-admin/stocks/searo/bd/all/all/' + page_start_date + '/' + page_end_date
			})
			.when('/cluster/record-admin/stocks/searo/cb', {
				redirectTo: '/cluster/record-admin/stocks/searo/cb/all/all/' + page_start_date + '/' + page_end_date
			})

			//AMER
			.when('/cluster/record-admin/beneficiaries/amer/', {
				redirectTo: '/cluster/record-admin/beneficiaries/amer/all/all/all/' + page_start_date + '/' + page_end_date
			})
			.when('/cluster/record-admin/beneficiaries/amer/col', {
				redirectTo: '/cluster/record-admin/beneficiaries/amer/col/all/all/' + page_start_date + '/' + page_end_date
			})

			//AMER
			.when('/cluster/record-admin/stocks/amer', {
				redirectTo: '/cluster/record-admin/stocks/amer/all/all/all/' + page_start_date + '/' + page_end_date
			})
			.when('/cluster/record-admin/stocks/amer/col', {
				redirectTo: '/cluster/record-admin/stocks/amer/col/all/all/' + page_start_date + '/' + page_end_date
			})

			// WPRO
			.when('/cluster/record-admin/beneficiaries/wpro', {
				redirectTo: '/cluster/record-admin/beneficiaries/wpro/all/all/all/' + page_start_date + '/' + page_end_date
			})
			.when('/cluster/record-admin/beneficiaries/wpro/pg', {
				redirectTo: '/cluster/record-admin/beneficiaries/wpro/pg/all/all/' + page_start_date + '/' + page_end_date
			})
			.when('/cluster/record-admin/beneficiaries/wpro/phl', {
				redirectTo: '/cluster/record-admin/beneficiaries/wpro/phl/all/all/' + page_start_date + '/' + page_end_date
			})
			.when('/cluster/record-admin/stocks/wpro', {
				redirectTo: '/cluster/record-admin/stocks/wpro/all/all/all/' + page_start_date + '/' + page_end_date
			})
			.when('/cluster/record-admin/stocks/wpro/pg', {
				redirectTo: '/cluster/record-admin/stocks/wpro/pg/all/all/' + page_start_date + '/' + page_end_date
			})
			.when('/cluster/record-admin/stocks/wpro/phl', {
				redirectTo: '/cluster/record-admin/stocks/wpro/phl/all/all/' + page_start_date + '/' + page_end_date
			})
			.when('/cluster/record-admin/:type/:adminRpcode/:admin0pcode/:cluster_id/:organization_tag/:start/:end',{
				templateUrl: '/views/app/dashboard.html',
				controller: 'ClusterBenefeciariesStockAdminCtrl',
				resolve: {
					access: ['ngmAuth', function (ngmAuth) {
						return ngmAuth.isAuthenticated();
					}]
				}
			})

			.when('/performance', {
				resolve: {
					access: ['$location', 'ngmUser', function ($location,ngmUser) {
						const user = ngmUser.get();
						const admin0pcode = user.admin0pcode.toLowerCase()
						const url = '/performance/' + admin0pcode+'/false/' + page_start_date + '/' + page_end_date
						$location.path(url);
					}]
				}
			})
			.when('/performance/:admin0pcode/:hrp/:start/:end',{
				templateUrl: '/views/app/dashboard.html',
				controller: 'DashboardPerformanceCtrl',
				resolve: {
					access: ['ngmAuth', function (ngmAuth) {
						return ngmAuth.isAuthenticated();
					}],
				}
			})
			.when('/organization-contact/:organization',{
				templateUrl: '/views/app/dashboard.html',
				controller: 'OrganizationContactPageCtrl',
				resolve: {
					access: ['ngmAuth', function (ngmAuth) {
						return ngmAuth.isAuthenticated();
					}],
				}
			})
			.when('/country-organization-list/',{
				resolve: {
					access: ['$location', 'ngmUser', function ($location, ngmUser) {
						const user = ngmUser.get();
						const admin0pcode = user.admin0pcode.toLowerCase();
						const url = '/country-organization-list/'+admin0pcode+'/all/all';
						$location.path(url);
					}]
				}
			})
			.when('/country-organization-list/:admin0pcode/:cluster_id/:type',{
				templateUrl: '/views/app/dashboard.html',
				controller: 'CountryOrganizationListCtrl',
				resolve: {
					access: ['ngmAuth', function (ngmAuth) {
						return ngmAuth.isAuthenticated();
					}],
				}
			})
			.when('/cluster/wg/sector-contacts/',{
				resolve: {
					access: ['$location', 'ngmUser', function ($location, ngmUser) {
						const user = ngmUser.get();
						const cluster_id = user.cluster_id;
						const admin0pcode = user.admin0pcode.toLowerCase();
						const url = '/cluster/wg/sector-contacts/'+admin0pcode+'/'+cluster_id;
						$location.path(url);
					}]
				}
			})
			.when('/cluster/wg/sector-contacts/:admin0pcode/:cluster_id',{
				templateUrl: '/views/app/dashboard.html',
				controller: 'ClusterContactListCtrl',
				resolve: {
					access: ['ngmAuth', function (ngmAuth) {
						return ngmAuth.isAuthenticated();
					}],
				}
			})

			// FORBIDDEN
			.when( '/cluster/forbidden', {
				templateUrl: '/views/app/dashboard.html',
				controller: 'DashboardForbiddenCtrl',
				resolve: {
					access: [ 'ngmAuth', function(ngmAuth) {
						return !ngmAuth.isAuthenticated();
					}],
				}
			})
			// CLUSTER HOME
			.when( '/cluster', {
				redirectTo: '/cluster/organization'
			})
			// DEFAULT
			.otherwise({
				redirectTo: '/cluster/organization'
			});

	}])
	.factory('ngmLocalDBLists', ['$q', 'ngmLocalDB', 'ngmLists', 'ngmClusterLists', 'ngmUser', function ($q, ngmLocalDB, ngmLists, ngmClusterLists, ngmUser) {

		return {

			loadLists: function (update, fetch) {
				var KEY = 'lists';
				var deferred = $q.defer();
				if (!ngmClusterLists.areListsLoading()) {
					// load into virtual data service
					ngmLocalDB.loadItem(KEY, update, fetch).then(function (data) {
						// if not data on localdb and logged user
						if (!data && ngmUser.get()) {
							// fetch lists data again
							ngmClusterLists.setClusterLists(ngmUser.get()).then(function (data) {
								deferred.resolve(data);
							});
						} else {
							deferred.resolve(data);
						}
					}).catch(function (err) {
						console.log(err);
						deferred.resolve(true);
					});
				} else {
					// lists are loading do nothing
					deferred.resolve(true);
				}
				return deferred.promise;
			},
		}
}]);
