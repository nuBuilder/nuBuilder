<?php

class nubuilder_session_data {

	var $nubuilder		= array(
	'PLUGIN'		=> false,
	'GLOBEADMIN'         	=> false,
	'GLOBEADMIN_NAME'	=> '',
	'GLOBEADMIN_PASS'    	=> '',
	'USER_LOGIN'         	=> '',
	'USER_PASS'          	=> '',
	'USER_EMAIL'         	=> '',
	'USER_DISPLAY_NAME' 	=> '',
	'USER_ROLES'         	=> '',
	'DB_NAME'            	=> '',
	'DB_USER'            	=> '',
	'DB_PASSWORD'        	=> '',
	'DB_HOST'            	=> '',
	'DB_CHARSET'         	=> '',
	'NU_SITE_URL'        	=> '',
	'WP_ADMIN_URL'       	=> '',
	'IS_DEMO'		=> false,
	'WP_ROLES'		=> '',
	'WP_SITE_URL'		=> '',
	'JQ_PATH'		=> '',
	'WP_BLOG_CHARSET'	=> 'UTF-8',
	'SESSION_ID'		=> null,
	'SESSION_TIMESTAMP'	=> null,
	'IsDemo'		=> null,
	'translation'		=> null);

	function __construct() {
        }

	function get_nubuilder_session_data() {
		
		return $this->nubuilder;
	}

        function construct_wordpress($wpdata) {
		
		$this->nubuilder['PLUGIN']           	= true;
                $this->nubuilder['DB_NAME']          	= $wpdata->DB_NAME;
                $this->nubuilder['DB_USER']          	= $wpdata->DB_USER;
                $this->nubuilder['DB_PASSWORD']      	= $wpdata->DB_PASSWORD;
                $this->nubuilder['DB_HOST']          	= $wpdata->DB_HOST;
                $this->nubuilder['DB_CHARSET']       	= $wpdata->DB_CHARSET;
		if ( $wpdata->GLOBEADMIN === true ) {
                	$this->nubuilder['GLOBEADMIN_NAME']  = $wpdata->USER_LOGIN;
                	$this->nubuilder['GLOBEADMIN_PASS']  = $wpdata->USER_PASS;
			$this->nubuilder['GLOBEADMIN']	= true;
		}
		$this->nubuilder['USER_LOGIN']		= $wpdata->USER_LOGIN;
		$this->nubuilder['USER_PASS']		= $wpdata->USER_PASS;
		$this->nubuilder['USER_EMAIL']		= $wpdata->USER_EMAIL;
		$this->nubuilder['USER_DISPLAY_NAME'] 	= $wpdata->USER_DISPLAY_NAME;
		$this->nubuilder['USER_ROLES']		= $wpdata->USER_ROLES;
		$this->nubuilder['NU_SITE_URL']		= $wpdata->NU_SITE_URL;
		$this->nubuilder['WP_ADMIN_URL']	= $wpdata->WP_ADMIN_URL;
		$this->nubuilder['IS_DEMO']		= false;
		$this->nubuilder['WP_ROLES']		= $wpdata->WP_ROLES;
		$this->nubuilder['WP_SITE_URL']       	= $wpdata->WP_SITE_URL;
		$this->nubuilder['JQ_PATH']		= '../../../wp-includes/js/jquery/jquery.js';
		$this->nubuilder['WP_BLOG_CHARSET']	= $wpdata->WP_BLOG_CHARSET;
        }

        function construct_standalone($nuConfigDBHost, $nuConfigDBName, $nuConfigDBUser, $nuConfigDBPassword, $nuConfigDBGlobeadminUsername, $nuConfigDBGlobeadminPassword, $nuConfigIsDemo = false) {

		$this->nubuilder['PLUGIN']		= false;
		$this->nubuilder['DB_NAME']		= $nuConfigDBName;
		$this->nubuilder['DB_USER']		= $nuConfigDBUser;
		$this->nubuilder['DB_PASSWORD']		= $nuConfigDBPassword;
		$this->nubuilder['DB_HOST']		= $nuConfigDBHost;
		$this->nubuilder['DB_CHARSET']		= 'utf8';
		$this->nubuilder['GLOBEADMIN_NAME']	= $nuConfigDBGlobeadminUsername;
		$this->nubuilder['GLOBEADMIN_PASS']	= $nuConfigDBGlobeadminPassword;
		$this->nubuilder['IS_DEMO']         	= $nuConfigIsDemo;
		$this->nubuilder['JQ_PATH']          	= 'jquery/jquery.js';
        }
}

?>
