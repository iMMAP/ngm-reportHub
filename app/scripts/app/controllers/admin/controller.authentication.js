/**
 * @ngdoc function
 * @name ngmReportHubApp.controller:ProjectFinancialsCtrl
 * @description
 * # ProjectFinancialsCtrl
 * Controller of the ngmReportHub
 */

angular.module('ngm.widget.form.authentication', ['ngm.provider'])
	.config(function(dashboardProvider){
		dashboardProvider
			.widget('form.authentication', {
				title: 'ReportHub Authentication Form',
				description: 'ReportHub Authentication Form',
				controller: 'AuthenticationFormCtrl',
				templateUrl: '/scripts/app/views/view.html'
			});
	})
	.controller( 'AuthenticationFormCtrl', [
		'$scope',
		'$http',
		'$location',
		'$timeout',
		 '$filter',
		'$q',
		'ngmAuth',
		'ngmUser',
		'ngmData',
		'ngmClusterLists',
		'ngmLists',
		'ngmLocalDB',
		'config',
		'$translate',
		'$rootScope',
		function ($scope, $http, $location, $timeout, $filter, $q, ngmAuth, ngmUser, ngmData, ngmClusterLists, ngmLists, ngmLocalDB, config, $translate,$rootScope){


			// 4wPlus
			if( $location.$$host === "4wplus.org" || $location.$$host === "35.229.43.63" ){
				var4wplusrh = "4wPlus";
			}else{
				var4wplusrh = "ReportHub"
			}

			// project
			$scope.panel = {

				err: false,

				var4wplusrh :var4wplusrh,

				date : new Date(),

				user: config.user ? config.user : ngmUser.get(),//ngmUser.get() ? ngmUser.get() : {},

				btnDisabled: false,

				btnActivate: config.user && config.user.status === 'deactivated' ? true : false,

				btnDeactivate: config.user && config.user.status === 'active' ? true : false,

				// editable role array:
				editRoleUrl: '/scripts/app/views/authentication/edit-role.html',

				// adminRegion
				adminRegion: [
					{ adminRpcode: 'EMRO', adminRname: 'EMRO', admin0pcode: 'AF', admin0name: 'Afghanistan' },
					// { adminRpcode: 'SEARO', adminRname: 'SEARO', admin0pcode: 'BD', admin0name: 'Bangladesh' },
					{ adminRpcode: 'AMER', adminRname: 'AMER', admin0pcode: 'COL', admin0name: 'Colombia'},
					{ adminRpcode: 'SEARO', adminRname: 'SEARO', admin0pcode: 'CB', admin0name: 'Cox Bazar' },
					{ adminRpcode: 'AFRO', adminRname: 'AFRO', admin0pcode: 'CD', admin0name: 'Democratic Republic of Congo' },
					{ adminRpcode: 'AFRO', adminRname: 'AFRO', admin0pcode: 'ET', admin0name: 'Ethiopia' },
					{ adminRpcode: 'EMRO', adminRname: 'EMRO', admin0pcode: 'IQ', admin0name: 'Iraq' },
					{ adminRpcode: 'AFRO', adminRname: 'AFRO', admin0pcode: 'KE', admin0name: 'Kenya' },
					{ adminRpcode: 'AFRO', adminRname: 'AFRO', admin0pcode: 'NG', admin0name: 'Nigeria' },
					{ adminRpcode: 'WPRO', adminRname: 'WPRO', admin0pcode: 'PG', admin0name: 'Papua New Guinea' },
					{ adminRpcode: 'WPRO', adminRname: 'WPRO', admin0pcode: 'PHL', admin0name: 'Philippines' },
					{ adminRpcode: 'EMRO', adminRname: 'EMRO', admin0pcode: 'SO', admin0name: 'Somalia' },
					{ adminRpcode: 'AFRO', adminRname: 'AFRO', admin0pcode: 'SS', admin0name: 'South Sudan' },
					{ adminRpcode: 'EMRO', adminRname: 'EMRO', admin0pcode: 'SY', admin0name: 'Syria' },
					{ adminRpcode: 'EURO', adminRname: 'EURO', admin0pcode: 'UA', admin0name: 'Ukraine' },
					{ adminRpcode: 'EMRO', adminRname: 'EMRO', admin0pcode: 'UR', admin0name: 'Uruk' },
					{ adminRpcode: 'EMRO', adminRname: 'EMRO', admin0pcode: 'YE', admin0name: 'Yemen' }

				],

				// programme
				programme:[
					{ programme_id: 'DRCWHOPHISP1', programme_name: 'DRCWHOPHISP1' },
					{ programme_id: 'ETWHOIMOSUPPORTP1', programme_name: 'ETWHOIMOSUPPORTP1' },
					{ programme_id: 'ETWHOIMOSUPPORTP2', programme_name: 'ETWHOIMOSUPPORTP2' },
					{ programme_id: 'ETUSAIDOFDAIMOSUPPORTP1', programme_name: 'ETUSAIDOFDAIMOSUPPORTP1' },
					{ programme_id: 'WWCDCCOOPERATIVEAGREEMENTP11', programme_name: 'WWCDCCOOPERATIVEAGREEMENTP11' },
					{ programme_id: 'WWCDCCOOPERATIVEAGREEMENTP12', programme_name: 'WWCDCCOOPERATIVEAGREEMENTP12' },
				],

				// duty stations
				dutyStations: ngmLists.getObject( 'dutyStations' ),

				// cluster
				clusters:{
					active:{},
					'col' : {
						'education':{cluster:'Educación en Emergencias (EeE)'},
						'alojamientos_asentamientos':{cluster:'Alojamientos/Asentamientos'},
						'san':{cluster:'Seguridad Alimentaria y Nutrición (SAN'},
						'health':{cluster:'Salud'},
						'recuperacion_temprana':{cluster:'Recuperación Temprana'},
						'protection':{cluster:'Protección'},
						'wash':{cluster:'WASH'},
						'undaf':{cluster:'UNDAF'},
						'cvwg': { cluster: 'MPC' },
						'smsd':{cluster:'Sitio de Administración y Sitio de Desarrollo'}

					},
					'all': {
						'cvwg': { cluster: 'MPC' },
						'agriculture': { cluster: 'Agriculture' },
						'cccm_esnfi': { cluster: 'CCCM - Shelter' },
						'cwcwg': { cluster: 'CwCWG' },
						'coordination': { cluster: 'Coordination' },
						'education': { cluster: 'Education' },
						'eiewg': { cluster: 'EiEWG' },
						'emergency_telecommunications': { cluster: 'Emergency Telecommunications' },
						'esnfi': { cluster: 'ESNFI' },
						'fsac': { cluster: 'FSAC' },
						'fss': { cluster: 'Food Security' },
						'health': { cluster: 'Health' },
						'logistics': { cluster: 'Logistics' },
						'smsd': { cluster: 'Site Management, Site Development and DRR' },
						'nutrition': { cluster: 'Nutrition' },
						'protection': { cluster: 'Protection' },
						'rnr_chapter': { cluster: 'R&R Chapter' },
						'wash': { cluster: 'WASH' },
						'child_protection':{ cluster: 'Child Protection' },
						'gbv': { cluster: 'Gender Based Violence' }
					}
				},


				// initialize page
				init: function(){

					// fetch duty stations
					if ( !localStorage.getObject( 'dutyStations') ) {
						// activities list
						var getDutyStations = {
							method: 'GET',
							url: ngmAuth.LOCATION + '/api/list/getDutyStations'
						}
						// send request
						$q.all([ $http( getDutyStations ) ] ).then( function( results ){
							localStorage.setObject( 'dutyStations', true );
							ngmLocalDB.setItem( 'dutyStations', results[0].data );
							ngmLists.setObject( 'dutyStations', results[0].data );
							$scope.panel.dutyStations = results[0].data;
						});
					}

					// set clusters
					$scope.panel.clusters.active = ngmClusterLists.getClusters('all').filter(cluster=>cluster.registration!==false);

					// if config user
					if ( config.user ) {
						$scope.panel.roles = ngmAuth.getEditableRoles();
					}

					// merge defaults with config
					$scope.panel = angular.merge( {}, $scope.panel, config );

					// set
					$http.get( ngmAuth.LOCATION + '/api/list/organizations' ).then(function( organizations ){
						// localStorage.setObject( 'organizations', organizations.data );
						localStorage.setObject( 'organizations', true );
						ngmLocalDB.setItem( 'organizations' , organizations.data, false, false )
						ngmLists.setObject( 'organizations', organizations.data );
						$scope.panel.organizations = organizations.data;
						$scope.panel.organizations_list = organizations.data;

						// filter lists
						$scope.panel.clusterByCountry();
						$scope.panel.orgByCountry();

						$timeout( function() {
							// $( 'select' ).material_select();
							$('select').formSelect();
						}, 400 );
					});

				},


				// filter cluster / org by country
				clusterByCountry: function() {

					// filter organizations, clusters
					var organizations = $scope.panel.organizations_list;

					// selected coutry
					var country = $scope.panel && $scope.panel.user && $scope.panel.user.admin0pcode ? $scope.panel.user.admin0pcode:'all';

					// COL
					if( ( !$scope.panel.user && var4wplusrh === '4wPlus' ) ||
								( $scope.panel.user && ( $scope.panel.user.admin0pcode && $scope.panel.user.admin0pcode === 'COL' ) ) ){

						// new filter
						// var organizations = [];

						// filter CLUSTERS by country
						$scope.panel.clusters.active = ngmClusterLists.getClusters('COL').filter( cluster=>cluster.registration!==false );

						// filter ORGANIZATIONS by country
						// angular.forEach( $scope.panel.organizations_list, function( item ) {
						// 	if ( item.admin0pcode.indexOf('COL') !== -1 ) {
						// 		organizations.push(item);
						// 	}
						// });
					}

					// ALL
					if( ( !$scope.panel.user && var4wplusrh !== '4wPlus') ||
								( $scope.panel.user && ( $scope.panel.user.admin0pcode && $scope.panel.user.admin0pcode !== 'COL' ) ) ){

						// new filter
						// var organizations = [];

						// filter CLUSTERS by country
						$scope.panel.clusters.active = ngmClusterLists.getClusters( country ).filter( cluster=>cluster.registration!==false );

						// filter by country
						// angular.forEach( $scope.panel.organizations_list, function( item ) {
						// 	if (item.admin0pcode.indexOf('ALL') !== -1 || item.admin0pcode.indexOf('') !== -1) {
						// 		organizations.push(item);
						// 	}
						// });
					}

					// set organizations
					// $scope.panel.organizations = organizations;

				},


				orgByCountry:function(){
					var country = $scope.panel && $scope.panel.user && $scope.panel.user.admin0pcode ? $scope.panel.user.admin0pcode : 'all';

					if ($scope.panel.organizations && $scope.panel.organizations.length ){
						$scope.panel.organizations = $scope.panel.organizations_list.filter((x)=>{
						if ((x.admin0pcode.indexOf(country) > -1) || (x.admin0pcode.indexOf('ALL') >-1 )){
							// check if organization is inactive or active
							if (x.admin0pcode_inactive && x.admin0pcode_inactive !== '' ){
								if (x.admin0pcode_inactive.indexOf(country) < 0 && x.admin0pcode_inactive.indexOf('ALL') < 0){
									return x
								}
							}else{
								return x
							}
						}

					});
					}
					// sort
					$scope.panel.organizations = $filter('orderBy')($scope.panel.organizations, 'organization');
					// reset model when change country for new register user
					if ($scope.panel.user && !$scope.panel.user.id){
						delete $scope.panel.user.cluster_id;
						delete $scope.panel.user.organization;
					}

				},


				// login fn
				login: function( ngmLoginForm ){

					// if invalid
					if( ngmLoginForm.$invalid ){
						// set submitted for validation
						ngmLoginForm.$setSubmitted();
					} else {
						$scope.panel.isLogging = true;
						// login
						ngmAuth
							.login({ user: $scope.panel.user }).then( function( result ) {
								$scope.panel.isLogging = false;
								// db error!
								if( result.data.err || result.data.summary ){
									var msg = result.data.summary ? result.data.summary : result.data.msg;
									// Materialize.toast( msg, 6000, 'error' );
									M.toast({ html: msg, displayLength: 6000, classes: 'error' });
								}

								// success
								if ( !result.data.err && !result.data.summary ){

									// go to default org page
									$location.path( result.data.app_home );
									$timeout( function(){

										// Materialize.toast( $filter('translate')('welcome_back')+' ' + result.username + '!', 6000, 'note' );
										M.toast({ html: $filter('translate')('welcome_back') + ' ' + result.data.username + '!', displayLength: 6000, classes: 'note' });
									}, 2000);
								}

							})
							.catch(function(err) {
								$scope.panel.isLogging = false;
							});

					}
				},


				// open modal by id
				openModal: function( modal ) {
					// $( '#' + modal ).openModal({ dismissible: false });
					$('#' + modal).modal({ dismissible: false });
					$('#' + modal).modal('open');
				},

				// deactivate
				updateStatus: function ( status ) {
					// set status
					$scope.panel.user.status = status;
					$scope.panel.update( true );

				},

				// delete user!
				delete: function () {

					// disable btns
					$scope.panel.btnDisabled = true;

					// return project
					ngmData.get({
						method: 'POST',
						url: ngmAuth.LOCATION + '/api/delete',
						data: {
							user: $scope.panel.user
						}
					}).then( function( data ){

						if ( data.success ) {
							// success message
							// Materialize.toast( $filter('translate')('success')+' '+$filter('translate')('user_deleted'), 6000, 'success' );
							M.toast({ html: $filter('translate')('success') + ' ' + $filter('translate')('user_deleted'), displayLength: 6000, classes: 'success' });
							$timeout( function(){
								var path = ( ngmUser.get().organization === 'iMMAP' && ( ngmUser.get().admin0pcode === 'CD' || ngmUser.get().admin0pcode === 'ET' ) ) ? '/immap/team' : '/team';
								if ($rootScope.teamPreviouseUrl) {
									path = path = $rootScope.teamPreviouseUrl.split('#')[1];
								}
								$location.path( path );
							}, 1000 );
						} else {
							// Materialize.toast( $filter('translate')('error_try_again'), 6000, 'error' );
							M.toast({ html: $filter('translate')('error_try_again'), displayLength: 6000, classes: 'error' });
						}

					});
				},
				// copy To Clipboard
				copyToClipboard: function(apikey){
					if(apikey == null || apikey == ''){
						M.toast({ html: 'Copy To Clipboard Error (not api key found)', displayLength: 6000, classes: 'error' });

					} else {
						navigator.clipboard.writeText(apikey);
						M.toast({ html: 'Copied Successfully', displayLength: 3000, classes: 'success' });
					}
				},

				// update profile
				update: function( reload ) {

					// message
					$timeout(function(){
						// Materialize.toast( $filter('translate')('processing')+'...', 6000, 'note');
						M.toast({ html: $filter('translate')('processing') + '...', displayLength: 6000, classes: 'note' });
					}, 200 );

					// disable btns
					$scope.panel.btnDisabled = true;

					// cluster
					// var cluster = $filter('filter')( $scope.panel.clusters.active, { cluster_id: $scope.panel.user.cluster_id } )[0].cluster;
					var cluster_filter = $filter('filter')($scope.panel.clusters.active, { cluster_id: $scope.panel.user.cluster_id });
					var cluster = cluster_filter.length ? cluster_filter[0].cluster: "";

					// merge adminRegion
					$scope.panel.user = angular.merge( {}, $scope.panel.user,
																									$filter('filter')( $scope.panel.adminRegion, { admin0pcode: $scope.panel.user.admin0pcode }, true)[0],
																									$filter('filter')( $scope.panel.programme, { programme_id: $scope.panel.user.programme_id }, true)[0],
																								{ cluster } );

					// if immap and ET || CD
					if ( $scope.panel.user.site_name ) {
						var dutyStation = $filter('filter')( $scope.panel.dutyStations, { site_name: $scope.panel.user.site_name }, true)[0];
								delete dutyStation.id;
						// merge duty station
						$scope.panel.user = angular.merge( {}, $scope.panel.user, dutyStation );
					}
					// if Update Organization OR Cluster
					var orgUpdatedTo;
					var clusterUpdatedTo;
					if (config.user.organization_tag !== $scope.panel.user.organization_tag){
						orgUpdatedTo = $scope.panel.user.organization;
					}
					if (config.user.cluster_id !== $scope.panel.user.cluster_id){
						clusterUpdatedTo = $scope.panel.user.cluster;
					}
					if(!$scope.panel.validateUpdateProfile($scope.panel.user)){
						// Materialize.toast( msg, 6000, msg );
						$timeout(function(){
							M.toast({ html: 'Update Error', displayLength: 6000, classes: 'error' });
							if(cluster === ''){
								M.toast({ html: 'Please change your sector! Sector is not active in '+ $scope.panel.user.admin0name, displayLength: 6000, classes: 'error' });
							}
							$scope.panel.btnDisabled = false;
						},300)
					}else{
						// register
						ngmAuth
							.updateProfile({ user: $scope.panel.user }).then(function( result ) {

								// db error!
								if( result.data.err || result.data.summary ){
									var msg = result.data.msg ? result.data.msg : 'error!';
									// Materialize.toast( msg, 6000, msg );
									M.toast({ html: msg, displayLength: 6000, classes: 'error' });
								}

								// success
								if ( result.data.success ){
									// set user and localStorage (if updating own profile)
									if ( $scope.panel.user.id === ngmUser.get().id ) {
										$scope.panel.user = angular.merge( {}, $scope.panel.user, result.data.user );
										ngmUser.set( $scope.panel.user );
									}
									// success message

									$timeout( function(){
										//
										if (config.user.organization_tag !== $scope.panel.user.organization_tag){
											// Materialize.toast('Organization changed to ' + orgUpdatedTo, 6000, 'success');
											M.toast({ html: 'Organization changed to ' + orgUpdatedTo, displayLength: 6000, classes: 'success' });
										}
										if (config.user.cluster_id !== $scope.panel.user.cluster_id){
											// Materialize.toast('Cluster changed to ' + clusterUpdatedTo, 6000, 'success');
											M.toast({ html: 'Cluster changed to ' + clusterUpdatedTo, displayLength: 6000, classes: 'success' });
										}
										if(config.user.api_key !== $scope.panel.user.api_key) {
											M.toast({ html: 'Generating API Key' + '...', displayLength: 6000, classes: 'note' });
										}
										// Materialize.toast( $filter('translate')('success')+' '+$filter('translate')('profile_updated'), 6000, 'success' );
										M.toast({ html: $filter('translate')('success') + ' ' + $filter('translate')('profile_updated'), displayLength: 6000, classes: 'success' });

										// activate btn
										$scope.panel.btnDisabled = false;

										// redirect to team view and page refresh
										if ( reload ) {
											var path = ( ngmUser.get().organization === 'iMMAP' && ( ngmUser.get().admin0pcode === 'CD' || ngmUser.get().admin0pcode === 'ET' ) ) ? '/immap/team' : '/team';
											if ($rootScope.teamPreviouseUrl) {
												  path = $rootScope.teamPreviouseUrl.split('#')[1];
											}
											$location.path( path );
										}else{
											if ($scope.panel.user.id === ngmUser.get().id) {
												$location.path('/profile/' + $scope.panel.user.username);
											}
										}
									}, 200 );
								}

							});
					}
				},

				// register fn
				register: function( ngmRegisterForm ){

					$scope.panel.isRegistering = true;

					// cluster
					var cluster = $filter('filter')( $scope.panel.clusters.active, { cluster_id: $scope.panel.user.cluster_id } )[0].cluster;

					// merge adminRegion
					$scope.panel.user = angular.merge( {}, $scope.panel.user,
																									$filter('filter')( $scope.panel.programme, { programme_id: $scope.panel.user.programme_id }, true)[0],
																									$filter('filter')( $scope.panel.adminRegion, { admin0pcode: $scope.panel.user.admin0pcode }, true)[0],
																									{ cluster } );

					// if immap and ET || CD
					if ( $scope.panel.user.site_name ) {
						var dutyStation = $filter('filter')( $scope.panel.dutyStations, { site_name: $scope.panel.user.site_name }, true)[0];
								delete dutyStation.id;
						// merge duty station
						$scope.panel.user = angular.merge( {}, $scope.panel.user, dutyStation );
					}

					M.toast({ html: "Please wait....", displayLength: 3000, classes: 'note' });
					// register
					ngmAuth
						.register({ user: $scope.panel.user }).then(function( result ) {

						$scope.panel.isRegistering = false;
						// db error!
						if( result.data.err || result.data.summary ){
							var msg = result.data.summary ? result.data.summary : result.data.msg;
							// Materialize.toast( msg, 6000, 'error' );
							M.toast({ html: msg, displayLength: 6000, classes: 'error' });
						}

						// success
						if ( !result.data.err && !result.data.summary ){
							// go to default org page
							if (result.data.status !== 'deactivated'){
								$location.path( result.data.app_home );
								$timeout( function(){

									// Materialize.toast( $filter('translate')('welcome')+' ' + result.username + ', '+$filter('translate')('time_to_create_a_project'), 6000, 'success' );
									M.toast({ html: $filter('translate')('welcome') + ' ' + result.data.username + ', ' + $filter('translate')('time_to_create_a_project'), displayLength: 6000, classes: 'success' });

								}, 2000);
							}else{
								$location.path('/cluster/pending/');
								$timeout(function () {
									M.toast({ html: result.data.username + ', not activated yet!', displayLength: 6000, classes: 'error'  });
								}, 1000);
								ngmUser.unset();
							}
						}

					})
					.catch(function(err) {
						$scope.panel.isRegistering = false;
					});

				},

				// register fn
				passwordResetSend: function( ngmResetForm ){

					// if $invalid
					if( ngmResetForm.$invalid ){
						// set submitted for validation
						ngmResetForm.$setSubmitted();
					} else {

						// user toast msg
						$timeout(function(){

							// Materialize.toast($filter('translate')('your_email_is_being_prepared'), 6000, 'note');
							M.toast({ html: $filter('translate')('your_email_is_being_prepared'), displayLength: 6000, classes: 'note' });

						}, 400);

						// resend password email
						ngmAuth.passwordResetSend({
								user: $scope.panel.user,
								url: ngmAuth.LOCATION + '/desk/#/cluster/find/'
							}).then( function( result ) {

								// go to password reset page
								if(!result.data.err){
									$( '.carousel' ).carousel( 'prev' );
									// user toast msg
									$timeout(function(){
										// Materialize.toast($filter('translate')('email_sent_please_check_your_inbox'), 6000, 'success');
										M.toast({ html: $filter('translate')('email_sent_please_check_your_inbox'), displayLength: 6000, classes: 'success' });
									}, 400);
								}else{
									$scope.panel.err = result.data.err;

									// update
									$timeout(function () {
										// Materialize.toast( err.msg, 6000, 'error' );
										M.toast({ html: result.data.msg, displayLength: 6000, classes: 'error' });
									}, 400);
								}

							}).catch(function( err ) {

								// set err
								$scope.panel.err = err;

								// update
								$timeout(function(){
									// Materialize.toast( err.msg, 6000, 'error' );
									M.toast({ html: err.msg, displayLength: 6000, classes: 'error' });
								}, 400);
							});
					}

				},

				// register fn
				passwordReset: function( ngmResetPasswordForm, token ){

					// if $invalid
					if(ngmResetPasswordForm.$invalid){
						// set submitted for validation
						ngmResetPasswordForm.$setSubmitted();
					} else {

						// register
						ngmAuth.passwordReset({ reset: $scope.panel.user, token: token })
							.then( function( result ) {

							// go to default org page
							$location.path( '/' + result.data.app_home );

							// user toast msg
							$timeout(function(){

								// Materialize.toast( $filter('translate')('welcome_back')+' ' + + result.username + '!', 6000, 'note' );
								M.toast({ html: $filter('translate')('welcome_back') + ' ' + result.data.username + '!' , displayLength: 6000, classes: 'note' });
							}, 2000);


						}).catch(function(err) {
							// update
							$timeout(function(){
								// Materialize.toast( err.msg, 6000, 'error' );
								M.toast({ html: err.data.msg , displayLength: 6000, classes: 'error' });
							}, 1000);
						});
					}

				},

				// RnR chapter validation
				organizationDisabled: function(){

					var disabled = true;
					if ( $scope.panel.user && $scope.panel.user.admin0pcode && $scope.panel.user.cluster_id && $scope.panel.user.organization_name ) {
						// not R&R Chapter
						if ( $scope.panel.user.cluster_id !== 'rnr_chapter' ) {
							var cek_attr_organization = $filter('filter')($scope.panel.organizations, { organization: $scope.panel.user.organization }, true);
							if (cek_attr_organization.length) {
								if (cek_attr_organization[0].organization === $scope.panel.user.organization) {

									disabled = false;
								}
							}
						} else {
							if ( $scope.panel.user.organization === 'UNHCR' || $scope.panel.user.organization === 'IOM' ) {
								disabled = false;
							} else {
								disabled = true;
							}
						}
					}
					return disabled;
				},

				// select org
				onOrganizationSelected: function(){
					// filter
					$scope.select = $filter( 'filter' )( $scope.panel.organizations, { organization: $scope.panel.user.organization }, true );
					// merge org
					var org = angular.copy( $scope.select[0] );
					delete org.id;
					delete org.admin0pcode;
					angular.merge( $scope.panel.user, org );

					// update home page for iMMAP Ethiopia
					if ( $scope.panel.user.organization === 'iMMAP' ) {
						// set adminRpcode here
						if(!$scope.panel.user.adminRpcode) {
							$scope.panel.user.adminRpcode = $filter('filter')($scope.panel.adminRegion, { admin0pcode: $scope.panel.user.admin0pcode }, true)[0].adminRpcode
						}
						// add defaults as admin
						// $scope.panel.user.app_home = '/immap/';
						// $scope.panel.user.app_home = '/cluster/admin/' + $scope.panel.user.adminRpcode.toLowerCase() + '/' + $scope.panel.user.admin0pcode.toLowerCase();
						// $scope.panel.user.roles = [ 'COUNTRY_ADMIN', 'USER' ];

					} else {
						delete $scope.panel.user.app_home;
					}

				},


				//manage user access
				manageUserAccess:function (id) {

					if (document.getElementById(id).checked){
						var values = document.getElementById(id).value;
						if($scope.panel.user.roles.indexOf(values)=== -1){
							$scope.panel.user.roles.push(values);
							// set landing page to admin
							if ( $scope.panel.user.roles.length > 1 ) {
								$scope.panel.user.app_home = '/cluster/admin/';
							}
							// set landing page to org
							if ( $scope.panel.user.roles.length === 1 && $scope.panel.user.roles.indexOf( 'USER' ) !== -1 ) {
								$scope.panel.user.app_home = '/cluster/organization/';
							}
						}
					} else{
						var values = document.getElementById(id).value;
						if ($scope.panel.user.roles.indexOf(values) > -1) {
							var index =$scope.panel.user.roles.indexOf(values);
							$scope.panel.user.roles.splice(index,1);
							// set landing page to org
							if ( $scope.panel.user.roles.length === 1 && $scope.panel.user.roles.indexOf( 'USER' ) !== -1 ) {
								$scope.panel.user.app_home = '/cluster/organization/';
							}
						}
					}
				},

				// manage user cluster
				manageUserCluster:function(id) {
					if (document.getElementById(id).checked) {
						var values = document.getElementById(id).value;
						$scope.panel.user.cluster_id= values;
						$scope.panel.user.cluster = $scope.panel.cluster[values].cluster;
					}else{
						document.getElementById(id).checked=true;
					}
				},

				// manage user country
				manageUserCountry: function (id) {
					if (document.getElementById(id).checked) {
					var values = document.getElementById(id).value;
					$scope.panel.user.admin0name=$scope.panel.adminRegion[values].admin0name
					$scope.panel.user.admin0pcode=$scope.panel.adminRegion[values].admin0pcode
					$scope.panel.user.adminRname=$scope.panel.adminRegion[values].adminRname
					$scope.panel.user.adminRpcode=$scope.panel.adminRegion[values].adminRpcode
					}else{
						document.getElementById(id).checked = true;
					}
				},

				setPrivateProfile:function(id){
					// Materialize.toast( $filter('translate')('processing')+'...', 6000, 'note');
					M.toast({ html: $filter('translate')('processing') + '...', displayLength: 6000, classes: 'note' });
					if (document.getElementById(id).checked) {
						$scope.panel.user.anonymous = true;
					}else{
						$scope.panel.user.anonymous = false;
					}
					ngmAuth
						.updateProfile({ user: $scope.panel.user }).then(function (result) {

							// db error!
							if (result.data.err || result.data.summary) {
								var msg = result.data.msg ? result.data.msg : 'error!';
								// Materialize.toast( msg, 6000, msg );
								M.toast({ html: msg, displayLength: 6000, classes: 'error' });
							}

							// success
							if (result.data.success) {
								// set user and localStorage (if updating own profile)
								if ($scope.panel.user.username === ngmUser.get().username) {
									$scope.panel.user = angular.merge({}, $scope.panel.user, result.data.user);
									ngmUser.set($scope.panel.user);
								}else{
									$scope.panel.user.anonymous = result.data.user.anonymous;
								}
								// success message
								$timeout(function () {
									// Materialize.toast( $filter('translate')('success')+' '+$filter('translate')('profile_updated'), 6000, 'success' );
									M.toast({ html: $filter('translate')('success') + ' ' + $filter('translate')('profile_updated'), displayLength: 6000, classes: 'success' });

								}, 200);
							}

						});
				},
				setClusterContact:function(id){
					// Materialize.toast( $filter('translate')('processing')+'...', 6000, 'note');
					// M.toast({ html: $filter('translate')('processing') + '...', displayLength: 6000, classes: 'note' });
					if (document.getElementById(id).checked) {
						$scope.panel.user.cluster_contact = true;
					} else {
						$scope.panel.user.cluster_contact = false;
					}
					M.toast({ html: 'Please Click Update Button to Save Change...', displayLength: 4000, classes: 'note' });


				},
				showClusterContact:function(){
					var _roles = ['CLUSTER', 'COUNTRY', 'COUNTRY_ADMIN', 'SUPERADMIN'];
					var show = false;
					user_see_profile = ngmUser.get() ? _roles.some(role => ngmUser.get().roles.includes(role)):false;
					if ((_roles.some(role => $scope.panel.user.roles.includes(role))) && user_see_profile){
						show = true;
					}
					return show

				},
				setContactPermissions: function (string_role, include_role) {
					//if include_role is 'true' then only the role defined in the string_role can access
					// if include_role is 'false' then only the role defined in the string_role cannot access
					//example string_role => 'USER,ORG'
					roles = string_role.split(',');
					var access = false;
					if (!ngmUser.get()) return false;
					const USER_PERMISSIONS = ngmAuth.userPermissions();
					// for menu get role with highest priority if user has multiple roles
					role = USER_PERMISSIONS.reduce(function (max, v) { return v.LEVEL > max.LEVEL ? v : max })['ROLE']
					//who can set/unset user as cluster contact
					if (role === 'SUPERADMIN' || role === 'COUNTRY_ADMIN'){
						access = true;

					} else {
						if((role === 'CLUSTER') && (ngmUser.get().cluster_id === config.user.cluster_id)){
							access = true;
						}
					};

					return access;
				},
				validateUpdateProfile:function(user){
					var scrollDiv;
					var valid = true;
					var field = '';
					if(!user.organization_tag){
						$('label[for=' + 'ngm-organization' + ']').addClass('error');
						scrollDiv = $('#ngm-organization');
						field="Organization";
						valid = false;
					}
					if(!user.cluster_id || !user.cluster){
						$('label[for=' + 'ngm-cluster' + ']').addClass('error');
						scrollDiv = $('#ngm-cluster');
						field="Sector";
						valid = false;
					}
					if(!user.username){
						$('label[for=' + 'ngm-username' + ']').addClass('error');
						scrollDiv = $('#ngm-username');
						field ="Username";
						valid = false;
					}
					if(!user.name){
						$('label[for=' + 'ngm-fullname' + ']').addClass('error');
						scrollDiv = $('#ngm-username');
						field= "Fullname"
						valid = false;
					}
					if(!user.email){
						$('label[for=' + 'ngm-email' + ']').addClass('error');
						scrollDiv = $('#ngm-email');
						field = "Email"
						valid = false;

					}
					if(!valid){
						scrollDiv.scrollHere();
						$timeout(function(){
							M.toast({ html: field+' is Missing!', displayLength: 6000, classes: 'error' });
						},300)
					}
					return valid
				},
				whiteSpaceUsername:function(){
					$scope.panel.usernameSafe = false
					// var disabled_register = false;
					var regex = /(\s)/g;
					if ($scope.panel.user && regex.test($scope.panel.user.username)) {
						document.getElementById("ngm-username").classList.remove("valid","ng-valid");
						document.getElementById("ngm-username").classList.add("invalid", "ng-invalid");
						$('label[for=' + 'ngm-username' + ']').addClass('error');
						// disabled_register = true
						$scope.panel.usernameSafe = false
					} else {
						if ($scope.panel.user.username !== '' && $scope.panel.user.username !== undefined){
							document.getElementById("ngm-username").classList.remove("invalid", "ng-invalid");
							document.getElementById("ngm-username").classList.add("valid", "ng-valid");
							$('label[for=' + 'ngm-username' + ']').removeClass('error');
							// disabled_register = false
							$scope.panel.usernameSafe = true
						}
					}
					// return disabled_register
				},
				passwordCheck:function(){
					$scope.panel.isPasswordSafe = false;
					var password_minimum_requirement = /^(?=.*?[A-Z])(?!.*[\s]).{8,}$/;
					if (!password_minimum_requirement.test($scope.panel.user.password)) {
						document.getElementById("ngm-password").classList.remove("valid", "ng-valid");
						document.getElementById("ngm-password").classList.add("invalid", "ng-invalid");
						$('label[for=' + 'ngm-password' + ']').addClass('error');
						// disabled_register = true;
						$scope.panel.isPasswordSafe = false;

					} else {
						document.getElementById("ngm-password").classList.remove("invalid", "ng-invalid");
						document.getElementById("ngm-password").classList.add("valid", "ng-valid");
						$('label[for=' + 'ngm-password' + ']').removeClass('error');
						// disabled_register = false;
						$scope.panel.isPasswordSafe = true;
						if ($scope.panel.user && $scope.panel.user.confirm_password !== undefined && $scope.panel.user.confirm_password !== ''){
							$scope.panel.confirmPassword()
						}
					}
				},
				confirmPassword: function () {
					$scope.panel.matchPassword = false;
					// var disabled_register = false
					if ($scope.panel.user && ($scope.panel.user.confirm_password !== $scope.panel.user.password)) {
						if ($scope.panel.user && $scope.panel.user.confirm_password !== undefined && $scope.panel.user.confirm_password !== '' ){
							document.getElementById("ngm-confirm-password").classList.remove("valid", "ng-valid");
							document.getElementById("ngm-confirm-password").classList.add("invalid", "ng-invalid");
							$('label[for=' + 'ngm-confirm-password' + ']').addClass('error');
						}
						// disabled_register = true;
						$scope.panel.matchPassword = false;
					} else {
						if ($scope.panel.user && $scope.panel.user.confirm_password !== undefined && $scope.panel.user.confirm_password !== '') {
							document.getElementById("ngm-confirm-password").classList.remove("invalid", "ng-invalid");
							document.getElementById("ngm-confirm-password").classList.add("valid", "ng-valid");
							$('label[for=' + 'ngm-confirm-password' + ']').removeClass('error');
						}
						// disabled_register = false
						$scope.panel.matchPassword = true;
					}
					// return disabled_register
				},
				registerValidate:function(){
					// $scope.panel.isRegistering = $scope.panel.confirmPassword() || $scope.panel.whiteSpaceUsername()
					return !($scope.panel.isPasswordSafe && $scope.panel.matchPassword && $scope.panel.usernameSafe);
				},
				checkPhoneNumber:function(){
					$scope.panel.isPhoneNumberOk =false
					var regex_phone = /^\+?\d*$/;
					if ($scope.panel.user && regex_phone.test($scope.panel.user.phone)){

						if ($scope.panel.user && $scope.panel.user.phone !== undefined && $scope.panel.user.phone !== '') {

							document.getElementById("ngm-phone").classList.remove("invalid", "ng-invalid");
							document.getElementById("ngm-phone").classList.add("valid", "ng-valid");
							$('label[for=' + 'ngm-phone' + ']').removeClass('error');
						}
						$scope.panel.isPhoneNumberOk = true
					} else {
						if ($scope.panel.user && $scope.panel.user.phone !== undefined && $scope.panel.user.phone !== '') {
							document.getElementById("ngm-phone").classList.remove("valid", "ng-valid");
							document.getElementById("ngm-phone").classList.add("invalid", "ng-invalid");
							$('label[for=' + 'ngm-phone' + ']').addClass('error');
						}
						$scope.panel.isPhoneNumberOk = false
					}
				}

			}

			// init page
			$scope.panel.init();

			// on page load
			angular.element(document).ready(function () {

				// give a few seconds to render
				$timeout(function() {

					// on change update icon color
					$( '#ngm-country' ).on( 'change', function() {
						if( $( this ).find( 'option:selected' ).text() ) {
							$( '.country' ).css({ 'color': 'teal' });
							// $( 'select' ).material_select();
							$('select').formSelect();
						}
					});

					// on change update icon color
					$( '#ngm-cluster' ).on( 'change', function() {
						if ( $( this ).find( 'option:selected' ).text() ) {
							$( '.cluster' ).css({ 'color': 'teal' });
						}
					});

				}, 900 );

			});

		}

]);
