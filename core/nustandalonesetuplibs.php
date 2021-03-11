<?php

require_once('nusystemupdatelibs.php'); 

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

?>
