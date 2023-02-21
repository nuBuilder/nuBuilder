<?php

function nuRandomHexBytes(int $length = 64){
	return bin2hex(random_bytes(($length-($length%2))/2));
}

function nuGenerateToken($length=32){

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
	if ($range < 0) return $min; 			// not so random...
	$log = log($range, 2);
	$bytes = (int) ($log / 8) + 1; 			// length in bytes
	$bits = (int) $log + 1; 				// length in bits
	$filter = (int) (1 << $bits) - 1; 		// set all lower bits to 1
	do {
		$rnd = hexdec(bin2hex(openssl_random_pseudo_bytes($bytes)));
		$rnd = $rnd & $filter; 				// discard irrelevant bits
	} while ($rnd >= $range);
	return $min + $rnd;

}

function nuPasswordHash($pw) {
	return password_hash($pw, PASSWORD_DEFAULT);
}

function nuOutput2FATokenToConsole($code) {
	$js = "nuMessage(['<h2>' + nuTranslate('Info')+'</h2>Your 2FA Code: ' + nuTranslate('$code') + '<br><br><b>TEST MODE<b></br>']); ";
	nuJavaScriptCallback($js);
}

function nuGetLoginUserId($vars) {
	$loginDetails = $vars["checkLoginDetailsOBJ"];
	return $loginDetails-> sus_zzzzsys_access_id == '' ? '' : $loginDetails->zzzzsys_user_id;
}

function nuSet2FAToken($code){
	nuSetUserJSONData('2FA_TOKEN', $code);
	nuSet2FATokenSentTime();
}

function nuGet2FAVerifiedTime($u){
	return nuGetUserJSONData('2FA_VERIFIED_TIMESTAMP', $u);
}

function nuSet2FAVerifiedTime(){
	$date = new DateTime();
	nuSetUserJSONData('2FA_VERIFIED_TIMESTAMP', $date->getTimestamp());
}

function nuGet2FATokenSentTime($u){
	return nuGetUserJSONData('2FA_TOKEN_SENT_TIMESTAMP', $u);
}

function nuSet2FATokenSentTime(){
	$date = new DateTime();
	nuSetUserJSONData('2FA_TOKEN_SENT_TIMESTAMP', $date->getTimestamp());
}

function nuSet2FAVerified() {
	$_SESSION['nubuilder_session_data']['SESSION_2FA_STATUS'] = 'verified';
}


function nuShow2FAAuthenticationError($js = null) {

	if (is_null($js)) {
		$js = "nuMessage(['<h2>' + nuTranslate('Error')+'</h2>' + nuTranslate('Your Authentication token is invalid or has expired') ]); ";
	}

	nuJavaScriptCallback($js);

}

function nuAuthGetElapsedTime($timeStart) {

	$now = new DateTime();
	return $now->getTimestamp() - $timeStart;

};


function nuSetAuthenticated($token) {

	nuSet2FAVerified();
	nuSet2FAVerifiedTime();
	nuRedirectToForm($token);

};

function nuAuthCheck($vars, $validityPeriod) {

	$timeStamp = nuGet2FAVerifiedTime(nuGetLoginUserId($vars));
	$result = true;

	if ($timeStamp != '') {
		$now = new DateTime();
		if (($now->getTimestamp() - $timeStamp) > $validityPeriod) {
			$result = false;
		}
	}

	return $result;

};

function nuGet2FAToken($uid) {
	return nuGetUserJSONData('2FA_TOKEN',$uid);
}


function nuTokenMatches($token, $uid) {

	return nuGet2FAToken($uid) == $token;

};

function nuRedirectToForm($token) {

	$formId = $_SESSION['nubuilder_session_data']['SESSION_2FA_REDIRECT_FORM_ID'];

	$dtk = $_SESSION['nubuilder_session_data']['2FA_TOKEN_VALIDITY_TIME'];										// number of hours to retain a valid token as a cookie.
	$expts = (int)date_timestamp_get(date_create()) + ($dtk*60*60); 											// time stamp when the token expires
	$cname = md5($_SESSION['nubuilder_session_data']['DB_NAME'].nuObjKey(nuHash(),'USER_ID','')); 				// database name and user ID creates a unique name for the cookie
	$cvalue = $expts.'_'.md5($token);

	nu2FAStoreToken($cvalue);																					// store the cookie in the user record
	// save a cookie with the verified token and expiry time. This will be checked during subsequent logins
	$js = "
		 var d = new Date();
		 d.setTime(d.getTime() + ($dtk*60*60*1000));
		 var expires = 'expires='+ d.toUTCString();
		 document.cookie = '$cname = $cvalue;' + expires + ';samesite=Strict;path=/';
	";

	if ($formId != '') {
		$js .= "nuForm('$formId','-1','','',1);";
	} else {
		$js .= "nuMessage(['<h2>' + nuTranslate('Info')+'</h2>' + nuTranslate('No redirect Form ID defined (SESSION_2FA_REDIRECT_FORM_ID)') ]); ";
	}
	nuJavaScriptCallback($js);
}

function nu2FAGetStoredTokens($uid) { 		// retrieve the array of valid 2FA tokens for this user

	$st = nuGetUserJSONData("2FA_COOKIES",$uid);
	return (strlen($st) > 0 ? explode(";",$st) : [] );

}

function nu2FAStoreAllTokens($tokens) {

	$st = implode(';',$tokens);
	nuSetUserJSONData("2FA_COOKIES", $st);

}

function nu2FAStoreToken($newtoken) {

	$alltokens = nu2FAGetStoredTokens(nuObjKey(nuHash(),'USER_ID',''));
	$alltokens = nu2FARemoveOldTokens($alltokens);
	if (strlen($newtoken) > 10) {
		array_push($alltokens,$newtoken);
	}
	nu2FAStoreAllTokens($alltokens);

}

function nu2FARemoveOldTokens($arrtokens) {

	$currts = (int)date_timestamp_get(date_create());
	$newtokens = [];
	foreach ($arrtokens as $t) {
		$expdate = (int)explode('_',$t)[0];
			if ($expdate > $currts){
				array_push($newtokens,$t);
		}
	}
	return $newtokens;

}

function nu2FALocalTokenOK($uid) {

	$alltokens = nu2FAGetStoredTokens($uid);
	$cn = md5($_SESSION['nubuilder_session_data']['DB_NAME'].$uid);
	if (isset($_COOKIE[$cn])) {
		$token = $_COOKIE[$cn];		 														// get the cookie value for the stored token
		$tokenOK = (in_array($token, nu2FARemoveOldTokens($alltokens))	? true : false);	// now check to see if the token from the cookie is in the updated array
		return $tokenOK;
	} else {
		return false;
	}

}

?>
