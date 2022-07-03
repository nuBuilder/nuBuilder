<?php

require_once('nuchoosesetup.php');
require_once('nucommon.php');
require_once('nudata.php');

print "<meta charset='utf-8'>";

$s					= "SELECT deb_message AS json FROM zzzzsys_debug WHERE zzzzsys_debug_id = ? ";		//-- created by nuRunHTML()
$t					= nuRunQuery($s, array($_GET['i']));

if (db_num_rows($t) == 0) {
	print nuTranslate("Use the Print button to refresh the table.");
	return;
}

$r					= db_fetch_object($t);
$j					= json_decode($r->json);
$c					= $j->columns;
$colCount			= count($c);

$_POST['nuHash']	= (array) $j->hash;
$hash				= nuHash();
$_POST['nuHash']['TABLE_ID'] = $hash['browse_table_id'];
nuEval($hash['form_id'] . '_BB');

$includeHiddenColumns = nuObjKey($hash, 'nuPrintincludeHiddenColumns', null) == '1' ? true : false;

unset($hash);

print "<style>\n";

$class = array();



for($col = 0 ; $col < $colCount ; $col++){

	$wd		= ($c[$col]->width) . 'px';

	if($c[$col]->align == 'l'){$align = 'left';}
	if($c[$col]->align == 'r'){$align = 'right';}
	if($c[$col]->align == 'c'){$align = 'center';}

	$class[$col]	= "style='font-size:12px;width:$wd;text-align:$align'";

}

print "</style>\n";

print "<TABLE border=1; style='border-collapse: collapse'>\n";
print "\n<TR>";

for($col = 0 ; $col < $colCount ; $col++){

	if(!($c[$col]->width == 0 && $includeHiddenColumns != true)) {
		$st	= $class[$col];
		print "<TH $st>";
		print nuTranslate($c[$col]->title);
		print "</TH>\n";
	}

}

$h	= "</TR>";

$t				= nuRunQuery($j->sql);

while($r = db_fetch_array($t)){

	$h	.= "\n<TR>\n";

	for($col = 0 ; $col < $colCount ; $col++){

		if(!($c[$col]->width == 0 && $includeHiddenColumns != true)) {
			$v = $c[$col]->display == 'null' || $c[$col]->display == '""' ? '' : $r[$c[$col]->display];
			$st	= $class[$col];
			$h	.= "<TD $st>" . $v . "</TD>\n";
		}

	}

	$h	.= "</TR>";

}


$h	.= "</TABLE>";

print $h;

nuRunQuery("DELETE FROM zzzzsys_debug WHERE zzzzsys_debug_id = ? ", array($_GET['i']));
$hash = nuHash();
nuRunQuery("DROP TABLE IF EXISTS " . $hash['browse_table_id']);
unset($hash);

?>
