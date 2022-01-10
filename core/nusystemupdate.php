<?php

require_once ('nuchoosesetup.php');
require_once ('nucommon.php');
require_once ('nudata.php');
require_once ('nusystemupdatelibs.php');

$jsonID = $_GET['i'];
$J = nuGetJSONData($jsonID);

if ($J != 'valid') {

	print nuTranslate("Something's wrong. Try logging in again" . "...");
	return;
}

if ($nuConfigEnableDatabaseUpdate == false) {

	print nuTranslate('The Database update is disabled.');
	return;

}

$i = 1;

nuAlterSystemTables();
nuPrintUpdateMessage($i, 'Altered System Tables');
$i++;

// Copy all zzzz-tables to temp sys-tables
nuCopySystemTables();
nuPrintUpdateMessage($i, 'Copied SYSTEM zzzz-TABLES to TEMP sys-TABLES');
$i++;

// Import nubuilder4.sql
nuImportSystemFiles();
nuPrintUpdateMessage($i, 'Imported nubuilder4.sql into the DATABASE');
$i++;

nuAddNewSystemTables();
nuPrintUpdateMessage($i, 'Copied SYSTEM FILES to TEMP FILES for any new tables added from the import.');
$i++;

nuUpdateSystemRecords();
nuPrintUpdateMessage($i, 'Updated TEMP FILE table structure\'s to SYSTEM FILES');
$i++;

nuRemoveNuRecords();
nuPrintUpdateMessage($i, 'Removed all ids starting with nu from TEMP FILES');
$i++;

nuJustNuRecords();
nuPrintUpdateMessage($i, 'Removed all ids not starting with nu from SYSTEM FILES');
$i++;

nuAppendToSystemTables();
nuPrintUpdateMessage($i, 'Inserted TEMP FILES into SYSTEM FILES');
$i++;

nuImportLanguageFiles();
nuPrintUpdateMessage($i, 'Imported the LANGUAGE FILES into the DATABASE');
$i++;

nuSetCollation();
nuPrintLastUpdateMessage($i, 'You will need to log in again for the changes to take effect');

function nuPrintUpdateMessage($i, $msg) {
	print '<br>' . $i . '. <span style="font-family:Helvetica;padding:10px;">' . $msg . '<br></span>';
}

function nuPrintLastUpdateMessage($i, $msg) {
	print '<br>' . $i . '. <span style="font-family:Helvetica;font-style:italic;font-size:20px;font-weight:bold;padding:10px">' . $msg . '</span><br>';
}

?>
