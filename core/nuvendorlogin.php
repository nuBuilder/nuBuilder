<?php
require_once('nusessiondata.php');
require_once('nucommon.php');
require_once('nuprocesslogins.php');
require_once(dirname(__FILE__). '/../nuconfig.php');

global $nuConfigFileMangerUsers;

$sessionId		= $_REQUEST['sessid'];
$sessionData	= $_SESSION['nubuilder_session_data'];

$appId = isset($_GET['appId']) ? $_GET['appId'] : "";
$table = isset($_GET['table']) ? $_GET['table'] : "";

if($sessionData['IS_DEMO']){
	echo('Not available in the Demo');
	return;
} 

if (nuObjKey($sessionData,'SESSION_2FA_STATUS') == 'PENDING') {
	echo('Access denied.');
	return;
}

$page = null;

$sql			= "SELECT * FROM zzzzsys_session WHERE zzzzsys_session_id = ?";
$stmt			= nuRunQuery($sql, [$sessionId]);

if (db_num_rows($stmt) === 1) {

	$recordObj		= db_fetch_object($stmt);
	$access			= json_decode($recordObj->sss_access);
	$globalAccess	= $access->session->global_access == '1';
	$userId 		= $access->session->zzzzsys_user_id;

	$userHasTFMAccess = $appId === 'TFM' && strpos($nuConfigFileMangerUsers,  $userId, 0) !== false;

	if ($globalAccess || $userHasTFMAccess) {
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
