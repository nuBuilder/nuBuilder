<?php

function nuFormProperties($formId, $columns = '') {

	$columns = $columns == '' ? '*' : $columns;
	$query = "SELECT $columns FROM zzzzsys_form WHERE zzzzsys_form_id = ?";
	$stmt = nuRunQuery($query, [$formId]);

	return db_num_rows($stmt) == 0 ? false : db_fetch_object($stmt);

}

function nuBeforeBrowse($formId) {

	$_POST['nuMessages'] = [];
	$procedure = nuProcedure('nuBeforeBrowse');

	if ($procedure != '') {
		eval ($procedure);
	}

	if (count($_POST['nuErrors']) > 0) {
		return;
	}

	nuEval("{$formId}_BB");

}
function nuBeforeEdit($FID, $RID) {

	$r = nuFormProperties($FID);

	$GLOBALS['EXTRAJS'] = '';
	$GLOBALS['EXTRAJS_BC'] = '';
	$GLOBALS['STYLE'] = '';

	$ct = $_POST['nuSTATE']['call_type'];

	if ($ct == 'getreport' and $r == '') {
		return;
	}
	if ($ct == 'getform' and $r == '') {
		return;
	}
	if ($r === false)
		return;

	$formType = $_POST['nuSTATE']['form_type'] ?? '';
	$recordID = $_POST['nuSTATE']['record_id'] ?? '';

	if ($ct == 'getform') {

		$logfield = $r->sfo_table . '_nulog';
		$cts = nuGetJSONData('clientTableSchema');
		$user = $_POST['nuHash']['USER_ID'];
		$globalAccess = nuGlobalAccess(true);


		if (!$globalAccess) {
			$ft = nuGetFormPermission($FID, 'slf_form_type');
			if (($recordID == "" && $ft == '1') || ($recordID !== "" && $ft == '0')) {
				nuDisplayError(nuTranslate('Access Denied'));
				return;
			}
		}

		if ((nuObjKey($cts, $r->sfo_table) != NULL && $recordID != '')) {

			if (in_array($logfield, $cts[$r->sfo_table]['names'])) {								//-- valid log field name

				$S = "SELECT $logfield FROM `$r->sfo_table` WHERE `$r->sfo_primary_key` = ? ";

				$T = nuRunQuery($S, [$RID]);

				$jd = '';
				if (db_num_rows($T) == 1) {
					$J = db_fetch_row($T);
					$J = $J[0];
					$_POST['nuLog'] = $J;
					$jd = nuJsonDecode($J);
				}

				if (gettype($jd) == 'object') {
					$jd->viewed = ['user' => $user, 'time' => time()];
				} else {

					$jd = new stdClass;
					$jd->added = ['user' => 'unknown', 'time' => 0];
					$jd->viewed = ['user' => $user, 'time' => time()];

				}

				$je = addslashes(json_encode($jd));
				$S = "UPDATE `$r->sfo_table` SET $logfield = '$je' WHERE `$r->sfo_primary_key` = ? ";
				$T = nuRunQuery($S, [$RID]);

			} else {
				$_POST['nuLog'] = json_encode([]);
			}

		}

	}


	if ($recordID != '' || $formType == 'launch') {
		$p = nuProcedure('nuBeforeEdit');
		if ($p != '') {
			eval ($p);
		}
		if (count($_POST['nuErrors']) > 0) {
			return;
		}

		nuEval($FID . '_BE');
	}


	$js = $r->sfo_javascript;
	$jb = $r->sfo_browse_javascript ?? '';
	$je = $r->sfo_edit_javascript ?? '';

	$js .= $recordID == '' ? ' ' . $jb : ' ' . $je;

	$GLOBALS['STYLE'] = $r->sfo_style ?? '';
	$GLOBALS['EXTRAJS'] .= $js;

}

function nuFormCode($f) {
	return nuFormProperties($f, 'sfo_code')->sfo_code;
}

function nuRunType($runType, $formId) {

	if ($runType === 'P' || nuIsProcedure($formId)) {
		return 'P';
	} elseif ($runType === 'R' || nuIsReport($formId)) {
		return 'R';
	} else {
		return 'F';
	}

}

function nuEvents($r) {
	return $r->sob_all_event ?? '';
}
function nuGetFormObject($formId, $recordId, $numObjects, $defaultTabs = null) {

	$defaultTabs = $defaultTabs ?? nuBuildTabList($formId);

	$response = new stdClass();
	$formObject = nuGetEditForm($formId, $recordId);

	if ($formObject === null) {
		$response->forms[] = $formObject;
		return $response->forms[0];
	}

	nuGetFormSetBasicProperties($formObject, $formId, $recordId);

	$data = nuGetFormData($formObject, $recordId);
	list($formObjects, $cloneableObjects) = nuGetFormProcessObjects($formObject, $formId, $recordId, $data, $defaultTabs, $numObjects);
	nuGetFormFinalize($formId, $formObject, $defaultTabs, $formObjects, $cloneableObjects);

	$response->forms[] = $formObject;

	if ($formObject->browse_filtered_rows == 0) {
		nuOnProcess($formId, $formObject, 'BE', 'nuOnProcessObjects');
	}
	return $response->forms[0];

}

function nuGetFormSetBasicProperties($formObject, $formId, $recordId) {

	$formObject->form_id = $formId;

	if (empty($recordId) && $formObject->form_type == 'launch') {
		$recordId = '-1';
	}

	$formObject->record_id = $recordId;

}

function nuGetFormData($formObject, $recordId) {

	if (!isset($formObject->table) || $formObject->table == '' || $recordId == '') {
		return [];
	} else {
		$query = "SELECT * FROM `$formObject->table` WHERE `$formObject->primary_key` = ?";
		$stmt = nuRunQuery($query, [$recordId]);

		return db_fetch_array($stmt);
	}

}

function nuGetFormProcessObjects($formObject, $formId, $recordId, $data, $defaultTabs, $numObjects) {

	$formObjects = [];
	$cloneableObjects = [];

	if ($recordId === '' && $formObject->form_type !== 'launch') { // Browse
		return [$formObjects, $cloneableObjects];
	}

	$sqlQuery = "
		SELECT
			*
		FROM
			zzzzsys_form
		INNER JOIN zzzzsys_object ON sob_all_zzzzsys_form_id = zzzzsys_form_id
		INNER JOIN zzzzsys_tab ON zzzzsys_tab_id = sob_all_zzzzsys_tab_id
		WHERE
			zzzzsys_form_id = ?
		ORDER BY
			IF(sob_all_type = 'contentbox', -1, sob_all_order),
			syt_order,
			(sob_all_type = 'run'),
			sob_all_zzzzsys_tab_id
	";

	$dbFields = ($data !== []) ? db_field_names($formObject->table) : [];

	$stmt = nuRunQuery($sqlQuery, [$formId]);
	while ($row = db_fetch_object($stmt)) {
		$object = nuDefaultObject($row, $defaultTabs);
		nuGetFormModifyObject($object, $formObject, $row, $recordId, $data, $numObjects, $cloneableObjects, $dbFields);
		$formObjects[] = $object;
	}
	return [$formObjects, $cloneableObjects];
}

function nuGetFormModifyObject($object, $formObject, $row, $recordId, $data, $numObjects, &$cloneableObjects, $dbFields) {

	if ($row->sob_all_cloneable == '0') {
		$cloneableObjects[] = ['subform' => $row->sob_all_type == 'subform', 'id' => $row->sob_all_id];
	}

	$object->table_column = in_array($row->sob_all_id, $dbFields) ? '1' : '0';

	$object->value = ($recordId == '-1') ? '' : nuObjKey($data, $row->sob_all_id, '');

	if ($row->sob_all_type == 'calc') {
		$object->formula = $row->sob_calc_formula;
		$object->format = $row->sob_calc_format;
		$object->align = $row->sob_all_align;
		$object->calc_order = $row->sob_all_order;
	}

	if ($row->sob_all_type == 'textarea' || $row->sob_all_type == 'run') {
		$object->align = $row->sob_all_align;
	}

	if ($row->sob_all_type == 'input' || $row->sob_all_type == 'display') {
		$object->align = $row->sob_all_align;
		$object->format = '';
		$inputType = $row->sob_input_type;
		if ($inputType == 'nuNumber' || $inputType == 'nuDate') {
			$object->format = $row->sob_input_format;
		}
		if ($inputType == 'nuAutoNumber') {
			$object->counter = $object->value;
		}
		$object->input = $inputType;
		if ($inputType == 'button' && $row->sob_all_type == 'input') {
			$object->value = $row->sob_all_label;
		}
		if ($inputType == 'nuScroll' && $row->sob_all_type == 'input') {
			$object->scroll = $row->sob_input_javascript;
		}
		$supportedDatalistInputTypes = ['nuDate', 'nuNumber', 'number', 'text', 'email', 'search', 'month'];
		if (in_array($inputType, $supportedDatalistInputTypes) &&
			$row->sob_all_type === 'input' &&
			!empty($row->sob_input_datalist)) {
			$datalistOptions = nuDataListOptions(nuReplaceHashVariables($row->sob_input_datalist));
			$object->datalist = json_encode($datalistOptions);
		}
		if ($row->sob_all_type == 'display') {
			$object->value = null;
			$displayProcedure = $row->sob_display_procedure ?? '';
			if ($displayProcedure) {
				$code = nuProcedure($displayProcedure);
				if ($code !== '') {
					$object->value = nuEval($displayProcedure, true);
				}
			} else {
				$displaySql = trim(nuReplaceHashVariables($row->sob_display_sql));
				$displayResult = nuRunQuery($displaySql);
				if (db_num_rows($displayResult) >= 1) {
					$displayRow = db_fetch_row($displayResult);
					$object->value = rtrim(implode("\n", $displayRow), "\n");
				}
			}
		}
	}

	if ($row->sob_all_type == 'contentbox') {
		$contentWidth = $object->width . "px";
		$contentHeight = $object->height . "px";
		$contentLabel = nuTranslate($row->sob_all_label);
		$contentId = $row->sob_all_id;
		$contentTitleId = 'label_' . $contentId;
		$contentContentId = 'content_' . $contentId;
		$contentBoxId = 'box_' . $contentId;
		$contentAlign = $row->sob_all_align;
		$object->html = nuReplaceHashVariables($row->sob_html_code) . "
			<div class='nuContentBox' id='$contentBoxId' style='left: 0px; top: 0px; height: $contentHeight; width: $contentWidth;'>
				<div class='nuContentBoxTitle' style='text-align: $contentAlign' id='$contentTitleId'>$contentLabel</div>
				<div class='nuContentBoxContent' id='$contentContentId'></div>
			</div>
		";
	}

	$fileTarget = isset($row->sob_input_file_target) ? $row->sob_input_file_target : 0;
	$object->file_target = $fileTarget;
	if ($row->sob_all_type == 'editor' || ($row->sob_all_type == 'input' && $fileTarget == 1)) {
		$object->html = nuReplaceHashVariables($row->sob_html_code);
	}
	if ($row->sob_all_type == 'html') {
		if ($row->sob_html_chart_type == '') {
			$object->html = nuReplaceHashVariables($row->sob_html_code);
		} else {
			$object->html = '';
			$htmljs = addslashes($row->sob_html_javascript);
			$verticalLabel = $row->sob_html_vertictal_label ?? '';
			$horizontalLabel = $row->sob_html_horizontal_label ?? '';
			$title = $row->sob_html_title ?? '';
			$chart_options = [
				'p' => ['type' => 'PieChart', 'stacked' => false, 'chart_type' => 'pie'],
				'l' => ['type' => 'ComboChart', 'stacked' => false, 'chart_type' => 'lines'],
				'b' => ['type' => 'ComboChart', 'stacked' => false, 'chart_type' => 'bars'],
				'bs' => ['type' => 'ComboChart', 'stacked' => true, 'chart_type' => 'bars'],
				'bh' => ['type' => 'BarChart', 'stacked' => false, 'chart_type' => 'bars'],
				'bhs' => ['type' => 'BarChart', 'stacked' => true, 'chart_type' => 'bars']
			];
			$chart_type = $row->sob_html_chart_type ?? '';
			if (array_key_exists($chart_type, $chart_options)) {
				$type = $chart_options[$chart_type]['type'];
				$stacked = $chart_options[$chart_type]['stacked'];
				$chart_type = $chart_options[$chart_type]['chart_type'];
				$htmlj = "\nnuChart('$row->sob_all_id', '$type', '$htmljs', '$title', '$horizontalLabel', '$verticalLabel', '$chart_type', $stacked);";
				nuAddJavaScript($htmlj);
			}
		}
	}

	if ($row->sob_all_type == 'image') {
		$object->src = nuGetSrc($row->sob_image_zzzzsys_file_id);
	}

	if ($row->sob_all_type == 'select') {
		$object->multiple = $row->sob_select_multiple;
		$object->select2 = $row->sob_select_2 ?? null;
		$object->options = nuSelectOptions($row->sob_select_sql);
	}

	if ($row->sob_all_type == 'run') {
		$formId = $row->sob_run_zzzzsys_form_id;
		$object->form_id = $formId;
		$object->record_id = nuReplaceHashVariables($row->sob_run_id);
		$object->parameters = $row->sob_all_id;

		$runType = nuRunType($row->sob_run_type ?? '', $formId);

		if ($runType === 'F') {
			$object->run_type = 'F';
		} elseif ($runType === 'P') {
			$procedureQuery = nuRunQuery('SELECT sph_zzzzsys_form_id, sph_code FROM zzzzsys_php WHERE zzzzsys_php_id = ?', [$formId]);
			$procedureObject = db_fetch_object($procedureQuery);
			$object->form_id = $procedureObject->sph_zzzzsys_form_id;
			$object->record_id = $procedureObject->sph_code;
			$object->run_type = 'P';
			$runTabQuery = nuRunQuery("SELECT sph_run FROM zzzzsys_php WHERE zzzzsys_php_id = ?", [$row->sob_run_zzzzsys_form_id]);
			$object->run_hidden = db_fetch_object($runTabQuery)->sph_run == 'hide';

		} elseif ($runType === 'R') {
			$reportQuery = nuRunQuery('SELECT sre_zzzzsys_form_id, sre_code FROM zzzzsys_report WHERE zzzzsys_report_id = ?', [$formId]);
			$reportObject = db_fetch_object($reportQuery);
			$object->form_id = $reportObject->sre_zzzzsys_form_id;
			$object->record_id = $reportObject->sre_code;
			$object->run_type = 'R';
		} else {
			$object->run_type = 'F';
		}

		$object->filter = nuReplaceHashVariables($row->sob_run_filter);
		$object->run_method = $row->sob_run_method;
		$object->run_target = $row->sob_run_target ?? '0';
	}

	if ($row->sob_all_type == 'lookup') {
		$object->description_width = $row->sob_lookup_description_width;
		$object->form_id = $row->sob_lookup_zzzzsys_form_id;
		$object->values = nuGetLookupValues($row, $object);
	}

	if ($row->sob_all_type == 'subform') {
		$row->subform_fk = $recordId;
		$object->subform_fk = $recordId;
		$object->subform_type = $row->sob_subform_type;
		$object->delete = $row->sob_subform_delete;
		$formObject->foreign_key_name = $row->sob_subform_foreign_key;
		$object->foreign_key_name = $row->sob_subform_foreign_key;
		$object->primary_key_name = nuFormProperties($row->sob_subform_zzzzsys_form_id, 'sfo_primary_key')->sfo_primary_key;
		$formObject->primary_key_name = $object->primary_key_name;
		$object->add = $row->sob_subform_add;
		$object->dimensions = nuFormDimensions($row->sob_subform_zzzzsys_form_id);
		$object->forms = nuGetSubformRecords($row, $cloneableObjects);
		$object->sf_form_id = $row->sob_subform_zzzzsys_form_id;
		$object->browse_columns = [];
	}

	if ($row->sob_all_type == 'word') {
		$object->word = $row->sob_all_label;
		$object->align = $row->sob_all_align;
	}


	if (nuEvents($row->zzzzsys_object_id) == '0') {
		$object->js = [];
	} else {
		$object->js = nuObjectEvents($row->zzzzsys_object_id);
	}

	$object->tab_order = $row->sob_all_order;
	$object->style_type = $row->sob_all_style_type ?? '';
	$object->style = $row->sob_all_style ?? '';

	$object->attributes = isset($row->sob_input_attribute) && $row->sob_input_attribute != '' ? $row->sob_input_attribute : '';
	$object->input_icon = isset($row->sob_input_icon) && $row->sob_input_icon != '' ? $row->sob_input_icon : '';

	if ($numObjects > 0) {
		unset($object->type, $object->id, $object->label, $object->top, $object->left, $object->width, $object->height, $object->align);
	}
}


function nuGetFormFinalize($formId, $formObject, $defaultTabs, $formObjects, $cloneableObjects) {

	$formObject->tabs = nuRefineTabList($defaultTabs);
	$formObject->objects = $formObjects;
	$formObject->noclone = $cloneableObjects;
	$formObject->browse_columns = nuBrowseColumns($formObject);

	$browseRows = nuBrowseRows($formObject);
	$formObject->browse_rows = nuObjKey($browseRows, 0, 0);
	$formObject->browse_filtered_rows = nuObjKey($browseRows, 1, 0);
	$formObject->browse_sql = nuObjKey($browseRows, 2, 0);

	if ($formObject->browse_filtered_rows > 0) {
		nuOnProcess($formId, $formObject, 'BB', 'nuOnProcessBrowseRows');
	}

	$formObject->browse_table_id = nuHash()['TABLE_ID'];
	$rowsPerPage = $formObject->rows ?? 1;
	$formObject->pages = ceil($formObject->browse_filtered_rows / $rowsPerPage);
	$formObject->number_formats = nuBuildCurrencyFormats();

}

function nuExtractFunctionBody($functionName, $data) {

	$c = preg_match("/function\s+" . $functionName . "\s*\((?<param>[^\)]*)\)\s*(?<body>\{(?:[^{}]+|(?&body))*\})/", $data, $matches);
	if ($c == 0) {
		$c = preg_match("/\\$" . $functionName . "\s+=\s+function\s*\((?<param>[^\)]*)\)\s*(?<body>\{(?:[^{}]+|(?&body))*\})/", $data, $matches);
	}

	return $c > 0 ? $matches['body'] : null;

}

function nuOnProcess($F, &$f, $eventCode, $functionName) {

	$p = nuProcedure($F . '_' . $eventCode);
	if ($p != '') {
		if (strpos($p, $functionName) !== false) {
			$body = nuExtractFunctionBody($functionName, $p);
			if ($body != null) {
				eval ($body);
			}
		}
	}

}

function nuGetSrc($i) {

	$s = "SELECT sfi_json FROM zzzzsys_file WHERE zzzzsys_file_id = ? ";
	$t = nuRunQuery($s, [$i]);

	if (db_num_rows($t) == 1) {
		$r = db_fetch_object($t);
		$json = nuJsonDecode($r->sfi_json);
		$j = $json->file;
	} else {
		$j = null;
	}

	return $j;

}

function nuObjectEvents($i) {

	$a = [];
	$s = "SELECT sev_event AS event, sev_javascript AS js FROM zzzzsys_event WHERE sev_zzzzsys_object_id = ?";
	$t = nuRunQuery($s, [$i]);

	while ($r = db_fetch_object($t)) {
		$a[] = $r;
	}

	return $a;

}

function nuDefaultObject($r, $t) {

	$o = new stdClass();
	$v = $r->sob_all_validate;

	$o->type = $r->sob_all_type;
	$o->object_id = $r->zzzzsys_object_id;
	$o->id = $r->sob_all_id;
	$o->label = $r->sob_all_label;

	$top = null;
	$left = null;
	$width = null;
	$height = null;
	$mobile = null;
	$visible = null;
	$labelOnTop = null;

	/*
																																		   if (nuIsMobile() && isset($r->sob_all_json)) {

																																			   $json = $r->sob_all_json;
																																			   if ($json != '') {

																																				   $obj	= nuJsonDecode($json, true);

																																				   $type		= nuObjKey($obj,'type', null);

																																				   if ($type != null) {

																																					   $mobile		= nuObjKey($type,'mobile', null);

																																					   if ($mobile == true) {

																																						   $visible	= nuObjKey($mobile,'visible', null);
																																						   $name		= nuObjKey($mobile,'name', null);
																																						   $labelOnTop	= nuObjKey($mobile,'labelontop', null);
																																						   $labelOnTop	= $labelOnTop == null || $labelOnTop == true;

																																						   $size		= nuObjKey($mobile,'size');
																																						   if ($size != null) {
																																							   $width		= nuObjKey($size, 'width', null);
																																							   $height		= nuObjKey($size, 'height', null);
																																						   }

																																						   $location		= nuObjKey($mobile,'location');
																																						   if ($location != null) {
																																							   $top		= nuObjKey($location, 'top', null);
																																							   $left		= nuObjKey($location, 'left', null);
																																						   }

																																					   }

																																				   }

																																			   }

																																		   }
																																		   */

	$o->mobile = $mobile;
	$o->labelOnTop = $labelOnTop;
	$o->visible = $visible;

	$o->top = $top == null ? $r->sob_all_top : $top;
	$o->left = $left == null ? $r->sob_all_left : $left;
	$o->width = $width == null ? $r->sob_all_width : $width;
	$o->height = $height == null ? $r->sob_all_height : $height;

	$o->valid = $r->sob_all_validate;
	$o->format = '';

	$accessCondition = $r->sob_all_access_condition ?? null;
	$o->read = nuGetObjectAccess($r->sob_all_access, $accessCondition);

	$countt = count($t);
	for ($i = 0; $i < $countt; $i++) {

		if ($r->sob_all_zzzzsys_tab_id == $t[$i]->zzzzsys_tab_id) {
			$o->tab = $t[$i]->number;
		}

	}

	return $o;

}

function nuGetObjectAccess($access, $condition) {

	if ($access == 9 && !empty(trim($condition))) {

		$sql = nuReplaceHashVariables($condition);
		$stmt = nuRunQueryString($sql, $condition);
		if (db_num_rows($stmt) == 1) {
			$value = db_fetch_row($stmt)[0];
			return $value;
		} else {
			return 0; 	// read/visible
		}

	} else {
		return $access;
	}

}

function nuFormEvents($formId) {

	$o = [];
	$query = "SELECT RIGHT(zzzzsys_php_id, 2) as event FROM zzzzsys_php WHERE zzzzsys_php_id LIKE ?";
	$stmt = nuRunQuery($query, [$formId . '_' . '%']);

	while ($row = db_fetch_object($stmt)) {
		$o[$row->event] = true;
	}

	return $o;

}


function nuGetEditForm($F, $R) {

	$f = new stdClass();
	if ($F == '')
		return $f;

	$r = nuFormProperties($F);
	if (!$r) {
		return; // form does not exist
	}

	$SQL = new nuSqlString(nuReplaceHashVariables($r->sfo_browse_sql));

	$f->id = $r->zzzzsys_form_id;
	$f->form_code = $r->sfo_code;
	$f->form_description = $r->sfo_description;
	$f->form_group = $r->sfo_group ?? '';
	$f->form_type = $r->sfo_type;
	$f->browse_title_multiline = $r->sfo_browse_title_multiline ?? false;
	$f->browse_autoresize_columns = $r->sfo_browse_autoresize_columns ?? null;
	$f->mobile_view = $r->sfo_mobile_view ?? null;
	$f->table = nuReplaceHashVariables($r->sfo_table);
	$f->primary_key = $r->sfo_primary_key;
	$f->redirect_form_id = $r->sfo_browse_redirect_form_id == '' ? $r->zzzzsys_form_id : $r->sfo_browse_redirect_form_id;
	$f->redirect_other_form_id = $r->sfo_browse_redirect_form_id == '' ? '' : $r->sfo_browse_redirect_form_id;
	$f->order = $SQL->orderBy;
	$f->where = $SQL->where;
	$f->from = $SQL->from;
	$f->javascript = $r->sfo_javascript;
	$f->javascript_edit = $r->sfo_edit_javascript ?? '';
	$f->javascript_browse = $r->sfo_browse_javascript ?? '';
	$f->events = nuFormEvents($F);

	if (intval($r->sfo_browse_row_height) == 0) {
		$f->row_height = 18;
	} else {
		$f->row_height = intval($r->sfo_browse_row_height);
	}

	$f->rows = nuRowsPerPage($r->sfo_browse_rows_per_page);
	$f->title = nuBreadcrumbDescription($r, $R);

	return $f;

}

function nuRowsPerPage($rows) {

	if (nuHasProperty('ROWS_PER_PAGE', $value, false)) {
		return intval($value);
	} else {
		return ($rows == 0 || $rows == null) ? 20 : $rows;
	}

}

function nuBreadcrumbDescriptionPart($bt) {

	$bt = nuReplaceHashVariables($bt);
	if (strtolower(substr(nuTrim($bt), 0, 6)) == 'select') {
		$t = nuRunQuery($bt);
		return db_num_rows($t) > 0 ? db_fetch_row($t)[0] : '';
	}

	return $bt;

}

function nuBreadcrumbDescription($r, $R) {

	if ($R == '') {
		return $r->sfo_description;
	}																			//-- Browse Form, new record

	if (!isset($r->sfo_breadcrumb_title) || nuTrim($r->sfo_breadcrumb_title) == '') {
		return $r->sfo_description;
	}		//-- no breadcrumb

	$bt = $r->sfo_breadcrumb_title;

	$parts = nuStringContains('|', $bt);

	if ($parts) {
		$a = explode("|", $bt);
		$b = $R == '-1' ? nuTranslate(nuBreadcrumbDescriptionPart($a[1])) : nuBreadcrumbDescriptionPart($a[0]);
	} else {
		$b = nuBreadcrumbDescriptionPart($bt);
	}

	return stripslashes(nuReplaceHashVariables($b));

}

function nuGetOtherLookupValues($lookupObject) {

	$objectId = $lookupObject->object_id;
	$lookupRecordId = $_POST['nuHash']['LOOKUP_RECORD_ID'];
	$query = "SELECT sob_lookup_zzzzsys_form_id as form_id FROM zzzzsys_object WHERE zzzzsys_object_id = ? ";
	$stmt = nuRunQuery($query, [$objectId]);
	$result = db_fetch_object($stmt);
	$formId = $result->form_id;
	$formProperties = nuFormProperties($formId, 'sfo_table, sfo_primary_key');
	$selectQuery = "SELECT * FROM $formProperties->sfo_table WHERE $formProperties->sfo_primary_key = ? ";
	$selectStmt = nuRunQuery($selectQuery, [$lookupRecordId]);
	$_POST['lookup_row'] = db_fetch_object($selectStmt);

	if (db_num_rows($selectStmt) == 1) {
		$_POST['lookup_row']->ID = $lookupRecordId;
	}

	if (db_num_rows($selectStmt) == 0) {
		$_POST['lookup_row'] = new stdClass;
		$_POST['lookup_row']->ID = $lookupRecordId;
	}

	$_POST['lookup_values'] = [];

	$GLOBALS['EXTRAJS'] = '';
	nuEval($objectId . '_AB');

	return $_POST['lookup_values'];
}

function nuGetAllLookupValues() {

	$objectId = $_POST['nuSTATE']['object_id'];
	$primaryKey = $_POST['nuSTATE']['primary_key'];
	$query = "SELECT * FROM `zzzzsys_object` WHERE `zzzzsys_object_id` = ?";
	$stmt = nuRunQuery($query, [$objectId]);
	$row = db_fetch_object($stmt);
	$object = nuDefaultObject($row, []);
	$object->description_width = $row->sob_lookup_description_width;
	$object->form_id = $row->sob_lookup_zzzzsys_form_id;
	$object->value = $primaryKey;

	$lookupValues = nuGetLookupValues($row, $object);

	$_POST['nuHash']['LOOKUP_RECORD_ID'] = $lookupValues[0][1];

	$otherLookupValues = nuGetOtherLookupValues($object);

	$result = new stdClass;
	$result->lookup_values = array_merge($lookupValues, $otherLookupValues);
	$result->lookup_javascript = nuObjKey($GLOBALS, 'EXTRAJS', '') . ";$row->sob_lookup_javascript";

	return $result;
}

function nuGetLookupValues($objectRow, $lookupObject) {

	$previousTableId = $_POST['nuHash']['TABLE_ID'];

	$_POST['nuHash']['TABLE_ID'] = nuTT();

	nuBeforeBrowse($lookupObject->form_id);

	$query = "SELECT sfo_primary_key, sfo_browse_sql FROM zzzzsys_form WHERE zzzzsys_form_id = ?";
	$stmt = nuRunQuery($query, [$lookupObject->form_id]);
	$result = db_fetch_object($stmt);
	$sqlString = new nuSqlString(nuReplaceHashVariables($result->sfo_browse_sql));

	$selectQuery = "
		SELECT
			$result->sfo_primary_key,
			$objectRow->sob_lookup_code,
			$objectRow->sob_lookup_description
			$sqlString->from
		WHERE
			`$result->sfo_primary_key` = ?
	";

	$selectQuery = nuReplaceHashVariables($selectQuery);
	$selectStmt = nuRunQuery($selectQuery, [$lookupObject->value]);
	$lookupRow = db_fetch_row($selectStmt);

	$fieldPrefix = nuObjKey($_POST['nuSTATE'], 'prefix', '') . $lookupObject->id;

	nuRunQuery(nuReplaceHashVariables('DROP TABLE if EXISTS #TABLE_ID#'));

	$_POST['nuHash']['TABLE_ID'] = $previousTableId;

	$lookupValues = [];
	$lookupValues[] = [$fieldPrefix, $lookupRow[0] ?? ''];
	$lookupValues[] = [$fieldPrefix . 'code', $lookupRow[1] ?? ''];
	$lookupValues[] = [$fieldPrefix . 'description', $lookupRow[2] ?? ''];

	return $lookupValues;
}

function nuGetAllLookupList() {

	$objectId = $_POST['nuSTATE']['object_id'];
	$lookupCode = $_POST['nuSTATE']['code'];
	$previousTableId = nuObjKey($_POST['nuHash'], 'TABLE_ID');

	$_POST['nuHash']['TABLE_ID'] = nuTT();

	$query = "SELECT sob_lookup_code, sob_lookup_description, sob_lookup_zzzzsys_form_id, sob_lookup_javascript FROM zzzzsys_object WHERE zzzzsys_object_id = ?";
	$stmt = nuRunQuery($query, [$objectId]);
	$result = db_fetch_object($stmt);
	$codeField = $result->sob_lookup_code;
	$descriptionField = $result->sob_lookup_description;
	$formId = $result->sob_lookup_zzzzsys_form_id;
	$javaScript = $result->sob_lookup_javascript;

	nuBeforeBrowse($formId);

	$formQuery = "SELECT sfo_primary_key, sfo_browse_sql FROM zzzzsys_form WHERE zzzzsys_form_id = ?";
	$formStmt = nuRunQuery($formQuery, [$formId]);
	$formResult = db_fetch_object($formStmt);
	$primaryKeyField = $formResult->sfo_primary_key;
	$sqlString = new nuSqlString(nuReplaceHashVariables($formResult->sfo_browse_sql));

	$lookupQuery = "
		SELECT $primaryKeyField, $codeField, $descriptionField
		$sqlString->from
		$sqlString->where
		AND $codeField = ?
		ORDER BY $codeField
	";

	$lookupQuery = nuReplaceHashVariables($lookupQuery);
	$lookupStmt = nuRunQuery($lookupQuery, [$lookupCode]);
	$lookupList = [];

	if (db_num_rows($lookupStmt) == 0) {

		$likeQuery = "
			SELECT $primaryKeyField, $codeField, $descriptionField
			$sqlString->from
			$sqlString->where
			AND ($codeField LIKE ? OR $descriptionField LIKE ?)
			AND '$lookupCode' != ''
			ORDER BY $codeField
		";

		$lookupStmt = nuRunQuery($likeQuery, ['%' . $lookupCode . '%', '%' . $lookupCode . '%']);
	}

	nuRunQuery(nuReplaceHashVariables('DROP TABLE if EXISTS #TABLE_ID#'));

	$_POST['nuHash']['TABLE_ID'] = $previousTableId;

	while ($row = db_fetch_row($lookupStmt)) {
		$lookupList[] = $row;
	}

	$lookupResult = new stdClass;
	$lookupResult->lookup_like = '';
	$lookupResult->lookup_values = $lookupList;
	$lookupResult->lookup_javascript = $javaScript;

	return $lookupResult;
}


function nuLookupRecord() {

	return $_POST['lookup_row'];

}

function nuSetFormValue($f, $v) {

	$f = str_replace('#ROW#', $_POST['nuSTATE']['prefix'], $f);

	$_POST['lookup_values'][] = [$f, $v];

}

function nuDataListOptions($input) {

	$options = [];

	$trimmedInput = nuTrim($input);
	$upperInput = strtoupper($trimmedInput);

	if (substr($upperInput, 0, 6) === 'SELECT' || substr($upperInput, 0, 4) === 'SHOW') {
		// SQL query case
		$queryResult = nuRunQuery($input);

		if (nuErrorFound()) {
			return;
		}

		while ($row = db_fetch_row($queryResult)) {
			$options[] = $row;
		}
	} else if (substr($trimmedInput, 0, 1) === '[') {
		// JSON array case
		$options = nuJsonDecode($input);
	} else {
		// Plain string
		return $input;
	}

	return $options;

}

function nuSelectAddOption($text, $value) {

	$arr = [];
	$arr[0] = $text;
	$arr[1] = $value;

	return $arr;

}

function nuSelectOptions($sql) {

	$options = [];
	$sqlWithHk = $sql;
	$processedSql = nuReplaceHashVariables($sql);

	$selectType = nuGetSelectType($processedSql);

	switch ($selectType) {
		case 'query':
			$stmt = nuRunQueryString($processedSql, $sqlWithHk);
			if (nuErrorFound()) {
				return;
			}
			while ($row = db_fetch_row($stmt)) {
				$options[] = $row;
			}
			break;
		case 'array':
			$arr = nuJsonDecode($processedSql);
			foreach ($arr as $item) {
				$options[] = nuSelectAddOption($item, $item);
			}
			break;
		case 'languages':
			foreach (glob("languages/*.sql") as $file) {
				$baseName = basename($file, '.sql');
				$options[] = nuSelectAddOption($baseName, $baseName);
			}
			break;
		case 'showTables':
			$stmt = nuRunQuery($sql);
			while ($row = db_fetch_row($stmt)) {
				if (!nuStringStartsWith('__', $row[0])) {
					$options[] = nuSelectAddOption($row[0], $row[0]);
				}
			}
			break;
		case 'delimited':
		default:
			$parts = explode('|', nuRemoveNonCharacters($processedSql));
			for ($i = 0, $count = count($parts); $i < $count; $i++) {
				$selectValue = $parts[$i];
				$selectDescription = isset($parts[$i + 1]) ? $parts[$i + 1] : 'Undefined';
				$options[] = nuSelectAddOption($selectValue, $selectDescription);
				$i++; // Skip the next element (used as description)
			}
			break;
	}

	return $options;

}

function nuRemoveNonCharacters($s) {

	$replace_pairs = array(
		"\t" => '',
		"\n" => '',
		"\r" => ''
	);

	return strtr($s, $replace_pairs);

}

function nuGetSubformRecords($record, $tabs) {

	$formId = nuGetEditForm($record->sob_subform_zzzzsys_form_id, '');
	$whereClause = $formId->where == '' ? '' : ' AND (' . substr($formId->where, 6) . ')';
	$selectQuery = "SELECT `$formId->primary_key` $formId->from WHERE (IFNULL(`$record->sob_subform_foreign_key`,'-1') = '$record->subform_fk') $whereClause $formId->order";

	$originalRecordId = $_POST['nuHash']['RECORD_ID'];

	$queryResult = nuRunQuery($selectQuery);
	$subformRecords = [];

	$tabs = nuBuildTabList($record->sob_subform_zzzzsys_form_id);

	while ($row = db_fetch_row($queryResult)) {

		$_POST['nuHash']['RECORD_ID'] = $row[0];
		$formObject = nuGetFormObject($record->sob_subform_zzzzsys_form_id, $row[0], count($subformRecords), $tabs);
		$formObject->foreign_key = $record->subform_fk;
		$formObject->foreign_key_name = $record->sob_subform_foreign_key;
		$subformRecords[] = $formObject;

	}

	$_POST['nuHash']['RECORD_ID'] = -1;
	$newFormObject = nuGetFormObject($record->sob_subform_zzzzsys_form_id, -1, count($subformRecords), $tabs);
	$newFormObject->foreign_key = $record->subform_fk;
	$newFormObject->foreign_key_name = $record->sob_subform_foreign_key;
	$subformRecords[] = $newFormObject;

	$_POST['nuHash']['RECORD_ID'] = $originalRecordId;

	return $subformRecords;

}

function nuBuildTabList($formId) {

	$tabIndex = 0;
	$tabList = [];
	$query = "
		SELECT zzzzsys_tab.*
		FROM zzzzsys_tab
		INNER JOIN zzzzsys_object ON sob_all_zzzzsys_form_id = syt_zzzzsys_form_id
		GROUP BY `zzzzsys_tab_id`, `syt_zzzzsys_form_id`
		HAVING syt_zzzzsys_form_id = ?
		ORDER BY `syt_order`;
	";

	$result = nuRunQuery($query, [$formId]);

	while ($row = db_fetch_object($result)) {

		$row->number = $tabIndex;
		$tabIndex++;
		$tabList[] = $row;

	}

	return $tabList;

}

function nuRefineTabList($tabs) {

	$refinedTabList = [];

	$tabCount = count($tabs);
	for ($index = 0; $index < $tabCount; $index++) {

		$refinedTabList[] = [
			'title' => $tabs[$index]->syt_title,
			'id' => $tabs[$index]->zzzzsys_tab_id,
			'help' => $tabs[$index]->syt_help,
			'access' => $tabs[$index]->syt_access ?? null
		];

	}

	return $refinedTabList;

}

function nuGetSQLValue($sql) {

	$trimmedSql = nuReplaceHashVariables(nuTrim($sql));

	if (nuTrim($trimmedSql) == '') {
		return '';
	} else {

		$queryResult = nuRunQuery($trimmedSql);
		$row = db_fetch_row($queryResult);

		return $row[0];

	}

}

function nuBrowseColumns($form) {

	if ($form->record_id != '') {
		return [];
	}

	nuBeforeBrowse($form->id);

	$query = "SELECT * FROM zzzzsys_browse WHERE sbr_zzzzsys_form_id = ? ORDER BY sbr_order";
	$queryResult = nuRunQuery($query, [$form->id]);
	$columns = [];

	while ($row = db_fetch_object($queryResult)) {
		$columns[] = (object) [
			'title' => $row->sbr_title,
			'display' => $row->sbr_display,
			'align' => $row->sbr_align,
			'width' => $row->sbr_width,
			'order' => $row->sbr_order,
			'format' => $row->sbr_format,
			'id' => $row->zzzzsys_browse_id
		];
	}

	return $columns;
}

function nuBrowseRows($f) {

	if (nuTrim($f->record_id) != '') {
		return [];
	}

	$P = $_POST['nuSTATE'];

	$rows = $P['rows'] ?? 0;
	if ($rows == -1) {
		$rows = nuFormProperties($f->form_id, 'sfo_browse_rows_per_page')->sfo_browse_rows_per_page;
	}
	$rows = nuRowsPerPage($rows);

	$page_number = $P['page_number'] ?? 0;
	$nosearch_columns = $_POST['nuSTATE']['nosearch_columns'] ?? null;
	$start = $page_number * $rows;
	$search = str_replace('&#39;', "'", nuObjKey($P, 'search', ''));
	$filter = str_replace('&#39;', "'", nuObjKey($P, 'filter', ''));
	$s = "SELECT sfo_browse_sql FROM zzzzsys_form WHERE zzzzsys_form_id = ?";
	$t = nuRunQuery($s, [$f->id]);
	$r = db_fetch_object($t);

	if (nuTrim($r->sfo_browse_sql) == '') {
		return [[], 0];
	}

	$S = new nuSqlString(nuReplaceHashVariables($r->sfo_browse_sql));

	$S->addField('$' . $f->primary_key . '$');

	$displayContainsPK = false;

	$countBrowseColumns = count($f->browse_columns);
	for ($i = 0; $i < $countBrowseColumns; $i++) {
		$d = $f->browse_columns[$i]->display;
		if ($d == $f->primary_key)
			$displayContainsPK = true;
		$S->addField($d);
	}

	$flds = [];
	$fields = array_slice($S->fields, 1);

	if ($nosearch_columns === null) {
		$_POST['nuSTATE']['nosearch_columns'] = [];
	}

	$countFields = count($fields);
	for ($i = 0; $i < $countFields; $i++) {

		if (!in_array($i, $_POST['nuSTATE']['nosearch_columns'])) {
			$flds[] = $fields[$i];
		}

	}

	$where = nuTrim(nuBrowseWhereClause($flds, $filter . ' ' . $search));
	$__x = nuHash();
	$like = $__x['like'] ?? '';
	unset($__x);
	$like = str_replace('\\"', '"', $like);
	$haswhere = $where != '()';
	$haslike = $like != '';
	$hardwhere = $S->getWhere();

	if ($haslike && $haswhere) {
		$S->setWhere(" $hardwhere AND $like AND $where");
	}
	if ($haslike && !$haswhere) {
		$S->setWhere(" $hardwhere AND $like");
	}
	if (!$haslike && $haswhere) {
		$S->setWhere(" $hardwhere AND $where");
	}

	if (isset($P['sort']) && $P['sort'] != '-1') {
		$S->setOrderBy(' ORDER BY ' . nuBrowseRemoveFieldAlias($S->fields[$P['sort'] + 1]) . ' ' . $P['sort_direction']);
	}

	$a = [];
	$s = nuReplaceHashVariables($S->SQL);

	$S->SQL = str_replace('$' . $f->primary_key . '$', $f->primary_key, $S->SQL);

	if ($displayContainsPK) {
		$sCount = str_replace('$' . $f->primary_key . '$,', '', $s);
	} else {
		$sCount = str_replace('$' . $f->primary_key . '$', $f->primary_key, $s);
	}

	$t = nuRunQuery('SELECT COUNT(*) FROM (' . $sCount . ') nuTCount');
	$rowData = !nuErrorFound() ? db_fetch_row($t)[0] : 0;

	$s .= " LIMIT " . ($start < 0 ? 0 : $start) . ", $rows";

	$s = str_replace('$' . $f->primary_key . '$', $f->primary_key, $s);
	$t = nuRunQuery($s);

	while ($r = db_fetch_row($t)) {
		$a[] = $r;
	}

	nuRunQuery(nuReplaceHashVariables('DROP TABLE IF EXISTS #TABLE_ID#'));

	return [$a, $rowData, $S->SQL];

}

function nuBrowseWhereClause($searchFields, $searchString, $returnArray = false) {

	$pos = -1;
	$start = -1;
	$where = [];
	$phrases = [];
	$SEARCHES = [];
	$wordSearches = [];
	$highlight = [];

	while (true) {

		$pos = strpos($searchString, '"', $pos + 1);					//-- search for double quotes

		if ($pos === false) {

			break;														//-- stop searching

		} else {

			if ($start == -1) {

				$start = $pos;											//-- find start position of phrase

			} else {

				$phrases[] = "$start," . ($pos + 1);					//-- add start and end to array
				$start = -1;

			}

		}

	}

	$countPhrases = count($phrases);
	for ($i = 0; $i < $countPhrases; $i++) {

		$p = explode(',', $phrases[$i]);
		$SEARCHES[] = substr($searchString, $p[0], $p[1] - $p[0]);
	}

	$countS = count($SEARCHES);
	for ($i = 0; $i < $countS; $i++) {

		$pos = strpos($searchString, '-' . $SEARCHES[$i]);												//-- check for a preceeding minus

		if ($pos === false) {

			$task[] = 'include';
			$searchString = str_replace($SEARCHES[$i], ' ', $searchString);							//-- include phrase
			$highlight[] = substr($SEARCHES[$i], 1, -1);

		} else {

			$task[] = 'exclude';
			$searchString = str_replace('-' . $SEARCHES[$i], ' ', $searchString);						//-- remove phrase

		}

		$SEARCHES[$i] = ' "%' . substr($SEARCHES[$i], 1, -1) . '%" ';

	}

	$wordSearches = explode(' ', $searchString);
	$quo = '"';
	$task = [];

	$countWordSearches = count($wordSearches);
	for ($i = 0; $i < $countWordSearches; $i++) {

		if (strlen($wordSearches[$i]) > 0) {

			if (substr($wordSearches[$i], 0, 1) == '-' and strlen($wordSearches[$i]) > 1) {				//-- check for a preceeding minus

				$task[] = 'exclude';
				$SEARCHES[] = $quo . '%' . addslashes(substr($wordSearches[$i], 1)) . '%' . $quo;		//-- add word to exclude

			} else {

				$task[] = 'include';
				$SEARCHES[] = $quo . '%' . addslashes($wordSearches[$i]) . '%' . $quo;					//-- add word to include
				$highlight[] = $wordSearches[$i];

			}

		}

	}

	$countS = count($SEARCHES);
	for ($i = 0; $i < $countS; $i++) {																	//-- search for (or exclude) these strings

		$include = [];
		$exclude = [];

		$countSearchFields = count($searchFields);
		for ($SF = 0; $SF < $countSearchFields; $SF++) {												//-- loop through searchable fields

			if ($task[$i] == 'include') {
				$include[] = 'CONVERT(' . nuBrowseRemoveFieldAlias($searchFields[$SF]) . ' USING UTF8MB4) LIKE ' . $SEARCHES[$i];
			} else {
				$exclude[] = 'CONVERT(' . nuBrowseRemoveFieldAlias($searchFields[$SF]) . ' USING UTF8MB4) NOT LIKE ' . $SEARCHES[$i];
			}

		}

		if (count($include) > 0) {
			$where[] = ' (' . implode(' OR ', $include) . ') ';
		}

		if (count($exclude) > 0) {
			$where[] = ' (' . implode(' AND ', $exclude) . ') ';
		}

	}

	if ($returnArray) {
		return $highlight;
	} else {
		return ' (' . implode(' AND ', $where) . ') ';
	}

}

function nuBrowseRemoveFieldAlias($field) {

	$field = preg_replace_callback('/\sAS\s/i', function ($match) {
		return strtolower($match[0]);
	}, $field);

	$pos = strrpos(strtolower($field), " as ");
	if ($pos !== false) {
		return substr($field, 0, $pos);
	}

	return $field;

}

function nuGatherFormAndSessionData($home, $globalAccess) {

	$formAndSessionData = new stdClass;
	$nuState = $_POST['nuSTATE'];
	$sessionData = $_SESSION['nubuilder_session_data'];
	$sessionId = $sessionData['SESSION_ID'];

	$formAndSessionData->record_id = $nuState['record_id'] ?? "-1";

	$formId = $nuState['form_id'] ?? '';
	if ($formId == 'home_id') {
		$formId = $globalAccess ? $sessionData['GLOBEADMIN_HOME'] : $sessionData['HOME_ID'];
	}

	if (nuStringStartsWith('code:', $formId, true)) {
		$formId = db_fetch_value('zzzzsys_form', 'sfo_code', substr($formId, 5), 'zzzzsys_form_id');
	}

	if ($formId) {
		$formAndSessionData->form_id = $formId;
	} else {
		$formAndSessionData->form_id = $home == '' ? $sessionData['GLOBEADMIN_HOME'] : $home;
	}

	if (isset($nuState['login_form_id'])) {

		if ($nuState['login_form_id'] != '') {
			$formAndSessionData->form_id = $nuState['login_form_id'];
		}

	}

	if (isset($nuState['login_form_id'])) {			//-- check empty form_id not empty record_id

		if ($nuState['login_form_id'] != '') {
			$formAndSessionData->record_id = $nuState['login_record_id'];
		}

	}

	$formAndSessionData->session_id = $sessionId;
	$formAndSessionData->call_type = $nuState['call_type'];
	$formAndSessionData->filter = $_POST['nuFilter'] ?? '';
	$formAndSessionData->errors = [];
	$formAndSessionData->translation = $sessionData['translation'];

	if ($formAndSessionData->form_id != null) {
		$formAndSessionData->dimensions = nuFormDimensions($formAndSessionData->form_id);
	}

	if (!$globalAccess && $formAndSessionData->form_id != 'nuhome') {

		$getAccessFromSessionTableQRY = nuRunQuery("SELECT sss_access FROM zzzzsys_session WHERE zzzzsys_session_id = ? ", [$sessionId]);
		$getAccessFromSessionTableOBJ = db_fetch_object($getAccessFromSessionTableQRY);
		$access = nuJsonDecode($getAccessFromSessionTableOBJ->sss_access);
		$callType = $formAndSessionData->call_type;

		if ($callType == 'getreport') {

			$r = nuReportAccessList($access);

			if (!in_array($formAndSessionData->record_id, $r)) { 		//form_id is record_id for getreport
				$stmt = nuRunQuery("SELECT sph_code FROM zzzzsys_report WHERE zzzzsys_report_id = ?", [$formAndSessionData->record_id]);
				nuDisplayErrorAccessDenied($callType, $stmt);
			}

		}

		if ($callType == 'getphp') {

			$p = nuProcedureAccessList($access);

			if (!in_array($formAndSessionData->record_id, $p)) { 		//form_id is record_id for getphp^
				$stmt = nuRunQuery("SELECT sph_code FROM zzzzsys_php WHERE zzzzsys_php_id = ?", [$formAndSessionData->record_id]);
				nuDisplayErrorAccessDenied($callType, $stmt);
			}

		}

		$f = nuFormAccessList($access); 		//-- form list including forms id used in reports and procedures

		if (!in_array($formAndSessionData->form_id, $f) && ($callType == 'getform' || $formAndSessionData->call_type == 'login')) {
			$stmt = nuRunQuery("SELECT sfo_code FROM zzzzsys_form WHERE zzzzsys_form_id = ?", [$formAndSessionData->form_id]);
			nuDisplayErrorAccessDenied($callType, $stmt);
		}

	}

	$formAndSessionData->errors = $_POST['nuErrors'];

	return $formAndSessionData;

}

function nuDisplayErrorAccessDenied($callType, $stmt) {

	if (db_num_rows($stmt) === 1) {
		$obj = db_fetch_row($stmt);
		$code = " ({$obj[0]})";
	} else {
		$code = '';
	}

	if ($callType == 'getform') {
		nuDisplayError("Access To Form Denied$code");
	} elseif ($callType == 'getphp') {
		nuDisplayError("Access To Procedure Denied$code");
	} elseif ($callType == 'getreport') {
		nuDisplayError("Access To Report Denied$code");
	}

}

function nuGetFormPermission($formId, $permissionField) {

	$sql = "SELECT $permissionField FROM zzzzsys_access_form WHERE slf_zzzzsys_access_id = ? AND slf_zzzzsys_form_id = ?";
	$stmt = nuRunQuery($sql, [$_POST['nuHash']['USER_GROUP_ID'], $formId]);

	if (db_num_rows($stmt) === 1) {
		$value = db_fetch_row($stmt);
		$value = $value[0] == null || $value[0] == '' ? null : (int) $value[0];
	} else {
		$value = null;
	}

	return $value;

}

function nuFormAccessList($accessData) {

	$accessList = [];
	$queryResult = nuRunQuery("SELECT zzzzsys_form_id FROM zzzzsys_form WHERE sfo_type = 'subform'");

	while ($row = db_fetch_row($queryResult)) {
		$accessList[] = $row[0];
	}

	$formCount = count($accessData->forms);
	for ($formIndex = 0; $formIndex < $formCount; $formIndex++) {
		$accessList[] = $accessData->forms[$formIndex][0];
	}

	$reportCount = count($accessData->reports);
	for ($reportIndex = 0; $reportIndex < $reportCount; $reportIndex++) {
		$accessList[] = $accessData->reports[$reportIndex][1];
	}

	$procedureCount = count($accessData->procedures);
	for ($procedureIndex = 0; $procedureIndex < $procedureCount; $procedureIndex++) {
		$accessList[] = $accessData->procedures[$procedureIndex][1];
	}

	$userAccess = nuGetUserAccess();
	$accessList[] = $userAccess['HOME_ID'];
	unset($userAccess);

	return $accessList;

}

function nuProcedureAccessList($j) {

	$a = [];

	$count = count($j->procedures);
	for ($i = 0; $i < $count; $i++) {
		$a[] = $j->procedures[$i][0];
	}

	return $a;

}

function nuReportAccessList($j) {

	$a = [];

	$count = count($j->reports);
	for ($i = 0; $i < $count; $i++) {
		$a[] = $j->reports[$i][0];
	}

	return $a;

}


function nuButtons($formid, $POST) {

	$t = nuRunQuery("SELECT sss_access FROM zzzzsys_session WHERE zzzzsys_session_id = ? ", [$_SESSION['nubuilder_session_data']['SESSION_ID']]);

	if (db_num_rows($t) == 0) {
		return [array('Add' => 0, 'Print' => 0, 'Save' => 0, 'Clone' => 0, 'Delete' => 0, 'Run' => 'nuRunPHP("' . '' . '")', 'RunHidden' => ''), '', ''];
	}

	$r = db_fetch_object($t);
	$nuJ = nuJsonDecode($r->sss_access);
	$_POST['forms'] = $nuJ->forms;
	$_POST['reports'] = $nuJ->reports;
	$_POST['procedures'] = $nuJ->procedures;
	$_POST['session'] = $nuJ->session;
	$C = '';
	$D = '';
	$a = nuFormAccess($formid, $nuJ->forms);
	$c = $POST['call_type'];
	$recordID = nuObjKey($POST, 'record_id');

	if ($c == 'getphp' or $c == 'getreport') {


		$s = 'SELECT sph_code, sph_description, sph_run FROM zzzzsys_php WHERE zzzzsys_php_id = ? ';
		$t = nuRunQuery($s, [$recordID]);
		$P = db_fetch_object($t);

		$s = 'SELECT sre_code, sre_description FROM zzzzsys_report WHERE zzzzsys_report_id = ? ';
		$t = nuRunQuery($s, [$recordID]);
		$R = db_fetch_object($t);

	} else {

		$s = 'SELECT sph_code, sph_description, sph_run FROM zzzzsys_php WHERE sph_code = ? ';
		$t = nuRunQuery($s, [$recordID]);
		$P = db_fetch_object($t);

		$s = 'SELECT sre_code, sre_description FROM zzzzsys_report WHERE sre_code = ? ';
		$t = nuRunQuery($s, [$recordID]);
		$R = db_fetch_object($t);

	}

	if ($c == 'getphp') {

		$C = $P->sph_code;
		$D = $P->sph_description;

		if ($P->sph_run == 'hide') {
			return [array('Add' => 0, 'Print' => 0, 'Save' => 0, 'Clone' => 0, 'Delete' => 0, 'Run' => '', 'RunHidden' => 'nuRunPHPHidden("' . $C . '")'), $C, $D];
		} else {
			return [array('Add' => 0, 'Print' => 0, 'Save' => 0, 'Clone' => 0, 'Delete' => 0, 'Run' => 'nuRunPHP("' . $C . '")', 'RunHidden' => ''), $C, $D];
		}

	} else
		if ($c == 'getreport') {

			$C = $R->sre_code;
			$D = $R->sre_description;

			return [array('Add' => 0, 'Print' => 0, 'Save' => 0, 'Clone' => 0, 'Delete' => 0, 'Run' => 'nuRunReport("' . $C . '")', 'RunHidden' => ''), $C, $D];

		} else {
			return [array('Add' => $a[0], 'Print' => $a[1], 'Save' => $a[2], 'Clone' => $a[3], 'Delete' => $a[4], 'Run' => '', 'RunHidden' => ''), $C, $D];
		}

}


function nuRunCode($P) {

	$s = 'SELECT sph_code FROM zzzzsys_php WHERE zzzzsys_php_id = ? ';
	$t = nuRunQuery($s, [$P['record_id']]);
	$c = db_fetch_object($t)->sph_code;

	$s = 'SELECT sre_code FROM zzzzsys_report WHERE zzzzsys_report_id = ? ';
	$t = nuRunQuery($s, [$P['record_id']]);

	if (db_fetch_object($t)->sre_code != '') {
		$c = db_fetch_object($t)->sre_code;
	}

	return $c;

}

function nuRunDescription($P) {

	$s = 'SELECT sph_description FROM zzzzsys_php WHERE zzzzsys_php_id = ? ';
	$t = nuRunQuery($s, [$P['record_id']]);
	$d = db_fetch_object($t)->sph_description;

	$s = 'SELECT sre_code FROM zzzzsys_report WHERE zzzzsys_report_id = ? ';
	$t = nuRunQuery($s, [$P['record_id']]);

	if (db_fetch_object($t)->sre_code != '') {
		$d = db_fetch_object($t)->sre_description;
	}

	return $d;

}


function nuFormAccess($s, $a) {

	if (nuGlobalAccess(true)) {
		return ['1', '1', '1', '1', '1'];
	}

	if ($a !== null) {

		$count = count($a);
		for ($i = 0; $i < $count; $i++) {

			$F = $a[$i];

			if ($s == $F[0]) {
				return [$F[1], $F[2], $F[3], $F[4], $F[5]];		//-- Add, Print, Save, Clone, Delete
			}

		}

	}

	return ['0', '0', '0', '0', '0'];

}

function nuFormDimensions($f) {

	$d = [];
	$t = nuRunQuery("SELECT sfo_browse_row_height, sfo_browse_rows_per_page FROM zzzzsys_form WHERE zzzzsys_form_id = ?", [$f]);
	$r = db_fetch_object($t);

	$brh = $r->sfo_browse_row_height ?? 0;
	$brp = $r->sfo_browse_rows_per_page ?? 0;

	$bt = 57;	//-- browse title
	$rh = intval($brh) == 0 ? 25 : $brh;
	$rs = intval($brp) == 0 ? 25 : $brp;
	$bb = 25;	//-- browse footer
	$t = nuRunQuery("SELECT * FROM zzzzsys_object WHERE sob_all_zzzzsys_form_id = ?", [$f]);
	$h = 0;
	$w = 0;
	$gh = 0;
	$gw = 0;

	while ($r = db_fetch_object($t)) {

		if ($r->sob_all_type == 'lookup') {

			$w = max($w, $r->sob_all_left + $r->sob_all_width + $r->sob_lookup_description_width + 40);
			$gw = $gw + $r->sob_all_width + $r->sob_lookup_description_width + 40;

		} else {

			$w = max($w, $r->sob_all_left + $r->sob_all_width + 40);
			$gw = $gw + $r->sob_all_width + 4;

		}

		if ($r->sob_all_type == 'textarea') {
			$oh = $r->sob_all_height + 16;
		} else if (isset($r->sob_select_2) && $r->sob_select_2 == '1') {
			$oh = $r->sob_all_height + 13;
		} else {
			$oh = $r->sob_all_height;
		}

		$h = max($h, $r->sob_all_top + $oh);
		$gh = max($oh, 27, $gh);

	}

	$bh = $bt + ($rs * $rh) + $bb;
	$bw = nuGetBrowseWidth($f);

	$grid = ['height' => $gh, 'width' => $gw];
	$browse = ['height' => $bh, 'width' => $bw];
	$edit = ['height' => $h, 'width' => $w];

	$d[] = $bt + ($rs * $rh) + $bb;	//-- lookup browse height
	$d[] = $bw;
	$d[] = $h + 0;					 //-- lookup form height
	$d[] = $w + 0;					 //-- lookup form width
	$d[] = $h + 0;					 //-- form height
	$d[] = $w + 50;					 //-- form width
	$d[] = $gh + 0;					 //-- grid height
	$d[] = $gw + 55;					 //-- grid width

	$d[] = ['browse' => $browse, 'edit' => $edit, 'grid' => $grid];

	return ['browse' => $browse, 'edit' => $edit, 'grid' => $grid];

}

function nuGetBrowseWidth($f) {

	$t = nuRunQuery("SELECT SUM(sbr_width) FROM zzzzsys_browse WHERE sbr_zzzzsys_form_id = ? ", [$f]);
	$r = db_fetch_row($t);
	return db_num_rows($t) > 0 ? $r[0] : 0;

}

function nuIsForm($i) {

	$s = "SELECT zzzzsys_form_id_id FROM zzzzsys_form WHERE zzzzsys_form_id = ?";
	$t = nuRunQuery($s, [$i]);
	$r = db_fetch_object($t);

	return db_num_rows($t) > 0;

}

function nuIsProcedure($i) {

	$s = "SELECT zzzzsys_php_id FROM zzzzsys_php WHERE zzzzsys_php_id = ?";
	$t = nuRunQuery($s, [$i]);
	$r = db_fetch_object($t);

	return db_num_rows($t) > 0;

}

function nuIsReport($i) {

	$s = "SELECT zzzzsys_report_id FROM zzzzsys_report WHERE zzzzsys_report_id = ?";
	$t = nuRunQuery($s, [$i]);
	$r = db_fetch_object($t);

	return db_num_rows($t) > 0;

}

function nuSetupButtons($f, $t) {

	if ($t == 'Report') {

		nuAddPrintButtons($f, 'Run', 'Report');
		nuAddPrintButtons($f, 'Email', 'Report');

	} else if ($t == 'PHP') {

		nuAddPrintButtons($f, 'Run', 'PHP');

	}
}

function nuAddPrintButtons($f, $t, $a) {

	$i = sizeof($f->forms[0]->buttons);

	$f->forms[0]->buttons[$i][0] = $t;
	$f->forms[0]->buttons[$i][1] = $t . $a;

}

function nuAddJavaScript($js, $bc = false, $first = false) {

	$extraJSKey = $bc ? 'EXTRAJS_BC' : 'EXTRAJS';
	if (isset($GLOBALS[$extraJSKey])) {
		$extraJS = $GLOBALS[$extraJSKey];
		if ($first) {
			$extraJS = $js . "\n\n" . $extraJS;
		} else {
			$extraJS .= "\n\n" . $js;
		}
		$GLOBALS[$extraJSKey] = $extraJS;
	}

}

function nuPreloadImages($a) {

	$js = '';

	$count = count($a);
	for ($i = 0; $i < $count; $i++) {

		$s = "
				SELECT sfi_code, sfi_json
				FROM zzzzsys_file
				WHERE sfi_code = ?

			";

		$t = nuRunQuery($s, [$a[$i]]);
		$r = db_fetch_object($t);

		$tr = nuTrim($r->sfi_code);
		$js = $js . "\nnuImages['$tr'] = '" . addslashes($r->sfi_json) . "';";

	}

	nuAddJavaScript($js);

}
