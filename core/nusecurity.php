<?php

function nuGenerateCode($length=32){
	
	$code = "";
	$codeAlphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
	$codeAlphabet.= "abcdefghijklmnopqrstuvwxyz";
	$codeAlphabet.= "0123456789";
	for($i=0;$i<$length;$i++){
		$code .= $codeAlphabet[nuCryptoRandSecure(0,strlen($codeAlphabet))];
	}
	return $code;
}
 
function nuCryptoRandSecure($min, $max) {
	
	$range = $max - $min;
	if ($range < 0) return $min; // not so random...
	$log = log($range, 2);
	$bytes = (int) ($log / 8) + 1; // length in bytes
	$bits = (int) $log + 1; // length in bits
	$filter = (int) (1 << $bits) - 1; // set all lower bits to 1
	do {
		$rnd = hexdec(bin2hex(openssl_random_pseudo_bytes($bytes)));
		$rnd = $rnd & $filter; // discard irrelevant bits
	} while ($rnd >= $range);
	return $min + $rnd;
	
}

function nuOutputCodeToConsole($code) {

	$js = "nuMessage(['<h2>' + nuTranslate('Info')+'</h2>Your 2FA Code: ' + nuTranslate('$code') + '<br><br><b>TEST MODE<b></br>']); ";
	nuAddJavascript($js);
	
}

function nuSet2FACode($code){
	nuSetJSONData('2FA_CODE', $code);
	
	$date = new DateTime();
	nuSetJSONData('2FA_CODE_DATETIME', $date->getTimestamp());
}

function nuGet2FACode() {
	return nuGetJSONData('2FA_CODE');
}

function nuSetVerified() {
	$_SESSION['nubuilder_session_data']['SESSION_2FA_STATUS'] = 'verified';
}

function nuRedirectToForm() {
	
	$formId = $_SESSION['nubuilder_session_data']['SESSION_2FA_REDIRECT_FORM_ID'];
	
	if ($formId != '') {
		$js = "nuForm('$formId','-1','','',1);";
	} else {
		$js = "nuMessage(['<h2>' + nuTranslate('Info')+'</h2>' + nuTranslate('No redirect Form ID defined (SESSION_2FA_REDIRECT_FORM_ID)') ]); ";
	}
	
	nuJavascriptCallback($js);
	
}

function nuShowAuthenticationError($js = null) {
	
	if (is_null($js)) {
		$js = "nuMessage(['<h2>' + nuTranslate('Error')+'</h2>' + nuTranslate('Code incorrect') ]); ";
	}
	
	nuJavascriptCallback($js);
}


?>
