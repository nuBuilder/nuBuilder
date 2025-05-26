<?php

function nuAIPromptGetTableInformation($tableName) {
	// Get column info
	$columnsQuery = "SHOW COLUMNS FROM `$tableName`";
	$columnsResult = nuRunQuery($columnsQuery);
	$columns = [];
	while ($row = db_fetch_array($columnsResult)) {
		$columns[] = $row;
	}

	// Get primary key info
	$pkQuery = "SHOW KEYS FROM `$tableName` WHERE Key_name = 'PRIMARY'";
	$pkResult = nuRunQuery($pkQuery);
	$primaryKeys = [];
	while ($row = db_fetch_array($pkResult)) {
		$primaryKeys[] = $row['Column_name'];
	}

	// Build schema string
	$schemaParts = [];
	foreach ($columns as $col) {
		$colName = $col['Field'];
		$colType = $col['Type'];
		$isPK = in_array($colName, $primaryKeys) ? ' (PK)' : '';
		$schemaParts[] = "$colName: $colType$isPK";
	}

	return "Table $tableName: " . implode(', ', $schemaParts);
}


function nuAIPromptBuildPromptInformation($paramsJson) {

	$parsed = nuDecode($paramsJson);
	$tableJson = $parsed['tables'] ?? '[]';
	$languageJson = $parsed['languages'] ?? '[]';
	$scopeJson = $parsed['scopes'] ?? '[]';

	$tables = json_decode($tableJson, true, 512, JSON_THROW_ON_ERROR);
	$languages = json_decode($languageJson, true, 512, JSON_THROW_ON_ERROR);
	$scope = json_decode($scopeJson, true, 512, JSON_THROW_ON_ERROR);

	// Prepare lines of output
	$lines = [];

	// 1) Table schemas
	if (!empty($tables)) {
		$lines[] = 'Table schemas:';
		foreach ($tables as $tableName) {
			$lines[] = nuAIPromptGetTableInformation($tableName);
		}
		$lines[] = ''; // blank line
	}

	// 2) Language-specific notes
	$languageMessages = [
		'JavaScript' => 'Use nuBuilder JS functions: https://wiki.nubuilder.cloud/index.php?title=Javascript',
		'jQuery' => 'Use nuBuilder JS functions: https://wiki.nubuilder.cloud/index.php?title=Javascript',
		'PHP' => 'Use nuBuilder PDO PHP functions: https://wiki.nubuilder.cloud/index.php?title=PHP; and nuBuilder db helpers like nuRunQuery(), db_fetch_array(), etc. Do not add <?php tags, just the code itself.',
		'MySQL' => 'Database: MySQL',
		'CSS' => 'Technology: CSS',
		'HTML' => 'Technology: HTML',
	];

	foreach ($languages as $lang) {
		if (isset($languageMessages[$lang])) {
			$lines[] = $languageMessages[$lang];
		}
	}

	// 3) Scope-specific notes
	$scopeMessages = [
		'PHP Procedure' => 'Context: PHP Procedure. If relevant, use nuJavaScriptCallback() to call JavaScript functions from PHP. If relevant, use nuRunPHPHidden() to run a nuBuilder Procedure.',
		'PHP BB' => 'Context: PHP BB event (Before Browse). If relevant, use nuCreateTableFromSelect() to create a table from a SELECT query.',
		'PHP BE' => 'Context: PHP BE event (Before Edit). If relevant, use nuAddJavaScript() to add JavaScript code to the page.',
		'PHP AS' => 'Context: PHP AS event (After Save)',
		'PHP BS' => 'Context: PHP BS event (Before Save)',
		'PHP BD' => 'Context: PHP BD event (Before delete)',
		'Form Custom Code' => 'Context: Form Custom Code. Do not add <script> tags, just the code itself.',
		'Setup -> Header' => 'Context: Setup -> Header',
	];

	foreach ($scope as $sc) {
		if (isset($scopeMessages[$sc])) {
			$lines[] = $scopeMessages[$sc];
		}
	}

	return implode(PHP_EOL, $lines);

}