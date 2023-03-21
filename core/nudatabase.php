<?php

mb_internal_encoding('UTF-8');

$_POST['RunQuery']		= 0;

$sessionData = $_SESSION['nubuilder_session_data'] ?? null;

$DBHost			= $sessionData['DB_HOST'] ?? $nuConfigDBHost;
$DBName			= $sessionData['DB_NAME'] ?? $nuConfigDBName;
$DBUser			= $sessionData['DB_USER'] ?? $nuConfigDBUser;
$DBPassword		= $sessionData['DB_PASSWORD'] ?? $nuConfigDBPassword;
$DBCharset		= $sessionData['DB_CHARSET'] ?? 'utf8';
$DBOptions		= $sessionData['DB_OPTIONS'] ?? $nuConfigDBOptions ?? null;
$charSet		= [PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES $DBCharset"];

if (is_array($DBOptions)) {
	array_merge($charSet, $DBOptions);
} else {
	$DBOptions = $charSet;
}

try {
	$nuDB 				= new PDO("mysql:host=$DBHost;dbname=$DBName;charset=$DBCharset", $DBUser, $DBPassword, $DBOptions);
	$nuDB->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
	echo 'Connection to the nuBuilder database failed: ' . $e->getMessage();
	echo '<br><br>Verify and update the settings in nuconfig.php';
	echo '<br><br>Restart your browser after modifying nuconfig.php in order for changes to be reflected';
	die();
}

$GLOBALS['sys_table_prefix'] = [
	'access' => 'sal',
	'access_form' => 'slf',
	'access_php' => 'slp',
	'access_report' => 'srp',
	'browse' => 'sbr',
	'cloner' => 'clo',
	'code_snippet' => 'cot',
	'config' => 'cfg',
	'debug' => 'deb',
	'event' => 'sev',
	'file' => 'sfi',
	'form' => 'sfo',
	'format' => 'srm',
	'info' => 'inf',
	'note' => 'not',
	'note_category' => 'hoc',
	'object' => 'sob',
	'php' => 'sph',
	'report' => 'sre',
	'select' => 'sse',
	'select_clause' => 'ssc',
	'session' => 'sss',
	'setup' => 'set',
	'sso_login' => 'sso',
	'tab' => 'syt',
	'timezone' => 'stz',
	'translate' => 'trl',
	'user' => 'sus'
];

function nuRunQueryNoDebug($query, $params = [], $isInsert = false){

	global $nuDB;

	$stmt = $nuDB->prepare($query);

	try {
		$stmt->execute($params);
	}catch(PDOException $ex){
	}

	return $isInsert ? $nuDB->lastInsertId() : $stmt;

}

function nuRunQueryTest($query, $params = []){

	global $nuDB;

	$stmt = $nuDB->prepare($query);

	try {
		$stmt->execute($params);
	}catch(PDOException $ex){
		return $ex->getMessage();
	}

	return true;

}

function nuDebugMessageString($user, $message, $sql, $trace) {

		$debug	= "
		===PDO MESSAGE===

		$message

		===SQL===========

		$sql

		===BACK TRACE====

		$trace

		";

		return trim(preg_replace('/\t/', '', $debug));

}

function nuRunQuery($sql, $params = [], $isInsert = false){

	global $DBHost;
	global $DBName;
	global $DBUser;
	global $DBPassword;
	global $nuDB;
	global $DBCharset;

	if($sql == ''){
		$params 		= [];
		$params[0] 	= $DBHost;
		$params[1] 	= $DBName;
		$params[2] 	= $DBUser;
		$params[3] 	= $DBPassword;
		$params[4] 	= $nuDB;
		$params[4] 	= $DBCharset;
		return $params;
	}

	// nuLog($s, count($params)> 0 ? $params[0] : '');
	$stmt = $nuDB->prepare($sql);

	try {
		$stmt->execute($params);
	}catch(PDOException $ex){

		$user 		= 'globeadmin';
		$message	= $ex->getMessage();
		$array 		= debug_backtrace();
		$trace 		= '';

		$count = count($array);
		for($i = 0 ; $i < $count; $i ++){
			$trace .= $array[$i]['file'] . ' - line ' . $array[$i]['line'] . ' (' . $array[$i]['function'] . ")\n\n";
		}

		$debug = nuDebugMessageString($user, $message, $sql, $trace);

		$_POST['RunQuery']		= 1;
		nuDebug($debug);
		$_POST['RunQuery']		= 0;

		$GLOBALS['ERRORS'][]	= $debug;

		$error = new stdClass();
		$error->user = $user;
		$error->message = $message;
		$error->sql = $sql;
		$error->trace = $trace;
		$GLOBALS['LAST_ERROR'] = $error;

		return -1;

	}

	return $isInsert ? $nuDB->lastInsertId() : $stmt;

}

function nuGetLastError() {
	return $GLOBALS['LAST_ERROR'] ?? null;
}

function nuRunQueryString($sql, $sqlWithHK) {

	global $nuDevSelectQueryRunParameterised;

	if ($nuDevSelectQueryRunParameterised) {
		$args = [];
		$sqlWithHK = preg_replace_callback('/#(\'?)(.*?)(\'?)#/', function($match) use(&$count, &$args) {
			$args[] = $match[2];
			return '?';
		}, $sqlWithHK);
		$sqlWithHK = str_replace("'?'", "?", $sqlWithHK);
		
		foreach ($args as &$value) {
			$value = nuReplaceHashVariables('#' . $value. '#');
		}

		return nuRunQuery($sqlWithHK, $args);

	} else {
		return nuRunQuery($sql);
	}

}

function db_is_auto_id($table, $primaryKey) {

	$query = "SHOW COLUMNS FROM `$table` WHERE `Field` = ?";
	$stmt = nuRunQuery($query, [$primaryKey]);

	if (db_num_rows($stmt) == 0) {
		nuDisplayError(nuTranslate("The primary key is invalid"). ": ". $primaryKey);
		return false;
	}

	$row = db_fetch_object($stmt);
	return $row->Extra == 'auto_increment';

}

function db_fetch($obj, $style = 'object', $fetchAll = false) {

	$fetchStyles = [
		'array' => [PDO::FETCH_ASSOC, 'array'],
		'keypairarray' => [PDO::FETCH_KEY_PAIR, 'array'],
		'object' => [PDO::FETCH_OBJ, 'boolean'],
		'row' => [PDO::FETCH_NUM, 'boolean']
	];

	if (!isset($fetchStyles[$style])) {
		return false;
	}

	[$fetchStyle, $returnType] = $fetchStyles[$style];

	if (!is_object($obj)) {
		if ($returnType === 'array') {
			return [];
		} elseif ($returnType === 'boolean') {
			return false;
		}
	}

	return $fetchAll ? $obj->fetchAll($fetchStyle) : $obj->fetch($fetchStyle);

}

function db_fetch_array($obj){
	return db_fetch($obj, 'array');
}

function db_fetch_all_array($obj){
	return db_fetch($obj, 'array', true);
}

function db_fetch_key_pair_array($obj){
	return db_fetch($obj, 'keypairarray');
}

function db_fetch_object($obj){
	return db_fetch($obj, 'object');
}

function db_fetch_all_column($obj){
	return db_fetch($obj, 'column', true);
}

function db_fetch_all_object($obj){
	return db_fetch($obj, 'object', true);
}

function db_fetch_row($obj){
	return db_fetch($obj, 'row');
}

function db_update_value($table, $pk, $recordId, $column, $newValue) {

	$update = "UPDATE `$table` SET `$column` = ? WHERE `$pk` = ?";
	nuRunQuery($update, [$newValue, $recordId]);

}

function db_fetch_value($table, $pk, $recordId, $column) {

	$select = "SELECT `$column` FROM `$table` WHERE `$pk` = ?";
	$result = nuRunQuery($select, [$recordId]);
	if (db_num_rows($result) == 1) {
		$arr = db_fetch_array($result);
		return $arr[$column];
	} else {
		return false;
	}

}

function db_field_info($tableName) {

    $fields = [];
    $types = [];
    $primaryKeys = [];

    $query = "DESCRIBE `$tableName`";
    $result = nuRunQueryNoDebug($query);

	while ($row = db_fetch_row($result)) {
		$fields[] = $row[0];
		$types[] = $row[1];

		if ($row[3] === 'PRI') {
			$primaryKeys[] = $row[0];
		}
	}

	return [$fields, $types, $primaryKeys];

}

function db_field_names($n){

	$a	= [];
	$s	= "DESCRIBE `$n`";
	$t	= nuRunQuery($s);

	while($r = db_fetch_row($t)){
		$a[] = $r[0];
	}

	return $a;

}


function db_field_types($n){

	$a		= [];
	$s		= "DESCRIBE `$n`";
	$t		= nuRunQuery($s);

	while($r = db_fetch_row($t)){
		$a[] = $r[1];
	}

	return $a;

}

function db_field_exists($tableName, $fieldName) {

	$fields = db_field_names($tableName);
	return array_search($fieldName, $fields) != false;

}

function db_primary_key($n){

	$a		= [];
	$s		= "DESCRIBE `$n`";
	$t		= nuRunQuery($s);

	while($r = db_fetch_row($t)){

		if($r[3] == 'PRI'){
			$a[] = $r[0];
		}

	}

	return $a;

}

function nuDBQuote($s) {

	global $nuDB;
	return $nuDB->quote($s);

}

function db_num_rows($o) {

	if (!is_object($o)) {
		return 0;
	}
	return $o->rowCount();

}

function db_num_columns($o) {

	if (!is_object($o)) {
		return 0;
	}
	return $o->columnCount();

}

function db_quote($s) {

	global $nuDB;
	return $nuDB->quote($s);

}


function nuViewExists($view) {

	$sql = "SELECT table_name as TABLE_NAME FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_TYPE = 'VIEW' AND table_schema = DATABASE() AND TABLE_NAME = ?";
	$qry = nuRunQuery($sql, [$view]);

	return db_num_rows($qry);

}

function nuCanCreateView() {

	$dbName = $_SESSION['nubuilder_session_data']['DB_NAME'];

	$qry = nuRunQuery("SHOW GRANTS FOR CURRENT_USER()");
	while ($row = db_fetch_row($qry)) {

		$grants = $row[0];

		$createView	= nuStringContains("CREATE VIEW", $grants, true);
		$grant1		= nuStringContains("ALL PRIVILEGES ON `$dbName`.*", $grants, true);
		$grant2		= nuStringContains("ALL PRIVILEGES ON *.*", $grants, true);
		$grant3		= nuStringContains("ALL PRIVILEGES ON %", $grants, true);

		if ($createView || $grant1 || $grant2 || $grant3) {
			return true;
		}

	}

	return false;

}

function nuDebugResult($nuDebugMsg){

	if(is_object($nuDebugMsg)){
		$nuDebugMsg = print_r($nuDebugMsg,1);
	}

	$nuDebugUserId = null;
	if (function_exists('nuHash')) {
		$hash = nuHash();
		$nuDebugUserId = isset($hash) && isset($hash['USER_ID']) ? $hash['USER_ID'] : null;
		$nuDebugUserId = $nuDebugUserId == null && isset($_POST['nuSTATE']['username']) ? $_POST['nuSTATE']['username'] : $nuDebugUserId;
	}

	$nuDebugId = nuID();

	$insert = "INSERT INTO zzzzsys_debug (zzzzsys_debug_id, deb_message, deb_added, deb_user_id) VALUES (:id , :message, :added, :user_id)";

	$params = [
		"id"		=> $nuDebugId,
		"message"	=> $nuDebugMsg,
		"added"		=> time(),
		"user_id"	=> $nuDebugUserId
	];

	nuRunQuery($insert, $params);

	$proc	= nuProcedure('NUDEBUGRESULTADDED');
	if($proc != '') { 
		eval($proc); 
	}

	return $nuDebugId;

}

function nuDebug($a){

	$date				= date("Y-m-d H:i:s");
	$b					= debug_backtrace();
	$f					= $b[0]['file'];
	$l					= $b[0]['line'];
	$m					= "$date - $f line $l\n\n<br>\n";

	$nuSystemEval				= '';
	if ( isset($_POST['nuSystemEval']) ) {
		$nuSystemEval			= $_POST['nuSystemEval'];
	}
	$nuProcedureEval			= '';
	if ( isset($_POST['nuProcedureEval']) ) {
		$nuProcedureEval		= $_POST['nuProcedureEval'];
	}

	if($_POST['RunQuery'] == 1){
		$m				= "$date - SQL Error in <b>nuRunQuery</b>\n\n<br>\n" ;
	}else{
		$m				= "$date - $nuProcedureEval $nuSystemEval line $l\n\n<br>\n" ;
	}

	for($i = 0 ; $i < func_num_args() ; $i++){

		$p				= func_get_arg($i);

		$m				.= "\n[$i] : ";

		if(gettype($p) == 'object' or gettype($p) == 'array'){
			$m			.= print_r($p,1);
		}else{
			$m			.= $p;
		}

		$m				.= "\n";

	}

	nuDebugResult($m);

}

function nuLog($s1, $s2 = '', $s3 = '') {

	$dataToLog = [date("Y-m-d H:i:s"), $s1, $s2, $s3];

	$data = implode(" - ", $dataToLog);
	// $data = print_r($dataToLog, true);

	$dir = dirname(__DIR__, 1) . DIRECTORY_SEPARATOR. 'temp' . DIRECTORY_SEPARATOR;
	file_put_contents($dir . 'nulog.txt', $data.PHP_EOL , FILE_APPEND | LOCK_EX);

}

function nuID(){

	global $DBUser;
	$i	= uniqid();
	$s	= md5($i);

	while($i == uniqid()){}

	$prefix = $DBUser == 'nudev' ? 'nu' : '';
	return $prefix.uniqid().$s[0].$s[1];

}

?>
