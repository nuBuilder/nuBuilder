<?php

mb_internal_encoding('UTF-8');

$_POST['RunQuery']		= 0;

$sessionData = $_SESSION['nubuilder_session_data'] ?? null;

$dbHost			= $sessionData['DB_HOST'] ?? $nuConfigDBHost;
$dbName			= $sessionData['DB_NAME'] ?? $nuConfigDBName;
$dbPort			= $sessionData['DB_PORT'] ?? ($nuConfigDBPort ?? '3306');
$dbUser			= $sessionData['DB_USER'] ?? $nuConfigDBUser;
$dbPassword		= $sessionData['DB_PASSWORD'] ?? $nuConfigDBPassword;
$dbCharset		= $sessionData['DB_CHARSET'] ?? 'utf8';
$dbOptions		= $sessionData['DB_OPTIONS'] ?? $nuConfigDBOptions ?? null;
$charSet		= [PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES $dbCharset"];

if (is_array($dbOptions)) {
	array_merge($charSet, $dbOptions);
} else {
	$dbOptions = $charSet;
}

try {
	$nuDB = new PDO("mysql:host=$dbHost;dbname=$dbName;charset=$dbCharset;port=$dbPort", $dbUser, $dbPassword, $dbOptions);
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
	'email_template' => 'emt',
	'email_log' => 'eml',
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
	'user' => 'sus',
	'user_permission' => 'upe',
	'permission_item' => 'pme'
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
		return $ex;
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

	global $nuDB;
	global $DBHost;
	global $DBName;
	global $DBUser;
	global $DBPassword;
			  
	global $DBCharset;

	if($sql == ''){
		$params 	= [];
		$params[0] 	= $DBHost;
		$params[1] 	= $DBName;
		$params[2] 	= $DBUser;
		$params[3] 	= $DBPassword;
		$params[4] 	= $nuDB;
		$params[5] 	= $DBCharset;
		return $params;
	}

	$stmt = $nuDB->prepare($sql);

	try {
		$stmt->execute($params);
	}catch(PDOException $ex){

		$user 		= nuDebugUserId();
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

		return nuRunQuery(nuSanitizeSqlQuery($sqlWithHK), $args);

	} else {
		return nuRunQuery(nuSanitizeSqlQuery($sql));
	}

}

function nuCreateTableFromSelect($tableName, $select, $params = [], $temporary = false) {

	$query = sprintf(
		'CREATE' . ($temporary ? ' TEMPORARY' : '') . ' TABLE `%s` AS (%s)',
		$tableName,
		$select
	);

	nuRunQuery($query, $params);

}

function nuSanitizeSqlQuery($query) {

	// List of SQL commands to remove
	$patterns = array(
		'/DROP\s+TABLE/i',
		'/CREATE\s+TABLE/i',
		'/ALTER\s+TABLE/i',
		'/TRUNCATE\s+TABLE/i',
		'/INSERT\s+INTO\s+.*\s+SELECT/i',
		'/DELETE\s+FROM/i',
		'/UPDATE/i'
	);

	// Sanitize the query by removing the specified SQL commands
	return preg_replace($patterns, '', $query);

}

function db_is_auto_id($table, $primaryKey) {

	global $nuConfigIntegerPKsAuto;

	$query = "SHOW COLUMNS FROM `$table` WHERE `Field` = ?";
	$stmt = nuRunQuery($query, [$primaryKey]);

	if (db_num_rows($stmt) == 0) {
		nuDisplayError(nuTranslate("The primary key is invalid"). ": ". $primaryKey);
		return false;
	}

	$row = db_fetch_object($stmt);
	return ($row->Extra == 'auto_increment' || ($nuConfigIntegerPKsAuto && str_contains($row->Type, 'int')));

}

function db_fetch($obj, $style = 'object', $fetchAll = false) {

	$fetchStyles = [
		'array' => [PDO::FETCH_ASSOC, 'array'],
		'keypairarray' => [PDO::FETCH_KEY_PAIR, 'array'],
		'object' => [PDO::FETCH_OBJ, 'boolean'],
		'row' => [PDO::FETCH_NUM, 'boolean'],
		'column' => [PDO::FETCH_COLUMN, 'array']
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

function db_fetch_array($obj, $fetchAll = false){
	return db_fetch($obj, 'array', $fetchAll);
}

function db_fetch_all_array($obj){
	return db_fetch($obj, 'array', true);
}

function db_fetch_key_pair_array($obj, $fetchAll = false){
	return db_fetch($obj, 'keypairarray', $fetchAll);
}

function db_fetch_all_key_pair_array($obj){
	return db_fetch($obj, 'keypairarray', true);
}

function db_fetch_object($obj, $fetchAll = false){
	return db_fetch($obj, 'object', $fetchAll);
}

function db_fetch_all_object($obj){
	return db_fetch($obj, 'object', true);
}

function db_fetch_all_column($obj){
	return db_fetch($obj, 'column', true);
}

function db_fetch_row($obj, $fetchAll = false){
	return db_fetch($obj, 'row', $fetchAll);
}

function db_update_value($table, $pk, $recordId, $column, $newValue) {

	$update = "UPDATE `$table` SET `$column` = ? WHERE `$pk` = ?";
	return nuRunQuery($update, [$newValue, $recordId]);

}

function db_fetch_value($table, $pk, $recordId, $column) {

	$select = "SELECT `$column` FROM `$table` WHERE `$pk` = ?";
	$stmt = nuRunQuery($select, [$recordId]);
	if (db_num_rows($stmt) == 1) {
		$arr = db_fetch_array($stmt);
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
	$stmt = nuRunQueryNoDebug($query);

	while ($row = db_fetch_row($stmt)) {
		$fields[] = $row[0];
		$types[] = $row[1];

		if ($row[3] === 'PRI') {
			$primaryKeys[] = $row[0];
		}
	}

	return [$fields, $types, $primaryKeys];

}

function db_field_names($tableName) {

	$fieldNames = [];
	$describeQuery = "DESCRIBE `$tableName`";
	$stmt = nuRunQuery($describeQuery);

	while ($row = db_fetch_row($stmt)) {
		$fieldNames[] = $row[0]; 
	}

	return $fieldNames;

}


function db_field_types($tableName) {

	$fieldTypes = [];
	$describeQuery = "DESCRIBE `$tableName`";
	$stmt = nuRunQuery($describeQuery); 

	while ($row = db_fetch_row($stmt)) { 
		$fieldTypes[] = $row[1]; 
	}

	return $fieldTypes;

}

function db_field_exists($tableName, $fieldName) {

	$fields = db_field_names($tableName);
	return array_search($fieldName, $fields) != false;

}

function db_primary_key($tableName) {

	$primaryKeys = [];
	$query = "DESCRIBE `$tableName`";
	$stmt = nuRunQuery($query); 

	while ($row = db_fetch_row($stmt)) {

		if ($row[3] == 'PRI') {
			$primaryKeys[] = $row[0];
		}

	}

	return $primaryKeys;

}


function nuDBQuote($s) {

	global $nuDB;
	return $nuDB->quote($s);

}

function db_num_rows($obj) {

	return is_object($obj) ? $obj->rowCount() : 0;
}

function db_num_columns($obj) {

	return is_object($obj) ? $obj->columnCount() : 0;

}

function db_quote($s) {

	global $nuDB;
	return $nuDB->quote($s);

}

function nuEncodeQueryRowResults($sql, $args = [], $prefixedData = []) {

	$stmt = nuRunQuery($sql, $args);
	$results = $prefixedData;
	while ($row = db_fetch_row($stmt)) {
		$results[] = $row;
	}
	return base64_encode(json_encode($results));

};

function nuViewExists($view) {

	$sql = "SELECT table_name as TABLE_NAME FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_TYPE = 'VIEW' AND table_schema = DATABASE() AND TABLE_NAME = ?";
	$qry = nuRunQuery($sql, [$view]);

	return db_num_rows($qry);

}

function nuCanCreateView() {

	$testViewName = "nu_test_view_" . mt_rand();

	$createViewSql = "CREATE VIEW `$testViewName` AS SELECT `zzzzsys_debug_id` FROM `zzzzsys_debug` LIMIT 1";
	$result = nuRunQueryTest($createViewSql);

	if ($result === true) {
		// If the view creation succeeds, attempt to drop the view to clean up.
		$dropViewSql = "DROP VIEW IF EXISTS `$testViewName`";
		nuRunQueryNoDebug($dropViewSql);
		return true;
	}
	
	return false;

}

function nuDebugUserId() {

	$nuDebugUserId = null;
	if (function_exists('nuHash')) {
		$hash = nuHash();
		$nuDebugUserId = $hash['USER_ID'] ?? null;
		if (!$nuDebugUserId) {
			$nuDebugUserId = $_POST['nuSTATE']['username'] ?? null;
		}
	}

	return $nuDebugUserId;

}

function nuDebugResult($nuDebugMsg, $flag = null){

	if (is_object($nuDebugMsg)){
		$nuDebugMsg = print_r($nuDebugMsg, 1);
	}

	$nuDebugId = nuID();
	$nuDebugUserId = nuDebugUserId();
	
	$insert = "INSERT INTO zzzzsys_debug (zzzzsys_debug_id, deb_message, deb_flag, deb_added, deb_user_id) VALUES (:id , :message, :flag, :added, :user_id)";

	$params = [
		"id"		=> $nuDebugId,
		"message"	=> $nuDebugMsg,
		"added"		=> time(),
		"flag"		=> $flag,
		"user_id"	=> nuDebugUserId()
	];

	nuRunQueryNoDebug($insert, $params);

	$nuDebugFlag = $flag ?? '';
	$proc	= nuProcedure('NUDEBUGRESULTADDED');
	if($proc != '') { 
		eval($proc); 
	}

	return $nuDebugId;

}

function nuDebugCreateOutput(...$args) {

	$dateTime = new DateTime();
	$backtrace = debug_backtrace();
	$file = $backtrace[0]['file'];
	$line = $backtrace[0]['line'];
	$message = sprintf("%s - %s line %d\n\n<br>\n", $dateTime->format("Y-m-d H:i:s"), $file, $line);

	$nuSystemEval = $_POST['nuSystemEval'] ?? '';
	$nuProcedureEval = $_POST['nuProcedureEval'] ?? '';

	if (!empty($_POST['RunQuery']) && $_POST['RunQuery'] == 1) {
		$message = sprintf("%s - SQL Error in <b>nuRunQuery</b>\n\n<br>\n", $dateTime->format("Y-m-d H:i:s"));
	} else {
		$message = sprintf("%s - %s %s line %d\n\n<br>\n", $dateTime->format("Y-m-d H:i:s"), $nuProcedureEval, $nuSystemEval, $line);
	}

	foreach ($args as $i => $arg) {
		$type = gettype($arg);
		$message .= sprintf("\n[%d] : ", $i);

		if ($type === 'object' || $type === 'array') {
			$message .= print_r($arg, true);
		} else {
			$message .= $arg;
		}

		$message .= "\n";
	}

	return $message;
	
}


function nuDebug(...$args) {

	$message = nuDebugCreateOutput(...$args);
	nuDebugResult($message);

}

final class nuDebug {

	 public static $flag = '';

	 public static function setFlag($flag) {
		static::$flag = $flag;
		return new static;
	 }
	 
	 public static function log(...$args) {
		$message = nuDebugCreateOutput(...$args);
		nuDebugResult($message, static::$flag);
	 }

}

function nuLog(...$args) {

	$message = date("Y-m-d H:i:s") .  " : " . implode(" ; ", array_map(function($arg) {
		return is_object($arg) || is_array($arg) ? @print_r($arg, true) : $arg; 
	}, $args)) . PHP_EOL;

	$dir = dirname(__DIR__, 1) . DIRECTORY_SEPARATOR . 'temp' . DIRECTORY_SEPARATOR;
	file_put_contents($dir . 'nuDebug.txt', $message, FILE_APPEND | LOCK_EX);

}

function nuID(){

	global $DBUser;
	$i	= uniqid();
	$s	= md5($i);

	while($i == uniqid()){}

	$prefix = $DBUser == 'nudev' ? 'nu' : '';
	return $prefix.uniqid().$s[0].$s[1];

}

function nuID_DEV(){

	global $DBUser;

	$uniqueId = uniqid();
	$randomBytes = random_bytes(16);
	$hash = hash('sha256', $randomBytes);

	$prefix = $DBUser == 'nudev' ? 'nu' : '';
	return $prefix . $uniqueId . substr($hash, 0, 2);

}

?>