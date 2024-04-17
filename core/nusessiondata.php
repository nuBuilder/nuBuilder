<?php

require_once(dirname(__FILE__). '/../nuconfig.php'); // nuconfig must be loaded before using nubuilder_session_dat
require_once('nusetuplibs.php');
require_once('nudatabase.php');
//require_once('nucommon.php');

$config = nuConfigScript();
eval($config['code']);

if ( !session_id() ) {

	nuCheckGarbageCollector();
	session_start(['cookie_lifetime' => 0,'cookie_secure' => nuIsHTTPS2(),'cookie_httponly' => true]);

}

if ( !isset($_SESSION['nubuilder_session_data']) ) {

	nuLoadNewSession();
}

function nuLoadNewSession() {

	global
		$nuConfigDBDriver, $nuConfigDBPort, $nuConfigDBHost, $nuConfigDBName, $nuConfigDBUser, $nuConfigDBPassword,
		$nuConfigDBGlobeadminUsername, $nuConfigDBGlobeadminPassword, $nuConfigDBGlobeadminUsers,
		$nuConfigDemoDBGlobeadminUsername, $nuConfigDemoDBGlobeadminPassword, $nuConfigGlobeadminHome, $nuConfigDemoSavingAllowedIds,
		$nuConfig2FAAdmin, $nuConfig2FAUser, $nuConfig2FAFormID, $nuConfig2FATokenValidityTime, $nuConfig2FAShowRememberMe,
		$nuConfigUserAdditional1Label, $nuConfigUserAdditional2Label, $nuConfigUserCodeLabel,
		$nuConfigIsDemo, $nuConfigDBOptions, $nuUseMd5PasswordHash;

	$nuConfigDBPort = $nuConfigDBPort ?? '3306';
	$sessionData = new nuBuilderSessionData();

	$sessionData->constructSession($nuConfigDBDriver,$nuConfigDBPort,$nuConfigDBHost,$nuConfigDBName,$nuConfigDBUser,$nuConfigDBPassword,$nuConfigDBGlobeadminUsername,$nuConfigDBGlobeadminPassword, $nuConfigDBGlobeadminUsers, $nuConfigDemoDBGlobeadminUsername, $nuConfigDemoDBGlobeadminPassword, $nuConfigGlobeadminHome, $nuConfigDemoSavingAllowedIds, $nuConfig2FAAdmin, $nuConfig2FAUser,$nuConfig2FAFormID, $nuConfig2FATokenValidityTime, $nuConfig2FAShowRememberMe, $nuConfigUserAdditional1Label, $nuConfigUserAdditional2Label, $nuConfigUserCodeLabel, $nuUseMd5PasswordHash, $nuConfigDBOptions, $nuConfigIsDemo);

	$_SESSION['nubuilder_session_data'] = $sessionData->getNubuilderSessionData();

}

function nuIsHTTPS2() {

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

function nuCheckGarbageCollector() {

	global $nuConfigTimeOut;

	if ( isset($nuConfigTimeOut) ) {
		if ( is_int($nuConfigTimeOut) ) {
			$gcLifetime     = 60 * $nuConfigTimeOut;
			ini_set("session.gc_maxlifetime", $gcLifetime);
		}
	}
}

class nuBuilderSessionData {

	public $nubuilder	= [
	'NB_PATH'					=> __DIR__,
	'GLOBEADMIN'				=> false,
	'GLOBEADMIN_NAME'			=> '',
	'GLOBEADMIN_PASS'			=> '',
	'GLOBEADMIN_DEMO_NAME'		=> '',
	'GLOBEADMIN_DEMO_PASS'		=> '',
	'GLOBEADMIN_HOME'			=> 'nuhomecompact',
	'DEMO_SAVING_ALLOWED_IDS'	=> '',
	'USER_LOGIN'				=> '',
	'USER_NAME'					=> '',
	'USER_PASS'					=> '',
	'USER_EMAIL'				=> '',
	'USER_DISPLAY_NAME'			=> '',
	'USER_ROLES'				=> '',
	'DB_DRIVER'					=> '',
	'DB_PORT'					=> '',
	'DB_NAME'					=> '',
	'DB_USER'					=> '',
	'DB_PASSWORD'				=> '',
	'DB_HOST'					=> '',
	'DB_CHARSET'				=> '',
	'DB_OPTIONS'				=> [],
	'NU_SITE_URL'				=> '',
	'IS_DEMO'					=> false,
	'2FA_ADMIN'					=> false,
	'2FA_USER'					=> false,
	'2FA_FORM_ID'				=> '',
	'CHANGE_PW_FORM_ID'			=> '',	
	'2FA_TOKEN_VALIDITY_TIME'	=> '',
	'2FA_REMEMBER_ME'			=> false,
	'USE_MD5_PASSWORD_HASH'		=> false,
	'SESSION_ID'				=> null,
	'SESSION_TIMESTAMP'			=> null,
	'translation'				=> null,
	'USER_ADDITIONAL1_LABEL'	=> null,
	'USER_ADDITIONAL2_LABEL'	=> null,
	'USER_CODE_LABEL'			=> null
	];

	public function getNubuilderSessionData() {

		return $this->nubuilder;
	}

	public function constructSession(
		$nuConfigDBDriver,$nuConfigDBPort,$nuConfigDBHost,$nuConfigDBName,$nuConfigDBUser,
		$nuConfigDBPassword,$nuConfigDBGlobeadminUsername,$nuConfigDBGlobeadminPassword,
		$nuConfigDBGlobeadminUsers, $nuConfigDemoDBGlobeadminUsername, $nuConfigDemoDBGlobeadminPassword, $nuConfigGlobeadminHome, $nuConfigDemoSavingAllowedIds,
		$nuConfig2FAAdmin, $nuConfig2FAUser, $nuConfig2FAFormID, $nuConfig2FATokenValidityTime, $nuConfig2FAShowRememberMe,
		$nuConfigUserAdditional1Label, $nuConfigUserAdditional2Label, $nuConfigUserCodeLabel,
		$nuUseMd5PasswordHash, $nuConfigDBOptions, $nuConfigIsDemo = false) {

		$this->nubuilder['DB_DRIVER']				= $nuConfigDBDriver;
		$this->nubuilder['DB_PORT']					= $nuConfigDBPort;

		$this->nubuilder['DB_NAME']					= $nuConfigDBName;
		$this->nubuilder['DB_USER']					= $nuConfigDBUser;
		$this->nubuilder['DB_PASSWORD']				= $nuConfigDBPassword;
		$this->nubuilder['DB_HOST']					= $nuConfigDBHost;
		$this->nubuilder['DB_CHARSET']				= 'utf8';
		$this->nubuilder['DB_OPTIONS']				= $nuConfigDBOptions;

		$this->nubuilder['GLOBEADMIN_NAME']			= $nuConfigDBGlobeadminUsername;
		$this->nubuilder['GLOBEADMIN_PASS']			= $nuConfigDBGlobeadminPassword;
		$this->nubuilder['GLOBEADMIN_USERS']		= $nuConfigDBGlobeadminUsers;
		$this->nubuilder['GLOBEADMIN_HOME']			= $nuConfigGlobeadminHome;

		$this->nubuilder['GLOBEADMIN_DEMO_NAME']	= $nuConfigDemoDBGlobeadminUsername;
		$this->nubuilder['GLOBEADMIN_DEMO_PASS']	= $nuConfigDemoDBGlobeadminPassword;

		$this->nubuilder['IS_DEMO']					= $nuConfigIsDemo;
		$this->nubuilder['DEMO_SAVING_ALLOWED_IDS']	= $nuConfigDemoSavingAllowedIds;

		$this->nubuilder['2FA_ADMIN']				= $nuConfig2FAAdmin;
		$this->nubuilder['2FA_USER']				= $nuConfig2FAUser;

		$this->nubuilder['2FA_FORM_ID']				= $nuConfig2FAFormID == '' ? 'nuauthentication' : $nuConfig2FAFormID;
		$this->nubuilder['2FA_TOKEN_VALIDITY_TIME']	= $nuConfig2FATokenValidityTime == '' ? 168 : $nuConfig2FATokenValidityTime;
		$this->nubuilder['2FA_REMEMBER_ME']			= $nuConfig2FAShowRememberMe;

		$this->nubuilder['CHANGE_PW_FORM_ID']		= 'nupassword';
		$this->nubuilder['USE_MD5_PASSWORD_HASH']	= $nuUseMd5PasswordHash;

		$this->nubuilder['USER_ADDITIONAL1_LABEL']	= $nuConfigUserAdditional1Label;
		$this->nubuilder['USER_ADDITIONAL2_LABEL']	= $nuConfigUserAdditional2Label;
		$this->nubuilder['USER_CODE_LABEL']			= $nuConfigUserCodeLabel;

	}
}
