<?php

// Clone a nuBuilder application - IMPROVED DRY RUN MODE + CLEAR DATABASE OPTION + TABLE/VIEW FILTERING + SQL EXPORT
/*
numeric array $opts is used to determine what content is cloned
1 = CREATE statements for all nuBuilder system tables and views
2 = CREATE statements for all non-nuBuilder tables and views
3 = INSERT statements for all nuBuilder system records
4 = INSERT statements for all records in the zzzzsys tables which define the user's own application
5 = INSERT statements for all non-nuBuilder tables
6 = FUNCTIONS
7 = PROCEDURES
8 = TRIGGERS
9 = EVENTS
*/

declare(strict_types=1);

class nuBuilderCloner {
	private const int INSERT_BATCH_SIZE = 1000;
	private const array VALID_INSERT_TYPES = ['INSERT', 'INSERT IGNORE', 'REPLACE'];
	private const array VALID_CREATE_DATABASE_OPTIONS = ['create', 'fail', 'clear'];
	private const array VALID_FILE_MODE_OPTIONS = ['create', 'fail', 'clear', 'overwrite'];
	private const array VALID_SQL_EXPORT_FORMATS = ['mysql', 'mssql'];
	private const int PROGRESS_UPDATE_INTERVAL = 100;

	// Routine type metadata for unified processing
	private const array ROUTINE_META = [
		'FUNCTION' => [
			'show' => "SHOW FUNCTION STATUS WHERE Db = ?",
			'nameIdx' => 1,
			'showCreate' => "SHOW CREATE FUNCTION `%s`",
			'createIdx' => 2,
			'tableCol' => null,
			'drop' => "DROP FUNCTION IF EXISTS `%s`"
		],
		'PROCEDURE' => [
			'show' => "SHOW PROCEDURE STATUS WHERE Db = ?",
			'nameIdx' => 1,
			'showCreate' => "SHOW CREATE PROCEDURE `%s`",
			'createIdx' => 2,
			'tableCol' => null,
			'drop' => "DROP PROCEDURE IF EXISTS `%s`"
		],
		'TRIGGER' => [
			'show' => "SHOW TRIGGERS FROM `%DB%`",
			'nameIdx' => 'Trigger',
			'showCreate' => "SHOW CREATE TRIGGER `%s`",
			'createIdx' => 2,
			'tableCol' => 'Table',
			'drop' => "DROP TRIGGER IF EXISTS `%s`"
		],
		'EVENT' => [
			'show' => "SHOW EVENTS WHERE Db = ?",
			'nameIdx' => 'Name',
			'showCreate' => "SHOW CREATE EVENT `%s`",
			'createIdx' => 3,
			'tableCol' => null,
			'drop' => "DROP EVENT IF EXISTS `%s`"
		]
	];

	private ?string $srcDB;
	private ?PDO $targetPDO = null;
	private float $startTime;
	private int $srcRows = 0;
	private int $tgtRows = 0;
	private int $fileCount = 0;
	private array $config;
	private array $statistics = [];
	private $logHandle = null;
	private int $progressNr = 0;
	private bool $showProgress = false;
	private array $dryRunActions = [];

	public function __construct(array $config = [], ?string $srcDB = null) {
		$this->srcDB = $srcDB ?? $_SESSION['nubuilder_session_data']['DB_NAME'] ?? null;
		$this->config = array_merge([
			'showProgress' => true,
			'logFile' => null,
			'excludedFiles' => [''],
			'excludedDirs' => [],
			'dryRun' => false,
			'transactionMode' => false,
			'databaseMode' => 'fail',
			'databaseCollation' => 'utf8mb4_unicode_ci',
			'copyFiles' => true,
			'fileMode' => 'fail',
			'progressId' => null,
			'includeTablesAndViews' => [],
			'excludeTablesAndViews' => [],
			// New SQL export options
			'sqlExport' => [
				'enabled' => false,
				'format' => 'mysql',
				'includeDropStatements' => true,
				'includeCreateDatabase' => true,
				'includeUseDatabase' => true,
				'maxRowsPerInsert' => 1000,
				'addComments' => true,
				'disableConstraints' => true
			]
		], $config);

		if ($this->config['logFile']) {
			$this->initializeLogging();
		}

		$this->showProgress = $this->config['showProgress'] && !empty($this->config['progressId']);
	}

	public function __destruct() {
		if ($this->logHandle && is_resource($this->logHandle)) {
			fclose($this->logHandle);
		}
	}

	/**
	 * Export complete SQL statements for database recreation
	 */

	public function exportToSQL(
		string $targetDB,
		array $opts,
		string $insertType = 'INSERT',
		string $format = 'mysql'
	): string {
		try {
			$this->startTime = microtime(true);
			$format = $this->oneOf($format, self::VALID_SQL_EXPORT_FORMATS, 'SQL format');
			$insertType = $this->oneOf($insertType, self::VALID_INSERT_TYPES, 'Insert type');

			$this->log("Starting SQL export for database '$targetDB' in $format format...");

			$sql = [];
			$exportConfig = $this->config['sqlExport'];

			// Add header comments
			if ($exportConfig['addComments']) {
				$sql[] = $this->getSQLHeader($targetDB, $format);
			}

			// Add database creation
			if ($exportConfig['includeCreateDatabase']) {
				$sql[] = $this->getSQLCreateDatabase($targetDB, $format);
			}

			// Add USE database statement
			if ($exportConfig['includeUseDatabase']) {
				$sql[] = $this->getSQLUseDatabase($targetDB, $format);
			}

			// Disable constraints for faster loading
			if ($exportConfig['disableConstraints']) {
				$sql[] = $this->getSQLDisableConstraints($format);
			}

			// PHASE 1: Create database structure (tables and views)
			if (in_array(1, $opts)) {
				$sql[] = $this->getSQLComment("nuBuilder system tables and views", $format);
				$sql[] = $this->exportCreateTablesSQL("TABLE_NAME LIKE 'zzzzsys%'", $format, $exportConfig['includeDropStatements']);
				$sql[] = $this->exportCreateViewsSQL("TABLE_NAME LIKE 'zzzzsys%'", $format, $exportConfig['includeDropStatements']);
			}

			if (in_array(2, $opts)) {
				$sql[] = $this->getSQLComment("User tables and views", $format);
				$sql[] = $this->exportCreateTablesSQL("TABLE_NAME NOT LIKE 'zzzzsys%'", $format, $exportConfig['includeDropStatements']);
				$sql[] = $this->exportCreateViewsSQL("TABLE_NAME NOT LIKE 'zzzzsys%'", $format, $exportConfig['includeDropStatements']);
			}

			// PHASE 2: Insert data
			if (array_intersect([3, 4, 5], $opts) === [3, 4, 5]) {
				$sql[] = $this->getSQLComment("All table data", $format);
				$sql[] = $this->exportInsertSQL($insertType, "TRUE", "TRUE", $format);
			} else {
				if (in_array(3, $opts)) {
					$sql[] = $this->getSQLComment("nuBuilder system records", $format);
					$sql[] = $this->exportInsertSQL($insertType, "TABLE_NAME LIKE 'zzzzsys%'", "|t|_id LIKE 'nu%'", $format);
				}
				if (in_array(4, $opts)) {
					$sql[] = $this->getSQLComment("Application records", $format);
					$sql[] = $this->exportInsertSQL($insertType, "TABLE_NAME LIKE 'zzzzsys%'", "|t|_id NOT LIKE 'nu%'", $format);
				}
				if (in_array(5, $opts)) {
					$sql[] = $this->getSQLComment("User table data", $format);
					$sql[] = $this->exportInsertSQL($insertType, "(TABLE_NAME NOT LIKE 'zzzzsys%' AND TABLE_NAME NOT LIKE '___nu%')", "TRUE", $format);
				}
			}

			// PHASE 3: Database objects (functions, procedures, triggers, events)
			$objectTypes = [
				6 => ['type' => 'FUNCTION', 'desc' => 'Functions'],
				7 => ['type' => 'PROCEDURE', 'desc' => 'Procedures'],
				8 => ['type' => 'TRIGGER', 'desc' => 'Triggers'],
				9 => ['type' => 'EVENT', 'desc' => 'Events']
			];

			foreach ($objectTypes as $opt => $config) {
				if (in_array($opt, $opts)) {
					$sql[] = $this->getSQLComment($config['desc'], $format);
					$sql[] = $this->exportRoutineSQL($config['type'], $format, $exportConfig['includeDropStatements']);
				}
			}

			// Re-enable constraints
			if ($exportConfig['disableConstraints']) {
				$sql[] = $this->getSQLEnableConstraints($format);
			}

			// Add footer comments
			if ($exportConfig['addComments']) {
				$sql[] = $this->getSQLFooter($format);
			}

			$result = implode("\n", array_filter($sql));
			$this->log("SQL export completed. Generated " . strlen($result) . " characters of SQL.");

			return $result;

		} catch (Exception $e) {
			$this->log("ERROR during SQL export: " . $e->getMessage());
			throw $e;
		}
	}


	private function getSQLHeader(string $targetDB, string $format): string {
		$timestamp = date('Y-m-d H:i:s');
		$sourceDB = $this->srcDB;
		$comment = $format === 'mssql' ? '--' : '--';

		return "$comment ========================================\n" .
			"$comment nuBuilder Database Export\n" .
			"$comment Generated on: $timestamp\n" .
			"$comment Source Database: $sourceDB\n" .
			"$comment Target Database: $targetDB\n" .
			"$comment Format: $format\n" .
			"$comment ========================================\n\n";
	}

	private function getSQLFooter(string $format): string {
		$timestamp = date('Y-m-d H:i:s');
		$comment = $format === 'mssql' ? '--' : '--';

		return "\n$comment ========================================\n" .
			"$comment Export completed on: $timestamp\n" .
			"$comment ========================================\n";
	}

	private function getSQLComment(string $text, string $format): string {
		$comment = $format === 'mssql' ? '--' : '--';
		return "\n$comment " . str_repeat('=', 50) . "\n$comment $text\n$comment " . str_repeat('=', 50) . "\n";
	}

	private function getSQLCreateDatabase(string $targetDB, string $format): string {
		$charsetInfo = $this->getSourceDatabaseCharset();
		$charset = $charsetInfo['charset'] ?? 'utf8mb4';
		$collation = $charsetInfo['collation'] ?? $this->config['databaseCollation'];

		if ($format === 'mssql') {
			return "IF NOT EXISTS (SELECT name FROM master.dbo.sysdatabases WHERE name = N'$targetDB')\n" .
				"CREATE DATABASE [$targetDB]\n" .
				"COLLATE SQL_Latin1_General_CP1_CI_AS;\nGO\n";
		} else {
			return "CREATE DATABASE IF NOT EXISTS `$targetDB` CHARACTER SET $charset COLLATE $collation;\n";
		}
	}

	private function getSQLUseDatabase(string $targetDB, string $format): string {
		if ($format === 'mssql') {
			return "USE [$targetDB];\nGO\n";
		} else {
			return "USE `$targetDB`;\n";
		}
	}

	private function getSQLDisableConstraints(string $format): string {
		if ($format === 'mssql') {
			return "-- Disable constraints for faster loading\n" .
				"EXEC sp_MSforeachtable 'ALTER TABLE ? NOCHECK CONSTRAINT ALL';\n" .
				"GO\n";
		} else {
			return "-- Disable constraints for faster loading\n" .
				"SET FOREIGN_KEY_CHECKS = 0;\n" .
				"SET UNIQUE_CHECKS = 0;\n" .
				"SET AUTOCOMMIT = 0;\n";
		}
	}

	private function getSQLEnableConstraints(string $format): string {
		if ($format === 'mssql') {
			return "\n-- Re-enable constraints\n" .
				"EXEC sp_MSforeachtable 'ALTER TABLE ? CHECK CONSTRAINT ALL';\n" .
				"GO\n";
		} else {
			return "\n-- Re-enable constraints\n" .
				"COMMIT;\n" .
				"SET FOREIGN_KEY_CHECKS = 1;\n" .
				"SET UNIQUE_CHECKS = 1;\n" .
				"SET AUTOCOMMIT = 1;\n";
		}
	}

	private function exportCreateTablesSQL(string $where, string $format, bool $includeDrop): string {
		$tables = $this->getTableNames("SELECT TABLE_NAME FROM information_schema.TABLES WHERE ($where) AND (TABLE_TYPE='BASE TABLE' AND `TABLE_SCHEMA`= ?)");
		$sql = [];

		foreach ($tables as $table) {
			$stmt = nuRunQuery("SHOW CREATE TABLE `$table`");
			$create = db_fetch_row($stmt)[1];

			if ($format === 'mssql') {
				$create = $this->convertMySQLToMSSQL($create, $table);
			}

			if ($includeDrop) {
				if ($format === 'mssql') {
					$sql[] = "IF EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[$table]') AND type in (N'U'))";
					$sql[] = "DROP TABLE [$table];";
					$sql[] = "GO";
				} else {
					$sql[] = "DROP TABLE IF EXISTS `$table`;";
				}
			}

			$sql[] = $create . ($format === 'mssql' ? "\nGO" : ";");
		}

		return implode("\n", $sql);
	}

	private function exportCreateViewsSQL(string $where, string $format, bool $includeDrop): string {
		$views = $this->getViewsInDependencyOrder($where);
		$sql = [];

		foreach ($views as $view => $create) {
			if ($format === 'mssql') {
				$create = $this->convertMySQLViewToMSSQL($create, $view);
			}

			if ($includeDrop) {
				if ($format === 'mssql') {
					$sql[] = "IF EXISTS (SELECT * FROM sys.views WHERE object_id = OBJECT_ID(N'[$view]'))";
					$sql[] = "DROP VIEW [$view];";
					$sql[] = "GO";
				} else {
					$sql[] = "DROP VIEW IF EXISTS `$view`;";
				}
			}

			$sql[] = $create . ($format === 'mssql' ? "\nGO" : ";");
		}

		return implode("\n", $sql);
	}

	private function exportInsertSQL(string $insertType, string $tableWhere, string $rowWhere, string $format): string {
		$tables = $this->getTableNames("SELECT TABLE_NAME FROM information_schema.TABLES WHERE ($tableWhere) AND (TABLE_TYPE='BASE TABLE' AND `TABLE_SCHEMA`= ?)");
		$sql = [];

		foreach ($tables as $table) {
			$tableSQL = $this->exportTableInsertSQL($insertType, $table, str_replace("|t|", $table, $rowWhere), $format);
			if (!empty($tableSQL)) {
				$sql[] = $tableSQL;
			}
		}

		return implode("\n\n", $sql);
	}

	private function exportTableInsertSQL(string $insertType, string $table, string $rowWhere, string $format): string {
		$cols = db_field_names($table);
		$maxRows = $this->config['sqlExport']['maxRowsPerInsert'];

		$countStmt = nuRunQuery("SELECT COUNT(*) FROM `$table` WHERE $rowWhere");
		$totalRows = db_fetch_row($countStmt)[0];

		if ($totalRows == 0) {
			return "";
		}

		$sql = [];
		$sql[] = "-- Inserting $totalRows rows into table '$table'";

		$pkName = $this->getPrimaryKeyName($table);
		$orderClause = ($pkName === '') ? '' : "ORDER BY `$pkName`";

		$stmt = nuRunQuery("SELECT * FROM `$table` WHERE $rowWhere $orderClause");

		$rowCount = 0;
		$batch = [];

		if ($format === 'mssql') {
			$columnList = '([' . implode('], [', $cols) . '])';
			$tableName = "[$table]";
		} else {
			$columnList = '(`' . implode('`, `', $cols) . '`)';
			$tableName = "`$table`";
		}

		while ($row = db_fetch_row($stmt)) {
			$values = array_map(function ($col) use ($format) {
				if (is_null($col)) {
					return 'NULL';
				}
				return $this->formatValueForSQL($col, $format);
			}, $row);

			$batch[] = '(' . implode(', ', $values) . ')';
			$rowCount++;

			if ($rowCount % $maxRows === 0 || $rowCount === $totalRows) {
				$batchSQL = $this->formatInsertType($insertType, $format) . " INTO $tableName $columnList VALUES\n" .
					implode(",\n", $batch) .
					($format === 'mssql' ? ";\nGO" : ";");
				$sql[] = $batchSQL;
				$batch = [];
			}
		}

		return implode("\n\n", $sql);
	}

	private function exportRoutineSQL(string $type, string $format, bool $includeDrop): string {
		$meta = self::ROUTINE_META[$type];
		$sql = [];

		$showQuery = str_replace('%DB%', $this->srcDB, $meta['show']);
		$queryParams = ($type === 'TRIGGER') ? [] : [$this->srcDB];

		$stmt = nuRunQuery($showQuery, $queryParams);

		while ($row = is_string($meta['nameIdx']) ? db_fetch_array($stmt) : db_fetch_row($stmt)) {
			$name = is_string($meta['nameIdx']) ? $row[$meta['nameIdx']] : $row[$meta['nameIdx']];
			$table = $meta['tableCol'] ? $row[$meta['tableCol']] : null;

			if (!$this->shouldProcessRoutine($name, $table)) {
				continue;
			}

			try {
				$createStmt = nuRunQuery(sprintf($meta['showCreate'], $name));
				$create = db_fetch_row($createStmt)[$meta['createIdx']];
				$create = preg_replace("/CREATE[\s\S]+?$type/", "CREATE $type", $create, 1);

				if ($format === 'mssql') {
					$create = $this->convertMySQLRoutineToMSSQL($create, $type, $name);
				}

				if ($includeDrop) {
					if ($format === 'mssql') {
						$dropSQL = $this->getMSSQLDropStatement($type, $name);
					} else {
						$dropSQL = sprintf($meta['drop'], $name) . ";";
					}
					$sql[] = $dropSQL;
				}

				$sql[] = $create . ($format === 'mssql' ? "\nGO" : ";");

			} catch (Exception $e) {
				$sql[] = "-- WARNING: Failed to export $type '$name': " . $e->getMessage();
			}
		}

		return implode("\n\n", $sql);
	}

	private function formatInsertType(string $insertType, string $format): string {
		if ($format === 'mssql') {
			return match ($insertType) {
				'INSERT IGNORE' => 'INSERT',
				'REPLACE' => 'INSERT',
				default => $insertType
			};
		}
		return $insertType;
	}

	private function formatValueForSQL($value, string $format): string {
		if (is_null($value)) {
			return 'NULL';
		}

		// For SQL Server, be more careful about what we consider "numeric"
		if ($format === 'mssql') {
			// Only treat as numeric if it's actually a pure number
			if (is_numeric($value) && !is_string($value)) {
				return (string) $value;
			}
			// For string values that look numeric, still quote them to avoid type confusion
			return "N'" . str_replace("'", "''", (string) $value) . "'";
		} else {
			// MySQL behavior - be more permissive with numeric detection
			if (is_numeric($value)) {
				return (string) $value;
			}
			return nuDBQuote($value);
		}
	}

	private function convertMySQLToMSSQL(string $mysqlCreate, string $tableName): string {
		$mssqlCreate = $mysqlCreate;

		// Remove backticks
		$mssqlCreate = str_replace('`', '', $mssqlCreate);

		// Fix table name with proper brackets
		$mssqlCreate = preg_replace('/CREATE TABLE\s+(\w+)/', 'CREATE TABLE [$1]', $mssqlCreate);

		// Data type mappings - order matters! More specific types first
		$typeMap = [
			// Handle AUTO_INCREMENT patterns first
			'/\bINT\(\d+\)\s+AUTO_INCREMENT\b/i' => 'INT IDENTITY(1,1)',
			'/\bAUTO_INCREMENT\b/i' => 'IDENTITY(1,1)',

			// Text types - specific to general
			'/\bMEDIUMTEXT\b/i' => 'NVARCHAR(MAX)',
			'/\bLONGTEXT\b/i' => 'NVARCHAR(MAX)',
			'/\bTEXT\b/i' => 'NVARCHAR(MAX)',
			'/\bTINYTEXT\b/i' => 'NVARCHAR(255)',

			// Varchar types
			'/\bVARCHAR\(/i' => 'NVARCHAR(',
			'/\bCHAR\(/i' => 'NCHAR(',

			// Integer types with size specifications
			'/\bBIGINT\(\d+\)/i' => 'BIGINT',
			'/\bINT\(\d+\)/i' => 'INT',
			'/\bSMALLINT\(\d+\)/i' => 'SMALLINT',
			'/\bTINYINT\(\d+\)/i' => 'TINYINT',
			'/\bTINYINT\(1\)/i' => 'BIT',

			// Decimal types
			'/\bDECIMAL\(/i' => 'DECIMAL(',
			'/\bNUMERIC\(/i' => 'NUMERIC(',
			'/\bFLOAT\(/i' => 'FLOAT(',
			'/\bDOUBLE\b/i' => 'FLOAT',

			// Date/time types
			'/\bDATETIME\b/i' => 'DATETIME2',
			'/\bTIMESTAMP\b/i' => 'DATETIME2',
			'/\bDATE\b/i' => 'DATE',
			'/\bTIME\b/i' => 'TIME',
			'/\bYEAR\b/i' => 'SMALLINT',

			// Binary types
			'/\bBLOB\b/i' => 'VARBINARY(MAX)',
			'/\bMEDIUMBLOB\b/i' => 'VARBINARY(MAX)',
			'/\bLONGBLOB\b/i' => 'VARBINARY(MAX)',
			'/\bTINYBLOB\b/i' => 'VARBINARY(255)',
			'/\bBINARY\(/i' => 'BINARY(',
			'/\bVARBINARY\(/i' => 'VARBINARY(',

			// Boolean
			'/\bBOOLEAN\b/i' => 'BIT',

			// JSON (SQL Server 2016+)
			'/\bJSON\b/i' => 'NVARCHAR(MAX)'
		];

		// Apply replacements using preg_replace for better control
		foreach ($typeMap as $pattern => $replacement) {
			$mssqlCreate = preg_replace($pattern, $replacement, $mssqlCreate);
		}

		// Remove MySQL-specific clauses
		$mssqlCreate = preg_replace('/ENGINE=\w+/i', '', $mssqlCreate);
		$mssqlCreate = preg_replace('/DEFAULT CHARSET=\w+/i', '', $mssqlCreate);
		$mssqlCreate = preg_replace('/COLLATE=\w+/i', '', $mssqlCreate);

		// Remove MySQL column-level CHARACTER SET and COLLATE specifications
		$mssqlCreate = preg_replace('/\s+CHARACTER SET \w+/i', '', $mssqlCreate);
		$mssqlCreate = preg_replace('/\s+COLLATE \w+/i', '', $mssqlCreate);

		// Handle MySQL timestamp auto-update syntax
		$mssqlCreate = preg_replace('/\s+ON UPDATE CURRENT_TIMESTAMP/i', '', $mssqlCreate);
		$mssqlCreate = preg_replace('/DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP/i', 'DEFAULT GETDATE()', $mssqlCreate);
		$mssqlCreate = preg_replace('/DEFAULT CURRENT_TIMESTAMP/i', 'DEFAULT GETDATE()', $mssqlCreate);

		// Fix PRIMARY KEY constraint
		$mssqlCreate = preg_replace(
			'/PRIMARY KEY\s*\(([^)]+)\)/',
			'CONSTRAINT [PK_' . $tableName . '] PRIMARY KEY ($1)',
			$mssqlCreate
		);

		// Remove MySQL KEY definitions and collect them for separate CREATE INDEX statements
		$indexes = [];

		// Handle UNIQUE constraints with USING clause
		$mssqlCreate = preg_replace_callback(
			'/,?\s*UNIQUE\s+KEY\s+(\w+)\s*\(([^)]+)\)\s*USING\s+\w+/i',
			function ($matches) use (&$indexes, $tableName) {
				$indexName = $matches[1];
				$columns = $matches[2];
				$indexes[] = "CREATE UNIQUE INDEX [IX_{$tableName}_{$indexName}] ON [$tableName] ($columns);";
				return ''; // Remove from table definition
			},
			$mssqlCreate
		);

		// Handle regular UNIQUE constraints
		$mssqlCreate = preg_replace_callback(
			'/,?\s*UNIQUE\s+KEY\s+(\w+)\s*\(([^)]+)\)/',
			function ($matches) use (&$indexes, $tableName) {
				$indexName = $matches[1];
				$columns = $matches[2];
				$indexes[] = "CREATE UNIQUE INDEX [IX_{$tableName}_{$indexName}] ON [$tableName] ($columns);";
				return ''; // Remove from table definition
			},
			$mssqlCreate
		);

		// Handle orphaned UNIQUE USING BTREE (missing columns) - remove entirely
		$mssqlCreate = preg_replace('/,?\s*UNIQUE\s+USING\s+\w+\s*(?!\()/i', '', $mssqlCreate);

		// Handle regular KEY definitions
		$mssqlCreate = preg_replace_callback(
			'/,?\s*KEY\s+(\w+)\s*\(([^)]+)\)/',
			function ($matches) use (&$indexes, $tableName) {
				$indexName = $matches[1];
				$columns = $matches[2];
				$indexes[] = "CREATE INDEX [IX_{$tableName}_{$indexName}] ON [$tableName] ($columns);";
				return ''; // Remove from table definition
			},
			$mssqlCreate
		);

		// Clean up extra commas and whitespace
		$mssqlCreate = preg_replace('/,\s*,/', ',', $mssqlCreate);
		$mssqlCreate = preg_replace('/,\s*\)/', ')', $mssqlCreate);
		$mssqlCreate = preg_replace('/\s+/', ' ', $mssqlCreate);

		// Add the table creation and then the indexes
		$result = trim($mssqlCreate);
		if (!empty($indexes)) {
			$result .= "\nGO\n" . implode("\nGO\n", $indexes);
		}

		return $result;
	}

	private function convertMySQLViewToMSSQL(string $mysqlView, string $viewName): string {
		$mssqlView = str_replace('`', '', $mysqlView);
		$mssqlView = str_replace("`$this->srcDB`.", "", $mssqlView);

		// Fix view name with proper brackets
		$mssqlView = preg_replace('/CREATE VIEW\s+(\w+)/', 'CREATE VIEW [$1]', $mssqlView);

		return $mssqlView;
	}

	private function convertMySQLRoutineToMSSQL(string $mysqlRoutine, string $type, string $name): string {
		$mssqlRoutine = str_replace('`', '', $mysqlRoutine);

		// Basic MySQL to SQL Server syntax conversions
		switch ($type) {
			case 'FUNCTION':
				// SQL Server functions have different syntax
				$mssqlRoutine = str_replace('DELIMITER ;;', '', $mssqlRoutine);
				$mssqlRoutine = str_replace(';;', '', $mssqlRoutine);
				$mssqlRoutine = preg_replace('/CREATE FUNCTION\s+(\w+)/', 'CREATE FUNCTION [$1]', $mssqlRoutine);
				break;

			case 'PROCEDURE':
				$mssqlRoutine = str_replace('DELIMITER ;;', '', $mssqlRoutine);
				$mssqlRoutine = str_replace(';;', '', $mssqlRoutine);
				$mssqlRoutine = preg_replace('/CREATE PROCEDURE\s+(\w+)/', 'CREATE PROCEDURE [$1]', $mssqlRoutine);
				break;

			case 'TRIGGER':
				$mssqlRoutine = preg_replace('/CREATE TRIGGER\s+(\w+)/', 'CREATE TRIGGER [$1]', $mssqlRoutine);
				break;
		}

		return $mssqlRoutine;
	}

	private function getMSSQLDropStatement(string $type, string $name): string {
		return match ($type) {
			'FUNCTION' => "IF EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[$name]') AND type in (N'FN', N'IF', N'TF', N'FS', N'FT'))\nDROP FUNCTION [$name];\nGO",
			'PROCEDURE' => "IF EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[$name]') AND type in (N'P', N'PC'))\nDROP PROCEDURE [$name];\nGO",
			'TRIGGER' => "IF EXISTS (SELECT * FROM sys.triggers WHERE object_id = OBJECT_ID(N'[$name]'))\nDROP TRIGGER [$name];\nGO",
			'EVENT' => "-- Events are not directly supported in MSSQL (use SQL Server Agent Jobs instead)\n-- DROP EVENT [$name];",
			default => "-- Unknown routine type: $type"
		};
	}

	public function cloneDatabase(
		string $targetDB,
		string $targetHost,
		string $targetUsername,
		string $targetPassword,
		string $targetCharset,
		int $targetPort,
		array $opts,
		string $insertType,
		string $sourcePath,
		string $targetPath
	): bool {
		try {
			$this->startTime = microtime(true);
			$this->log("Starting clone operation...");

			if (!$this->validateInputs($targetDB, $opts, $insertType, $sourcePath, $targetPath)) {
				return false;
			}

			if ($this->config['dryRun']) {
				$this->log("DRY RUN MODE - No changes will be made");
				$this->dryRunActions = [];
			}

			if (!$this->handleDatabaseCreation($targetHost, $targetDB, $targetUsername, $targetPassword, $targetCharset, $targetPort)) {
				return false;
			}

			if (!$this->config['dryRun'] || $this->databaseExists($targetHost, $targetDB, $targetUsername, $targetPassword, $targetCharset, $targetPort)) {
				if (!$this->testConnection($targetHost, $targetDB, $targetUsername, $targetPassword, $targetCharset, $targetPort)) {
					return false;
				}

				if (!$this->config['dryRun']) {
					$this->targetPDO = $this->createPDOConnection($targetHost, $targetDB, $targetUsername, $targetPassword, $targetCharset, $targetPort);
					$this->executeSQL("SET FOREIGN_KEY_CHECKS = 0; SET UNIQUE_CHECKS = 0; SET AUTOCOMMIT = 0;");
				}
			}

			if ($this->config['databaseMode'] === 'clear') {
				$this->clearTargetDatabase($targetDB);
			}

			$this->processCloneOperations($opts, $insertType);

			if (!$this->config['dryRun']) {
				$this->compareRecordCounts($targetDB);
				$this->executeSQL("COMMIT; SET FOREIGN_KEY_CHECKS = 1; SET UNIQUE_CHECKS = 1; SET AUTOCOMMIT = 1;");
			}

			if ($this->config['copyFiles']) {
				if (!$this->handleFileCopying($sourcePath, $targetPath, $targetHost, $targetDB, $targetPort, $targetUsername, $targetPassword, $targetCharset)) {
					return false;
				}
			} else {
				$this->log("File copying skipped (copyFiles is disabled)");
				if ($this->config['dryRun']) {
					$this->dry("File copying would be skipped (copyFiles is disabled)");
				}
			}

			$this->sendSuccessMessage($targetDB, $sourcePath, $targetPath);
			return true;
		} catch (Exception $e) {
			$this->log("ERROR: " . $e->getMessage());
			if ($this->targetPDO && $this->config['transactionMode']) {
				$this->targetPDO->rollBack();
			}
			$this->sendError('Cloning failed: ' . $e->getMessage());
			return false;
		} finally {
			$this->targetPDO = null;
		}
	}

	private function processCloneOperations(array $opts, string $insertType, string $targetFormat = 'mysql'): void {
		if (in_array(1, $opts)) {
			$this->runStep(fn() => $this->cloneDBCreateSQL("TABLE_NAME LIKE 'zzzzsys%'"), "Creating nuBuilder system tables", 'tables_created');
			$this->runStep(fn() => $this->cloneDBViewsSQL("TABLE_NAME LIKE 'zzzzsys%'"), "Creating nuBuilder system views", 'views_created');
		}

		if (in_array(2, $opts)) {
			$this->runStep(fn() => $this->cloneDBCreateSQL("TABLE_NAME NOT LIKE 'zzzzsys%'"), "Creating user tables", 'tables_created');
			$this->runStep(fn() => $this->cloneDBViewsSQL("TABLE_NAME NOT LIKE 'zzzzsys%'"), "Creating user views", 'views_created');
		}

		if (array_intersect([3, 4, 5], $opts) === [3, 4, 5]) {
			$this->runStep(fn() => $this->cloneDBInsertSQL($insertType, "TRUE", "TRUE", $targetFormat), "Cloning all table data", 'rows_copied');
		} else {
			if (in_array(3, $opts)) {
				$this->runStep(fn() => $this->cloneDBInsertSQL($insertType, "TABLE_NAME LIKE 'zzzzsys%'", "|t|_id LIKE 'nu%'", $targetFormat), "Cloning nuBuilder system records", 'rows_copied');
			}
			if (in_array(4, $opts)) {
				$this->runStep(fn() => $this->cloneDBInsertSQL($insertType, "TABLE_NAME LIKE 'zzzzsys%'", "|t|_id NOT LIKE 'nu%'", $targetFormat), "Cloning application records", 'rows_copied');
			}
			if (in_array(5, $opts)) {
				$this->runStep(fn() => $this->cloneDBInsertSQL($insertType, "(TABLE_NAME NOT LIKE 'zzzzsys%' AND TABLE_NAME NOT LIKE '___nu%')", "TRUE", $targetFormat), "Cloning user table data", 'rows_copied');
			}
		}

		$dependentOperations = [
			6 => ['method' => 'cloneFunctions', 'desc' => 'functions', 'stat' => 'functions'],
			7 => ['method' => 'cloneProcedures', 'desc' => 'procedures', 'stat' => 'procedures'],
			8 => ['method' => 'cloneTriggers', 'desc' => 'triggers', 'stat' => 'triggers'],
			9 => ['method' => 'cloneEvents', 'desc' => 'events', 'stat' => 'events']
		];

		foreach ($dependentOperations as $opt => $config) {
			if (in_array($opt, $opts)) {
				$this->runStep(fn() => $this->{$config['method']}(), "Cloning {$config['desc']}", $config['stat']);
			}
		}
	}


	// Helper methods continue below...
	private function initializeLogging(): void {
		$logFile = $this->config['logFile'];
		$logDir = dirname($logFile);

		if (!is_dir($logDir)) {
			if (!mkdir($logDir, 0755, true)) {
				$this->sendError("Cannot create log directory: $logDir");
				return;
			}
		}

		$this->logHandle = @fopen($logFile, 'a');
		if (!$this->logHandle) {
			$this->sendError("Cannot open log file: $logFile");
		} else {
			$this->log("=== Clone operation started ===");
		}
	}

	private function dry(string $action, ?string $sql = null): void {
		$this->dryRunActions[] = $action;
		if ($sql !== null) {
			$this->log("Would execute: " . substr($sql, 0, 100) . (strlen($sql) > 100 ? '...' : ''));
		} else {
			$this->log($action);
		}
	}

	private function execOrDry(string $sql, ?string $action = null): void {
		if ($this->config['dryRun']) {
			$this->dry($action ?? "Would execute SQL", $sql);
			return;
		}
		$this->executeSQL($sql);
	}

	private function oneOf(string $value, array $allowed, string $label): string {
		if (!in_array($value, $allowed, true)) {
			throw new InvalidArgumentException("$label must be one of: " . implode(', ', $allowed));
		}
		return $value;
	}

	private function filterTablesAndViews(array $tableNames): array {
		$includeMap = array_flip($this->config['includeTablesAndViews']);
		$excludeMap = array_flip($this->config['excludeTablesAndViews']);

		if ($includeMap) {
			$this->log("Include filter active: " . implode(', ', array_keys($includeMap)));
		}
		if ($excludeMap) {
			$this->log("Exclude filter active: " . implode(', ', array_keys($excludeMap)));
		}

		$filtered = [];
		$skipped = [];

		foreach ($tableNames as $tableName) {
			if (str_starts_with($tableName, 'zzzzsys_')) {
				$filtered[] = $tableName;
				continue;
			}

			if ($includeMap && !isset($includeMap[$tableName])) {
				$skipped[] = "$tableName (not in include list)";
				continue;
			}

			if (isset($excludeMap[$tableName])) {
				$skipped[] = "$tableName (in exclude list)";
				continue;
			}

			$filtered[] = $tableName;
		}

		if ($skipped) {
			$this->log("Filtered out " . count($skipped) . " tables/views: " . implode(', ', array_slice($skipped, 0, 10)) . (count($skipped) > 10 ? " and " . (count($skipped) - 10) . " more..." : ""));
		}

		if ($filtered) {
			$this->log("Including " . count($filtered) . " tables/views: " . implode(', ', array_slice($filtered, 0, 10)) . (count($filtered) > 10 ? " and " . (count($filtered) - 10) . " more..." : ""));
		}

		return $filtered;
	}

	private function runStep(callable $fn, string $desc, ?string $statKey = null): void {
		$this->showProgress("$desc...");
		$before = $statKey ? ($this->statistics[$statKey] ?? 0) : 0;
		$fn();
		$after = $statKey ? ($this->statistics[$statKey] ?? 0) : 0;
		$delta = max(0, $after - $before);
		$this->showProgress("Completed ($delta)", $delta, true);
	}

	private function handleFileCopying(string $sourcePath, string $targetPath, string $targetHost, string $targetDB, int $targetPort, string $targetUsername, string $targetPassword, string $targetCharset): bool {
		$exists = is_dir($targetPath);
		$mode = $this->config['fileMode'];

		$announce = function (string $msg) {
			$this->log($msg);
			if ($this->config['dryRun'])
				$this->dry($msg);
		};

		if ($mode === 'fail' && $exists) {
			$this->sendError("Target directory '$targetPath' already exists. File copying aborted (fileMode = 'fail').");
			return false;
		}

		if ($mode === 'clear' && $exists) {
			$announce("Target directory '$targetPath' exists and will be cleared");
			if (!$this->config['dryRun'] && !$this->clearTargetDirectory($targetPath)) {
				return false;
			}
		}

		if ($mode === 'overwrite' && $exists) {
			$announce("Target directory '$targetPath' exists. Files will be overwritten during copy.");
		}

		if (!$exists) {
			$announce("Target directory '$targetPath' will be created");
		}

		$folderCopied = $this->copyFolderContents($sourcePath, $targetPath);

		if ($folderCopied || $this->config['dryRun']) {
			$charsetInfo = $this->getSourceDatabaseCharset();
			$dbCharset = $charsetInfo['charset'] ?? $targetCharset;
			$dbCollation = $charsetInfo['collation'] ?? $this->config['databaseCollation'];

			$configUpdates = [
				'nuConfigDBHost' => $targetHost,
				'nuConfigDBName' => $targetDB,
				'nuConfigDBPort' => $targetPort,
				'nuConfigDBUser' => $targetUsername,
				'nuConfigDBPassword' => $targetPassword,
				'nuConfigDBCharacterSet' => $dbCharset,
				'nuConfigDBCollate' => $dbCollation
			];

			$this->updateConfigFile($targetPath . '/nuconfig.php', $configUpdates);
		}

		return true;
	}

	private function clearTargetDirectory(string $targetPath): bool {
		if ($this->config['dryRun']) {
			$this->dry("Would clear all contents from directory '$targetPath'");
			$this->simulateClearDirectory($targetPath);
			return true;
		}

		try {
			$this->showProgress("Clearing target directory...");
			$clearedCount = $this->recursiveDelete($targetPath, false);
			$this->statistics['files_cleared'] = $clearedCount;
			$this->log("Cleared $clearedCount files/directories from '$targetPath'");
			$this->showProgress("Directory cleared ($clearedCount items)", $clearedCount, true);
			return true;
		} catch (Exception $e) {
			$this->sendError("Failed to clear target directory: " . $e->getMessage());
			return false;
		}
	}

	private function clearTargetDatabase(string $targetDB): void {
		$this->showProgress("Clearing target database...");
		$this->log("Clearing target database '$targetDB'" . ($this->config['dryRun'] ? " (dry run)" : ""));

		if ($this->config['dryRun']) {
			$this->dry("Clear all existing database objects from '$targetDB'");
			$this->simulateClearDatabase();
			$this->showProgress("Database clear simulation completed", 0, true);
			return;
		}

		$cleared = [
			'events' => 0,
			'triggers' => 0,
			'procedures' => 0,
			'functions' => 0,
			'views' => 0,
			'tables' => 0
		];

		try {
			$cleared['events'] = $this->dropAllEvents();
			$cleared['triggers'] = $this->dropAllTriggers();
			$cleared['procedures'] = $this->dropAllProcedures();
			$cleared['functions'] = $this->dropAllFunctions();
			$cleared['views'] = $this->dropAllViews();
			$cleared['tables'] = $this->dropAllTables();

			$totalCleared = array_sum($cleared);
			$this->log("Database cleared: " . json_encode($cleared));
			$this->statistics['objects_cleared'] = $cleared;
			$this->showProgress("Database cleared ($totalCleared objects)", $totalCleared, true);

		} catch (Exception $e) {
			throw new Exception("Failed to clear database: " . $e->getMessage());
		}
	}

	private function simulateClearDatabase(): void {
		$objects = [
			'events' => $this->countTargetObjects('events'),
			'triggers' => $this->countTargetObjects('triggers'),
			'procedures' => $this->countTargetObjects('procedures'),
			'functions' => $this->countTargetObjects('functions'),
			'views' => $this->countTargetObjects('views'),
			'tables' => $this->countTargetObjects('tables')
		];

		foreach ($objects as $type => $count) {
			if ($count > 0) {
				$this->dry("Would drop $count $type");
			}
		}

		$this->statistics['objects_cleared'] = $objects;
	}

	private function countTargetObjects(string $type): int {
		if ($this->config['dryRun'] && !$this->targetPDO) {
			return 0;
		}

		try {
			switch ($type) {
				case 'events':
					$stmt = $this->targetPDO->query("SELECT COUNT(*) FROM INFORMATION_SCHEMA.EVENTS WHERE EVENT_SCHEMA = DATABASE()");
					break;
				case 'triggers':
					$stmt = $this->targetPDO->query("SELECT COUNT(*) FROM INFORMATION_SCHEMA.TRIGGERS WHERE TRIGGER_SCHEMA = DATABASE()");
					break;
				case 'procedures':
					$stmt = $this->targetPDO->query("SELECT COUNT(*) FROM INFORMATION_SCHEMA.ROUTINES WHERE ROUTINE_SCHEMA = DATABASE() AND ROUTINE_TYPE = 'PROCEDURE'");
					break;
				case 'functions':
					$stmt = $this->targetPDO->query("SELECT COUNT(*) FROM INFORMATION_SCHEMA.ROUTINES WHERE ROUTINE_SCHEMA = DATABASE() AND ROUTINE_TYPE = 'FUNCTION'");
					break;
				case 'views':
					$stmt = $this->targetPDO->query("SELECT COUNT(*) FROM INFORMATION_SCHEMA.VIEWS WHERE TABLE_SCHEMA = DATABASE()");
					break;
				case 'tables':
					$stmt = $this->targetPDO->query("SELECT COUNT(*) FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = DATABASE() AND TABLE_TYPE = 'BASE TABLE'");
					break;
				default:
					return 0;
			}
			return (int) $stmt->fetch()[0];
		} catch (Exception $e) {
			$this->log("Warning: Could not count $type: " . $e->getMessage());
			return 0;
		}
	}

	private function dropInfoSchemaObjects(string $sqlSelect, callable $dropper): int {
		$count = 0;
		foreach ($this->targetPDO->query($sqlSelect) as $row) {
			try {
				$dropper($row);
				$count++;
			} catch (Throwable $e) {
				$this->log("Warning: Could not drop object: " . $e->getMessage());
			}
		}
		return $count;
	}

	private function dropAllEvents(): int {
		return $this->dropInfoSchemaObjects(
			"SELECT EVENT_NAME AS n FROM INFORMATION_SCHEMA.EVENTS WHERE EVENT_SCHEMA = DATABASE()",
			fn($r) => $this->executeSQL("DROP EVENT IF EXISTS `{$r['n']}`")
		);
	}

	private function dropAllTriggers(): int {
		return $this->dropInfoSchemaObjects(
			"SELECT TRIGGER_NAME AS n FROM INFORMATION_SCHEMA.TRIGGERS WHERE TRIGGER_SCHEMA = DATABASE()",
			fn($r) => $this->executeSQL("DROP TRIGGER IF EXISTS `{$r['n']}`")
		);
	}

	private function dropAllProcedures(): int {
		return $this->dropInfoSchemaObjects(
			"SELECT ROUTINE_NAME AS n FROM INFORMATION_SCHEMA.ROUTINES WHERE ROUTINE_SCHEMA = DATABASE() AND ROUTINE_TYPE = 'PROCEDURE'",
			fn($r) => $this->executeSQL("DROP PROCEDURE IF EXISTS `{$r['n']}`")
		);
	}

	private function dropAllFunctions(): int {
		return $this->dropInfoSchemaObjects(
			"SELECT ROUTINE_NAME AS n FROM INFORMATION_SCHEMA.ROUTINES WHERE ROUTINE_SCHEMA = DATABASE() AND ROUTINE_TYPE = 'FUNCTION'",
			fn($r) => $this->executeSQL("DROP FUNCTION IF EXISTS `{$r['n']}`")
		);
	}

	private function dropAllViews(): int {
		$count = 0;
		$views = [];
		$stmt = $this->targetPDO->query("SELECT TABLE_NAME FROM INFORMATION_SCHEMA.VIEWS WHERE TABLE_SCHEMA = DATABASE()");
		while ($row = $stmt->fetch()) {
			$views[] = $row[0];
		}

		$maxAttempts = count($views) + 1;
		$attempt = 0;

		while (!empty($views) && $attempt < $maxAttempts) {
			$attempt++;
			$droppedThisRound = [];

			foreach ($views as $index => $viewName) {
				try {
					$this->executeSQL("DROP VIEW IF EXISTS `$viewName`");
					$droppedThisRound[] = $index;
					$count++;
				} catch (Exception $e) {
					if ($attempt == $maxAttempts) {
						$this->log("Warning: Could not drop view '$viewName': " . $e->getMessage());
					}
				}
			}

			foreach (array_reverse($droppedThisRound) as $index) {
				unset($views[$index]);
			}

			if (empty($droppedThisRound) && !empty($views)) {
				foreach ($views as $viewName) {
					try {
						$this->executeSQL("DROP VIEW `$viewName`");
						$count++;
					} catch (Exception $e) {
						$this->log("Warning: Could not force drop view '$viewName': " . $e->getMessage());
					}
				}
				break;
			}
		}

		return $count;
	}

	private function dropAllTables(): int {
		$count = 0;
		$this->executeSQL("SET FOREIGN_KEY_CHECKS = 0");

		try {
			$stmt = $this->targetPDO->query("SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = DATABASE() AND TABLE_TYPE = 'BASE TABLE'");
			while ($row = $stmt->fetch()) {
				$tableName = $row[0];
				$this->executeSQL("DROP TABLE IF EXISTS `$tableName`");
				$count++;
			}
		} finally {
			$this->executeSQL("SET FOREIGN_KEY_CHECKS = 1");
		}

		return $count;
	}

	private function databaseExists(string $host, string $db, string $usr, string $pwd, string $charset, int $port): bool {
		try {
			$dsn = "mysql:host=$host;charset=$charset;port=$port";
			$pdo = new PDO($dsn, $usr, $pwd, [
				PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
				PDO::ATTR_EMULATE_PREPARES => false
			]);

			$stmt = $pdo->query("SELECT SCHEMA_NAME FROM INFORMATION_SCHEMA.SCHEMATA WHERE SCHEMA_NAME = " . $pdo->quote($db));
			$exists = $stmt->fetch() !== false;
			$pdo = null;
			return $exists;
		} catch (PDOException $e) {
			$this->log("Warning: Could not check if database exists: " . $e->getMessage());
			return false;
		}
	}

	private function testConnection(string $host, string $db, string $usr, string $pwd, string $charset, int $port): bool {
		try {
			$testPDO = $this->createPDOConnection($host, $db, $usr, $pwd, $charset, $port);
			$testPDO = null;
			return true;
		} catch (PDOException $e) {
			$this->sendError("Cannot connect to target database: " . $e->getMessage());
			return false;
		}
	}

	private function getSourceDatabaseCharset(): array {
		try {
			$stmt = nuRunQuery("SELECT DEFAULT_CHARACTER_SET_NAME, DEFAULT_COLLATION_NAME FROM INFORMATION_SCHEMA.SCHEMATA WHERE SCHEMA_NAME = ?", [$this->srcDB]);
			if ($row = db_fetch_row($stmt)) {
				return [
					'charset' => $row[0],
					'collation' => $row[1]
				];
			}
		} catch (Exception $e) {
			$this->log("Could not determine source database charset: " . $e->getMessage());
		}

		return [];
	}

	private function validateInputs(string $targetDB, array $opts, string $insertType, string $sourcePath, string $targetPath): bool {
		if (empty($this->srcDB)) {
			return $this->sendError('Source database not specified.');
		}

		if ($targetDB === $this->srcDB) {
			return $this->sendError('The target database cannot be the same as the source database.');
		}

		$this->oneOf($insertType, self::VALID_INSERT_TYPES, 'Insert type');
		$this->oneOf($this->config['databaseMode'], self::VALID_CREATE_DATABASE_OPTIONS, 'Database mode');
		$this->oneOf($this->config['fileMode'], self::VALID_FILE_MODE_OPTIONS, 'File mode');

		if ($this->config['sqlExport']['enabled']) {
			$this->oneOf($this->config['sqlExport']['format'], self::VALID_SQL_EXPORT_FORMATS, 'SQL export format');
		}

		$validOpts = [1, 2, 3, 4, 5, 6, 7, 8, 9];
		if (array_diff($opts, $validOpts)) {
			return $this->sendError('Invalid table insert options provided (Must be one or more of 1,2,3,4,5,6,7,8,9)');
		}

		if (!is_dir($sourcePath)) {
			return $this->sendError('Source path does not exist: ' . $sourcePath);
		}

		if ($this->config['copyFiles'] && ($sourcePath == $targetPath || realpath($targetPath) == realpath('..'))) {
			return $this->sendError('The target folder cannot be the same as the source folder.');
		}

		if (!is_array($this->config['includeTablesAndViews'])) {
			return $this->sendError('includeTablesAndViews must be an array.');
		}

		if (!is_array($this->config['excludeTablesAndViews'])) {
			return $this->sendError('excludeTablesAndViews must be an array.');
		}

		return true;
	}

	private function createPDOConnection(string $host, string $db, string $usr, string $pwd, string $charset, int $port): PDO {
		$dsn = "mysql:host=$host;dbname=$db;charset=$charset;port=$port";
		return new PDO($dsn, $usr, $pwd, [
			PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
			PDO::ATTR_EMULATE_PREPARES => false,
			PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_NUM
		]);
	}

	private function cloneRoutine(string $type): void {
		$meta = self::ROUTINE_META[$type];
		$count = 0;
		$failedRoutines = [];

		$showQuery = str_replace('%DB%', $this->srcDB, $meta['show']);
		$queryParams = ($type === 'TRIGGER') ? [] : [$this->srcDB];

		$stmt = nuRunQuery($showQuery, $queryParams);

		while ($row = is_string($meta['nameIdx']) ? db_fetch_array($stmt) : db_fetch_row($stmt)) {
			$name = is_string($meta['nameIdx']) ? $row[$meta['nameIdx']] : $row[$meta['nameIdx']];
			$table = $meta['tableCol'] ? $row[$meta['tableCol']] : null;

			if (!$this->shouldProcessRoutine($name, $table)) {
				continue;
			}

			try {
				$createStmt = nuRunQuery(sprintf($meta['showCreate'], $name));
				$create = db_fetch_row($createStmt)[$meta['createIdx']];
				$create = preg_replace("/CREATE[\s\S]+?$type/", "CREATE $type", $create, 1);

				$this->execOrDry(sprintf($meta['drop'], $name), "Drop $type: $name" . ($table ? " (table: $table)" : ""));
				$this->execOrDry($create, "Create $type: $name" . ($table ? " (table: $table)" : ""));
				$count++;
			} catch (Exception $e) {
				$failedRoutines[] = "$name" . ($table ? " (table: $table)" : "") . " - " . $e->getMessage();
				$this->log("WARNING: Failed to clone $type '$name': " . $e->getMessage());
			}
		}

		$this->statistics[strtolower($type) . 's'] = $count;

		$message = "Cloned $count {$type}(s)" . ($this->config['dryRun'] ? " (dry run)" : "");
		if (!empty($failedRoutines)) {
			$message .= " (" . count($failedRoutines) . " failed)";
			$this->log("Failed $type(s): " . implode(', ', array_slice($failedRoutines, 0, 3)) .
				(count($failedRoutines) > 3 ? " and " . (count($failedRoutines) - 3) . " more..." : ""));
		}

		$this->log($message);
	}

	private function cloneFunctions(): void {
		$this->cloneRoutine('FUNCTION');
	}

	private function cloneProcedures(): void {
		$this->cloneRoutine('PROCEDURE');
	}

	private function cloneTriggers(): void {
		$this->cloneRoutine('TRIGGER');
	}

	private function cloneEvents(): void {
		$this->cloneRoutine('EVENT');
	}

	private function shouldProcessRoutine(string $routineName, string $tableName = null): bool {
		if (empty($this->config['includeTablesAndViews']) && empty($this->config['excludeTablesAndViews'])) {
			return true;
		}

		if ($tableName !== null) {
			$includeList = $this->config['includeTablesAndViews'];
			$excludeList = $this->config['excludeTablesAndViews'];

			if (!empty($includeList) && !in_array($tableName, $includeList, true)) {
				return false;
			}

			if (in_array($tableName, $excludeList, true)) {
				return false;
			}
		}

		return true;
	}

	private function getTableNames(string $sql): array {
		$tables = [];
		$stmt = nuRunQuery($sql, [$this->srcDB]);
		while ($row = db_fetch_row($stmt)) {
			$tables[] = $row[0];
		}

		return $this->filterTablesAndViews($tables);
	}

	private function cloneDBCreateSQL(string $where): void {
		$tables = $this->getTableNames("SELECT TABLE_NAME FROM information_schema.TABLES WHERE ($where) AND (TABLE_TYPE='BASE TABLE' AND `TABLE_SCHEMA`= ?)");
		$count = 0;

		foreach ($tables as $table) {
			$stmt = nuRunQuery("SHOW CREATE TABLE `$table`");
			$create = db_fetch_row($stmt)[1];

			$this->execOrDry("DROP TABLE IF EXISTS `$table`", "Drop table: $table");
			$this->execOrDry($create, "Create table: $table");
			$count++;
		}

		$this->statistics['tables_created'] = ($this->statistics['tables_created'] ?? 0) + $count;
		$this->log("Created $count table(s)" . ($this->config['dryRun'] ? " (dry run)" : ""));
	}

	private function cloneDBInsertSQL(string $insertType, string $tableWhere, string $rowWhere, string $format = 'mysql'): void {
		$tables = $this->getTableNames("SELECT TABLE_NAME FROM information_schema.TABLES WHERE ($tableWhere) AND (TABLE_TYPE='BASE TABLE' AND `TABLE_SCHEMA`= ?)");

		foreach ($tables as $table) {
			$this->cloneDBTableInserts($insertType, $table, str_replace("|t|", $table, $rowWhere), $format);
		}
	}

	private function cloneDBTableInserts(string $insertType, string $table, string $rowWhere, string $format = 'mysql'): void {
		$cols = db_field_names($table);
		$columnList = '(`' . implode('`,`', $cols) . '`)';
		$pkName = $this->getPrimaryKeyName($table);
		$orderClause = ($pkName === '') ? '' : "ORDER BY `$pkName`";

		$countStmt = nuRunQuery("SELECT COUNT(*) FROM `$table` WHERE $rowWhere");
		$totalRows = db_fetch_row($countStmt)[0];

		if ($totalRows == 0) {
			$this->log("Table '$table' has no rows to copy");
			return;
		}

		$this->log("Copying $totalRows row(s) from table '$table'" . ($this->config['dryRun'] ? " (dry run)" : ""));

		if ($this->config['dryRun']) {
			$this->dry("Copy $totalRows rows to table: $table using $insertType");
			$this->statistics['rows_copied'] = ($this->statistics['rows_copied'] ?? 0) + $totalRows;
			return;
		}

		$stmt = nuRunQuery("SELECT * FROM `$table` WHERE $rowWhere $orderClause");

		// Get column information for SQL Server strict formatting
		$columnInfo = [];
		if ($format === 'mssql') {
			$columnInfo = $this->getColumnInfo($table);
		}

		$this->executeSQL("ALTER TABLE `$table` DISABLE KEYS");

		$rowCount = 0;
		$batch = [];

		while ($row = db_fetch_row($stmt)) {
			$values = [];

			if ($format === 'mssql') {
				// Use SQL Server strict formatting with column type awareness
				for ($i = 0; $i < count($row); $i++) {
					$colName = $cols[$i];
					$colInfo = $columnInfo[$colName] ?? null;
					$values[] = $this->formatValueForSQLServerStrict($row[$i], $colInfo, $colName);
				}
			} else {
				// Use MySQL formatting (original behavior)
				$values = array_map(fn($col) => is_null($col) ? 'NULL' : nuDBQuote($col), $row);
			}

			$batch[] = '(' . implode(',', $values) . ')';
			$rowCount++;

			if ($rowCount % self::INSERT_BATCH_SIZE === 0) {
				$this->executeBatchInsert($insertType, $table, $columnList, $batch, $format);
				$batch = [];
			}
		}

		if (!empty($batch)) {
			$this->executeBatchInsert($insertType, $table, $columnList, $batch, $format);
		}

		$this->executeSQL("ALTER TABLE `$table` ENABLE KEYS");
		$this->statistics['rows_copied'] = ($this->statistics['rows_copied'] ?? 0) + $rowCount;
	}

	private function executeBatchInsert(string $insertType, string $table, string $columnList, array $batch, string $format = 'mysql'): void {
		if ($format === 'mssql') {
			// Convert to SQL Server format
			$mssqlColumnList = str_replace('`', '', $columnList);
			$mssqlColumnList = str_replace('(', '([', $mssqlColumnList);
			$mssqlColumnList = str_replace(',', '], [', $mssqlColumnList);
			$mssqlColumnList = str_replace(')', '])', $mssqlColumnList);
			$mssqlTableName = "[$table]";

			$sql = "$insertType INTO $mssqlTableName $mssqlColumnList VALUES " . implode(',', $batch);
		} else {
			$sql = "$insertType INTO `$table` $columnList VALUES " . implode(',', $batch);
		}

		$this->executeSQL($sql);
	}



	private function formatValueForSQLServerStrict($value, ?array $colInfo, string $colName): string {
		// Handle NULL values (including string representations of NULL)
		if (is_null($value) || $value === '' ||
			strtolower(trim((string) $value)) === 'null' ||
			strtolower(trim((string) $value)) === 'nil') {
			return 'NULL';
		}

		// Determine if this is definitely a numeric column
		$isNumericColumn = false;

		// Check column type info if available
		if ($colInfo && isset($colInfo['type'])) {
			$numericTypes = ['int', 'integer', 'bigint', 'smallint', 'tinyint', 'mediumint',
				'decimal', 'numeric', 'float', 'double', 'real', 'bit'];
			$isNumericColumn = in_array($colInfo['type'], $numericTypes);
		}

		// Also check column name patterns for common numeric columns
		if (!$isNumericColumn) {
			$numericColumnPatterns = [
				'/_(id|order|width|height|size|count|num|amount|price|qty|total|position|index|level|rank)$/i',
				'/^(id|count|number|amount|price|quantity|total|order|width|height|size)$/i'
			];

			foreach ($numericColumnPatterns as $pattern) {
				if (preg_match($pattern, $colName)) {
					$isNumericColumn = true;
					break;
				}
			}
		}

		// Only leave unquoted if it's definitely numeric AND the value is numeric
		if ($isNumericColumn && is_numeric($value)) {
			return (string) $value;
		}

		// For all other cases, quote with N' prefix for SQL Server Unicode compatibility
		$stringValue = (string) $value;
		$escapedValue = str_replace("'", "''", $stringValue);

		// Always use N' prefix for SQL Server string values to ensure Unicode compatibility
		return "N'$escapedValue'";
	}



	private function getColumnInfo(string $table): array {
		$columnInfo = [];
		try {
			$stmt = nuRunQuery("
			SELECT
				COLUMN_NAME,
				DATA_TYPE,
				IS_NULLABLE,
				CHARACTER_SET_NAME,
				COLLATION_NAME,
				COLUMN_TYPE
			FROM INFORMATION_SCHEMA.COLUMNS
			WHERE TABLE_SCHEMA = ? AND TABLE_NAME = ?
			ORDER BY ORDINAL_POSITION",
				[$this->srcDB, $table]
			);

			while ($row = db_fetch_array($stmt)) {
				$columnInfo[$row['COLUMN_NAME']] = [
					'type' => strtolower($row['DATA_TYPE']),
					'nullable' => $row['IS_NULLABLE'] === 'YES',
					'charset' => $row['CHARACTER_SET_NAME'],
					'collation' => $row['COLLATION_NAME'],
					'full_type' => $row['COLUMN_TYPE']
				];
			}
		} catch (Exception $e) {
			$this->log("Warning: Could not get column info for table $table: " . $e->getMessage());
		}
		return $columnInfo;
	}

	private function getPrimaryKeyName(string $tableName): string {
		$sql = "SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.key_column_usage WHERE CONSTRAINT_NAME = 'PRIMARY' AND TABLE_NAME = ? AND TABLE_SCHEMA = ?";
		$pkResult = nuRunQuery($sql, [$tableName, $this->srcDB]);
		return db_num_rows($pkResult) === 1 ? db_fetch_row($pkResult)[0] : '';
	}

	private function cloneDBViewsSQL(string $where): void {
		$views = $this->getViewsInDependencyOrder($where);
		$count = 0;

		foreach ($views as $view => $create) {
			$this->execOrDry("DROP VIEW IF EXISTS `$view`", "Drop view: $view");
			$this->execOrDry($create, "Create view: $view");
			$count++;
		}

		$this->statistics['views_created'] = ($this->statistics['views_created'] ?? 0) + $count;
		$this->log("Created $count view(s)" . ($this->config['dryRun'] ? " (dry run)" : ""));
	}

	private function getViewsInDependencyOrder(string $where): array {
		$views = $this->getTableNames("SELECT TABLE_NAME FROM information_schema.TABLES WHERE $where AND (TABLE_TYPE = 'VIEW' AND `TABLE_SCHEMA` = ?)");
		$viewDefinitions = [];
		$orderedViews = [];

		foreach ($views as $view) {
			$stmt = nuRunQuery("SHOW CREATE VIEW `$view`");
			$create = db_fetch_row($stmt)[1];
			$create = preg_replace('/CREATE[\s\S]+?VIEW/', 'CREATE VIEW', $create, 1);
			$create = str_replace("`$this->srcDB`.", "", $create);
			$viewDefinitions[$view] = $create;
		}

		$maxIterations = count($views) * count($views);
		$iteration = 0;

		while (!empty($viewDefinitions) && $iteration++ < $maxIterations) {
			foreach ($viewDefinitions as $view => $create) {
				$selectPart = strstr($create, "AS select");
				$hasUnresolvedDependency = false;

				foreach ($viewDefinitions as $otherView => $otherCreate) {
					if ($otherView !== $view && strpos($selectPart, "`$otherView`") !== false) {
						$hasUnresolvedDependency = true;
						break;
					}
				}

				if (!$hasUnresolvedDependency) {
					$orderedViews[$view] = $create;
					unset($viewDefinitions[$view]);
				}
			}
		}

		if (!empty($viewDefinitions)) {
			$this->log("WARNING: Circular dependency detected in views: " . implode(', ', array_keys($viewDefinitions)));
			if ($this->config['dryRun']) {
				$this->dry("WARNING: Circular dependency detected in views: " . implode(', ', array_keys($viewDefinitions)));
			}
		}

		return $orderedViews;
	}

	private function compareRecordCounts(string $targetDB): void {
		$this->showProgress("Verifying record counts...");
		$tables = $this->getTableNames("SELECT TABLE_NAME FROM information_schema.TABLES WHERE (TABLE_TYPE='BASE TABLE' AND `TABLE_SCHEMA`= ?)");

		foreach ($tables as $table) {
			$srcStmt = nuRunQuery("SELECT COUNT(*) FROM `$table`");
			$srcCount = db_fetch_row($srcStmt)[0];
			$this->srcRows += $srcCount;

			$tgtStmt = $this->targetPDO->query("SELECT COUNT(*) FROM `$table`");
			$tgtCount = $tgtStmt->fetch()[0];
			$this->tgtRows += $tgtCount;

			if ($srcCount != $tgtCount) {
				$this->log("WARNING: Row count mismatch in table '$table': source=$srcCount, target=$tgtCount");
			}
		}

		$this->showProgress("Completed ({$this->tgtRows})", $this->tgtRows, true);
	}

	private function copyFolderContents(string $source, string $destination): bool {
		if ($this->config['dryRun']) {
			$this->log("Would copy files from '$source' to '$destination'");
			$this->dry("Copy folder contents from '$source' to '$destination'");
			$this->simulateFileCopy($source, $destination);
			return true;
		} else {
			$this->showProgress("Copying files...", 0, false, true);
			$this->recursiveCopy($source, $destination);
			$this->showProgress("Completed ({$this->fileCount})", $this->fileCount, true);
			$this->log("Copied {$this->fileCount} file(s)");
			return true;
		}
	}

	private function simulateFileCopy(string $source, string $destination): void {
		if (!is_dir($source)) {
			$this->dry("ERROR: Source directory does not exist: $source");
			return;
		}

		$this->dry("Would create destination directory if not exists: $destination");
		$this->recursiveFileCount($source);
	}

	private function recursiveFileCount(string $source): void {
		$dir = opendir($source);
		if (!$dir) {
			$this->dry("ERROR: Cannot open source directory: $source");
			return;
		}

		while (($file = readdir($dir)) !== false) {
			if ($file === '.' || $file === '..') {
				continue;
			}

			$srcFile = $source . DIRECTORY_SEPARATOR . $file;

			if (is_dir($srcFile)) {
				if (!in_array($file, $this->config['excludedDirs'])) {
					$this->recursiveFileCount($srcFile);
				}
			} else {
				if (!in_array($file, $this->config['excludedFiles'])) {
					$this->fileCount++;
				}
			}
		}
		closedir($dir);
	}

	private function updateConfigFile(string $filePath, array $newValues): bool {
		if ($this->config['dryRun']) {
			$this->dry("Would update config file: $filePath");
			foreach ($newValues as $varName => $newValue) {
				$this->dry("  Set $varName = $newValue");
			}
			return true;
		}

		if (!file_exists($filePath)) {
			return false;
		}

		$contents = file_get_contents($filePath);

		foreach ($newValues as $varName => $newValue) {
			$quotedValue = is_numeric($newValue) ? $newValue : '"' . addslashes($newValue) . '"';
			$pattern = '/(\$' . preg_quote($varName, '/') . '\s*=\s*)(["\']?.*?["\']?)(\s*;)/';
			$replacement = '${1}' . $quotedValue . '${3}';
			$contents = preg_replace($pattern, $replacement, $contents, 1);
		}

		return file_put_contents($filePath, $contents) !== false;
	}

	private function recursiveDelete(string $path, bool $deleteRoot = true): int {
		if (!is_dir($path)) {
			return 0;
		}

		$count = 0;
		$iterator = new RecursiveIteratorIterator(
			new RecursiveDirectoryIterator($path, RecursiveDirectoryIterator::SKIP_DOTS),
			RecursiveIteratorIterator::CHILD_FIRST
		);

		foreach ($iterator as $file) {
			if ($file->isDir()) {
				if (rmdir($file->getRealPath())) {
					$count++;
				}
			} else {
				if (unlink($file->getRealPath())) {
					$count++;
				}
			}
		}

		if ($deleteRoot && is_dir($path)) {
			if (rmdir($path)) {
				$count++;
			}
		}

		return $count;
	}

	private function handleDatabaseCreation(string $host, string $db, string $usr, string $pwd, string $charset, int $port): bool {
		$createDatabaseOption = $this->config['databaseMode'];
		$dbExists = $this->databaseExists($host, $db, $usr, $pwd, $charset, $port);

		switch ($createDatabaseOption) {
			case 'create':
				if (!$dbExists) {
					return $this->createDatabase($host, $db, $usr, $pwd, $charset, $port);
				} else {
					$this->log("Target database '$db' already exists");
					if ($this->config['dryRun']) {
						$this->dry("Target database '$db' already exists");
					}
					return true;
				}

			case 'fail':
				if ($dbExists) {
					$this->sendError("Target database '$db' already exists. Operation aborted (databaseMode = 'fail').");
					return false;
				} else {
					return $this->createDatabase($host, $db, $usr, $pwd, $charset, $port);
				}

			case 'clear':
				if ($dbExists) {
					$this->log("Target database '$db' exists and will be cleared");
					if ($this->config['dryRun']) {
						$this->dry("Target database '$db' exists and will be cleared");
					}
					return true;
				} else {
					return $this->createDatabase($host, $db, $usr, $pwd, $charset, $port);
				}

			default:
				$this->sendError("Invalid databaseMode option: '$createDatabaseOption'. Must be one of: " . implode(', ', self::VALID_CREATE_DATABASE_OPTIONS));
				return false;
		}
	}

	private function createDatabase(string $host, string $db, string $usr, string $pwd, string $charset, int $port): bool {
		try {
			$dsn = "mysql:host=$host;charset=$charset;port=$port";
			$pdo = new PDO($dsn, $usr, $pwd, [
				PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
				PDO::ATTR_EMULATE_PREPARES => false
			]);

			$this->log("Target database '$db' does not exist. Creating it...");

			if ($this->config['dryRun']) {
				$this->log("Would create database: $db");
				$this->dry("Create database: $db");

				$charsetInfo = $this->getSourceDatabaseCharset();
				$dbCharset = $charsetInfo['charset'] ?? $charset;
				$dbCollation = $charsetInfo['collation'] ?? $this->config['databaseCollation'];

				$this->dry("Database charset: $dbCharset, collation: $dbCollation");
				$pdo = null;
				return true;
			}

			$charsetInfo = $this->getSourceDatabaseCharset();
			$dbCharset = $charsetInfo['charset'] ?? $charset;
			$dbCollation = $charsetInfo['collation'] ?? $this->config['databaseCollation'];

			$sql = "CREATE DATABASE IF NOT EXISTS `$db` CHARACTER SET $dbCharset COLLATE $dbCollation";
			$pdo->exec($sql);

			$this->log("Database '$db' created successfully with charset '$dbCharset' and collation '$dbCollation'");
			$this->statistics['database_created'] = true;

			$pdo = null;
			return true;

		} catch (PDOException $e) {
			if (strpos($e->getMessage(), 'Access denied') !== false) {
				$this->log("WARNING: Cannot create database - access denied. Database must exist.");
				$this->sendError("Cannot create database '$db'. Please create it manually or provide credentials with CREATE privilege.");
			} else {
				$this->sendError("Database creation failed: " . $e->getMessage());
			}
			return false;
		}
	}

	private function recursiveCopy(string $source, string $destination): void {
		if (!is_dir($source)) {
			throw new Exception("Source directory does not exist: $source");
		}

		if (!is_dir($destination)) {
			if (!mkdir($destination, 0755, true)) {
				throw new Exception("Failed to create destination directory: $destination");
			}
			$dt = filectime($source);
			touch($destination, $dt);
		}

		$dir = opendir($source);
		if (!$dir) {
			throw new Exception("Cannot open source directory: $source");
		}

		while (($file = readdir($dir)) !== false) {
			if ($file === '.' || $file === '..') {
				continue;
			}

			$srcFile = $source . DIRECTORY_SEPARATOR . $file;
			$dstFile = $destination . DIRECTORY_SEPARATOR . $file;

			if (is_dir($srcFile)) {
				if (!in_array($file, $this->config['excludedDirs'])) {
					$this->recursiveCopy($srcFile, $dstFile);
				}
			} else {
				if (!in_array($file, $this->config['excludedFiles'])) {
					if (!copy($srcFile, $dstFile)) {
						$this->log("WARNING: Failed to copy file: $srcFile");
					} else {
						$dt = filemtime($srcFile);
						touch($dstFile, $dt);
						$this->fileCount++;

						if ($this->config['showProgress'] && $this->fileCount % 500 === 0) {
							$this->log("Progress: Copied {$this->fileCount} files so far");
							$this->showProgress("Copied {$this->fileCount} files...", $this->fileCount, false, true);
						}
					}
				}
			}
		}
		closedir($dir);
	}

	private function executeSQL(string $sql): void {
		if ($this->config['dryRun']) {
			$this->log("Would execute: " . substr($sql, 0, 100) . (strlen($sql) > 100 ? '...' : ''));
			return;
		}

		try {
			$this->targetPDO->exec($sql);
		} catch (PDOException $e) {
			throw new Exception("SQL execution failed: " . $e->getMessage() . "\nSQL: " . substr($sql, 0, 200));
		}
	}

	private function showProgress(string $message, int $count = 0, bool $completed = false, bool $increment = false): void {
		$this->log($message);

		if (!$this->showProgress) {
			return;
		}

		if ($completed || $increment) {
			$this->progressNr++;
		}

		$progressId = $this->config['progressId'];
		$file = __DIR__ . "/../temp/nu_app_cloner_progress_$progressId.log";

		if ($this->progressNr === 1) {
			$progressDir = dirname($file);
			foreach (glob($progressDir . '/nu_app_cloner_progress_*.log') as $progressFile) {
				@unlink($progressFile);
			}
		}

		if ($completed) {
			$newEntry = '<i><span style="color: grey;">' . $message . '</span></i>' . PHP_EOL;
		} else {
			$newEntry = "<b>{$this->progressNr}</b> $message";
		}

		if ($increment) {
			$newEntry .= PHP_EOL;
		}

		$existing = file_exists($file) ? file_get_contents($file) : '';
		file_put_contents($file, $existing . $newEntry);
	}

	private function sendError(string $message): bool {
		$this->nuAppClonerCallback('error', $message);
		return false;
	}

	private function log(string $message): void {
		$timestamp = date('Y-m-d H:i:s');
		$logMessage = "[$timestamp] $message\n";

		if ($this->logHandle && is_resource($this->logHandle)) {
			@fwrite($this->logHandle, $logMessage);
			@fflush($this->logHandle);
		}
	}

	private function nuAppClonerCallback(string $type, string $message): void {
		$escapedMessage = str_replace(
			['\\', '`', '${'],
			['\\\\', '\`', '\\${'],
			$message
		);

		$js = "nuMessage('$type', `{$escapedMessage}`);";

		if ($type === 'error') {
			$js .= "window.stopPolling = true;";
		}

		nuJavaScriptCallback($js);
	}

	private function sendSuccessMessage(string $targetDB, string $sourcePath, string $targetPath): void {
		$executionTime = round(microtime(true) - $this->startTime, 2);

		$stats = [
			"Execution time: $executionTime seconds",
			"$this->srcRows records in $this->srcDB (source)",
		];

		if (!$this->config['dryRun']) {
			$stats[] = "$this->tgtRows records in $targetDB (target)";
		} else {
			$stats[] = "Would copy {$this->statistics['rows_copied']} records to $targetDB (target)";
		}

		$includeList = $this->config['includeTablesAndViews'];
		$excludeList = $this->config['excludeTablesAndViews'];

		if (!empty($includeList) || !empty($excludeList)) {
			$stats[] = "<br><strong>Table/View Filtering Applied:</strong>";
			if (!empty($includeList)) {
				$stats[] = "• Only included: " . implode(', ', array_slice($includeList, 0, 5)) . (count($includeList) > 5 ? " and " . (count($includeList) - 5) . " more..." : "");
			}
			if (!empty($excludeList)) {
				$stats[] = "• Excluded: " . implode(', ', array_slice($excludeList, 0, 5)) . (count($excludeList) > 5 ? " and " . (count($excludeList) - 5) . " more..." : "");
			}
		}

		if (isset($this->statistics['database_created']) && $this->statistics['database_created']) {
			if ($this->config['dryRun']) {
				$stats[] = "Would create target database '$targetDB'";
			} else {
				$stats[] = "Target database '$targetDB' was created";
			}
		}

		if (isset($this->statistics['objects_cleared'])) {
			$cleared = $this->statistics['objects_cleared'];
			$totalCleared = array_sum($cleared);
			if ($totalCleared > 0) {
				$verb = $this->config['dryRun'] ? "would clear" : "cleared";
				$stats[] = "$verb $totalCleared existing objects from target database";
				$clearDetails = [];
				foreach ($cleared as $type => $count) {
					if ($count > 0) {
						$clearDetails[] = "$count $type";
					}
				}
				if (!empty($clearDetails)) {
					$stats[] = " (" . implode(', ', $clearDetails) . ")";
				}
			}
		}

		if (isset($this->statistics['files_cleared']) && $this->statistics['files_cleared'] > 0) {
			$verb = $this->config['dryRun'] ? "would clear" : "cleared";
			$stats[] = "$verb {$this->statistics['files_cleared']} files/directories from target directory";
		}

		$objectTypes = ['tables_created', 'views_created', 'functions', 'procedures', 'triggers', 'events'];
		foreach ($objectTypes as $type) {
			if (isset($this->statistics[$type])) {
				$verb = $this->config['dryRun'] ? "would create" : "created";
				$displayName = str_replace('_created', '', $type);
				$stats[] = "$verb {$this->statistics[$type]} $displayName";
			}
		}

		if ($this->config['copyFiles']) {
			$verb = $this->config['dryRun'] ? "would copy" : "copied";
			$stats[] = "<br>$verb $this->fileCount files";
			$stats[] = "from: $sourcePath";
			$stats[] = "to: $targetPath";

			$fileMode = $this->config['fileMode'];
			$fileModeText = match ($fileMode) {
				'create' => 'Create directory if not exists, proceed if exists',
				'fail' => 'Fail if target directory exists',
				'clear' => 'Clear directory contents if exists, create if not',
				'overwrite' => 'Overwrite existing files without deleting others',
				default => "Unknown fileMode: $fileMode"
			};
			$stats[] = "File mode: $fileModeText";
		} else {
			$stats[] = "<br>File copying was skipped";
		}

		$message = 'The nuBuilder application has been cloned successfully.<br><br>' . implode('<br>', $stats);

		if ($this->config['dryRun']) {
			$message = "DRY RUN COMPLETED - No actual changes were made<br><br>$message";

			if (!empty($this->dryRunActions)) {
				$message .= '<br><br><strong>Actions that would be performed:</strong><br>';
				$actionSummary = array_count_values($this->dryRunActions);
				foreach ($actionSummary as $action => $count) {
					if ($count > 1) {
						$message .= "• $action (×$count)<br>";
					} else {
						$message .= "• $action<br>";
					}
				}
			}
		}

		$this->nuAppClonerCallback('Success', $message);
	}

	private function simulateClearDirectory(string $targetPath): void {
		$count = $this->countDirectoryContents($targetPath);
		$this->statistics['files_cleared'] = $count;
		if ($count > 0) {
			$this->dry("Would delete $count files/directories");
		}
	}

	private function countDirectoryContents(string $path): int {
		if (!is_dir($path)) {
			return 0;
		}

		$count = 0;
		$iterator = new RecursiveIteratorIterator(
			new RecursiveDirectoryIterator($path, RecursiveDirectoryIterator::SKIP_DOTS),
			RecursiveIteratorIterator::CHILD_FIRST
		);

		foreach ($iterator as $file) {
			$count++;
		}

		return $count;
	}

}