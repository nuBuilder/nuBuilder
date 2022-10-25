<?php
header("Content-type: text/html; charset=utf-8");
header("Cache-Control: no-cache, must-revalidate");
header("Pragma: no-cache"); 
header("Expires: Mon, 26 Jul 1997 05:00:00 GMT");

require_once ('nuchoosesetup.php');
require_once ('nucommon.php');
require_once ('nudata.php');
require_once ('nusystemupdatelibs.php');
require_once('nusetuplibs.php');
require_once('nuform.php');
require_once('../nuconfig.php');

$config = nuConfigScript();
eval($config['code']);

$jsonId = isset($_GET['i']) ? $_GET['i'] : null;

if ($jsonId != null) {
	while (@ob_end_flush());
	ob_implicit_flush(true);
	nuRunUpdate($jsonId);
}

function nuUpdateAllowed($jsonId, $u = null, $p = null) {

	global $nuConfigDBGlobeadminUsername;
	global $nuConfigDBGlobeadminPassword;

	if ($u == $nuConfigDBGlobeadminUsername && $p == $nuConfigDBGlobeadminPassword) {
		return true;
	} else {
		return $jsonId == null ? null : nuGetJSONData($jsonId) == 'valid';
	}

	if (isset($nuConfigEnableDatabaseUpdate) && $nuConfigEnableDatabaseUpdate == false) {

		print nuTranslate('The Database update is disabled.');
		return false;

	}

	if ($check != true) {

		print nuTranslate("Something is wrong. Try logging in again" . "...");
		return false;
	}

}


function nuRunUpdate($jsonId, $u = null, $p = null) {

	if (! nuUpdateAllowed($jsonId, $u, $p)) {
		return;
	}

	$i = 1;

	nuPrintUpdateMessage(null, 'nuBuilder Update');

	// Save configuration settings values
	$config = nuRunQueryNoDebug("SELECT zzzzsys_config_id, cfg_value FROM zzzzsys_config WHERE zzzzsys_config_id like 'nu%'");
	if (db_num_rows($config) > 0) {
		nuPrintUpdateMessage($i, 'Saved CONFIGURATION SETTINGS');
		$i++;
	} else {
		unset($config);
	}

	// Alter system tables (add new columns, change data types)
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

	// Import language files
	nuImportLanguageFiles();
	nuPrintUpdateMessage($i, 'Imported the LANGUAGE FILES into the DATABASE');
	$i++;


	// Restore config values
	if (isset($config)) {

		while($r = db_fetch_object($config)){

			$update = "UPDATE zzzzsys_config SET cfg_value = ? WHERE zzzzsys_config_id = ?";
			nuRunQuery($update, array($r->cfg_value, $r->zzzzsys_config_id));

		}

		nuPrintUpdateMessage($i, 'Restored CONFIGURATION SETTINGS');
		$i++;

	}

	// Set DB Collation
	nuSetCollation();
	nuPrintUpdateMessage($i, 'Set DB Collation');
	$i++;


	// Run nuAfterUpdate
	nuRunPHPHidden('nuAfterUpdate',0);
	nuPrintUpdateMessage($i, 'Run nuAfterUpdate');
	$i++;

	nuPrintUpdateMessage(null, 'You will need to log in again for the changes to take effect');

}

function nuPrintUpdateMessage($i = null, $msg) {

	if ($i == null) {
		print '<br><br><span style="font-family:Helvetica;font-style:italic;font-size:20px;font-weight:bold;padding:10px">' . $msg . '</span><br>';
	} else {
		print '<br>' . $i . '. <span style="font-family:Helvetica;padding:10px;">' . $msg . '<br></span>';
	}

}

?>
