<?php

class nubuilder_session_data {

	var $nubuilder	= array(
	'NB_PATH'				=> __DIR__,
	'GLOBEADMIN'			=> false,
	'GLOBEADMIN_NAME'		=> '',
	'GLOBEADMIN_PASS'		=> '',
	'GLOBEADMIN_DEMO_NAME'	=> '',
	'GLOBEADMIN_DEMO_PASS'	=> '',
	'USER_LOGIN'			=> '',
	'USER_PASS'				=> '',
	'USER_EMAIL'			=> '',
	'USER_DISPLAY_NAME'		=> '',
	'USER_ROLES'			=> '',
	'DB_NAME'				=> '',
	'DB_USER'				=> '',
	'DB_PASSWORD'			=> '',
	'DB_HOST'				=> '',
	'DB_CHARSET'			=> '',
	'NU_SITE_URL'			=> '',
	'IS_DEMO'				=> false,
	'SESSION_ID'			=> null,
	'SESSION_TIMESTAMP'		=> null,
	'IsDemo'				=> false,
	'translation'			=> null);

	function __construct() {
	}

	function get_nubuilder_session_data() {

		return $this->nubuilder;
	}
	function construct_standalone($nuConfigDBHost, $nuConfigDBName, $nuConfigDBUser, $nuConfigDBPassword, $nuConfigDBGlobeadminUsername, $nuConfigDBGlobeadminPassword, $nuConfigDemoDBGlobeadminUsername, $nuConfigDemoDBGlobeadminPassword, $nuConfigDemoSavingAllowedIds, $nuConfigIsDemo = false) {

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
	}
}

?>
