<?php

require_once('nudatabase.php');

if(!array_key_exists('p',$_REQUEST)) {
	header("Content-Type: text/html");
	header("HTTP/1.0 400 Bad Request");
	die('No procedure code is provided.');
}

$getPHPIDQRY = nuRunQuery("
	SELECT zzzzsys_php_id FROM zzzzsys_php
	WHERE sph_code = ?
", array($_REQUEST['p']));
if(db_num_rows($getPHPIDQRY) != 1){
	header("Content-Type: text/html");
	header("HTTP/1.0 400 Bad Request");
	die('Could not find procedure with code given.');
}
$getPHPIDOBJ = db_fetch_object($getPHPIDQRY);
$PHPID = $getPHPIDOBJ->zzzzsys_php_id;
if($PHPID == ''){
	header("Content-Type: text/html");
	header("HTTP/1.0 400 Bad Request");
	die('Invalid procedure was found.');
}

require_once('nusession.php');
if(!array_key_exists('TEMPORARY_SESSION', $_SESSION)){
	$getAccessQRY = nuRunQuery("
		SELECT sss_access FROM zzzzsys_session WHERE zzzzsys_session_id = ?
	", array($_SESSION['nubuilder_session_data']['SESSION_ID']));
	if (db_num_rows($getAccessQRY) != 1) {
		header("Content-Type: text/html");
		header("HTTP/1.0 400 Bad Request");
		die('Could not find session data.');
	}
	$getAccessOBJ = db_fetch_object($getAccessQRY);
	$accessArray = json_decode($getAccessOBJ->sss_access, true);
	if ($accessArray['session']['global_access'] != 1) {
		$hasAccess = false;
		for ($i = 0; $i < count($accessArray['procedures']); $i++) {
			if ($accessArray['procedures'][$i][0] == $PHPID)
				$hasAccess = true;
		}
		if (!$hasAccess) {
			header("Content-Type: text/html");
			header("HTTP/1.0 403 Forbidden");
			die('You do not have access to this procedure.');
		}
	}
}

//require_once('nuevalphpclass.php');

//$procedure = new nuEvalPHPClass($PHPID);

require_once('nucommon.php');
nuEval($PHPID);




