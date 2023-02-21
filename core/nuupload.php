<?php
	
require_once ('nucommon.php');
require_once ('nudatabase.php');

function nuUploadFile() {

	ini_set('display_errors', 1);
	ini_set('display_startup_errors', 1);
	error_reporting(E_ALL);
	http_response_code(400);

	header('Content-type: application/json');
	header('Content-Type: text/plain; charset=utf-8');

	// error_log(print_r($_POST,true));
	$proc = isset($_POST["procedure"]) ? $_POST["procedure"] : 'NUUPLOADFILE_TEMPLATE';
	$sessionId = isset($_POST["session_id"]) ? $_POST["session_id"] : '';

	$result = json_encode('{}');

	try {

		// Validate file data
		if (!isset($_FILES['file']['error']) || is_array($_FILES['file']['error'])) {
			throw new Exception('Invalid file data');
		}

		// Check file error
		switch ($_FILES['file']['error']) {
			case UPLOAD_ERR_OK:
			break;
			case UPLOAD_ERR_NO_FILE:
				throw new Exception('No file uploaded');
			case UPLOAD_ERR_INI_SIZE:
			case UPLOAD_ERR_FORM_SIZE:
				throw new Exception('Exceeded file size limit');
			default:
				throw new Exception('Unknown file error');
		}

		// Check if valid Session Id
		$t = nuRunQuery('SELECT * FROM `zzzzsys_session` where `zzzzsys_session_id` = ?', [$sessionId]);
		if (db_num_rows($t) == 0) {
			throw new Exception('Invalid Session Id');
		}

		$code = nuProcedure($proc);
		if ($code != '') {
			eval($code);
			return $result;
		}
		else {
			throw new Exception('Unknown Procedure Name');
		}

	}
	catch(\Throwable $th) {
		$result = nuSetUploadError($th->getMessage());
	}

}

function nuSetUploadError($message, $error = null) {

	if ($error == null) {
		$error = nuTranslate('Sorry, there was an error uploading your file.');
	}

	http_response_code(401);
	$data = ['error' => $error, 'message' => $message];
	return json_encode($data);

}

?>
