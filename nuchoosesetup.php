<?php
	require_once('nuconfig.php');  // nuconfig must be loaded before using nubuilder_session_dat
	require_once('nubuilder_session_data.php');
	require_once('nusanitize.php');
	
	if ( !session_id() ) {

		nuCheckGarbageCollector();
		session_start();
	}

	if ( !isset($_SESSION['nubuilder_session_data']) ) {
	
		nuLoadNewSession();
	}

	//Sanitize All Input
        nu_sanitize();

	// nudatabase will not work without $_SESSION['nubuilder_session_data'] loaded
	require_once('nudatabase.php');

function nuLoadNewSession() {

	global $nuConfigDBHost, $nuConfigDBName, $nuConfigDBUser, $nuConfigDBPassword, $nuConfigDBGlobeadminUsername, $nuConfigDBGlobeadminPassword, $nuConfigIsDemo;

	$nubuilder_session_data = new nubuilder_session_data();

	if ( isset($_SESSION['nubuilder_wordpress_session_data']) ) {

		$decode = base64_decode($_SESSION['nubuilder_wordpress_session_data']);
                $wpdata = json_decode($decode);
               	$nubuilder_session_data->construct_wordpress($wpdata);
		unset($_SESSION['nubuilder_wordpress_session_data']);

	} else {
       		nuDieIfWeAreInsideWordpress();
             	$nubuilder_session_data->construct_standalone($nuConfigDBHost,$nuConfigDBName,$nuConfigDBUser,$nuConfigDBPassword,$nuConfigDBGlobeadminUsername,$nuConfigDBGlobeadminPassword,$nuConfigIsDemo);
	}
       
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

function nuDieIfWeAreInsideWordpress() {

        // at various points there is no other reliable way to check if nuBuilder is installed in the wordpress eco system
	// other than checking for the file path
	// this extra check is to prevent nubuilder working from the outside of wordpress if it is inside wordpress folder structure
        $needle         = '/wp-content/plugins/';
        $haystack       = $_SERVER['PHP_SELF'];

        if ( strpos($haystack, $needle) !== false ) {
		echo "It appears that you have placed nuBuilder inside of Wordpress as a plugin.<br>";
		echo "To login to nuBuilder, you need to login through your Wordress admin.<br>";
		die();
        }
}

?>
