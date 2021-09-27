/**
 * @ngdoc function
 * @name ngmReportHubApp.controller:ClusterProjectReportsListCtrl
 * @description
 * # ClusterProjectReportsListCtrl
 * Controller of the ngmReportHub
 */
angular.module('ngmReportHub')
	.controller('ClusterProjectReportsListCtrl', ['$scope', '$route', '$location', '$anchorScroll', '$timeout', 'ngmAuth', 'ngmData', 'ngmUser','$translate','$filter', function ($scope, $route, $location, $anchorScroll, $timeout, ngmAuth, ngmData, ngmUser,$translate,$filter) {
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
			
			// current user
			user: ngmUser.get(),

			// current report
			report: 'report' + $location.$$path.replace(/\//g, '_') + '-extracted-' + moment().format('YYYY-MM-DDTHHmm'),

			// the header navigation settings
			getHeaderHtml: function(){
				var html = '<div class="row">'
										+'<div class="col s12 m12 l12">'
											+'<div style="padding:20px;">'
												+ '<span class="left show-on-small hide-on-med-and-up" style="padding-top:8px;padding-bottom: 15px;">' + $filter('translate')('last_updated') + ': ' + moment($scope.report.project.updatedAt).format('DD MMMM, YYYY @ h:mm:ss a') + '</span>'
												+'<a class="btn-flat waves-effect waves-teal" href="#/cluster/projects/summary/' + $scope.report.project.id +'">'
													+'<i class="material-icons mirror left">keyboard_return</i>'+$filter('translate')('back_to_project_summary')
												+'</a>'
												+'<span class="right hide-on-small-only" style="padding-top:8px;">'+$filter('translate')('last_updated')+': ' + moment( $scope.report.project.updatedAt ).format( 'DD MMMM, YYYY @ h:mm:ss a' ) +'</span>'
											+'</div>'
										+'</div>'
									+'</div>';

				return html;
			},

			// return default template or Somalia template
			getReportTemplate: function(){
				var tmpl = '/scripts/widgets/ngm-list/template/report.html';
				if ( $scope.report.project.admin0pcode === 'SO' ) {
					tmpl = '/scripts/widgets/ngm-list/template/report_somalia.html';
				}
				if ($scope.report.project.report_type_id === 'bi-weekly'){
					tmpl = '/scripts/widgets/ngm-list/template/report-biweekly.html';
				}
				return tmpl;
			},

			// return default template or Somalia template
			getReportFilter: function( obj ){
				if ( $scope.report.project.admin0pcode === 'SO' ) {
					var so = { reporting_period: { '>=': '2018-12-01' } };
					angular.merge(obj, so);
				}
				return obj;
			},

			// return url for report or summary page 
			getReportUrl: function(){
				// report
				var report_url = '#/cluster/projects/report';
				if ( $scope.report.project.location_groups_check ) {
					report_url = '#/cluster/projects/group';
				}
				return report_url;
			},

			// set project details
			setProjectDetails: function(data){

				// assign data
				$scope.report.project = data;

				// project title
				if ( $scope.report.project.admin0name ) {
					$scope.report.title = $scope.report.project.organization + ' | ' + $scope.report.project.admin0name.toUpperCase().substring(0, 3) + ' | ';
				}
				// cluster
				if( $scope.report.project.cluster.length < 31 ){
					$scope.report.title += $scope.report.project.cluster.toUpperCase() + ' | ';
				} else {
					$scope.report.title += $scope.report.project.cluster_id.toUpperCase() + ' | ';
				}
				// title
				$scope.report.title += $scope.report.project.project_title;
				

				// add project code to subtitle?
				var text = $filter('translate')('actual_monthly_beneficiaries_report_for')+' ' + $scope.report.project.project_title;
				
				if($scope.report.project.report_type_id === 'bi-weekly'){
					text = 'Actual Biweekly Report for' + ' ' + $scope.report.project.project_title;
				};
				var subtitle = $scope.report.project.project_code ?  $scope.report.project.project_code + ' - ' + text : text;

				// report dashboard model
				$scope.model = {
					name: 'cluster_project_report_list',
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
							'title': subtitle
						},
						download: {
							'class': 'col s12 m3 l3 hide-on-small-only',
							downloads: [{
								type: 'csv',
								color: 'blue lighten-2',
								icon: 'assignment',
								hover: $filter('translate')('download_monthly_reports_as_csv'),
								request: {
									method: 'POST',
									url: ngmAuth.LOCATION + '/api/cluster/project/getProjectCsv',
									data: {
										report: $filter('limitTo')($scope.report.project.project_title, 180) + '-extracted-' + moment().format('YYYY-MM-DDTHHmm'),
										project_id: $scope.report.project.id,
										project_cluster_id: $scope.report.project.cluster_id,
										project_admin0pcode: $scope.report.project.admin0pcode
									}
								},
								metrics: {
									method: 'POST',
									url: ngmAuth.LOCATION + '/api/metrics/set',
									data: {
										organization: $scope.report.user.organization,
										username: $scope.report.user.username,
										email: $scope.report.user.email,
										dashboard: $scope.report.project.project_title,
										theme: 'cluster_project_report_list',
										format: 'csv',
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
								type: 'html',
								config: {
									html: $scope.report.getHeaderHtml()
								}
							}]
						}]
					},{
						columns: [{
							styleClass: 's12 m12 l12',
							widgets: [{
								type: 'list',
								card: 'white grey-text text-darken-2',
								config: {
									titleIcon: 'alarm_on',
									color: 'indigo lighten-1',
									textColor: 'white-text',
									title: $filter('translate')('progress_update_todo'),
									hoverTitle: $filter('translate')('update'),
									icon: 'edit',
									rightIcon: 'watch_later',
									report_url: $scope.report.getReportUrl(),
									templateUrl: $scope.report.getReportTemplate(),
									orderBy: 'reporting_due_date',
									format: true,
									report_type: $scope.report.project.report_type_id === 'bi-weekly' ? $scope.report.project.report_type_id :'monthly',
									request: {
										method: 'POST',
										url: ngmAuth.LOCATION + '/api/cluster/report/getReportsList',
										data: {
											filter: $scope.report.getReportFilter({ project_id: $scope.report.project.id, report_active: true, report_status: 'todo' })
										}
									}
								}
							}]
						}]
					},{
						columns: [{
							styleClass: 's12 m12 l12',
							widgets: [{
								type: 'list',
								card: 'white grey-text text-darken-2',
								config: {
									titleIcon: 'done_all',
									color: 'indigo lighten-1',
									textColor: 'white-text',
									title: $filter('translate')('progress_update_complete'),

									hoverTitle: $filter('translate')('view'),

									icon: 'done',
									rightIcon: 'check_circle',
									report_url: $scope.report.getReportUrl(),
									templateUrl: $scope.report.getReportTemplate(),
									orderBy: 'reporting_due_date',
									format: true,
									report_type: $scope.report.project.report_type_id === 'bi-weekly' ? $scope.report.project.report_type_id : 'monthly',
									request: {
										method: 'POST',
										url: ngmAuth.LOCATION + '/api/cluster/report/getReportsList',
										data: {
											filter: $scope.report.getReportFilter({ project_id: $scope.report.project.id, report_active: true, report_status: 'complete' })
										}
									}
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
				const canDownload = ngmAuth.canDo('DASHBOARD_DOWNLOAD', {
					adminRpcode: $scope.report.project.adminRpcode,
					admin0pcode: $scope.report.project.admin0pcode,
					cluster_id: $scope.report.project.cluster_id,
					organization_tag: $scope.report.project.organization_tag
				});
				// remove download button
				if (!canDownload) {
					$scope.model.header.download.class += ' hide';
				}

				// assign to ngm app scope
				$scope.report.ngm.dashboard.model = $scope.model;
				setTimeout(() => {
					$('.fixed-action-btn').floatingActionButton({ direction: 'left' });
				}, 0);

			}			

		}		

		// Run page
		// return project
		ngmData.get({
			method: 'POST',
			url: ngmAuth.LOCATION + '/api/cluster/project/getProject',
			data: {
				id: $route.current.params.project
			}
		}).then(function(data){
			// assign data
			$scope.report.setProjectDetails(data);
		});
		
	}]);