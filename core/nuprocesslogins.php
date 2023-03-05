<?php

function nuCheckExistingSession() {

	global $nuConfigTitle;

	if (!($_SESSION['nubuilder_session_data']['SESSION_ID'] ?? false)) {
		nuDie(nuTranslate('You must be logged into ') . $nuConfigTitle);
	}

}

function isDemoGlobadmin() {

	return nuDemo(false) && $_POST['nuSTATE']['username'] == $_SESSION['nubuilder_session_data']['GLOBEADMIN_DEMO_NAME'] && $_SESSION['nubuilder_session_data']['GLOBEADMIN_DEMO_NAME'] != '';
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

	if (db_field_exists("zzzzsys_user","sus_json") == false) {
		nuRunQuery("ALTER TABLE zzzzsys_user ADD sus_json MEDIUMTEXT NULL DEFAULT NULL;");
	}

	$sql = "
		SELECT IF (sus_expires_on < CURDATE() AND NOT sus_expires_on IS NULL, 1, 0) AS expired,
		zzzzsys_user_id AS user_id, sus_login_name AS login_name, sus_name AS user_name,
		sus_login_password as user_password, sus_json
		FROM zzzzsys_user JOIN zzzzsys_access  ON zzzzsys_access_id = sus_zzzzsys_access_id
		WHERE sus_login_name = ?
		";

	$sqlMd5   = $sql." AND sus_login_password = ?";
	$sqlToken = $sql." AND sus_json LIKE ? ";

	$rs = nuRunQuery($sqlMd5, [
		$_POST['nuSTATE']['username'],
		md5($_POST['nuSTATE']['password'])
	]);

	$check = db_num_rows($rs) == 1 ;

	$ts = nuRunQuery($sqlToken, [
		$_POST['nuSTATE']['username'],
		'%"LOGIN_TOKEN":"' . $_POST['nuSTATE']['password'] .'"%'
	]);

	$checkToken =  db_num_rows($ts) == 1 ;


	if ($check == true) {

		$r = db_fetch_object($rs);

		if ($_SESSION['nubuilder_session_data']['USE_MD5_PASSWORD_HASH'] != true) {

			$sql = 'UPDATE zzzzsys_user SET sus_login_password = ? WHERE sus_login_name = ?';
			nuRunQuery($sql, [
						nuPasswordHash($_POST['nuSTATE']['password']),
						$_POST['nuSTATE']['username']
					]
			);
		}

	} else {

		$rs = nuRunQuery($sql, [$_POST['nuSTATE']['username']]);
		$check = db_num_rows($rs) == 1;

		$r = db_fetch_object($rs);
		if ($check == true) {
			$check = password_verify($_POST['nuSTATE']['password'], $r->user_password);
		}

	}

	$check = ($check || $checkToken);
	if ($check == true) {
		$result = $r->expired == "1" ? "-1" : "1";
	} else {
		$result = "0";
	}

	return ['result' => $result, 'user_id' => ($check ? $r->user_id : ''), 'login_name' => ($check ? $r->login_name : ''), 'user_name' => ($check ? $r->user_name : '')];

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

function nuCheckIsSsoLoginRequest() {

	if (array_key_exists('nuSTATE', $_POST)) {

		if (array_key_exists('call_type', $_POST['nuSTATE'])) {

			if ($_POST['nuSTATE']['call_type'] == 'ssologin') {
				return true;
			}
		}
	}

	return false;

}

function nuGetIPAddress() {

	if (isset($_SERVER["HTTP_CF_CONNECTING_IP"])) {
		$_SERVER['REMOTE_ADDR'] = $_SERVER["HTTP_CF_CONNECTING_IP"];
		$_SERVER['HTTP_CLIENT_IP'] = $_SERVER["HTTP_CF_CONNECTING_IP"];
	}

	$client = @$_SERVER['HTTP_CLIENT_IP'];
	$forward = @$_SERVER['HTTP_X_FORWARDED_FOR'];
	$remote = $_SERVER['REMOTE_ADDR'];

	if (filter_var($client, FILTER_VALIDATE_IP)) {
		$ip = $client;
	} elseif (filter_var($forward, FILTER_VALIDATE_IP)) {
		$ip = $forward;
	} else {
		$ip = $remote;
	}
	return $ip;

}

function nuLoginSetupGlobeadmin($loginName, $userId, $userName) {

	global $nuConfig2FAAdmin;

	$_SESSION['nubuilder_session_data']['SESSION_ID'] = nuIDTEMP();
	$_SESSION['nubuilder_session_data']['SESSION_TIMESTAMP'] = time();

	$isDemo = isDemoGlobadmin() && nuDemo(false);
	$_SESSION['nubuilder_session_data']['IS_DEMO'] = $isDemo;

	$lang = db_setup()->set_language;
	$_SESSION['nubuilder_session_data']['isGlobeadmin'] = true;
	$_SESSION['nubuilder_session_data']['translation'] = nuGetTranslation($lang);
	$_SESSION['nubuilder_session_data']['language'] = $lang;
	$_SESSION['nubuilder_session_data']['HOME_ID'] = $_SESSION['nubuilder_session_data']['GLOBEADMIN_HOME'] ?? 'nuhome';


	$sessionIds = new stdClass;
	$sessionIds->zzzzsys_access_id = '';
	$sessionIds->zzzzsys_user_id = $userId == '' ? $_SESSION['nubuilder_session_data']['GLOBEADMIN_NAME'] : $userId;
	$sessionIds->sus_login_name = $loginName;
	$sessionIds->language = $lang;
	$sessionIds->sus_name =  $userId == '' ? '' : $userName;
	$sessionIds->sus_position =  '';
	$sessionIds->sus_department =  '';
	$sessionIds->sus_team =  '';
	$sessionIds->sus_code =  '';
	$sessionIds->sus_additional1 =  '';
	$sessionIds->sus_accessibility_features =  '';

	$sessionIds->sus_additional2 =  '';

	if ($nuConfig2FAAdmin) {
		if (nu2FALocalTokenOK($sessionIds->sus_login_name)) {
			$sessionIds->zzzzsys_form_id = $_SESSION['nubuilder_session_data']['HOME_ID'];
		} else {
			$sessionIds->zzzzsys_form_id = $_SESSION['nubuilder_session_data']['2FA_FORM_ID'];
			$_SESSION['nubuilder_session_data']['SESSION_2FA_STATUS'] = 'PENDING';
			$_SESSION['nubuilder_session_data']['SESSION_2FA_REDIRECT_FORM_ID'] = $_SESSION['nubuilder_session_data']['HOME_ID'];
		}
	} else {
		$sessionIds->zzzzsys_form_id = $_SESSION['nubuilder_session_data']['HOME_ID'];
	}

	$sessionIds->global_access = '1';
	$sessionIds->ip_address = nuGetIPAddress();

	$storeSessionInTable = new stdClass;
	$storeSessionInTable->session = $sessionIds;

	// forms
	$getAllFormsQRY = nuRunQuery("SELECT zzzzsys_form_id AS id FROM zzzzsys_form");
	$formAccess = [];
	while ($getAllFormsOBJ = db_fetch_object($getAllFormsQRY)) {
		$formAccess[] = [$getAllFormsOBJ->id];
	}
	$storeSessionInTable->forms = $formAccess;

	// reports
	$getAllReportsQRY = nuRunQuery("SELECT zzzzsys_report_id AS id, sre_zzzzsys_form_id AS form_id FROM zzzzsys_report");
	$reportAccess = [];
	while ($getAllReportsOBJ = db_fetch_object($getAllReportsQRY)) {
		$reportAccess[] = [$getAllReportsOBJ->id, $getAllReportsOBJ->form_id];
	}
	$storeSessionInTable->reports = $reportAccess;

	// procedures
	$getAllPHPsQRY = nuRunQuery("SELECT zzzzsys_php_id AS id, sph_zzzzsys_form_id AS form_id FROM zzzzsys_php");
	$phpAccess = [];
	while ($getAllPHPsOBJ = db_fetch_object($getAllPHPsQRY)) {
		$phpAccess[] = [$getAllPHPsOBJ->id, $getAllPHPsOBJ->form_id];
	}
	$storeSessionInTable->procedures = $phpAccess;
	$storeSessionInTable->access_level_code = '';
	$storeSessionInTable->access_level_group = '';
	$storeSessionInTableJSON = json_encode($storeSessionInTable);

	$sql = "INSERT INTO zzzzsys_session SET sss_access = ?, zzzzsys_session_id = ?";
	$values = [
		$storeSessionInTableJSON,
		$_SESSION['nubuilder_session_data']['SESSION_ID']
	];

	nuRunQuery($sql, $values);
	
	nuCreateViewsOrTables();

	return true;
}

function nuLoginSetupNOTGlobeadmin($new = true, $sSoUserName = "") {

	global $nuConfig2FAUser;

	if ($new) {

		$_SESSION['nubuilder_session_data']['SESSION_ID'] = nuIDTEMP();
		$_SESSION['nubuilder_session_data']['SESSION_TIMESTAMP'] = time();
		$_SESSION['nubuilder_session_data']['IS_DEMO'] = false;

		$sql = "SELECT * FROM zzzzsys_user JOIN zzzzsys_access ON zzzzsys_access_id = sus_zzzzsys_access_id WHERE sus_login_name = ?";

		if($sSoUserName) {
			$thisUsername = $sSoUserName;
		} else {
			$thisUsername = $_POST['nuSTATE']['username'];
			$thisPassword = $_POST['nuSTATE']['password'];
		}

		$rs = nuRunQuery($sql, [$thisUsername]);
		$checkLoginDetailsOBJ = db_fetch_object($rs);

		if ($sSoUserName) {
			$check = true;
		} elseif ($_SESSION['nubuilder_session_data']['USE_MD5_PASSWORD_HASH'] != true) {
			$check = password_verify($thisPassword, $checkLoginDetailsOBJ->sus_login_password);
		} else {
			$check = md5($thisPassword) == $checkLoginDetailsOBJ->sus_login_password;
		}

		if (!$sSoUserName) {

			$login_token = nuGetUserJSONData("LOGIN_TOKEN",  $checkLoginDetailsOBJ->zzzzsys_user_id );

			$checkToken = ($thisPassword == $login_token && strlen($thisPassword) >= 20);
			// the token must match and be at least 10 chars
			if ($checkToken == true) {
				// generate a new token for next time if the use-once token has been used
				nuSetUserJSONData("LOGIN_TOKEN", nuGenerateToken(20), $checkLoginDetailsOBJ->zzzzsys_user_id );
			}

		}

		if ($check == false && $checkToken == false) nuDie();

	}

	$language = $new ? $checkLoginDetailsOBJ->sus_language : $_SESSION['nubuilder_session_data']['language'];
	$userId = $new ? $checkLoginDetailsOBJ->zzzzsys_user_id : $_SESSION['nubuilder_session_data']['user_id'];

	if ($new) {
		$_SESSION['nubuilder_session_data']['user_id'] = $userId;
		$_SESSION['nubuilder_session_data']['language'] = $language;
		$_SESSION['nubuilder_session_data']['translation'] = nuGetTranslation($language);
		$_SESSION['nubuilder_session_data']['language'] = $language;
		$_SESSION['nubuilder_session_data']['isGlobeadmin'] = false;
	}

	$translationQRY = nuRunQuery("SELECT * FROM zzzzsys_translate WHERE trl_language = ? ORDER BY trl_english", [$language]);
	$getAccessLevelSQL = "SELECT zzzzsys_access.*, zzzzsys_user.* FROM zzzzsys_user ";
	$getAccessLevelSQL .= "INNER JOIN zzzzsys_access ON zzzzsys_access_id = sus_zzzzsys_access_id ";
	$getAccessLevelSQL .= "WHERE zzzzsys_user_id = '$userId' ";
	$getAccessLevelSQL .= "GROUP BY sus_zzzzsys_access_id ";
	$getAccessLevelQRY = nuRunQuery($getAccessLevelSQL);

	if (db_num_rows($getAccessLevelQRY) == 0) {
		nuDie($msg = 'No access levels setup.');
	}

	$getAccessLevelOBJ = db_fetch_object($getAccessLevelQRY);

	$_SESSION['nubuilder_session_data']['HOME_ID'] = $getAccessLevelOBJ->sal_zzzzsys_form_id;

	$sessionIds = new stdClass;
	$sessionIds->zzzzsys_access_id = $getAccessLevelOBJ->zzzzsys_access_id;
	$sessionIds->zzzzsys_user_id = $userId;
	$sessionIds->sus_login_name = $getAccessLevelOBJ->sus_login_name;
	$sessionIds->sus_name = $getAccessLevelOBJ->sus_name;
	$sessionIds->language = $language;

	$sessionIds->sus_position = $getAccessLevelOBJ->sus_position ?? null;
	$sessionIds->sus_department = $getAccessLevelOBJ->sus_department ?? null;
	$sessionIds->sus_team = $getAccessLevelOBJ->sus_team ?? null;
	$sessionIds->sus_code = $getAccessLevelOBJ->sus_code ?? null;
	$sessionIds->sus_additional1 = $getAccessLevelOBJ->sus_additional1 ?? null;
	$sessionIds->sus_additional2 = $getAccessLevelOBJ->sus_additional2 ?? null;
	$sessionIds->sus_accessibility_features = $getAccessLevelOBJ->sus_accessibility_features ?? null;


	$sessionIds->global_access = '0';
	$sessionIds->ip_address = nuGetIPAddress();

	$salUse2FA = isset($getAccessLevelOBJ->sal_use_2fa) && $getAccessLevelOBJ->sal_use_2fa;

	if ($nuConfig2FAUser && $new && $salUse2FA) {
		if (nu2FALocalTokenOK($sessionIds->zzzzsys_user_id)) {
			$sessionIds->zzzzsys_form_id = $getAccessLevelOBJ->sal_zzzzsys_form_id;
		} else {
			$sessionIds->zzzzsys_form_id = $_SESSION['nubuilder_session_data']['2FA_FORM_ID'];
			$_SESSION['nubuilder_session_data']['SESSION_2FA_STATUS'] = 'PENDING';
			$_SESSION['nubuilder_session_data']['SESSION_2FA_REDIRECT_FORM_ID'] = $getAccessLevelOBJ->sal_zzzzsys_form_id;
		}
	} else {
		$sessionIds->zzzzsys_form_id = $getAccessLevelOBJ->sal_zzzzsys_form_id;
	}

	$storeSessionInTable = new stdClass;
	$storeSessionInTable->session = $sessionIds;

	$aclInfo = nuAccessLevelInfo($userId);
	$storeSessionInTable->access_level_code = $aclInfo['code'];
	$storeSessionInTable->access_level_group = $aclInfo['group'];

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
	$formAccess = [];
	while ($getFormsOBJ = db_fetch_object($getFormsQRY)) {
		$formAccess[] = [$getFormsOBJ->id, $getFormsOBJ->a, $getFormsOBJ->p, $getFormsOBJ->s, $getFormsOBJ->c, $getFormsOBJ->d];
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
	$reportAccess = [];
	while ($getReportsOBJ = db_fetch_object($getReportsQRY)) {
		$reportAccess[] = [$getReportsOBJ->id, $getReportsOBJ->form_id];
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
	$phpAccess = [];
	while ($getPHPsOBJ = db_fetch_object($getPHPsQRY)) {
		$phpAccess[] = [$getPHPsOBJ->id, $getPHPsOBJ->form_id];
	}
	$storeSessionInTable->procedures = $phpAccess;

	$storeSessionInTableJSON = json_encode($storeSessionInTable);

	nuRunQuery("REPLACE INTO zzzzsys_session SET sss_access = ?, zzzzsys_session_id = ?", [
		$storeSessionInTableJSON,
		$_SESSION['nubuilder_session_data']['SESSION_ID']
	]);

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

function nuAccessLevelInfo($u) {

	$s = "SELECT * FROM zzzzsys_user JOIN zzzzsys_access ON zzzzsys_access_id = sus_zzzzsys_access_id WHERE zzzzsys_user_id = ? ";
	$t = nuRunQuery($s, [$u]);
	$r = db_fetch_object($t);

	return [
		'group' => $r->sal_group ?? '',
		'code' => $r->sal_code
	];

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

	$a = [];
	$s = "SELECT trl_english, trl_translation FROM zzzzsys_translate WHERE trl_language = ? ORDER BY trl_english, CASE WHEN zzzzsys_translate_id like 'nu%' THEN 1 ELSE 0 END ";
	$t = nuRunQuery($s, [$l]);
	while ($r = db_fetch_object($t)) {
		$a[] = ['english' => $r->trl_english, 'translation' => $r->trl_translation];
	}

	return $a;
}

?>
