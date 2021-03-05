<?php

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;
use PHPMailer\PHPMailer\SMTP;

require './libs/phpmailer/PHPMailer.php';
require './libs/phpmailer/Exception.php';
require './libs/phpmailer/SMTP.php';

// Send email using the built in PHP function
function nuEmailPHP($sendTo, $fromAddress, $fromName, $content, $subject){

	$headers	= "MIME-Version: 1.0\r\n";
	$headers	.= "Content-type: text/html; charset=iso-8859-1\r\n";
	$headers	.= "From: {$fromAddress} <{$fromName}> \n";

	if(mail($sendTo, $subject, $content, $headers)){
		return true;
	}

	return false;
}

// Send email using PHPMailer
function nuEmail($to_list=array(),$from_address='',$from_name='',$content='',$subject='',$file_list=array(),$html=false,$cc_list=array(), $bcc_list=array(), $reply_to_list=array(),$debug=0,$method='SMTP'){
	ob_start();

	$nuEmailSettings = nuMarshallEmailSettings($from_address, $from_name, $html, $reply_to_list);

	$mail = new \PHPMailer\PHPMailer\PHPMailer();
	$mail->SMTPDebug = $debug;

	if ( $method == 'SMTP' ) {
		$mail->isSMTP();
	} 
	if ( $method == 'sendmail' ) {
		$mail->isSendmail();
	}

	$mail->Subject	 		 		 	= $subject;
	$mail->Body	 		 		 		= $content;
	$mail->Username	 		 			= $nuEmailSettings->username;	 		 		 	// defaults to ''
	$mail->Password	 		 			= $nuEmailSettings->password;	 		 		 	// defaults to ''
	$mail->Host	 		 		 		= $nuEmailSettings->host;	 		 		 		// defaults to 127.0.0.1
	$mail->From	 		 		 		= $nuEmailSettings->from_address;	 		 		// defaults to ''
	$mail->FromName	 		 			= $nuEmailSettings->from_name;	 		 		 	// defaults to ''
	$mail->Port	 		 		 		= $nuEmailSettings->smtp_port;	 		 		 	// defaults to 25
	$mail->SMTPSecure	 		 		= $nuEmailSettings->smtp_secure;	 		 		// defaults to '' otherwsie it will be tls or ssl
	$mail->SMTPAuth	 		 			= $nuEmailSettings->smtp_use_authentication;	 	// defaults to false
	$mail->WordWrap	 		 			= $nuEmailSettings->word_wrap;	 		 		 	// defaults to 120
	$mail->CharSet	 		 		 	= $nuEmailSettings->charset;	 		 		 	// defaults to UTF-8
	$mail->IsHTML($nuEmailSettings->html);

	_nuEmailHelperAdd($mail, $to_list, 'AddAddress');
	_nuEmailHelperAdd($mail, $cc_list, 'AddCC');			
	_nuEmailHelperAdd($mail, $bcc_list, 'AddBCC');	
	_nuEmailHelperAdd($mail, $nuEmailSettings->reply_to_list, 'AddReplyTo');
	_nuEmailHelperAttach($mail, $file_list);

	$result = array();	

	try {

		if ($mail->Send()) {
			$result[0] = true;
			$result[1] = "Message sent successfully";			
		} else {			
			$result[0] = false;
			$result[1] = "Message sending failed";
			$result[2] = $mail->ErrorInfo;
		}

	} catch(Exception $e) {		
		$result[0] = false;
		$result[1] = $e->errorMessage();
		$result[2] = $mail->ErrorInfo;
	}

	_nuEmailHelperClean($file_list);
	$result[3] = ob_get_contents();
	ob_end_clean();
	
	return $result;
}

function _nuMarshallEmailSettingsHelper($obj, $key, $default = '') {

	if ( !is_object($obj) ) {
		return $default;
	}
	if ( !isset($obj->$key) ) { 
		return $default;	
	}
	$a = trim($obj->$key);
	if ( empty($a) ) {
		return $default;
	}
	return $a;
}

function nuMarshallEmailSettings( $from_address = '', $from_name = '', $html = false, $reply_to_list = array() ) {

	$setup = db_setup();
	$nuEmailSettings = new stdClass();
	$nuEmailSettings->error_text				= '';
	$nuEmailSettings->username					= _nuMarshallEmailSettingsHelper($setup, 'set_smtp_username');
	$nuEmailSettings->password					= _nuMarshallEmailSettingsHelper($setup, 'set_smtp_password');
	$nuEmailSettings->host						= _nuMarshallEmailSettingsHelper($setup, 'set_smtp_host', '127.0.0.1');
	$nuEmailSettings->smtp_port					= _nuMarshallEmailSettingsHelper($setup, 'set_smtp_port', '25'); 
	$nuEmailSettings->smtp_use_secure			= _nuMarshallEmailSettingsHelper($setup, 'set_smtp_use_ssl', false);
	$nuEmailSettings->smtp_use_authentication	= _nuMarshallEmailSettingsHelper($setup, 'set_smtp_use_authentication', false);
	$nuEmailSettings->from_address				= $from_address != '' ? $from_address : _nuMarshallEmailSettingsHelper($setup, 'set_smtp_from_address');	
	$nuEmailSettings->from_name					= $from_name != '' ? $from_name :  _nuMarshallEmailSettingsHelper($setup, 'set_smtp_from_name');	
	$nuEmailSettings->word_wrap					= 120;
	$nuEmailSettings->charset					= 'UTF-8';
	$nuEmailSettings->html						= $html;

	$nuEmailSettings->reply_to_list		= array();
	$nuEmailSettings->smtp_secure		= '';
	if ( $nuEmailSettings->smtp_port	== '587' ) {
		$nuEmailSettings->smtp_secure	= 'tls';
		$nuEmailSettings->verbose_host	= 'tls://'.$nuEmailSettings->host.':587';
	}
	if ( $nuEmailSettings->smtp_port	== '465' ) {
		$nuEmailSettings->smtp_secure	= 'ssl';
		$nuEmailSettings->verbose_host	= 'ssl://'.$nuEmailSettings->host.':465';
	}
	if ( empty($reply_to_list) ) {
		if ( $from_address != '' ) {
					$nuEmailSettings->reply_to_list = array($from_address => $from_name);
		}
	}

	var_dump($nuEmailSettings);
	return $nuEmailSettings;
}

function _nuEmailHelperAdd(&$mail, $names_addresses, $method) {
	if (_is_my_array_associative($names_addresses)) {
		_nuEmailHelperAddAssociative($mail, $names_addresses, $method);	
	} else {
		_nuEmailHelperAddOrdinal($mail, $names_addresses, $method);
	}
}

function _nuEmailHelperAddOrdinal(&$mail, $names_addresses, $method) {
	for ( $x=0; $x<count($names_addresses); $x++ ) {
		$mail->$method($names_addresses[$x], '');
	}
}

function _nuEmailHelperAddAssociative(&$mail, $names_addresses, $method) {
	foreach ( $names_addresses as $key => $value ) {
		$mail->$method($key, $value);
	}
}

function _nuEmailHelperAttach(&$mail, $file_list = array() ) {
	if ( !is_array($file_list) ) {
		return;
	}
	if ( !_is_my_array_associative($file_list) ) {
		return;
	}
	
	foreach($file_list as $filename=>$filesource) {
		$mail->AddAttachment($filesource,$filename);
	}
}

function _nuEmailHelperClean($file_list = array() ) {
	if ( !is_array($file_list) ) {
			return;
	}
	if ( !_is_my_array_associative($file_list) ) {
			return;
	}
	foreach($file_list as $filename=>$filesource) {
		@unlink($filesource);
	}
}

function _is_my_array_associative($arr) {
	return array_key_exists('0',$arr) ? false : true;
}
?>