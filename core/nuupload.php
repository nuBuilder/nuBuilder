<?php

require_once('nucommon.php');

function nuUploadFile()	 {
	
	ini_set('display_errors', 1);
	ini_set('display_startup_errors', 1);
	error_reporting(E_ALL);
	http_response_code(400);

	header('Content-type: application/json');
	header('Content-Type: text/plain; charset=utf-8');

	// error_log(print_r($_POST,true));

	$proc = isset($_POST["procedure"]) ? $_POST["procedure"] : 'NUUPLOADFILE_TEMPLATE';
	$code	= nuProcedure($proc);
	if($code != '') { 
		eval($code); 
		return $result;
	} else {
		http_response_code(401);
		$data = ['error' => 'Sorry, there was an error uploading your file.',
				'message' => 'Unknown Procedure Name'];
		$result = json_encode($data);
		
	}

}

?>