<?php 

require_once('nuchoosesetup.php');
require_once('nucommon.php'); 
require_once('nudata.php'); 

print "<meta charset='utf-8'>";

$table_id			= nuTT();
$s					= "SELECT deb_message AS json FROM zzzzsys_debug WHERE zzzzsys_debug_id = ? ";		//-- created by nuRunHTML()
$t					= nuRunQuery($s, array($_GET['i']));

if (db_num_rows($t) == 0) {
	print nuTranslate("Use the Print button to refresh the table.");
	return;
}

$r					= db_fetch_object($t);
$j					= json_decode($r->json);
$q					= $j->sql;
$c					= $j->columns;

$_POST['nuHash']	= (array) $j->hash;
$__x				= nuHash();
$_POST['nuHash']['TABLE_ID'] = $__x['browse_table_id'];
nuEval($__x['form_id'] . '_BB');
unset($__x);

print "<style>\n";

for($col = 0 ; $col < count($c) ; $col++){
	
	
	$wd		= ($c[$col]->width) . 'px';
	
	if($c[$col]->align == 'l'){$align = 'left';}
	if($c[$col]->align == 'r'){$align = 'right';}
	if($c[$col]->align == 'c'){$align = 'center';}
	
	$class[$col]	= "style='font-size:12px;width:$wd;text-align:$align'";
		
}

print "</style>\n";

print "<TABLE border=1; style='border-collapse: collapse'>\n";
print "\n<TR>";

for($col = 0 ; $col < count($c) ; $col++){
	
	$st	= $class[$col];
	print "<TH $st>";
	print $c[$col]->title;
	print "</TH>\n";
	
}

$h	= "</TR>";

$t				= nuRunQuery($j->sql);

while($r = db_fetch_array($t)){
		
	$h	.= "\n<TR>\n";

	for($col = 0 ; $col < count($c) ; $col++){
		
		$v = $c[$col]->display == 'null' || $c[$col]->display == '""' ? '' : $r[$c[$col]->display];
		$st	= $class[$col];
		$h	.= "<TD $st>" . $v . "</TD>\n";
		
			
	}

	$h	.= "</TR>";

}


$h	.= "</TABLE>";

print $h;

nuRunQuery("DELETE FROM zzzzsys_debug WHERE zzzzsys_debug_id = ? ", array($_GET['i']));
$__x = nuHash();
nuRunQuery("DROP TABLE IF EXISTS " . $__x['browse_table_id']);
unset($__x);

?>

