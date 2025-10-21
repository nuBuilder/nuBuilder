<?php

mb_internal_encoding('UTF-8');

$_POST['RunQuery'] = 0;

$sessionData = $_SESSION['nubuilder_session_data'] ?? null;

$dbHost = $sessionData['DB_HOST'] ?? $nuConfigDBHost;
$dbName = $sessionData['DB_NAME'] ?? $nuConfigDBName;
$dbPort = $sessionData['DB_PORT'] ?? ($nuConfigDBPort ?? '3306');
$dbUser = $sessionData['DB_USER'] ?? $nuConfigDBUser;
$dbPassword = $sessionData['DB_PASSWORD'] ?? $nuConfigDBPassword;
$dbCharset = $sessionData['DB_CHARSET'] ?? 'utf8';
$dbOptions = $sessionData['DB_OPTIONS'] ?? $nuConfigDBOptions ?? null;
$charSet = [PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES $dbCharset"];

if (is_array($dbOptions)) {
	array_merge($charSet, $dbOptions);
} else {
	$dbOptions = $charSet;
}

try {
	$nuDB = new PDO("mysql:host=$dbHost;dbname=$dbName;charset=$dbCharset;port=$dbPort", $dbUser, $dbPassword, $dbOptions);
	$nuDB->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
	echo '<div style="max-width:500px;margin:32px auto;padding:24px;background:#f9f5f5;border:1px solid #db4d4d;border-radius:7px;box-shadow:0 2px 8px #f0f0f0;">';
	echo '<h2 style="color:#b10000;font-size:1.4em;margin-top:0;">Connection to the nuBuilder database failed</h2>';
	echo '<div style="color:#b10000;">' . htmlspecialchars($e->getMessage()) . '</div>';
	echo '<div style="margin:16px 0 0 0;color:#333;">Verify and update the settings in <b>nuconfig.php</b>.<br>Restart your browser after modifying <b>nuconfig.php</b> in order for changes to be reflected.</div>';

	// Add: Offer to create the database if "Unknown database" error
	if (strpos($e->getMessage(), 'Unknown database') !== false) {
		echo '<div style="margin-top:20px;padding:16px;background:#f7fcff;border:1px solid #aadeff;border-radius:6px;">';
		echo '<b style="color:#0084b1;">It looks like the database <span style="color:#005580;">' . htmlspecialchars($dbName) . '</span> does not exist.</b><br>';
		echo '<span style="color:#333;">To create it, please enter your database username and <i>(optionally)</i> password:</span>';
		echo '<form method="post" style="margin-top:10px;">';
		echo "<small>(Creating the database only works if this user has CREATE DATABASE privileges)</small><br><br>";

		echo '<div style="margin-bottom:10px;"><label style="width:100px;display:inline-block;">DB User:</label> <input type="text" name="create_db_user" required style="padding:5px;border-radius:3px;border:1px solid #bbb;"></div>';
		echo '<div style="margin-bottom:10px;"><label style="width:100px;display:inline-block;">DB Password:</label> <input type="password" name="create_db_password" style="padding:5px;border-radius:3px;border:1px solid #bbb;"></div>';
		echo '<input type="hidden" name="create_db_name" value="' . htmlspecialchars($dbName) . '">';
		echo '<input type="hidden" name="create_db_host" value="' . htmlspecialchars($dbHost) . '">';
		echo '<input type="hidden" name="create_db_port" value="' . htmlspecialchars($dbPort) . '">';
		echo '<button type="submit" name="create_db_submit" style="background:#0084b1;color:#fff;padding:7px 18px;border:none;border-radius:3px;cursor:pointer;">Create Database</button>';
		echo '</form>';

		// Handle the form submission
		if (
			isset($_POST['create_db_submit']) &&
			isset($_POST['create_db_user'], $_POST['create_db_name'], $_POST['create_db_host'], $_POST['create_db_port'])
		) {
			$createDbUser = $_POST['create_db_user'];
			$createDbPassword = $_POST['create_db_password'] ?? '';
			$createDbName = $_POST['create_db_name'];
			$createDbHost = $_POST['create_db_host'];
			$createDbPort = $_POST['create_db_port'];

			echo '<div style="margin-top:14px;">';
			try {
				if ($createDbPassword === '') {
					$pdo = new PDO("mysql:host=$createDbHost;port=$createDbPort", $createDbUser);
				} else {
					$pdo = new PDO("mysql:host=$createDbHost;port=$createDbPort", $createDbUser, $createDbPassword);
				}
				$pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
				$sql = "CREATE DATABASE `$createDbName` CHARACTER SET $dbCharset";
				$pdo->exec($sql);
				echo '<span style="color:#0a7d30;font-weight:bold;">Database created successfully!</span> <span style="color:#333;">Please reload the page.</span>';
			} catch (PDOException $ce) {
				echo '<span style="color:#b10000;font-weight:bold;">Failed to create database:</span> <span style="color:#333;">' . htmlspecialchars($ce->getMessage()) . '</span>';
			}
			echo '</div>';
		}
		echo '</div>'; // end info box
	}

	echo '</div>'; // end main box

	header('HTTP/1.0 403 Forbidden');
	die();

}

$GLOBALS['sys_table_prefix'] = [
	'access' => 'sal',
	'access_form' => 'slf',
	'access_php' => 'slp',
	'access_report' => 'srp',
	'browse' => 'sbr',
	'cloner' => 'clo',
	'app_cloner' => 'cla',
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
	'permission_item' => 'pme',
	'prompt_generator' => 'pge',
	'item' => 'itm'
];

/**
 * Prepares the SQL query by applying conditional compilation based on
 * the target database directives (-- #IF_MSSQL / -- #IF_MYSQL / -- #ELSE),
 * and then applying necessary compatibility replacements (e.g., MySQL functions to MSSQL).
 *
 * @param string $sql The raw SQL query string.
 * @return string The prepared SQL query string for the current target database.
 */

function nuPrepareQuery($sql) {

	$sql1 = $sql;
	$extracted_sql = '';
	$else_content = '';

	try {
		$target_db_key = nuMSSQL() ? 'IF_MSSQL' : 'IF_MYSQL';

		$lines = explode("\n", $sql);
		$current_directive = null;
		$buffer = '';

		foreach ($lines as $line) {
			if (preg_match('/--\s*#(IF_MSSQL|IF_MYSQL|ELSE|ENDIF)/i', $line, $m)) {
				$directive = strtoupper($m[1]);

				if ($directive === 'ENDIF') {
					// Save the last active block
					if ($current_directive === $target_db_key) {
						$extracted_sql = trim($buffer);
					} elseif ($current_directive === 'ELSE') {
						$else_content = trim($buffer);
					}
					$current_directive = null;
					$buffer = '';
				} elseif ($directive === 'ELSE') {
					// Flush IF block before switching to ELSE
					if ($current_directive === $target_db_key) {
						$extracted_sql = trim($buffer);
					}
					$current_directive = 'ELSE';
					$buffer = '';
				} else {
					// Start new IF block
					$current_directive = $directive;
					$buffer = '';
				}
			} elseif ($current_directive) {
				$buffer .= $line . "\n";
			}
		}

		// fallback to ELSE if target block was never captured
		if (empty($extracted_sql) && !empty($else_content)) {
			$extracted_sql = $else_content;
		}

		if (!empty($extracted_sql)) {
			$sql = $extracted_sql;
		}

	} catch (Throwable $error) {
		///	nuLog($sql, $error->getMessage());
	}

	// --- 2. COMPATIBILITY REPLACEMENTS ---
	if (nuMSSQL()) {
		$sql = preg_replace('/\bIFNULL\s*\(([^,]+),\s*([^)]+)\)/i', 'COALESCE($1, $2)', $sql);
		$sql = preg_replace('/`([^`]+)`/', '[$1]', $sql);

		$sql = preg_replace_callback(
			'/FIND_IN_SET\s*\(\s*([^)]+)\s*,\s*([^)]+)\)/i',
			function ($m) {
				$val = trim($m[1]);
				$csv = trim($m[2]);
				return "CHARINDEX(',' + CAST($val AS VARCHAR) + ',', ',' + $csv + ',')";
			},
			$sql
		);

		$sql = preg_replace('/\bNOW\s*\(\s*\)/i', 'GETDATE()', $sql);
		$sql = preg_replace('/\bCHAR_LENGTH\s*\(\s*([^)]+)\)/i', 'LEN($1)', $sql);
		$sql = preg_replace('/table_schema\s*=\s*DATABASE\(\)/i', 'TABLE_CATALOG = db_name()', $sql);
	}

	return $sql;
}

function nuRunQueryNoDebug($query, $params = [], $isInsert = false) {

	global $nuDB;

	$stmt = $nuDB->prepare(nuPrepareQuery($query));

	try {
		$stmt->execute($params);
	} catch (PDOException $ex) {
	}

	return $isInsert ? $nuDB->lastInsertId() : $stmt;

}

function nuRunQueryTest($query, $params = []) {

	global $nuDB;

	$stmt = $nuDB->prepare(nuPrepareQuery($query));

	try {
		$stmt->execute($params);
	} catch (PDOException $ex) {
		return $ex;
	}

	return true;

}

function nuDebugMessageString($user, $message, $sql, $trace) {

	$debug = "
		===PDO MESSAGE===

		$message

		===SQL===========

		$sql

		===BACK TRACE====

		$trace

		";

	return trim(preg_replace('/\t/', '', $debug));

}

function nuQueryExtractQueryComponents($query) {

	$lines = explode("\n", $query);
	if (stripos(ltrim($lines[0] ?? ''), '#') !== 0) {
		return ['commands' => [], 'query' => $query];
	}

	$commentLines = [];
	$otherLines = [];

	foreach ($lines as $line) {
		$trimmed = ltrim($line);
		if (str_starts_with($trimmed, '#')) {
			$commentLines[] = substr($trimmed, 1); // Remove leading '#'
		} else {
			$otherLines[] = $line;
		}
	}

	return [
		'commands' => array_map('trim', $commentLines),
		'query' => implode("\n", array_map('trim', $otherLines))
	];
}


function nuGetDBParams() {
	global $nuDB,
	$nuConfigDBHost,
	$nuConfigDBName,
	$nuConfigDBUser,
	$nuConfigDBPassword,
	$nuConfigDBCharacterSet;

	return [
		'DBHost' => $nuConfigDBHost,
		'DBName' => $nuConfigDBName,
		'DBUser' => $nuConfigDBUser,
		'DBPassword' => $nuConfigDBPassword,
		'DBCharset' => $nuConfigDBCharacterSet,
		'DB' => $nuDB
	];
}

function nuRunQuery($sql, $params = [], $isInsert = false) {

	$dbParams = nuGetDBParams();
	if ($sql === '') {
		$params = [];
		$params[0] = $dbParams['DBHost'];
		$params[1] = $dbParams['DBName'];
		$params[2] = $dbParams['DBUser'];
		$params[3] = $dbParams['DBPassword'];
		$params[4] = $dbParams['DB'];
		$params[5] = $dbParams['DBCharset'];

		return $params;
	}

	$nuDB = $dbParams['DB'];
	$sqlParts = nuQueryExtractQueryComponents($sql);
	$commands = $sqlParts['commands'];
	if (!empty($commands)) {
		foreach ($commands as $command) {
			$nuDB->exec($command);
		}
	}

	$sql1 = $sqlParts['query'];
	$sql = nuPrepareQuery($sql1);

	if (nuMSSQL()) {
		$stmt = $nuDB->prepare($sql, [PDO::ATTR_CURSOR => PDO::CURSOR_SCROLL]);
	} else {
		$stmt = $nuDB->prepare($sql);
	}

	try {
		$stmt->execute($params);
	} catch (PDOException $ex) {

		$user = nuDebugUserId();
		$message = $ex->getMessage();
		$array = debug_backtrace();
		$trace = '';

		$count = count($array);
		for ($i = 0; $i < $count; $i++) {
			$trace .= $array[$i]['file'] . ' - line ' . $array[$i]['line'] . ' (' . $array[$i]['function'] . ")\n\n";
		}

		$debug = nuDebugMessageString($user, $message, $sql, $trace);

		$_POST['RunQuery'] = 1;
		nuDebug($debug);
		$_POST['RunQuery'] = 0;

		$GLOBALS['ERRORS'][] = $debug;

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
		$sqlWithHK = preg_replace_callback('/#(\'?)(.*?)(\'?)#/', function ($match) use (&$count, &$args) {
			$args[] = $match[2];
			return '?';
		}, $sqlWithHK);
		$sqlWithHK = str_replace("'?'", "?", $sqlWithHK);

		foreach ($args as &$value) {
			$value = nuReplaceHashVariables('#' . $value . '#');
		}

		return nuRunQuery(nuSanitizeSqlQuery($sqlWithHK), $args);

	} else {
		return nuRunQuery(nuSanitizeSqlQuery($sql));
	}

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

	if (nuMSSQL()) {
		// For MSSQL, check if the column is an identity column
		$query = "
			SELECT COLUMNPROPERTY(OBJECT_ID(?), ?, 'IsIdentity') AS IsIdentity, DATA_TYPE
			FROM INFORMATION_SCHEMA.COLUMNS
			WHERE TABLE_NAME = ? AND COLUMN_NAME = ?
		";
		$stmt = nuRunQuery($query, [$table, $primaryKey, $table, $primaryKey]);
		if (db_num_rows($stmt) == 0) {
			nuDisplayError(nuTranslate("The primary key is invalid") . ": " . $primaryKey);
			return false;
		}
		$row = db_fetch_object($stmt);
		return $row->IsIdentity == 1 || ($nuConfigIntegerPKsAuto && str_contains($row->DATA_TYPE, 'int'));
	} else {
		// MySQL/MariaDB
		$query = "SHOW COLUMNS FROM `$table` WHERE `Field` = ?";
		$stmt = nuRunQuery($query, [$primaryKey]);

		if (db_num_rows($stmt) == 0) {
			nuDisplayError(nuTranslate("The primary key is invalid") . ": " . $primaryKey);
			return false;
		}
		$row = db_fetch_object($stmt);
		return $row->Extra == 'auto_increment' || ($nuConfigIntegerPKsAuto && str_contains($row->Type, 'int'));
	}

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

function db_fetch_array($obj, $fetchAll = false) {
	return db_fetch($obj, 'array', $fetchAll);
}

function db_fetch_all_array($obj) {
	return db_fetch($obj, 'array', true);
}

function db_fetch_key_pair_array($obj, $fetchAll = false) {
	return db_fetch($obj, 'keypairarray', $fetchAll);
}

function db_fetch_all_key_pair_array($obj) {
	return db_fetch($obj, 'keypairarray', true);
}

function db_fetch_object($obj, $fetchAll = false) {
	return db_fetch($obj, 'object', $fetchAll);
}

function db_fetch_all_object($obj) {
	return db_fetch($obj, 'object', true);
}

function db_fetch_all_column($obj) {
	return db_fetch($obj, 'column', true);
}

function db_fetch_row($obj, $fetchAll = false) {
	return db_fetch($obj, 'row', $fetchAll);
}

function db_update_value($table, $pk, $recordId, $column, $newValue) {

	$esc = fn($id) => nuMSSQL() ? "[$id]" : "`$id`";
	$update = "UPDATE {$esc($table)} SET {$esc($column)} = ? WHERE {$esc($pk)} = ?";
	return nuRunQuery($update, [$newValue, $recordId]);

}

function db_fetch_value($table, $pk, $recordId, $column) {

	$esc = fn($id) => nuMSSQL() ? "[$id]" : "`$id`";
	$select = "SELECT {$esc($column)} FROM {$esc($table)} WHERE {$esc($pk)} = ?";
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

	if (nuMSSQL()) {
		// Use INFORMATION_SCHEMA for MSSQL to get consistent column layout
		$query = "
			SELECT
				C.COLUMN_NAME AS [Field],
				C.DATA_TYPE + CASE
					WHEN C.CHARACTER_MAXIMUM_LENGTH IS NULL THEN ''
					WHEN C.CHARACTER_MAXIMUM_LENGTH > 99999 THEN ''
					ELSE '(' + CAST(C.CHARACTER_MAXIMUM_LENGTH AS VARCHAR(5)) + ')'
				END AS [Type],
				C.IS_NULLABLE AS [Null],
				CASE WHEN TC.CONSTRAINT_TYPE = 'PRIMARY KEY' THEN 'PRI' ELSE '' END AS [Key]
			FROM INFORMATION_SCHEMA.COLUMNS C
			LEFT JOIN INFORMATION_SCHEMA.KEY_COLUMN_USAGE KCU
				ON C.TABLE_NAME = KCU.TABLE_NAME AND C.COLUMN_NAME = KCU.COLUMN_NAME
				AND C.TABLE_CATALOG = KCU.TABLE_CATALOG
			LEFT JOIN INFORMATION_SCHEMA.TABLE_CONSTRAINTS TC
				ON KCU.CONSTRAINT_NAME = TC.CONSTRAINT_NAME AND KCU.TABLE_CATALOG = TC.TABLE_CATALOG
			WHERE C.TABLE_NAME = ? AND C.TABLE_CATALOG = DB_NAME()
			ORDER BY C.ORDINAL_POSITION
		";
		$stmt = nuRunQueryNoDebug($query, [$tableName]);
	} else {
		// Use DESCRIBE for MySQL
		$query = "DESCRIBE `$tableName`";
		$stmt = nuRunQueryNoDebug($query);
	}

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

	if (nuMSSQL()) {
		$query = "SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = ? AND TABLE_CATALOG = DB_NAME() ORDER BY ORDINAL_POSITION";
		$stmt = nuRunQuery($query, [$tableName]);
	} else {
		$query = "DESCRIBE `$tableName`";
		$stmt = nuRunQuery($query);
	}

	while ($row = db_fetch_row($stmt)) {
		$fieldNames[] = $row[0];
	}

	return $fieldNames;

}

function db_field_types($tableName) {

	$fieldTypes = [];

	if (nuMSSQL()) {
		$query = "
			SELECT DATA_TYPE + CASE
				WHEN CHARACTER_MAXIMUM_LENGTH IS NULL THEN ''
				WHEN CHARACTER_MAXIMUM_LENGTH > 99999 THEN ''
				ELSE '(' + CAST(CHARACTER_MAXIMUM_LENGTH AS VARCHAR(5)) + ')'
			END AS [Type]
			FROM INFORMATION_SCHEMA.COLUMNS
			WHERE TABLE_NAME = ? AND TABLE_CATALOG = DB_NAME()
			ORDER BY ORDINAL_POSITION
		";
		$stmt = nuRunQuery($query, [$tableName]);
	} else {
		$query = "DESCRIBE `$tableName`";
		$stmt = nuRunQuery($query);
	}

	while ($row = db_fetch_row($stmt)) {
		$fieldTypes[] = nuMSSQL() ? $row[0] : $row[1];
	}

	return $fieldTypes;

}

function db_field_exists($tableName, $fieldName) {

	$fields = db_field_names($tableName);
	return array_search($fieldName, $fields) != false;

}

function db_primary_key($tableName) {

	$primaryKeys = [];

	if (nuMSSQL()) {
		$query = "
			SELECT KCU.COLUMN_NAME
			FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE KCU
			JOIN INFORMATION_SCHEMA.TABLE_CONSTRAINTS TC
				ON KCU.CONSTRAINT_NAME = TC.CONSTRAINT_NAME
				AND KCU.TABLE_CATALOG = TC.TABLE_CATALOG
			WHERE KCU.TABLE_NAME = ?
				AND KCU.TABLE_CATALOG = DB_NAME()
				AND TC.CONSTRAINT_TYPE = 'PRIMARY KEY'
			ORDER BY KCU.ORDINAL_POSITION
		";
		$stmt = nuRunQuery($query, [$tableName]);

		while ($row = db_fetch_row($stmt)) {
			$primaryKeys[] = $row[0];
		}
	} else {
		$query = "DESCRIBE `$tableName`";
		$stmt = nuRunQuery($query);

		while ($row = db_fetch_row($stmt)) {
			if ($row[3] == 'PRI') {
				$primaryKeys[] = $row[0];
			}
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

function nuEncode($value) {
	return base64_encode(json_encode($value));
}

function nuEncodeQueryRowResults($sql, $args = [], $prefixedData = []) {

	$stmt = nuRunQuery($sql, $args);

	$results = [];
	if (!empty($prefixedData)) {
		$results[] = $prefixedData;
	}

	while ($row = db_fetch_row($stmt)) {
		$results[] = $row;
	}

	return nuEncode($results);

}

function nuViewExists($view) {

	$sql = "SELECT table_name as TABLE_NAME FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_TYPE = 'VIEW' AND " . nuSchemaWhereCurrentDBSQL() . " AND TABLE_NAME = ?";
	$qry = nuRunQuery($sql, [$view]);

	return db_num_rows($qry);

}

function nuGetSysTables() {

	$tables = [];
	$stmt = nuRunQuery("SELECT table_name as TABLE_NAME FROM INFORMATION_SCHEMA.TABLES WHERE " . nuSchemaWhereCurrentDBSQL() . " AND TABLE_NAME LIKE 'zzzzsys_%'");
	while ($row = db_fetch_row($stmt)) {
		$tables[] = $row[0];
	}

	return $tables;

}

function nuGetUserTables() {

	$tables = [];
	$stmt = nuRunQuery("SELECT table_name as TABLE_NAME FROM INFORMATION_SCHEMA.TABLES WHERE " . nuSchemaWhereCurrentDBSQL() . " AND TABLE_NAME NOT LIKE 'zzzzsys_%'");
	while ($row = db_fetch_row($stmt)) {
		$tables[] = $row[0];
	}

	return $tables;

}

function nuCanCreateView() {

	$testViewName = "nu_test_view_" . mt_rand();

	$createViewSql = nuMSSQL()
		? "CREATE VIEW [$testViewName] AS SELECT TOP 1 [zzzzsys_debug_id] FROM [zzzzsys_debug];"
		: "CREATE VIEW `$testViewName` AS SELECT `zzzzsys_debug_id` FROM `zzzzsys_debug` LIMIT 1;";

	$result = nuRunQueryTest($createViewSql);

	if ($result === true) {
		// If the view creation succeeds, attempt to drop the view to clean up.
		$dropViewSql = nuMSSQL()
			? "IF OBJECT_ID(N'$testViewName', N'V') IS NOT NULL DROP VIEW [$testViewName];"
			: "DROP VIEW IF EXISTS `$testViewName`;";

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

function nuDebugResult($nuDebugMsg, $flag = null) {

	if (is_object($nuDebugMsg)) {
		$nuDebugMsg = print_r($nuDebugMsg, 1);
	}

	$nuDebugId = nuID();
	$nuDebugUserId = nuDebugUserId();

	$insert = "INSERT INTO zzzzsys_debug (zzzzsys_debug_id, deb_message, deb_flag, deb_added, deb_user_id) VALUES (:id , :message, :flag, :added, :user_id)";

	$params = [
		"id" => $nuDebugId,
		"message" => $nuDebugMsg,
		"added" => time(),
		"flag" => $flag,
		"user_id" => nuDebugUserId()
	];

	nuRunQueryNoDebug($insert, $params);

	$nuDebugFlag = $flag ?? '';

	if (function_exists('nuProcedure')) {
		$proc = nuProcedure('nu_debug_result_added');
		if ($proc != '') {
			eval ($proc);
		}
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
		if ($type === 'string' && strpos($arg, ' <html>') === 0) {
			$message .= $arg;
		} else {

			$message .= sprintf("\n[%d] : ", $i);

			if ($type === 'object' || $type === 'array') {
				$message .= print_r($arg, true);
			} else {
				$message .= $arg;
			}
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

	$message = date("Y-m-d H:i:s") . " : " . implode(" ; ", array_map(function ($arg) {
		return is_object($arg) || is_array($arg) ? @print_r($arg, true) : $arg;
	}, $args)) . PHP_EOL;

	$dir = dirname(__DIR__, 1) . DIRECTORY_SEPARATOR . 'temp' . DIRECTORY_SEPARATOR;
	file_put_contents($dir . 'nuDebug.txt', $message, FILE_APPEND | LOCK_EX);

}

function nuID() {

	global $nuConfigDBUser;
	$i = uniqid();
	$s = md5($i);

	while ($i == uniqid()) {
	}

	$prefix = $nuConfigDBUser == 'nudev' ? 'nu' : '';
	return $prefix . uniqid() . $s[0] . $s[1];

}

function nuID_DEV() {

	global $nuConfigDBUser;

	$uniqueId = uniqid();
	$randomBytes = random_bytes(16);
	$hash = hash('sha256', $randomBytes);

	$prefix = $nuConfigDBUser == 'nudev' ? 'nu' : '';
	return $prefix . $uniqueId . substr($hash, 0, 2);

}

function nuQuotise($string, $char) {

	if (empty($string) || $string === null) {
		return;
	}

	if ($string[0] != $char) {
		$string = $char . $string;
	}

	if (substr($string, -1) != $char) {
		$string .= $char;
	}

	return $string;

}

function nuIdentColumn($s) {
	return !nuMSSQL() ? nuQuotise($s, '`') : "[$s]";
}

function nuTableInfoSQL() {
	return nuMSSQL() ? 'sp_columns ' : 'DESCRIBE ';
}

function nuDescribeTableSQL($table) {

	if (!nuMSSQL())
		return "DESCRIBE $table";

	return "
		SELECT
		   C.column_name AS [Field],
		   DATA_TYPE + CASE
						 WHEN CHARACTER_MAXIMUM_LENGTH IS NULL THEN ''
						 WHEN CHARACTER_MAXIMUM_LENGTH > 99999 THEN ''
						 ELSE '(' + Cast(CHARACTER_MAXIMUM_LENGTH AS VARCHAR(5)) + ')'
					   END AS [Type],
		   IS_NULLABLE AS [Null],
		   Case When CONSTRAINT_TYPE = 'PRIMARY KEY' THEN 'PRI' ELSE '' END as [Key]
		FROM
		   INFORMATION_SCHEMA.Columns C
		   JOIN
			  INFORMATION_SCHEMA.CONSTRAINT_COLUMN_USAGE U
			  ON U.TABLE_NAME = C.table_name
		   JOIN
			  INFORMATION_SCHEMA.TABLE_CONSTRAINTS T
			  ON U.CONSTRAINT_NAME = T.CONSTRAINT_NAME
		WHERE
		   C.table_name = '$table'
		   and C.TABLE_CATALOG = DB_NAME()
	";

}

function nuCreateTableFromSelect($tableName, $select, $params = [], $temporary = false) {

	if (!nuMSSQL()) {
		$query = sprintf(
			'CREATE' . ($temporary ? ' TEMPORARY' : '') . ' TABLE `%s` AS (%s)',
			$tableName,
			$select
		);
	} else {
		$pos = strrpos($select, 'FROM');
		$query = substr($select, 0, $pos) . ' INTO [' . $tableName . '] ' . substr($select, $pos);
	}

	return nuRunQuery($query, $params);

}

function nuSchemaWhereCurrentDBSQL() {
	return nuMSSQL() ? ' TABLE_CATALOG = db_name() ' : ' table_schema = DATABASE() ';
}

function nuMSSQL() {
	global $nuConfigDBType;
	return $nuConfigDBType == 'sqlsrv';
}