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

					$objList1 = '`information_schema`.`tables`.`TABLE_NAME` AS `zzzzsys_object_list_id` from `information_schema`.`tables` where `information_schema`.`tables`.`TABLE_SCHEMA`';
					$objList2 = 'TABLE_NAME AS zzzzsys_object_list_id from information_schema.tables WHERE TABLE_SCHEMA';
					$temp	= str_replace($objList1, $objList2, $temp);

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
					$js .= $r['cfg_category']. "['". $r['cfg_setting'] . "']"	. " = " . nuCleanConfigValue($r['cfg_value']) ."; \n";

				}

			}

			$code .= $js."\";\n";

		}

	}

    return array(
        'code' => $code,
        'js' => $js
    );

}

function nuCleanConfigValue($v) {

    if (in_array(strtolower($v), array("true", "false"))) {
        return strtolower($v);
    } else {
        if (is_numeric($v)) {
            return $v;
        } else {
            return "'". addslashes($v)."'";
        }
    }

}

?>
