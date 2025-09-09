<?php

function nuRandomHexBytes(int $length = 64) {
	return bin2hex(random_bytes(($length - ($length % 2)) / 2));
}

function nuGenerateToken($length = 32) {

	$code = "";
	$codeAlphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
	$codeAlphabet .= "abcdefghijklmnopqrstuvwxyz";
	$codeAlphabet .= "0123456789";
	for ($i = 0; $i < $length; $i++) {
		$code .= $codeAlphabet[nuCryptoRandSecure(0, strlen($codeAlphabet))];
	}
	return $code;
}

function nuCryptoRandSecure($min, $max) {

	$range = $max - $min;
	if ($range < 0)
		return $min; 			// not so random...
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
	return $loginDetails->sus_zzzzsys_access_id == '' ? '' : $loginDetails->zzzzsys_user_id;
}

function nuSet2FAToken($code) {
	nuSetUserJSONData('2FA_TOKEN', $code);
	nuSet2FATokenSentTime();
}

function nuGet2FAVerifiedTime($u) {
	return nuGetUserJSONData('2FA_VERIFIED_TIMESTAMP', $u);
}

function nuSet2FAVerifiedTime() {
	$date = new DateTime();
	nuSetUserJSONData('2FA_VERIFIED_TIMESTAMP', $date->getTimestamp());
}

function nuGet2FATokenSentTime($u) {
	return nuGetUserJSONData('2FA_TOKEN_SENT_TIMESTAMP', $u);
}

function nuSet2FATokenSentTime() {
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

}

function nuSetAuthenticated($token) {

	nuSet2FAVerified();
	nuSet2FAVerifiedTime();
	nuRedirectToForm($token);

}
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

}

function nuGet2FAToken($uid) {
	return nuGetUserJSONData('2FA_TOKEN', $uid);
}

function nuTokenMatches($token, $uid) {

	return nuGet2FAToken($uid) == $token;

}

function nuRedirectToForm($token) {

	$formId = $_SESSION['nubuilder_session_data']['SESSION_2FA_REDIRECT_FORM_ID'];

	$dtk = $_SESSION['nubuilder_session_data']['2FA_TOKEN_VALIDITY_TIME'];										// number of hours to retain a valid token as a cookie.
	$expts = (int) date_timestamp_get(date_create()) + ($dtk * 60 * 60); 											// time stamp when the token expires
	$cname = md5($_SESSION['nubuilder_session_data']['DB_NAME'] . nuObjKey(nuHash(), 'USER_ID', '')); 				// database name and user ID creates a unique name for the cookie
	$cvalue = $expts . '_' . md5($token);

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

	$st = nuGetUserJSONData("2FA_COOKIES", $uid);
	return (strlen($st) > 0 ? explode(";", $st) : []);

}

function nu2FAStoreAllTokens($tokens) {

	$st = implode(';', $tokens);
	nuSetUserJSONData("2FA_COOKIES", $st);

}

function nu2FAStoreToken($newtoken) {

	$alltokens = nu2FAGetStoredTokens(nuObjKey(nuHash(), 'USER_ID', ''));
	$alltokens = nu2FARemoveOldTokens($alltokens);
	if (strlen($newtoken) > 10) {
		array_push($alltokens, $newtoken);
	}
	nu2FAStoreAllTokens($alltokens);

}

function nu2FARemoveOldTokens($arrtokens) {

	$currts = (int) date_timestamp_get(date_create());
	$newtokens = [];
	foreach ($arrtokens as $t) {
		$expdate = (int) explode('_', $t)[0];
		if ($expdate > $currts) {
			array_push($newtokens, $t);
		}
	}
	return $newtokens;

}
function nu2FALocalTokenOK($uid) {

	$alltokens = nu2FAGetStoredTokens($uid);
	$cn = md5($_SESSION['nubuilder_session_data']['DB_NAME'] . $uid);
	if (isset($_COOKIE[$cn])) {
		$token = $_COOKIE[$cn];		 														// get the cookie value for the stored token
		$tokenOK = (in_array($token, nu2FARemoveOldTokens($alltokens)) ? true : false);	// now check to see if the token from the cookie is in the updated array
		return $tokenOK;
	} else {
		return false;
	}

}

function nu2FAStatusPending($globalAccess, $sessionData, $callType, $recordId, $formId) {
	if ((($globalAccess && nuObjKey($sessionData, '2FA_ADMIN')) || (!$globalAccess && nuObjKey($sessionData, '2FA_USER'))) && nuObjKey($sessionData, 'SESSION_2FA_STATUS') == 'PENDING') {
		return !(($callType === 'runhiddenphp' && nuArrayContains($recordId, ['nu_authentication_2fa', 'nu_authentication_2fa_template', 'nu_set_hash_cookie'])) || ($formId === $sessionData['2FA_FORM_ID'] && $recordId === '-1'));
	} else {
		return false;
	}
}

function nuPasswordChangeStatusPending($globalAccess, $sessionData, $callType, $formId) {

	if (!$globalAccess && nuObjKey($sessionData, 'SESSION_CHANGE_PW_STATUS') == 'PENDING') {
		if ($formId != $sessionData['CHANGE_PW_FORM_ID'] && $callType != 'runhiddenphp') {
			return true;
		}
	}

	return false;
}

function nuGetIPAddress() {

	$ipSources = [
		'HTTP_CF_CONNECTING_IP', // Cloudflare-provided IP
		'HTTP_X_FORWARDED_FOR',  // Forwarded IP (may contain multiple)
		'HTTP_CLIENT_IP',        // Client IP header
		'REMOTE_ADDR'            // Fallback to remote address
	];

	foreach ($ipSources as $source) {
		if (empty($_SERVER[$source])) {
			continue;
		}

		$ip = $_SERVER[$source];

		// Handle comma-separated IPs in X-Forwarded-For
		if ($source === 'HTTP_X_FORWARDED_FOR') {
			$ip = explode(',', $ip)[0];
		}

		$ip = trim($ip);

		if (filter_var($ip, FILTER_VALIDATE_IP)) {
			return $ip;
		}
	}

	return null;
}

function nuGet2FASafeIPAddresses(...$keys) {

	global $nuConfig2FASafeIPAddresses;

	$value = $nuConfig2FASafeIPAddresses;

	foreach ($keys as $key) {
		if (is_array($value) && array_key_exists($key, $value)) {
			$value = $value[$key];
		} else {
			return [];
		}
	}

	return $value;
}

function nu2FASafeIPAddr(...$keys) {

	$allowedIPs = nuGet2FASafeIPAddresses(...$keys);
	$clientIP = nuGetIPAddress();

	if (!$clientIP || !filter_var($clientIP, FILTER_VALIDATE_IP)) {
		return false;
	}

	// Convert array to semicolon-separated string for compatibility
	$ipConfig = is_array($allowedIPs)
		? implode(';', array_map(function($item) { return strval($item); }, $allowedIPs))
		: (is_string($allowedIPs) ? $allowedIPs : '');

	if (empty($ipConfig)) {
		return false;
	}

	$validPatterns = array_filter(
		array_map('trim', explode(';', $ipConfig)),
		function($pattern) { return !empty($pattern) && nuIsValidIPPattern($pattern); }
	);

	return !empty($validPatterns) && nuMatchesAnyIPPattern($clientIP, $validPatterns);
}

function nuIsValidIPPattern($pattern) {
	// IPv4 pattern validation
	if (strpos($pattern, '.') !== false) {
		$testPattern = str_replace('*', '0', $pattern);
		return filter_var($testPattern, FILTER_VALIDATE_IP, FILTER_FLAG_IPV4) !== false;
	}

	// IPv6 pattern validation
	if (strpos($pattern, ':') !== false) {
		$testPattern = str_replace('*', '0', $pattern);

		// Handle IPv6 double colon compression
		if (strpos($testPattern, '::') !== false) {
			$parts = explode('::', $testPattern);
			if (count($parts) === 2) {
				$leftParts = $parts[0] ? explode(':', $parts[0]) : [];
				$rightParts = $parts[1] ? explode(':', $parts[1]) : [];
				$missingParts = 8 - count($leftParts) - count($rightParts);

				if ($missingParts >= 0) {
					$middleParts = array_fill(0, $missingParts, '0');
					$testPattern = implode(':', array_merge($leftParts, $middleParts, $rightParts));
				}
			}
		}

		return filter_var($testPattern, FILTER_VALIDATE_IP, FILTER_FLAG_IPV6) !== false;
	}

	return false;
}

function nuMatchesAnyIPPattern($ip, $patterns) {
	foreach ($patterns as $pattern) {
		if (nuMatchesIPPattern($ip, $pattern)) {
			return true;
		}
	}
	return false;
}

function nuMatchesIPPattern($ip, $pattern) {
	$isIPv4 = filter_var($ip, FILTER_VALIDATE_IP, FILTER_FLAG_IPV4) !== false;
	$isPatternIPv4 = strpos($pattern, '.') !== false;

	// IP version mismatch
	if ($isIPv4 !== $isPatternIPv4) {
		return false;
	}

	return $isIPv4
		? nuMatchesIPv4Pattern($ip, $pattern)
		: nuMatchesIPv6Pattern($ip, $pattern);
}

function nuMatchesIPv4Pattern($ip, $pattern) {
	$ipParts = explode('.', $ip);
	$patternParts = explode('.', $pattern);

	if (count($ipParts) !== 4 || count($patternParts) !== 4) {
		return false;
	}

	foreach ($patternParts as $i => $patternPart) {
		if ($patternPart !== '*' && $patternPart !== $ipParts[$i]) {
			return false;
		}
	}

	return true;
}

function nuMatchesIPv6Pattern($ip, $pattern) {
	$normalizedIP = nuNormaliseIPv6($ip);
	$normalizedPattern = nuNormaliseIPv6($pattern);

	if ($normalizedIP === false || $normalizedPattern === false) {
		return false;
	}

	$ipParts = explode(':', $normalizedIP);
	$patternParts = explode(':', $normalizedPattern);

	if (count($ipParts) !== 8 || count($patternParts) !== 8) {
		return false;
	}

	foreach ($patternParts as $i => $patternPart) {
		if ($patternPart !== '*' && strtolower($patternPart) !== strtolower($ipParts[$i])) {
			return false;
		}
	}

	return true;
}

function nuNormaliseIPv6($ipv6) {
	$hasWildcards = strpos($ipv6, '*') !== false;

	// Handle IPv4-mapped IPv6 addresses with wildcards specially
	if ($hasWildcards && strpos($ipv6, '::ffff:') !== false) {
		// For IPv4-mapped addresses with wildcards, preserve the structure
		$parts = explode(':', $ipv6);
		if (count($parts) >= 2) {
			$lastPart = end($parts);
			if (strpos($lastPart, '*') !== false) {
				// This is an IPv4-mapped address with IPv4 wildcard
				$ipv4Part = $lastPart;
				$prefix = str_replace($lastPart, '', $ipv6);
				$prefix = rtrim($prefix, ':');

				// Expand the IPv6 prefix part
				$tempPrefix = str_replace('*', '0', $prefix);
				$binary = inet_pton($tempPrefix . ':0:0');
				if ($binary === false)
					return false;

				$normalized = inet_ntop($binary);
				if ($normalized === false)
					return false;

				$expanded = nuExpandIPv6($normalized);
				$expandedParts = explode(':', $expanded);

				// Replace the last part with the IPv4 wildcard
				$expandedParts[7] = $ipv4Part;
				return implode(':', $expandedParts);
			}
		}
	}

	$tempIP = $hasWildcards ? str_replace('*', '0', $ipv6) : $ipv6;

	$binary = inet_pton($tempIP);
	if ($binary === false) {
		return false;
	}

	$normalized = inet_ntop($binary);
	if ($normalized === false) {
		return false;
	}

	$expanded = nuExpandIPv6($normalized);

	if ($hasWildcards) {
		$originalParts = explode(':', $ipv6);
		$expandedParts = explode(':', $expanded);

		// Handle double colon expansion for wildcard restoration
		if (strpos($ipv6, '::') !== false) {
			$doubleColonPos = strpos($ipv6, '::');
			$beforeDouble = $doubleColonPos === 0 ? [] : explode(':', substr($ipv6, 0, $doubleColonPos));
			$afterDouble = $doubleColonPos + 2 >= strlen($ipv6) ? [] : explode(':', substr($ipv6, $doubleColonPos + 2));
			$originalParts = array_merge(
				$beforeDouble,
				array_fill(0, 8 - count($beforeDouble) - count($afterDouble), '0'),
				$afterDouble
			);
		}

		// Restore wildcards in their original positions
		$partCount = min(count($originalParts), count($expandedParts));
		for ($i = 0; $i < $partCount; $i++) {
			if ($originalParts[$i] === '*') {
				$expandedParts[$i] = '*';
			}
		}

		$expanded = implode(':', $expandedParts);
	}

	return $expanded;
}

function nuExpandIPv6($ipv6) {
	// Already fully expanded
	if (strpos($ipv6, '::') === false && substr_count($ipv6, ':') === 7) {
		$parts = explode(':', $ipv6);
		return implode(':', array_map(function($part) { return str_pad($part, 4, '0', STR_PAD_LEFT); }, $parts));
	}

	// Expand double colon notation
	if (strpos($ipv6, '::') !== false) {
		list($left, $right) = explode('::', $ipv6);
		$leftParts = $left ? explode(':', $left) : [];
		$rightParts = $right ? explode(':', $right) : [];
		$missingParts = 8 - count($leftParts) - count($rightParts);
		$middleParts = array_fill(0, $missingParts, '0000');
		$allParts = array_merge($leftParts, $middleParts, $rightParts);
	} else {
		$allParts = explode(':', $ipv6);
	}

	return implode(':', array_map(function($part) { return str_pad($part, 4, '0', STR_PAD_LEFT); }, $allParts));
}
