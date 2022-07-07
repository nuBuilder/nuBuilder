<?php

function nuValidateSubforms(){

	$nudata		= $_POST['nuHash']['nuFORMdata'];

	nuCheckAccessLevel($nudata[0]);

	$countNuData = count($nudata);
	for($d = 0 ; $d < $countNuData ; $d++){

		$sf			= $nudata[$d];
		$a			= array();
		$L			= array();
		$s	= '
				SELECT
					sob_subform_zzzzsys_form_id,
					sob_all_label,
					sob_all_access
				FROM zzzzsys_object
				WHERE zzzzsys_object_id = ?
			';																						//-- get Form
		$t	= nuRunQuery($s, array($sf->object_id));
		$r	= db_fetch_row($t);
		$f	= nuObjKey($r,0,'') == '' ? $sf->object_id : nuObjKey($r,0);
		$l	= nuObjKey($r,1);

		if(nuObjKey($r,2,'') != 1){																	//-- not readonly

			$s	= 'SELECT sob_all_id AS id, sob_all_label AS label, sob_all_validate AS validate FROM zzzzsys_object WHERE sob_all_zzzzsys_form_id = ? ';			//-- get Objects
			$t	= nuRunQuery($s, array($f));

			while($r = db_fetch_object($t)){
				$a[$r->id]			= $r->validate;
				$L[$r->id]			= $r->label;
			}

			$countRows = count($sf->rows);
			for($i = 0 ; $i < $countRows ; $i++){

				$countFields = count($sf->fields);
				for($I = 1 ; $I < count($sf->fields) ; $I++){

					$fld			= $sf->fields[$I];
					$val			= nuObjKey($a,$fld);
					$label			= '<b>' . nuObjKey($L,$fld) . '</b>';
					$notDeleted		= $sf->deleted[$i] == 0;
					$slabel			= $l == '' ? '' : "($l)";
					$noz			= $i + 1;

					if($val == 1){																	//-- no blanks

						if(($sf->rows[$i][$I] == '' or $sf->rows[$i][$I] == '[]') and $notDeleted){

							if($d == 0){
								nuDisplayError("$label " . nuTranslate('cannot be left blank'));
							}else{
								nuDisplayError("$label ".nuTranslate('on row'). " " .$noz. " " . nuTranslate('cannot be left blank') . " $slabel");
							}

						}

					}

					if($val == 2){																//-- no duplicates

						$dupe	= nuDuplicate($sf, $i, $I);

						if($dupe and $notDeleted){

							if($d == 0){
								nuDisplayError("$label " . nuTranslate('has a duplicate'));
							}else{
								nuDisplayError("$label ".nuTranslate('on row'). " " .$noz. " ". nuTranslate('has a duplicate') . " $slabel");
							}

						}

					}

					if($val == 3){																//-- no duplicates or blanks
						$dupe	= nuDuplicate($sf, $i, $I);
						$blank	 = ($sf->rows[$i][$I] == '' or $sf->rows[$i][$I] == '[]');

						if(($dupe or $blank) and $notDeleted){

							if($d == 0){
								nuDisplayError("$label " . nuTranslate('must be both unique and not blank'));
							}else{
								nuDisplayError("$label ".nuTranslate('on row'). " " .$noz. " ". nuTranslate('must be both unique and not blank') . " $slabel");
							}
						}
					}

				}

			}
		}
	}

}


function nuCheckAccessLevel($data){

	$u		= $_POST['nuHash']['USER_GROUP_ID'];
	$f		= $data->object_id;
	$a		= $data->action;

	if($u == ''){			//-- globeadmin
		return;
	}

	$s		= "SELECT slf_save_button, slf_delete_button FROM zzzzsys_access_form WHERE slf_zzzzsys_access_id = ? AND slf_zzzzsys_form_id = ?";
	$t		= nuRunQuery($s, array($u, $f));
	$r		= db_fetch_object($t);

	if($a == 'save' and $r->slf_save_button != 1){
		nuDisplayError(nuTranslate("Save is disabled for this Access Level"));
	}

	if($a == 'delete' and $r->slf_delete_button != 1){
		nuDisplayError(nuTranslate("Delete is disabled for this Access Level"));
	}

}


function nuDuplicate($S, $R, $F){

	$f		= $S->fields[$F];
	$i		= $S->rows[$R][0];
	$v		= $S->rows[$R][$F];
	$sql	= "SELECT $S->primary_key FROM $S->table WHERE $f = ? AND $S->primary_key != ? ";
	$t		= nuRunQuery($sql, array($v, $i));
	$r		= db_num_rows($t);

	return $r > 0;

}

function nuUpdateDatabase(){

	$form_id		= $_POST['nuHash']['form_id'];
	$nuDelAll		= $_POST['nuHash']['deleteAll'];

	if(nuDemo(false)){
		if ($nuDelAll == 'Yes' || ($nuDelAll == 'No' && strpos($_SESSION['nubuilder_session_data']['DEMO_SAVING_ALLOWED_IDS'], $form_id) === false  )){
			nuDisplayError(nuTranslate('Not available in the Demo')."..");
			return;
		}
	}

	$nudata			= $_POST['nuHash']['nuFORMdata'];
	$nuMainID		= $_POST['nuHash']['record_id'];
	$formProp 		= nuGetFormProperties($form_id);
	$form_type		= $formProp->sfo_type;
	$recordID		= $_POST['nuHash']['RECORD_ID'];

	if (!nuGlobalAccess(true)) {
		$dm = nuGetFormPermission($form_id,'slf_data_mode');

		if ($nuDelAll == 'No' && $dm == "0" && $recordID != '-1') { // No Edits
				nuDisplayError(nuTranslate('Changes to existing records are not allowed'));
				return;
		}

	}

	nuValidateSubforms();

	$nuMainTable	= $nudata[0]->table;
	$EFid			= $nudata[0]->object_id;
	$cts			= nuGetJSONData('clientTableSchema');
	$user			= $_POST['nuHash']['USER_ID'];

	if($nuDelAll !== 'Yes'){
		// Global Before Save event
		$p = nuProcedure('nuBeforeSave');
		if($p != '') { eval($p); }
		if(count($_POST['nuErrors']) > 0){return;}

		// Form's Before Save event
		$_POST['nudata'] = $nudata;
		nuEval($EFid . '_BS');
		if(count($_POST['nuErrors']) > 0){return;}
		$nudata = $_POST['nudata'];
	}

	$S = array();

	$countNuData = count($nudata);
	for($d = 0 ; $d < $countNuData ; $d++){

		$sf			= $nudata[$d];
		$action		= $sf->action;
		$rows		= $sf->rows;
		$edited		= $sf->edited;
		$deleted	= $sf->deleted;
		$fields		= $sf->fields;
		$table		= $sf->table;
		$pk			= $sf->primary_key;
		$fk			= $sf->foreign_key;
		$fv			= $_POST['nuHash']['record_id'];
		$auto		= nuAutoNumbers($sf->object_id);

		$tableCts =	nuObjKey($cts, $table);

		$names = nuObjKey($tableCts,'names');

		if($names != null && is_array($names)){
			$CTSTN = $names;
		}else{
			$CTSTN = array();
		}

		$log		= in_array($table . '_nulog', $CTSTN);

		$countRows = count($rows);
		for($r = 0 ; $r < $countRows ; $r++){

			if ($d == 0 && $recordID == '-1') {		// Main form
				$editedRow = nuEditedRow($edited[$r]) || nuSubFormsEdited($nudata);
			} else {
				$editedRow = nuEditedRow($edited[$r]);
			}

			if($editedRow){

				$F					= array();
				$I					= array();
				$V					= array();
				$edit				= $edited[$r];
				$row				= $rows[$r];
				$pv					= $row[0];
				$nv					= nuID();

				if($pv == '-1'){

					$nv				= nuBuildPrimaryKey($table, $pk);
					$id				= "'$nv'";

					if($d == 0){$nuMainID = $nv;}

				}else{

					$id				= "'$pv'";

					if($d == 0){$nuMainID = $pv;}

				}

				$V					= array();																		//-- primary key id
				$I					= array();

				if($nv != 'autoid'){

					$V[]			= $id;																			//-- primary key id
					$I[]			= $pk;

				}

				if($fk == ''){
					$rec_id			= $id;
				}else{

					$V[]			= "'$nuMainID'";
					$I[]			= "`$fk`";

				}

				$countR =  count($row);
				for($R = 1 ; $R < $countR ; $R++){

					$isAN			= in_array($fields[$R], $auto);

					if($edit[$R] == 1 or $isAN){																	//-- has been edited

						if(nuObjKey($cts,$table,'') == ''){															//-- not valid table name

							if($form_type == 'launch'){
								nuDisplayError(nuTranslate("Launch Forms Cannot Be Saved"));
							}else{
								nuDisplayError("<b>$table</b> ". nuTranslate("is not a valid table name for a Subform"));
							}

							return;

						}

						$idx = array_search($fields[$R], $CTSTN);
						if($idx !== false && ! ($log && substr($fields[$R],-strlen("_nulog"))=== "_nulog")){		//-- valid field names and not nulog column

							if($isAN){
								$v	= nuAutoNumber($sf->object_id, $fields[$R], $row[$R]);
							}else{
								$v	= $row[$R];
							}

							$fld	= $fields[$R];

							$type = $cts[$table]['types'][$idx];													//-- date types: null if empty
							if (in_array($type, array('date','datetime','timestamp','year')) && $v == '') {
								$V[]	= "null";
								$F[]	= "`$fld` = null";
							} else
							{
								$add = addslashes($v);
								$V[]	= "'$add'";
								$F[]	= "`$fld` = '$add'";
							}

							$I[]	= "`$fld`";

						}

					}

				}

				if($log){

					$jd			= new stdClass;
					$jd->added	= Array('user' => $user, 'time' => time());
					$je			= addslashes(json_encode($jd));
					$V[]		= "'$je'";
					$I[]		= "`$table"."_nulog`";

				}

				if (true) { // !empty($F)

					$fs				= implode(', ', $F);																//-- for update statement
					$vs				= ' VALUES (' . implode(', ', $V) . ')';
					$is				= ' (' . implode(', ', $I) . ')';

					if($action == 'save'){

						if($pv == '-1'){

							if($deleted[$r] == '0'){

								$sql	= "INSERT INTO $table $is $vs;";
								$S[]	= $sql;

							}

						}else{

							$sql		= "UPDATE $table SET $fs WHERE `$pk` = '$pv';";

							$S[]		= $sql;

							if($log){

								$sql	= "SELECT $table" . "_nulog FROM $table WHERE `$pk` = '$pv';";
								$logt	= nuRunQuery($sql);
								$logr	= db_fetch_row($logt);
								$jd		= json_decode($logr[0]);

								if(gettype($jd) == 'object'){
									$jd->edited	= Array('user' => $user, 'time' => time());
								}else{

									$jd			= new stdClass;
									$jd->added	= Array('user' => 'unknown', 'time' => 0);
									$jd->edited	= Array('user' => $user, 'time' => time());

								}

								$je		= addslashes(json_encode($jd));
								$sql	= "UPDATE $table SET $table" . "_nulog = '$je' WHERE `$pk` = '$pv';";
								$S[]	= $sql;

							}

						}

					}

				}

			}

		}

		$countDeleted = count($deleted);
		for($i = 0 ; $i < $countDeleted ; $i++){

			$id				= $rows[$i][0];

			if($action == 'delete' || $deleted[$i] == '1'){

				if($id != '-1'){

					$sql	= "DELETE FROM $table WHERE `$pk` = '$id';";
					$S[]	= $sql;

				}

			}

		}

	}

	if($nuDelAll == 'Yes'){

		$p	= nuProcedure('nuBeforeDelete');
		if($p != '') { eval($p); }
		if(count($_POST['nuErrors']) > 0){return;}

		nuEval($EFid . '_BD');

		$S= array_reverse($S);				//-- delete children first

	}

	if(count($_POST['nuErrors']) > 0){return;}

		if($S != null){

		$countS = count($S);
		for($i = 0 ; $i < $countS ; $i++){

			$sql			= $S[$i];
			$insert			= "INSERT INTO $nuMainTable";
			$length			= strlen($insert);

			nuRunQuery($sql);

			if(substr($sql, 0, $length) == $insert and $nuMainID == 'autoid'){

				$t			= nuRunQuery('SELECT LAST_INSERT_ID()');
				$nuMainID	= db_fetch_row($t);
				$nuMainID	= $nuMainID[0];

			}
		}

	}

	nuChangeHashVariable('RECORD_ID', $nuMainID);

	if($nuDelAll == 'Yes'){

		$p = nuProcedure('nuAfterDelete');
		if($p != '') { eval($p); }
		if(count($_POST['nuErrors']) > 0){return;}

		nuEval($EFid . '_AD');

	}else{

		$p = nuProcedure('nuAfterSave');
		if($p != '') { eval($p); }
		if(count($_POST['nuErrors']) > 0){return;}

		nuEval($EFid . '_AS');
	}

	$_POST['nuAfterEvent'] = true;

	return $_POST['nuHash']['RECORD_ID'];

}

function nuGetNuDataValue($nudata, $formId, $field) {

	if($formId == '') $formId = 'nuBuilder4EditForm';

	$count = count($nudata);
	for($d = 0 ; $d < $count ; $d++){
		$sf = $nudata[$d];
		if ($formId == $sf->id) {
			$key = array_search($field, $sf->fields);
			if ($key != false) {
				return $sf->rows[0][$key];
			}
		}
	}

}

function nuSetNuDataValue(&$nudata, $formId, $field, $value) {

	if($formId == '') $formId = 'nuBuilder4EditForm';

	$count = count($nudata);
	for($d = 0 ; $d < $count ; $d++){
		$sf = $nudata[$d];
		if ($formId == $sf->id) {
			$key = array_search($field, $sf->fields);
			if ($key != false) {
				$nudata[$d]->rows[0][$key] = $value;
				$nudata[$d]->edited[0][$key] = 1;
				return true;
			}
		}
	}

	return false;

}

function nuBuildPrimaryKey($t, $p){

	$autopk	= db_is_auto_id($t, $p);

	if($autopk){
		$v	= 'autoid';
	}else{
		$v	= nuID();
	}

	return $v;

}


function nuEditedRow($e){

	$t	= 0;

	$count = count($e);
	for($i = 0 ; $i < $count ; $i++){
		$t	= $t + $e[$i];
	}

	return $t > 0;			//-- something has been edited

}

function nuSubFormsEdited($nudata) {

	$c = count($nudata);

	if ($c == 1) return false; // no subforms

	for($d = 1 ; $d < $c ; $d++){
		$sf			= $nudata[$d];
		$edited		= $sf->edited;
		$rows		= $sf->rows;

		$countRows = count($rows);
		for($r = 0 ; $r < count($countRows) ; $r++){
			if(nuEditedRow($edited[$r])){
				return true;
			}
		}

	}
	return false;
}

function nuDeleteRow($r, $p){

	nuRunQuery("DELETE FROM `$r->sfo_table` WHERE `$r->sfo_primary_key` = ? ", array($p));

}

function nuInsertRow($r, $p){

	$T	= nuRunQuery("SELECT COUNT(*) FROM `$r->sfo_table` WHERE `$r->sfo_primary_key` = ? ", array($p));
	$R	= db_fetch_row($T);

	if($R[0] == 0){
		nuRunQuery("INSERT INTO `$r->sfo_table` (`$r->sfo_primary_key`) VALUES (?) ", array($p));
	}

}

function nuUpdateRow($r, $p, $row, $FK){

	if($row['fk'] != ''){		//-- (if == it's not the parent record add foreign key)

		$row['f'][]	= $row['ff'];
		$row['v'][]	= $FK;

	}

	$set			= array();
	$columns		= db_field_names($r->sfo_table);
	$objects		= nuEditObjects($r->zzzzsys_form_id);
	$q				= array();

	$countF = count($row['f']);
	for($i = 0 ; $i < $countF ; $i++){

		if(array_search($row['f'][$i], $columns) !== false){

			$set[]	= $row['f'][$i] . ' = ? ';
			$q[]	= nuFormatValue($row, $i);

		}

	}

	if(count($set) > 0){

		$q[]		= $p;
		$s	= "UPDATE `$r->sfo_table` SET " . implode(', ', $set) . " WHERE `$r->sfo_primary_key` = ? ";
		nuRunQuery($s, $q);

	}

}


function nuEditObjects($id){

	$a	= array();
	$s	= "SELECT sob_all_id FROM zzzzsys_object WHERE sob_all_zzzzsys_form_id = '$id' ORDER BY sob_all_order";
	$t	= nuRunQuery($s);

	while($r = db_fetch_object($t)){

		$a[]	= $r->sob_all_id;

	}

	return $a;

}


function nuAutoNumber($form_id, $field_id, $value){

	$s		= "SELECT sob_all_type, sob_input_type, zzzzsys_object_id FROM zzzzsys_object WHERE sob_all_zzzzsys_form_id = ? AND sob_all_id = ? ";
	$t		= nuRunQuery($s, array($form_id, $field_id));
	$r		= db_fetch_object($t);
	$input	= $r->sob_all_type == 'input';
	$auto	= $r->sob_input_type == 'nuAutoNumber';
	$newno	= nuHasNewRecordID() || nuHasNoRecordID();

	if($input and $auto and $newno){
		return nuUpdateCounter($r->zzzzsys_object_id);
	}

	return $value;

}


function nuUpdateCounter($id){

	$n		= nuID();
	$sql	= "SELECT sob_input_count, sob_input_javascript FROM zzzzsys_object	WHERE zzzzsys_object_id = '$id'";

	for($i = 0 ; $i < 10 ; $i++){

		nuRunQuery("UPDATE zzzzsys_object SET sob_input_javascript = '$n' WHERE zzzzsys_object_id = '$id' AND sob_input_javascript = ''");

		$t		= nuRunQuery($sql);
		$r		= db_fetch_object($t);
		$c		= $r->sob_input_count + 1;
		$a		= $r->sob_input_javascript;

		if($a == $n){

			nuRunQuery("UPDATE zzzzsys_object SET sob_input_javascript = '', sob_input_count = '$c' WHERE zzzzsys_object_id = '$id'");

			return $c;

		}

	}

	nuDisplayError(nuTranslate('Could not get AutoNumber'));

	return -1;

}



function nuAutoNumbers($form_id){

	$s			= "
					SELECT sob_all_id
					FROM zzzzsys_object
					WHERE sob_all_zzzzsys_form_id	= ?
					AND sob_all_type				= 'input'
					AND sob_input_type				= 'nuAutoNumber'
				";

	$t			= nuRunQuery($s, array($form_id));
	$a			= array();

	while($r = db_fetch_object($t)){
		$a[]	= $r->sob_all_id;
	}

	return $a;

}

function nuFormatValue($row, $i){

	$form_id	= $row['fm'];
	$field		= $row['f'][$i];

	$s			= "SELECT sob_all_type, sob_select_multiple, sob_input_type, zzzzsys_object_id FROM zzzzsys_object WHERE sob_all_zzzzsys_form_id = ? AND sob_all_id = ? ";
	$t			= nuRunQuery($s, array($form_id, $field));
	$r			= db_fetch_object($t);

	if($r->sob_all_type == 'select' and $r->sob_select_multiple == '1' and $row['v'][$i] != ''){
		return json_encode($row['v'][$i]);

	}else if($r->sob_all_type == 'input' and $r->sob_input_type == 'nuAutoNumber'){

		if(nuHasNewRecordID()){
			return nuUpdateCounter($r->zzzzsys_object_id);
		}

	}else{

		return $row['v'][$i];

	}

}


function nuHasNoRecordID(){
	return $_POST['nuHash']['RECORD_ID'] == -1;
}


function nuHasNewRecordID(){
	return $_POST['nuHash']['PREVIOUS_RECORD_ID'] != $_POST['nuHash']['RECORD_ID'];
}

function nuChangeHashVariable($h, $v){
	$_POST['nuHash'][$h]	= $v;
}

function nuReturnNewRecord($i = -1){

	$_POST['nuHash']['RECORD_ID'] = $i;
}


function nuDisplayError($m){
	$_POST['nuErrors'][]	= $m;
}


function nuCheckAccess($f, $r = ''){

	if(in_array($f, $_POST['forms'])){
		return 1;
	}else{


		if($r == '' or $r == '-1' or in_array($r, array_merge($_POST['reports'], $_POST['procedures']))){
			return 2;
		}else{

			nuDisplayError(nuTranslate("Access Denied")."..");

			return 3;

		}

		nuDisplayError(nuTranslate("Access Denied")."..");

		return 4;

	}

}

function nuSubformObject($id){

	if($id == ''){
		$id	= 'nuBuilder4EditForm';
	}

	$sfs	= $_POST['nuHash']['nuFORMdata'];

	$count = count($sfs);
	for($i = 0 ; $i < $count ; $i++){

		if($sfs[$i]->id == $id){
			return $sfs[$i];
		}

	}

	return false;

}

function nuDeleteForm($f){

	$s		= "DELETE FROM zzzzsys_browse WHERE sbr_zzzzsys_form_id = ? ";
	$t		= nuRunQuery($s, array($f));
	$s		= "DELETE FROM zzzzsys_tab WHERE syt_zzzzsys_form_id = ? ";
	$t		= nuRunQuery($s, array($f));
	$s		= "DELETE FROM zzzzsys_php WHERE zzzzsys_php_id LIKE CONCAT(?, '_') ";
	$t		= nuRunQuery($s, array($f));
	$s		= "DELETE FROM zzzzsys_object WHERE sob_all_type = 'run' AND sob_run_zzzzsys_form_id = ? ";
	$t		= nuRunQuery($s, array($f));
	$s		= "SELECT * FROM zzzzsys_object WHERE sob_all_zzzzsys_form_id = ? ";
	$t		= nuRunQuery($s);

	while($r = db_fetch_object($t)){

		$i	= $r->zzzzsys_object;
		$s	= "DELETE FROM zzzzsys_event WHERE sev_zzzzsys_object_id = ? ";
		$t	= nuRunQuery($s, array($i));
		$s	= "DELETE FROM zzzzsys_php WHERE zzzzsys_php_id LIKE CONCAT(?, '_')";
		$t	= nuRunQuery($s, array($i));

	}

	$s		= "DELETE FROM zzzzsys_object WHERE sob_all_type = 'run' AND sob_run_zzzzsys_form_id = ? ";
	$t		= nuRunQuery($s, array($f));

}

function nuGetFile(){

	$f		= $_POST['nuSTATE']['fileCode'];

	$s		= "SELECT sfi_json FROM zzzzsys_file WHERE sfi_code = ? ";
	$t		= nuRunQuery($s, array($f));
	$r		= db_fetch_object($t);

	return db_num_rows($t) == 1 ? $r->sfi_json : null;

}

function nuLogout(){

	$i		= $_SESSION['nubuilder_session_data']['SESSION_ID'];
	unset($_SESSION['nubuilder_session_data']['SESSION_ID']);

	$s		= "DELETE FROM zzzzsys_session WHERE zzzzsys_session_id = ? ";

	nuRunQuery($s, array($i));

}

?>