<?php

function nuFormProperties($f){

	$s	= "SELECT * FROM zzzzsys_form WHERE zzzzsys_form_id = ? ";
	$t	= nuRunQuery($s, array($f));
	$r	= db_fetch_object($t);
	
	return $r;
	
}


function nuBeforeBrowse($f){
	
	$_POST['nuMessages']	= [];
	$r						= nuFormProperties($f);
	nuEval($f . '_BB');
	
}


function nuBeforeEdit($FID, $RID){

	$r						= nuFormProperties($FID);
    $GLOBALS['EXTRAJS']		= '';
	$ct						= $_POST['nuSTATE']['call_type'];

	if($_POST['nuSTATE']['call_type'] == 'getform' and $r == ''){return;}
	
	if($ct == 'getform'){
		
		$logfield					= $r->sfo_table . '_nulog';
		$cts						= nuGetJSONData('clientTableSchema');
		$user						= $_POST['nuHash']['USER_ID'];

		if($cts[$r->sfo_table] !== NULL){
				
			if(in_array($logfield, $cts[$r->sfo_table]['names'])){								//-- valid log field name
				
				$S				= "SELECT $logfield FROM `$r->sfo_table` WHERE `$r->sfo_primary_key` = ? ";
				$T				= nuRunQuery($S, [$RID]);
				$J				= db_fetch_row($T)[0];
				$jd				= json_decode($J);
				
				if(gettype($jd) == 'object'){
					$jd->viewed	= Array('user' => $user, 'time' => time());								
				}else{
					
					$jd 		= new stdClass;
					$jd->added	= Array('user' => 'unknown', 'time' => 0);
					$jd->viewed	= Array('user' => $user, 'time' => time());

				}
				
				$je				= addslashes(json_encode($jd));
				$S				= "UPDATE `$r->sfo_table` SET $logfield = '$je' WHERE `$r->sfo_primary_key` = ? ";
				$T				= nuRunQuery($S, [$RID]);
			
			}
			
		}
		
	}

	if($RID != ''){
		nuEval($FID . '_BE');
	}
	
    $GLOBALS['EXTRAJS']		.= $r->sfo_javascript;
	
}


function nuFormCode($f){
	
	$r	= nuFormProperties($f);
	
	return $r->sfo_code;
	
}

//function nuGetFormObject($F, $R, $OBJS, $P = new stdClass){
function nuGetFormObject($F, $R, $OBJS){
	
    $tabs 			= nuBuildTabList($F);
    $f				= nuGetEditForm($F, $R);
    $f->form_id		= $F;
    $f->record_id	= $R;
	
	if($f->table == ''){
		$A 			= [];
	}else{
		
		$s 			= "Select * From `$f->table` Where `$f->primary_key` = '$R'";
		$t 			= nuRunQuery($s);
		$A 			= db_fetch_array($t);
		
	}


	$s 				= "
 
    SELECT * 
    FROM zzzzsys_form
    INNER JOIN zzzzsys_object ON sob_all_zzzzsys_form_id = zzzzsys_form_id
    INNER JOIN zzzzsys_tab ON zzzzsys_tab_id = sob_all_zzzzsys_tab_id
    WHERE zzzzsys_form_id = ?
    ORDER BY syt_order, (sob_all_type = 'run'), sob_all_zzzzsys_tab_id, sob_all_order    

    ";
	
	if($R != ''){
		
		$t 							= nuRunQuery($s, array($F));
		$a 							= array();
		$cloneable					= array();

		while($r = db_fetch_object($t)){
			
			$o 						= nuDefaultObject($r, $tabs);
			
			if($r->sob_all_cloneable == '0'){
				$cloneable[]		= array('subform' => $r->sob_all_type == 'subform', 'id' => $r->sob_all_id);
			}
			
			if($R == '-1'){
				$o->value			= '';//nuGetSQLValue($r->sob_all_default_value_sql);
			}else{
				$o->value			= $A[$r->sob_all_id];
			}

			if($r->sob_all_type == 'calc'){
				
				$o->formula			= $r->sob_calc_formula;
				$o->format			= $r->sob_calc_format;
				$o->align 			= $r->sob_all_align;
				$o->calc_order		= $r->sob_all_order;
				
				
			}
				
			if($r->sob_all_type == 'textarea' || $r->sob_all_type == 'run'){
				$o->align 			= $r->sob_all_align;
			}
				
			if($r->sob_all_type == 'input' || $r->sob_all_type == 'display'){

				$o->align 			= $r->sob_all_align;
				$o->format 			= '';
				
				if($r->sob_input_type == 'nuNumber' || $r->sob_input_type == 'nuDate'){
					$o->format 		= $r->sob_input_format;
				}
					
				if($r->sob_input_type == 'nuAutoNumber'){
					
					$o->counter 	= $o->value;
					
				}
					
				$o->input 			= $r->sob_input_type;

				if($r->sob_input_type == 'button' && $r->sob_all_type == 'input'){
					$o->value		= $r->sob_all_label;
				}

				if($r->sob_input_type == 'nuScroll' && $r->sob_all_type == 'input'){
					$o->scroll		= $r->sob_input_javascript;
				}

				if($r->sob_all_type == 'display'){
					
					$disS			= nuReplaceHashVariables($r->sob_display_sql);
					$disT			= nuRunQuery($disS);
					$disR			= db_fetch_row($disT);
					$o->value		= $disR[0];
					
				}

			}
			if($r->sob_all_type == 'html'){
				
				if($r->sob_html_chart_type == ''){
					$o->html 		= nuReplaceHashVariables($r->sob_html_code);
				}else{
					
					$o->html 		= '';
					$htmljs			= addSlashes($r->sob_html_javascript);
					
					if($r->sob_html_chart_type == 'p'){
						$htmlj	= "\nnuChart('$r->sob_all_id', 'PieChart', '$htmljs', '$r->sob_html_title', '$r->sob_html_horizontal_label', '$r->sob_html_vertictal_label', 'bars', false);";
					}

					if($r->sob_html_chart_type == 'l'){
						$htmlj	= "\nnuChart('$r->sob_all_id', 'ComboChart', '$htmljs', '$r->sob_html_title', '$r->sob_html_horizontal_label', '$r->sob_html_vertictal_label', 'lines', false);";
					}

					if($r->sob_html_chart_type == 'b'){
						$htmlj	= "\nnuChart('$r->sob_all_id', 'ComboChart', '$htmljs', '$r->sob_html_title', '$r->sob_html_horizontal_label', '$r->sob_html_vertictal_label', 'bars', false);";
					}

					if($r->sob_html_chart_type == 'bs'){
						$htmlj	= "\nnuChart('$r->sob_all_id', 'ComboChart', '$htmljs', '$r->sob_html_title', '$r->sob_html_horizontal_label', '$r->sob_html_vertictal_label', 'bars', true);";
					}

					if($r->sob_html_chart_type == 'bh'){
						$htmlj	= "\nnuChart('$r->sob_all_id', 'BarChart', '$htmljs', '$r->sob_html_title', '$r->sob_html_horizontal_label', '$r->sob_html_vertictal_label', 'bars', false);";
					}

					if($r->sob_html_chart_type == 'bhs'){
						$htmlj	= "\nnuChart('$r->sob_all_id', 'BarChart', '$htmljs', '$r->sob_html_title', '$r->sob_html_horizontal_label', '$r->sob_html_vertictal_label', 'bars', true);";
					}

					nuAddJavascript($htmlj);
					
				}
				
			}

			if($r->sob_all_type == 'image'){
				$o->src 			= nuGetSrc($r->sob_image_zzzzsys_file_id);
			}

			if($r->sob_all_type == 'select'){

				$o->multiple		= $r->sob_select_multiple;
				$o->options			= nuSelectOptions(nuReplaceHashVariables($r->sob_select_sql));
				
			}

			if($r->sob_all_type == 'run'){
				
				$type				= $r->sob_run_zzzzsys_form_id;
				$o->form_id			= $type;
				$o->record_id		= nuReplaceHashVariables($r->sob_run_id);
				$o->parameters		= $r->sob_all_id;
				
				if(isProcedure($type)){
					
					$actt			= nuRunQuery('SELECT * FROM zzzzsys_php WHERE zzzzsys_php_id = ?',[$type]);
					$act			= db_fetch_object($actt);
					$o->form_id		= $act->sph_zzzzsys_form_id;
					$o->record_id	= $act->sph_code;
					$o->run_type	= 'P';
					$runtab			= nuRunQuery("SELECT * FROM zzzzsys_php WHERE zzzzsys_php_id = '$r->sob_run_zzzzsys_form_id'");
					$o->run_hidden	= db_fetch_object($runtab)->sph_run == 'hide';
					
				}else if(isReport($type)){
					
					$actt			= nuRunQuery('SELECT * FROM zzzzsys_report WHERE zzzzsys_report_id = ?',[$type]);
					$act			= db_fetch_object($actt);
					$o->form_id		= $act->sre_zzzzsys_form_id;;
					$o->record_id	= $act->sre_code;
					$o->run_type	= 'R';
					
				}else{
					$o->run_type	= 'F';
				}

				$o->filter			= nuReplaceHashVariables($r->sob_run_filter);
				$o->run_method  	= $r->sob_run_method;

			}
			
				
			if($r->sob_all_type == 'lookup'){

				$o->description_width	= $r->sob_lookup_description_width;
				$o->form_id				= $r->sob_lookup_zzzzsys_form_id;
				$o->values				= nuGetLookupValues($r, $o);
				
			}

			if($r->sob_all_type == 'subform'){

				// need to set both subform_fk in $r and $o for later use
				$r->subform_fk      	= $R;
				$o->subform_fk      	= $R;
				$o->subform_type    	= $r->sob_subform_type;
				$o->delete          	= $r->sob_subform_delete;
				$f->foreign_key_name 	= $r->sob_subform_foreign_key;
				$o->foreign_key_name 	= $r->sob_subform_foreign_key;
				$o->primary_key_name	= nuFormProperties($r->sob_subform_zzzzsys_form_id)->sfo_primary_key;
				$f->primary_key_name	= $o->primary_key_name;
				$o->add             	= $r->sob_subform_add;
				$o->dimensions			= nuFormDimensions($r->sob_subform_zzzzsys_form_id);
				$o->forms           	= nuGetSubformRecords($r, $o->add, $R);
				$o->sf_form_id			= $r->sob_subform_zzzzsys_form_id;
				$o->browse_columns  	= array();
				
			}

			if($r->sob_all_type == 'word'){
				$o->word				= $r->sob_all_label;
				$o->align				= $r->sob_all_align;
			}

			$o->js						= nuObjectEvents($r->zzzzsys_object_id);
			$o->tab_order				= $r->sob_all_order;
			
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

			$a[]    		= $o;
			
		}
		
	}

    $f->tabs 				= nuRefineTabList($tabs);
	$f->noclone				= $cloneable;
    $f->browse_columns		= nuBrowseColumns($f);
    $B						= nuBrowseRows($f);
    $f->browse_rows			= $B[0];
    $f->browse_height		= $B[1];
    $f->browse_sql			= $B[2];
    $f->browse_table_id		= nuHash()['TABLE_ID'];
    $f->pages				= ceil($B[1]/$f->rows);
    $f->objects 			= $a;
    $O 						= new stdClass();
    $O->forms[] 			= $f;

    return $O->forms[0];

}


function nuGetSrc($i){
	
	$s	= "SELECT * FROM zzzzsys_file WHERE zzzzsys_file_id = ? ";
	$t	= nuRunQuery($s, [$i]);
	$r	= db_fetch_object($t);
	$j	= JSON_decode($r->sfi_json);
	
	return $j->file;
	
}


function nuObjectEvents($i){

	$a	= array();
	$s	= "SELECT sev_event AS event, sev_javascript AS js FROM zzzzsys_event WHERE sev_zzzzsys_object_id = '$i'";
	$t	= nuRunQuery($s);
	
	while($r = db_fetch_object($t)){
		$a[]	= $r;
	}

	return $a;

}


function nuDefaultObject($r, $t){
    
	$o					= new stdClass();
	$v					= $r->sob_all_validate;

	$o->type 	  		= $r->sob_all_type;
	$o->object_id		= $r->zzzzsys_object_id;
	$o->id  	 		= $r->sob_all_id;
	$o->label   		= $r->sob_all_label;
	$o->top   			= $r->sob_all_top;
	$o->left			= $r->sob_all_left;
	$o->width   		= $r->sob_all_width;
	$o->height			= $r->sob_all_height;
	$o->valid			= $r->sob_all_validate;
	$o->read 			= $r->sob_all_access;
	$o->format			= '';

	for($i = 0 ; $i < count($t) ; $i++){
		
		if($r->sob_all_zzzzsys_tab_id == $t[$i]->zzzzsys_tab_id){
			$o->tab     = $t[$i]->number;
		}

	}

	return $o;

}

function nuGetEditForm($F, $R){

	$r					= nuFormProperties($F);
	$SQL 				= new nuSqlString(nuReplaceHashVariables($r->sfo_browse_sql));
	
    $f              	= new stdClass();
    $f->id          	= $r->zzzzsys_form_id;
    $f->form_code       = $r->sfo_code;
    $f->form_description= $r->sfo_description;
    $f->form_type      	= $r->sfo_type;
    $f->table       	= nuReplaceHashVariables($r->sfo_table);
    $f->primary_key 	= $r->sfo_primary_key;
    $f->redirect_form_id= $r->sfo_browse_redirect_form_id == '' ? $r->zzzzsys_form_id : $r->sfo_browse_redirect_form_id;
    $f->order			= $SQL->orderBy;
    $f->where			= $SQL->where;
    $f->from			= $SQL->from;
    $f->javascript		= $r->sfo_javascript;

	if(intval($r->sfo_browse_row_height) == 0){
		$f->row_height	= 18;
	}else{
		$f->row_height	= intval($r->sfo_browse_row_height);
	}
    
	if($r->sfo_browse_rows_per_page == 0){
		$f->rows	= 20;
	}else{
		$f->rows	= $r->sfo_browse_rows_per_page;
	}

    $f->title		= nuBreadcrumbDescription($r, $R);

    return $f;
    
}

function nuBreadcrumbDescription($r, $R){
	
	if($R 								== '')	{return $r->sfo_description;}		//-- Browse Form
	if($R 								== '-1'){return $r->sfo_description;}		//-- new record
	if(trim($r->sfo_breadcrumb_title) 	== '')	{return $r->sfo_description;}		//-- no breadcrumb
	
	$b		= nuReplaceHashVariables($r->sfo_breadcrumb_title);
	
	if(strtolower(substr(trim($b), 0, 6)) == 'select'){
		
		$t	= nuRunQuery($b);
		$r	= db_fetch_row($t);
		
		return $r[0];
	
	}

	return nuReplaceHashVariables($r->sfo_breadcrumb_title);
	
}


function nuGetOtherLookupValues($o){

	$p								= $o->object_id;
	$l								= $_POST['nuHash']['LOOKUP_RECORD_ID'];
	$s								= "SELECT sob_lookup_zzzzsys_form_id as form_id FROM zzzzsys_object WHERE zzzzsys_object_id  = ? ";
	$t								= nuRunQuery($s, [$p]);
	$r								= db_fetch_object($t);
	$i								= $r->form_id;
	$f								= nuFormProperties($i);
	$s								= "SELECT * FROM $f->sfo_table WHERE $f->sfo_primary_key  = ? ";
	$t								= nuRunQuery($s, [$l]);
	$_POST['lookup_row']			= db_fetch_object($t);
	
	if(db_num_rows($t) == 1){
		$_POST['lookup_row']->ID	= $l;
	}
	
	if(db_num_rows($t) == 0){

		$_POST['lookup_row']		= new stdClass;
		$_POST['lookup_row']->ID	= '';
		
	}
	
	$_POST['lookup_values']			= array();

	nuEval($p . '_AB');
	
	return $_POST['lookup_values'];
	
}



function nuGetAllLookupValues(){
	
	$a						= array();
	$OID					= $_POST['nuSTATE']['object_id'];
	$PK						= $_POST['nuSTATE']['primary_key'];
	$s						= "SELECT * FROM zzzzsys_object WHERE zzzzsys_object_id = '$OID'";
	$t						= nuRunQuery($s);
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
	$f->lookup_javascript	= $r->sob_lookup_javascript;
	
	return $f;
	
}



function nuGetLookupValues($R, $O){

	$was		= $_POST['nuHash']['TABLE_ID'];
	
	$_POST['nuHash']['TABLE_ID'] = nuTT();

	nuBeforeBrowse($O->form_id);
	
    $s 			= "SELECT * FROM zzzzsys_form WHERE zzzzsys_form_id = '$O->form_id'";
    $t 			= nuRunQuery($s);
    $r 			= db_fetch_object($t);
    $S 			= new nuSqlString(nuReplaceHashVariables($r->sfo_browse_sql));
	
    $s 			= "
		SELECT 
			$r->sfo_primary_key,
			$R->sob_lookup_code,
			$R->sob_lookup_description
			$S->from
		WHERE 
			`$r->sfo_primary_key` = '$O->value'
    ";
	$s			= nuReplaceHashVariables($s);
    $t 			= nuRunQuery($s);
    $l 			= db_fetch_row($t);
	$f			= $_POST['nuSTATE']['prefix'] . $O->id;

	nuRunQuery(nuReplaceHashVariables('DROP TABLE if EXISTS #TABLE_ID#'));
	
	$_POST['nuHash']['TABLE_ID'] = $was;

	$v			= array();
	$v[]		= array($f, 				isset($l[0]) ? $l[0] : '');
	$v[]		= array($f . 'code', 		isset($l[1]) ? $l[1] : '');
	$v[]		= array($f . 'description', isset($l[2]) ? $l[2] : '');
	
	return $v;
	
}


function nuGetAllLookupList(){

	$O				= $_POST['nuSTATE']['object_id'];
	$PK				= $_POST['nuSTATE']['primary_key'];
	$C				= $_POST['nuSTATE']['code'];
	$was			= $_POST['nuHash']['TABLE_ID'];

	$_POST['nuHash']['TABLE_ID'] = nuTT();

	$s				= "SELECT * FROM zzzzsys_object WHERE zzzzsys_object_id = '$O'";
	$t				= nuRunQuery($s);
	$r				= db_fetch_object($t);
	$code			= $r->sob_lookup_code;
	$description	= $r->sob_lookup_description;
	$form_id		= $r->sob_lookup_zzzzsys_form_id;
	$js				= $r->sob_lookup_javascript;

	nuBeforeBrowse($form_id);
	
	$s		 		= "SELECT * FROM zzzzsys_form WHERE zzzzsys_form_id = '$form_id'";
	$t				= nuRunQuery($s);
	$r	 			= db_fetch_object($t);
	$id	 			= $r->sfo_primary_key;
    $SQL			= new nuSqlString(nuReplaceHashVariables($r->sfo_browse_sql));
	$s				= "
					SELECT $id, $code, $description
					$SQL->from
					$SQL->where
					AND $code = ?
					ORDER BY $code
					";

	$s				= nuReplaceHashVariables($s);
	$t				= nuRunQuery($s, [$C]);
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

	$f							=  str_replace('#ROW#', $_POST['nuSTATE']['prefix'], $f);

	$_POST['lookup_values'][]	= array($f, $v);
	
}


function nuSelectOptions($sql) {

    $a 				= array();
	
    if (substr(strtoupper(trim($sql)), 0, 6) == 'SELECT') {                      //-- sql statement
	
        $t			= nuRunQuery($sql);
		
        if (nuErrorFound()) {
            return;
        }

        while ($r = db_fetch_row($t)) {
            $a[]	= $r;
        }

    } else {                                                                     //-- comma delimited string

        $t 			= explode('|', nuRemoveNonCharacters($sql));

        for ($i = 0; $i < count($t); $i++) {

            $r    	= array();
            $r[0] 	= $t[$i];
            $r[1] 	= $t[$i + 1];
            $a[]  	= $r;
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
    $s = "SELECT `$f->primary_key` $f->from WHeRE (`$R->sob_subform_foreign_key` = '$R->subform_fk') $w $f->order";
	$I = $_POST['nuHash']['RECORD_ID'];


    $t = nuRunQuery($s);
    $a = array();
	
    while($r = db_fetch_row($t)){

		$_POST['nuHash']['RECORD_ID']			= $r[0];
		$o										= nuGetFormObject($R->sob_subform_zzzzsys_form_id, $r[0], count($a));
		$o->foreign_key							= $R->subform_fk;
		$o->foreign_key_name					= $R->sob_subform_foreign_key;
		$a[] 									= $o;

    }


	$_POST['nuHash']['RECORD_ID']				= -1;
	$o											= nuGetFormObject($R->sob_subform_zzzzsys_form_id, -1, count($a));
	$o->foreign_key								= $R->subform_fk;
	$o->foreign_key_name						= $R->sob_subform_foreign_key;
	$a[] 										= $o;
        
	$_POST['nuHash']['RECORD_ID'] 				= $I;
	
    return $a;

}

function nuBuildTabList($i){

    $o 				= 0;
    $a 				= array();
    $s 				= "
    
        SELECT * 
        FROM zzzzsys_tab 
        INNER JOIN zzzzsys_object ON sob_all_zzzzsys_form_id = syt_zzzzsys_form_id
        WHERE syt_zzzzsys_form_id = '$i'
        GROUP BY syt_zzzzsys_form_id, syt_title
        ORDER BY syt_order
    
    ";

    $t = nuRunQuery($s);

    while($r = db_fetch_object($t)){
        
        $r->number	= $o;
        $o++;
        $a[]		= $r;
        
    }
	
    return $a;
    
}


function nuRefineTabList($t){

    $a 			= array();

    for($i = 0 ; $i < count($t) ; $i++){
		
		//$a[]	= array(title => $t[$i]->syt_title, id => $t[$i]->zzzzsys_tab_id, help => $t[$i]->syt_help);
		//changed SG 10/10/2018
		$a[]	= array('title' => $t[$i]->syt_title, 'id' => $t[$i]->zzzzsys_tab_id, 'help' => $t[$i]->syt_help);
        
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
	
	$s				= "SELECT * FROM zzzzsys_browse WHERE sbr_zzzzsys_form_id = '$f->id' ORDER BY sbr_order";
	$t				= nuRunQuery($s);
	$a				= array();

	while($r = db_fetch_object($t)){
	
		$r->title	= $r->sbr_title;
		$r->display	= $r->sbr_display;
		$r->align	= $r->sbr_align;
		$r->width	= $r->sbr_width;
		$r->order	= $r->sbr_order;
		$r->format	= $r->sbr_format;

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
	$rows			= $P['rows'];
	$rowsw			= $P['rows'];


	if($rows == -1){
		$rows		= nuFormProperties($f->form_id)->sfo_browse_rows_per_page;
	}

	if($rows == 0){
		$rows		= 20;
	}

	$page_number	= $P['page_number'];
	$start			= $page_number * $rows;
	$search			= str_replace('&#39;', "'", $P['search']);
	$filter			= str_replace('&#39;', "'", $P['filter']);
	$s 				= "SELECT * FROM zzzzsys_form WHERE zzzzsys_form_id = '$f->id'";
	$t 				= nuRunQuery($s);
	$r 				= db_fetch_object($t);
	
	if(trim($r->sfo_browse_sql) == ''){
		return array(array(), 0);
	}
	
    $S 				= new nuSqlString(nuReplaceHashVariables($r->sfo_browse_sql));

	$S->addField($f->primary_key);
	
	for($i = 0 ; $i < count($f->browse_columns) ; $i++){
		$S->addField($f->browse_columns[$i]->display);
	}
	
	$flds			= array();
	$fields 		= array_slice($S->fields,1);

//	if(count($_POST['nuSTATE']['nosearch_columns']) == 0){
	if($_POST['nuSTATE']['nosearch_columns'] === null){
		$_POST['nuSTATE']['nosearch_columns']	= array();
	}
	
	for($i = 0 ; $i < count($fields) ; $i++){
		
		if(!in_array($i, $_POST['nuSTATE']['nosearch_columns'])){
			$flds[]	= $fields[$i];
		}
		
	}

	$where			= trim(nuBrowseWhereClause($flds, $filter . ' ' . $search));
	$like			= str_replace('\\"','"',nuHash()['like']);
	$haswhere		= $where !=  '()';
	$haslike		= $like != '';
	$hardwhere		= $S->getWhere();
	
	if($haslike 	&& $haswhere){	$S->setWhere(" $hardwhere AND $like AND $where");}
	if($haslike 	&& !$haswhere){	$S->setWhere(" $hardwhere AND $like");}
	if(!$haslike 	&& $haswhere){	$S->setWhere(" $hardwhere AND $where");}
	
	if($P['sort'] != '-1'){
		$S->setOrderBy(' ORDER BY ' . $S->fields[$P['sort'] + 1] . ' ' . $P['sort_direction']);
	}
	
	$a				= array();
	$s				= nuReplaceHashVariables($S->SQL);
	
	$t 				= nuRunQuery($s);
	$rowData		= db_num_rows($t);
	$s				.= " LIMIT " . ($start<0?0:$start) . ", $rows";
	$t 				= nuRunQuery($s);

	while($r = db_fetch_row($t)){
		$a[] 		= $r;
	}
	
	nuRunQuery(nuReplaceHashVariables('DROP TABLE if EXISTS #TABLE_ID#'));

	return array($a, $rowData, $S->SQL);
	
}



function nuBrowseWhereClause($searchFields, $searchString, $returnArray = false) {

    $pos					= -1;
    $start					= -1;
	$where					= array();
    $phrases      			= array();
    $SEARCHES     			= array();
    $wordSearches 			= array();
    $highlight    			= array();

    while (true) {
		
        $pos = strpos($searchString, '"', $pos + 1);                              //-- search for double quotes
		
        if ($pos === false) {
			
            break;                                                                            //-- stop searching
			
        } else {
			
            if ($start == -1) {
				
                $start     	= $pos;                                                            //-- find start position of phrase
				
            } else {
				
                $phrases[] 	= "$start," . ($pos + 1);                                             //-- add start and end to array
                $start     	= -1;
				
            }
			
        }
		
    }

    for ($i = 0; $i < count($phrases); $i++) {

        $p          		= explode(',', $phrases[$i]);
        $SEARCHES[] 		= substr($searchString, $p[0], $p[1] - $p[0]);
    }
    
    for ($i = 0; $i < count($SEARCHES); $i++) {

        $pos = strpos($searchString, '-' . $SEARCHES[$i]);                                      //-- check for a preceeding minus
		
        if ($pos === false) {
			
            $task[]       	= 'include';
            $searchString 	= str_replace($SEARCHES[$i], ' ', $searchString);             //-- include phrase
            $highlight[]  	= substr($SEARCHES[$i], 1, -1);
			
        } else {
			
            $task[]			= 'exclude';
            $searchString	= str_replace('-' . $SEARCHES[$i], ' ', $searchString);                   //-- remove phrase
			
        }
		
        $SEARCHES[$i] 		= ' "%' . substr($SEARCHES[$i], 1, -1) . '%" ';
        
    }

    $wordSearches 			= explode(' ', $searchString);
    $quo 					= '"';
	
    for ($i = 0; $i < count($wordSearches); $i++) {

        if (strlen($wordSearches[$i]) > 0) {
			
            if (substr($wordSearches[$i], 0, 1) == '-' and strlen($wordSearches[$i]) > 1) {       //-- check for a preceeding minus
			
                $task[]      = 'exclude';
                $SEARCHES[]  = $quo . '%' . addslashes(substr($wordSearches[$i], 1)) . '%' . $quo;      //-- add word to exclude
				
            } else {
				
                $task[]      = 'include';
                $SEARCHES[]  = $quo . '%' . addslashes($wordSearches[$i]) . '%' . $quo;                //-- add word to include
                $highlight[] = $wordSearches[$i];
				
            }
			
        }
		
    }
    
    for ($i = 0; $i < count($SEARCHES); $i++) {                                                //-- search for (or exclude) these strings
	
        $include = array();
        $exclude = array();
        
        for ($SF = 0; $SF < count($searchFields); $SF++) {                                     //-- loop through searchable fields

            if ($task[$i] == 'include') {																	//-- changed by KEE
                $include[] = 'CONVERT(' . $searchFields[$SF] . ' USING utf8) LIKE  ' . $SEARCHES[$i];
            } else {
                $exclude[] = 'CONVERT(' . $searchFields[$SF] . ' USING utf8) NOT LIKE  ' . $SEARCHES[$i];
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

	nuUpdateTables();
	
	$formAndSessionData 					= new stdClass;

    if(isset($_POST['nuSTATE']['record_id'])){
        $formAndSessionData->record_id  	= $_POST['nuSTATE']['record_id'];
    } else {
        $formAndSessionData->record_id  	= '-1';
    }
	
    if(isset($_POST['nuSTATE']['form_id'])){
        $formAndSessionData->form_id 	 	= $_POST['nuSTATE']['form_id'];
    } else {
		$formAndSessionData->form_id 		= $home == '' ? 'nuhome' : $home;
    }
	
    if(isset($_POST['nuSTATE']['login_form_id'])){
		
		if($_POST['nuSTATE']['login_form_id'] != ''){
			$formAndSessionData->form_id	= $_POST['nuSTATE']['login_form_id'];
		}
		
	}
	
	
    if(isset($_POST['nuSTATE']['login_form_id'])){//-- check empty form_id not empty record_id
		
		if($_POST['nuSTATE']['login_form_id'] != ''){
			$formAndSessionData->record_id  = $_POST['nuSTATE']['login_record_id'];
		}
		
    }

	$formAndSessionData->session_id 	= $_SESSION['nubuilder_session_data']['SESSION_ID'];
	$formAndSessionData->call_type 		= $_POST['nuSTATE']['call_type'];
	$formAndSessionData->filter 		= $_POST['nuFilter'];
	$formAndSessionData->errors 		= array();
	$formAndSessionData->translation 	= $_SESSION['nubuilder_session_data']['translation'];
	$formAndSessionData->dimensions 	= nuFormDimensions($formAndSessionData->form_id);

	if(!$_SESSION['nubuilder_session_data']['isGlobeadmin'] && $formAndSessionData->form_id != 'nuhome') {

        $getAccessFromSessionTableQRY 	= nuRunQuery("SELECT sss_access FROM zzzzsys_session WHERE zzzzsys_session_id = ? ", array($_SESSION['nubuilder_session_data']['SESSION_ID']));
        $getAccessFromSessionTableOBJ 	= db_fetch_object($getAccessFromSessionTableQRY);
        $access 						= json_decode($getAccessFromSessionTableOBJ->sss_access);

		if($formAndSessionData->call_type == 'getreport'){
			
			$r 							= nuReportAccessList($access);
			
			if(!in_array($formAndSessionData->record_id, $r)) { //form_id is record_id for getreport

			

				$nuT					= nuRunQuery("SELECT * FROM zzzzsys_report WHERE zzzzsys_report_id = '$formAndSessionData->record_id'");
				$nuR					= db_fetch_object($nuT);
				
				nuDisplayError("Access To Report Denied... ($nuR->sre_code)");
				
			}	
			
		}

        if($formAndSessionData->call_type == 'getphp'){

			$p 							= nuProcedureAccessList($access);

            if(!in_array($formAndSessionData->record_id, $p)) { //form_id is record_id for getphp
			
                $nuT					= nuRunQuery("SELECT * FROM zzzzsys_php WHERE zzzzsys_php_id = '$formAndSessionData->record_id'");
                $nuR					= db_fetch_object($nuT);
				
                nuDisplayError("Access To Procedure Denied... ($nuR->sph_code)");
            }
                
        }

		$f = nuFormAccessList($access); //-- form list including forms id used in reports and procedures
		
		if(!in_array($formAndSessionData->form_id, $f) && ($formAndSessionData->call_type == 'getform' || $formAndSessionData->call_type == 'login')){

			$nuT						= nuRunQuery("SELECT * FROM zzzzsys_form WHERE zzzzsys_form_id = '$formAndSessionData->form_id'");
			$nuR						= db_fetch_object($nuT);

			nuDisplayError("Access To Form Denied... ($nuR->sfo_code)");
			
		}
		
	}
    
    $formAndSessionData->errors 		= $_POST['nuErrors'];

	return $formAndSessionData;
	
}

function nuFormAccessList($j){
	
	$a			= array();
	$t			= nuRunQuery("SELECT zzzzsys_form_id FROM zzzzsys_form WHERE sfo_type = 'subform'");
	
	while($r = db_fetch_row($t)){
		$a[]	= $r[0];
	}
	
	for($i = 0 ; $i < count($j->forms) ; $i++){
		$a[]	= $j->forms[$i][0];
	}

	for($i = 0 ; $i < count($j->reports) ; $i++){
		$a[]	= $j->reports[$i][1];
	}

	for($i = 0 ; $i < count($j->procedures) ; $i++){
		$a[]	= $j->procedures[$i][1];
	}

	$a[]		= nuGetUserAccess()['HOME_ID'];
	
	return $a;
	
}



function nuProcedureAccessList($j){
	
	$a			= array();

	for($i = 0 ; $i < count($j->procedures) ; $i++){
		$a[]	= $j->procedures[$i][0];
	}
	
	return $a;
	
}

function nuReportAccessList($j){
	
	$a			= array();
	
	for($i = 0 ; $i < count($j->reports) ; $i++){
		$a[]	= $j->reports[$i][0];
	}

	return $a;
	
}


function nuButtons($formid, $POST){
	
	$t						= nuRunQuery("SELECT * FROM zzzzsys_session WHERE zzzzsys_session_id = ? ", array($_SESSION['nubuilder_session_data']['SESSION_ID']));		
	$r 						= db_fetch_object($t);
	$nuJ 					= json_decode($r->sss_access);
	$_POST['forms']			= $nuJ->forms;
	$_POST['reports']		= $nuJ->reports;
	$_POST['procedures']	= $nuJ->procedures;
	$_POST['session']		= $nuJ->session;
	$C						= '';
	$D						= '';
	$a						= nuFormAccess($formid, $nuJ->forms);
	$f						= nuFormProperties($formid);
	$c						= $POST['call_type'];
	
	if($c == 'getphp' or $c == 'getreport'){

			
		$s					= 'SELECT * FROM zzzzsys_php WHERE zzzzsys_php_id = ? ';
		$t					= nuRunQuery($s,[$POST['record_id']]);
		$P					= db_fetch_object($t);
		
		$s					= 'SELECT * FROM zzzzsys_report WHERE zzzzsys_report_id = ? ';
		$t					= nuRunQuery($s,[$POST['record_id']]);
		$R					= db_fetch_object($t);
		
	}else{
			
		$s					= 'SELECT * FROM zzzzsys_php WHERE sph_code = ? ';
		$t					= nuRunQuery($s,[$POST['record_id']]);
		$P					= db_fetch_object($t);
		
		$s					= 'SELECT * FROM zzzzsys_report WHERE sre_code = ? ';
		$t					= nuRunQuery($s,[$POST['record_id']]);
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
	}
	
	if($c == 'getreport'){
		
		$C					= $R->sre_code;
		$D					= $R->sre_description;
		
		return [array('Add' => 0, 'Print' => 0, 'Save' => 0, 'Clone' => 0, 'Delete' => 0, 'Run' => 'nuRunReport("'.$C.'")', 'RunHidden' => ''), $C, $D];
	}
	
	if($c != 'getphp' and $c != 'getreport'){
		return [array('Add' => $a[0], 'Print' => $a[1], 'Save' => $a[2], 'Clone' => $a[3], 'Delete' => $a[4], 'Run' => '', 'RunHidden' => ''), $C, $D];
	}
	
}


function nuRunCode($P){
	
	$f						= nuFormProperties($formid);
	
	$s						= 'SELECT * FROM zzzzsys_php WHERE zzzzsys_php_id = ? ';
	$t						= nuRunQuery($s,[$P['record_id']]);
	$c						= db_fetch_object($t)->sph_code;
	
	$s						= 'SELECT * FROM zzzzsys_report WHERE zzzzsys_report_id = ? ';
	$t						= nuRunQuery($s,[$P['record_id']]);
	
	if(db_fetch_object($t)->sre_code != ''){
		$c					= db_fetch_object($t)->sre_code;
	}
	
	return $c;
	
}

function nuRunDescription($P){
	
	$f						= nuFormProperties($formid);
	
	$s						= 'SELECT * FROM zzzzsys_php WHERE zzzzsys_php_id = ? ';
	$t						= nuRunQuery($s,[$P['record_id']]);
	$d						= db_fetch_object($t)->sph_description;
	
	$s						= 'SELECT * FROM zzzzsys_report WHERE zzzzsys_report_id = ? ';
	$t						= nuRunQuery($s,[$P['record_id']]);
	
	if(db_fetch_object($t)->sre_code != ''){
		$d					= db_fetch_object($t)->sre_description;
	}
	
	return $d;
	
}


function nuFormAccess($s, $a){

	if( $_POST['session']->zzzzsys_user_id == $_SESSION['nubuilder_session_data']['GLOBEADMIN_NAME'] ){
		return array('1', '1', '1', '1', '1');
	}

	if($a !== null){
		
		for($i = 0 ; $i < count($a) ; $i++){
			
			$F	= $a[$i];
			
			if($s == $F[0]){
				return array($F[1], $F[2], $F[3], $F[4], $F[5]);		//-- Add Print Save Clone Delete
			}
			
		}
		
	}
	
	return array('0', '0', '0', '0', '0');

}

// function nuFormDimensions($f){

	// $d			= array();
	// $t			= nuRunQuery("SELECT * FROM zzzzsys_form WHERE zzzzsys_form_id = '$f'");
	// $r			= db_fetch_object($t);
	
	// $bt			= 57; 	//-- browse title
	// $rh			= intval($r->sfo_browse_row_height)    == 0 ? 18 : $r->sfo_browse_row_height;
	// $rs			= intval($r->sfo_browse_rows_per_page) == 0 ? 25 : $r->sfo_browse_rows_per_page;
	// $t			= nuRunQuery("SELECT * FROM zzzzsys_object WHERE sob_all_zzzzsys_form_id = '$f'");
	// $h			= 0;
	// $w			= 0;
	// $gh			= 0;
	// $gw			= 0;
	
	// while($r	= db_fetch_object($t)){
		
		// if($r->sob_all_type == 'lookup'){
			
			// $w 	= max($w, $r->sob_all_left + $r->sob_all_width + $r->sob_lookup_description_width + 40);
			// $gw	= $gw + $r->sob_all_width + $r->sob_lookup_description_width + 40;
			
		// }else{
			
			// $w 	= max($w, $r->sob_all_left + $r->sob_all_width + 40);
			// $gw = $gw + $r->sob_all_width + 4;
			
		// }

		// $h		= max($h, $r->sob_all_top + $r->sob_all_height);
		// $gh 	= max($r->sob_all_height, 25);

	// }

	// $bh			= $bt + ($rs * $rh);
	// $bw			= nuGetBrowseWidth($f);	

	// $grid		= ['height'=>$gh, 'width'=> $gw];
	// $browse		= ['height'=>$bh + 0, 'width'=> $bw];
	// $edit		= ['height'=>$h + 60,  'width'=> $w];

	// return ['browse'=>$browse, 'edit'=>$edit, 'grid'=>$grid];
	
// }


function nuFormDimensions($f){

   $d         = array();
   $t         = nuRunQuery("SELECT * FROM zzzzsys_form WHERE zzzzsys_form_id = '$f'");
   $r         = db_fetch_object($t);
   
   $bt         = 57;    //-- browse title
   $rh         = intval($r->sfo_browse_row_height)    == 0 ? 25 : $r->sfo_browse_row_height;
   $rs         = intval($r->sfo_browse_rows_per_page) == 0 ? 25 : $r->sfo_browse_rows_per_page;
   $bb         = 25;   //-- browse footer
   $t         = nuRunQuery("SELECT * FROM zzzzsys_object WHERE sob_all_zzzzsys_form_id = '$f'");
   $h         = 0;
   $w         = 0;
   $gh         = 0;
   $gw         = 0;
   
   while($r   = db_fetch_object($t)){
      
      if($r->sob_all_type == 'lookup'){
         
         $w    = max($w, $r->sob_all_left + $r->sob_all_width + $r->sob_lookup_description_width + 40);
         $gw   = $gw + $r->sob_all_width + $r->sob_lookup_description_width + 40;
         
      }else{
         
         $w    = max($w, $r->sob_all_left + $r->sob_all_width + 40);
         $gw = $gw + $r->sob_all_width + 4;
         
      }

      $h      = max($h, $r->sob_all_top + $r->sob_all_height);
      $gh    = max($r->sob_all_height, 25, $gh);

   }

   $bh         = $bt + ($rs * $rh) + $bb;
   $bw         = nuGetBrowseWidth($f);   

   $grid      = ['height'=>$gh, 'width'=> $gw];
   $browse      = ['height'=>$bh, 'width'=> $bw];
   $edit      = ['height'=>$h,  'width'=> $w];

   $d[]      = $bt + ($rs * $rh) + $bb;          //-- lookup browse height
   $d[]      = nuGetBrowseWidth($f);   
   $d[]      = $h  + 0;                     //-- lookup form height
   $d[]      = $w  + 0;                     //-- lookup form width
   $d[]      = $h  + 0;                     //-- form height
   $d[]      = $w  + 50;                     //-- form width
   $d[]      = $gh + 0;                     //-- grid height
   $d[]      = $gw + 55;                     //-- grid width
   
   $d[]      = ['browse'=>$browse, 'edit'=>$edit, 'grid'=>$grid];

   return ['browse'=>$browse, 'edit'=>$edit, 'grid'=>$grid];
   
}


function nuGetBrowseWidth($f){
	
	$w			= 0;
	$t			= nuRunQuery("SELECT * FROM zzzzsys_browse WHERE sbr_zzzzsys_form_id = ? ", [$f]);
	
	while($r	= db_fetch_object($t)){
		$w = $w + $r->sbr_width;
	}
	
	return $w;

}



function isForm($i){

	$s	= "SELECT * FROM zzzzsys_form WHERE zzzzsys_form_id = '$i'";
	$t	= nuRunQuery($s);
	$r	= db_fetch_object($t);
	
	return db_num_rows($t) > 0;

}

function isProcedure($i){

	$s	= "SELECT * FROM zzzzsys_php WHERE zzzzsys_php_id = '$i'";
	$t	= nuRunQuery($s);
	$r	= db_fetch_object($t);
	
	return db_num_rows($t) > 0;

}

function isReport($i){

	$s	= "SELECT * FROM zzzzsys_report WHERE zzzzsys_report_id = '$i'";
	$t	= nuRunQuery($s);
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


function nuAddJavascript($js){
	$GLOBALS['EXTRAJS'] = $GLOBALS['EXTRAJS'] . "\n\n" . $js;
}

function nuPreloadImages($a){
	
	$js = '';

	
	for($i = 0 ; $i < count($a) ; $i++){
		
		$s  = "
				SELECT * 
				FROM zzzzsys_file 
				WHERE sfi_code = ?
				
			";

		$t  = nuRunQuery($s, [$a[$i]]);
		$r	= db_fetch_object($t);
		$tr	= trim($r->sfi_code);
		$js = $js . "\nnuImages['$tr'] = '" . addslashes($r->sfi_json) . "';";

	}

	nuAddJavascript($js);
		
}


?>
