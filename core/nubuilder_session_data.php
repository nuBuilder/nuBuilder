<?php

class nubuilder_session_data {

	var $nubuilder	= array(
	'NB_PATH'					=> __DIR__,
	'GLOBEADMIN'				=> false,
	'GLOBEADMIN_NAME'			=> '',
	'GLOBEADMIN_PASS'			=> '',
	'GLOBEADMIN_DEMO_NAME'		=> '',
	'GLOBEADMIN_DEMO_PASS'		=> '',
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
	'NU_SITE_URL'				=> '',
	'IS_DEMO'					=> false,
	'2FA_ADMIN'					=> false,
	'2FA_USER'					=> false,
	'2FA_FORM_ID'				=> '',
	'2FA_TOKEN_VALIDITY_TIME'	=> '',
	'2FA_REMEMBER_ME'			=> false,
	'SESSION_ID'				=> null,
	'SESSION_TIMESTAMP'			=> null,
	'translation'				=> null);

	function __construct() {
	}

	function get_nubuilder_session_data() {

		return $this->nubuilder;
	}
	function construct_standalone($nuConfigDBDriver,$nuConfigDBPort,$nuConfigDBHost,$nuConfigDBName,$nuConfigDBUser,$nuConfigDBPassword,$nuConfigDBGlobeadminUsername,$nuConfigDBGlobeadminPassword, $nuConfigDemoDBGlobeadminUsername, $nuConfigDemoDBGlobeadminPassword, $nuConfigDemoSavingAllowedIds, $nuConfig2FAAdmin, $nuConfig2FAUser, $nuConfig2FAFormID, $nuConfig2FATokenValidityTime, $nuConfig2FAShowRememberMe, $nuConfigIsDemo = false) {

		$this->nubuilder['DB_DRIVER']				= $nuConfigDBDriver;
		$this->nubuilder['DB_PORT']					= $nuConfigDBPort;

		$this->nubuilder['DB_NAME']					= $nuConfigDBName;
		$this->nubuilder['DB_USER']					= $nuConfigDBUser;
		$this->nubuilder['DB_PASSWORD']				= $nuConfigDBPassword;
		$this->nubuilder['DB_HOST']					= $nuConfigDBHost;
		$this->nubuilder['DB_CHARSET']				= 'utf8';
		$this->nubuilder['GLOBEADMIN_NAME']			= $nuConfigDBGlobeadminUsername;
		$this->nubuilder['GLOBEADMIN_PASS']			= $nuConfigDBGlobeadminPassword;

		$this->nubuilder['GLOBEADMIN_DEMO_NAME']	= $nuConfigDemoDBGlobeadminUsername;
		$this->nubuilder['GLOBEADMIN_DEMO_PASS']	= $nuConfigDemoDBGlobeadminPassword;

		$this->nubuilder['IS_DEMO']					= $nuConfigIsDemo;
		$this->nubuilder['DEMO_SAVING_ALLOWED_IDS']	= $nuConfigDemoSavingAllowedIds;

		$this->nubuilder['2FA_ADMIN']				= $nuConfig2FAAdmin;
		$this->nubuilder['2FA_USER']				= $nuConfig2FAUser;

		$this->nubuilder['2FA_FORM_ID']				= $nuConfig2FAFormID == '' ? 'nuauthentication' : $nuConfig2FAFormID;
		$this->nubuilder['2FA_TOKEN_VALIDITY_TIME']	= $nuConfig2FATokenValidityTime == '' ? 168 : $nuConfig2FATokenValidityTime;
		$this->nubuilder['2FA_REMEMBER_ME']			= $nuConfig2FAShowRememberMe;		

	}
}

?>
