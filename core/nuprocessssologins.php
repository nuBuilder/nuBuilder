<?php

function nuSsoLoginCheckParams() {

	// This function is called from nuapi.php.
	// All it does is checks that we were passed non-blank parameters.
	// Later, in nusession.php, there is section that uses this data, wrapped in:-
	// elseif ( nuCheckIsSsoLoginRequest() ) { ... }

	$check = true;
	(array_key_exists('ssousersname',	$_POST['nuSTATE'])) or $check = false;
	(array_key_exists('ssousersemail',	$_POST['nuSTATE'])) or $check = false;
	(array_key_exists('code',			$_POST['nuSTATE'])) or $check = false;

	if($check) {
		if (($_POST['nuSTATE']['ssousersname'] == "") || ($_POST['nuSTATE']['ssousersemail'] == "") ||
			($_POST['nuSTATE']['code'] == "")) {
			$check = false;
		}
	}

	$check or nuDie("Error during SSO login.  Internal information: Did not get parameters for ssologin call or they were blank");
}

function nuSsoGetloginRequestData() {

	$return = array();
	if (array_key_exists('ssousersname',	$_POST['nuSTATE']))	$nameFromPost  = $_POST['nuSTATE']['ssousersname'];
	if (array_key_exists('ssousersemail',	$_POST['nuSTATE']))	$emailFromPost = $_POST['nuSTATE']['ssousersemail'];
	if (array_key_exists('code',			$_POST['nuSTATE']))	$codeFromPost	= $_POST['nuSTATE']['code'];

	$nameFromPost  and $return["name"]  = $nameFromPost;
	$emailFromPost and $return["email"] = $emailFromPost;
	$codeFromPost  and $return["code"]  = $codeFromPost;

	return $return;
}

function nuSsoCheckloginDataAgainstDb($sso_d) {

	$check = true;  $nameFromDB="";  $emailFromDB="";  $timeFromDB=0;

	$sql = "
		SELECT sso_email, sso_name, sso_login_time_s
		FROM zzzzsys_sso_login
		WHERE sso_processed = 0 AND sso_code = ?
		";
	$rs = nuRunQuery($sql, array($sso_d["code"]));

	(db_num_rows($rs) == 1) or nuDie("Error during SSO login.  Internal information: did not find an unprocessed row matching the ssologin data.");

	$r = db_fetch_object($rs);
	$emailFromDB = $r->sso_email;
	$nameFromDB  = $r->sso_name;
	$timeFromDB  = $r->sso_login_time_s;
	$elapsed = time()-$timeFromDB;

	if($elapsed > 200) $check = false;  // TODO: Change to short timeout, e.g. five seconds or less
	$check or nuDie("Error during SSO login.  A timeout occurred.  $elapsed ; $timeFromDB");

	if($sso_d["name"] != $nameFromDB or $sso_d["email"] != $emailFromDB) $check = false;
	$check or nuDie("Error during SSO login.  Data did not match ssologin request.");

	$return = array();
	$return["email"] = $emailFromDB;
	$return["name"]  = $nameFromDB;
	return $return;
}

function nuSsoMarkRowInDbAsProcessed($sso_d) {
	// Now mark the row as "Processed"
	$sql = "
		UPDATE zzzzsys_sso_login
		SET sso_processed = 1
		WHERE sso_processed = 0 AND sso_code = ?
		";
	$rs = nuRunQuery($sql, array($sso_d["code"]));
	$numRows = db_num_rows($rs);

	$check = ($numRows == 1);
	$check or nuDie("Error during SSO login.  Internal information: Not processed.");
}

function nuSsoVeryFirstLogin($sus_login_name) {
	// Check whether we already have a sys_user entry for this user, based on the username:-
	$sql = "
		SELECT IF (sus_expires_on < CURDATE() AND NOT sus_expires_on IS NULL, 1, 0) AS expired,
		sus_login_name, sus_name
		FROM zzzzsys_user JOIN zzzzsys_access ON zzzzsys_access_id = sus_zzzzsys_access_id
		WHERE sus_login_name = ?
		";
	$rs = nuRunQuery($sql, array($sus_login_name));
	$numRows = db_num_rows($rs);
	return ($numRows != 1);
}

function nuSsoDetermineAccessLevelForFirstLogin($ssodb_d) {

	$error	= '';
	$accessLevel = 'Unset';
	$email = $ssodb_d["email"];
	// Optionally add php code in nuBuilder: Builders->Procedure with
	// Code = DETERMINE_ACCESS_LEVEL_FOR_FIRST_SSO_LOGIN
	// PHP = The php code to run: instructions:
	// On entry: $error is '', $accessLevel is 'Unset' and $email is the email address
	// of the user performing the SSO login.
	// The code must set $error to a string describing the error if one occurs.
	// The code must set $accessLevel, otherwise 'Default' will be assumed.
	// Set $accessLevel to 'Denied' to deny SSO login or set $error.
	// Once this PHP code has finished running:
	// The $accessLevel returned should be:
	// 'Unset'(->'Default')
	// 'Denied'
	// Or should already match the "Description" of an existing entry in nuBuilder Setup->Access Levels.
	// (If it does not exist, an error will be generated).
	$p		= nuProcedure("DETERMINE_ACCESS_LEVEL_FOR_FIRST_SSO_LOGIN");
	if($p != ''){
		eval($p);
		if ($error != '') nuDie($error);
	}
	if($accessLevel == 'Unset') $accessLevel = 'Default';
	return $accessLevel;
}

function nuSsoAddSysUserEntryForFirstLogin($emailLocalPart, $ssodb_d) {  // $ssodb_d["email"] and $ssodb_d["name"]
	// First figure out which access level we should give this user based on their email address
	$accessLevel = nuSsoDetermineAccessLevelForFirstLogin($ssodb_d);
	$accessLevel == 'Denied' and nuDie("Error during SSO login.  Internal information: Access Level returned was 'Denied'");

	// First find the FK matching the PK in sys_access for the access level to give to this user (default: read only)
	$sql = "
		SELECT zzzzsys_access_id FROM zzzzsys_access WHERE sal_description = ?
		";
	$rs = nuRunQuery($sql, array($accessLevel));
	$rowCount = db_num_rows($rs);
	$check = ($rowCount == 1);
	$check or nuDie('Error during SSO login.  Internal information: There must be exactly one entry in "Access Levels" with "Description" of '.$accessLevel.' but found '."$rowCount");

	$r = db_fetch_object($rs);
	if (!isset($r->zzzzsys_access_id)) $check = false;
	$check or nuDie('Error during SSO login.  Internal information: Access ID not set');
	$fk_ro_access_id = $r->zzzzsys_access_id;

	// Then insert a new entry into sys_user for this user, with the default access level
	$sql = "INSERT INTO zzzzsys_user (zzzzsys_user_id, sus_zzzzsys_access_id, sus_name, sus_code, sus_login_name) VALUES (?, ?, ?, ?, ?)";
	$array = array($ssodb_d["email"], $fk_ro_access_id, $ssodb_d["name"], $emailLocalPart, $ssodb_d["email"]);
	$rs = nuRunQuery($sql, $array, true);

//	 $rowCount = db_num_rows($rs);
//	 $check = ($numRows == 1);
//	 $check or nuDie('Error during SSO login.  Internal information: New entry with default access level failed');
}

function nuSsoCheckSysUserEntryIsInOrder($sus_login_name) {
	// Call nuDie if we do not have a non-expired sys_user entry for this user, based on the $username.
	$sql = "
		SELECT IF (sus_expires_on < CURDATE() AND NOT sus_expires_on IS NULL, 1, 0) AS expired,
		sus_login_name, sus_name
		FROM zzzzsys_user JOIN zzzzsys_access ON zzzzsys_access_id = sus_zzzzsys_access_id
		WHERE sus_login_name = ?
		";
	$rs = nuRunQuery($sql, array($sus_login_name));
	$numRows = db_num_rows($rs);
	($numRows == 1) or nuDie("Error during SSO login.  Internal information: Entry for user was not found.");

	$r = db_fetch_object($rs);
	$expired = $r->expired;
	// $sus_login_name = $r->sus_login_name;
	// $sus_name = $r->sus_name;

	($expired == 0) or nuDie("Error during SSO login.  Internal information: Entry for user was found but is expired.");

}

?>
