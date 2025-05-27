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
		$schemaParts[] = "`$colName`: $colType$isPK";
	}
	
	return $schemaParts;
}


/**
 * Build detailed prompt information for AI based on schemas, languages, scopes, and tags.
 *
 * @param array $params {
 *	 Optional keys:
 *	 @type array|string[] $tables	List of table names.
 *	 @type array|string[] $languages List of language/technology names.
 *	 @type array|string[] $scopes	List of context/scope identifiers.
 *	 @type array|string[] $tags	  List of topic tags.
 * }
 * @return string A composed prompt with table schemas and relevant notes.
 * @throws JsonException If JSON decoding fails.
 */
function nuAIPromptBuildPromptInformation($params): string
{
	// Allow JSON strings or arrays
	$tables	= is_string($params['tables'] ?? '')	? json_decode($params['tables'], true, 512, JSON_THROW_ON_ERROR)	: ($params['tables'] ?? []);
	$languages = is_string($params['languages'] ?? '') ? json_decode($params['languages'], true, 512, JSON_THROW_ON_ERROR) : ($params['languages'] ?? []);
	$scopes	= is_string($params['scopes'] ?? '')	? json_decode($params['scopes'], true, 512, JSON_THROW_ON_ERROR)	: ($params['scopes'] ?? []);
	$tags	= is_string($params['tags'] ?? '')	  ? json_decode($params['tags'], true, 512, JSON_THROW_ON_ERROR)	  : ($params['tags'] ?? []);

	// Deduplicate
	$languages = array_unique($languages);
	$scopes	= array_unique($scopes);
	$tags	= array_unique($tags);

	$lines = [];

	// Header instruction for AI
	$lines[] = 'You are an AI assistant specialized in nuBuilder Forte development. Generate code snippets and explanations following nuBuilder conventions.';
	$lines[] = '';  // blank line

	// 1) Table schemas
	if (!empty($tables)) {
		$lines[] = '## Table Schemas';
		foreach ($tables as $tableName) {
			$schemaParts = nuAIPromptGetTableInformation((string)$tableName);
			$lines[] = "- **{$tableName}**: " . implode(', ', $schemaParts);
		}
		$lines[] = '';  // blank line
	}

	// 2) Language-specific notes
	$languageMessages = [
		'JavaScript' => 'Use nuBuilder JS functions: https://wiki.nubuilder.cloud/index.php?title=Javascript',
		'PHP'		=> 'Use nuBuilder PDO PHP functions (nuRunQuery(), db_fetch_array(), etc.) without PHP tags.',
		'MySQL'		=> 'Database: MySQL',
		'CSS'		=> 'Technology: CSS',
		'HTML'		=> 'Technology: HTML',
		'SQL'		=> 'Use the nuBuilder SQL Builder: https://wiki.nubuilder.cloud/index.php?title=SQL_Builder',
	];
	$hasLang = false;
	foreach ($languages as $lang) {
		if (isset($languageMessages[$lang])) {
			if (!$hasLang) {
				$lines[] = '## Languages & Technologies';
				$hasLang = true;
			}
			$lines[] = "- {$languageMessages[$lang]}";
		}
	}
	if ($hasLang) {
		$lines[] = '';  // blank line
	}

	// 3) Scope-specific notes
	$scopeMessages = [
		'PHP Procedure'		=> 'Context: PHP Procedure. Use nuJavaScriptCallback() or nuRunPHPHidden() as appropriate.',
		'PHP BB'			=> 'Context: PHP Before Browse (BB). Use nuCreateTableFromSelect().',
		'PHP BE'			=> 'Context: PHP Before Edit (BE). Use nuAddJavaScript() to inject JS.',
		'PHP BS'			=> 'Context: PHP Before Save (BS).',
		'PHP AS'			=> 'Context: PHP After Save (AS).',
		'PHP BD'			=> 'Context: PHP Before Delete (BD).',
		'Form Custom Code'	=> 'Context: Form Custom Code (no <script> tags).',
		'Setup -> Header'	=> 'Context: Global header code (Setup -> Header).',
		'Browse Form'		=> 'Context: Browse Form client-side JS.',
		'Edit Form'			=> 'Context: Edit Form client-side JS.',
	];
	$hasScope = false;
	foreach ($scopes as $sc) {
		if (isset($scopeMessages[$sc])) {
			if (!$hasScope) {
				$lines[] = '## Context & Scopes';
				$hasScope = true;
			}
			$lines[] = "- {$scopeMessages[$sc]}";
		}
	}
	if ($hasScope) {
		$lines[] = '';  // blank line
	}

	// 4) Tag-specific notes (all topics from documentation) 
	$tagMessages = [
		'Setup'									=> 'Setup: https://wiki.nubuilder.cloud/index.php?title=Setup',
		'Updating'								=> 'Updating: https://wiki.nubuilder.cloud/index.php?title=Updating',
		'Forms'									=> 'Forms: https://wiki.nubuilder.cloud/index.php?title=Forms',
		'Objects'								=> 'Objects: https://wiki.nubuilder.cloud/index.php?title=Objects',
		'Cloner'								=> 'Cloner: https://wiki.nubuilder.cloud/index.php?title=Cloner',
		'Reports'								=> 'Reports: https://wiki.nubuilder.cloud/index.php?title=Reports',
		'Report Builder'						=> 'Report Builder: https://wiki.nubuilder.cloud/index.php?title=Report_Builder',
		'Report Designer'						=> 'Report Designer: https://wiki.nubuilder.cloud/index.php?title=Report_Designer',
		'Procedures'							=> 'Procedures: https://wiki.nubuilder.cloud/index.php?title=Procedures',
		'User Access'							=> 'User Access: https://wiki.nubuilder.cloud/index.php?title=User_Access',
		'2FA'									=> 'Two Factor Authentication (2FA): https://wiki.nubuilder.cloud/index.php?title=Two_Factor_Authentication_-_2FA',
		'Functions'								=> 'Functions: https://wiki.nubuilder.cloud/index.php?title=Functions',
		'File Includes'							=> 'Custom File Includes: https://wiki.nubuilder.cloud/index.php?title=Custom_File_Includes',
		'Search'								=> 'Search: https://wiki.nubuilder.cloud/index.php?title=Search',
		'Hash Cookies'							=> 'Hash Cookies: https://wiki.nubuilder.cloud/index.php?title=Hash_Cookies',
		'Translations'							=> 'Translations: https://wiki.nubuilder.cloud/index.php?title=Translations',
		'Files'									=> 'Files: https://wiki.nubuilder.cloud/index.php?title=Files',
		'Navigation'							=> 'Navigation: https://wiki.nubuilder.cloud/index.php?title=Navigation',
		'Database'								=> 'Database: https://wiki.nubuilder.cloud/index.php?title=Database',
		'File Manager'							=> 'File Manager: https://wiki.nubuilder.cloud/index.php?title=File_Manager',
		'Logging Activity'						=> 'Logging Activity: https://wiki.nubuilder.cloud/index.php?title=Logging_Activity',
		'Logging in'							=> 'Logging in: https://wiki.nubuilder.cloud/index.php?title=Logging_in',
		'SSO'									=> 'Single sign-on (SSO): https://wiki.nubuilder.cloud/index.php?title=Single_sign-on_(SSO)',
		'SQL Builder'							=> 'SQL Builder: https://wiki.nubuilder.cloud/index.php?title=SQL_Builder',
		'Format Builder'						=> 'Format Builder: https://wiki.nubuilder.cloud/index.php?title=Format_Builder',
		'CSV Transfer'							=> 'CSV Transfer: https://wiki.nubuilder.cloud/index.php?title=CSV_Transfer',
	];
	$hasTag = false;
	foreach ($tags as $tag) {
		if (isset($tagMessages[$tag])) {
			if (!$hasTag) {
				$lines[] = '## Topics & References';
				$hasTag = true;
			}
			$lines[] = "- {$tagMessages[$tag]}";
		}
	}

	return implode(PHP_EOL, $lines);
	
}
