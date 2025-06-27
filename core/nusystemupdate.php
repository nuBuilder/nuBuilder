<?php
header("Content-type: text/html; charset=utf-8");
header("Cache-Control: no-cache, must-revalidate");
header("Pragma: no-cache");
header("Expires: Mon, 26 Jul 1997 05:00:00 GMT");

require_once('nusessiondata.php');
require_once('nucommon.php');
require_once('nudata.php');
require_once('nusystemupdatelibs.php');
require_once('nusetuplibs.php');
require_once('nuform.php');
require_once('../nuconfig.php');

$config = nuConfigScript();
eval ($config['code']);

$jsonId = isset($_GET['i']) ? $_GET['i'] : null;

if ($jsonId != null) {
	while (@ob_end_flush())
		;
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

function nuSetupGetConfig() {

	$sysConfig = nuRunQueryNoDebug("SELECT zzzzsys_config_id, cfg_value FROM zzzzsys_config WHERE zzzzsys_config_id like 'nu%'");
	return $sysConfig;

}

function nuSetupGetDefaultFormats() {

	$formatColumns = db_field_names('zzzzsys_format');
	if (array_search('srm_default', $formatColumns) === false) {
		return null;
	}

	$sysConfig = nuRunQueryNoDebug("SELECT zzzzsys_format_id, srm_default FROM zzzzsys_format  WHERE srm_default IS NOT NULL");
	return $sysConfig;

}

function nuSetupRestoreConfig($sysConfig) {

	while ($row = db_fetch_object($sysConfig)) {
		$update = "UPDATE zzzzsys_config SET cfg_value = ? WHERE zzzzsys_config_id = ?";
		nuRunQuery($update, [$row->cfg_value, $row->zzzzsys_config_id]);
	}

}

function nuSetupRestoreDefaultFormats($defaultFormats) {

	if (db_num_rows($defaultFormats) !== 0) {

		$update = "UPDATE zzzzsys_format SET srm_default = ?";
		nuRunQuery($update, ['0']);

		while ($row = db_fetch_object($defaultFormats)) {
			$update = "UPDATE zzzzsys_format SET srm_default = ? WHERE zzzzsys_format_id = ?";
			nuRunQuery($update, [$row->srm_default, $row->zzzzsys_format_id]);
		}

	}

}

function nuRunUpdate($jsonId, $u = null, $p = null) {

	$nuSQLFile = 'nubuilder4.sql';

	if ($u === null && isset($_GET['u'])) {
		$u = $_GET['u'];
	}
	if ($p === null && isset($_GET['p'])) {
		$p = $_GET['p'];
	}

	if (!nuUpdateAllowed($jsonId, $u, $p)) {
		return;
	}

	nuPrintUpdateMessage('nuBuilder Update');

	// Check if import sql file exists
	$importFileExists = nuSQLImportFileExists($nuSQLFile);
	if ($importFileExists !== true) {
		echo "File does not exist. Updated aborted: $importFileExists";
		return;
	}

	$i = 1;

	// Save configuration settings values
	$sysConfig = nuSetupGetConfig();
	if (db_num_rows($sysConfig) > 0) {
		nuPrintUpdateMessage('Saved CONFIGURATION SETTINGS', $i);
		$i++;
	} else {
		$sysConfig = null;
	}

	// Save default formats
	$defaultFormats = nuSetupGetDefaultFormats();
	if ($defaultFormats !== null && db_num_rows($defaultFormats) > 0) {
		nuPrintUpdateMessage('Saved DEFAULT FORMATS', $i);
		$i++;
	} else {
		$defaultFormats = null;
	}

	// Alter nu-tables: Add new columns, change data types etc.
	nuAlterSystemTables();
	nuPrintUpdateMessage('Altered System Tables', $i);
	$i++;

	// Copy all zzzz-tables to temp sys-tables
	nuCopySystemTables();
	nuPrintUpdateMessage('Copied SYSTEM zzzz-TABLES to TEMP sys-TABLES', $i);
	$i++;

	// Import nubuilder4.sql
	nuSetupImportSQLFile();
	nuPrintUpdateMessage("Imported $nuSQLFile into the DATABASE", $i);
	$i++;

	nuAddNewSystemTables();
	nuPrintUpdateMessage('Copied SYSTEM FILES to TEMP FILES for any new tables added from the import.', $i);
	$i++;

	nuUpdateSystemRecords();
	nuPrintUpdateMessage('Updated TEMP FILE table structure\'s to SYSTEM FILES', $i);
	$i++;

	nuRemoveNuRecords();
	nuPrintUpdateMessage('Removed all ids starting with nu from TEMP FILES', $i);
	$i++;

	nuJustNuRecords();
	nuPrintUpdateMessage('Removed all ids not starting with nu from SYSTEM FILES', $i);
	$i++;

	nuAppendToSystemTables();
	nuPrintUpdateMessage('Inserted TEMP FILES into SYSTEM FILES', $i);
	$i++;

	nuOtherUpdates();
	nuPrintUpdateMessage('Other Table Tweaks', $i);
	$i++;

	// Import language files
	nuImportLanguageFiles();
	nuPrintUpdateMessage('Imported the LANGUAGE FILES into the DATABASE', $i);
	$i++;

	// Restore config values
	if (isset($sysConfig)) {
		nuSetupRestoreConfig($sysConfig);
		nuPrintUpdateMessage('Restored CONFIGURATION SETTINGS', $i);
		$i++;
	}

	// Restore default formats
	if (isset($defaultFormats)) {
		nuSetupRestoreDefaultFormats($defaultFormats);
		nuPrintUpdateMessage('Restored DEFAULT FORMATS', $i);
		$i++;
	}

	// Set DB Collation
	nuSetCollation();
	nuPrintUpdateMessage('Set DB Collation', $i);
	$i++;


	// Run nuAfterUpdate
	nuRunPHPHidden('nu_after_update');
	nuPrintUpdateMessage('Run nu_after_update', $i);
	$i++;

	nuPrintUpdateMessage('You will need to log in again for the changes to take effect');

}

function nuPrintUpdateMessage($msg, $i = null) {

	if ($i == null) {
		print '<br><br><span style="font-family:Helvetica;font-style:italic;font-size:20px;font-weight:bold;padding:10px">' . $msg . '</span><br>';
	} else {
		print '<br>' . $i . '. <span style="font-family:Helvetica;padding:10px;">' . $msg . '<br></span>';
	}

}

