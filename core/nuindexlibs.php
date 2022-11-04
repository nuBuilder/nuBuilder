<?php

function nuLoadBody($debug = false) {

		if ( !$debug ) {
				echo "<body id='nubody' onload='nuLoad()' onresize='nuResize()'>";
		} else {
				echo "<body>";
				echo "<pre>";
				print_r($_SESSION);
				print_r($_SERVER);
				print('<br>' . session_id());
				echo "</pre>";
		}
}


function nuGetJS_login($nuBrowseFunction, $target, $loginTopRow, $welcome, $formId, $recordId, $isSession, $logonMode, $onlySsoExcept, $lastUser) {

	$h2 = "function nuLoad(){
		nuBindCtrlEvents();
		window.nuDefaultBrowseFunction	= '$nuBrowseFunction';
		window.nuBrowseFunction			= '$nuBrowseFunction';
		window.nuTARGET					= '$target';
		";

	$h3 = "";

	if ($isSession) {
		$h3 = "nuForm('$formId','$recordId','','','','');";
	} else {
		// Lines below take a PHP array and create a JS dictionary - example:
		// Input:  PHP:	$onlySsoExcept = array("globeadmin", "fred")
		// Output:  JS: var onlySsoExcept = { "globeadmin": true, "fred": true };
		$colonTrueAdded = array_map(function($item) {  // Append ": true' but also put double quotes around the keys
			return '"'.$item.'": true';
		}, $onlySsoExcept);
		$dictLiteral = join(", ", $colonTrueAdded);
		$jsDict  = 'var onlySsoExcept = { '.$dictLiteral.' }';
		$h3 = "
			var loginTopRow				= `$loginTopRow`;
			var welcome					= `$welcome`;
			$jsDict;
			nuLogin(loginTopRow, welcome, '$logonMode', onlySsoExcept, '$lastUser');
		";
	}

	$h4 = "}";

	return $h2.$h3.$h4;

}


function nuUseUP($nuBrowseFunction, $target, $welcome, $u, $p) {

	$h2 = "function nuLoad(){
		nuBindCtrlEvents();
		window.nuDefaultBrowseFunction	= '$nuBrowseFunction';
		window.nuBrowseFunction			= '$nuBrowseFunction';
		window.nuTARGET					= '$target';
		var welcome						= `$welcome`;
		nuLoginRequest('$u', '$p');
	}";

	return $h2;
}

function nuGetJS_action_screen($nuBrowseFunction, $target, $welcome, $opener, $search, $like) {

	$h2 = "function nuLoad(){
		if(nuIsOpener(window)){
			var from		= window.opener;
		}else{
			var from		= window.parent;
		}
		window.nuFORM.caller			= from.nuFORM.getCurrent();
		nuFORM.tableSchema				= from.nuFORM.tableSchema;
		nuFORM.formSchema				= from.nuFORM.formSchema;
		window.nuDefaultBrowseFunction	= '$nuBrowseFunction';
		window.nuBrowseFunction			= '$nuBrowseFunction';
		window.nuTARGET					= '$target';
		window.nuSESSION				= from.nuSESSION;
		window.nuSuffix					= 1000;
		if('$opener' != '') {
			var p			= nuGetOpenerById(from.nuOPENER, Number($opener));
			nuRemoveOpenerById(from.nuOPENER, Number($opener));

		} else {
			var p			= from.nuOPENER[from.nuOPENER.length -1];
			nuRemoveOpenerById(from.nuOPENER, from.nuOPENER[from.nuOPENER.length -1]);

		}
		nuBindCtrlEvents();

		if(p.type == 'R') {
			nuRunReport(p.record_id, p.parameters);
		} else if(p.type == 'P') {
			nuRunPHP(p.record_id, p.parameters);
		} else {
			window.filter		= p.filter;
			window.nuFILTER		= p.filter;
			nuForm(p.form_id, p.record_id, p.filter, '$search', 0, '$like');
		}
		if(p.record_id == '-2'){
			nuBindDragEvents();
		}
	}";

	return $h2;
}

?>
