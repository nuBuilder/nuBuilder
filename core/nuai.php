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
	// $lines[] = 'You are an AI assistant specialized in nuBuilder Forte development. Generate code snippets and explanations following nuBuilder conventions';
	// $lines[] = 'Use the information below if they are relevant to the prompt. It is provided to help you understand the context and requirements for generating code snippets:';
	// $lines[] = '';  // blank line

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
		'nuhtml' => 'Technology: HTML',
		'nujavascript' => 'Use nuBuilder JS functions: https://wiki.nubuilder.cloud/index.php?title=Javascript',
		'nujquery' => 'Technology: jQuery',
		'nuphp' => 'Use nuBuilder PDO PHP functions (nuRunQuery(), db_fetch_array(), etc.) without PHP tags.',
		'numysql' => 'Database: MySQL',
		'nucss' => 'Technology: CSS',
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
		'nubrowse_form' => 'Context: Browse Form client-side JS.',
		'nuedit_form' => 'Context: Edit Form client-side JS.',
		'nuform_custom_code' => 'Context: Form Custom Code (no <script> tags).',
		'nuphp_procedure' => 'Context: PHP Procedure. Use nuJavaScriptCallback(), nuRunPHPHidden(), etc as appropriate.',
		'nuphp_bb' => 'Context: PHP Before Browse (BB). Use nuCreateTableFromSelect().',
		'nuphp_be' => 'Context: PHP Before Edit (BE). Use nuAddJavaScript() to inject JS.',
		'nuphp_bs' => 'Context: PHP Before Save (BS).',
		'nuphp_bd' => 'Context: PHP Before Delete (BD).',
		'nuphp_as' => 'Context: PHP After Save (AS).',
		'nusetup_header' => 'Context: Global header code (Setup -> Header).',
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
		'nuusers' => 'Users: https://wiki.nubuilder.cloud/index.php?title=User_Access',
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

function nuAIPromptExtractJSON($input) {

	// Match content between ```json and ```
	if (preg_match('/```json\s*(\[.*?\])\s*```/s', $input, $matches)) {
		return $matches[1];
	}

	// If the whole string looks like a JSON array, return it directly
	if (preg_match('/^\s*\[.*\]\s*$/s', $input)) {
		return trim($input);
	}

	return '[]';

}

function nuAIPromptGetTagsFromPrompt($params) {

	$testing = false; // For testing purposes, to return a predefined response. 0 = successful, 1 = error

	$tags = is_string($params['tags'] ?? '') ? json_decode($params['tags'], true, 512, JSON_THROW_ON_ERROR) : ($params['tags'] ?? []);
	$prompt = $params['prompt'] ?? '';

	$instruction = "
		You are given a user message and a fixed list of tags.
		Your job is to pick which tags best represent the **topics** or **concerns** in the message, even if the exact tag text doesn’t appear verbatim.

		## Matching rules:
		2. If the user’s message is asking about that feature area—regardless of exact wording—include the full tag.
		3. Tags are case-insensitive and based on conceptual relevance, not substring matching.

		## Output format:
		- A JSON array of matching tags only.
		- No extra text, comments, or formatting.

		## User message:
		$prompt

		## Tags:

	";

	$instruction = $instruction . implode(",", $tags);

	if ($testing === 1) {
		return [
			'error' => true,
			'message' => "<h3>Error</h3><p>Test error: Simulated error response for testing purposes.</p>"
		];
	} else if ($testing === 0) {
		$response = [
			'error' => false,
			'reply' => '["Objects", "Installation", "Updating", "2FA"]'
		];
	} else {
		$response = nuGetAIResponse($instruction);
	}

	if ($response['error']) {
		return [
			'error' => true,
			'message' => "<h3>Error</h3><p>" . htmlspecialchars($response['message']) . "</p>"
		];
	}

	$array = json_decode(nuAIPromptExtractJSON($response['reply']), true);
	if (json_last_error() !== JSON_ERROR_NONE) {

		return [
			'error' => true,
			'message' => "<h3>Error</h3><p>" . htmlspecialchars("Invalid JSON: " . json_last_error_msg() . "<br>Response:" . $response['reply']) . "</p>"
		];
	}

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

function nuResolveAIConfig($override = null) {

	global $nuAIConfig;

	if (!isset($nuAIConfig) || !is_array($nuAIConfig)) {
		return [
			'error' => true,
			'message' => 'Global AI configuration ($nuAIConfig) is not set or is invalid. Please add configuration in nuconfig.php.',
		];
	}

	$cfg = $override;
	if (empty($cfg) || !is_array($cfg)) {
		if (empty($nuAIConfig['openai']) || !is_array($nuAIConfig['openai'])) {
			return [
				'error' => true,
				'message' => 'Default AI configuration ($nuAIConfig[\'openai\']) is not set or is invalid. Please add configuration in nuconfig.php.',
			];
		}
		$cfg = $nuAIConfig['openai'];
	}

	if (empty($cfg['api_key']) || empty($cfg['base_url'])) {
		return [
			'error' => true,
			'message' => 'Invalid AI configuration: api_key and base_url are required.',
		];
	}

	return [
		'error' => false,
		'config' => $cfg,
	];

}

function nuGetAIResponse($prompt, $aiConfigOverride = '', $postData = []) {

	// Testing:
	// return ['error' => true, 'message' => $prompt];

	$resolved = nuResolveAIConfig($aiConfigOverride);
	if (!empty($resolved['error'])) {
		return $resolved;
	}

	$aiConfig = $resolved['config'];
	$apiKey = $aiConfig['api_key'];
	$url = $aiConfig['base_url'];

	$headers = [
		'Content-Type: application/json',
		'Authorization: Bearer ' . $apiKey,
	];

	$messages = [['role' => 'user', 'content' => $prompt]];

	$defaults = [
		'model' => 'gpt-4o',
		'messages' => $messages,
		'max_tokens' => 4000,
		'temperature' => 0.7,
		'top_p' => 1.0,
		'frequency_penalty' => 0.0,
		'presence_penalty' => 0.0,
	];

	$payload = array_replace($defaults, $postData);

	$ch = curl_init();
	$opts = nuBuildCurlOptions($url, $headers, $payload, 15);
	curl_setopt_array($ch, $opts);

	$response = curl_exec($ch);
	$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
	if (curl_errno($ch)) {
		$err = curl_error($ch);
		curl_close($ch);
		return ['error' => true, 'message' => "Request Error: $err"];
	}
	curl_close($ch);


	$data = json_decode($response, true);
	if ($httpCode !== 200 || !is_array($data)) {
		$msg = $data['error']['message'] ?? 'Unknown error or invalid JSON';
		return ['error' => true, 'message' => "API Error (HTTP $httpCode): $msg"];
	}

	return [
		'error' => false,
		'reply' => $data['choices'][0]['message']['content'] ?? '',
		'id' => $data['id'] ?? null,
		'model' => $data['model'] ?? null,
		'usage' => $data['usage'] ?? null,
	];

}

function nuBuildCurlOptions($url, $headers, $payload = null, $timeout = 15) {

	$opts = [
		CURLOPT_URL => $url,
		CURLOPT_HTTPHEADER => $headers,
		CURLOPT_RETURNTRANSFER => true,
		CURLOPT_TIMEOUT => $timeout,
	];

	if ($payload !== null) {
		$opts[CURLOPT_POST] = true;
		$opts[CURLOPT_POSTFIELDS] = is_string($payload) ? $payload : json_encode($payload);
	} else {
		$opts[CURLOPT_HTTPGET] = true;
	}

	$caBundle = ini_get('curl.cainfo') ?: ini_get('openssl.cafile');
	if ($caBundle) {
		$opts[CURLOPT_SSL_VERIFYPEER] = true;
		$opts[CURLOPT_SSL_VERIFYHOST] = 2;
	} else {
		$opts[CURLOPT_SSL_VERIFYPEER] = false;
		$opts[CURLOPT_SSL_VERIFYHOST] = 0;
	}

	return $opts;

}


function nuAITestCredentials($aiConfigOverride = '') {

	$resolved = nuResolveAIConfig($aiConfigOverride);
	if (!empty($resolved['error'])) {
		return ['success' => false, 'message' => $resolved['error']];
	}
	$apiKey = $resolved['config']['api_key'];
	$url = 'https://api.openai.com/v1/models';

	$headers = [
		'Content-Type: application/json',
		"Authorization: Bearer $apiKey",
	];

	$ch = curl_init();
	$opts = nuBuildCurlOptions($url, $headers, null, 15);
	curl_setopt_array($ch, $opts);

	$resp = curl_exec($ch);
	$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
	$curlErr = curl_errno($ch) ? curl_error($ch) : null;
	curl_close($ch);

	if ($curlErr) {
		return ['success' => false, 'message' => "cURL error: $curlErr"];
	}

	if ($httpCode === 200) {
		return ['success' => true, 'message' => 'Credentials are valid!'];
	}

	$data = json_decode($resp, true);
	$apiMsg = $data['error']['message'] ?? 'Unknown API error';
	return [
		'success' => false,
		'http_code' => $httpCode,
		'message' => $apiMsg,
		'raw' => $resp,
	];

}

