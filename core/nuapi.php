<?php
header("Content-Type: application/json");
header("Cache-Control: no-cache, must-revalidate");

// File Upload
$nuState = $_POST['nuSTATE'] ?? null;

if ($nuState === null && !empty($_FILES["file"])) {
	require_once 'nuupload.php';
	$upload = nuUploadFile();
	if (nuHasErrors()) {
		nuDebug(' <html>' . implode("", $_POST['nuErrors']) . '</html>');
	}
	echo $upload;
	return;
}

// Progress
if ($nuState === null && isset($_GET['progressId']) && !empty($_GET['progressId'])) {
	header("Content-Type: text/plain; charset=UTF-8");
	$progressId = basename($_GET['progressId']);
	if (preg_match('/^[a-zA-Z0-9_\-]+$/', $progressId)) {
		$file = __DIR__ . "/../temp/nu_app_cloner_progress_$progressId.log";
		if (file_exists($file)) {
			echo file_get_contents($file);
		} else {
			echo "No progress yet.";
		}
	} else {
		echo "";
	}

	return;

}

if ($nuState == null) {
	http_response_code(400);
	return;
}

$_POST['nuSTATE'] = json_decode($nuState, true);

require_once '../nuconfig.php';
require_once 'nusecurity.php';
require_once 'nusession.php';
require_once 'nucommon.php';
require_once 'nuform.php';
require_once 'nudata.php';
require_once 'nudrag.php';
require_once 'nudatabase.php';

nuIncludeConfigPHPFiles();

$_POST['nuCounter'] = rand(0, 999);
$_POST['nuErrors'] = [];
$_POST['nuMessages'] = [];

$user = nuGetUserAccess();
$state = $_POST['nuSTATE'];

$_POST['nuHash'] = array_merge($user, nuSetHashList($state));
$callType = $state['call_type'];

$globalAccess = nuGlobalAccess(false);
$refreshCache = nuGetJSONData('REFRESH_CACHE') == '1';

if ($refreshCache && !$globalAccess) {
	nuLoginSetupNOTGlobeadmin(false);
	nuUpdateTableSchema($callType, true);
	nuUpdateFormSchema(true);
}

if (empty($user)) {
	nuDie(nuTranslate('Your session has timed out.'));
}

$formAndSessionData = nuGatherFormAndSessionData($user['HOME_ID'], $globalAccess);
$sessionData = $_SESSION['nubuilder_session_data'];
$formId = $formAndSessionData->form_id;
$recordId = $formAndSessionData->record_id;

if (nu2FAStatusPending($globalAccess, $sessionData, $callType, $recordId, $formId)) {
	nuDisplayError(nuTranslate('Access denied. Authentication Pending.'));
}

if (nuPasswordChangeStatusPending($globalAccess, $sessionData, $callType, $formId)) {
	nuDisplayError(nuTranslate('Access denied. Password Change Pending.'));
}

$_POST['FORM_ID'] = $formId;
$_POST['nuHash']['PREVIOUS_RECORD_ID'] = $recordId;
$_POST['nuHash']['RECORD_ID'] = $recordId;
$_POST['nuHash']['FORM_ID'] = $formId;
$_POST['nuHash']['nuFORMdata'] = json_decode(json_encode(nuObjKey($_POST['nuSTATE'], 'nuFORMdata')));		//-- this holds data from an Edit Form
$_POST['nuHash']['TABLE_ID'] = nuTT();
$_POST['nuHash']['SESSION_ID'] = $sessionData['SESSION_ID'];
$_POST['nuValidate'] = [];
$_POST['nuCallback'] = '';
$_POST['nuRunPHPHidden'] = '';
$_POST['nuAfterEvent'] = false;

$f = new stdClass;
$f->forms = [];
$f->forms[0] = new stdClass;

if (count($formAndSessionData->errors) == 0) {

	if ($callType == 'logout')
		nuLogout();
	elseif ($callType == 'login')
		nuRunLoginProcedure('nu_startup');
	elseif ($callType == 'ssologin')
		nuSsoLoginCheckParams();

	if ($callType == 'getform' || $callType == 'getphp' || $callType == 'login' || $callType == 'getreport') {
		nuBeforeEdit($formId, $recordId);
		$f->forms[0] = nuGetFormObject($formId, $recordId, 0);
	} elseif ($callType == 'getlookupid') {
		$f->forms[0] = nuGetAllLookupValues();
	} elseif ($callType == 'getlookupcode') {
		$f->forms[0] = nuGetAllLookupList();
	} elseif ($callType == 'getfile') {
		$f->forms[0]->JSONfile = nuGetFile();
	} elseif ($callType == 'runhiddenphp') {
		$f->forms[0] = nuRunPHPHidden($recordId);
	} elseif ($callType == 'runphp') {
		$f->forms[0]->id = nuRunPHP($formId);
	} elseif ($callType == 'runreport') {
		$f->forms[0]->id = nuRunReport($formId);
	} elseif ($callType == 'runhtml') {
		$f->forms[0]->id = nuRunHTML();
	} elseif ($callType == 'update') {
		$f->forms[0]->record_id = nuUpdateDatabase();
	} elseif ($callType == 'nudragsave') {
		$f->forms[0] = nuDragSave($state);
	} elseif ($callType == 'systemupdate') {
		$f->forms[0]->id = nuRunSystemUpdate();
	}

}

if ($callType != 'logout') {

	if (isset($f->forms[0])) {

		$f->forms[0]->after_event = nuObjKey($_POST, 'nuAfterEvent');
		$f->forms[0]->user_id = nuObjKey($user, 'USER_ID', null);
		$f->forms[0]->login_name = nuObjKey($user, 'LOGIN_NAME', null);
		$f->forms[0]->user_team = $globalAccess ? '' : nuObjKey($user, 'USER_TEAM', null);
		$f->forms[0]->user_department = $globalAccess ? '' : nuObjKey($user, 'USER_DEPARTMENT', null);
		$f->forms[0]->user_position = $globalAccess ? '' : nuObjKey($user, 'USER_POSITION', null);
		$f->forms[0]->user_code = $globalAccess ? '' : nuObjKey($user, 'USER_CODE', null);
		$f->forms[0]->user_additional1 = $globalAccess ? '' : nuObjKey($user, 'USER_ADDITIONAL1', null);
		$f->forms[0]->user_additional2 = $globalAccess ? '' : nuObjKey($user, 'USER_ADDITIONAL2', null);
		$f->forms[0]->user_permissions = $globalAccess ? '' : nuObjKey($user, 'USER_PERMISSIONS', null);
		$f->forms[0]->user_a11y = $globalAccess ? '' : nuObjKey($user, 'USER_A11Y', null);
		$f->forms[0]->user_name = $globalAccess ? '' : nuUser($user['USER_ID'])->sus_name;
		$f->forms[0]->user_first_name = $globalAccess ? '' : nuObjKey($user, 'USER_FIRST_NAME', null);
		$f->forms[0]->user_last_name = $globalAccess ? '' : nuObjKey($user, 'USER_LAST_NAME', null);
		$f->forms[0]->home_id = $sessionData['HOME_ID'];
		$f->forms[0]->language = $sessionData['language'];

		$f->forms[0]->access_level_id = $user['USER_GROUP_ID'];
		$f->forms[0]->access_level_code = $user['ACCESS_LEVEL_CODE'];
		$f->forms[0]->access_level_group = $user['ACCESS_LEVEL_GROUP'];

		$isDemo = nuDemo(false);
		$f->forms[0]->db_name = $sessionData['DB_NAME'];
		$f->forms[0]->host = $globalAccess && !$isDemo ? $sessionData['HOST'] : '';
		$f->forms[0]->dimensions = $formAndSessionData->dimensions ?? null;
		$f->forms[0]->translation = $formAndSessionData->translation;

		$f->forms[0]->tableSchema = nuUpdateTableSchema($callType, $refreshCache && $globalAccess);
		$f->forms[0]->viewSchema = nuBuildViewSchema();
		$f->forms[0]->formSchema = nuUpdateFormSchema($refreshCache && $globalAccess);

		if ($refreshCache)
			nuSetJSONData('REFRESH_CACHE', '0');

		$f->forms[0]->session_id = $sessionData['SESSION_ID'];
		$f->forms[0]->callback = nuSetGlobalPropertiesJS() . "\n" . nuObjKey($_POST, 'nuCallback');
		$f->forms[0]->run_php = nuObjKey($_POST, 'nuRunPHPHidden');
		$f->forms[0]->errors = nuObjKey($_POST, 'nuErrors');
		$f->forms[0]->messages = nuObjKey($_POST, 'nuMessages');
		$f->forms[0]->errors_validation_title = nuObjKey($_POST, 'nuErrorValidationTitle');

		if ($globalAccess) {
			$f->forms[0]->nu_debug_last = nuGetLastDebugMessages();
			$f->forms[0]->nu_debug = $GLOBALS['ERRORS'] ?? null;
		}

		$f->forms[0]->log_again = nuObjKey($_POST, 'nuLogAgain');
		$f->forms[0]->global_access = $globalAccess ? '1' : '0';
		$f->forms[0]->data_mode = $globalAccess ? null : nuGetFormPermission($formId, 'slf_data_mode');
		$f->forms[0]->form_type_access = $globalAccess ? null : nuGetFormPermission($formId, 'slf_form_type');
		$f->forms[0]->is_demo = $isDemo;
		$f->forms[0]->dev_mode = $globalAccess && isset($nuConfigDevMode) ? (string) ((int) $nuConfigDevMode) : '0';
		$f->forms[0]->remember_me_2fa = $sessionData['2FA_REMEMBER_ME'];
		$f->forms[0]->token_validity_time_2fa = $sessionData['2FA_TOKEN_VALIDITY_TIME'];
		$f->forms[0]->form_access = $GLOBALS['nuSetup']->set_denied;
		$f->forms[0]->javascript = nuObjKey($GLOBALS, 'EXTRAJS');
		$f->forms[0]->style = nuObjKey($GLOBALS, 'STYLE');
		$f->forms[0]->javascript_bc = nuObjKey($GLOBALS, 'EXTRAJS_BC');
		$f->forms[0]->target = nuObjKey($state, 'target');
		$f->forms[0]->timezone = $setup->set_timezone;

		$buttons = nuButtons($formId, $state);
		$f->forms[0]->buttons = $buttons[0];
		$f->forms[0]->run_code = $buttons[1];
		$f->forms[0]->run_description = $buttons[2];

	}
}

$j = json_encode($f->forms[0]);
print $j;
