/**
 * @name ngmReportHub.factory:ngmClusterHelperNgWashKeys
 * @description
 * # ngmClusterWashHelper
 * Manages browser local storage
 *
 */
angular.module( 'ngmReportHub' )
	.factory( 'ngmClusterHelperNgWashKeys', 
			[ '$http',
				'$filter',
				'$timeout',
				'ngmAuth', function( $http, $filter, $timeout, ngmAuth ) {

		// definition
		var ngmClusterHelperNgWashKeys = {

			// activity keys
			keys: {
				
				// WATER
				// boreholes
				'borehole_construction':{
					template: 'borehole.html',
					association: 'boreholes',
					measurement: {
						borehole_yield_ltrs_second: 0,
						borehole_pumping_ave_daily_hours: 0,
						borehole_tanks_storage_ltrs: 0,
						taps_number_connected: 0,
						borehole_taps_ave_flow_rate_ltrs_minute: 0
					}
				},
				'borehole_rehabilitation':{
					template: 'borehole.html',
					association: 'boreholes',
					measurement: {
						borehole_yield_ltrs_second: 0,
						borehole_pumping_ave_daily_hours: 0,
						borehole_tanks_storage_ltrs: 0,
						taps_number_connected: 0,
						borehole_taps_ave_flow_rate_ltrs_minute: 0
					}
				},
				'borehole_upgrade':{
					template: 'borehole.html',
					association: 'boreholes',
					measurement: {
						borehole_yield_ltrs_second: 0,
						borehole_pumping_ave_daily_hours: 0,
						borehole_tanks_storage_ltrs: 0,
						taps_number_connected: 0,
						borehole_taps_ave_flow_rate_ltrs_minute: 0
					}
				},
				
				// reticulation
				'reticulation_construction': { 
					template: 'reticulation.html',
					association: 'water',
					measurement: {
						quantity_measurement_id: 'taps_connected',
						quantity_measurement_name: 'Taps Connected'
					}
				},
				'reticulation_rehabilitation': { 
					template: 'reticulation.html',
					association: 'water',
					measurement: {
						quantity_measurement_id: 'taps_connected',
						quantity_measurement_name: 'Taps Connected'
					}
				},
				
				// services
				'water_trucking': { 
					template: 'service.html',
					association: 'water',
					measurement: {
						quantity_measurement_id: 'm3_per_month',
						quantity_measurement_name: 'm3/Per Month'
					}
				},
				'cash_for_water': { 
					template: 'service.html',
					association: 'water',
					measurement: {
						quantity_measurement_id: 'm3_per_month',
						quantity_measurement_name: 'm3/Per Month'
					}
				},
				'distribution_treatment_tablets': {
					template: 'service.html',
					association: 'water',
					measurement: {
						quantity_measurement_id: 'm3_per_month',
						quantity_measurement_name: 'm3/Per Month'
					}
				},
				
				// ops and maintenance
				'fuel_provision_water': { 
					template: 'maintenance.html',
					association: 'water',
					measurement: {
						quantity_measurement_id: 'm3_per_month',
						quantity_measurement_name: 'm3/Per Month'
					}
				},
				'washcoms_establishment_training': { 
					template: 'maintenance.html',
					association: 'water',
					measurement: {
						male: 0,
						female: 0,
						quantity_measurement_id: 'training_sessions',
						quantity_measurement_name: 'Training Sessions',
					}
				},
				'operation_maintenance_monitoring': { 
					template: 'maintenance.html',
					association: 'water',
					measurement: {
						quantity_measurement_id: 'monitoring_visits',
						quantity_measurement_name: 'Monitoring Visits'
					}
				},
				'maintenance_repair_kits_provision_to_washcoms': { 
					template: 'maintenance.html',
					association: 'water',
					measurement: {
						details:[],
						quantity_measurement_id: 'kits_distributed',
						quantity_measurement_name: 'Kits Distributed'
					}
				},
				'maintenance_repair_replacement_water_systems': { 
					template: 'maintenance.html',
					association: 'water',
					measurement: {
						details:[],
						quantity_measurement_id: 'systems_repaired_replaced',
						quantity_measurement_name: 'Systems Repaired / Replaced'
					}
				},

				// SANITATION
				// latrines construction
				'latrine_construction_hh': { 
					template: 'latrines.html',
					association: 'sanitation',
					measurement: {
						quantity_measurement_id: 'hh_latrines',
						quantity_measurement_name: ' HH Latrines'
					}
				},
				'latrine_construction_vip': { 
					template: 'latrines.html',
					association: 'sanitation',
					measurement: {
						male: 0,
						female: 0,
						male_disabled: 0,
						female_disabled: 0,
						gender_marking_id: 'no',
						gender_marking_name: 'No',
						lock_installation_id: 'no',
						lock_installation_name: 'No',
						quantity_measurement_id: 'vip_latrines',
						quantity_measurement_name: 'VIP Latrines'
					}
				},
				'latrine_construction_emergency': { 
					template: 'latrines.html',
					association: 'sanitation',
					measurement: {
						male: 0,
						female: 0,
						male_disabled: 0,
						female_disabled: 0,
						gender_marking_id: 'no',
						gender_marking_name: 'No',
						lock_installation_id: 'no',
						lock_installation_name: 'No',
						quantity_measurement_id: 'emergency_latrines',
						quantity_measurement_name: 'Emergency Latrines'
					}
				},
				// latrine rehabilitation
				'latrine_rehabilitation_hh': { 
					template: 'latrines.html',
					association: 'sanitation',
					measurement: {
						quantity_measurement_id: 'hh_latrines',
						quantity_measurement_name: ' HH Latrines'
					}
				},
				'latrine_rehabilitation_vip': { 
					template: 'latrines.html',
					association: 'sanitation',
					measurement: {
						male: 0,
						female: 0,
						male_disabled: 0,
						female_disabled: 0,
						gender_marking_id: 'no',
						gender_marking_name: 'No',
						lock_installation_id: 'no',
						lock_installation_name: 'No',
						quantity_measurement_id: 'vip_latrines',
						quantity_measurement_name: 'VIP Latrines'
					}
				},
				'latrine_rehabilitation_emergency': { 
					template: 'latrines.html',
					association: 'sanitation',
					measurement: {
						male: 0,
						female: 0,
						male_disabled: 0,
						female_disabled: 0,
						gender_marking_id: 'no',
						gender_marking_name: 'No',
						lock_installation_id: 'no',
						lock_installation_name: 'No',
						quantity_measurement_id: 'emergency_latrines',
						quantity_measurement_name: 'Emergency Latrines'
					}
				},
				// cleaning and desludging
				'latrine_cleaning_disinfection_vip': { 
					template: 'latrines.html',
					association: 'sanitation',
					measurement: {
						male: 0,
						female: 0,
						male_disabled: 0,
						female_disabled: 0,
						quantity_measurement_id: 'vip_latrines',
						quantity_measurement_name: ' VIP Latrines'
					}
				},
				'latrine_cleaning_disinfection_emergency': { 
					template: 'latrines.html',
					association: 'sanitation',
					measurement: {
						male: 0,
						female: 0,
						male_disabled: 0,
						female_disabled: 0,
						quantity_measurement_id: 'emergency_latrines',
						quantity_measurement_name: 'Emergency Latrines'
					}
				},
				// desludging
				'latrine_desludging_manual': { 
					template: 'latrines.html',
					association: 'sanitation',
					measurement: {
						stipend_id: 'no',
						stipend_name: 'No',
						stipend_amount: 0,
						quantity_measurement_id: 'manual',
						quantity_measurement_name: 'Manual'
					}
				},
				'latrine_desludging_mechanical': { 
					template: 'latrines.html',
					association: 'sanitation',
					measurement: {
						quantity_measurement_id: 'mechanical',
						quantity_measurement_name: 'Mechanical'
					}
				},
				'latrine_sludge_dumping_site': { 
					template: 'latrines.html',
					association: 'sanitation',
					measurement: {
						details: [],
						quantity_measurement_id: 'sites_prepared',
						quantity_measurement_name: 'Sites Prepared'
					}
				},
				'latrine_monitoring': { 
					template: 'latrines.html',
					association: 'sanitation',
					measurement: {
						details: [],
						quantity_measurement_id: 'monitoring_visits',
						quantity_measurement_name: 'Monitoring Visits'
					}
				},
				// geneder marking / locks
				'latrine_gender_marking_vip': {
					template: 'latrines.html',
					association: 'sanitation',
					measurement: {
						male: 0,
						female: 0,
						male_disabled: 0,
						female_disabled: 0,
						gender_marking_id: 'yes',
						gender_marking_name: 'Yes',
						facility_status_id: 'newly_constructed',
						facility_status_name: 'Newly Constructed',
						quantity_measurement_id: 'vip_latrines',
						quantity_measurement_name: 'VIP Latrines'
					}
				},
				'latrine_gender_marking_emergency': { 
					template: 'latrines.html',
					association: 'sanitation',
					measurement: {
						male: 0,
						female: 0,
						male_disabled: 0,
						female_disabled: 0,
						gender_marking_id: 'yes',
						gender_marking_name: 'Yes',
						facility_status_id: 'newly_constructed',
						facility_status_name: 'Newly Constructed',
						quantity_measurement_id: 'emergency_latrines',
						quantity_measurement_name: 'Emergency Latrines'
					}
				},
				'latrine_lock_installation_vip': { 
					template: 'latrines.html',
					association: 'sanitation',
					measurement: {
						male: 0,
						female: 0,
						male_disabled: 0,
						female_disabled: 0,
						lock_installation_id: 'yes',
						lock_installation_name: 'Yes',
						facility_status_id: 'newly_constructed',
						facility_status_name: 'Newly Constructed',
						quantity_measurement_id: 'vip_latrines',
						quantity_measurement_name: 'VIP Latrines'
					}
				},
				'latrine_lock_installation_emergency': { 
					template: 'latrines.html',
					association: 'sanitation',
					measurement: {
						male: 0,
						female: 0,
						male_disabled: 0,
						female_disabled: 0,
						lock_installation_id: 'yes',
						lock_installation_name: 'Yes',
						facility_status_id: 'newly_constructed',
						facility_status_name: 'Newly Constructed',
						quantity_measurement_id: 'emergency_latrines',
						quantity_measurement_name: 'Emergency Latrines'
					}
				},
				'hand_washing_stations_installation': { 
					template: 'latrines.html',
					association: 'sanitation',
					measurement: {
						quantity_measurement_id: 'installed',
						quantity_measurement_name: 'Installed'
					}
				},
				'hand_washing_stations_refilled': { 
					template: 'latrines.html',
					association: 'sanitation',
					measurement: {
						quantity_measurement_id: 'refilled',
						quantity_measurement_name: 'Refilled'
					}
				},
				// showers
				// construction / rehabilitation
				'shower_construction_emergency': {
					template: 'showers.html',
					association: 'sanitation',
					measurement: {
						male: 0,
						female: 0,
						male_disabled: 0,
						female_disabled: 0,
						gender_marking_id: 'no',
						gender_marking_name: 'No',
						lock_installation_id: 'no',
						lock_installation_name: 'No',
						quantity_measurement_id: 'emergency_showers',
						quantity_measurement_name: 'Emergency Showers'
					}
				},
				'shower_construction_mid_term': {
					template: 'showers.html',
					association: 'sanitation',
					measurement: {
						male: 0,
						female: 0,
						male_disabled: 0,
						female_disabled: 0,
						gender_marking_id: 'no',
						gender_marking_name: 'No',
						lock_installation_id: 'no',
						lock_installation_name: 'No',
						quantity_measurement_id: 'mid_term_showers',
						quantity_measurement_name: 'Mid-Term Showers'
					}
				},
				'shower_rehabilitation_emergency': {
					template: 'showers.html',
					association: 'sanitation',
					measurement: {
						male: 0,
						female: 0,
						male_disabled: 0,
						female_disabled: 0,
						gender_marking_id: 'no',
						gender_marking_name: 'No',
						lock_installation_id: 'no',
						lock_installation_name: 'No',
						quantity_measurement_id: 'emergency_showers',
						quantity_measurement_name: 'Emergency Showers'
					}
				},
				'shower_rehabilitation_mid_term': {
					template: 'showers.html',
					association: 'sanitation',
					measurement: {
						male: 0,
						female: 0,
						male_disabled: 0,
						female_disabled: 0,
						gender_marking_id: 'no',
						gender_marking_name: 'No',
						lock_installation_id: 'no',
						lock_installation_name: 'No',
						quantity_measurement_id: 'mid_term_showers',
						quantity_measurement_name: 'Mid-Term Showers'
					}
				},
				// showers gender marking
				'shower_gender_marking_emergency': {
					template: 'showers.html',
					association: 'sanitation',
					measurement: {
						male: 0,
						female: 0,
						male_disabled: 0,
						female_disabled: 0,
						gender_marking_id: 'yes',
						gender_marking_name: 'Yes',
						facility_status_id: 'newly_constructed',
						facility_status_name: 'Newly Constructed',
						quantity_measurement_id: 'emergency_showers',
						quantity_measurement_name: 'Emergency Showers'
					}
				},
				'shower_gender_marking_mid_term': {
					template: 'showers.html',
					association: 'sanitation',
					measurement: {
						male: 0,
						female: 0,
						male_disabled: 0,
						female_disabled: 0,
						gender_marking_id: 'yes',
						gender_marking_name: 'Yes',
						facility_status_id: 'newly_constructed',
						facility_status_name: 'Newly Constructed',
						quantity_measurement_id: 'mid_term_showers',
						quantity_measurement_name: 'Mid-Term Showers'
					}
				},
				// showers lock installation
				'shower_lock_installation_emergency': {
					template: 'showers.html',
					association: 'sanitation',
					measurement: {
						male: 0,
						female: 0,
						male_disabled: 0,
						female_disabled: 0,
						lock_installation_id: 'yes',
						lock_installation_name: 'Yes',
						facility_status_id: 'newly_constructed',
						facility_status_name: 'Newly Constructed',
						quantity_measurement_id: 'emergency_showers',
						quantity_measurement_name: 'Emergency Showers'
					}
				},
				'shower_lock_installation_mid_term': {
					template: 'showers.html',
					association: 'sanitation',
					measurement: {
						male: 0,
						female: 0,
						male_disabled: 0,
						female_disabled: 0,
						lock_installation_id: 'yes',
						lock_installation_name: 'Yes',
						facility_status_id: 'newly_constructed',
						facility_status_name: 'Newly Constructed',
						quantity_measurement_id: 'mid_term_showers',
						quantity_measurement_name: 'Mid-Term Showers'
					}
				},
				// showers leaning disinfection
				'shower_cleaning_disinfection_emergency': {
					template: 'showers.html',
					association: 'sanitation',
					measurement: {
						male: 0,
						female: 0,
						male_disabled: 0,
						female_disabled: 0,
						quantity_measurement_id: 'emergency_showers',
						quantity_measurement_name: 'Emergency Showers'
					}
				},
				'shower_cleaning_disinfection_mid_term': {
					template: 'showers.html',
					association: 'sanitation',
					measurement: {
						male: 0,
						female: 0,
						male_disabled: 0,
						female_disabled: 0,
						quantity_measurement_id: 'mid_term_showers',
						quantity_measurement_name: 'Mid-Term Showers'
					}
				},
				// showers monitoring
				'shower_cleaning_disinfection_monitoring': {
					template: 'showers.html',
					association: 'sanitation',
					measurement: {
						quantity_measurement_id: 'monitoring_visits',
						quantity_measurement_name: 'Monitoring Visits',
						details:[]
					}
				},				
				// waste management
				'cleaning_campaigns': {
					template: 'waste.html',
					association: 'sanitation',
					measurement: {
						quantity_measurement_id: 'campaigns',
						quantity_measurement_name: 'Campaigns'
					}
				},
				'solid_waste_management_committee_kits_distribution': {
					template: 'waste.html',
					association: 'sanitation',
					measurement: {
						quantity_measurement_id: 'waste_management_kits_distributed',
						quantity_measurement_name: 'Waste Management Kits Distributed',
						details:[]
					}
				},
				'communal_refuse_pit_excavation_for_incineration_burial': {
					template: 'waste.html',
					association: 'sanitation',
					measurement: {
						quantity_measurement_id: 'refuse_pit_excavations',
						quantity_measurement_name: 'Refuse Pit Excavations'
					}
				},
				'establishment_training_rotational_waste_management_committee': {
					template: 'committee.html',
					association: 'sanitation',
					measurement: {
						male: 0,
						female: 0,
						committee_rotation_id: 'no',
						committee_rotation_name: 'No',
						committee_rotation_per_month: 0,
						stipend_id: 'no',
						stipend_name: 'No',
						stipend_amount: 0,
						quantity_measurement_id: 'sanitation_committee',
						quantity_measurement_name: 'Sanitation Committee',
						details: []
					}
				},
				// sanitation committee
				'sanitation_committee_kits_distribution': {
					template: 'waste.html',
					association: 'sanitation',
					measurement: {
						quantity_measurement_id: 'sanitation_kits_distributed',
						quantity_measurement_name: 'Sanitation Kits Distributed',
						details: []
					}
				},
				'establishment_training_rotational_sanitation_committee': {
					template: 'committee.html',
					association: 'sanitation',
					measurement: {
						male: 0,
						female: 0,
						committee_rotation_id: 'no',
						committee_rotation_name: 'No',
						committee_rotation_per_month: 0,
						stipend_id: 'no',
						stipend_name: 'No',
						stipend_amount: 0,
						quantity_measurement_id: 'sanitation_committee',
						quantity_measurement_name: 'Sanitation Committee',
						details: []
					}
				},
				// default
				defaults: {
					quantity: 0,
					activity_start_date: moment( new Date() ).startOf( 'M' ).format('YYYY-MM-DD'),
					activity_end_date: moment( new Date() ).endOf( 'M' ).format('YYYY-MM-DD')
				}
			}

		}

		// return 
		return ngmClusterHelperNgWashKeys;

	}]);
