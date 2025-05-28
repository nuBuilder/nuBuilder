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

function nuAIPromptBuildPromptInformation($params) {

	// Allow JSON strings or arrays
	$tables = is_string($params['tables'] ?? '') ? json_decode($params['tables'], true, 512, JSON_THROW_ON_ERROR) : ($params['tables'] ?? []);
	$languages = is_string($params['languages'] ?? '') ? json_decode($params['languages'], true, 512, JSON_THROW_ON_ERROR) : ($params['languages'] ?? []);
	$scopes = is_string($params['scopes'] ?? '') ? json_decode($params['scopes'], true, 512, JSON_THROW_ON_ERROR) : ($params['scopes'] ?? []);
	$tags = is_string($params['tags'] ?? '') ? json_decode($params['tags'], true, 512, JSON_THROW_ON_ERROR) : ($params['tags'] ?? []);

	// Deduplicate
	$languages = array_unique($languages);
	$scopes = array_unique($scopes);
	$tags = array_unique($tags);

	$lines = [];

	// Header instruction for AI
	$lines[] = 'You are an AI assistant specialized in nuBuilder Forte development. Generate code snippets and explanations following nuBuilder conventions';
	$lines[] = 'Use the information below if they are relevant to the prompt. It is provided to help you understand the context and requirements for generating code snippets:';
	$lines[] = '';  // blank line

	// 1) Table schemas
	if (!empty($tables)) {
		$lines[] = '## Table Schemas';
		foreach ($tables as $tableName) {
			$schemaParts = nuAIPromptGetTableInformation((string) $tableName);
			$lines[] = "- **{$tableName}**: " . implode(', ', $schemaParts);
		}
		$lines[] = '';  // blank line
	}

	// 2) Language-specific notes
	$languageMessages = [
		'JavaScript' => 'Use nuBuilder JS functions: https://wiki.nubuilder.cloud/index.php?title=Javascript',
		'PHP' => 'Use nuBuilder PDO PHP functions (nuRunQuery(), db_fetch_array(), etc.) without PHP tags.',
		'MySQL' => 'Database: MySQL',
		'CSS' => 'Technology: CSS',
		'HTML' => 'Technology: HTML',
		'SQL' => 'Use the nuBuilder SQL Builder: https://wiki.nubuilder.cloud/index.php?title=SQL_Builder',
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
		'PHP Procedure' => 'Context: PHP Procedure. Use nuJavaScriptCallback(), nuRunPHPHidden(), etc as appropriate.',
		'PHP BB' => 'Context: PHP Before Browse (BB). Use nuCreateTableFromSelect().',
		'PHP BE' => 'Context: PHP Before Edit (BE). Use nuAddJavaScript() to inject JS.',
		'PHP BS' => 'Context: PHP Before Save (BS).',
		'PHP AS' => 'Context: PHP After Save (AS).',
		'PHP BD' => 'Context: PHP Before Delete (BD).',
		'Form Custom Code' => 'Context: Form Custom Code (no <script> tags).',
		'Setup -> Header' => 'Context: Global header code (Setup -> Header).',
		'Browse Form' => 'Context: Browse Form client-side JS.',
		'Edit Form' => 'Context: Edit Form client-side JS.',
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
		'nusetup' => 'Setup: https://wiki.nubuilder.cloud/index.php?title=Setup',
		'nuinstallation' => 'Installation: https://github.com/nuBuilder/nuBuilder/wiki/nuBuilder-Installation-Guide',
		'nuupdating' => 'Updating: https://wiki.nubuilder.cloud/index.php?title=Updating',
		'nuforms' => 'Forms: https://wiki.nubuilder.cloud/index.php?title=Forms',
		'nuobjects' => 'Objects: https://wiki.nubuilder.cloud/index.php?title=Objects',
		'nucloner' => 'Cloner: https://wiki.nubuilder.cloud/index.php?title=Cloner',
		'nureports' => 'Reports: https://wiki.nubuilder.cloud/index.php?title=Reports',
		'nureport_builder' => 'Report Builder: https://wiki.nubuilder.cloud/index.php?title=Report_Builder',
		'nureport_designer' => 'Report Designer: https://wiki.nubuilder.cloud/index.php?title=Report_Designer',
		'nuprocedures' => 'Procedures: https://wiki.nubuilder.cloud/index.php?title=Procedures',
		'nuuser_access' => 'User Access: https://wiki.nubuilder.cloud/index.php?title=User_Access',
		'nu2fa' => 'Two Factor Authentication (2FA): https://wiki.nubuilder.cloud/index.php?title=Two_Factor_Authentication_-_2FA',
		'nufunctions' => 'Functions: https://wiki.nubuilder.cloud/index.php?title=Functions',
		'nufile_includes' => 'Custom File Includes: https://wiki.nubuilder.cloud/index.php?title=Custom_File_Includes',
		'nusearch' => 'Search: https://wiki.nubuilder.cloud/index.php?title=Search',
		'nuhash_cookies' => 'Hash Cookies: https://wiki.nubuilder.cloud/index.php?title=Hash_Cookies',
		'nutranslations' => 'Translations: https://wiki.nubuilder.cloud/index.php?title=Translations',
		'nufiles' => 'Files: https://wiki.nubuilder.cloud/index.php?title=Files',
		'nunavigation' => 'Navigation: https://wiki.nubuilder.cloud/index.php?title=Navigation',
		'nudatabase' => 'Database: https://wiki.nubuilder.cloud/index.php?title=Database',
		'nufile_manager' => 'File Manager: https://wiki.nubuilder.cloud/index.php?title=File_Manager',
		'nulogging_activity' => 'Logging Activity: https://wiki.nubuilder.cloud/index.php?title=Logging_Activity',
		'nulogging_in' => 'Logging in: https://wiki.nubuilder.cloud/index.php?title=Login',
		'nusso' => 'Single sign-on (SSO): https://wiki.nubuilder.cloud/index.php?title=Single_sign-on_(SSO)',
		'nusql_builder' => 'SQL Builder: https://wiki.nubuilder.cloud/index.php?title=SQL_Builder',
		'nuformat_builder' => 'Format Builder: https://wiki.nubuilder.cloud/index.php?title=Format_Builder',
		'nucsv_transfer' => 'CSV Transfer: https://wiki.nubuilder.cloud/index.php?title=CSV_Transfer',
		'nufast_form_builder' => 'Fast Form Builder: https://wiki.nubuilder.cloud/index.php?title=Form_Builder'

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

function nuAIPromptGetTagsFromPrompt($params) {

	$tags = is_string($params['tags'] ?? '') ? json_decode($params['tags'], true, 512, JSON_THROW_ON_ERROR) : ($params['tags'] ?? []);
	$prompt = $params['prompt'] ?? '';

	$instruction = "
		Please follow these steps exactly:
		1. Use the complete array of tags below.
		2. Then list only the tags from that array which appear in the prompt but not all tags again.
		Do not include any other text or comments.

		Prompt:
		$prompt

		Tags:
	";

	$instruction = $instruction . implode(",", $tags);

	$response = nuGetAIResponse($instruction);

	/*
				 return [
					 'error' => false,
					 'result' => ['Update', '2FA']
				 ];
			 */

	if ($response['error']) {
		return [
			'error' => true,
			'message' => "<h3>Error</h3><p>" . htmlspecialchars($response['message']) . "</p>"
		];

	}

	$reply = $response['reply'];

	$array = explode(",", $reply);
	$array = array_map('trim', $array);

	return [
		'error' => false,
		'message' => null,
		'result' => $array
	];

}

function nuAIPromptGetResponse($params) {

	$test = false;
	$prompt = $params['prompt'] ?? '';

	$response = nuGetAIResponse($prompt);
	// If the response is an error, return it
	if ($response['error']) {
		return [
			'error' => true,
			'message' => "<h3>Error:</h3><p>" . htmlspecialchars($response['message']) . "</p>"
		];

	}

	$reply = $response['reply'];

	return [
		'error' => false,
		'message' => null,
		'result' => $reply
	];

}

function nuGetAIResponse($prompt, $aiConfig = '', $postData = []) {

	global $nuAIConfig;

	// Check if global $nuAIConfig is set and is an array
	if (!isset($nuAIConfig) || !is_array($nuAIConfig)) {
		return [
			'error' => true,
			'message' => 'Global AI configuration ($nuAIConfig) is not set or is invalid. Please add configuration in nuconfig.php.',
		];
	}

	// If nothing (or an empty array) was passed, use chatgpt as default
	if (empty($aiConfig) || !is_array($aiConfig)) {
		if (!isset($nuAIConfig['chatgpt']) || !is_array($nuAIConfig['chatgpt'])) {
			return [
				'error' => true,
				'message' => 'Default AI configuration ($nuAIConfig[\'chatgpt\']) is not set or is invalid. Please add configuration in nuconfig.php',
			];
		}
		$aiConfig = $nuAIConfig['chatgpt'];
	}

	// Validate config
	if (empty($aiConfig['api_key']) || empty($aiConfig['base_url'])) {
		return [
			'error' => true,
			'message' => 'Invalid AI configuration: api_key and base_url are required.',
		];
	}

	$aiConfig['api_key'] = '123';
	// Endpoint and headers
	$url = $aiConfig['base_url'];
	$headers = [
		"Content-Type: application/json",
		"Authorization: Bearer " . $aiConfig['api_key'],
	];

	// Base payload for chat-completions
	$messages = [
		['role' => 'user', 'content' => $prompt],
	];

	$postDataDefault = [
		'model' => 'gpt-4o',
		'messages' => $messages,
		'max_tokens' => 4000,
		'temperature' => 0.7,
		'top_p' => 1.0,
		'frequency_penalty' => 0.0,
		'presence_penalty' => 0.0,
	];

	// Merge defaults with overrides
	$payload = array_replace($postDataDefault, $postData);

	// Initialize cURL
	$ch = curl_init();
	curl_setopt_array($ch, [
		CURLOPT_URL => $url,
		CURLOPT_POST => true,
		CURLOPT_HTTPHEADER => $headers,
		CURLOPT_POSTFIELDS => json_encode($payload),
		CURLOPT_RETURNTRANSFER => true,
		CURLOPT_TIMEOUT => 15,
		// For local testing only – disable SSL verification
		CURLOPT_SSL_VERIFYPEER => false,
		CURLOPT_SSL_VERIFYHOST => false,
	]);

	// Execute request
	$response = curl_exec($ch);
	$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);

	// cURL error?
	if (curl_errno($ch)) {
		$errorMsg = curl_error($ch);
		curl_close($ch);
		return [
			'error' => true,
			'message' => "Request Error: $errorMsg",
		];
	}
	curl_close($ch);

	// Decode response
	$data = json_decode($response, true);


	if ($httpCode !== 200 || !is_array($data)) {
		$errMessage = $data['error']['message'] ?? 'Unknown error or invalid JSON response';
		return [
			'error' => true,
			'message' => "API Error (HTTP $httpCode): $errMessage",
		];
	}

	// Extract result
	$reply = $data['choices'][0]['message']['content'] ?? 'No response generated.';

	$responseId = $data['id'] ?? null;
	$responseModel = $data['model'] ?? null;
	$usage = $data['usage'] ?? null;

	return [
		'error' => false,
		'reply' => $reply,
		'id' => $responseId,
		'model' => $responseModel,
		'usage' => $usage,
	];

}