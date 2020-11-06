<?php 
function nuCopySystemFiles() {
    
	$t      	= nuSystemList();
	$sql		= "DROP VIEW IF EXISTS zzzzsys_report_data";
	nuRunQuery($sql);

	$sql		= "DROP VIEW IF EXISTS zzzzsys_run_list";
	nuRunQuery($sql);

	for($i = 0 ; $i < count($t) ; $i++){
        
        $table  = $t[$i];
		$sql	= "DROP TABLE IF EXISTS sys_$table";
        	nuRunQuery($sql);

		$sql	= "CREATE TABLE sys_$table SELECT * FROM $table";
        	nuRunQuery($sql);
		
		if($table != 'zzzzsys_debug'){
			$sql= "DROP TABLE IF EXISTS $table";
			nuRunQuery($sql);
		}
    }
}

function nuImportSystemFiles() {

	try{
		$file						= realpath(dirname(__FILE__))."/nubuilder4.sql";
		@$handle					= fopen($file, "r");
		$temp						= "";
		if ( $handle ) {

			nuRunQuery("DROP TABLE IF EXISTS zzzzsys_debug");

			while(($line = fgets($handle)) !== false){

				if($line[0] != "-" AND $line[0] != "/"  AND $line[0] != "\n"){
					$line 			= trim($line);
					$temp 			.= $line;
					if(substr($line, -1) == ";"){
						$temp	= rtrim($temp,';');
						$temp	= str_replace('ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER','', $temp);
						nuRunQuery($temp);
						$temp	= "";
					}
				}
			}
		}else{
			throw new nuInstallException("error opening the file: $file");
		}

	}catch (Throwable $e) {
		nuInstallException($e);
	}catch (Exception $e) {
		nuInstallException($e);
	}
}

function nuInstallException($e){

	$ce		= $_POST['nuProcedureEval'];
	$se		= $_POST['nuSystemEval'];
	print "$ce $se<br>" . $e->getFile() .'<i>' . $e->getMessage() . '</i>' . '<br><b><i>Traced from...</i></b><br>';
	$a		= $e->getTrace();
	$t		= array_reverse($a);
	for($i = 0 ; $i < count($t) ; $i++){
		$m	= '(line:<i>' . $t[$i]['line'] . '</i>) ' . $t[$i]['file'] . ' <b> - ' . $t[$i]['function'] . '<b>';
		print $m . '<br>';
	}
}

//-- after zzzzsys files have been imported
function nuUpdateSystemRecords(){									

	$ts			= nuBuildTableSchema();
	$t			= nuListSystemTables();

 	for($i = 0 ; $i < count($t) ; $i++){
        
        	$table  	= $t[$i];
		$new		= $ts["$table"]['names'];
		$old		= $ts["sys_$table"]['names'];
		//-- remove unused fields from old
		for($c = 0 ; $c < count($old) ; $c++){						
			$field	= $old[$c];
			if(!in_array($field, $new)){
				$sql= "ALTER TABLE sys_$table DROP COLUMN $field";
				nuRunQuery($sql);
			}
		}
	}
	
	$ts 			= nuBuildTableSchema();
	for($i = 0 ; $i < count($t) ; $i++){
        
		$table  	= $t[$i];
		$lfield		= 'FIRST';
	
		//-- insert extra new fields into old	
		for($c = 0 ; $c < count($new) ; $c++){			

			$new	= $ts["$table"]['names'];
			$newt	= $ts["$table"]['types'];
			$old	= $ts["sys_$table"]['names'];
			$oldt	= $ts["sys_$table"]['types'];
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

function nuAddNewSystemTables(){
	
	$ts			= nuBuildTableSchema();
	foreach ($ts as $k => $v) {
		if(substr($k,0,8) == 'zzzzsys_'){
			$v	= $ts["sys_$k"]['valid'];
			if($v == ''){
				$sql	= "CREATE TABLE sys_$k SELECT * FROM $k";
				nuRunQuery($sql);
			}
		}
	}
	nuRunQuery("ALTER TABLE `zzzzsys_object` CHANGE `sob_input_count` `sob_input_count` BIGINT(20) NULL DEFAULT '0';");
	nuRunQuery("ALTER TABLE `zzzzsys_object` CHANGE `sob_all_order` `sob_all_order` INT(11) NULL DEFAULT '0';");

}

function nuJustNuRecords(){
    
	$s  =  "DELETE FROM zzzzsys_event WHERE zzzzsys_event_id NOT LIKE 'nu%'"; 															
	nuRunQuery($s);
    
	$s  =  "DELETE FROM zzzzsys_file WHERE zzzzsys_file_id NOT LIKE 'nu%'"; 															
	nuRunQuery($s);
    
	$s  =  "DELETE FROM zzzzsys_format WHERE zzzzsys_format_id NOT LIKE 'nu%'"; 															
    	nuRunQuery($s);

	//-- delete records that start with ids starting with 'nu' or linked to forms starting with 'nu'    
    	$s  =  "DELETE FROM zzzzsys_php WHERE sph_zzzzsys_form_id NOT LIKE 'nu%' AND zzzzsys_php_id NOT LIKE 'nu%' ";  		  				
    	nuRunQuery($s);
    
    	$s  =  "DELETE FROM zzzzsys_setup";
    	nuRunQuery($s);
    
	//-- delete tabs with forms starting with 'nu'
    	$s  =  "DELETE FROM zzzzsys_tab WHERE  syt_zzzzsys_form_id NOT LIKE 'nu%' OR syt_zzzzsys_form_id = 'nuuserhome'";
    	nuRunQuery($s);
}

function nuRemoveNuRecords(){
    
	$O	= nuTT();
  
	//-- delete if attached to objects on forms with ids starting with 'nu'	  
	$s  =  "DELETE FROM sys_zzzzsys_event WHERE zzzzsys_event_id LIKE 'nu%'"; 
    	nuRunQuery($s);
    
    	$s  =  "DELETE FROM sys_zzzzsys_file WHERE zzzzsys_file_id LIKE 'nu%'"; 															
    	nuRunQuery($s);
    
    	$s  =  "DELETE FROM sys_zzzzsys_format WHERE zzzzsys_format_id LIKE 'nu%'"; 															
    	nuRunQuery($s);

	//-- delete all objects on forms with ids that start with 'nu'
    	$s  =  "DELETE FROM sys_zzzzsys_object WHERE sob_all_zzzzsys_form_id LIKE 'nu%'  AND sob_all_zzzzsys_form_id != 'nuuserhome'";   	
    	nuRunQuery($s);
   
	//-- delete all objects on forms with ids that start with 'nu'
    	$s  =  "DELETE FROM sys_zzzzsys_tab WHERE syt_zzzzsys_form_id LIKE 'nu%' AND syt_zzzzsys_form_id != 'nuuserhome'"; 					
    	nuRunQuery($s);
	
	//-- delete all objects on forms with ids that start with 'nu'
    	$s  =  "DELETE FROM sys_zzzzsys_form WHERE zzzzsys_form_id LIKE 'nu%' ";    														
    	nuRunQuery($s);
    
	//-- delete records that start with ids starting with 'nu' or linked to forms starting with 'nu'
    	$s  =  "DELETE FROM sys_zzzzsys_php WHERE zzzzsys_php_id LIKE 'nu%' AND zzzzsys_php_id != 'nuuserhome_BE'";  		  				
    	nuRunQuery($s);

	//-- KEEP BROWSEs from FORMs with ids that start with 'nu'	    
	$s  =  "DELETE FROM sys_zzzzsys_browse WHERE sbr_zzzzsys_form_id LIKE 'nu%'";  
    	nuRunQuery($s);

	//-- KEEP BROWSEs from FORMs with ids that start with 'nu'	    
    	$s  =  "DELETE FROM sys_zzzzsys_translate WHERE zzzzsys_translate_id LIKE 'nu%'";  				  							
    	nuRunQuery($s);
    
	//-- delete all timezones
    	$s  =  "DELETE FROM sys_zzzzsys_timezone";									   				 										
	nuRunQuery($s);
}

function nuAppendToSystemTables(){

	try{
		$t      	= nuSystemList();
		for($i = 0 ; $i < count($t) ; $i++){
			$table  = $t[$i];

			//-- if duplicate records, use latest record from zzzzsys_object
			if($table == 'zzzzsys_object'){				
				nuRunQuery("REPLACE INTO sys_zzzzsys_object SELECT * FROM zzzzsys_object");
				nuRunQuery("DELETE FROM zzzzsys_object");
			}
			nuRunQuery("REPLACE INTO $table SELECT * FROM sys_$table");
			nuRunQuery("DROP TABLE sys_$table");
		}

		$s		= "DROP TABLE sys_zzzzsys_report_data";
		nuRunQuery($s);
		
		$s		= "DROP TABLE sys_zzzzsys_run_list";
		nuRunQuery($s);

		$s		= "UPDATE zzzzsys_setup SET set_denied = '1'";
		nuRunQuery($s);
			
	}catch (Throwable $e) {
		nuInstallException($e);
	}catch (Exception $e) {
		nuInstallException($e);
	}
}

function nuSystemList(){
	
	$t      = [];
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
    	$t[]	= 'zzzzsys_table';
    	$t[]	= 'zzzzsys_timezone';
    	$t[]	= 'zzzzsys_translate';
    	$t[]	= 'zzzzsys_user';
	
	return $t;
}


function nuSetCollation(){
	
	$tbls   = nuRunQuery("SHOW FULL Tables WHERE Table_type = 'BASE TABLE'");
	$db	= nuRunQuery("SELECT DATABASE()");
	$dbname	= db_fetch_row($db)[0];

	nuRunQuery("ALTER DATABASE $dbname CHARACTER SET utf8 COLLATE utf8_general_ci");
	
	while($row = db_fetch_row($tbls)){

		$tab 	= $row[0];
		
		if(substr($tab, 0, 8) == 'zzzzsys_'){
			
			nuRunQuery("ALTER TABLE $tab ENGINE = MyISAM");
			nuRunQuery("ALTER TABLE $tab DEFAULT CHARACTER SET utf8 COLLATE utf8_general_ci");
			nuRunQuery("ALTER TABLE $tab CONVERT TO CHARACTER SET utf8 COLLATE utf8_general_ci");
		
		}
		
	}
	
}

function nuMigrateSQL() {

        $set    = "nuStartDatabaseAdmin();";
	$where  = 'nu5bad6cb37966261';;
        $values = array($set,$where);
        $sql    = "UPDATE `zzzzsys_event` SET `sev_javascript` = ? WHERE `zzzzsys_event_id` = ? ";
        nuRunQuery($sql, $values);

	$set    = "<iframe id='sqlframe' src='nuselect.php' style='height:180px;width:700px'></iframe>";
        $where  = 'nu5bad6cb359e7a1a';
        $values = array($set,$where);
        $sql    = "UPDATE `zzzzsys_object` SET `sob_html_code` = ? WHERE `zzzzsys_object_id` = ? ";
        nuRunQuery($sql, $values);

	$set    = 'window.open(\'nureportdesigner.php?tt=\' + $("#sre_zzzzsys_php_id").val() + \'&launch=\' + $("#sre_zzzzsys_form_id").val());';
        $where  = 'nu5bad6cb3797b0a7';
        $values = array($set,$where);
        $sql    = "UPDATE `zzzzsys_event` SET `sev_javascript` = ? WHERE `zzzzsys_event_id` = ?";
        nuRunQuery($sql, $values);

        $set  = '$s  = "CREATE TABLE #TABLE_ID# SELECT zzzzsys_object_id AS theid FROM zzzzsys_object WHERE ";';
        $set .= "\n";
        $set .= '$w  = "1";';
        $set .= "\n";
        $set .= 'if ( $GLOBALS[\'nuSetup\']->set_denied == 1 )  { ';
        $set .= "\n";
        $set .= '$w  = "sob_all_zzzzsys_form_id NOT LIKE \'nu%\' OR sob_all_zzzzsys_form_id = \'nuuserhome\'"; ';
        $set .= "\n";
        $set .= '}';
        $set .= "\n";
        $set .= 'nuRunQuery("$s$w");';
        $set .= "\n";
        $where  = 'nuobject_BB';
        $values = array($set,$where);
        $sql    = "UPDATE `zzzzsys_php` SET `sph_php` = ? WHERE `zzzzsys_php_id` = ?";
        nuRunQuery($sql, $values);

        $set  = '$s  = "CREATE TABLE #TABLE_ID# SELECT zzzzsys_form_id AS theid FROM zzzzsys_form WHERE ";';
        $set .= "\n";
        $set .= '$w  = "1";';
        $set .= "\n";
        $set .= 'if ( $GLOBALS[\'nuSetup\']->set_denied == 1 )  { ';
        $set .= "\n";
        $set .= '$w  = "zzzzsys_form_id NOT LIKE \'nu%\' OR zzzzsys_form_id = \'nuuserhome\'"; ';
        $set .= "\n";
        $set .= '}';
        $set .= "\n";
        $set .= 'nuRunQuery("$s$w");';
        $set .= "\n";
        $where  = 'nuform_BB';
        $values = array($set,$where);
        $sql    = "UPDATE `zzzzsys_php` SET `sph_php` = ? WHERE `zzzzsys_php_id` = ?";
        nuRunQuery($sql, $values);

        $set  = '$s  = "CREATE TABLE #TABLE_ID# SELECT zzzzsys_form_id AS theid FROM zzzzsys_form WHERE ";';
        $set .= "\n";
        $set .= '$w  = "1";';
        $set .= "\n";
        $set .= 'if ( $GLOBALS[\'nuSetup\']->set_denied == 1 )  { ';
        $set .= "\n";
        $set .= '$w  = "zzzzsys_form_id NOT LIKE \'nu%\' OR zzzzsys_form_id = \'nuuserhome\'"; ';
        $set .= "\n";
        $set .= '}';
        $set .= "\n";
        $set .= 'nuRunQuery("$s$w");';
        $set .= "\n";
        $where  = 'nutablookup_BB';
        $values = array($set,$where);
        $sql    = "UPDATE `zzzzsys_php` SET `sph_php` = ? WHERE `zzzzsys_php_id` = ?";
        nuRunQuery($sql, $values);
}

?>
