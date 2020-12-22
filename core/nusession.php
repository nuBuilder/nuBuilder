<?php

require_once('nuchoosesetup.php');
require_once('nucommon.php');
require_once('nuprocesslogins.php');
require_once('nusecurity.php');

function nuStartup() {
	
	$p    = nuProcedure('nuStartup');
	$error = '';
	if($p != ''){		
		eval($p);
		if ($error != '') nuDie($error);
	}
	
}

if ( nuCheckIsLoginRequest() ) {

	if ( nuCheckStandaloneGlobeadminLoginRequest() ) {

		// Check for Standalone Globeadmin login
		if (nuLoginSetupGlobeadmin()) nuStartup();

	} else if ( nuCheckStandaloneUserLoginRequest() ) {

		// Check for Standlone User login
		if (nuLoginSetupNOTGlobeadmin(true)) nuStartup();		

	} else {

		// Failed login
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
