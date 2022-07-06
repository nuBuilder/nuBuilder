<?php

	require_once(dirname(__FILE__). '/../nuconfig.php'); // nuconfig must be loaded before using nubuilder_session_dat
	require_once('nubuilder_session_data.php');

	if ( !session_id() ) {

		nuCheckGarbageCollector();
		session_start(['cookie_lifetime' => 0,'cookie_secure' => nuIsHTTPS(),'cookie_httponly' => true]);

	}

	if ( !isset($_SESSION['nubuilder_session_data']) ) {

		nuLoadNewSession();
	}

	require_once('nudatabase.php');

function nuIsHTTPS() {

	$isHttps =
		$_SERVER['HTTPS']
		?? $_SERVER['REQUEST_SCHEME']
		?? $_SERVER['HTTP_X_FORWARDED_PROTO']
		?? null
	;

	return
		$isHttps && (
			strcasecmp('on', $isHttps) == 0
			|| strcasecmp('https', $isHttps) == 0
		)
	;

}

function nuLoadNewSession() {

	global
		$nuConfigDBDriver, $nuConfigDBPort, $nuConfigDBHost, $nuConfigDBName, $nuConfigDBUser, $nuConfigDBPassword,
		$nuConfigDBGlobeadminUsername, $nuConfigDBGlobeadminPassword, $nuConfigDBGlobeadminUsers,
		$nuConfigDemoDBGlobeadminUsername, $nuConfigDemoDBGlobeadminPassword, $nuConfigGlobeadminHome, $nuConfigDemoSavingAllowedIds,
		$nuConfig2FAAdmin, $nuConfig2FAUser, $nuConfig2FAFormID, $nuConfig2FATokenValidityTime, $nuConfig2FAShowRememberMe,
		$nuConfigUserAdditional1Label, $nuConfigUserAdditional2Label, $nuConfigUserCodeLabel,
		$nuConfigIsDemo, $nuConfigDBOptions, $nuUseMd5PasswordHash;

	$sessionData = new nuBuilderSessionData();

	$sessionData->constructSession($nuConfigDBDriver,$nuConfigDBPort,$nuConfigDBHost,$nuConfigDBName,$nuConfigDBUser,$nuConfigDBPassword,$nuConfigDBGlobeadminUsername,$nuConfigDBGlobeadminPassword, $nuConfigDBGlobeadminUsers, $nuConfigDemoDBGlobeadminUsername, $nuConfigDemoDBGlobeadminPassword, $nuConfigGlobeadminHome, $nuConfigDemoSavingAllowedIds, $nuConfig2FAAdmin, $nuConfig2FAUser,$nuConfig2FAFormID, $nuConfig2FATokenValidityTime, $nuConfig2FAShowRememberMe, $nuConfigUserAdditional1Label, $nuConfigUserAdditional2Label, $nuConfigUserCodeLabel, $nuUseMd5PasswordHash, $nuConfigDBOptions, $nuConfigIsDemo);

	$_SESSION['nubuilder_session_data'] = $sessionData->getNubuilderSessionData();

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
