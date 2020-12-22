<?php

function nuStandaloneImportNewDB() {
	
	$t = nuRunQuery("SHOW TABLES");
	while($r = db_fetch_row($t)){
		if($r[0] == 'zzzzsys_object'){return;}
	}
	$file						= realpath(dirname(__FILE__))."/nubuilder4.sql";
	@$handle					= fopen($file, "r");
	$temp						= "";
	if($handle){
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
	}
}

?>
