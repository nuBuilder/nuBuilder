<?php

/*	
	Subform Columns:
	0: "ID"
	1: "ff_label"
	2: "ff_field"
	3: "ff_id"
	4: "ff_type"
	5: "ff_datatype"
	6: "ff_browse"
	7: "nuDelete"	
*/

function nuBuildFastForm($table, $formType, $Pk){

	if (nuDemo()) return;

	$formId		= nuID();
						
	$isNew 		= nuFFIsNewTable($table, $Pk, $formType);
	$TT			= nuTT();
	$sF			= nuSubformObject('obj_sf');
	$tabId		= nuID();
	$FFNumber	= nuFFNumber();

	if($formType == 'launch'){
		$table	= 'Launch Form ' . $FFNumber;
	}

	//--------- Test table creation -----------------------

	if (!$isNew && $Pk == null) {
		nuDisplayError('<h2>' . nuTranslate('Error') . '</h2>' . nuTranslate('The table has no primary key'));
		return;
	}

	//--------- Test table creation -----------------------

	$test = nuFFCreateTable($sF, $formType, $table, $Pk, $isNew, true);

	if ($test != '') { 
		nuDisplayError($test);
		return;
	}

	//--------- Get form properties -----------------------

	$fp = nuFFFormProperties($FFNumber);
	$formCode = $fp['form_code'];
	$formDesc = $fp['form_desc'];

	//--------- Insert new tab ----------------------------

	nuFFInsertTab($tabId, $formId);

	//--------- Insert new form ---------------------------

	nuFFInsertForm($formId, $formType, $formCode, $formDesc, $table, $Pk);

	// -------- Insert Sample Object in temporary table ---

	nuFFTempInsertSampleObjects($sF, $formType, $TT);

	// -------- Update temporary table --------------------

	nuFFTempUpdate($sF, $formType, $TT, $table, $formId, $tabId);

	// -------- Create FF table ---------------------------
	if ($isNew) nuFFCreateNewTable($sF, $formType, $table, $Pk, $isNew);

	// -------- Insert Browse -----------------------------

	nuFFInsertBrowse($sF, $formId, $formType);

	// -------- Insert Objects ----------------------------

	nuFFInsertObjects($table, $TT, $formType, $formId);

	// -------- Display created message -------------------

	nuFFCreatedMessage($table, $TT, $isNew, $formId, $formType, $formCode);

	// -------- Delete temporary table --------------------
	nuRunQuery("DROP TABLE $TT");

	// -------- Update form schema ------------------------

	nuSetJSONData('clientFormSchema', nuBuildFormSchema());

}

function nuFFObjectMaxTop(){

	$s = 'SELECT MAX(sob_all_top) as max_top FROM zzzzsys_object WHERE sob_all_zzzzsys_tab_id = "nufastforms"';
	$t = nuRunQuery($s);
	$r = db_fetch_object($t);

	return $r->max_top + 50;

}

function nuFFNumber(){

	$s = "

		SELECT 
			COALESCE(MAX(CAST(SUBSTRING(`sfo_code`, 3) as UNSIGNED)),0) + 1 as num
		FROM (    
		SELECT 
			`sfo_code`
		FROM `zzzzsys_form` 
		WHERE `sfo_code` LIKE 'FF%'
		AND SUBSTRING(`sfo_code`, 3) REGEXP '^-?[0-9]+$'
		) T

	";

	$t = nuRunQuery($s);
	$r = db_fetch_row($t);
	return $r[0];

}

function nuFFNewTableSQL($table, $pk, $columns, $isNew){

					 
	$start	= "CREATE TABLE $table";
	$a		= Array();
	$a[]	= "`$pk` VARCHAR(25) NOT NULL";
	$h		= nuHash();
	$fk		= $h['fastform_fk'];

	if($h['fastform_type'] == 'subform' && $isNew){
		$a[]	= "`$fk` VARCHAR(25) DEFAULT NULL";
	}

	for($i = 0 ; $i < count($columns) ; $i++){

		$n = $columns[$i]['name'];
		$t = $columns[$i]['type'];

		if ($t !== '') {
			$a[] = "$n ". $t ." DEFAULT NULL";
		} else {
			$a[] = "$n $t DEFAULT NULL";
		}

	}

	if ($h['check_nulog'] == '1') {
		$a[] = $table."_nulog VARCHAR(1000) DEFAULT NULL";
	}

	$a[]	= "PRIMARY KEY ($pk)";
	$im		= implode(',', $a);

	return "$start ($im)";

}

function nuFFError($err, $sql) {

	$err = strlen($err) > 2 ? '<br>' . $err : '';
	$hint = '<span style="color:#a12c2c">' . nuTranslate('Run the query in phpMyAdmin to get more details on the error.') . '.</span>';
	return '<h2>Fast Form Error</h2>' . $err . '<br><br><b>SQL query:</b><br><br>' . $sql . '<br><br><i>' . $hint . '</i>';

}

function nuFFCreateTable($sF, $formType, $table, $Pk, $isNew, $drop) {

	if ($formType == 'launch' || ! $isNew) return '';

	$columns = Array();
	for($i = 0 ; $i < count($sF->rows) ; $i++){

		if($sF->deleted[$i] == 0){
			$type = $sF->rows[$i][5];												//-- ff_datatype
			if (trim($type) !== '') {
				$columns[] = Array('name'=>$sF->rows[$i][2], 'type'=>$type);		//-- ff_field
			}
		}
	}

	$sql		= nuFFNewTableSQL($table, $Pk, $columns, $isNew);

	if ($drop) {
		$test	= nuRunQueryTest($sql);
		if (is_bool($test)) {
			nuRunQuery("DROP TABLE IF EXISTS `$table`;");
			return '';
		} else {
			return nuFFError($test, $sql);
		}
	} else {
		nuRunQuery($sql);	
		return '';
	}

}

function nuFFInsertTab($tabId, $formId) {

	$sql = "
		INSERT INTO zzzzsys_tab
			(zzzzsys_tab_id,
			syt_zzzzsys_form_id,
			syt_title,
			syt_order)
		VALUES
			(?, ?, ?, ?)
	";

	$arg = Array($tabId, $formId, 'Main', 10);
	nuRunQuery($sql, $arg);

}

function nuFFInsertForm($formId, $formType, $formCode, $formDesc, $table, $Pk) {

	$insert = "
		INSERT INTO zzzzsys_form
			(zzzzsys_form_id,
			sfo_type,
			sfo_code,
			sfo_description,
			sfo_table,
			sfo_primary_key,
			sfo_browse_sql,
			sfo_browse_redirect_form_id,
			sfo_browse_row_height,
			sfo_browse_rows_per_page,
			sfo_browse_title_multiline
			)
		VALUES
			(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
	";

	$table	= $formType == 'launch' ? '' : $table;
	$Pk		= $formType == 'launch' ? '' : $Pk;
	$sql	= $formType == 'launch' ? '' : "SELECT * FROM $table"; 

	$arg = Array(
		$formId,								// -- zzzzsys_form_id
		$formType,								// -- sfo_type
		$formCode,								// -- sfo_code
		ucfirst($formDesc),						// -- sfo_description
		$table,									// -- sfo_table
		$Pk,									// -- sfo_primary_key
		$sql,									// -- sfo_browse_sql
		'',										// -- sfo_browse_redirect_form_id
		'0',									// -- sfo_browse_row_height
		'0',									// -- sfo_browse_rows_per_page
		'0'										// -- sfo_browse_title_multiline
	);

	nuRunQuery($insert, $arg);

}

function nuFFFormProperties($FFNumber){

	return array(
		'form_code' => 'FF' . $FFNumber,
		'form_desc' => 'Fast Form ' . $FFNumber
	);

}

function nuFFIsNewTable($table, &$Pk, $formType) {

	if ($formType == 'launch') return false;

	$t								= nuRunQuery("SELECT table_name FROM INFORMATION_SCHEMA.TABLES WHERE table_schema = DATABASE()");
	while($obj = db_fetch_row($t)){

		if($obj[0] == $table){

			$_POST['tableSchema']	= nuBuildTableSchema();
			$Pk						= isset($_POST['tableSchema'][$table]['primary_key'][0]) ? $_POST['tableSchema'][$table]['primary_key'][0] : $Pk;

			return false;

		}

	}

	return true;

}
	
function nuFFTempCreate($TT) {

	$sql = "CREATE TABLE $TT SELECT * FROM zzzzsys_object WHERE 1=0";
	nuRunQuery($sql);

}
	
function nuFFTempInsertSampleObjects($sF, $formType, $TT) {

	nuFFTempCreate($TT);

	if ($formType == 'browse') return;

	for($i = 0 ; $i < count($sF->rows) ; $i++){

		if($sF->deleted[$i] == 0){																					//-- not ticked as deleted

			$r					= $sF->rows[$i][3]; 																//-- ff_type
			$newid				= nuID();
			$sF->rows[$i][3]	= $newid;

			$sql				= "INSERT INTO $TT SELECT * FROM zzzzsys_object WHERE zzzzsys_object_id = ?";		//-- Insert sample object
			nuRunQuery($sql, array($r));

			$sql				= "UPDATE $TT SET zzzzsys_object_id = ? WHERE zzzzsys_object_id = ?";
			nuRunQuery($sql, array($newid, $r));

		}

	}

}

function nuFFTempUpdate($sF, $formType, $TT, $table, $formId, $tabId) {
	
	if ($formType == 'browse') return;

	$sql			= "

		UPDATE $TT
		SET 
			sob_all_id					= ?,
			sob_all_label				= ?,
			sob_all_order				= ?,
			sob_all_top					= ?,
			sob_all_left				= ?,
			sob_all_table				= ?,
			sob_all_zzzzsys_form_id		= ?,
			sob_all_zzzzsys_tab_id		= ?,
			zzzzsys_object_id			= ?
		WHERE 
			zzzzsys_object_id			= ?

	";

	$top		= 10;

	for($i = 0 ; $i < count($sF->rows) ; $i++){

		if($sF->deleted[$i] == 0){								//-- not ticked as deleted

			$newid	= nuID();
			$label	= $sF->rows[$i][1];
			$field	= $sF->rows[$i][2];
			$oldid	= $sF->rows[$i][3];

			$array	= Array($field, $label, $i * 5, $top, 150, $table, $formId, $tabId, $newid, $oldid);
			nuRunQuery($sql, $array);

			$OT		= nuRunQuery("SELECT * FROM $TT WHERE zzzzsys_object_id = ? ", array($newid));
			$top	= $top + db_fetch_object($OT)->sob_all_height + 10;

		}

	}

}

function nuFFCreateNewTable($sF, $formType, $table, $Pk, $isNew) {

	global $nuConfigDBEngine;
	global $nuConfigDBCollate;
	global $nuConfigDBCharacterSet;

	if (!isset($nuConfigDBEngine)) 			$nuConfigDBEngine = "MyISAM";
	if (!isset($nuConfigDBCollate)) 		$nuConfigDBCollate = "utf8_general_ci";
	if (!isset($nuConfigDBCharacterSet))	$nuConfigDBCharacterSet = "utf8";

	nuFFCreateTable($sF, $formType, $table, $Pk, $isNew, false);

	nuRunQuery("ALTER TABLE $table ENGINE = $nuConfigDBEngine;");
	nuRunQuery("ALTER TABLE $table CONVERT TO CHARACTER SET $nuConfigDBCharacterSet COLLATE $nuConfigDBCollate");

}

function nuFFInsertBrowse($sF, $formId, $formType) {

	if (!nuStringStartsWith('browse', $formType)) return;

	for($i = 0 ; $i < count($sF->rows) ; $i++){

		if($sF->rows[$i][6] == 1 and $sF->deleted[$i] == 0){	//-- ff_browse ticked and not set as deleted

			$label	= $sF->rows[$i][1];							//-- ff_label
			$id		= $sF->rows[$i][2];							//-- ff_field	

			$sql	= "

				INSERT INTO zzzzsys_browse
					(zzzzsys_browse_id,
					sbr_zzzzsys_form_id,
					sbr_title,
					sbr_display,
					sbr_align,
					sbr_format,
					sbr_order,
					sbr_width)
				VALUES
					(?, ?, ?, ?, ?, ?, ?, ?)
			
			";

			$array = Array(nuID(), $formId, $label, $id, 'l', '', ($i+1) * 10, 250);

			nuRunQuery($sql, $array);

		}

	}

}

function nuFFInsertObjects($table, $TT, $formType, $formId) {

	if ($formType !== 'subform'){
		nuFFInsertRunButton($table, $TT, $formType, $formId);
	}

	//if ($formType !== 'browse'){
		nuRunQuery("INSERT INTO zzzzsys_object SELECT * FROM $TT");
	//}

}	

function nuFFInsertRunButton($table, $TT, $formType, $formId) {
	
	//----------make sure button has a tab--------

	$sql = "

		REPLACE
		INTO zzzzsys_tab(
			zzzzsys_tab_id,
			syt_zzzzsys_form_id,
			syt_title,
			syt_order
		)
		VALUES(
			'nufastforms',
			'nuuserhome',
			'Fast Forms',
			-1
		);

	";

	nuRunQuery($sql);

	//----------add run button--------------------

	$sql = "

		INSERT INTO $TT
			(zzzzsys_object_id,
			sob_all_zzzzsys_form_id,
			sob_all_zzzzsys_tab_id,
			sob_all_id,
			sob_all_label,
			sob_all_table,
			sob_all_order,
			sob_all_top,
			sob_all_left,
			sob_all_width,
			sob_all_height,
			sob_run_zzzzsys_form_id,
			sob_run_id,
			sob_run_method,
			sob_all_cloneable,
			sob_all_validate,
			sob_all_access,
			sob_all_align,
			sob_all_type)
		VALUES
			(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)

	";

	$recordId	= substr($formType, 0, 6) == 'browse' ? '' : '-1';
	$array		= Array(nuID(), 'nuuserhome', 'nufastforms', "ff".$formId, ucfirst($table), '', 11, nuFFObjectMaxTop(), 30, 150, 30, $formId, $recordId, 'b', 0, 0, 0, 'center', 'run');

	nuRunQuery($sql, $array);

}

function nuFFGetLink($formId, $recordId, $text) {
	return "var link	= '<a href=\"javascript:void(0);\" onclick=\"' + \"nuForm('$formId','$recordId','', '','2')\" + '\">' + '<b>$text</a></b>';";
}

function nuFFCreatedMessage($table, $TT, $isNew, $formId, $formType, $formCode) {

	$msg = ($isNew) ? 'Table and Form have' : 'Form has';
															   

	if ($formType == 'subform') {

		$link = nuFFGetLink('nuform', $formId, $formCode);
		$js = "
			var m1		= '<h2>A $msg been created!</h2>';					   
			$link
			var m2		= '<p>(There is now a Form with a Code of ' + link + ' found in <b>Forms</b>)';
		";

	}
	else {

		$link = nuFFGetLink('nuuserhome', '-1', 'Fast Forms');
		$js = "
			var m1		= '<h2>A $msg been created!</h2>';
			$link
			var m2		= '<p>(There is now a Button called <b>$table</b> on the <b>' + link + '</b> tab of the <b>User Home</b> Form)</p>';
		";

	}

	$js .= "
		nuMessage([m1, m2]);
		$('#nunuRunPHPHiddenButton').remove();
	";

	nuJavascriptCallback($js);

}

	
function nuBuildFastReport(){

	if (nuDemo()) return;

	$t	= nuRunQuery("SELECT COUNT(*) AS fastreports FROM zzzzsys_report WHERE sre_code like 'FR%'");
	$fr	= db_fetch_object($t)->fastreports;

	$i	= nuID();
	$c	= "FR$fr";
	$d	= "Fast Report $fr";
	$g	= "Fast Report";
	$j	= nuHash();
	$j	= str_replace('\"', '"', $j['fieldlist']);
	$t	= nuHash();
	$t	= $t['table'];
	$f	= 'nublank';
	$s	= "
			INSERT INTO zzzzsys_report
			(
				zzzzsys_report_id, 
				sre_code, 
				sre_description, 
				sre_group, 
				sre_zzzzsys_php_id, 
				sre_zzzzsys_form_id, 
				sre_layout
			) 
			VALUES 
			(
				?,
				?,
				?,
				?,
				?,
				?,
				?
			)

	";

	nuRunQuery($s, array($i, $c, $d, $g, $t, $f, $j));


	$js		= "

		var m1	= '<h1>A Fast Report has been created!</h1>';
		var m2	= '<p>(There is now a Report with a Code of <b>$c</b> found in <b>Reports</b>)';

		nuMessage([m1, m2]);

		$('#nunuRunPHPHiddenButton').remove();

	";

	nuJavascriptCallback($js);

}

?>
