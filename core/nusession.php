<?php

require_once('nuchoosesetup.php');
require_once('nucommon.php');
require_once('nuprocesslogins.php');
require_once('nuprocessssologins.php');
require_once('nusecurity.php');

function nuRunLoginProcedure($procedure) {

	$p		= nuProcedure($procedure);
	$error	= '';
	if($p != ''){
		eval($p);
		if ($error != '') nuDie($error);
	}
}

if ( nuCheckIsLoginRequest() ) {

	$result = "1";
	if ( nuCheckGlobeadminLoginRequest() ) {
		nuLoginSetupGlobeadmin($_SESSION['nubuilder_session_data']['GLOBEADMIN_NAME'],'','');
	}
	else {
		$request = nuCheckUserLoginRequest();
		$result = $request['result'];
		if ($result == "1" ) {
				if (strpos($_SESSION['nubuilder_session_data']['GLOBEADMIN_USERS'], $request['user_id'] ) !== false) {
					nuLoginSetupGlobeadmin($request['login_name'],$request['user_id'], $request['user_name']);
				} else {
					nuLoginSetupNOTGlobeadmin();
				}
		}
	}

	if ($result != "1") {
		// Failed login
		nuRunLoginProcedure('nuInvalidLogin');

		if ($result == "0") nuDie('Invalid login.');
		if ($result == "-1") nuDie('This account is disabled.');
	}

} elseif ( nuCheckIsSsoLoginRequest() ) {

	$check = true;

	$sso_d = nuSsoGetloginRequestData();
	if($sso_d["name"] == "" or $sso_d["email"] == "" or $sso_d["code"] == "") $check = false;
	$check or nuDie("Error during SSO login.  Internal information: sso_d was incomplete.");

	// Check the POSTed data against the database entry that was created when the user SSO-logged-in (just now)
	$ssodb_d = nuSsoCheckloginDataAgainstDb($sso_d);
	// $ssodb_d["email"] and $ssodb_d["name"] are now set.

	nuSsoMarkRowInDbAsProcessed($sso_d);

	$matches = [];
	$check = preg_match("/^([^@]+)\@/", $ssodb_d["email"], $matches);
	$check or nuDie("Error during SSO login.  Internal information: Could not extract local part of email.");
	$emailLocalPart = $matches[1];  // The part of the email address before the "@"

	$veryFirstLogin = nuSsoVeryFirstLogin($ssodb_d["email"]);
	if($veryFirstLogin) {
		nuSsoAddSysUserEntryForFirstLogin($emailLocalPart, $ssodb_d);
	}

	nuSsoCheckSysUserEntryIsInOrder($ssodb_d["email"]);

	// No nuDie() has been executed, if we made it this far...
	nuLoginSetupNOTGlobeadmin(true, $ssodb_d["email"]);

} else {
	nuCheckExistingSession();
}


if ( $_SESSION['nubuilder_session_data']['SESSION_ID'] == 'tempanonreport' ) {

	// only let the user have 1 temporary report run
	nuTempAnonReport();

} else if ( isset($_SESSION['nubuilder_session_data']['SESSION_TIMESTAMP']) ) {

	nuUpdateExistingSession();

} else {

	nuDie(nuTranslate('Your session has timed out.'));

}

?>
