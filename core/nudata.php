<?php

function nuValidateFormsFetchObject($objectId) { 

		$query = '
				SELECT
					sob_subform_zzzzsys_form_id as form_id,
					sob_all_label as label,
					sob_all_access as access,
					zzzzsys_form.sfo_description as form_description
				FROM zzzzsys_object
				LEFT JOIN zzzzsys_form ON zzzzsys_form_id = sob_subform_zzzzsys_form_id 
				WHERE zzzzsys_object_id = ?
			';

		$stmt	= nuRunQuery($query, [$objectId]);

		if (db_num_rows($stmt) === 0) {
			$obj = [
				'formId' => $objectId,
				'label' => '',
				'access' => '',
				'form_description' => ''
			];
		} else {

			$row = db_fetch_object($stmt);
			$obj = [
				'formId' => $row->form_id,
				'label' => $row->label,
				'access' => $row->access,
				'form_description' => $row->form_description
			];

		}
		
		return $obj;

}

function nuValidateFormsFetchFormObjects($formId) { 

		$query = '
			SELECT
				sob_all_id AS id,
				sob_all_label AS label,
				sob_all_validate AS validate
			FROM
				zzzzsys_object
			WHERE
				sob_all_zzzzsys_form_id = ?		
		'; 

		$stmt = nuRunQuery($query, [$formId]);

		$validate = [];
		$label = [];
		
		while ($row = db_fetch_object($stmt)) {
			$validate[$row->id] = $row->validate;
			$label[$row->id] = $row->label;
		}

		$obj = [
			'validate' => $validate,
			'label' => $label
		];
	
		return $obj;

}

function nuWrapWithTag($value, $tag) {
	return '<' . $tag . '>' . $value . '</' . $tag . '>';
}

function nuValidateForms() {

    $formData = $_POST['nuHash']['nuFORMdata'];
    
    if (!nuCheckAccessLevel($formData[0])) {
        return false;
    }

    $errorCount = 0;
    $formDataCount = count($formData);
    
    for ($formIndex = 0; $formIndex < $formDataCount; $formIndex++) {

        $form = $formData[$formIndex];
        $formObject = nuValidateFormsFetchObject($form->object_id);
        $formId = $formObject['formId'];
        $objectLabel = $formObject['label'];
        $accessLevel = $formObject['access'];
        $formDescription = $formObject['form_description'];

        if ($accessLevel == 1) {
            continue; // read-only
        }

        $formObjects = nuValidateFormsFetchFormObjects($formId);
        $validationRules = $formObjects['validate'];
        $fieldLabels = $formObjects['label'];
        
        $formDescription = $formIndex > 0 ? "($formDescription)" : '';

        $rowCount = count($form->rows);
        for ($rowIndex = 0; $rowIndex < $rowCount; $rowIndex++) {
			
            $fieldCount = count($form->fields);
            for ($fieldIndex = 1; $fieldIndex < $fieldCount; $fieldIndex++) {
                $field = $form->fields[$fieldIndex];
                $validationType = nuObjKey($validationRules, $field);
                $fieldLabel = nuWrapWithTag(nuObjKey($fieldLabels, $field), 'b');
                $rowDeleted = $form->deleted[$rowIndex] == 0;
                $rowValue = $form->rows[$rowIndex][$fieldIndex];
                
                $errorCount += nuValidateFormsRequiredFields($form, $formIndex, $rowIndex, $validationType, $rowValue, $fieldLabel, $formDescription, $rowDeleted, $fieldIndex);
            }
        }
    }
    
    return $errorCount == 0;

}

function nuDisplayErrorRequiredFields($formIndex, $row, $label, $formDescription, $errorMf, $errorSf) {

	if ($formIndex === 0) {
		
		nuDisplayError("$label " . nuTranslate($errorSf));
		// DEV:
		// nuDisplayError(nuTranslate($errorMf, $label)); 
	}
	else {
		nuDisplayError("$label " . nuTranslate('on row') . " " . $row + 1 . " " . nuTranslate("$errorSf") . " " .$formDescription);
	}

}

function nuValidateFormsRequiredFields($form, $formIndex, $row, $validationType, $rowValue, $label, $formDescription, $rowDeleted, $fieldLabel) {	

	switch ($validationType) {
	case 1:		// No blanks	
		if (($rowValue === '' || $rowValue === '[]') && $rowDeleted) {
			nuDisplayErrorRequiredFields($formIndex, $row, $label, $formDescription, '%s cannot be left blank', 'cannot be left blank');
			return 1;
		}
		break;

	case 2:		// No duplicates
		if (nuDuplicate($form, $row, $fieldLabel) && $rowDeleted) {
			nuDisplayErrorRequiredFields($formIndex, $row, $label, $formDescription, '%s has a duplicate', 'has a duplicate');
			return 1;
		}
		break;

	case 3:		// No duplicates or blanks
		$isDuplicate = nuDuplicate($form, $row, $fieldLabel);
		$isBlank = ($rowValue === '' || $rowValue === '[]');

		if (($isDuplicate || $isBlank) && $rowDeleted) {
			nuDisplayErrorRequiredFields($formIndex, $row, $label, $formDescription, '%s must be both unique and not blank', 'must be both unique and not blank');
			return 1;
		}
	}
	
	return 0;

}

function nuCheckAccessLevel($data) {

	$userId = $_POST['nuHash']['USER_GROUP_ID'];
	$objectId = $data->object_id;
	$action = $data->action;

	if (empty($userId)) {
		return true;
	}

	try {

		$query = "SELECT slf_save_button, slf_delete_button FROM zzzzsys_access_form WHERE slf_zzzzsys_access_id = ? AND slf_zzzzsys_form_id = ?";
		$stmt = nuRunQuery($query, [$userId, $objectId]);
		if (!$stmt) {
			throw new Exception("An error occurred while fetching access level data.");
		}

		$numRows = db_num_rows($stmt);		
		$accessLevel = $numRows === 0 ? null : db_fetch_object($stmt);
	
		if ($action === 'save' && ($accessLevel === NULL || $accessLevel->slf_save_button != 1)) {
			throw new Exception("Save is disabled for this access level.");
		}

		if ($action === 'delete' && ($accessLevel === NULL || $accessLevel->slf_delete_button != 1)) {
			throw new Exception("Delete is disabled for this access level.");
		}

	}
	catch(Exception $e) {
		nuDisplayError(nuTranslate($e->getMessage()));
		return false;
	}
	
	return true;

}

function nuDuplicate($form, $row, $fieldLabel) {

	$field = $form->fields[$fieldLabel];
	$pk = $form->rows[$row][0];
	$value = $form->rows[$row][$fieldLabel];

	$query = "SELECT `$form->primary_key` FROM `$form->table` WHERE `$field` = ? AND `$form->primary_key` != ?";
	$stmt = nuRunQuery($query, [$value, $pk]);
	return db_num_rows($stmt) > 0;

}

function nuUpdateDatabaseSave($recordId, $row, $pk, $table, $deleted, $log, $userId, &$sql, &$updateData) {

	$columns = implode(', ', $updateData->columns);
	$values = ' VALUES (' . implode(', ', $updateData->values) . ')';
	$inserts = ' (' . implode(', ', $updateData->inserts) . ')';

	if ($recordId == '-1') {

		if ($deleted[$row] == '0') {
			$sql[] = "INSERT INTO `$table` $inserts $values;";
		}

	}
	else {

		$sql[] = "UPDATE `$table` SET $columns WHERE `$pk` = '$recordId';";

		if ($log) {

			$stmt = nuRunQuery("SELECT `$table" . "_nulog` FROM `$table` WHERE `$pk` = '$recordId';");
			$logRow = db_fetch_row($stmt);
			$logData = json_decode($logRow[0]);

			if (gettype($logData) == 'object') {
				$logData->edited = ['user' => $userId, 'time' => time() ];
			}
			else {

				$logData = new stdClass;
				$logData->added = ['user' => 'unknown', 'time' => 0];
				$logData->edited = ['user' => $userId, 'time' => time() ];

			}

			$je = addslashes(json_encode($logData));
			$sql[] = "UPDATE `$table` SET `$table" . "_nulog` = '$je' WHERE `$pk` = '$recordId';";

		}

	}

}

function nuUpdateDatabaseDelete($table, $pk, $deleted, $rows, $action, &$sqls) {

	$deletedCount = count($deleted);
	for ($i = 0;$i < $deletedCount;$i++) {
		$id = $rows[$i][0];
		if ($action == 'delete' || $deleted[$i] == '1') {
			if ($id != '-1') {
				$sql	= "DELETE FROM $table WHERE `$pk` = '$id';";
				$sqls[] = $sql;
			}
		}
	}

}

function nuGetDBTypesSetNullWhenEmpty() {

	global $nuConfigDBTypesSetNullWhenEmpty;
	if (!is_array($nuConfigDBTypesSetNullWhenEmpty)) {
		$nuConfigDBTypesSetNullWhenEmpty = [
			"integer",
			"int",
			"mediumint",
			"longint",
			"decimal",
			"float",
			"real",
			"double",
			"serial",
			"date",
			"datetime",
			"timestamp",
			"year",
		];
		//	"tinyint",
		//	"bit",
		//	"boolean",
	}
	return $nuConfigDBTypesSetNullWhenEmpty;
}


function nuUpdateDatabaseHasDataModePermission($formId, $recordID, $deleteAction) {

	if (nuGlobalAccess(true)) {
		return true;
	}

	$dataMode = nuGetFormPermission($formId, 'slf_data_mode');
	if (!$deleteAction && $dataMode == "0" && $recordID != '-1') { // No Edits
		nuDisplayError(nuTranslate('Changes to existing records are not allowed'));
		return false;
	}

	return true;

}

function nuUpdateDatabase() {

	$nuConfigDBTypesSetNullWhenEmpty = nuGetDBTypesSetNullWhenEmpty();

	$nuHash = $_POST['nuHash'];
	$formId = $nuHash['form_id'];
	$deleteAction = $nuHash['delete_action'];

	if (nuDemo(false)) {
		if ($deleteAction || (!$deleteAction && strpos($_SESSION['nubuilder_session_data']['DEMO_SAVING_ALLOWED_IDS'], $formId) === false)) {
			nuDisplayError(nuTranslate('Not available in the Demo') . "..");
			return;
		}
	}

	class UpdateData {
		public $columns = [];
		public $values = [];
		public $insert = [];
	}

	$nudata = $nuHash['nuFORMdata'];
	$mainRecordId = $nuHash['record_id'];
	$formProp = nuGetFormProperties($formId);
	$formType = $formProp->sfo_type;
	$recordID = $nuHash['RECORD_ID'];

	if (!nuUpdateDatabaseHasDataModePermission($formId, $recordID, $deleteAction)) {
		return;
	}

	if (!nuValidateForms()) return;

	$nuMainTable = $nudata[0]->table;
	$nuDataFormId = $nudata[0]->object_id;

	$clientTableSchema = nuGetJSONData('clientTableSchema');
	$userId = $nuHash['USER_ID'];

	if (!$deleteAction) {
		if (!nuUpdateDatabaseRunBeforeSaveEvents($nudata, $nuDataFormId)) {
			return;
		}
	}

	$sql = [];

	$countNuData = count($nudata);
	for ($formIndex = 0;$formIndex < $countNuData;$formIndex++) {

		$sf = $nudata[$formIndex];

		$action = $sf->action;
		$rows = $sf->rows;
		$edited = $sf->edited;
		$deleted = $sf->deleted;
		$fields = $sf->fields;
		$table = $sf->table;
		$primaryKey = $sf->primary_key;
		$foreignKey = $sf->foreign_key;
		$formId = $sf->object_id;

		$autoNumbers = nuAutoNumbers($formId);
		$tableCts = nuObjKey($clientTableSchema, $table);	
		$tableColumns = nuObjKey($tableCts, 'names') ?? [];
		$log = in_array($table . '_nulog', $tableColumns);

		$countRows = count($rows);
		for ($row = 0;$row < $countRows;$row++) {

			$rowEdited = nuEditedRow($edited[$row], $fields, $tableColumns);
			if ($formIndex == 0 && $recordID == '-1') { // Main form
				$rowEdited = $rowEdited || nuSubFormsEdited($nudata, $tableColumns);
			}

			if ($rowEdited) {

				$updateData = new UpdateData();

				$edit = $edited[$row];
				$currentRow = $rows[$row];
				$recordId = $currentRow[0];

				$mainRecordId = nuUpdateDatabaseSetValues($formIndex, $table, $primaryKey, $foreignKey, $recordId, $mainRecordId, $updateData); // prev: $values, $insertColumns

				$countR = count($currentRow);
				for ($r = 1;$r < $countR;$r++) {
					
					$field = $fields[$r];
					$isAutoNumber = in_array($field, $autoNumbers);

					if ($edit[$r] == 1 or $isAutoNumber) { //-- has been edited

							if (!nuUpdateDatabaseIsValidTable($clientTableSchema, $table, $formType)) {
								return;
							}

							$value = $currentRow[$r];
							nuUpdateDatabaseGetUpdateValue($field, $value, $formId, $table, $tableColumns, $clientTableSchema, $log, $isAutoNumber, $nuConfigDBTypesSetNullWhenEmpty, $updateData);

					}

				}

				if ($log) {
					nuUpdateDatabaseAddNuLog($updateData, $userId, $table);
				}

				if ($action == 'save') {
					nuUpdateDatabaseSave($recordId, $row, $primaryKey, $table, $deleted, $log, $userId, $sql, $updateData);

				}

			}

		}

		nuUpdateDatabaseDelete($table, $primaryKey, $deleted, $rows, $action, $sql);

	}

	if ($deleteAction) {

		nuUpdateDatabaseRunBeforeDeleteEvent($nudata);

		nuEval($nuDataFormId . '_BD');
		$sql = array_reverse($sql); //-- delete children first
		
	}

	if (nuHasErrors()) {
		return;
	}


	$mainRecordId = nuUpdateDatabaseExecStatements($sql, $nuMainTable, $mainRecordId);

	nuChangeHashVariable('RECORD_ID', $mainRecordId);

	if ($formProp->sfo_code === 'nuform' && $deleteAction) {
		nuDeleteForm($recordID);
	} else {
		nuUpdateDatabaseRunAfterEvents($deleteAction, $nuDataFormId);
	}

	$_POST['nuAfterEvent'] = true;

	return $_POST['nuHash']['RECORD_ID'];

}

function nuUpdateDatabaseAddNuLog(&$updateData, $userId, $table) {

	$jd = new stdClass;
	$jd->added = ['user' => $userId, 'time' => time() ];
	$je = addslashes(json_encode($jd));
	$updateData->values[] = "'$je'";
	$updateData->inserts[] = "`$table" . "_nulog`";

}
					
function nuUpdateDatabaseIsValidTable($clientTableSchema, $table, $formType) {
	
	if (nuObjKey($clientTableSchema, $table, '') == '') { //-- not valid table name

		if ($formType == 'launch') {
			nuDisplayError(nuTranslate("Launch Forms Cannot Be Saved"));
		}
		else {
			nuDisplayError("<b>$table</b> " . nuTranslate("is not a valid table name for a form"));
		}

		return false;
	
	}
	
	return true;
	
}

function nuUpdateDatabaseGetUpdateValue($field, $value, $formId, $table, $tableColumns, $clientTableSchema, $log, $isAutoNumber,  $nuConfigDBTypesSetNullWhenEmpty, &$updateData) {

	$idx = array_search($field, $tableColumns);
	$isNulog = $log && nuStringEndsWith("_nulog", $field);
	
	if ($idx && ! $isNulog) { 								//-- valid field name and not nulog column
		$v = $isAutoNumber ? nuAutoNumber($formId, $field, $value) : $value;

		$type = $clientTableSchema[$table]['types'][$idx];

		$filteredNullableTypes = array_filter($nuConfigDBTypesSetNullWhenEmpty, function ($value) use ($type) {
			return nuStringStartsWith($value, $type);
		});

		if (!empty($filteredNullableTypes) && $v == '') { //-- numeric and date types: null if empty
			$updateData->values[] = "null";
			$updateData->columns[] = "`$field` = null";
		}
		else {
			$add = addslashes($v);
			$updateData->values[] = "'$add'";
			$updateData->columns[] = "`$field` = '$add'";
		}

		$updateData->inserts[] = "`$field`";

	}

}
																														  
function nuUpdateDatabaseSetValues($formIndex, $table, $primaryKey, $foreignKey, $recordId, $mainRecordId, &$updateData) {

	$nv = '';

	if ($recordId == '-1') {

		$nv = nuBuildPrimaryKey($table, $primaryKey);
		$primaryKeyValue = "'$nv'";
		if ($formIndex == 0) {
			$mainRecordId = $nv;
		}

	}
	else {

		$primaryKeyValue = "'$recordId'";
		if ($formIndex == 0) {
			$mainRecordId = $recordId;
		}

	}

	if ($nv != 'autoid') {
		$updateData->values[] = $primaryKeyValue;
		$updateData->inserts[] = $primaryKey;
	}

	if ($foreignKey != '') {
		$updateData->values[] = "'$mainRecordId'";
		$updateData->inserts[] = "`$foreignKey`";
	}

	return $mainRecordId;

}

function nuUpdateDatabaseExecStatements($sql, $nuMainTable, $mainRecordId) {

	$result = $mainRecordId;

	if ($sql != null) {
		$countSql = count($sql);
		for ($i = 0;$i < $countSql;$i++) {
			$sqlLine = $sql[$i];
			$insert = "INSERT INTO $nuMainTable";

			nuRunQuery($sqlLine);

			if (substr($sqlLine, 0, strlen($insert)) == $insert || $mainRecordId == 'autoid') {
				$stmt = nuRunQuery('SELECT LAST_INSERT_ID()');
				$row = db_fetch_row($stmt);
				if ($row !== false && isset($row[0])) {
					$result = $row[0];
				}
			}
		}
	}

	return $result;

}

function nuUpdateDatabaseRunBeforeDeleteEvent(&$nudata) {

	$p = nuProcedure('nuBeforeDelete');
	if ($p != '') {
		eval($p);
	}
	if (nuHasErrors()) {
		return false;
	}

	return true;

}

function nuUpdateDatabaseRunBeforeSaveEvents(&$nudata, $nuDataFormId) {

	// Global Before Save event
	$proc = nuProcedure('nuBeforeSave');
	if ($proc != '') {
		eval($proc);
	}
	if (nuHasErrors()) {
		return false;
	}

	// Form's Before Save event
	$_POST['nudata'] = $nudata;
	nuEval($nuDataFormId . '_BS');
	if (nuHasErrors()) {
		return false;
	}

	$nudata = $_POST['nudata'];

	return true;

}

function nuUpdateDatabaseRunAfterEvents($deleteAction, $dataFormId) {

	$procName = $deleteAction ? 'nuAfterDelete' : 'nuAfterSave';
	$proc = nuProcedure($procName);

	if ($proc) {
		eval($proc);
	}

	if (nuHasErrors()) {
		return;
	}

	$event = $deleteAction ? '_AD' : '_AS';
	nuEval($dataFormId . $event);

}

function nuGetNuDataValue($nudata, $formId, $field) {

	if ($formId == '') $formId = 'nuBuilder4EditForm';

	$count = count($nudata);
	for ($formIndex = 0;$formIndex < $count;$formIndex++) {
		$sf = $nudata[$formIndex];
		if ($formId == $sf->id) {
			$key = array_search($field, $sf->fields);
			if ($key != false) {
				return $sf->rows[0][$key];
			}
		}
	}

}

function nuSetNuDataValue(&$nudata, $formId, $field, $value) {

	if ($formId == '') $formId = 'nuBuilder4EditForm';

	foreach ($nudata as $formIndex => $sf) {
		if ($formId === $sf->id) {
			$key = array_search($field, $sf->fields, true);
			if ($key !== false) {
				$nudata[$formIndex]->rows[0][$key] = $value;
				$nudata[$formIndex]->edited[0][$key] = 1;
				return true;
			}
		}
	}

	return false;

}

function nuBuildPrimaryKey($tableName, $primaryKey) {

	if (db_is_auto_id($tableName, $primaryKey)) {
		return 'autoid';
	}

	return nuID();
}

function nuEditedRow($row, $columnNames, $tableColumns) {

	foreach ($row as $i => $value) {
		if (in_array($columnNames[$i], $tableColumns) && $value > 0) {
			return true;
		}
	}

	return false;

}

function nuSubFormsEdited($nudata, $tableColumns) {

	$countData = count($nudata);
	if ($countData == 1) {
		return false; // no subforms
	}

	for ($formIndex = 1;$formIndex < $countData;$formIndex++) {

		$sf = $nudata[$formIndex];
		$edited = $sf->edited;
		$rows = $sf->rows;
		$fields = $sf->fields;

		$countRows = count($rows);
		for ($row = 0;$row < $countRows;$row++) {
			if (nuEditedRow($edited[$row], $fields, $tableColumns)) {
				return true;
			}
		}

	}

	return false;

}

function nuEditObjects($formId) {

	$query = "SELECT sob_all_id FROM zzzzsys_object WHERE sob_all_zzzzsys_form_id = ? ORDER BY sob_all_order";
	$stmt = nuRunQuery($query, [$formId]);

	$objectIds = [];
	while ($row = db_fetch_object($stmt)) {
		$objectIds[] = $row->sob_all_id;
	}

	return $objectIds;
}

function nuAutoNumber($formId, $fieldId, $value) {

	$query = "SELECT sob_all_type, sob_input_type, zzzzsys_object_id FROM zzzzsys_object WHERE sob_all_zzzzsys_form_id = ? AND sob_all_id = ?";
	$stmt = nuRunQuery($query, [$formId, $fieldId]);
	$row = db_fetch_object($stmt);

	$isInputType = $row->sob_all_type == 'input';
	$isAutoNumber = $row->sob_input_type == 'nuAutoNumber';
	$isNewRecord = nuHasNewRecordID() || nuHasNoRecordID();

	if ($isInputType && $isAutoNumber && $isNewRecord) {
		return nuUpdateCounter($row->zzzzsys_object_id);
	}
	else {
		return $value;
	}
}

function nuUpdateCounter($id){

	$uniqueId	= nuID();
	$sql		= "SELECT sob_input_count, sob_input_javascript FROM zzzzsys_object WHERE zzzzsys_object_id = ?";

	for($i = 0 ; $i < 10 ; $i++){

		nuRunQuery("UPDATE zzzzsys_object SET sob_input_javascript = ? WHERE zzzzsys_object_id = ? AND sob_input_javascript = ?", [$uniqueId, $id, '']);

		$result	= nuRunQuery($sql, [$id]);
		$row	= db_fetch_object($result);
		$count	= $row->sob_input_count + 1;
		$js	= $row->sob_input_javascript;

		if($js == $uniqueId){

			nuRunQuery("UPDATE zzzzsys_object SET sob_input_javascript = ?, sob_input_count = ? WHERE zzzzsys_object_id = ?", ['', $count, $id]);
			return $count;

		}

	}

	nuDisplayError(nuTranslate('Could not get AutoNumber'));
	return -1;

}

function nuAutoNumbers($formId){

	$autoNumbers	= [];
	$query		= "
					SELECT sob_all_id
					FROM zzzzsys_object
					WHERE sob_all_zzzzsys_form_id	= ?
					AND sob_all_type				= ?
					AND sob_input_type				= ?
				";

	$stmt		= nuRunQuery($query, [$formId, 'input', 'nuAutoNumber']);
				   

	while($row = db_fetch_object($stmt)){
		$autoNumbers[]	= $row->sob_all_id;
	}

	return $autoNumbers;

}

function nuFormatValue($rowData, $fieldIndex) {

	$formId = $rowData['fm'];
	$field = $rowData['f'][$fieldIndex];

	// Get the object information from the database
	$s = "SELECT sob_all_type, sob_select_multiple, sob_input_type, zzzzsys_object_id FROM zzzzsys_object WHERE sob_all_zzzzsys_form_id = ? AND sob_all_id = ?";
	$t = nuRunQuery($s, [$formId, $field]);
	$r = db_fetch_object($t);

	// Check if the value is a multiple select
	if ($r->sob_all_type == 'select' && $r->sob_select_multiple == '1' && $rowData['v'][$fieldIndex] != '') {
		return json_encode($rowData['v'][$fieldIndex]);
	}

	// Check if the value is an auto-number field
	if ($r->sob_all_type == 'input' && $r->sob_input_type == 'nuAutoNumber') {
		if (nuHasNewRecordID()) {
			return nuUpdateCounter($r->zzzzsys_object_id);
		}
	}

	// Return the original value
	return $rowData['v'][$fieldIndex];

}

function nuHasNoRecordID() {
	return $_POST['nuHash']['RECORD_ID'] == - 1;
}

function nuHasNewRecordID() {
	return $_POST['nuHash']['PREVIOUS_RECORD_ID'] != $_POST['nuHash']['RECORD_ID'];
}

function nuChangeHashVariable($h, $v) {
	$_POST['nuHash'][$h] = $v;
}

function nuReturnNewRecord($i = - 1) {
	$_POST['nuHash']['RECORD_ID'] = $i;
}

function nuDisplayError($m) {
	$_POST['nuErrors'][] = $m;
}

function nuHasErrors() {
	return count($_POST['nuErrors']) > 0;
}

function nuCheckAccess($f, $r = '') {

	if (in_array($f, $_POST['forms'])) {
		return 1;
	}

	if ($r == '' || $r == '-1' || in_array($r, array_merge($_POST['reports'], $_POST['procedures']))) {
		return 2;
	}

	nuDisplayError(nuTranslate("Access Denied") . "..");
	return 3;

}

function nuSubformObject($id = '') {

	if (empty($id)) {
		$id = 'nuBuilder4EditForm';
	}

	$formData = $_POST['nuHash']['nuFORMdata'];
	foreach ($formData as $subform) {
		if ($subform->id === $id) {
			return $subform;
		}
	}

	return false;

}

function nuDeleteForm($formId){

	$query		= "DELETE FROM zzzzsys_browse WHERE sbr_zzzzsys_form_id = ?";
	$stmt		= nuRunQuery($query, [$formId]);
	$query		= "DELETE FROM zzzzsys_tab WHERE syt_zzzzsys_form_id = ?";
	$stmt		= nuRunQuery($query, [$formId]);
	$query		= "DELETE FROM zzzzsys_php WHERE zzzzsys_php_id LIKE ?";
	$stmt		= nuRunQuery($query, [$formId.'_'.'%']);
	$query		= "DELETE FROM zzzzsys_browse WHERE sbr_zzzzsys_form_id LIKE ?";
	$stmt		= nuRunQuery($query, [$formId]);
	$query		= "DELETE FROM zzzzsys_select WHERE zzzzsys_select_id LIKE ?";
	$stmt		= nuRunQuery($query, [$formId]);
	$query		= "DELETE FROM zzzzsys_select_clause WHERE ssc_zzzzsys_select_id LIKE ?";
	$stmt		= nuRunQuery($query, [$formId.'%']);
	$query		= "DELETE FROM zzzzsys_object WHERE sob_all_type = ? AND sob_run_zzzzsys_form_id = ? ";
	$stmt		= nuRunQuery($query, ['run', $formId]);
	$query		= "SELECT * FROM zzzzsys_object WHERE sob_all_zzzzsys_form_id = ?";
	$stmt		= nuRunQuery($query, [$formId]);

	while($row = db_fetch_object($stmt)){

		$object	= $row->zzzzsys_object_id;
		$query	= "DELETE FROM zzzzsys_event WHERE sev_zzzzsys_object_id = ? ";
		$stmt	= nuRunQuery($query, [$object]);
		$query	= "DELETE FROM zzzzsys_php WHERE zzzzsys_php_id LIKE ?";
		$stmt	= nuRunQuery($query, [$object.'_'.'%']);

	}

	$query		= "DELETE FROM zzzzsys_object WHERE sob_all_zzzzsys_form_id = ? ";
	$stmt		= nuRunQuery($query, [$formId]);

	$query		= "DELETE FROM zzzzsys_form WHERE zzzzsys_form_id LIKE ?";
	$stmt		= nuRunQuery($query, [$formId]);

}


function nuGetFile() {

	$fileCode = $_POST['nuSTATE']['fileCode'];

	$query = "SELECT sfi_json FROM zzzzsys_file WHERE sfi_code = ? ";
	$stmt = nuRunQuery($query, [$fileCode]);
	$obj = db_fetch_object($stmt);

	return db_num_rows($stmt) == 1 ? $obj->sfi_json : null;

}

function nuSetLastLoggedInUser() {
	$user = $_SESSION['nubuilder_session_data']['isGlobeadmin'] ? "globeadmin" : $_SESSION['nubuilder_session_data']['user_id'];
	$_SESSION['nuLastUser']['user_id'] = $user;
}

function nuLogout() {

	// Log last logged in user
	nuSetLastLoggedInUser();

	// Delete session data from the database
	$sessionId = $_SESSION['nubuilder_session_data']['SESSION_ID'];
	$deleteSql = "DELETE FROM zzzzsys_session WHERE zzzzsys_session_id = ?";
	nuRunQuery($deleteSql, [$sessionId]);

	// Unset session data
	unset($_SESSION['nubuilder_session_data']['SESSION_ID']);
}

?>
