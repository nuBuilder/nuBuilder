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

function nuAIPromptParseParamArray($params, $key) {

	$value = $params[$key] ?? [];
	return is_string($value) ? json_decode($value, true, 512, JSON_THROW_ON_ERROR) : $value;

}

function nuAIPromptBuildPromptInformation($params) {

	// Allow JSON strings or arrays
	$tables = nuAIPromptParseParamArray($params, 'tables');
	$languages = nuAIPromptParseParamArray($params, 'languages');
	$scopes = nuAIPromptParseParamArray($params, 'scopes');
	$tags = nuAIPromptParseParamArray($params, 'tags');

	// Deduplicate
	$languages = array_unique($languages);
	$scopes = array_unique($scopes);
	$tags = array_unique($tags);

	$lines = [];

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

	$nuGitHubBase = 'https://raw.githubusercontent.com/nuBuilder/nuBuilder/refs/heads/master/core/';
	$nuWikiBase = 'https://wiki.nubuilder.cloud/index.php?title=';

	$languageMessages = [
		'nuhtml' => "Technology: HTML — nuBuilder templates: [Wiki]({$nuWikiBase}HTML)",

		'nujavascript' => "Use nuBuilder JavaScript functions: " .
			"[Wiki]({$nuWikiBase}Javascript) | " .
			"[nucommon.js]({$nuGitHubBase}nucommon.js) | [nuform.js]({$nuGitHubBase}nuform.js)",

		'nujquery' => 'Technology: jQuery',

		'nuphp' => "Use nuBuilder PDO PHP functions (e.g., nuRunQuery(), db_fetch_array()): " .
			"[Documentation]({$nuWikiBase}PHP) | [nucommon.php]({$nuGitHubBase}nucommon.php) | [nudatabase.php]({$nuGitHubBase}nudatabase.php)",

		'mysql' => "Database: MySQL — [Naming Conventions]({$nuWikiBase}Naming_Conventions)",

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
		'nubrowse_form' => 'Browse Form (client-side JS): place logic that runs when displaying record lists.',
		'nuedit_form' => 'Edit Form (client-side JS): use this to handle events/validation when editing a record.',
		'nuform_custom_code' => 'Form Custom Code (JavaScript only—omit <script> tags): any additional JS to run on forms.',
		'nuphp_procedure' => 'PHP Procedure: for custom server-side logic. Call from JS with nuJavaScriptCallback() or nuRunPHPHidden().',
		'nuphp_bb' => 'PHP Before Browse (BB): execute before listing records. Commonly use nuCreateTableFromSelect().',
		'nuphp_be' => 'PHP Before Edit (BE): runs before loading the Edit form. You can inject JS via nuAddJavaScript().',
		'nuphp_bs' => 'PHP Before Save (BS): validate or modify data server-side before insert/update.',
		'nuphp_bd' => 'PHP Before Delete (BD): validate or prevent deletion server-side.',
		'nuphp_as' => 'PHP After Save (AS): post-save logic (e.g., sending notifications, logging).',
		'nusetup_header' => 'Global Header (server-side PHP/JS): code that should execute on all pages.'
	];

	$hasScope = false;
	foreach ($scopes as $sc) {
		if (isset($scopeMessages[$sc])) {
			if (!$hasScope) {
				$lines[] = '## Context & Scopes';
				$hasScope = true;
			}
			$lines[] = "- Context: {$scopeMessages[$sc]}";
		}
	}
	if ($hasScope) {
		$lines[] = '';  // blank line
	}

	// 4) Tag-specific notes (all topics from documentation)
	$wikiBase = 'https://wiki.nubuilder.cloud/index.php?title=';

	$tagMessages = [
		'nusetup' => ['desc' => 'Setup', 'slug' => 'Setup'],
		'nuinstallation' => [
			'desc' => 'Installation',
			'slug' => 'nuBuilder-Installation-Guide',
			'url' => 'https://github.com/nuBuilder/nuBuilder/wiki/nuBuilder-Installation-Guide'
		],
		'nuupdating' => ['desc' => 'Updating', 'slug' => 'Updating'],
		'nuforms' => ['desc' => 'Forms', 'slug' => 'Forms'],
		'nuobjects' => ['desc' => 'Objects', 'slug' => 'Objects'],
		'nucloner' => ['desc' => 'Cloner', 'slug' => 'Cloner'],
		'nureports' => ['desc' => 'Reports', 'slug' => 'Reports'],
		'nureport_builder' => ['desc' => 'Report Builder', 'slug' => 'Report_Builder'],
		'nureport_designer' => ['desc' => 'Report Designer', 'slug' => 'Report_Designer'],
		'nuprocedures' => ['desc' => 'Procedures', 'slug' => 'Procedures'],
		'nuuser_access' => ['desc' => 'User Access', 'slug' => 'User_Access'],
		'nuusers' => ['desc' => 'Users', 'slug' => 'User_Access'],
		'nu2fa' => ['desc' => 'Two Factor Authentication (2FA)', 'slug' => 'Two_Factor_Authentication_-_2FA'],
		'nufunctions' => ['desc' => 'Functions', 'slug' => 'Functions'],
		'nufile_includes' => ['desc' => 'Custom File Includes', 'slug' => 'Custom_File_Includes'],
		'nusearch' => ['desc' => 'Search', 'slug' => 'Search'],
		'nuitems' => ['desc' => 'Items', 'slug' => 'Items'],
		'nuhash_cookies' => ['desc' => 'Hash Cookies', 'slug' => 'Hash_Cookies'],
		'nutranslations' => ['desc' => 'Translations', 'slug' => 'Translations'],
		'nufiles' => ['desc' => 'Files', 'slug' => 'Files'],
		'nunavigation' => ['desc' => 'Navigation', 'slug' => 'Navigation'],
		'nudatabase' => ['desc' => 'Database', 'slug' => 'Database'],
		'nufile_manager' => ['desc' => 'File Manager', 'slug' => 'File_Manager'],
		'nulogging_activity' => ['desc' => 'Logging Activity', 'slug' => 'Logging_Activity'],
		'nulogging_in' => ['desc' => 'Logging in', 'slug' => 'Login'],
		'nusso' => ['desc' => 'Single sign-on (SSO)', 'slug' => 'Single_sign-on_(SSO)'],
		'nusql_builder' => ['desc' => 'SQL Builder', 'slug' => 'SQL_Builder'],
		'nuformat_builder' => ['desc' => 'Format Builder', 'slug' => 'Format_Builder'],
		'nucsv_transfer' => ['desc' => 'CSV Transfer', 'slug' => 'CSV_Transfer'],
		'nufast_form_builder' => ['desc' => 'Fast Form Builder', 'slug' => 'Form_Builder'],
		'nuaiprompt_generator' => ['desc' => 'Prompt Generator', 'slug' => 'Prompt_Generator'],
	];

	$hasTagHeader = false;

	foreach ($tags as $tag) {
		// now checks the right array
		if (!isset($tagMessages[$tag])) {
			continue;
		}

		if (!$hasTagHeader) {
			$lines[] = '## Topics & References';
			$hasTagHeader = true;
		}

		$entry = $tagMessages[$tag];
		$label = $entry['desc'];
		$url = !empty($entry['url'])
			? $entry['url']
			: $wikiBase . $entry['slug'];

		$lines[] = "- {$label}: {$url}";
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

