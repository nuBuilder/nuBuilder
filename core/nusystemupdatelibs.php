<?php

// Alter nu-tables: Add new columns, change data types etc.
function nuAlterSystemTables(){

	$alterTableSQL = [
		"ALTER TABLE `zzzzsys_debug` ADD `deb_flag` VARCHAR(50) NULL DEFAULT NULL AFTER `deb_message`;",
		"ALTER TABLE `zzzzsys_debug` ADD `deb_user_id` VARCHAR(25) NULL DEFAULT NULL AFTER `deb_added`;",
		"ALTER TABLE `zzzzsys_object` CHANGE `sob_input_count` `sob_input_count` VARCHAR(15) NULL DEFAULT NULL",
		"ALTER TABLE `zzzzsys_object` CHANGE `sob_all_order` `sob_all_order` INT(11) NULL DEFAULT '0';",
		"ALTER TABLE `zzzzsys_object` ADD `sob_select_2` VARCHAR(1) NULL DEFAULT '0' AFTER `sob_select_multiple`;",
		"ALTER TABLE `zzzzsys_object` ADD `sob_input_datalist` TEXT NULL DEFAULT NULL AFTER `sob_input_javascript`;",
		"ALTER TABLE `zzzzsys_object` ADD `sob_input_attribute` VARCHAR(1000) NULL DEFAULT NULL AFTER `sob_input_datalist`;",
		"ALTER TABLE `zzzzsys_object` ADD `sob_input_icon` VARCHAR(50) NULL DEFAULT NULL AFTER `sob_input_type`;",
		"ALTER TABLE `zzzzsys_object` ADD `sob_input_file_target` VARCHAR(1) NOT NULL DEFAULT '0' AFTER `sob_input_attribute`;",
		"ALTER TABLE `zzzzsys_object` ADD `sob_run_target` VARCHAR(1) NULL DEFAULT NULL AFTER `sob_run_method`;",
		"ALTER TABLE `zzzzsys_object` ADD `sob_run_type` VARCHAR(1) NULL DEFAULT NULL AFTER `sob_run_target`;",
		"ALTER TABLE `zzzzsys_object` ADD `sob_display_procedure` VARCHAR(25) NULL DEFAULT NULL AFTER `sob_display_sql`;",
		"ALTER TABLE `zzzzsys_object` ADD `sob_all_event` VARCHAR(1) NULL DEFAULT NULL AFTER `sob_all_access`;",
		"ALTER TABLE `zzzzsys_object` ADD `sob_all_style_type` VARCHAR(15) NULL DEFAULT NULL AFTER `sob_all_event`;",
		"ALTER TABLE `zzzzsys_object` ADD `sob_all_style` VARCHAR(1000) NULL DEFAULT NULL AFTER `sob_all_style_type`;",
		"ALTER TABLE `zzzzsys_object` ADD `sob_all_json` MEDIUMTEXT NULL DEFAULT NULL AFTER `sob_image_zzzzsys_file_id`;",
		"ALTER TABLE `zzzzsys_object` ADD `sob_all_access_condition` VARCHAR(1000) NULL DEFAULT NULL AFTER `sob_all_access`;",
		"ALTER TABLE `zzzzsys_form` ADD `sfo_browse_title_multiline` VARCHAR(1) NULL DEFAULT '0' AFTER `sfo_browse_rows_per_page`;",
		"ALTER TABLE `zzzzsys_form` ADD `sfo_browse_autoresize_columns` VARCHAR(1) NULL DEFAULT NULL AFTER `sfo_browse_title_multiline`;",
		"ALTER TABLE `zzzzsys_form` ADD `sfo_breadcrumb_title` VARCHAR(100) NULL DEFAULT NULL AFTER `sfo_description`;",
		"ALTER TABLE `zzzzsys_form` ADD `sfo_browse_javascript` MEDIUMTEXT NULL DEFAULT NULL AFTER `sfo_javascript`;",
		"ALTER TABLE `zzzzsys_form` ADD `sfo_edit_javascript` MEDIUMTEXT NULL DEFAULT NULL AFTER `sfo_browse_javascript`;",
		"ALTER TABLE `zzzzsys_form` ADD `sfo_style` MEDIUMTEXT NULL DEFAULT NULL AFTER `sfo_edit_javascript`;",
		"ALTER TABLE `zzzzsys_form` ADD `sfo_mobile_view` VARCHAR(1) NULL DEFAULT NULL AFTER `sfo_style`;",
		"ALTER TABLE `zzzzsys_form` ADD `sfo_group` VARCHAR(100) NULL DEFAULT NULL AFTER `sfo_description`;",
		"ALTER TABLE `zzzzsys_session` ADD `sss_hashcookies` MEDIUMTEXT NULL DEFAULT NULL AFTER `sss_access`;",
		"ALTER TABLE `zzzzsys_session` ADD COLUMN sss_login_time timestamp NULL DEFAULT current_timestamp() AFTER sss_time;",
		"ALTER TABLE `zzzzsys_tab` ADD `syt_access` VARCHAR(1) NULL DEFAULT NULL AFTER `syt_help`;",
		"ALTER TABLE `zzzzsys_user` ADD `sus_code` varchar(50) DEFAULT NULL AFTER `sus_name`;",
		"ALTER TABLE `zzzzsys_user` ADD `sus_position` varchar(50) DEFAULT NULL AFTER `sus_code`;",
		"ALTER TABLE `zzzzsys_user` ADD `sus_department` varchar(50) DEFAULT NULL AFTER `sus_position`;",
		"ALTER TABLE `zzzzsys_user` ADD `sus_team` varchar(50) DEFAULT NULL AFTER `sus_department`;",
		"ALTER TABLE `zzzzsys_user` ADD `sus_additional1` varchar(100) DEFAULT NULL AFTER `sus_email`;",
		"ALTER TABLE `zzzzsys_user` ADD `sus_additional2` varchar(100) DEFAULT NULL AFTER `sus_additional1`;",
		"ALTER TABLE `zzzzsys_user` ADD `sus_expires_on` datetime DEFAULT NULL AFTER `sus_login_password`;",
		"ALTER TABLE `zzzzsys_user` ADD `sus_json` MEDIUMTEXT NULL DEFAULT NULL AFTER `sus_expires_on`;",
		"ALTER TABLE `zzzzsys_user` ADD `sus_accessibility_features` VARCHAR(1) NULL DEFAULT NULL AFTER `sus_expires_on`;",
		"ALTER TABLE `zzzzsys_user` ADD `sus_change_password` VARCHAR(1) NULL DEFAULT NULL AFTER `sus_expires_on`;",
		"ALTER TABLE `zzzzsys_user` ADD `sus_permission` VARCHAR(1000) NULL DEFAULT NULL AFTER `sus_additional2`;",
		"ALTER TABLE `zzzzsys_access` ADD `sal_use_2fa` VARCHAR(1) NULL DEFAULT NULL AFTER `sal_zzzzsys_form_id`;",
		"ALTER TABLE `zzzzsys_access` ADD `sal_group` VARCHAR(100) NULL DEFAULT NULL AFTER `sal_description`;",
		"ALTER TABLE `zzzzsys_access_form` ADD `slf_data_mode` varchar(2) DEFAULT NULL AFTER `slf_print_button`;",
		"ALTER TABLE `zzzzsys_access_form` ADD `slf_form_type` varchar(2) DEFAULT NULL AFTER `slf_data_mode`;",
		"ALTER TABLE `zzzzsys_php` ADD `sph_global` VARCHAR(1) NOT NULL DEFAULT '0' AFTER `sph_system`;",
		"ALTER TABLE `zzzzsys_php` ADD `sph_template` VARCHAR(1) NOT NULL DEFAULT '0' AFTER `sph_global`;",
		"ALTER TABLE `zzzzsys_setup` ADD `set_smtp_use_ssl` VARCHAR(1) NOT NULL DEFAULT '1' AFTER `set_smtp_use_authentication`;",
		"ALTER TABLE `zzzzsys_report` CHANGE `sre_zzzzsys_php_id` `sre_zzzzsys_php_id` VARCHAR(200) NULL DEFAULT NULL;",
		"ALTER TABLE `zzzzsys_select` ADD `sse_code` VARCHAR(50) NULL DEFAULT NULL AFTER `zzzzsys_select_id`;",
		"ALTER TABLE `zzzzsys_code_snippet` CHANGE `cot_updated_on` `cot_updated_on` TIMESTAMP on update CURRENT_TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP;",
		"ALTER TABLE `zzzzsys_code_snippet` ADD `cot_group` VARCHAR(80) NULL DEFAULT NULL AFTER `cot_description`;",
		"ALTER TABLE `zzzzsys_cloner` ADD `clo_tables_include` MEDIUMTEXT NULL DEFAULT NULL AFTER `clo_iframe_forms`;",
		"ALTER TABLE `zzzzsys_cloner` ADD `clo_tables_exclude` MEDIUMTEXT NULL DEFAULT NULL AFTER `clo_tables_include`;",
		"ALTER TABLE `zzzzsys_email_template` ADD `emt_template` VARCHAR(1) NULL DEFAULT '0' AFTER `emt_group`;",		
		"ALTER TABLE `pdf_temp` ADD `pdf_code` VARCHAR(100) NULL DEFAULT NULL AFTER `pdf_added_by`;",
		"ALTER TABLE `pdf_temp` ADD `pdf_tag` VARCHAR(100) NULL DEFAULT NULL AFTER `pdf_code`;",
		"ALTER TABLE `zzzzsys_email_log` CHANGE `eml_created_at` `eml_created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP;",
		"ALTER TABLE `zzzzsys_email_log` CHANGE `eml_sent_at` `eml_sent_at` TIMESTAMP NULL DEFAULT NULL;",
		"ALTER TABLE `zzzzsys_config` ADD `cfg_title` VARCHAR(50) NULL DEFAULT NULL AFTER `cfg_category`;"
	];

	foreach ($alterTableSQL as $sqlStatement) {
		nuRunQueryNoDebug($sqlStatement);
	}

	$setupColumns = db_field_names('zzzzsys_setup');
	if(array_search('set_languages_included', $setupColumns) == false){
		nuRunQueryNoDebug("ALTER TABLE `zzzzsys_setup` ADD `set_languages_included` VARCHAR(1000) NULL DEFAULT NULL AFTER `set_language`;");

		$languagesJson = nuGetSupportedLanguagesAsJson();
		nuRunQueryNoDebug('UPDATE `zzzzsys_setup` SET set_languages_included = ?', [$languagesJson]);
	}

	if(array_search('set_style', $setupColumns) == false){
		nuRunQueryNoDebug("ALTER TABLE `zzzzsys_setup` ADD `set_style` LONGTEXT NULL DEFAULT NULL AFTER `set_header`;");
		$style = "/* Define your own styles, override styles from nubuilder4.css */\r\n\r\n/*\r\n .nuActionButton {\r\n background-color: #579cb7\r\n}\r\n\r\n*/";
		
		nuRunQueryNoDebug('UPDATE `zzzzsys_setup` SET set_style = ?', [$style]);
	}
	
	nuCreateJSONColumns();

}

// Drop temp tables if exists. E.g. : DROP TABLE IF EXISTS sys_zzzzsys_form
// Copy zzzz... into sys... E.g. CREATE TABLE sys_zzzzsys_form SELECT * FROM zzzzsys_form
// Drop zzzz.... E.g. DROP TABLE IF EXISTS zzzzsys_form

function nuCopySystemTables() {

	nuDropDatabaseObject ('zzzzsys_report_data', ['VIEW', 'TABLE']);
	nuDropDatabaseObject ('zzzzsys_run_list', ['VIEW', 'TABLE']);
	nuDropDatabaseObject ('zzzzsys_object_list', ['VIEW', 'TABLE']);

	$t	= nuSystemList();

	$count = count($t);
	for($i = 0 ; $i < $count ; $i++){

		$table = $t[$i];
		nuDropDatabaseObject ("sys_".$table, ['TABLE']);

		$sql = "CREATE TABLE sys_$table SELECT * FROM $table";
		nuRunQueryNoDebug($sql);

		if($table != 'zzzzsys_debug'){
			nuDropDatabaseObject ($table, ['TABLE']);
		}
	}

}

// Import nubuilder4.sql
function nuSetupImportSQLFile() {

	try{

		$file = 					 dirname(__FILE__). '/../nubuilder4.sql';
		@$handle					= fopen($file, "r");
		$temp						= "";
		if ( $handle ) {

			nuDropDatabaseObject ('zzzzsys_debug', ['TABLE']);

			while(($line = fgets($handle)) !== false){

				if($line[0] != "-" AND $line[0] != "/" AND $line[0] != "\n"){
					$line 			= trim($line);
					$temp 			.= $line;
					if(substr($line, -1) == ";"){
						$temp	= rtrim($temp,';');
						$temp	= str_replace('ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER','', $temp);
						nuRunQueryNoDebug($temp);
						$temp	= "";
					}
				}
			}
		}else{
			nuInstallException("Error opening the file: $file");
		}

	}catch (Throwable $e) {
		nuInstallException($e);
	}catch (Exception $e) {
		nuInstallException($e);
	}
}

function nuSQLImportFileExists($file){

	$filePath = __DIR__ . "/../$file";
	return file_exists($filePath) && is_readable($filePath) ? true : $filePath;

}

function nuInstallException($e){

	$ce		= $_POST['nuProcedureEval'];
	$se		= $_POST['nuSystemEval'];
	print "$ce $se<br>" . $e->getFile() .'<i>' . $e->getMessage() . '</i>' . '<br><b><i>Traced from...</i></b><br>';
	$a		= $e->getTrace();
	$t		= array_reverse($a);

	$count = count($t);
	for($i = 0 ; $i < $count ; $i++){
		$m	= '(line:<i>' . $t[$i]['line'] . '</i>) ' . $t[$i]['file'] . ' <b> - ' . $t[$i]['function'] . '<b>';
		print $m . '<br>';
	}

}

//-- after zzzzsys files have been imported
function nuUpdateSystemRecords(){

	$ts			= nuBuildTableSchema();
	$t			= nuListSystemTables();
	$new		= [];

	$countTables = count($t);
	for($i = 0 ; $i < $countTables ; $i++){

		$table		= $t[$i];
		$new		= $ts["$table"]['names'];

		$old = nuObjKey($ts, "sys_$table", false) ? $ts["sys_$table"]['names'] : null;

		if (is_array($old)) {
		//-- remove unused fields from old
		$countOld = count($old);
		for($c = 0 ; $c < $countOld ; $c++){
			$field	= $old[$c];
			if(!in_array($field, $new)){
				$sql= "ALTER TABLE sys_$table DROP COLUMN $field";
				nuRunQuery($sql);
			}
		}
		} else {
			// print "Names does not exist in sys_$table" . '<br>';
		}
	}

	$ts 			= nuBuildTableSchema();
	for($i = 0 ; $i < $countTables ; $i++){

		$table		= $t[$i];
		$lfield		= 'FIRST';

		//-- insert extra new fields into old
		$countNew = count($new);
		for($c = 0 ; $c < $countNew ; $c++){

			$new	= $ts["$table"]['names'];
			$newt	= $ts["$table"]['types'];
			$old = nuObjKey($ts, "sys_$table", false) ? $ts["sys_$table"]['names'] : null;
			$oldt = nuObjKey($ts, "sys_$table", false) ? $ts["sys_$table"]['types'] : null;

			if($old != null && (nuObjKey($old,$c, false) && nuObjKey($new,$c, false))){

				$ofield	= $old[$c];
				$nfield	= $new[$c];
				$otype	= $oldt[$c];
				$ntype	= $newt[$c];

				if($ofield != $nfield){

					$sql= "ALTER TABLE sys_$table ADD COLUMN $nfield $ntype $lfield";
					nuRunQuery($sql);
					$ts	= nuBuildTableSchema();
					//-- start from the beginning again
					$c	= -1;

				}else if($otype != $ntype){

					$sql= "ALTER TABLE sys_$table MODIFY COLUMN $nfield $ntype";
					nuRunQuery($sql);
				}

				if($ofield == ''){
					$lfield	= '';
				}else{
					$lfield	= "AFTER $ofield";
				}
			}
		}
	}
}

function nuAddNewSystemTables(){

	$ts			= nuBuildTableSchema();
	foreach ($ts as $k => $v) {
		if(substr($k,0,8) == 'zzzzsys_'){

			if(nuObjKey($ts,"sys_$k", false)){
				$v	= $ts["sys_$k"]['valid'];
				if($v == ''){
					$sql	= "CREATE TABLE sys_$k SELECT * FROM $k";
					nuRunQuery($sql);
				}
			}
		}
	}

}

function nuCreateJSONColumns() {

	$ts = nuBuildTableSchema();
	foreach ($GLOBALS['sys_table_prefix'] as $tbl => $prefix) {
		
		if (nuObjKey($ts, "zzzzsys_$tbl", false)) {
			$exists = db_field_exists("zzzzsys_".$tbl, $prefix."_json");

			if (!$exists) {
				nuRunQueryNoDebug("ALTER TABLE zzzzsys_$tbl ADD {$prefix}_json MEDIUMTEXT NULL DEFAULT NULL;");
			}
		}
	}

}

function nuJustNuRecords(){

	$s = "DELETE FROM zzzzsys_event WHERE zzzzsys_event_id NOT LIKE 'nu%'";
	nuRunQuery($s);

	$s = "DELETE FROM zzzzsys_file WHERE zzzzsys_file_id NOT LIKE 'nu%'";
	nuRunQuery($s);

	$s = "DELETE FROM zzzzsys_format WHERE zzzzsys_format_id NOT LIKE 'nu%'";
	nuRunQuery($s);

	//-- delete records that start with ids starting with 'nu' or linked to forms starting with 'nu'
	$s = "DELETE FROM zzzzsys_php WHERE sph_zzzzsys_form_id NOT LIKE 'nu%' AND zzzzsys_php_id NOT LIKE 'nu%' ";
	nuRunQuery($s);

	$s = "DELETE FROM zzzzsys_setup";
	nuRunQuery($s);

	//-- delete tabs with forms starting with 'nu'
	$s = "DELETE FROM zzzzsys_tab WHERE syt_zzzzsys_form_id NOT LIKE 'nu%' OR syt_zzzzsys_form_id = 'nuuserhome'";
	nuRunQuery($s);
}

function nuRemoveNuRecords() {

	$queries = [
		["table" => "sys_zzzzsys_event"],
		["table" => "sys_zzzzsys_file"],
		["table" => "sys_zzzzsys_format"],
		["table" => "sys_zzzzsys_object", "where" => "sob_all_zzzzsys_form_id LIKE 'nu%' AND sob_all_zzzzsys_form_id != 'nuuserhome'"],
		["table" => "sys_zzzzsys_tab", "where" => "syt_zzzzsys_form_id LIKE 'nu%' AND syt_zzzzsys_form_id != 'nuuserhome'"],
		["table" => "sys_zzzzsys_form"],
		["table" => "sys_zzzzsys_php", "where" => "zzzzsys_php_id LIKE 'nu%' AND zzzzsys_php_id != 'nuuserhome_BE'"],
		["table" => "sys_zzzzsys_browse", "where" => "sbr_zzzzsys_form_id LIKE 'nu%'"],
		["table" => "sys_zzzzsys_translate"],
		["table" => "sys_zzzzsys_note"],
		["table" => "sys_zzzzsys_config"],
		["table" => "sys_zzzzsys_note_category"],
		["table" => "sys_zzzzsys_code_snippet"],
		["table" => "sys_zzzzsys_cloner"],
		["table" => "sys_zzzzsys_info"],
		["table" => "sys_zzzzsys_email_template"],
		["table" => "sys_zzzzsys_email_log"],
		["table" => "sys_zzzzsys_permission_item"],
		["table" => "sys_zzzzsys_user_permission"],
		["table" => "sys_zzzzsys_timezone", "where" => '1'],
	];

	foreach ($queries as $query) {

		$table = $query["table"];
		$pk = substr($table, 4)."_id"; // remove sys_ prefix
		$where = isset($query["where"]) ? $query["where"] : $pk . " LIKE 'nu%'";

		// e.g. DELETE FROM `sys_zzzzsys_event` WHERE zzzzsys_event_id LIKE 'nu%'
		nuRunQueryNoDebug("DELETE FROM `$table` WHERE $where");

	}

}

function nuAppendToSystemTables(){

	try{
		$t		= nuSystemList();
		$count	= count($t);

		for($i = 0 ; $i < $count ; $i++){
			$table = $t[$i];

			//-- if duplicate records, use latest record from zzzzsys_object
			if($table == 'zzzzsys_object'){
				nuRunQuery("REPLACE INTO sys_zzzzsys_object SELECT * FROM zzzzsys_object");
				nuRunQuery("DELETE FROM zzzzsys_object");
			}
			nuRunQuery("REPLACE INTO $table SELECT * FROM sys_$table");

			nuDropDatabaseObject ("sys_".$table, ['TABLE']);
		}


		// $s		= "UPDATE zzzzsys_setup SET set_denied = '1'";
		// nuRunQuery($s);

	}catch (Throwable $e) {
		nuInstallException($e);
	}catch (Exception $e) {
		nuInstallException($e);
	}
}

function nuSystemList(){

	$t	= [];
		$t[]	= 'zzzzsys_access';
		$t[]	= 'zzzzsys_access_form';
		$t[]	= 'zzzzsys_access_php';
		$t[]	= 'zzzzsys_access_report';
		$t[]	= 'zzzzsys_browse';
		$t[]	= 'zzzzsys_debug';
		$t[]	= 'zzzzsys_event';
		$t[]	= 'zzzzsys_file';
		$t[]	= 'zzzzsys_form';
		$t[]	= 'zzzzsys_format';
		$t[]	= 'zzzzsys_object';
		$t[]	= 'zzzzsys_php';
		$t[]	= 'zzzzsys_report';
		$t[]	= 'zzzzsys_select';
		$t[]	= 'zzzzsys_select_clause';
		$t[]	= 'zzzzsys_session';
		$t[]	= 'zzzzsys_setup';
		$t[]	= 'zzzzsys_tab';
		$t[]	= 'zzzzsys_timezone';
		$t[]	= 'zzzzsys_translate';
		$t[]	= 'zzzzsys_user';
		$t[]	= 'zzzzsys_cloner';
		$t[]	= 'zzzzsys_code_snippet';
		$t[]	= 'zzzzsys_note';
		$t[]	= 'zzzzsys_email_template';
		$t[]	= 'zzzzsys_note_category';
		$t[]	= 'zzzzsys_info';
		$t[]	= 'zzzzsys_config';
		$t[]	= 'zzzzsys_user_permission';
		$t[]	= 'zzzzsys_permission_item';
		$t[]	= 'zzzzsys_email_log';

	return $t;
}

function nuSetCollation(){

	global $nuConfigDBEngine;
	global $nuConfigDBCollate;
	global $nuConfigDBCharacterSet;

	if (!isset($nuConfigDBEngine))			$nuConfigDBEngine = "MyISAM";
	if (!isset($nuConfigDBCollate))			$nuConfigDBCollate = "utf8_general_ci";
	if (!isset($nuConfigDBCharacterSet))	$nuConfigDBCharacterSet = "utf8";

	$db		= nuRunQuery("SELECT DATABASE()");
	$dbname	= db_fetch_row($db);
	$dbname	= $dbname[0];
	nuRunQuery("ALTER DATABASE $dbname CHARACTER SET $nuConfigDBCharacterSet COLLATE $nuConfigDBCollate");

	$tbls	= nuRunQuery("SHOW FULL Tables WHERE Table_type = 'BASE TABLE'");

	while($row = db_fetch_row($tbls)){

		$tab 	= $row[0];

		if(substr($tab, 0, 8) == 'zzzzsys_'){

			nuRunQuery("ALTER TABLE $tab ENGINE = $nuConfigDBEngine");
			nuRunQuery("ALTER TABLE $tab DEFAULT CHARACTER SET $nuConfigDBCharacterSet COLLATE $nuConfigDBCollate");
			nuRunQuery("ALTER TABLE $tab CONVERT TO CHARACTER SET $nuConfigDBCharacterSet COLLATE $nuConfigDBCollate");

		}

	}

}

function nuGetSupportedLanguagesAsJson() {

    $languages = [
        "Afrikaans", "Arabic", "Armenian", "Catalan", "Chinese", 
        "Czech", "Danish", "Dutch", "French", "German", "Greek", 
        "Hindi", "Italian", "Japanese", "Malay", "Polish", 
        "Portuguese", "Romanian", "Russian", "Slovak", "Spanish", 
        "Tamil", "Vietnamese"
    ];

    return json_encode($languages);

}

function nuGetIncludedLanguages(){

	$s		= "SELECT `set_languages_included` FROM `zzzzsys_setup`";
	$t		= nuRunQuery($s);
	$r		= db_fetch_row($t);

	$v = str_replace('"', '', $r[0]);
	$v = str_replace(['[',']'] , '' , $v );

	return $v == '' ? [] : explode(",", $v);

}

function nuImportLanguageFiles() {

	nuRunQuery("DELETE FROM `zzzzsys_translate` WHERE `zzzzsys_translate_id` LIKE 'nu%'");

	$l = nuGetIncludedLanguages();
	try{

		$countLanguages = count($l);
		for($i = 0 ; $i < $countLanguages ; $i++){

			if (trim($l[$i]) != '') {
				$file = __DIR__ . DIRECTORY_SEPARATOR . 'languages'. DIRECTORY_SEPARATOR . $l[$i]. '.sql';
				$sql = file_get_contents($file);
				if ($sql) {
					nuRunQuery($sql);
				} else {
					nuInstallException("Error opening the file: $file");
				}
			}

		}
	} catch (Throwable $e) {
		nuInstallException($e);
	}catch (Exception $e) {
		nuInstallException($e);
	}

}

function nuDropDatabaseObject($name, $types) {

	foreach ($types as $type) {		
		nuRunQuery("DROP $type IF EXISTS `$name`");
	}

}