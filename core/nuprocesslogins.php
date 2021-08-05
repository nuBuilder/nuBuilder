<?php

function nuCheckExistingSession() {

	global $nuConfigTitle;	

	if (!isset($_SESSION['nubuilder_session_data']['SESSION_ID']) || !isset($_SESSION['nubuilder_session_data'])) {
		nuDie(nuTranslate('You must be logged into ').$nuConfigTitle);
	}

}

function isDemoGlobadmin() {

	return $_SESSION['nubuilder_session_data']['IS_DEMO'] == true && $_POST['nuSTATE']['username'] == $_SESSION['nubuilder_session_data']['GLOBEADMIN_DEMO_NAME'] && $_SESSION['nubuilder_session_data']['GLOBEADMIN_DEMO_NAME'] != '';
}

//Check for Globeadmin login
function nuCheckGlobeadminLoginRequest() {

	if ($_POST['nuSTATE']['username'] == $_SESSION['nubuilder_session_data']['GLOBEADMIN_NAME'] && $_POST['nuSTATE']['password'] == $_SESSION['nubuilder_session_data']['GLOBEADMIN_PASS']) {
		return true;
	}

	$isDemo = isDemoGlobadmin();
	if ($isDemo && !isset($_SESSION['nubuilder_session_data']['GLOBEADMIN_DEMO_NAME'])) {
		return false;
	}

	if ($isDemo && $_POST['nuSTATE']['password'] == $_SESSION['nubuilder_session_data']['GLOBEADMIN_DEMO_PASS']) {		
		return true;
	}

	return false;
}


//Check for Standlone User login
function nuCheckUserLoginRequest() {

	$sql = "
				SELECT IF (sus_expires_on < CURDATE() AND NOT sus_expires_on IS NULL, 1, 0) AS expired, 
				zzzzsys_user_id AS user_id, sus_login_name AS login_name, sus_name AS user_name
				FROM zzzzsys_user JOIN zzzzsys_access ON zzzzsys_access_id = sus_zzzzsys_access_id 
				WHERE sus_login_name = ? AND sus_login_password = ?
			";

	$rs = nuRunQuery($sql, array(
		$_POST['nuSTATE']['username'],
		md5($_POST['nuSTATE']['password'])
	));

	$oneRow = db_num_rows($rs) == 1;

	if ($oneRow) {
		$r = db_fetch_object($rs);
		$result = $r->expired == "1" ? "-1" : "1";
	} else {
		$result = "0";
	}

	return array('result' => $result, 'user_id' => ($oneRow ? $r->user_id : ''), 'login_name' => ($oneRow ? $r->login_name : ''), 'user_name' => ($oneRow ? $r->user_name : ''));

}

function nuCheckIsLoginRequest() {

	if (array_key_exists('nuSTATE', $_POST)) {

		if (array_key_exists('call_type', $_POST['nuSTATE'])) {

			if ($_POST['nuSTATE']['call_type'] == 'login') {

				return true;

			}
		}
	}

	return false;

}

function nuGetIPAddress() {
	return $_SERVER['REMOTE_ADDR']?:($_SERVER['HTTP_X_FORWARDED_FOR']?:$_SERVER['HTTP_CLIENT_IP']);
}	

function nuLoginSetupGlobeadmin($loginName, $userId, $userName) {

	global $nuConfig2FAAdmin;	
	
	$_SESSION['nubuilder_session_data']['SESSION_ID'] = nuIDTEMP();
	$_SESSION['nubuilder_session_data']['SESSION_TIMESTAMP'] = time();

	$isDemo = isDemoGlobadmin() && $_SESSION['nubuilder_session_data']['IS_DEMO'];
	$_SESSION['nubuilder_session_data']['IS_DEMO'] = $isDemo;

	$_SESSION['nubuilder_session_data']['isGlobeadmin'] = true;
	$_SESSION['nubuilder_session_data']['translation'] = nuGetTranslation(db_setup()->set_language);
	$_SESSION['nubuilder_session_data']['HOME_ID'] = 'nuhome';

	$sessionIds = new stdClass;
	$sessionIds->zzzzsys_access_id = '';
	$sessionIds->zzzzsys_user_id = $userId == '' ? $_SESSION['nubuilder_session_data']['GLOBEADMIN_NAME'] : $userId;
	$sessionIds->sus_login_name = $loginName;
	$sessionIds->sus_name =  $userId == '' ? '' : $userName;

	if ($nuConfig2FAAdmin) {
		if (nu2FALocalTokenOK($sessionIds->sus_login_name)) {
			$sessionIds->zzzzsys_form_id = 'nuhome';
		} else {
			$sessionIds->zzzzsys_form_id = $_SESSION['nubuilder_session_data']['2FA_FORM_ID'];
			$_SESSION['nubuilder_session_data']['SESSION_2FA_STATUS'] = 'PENDING';
			$_SESSION['nubuilder_session_data']['SESSION_2FA_REDIRECT_FORM_ID'] = 'nuhome';
		}
	} else {
		$sessionIds->zzzzsys_form_id = 'nuhome';
	}	

	$sessionIds->global_access = '1';
	$sessionIds->ip_address = nuGetIPAddress();

	$storeSessionInTable = new stdClass;
	$storeSessionInTable->session = $sessionIds;

	// forms
	$getAllFormsQRY = nuRunQuery("SELECT zzzzsys_form_id AS id FROM zzzzsys_form");
	$formAccess = array();
	while ($getAllFormsOBJ = db_fetch_object($getAllFormsQRY)) {
		$formAccess[] = array($getAllFormsOBJ->id);
	}
	$storeSessionInTable->forms = $formAccess;

	// reports
	$getAllReportsQRY = nuRunQuery("SELECT zzzzsys_report_id AS id, sre_zzzzsys_form_id AS form_id FROM zzzzsys_report");
	$reportAccess = array();
	while ($getAllReportsOBJ = db_fetch_object($getAllReportsQRY)) {
		$reportAccess[] = array($getAllReportsOBJ->id, $getAllReportsOBJ->form_id);
	}
	$storeSessionInTable->reports = $reportAccess;

	// procedures
	$getAllPHPsQRY = nuRunQuery("SELECT zzzzsys_php_id AS id, sph_zzzzsys_form_id AS form_id FROM zzzzsys_php");
	$phpAccess = array();
	while ($getAllPHPsOBJ = db_fetch_object($getAllPHPsQRY)) {
		$phpAccess[] = array($getAllPHPsOBJ->id, $getAllPHPsOBJ->form_id);
	}
	$storeSessionInTable->procedures = $phpAccess;
	$storeSessionInTable->access_level_code = '';
	$storeSessionInTableJSON = json_encode($storeSessionInTable);

	$sql = "INSERT INTO zzzzsys_session SET sss_access = ?, zzzzsys_session_id = ?";
	$values = array(
		$storeSessionInTableJSON,
		$_SESSION['nubuilder_session_data']['SESSION_ID']
	);

	nuRunQuery($sql, $values);

	return true;
}

function nuLoginSetupNOTGlobeadmin($new = true) {

	global $nuConfig2FAUser;

	if ($new) {

		$_SESSION['nubuilder_session_data']['SESSION_ID'] = nuIDTEMP();
		$_SESSION['nubuilder_session_data']['SESSION_TIMESTAMP'] = time();
		$_SESSION['nubuilder_session_data']['IS_DEMO'] = false;

		$checkLoginDetailsSQL = "SELECT * FROM zzzzsys_user JOIN zzzzsys_access ON zzzzsys_access_id = sus_zzzzsys_access_id WHERE sus_login_name = ? AND sus_login_password = ? ";

		$this_username = $_POST['nuSTATE']['username'];
		$this_password = md5($_POST['nuSTATE']['password']);

		$checkLoginDetailsValues = array(
			$this_username,
			$this_password
		);
		$checkLoginDetailsQRY = nuRunQuery($checkLoginDetailsSQL, $checkLoginDetailsValues);
		$checkLoginDetailsOBJ = db_fetch_object($checkLoginDetailsQRY);
	
	}

	$language = $new ? $checkLoginDetailsOBJ->sus_language : $_SESSION['nubuilder_session_data']['language'];
	$userId = $new ? $checkLoginDetailsOBJ->zzzzsys_user_id : $_SESSION['nubuilder_session_data']['user_id'];

	if ($new) {
		$_SESSION['nubuilder_session_data']['user_id'] = $userId;
		$_SESSION['nubuilder_session_data']['language'] = $language;
		$_SESSION['nubuilder_session_data']['translation'] = nuGetTranslation($language);
		$_SESSION['nubuilder_session_data']['isGlobeadmin'] = false;
	}

	$translationQRY = nuRunQuery("SELECT * FROM zzzzsys_translate WHERE trl_language = ? ORDER BY trl_english", array($language));
	$getAccessLevelSQL = "SELECT zzzzsys_access_id, zzzzsys_user_id, sus_login_name, sus_name, sal_zzzzsys_form_id AS zzzzsys_form_id FROM zzzzsys_user ";
	$getAccessLevelSQL .= "INNER JOIN zzzzsys_access ON zzzzsys_access_id = sus_zzzzsys_access_id ";
	$getAccessLevelSQL .= "WHERE zzzzsys_user_id = '$userId' ";
	$getAccessLevelSQL .= "GROUP BY sus_zzzzsys_access_id ";
	$getAccessLevelQRY = nuRunQuery($getAccessLevelSQL);

	if (db_num_rows($getAccessLevelQRY) == 0) {
		nuDie($msg = 'No access levels setup.');
	}

	$getAccessLevelOBJ = db_fetch_object($getAccessLevelQRY);

	$_SESSION['nubuilder_session_data']['HOME_ID'] = $getAccessLevelOBJ->zzzzsys_form_id;

	$sessionIds = new stdClass;
	$sessionIds->zzzzsys_access_id = $getAccessLevelOBJ->zzzzsys_access_id;
	$sessionIds->zzzzsys_user_id = $userId;
	$sessionIds->sus_login_name = $getAccessLevelOBJ->sus_login_name;
	$sessionIds->sus_name = $getAccessLevelOBJ->sus_name;

	$sessionIds->global_access = '0';
	$sessionIds->ip_address = nuGetIPAddress();
	

	if ($nuConfig2FAUser && $new) {
		if (nu2FALocalTokenOK($sessionIds->zzzzsys_user_id)) {
			$sessionIds->zzzzsys_form_id = $getAccessLevelOBJ->zzzzsys_form_id;
		} else {
		$sessionIds->zzzzsys_form_id = $_SESSION['nubuilder_session_data']['2FA_FORM_ID'];
		$_SESSION['nubuilder_session_data']['SESSION_2FA_STATUS'] = 'PENDING';
		$_SESSION['nubuilder_session_data']['SESSION_2FA_REDIRECT_FORM_ID'] = $getAccessLevelOBJ->zzzzsys_form_id;
		}
	} else {
		$sessionIds->zzzzsys_form_id = $getAccessLevelOBJ->zzzzsys_form_id;
	}

	$storeSessionInTable = new stdClass;
	$storeSessionInTable->session = $sessionIds;
	$storeSessionInTable->access_level_code = nuAccessLevelCode($userId);

	// form ids
	$getFormsSQL = "SELECT slf_zzzzsys_form_id	AS id, ";
	$getFormsSQL .= "slf_add_button				AS a, ";
	$getFormsSQL .= "slf_save_button			AS s, ";
	$getFormsSQL .= "slf_delete_button			AS d, ";
	$getFormsSQL .= "slf_clone_button			AS c, ";
	$getFormsSQL .= "slf_print_button			AS p ";
	$getFormsSQL .= "FROM zzzzsys_user ";
	$getFormsSQL .= "JOIN zzzzsys_access ON zzzzsys_access_id = sus_zzzzsys_access_id ";
	$getFormsSQL .= "JOIN zzzzsys_access_form ON zzzzsys_access_id = slf_zzzzsys_access_id ";
	$getFormsSQL .= "WHERE zzzzsys_user_id = '$userId' ";
	$getFormsQRY = nuRunQuery($getFormsSQL);
	$formAccess = array();
	while ($getFormsOBJ = db_fetch_object($getFormsQRY)) {
		$formAccess[] = array($getFormsOBJ->id, $getFormsOBJ->a, $getFormsOBJ->p, $getFormsOBJ->s, $getFormsOBJ->c, $getFormsOBJ->d);
	}
	$storeSessionInTable->forms = $formAccess;

	// report ids
	$getReportsSQL = "SELECT sre_zzzzsys_report_id AS id, sre_zzzzsys_form_id AS form_id ";
	$getReportsSQL .= "FROM zzzzsys_user ";
	$getReportsSQL .= "JOIN zzzzsys_access ON zzzzsys_access_id = sus_zzzzsys_access_id ";
	$getReportsSQL .= "JOIN zzzzsys_access_report ON zzzzsys_access_id = sre_zzzzsys_access_id ";
	$getReportsSQL .= "JOIN zzzzsys_report ON zzzzsys_report_id = sre_zzzzsys_report_id ";
	$getReportsSQL .= "WHERE zzzzsys_user_id = '$userId' ";
	$getReportsSQL .= "GROUP BY sre_zzzzsys_report_id ";
	$getReportsQRY = nuRunQuery($getReportsSQL);
	$reportAccess = array();
	while ($getReportsOBJ = db_fetch_object($getReportsQRY)) {
		$reportAccess[] = array($getReportsOBJ->id, $getReportsOBJ->form_id);
	}
	$storeSessionInTable->reports = $reportAccess;

	// php ids
	$getPHPsSQL = "SELECT ";
	$getPHPsSQL .= "sal_code AS access_level_code, ";
	$getPHPsSQL .= "slp_zzzzsys_php_id AS id, ";
	$getPHPsSQL .= "sph_zzzzsys_form_id AS form_id ";
	$getPHPsSQL .= "FROM zzzzsys_user ";
	$getPHPsSQL .= "JOIN zzzzsys_access ON zzzzsys_access_id = sus_zzzzsys_access_id ";
	$getPHPsSQL .= "JOIN zzzzsys_access_php ON zzzzsys_access_id = slp_zzzzsys_access_id ";
	$getPHPsSQL .= "JOIN zzzzsys_php ON zzzzsys_php_id = slp_zzzzsys_php_id ";
	$getPHPsSQL .= "WHERE zzzzsys_user_id = '$userId' ";
	$getPHPsSQL .= "GROUP BY slp_zzzzsys_php_id ";
	$getPHPsQRY = nuRunQuery($getPHPsSQL);
	$phpAccess = array();
	while ($getPHPsOBJ = db_fetch_object($getPHPsQRY)) {
		$phpAccess[] = array($getPHPsOBJ->id, $getPHPsOBJ->form_id);
	}
	$storeSessionInTable->procedures = $phpAccess;

	$storeSessionInTableJSON = json_encode($storeSessionInTable);

	nuRunQuery("REPLACE INTO zzzzsys_session SET sss_access = ?, zzzzsys_session_id = ?", array(
		$storeSessionInTableJSON,
		$_SESSION['nubuilder_session_data']['SESSION_ID']
	));

	return true;
}

function nuTempAnonReport() {
	// only let the user have 1 temporary report run
	$_SESSION['nubuilder_session_data']['SESSION_ID'] = null;
	$_SESSION['nubuilder_session_data']['SESSION_TIMESTAMP'] = null;
	$_SESSION['nubuilder_session_data']['TEMPORARY_SESSION'] = true;
}

function nuUpdateExistingSession() {

	if (! isset($_SESSION['nubuilder_session_data']['SESSION_TIMEOUT_MINUTES'])) {
		$t = nuRunQuery("SELECT set_time_out_minutes FROM zzzzsys_setup");
		$r = db_fetch_object($t);
		$timeout = $r->set_time_out_minutes;
		$_SESSION['nubuilder_session_data']['SESSION_TIMEOUT_MINUTES'] = $timeout;
	} else {
		$timeout = $_SESSION['nubuilder_session_data']['SESSION_TIMEOUT_MINUTES'];
	}

	if ((($timeout * 60) + $_SESSION['nubuilder_session_data']['SESSION_TIMESTAMP']) >= time()) {
		$_SESSION['nubuilder_session_data']['SESSION_TIMESTAMP'] = time();
	}
	else {
		nuDie('Your session has timed out.');
	}
}

function nuDie($msg = 'Invalid login!') {

	$_SESSION['nubuilder_session_data']['SESSION_ID'] = null;
	$_SESSION['nubuilder_session_data']['SESSION_TIMESTAMP'] = null;
	header("Content-Type: text/html");
	header('HTTP/1.0 403 Forbidden');
	die($msg);
}

function nuAccessLevelCode($u) {

	$s = "SELECT sal_code FROM zzzzsys_user JOIN zzzzsys_access ON zzzzsys_access_id = sus_zzzzsys_access_id WHERE zzzzsys_user_id = ? ";
	$t = nuRunQuery($s,  array($u));
	return db_fetch_row($t) [0];
}

function nuIDTEMP() {

	if (!isset($_POST['nuCounter2'])) {
		$_POST['nuCounter2'] = rand(1, 9999);
		$_POST['nuCounter2ID'] = 's' . time();
	}

	if ($_POST['nuCounter2'] == 9999) {
		$_POST['nuCounter2'] = 0;
		$_POST['nuCounter2ID'] = 's' . time();
	}
	else {
		$_POST['nuCounter2']++;
	}

	$id = $_POST['nuCounter2ID'] . str_pad($_POST['nuCounter2'], 4, '0', STR_PAD_LEFT);

	return $id;
}

function nuGetTranslation($l) {

	$a = array();
	$s = "SELECT trl_english, trl_translation FROM zzzzsys_translate WHERE trl_language = ? ORDER BY trl_english, CASE WHEN zzzzsys_translate_id like 'nu%' THEN 1 ELSE 0 END ";
	$t = nuRunQuery($s, array($l));
	while ($r = db_fetch_object($t)) {
		$a[] = array('english' => $r->trl_english, 'translation' => $r->trl_translation);
	}

	return $a;
}


?>
