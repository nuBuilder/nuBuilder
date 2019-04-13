<?php

function nuEmail($to_list=array(),$from_address='',$from_name='',$content='',$subject='',$file_list=array(),$html=false,$reply_to_list=array(),$debug=0,$method='SMTP') {

	ob_start();

        $nuEmailSettings = nuMarshallEmailSettings($from_address, $from_name, $html, $reply_to_list);

        require_once($nuEmailSettings->phpmailer_path);

        $mail                   = new PHPMailer();
	$mail->SMTPDebug        = $debug;

	if ( $method == 'SMTP' ) {
        	$mail->isSMTP();
	} 

	if ( $method == 'sendmail' ) {
		$mail->isSendmail();
	}

        $mail->Subject          = $subject;
        $mail->Body             = $content;
        $mail->Username         = $nuEmailSettings->username;                   // defaults to ''
        $mail->Password         = $nuEmailSettings->password;                   // defaults to ''
        $mail->Host             = $nuEmailSettings->host;                       // defaults to 127.0.0.1
        $mail->From             = $nuEmailSettings->from_address;               // defaults to ''
        $mail->FromName         = $nuEmailSettings->from_name;                  // defaults to ''
        $mail->Port             = $nuEmailSettings->smtp_port;                  // defaults to 25
        $mail->SMTPSecure       = $nuEmailSettings->smtp_secure;                // defaults to '' otherwsie it will be tls or ssl
        $mail->SMTPAuth         = $nuEmailSettings->smtp_use_authentication;    // defaults to false
        $mail->WordWrap         = $nuEmailSettings->word_wrap;                  // defaults to 120
        $mail->CharSet          = $nuEmailSettings->charset;                    // defaults to UTF-8
        $mail->IsHTML($nuEmailSettings->html);

        _nuEmailHelperAdd($mail, $to_list,                              'AddAddress');
        _nuEmailHelperAdd($mail, $nuEmailSettings->reply_to_list, 	'AddReplyTo');
        _nuEmailHelperAttach($mail, $file_list);

	$result = array();

	try {

        	$result[0]	= $mail->Send();
		$result[1]     	= "Message sent successfully";
		$result[2]      = $mail->ErrorInfo;	

	} catch(Exception $e) {

		$result[0]      = false;
                $result[1]      = $e->errorMessage();
		$result[2]      = $mail->ErrorInfo;
	}

        _nuEmailHelperClean($file_list);

	$result[3]		= ob_get_contents();
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

	if ( empty(trim($obj->$key)) ) {
		return $default;
	}
	return trim($obj->$key);
}

function nuMarshallEmailSettings( $from_address = '', $from_name = '', $html = false, $reply_to_list = array() ) {


	$word_press_path				= '../../../wp-includes/class-phpmailer.php';
	$standalone_path				= 'phpmailer/nuemailer/class-phpmailer.php';

	$setup 						= db_setup();
	$nuEmailSettings 				= new stdClass();
	$nuEmailSettings->error_text                    = '';
        $nuEmailSettings->username			= _nuMarshallEmailSettingsHelper($setup, 'set_smtp_username');
        $nuEmailSettings->password			= _nuMarshallEmailSettingsHelper($setup, 'set_smtp_password');
	$nuEmailSettings->host                      	= _nuMarshallEmailSettingsHelper($setup, 'set_smtp_host', '127.0.0.1');
	$nuEmailSettings->from_address                  = _nuMarshallEmailSettingsHelper($setup, 'set_smtp_from_address', $from_address);
        $nuEmailSettings->from_name			= _nuMarshallEmailSettingsHelper($setup, 'set_smtp_from_name', $from_name);
        $nuEmailSettings->smtp_port			= _nuMarshallEmailSettingsHelper($setup, 'set_smtp_port', '25');
        $nuEmailSettings->smtp_use_secure		= _nuMarshallEmailSettingsHelper($setup, 'set_smtp_use_ssl', false);
        $nuEmailSettings->smtp_use_authentication 	= _nuMarshallEmailSettingsHelper($setup, 'set_smtp_use_authentication', false);
	$nuEmailSettings->word_wrap			= 120;
	$nuEmailSettings->charset                    	= 'UTF-8';
	$nuEmailSettings->html				= $html;
	$nuEmailSettings->phpmailer_path        	= $standalone_path;
	$nuEmailSettings->reply_to_list			= array();
	$nuEmailSettings->smtp_secure			= '';

	if ( $nuEmailSettings->smtp_port == '587' ) {
		$nuEmailSettings->smtp_secure 		= 'tls';
		$nuEmailSettings->verbose_host		= 'tls://'.$nuEmailSettings->host.':587';
	}

	if ( $nuEmailSettings->smtp_port == '465' ) {
                $nuEmailSettings->smtp_secure 		= 'ssl';
		$nuEmailSettings->verbose_host          = 'ssl://'.$nuEmailSettings->host.':465';
        }

	if ( empty($reply_to_list) ) {
		if ( $from_address != '' ) {
                	$nuEmailSettings->reply_to_list = array($from_address => $from_name);
		}
        }

	if ( isset($_SESSION) ) {
		if ( $_SESSION['nubuilder_session_data']['PLUGIN'] ) {
			if ( file_exists($word_press_path) ) { 
				$nuEmailSettings->phpmailer_path = $word_press_path;
			} else {
				$nuEmailSettings->error_text    .= 'Cannot locate phpmailer files';
			}
        	}
	}

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
