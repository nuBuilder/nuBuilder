<?php

require_once('nusystemupdatelibs.php');
require_once(dirname(__FILE__). '/../nuconfig.php'); // nuconfig must be loaded before using nubuilder_session_dat

function nuImportNewDB() {

	$t = nuRunQuery("SHOW TABLES");
	while($r = db_fetch_row($t)){
		if($r[0] == 'zzzzsys_object'){return;}
	}
	$file						= __DIR__."/../nubuilder4.sql";
	@$handle					= fopen($file, "r");
	$temp						= "";
	if($handle){
		while(($line = fgets($handle)) !== false){
			if($line[0] != "-" AND $line[0] != "/" AND $line[0] != "\n"){
				$line 			= trim($line);
				$temp 			.= $line;
				if(substr($line, -1) == ";"){
					$temp	= rtrim($temp,';');
					$temp	= str_replace('ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER','', $temp);
					nuRunQuery($temp);
					$temp	= "";
				}
			}
		}
	}

	nuImportLanguageFiles();
}

function nuConfigScript() {

	global $nuConfigSettingsFromDB;

	$loadDBConfig = isset($nuConfigSettingsFromDB) && $nuConfigSettingsFromDB == true;
	$code = null;
	$js = null;

	if ($loadDBConfig) {

		$t = nuRunQueryNoDebug("SELECT cfg_setting, cfg_value, cfg_category FROM zzzzsys_config ORDER BY cfg_setting, cfg_order");
		if (db_num_rows($t) > 0) {

			$code = "";
			$js = "";

			while ($r = db_fetch_array($t)) {

				$cat		= $r['cfg_category'];
				$setting	= $r['cfg_setting'];
				$php		= $setting[0] == '$';

				if ($php) {
					$code .= $r['cfg_setting'] . " = " . nuCleanConfigValue($r['cfg_value']) .";\n";
				} else {

					if ($js == "") $code .= "\$nuJSOptions = \"\n";
					$js .= 'nuUXOptions' . "['". $r['cfg_setting'] . "']"	. " = " . nuCleanConfigValue($r['cfg_value']) ."; \n";

				}

			}

			$code .= $js."\";\n";

		}

	}

    return [
        'code' => $code,
        'js' => $js
    ];

}

function nuCleanConfigValue($v) {

    if (in_array(strtolower($v), ["true", "false"])) {
        return strtolower($v);
    } else {
        if (is_numeric($v)) {
            return $v;
        } else {
            return "'". addslashes($v)."'";
        }
    }

}

function nuInclude($pfile, $type, $refreshCache = true) {

	if (empty($pfile)) {
		return;
	}

	$files = is_array($pfile) ? $pfile : [$pfile];

	foreach ($files as $file) {

		$timestamp = $refreshCache ? ( $_SESSION['nuinclude'][$file] ?? date("YmdHis") ) : 1;
		if ($refreshCache && !isset($_SESSION['nuinclude'][$file])) {
			$_SESSION['nuinclude'][$file] = $timestamp;
		}

		switch ($type) {
			case 'script':
				echo "<script src='{$file}?ts={$timestamp}' type='text/javascript'></script>\n";
				break;
			case 'stylesheet':
				echo "<link rel='stylesheet' href='{$file}?ts={$timestamp}' />\n";
				break;
		}
	}

}

function nuJSIndexInclude($pfile, $refreshCache = true){
	nuInclude($pfile, 'script', $refreshCache);
}

function nuCSSIndexInclude($pfile, $refreshCache = true){
	nuInclude($pfile, 'stylesheet', $refreshCache);
}

function nuJSChartsInclude(){

	global $nuConfigIncludeGoogleCharts;
	global $nuConfigIncludeApexCharts;

	if ($nuConfigIncludeGoogleCharts != false) {
		$pfile = "https://www.gstatic.com/charts/loader.js";
		nuInclude($pfile, 'script');
	}

	if ($nuConfigIncludeApexCharts != false) {
		$pfile = "core/libs/apexcharts/apexcharts.min.js";
		nuInclude($pfile, 'script');
	}
}

function nuIncludeFiles() {

	global $nuConfigIncludeTinyMCE;
	global $nuConfigIncludeJS;
	global $nuConfigIncludeCSS;

	nuJSIndexInclude('core/libs/jquery/jquery-3.7.1.min.js', false);
	nuJSIndexInclude('core/nuwysiwyg.js');
	nuJSIndexInclude('core/nuformclass.js');
	nuJSIndexInclude('core/nuform.js');
	nuJSIndexInclude('core/nuformdrag.js');
	nuJSIndexInclude('core/numobile.js');
	nuJSIndexInclude('core/nucommon.js');
	nuJSIndexInclude('core/nuadmin.js');
	nuJSIndexInclude('core/nureportjson.js');
	nuJSIndexInclude('core/nuajax.js');
	nuJSChartsInclude();
	nuJSIndexInclude('core/libs/ctxmenu/ctxmenu.min.js');
	nuJSIndexInclude('core/libs/vanillajs-datepicker/datepicker-full.min.js');
	nuJSIndexInclude('core/libs/jquery/jquery-confirm.min.js');
	nuCSSIndexInclude('core/libs/uppy/uppy.min.css');
	nuJSIndexInclude('core/libs/uppy/uppy.min.js');

	nuJSIndexInclude('core/libs/select2/select2.min.js');

	if (isset($nuConfigIncludeTinyMCE) && $nuConfigIncludeTinyMCE != false) {

		nuJSIndexInclude('core/libs/tinymce/tinymce.min.js');
	}

	nuCSSIndexInclude('core/css/nubuilder4.css');

	$nuConfigIncludeJS = isset($nuConfigIncludeJS) ? $nuConfigIncludeJS : '';
	nuJSIndexInclude($nuConfigIncludeJS);
	$nuConfigIncludeCSS = isset($nuConfigIncludeCSS) ? $nuConfigIncludeCSS : '';
	nuCSSIndexInclude($nuConfigIncludeCSS);

	nuCSSIndexInclude('core/libs/select2/select2.min.css');
	nuCSSIndexInclude('core/libs/vanillajs-datepicker/datepicker.min.css');
	nuCSSIndexInclude('core/libs/jquery/jquery-confirm.min.css');

}
