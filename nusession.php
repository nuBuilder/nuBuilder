<?php

require_once('nuchoosesetup.php');
require_once('nucommon.php');
require_once('nuprocesslogins.php');

if ( nuCheckIsLoginRequest() ) {

	if ( nuCheckWordpressGlobeadminLoginRequest() ) {

		// Check for Wordpress Globeadmin login
		nuLoginSetupGlobeadmin();

	} else if ( nuCheckWordpressUserLoginRequest() ) {

		// Check for Wordpress User login
		nuLoginSetupNOTGlobeadmin(false);

	} else if ( nuCheckStandaloneGlobeadminLoginRequest() ) {

		// Check for Standalone Globeadmin login
		nuLoginSetupGlobeadmin();

	} else if ( nuCheckStandaloneUserLoginRequest() ) {

		// Check for Standlone User login
		nuLoginSetupNOTGlobeadmin(true);

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

	nuDie('Your nuBuilder session has timed out.');

}
