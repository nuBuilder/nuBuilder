<?php
	require_once('nuconfig.php');  // nuconfig must be loaded before using nubuilder_session_dat
	require_once('nubuilder_session_data.php');
	
	if ( !session_id() ) {

		nuCheckGarbageCollector();
		session_start();
	}

	if ( !isset($_SESSION['nubuilder_session_data']) ) {
	
		nuLoadNewSession();
	}

	// nudatabase will not work without $_SESSION['nubuilder_session_data'] loaded
	require_once('nudatabase.php');

function nuLoadNewSession() {

	global $nuConfigDBHost, $nuConfigDBName, $nuConfigDBUser, $nuConfigDBPassword, $nuConfigDBGlobeadminUsername, $nuConfigDBGlobeadminPassword, $nuConfigIsDemo;

	$nubuilder_session_data = new nubuilder_session_data();

    $nubuilder_session_data->construct_standalone($nuConfigDBHost,$nuConfigDBName,$nuConfigDBUser,$nuConfigDBPassword,$nuConfigDBGlobeadminUsername,$nuConfigDBGlobeadminPassword,$nuConfigIsDemo);
	       
	$_SESSION['nubuilder_session_data'] = $nubuilder_session_data->get_nubuilder_session_data();

}

function nuCheckGarbageCollector() {

	global $nuConfigTimeOut;
	
	if ( isset($nuConfigTimeOut) ) {
		if ( is_int($nuConfigTimeOut) ) {
                	$gcLifetime     = 60 * $nuConfigTimeOut;
                       	ini_set("session.gc_maxlifetime", $gcLifetime);
    		}
	}
}


?>
