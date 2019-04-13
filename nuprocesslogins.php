<?php

function nuCheckExistingSession() {
        if ( !isset($_SESSION['nubuilder_session_data']['SESSION_ID']) ) {
        	nuDie('You must be logged into nuBuilder..');
       	}
	if ( !isset($_SESSION['nubuilder_session_data']) ) {
                 nuDie('You must be logged into nuBuilder...');
        }
}

//Check for Wordpress Globeadmin login
function nuCheckWordpressGlobeadminLoginRequest() {

	if ( $_SESSION['nubuilder_session_data']['PLUGIN'] && $_SESSION['nubuilder_session_data']['GLOBEADMIN'] ) {
		return true;
	}
	return false;
}

//Check for Wordpress User login
function nuCheckWordpressUserLoginRequest() {

	if ( $_SESSION['nubuilder_session_data']['PLUGIN'] && !$_SESSION['nubuilder_session_data']['GLOBEADMIN'] ) {
                return true;
        }
        return false;
}

//Check for Standalone Globeadmin login
function nuCheckStandaloneGlobeadminLoginRequest() {
	
	if ( $_POST['nuSTATE']['username'] == $_SESSION['nubuilder_session_data']['GLOBEADMIN_NAME'] && $_POST['nuSTATE']['password'] == $_SESSION['nubuilder_session_data']['GLOBEADMIN_PASS'] ) {
		return true;
	}
	return false;
}

//Check for Standlone User login
function nuCheckStandaloneUserLoginRequest() {

	$sql 	= "SELECT * FROM zzzzsys_user JOIN zzzzsys_access ON zzzzsys_access_id = sus_zzzzsys_access_id WHERE sus_login_name = ? AND sus_login_password = ? ";
        $rs 	= nuRunQuery($sql, array($_POST['nuSTATE']['username'], md5($_POST['nuSTATE']['password'])));

        if( db_num_rows($rs) > 0 ) {
		return true;
	}
	return false;
}

function nuCheckIsLoginRequest() {

	if(array_key_exists('nuSTATE', $_POST)){
        	if(array_key_exists('call_type', $_POST['nuSTATE'])){
                	if($_POST['nuSTATE']['call_type'] == 'login'){
				return true;
			}
		}
	}
	return false;
}

function nuLoginSetupGlobeadmin() {

	$_SESSION['nubuilder_session_data']['SESSION_ID']         	= nuIDTEMP();
        $_SESSION['nubuilder_session_data']['SESSION_TIMESTAMP']  	= time();
        $_SESSION['nubuilder_session_data']['IsDemo']             	= $_SESSION['nubuilder_session_data']['IS_DEMO'];
	$_SESSION['nubuilder_session_data']['isGlobeadmin'] 		= true;
	$_SESSION['nubuilder_session_data']['translation']       	= nuGetTranslation(db_setup()->set_language);
        $sessionIds 							= new stdClass;
        $sessionIds->zzzzsys_access_id 					= '';
        $sessionIds->zzzzsys_user_id 					= $_SESSION['nubuilder_session_data']['GLOBEADMIN_NAME'];
        $sessionIds->zzzzsys_form_id 					= 'nuhome';
        $sessionIds->global_access 					= '1';
        $storeSessionInTable 						= new stdClass;
        $storeSessionInTable->session 					= $sessionIds;
       
	// forms 
	$getAllFormsQRY 						= nuRunQuery("SELECT zzzzsys_form_id AS id FROM zzzzsys_form");
        $formAccess 							= array();
	while( $getAllFormsOBJ 						= db_fetch_object($getAllFormsQRY) ) {
		$formAccess[] 						= [$getAllFormsOBJ->id];
        }
        $storeSessionInTable->forms 					= $formAccess;

	// reports
        $getAllReportsQRY 						= nuRunQuery("SELECT zzzzsys_report_id AS id, sre_zzzzsys_form_id AS form_id FROM zzzzsys_report");
        $reportAccess 							= array();
        while( $getAllReportsOBJ 					= db_fetch_object($getAllReportsQRY) ){
        	$reportAccess[] 					= [$getAllReportsOBJ->id, $getAllReportsOBJ->form_id];
        }
	$storeSessionInTable->reports 					= $reportAccess;

	// procedures
        $getAllPHPsQRY 							= nuRunQuery("SELECT zzzzsys_php_id AS id, sph_zzzzsys_form_id AS form_id FROM zzzzsys_php");
        $phpAccess 							= array();
	while ( $getAllPHPsOBJ 						= db_fetch_object($getAllPHPsQRY) ){
		$phpAccess[] 						= [$getAllPHPsOBJ->id, $getAllPHPsOBJ->form_id];
	}
	$storeSessionInTable->procedures 				= $phpAccess;
	$storeSessionInTable->access_level_code				= '';
       	$storeSessionInTableJSON 					= json_encode($storeSessionInTable);

	$sql								= "INSERT INTO zzzzsys_session SET sss_access = ?, zzzzsys_session_id = ?";
	$values								= array($storeSessionInTableJSON, $_SESSION['nubuilder_session_data']['SESSION_ID'] );
	
	nuRunQuery($sql, $values);
}

function nuLoginSetupNOTGlobeadmin($standalone = true) {

	$_SESSION['nubuilder_session_data']['SESSION_ID']         	= nuIDTEMP();
        $_SESSION['nubuilder_session_data']['SESSION_TIMESTAMP']  	= time();
        $_SESSION['nubuilder_session_data']['IsDemo']             	= $_SESSION['nubuilder_session_data']['IS_DEMO'];
	$checkLoginDetailsSQL 						= "SELECT * FROM zzzzsys_user JOIN zzzzsys_access ON zzzzsys_access_id = sus_zzzzsys_access_id WHERE sus_login_name = ? AND sus_login_password = ? ";
	
	if ( $standalone ) {
		$this_username 						= $_POST['nuSTATE']['username'];
		$this_password 						= md5($_POST['nuSTATE']['password']);	
	} else {
		$this_username 						= $_SESSION['nubuilder_session_data']['USER_LOGIN'];
                $this_password 						= $_SESSION['nubuilder_session_data']['USER_PASS']; // no need to md5 as it is already done 
	}

	$checkLoginDetailsValues 					= array($this_username, $this_password);
	$checkLoginDetailsQRY 						= nuRunQuery($checkLoginDetailsSQL, $checkLoginDetailsValues);
	$checkLoginDetailsOBJ 						= db_fetch_object($checkLoginDetailsQRY);
	$_SESSION['nubuilder_session_data']['translation'] 		= nuGetTranslation($checkLoginDetailsOBJ->sus_language);
        $_SESSION['nubuilder_session_data']['isGlobeadmin'] 		= false;
        $translationQRY 						= nuRunQuery("SELECT * FROM zzzzsys_translate WHERE trl_language = '$checkLoginDetailsOBJ->sus_language' ORDER BY trl_english");
        $getAccessLevelSQL 						= "SELECT zzzzsys_access_id, zzzzsys_user_id, sal_zzzzsys_form_id AS zzzzsys_form_id FROM zzzzsys_user ";
	$getAccessLevelSQL	       .= "INNER JOIN zzzzsys_access ON zzzzsys_access_id = sus_zzzzsys_access_id ";
        $getAccessLevelSQL             .= "WHERE zzzzsys_user_id = '$checkLoginDetailsOBJ->zzzzsys_user_id' ";
        $getAccessLevelSQL             .= "GROUP BY sus_zzzzsys_access_id ";
        $getAccessLevelQRY 						= nuRunQuery($getAccessLevelSQL);
        			
        if(db_num_rows($getAccessLevelQRY) == 0){
       		nuDie($msg = 'No access levels setup.');				
	}

	$getAccessLevelOBJ 			= db_fetch_object($getAccessLevelQRY);
        $sessionIds 				= new stdClass;
        $sessionIds->zzzzsys_access_id 		= $getAccessLevelOBJ->zzzzsys_access_id;
        $sessionIds->zzzzsys_user_id 		= $checkLoginDetailsOBJ->zzzzsys_user_id;
        $sessionIds->zzzzsys_form_id 		= $getAccessLevelOBJ->zzzzsys_form_id;
        $sessionIds->global_access 		= '0';
        $storeSessionInTable                    = new stdClass;
        $storeSessionInTable->session           = $sessionIds;
        $storeSessionInTable->access_level_code	= nuAccessLevelCode($checkLoginDetailsOBJ->zzzzsys_user_id);

        // form ids
	$getFormsSQL				= "SELECT slf_zzzzsys_form_id  AS id, ";
	$getFormsSQL                           .= "slf_add_button          AS a, ";
  	$getFormsSQL                           .= "slf_save_button         AS s, ";
	$getFormsSQL                           .= "slf_delete_button       AS d, ";
	$getFormsSQL                           .= "slf_clone_button        AS c, ";
	$getFormsSQL                           .= "slf_print_button        AS p ";
	$getFormsSQL                           .= "FROM zzzzsys_user ";
	$getFormsSQL                           .= "JOIN zzzzsys_access ON zzzzsys_access_id = sus_zzzzsys_access_id ";
	$getFormsSQL                           .= "JOIN zzzzsys_access_form ON zzzzsys_access_id = slf_zzzzsys_access_id ";
	$getFormsSQL                           .= "WHERE zzzzsys_user_id = '$checkLoginDetailsOBJ->zzzzsys_user_id' ";
	$getFormsQRY 				= nuRunQuery($getFormsSQL);
        $formAccess 				= array();
        while ( $getFormsOBJ 			= db_fetch_object($getFormsQRY) ) {
        	$formAccess[] 			= [$getFormsOBJ->id, $getFormsOBJ->a, $getFormsOBJ->p, $getFormsOBJ->s, $getFormsOBJ->c, $getFormsOBJ->d];
	}
        $storeSessionInTable->forms 		= $formAccess;

	// report ids
	$getReportsSQL				= "SELECT sre_zzzzsys_report_id AS id, sre_zzzzsys_form_id AS form_id ";
	$getReportsSQL                         .= "FROM zzzzsys_user ";
	$getReportsSQL                         .= "JOIN zzzzsys_access ON zzzzsys_access_id = sus_zzzzsys_access_id ";
	$getReportsSQL                         .= "JOIN zzzzsys_access_report ON zzzzsys_access_id = sre_zzzzsys_access_id ";
	$getReportsSQL                         .= "JOIN zzzzsys_report ON zzzzsys_report_id = sre_zzzzsys_report_id ";
	$getReportsSQL                         .= "WHERE zzzzsys_user_id = '$checkLoginDetailsOBJ->zzzzsys_user_id' ";
	$getReportsSQL                         .= "GROUP BY sre_zzzzsys_report_id ";
        $getReportsQRY 				= nuRunQuery($getReportsSQL);
        $reportAccess 				= array();
	while($getReportsOBJ = db_fetch_object($getReportsQRY)){
		$reportAccess[] 		= [$getReportsOBJ->id, $getReportsOBJ->form_id];
	}
       	$storeSessionInTable->reports 		= $reportAccess;

	// php ids
	$getPHPsSQL				= "SELECT ";
	$getPHPsSQL                            .= "sal_code AS access_level_code, ";
 	$getPHPsSQL                            .= "slp_zzzzsys_php_id AS id, ";
	$getPHPsSQL                            .= "sph_zzzzsys_form_id AS form_id ";
	$getPHPsSQL                            .= "FROM zzzzsys_user ";
	$getPHPsSQL                            .= "JOIN zzzzsys_access ON zzzzsys_access_id = sus_zzzzsys_access_id ";
	$getPHPsSQL                            .= "JOIN zzzzsys_access_php ON zzzzsys_access_id = slp_zzzzsys_access_id ";
	$getPHPsSQL                            .= "JOIN zzzzsys_php ON zzzzsys_php_id = slp_zzzzsys_php_id ";
	$getPHPsSQL                            .= "WHERE zzzzsys_user_id = '$checkLoginDetailsOBJ->zzzzsys_user_id' ";
	$getPHPsSQL                            .= "GROUP BY slp_zzzzsys_php_id ";
	$getPHPsQRY 				= nuRunQuery($getPHPsSQL);	
        $phpAccess 				= array();
        while($getPHPsOBJ = db_fetch_object($getPHPsQRY)){
		$phpAccess[] 			= [$getPHPsOBJ->id, $getPHPsOBJ->form_id];
	}
        $storeSessionInTable->procedures 	= $phpAccess;
        $storeSessionInTableJSON 		= json_encode($storeSessionInTable);

	nuRunQuery("INSERT INTO zzzzsys_session SET sss_access = ?, zzzzsys_session_id = ?", array($storeSessionInTableJSON, $_SESSION['nubuilder_session_data']['SESSION_ID']));
}

function nuTempAnonReport() {
	// only let the user have 1 temporary report run
        $_SESSION['nubuilder_session_data']['SESSION_ID'] 		= null;
        $_SESSION['nubuilder_session_data']['SESSION_TIMESTAMP'] 	= null;
        $_SESSION['nubuilder_session_data']['TEMPORARY_SESSION'] 	= true;
}

function nuUpdateExistingSession() {

	$t = nuRunQuery("SELECT * FROM zzzzsys_setup");
        $r = db_fetch_object($t);
		
	if( ( ($r->set_time_out_minutes * 60) + $_SESSION['nubuilder_session_data']['SESSION_TIMESTAMP'] ) >= time() ) {
		$_SESSION['nubuilder_session_data']['SESSION_TIMESTAMP'] = time();
        } else {
		nuDie('Your nuBuilder session has timed out.');
        }
}

function nuDie($msg = 'Invalid login!') {

        $_SESSION['nubuilder_session_data']['SESSION_ID']                 = null;
        $_SESSION['nubuilder_session_data']['SESSION_TIMESTAMP']          = null;
        header("Content-Type: text/html");
        header('HTTP/1.0 403 Forbidden');
        die($msg);
}

function nuAccessLevelCode($u){

	$s	= "SELECT sal_code FROM zzzzsys_user JOIN zzzzsys_access ON zzzzsys_access_id = sus_zzzzsys_access_id WHERE zzzzsys_user_id = ? ";
	$t	= nuRunQuery($s, [$u]);
	return db_fetch_row($t)[0];
}

function nuIDTEMP(){

	if( !isset($_POST['nuCounter2']) ) {
        	$_POST['nuCounter2']    = rand(1, 9999);
        	$_POST['nuCounter2ID']  = 's' . time();
    	}

	if($_POST['nuCounter2'] == 9999){
        	$_POST['nuCounter2']    = 0;
        	$_POST['nuCounter2ID']  =  's' . time();
    	} else {
        	$_POST['nuCounter2']++;
    	}

    	$id = $_POST['nuCounter2ID'] . str_pad($_POST['nuCounter2'], 4, '0', STR_PAD_LEFT);

	return $id;
}

function nuGetTranslation($l){
	
	$a	= [];
	$s	= "SELECT * FROM zzzzsys_translate WHERE trl_language = '$l' ";
	$t	= nuRunQuery($s);
	while($r = db_fetch_object($t)){
		$a[]	= ['english' => $r->trl_english, 'translation' => $r->trl_translation];
	}
	
	return $a;
}
?>
