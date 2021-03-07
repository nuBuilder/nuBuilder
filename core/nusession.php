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

	if ( nuCheckGlobeadminLoginRequest() ) {

		// Check for Globeadmin login
		if (nuLoginSetupGlobeadmin()) nuRunLoginProcedure('nuStartup');

	} else if ( nuCheckUserLoginRequest() ) {

		// Check for User login
		if (nuLoginSetupNOTGlobeadmin()) nuRunLoginProcedure('nuStartup');		

	} else {

		// Failed login		
		nuRunLoginProcedure('nuInvalidLogin');
		nuDie('Invalid login.');
	}

} else {

	// die if $_SESSION['nubuilder_session_data']['SESSION_ID'] AND $_SESSION['nubuilder_session_data'] does not exists
	nuCheckExistingSession();
} 


if ( $_SESSION['nubuilder_session_data']['SESSION_ID'] == 'tempanonreport' ) {

	// only let the user have 1 temporary report run
	nuTempAnonReport();

} else if ( isset($_SESSION['nubuilder_session_data']['SESSION_TIMESTAMP']) ) {

	nuUpdateExistingSession();

} else {

	nuDie('Your session has timed out.');

}
