<?php

require_once('nusystemupdatelibs.php');
require_once(dirname(__FILE__) . '/../nuconfig.php'); // nuconfig must be loaded before using nubuilder_session_dat

function nuImportNewDB() {

	$t = nuRunQuery("SHOW TABLES");
	while ($r = db_fetch_row($t)) {
		if ($r[0] == 'zzzzsys_object') {
			return;
		}
	}
	$file = __DIR__ . "/../nubuilder4.sql";
	@$handle = fopen($file, "r");
	$temp = "";
	if ($handle) {
		while (($line = fgets($handle)) !== false) {
			if ($line[0] != "-" and $line[0] != "/" and $line[0] != "\n") {
				$line = trim($line);
				$temp .= $line;
				if (substr($line, -1) == ";") {
					$temp = rtrim($temp, ';');
					$temp = str_replace('ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER', '', $temp);
					nuRunQuery($temp);
					$temp = "";
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

				$cat = $r['cfg_category'];
				$setting = $r['cfg_setting'];
				$php = $setting[0] == '$';

				if ($php) {
					$code .= $r['cfg_setting'] . " = " . nuCleanConfigValue($r['cfg_value']) . ";\n";
				} else {

					if ($js == "") {
						$code .= "\$nuJSOptions = \"\n";
						$js = "window.nuUXOptions = {}; \n";
					}
					$js .= 'nuUXOptions' . "['" . $r['cfg_setting'] . "']" . " = " . nuCleanConfigValue($r['cfg_value']) . "; \n";

				}

			}

			$code .= $js . "\";\n";

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
			return "'" . addslashes($v) . "'";
		}
	}

}

function nuMergeIncludeFiles(&$filesArray, $config) {

	if (empty($config)) {
		return;
	}

	if (is_array($config)) {
		$filesArray = array_merge($filesArray, $config);
	} else {
		$filesArray[] = $config;
	}

}

function nuInclude($files, $type, $refreshCache = true) {

	if (empty($files)) {
		return;
	}

	$fileList = is_array($files) ? $files : [$files];

	foreach ($fileList as $file) {
		if ($refreshCache) {
			$timestamp = $_SESSION['nuinclude'][$file] ?? date('YmdHis');
			$_SESSION['nuinclude'][$file] = $timestamp;
		} else {
			$timestamp = 1;
		}

		switch ($type) {
			case 'script':
				echo "\t<script src=\"{$file}?ts={$timestamp}\"></script>\n";
				break;
			case 'stylesheet':
				echo "\t<link rel=\"stylesheet\" href=\"{$file}?ts={$timestamp}\">\n";
				break;
		}
	}

}

function nuJSIndexInclude($files, $refreshCache = true) {
	nuInclude($files, 'script', $refreshCache);
}

function nuCSSIndexInclude($files, $refreshCache = true) {
	nuInclude($files, 'stylesheet', $refreshCache);
}

/*
function nuArrayFlatten($data, $section = null) {

	if (is_array($data) && $section !== null) {

		if (!isset($data[$section])) {
			return [];
		}

		$sectionData = $data[$section];
		if (array_values($sectionData) === $sectionData) {
			return $sectionData;
		}
		return array_merge(...array_values($sectionData));
	}

	if (array_values($data) === $data) {
		return $data;
	}

	return array_merge(...array_values($data));

}
*/

function nuIncludeFiles() {

	global $nuConfigIncludeGoogleCharts, $nuConfigIncludeApexCharts;
	global $nuConfigIncludeTinyMCE, $nuConfigIncludeJS, $nuConfigIncludeCSS;

	$jsFiles = [
		'core/nuwysiwyg.js',
		'core/nuformclass.js',
		'core/nuform.js',
		'core/nuformdrag.js',
		'core/numobile.js',
		'core/nucommon.js',
		'core/nuadmin.js',
		'core/nureportjson.js',
		'core/nuajax.js',
		'third_party/ctxmenu/ctxmenu.min.js',
		'third_party/vanillajs-datepicker/datepicker-full.min.js',
		'third_party/jquery/jquery-confirm.min.js',
		'third_party/uppy/uppy.min.js',
		'third_party/select2/select2.min.js'
	];

	if (!empty($nuConfigIncludeGoogleCharts)) {
		$jsFiles[] = 'https://www.gstatic.com/charts/loader.js';
	}

	if (!empty($nuConfigIncludeApexCharts)) {
		$jsFiles[] = 'third_party/apexcharts/apexcharts.min.js';
	}

	if (!empty($nuConfigIncludeTinyMCE)) {
		$jsFiles[] = 'third_party/tinymce/tinymce.min.js';
	}

	echo "<script src=\"third_party/jquery/jquery-3.7.1.min.js\"></script>\n";

	// $nuConfigIncludeJS = nuArrayFlatten($nuConfigIncludeJS, 'core');
	if (isset($nuConfigIncludeJS) && !empty($nuConfigIncludeJS)) {
		nuMergeIncludeFiles($jsFiles, $nuConfigIncludeJS);
	}
	nuJSIndexInclude($jsFiles);

	$cssFiles = [
		'core/css/nubuilder4.css',
		'third_party/fontawesome/css/all.min.css',
		'third_party/uppy/uppy.min.css',
		'third_party/select2/select2.min.css',
		'third_party/vanillajs-datepicker/datepicker.min.css',
		'third_party/jquery/jquery-confirm.min.css'
	];

	if (isset($nuConfigIncludeCSS) && !empty($nuConfigIncludeCSS)) {
		nuMergeIncludeFiles($cssFiles, $nuConfigIncludeCSS);
	}
	nuCSSIndexInclude($cssFiles);

}
