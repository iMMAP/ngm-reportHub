/**
 * @ngdoc function
 * @name ngmReportHubApp.controller:ClusterOrganizationStockReportCtrl
 * @description
 * # ClusterOrganizationStockReportCtrl
 * Controller of the ngmReportHub
 */
angular.module('ngmReportHub')
	.controller('ClusterOrganizationStockReportCtrl', [
			'$scope',
			'$route',
			'$q',
			'$http',
			'$location',
			'$anchorScroll',
			'$timeout',
			'ngmAuth',
			'ngmData',
			'ngmUser','$translate','$filter', 'ngmClusterDownloads',
	function ( $scope, $route, $q, $http, $location, $anchorScroll, $timeout, ngmAuth, ngmData, ngmUser, $translate, $filter, ngmClusterDownloads ) {
		this.awesomeThings = [
			'HTML5 Boilerplate',
			'AngularJS',
			'Karma'
		];

		// init empty model
		$scope.model = $scope.$parent.ngm.dashboard.model;

		// empty Project
		$scope.report = {

			// parent
			ngm: $scope.$parent.ngm,

			// placeholder
			organization: {},

			// placeholder
			definition: {},

			// current user
			user: ngmUser.get(),

			// report name placeholder (is updated below)
			report: 'stock_report',

			// get organization
			getOrganization: {
				method: 'POST',
				url: ngmAuth.LOCATION + '/api/getOrganization',
				data: {
					'organization_id': $route.current.params.organization_id,
					'warehouses': true
				}
			},

			// get report
			getReport: {
				method: 'POST',
				url: ngmAuth.LOCATION + '/api/cluster/stock/getReport',
				data: {
					id: $route.current.params.report_id
				}
			},

			// set project details
			init: function(){

				// set report for downloads
				$scope.report.title = $scope.report.organization.organization + ' | ' + $scope.report.definition.admin0name.toUpperCase().substring(0, 3) + ' | '+$filter('translate')('stock_report');
				$scope.report.report = $scope.report.organization.organization + '_' + moment.utc( [ $scope.report.definition.report_year, $scope.report.definition.report_month, 1 ] ).format('MMMM, YYYY');
				// set report for downloads
				$scope.report.filename = $scope.report.definition.organization  + '_' + moment( $scope.report.definition.reporting_period ).format( 'MMMM' ) + '_Stocks_extracted-' + moment().format( 'YYYY-MM-DDTHHmm' );

				// report dashboard model
				$scope.model = {
					name: 'cluster_stock_report',
					header: {
						div: {
							'class': 'col s12 m12 l12 report-header',
							style: 'border-bottom: 3px ' + $scope.report.ngm.style.defaultPrimaryColor + ' solid;'
						},
						title: {
							'class': 'col s12 m9 l9 report-title truncate',
							style: 'color: ' + $scope.report.ngm.style.defaultPrimaryColor,
							title: $scope.report.title
						},
						subtitle: {
							'class': 'col s12 m12 l12 report-subtitle truncate',
							'title': $filter('translate')('monthly_stock_report_for')+ ' ' + moment.utc( [ $scope.report.definition.report_year, $scope.report.definition.report_month, 1 ] ).format('MMMM, YYYY')
						},
						download: {
							'class': 'col s12 m3 l3 hide-on-small-only',
							downloads: [{
								type: 'csv',
								color: 'blue lighten-2',
								icon: 'assignment',
								hover: $filter('translate')('donwload_monthly_stock_report_as_csv'),
								request: {
									method: 'POST',
									url: ngmAuth.LOCATION + '/api/cluster/report/getReportCsv',
									data: {
										report: $scope.report.filename,
										report_type: 'stock',
										report_id: $scope.report.definition.id
									}
								},
								metrics: {
									method: 'POST',
									url: ngmAuth.LOCATION + '/api/metrics/set',
									data: {
										organization: $scope.report.user.organization,
										username: $scope.report.user.username,
										email: $scope.report.user.email,
										dashboard: $scope.report.title,
										theme: 'monthly_stock_report' + $scope.report.user.cluster_id,
										format: 'csv',
										url: $location.$$path
									}
								}
							},{
								type: 'client',
								color: 'blue lighten-2',
								icon: 'description',
								hover: $filter('translate')('download_stock_lists'),
								request: {
									filename: 'stock_lists' + '-extracted-' + moment().format( 'YYYY-MM-DDTHHmm' ) + '.xlsx',
									mimetype: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
									function: () => ngmClusterDownloads.downloadStockLists($scope.report.organization.admin0pcode,'', $scope.report.organization.warehouses, moment($scope.report.definition.reporting_period).startOf('month'), moment($scope.report.definition.reporting_period).endOf('month'))
								},
								metrics: {
									method: 'POST',
									url: ngmAuth.LOCATION + '/api/metrics/set',
									data: {
										organization: $scope.report.user.organization,
										username: $scope.report.user.username,
										email: $scope.report.user.email,
										dashboard: $scope.report.title,
										theme: 'monthly_stock_report_lists_' + $scope.report.user.cluster_id,
										format: 'xlsx',
										url: $location.$$path
									}
								}
							}]
						}
					},
					rows: [{
						columns: [{
							styleClass: 's12 m12 l12',
							widgets: [{
								type: 'organization.stock',
								config: {
									style: $scope.report.ngm.style,
									organization: $scope.report.organization,
									report: $scope.report.definition
								}
							}]
						}]
					},{
						columns: [{
							styleClass: 's12 m12 l12',
							widgets: [{
								type: 'html',
								card: 'card-panel',
								style: 'padding:0px; height: 90px; padding-top:10px;',
								config: {
									// html: $scope.report.ngm.footer
									templateUrl: '/scripts/widgets/ngm-html/template/footer.html',
									lightPrimaryColor: $scope.ngm.style.lightPrimaryColor,
									defaultPrimaryColor: $scope.ngm.style.defaultPrimaryColor,
								}
							}]
						}]
					}]
				}

				// assign to ngm app scope
				$scope.report.ngm.dashboard.model = $scope.model;
				setTimeout(() => {
					$('.fixed-action-btn').floatingActionButton({ direction: 'left' });
				}, 0);

			}

		}

		// send request
		$q.all([ $http( $scope.report.getOrganization ), $http( $scope.report.getReport ) ]).then( function( results ){

			// set
			$scope.report.organization = results[0].data;
			$scope.report.definition = results[1].data;

			// assign
			$scope.report.init();

		});

	}]);
