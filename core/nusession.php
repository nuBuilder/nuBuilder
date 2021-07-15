<?php

require_once('nuchoosesetup.php');
require_once('nucommon.php');
require_once('nuprocesslogins.php');
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
		if (nuLoginSetupGlobeadmin($_SESSION['nubuilder_session_data']['GLOBEADMIN_NAME'],'','')) nuRunLoginProcedure('nuStartup');
	}
	else {
		$request = nuCheckUserLoginRequest();
		$result = $request['result'];
		if ($result == "1" ) {
				if (strpos($_SESSION['nubuilder_session_data']['GLOBEADMIN_USERS'], $request['user_id'] ) !== false) {
					if (nuLoginSetupGlobeadmin($request['login_name'],$request['user_id'], $request['user_name'])) nuRunLoginProcedure('nuStartup');
				} else {
					if (nuLoginSetupNOTGlobeadmin()) nuRunLoginProcedure('nuStartup');
				}
		}
	}

	if ($result != "1") {
		// Failed login
		nuRunLoginProcedure('nuInvalidLogin');

		if ($result == "0") nuDie('Invalid login.');
		if ($result == "-1") nuDie('This account is disabled.');
	}

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
