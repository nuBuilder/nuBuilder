<?php


function nuBuildFastReport(){

	if($_SESSION['IsDemo']){
		
		nuDisplayError('Not available in the Demo...');
		return;
	}

	$t		= nuRunQuery("SELECT COUNT(*) AS fastreports FROM zzzzsys_report WHERE sre_code like 'FR%'");
	$fr		= db_fetch_object($t)->fastreports;

	$i		= nuID();
	$c		= "FR$fr";
	$d		= "Fast Report $fr";
	$g		= "Fast Report";
	$j		= str_replace('\"', '"', nuHash()['fieldlist']);
	$t		= nuHash()['table'];
	$f		= 'nublank';
	$s		= "
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
	
	nuRunQuery($s, [$i, $c, $d, $g, $t, $f, $j]);
	

	$js		= "

		var m1	= '<h1>A Fast Report has been created!</h1>';
		var m2	= '<p>(There is now a Report with a Code of <b>$c</b> found in <b>Reports</b>)';

		nuMessage([m1, m2]);
		
		$('#nunuRunPHPHiddenButton').remove();

	";

	nuJavascriptCallback($js);
	
}

function nuBuildFastForm($table, $form_type){

	
	if($_SESSION['IsDemo']){
		
		nuDisplayError('Not available in the Demo...');
		return;
	
	}
	
	$form_id						= nuID();
	$PK								= $table . '_id';
	$newT							= $form_type != 'launch';
	
	if($form_type == 'launch'){
		$table 						= 'Launch Form ' . nuFastForms();
	}
	
	$q								= nuRunQuery("SELECT table_name FROM INFORMATION_SCHEMA.TABLES WHERE table_schema = DATABASE()");

	while($tableSchemaOBJ = db_fetch_object($q)){
		
		if($table == $tableSchemaOBJ->table_name){
			
			$_POST['tableSchema']	= nuBuildTableSchema();
			$PK 					= $_POST['tableSchema'][$table]['primary_key'][0];
			$newT					= false;
			
		}
		
	}

	$TT             = nuTT();
	$SF             = nuSubformObject('obj_sf');
	$tab_id         = nuID();
	$t              = nuRunQuery("SELECT COUNT(*) FROM zzzzsys_form WHERE SUBSTRING(sfo_code, 1, 2) = 'FF'");
	$r              = db_fetch_row($t);
	$form_code      = 'FF' . $r[0];
	$form_desc      = 'Fast Form ' . $r[0];
	$s              = Array();

	//----------add tab--------------------
	$sql            = "

					INSERT 
					INTO zzzzsys_tab
					(zzzzsys_tab_id,
					syt_zzzzsys_form_id,
					syt_title,
					syt_order)
					VALUES
					(?, ?, ?, ?)

	";

	$array          = Array($tab_id, $form_id, 'Main', 10);

	nuRunQuery($sql, $array);

	//----------add form--------------------

	$sql            = "

					INSERT 
					INTO zzzzsys_form
					(zzzzsys_form_id,
					sfo_type,
					sfo_code,
					sfo_description,
					sfo_table,
					sfo_primary_key,
					sfo_browse_sql)
					VALUES
					(?, ?, ?, ?, ?, ?, ?)

	";
	$array          = Array($form_id, $form_type, $form_code, ucfirst($form_desc), $form_type=='launch'?'':$table, $form_type=='launch'?'':$PK, "SELECT * FROM $table");

	nuRunQuery($sql, $array);

	$sql            = "CREATE TABLE $TT SELECT * FROM zzzzsys_object WHERE false";
	
	nuRunQuery($sql);

	for($i = 0 ; $i < count($SF->rows) ; $i++){
		
		if($SF->rows[$i][5] == 0){							//-- not ticked as deleted
			
			$r          		= $SF->rows[$i][3];
			$newid				= nuID();
			$SF->rows[$i][3]	= $newid;
			
			$sql				= "INSERT INTO $TT SELECT * FROM zzzzsys_object WHERE zzzzsys_object_id = '$r'";
			
			nuRunQuery($sql);

			$sql				= "UPDATE $TT SET zzzzsys_object_id = '$newid' WHERE zzzzsys_object_id = '$r'";
			
			nuRunQuery($sql);
		
		}

	}

	$sql            = "

					UPDATE $TT
					SET 
						sob_all_id                  = ?,
						sob_all_label               = ?,
						sob_all_order               = ?,
						sob_all_top                 = ?,
						sob_all_left                = ?,
						sob_all_table               = ?,
						sob_all_zzzzsys_form_id     = ?,
						sob_all_zzzzsys_tab_id      = ?,
						zzzzsys_object_id           = ?
					WHERE 
						zzzzsys_object_id           = ?

	";

	$top            = 10;

	for($i = 0 ; $i < count($SF->rows) ; $i++){
		
		if($SF->rows[$i][5] == 0){							//-- not ticked as deleted
			
			$newid      = nuID();
			$label      = $SF->rows[$i][1];
			$field      = $SF->rows[$i][2];
			$oldid      = $SF->rows[$i][3];

			$array      = Array($field, $label, $i * 5, $top, 150, $table, $form_id, $tab_id, $newid, $oldid);
			nuRunQuery($sql, $array);

			$OT			= nuRunQuery("SELECT * FROM $TT WHERE zzzzsys_object_id = ? ", [$newid]);
			$top		= $top + db_fetch_object($OT)->sob_all_height + 10;
			
		}

	}

	if($form_type == 'browse'){
		nuRunQuery("DELETE FROM $TT WHERE 1");
	}
	
	$t              = nuRunQuery("SELECT * FROM $TT");
	$a              = Array();
	$n              = 'number date';
	
	while($r = db_fetch_object($t)){
		

		
		$y          = $r->sob_all_type;
		$i          = $r->sob_input_type;
		$id         = $r->sob_all_id;
		$date       = ($i == 'date' || $i == 'nuDate');
		$norm       = ($y == 'input' && $i != 'date' && $i != 'nuDate' && $i != 'nuNumber' && $i != 'number' && $i != 'file');
		
		if($y == 'lookup'){                         $a[] = Array('name'=>$id, 'type'=>'id');}
		if($y == 'select'){                         $a[] = Array('name'=>$id, 'type'=>'varchar');}
		if($y == 'calc'){                           $a[] = Array('name'=>$id, 'type'=>'decimal');}
		if($y == 'textarea'){                       $a[] = Array('name'=>$id, 'type'=>'textarea');}
		if($y == 'input' && $norm){                 $a[] = Array('name'=>$id, 'type'=>'varchar');}
		if($y == 'input' && $date){                 $a[] = Array('name'=>$id, 'type'=>'date');}
		if($y == 'input' && $i == 'number'){        $a[] = Array('name'=>$id, 'type'=>'int');}
		if($y == 'input' && $i == 'nuNumber'){      $a[] = Array('name'=>$id, 'type'=>'decimal');}
		if($y == 'input' && $i == 'file'){      	$a[] = Array('name'=>$id, 'type'=>'longtext');}
		
	}

	if($newT){
		
		$mess		= 'Table and Form have';
		$create		= nuBuildNewTable($table, $a, $newT);
			
		nuRunQuery($create);

		nuRunQuery("ALTER TABLE $table ENGINE = MyISAM;");
		nuRunQuery("ALTER TABLE $table CONVERT TO CHARACTER SET UTF8 COLLATE utf8_general_ci");
	

	}else{
		$mess		= 'Form has';
	}
	

	for($i = 0 ; $i < count($SF->rows) ; $i++){
		
		if($SF->rows[$i][4] == 1 and $SF->rows[$i][5] == 0){						//-- not ticked as deleted
			
			$lab	= $SF->rows[$i][1];
			$id		= $SF->rows[$i][2];


			$sql            = "
			
							INSERT 
							INTO zzzzsys_browse
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
			
			$array      = Array(nuID(), $form_id, $lab, $id, 'l', '', ($i+1) * 10, 250);

			nuRunQuery($sql, $array);
			
		}

	}

	
	
	if($form_type == 'subform' || $form_type == 'browse'){
			
		$js	= "

			var m1	= '<h1>A $mess been created!</h1>';
			var m2	= '<p>(There is now a Form with a Code of <b>$form_code</b> found in <b>Forms</b>)';

			nuMessage([m1, m2]);
			
			$('#nunuRunPHPHiddenButton').remove();

		";

		nuJavascriptCallback($js);
		
	}else{
	
			
		//----------make sure button has a tab--------------------
		

		$sql            = "REPLACE INTO zzzzsys_tab (zzzzsys_tab_id, syt_zzzzsys_form_id, syt_title, syt_order) VALUES ('nufastforms', 'nuuserhome', 'Fast Forms', -1);";
		nuRunQuery($sql);

		//----------add run button--------------------

		$sql            = "

						INSERT 
						INTO $TT
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
		
		$form_count		= nuFastForms() * 50;
		$record_id		= substr($form_type, 0, 6) == 'browse' ? '' : '-1';
		$array          = Array(nuID(), 'nuuserhome', 'nufastforms', "ff$form_id", ucfirst($table), $table, 11, 50 + $form_count, $form_count, 150, 30, $form_id, $record_id, 'b', 0, 0, 0, 'center', 'run');
		
		nuRunQuery($sql, $array);

		$js	= "
		
			var m1	= '<h1>A $mess been created!</h1>';
			var m2	= '<p>(There is now a Button called <b>$table</b> on the <b>Fast Forms</b> tab of the <b>User Home</b> Form)</p>';

			nuMessage([m1, m2]);
			
			$('#nunuRunPHPHiddenButton').remove();

		";

		nuJavascriptCallback($js);

	}

	nuRunQuery("INSERT INTO zzzzsys_object SELECT * FROM $TT");
	nuRunQuery("DROP TABLE $TT");
		
	nuSetJSONData('clientFormSchema', nuBuildFormSchema());

	
}



function nuFastForms(){
	
	$s			= 'SELECT COUNT(*) AS ff FROM zzzzsys_object WHERE sob_all_zzzzsys_tab_id = "nufastforms"';
	$t			= nuRunQuery($s);
	$r			= db_fetch_object($t);
	
	return $r->ff;
	
}



function nuBuildNewTable($tab, $array, $newT){

	$id			= $tab . '_id';
	$start	= "CREATE TABLE $tab";
	$a			= Array();
	$a[] 		= "$id VARCHAR(25) NOT NULL";

	$ff_type	= nuHash()['fastform_type'];
	$ff_fk		= nuHash()['fastform_fk'];

	if($ff_type == 'subform' && $newT){
		$a[] 	= "$ff_fk VARCHAR(25) DEFAULT NULL";
	}

	for($i = 0 ; $i < count($array) ; $i++){

		$f = $array[$i]['name'];
		$t = $array[$i]['type'];
		
		if($t == 'id'){			$a[] = "$f VARCHAR(25) DEFAULT NULL";}
		if($t == 'varchar'){		$a[] = "$f VARCHAR(1000) DEFAULT NULL";}
		if($t == 'int'){		$a[] = "$f INT DEFAULT NULL";}
		if($t == 'textarea'){		$a[] = "$f TEXT DEFAULT NULL";}
		if($t == 'decimal'){		$a[] = "$f DECIMAL(12,4) DEFAULT NULL";}
		if($t == 'date'){		$a[] = "$f DATE DEFAULT NULL";}
		if($t == 'longtext'){		$a[] = "$f LONGTEXT DEFAULT NULL";}
		
	}
	
	$a[] = "PRIMARY KEY  ($id)";
	$im  = implode(',', $a);

	return "$start ($im)";

}



?>
