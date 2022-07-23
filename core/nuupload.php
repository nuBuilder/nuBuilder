<?php

require_once('nucommon.php');
require_once('nudatabase.php');

function nuUploadFile()	 {
	
	ini_set('display_errors', 1);
	ini_set('display_startup_errors', 1);
	error_reporting(E_ALL);
	http_response_code(400);

	header('Content-type: application/json');
	header('Content-Type: text/plain; charset=utf-8');

	// error_log(print_r($_POST,true));

	$proc = isset($_POST["procedure"]) ? $_POST["procedure"] : 'NUUPLOADFILE_TEMPLATE';
	$sid = isset($_POST["session_id"]) ? $_POST["session_id"] : '';

	$error = nuTranslate('Sorry, there was an error uploading your file.');

	$t = nuRunQuery('SELECT * FROM `zzzzsys_session` where zzzzsys_session.zzzzsys_session_id = ?', array($sid));
	if (db_num_rows($t) == 0) {
		http_response_code(401);
		$data = ['error' => $error,
				'message' => 'Invalid Session Id'];
		$result = json_encode($data);
		return;
	}
		
	$code	= nuProcedure($proc);
	if($code != '') { 
		eval($code); 
		return $result;
	} else {
		http_response_code(401);
		$data = ['error' => $error,
				'message' => 'Unknown Procedure Name'];
		$result = json_encode($data);
	}

}

?>