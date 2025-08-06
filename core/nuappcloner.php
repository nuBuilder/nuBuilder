<?php

//  Clone a nuBuilder application - IMPROVED DRY RUN MODE + CLEAR DATABASE OPTION + TABLE/VIEW FILTERING
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

// Include the improved cloner class
class nuBuilderCloner {
	private const int INSERT_BATCH_SIZE = 1000;
	private const array VALID_INSERT_TYPES = ['INSERT', 'INSERT IGNORE', 'REPLACE'];
	private const array VALID_CREATE_DATABASE_OPTIONS = ['create', 'fail', 'clear'];
	private const array VALID_FILE_MODE_OPTIONS = ['create', 'fail', 'clear', 'overwrite'];
	private const int PROGRESS_UPDATE_INTERVAL = 100;

	private ?string $srcDB;
	private ?PDO $targetPDO = null;
	private float $startTime;
	private int $srcRows = 0;
	private int $tgtRows = 0;
	private int $fileCount = 0;
	private array $config;
	private array $statistics = [];
	private $logHandle = null;
	private int $progressNr = 1;
	private bool $showProgress = false;
	private array $dryRunActions = []; // Store actions that would be performed

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
			'includeTablesAndViews' => [], // If empty, include all tables/views except those in excludeTablesAndViews
			'excludeTablesAndViews' => []  // Tables/views to exclude
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

	/**
	 * Filter tables/views based on include/exclude configuration
	 */
	private function filterTablesAndViews(array $tableNames): array {
		$includeList = $this->config['includeTablesAndViews'];
		$excludeList = $this->config['excludeTablesAndViews'];

		// Log filtering configuration
		if (!empty($includeList)) {
			$this->log("Include filter active: " . implode(', ', $includeList));
		}
		if (!empty($excludeList)) {
			$this->log("Exclude filter active: " . implode(', ', $excludeList));
		}

		$filtered = [];
		$skipped = [];

		foreach ($tableNames as $tableName) {
			$shouldInclude = true;

			// Always include tables starting with 'zzzzsys_'
			if (strpos($tableName, 'zzzzsys_') === 0) {
				$filtered[] = $tableName;
				continue;
			}

			// If includeTablesAndViews is not empty, only include tables in that list
			if (!empty($includeList)) {
				$shouldInclude = in_array($tableName, $includeList, true);
				if (!$shouldInclude) {
					$skipped[] = "$tableName (not in include list)";
				}
			}

			// Always exclude tables in excludeTablesAndViews
			if ($shouldInclude && in_array($tableName, $excludeList, true)) {
				$shouldInclude = false;
				$skipped[] = "$tableName (in exclude list)";
			}

			if ($shouldInclude) {
				$filtered[] = $tableName;
			}
		}

		// Log filtering results
		if (!empty($skipped)) {
			$this->log("Filtered out " . count($skipped) . " tables/views: " . implode(', ', array_slice($skipped, 0, 10)) . (count($skipped) > 10 ? " and " . (count($skipped) - 10) . " more..." : ""));
		}

		if (!empty($filtered)) {
			$this->log("Including " . count($filtered) . " tables/views: " . implode(', ', array_slice($filtered, 0, 10)) . (count($filtered) > 10 ? " and " . (count($filtered) - 10) . " more..." : ""));
		}

		return $filtered;
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
				$this->dryRunActions = []; // Initialize dry run action log
			}

			// Handle database creation/validation based on databaseMode option
			if (!$this->handleDatabaseCreation($targetHost, $targetDB, $targetUsername, $targetPassword, $targetCharset, $targetPort)) {
				return false;
			}

			// Test target database connection (only if not dry run or if database exists)
			if (!$this->config['dryRun'] || $this->databaseExists($targetHost, $targetDB, $targetUsername, $targetPassword, $targetCharset, $targetPort)) {
				if (!$this->testConnection($targetHost, $targetDB, $targetUsername, $targetPassword, $targetCharset, $targetPort)) {
					return false;
				}

				if (!$this->config['dryRun']) {
					$this->targetPDO = $this->createPDOConnection($targetHost, $targetDB, $targetUsername, $targetPassword, $targetCharset, $targetPort);
					// Disable constraints for faster inserts
					$this->executeSQL("SET FOREIGN_KEY_CHECKS = 0; SET UNIQUE_CHECKS = 0; SET AUTOCOMMIT = 0;");
				}
			}

			// Clear database if option is enabled
			if ($this->config['databaseMode'] === 'clear') {
				$this->clearTargetDatabase($targetDB);
			}

			$this->processCloneOperations($opts, $insertType);

			if (!$this->config['dryRun']) {
				$this->compareRecordCounts($targetDB);
				// Re-enable constraints
				$this->executeSQL("COMMIT; SET FOREIGN_KEY_CHECKS = 1; SET UNIQUE_CHECKS = 1; SET AUTOCOMMIT = 1;");
			}

			// Handle file copying based on copyFiles config and fileMode
			if ($this->config['copyFiles']) {
				if (!$this->handleFileCopying($sourcePath, $targetPath, $targetHost, $targetDB, $targetPort, $targetUsername, $targetPassword, $targetCharset)) {
					return false;
				}
			} else {
				$this->log("File copying skipped (copyFiles is disabled)");
				if ($this->config['dryRun']) {
					$this->dryRunActions[] = "File copying would be skipped (copyFiles is disabled)";
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

	/**
	 * Handle file copying based on fileMode option
	 */
	private function handleFileCopying(string $sourcePath, string $targetPath, string $targetHost, string $targetDB, int $targetPort, string $targetUsername, string $targetPassword, string $targetCharset): bool {
		$fileMode = $this->config['fileMode'];

		// Check if target directory exists
		$targetExists = is_dir($targetPath);

		switch ($fileMode) {
			case 'create':
				// Create directory if it doesn't exist, proceed if it does
				if ($targetExists) {
					$this->log("Target directory '$targetPath' already exists");
					if ($this->config['dryRun']) {
						$this->dryRunActions[] = "Target directory '$targetPath' already exists";
					}
				} else {
					$this->log("Target directory '$targetPath' will be created");
					if ($this->config['dryRun']) {
						$this->dryRunActions[] = "Would create target directory '$targetPath'";
					}
				}
				break;

			case 'fail':
				// Fail if directory exists
				if ($targetExists) {
					$this->sendError("Target directory '$targetPath' already exists. File copying aborted (fileMode = 'fail').");
					return false;
				}
				$this->log("Target directory '$targetPath' does not exist and will be created");
				if ($this->config['dryRun']) {
					$this->dryRunActions[] = "Would create target directory '$targetPath'";
				}
				break;

			case 'clear':
				// Clear directory contents if it exists, create if it doesn't
				if ($targetExists) {
					$this->log("Target directory '$targetPath' exists and will be cleared");
					if ($this->config['dryRun']) {
						$this->dryRunActions[] = "Target directory '$targetPath' exists and will be cleared";
					}
					if (!$this->clearTargetDirectory($targetPath)) {
						return false;
					}
				} else {
					$this->log("Target directory '$targetPath' does not exist and will be created");
					if ($this->config['dryRun']) {
						$this->dryRunActions[] = "Would create target directory '$targetPath'";
					}
				}
				break;

			case 'overwrite':
				// Overwrite existing files without deleting others
				if ($targetExists) {
					$this->log("Target directory '$targetPath' exists. Files will be overwritten during copy.");
					if ($this->config['dryRun']) {
						$this->dryRunActions[] = "Target directory '$targetPath' exists. Files will be overwritten during copy.";
					}
				} else {
					$this->log("Target directory '$targetPath' does not exist and will be created");
					if ($this->config['dryRun']) {
						$this->dryRunActions[] = "Would create target directory '$targetPath'";
					}
				}
				break;

			default:
				$this->sendError("Invalid fileMode option: '$fileMode'. Must be one of: " . implode(', ', self::VALID_FILE_MODE_OPTIONS));
				return false;
		}

		// Proceed with file copying
		$folderCopied = $this->copyFolderContents($sourcePath, $targetPath);

		if ($folderCopied || $this->config['dryRun']) {
			// Get source database charset and collation if possible
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

	/**
	 * Clear target directory contents
	 */
	private function clearTargetDirectory(string $targetPath): bool {
		if ($this->config['dryRun']) {
			$this->dryRunActions[] = "Would clear all contents from directory '$targetPath'";
			$this->simulateClearDirectory($targetPath);
			return true;
		}

		try {
			$this->showProgress("Clearing target directory...");
			$clearedCount = $this->recursiveDelete($targetPath, false); // false = don't delete the directory itself
			$this->statistics['files_cleared'] = $clearedCount;
			$this->log("Cleared $clearedCount files/directories from '$targetPath'");
			$this->showProgress("Directory cleared ($clearedCount items)", $clearedCount, true);
			return true;
		} catch (Exception $e) {
			$this->sendError("Failed to clear target directory: " . $e->getMessage());
			return false;
		}
	}

	/**
	 * Simulate clearing directory for dry run
	 */
	private function simulateClearDirectory(string $targetPath): void {
		$count = $this->countDirectoryContents($targetPath);
		$this->statistics['files_cleared'] = $count;
		if ($count > 0) {
			$this->dryRunActions[] = "Would delete $count files/directories";
		}
	}

	/**
	 * Count files and directories in a directory
	 */
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

	/**
	 * Recursively delete directory contents
	 */
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

		// Check if database exists
		$dbExists = $this->databaseExists($host, $db, $usr, $pwd, $charset, $port);

		switch ($createDatabaseOption) {
			case 'create':
				// Create database if it doesn't exist
				if (!$dbExists) {
					return $this->createDatabase($host, $db, $usr, $pwd, $charset, $port);
				} else {
					$this->log("Target database '$db' already exists");
					if ($this->config['dryRun']) {
						$this->dryRunActions[] = "Target database '$db' already exists";
					}
					return true;
				}

			case 'fail':
				// Fail if database exists
				if ($dbExists) {
					$this->sendError("Target database '$db' already exists. Operation aborted (databaseMode = 'fail').");
					return false;
				} else {
					return $this->createDatabase($host, $db, $usr, $pwd, $charset, $port);
				}

			case 'clear':
				// Clear database if it exists, create if it doesn't
				if ($dbExists) {
					$this->log("Target database '$db' exists and will be cleared");
					if ($this->config['dryRun']) {
						$this->dryRunActions[] = "Target database '$db' exists and will be cleared";
					}
					return true; // Database clearing will be handled later in the process
				} else {
					return $this->createDatabase($host, $db, $usr, $pwd, $charset, $port);
				}

			default:
				// Invalid option
				$this->sendError("Invalid databaseMode option: '$createDatabaseOption'. Must be one of: " . implode(', ', self::VALID_CREATE_DATABASE_OPTIONS));
				return false;

		}
	}

	private function createDatabase(string $host, string $db, string $usr, string $pwd, string $charset, int $port): bool {
		try {
			// First, try to connect without specifying a database
			$dsn = "mysql:host=$host;charset=$charset;port=$port";
			$pdo = new PDO($dsn, $usr, $pwd, [
				PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
				PDO::ATTR_EMULATE_PREPARES => false
			]);

			$this->log("Target database '$db' does not exist. Creating it...");

			if ($this->config['dryRun']) {
				$this->log("Would create database: $db");
				$this->dryRunActions[] = "Create database: $db";

				// Get source database charset and collation if possible
				$charsetInfo = $this->getSourceDatabaseCharset();
				$dbCharset = $charsetInfo['charset'] ?? $charset;
				$dbCollation = $charsetInfo['collation'] ?? $this->config['databaseCollation'];

				$this->dryRunActions[] = "Database charset: $dbCharset, collation: $dbCollation";
				$pdo = null;
				return true;
			}

			// Get source database charset and collation if possible
			$charsetInfo = $this->getSourceDatabaseCharset();
			$dbCharset = $charsetInfo['charset'] ?? $charset;
			$dbCollation = $charsetInfo['collation'] ?? $this->config['databaseCollation'];

			// Create the database
			$sql = "CREATE DATABASE IF NOT EXISTS `$db` CHARACTER SET $dbCharset COLLATE $dbCollation";
			$pdo->exec($sql);

			$this->log("Database '$db' created successfully with charset '$dbCharset' and collation '$dbCollation'");
			$this->statistics['database_created'] = true;

			$pdo = null;
			return true;

		} catch (PDOException $e) {
			// If we can't connect without a database, it might be a permission issue
			if (strpos($e->getMessage(), 'Access denied') !== false) {
				$this->log("WARNING: Cannot create database - access denied. Database must exist.");
				$this->sendError("Cannot create database '$db'. Please create it manually or provide credentials with CREATE privilege.");
			} else {
				$this->sendError("Database creation failed: " . $e->getMessage());
			}
			return false;
		}
	}

	private function clearTargetDatabase(string $targetDB): void {
		$this->showProgress("Clearing target database...");
		$this->log("Clearing target database '$targetDB'" . ($this->config['dryRun'] ? " (dry run)" : ""));

		if ($this->config['dryRun']) {
			$this->dryRunActions[] = "Clear all existing database objects from '$targetDB'";
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
			// 1. Drop all events first
			$cleared['events'] = $this->dropAllEvents();

			// 2. Drop all triggers
			$cleared['triggers'] = $this->dropAllTriggers();

			// 3. Drop all procedures
			$cleared['procedures'] = $this->dropAllProcedures();

			// 4. Drop all functions
			$cleared['functions'] = $this->dropAllFunctions();

			// 5. Drop all views (in reverse dependency order)
			$cleared['views'] = $this->dropAllViews();

			// 6. Drop all tables (with foreign key handling)
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
		// Simulate counting objects that would be cleared
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
				$this->dryRunActions[] = "Would drop $count $type";
			}
		}

		$this->statistics['objects_cleared'] = $objects;
	}

	private function countTargetObjects(string $type): int {
		if ($this->config['dryRun'] && !$this->targetPDO) {
			// For dry run without connection, return simulated counts
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

	private function dropAllEvents(): int {
		$count = 0;
		$stmt = $this->targetPDO->query("SELECT EVENT_NAME FROM INFORMATION_SCHEMA.EVENTS WHERE EVENT_SCHEMA = DATABASE()");
		while ($row = $stmt->fetch()) {
			$eventName = $row[0];
			$this->executeSQL("DROP EVENT IF EXISTS `$eventName`");
			$count++;
		}
		return $count;
	}

	private function dropAllTriggers(): int {
		$count = 0;
		$stmt = $this->targetPDO->query("SELECT TRIGGER_NAME FROM INFORMATION_SCHEMA.TRIGGERS WHERE TRIGGER_SCHEMA = DATABASE()");
		while ($row = $stmt->fetch()) {
			$triggerName = $row[0];
			$this->executeSQL("DROP TRIGGER IF EXISTS `$triggerName`");
			$count++;
		}
		return $count;
	}

	private function dropAllProcedures(): int {
		$count = 0;
		$stmt = $this->targetPDO->query("SELECT ROUTINE_NAME FROM INFORMATION_SCHEMA.ROUTINES WHERE ROUTINE_SCHEMA = DATABASE() AND ROUTINE_TYPE = 'PROCEDURE'");
		while ($row = $stmt->fetch()) {
			$procedureName = $row[0];
			$this->executeSQL("DROP PROCEDURE IF EXISTS `$procedureName`");
			$count++;
		}
		return $count;
	}

	private function dropAllFunctions(): int {
		$count = 0;
		$stmt = $this->targetPDO->query("SELECT ROUTINE_NAME FROM INFORMATION_SCHEMA.ROUTINES WHERE ROUTINE_SCHEMA = DATABASE() AND ROUTINE_TYPE = 'FUNCTION'");
		while ($row = $stmt->fetch()) {
			$functionName = $row[0];
			$this->executeSQL("DROP FUNCTION IF EXISTS `$functionName`");
			$count++;
		}
		return $count;
	}

	private function dropAllViews(): int {
		$count = 0;
		// Get all views first
		$views = [];
		$stmt = $this->targetPDO->query("SELECT TABLE_NAME FROM INFORMATION_SCHEMA.VIEWS WHERE TABLE_SCHEMA = DATABASE()");
		while ($row = $stmt->fetch()) {
			$views[] = $row[0];
		}

		// Drop views in reverse dependency order (simple approach: try multiple times)
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
					// View might have dependencies, try next round
					if ($attempt == $maxAttempts) {
						$this->log("Warning: Could not drop view '$viewName': " . $e->getMessage());
					}
				}
			}

			// Remove successfully dropped views
			foreach (array_reverse($droppedThisRound) as $index) {
				unset($views[$index]);
			}

			// If no views were dropped this round, force drop remaining
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

		// Disable foreign key checks to avoid dependency issues
		$this->executeSQL("SET FOREIGN_KEY_CHECKS = 0");

		try {
			$stmt = $this->targetPDO->query("SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = DATABASE() AND TABLE_TYPE = 'BASE TABLE'");
			while ($row = $stmt->fetch()) {
				$tableName = $row[0];
				$this->executeSQL("DROP TABLE IF EXISTS `$tableName`");
				$count++;
			}
		} finally {
			// Re-enable foreign key checks
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
			$stmt = nuRunQuery("SELECT DEFAULT_CHARACTER_SET_NAME, DEFAULT_COLLATION_NAME
 FROM INFORMATION_SCHEMA.SCHEMATA
 WHERE SCHEMA_NAME = ?", [$this->srcDB]);

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

		if (!in_array($insertType, self::VALID_INSERT_TYPES, true)) {
			return $this->sendError('Invalid insert type. Must be one of: ' . implode(', ', self::VALID_INSERT_TYPES));
		}

		// Validate createDatabase option
		$createDbOption = $this->config['databaseMode'];
		if (!in_array($createDbOption, self::VALID_CREATE_DATABASE_OPTIONS, true) &&
			!in_array($createDbOption, [true, false, 'true', 'false'], true)) {
			return $this->sendError('Invalid databaseMode option. Must be one of: ' . implode(', ', self::VALID_CREATE_DATABASE_OPTIONS) . ' or boolean');
		}

		// Validate fileMode option
		$fileModeOption = $this->config['fileMode'];
		if (!in_array($fileModeOption, self::VALID_FILE_MODE_OPTIONS, true)) {
			return $this->sendError('Invalid fileMode option. Must be one of: ' . implode(', ', self::VALID_FILE_MODE_OPTIONS));
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

		// Validate table/view filtering arrays
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

	private function processCloneOperations(array $opts, string $insertType): void {
		// PHASE 1: Create database structure first (tables and views)
		$structureOperations = [
			1 => [
				['method' => 'cloneDBCreateSQL', 'args' => ["TABLE_NAME LIKE 'zzzzsys%'"], 'desc' => 'nuBuilder system tables'],
				['method' => 'cloneDBViewsSQL', 'args' => ["TABLE_NAME LIKE 'zzzzsys%'"], 'desc' => 'nuBuilder system views']
			],
			2 => [
				['method' => 'cloneDBCreateSQL', 'args' => ["TABLE_NAME NOT LIKE 'zzzzsys%'"], 'desc' => 'user tables'],
				['method' => 'cloneDBViewsSQL', 'args' => ["TABLE_NAME NOT LIKE 'zzzzsys%'"], 'desc' => 'user views']
			]
		];

		// Process structure operations first
		foreach ($structureOperations as $opt => $actions) {
			if (in_array($opt, $opts)) {
				foreach ($actions as $action) {
					$this->showProgress("Creating {$action['desc']}...");
					$method = $action['method'];
					$args = $action['args'] ?? [];

					$beforeCount = $this->getStatisticCount($method);
					$this->$method(...$args);
					$this->showCompletionProgress($method, $action['desc'], $beforeCount);
				}
			}
		}

		// PHASE 2: Insert data into tables
		if (array_intersect([3, 4, 5], $opts) === [3, 4, 5]) {
			$this->showProgress("Cloning all table data...");
			$beforeRows = $this->statistics['rows_copied'] ?? 0;
			$this->cloneDBInsertSQL($insertType, "TRUE", "TRUE");
			$totalRows = ($this->statistics['rows_copied'] ?? 0) - $beforeRows;
			$this->showProgress("Completed ($totalRows)", $totalRows, true);
		} else {
			if (in_array(3, $opts)) {
				$this->showProgress("Cloning nuBuilder system records...");
				$beforeRows = $this->statistics['rows_copied'] ?? 0;
				$this->cloneDBInsertSQL($insertType, "TABLE_NAME LIKE 'zzzzsys%'", "|t|_id LIKE 'nu%'");
				$systemRows = ($this->statistics['rows_copied'] ?? 0) - $beforeRows;
				$this->showProgress("Completed ($systemRows)", $systemRows, true);
			}
			if (in_array(4, $opts)) {
				$this->showProgress("Cloning application records...");
				$beforeRows = $this->statistics['rows_copied'] ?? 0;
				$this->cloneDBInsertSQL($insertType, "TABLE_NAME LIKE 'zzzzsys%'", "|t|_id NOT LIKE 'nu%'");
				$appRows = ($this->statistics['rows_copied'] ?? 0) - $beforeRows;
				$this->showProgress("Completed ($appRows)", $appRows, true);
			}
			if (in_array(5, $opts)) {
				$this->showProgress("Cloning user table data...");
				$beforeRows = $this->statistics['rows_copied'] ?? 0;
				$this->cloneDBInsertSQL($insertType, "(TABLE_NAME NOT LIKE 'zzzzsys%' AND TABLE_NAME NOT LIKE '___nu%')", "TRUE");
				$userRows = ($this->statistics['rows_copied'] ?? 0) - $beforeRows;
				$this->showProgress("Completed ($userRows)", $userRows, true);
			}
		}

		// PHASE 3: Create database objects that depend on tables/views (functions, procedures, triggers, events)
		$dependentOperations = [
			6 => ['method' => 'cloneFunctions', 'desc' => 'functions'],
			7 => ['method' => 'cloneProcedures', 'desc' => 'procedures'],
			8 => ['method' => 'cloneTriggers', 'desc' => 'triggers'],
			9 => ['method' => 'cloneEvents', 'desc' => 'events']
		];

		// Process dependent operations last
		foreach ($dependentOperations as $opt => $config) {
			if (in_array($opt, $opts)) {
				$this->showProgress("Cloning {$config['desc']}...");
				$method = $config['method'];

				$beforeCount = $this->getStatisticCount($method);
				$this->$method();
				$this->showCompletionProgress($method, $config['desc'], $beforeCount);
			}
		}
	}


	private function getStatisticCount(string $method): int {
		$statMap = [
			'cloneFunctions' => 'functions',
			'cloneProcedures' => 'procedures',
			'cloneTriggers' => 'triggers',
			'cloneEvents' => 'events',
			'cloneDBCreateSQL' => 'tables_created',
			'cloneDBViewsSQL' => 'views_created'
		];

		$statKey = $statMap[$method] ?? null;
		return $statKey ? ($this->statistics[$statKey] ?? 0) : 0;
	}

	private function showCompletionProgress(string $method, string $description, int $beforeCount): void {
		$currentCount = $this->getStatisticCount($method);
		$actualCount = $currentCount - $beforeCount;

		$this->showProgress("Completed ($actualCount)", $actualCount, true);
	}

	private function cloneFunctions(): void {
		$this->cloneRoutineType('FUNCTION', [
			'drop' => 'DROP FUNCTION IF EXISTS',
			'show' => 'SHOW FUNCTION STATUS'
		]);
	}

	private function cloneProcedures(): void {
		$this->cloneRoutineType('PROCEDURE', [
			'drop' => 'DROP PROCEDURE IF EXISTS',
			'show' => 'SHOW PROCEDURE STATUS'
		]);
	}

	private function cloneTriggers(): void {
		$this->cloneRoutineType('TRIGGER', [
			'drop' => 'DROP TRIGGER IF EXISTS',
			'show' => 'SHOW TRIGGERS'
		]);
	}

	private function cloneEvents(): void {
		$this->cloneRoutineType('EVENT', [
			'drop' => 'DROP EVENT IF EXISTS',
			'show' => 'SHOW EVENTS'
		]);
	}


	private function shouldProcessRoutine(string $routineName, string $tableName = null): bool {
		// If no table filtering is configured, process all routines
		if (empty($this->config['includeTablesAndViews']) && empty($this->config['excludeTablesAndViews'])) {
			return true;
		}

		// For triggers, we can check the associated table
		if ($tableName !== null) {
			$includeList = $this->config['includeTablesAndViews'];
			$excludeList = $this->config['excludeTablesAndViews'];

			// If includeTablesAndViews is not empty, only include if table is in that list
			if (!empty($includeList) && !in_array($tableName, $includeList, true)) {
				return false;
			}

			// Always exclude if table is in excludeTablesAndViews
			if (in_array($tableName, $excludeList, true)) {
				return false;
			}
		}

		// For functions, procedures, and events without table association,
		// we might want to include them all or add more sophisticated filtering
		return true;
	}

	private function cloneRoutineType(string $type, array $config): void {
		$count = 0;
		$failedRoutines = [];

		if ($type === 'TRIGGER') {
			$stmt = nuRunQuery("SHOW TRIGGERS FROM `{$this->srcDB}`");
			while ($row = db_fetch_array($stmt)) {
				$name = $row['Trigger'];
				$table = $row['Table'];

				if ($this->shouldProcessRoutine($name, $table)) {
					try {
						$createStmt = nuRunQuery("SHOW CREATE TRIGGER `$name`");
						$create = db_fetch_row($createStmt)[2];
						$create = preg_replace("/CREATE[\s\S]+?TRIGGER/", "CREATE TRIGGER", $create, 1);

						if ($this->config['dryRun']) {
							$this->dryRunActions[] = "Drop trigger: $name (on table: $table)";
							$this->dryRunActions[] = "Create trigger: $name (on table: $table)";
						} else {
							$this->executeSQL("{$config['drop']} `$name`");
							$this->executeSQL($create);
						}
						$count++;
					} catch (Exception $e) {
						$failedRoutines[] = "$name (table: $table) - " . $e->getMessage();
						$this->log("WARNING: Failed to clone trigger '$name': " . $e->getMessage());
					}
				}
			}
		} elseif ($type === 'EVENT') {
			$se = "SELECT * FROM `INFORMATION_SCHEMA`.`EVENTS` WHERE `EVENT_SCHEMA` = ?";
			if (db_num_rows(nuRunQuery($se, [$this->srcDB])) > 0) {
				$stmt = nuRunQuery($config['show'] . " WHERE Db = ?", [$this->srcDB]);
				while ($row = db_fetch_array($stmt)) {
					$name = $row['Name'];

					if ($this->shouldProcessRoutine($name)) {
						try {
							$createStmt = nuRunQuery("SHOW CREATE EVENT `$name`");
							$create = db_fetch_row($createStmt)[3];
							$create = preg_replace("/CREATE[\s\S]+?EVENT/", "CREATE EVENT", $create, 1);

							if ($this->config['dryRun']) {
								$this->dryRunActions[] = "Drop event: $name";
								$this->dryRunActions[] = "Create event: $name";
							} else {
								$this->executeSQL("{$config['drop']} `$name`");
								$this->executeSQL($create);
							}
							$count++;
						} catch (Exception $e) {
							$failedRoutines[] = "$name - " . $e->getMessage();
							$this->log("WARNING: Failed to clone event '$name': " . $e->getMessage());
						}
					}
				}
			}
		} else {
			// Functions and Procedures
			$stmt = nuRunQuery($config['show'] . " WHERE Db = ?", [$this->srcDB]);
			while ($row = db_fetch_row($stmt)) {
				$name = $row[1];

				if ($this->shouldProcessRoutine($name)) {
					try {
						$createStmt = nuRunQuery("SHOW CREATE $type `$name`");
						$create = db_fetch_row($createStmt)[2];
						$create = preg_replace("/CREATE[\s\S]+?$type/", "CREATE $type", $create, 1);

						if ($this->config['dryRun']) {
							$this->dryRunActions[] = "Drop $type: $name";
							$this->dryRunActions[] = "Create $type: $name";
						} else {
							$this->executeSQL("{$config['drop']} `$name`");
							$this->executeSQL($create);
						}
						$count++;
					} catch (Exception $e) {
						$failedRoutines[] = "$name - " . $e->getMessage();
						$this->log("WARNING: Failed to clone $type '$name': " . $e->getMessage());
					}
				}
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

	private function getTableNames(string $sql): array {
		$tables = [];
		$stmt = nuRunQuery($sql, [$this->srcDB]);
		while ($row = db_fetch_row($stmt)) {
			$tables[] = $row[0];
		}

		// Apply table/view filtering
		return $this->filterTablesAndViews($tables);
	}

	private function cloneDBCreateSQL(string $where): void {
		$tables = $this->getTableNames("SELECT TABLE_NAME FROM information_schema.TABLES WHERE ($where) AND (TABLE_TYPE='BASE TABLE' AND `TABLE_SCHEMA`= ?)");
		$count = 0;

		foreach ($tables as $table) {
			$stmt = nuRunQuery("SHOW CREATE TABLE `$table`");
			$create = db_fetch_row($stmt)[1];

			if ($this->config['dryRun']) {
				$this->dryRunActions[] = "Drop/Create table: $table";
			} else {
				$this->executeSQL("DROP TABLE IF EXISTS `$table`");
				$this->executeSQL($create);
			}
			$count++;
		}

		$this->statistics['tables_created'] = ($this->statistics['tables_created'] ?? 0) + $count;
		$this->log("Created $count table(s)" . ($this->config['dryRun'] ? " (dry run)" : ""));
	}

	private function cloneDBInsertSQL(string $insertType, string $tableWhere, string $rowWhere): void {
		$tables = $this->getTableNames("SELECT TABLE_NAME FROM information_schema.TABLES WHERE ($tableWhere) AND (TABLE_TYPE='BASE TABLE' AND `TABLE_SCHEMA`= ?)");

		foreach ($tables as $table) {
			$this->cloneDBTableInserts($insertType, $table, str_replace("|t|", $table, $rowWhere));
		}
	}

	private function cloneDBTableInserts(string $insertType, string $table, string $rowWhere): void {
		$cols = db_field_names($table);
		$columnList = '(`' . implode('`,`', $cols) . '`)';
		$pkName = $this->getPrimaryKeyName($table);
		$orderClause = ($pkName === '') ? '' : "ORDER BY `$pkName`";

		// Count total rows to be copied
		$countStmt = nuRunQuery("SELECT COUNT(*) FROM `$table` WHERE $rowWhere");
		$totalRows = db_fetch_row($countStmt)[0];

		if ($totalRows == 0) {
			$this->log("Table '$table' has no rows to copy");
			return;
		}

		$this->log("Copying $totalRows row(s) from table '$table'" . ($this->config['dryRun'] ? " (dry run)" : ""));

		if ($this->config['dryRun']) {
			$this->dryRunActions[] = "Copy $totalRows rows to table: $table using $insertType";

			// Update statistics for dry run
			$this->statistics['rows_copied'] = ($this->statistics['rows_copied'] ?? 0) + $totalRows;
			return;
		}

		$stmt = nuRunQuery("SELECT * FROM `$table` WHERE $rowWhere $orderClause");

		$this->executeSQL("ALTER TABLE `$table` DISABLE KEYS");

		$rowCount = 0;
		$batch = [];
		$progressCount = 0;

		while ($row = db_fetch_row($stmt)) {
			$values = array_map(fn($col) => is_null($col) ? 'NULL' : nuDBQuote($col), $row);
			$batch[] = '(' . implode(',', $values) . ')';
			$rowCount++;
			$progressCount++;

			if ($rowCount % self::INSERT_BATCH_SIZE === 0) {
				$this->executeBatchInsert($insertType, $table, $columnList, $batch);
				$batch = [];
			}

			if ($this->config['showProgress'] && $progressCount % self::PROGRESS_UPDATE_INTERVAL === 0) {
				$percent = round(($progressCount / $totalRows) * 100, 1);
				// $this->updateProgress("Table '$table': $progressCount/$totalRows rows ($percent%)");
			}
		}

		if (!empty($batch)) {
			$this->executeBatchInsert($insertType, $table, $columnList, $batch);
		}

		$this->executeSQL("ALTER TABLE `$table` ENABLE KEYS");
		$this->statistics['rows_copied'] = ($this->statistics['rows_copied'] ?? 0) + $rowCount;
	}

	private function executeBatchInsert(string $insertType, string $table, string $columnList, array $batch): void {
		$sql = "$insertType INTO `$table` $columnList VALUES " . implode(',', $batch);
		$this->executeSQL($sql);
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
			if ($this->config['dryRun']) {
				$this->dryRunActions[] = "Drop view if exists: $view";
				$this->dryRunActions[] = "Create view: $view";
			} else {
				$this->executeSQL("DROP VIEW IF EXISTS `$view`");
				$this->executeSQL($create);
			}
			$count++;
		}

		$this->statistics['views_created'] = ($this->statistics['views_created'] ?? 0) + $count;
		$this->log("Created $count view(s)" . ($this->config['dryRun'] ? " (dry run)" : ""));
	}

	private function getViewsInDependencyOrder(string $where): array {
		$views = $this->getTableNames("SELECT TABLE_NAME FROM information_schema.TABLES WHERE $where AND (TABLE_TYPE = 'VIEW' AND `TABLE_SCHEMA` = ?)");
		$viewDefinitions = [];
		$orderedViews = [];

		// Get all view definitions
		foreach ($views as $view) {
			$stmt = nuRunQuery("SHOW CREATE VIEW `$view`");
			$create = db_fetch_row($stmt)[1];
			$create = preg_replace('/CREATE[\s\S]+?VIEW/', 'CREATE VIEW', $create, 1);
			$create = str_replace("`$this->srcDB`.", "", $create);
			$viewDefinitions[$view] = $create;
		}

		// Sort views by dependency
		$maxIterations = count($views) * count($views); // Prevent infinite loops
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
				$this->dryRunActions[] = "WARNING: Circular dependency detected in views: " . implode(', ', array_keys($viewDefinitions));
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
			$this->dryRunActions[] = "Copy folder contents from '$source' to '$destination'";

			// Simulate file counting for dry run
			$this->simulateFileCopy($source, $destination);
			return false;
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
			$this->dryRunActions[] = "ERROR: Source directory does not exist: $source";
			return;
		}

		$this->dryRunActions[] = "Would create destination directory if not exists: $destination";
		$this->recursiveFileCount($source);
	}

	private function recursiveFileCount(string $source): void {
		$dir = opendir($source);
		if (!$dir) {
			$this->dryRunActions[] = "ERROR: Cannot open source directory: $source";
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
			$this->dryRunActions[] = "Would update config file: $filePath";
			foreach ($newValues as $varName => $newValue) {
				$this->dryRunActions[] = "  Set $varName = $newValue";
			}
			return true;
		}

		if (!file_exists($filePath)) {
			// Ignore exception - the config file might be excluded
			// throw new Exception("Config file not found: " . $filePath);
			return false;
		}

		$contents = file_get_contents($filePath);

		foreach ($newValues as $varName => $newValue) {
			$quotedValue = is_numeric($newValue) ? $newValue : '"' . addslashes($newValue) . '"';

			// Regex: matches e.g., $nuConfigDBHost = "...";
			$pattern = '/(\$' . preg_quote($varName, '/') . '\s*=\s*)(["\']?.*?["\']?)(\s*;)/';
			$replacement = '${1}' . $quotedValue . '${3}';

			$contents = preg_replace($pattern, $replacement, $contents, 1);
		}

		return file_put_contents($filePath, $contents) !== false;
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

						// Show progress every 500 files
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

		if (!$this->showProgress)
			return;

		$progressId = $this->config['progressId'];
		$progressNr = $this->progressNr;
		$file = __DIR__ . "/../temp/nu_app_cloner_progress_$progressId.log";

		if ($progressNr === 1) {
			// Delete all progress log files in the same directory with the prefix and suffix
			$progressDir = dirname($file);
			foreach (glob($progressDir . '/nu_app_cloner_progress_*.log') as $progressFile) {
				@unlink($progressFile);

			}
		}

		if ($completed) {
			$newEntry = '<i><span style="color: grey;">' . $message . '</span></i>' . PHP_EOL;
		} else {
			$newEntry = "<b>$progressNr</b> $message";
		}

		if ($increment) {
			$newEntry .= PHP_EOL;
		}

		$existing = file_exists($file) ? file_get_contents($file) : '';

		// Prepend new message
		file_put_contents($file, $existing . $newEntry);

		if ($completed === true || $increment === true) {
			$this->progressNr++;
		}

	}

	private function sendError(string $message): bool {
		$this->nuAppClonerCallback('Error', $message);
		return false;
	}

	private function log(string $message): void {
		$timestamp = date('Y-m-d H:i:s');
		$logMessage = "[$timestamp] $message\n";

		if ($this->logHandle && is_resource($this->logHandle)) {
			@fwrite($this->logHandle, $logMessage);
			@fflush($this->logHandle);
		}

		if ($this->config['dryRun']) {
			//	usleep(200000); // 0.2 seconds delay for dry run
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

		// Only show target record count if not dry run
		if (!$this->config['dryRun']) {
			$stats[] = "$this->tgtRows records in $targetDB (target)";
		} else {
			$stats[] = "Would copy {$this->statistics['rows_copied']} records to $targetDB (target)";
		}

		// Add filtering information to the success message
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

		// Add database clearing statistics
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
					$stats[] = "  (" . implode(', ', $clearDetails) . ")";
				}
			}
		}

		// Add file clearing statistics
		if (isset($this->statistics['files_cleared']) && $this->statistics['files_cleared'] > 0) {
			$verb = $this->config['dryRun'] ? "would clear" : "cleared";
			$stats[] = "$verb {$this->statistics['files_cleared']} files/directories from target directory";
		}

		if (isset($this->statistics['tables_created'])) {
			$verb = $this->config['dryRun'] ? "would create" : "created";
			$stats[] = "$verb {$this->statistics['tables_created']} tables";
		}
		if (isset($this->statistics['views_created'])) {
			$verb = $this->config['dryRun'] ? "would create" : "created";
			$stats[] = "$verb {$this->statistics['views_created']} views";
		}
		if (isset($this->statistics['functions'])) {
			$verb = $this->config['dryRun'] ? "would create" : "created";
			$stats[] = "$verb {$this->statistics['functions']} functions";
		}
		if (isset($this->statistics['procedures'])) {
			$verb = $this->config['dryRun'] ? "would create" : "created";
			$stats[] = "$verb {$this->statistics['procedures']} procedures";
		}
		if (isset($this->statistics['triggers'])) {
			$verb = $this->config['dryRun'] ? "would create" : "created";
			$stats[] = "$verb {$this->statistics['triggers']} triggers";
		}
		if (isset($this->statistics['events'])) {
			$verb = $this->config['dryRun'] ? "would create" : "created";
			$stats[] = "$verb {$this->statistics['events']} events";
		}

		if ($this->config['copyFiles']) {
			$verb = $this->config['dryRun'] ? "would copy" : "copied";
			$stats[] = "<br>$verb $this->fileCount files";
			$stats[] = "from: $sourcePath";
			$stats[] = "to: $targetPath";

			// Add fileMode information - UPDATED to include 'overwrite'
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

			// Add dry run actions summary
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

}
