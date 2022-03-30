/**
 * @ngdoc function
 * @name ngmReportHubApp.controller:ClusterProjectSummaryCtrl
 * @description
 * # ClusterProjectSummaryCtrl
 * Controller of the ngmReportHub
 */
angular.module('ngmReportHub')
	.controller('ClusterProjectSummaryCtrl', ['$scope', '$route', '$http', '$location', '$timeout', 'ngmAuth', 'ngmData', 'ngmUser', '$translate', '$filter', '$rootScope', function ($scope, $route, $http, $location, $timeout, ngmAuth, ngmData, ngmUser, $translate, $filter, $rootScope) {
		this.awesomeThings = [
			'HTML5 Boilerplate',
			'AngularJS',
			'Karma'
		];

		// return project
		ngmData.get({
			method: 'POST',
			url: ngmAuth.LOCATION + '/api/cluster/project/getProject',
			data: {
				id: $route.current.params.project
			}
		}).then(function(data){
			// assign data
			$scope.report.setProjectSummary( data );
		});

		// init empty model
		$scope.model = $scope.$parent.ngm.dashboard.model;

		// report object
		$scope.report = {

			// ngm
			ngm: $scope.$parent.ngm,

			// current user
			user: ngmUser.get(),

			title: '',

			// projects href
			getProjectsHref: function(){
				var href = '#/cluster/projects/list';

				if ($rootScope.projecListPreviouseUrl){
					href = $rootScope.projecListPreviouseUrl
				}

				return href;
			},

			// set summary
			setProjectSummary: function(data){

				// set project
				$scope.report.project = data;

				// project title
				if ( $scope.report.project.admin0name ) {
					$scope.report.title = $scope.report.project.organization + ' | ' + $scope.report.project.admin0name.toUpperCase().substring(0, 3) + ' | ';
				}
				// cluster
				if ($scope.report.project.cluster && $scope.report.project.cluster.length < 31 ){
					$scope.report.title += $scope.report.project.cluster.toUpperCase() + ' | ';
				} else {
					$scope.report.title += $scope.report.project.cluster_id.toUpperCase() + ' | ';
				}
				// title
				$scope.report.title += $scope.report.project.project_title;

				// add project code to subtitle?
				var text = $filter('translate')('actual_monthly_progress_report_for')+' ' + $scope.report.project.project_title
				var subtitle = $scope.report.project.project_code ?  $scope.report.project.project_code + ' - ' + $scope.report.project.project_description : $scope.report.project.project_description;

				// report dashboard model
				$scope.model = {
					name: 'cluster_project_summary',
					header: {
						div: {
							'class': 'col s12 m12 l12 report-header',
							style: 'border-bottom: 3px ' + $scope.report.ngm.style.defaultPrimaryColor + ' solid;'
						},
						title: {
							'class': 'col s12 m12 l12 report-title truncate',
							style: 'color: ' + $scope.report.ngm.style.defaultPrimaryColor,
							title: $scope.report.title
						},
						subtitle: {
							'class': 'col s12 m12 l12 report-subtitle truncate',
							'title': subtitle
						}
					},
					rows: [{
						columns: [{
							styleClass: 's12 m12 l12',
							widgets: [{
								type: 'html',
								card: 'white grey-text text-darken-2',
								style: 'padding: 20px;',
								config: {
									html: '<span class="left show-on-small hide-on-med-and-up" style="padding-top:8px;padding-left:17px;padding-bottom: 15px;">' + $filter('translate')('last_updated') + ': ' + moment($scope.report.project.updatedAt).format('DD MMMM, YYYY @ h:mm:ss a') + '</span>'+'<a class="btn-flat waves-effect waves-teal left" href="' + $scope.report.getProjectsHref() + '"><i class="material-icons mirror left">keyboard_return</i>' + ($scope.report.project.admin0pcode === 'AF' ? $filter('translate')('back_to_activity_plans') : $filter('translate')('back_to_projects')) + '</a><span class="right hide-on-small-only" style="padding-top:8px;">' + $filter('translate')('last_updated') + ': ' + moment($scope.report.project.updatedAt).format('DD MMMM, YYYY @ h:mm:ss a') + '</span>'
								}
							}]
						}]
					},{
						columns: [{
							styleClass: 's12 m12 l12',
							widgets: [{
								type: 'html',
								card: 'white grey-text text-darken-2',
								style: 'padding: 0px;',
								config: {
									project: $scope.report.project,
									user: $scope.report.user,
									report_date: moment().subtract( 1, 'M').endOf( 'M' ).format('YYYY-MM-DD'),
									templateUrl: '/scripts/modules/cluster/views/cluster.project.summary.html',

									// permissions
									canEdit: ngmAuth.canDo( 'EDIT', { adminRpcode: $scope.report.project.adminRpcode, admin0pcode:$scope.report.project.admin0pcode, cluster_id: $scope.report.project.cluster_id, organization_tag:$scope.report.project.organization_tag } ),
									canDelete: ngmAuth.canDelete(),
									reason_to_delete_project:'',
									// mark project active
									markActive: function( project ){

									  // mark project active
									  project.project_status = 'active';

									  // timeout
									  $timeout(function(){
										//   Materialize.toast( $filter('translate')('processing')+'...', 6000, 'note');
										  M.toast({ html: $filter('translate')('processing') + '...', displayLength: 6000, classes: 'note' });
										}, 200 );

									  // Submit project for save
									  ngmData.get({
									    method: 'POST',
									    url: ngmAuth.LOCATION + '/api/cluster/project/setProject',
									    data: {
									      project: project
									    }
									  }).then(function(data){
									    // redirect on success
										// Materialize.toast( $filter('translate')('project_moved_to_active')+'!', 6000, 'success');
										M.toast({ html: $filter('translate')('project_moved_to_active') + '!', displayLength: 6000, classes: 'success' });
									  });

									},

									// mark poject complete
									markComplete: function( project ){

									  // mark project complete
									  project.project_status = 'complete';

									  // timeout
									  $timeout(function(){
										//   Materialize.toast( $filter('translate')('processing')+'...', 6000, 'note');
										M.toast({ html: $filter('translate')('processing') + '...', displayLength: 6000, classes: 'note' });
										}, 200 );

									  // Submit project for save
									  ngmData.get({
									    method: 'POST',
									    url: ngmAuth.LOCATION + '/api/cluster/project/setProject',
									    data: {
									      project: project
									    }
									  }).then(function(data){
									    // redirect on success
									    $location.path( '/cluster/projects/list' );
										// Materialize.toast( $filter('translate')('project_market_as_complete_congratulations')+'!', 6000, 'success');
										  M.toast({ html: $filter('translate')('project_market_as_complete_congratulations') + '!', displayLength: 6000, classes: 'success' });
									  });

									},
									markPlan:function(project){
										// mark project plan
										project.project_status = 'plan';
										// project.project_start_date = moment(new Date()).format('YYYY-MM-DD');
										// timeout
										$timeout(function () {
											// Materialize.toast($filter('translate')('processing') + '...', 6000, 'note');
											M.toast({ html: $filter('translate')('processing') + '...', displayLength: 6000, classes: 'note' });
										}, 200);

										// Submit project for save
										ngmData.get({
											method: 'POST',
											url: ngmAuth.LOCATION + '/api/cluster/project/setProject',
											data: {
												project: project
											}
										}).then(function (data) {
											// redirect on success
											$location.path('/cluster/projects/list');
											// Materialize.toast('Project Moved to Plan!', 6000, 'success');
											M.toast({ html: 'Project Moved to Plan!', displayLength: 6000, classes: 'success' });
										});
									},
									markNotImplemented: function (project) {
										// mark project plan
										project.project_status = 'not_implemented';

										// timeout
										$timeout(function () {
											// Materialize.toast($filter('translate')('processing') + '...', 6000, 'note');
											M.toast({ html: $filter('translate')('processing') + '...', displayLength: 6000, classes: 'note' });
										}, 200);

										// Submit project for save
										ngmData.get({
											method: 'POST',
											url: ngmAuth.LOCATION + '/api/cluster/project/setProject',
											data: {
												project: project
											}
										}).then(function (data) {
											// redirect on success
											$location.path('/cluster/projects/list');
											// Materialize.toast('Project Moved to Not Implemented!', 6000, 'success');
											M.toast({ html: 'Project Moved to Not Implemented!', displayLength: 6000, classes: 'success' });
										});
									},
									deleteProject: function(project){

									  // timeout
									  $timeout(function(){
										//   Materialize.toast( $filter('translate')('processing')+'...', 6000, 'note');
										  M.toast({ html: $filter('translate')('processing') + '...', displayLength: 6000, classes: 'note' });
										}, 200 );

									  // Submit project for save
									  $http({
									    method: 'POST',
									    url: ngmAuth.LOCATION + '/api/cluster/project/delete',
									    data: {
									      project_id: project.id
									    }
									  }).then(function(data){

									    // redirect on success
									    if ( data.data.err ) {
											// Materialize.toast( $filter('translate')('project_delete_error_please_try_again'), 6000, 'error');
											M.toast({ html: $filter('translate')('project_delete_error_please_try_again'), displayLength: 6000, classes: 'error' });
									    }
									    if ( !data.data.err ){
										    $location.path( '/cluster/projects/list' );
											// Materialize.toast( $filter('translate')('project_deleted')+'!', 6000, 'success');
											M.toast({ html: $filter('translate')('project_deleted') + '!', displayLength: 6000, classes: 'success' });

												var notification_delete_project = $http({
													method: 'POST',
													url: ngmAuth.LOCATION + '/api/send-notification-success-delete-project',
													data: {
														admin: $scope.report.user.username,
														admin_fullname: $scope.report.user.name,
														admin_email: $scope.report.user.email,
														organization_tag: $scope.report.project.organization_tag,
														project_title: $scope.report.project.project_title,
														admin0pcode: $scope.report.project.admin0pcode,
														admin0name: $scope.report.project.admin0name,
														focal_point: $scope.report.project.name,
														focal_point_username: $scope.report.project.username,
														focal_point_email: $scope.report.project.email
													}
												});
	
												notification_delete_project.then(function (result) {

													$timeout(function () {
														M.toast({ html: 'Send Email to Focal Point Project', displayLength: 3000, classes: 'success' });
													}, 400);
												}).catch(function (err) {

													$timeout(function () {;
														M.toast({ html: err.msg, displayLength: 6000, classes: 'error' });
													}, 400);
												});
											
											

									    }
									  }).catch(function(err){
									    // redirect on success
										// Materialize.toast( $filter('translate')('project_delete_error_please_try_again'), 6000, 'error');
										  M.toast({ html: $filter('translate')('project_delete_error_please_try_again'), displayLength: 6000, classes: 'error' });
									  });
									},
									sendRequestToDeleteProject:function(text_reason){

										if (text_reason === 'cancel_send_request'){
											this.reason_to_delete_project ='';
										}else{
											$timeout(function () {
												//   Materialize.toast( $filter('translate')('processing')+'...', 6000, 'note');
												M.toast({ html: $filter('translate')('processing') + '...', displayLength: 3000, classes: 'note' });
											}, 200);
											let link_project = ngmAuth.LOCATION + '/desk/#' + $location.path();
											var request_delete = $http({
												method: 'POST',
												url: ngmAuth.LOCATION + '/api/send-request-to-delete-project',
												data: {
													url: link_project,
													username: $scope.report.user.username,
													name: $scope.report.user.name,
													url_user: ngmAuth.LOCATION + '/desk/#/profile/'+$scope.report.user.username,
													reasons: text_reason,
													organization_tag: $scope.report.project.organization_tag,
													project_title: $scope.report.project.project_title,
													admin0pcode: $scope.report.project.admin0pcode,
													admin0name: $scope.report.project.admin0name,
													focal_point: $scope.report.project.name,
													focal_point_username: $scope.report.project.username,
													focal_point_email: $scope.report.project.email
												}
											});

											request_delete.then(function (result) {

												// user toast msg
												$timeout(function () {
													// Materialize.toast($filter('translate')('email_sent_please_check_your_inbox'), 6000, 'success');
													M.toast({ html: 'Email already send to Admin', displayLength: 3000, classes: 'success' });
												}, 400);
											}).catch(function (err) {

												// update
												$timeout(function () {
													// Materialize.toast( err.msg, 6000, 'error' );
													M.toast({ html: err.msg, displayLength: 6000, classes: 'error' });
												}, 400);
											});
											this.reason_to_delete_project = '';
										}
										
									},
									checkTheReason:function(string){
										var disabled = false;
										if(string.length<20){
											disabled = true;
										}else{
											str = string.replace(/\s+/g, '');
											disabled = str.length >=20 ? false: true;
										}
										return disabled;
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
				};

				// assign to ngm app scope
				$scope.report.ngm.dashboard.model = $scope.model;

			}

		}

	}]);
