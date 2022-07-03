<?php

function nuFormProperties($f, $columns = ''){

	$columns = $columns == '' ? '*' : $columns;

	$s	= "SELECT $columns FROM zzzzsys_form WHERE zzzzsys_form_id = ? ";

	$t	= nuRunQuery($s, array($f));
	$r	= db_fetch_object($t);

	return $r;

}

function nuBeforeBrowse($f){

	$_POST['nuMessages']	= array();

	$p	= nuProcedure('nuBeforeBrowse');
	if($p != '') { eval($p); }
	if(count($_POST['nuErrors']) > 0){return;}

	nuEval($f . '_BB');

}

function nuBeforeEdit($FID, $RID){

	$r						= nuFormProperties($FID);

	$GLOBALS['EXTRAJS']		= '';
	$GLOBALS['EXTRAJS_BC']	= '';
	$GLOBALS['STYLE']		= '';

	$ct						= $_POST['nuSTATE']['call_type'];

	if($ct == 'getreport' and $r == ''){return;}
	if($ct == 'getform' and $r == ''){return;}

	$recordID				= isset($_POST['nuSTATE']['record_id']) ? $_POST['nuSTATE']['record_id'] : '';

	if($ct == 'getform'){

		$logfield					= $r->sfo_table . '_nulog';
		$cts						= nuGetJSONData('clientTableSchema');
		$user						= $_POST['nuHash']['USER_ID'];
		$globalAccess				= nuGlobalAccess(true);

		/*
		To-Do: Check if not Launch Form
		if ($globalAccess) {
			$dm = nuGetFormPermission($FID,'slf_data_mode');
			if ($dm == "2" && RECORD_ID != '-1') {
					nuDisplayError('Existing Records cannot be viewed.');
					return;
			}
		}
		*/


		if (! $globalAccess) {
			$ft = nuGetFormPermission($FID,'slf_form_type');
			if (($recordID == "" && $ft == '1') || ($recordID !== "" && $ft == '0')) {
					nuDisplayError(nuTranslate('Access Denied'));
					return;
			}
		}


		if(( nuObjKey($cts,$r->sfo_table) != NULL && $recordID != '' )){

			if(in_array($logfield, $cts[$r->sfo_table]['names'])){								//-- valid log field name

				$S				= "SELECT $logfield FROM `$r->sfo_table` WHERE `$r->sfo_primary_key` = ? ";

				$T				= nuRunQuery($S, array($RID));

				$jd = '';
				if (db_num_rows($T) == 1) {
					$J			= db_fetch_row($T);
					$J			= $J[0];
					$_POST['nuLog'] = $J;
					$jd	= json_decode($J);
				}

				if(gettype($jd) == 'object'){
					$jd->viewed	= Array('user' => $user, 'time' => time());
				}else{

					$jd			= new stdClass;
					$jd->added	= Array('user' => 'unknown', 'time' => 0);
					$jd->viewed	= Array('user' => $user, 'time' => time());

				}

				$je				= addslashes(json_encode($jd));
				$S				= "UPDATE `$r->sfo_table` SET $logfield = '$je' WHERE `$r->sfo_primary_key` = ? ";
				$T				= nuRunQuery($S, array($RID));

			} else {
				$_POST['nuLog'] = json_encode([]);
			}

		}

	}

	if ($recordID != '') {
		$p = nuProcedure('nuBeforeEdit');
		if($p != '') { eval($p); }
		if(count($_POST['nuErrors']) > 0){return;}

		nuEval($FID . '_BE');
	}

	$js = $r->sfo_javascript;
	$jb = isset($r->sfo_browse_javascript) ? $r->sfo_browse_javascript : '';
	$je = isset($r->sfo_edit_javascript) ? $r->sfo_edit_javascript : '';
	$js .= $recordID == '' ? ' '.$jb : ' '.$je;

	$GLOBALS['STYLE']		= isset($r->sfo_style) ? $r->sfo_style : '';
	$GLOBALS['EXTRAJS']		.= $js;

}

function nuFormCode($f){

	return nuFormProperties($f,'sfo_code')->sfo_code;

}

function nuRunType($r) {
	return isset($r->sob_run_type) ? $r->sob_run_type : '';
}

function nuEvents($r) {
	return isset($r->sob_all_event) ? $r->sob_all_event : '';
}

function nuGetFormObject($F, $R, $OBJS, $tabs = null){

	if($tabs == null) {
		$tabs = nuBuildTabList($F);
	}

	$f				= nuGetEditForm($F, $R);
	$f->form_id		= $F;

	if ($R == '' && $f->form_type == 'launch') $R = '-1';
	$f->record_id	= $R;

	if(!isset($f->table) || $f->table == '' || $R == ''){
		$A			= array();
	}else{

		$s	= "SELECT * FROM `$f->table` WHERE `$f->primary_key` = ?";
		$t	= nuRunQuery($s, array($R));
		$A	= db_fetch_array($t);

	}

	$s = "

	SELECT *
	FROM zzzzsys_form
	INNER JOIN zzzzsys_object ON sob_all_zzzzsys_form_id = zzzzsys_form_id
	INNER JOIN zzzzsys_tab ON zzzzsys_tab_id = sob_all_zzzzsys_tab_id
	WHERE zzzzsys_form_id = ?
	ORDER BY sob_all_order, syt_order, (sob_all_type = 'run'), sob_all_zzzzsys_tab_id

	";

	$cloneable					= array();
	$a							= array();

	if($R != ''){

		$t							= nuRunQuery($s, array($F));

		while($r = db_fetch_object($t)){

			$o						= nuDefaultObject($r, $tabs);

			if($r->sob_all_cloneable == '0'){
				$cloneable[]		= array('subform' => $r->sob_all_type == 'subform', 'id' => $r->sob_all_id);
			}

			if($R == '-1'){
				$o->value			= '';//nuGetSQLValue($r->sob_all_default_value_sql);
			}else{
				$o->value			= nuObjKey($A,$r->sob_all_id,'');
			}

			if($r->sob_all_type == 'calc'){

				$o->formula			= $r->sob_calc_formula;
				$o->format			= $r->sob_calc_format;
				$o->align			= $r->sob_all_align;
				$o->calc_order		= $r->sob_all_order;

			}

			if($r->sob_all_type == 'textarea' || $r->sob_all_type == 'run'){
				$o->align			= $r->sob_all_align;
			}

			if($r->sob_all_type == 'input' || $r->sob_all_type == 'display'){

				$o->align			= $r->sob_all_align;
				$o->format			= '';
				$inputType			= $r->sob_input_type;

				if($inputType== 'nuNumber' || $inputType == 'nuDate'){
					$o->format		= $r->sob_input_format;
				}

				if($inputType == 'nuAutoNumber'){

					$o->counter		= $o->value;

				}

				$o->input			= $inputType;

				if($inputType == 'button' && $r->sob_all_type == 'input'){
					$o->value		= $r->sob_all_label;
				}

				if($inputType == 'nuScroll' && $r->sob_all_type == 'input'){
					$o->scroll		= $r->sob_input_javascript;
				}

				if(($inputType == 'nuDate' || $inputType == 'nuNumber' || $inputType == 'number' || $inputType == 'text' || $inputType == 'email' || $inputType == 'search' || $inputType == 'month') && $r->sob_all_type == 'input' && $r->sob_input_datalist != ''){
					$o->datalist	= json_encode (nuDataListOptions(nuReplaceHashVariables($r->sob_input_datalist)));
				}

				if($r->sob_all_type == 'display'){

					$disS			= nuReplaceHashVariables($r->sob_display_sql);
					$disT			= nuRunQuery($disS);

					if (db_num_rows($disT) >= 1) {
						$disR		= db_fetch_row($disT);
						$o->value	= $disR[0];
					} else {
						$o->value	= null;
					}

				}

			}

			if($r->sob_all_type == 'contentbox'){

				$cWidth		= $o->width."px";
				$cHeight	= $o->height."px";
				$cLabel		= nuTranslate($r->sob_all_label);
				$cId		= $r->sob_all_id;
				$cTitleId	= 'label_'.$cId;
				$cContentId	= 'content_'.$cId;
				$cBoxId		= 'box_'.$cId;
				$cAlign		= $r->sob_all_align;

				$o->html = nuReplaceHashVariables($r->sob_html_code)."
					<div class='nuContentBox' id='$cBoxId' style='left: 0px; top: 0px; height: $cHeight; width: $cWidth;'>
					<div class='nuContentBoxTitle' style='text-align: $cAlign' id='$cTitleId'>$cLabel</div>
					<div class='nuContentBoxContent' id='$cContentId'></div>
					</div>
				";

			}

			if($r->sob_all_type == 'editor'){
					$o->html		= nuReplaceHashVariables($r->sob_html_code);
			}

			if($r->sob_all_type == 'html'){

				if($r->sob_html_chart_type == ''){
					$o->html		= nuReplaceHashVariables($r->sob_html_code);
				}else{

					$o->html		= '';
					$htmljs			= addslashes($r->sob_html_javascript);

					$v = isset($r->sob_html_vertictal_label) ? $r->sob_html_vertictal_label : '';
					$h = isset($r->sob_html_horizontal_label) ? $r->sob_html_horizontal_label : '';
					$title = isset($r->sob_html_title) ? $r->sob_html_title : '';
					$htmlj = "";

					if($r->sob_html_chart_type == 'p'){
						$htmlj	= "\nnuChart('$r->sob_all_id', 'PieChart', '$htmljs', '$title', '$h', '$v', 'bars', false);";
					}

					if($r->sob_html_chart_type == 'l'){
						$htmlj	= "\nnuChart('$r->sob_all_id', 'ComboChart', '$htmljs', '$title', '$h', '$v', 'lines', false);";
					}

					if($r->sob_html_chart_type == 'b'){
						$htmlj	= "\nnuChart('$r->sob_all_id', 'ComboChart', '$htmljs', '$title', '$h', '$v', 'bars', false);";
					}

					if($r->sob_html_chart_type == 'bs'){
						$htmlj	= "\nnuChart('$r->sob_all_id', 'ComboChart', '$htmljs', '$title', '$h', '$v', 'bars', true);";
					}

					if($r->sob_html_chart_type == 'bh'){
						$htmlj	= "\nnuChart('$r->sob_all_id', 'BarChart', '$htmljs', '$title', '$h', '$v', 'bars', false);";
					}

					if($r->sob_html_chart_type == 'bhs'){
						$htmlj	= "\nnuChart('$r->sob_all_id', 'BarChart', '$htmljs', '$title', '$h', '$v', 'bars', true);";
					}

					nuAddJavascript($htmlj);

				}

			}

			if($r->sob_all_type == 'image'){
				$o->src				= nuGetSrc($r->sob_image_zzzzsys_file_id);
			}

			if($r->sob_all_type == 'select'){

				$o->multiple		= $r->sob_select_multiple;
				$o->select2			= isset($r->sob_select_2) ? $r->sob_select_2 : null;
				$o->options			= nuSelectOptions(nuReplaceHashVariables($r->sob_select_sql));

			}

			if($r->sob_all_type == 'run'){

				$fromId				= $r->sob_run_zzzzsys_form_id;
				$o->form_id			= $fromId;
				$o->record_id		= nuReplaceHashVariables($r->sob_run_id);
				$o->parameters		= $r->sob_all_id;

				$runType			= nuRunType($r);

				if ($runType == 'F') {

					$o->run_type	= 'F';

				}else if($runType == 'P' || isProcedure($fromId)){

					$actt			= nuRunQuery('SELECT sph_zzzzsys_form_id, sph_code FROM zzzzsys_php WHERE zzzzsys_php_id = ?', array($fromId));
					$act			= db_fetch_object($actt);
					$o->form_id		= $act->sph_zzzzsys_form_id;
					$o->record_id	= $act->sph_code;
					$o->run_type	= 'P';
					$runtab			= nuRunQuery("SELECT sph_run FROM zzzzsys_php WHERE zzzzsys_php_id = ?", array($r->sob_run_zzzzsys_form_id));
					$o->run_hidden	= db_fetch_object($runtab)->sph_run == 'hide';

				}else if($runType == 'R' || isReport($fromId)){

					$actt			= nuRunQuery('SELECT sre_zzzzsys_form_id, sre_code  FROM zzzzsys_report WHERE zzzzsys_report_id = ?', array($fromId));
					$act			= db_fetch_object($actt);
					$o->form_id		= $act->sre_zzzzsys_form_id;;
					$o->record_id	= $act->sre_code;
					$o->run_type	= 'R';

				}else{
					$o->run_type	= 'F';
				}

				$o->filter			= nuReplaceHashVariables($r->sob_run_filter);
				$o->run_method		= $r->sob_run_method;
				$o->run_target		= isset($r->sob_run_target) ? $r->sob_run_target : '0';

			}

			if($r->sob_all_type == 'lookup'){

				$o->description_width	= $r->sob_lookup_description_width;
				$o->form_id				= $r->sob_lookup_zzzzsys_form_id;
				$o->values				= nuGetLookupValues($r, $o);

			}

			if($r->sob_all_type == 'subform'){

				// need to set both subform_fk in $r and $o for later use
				$r->subform_fk			= $R;
				$o->subform_fk			= $R;
				$o->subform_type		= $r->sob_subform_type;
				$o->delete				= $r->sob_subform_delete;
				$f->foreign_key_name	= $r->sob_subform_foreign_key;
				$o->foreign_key_name	= $r->sob_subform_foreign_key;
				$o->primary_key_name	= nuFormProperties($r->sob_subform_zzzzsys_form_id,'sfo_primary_key')->sfo_primary_key;
				$f->primary_key_name	= $o->primary_key_name;
				$o->add					= $r->sob_subform_add;
				$o->dimensions			= nuFormDimensions($r->sob_subform_zzzzsys_form_id);
				$o->forms				= nuGetSubformRecords($r, $o->add);
				$o->sf_form_id			= $r->sob_subform_zzzzsys_form_id;
				$o->browse_columns		= array();

			}

			if($r->sob_all_type == 'word'){
				$o->word				= $r->sob_all_label;
				$o->align				= $r->sob_all_align;
			}

			if (nuEvents($r) == '0') {
				$o->js 					= [];
			} else {
				$o->js					= nuObjectEvents($r->zzzzsys_object_id);
			}

			$o->tab_order				= $r->sob_all_order;
			$o->style_type				= isset($r->sob_all_style_type) ? $r->sob_all_style_type : '';
			$o->style					= isset($r->sob_all_style) ? $r->sob_all_style : '';

			if (isset($r->sob_input_attribute) && $r->sob_input_attribute != ''){
				$o->attributes	= $r->sob_input_attribute;
			} else {
				$o->attributes	= '';
			}

			if (isset($r->sob_input_icon) && $r->sob_input_icon != ''){
				$o->input_icon	= $r->sob_input_icon;
			} else {
				$o->input_icon	= '';
			}

			if($OBJS > 0){

				unset($o->type);
				unset($o->id);
				unset($o->label);
				unset($o->top);
				unset($o->left);
				unset($o->width);
				unset($o->height);
				unset($o->align);

			}

			$a[]	= $o;

		}

	}

	$f->tabs				= nuRefineTabList($tabs);
	$f->noclone				= $cloneable;
	$f->browse_columns		= nuBrowseColumns($f);
	$B						= nuBrowseRows($f);

	$f->browse_rows			= nuObjKey($B,0,0);
	$f->browse_height		= nuObjKey($B,1,0);
	$f->browse_sql			= nuObjKey($B,2,0);

	if ($f->browse_height > 0) {
		nuOnProcess($F, $f, 'BB', 'nuOnProcessBrowseRows');
	}

	$__x					= nuHash();
	$f->browse_table_id		= $__x['TABLE_ID'];
	unset($__x);

	$rows					= isset($f->rows) ? $f->rows : 1;
	$f->pages				= ceil($f->browse_height/$rows);
	$f->objects				= $a;
	$f->number_formats		= nuBuildCurrencyFormats();
	$O						= new stdClass();

	if ($f->browse_height == 0) {
		nuOnProcess($F, $f, 'BE', 'nuOnProcessObjects');
	}

	$O->forms[]				= $f;

	return $O->forms[0];

}

function nuExtractFunctionBody($functionName, $data) {

	$c = preg_match("/function\s+".$functionName."\s*\((?<param>[^\)]*)\)\s*(?<body>\{(?:[^{}]+|(?&body))*\})/", $data, $matches);
	if ($c == 0) {
		$c = preg_match("/\\$".$functionName."\s+=\s+function\s*\((?<param>[^\)]*)\)\s*(?<body>\{(?:[^{}]+|(?&body))*\})/", $data, $matches);
	}

	return $c > 0 ? $matches['body'] : null;

}

function nuOnProcess($F, &$f, $eventCode, $functionName){

	$p	= nuProcedure($F . '_'.$eventCode);
	if ($p != '') {
		if (strpos($p, $functionName) !== false) {
			$body = nuExtractFunctionBody($functionName, $p);
			if ($body != null) {
				eval($body);
			}
		}
	}

}

function nuGetSrc($i){

	$s	= "SELECT sfi_json FROM zzzzsys_file WHERE zzzzsys_file_id = ? ";
	$t	= nuRunQuery($s, array($i));

	if (db_num_rows($t) == 1) {
		$r		= db_fetch_object($t);
		$json	= json_decode($r->sfi_json);
		$j		= $json->file;
	} else {
		$j	= null;
	}

	return $j;

}

function nuObjectEvents($i){

	$a	= array();
	$s	= "SELECT sev_event AS event, sev_javascript AS js FROM zzzzsys_event WHERE sev_zzzzsys_object_id = ?";
	$t	= nuRunQuery($s, array($i));

	while($r = db_fetch_object($t)){
		$a[]	= $r;
	}

	return $a;

}

function nuDefaultObject($r, $t){

	$o					= new stdClass();
	$v					= $r->sob_all_validate;

	$o->type			= $r->sob_all_type;
	$o->object_id		= $r->zzzzsys_object_id;
	$o->id				= $r->sob_all_id;
	$o->label			= $r->sob_all_label;

	$top				= null;
	$left				= null;
	$width				= null;
	$height				= null;
	$mobile				= null;
	$visible			= null;
	$labelOnTop			= null;

	/*
	if (nuIsMobile() && isset($r->sob_all_json)) {

		$json = $r->sob_all_json;
		if ($json != '') {

			$obj	= json_decode($json, true);

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

	$o->mobile			= $mobile;
	$o->labelOnTop		= $labelOnTop;
	$o->visible			= $visible;

	$o->top				= $top		== null ? $r->sob_all_top : $top;
	$o->left			= $left		== null ? $r->sob_all_left : $left;
	$o->width			= $width	== null ? $r->sob_all_width : $width;
	$o->height			= $height	== null ? $r->sob_all_height : $height;

	$o->valid			= $r->sob_all_validate;
	$o->read			= $r->sob_all_access;
	$o->format			= '';

	$countt = count($t);
	for($i = 0 ; $i < $countt ; $i++){

		if($r->sob_all_zzzzsys_tab_id == $t[$i]->zzzzsys_tab_id){
			$o->tab = $t[$i]->number;
		}

	}

	return $o;

}

function nuGetEditForm($F, $R){

	$f = new stdClass();
	if ($F == '') return $f;

	$r								= nuFormProperties($F);
	$SQL							= new nuSqlString(nuReplaceHashVariables($r->sfo_browse_sql));

	$f->id							= $r->zzzzsys_form_id;
	$f->form_code					= $r->sfo_code;
	$f->form_description			= $r->sfo_description;
	$f->form_type					= $r->sfo_type;
	$f->browse_title_multiline		= isset($r->sfo_browse_title_multiline) ? $r->sfo_browse_title_multiline : false;
	$f->browse_autoresize_columns	= isset($r->sfo_browse_autoresize_columns) ? $r->sfo_browse_autoresize_columns : null;
	$f->table						= nuReplaceHashVariables($r->sfo_table);
	$f->primary_key					= $r->sfo_primary_key;
	$f->redirect_form_id			= $r->sfo_browse_redirect_form_id	== '' ? $r->zzzzsys_form_id : $r->sfo_browse_redirect_form_id;
	$f->redirect_other_form_id		= $r->sfo_browse_redirect_form_id	== '' ? '' : $r->sfo_browse_redirect_form_id;
	$f->order						= $SQL->orderBy;
	$f->where						= $SQL->where;
	$f->from						= $SQL->from;
	$f->javascript					= $r->sfo_javascript;
	$f->javascript_edit				= isset($r->sfo_edit_javascript) ? $r->sfo_edit_javascript : '';
	$f->javascript_browse			= isset($r->sfo_browse_javascript) ? $r->sfo_browse_javascript : '';

	if(intval($r->sfo_browse_row_height) == 0){
		$f->row_height	= 18;
	}else{
		$f->row_height	= intval($r->sfo_browse_row_height);
	}

	$f->rows	= nuRowsPerPage($r->sfo_browse_rows_per_page);
	$f->title	= nuBreadcrumbDescription($r, $R);

	return $f;

}

function nuRowsPerPage($rows) {

	$hk = nuReplaceHashVariables('#ROWS_PER_PAGE#');
	if (!hashCookieNotSetOrEmpty($hk)) {
		return intval($hk);
	} else {
		return ($rows == 0 || $rows == null) ? 20 : $rows;
	}

}

function nuBreadcrumbDescriptionPart($bt){

	if(strtolower(substr(trim($bt), 0, 6)) == 'select'){
		$t	= nuRunQuery($bt);
		return db_fetch_row($t)[0];
	}

	return $bt;
}

function nuBreadcrumbDescription($r, $R){

	if($R == '') {return $r->sfo_description;}																			//-- Browse Form, new record

	if(!isset($r->sfo_breadcrumb_title) || trim($r->sfo_breadcrumb_title) == '')	{return $r->sfo_description;}		//-- no breadcrumb

	$bt = $r->sfo_breadcrumb_title;

	$parts = nuStringContains('|', $bt);

	if ($parts) {
		$a = explode("|", $bt);
		$b = $R == '-1' ? nuTranslate(nuBreadcrumbDescriptionPart($a[1])) : nuBreadcrumbDescriptionPart($a[0]) ;
	} else {
		$b = nuBreadcrumbDescriptionPart($bt);
	}

	return nuReplaceHashVariables($b);

}

function nuGetOtherLookupValues($o){

	$p								= $o->object_id;
	$l								= $_POST['nuHash']['LOOKUP_RECORD_ID'];
	$s								= "SELECT sob_lookup_zzzzsys_form_id as form_id FROM zzzzsys_object WHERE zzzzsys_object_id = ? ";
	$t								= nuRunQuery($s, array($p));
	$r								= db_fetch_object($t);
	$i								= $r->form_id;
	$f								= nuFormProperties($i,'sfo_table, sfo_primary_key');
	$s								= "SELECT * FROM $f->sfo_table WHERE $f->sfo_primary_key = ? ";
	$t								= nuRunQuery($s, array($l));
	$_POST['lookup_row']			= db_fetch_object($t);

	if(db_num_rows($t) == 1){
		$_POST['lookup_row']->ID	= $l;
	}

	if(db_num_rows($t) == 0){

		$_POST['lookup_row']		= new stdClass;
		$_POST['lookup_row']->ID	= '';

	}

	$_POST['lookup_values']			= array();

	$GLOBALS['EXTRAJS']		= '';
	nuEval($p . '_AB');

	return $_POST['lookup_values'];

}

function nuGetAllLookupValues(){

	$OID					= $_POST['nuSTATE']['object_id'];
	$PK						= $_POST['nuSTATE']['primary_key'];
	$s						= "SELECT * FROM zzzzsys_object WHERE zzzzsys_object_id = ?";
	$t						= nuRunQuery($s, array($OID));
	$r						= db_fetch_object($t);
	$o						= nuDefaultObject($r, array());
	$o->description_width	= $r->sob_lookup_description_width;
	$o->form_id				= $r->sob_lookup_zzzzsys_form_id;
	$o->value				= $PK;

	$l						= nuGetLookupValues($r, $o);

	$_POST['nuHash']['LOOKUP_RECORD_ID'] = $l[0][1];

	$e						= nuGetOtherLookupValues($o);

	$f						= new stdClass;
	$f->lookup_values		= array_merge($l, $e);
	$f->lookup_javascript	= nuObjKey($GLOBALS,'EXTRAJS', '') . ";$r->sob_lookup_javascript";

	return $f;

}

function nuGetLookupValues($R, $O){


	$was		= $_POST['nuHash']['TABLE_ID'];

	$_POST['nuHash']['TABLE_ID'] = nuTT();

	nuBeforeBrowse($O->form_id);

	$s			= "SELECT sfo_primary_key, sfo_browse_sql FROM zzzzsys_form WHERE zzzzsys_form_id = ?";
	$t			= nuRunQuery($s, array($O->form_id));
	$r			= db_fetch_object($t);
	$S			= new nuSqlString(nuReplaceHashVariables($r->sfo_browse_sql));

	$s			= "
		SELECT
			$r->sfo_primary_key,
			$R->sob_lookup_code,
			$R->sob_lookup_description
			$S->from
		WHERE
			`$r->sfo_primary_key` = ?
	";

	$s			= nuReplaceHashVariables($s);
	$t			= nuRunQuery($s, array($O->value));
	$l			= db_fetch_row($t);

	$f			= nuObjKey($_POST['nuSTATE'],'prefix','') . $O->id;

	nuRunQuery(nuReplaceHashVariables('DROP TABLE if EXISTS #TABLE_ID#'));

	$_POST['nuHash']['TABLE_ID'] = $was;

	$v			= array();
	$v[]		= array($f,					isset($l[0]) ? $l[0] : '');
	$v[]		= array($f . 'code',		isset($l[1]) ? $l[1] : '');
	$v[]		= array($f . 'description',	isset($l[2]) ? $l[2] : '');

	return $v;

}


function nuGetAllLookupList(){

	$O				= $_POST['nuSTATE']['object_id'];
	$C				= $_POST['nuSTATE']['code'];
	$was			= nuObjKey($_POST['nuHash'],'TABLE_ID');

	$_POST['nuHash']['TABLE_ID'] = nuTT();

	$s				= "SELECT sob_lookup_code, sob_lookup_description, sob_lookup_zzzzsys_form_id, sob_lookup_javascript FROM zzzzsys_object WHERE zzzzsys_object_id = ?";
	$t				= nuRunQuery($s, array($O));
	$r				= db_fetch_object($t);
	$code			= $r->sob_lookup_code;
	$description	= $r->sob_lookup_description;
	$form_id		= $r->sob_lookup_zzzzsys_form_id;
	$js				= $r->sob_lookup_javascript;

	nuBeforeBrowse($form_id);

	$s				= "SELECT sfo_primary_key, sfo_browse_sql FROM zzzzsys_form WHERE zzzzsys_form_id = ?";
	$t				= nuRunQuery($s, array($form_id));
	$r				= db_fetch_object($t);
	$id				= $r->sfo_primary_key;
	$SQL			= new nuSqlString(nuReplaceHashVariables($r->sfo_browse_sql));
	$s				= "
					SELECT $id, $code, $description
					$SQL->from
					$SQL->where
					AND $code = ?
					ORDER BY $code
					";

	$s				= nuReplaceHashVariables($s);
	$t				= nuRunQuery($s, array($C));
	$like			= '';
	$a				= array();

	if(db_num_rows($t) == 0){

		$s			= "
					SELECT $id, $code, $description
					$SQL->from
					$SQL->where
					AND ($code LIKE ? OR $description LIKE ?)
					AND '$C' != ''
					ORDER BY $code
					";

		$t			= nuRunQuery($s, ['%' . $C . '%', '%' . $C . '%']);

	}

	nuRunQuery(nuReplaceHashVariables('DROP TABLE if EXISTS #TABLE_ID#'));

	$_POST['nuHash']['TABLE_ID'] = $was;

	while($r = db_fetch_row($t)){
		$a[]		= $r;
	}

	$f						= new stdClass;
	$f->lookup_like			= $like;
	$f->lookup_values		= $a;
	$f->lookup_javascript	= $js;

	return $f;

}


function nuLookupRecord(){

	return $_POST['lookup_row'];

}


function nuSetFormValue($f, $v){

	$f							= str_replace('#ROW#', $_POST['nuSTATE']['prefix'], $f);

	$_POST['lookup_values'][]	= array($f, $v);

}

function nuDataListOptions($sql) {

	$a				= array();

	$s = strtoupper(trim($sql));

	if (substr($s, 0, 6) == 'SELECT' || substr($s, 0, 4) == 'SHOW') {	//-- sql statement

			$t		= nuRunQuery($sql);

			if (nuErrorFound()) {
				return;
			}

			while ($r = db_fetch_row($t)) {
				$a[]	= $r;
			}
	} else if (substr(trim($s), 0, 1) == '[') {
		$a = json_decode($sql);
	} else {
		return $sql;
	}

	return $a;

}

function nuSelectOptions($sql) {

	$a				= array();

	if (substr(strtoupper(trim($sql)), 0, 11) == '%LANGUAGES%') {					//-- language Files

		foreach(glob("languages/*.sql") as $file)  {

			$f	= basename($file, '.sql');

			$r		= array();
			$r[0]	= $f;
			$r[1]	= $f;
			$a[]	= $r;

		}

	} elseif (substr(strtoupper(trim($sql)), 0, 6) == 'SELECT' || substr(strtoupper($sql), 0, 5) == 'WITH ') {						//-- sql statement

			$t		= nuRunQuery($sql);

			if (nuErrorFound()) {
				return;
			}

			while ($r = db_fetch_row($t)) {
				$a[]	= $r;
			}

	} else {																	//-- comma delimited string

		$t			= explode('|', nuRemoveNonCharacters($sql));

		$countt = count($t);
		for ($i = 0; $i < $countt; $i++) {

			$r		= array();
			$r[0]	= $t[$i];
			$r[1]	= $t[$i + 1];
			$a[]	= $r;
			$i++;

		}

	}

	return $a;

}

function nuRemoveNonCharacters($s){

	$snip = str_replace("\t", '', $s); // remove tabs
	$snip = str_replace("\n", '', $snip); // remove new lines
	$snip = str_replace("\r", '', $snip); // remove carriage returns

	return $snip;

}


function nuGetSubformRecords($R, $A){

	$f = nuGetEditForm($R->sob_subform_zzzzsys_form_id, '');
	$w = $f->where == '' ? '' : ' AND (' . substr($f->where, 6) . ')';
	$s = "SELECT `$f->primary_key` $f->from WHERE (`$R->sob_subform_foreign_key` = '$R->subform_fk') $w $f->order";
	$I = $_POST['nuHash']['RECORD_ID'];


	$t = nuRunQuery($s);
	$a = array();

	$tabs			= nuBuildTabList($R->sob_subform_zzzzsys_form_id);

	while($r = db_fetch_row($t)){

		$_POST['nuHash']['RECORD_ID']			= $r[0];
		$o										= nuGetFormObject($R->sob_subform_zzzzsys_form_id, $r[0], count($a), $tabs);
		$o->foreign_key							= $R->subform_fk;
		$o->foreign_key_name					= $R->sob_subform_foreign_key;
		$a[]									= $o;

	}

	$_POST['nuHash']['RECORD_ID']				= -1;
	$o											= nuGetFormObject($R->sob_subform_zzzzsys_form_id, -1, count($a), $tabs);
	$o->foreign_key								= $R->subform_fk;
	$o->foreign_key_name						= $R->sob_subform_foreign_key;
	$a[]										= $o;

	$_POST['nuHash']['RECORD_ID']				= $I;

	return $a;

}

function nuBuildTabList($i){

	$o = 0;
	$a = array();
	$s = "

		SELECT zzzzsys_tab.*
		FROM zzzzsys_tab
		INNER JOIN zzzzsys_object ON sob_all_zzzzsys_form_id = syt_zzzzsys_form_id
		GROUP BY `zzzzsys_tab_id`, `syt_zzzzsys_form_id`
		HAVING syt_zzzzsys_form_id = ?
		ORDER BY `syt_order`;

		";

	$t = nuRunQuery($s, array($i));

	while($r = db_fetch_object($t)){

		$r->number = $o;
		$o++;
		$a[] = $r;

	}

	return $a;

}


function nuRefineTabList($t){

	$a			= array();

	$count = count($t);
	for($i = 0 ; $i < $count ; $i++){

		$a[]	= array('title' => $t[$i]->syt_title, 'id' => $t[$i]->zzzzsys_tab_id, 'help' => $t[$i]->syt_help, 'access' => isset($t[$i]->syt_access) ? $t[$i]->syt_access : null);

	}

	return $a;

}


function nuGetSQLValue($s){

	$s		= nuReplaceHashVariables(trim($s));

	if(trim($s) == ''){
		return '';
	}else{

		$t	= nuRunQuery($s);
		$r	= db_fetch_row($t);

		return $r[0];

	}

}

function nuBrowseColumns($f){

	if($f->record_id != ''){return array();}

	nuBeforeBrowse($f->id);

	$s				= "SELECT * FROM zzzzsys_browse WHERE sbr_zzzzsys_form_id = ? ORDER BY sbr_order";
	$t				= nuRunQuery($s, array($f->id));
	$a				= array();

	while($r = db_fetch_object($t)){

		$r->title	= $r->sbr_title;
		$r->display	= $r->sbr_display;
		$r->align	= $r->sbr_align;
		$r->width	= $r->sbr_width;
		$r->order	= $r->sbr_order;
		$r->format	= $r->sbr_format;
		$r->id		= $r->zzzzsys_browse_id;

		unset($r->zzzzsys_browse_id);
		unset($r->sbr_zzzzsys_form_id);
		unset($r->sbr_title);
		unset($r->sbr_display);
		unset($r->sbr_align);
		unset($r->sbr_format);
		unset($r->sbr_sort);
		unset($r->sbr_order);
		unset($r->sbr_width);

		$a[]		= $r;

	}

	return $a;

}

function nuBrowseRows($f){

	if(trim($f->record_id) != ''){return array();}

	$P				= $_POST['nuSTATE'];

	$rows			= isset($P['rows']) ? $P['rows'] : 0;
	if($rows == -1){
		$rows		= nuFormProperties($f->form_id,'sfo_browse_rows_per_page')->sfo_browse_rows_per_page;
	}
	$rows			= nuRowsPerPage($rows);

	$page_number	= isset($P['page_number']) ? $P['page_number'] : 0;
	$nosearch_columns = isset($_POST['nuSTATE']['nosearch_columns']) ? $_POST['nuSTATE']['nosearch_columns'] : null;
	$start			= $page_number * $rows;
	$search			= str_replace('&#39;', "'", nuObjKey($P,'search'));
	$filter			= str_replace('&#39;', "'", nuObjKey($P,'filter'));
	$s				= "SELECT sfo_browse_sql FROM zzzzsys_form WHERE zzzzsys_form_id = ?";
	$t				= nuRunQuery($s, array($f->id));
	$r				= db_fetch_object($t);

	if(trim($r->sfo_browse_sql) == ''){
		return array(array(), 0);
	}

	$S				= new nuSqlString(nuReplaceHashVariables($r->sfo_browse_sql));

	$S->addField('$'.$f->primary_key.'$');

	$displayContainsPK = false;

	$countBrowseColumns = count($f->browse_columns);
	for($i = 0 ; $i < $countBrowseColumns ; $i++){
		$d = $f->browse_columns[$i]->display;
		if ($d == $f->primary_key) $displayContainsPK = true;
		$S->addField($d);
	}

	$flds			= array();
	$fields			= array_slice($S->fields,1);

	if($nosearch_columns === null){
		$_POST['nuSTATE']['nosearch_columns']	= array();
	}

	$countFields = count($fields);
	for($i = 0 ; $i < $countFields ; $i++){

		if(!in_array($i, $_POST['nuSTATE']['nosearch_columns'])){
			$flds[]	= $fields[$i];
		}

	}

	$where			= trim(nuBrowseWhereClause($flds, $filter . ' ' . $search));
	$__x			= nuHash();
	$like			= isset($__x['like']) ? $__x['like'] : '';
	unset($__x);
	$like			= str_replace('\\"','"',$like);
	$haswhere		= $where != '()';
	$haslike		= $like != '';
	$hardwhere		= $S->getWhere();

	if($haslike		&& $haswhere){	$S->setWhere(" $hardwhere AND $like AND $where");}
	if($haslike		&& !$haswhere){	$S->setWhere(" $hardwhere AND $like");}
	if(!$haslike	&& $haswhere){	$S->setWhere(" $hardwhere AND $where");}

	if(isset($P['sort']) && $P['sort'] != '-1'){
		$S->setOrderBy(' ORDER BY ' . $S->fields[$P['sort'] + 1] . ' ' . $P['sort_direction']);
	}

	$a				= array();
	$s				= nuReplaceHashVariables($S->SQL);

	$S->SQL = str_replace('$'.$f->primary_key.'$',$f->primary_key,$S->SQL);

	if ($displayContainsPK) {
		$sCount = str_replace('$'.$f->primary_key.'$,','',$s);
	} else {
		$sCount = str_replace('$'.$f->primary_key.'$',$f->primary_key,$s);
	}

	$t = nuRunQuery('SELECT COUNT(*) FROM ('. $sCount . ') nuTCount');
	$rowData = !nuErrorFound() ? db_fetch_row($t)[0] : 0;

	$s				.= " LIMIT " . ($start<0?0:$start) . ", $rows";

	$s = str_replace('$'.$f->primary_key.'$',$f->primary_key,$s);
	$t				= nuRunQuery($s);

	while($r = db_fetch_row($t)){
		$a[]		= $r;
	}

	nuRunQuery(nuReplaceHashVariables('DROP TABLE IF EXISTS #TABLE_ID#'));

	return array($a, $rowData, $S->SQL);

}

function nuBrowseWhereClause($searchFields, $searchString, $returnArray = false) {

	$pos				= -1;
	$start				= -1;
	$where				= array();
	$phrases			= array();
	$SEARCHES			= array();
	$wordSearches		= array();
	$highlight			= array();

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

		$p				= explode(',', $phrases[$i]);
		$SEARCHES[]		= substr($searchString, $p[0], $p[1] - $p[0]);
	}

	$countS = count($SEARCHES);
	for ($i = 0; $i < $countS; $i++) {

		$pos = strpos($searchString, '-' . $SEARCHES[$i]);												//-- check for a preceeding minus

		if ($pos === false) {

			$task[]			= 'include';
			$searchString	= str_replace($SEARCHES[$i], ' ', $searchString);							//-- include phrase
			$highlight[]	= substr($SEARCHES[$i], 1, -1);

		} else {

			$task[]			= 'exclude';
			$searchString	= str_replace('-' . $SEARCHES[$i], ' ', $searchString);						//-- remove phrase

		}

		$SEARCHES[$i]		= ' "%' . substr($SEARCHES[$i], 1, -1) . '%" ';

	}

	$wordSearches			= explode(' ', $searchString);
	$quo					= '"';
	$task					= array();

	$countWordSearches = count($wordSearches);
	for ($i = 0; $i < $countWordSearches; $i++) {

		if (strlen($wordSearches[$i]) > 0) {

			if (substr($wordSearches[$i], 0, 1) == '-' and strlen($wordSearches[$i]) > 1) {				//-- check for a preceeding minus

				$task[]		= 'exclude';
				$SEARCHES[]	= $quo . '%' . addslashes(substr($wordSearches[$i], 1)) . '%' . $quo;		//-- add word to exclude

			} else {

				$task[]		= 'include';
				$SEARCHES[]	= $quo . '%' . addslashes($wordSearches[$i]) . '%' . $quo;					//-- add word to include
				$highlight[]= $wordSearches[$i];

			}

		}

	}

	$countS = count($SEARCHES);
	for ($i = 0; $i < $countS; $i++) {																	//-- search for (or exclude) these strings

		$include = array();
		$exclude = array();

		for ($SF = 0; $SF < count($searchFields); $SF++) {												//-- loop through searchable fields

			if ($task[$i] == 'include') {																//-- changed by KEE
				$include[] = 'CONVERT(' . $searchFields[$SF] . ' USING utf8) LIKE ' . $SEARCHES[$i];
			} else {
				$exclude[] = 'CONVERT(' . $searchFields[$SF] . ' USING utf8) NOT LIKE ' . $SEARCHES[$i];
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

function nuGatherFormAndSessionData($home){

	$formAndSessionData						= new stdClass;
	$nuState								= $_POST['nuSTATE'];
	$sessionId								= $_SESSION['nubuilder_session_data']['SESSION_ID'];

	$formAndSessionData->record_id			= isset($nuState['record_id']) ? $nuState['record_id'] : "-1";

	if(isset($nuState['form_id']) && !$nuState['form_id'] == ''){
		$formAndSessionData->form_id		= $nuState['form_id'];
	} else {
		$formAndSessionData->form_id		= $home == '' ? $_SESSION['nubuilder_session_data']['GLOBEADMIN_HOME'] : $home;
	}

	if(isset($nuState['login_form_id'])){

		if($nuState['login_form_id'] != ''){
			$formAndSessionData->form_id	= $nuState['login_form_id'];
		}

	}

	if(isset($nuState['login_form_id'])){//-- check empty form_id not empty record_id

		if($nuState['login_form_id'] != ''){
			$formAndSessionData->record_id = $nuState['login_record_id'];
		}

	}

	$formAndSessionData->session_id		= $sessionId;
	$formAndSessionData->call_type		= $nuState['call_type'];
	$formAndSessionData->filter			= isset($_POST['nuFilter']) ? $_POST['nuFilter'] : '';
	$formAndSessionData->errors			= array();
	$formAndSessionData->translation	= $_SESSION['nubuilder_session_data']['translation'];

	if($formAndSessionData->form_id != null){
		$formAndSessionData->dimensions	= nuFormDimensions($formAndSessionData->form_id);
	}

	if(!$_SESSION['nubuilder_session_data']['isGlobeadmin'] && $formAndSessionData->form_id != 'nuhome') {

		$getAccessFromSessionTableQRY	= nuRunQuery("SELECT sss_access FROM zzzzsys_session WHERE zzzzsys_session_id = ? ", array($sessionId));
		$getAccessFromSessionTableOBJ	= db_fetch_object($getAccessFromSessionTableQRY);
		$access 						= json_decode($getAccessFromSessionTableOBJ->sss_access);

		if($formAndSessionData->call_type == 'getreport'){

			$r							= nuReportAccessList($access);

			if(!in_array($formAndSessionData->record_id, $r)) { //form_id is record_id for getreport



				$nuT					= nuRunQuery("SELECT sph_code FROM zzzzsys_report WHERE zzzzsys_report_id = ?", array($formAndSessionData->record_id));
				$nuR					= db_fetch_object($nuT);

				nuDisplayError("Access To Report Denied... ($nuR->sre_code)");

			}

		}

		if($formAndSessionData->call_type == 'getphp'){

			$p							= nuProcedureAccessList($access);

			if(!in_array($formAndSessionData->record_id, $p)) { //form_id is record_id for getphp

				$nuT					= nuRunQuery("SELECT sph_code FROM zzzzsys_php WHERE zzzzsys_php_id = ?", array($formAndSessionData->record_id));
				$nuR					= db_fetch_object($nuT);

				nuDisplayError("Access To Procedure Denied... ($nuR->sph_code)");
			}

		}

		$f = nuFormAccessList($access); //-- form list including forms id used in reports and procedures

		if(!in_array($formAndSessionData->form_id, $f) && ($formAndSessionData->call_type == 'getform' || $formAndSessionData->call_type == 'login')){

			$nuT						= nuRunQuery("SELECT sfo_code FROM zzzzsys_form WHERE zzzzsys_form_id = ?", array($formAndSessionData->form_id));
			$nuR						= db_fetch_object($nuT);

			nuDisplayError("Access To Form Denied... ($nuR->sfo_code)");

		}

	}

	$formAndSessionData->errors			= $_POST['nuErrors'];

	return $formAndSessionData;

}

function nuGetFormPermission($f, $field) {

	$s = "SELECT $field FROM zzzzsys_access_form WHERE slf_zzzzsys_access_id = ? AND slf_zzzzsys_form_id = ?";
	$t	= nuRunQuery($s, array($_POST['nuHash']['USER_GROUP_ID'], $f));

	if (db_num_rows($t) == 1) {
		$r = db_fetch_row($t);
		$r = $r[0] == null || $r[0] == '' ? null : (int)$r[0];
	} else {
		$r = null;
	}

	return $r;

}

function nuFormAccessList($j){

	$a			= array();
	$t			= nuRunQuery("SELECT zzzzsys_form_id FROM zzzzsys_form WHERE sfo_type = 'subform'");

	while($r = db_fetch_row($t)){
		$a[]	= $r[0];
	}

	$count = count($j->forms);
	for($i = 0 ; $i < $count ; $i++){
		$a[]	= $j->forms[$i][0];
	}

	$count = count($j->reports);
	for($i = 0 ; $i < $count ; $i++){
		$a[]	= $j->reports[$i][1];
	}

	$count = count($j->procedures);
	for($i = 0 ; $i < $count ; $i++){
		$a[]	= $j->procedures[$i][1];
	}

	$__x		= nuGetUserAccess();
	$a[]		= $__x['HOME_ID'];
	unset($__x);

	return $a;

}



function nuProcedureAccessList($j){

	$a			= array();

	$count = count($j->procedures);
	for($i = 0 ; $i < $count ; $i++){
		$a[]	= $j->procedures[$i][0];
	}

	return $a;

}

function nuReportAccessList($j){

	$a			= array();

	$count = count($j->reports);
	for($i = 0 ; $i < $count ; $i++){
		$a[]	= $j->reports[$i][0];
	}

	return $a;

}


function nuButtons($formid, $POST){

	$t						= nuRunQuery("SELECT sss_access FROM zzzzsys_session WHERE zzzzsys_session_id = ? ", array($_SESSION['nubuilder_session_data']['SESSION_ID']));
	$r						= db_fetch_object($t);
	$nuJ					= json_decode($r->sss_access);
	$_POST['forms']			= $nuJ->forms;
	$_POST['reports']		= $nuJ->reports;
	$_POST['procedures']	= $nuJ->procedures;
	$_POST['session']		= $nuJ->session;
	$C						= '';
	$D						= '';
	$a						= nuFormAccess($formid, $nuJ->forms);
	$c						= $POST['call_type'];
	$recordID				= nuObjKey($POST,'record_id');

	if($c == 'getphp' or $c == 'getreport'){


		$s					= 'SELECT sph_code, sph_description, sph_run FROM zzzzsys_php WHERE zzzzsys_php_id = ? ';
		$t					= nuRunQuery($s, array($recordID));
		$P					= db_fetch_object($t);

		$s					= 'SELECT sre_code, sre_description FROM zzzzsys_report WHERE zzzzsys_report_id = ? ';
		$t					= nuRunQuery($s, array($recordID));
		$R					= db_fetch_object($t);

	}else{

		$s					= 'SELECT sph_code, sph_description, sph_run FROM zzzzsys_php WHERE sph_code = ? ';
		$t					= nuRunQuery($s, array($recordID));
		$P					= db_fetch_object($t);

		$s					= 'SELECT sre_code, sre_description FROM zzzzsys_report WHERE sre_code = ? ';
		$t					= nuRunQuery($s, array($recordID));
		$R					= db_fetch_object($t);

	}

	if($c == 'getphp'){

		$C					= $P->sph_code;
		$D					= $P->sph_description;

		if($P->sph_run == 'hide'){
			return [array('Add' => 0, 'Print' => 0, 'Save' => 0, 'Clone' => 0, 'Delete' => 0, 'Run' => '', 'RunHidden' => 'nuRunPHPHidden("'.$C.'")'), $C, $D];
		}else{
			return [array('Add' => 0, 'Print' => 0, 'Save' => 0, 'Clone' => 0, 'Delete' => 0, 'Run' => 'nuRunPHP("'.$C.'")', 'RunHidden' => ''), $C, $D];
		}

	} else
	if($c == 'getreport'){

		$C					= $R->sre_code;
		$D					= $R->sre_description;

		return [array('Add' => 0, 'Print' => 0, 'Save' => 0, 'Clone' => 0, 'Delete' => 0, 'Run' => 'nuRunReport("'.$C.'")', 'RunHidden' => ''), $C, $D];

	} else {
		return [array('Add' => $a[0], 'Print' => $a[1], 'Save' => $a[2], 'Clone' => $a[3], 'Delete' => $a[4], 'Run' => '', 'RunHidden' => ''), $C, $D];
	}

}


function nuRunCode($P){

	$s						= 'SELECT sph_code FROM zzzzsys_php WHERE zzzzsys_php_id = ? ';
	$t						= nuRunQuery($s, array($P['record_id']));
	$c						= db_fetch_object($t)->sph_code;

	$s						= 'SELECT sre_code FROM zzzzsys_report WHERE zzzzsys_report_id = ? ';
	$t						= nuRunQuery($s, array($P['record_id']));

	if(db_fetch_object($t)->sre_code != ''){
		$c					= db_fetch_object($t)->sre_code;
	}

	return $c;

}

function nuRunDescription($P){

	$s						= 'SELECT sph_description FROM zzzzsys_php WHERE zzzzsys_php_id = ? ';
	$t						= nuRunQuery($s, array($P['record_id']));
	$d						= db_fetch_object($t)->sph_description;

	$s						= 'SELECT sre_code FROM zzzzsys_report WHERE zzzzsys_report_id = ? ';
	$t						= nuRunQuery($s, array($P['record_id']));

	if(db_fetch_object($t)->sre_code != ''){
		$d					= db_fetch_object($t)->sre_description;
	}

	return $d;

}


function nuFormAccess($s, $a){

	if(nuGlobalAccess(true)){
		return array('1', '1', '1', '1', '1');
	}

	if($a !== null){

		$count = count($a);
		for($i = 0 ; $i < $count ; $i++){

			$F	= $a[$i];

			if($s == $F[0]){
				return array($F[1], $F[2], $F[3], $F[4], $F[5]);		//-- Add, Print, Save, Clone, Delete
			}

		}

	}

	return array('0', '0', '0', '0', '0');

}

function nuFormDimensions($f){

	$d			= array();
	$t			= nuRunQuery("SELECT sfo_browse_row_height, sfo_browse_rows_per_page FROM zzzzsys_form WHERE zzzzsys_form_id = ?", array($f));
	$r			= db_fetch_object($t);

	$brh = isset($r->sfo_browse_row_height) ? $r->sfo_browse_row_height : 0;
	$brp = isset($r->sfo_browse_rows_per_page) ? $r->sfo_browse_rows_per_page : 0;

	$bt		 = 57;	//-- browse title
	$rh		 = intval($brh)	== 0 ? 25 : $brh;
	$rs		 = intval($brp) == 0 ? 25 : $brp;
	$bb		 = 25;	//-- browse footer
	$t		 = nuRunQuery("SELECT * FROM zzzzsys_object WHERE sob_all_zzzzsys_form_id = ?", array($f));
	$h		 = 0;
	$w		 = 0;
	$gh		 = 0;
	$gw		 = 0;

	while($r = db_fetch_object($t)){

		if($r->sob_all_type == 'lookup'){

			 $w		= max($w, $r->sob_all_left + $r->sob_all_width + $r->sob_lookup_description_width + 40);
			 $gw	= $gw + $r->sob_all_width + $r->sob_lookup_description_width + 40;

		}else{

			 $w		= max($w, $r->sob_all_left + $r->sob_all_width + 40);
			 $gw	= $gw + $r->sob_all_width + 4;

		}

		if ($r->sob_all_type == 'textarea') {
			$oh = $r->sob_all_height + 8;
		} else if (isset($r->sob_select_2) && $r->sob_select_2 == '1') {
			$oh = $r->sob_all_height + 13;
		} else {
			$oh = $r->sob_all_height;
		}

		$h		= max($h, $r->sob_all_top + $oh);
		$gh		= max($oh, 27, $gh);

	}

	$bh		= $bt + ($rs * $rh) + $bb;
	$bw		= nuGetBrowseWidth($f);

	$grid	= Array('height'=>$gh,	'width'=> $gw);
	$browse	= Array('height'=>$bh,	'width'=> $bw);
	$edit	= Array('height'=>$h,	'width'=> $w);

	$d[]	= $bt + ($rs * $rh) + $bb;	//-- lookup browse height
	$d[]	= $bw;
	$d[]	= $h	+ 0;					 //-- lookup form height
	$d[]	= $w	+ 0;					 //-- lookup form width
	$d[]	= $h	+ 0;					 //-- form height
	$d[]	= $w	+ 50;					 //-- form width
	$d[]	= $gh	+ 0;					 //-- grid height
	$d[]	= $gw	+ 55;					 //-- grid width

	$d[]	= Array('browse'=>$browse, 'edit'=>$edit, 'grid'=>$grid);

	return Array('browse'=>$browse, 'edit'=>$edit, 'grid'=>$grid);

}

function nuGetBrowseWidth($f){

	$t	= nuRunQuery("SELECT SUM(sbr_width) FROM zzzzsys_browse WHERE sbr_zzzzsys_form_id = ? ", array($f));
	$r = db_fetch_row($t);
	return db_num_rows($t) > 0 ? $r[0] : 0;

}

function isForm($i){

	$s	= "SELECT zzzzsys_form_id_id FROM zzzzsys_form WHERE zzzzsys_form_id = ?";
	$t	= nuRunQuery($s, array($i));
	$r	= db_fetch_object($t);

	return db_num_rows($t) > 0;

}

function isProcedure($i){

	$s	= "SELECT zzzzsys_php_id FROM zzzzsys_php WHERE zzzzsys_php_id = ?";
	$t	= nuRunQuery($s, array($i));
	$r	= db_fetch_object($t);

	return db_num_rows($t) > 0;

}

function isReport($i){

	$s	= "SELECT zzzzsys_report_id FROM zzzzsys_report WHERE zzzzsys_report_id = ?";
	$t	= nuRunQuery($s, array($i));
	$r	= db_fetch_object($t);

	return db_num_rows($t) > 0;

}

function nuSetupButtons($f, $t) {

	if($t == 'Report') {

		nuAddPrintButtons($f, 'Run', 'Report');
		nuAddPrintButtons($f, 'Email', 'Report');

	} else if($t == 'PHP') {

		nuAddPrintButtons($f, 'Run', 'PHP');

	}
}

function nuAddPrintButtons($f, $t, $a){

	$i = sizeof($f->forms[0]->buttons);

	$f->forms[0]->buttons[$i][0] = $t;
	$f->forms[0]->buttons[$i][1] = $t.$a;

}

function nuAddJavascript($js, $bc = false){

	if ($bc == true) {
		if (isset($GLOBALS['EXTRAJS_BC'])) {
			$GLOBALS['EXTRAJS_BC'] = $GLOBALS['EXTRAJS_BC'] . "\n\n" . $js;
		}
	} else if (isset($GLOBALS['EXTRAJS'])) {
		$GLOBALS['EXTRAJS'] = $GLOBALS['EXTRAJS'] . "\n\n" . $js;
	}

}

function nuPreloadImages($a){

	$js = '';

	$count = count($a);
	for($i = 0 ; $i < $count ; $i++){

		$s = "
				SELECT sfi_code, sfi_json
				FROM zzzzsys_file
				WHERE sfi_code = ?

			";

		$t  = nuRunQuery($s, array($a[$i]));
		$r	= db_fetch_object($t);

		$tr	= trim($r->sfi_code);
		$js = $js . "\nnuImages['$tr'] = '" . addslashes($r->sfi_json) . "';";

	}

	nuAddJavascript($js);

}

?>
