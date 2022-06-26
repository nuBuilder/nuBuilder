<?php
session_start();
require_once('nucommon.php');
require_once('nudata.php');

$jsonID					= $_GET['i'];
$J						= nuGetJSONData($jsonID);
$JSON					= json_decode($J);
$TABLE_ID				= nuTT();
$hashData				= nuAddToHashList($JSON, 'php');
$hashData['TABLE_ID']	= $TABLE_ID;
$GLOBALS['TABLE_ID']	= $TABLE_ID;
$_POST['nuHash']		= $hashData;

nuEval($JSON->parentID);


?>
