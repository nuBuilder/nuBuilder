<?php 

require_once('nuchoosesetup.php');
require_once('nucommon.php'); 
require_once('nudata.php');
require_once('nusystemupdatelibs.php'); 

$jsonID	= $_GET['i'];
$J	= nuGetJSONData($jsonID);

if($J != 'valid'){
	
	print "Something's wrong. Try logging in again...";	
	return;
}


if ($nuConfigEnableDatabaseUpdate == false) {
	
	print "The Database update is disabled.";	
	return;
	
}

nuAlterSystemTables();
print '<br><span style="font-family:Helvetica;padding:10px;">Altered System Tables <br></span>';

// Copy all zzzz-tables to temp sys-tables
nuCopySystemTables();
print '<br><span style="font-family:Helvetica;padding:10px;">Copied SYSTEM zzzz-TABLES to TEMP sys-TABLES <br></span>';

// Import nubuilder4.sql
nuImportSystemFiles();
print '<br><span style="font-family:Helvetica;padding:10px;">Imported nubuilder4.sql into the DATABASE <br></span>';

nuAddNewSystemTables();
print '<br><span style="font-family:Helvetica;padding:10px;">Copied SYSTEM FILES to TEMP FILES for any new tables added from the import. <br></span>';

nuUpdateSystemRecords();
print '<br><span style="font-family:Helvetica;padding:10px;">Updated TEMP FILE table structure\'s to SYSTEM FILES <br></span>';

nuRemoveNuRecords();
print '<br><span style="font-family:Helvetica;padding:10px;">Removed all ids starting with nu from TEMP FILES <br></span>';

nuJustNuRecords();
print '<br><span style="font-family:Helvetica;padding:10px;">Removed all ids not starting with nu from SYSTEM FILES <br></span>';

nuAppendToSystemTables();
print '<br><span style="font-family:Helvetica;padding:10px;">Inserted TEMP FILES into SYSTEM FILES <br></span>';

nuImportLanguageFiles();
print '<br><span style="font-family:Helvetica;padding:10px;">Imported the LANGUAGE FILES into the DATABASE <br></span>';

nuSetCollation();
print '<br><span style="font-family:Helvetica;font-style:italic;font-size:20px;font-weight:bold;padding:10px">You will need to log in again for the changes to take effect.</span><br>';

nuMigrateSQL();


?>
