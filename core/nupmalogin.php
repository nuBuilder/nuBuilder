<?php
	require_once('nuchoosesetup.php');

	$session_id		= $_REQUEST['sessid'];
	$values			= array($session_id);
	$sql			= "SELECT * FROM zzzzsys_session WHERE zzzzsys_session_id = ?";
	$obj			= nuRunQuery($sql, $values);
	$result		= db_num_rows($obj);
	
	if($_SESSION['nubuilder_session_data']['IsDemo']){		
		echo('Not available in the Demo');
		$page   = pmaBad();
		return;	
	}
		
	if ( $result == 1 ) {

		$recordObj		= db_fetch_object($obj);
		$logon_info		= json_decode($recordObj->sss_access);
		$_user			= $logon_info->session->zzzzsys_user_id;
		$_extra_check	= $logon_info->session->global_access;

		if ( $_user == $_SESSION['nubuilder_session_data']['GLOBEADMIN_NAME'] AND $_extra_check == '1' ) {
			$page	= pmaGood();		
		} else {
			$page	= pmaBad();
		}
		
	} else {
			$page   = pmaBad();
	}

	header("Location: $page");

function pmaGood() {

	$time = time();
	$page = "libs/nudb/db_structure.php?server=1&db=".$_SESSION['nubuilder_session_data']['DB_NAME']."&$time=$time";
	setcookie("nupmalogin",			"good");
	setcookie("nuConfigDBHost",		$_SESSION['nubuilder_session_data']['DB_HOST']);
	setcookie("nuConfigDBUser",		$_SESSION['nubuilder_session_data']['DB_USER']);
	setcookie("nuConfigDBPassword",	$_SESSION['nubuilder_session_data']['DB_PASSWORD']);

	if ( $_SESSION['nubuilder_session_data']['DB_PASSWORD'] == '' ) {
		setcookie("nuConfigDBPasswordBlank", 'BLANK');
	}
	return $page;
}

function pmaBad() {

	$time = time();
	$page							= "nupmalogout.php?$time=$time";
	setcookie("nupmalogin",			"bad");
	setcookie("nuConfigDBHost",		null);
	setcookie("nuConfigDBUser",		null);
	setcookie("nuConfigDBPassword",	null);
	return $page;
}	

?>
