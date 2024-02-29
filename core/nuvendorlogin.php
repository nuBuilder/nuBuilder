<?php
require_once('nuchoosesetup.php');
require_once('nuprocesslogins.php');

$sessionId		= $_REQUEST['sessid'];

$appId = isset($_GET['appId']) ? $_GET['appId'] : "";
$table = isset($_GET['table']) ? $_GET['table'] : "";

$values			= [$sessionId];
$sql			= "SELECT * FROM zzzzsys_session WHERE zzzzsys_session_id = ?";
$obj			= nuRunQuery($sql, $values);
$result			= db_num_rows($obj);

if($_SESSION['nubuilder_session_data']['IS_DEMO']){
	echo('Not available in the Demo');
	return;
} 

$page = null;
if ($result == 1) {

	$recordObj		= db_fetch_object($obj);
	$logon_info		= json_decode($recordObj->sss_access);
	$globalAccess	= $logon_info->session->global_access == '1';

	if ($globalAccess) {
		$page		= nuGetVendorURL($appId, $table);
	}

}

if ($page) {
	header("Location: $page");
} else {
	echo "Acess Denied.";
}

function nuGetVendorURL($appId, $table) {

	$time = time();

	$page = null;
	if ($appId == 'PMA') {

		$dbName = $_SESSION['nubuilder_session_data']['DB_NAME'];
		$table = $table == "" ? "" : "&table=$table";

		if ($table) {
			$page = "libs/nudb/index.php?route=/sql&pos=0&db=$dbName&table=$table&$time=$time";
		} else {
			$page = "libs/nudb/index.php?route=/database/structure&server=1&db=$dbName&$time=$time";
		}

	} elseif ($appId == 'TFM') {
		$page = "libs/tinyfilemanager/tinyfilemanager.php";
	}

	setcookie("nu_".$appId,	 $_SESSION['nubuilder_session_data']['SESSION_ID']);

	return $page;
	
}

?>
