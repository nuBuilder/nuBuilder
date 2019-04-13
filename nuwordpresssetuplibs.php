<?php

function nu_WP_RunQuery( $sql, $values = array() ) {

	// these constance should exist if we are in the wordpress eco-system
	$DBHost		= DB_HOST;
	$DBName		= DB_NAME;
	$DBUserID	= DB_USER;
	$DBPassWord	= DB_PASSWORD;		
	$DBCharset 	= DB_CHARSET;
	
	// result set	
	$rs = null;

	try {

		$db = new PDO("mysql:host=".$DBHost.";dbname=".$DBName.";charset=$DBCharset", $DBUserID, $DBPassWord, array(PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES utf8"));
		$db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
		$db->exec("USE $DBName");
		$rs = $db->prepare($sql);
		$rs->execute($values);

	} catch(Exception $e) {

		//
	}

        return $rs;
}

function nu_WP_nuID() {
        
	$i   = uniqid();
        $s   = md5($i);
    	while($i == uniqid()){}
    	return uniqid().$s[0].$s[1];
}

function nu_WP_db_fetch_object($o){

        if (is_object($o)) {
                return $o->fetch(PDO::FETCH_OBJ);
        } else {
                return false;
        }
}

function nu_WP_db_fetch_row($o){

        if (is_object($o)) {
                return $o->fetch(PDO::FETCH_NUM);
        } else {
                return false;
        }
}

function nu_WP_db_num_rows($o) {

        if(!is_object($o)){return 0;}
        return $o->rowCount();

}

// this function will only work inside nubuilder-forte.php as it depends on wordpress libs
// WPcoupled = wordpress coupled
function nu_construct_session_data_WPcoupled() {

        $auth_info                                      = wp_get_current_user();
        $nubuilder_session_data                         = new stdClass;
        $nubuilder_session_data->PLUGIN                 = true;
        $nubuilder_session_data->GLOBEADMIN             = false;
        if ( in_array('administrator',$auth_info->roles) ) {
                $nubuilder_session_data->GLOBEADMIN     = true;
        }
        $nubuilder_session_data->USER_LOGIN             = $auth_info->user_login;
        $nubuilder_session_data->USER_PASS              = $auth_info->user_pass;
        $nubuilder_session_data->USER_EMAIL             = $auth_info->user_email;
        $nubuilder_session_data->USER_DISPLAY_NAME      = $auth_info->display_name;
        $nubuilder_session_data->USER_ROLES             = $auth_info->roles;
        $nubuilder_session_data->DB_NAME                = DB_NAME;
        $nubuilder_session_data->DB_USER                = DB_USER;
        $nubuilder_session_data->DB_PASSWORD            = DB_PASSWORD;
        $nubuilder_session_data->DB_HOST                = DB_HOST;
        $nubuilder_session_data->DB_CHARSET             = DB_CHARSET;
        $nubuilder_session_data->NU_SITE_URL            = plugin_dir_url( __FILE__ );
        $nubuilder_session_data->WP_ADMIN_URL           = admin_url();
	$nubuilder_session_data->WP_ROLES		= nu_construct_roles_WPcoupled();
	$nubuilder_session_data->WP_SITE_URL            = site_url();
	$nubuilder_session_data->WP_BLOG_CHARSET	= get_option('blog_charset');

        $json                                           = json_encode($nubuilder_session_data);
        $encode                                         = base64_encode($json);

	$_SESSION['nubuilder_wordpress_session_data']	= $encode;
        return $encode;
}

function _derrive_id($key) {

	$key		= trim($key);		
	$nu_wp_role_id 	= 'wp'.$key;

	// make sure key is no longer than 25 chards
	if ( $nu_wp_role_id > 25 ) {
		$nu_wp_role_id = substr($nu_wp_role_id,0,25);
       	}

	return $nu_wp_role_id;
}

function _derrive_code($key){

	$key            	= trim($key);
	
	if ( strlen($key) < 4 ) {
		$nu_wp_role_code = strtoupper($key);
	} else {
		$nu_wp_role_code = strtoupper(substr($key, 0, 4));
        }
	
	return $nu_wp_role_code;
}

// this function will only work inside nubuilder-forte.php as it depends on wordpress libs
// WPcoupled = wordpress coupled
function nu_construct_roles_WPcoupled() {
	
	global $wp_roles;
        $roles 				= $wp_roles->get_names();
        $nu_roles 			= array();

        foreach ($roles as $key => $value) {

                $nu_wp_role_id          = _derrive_id($key);
		$nu_wp_role_code        = _derrive_code($key);		
                $nu_wp_role_desc        = trim($value);
                $this_array             = array($nu_wp_role_id,$nu_wp_role_code,$nu_wp_role_desc);
                $nu_roles[]             = $this_array;
        }

	return $nu_roles;
}

function nuWPImportNewDB() { 

	$t = nu_WP_RunQuery("SHOW TABLES");
        while($r = nu_WP_db_fetch_row($t)){
                if($r[0] == 'zzzzsys_object'){return;}
        }
        $file                                           = realpath(dirname(__FILE__))."/nubuilder4.sql";
        @$handle                                        = fopen($file, "r");
        $temp                                           = "";
        if($handle){
                while(($line = fgets($handle)) !== false){
                        if($line[0] != "-" AND $line[0] != "/"  AND $line[0] != "\n"){
                                $line                   = trim($line);
                                $temp                   .= $line;
                                if(substr($line, -1) == ";"){
                                	$temp   = rtrim($temp,';');
                                        $temp   = str_replace('ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER','', $temp);
                                       	nu_WP_RunQuery($temp);
                                        $temp   = "";
                                }
                        }
                }
        }
}

function nuWPSetNewHeaderAndButtonsDB() {

	$sql = "
	UPDATE zzzzsys_setup SET set_header = \"
	
	function nuHeaderTest() {
	    console.log('Functions placed here before a closing script tag are available anywhere in nuBuilder Forte');
	}
	
	</script>
	<style>    
	.nuActionButton {background-color:#0073aa;}
	.nuButton {background-color:#0073aa;}
	.nuSaveButtonEdited {background-color:red;}
    .nuUserHomeButton{
      color: white;
      background-color: #88cb51;
      display: inline;
      border-style: solid;
      font-size: 14px;
      height: 40px;
      padding: 0px 6px 0px 6px;
      text-shadow: 0 1px 2px rgba(0, 0, 0, 0.25);
      border-color: #87A96B;
      border-width: 0px 0px 1px 0px;
    }
    
	</style>
	<script>

	\"
	";
	
	nu_WP_RunQuery($sql);
}

function nuWPSetWPFlagDB() {

	$sql = "ALTER TABLE `zzzzsys_setup` ADD `set_wp` CHAR(1) NOT NULL DEFAULT '1' ";
	nu_WP_RunQuery($sql);
}

function nuWPSetDeniedFlagDB() {

	$sql = "UPDATE zzzzsys_setup SET set_denied = '1' ";
        nu_WP_RunQuery($sql);
}

// this function runs during loading index.php and requires $_SESSION['nubuilder_session_data'] to be loaded
// NOTE this function uses the normal nubuilder nuRunQuery instead of nu_WP_RunQuery because it is executed inside nubuilder's eco system
function nuCheckWPUser() {

	$zzzzsys_user_id	= nuID();	
	$key			= $_SESSION['nubuilder_session_data']['USER_ROLES'][0];
	$sus_zzzsys_access_id	=  _derrive_id($key);
	$sus_language		= '';	
	$sus_name		= $_SESSION['nubuilder_session_data']['USER_DISPLAY_NAME'];	
	$sus_email		= $_SESSION['nubuilder_session_data']['USER_EMAIL'];
	$sus_login_name		= $_SESSION['nubuilder_session_data']['USER_LOGIN'];
	$sus_login_password	= $_SESSION['nubuilder_session_data']['USER_PASS'];
	$select 		= "SELECT * FROM zzzzsys_user WHERE sus_login_name = ? ";
	$insert 		= "INSERT INTO zzzzsys_user (zzzzsys_user_id, sus_zzzzsys_access_id, sus_language, sus_name, sus_email, sus_login_name, sus_login_password)  VALUES (?,?,?,?,?,?,?) ";
	$update 		= "UPDATE zzzzsys_user SET sus_name = ?,  sus_email = ?, sus_login_password = ? WHERE sus_login_name = ? "; // notice we do not update the access level
	$select_values 		= array($sus_login_name);
	$insert_values 		= array($zzzzsys_user_id, $sus_zzzsys_access_id, $sus_language, $sus_name, $sus_email, $sus_login_name, $sus_login_password);
	$update_values 		= array($sus_name, $sus_email, $sus_login_password, $sus_login_name);
	$rs 			= nuRunQuery($select, $select_values);

	if ( db_num_rows($rs) > 0 ) {

		 nuRunQuery($update, $update_values);
	} else {

		 nuRunQuery($insert, $insert_values);
	}
}

// this function will only work inside nubuilder-forte.php as it depends on wordpress libs
// WPcoupled = wordpress coupled
function nu_construct_access_levels_WPcoupled() {

	$select = "SELECT * FROM zzzzsys_access WHERE zzzzsys_access_id = ? ";
	$insert	= "INSERT INTO zzzzsys_access (zzzzsys_access_id, sal_code, sal_description, sal_zzzzsys_form_id) VALUES (?, ?, ?, 'nuuserhome')";
	$roles  = nu_construct_roles_WPcoupled();

	for( $x=0; $x < count($roles); $x++ ) {
		
		$zzzzsys_access_id	= $roles[$x][0];
		$sal_code		= $roles[$x][1];
		$sal_description	= $roles[$x][2];
		$select_values		= array($zzzzsys_access_id);
		$insert_values		= array($zzzzsys_access_id, $sal_code, $sal_description);
		$rs			= nu_WP_RunQuery($select, $select_values);

		if ( nu_WP_db_num_rows($rs) == 0 ) {
			// this will insert access level only if they don't already exits
			nu_WP_RunQuery($insert, $insert_values);
		}
	}
}

?>
