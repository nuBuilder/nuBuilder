<?php
	header("Content-Type: application/json");
	header("Cache-Control: no-cache, must-revalidate");

	$nuState = isset($_POST['nuSTATE']) ? $_POST['nuSTATE'] : null; 
	if ($nuState == null && !empty($_FILES["file"])) {
		require_once('nuupload.php');
		echo nuUploadFile();
		return;
	}

	if ($nuState == null) {
		http_response_code(400);
		return;
	}	

	$_POST['nuSTATE'] = json_decode($nuState, true);

	require_once('../nuconfig.php');
	require_once('nusecurity.php');
	require_once('nusession.php');
	require_once('nucommon.php');
	require_once('nuform.php');
	require_once('nudata.php');
	require_once('nudrag.php');
	require_once('nudatabase.php');

	if (isset($nuConfigIncludePHP) && $nuConfigIncludePHP != '') {
		if (!is_array($nuConfigIncludePHP)) {
			require_once($nuConfigIncludePHP);
		} else {
			foreach ($nuConfigIncludePHP as $file) {
				require_once($file);
			}
		}
	}

	$_POST['nuCounter']						= rand(0, 999);
	$_POST['nuErrors']						= array();

	$U										= nuGetUserAccess();
	$P										= $_POST['nuSTATE'];

	$_POST['nuHash']						= array_merge($U, nuSetHashList($P));
	$CT										= $P['call_type'];

	$globalAccess 							= nuGlobalAccess(false);
	$refreshCache							= nuGetJSONData('REFRESH_CACHE') == '1';

	if ($refreshCache && !$globalAccess)	{
		nuLoginSetupNOTGlobeadmin(false);
		nuUpdateTableSchema($CT, true);
		nuUpdateFormSchema(true);
	};

	if (empty($U)) nuDie(nuTranslate('Your session has timed out.'));

	$formAndSessionData						= nuGatherFormAndSessionData($U['HOME_ID']);

	$F										= $formAndSessionData->form_id;
	$R										= $formAndSessionData->record_id;

	$_POST['FORM_ID'] 						= $F;

	// 2FA, check authentication status.
	if ((($globalAccess && nuObjKey($_SESSION['nubuilder_session_data'],'2FA_ADMIN')) || (!$globalAccess && nuObjKey($_SESSION['nubuilder_session_data'],'2FA_USER'))) && nuObjKey($_SESSION['nubuilder_session_data'],'SESSION_2FA_STATUS') == 'PENDING') {
		if ($formAndSessionData->form_id != $_SESSION['nubuilder_session_data']['2FA_FORM_ID'] && $CT != 'runhiddenphp') {
			nuDisplayError(nuTranslate('Access denied. Authentication Pending.'));
		}
	}

	$_POST['nuHash']['PREVIOUS_RECORD_ID'] 	= $R;
	$_POST['nuHash']['RECORD_ID'] 			= $R;
	$_POST['nuHash']['FORM_ID'] 			= $F;
	$_POST['nuHash']['nuFORMdata']			= json_decode(json_encode(nuObjKey($_POST['nuSTATE'],'nuFORMdata')));		//-- this holds data from an Edit Form
	$_POST['nuHash']['TABLE_ID'] 			= nuTT();
	$_POST['nuHash']['SESSION_ID'] 			= $_SESSION['nubuilder_session_data']['SESSION_ID'];
	$_POST['nuValidate']					= array();
	$_POST['nuCallback']					= '';
	$_POST['nuAfterEvent']					= false;

	$f										= new stdClass;
	$f->forms[0]							= new stdClass;

	if(count($formAndSessionData->errors) == 0){

		if($CT == 'logout')																	nuLogout();
		if($CT == 'login')																	nuRunLoginProcedure('nuStartup');

		if($CT == 'getform' || $CT == 'getphp' || $CT == 'login' || $CT == 'getreport') {
			nuBeforeEdit($F, $R);$f->forms[0] =												nuGetFormObject($F, $R, 0);
		}

		if($CT == 'getlookupid')			{$f->forms[0]				 					= nuGetAllLookupValues();}
		if($CT == 'getlookupcode')			{$f->forms[0]				 					= nuGetAllLookupList();}
		if($CT == 'getfile')				{$f->forms[0]->JSONfile		 					= nuGetFile();}
		if($CT == 'runhiddenphp')			{$f->forms[0]									= nuRunPHPHidden($R);}
		if($CT == 'runphp')					{$f->forms[0]->id								= nuRunPHP($F);}
		if($CT == 'runreport')				{$f->forms[0]->id								= nuRunReport($F);}
		if($CT == 'runhtml')				{$f->forms[0]->id								= nuRunHTML();}
		if($CT == 'update')					{$f->forms[0]->record_id						= nuUpdateDatabase();}
		if($CT == 'nudragsave')				{$f->forms[0]									= nuDragSave($P);}
		if($CT == 'systemupdate')			{$f->forms[0]->id								= nuRunSystemUpdate();}

	}

	if($CT != 'logout')	{
		$f->forms[0]->after_event				= $_POST['nuAfterEvent'];

		$f->forms[0]->user_id					= nuObjKey($U, 'USER_ID', null);
		$f->forms[0]->login_name				= nuObjKey($U, 'LOGIN_NAME', null);
		$f->forms[0]->user_team					= $globalAccess ? '' : nuObjKey($U, 'USER_TEAM', null);
		$f->forms[0]->user_department			= $globalAccess ? '' : nuObjKey($U, 'USER_DEPARTMENT', null);
		$f->forms[0]->user_position				= $globalAccess ? '' : nuObjKey($U, 'USER_POSITION', null);
		$f->forms[0]->user_code					= $globalAccess ? '' : nuObjKey($U, 'USER_CODE', null);
		$f->forms[0]->user_additional1			= $globalAccess ? '' : nuObjKey($U, 'USER_ADDITIONAL1', null);
		$f->forms[0]->user_additional2			= $globalAccess ? '' : nuObjKey($U, 'USER_ADDITIONAL2', null);
		$f->forms[0]->user_a11y					= $globalAccess ? '' : nuObjKey($U, 'USER_A11Y', null);
		$f->forms[0]->user_name					= $globalAccess ? '' : nuUser($U['USER_ID'])->sus_name;
		$f->forms[0]->home_id					= $_SESSION['nubuilder_session_data']['HOME_ID'];
		$f->forms[0]->language					= $_SESSION['nubuilder_session_data']['language'];

		$f->forms[0]->access_level_id			= $U['USER_GROUP_ID'];
		$f->forms[0]->access_level_code			= $U['ACCESS_LEVEL_CODE'];
		$f->forms[0]->access_level_group		= $U['ACCESS_LEVEL_GROUP'];

		$f->forms[0]->database					= $_SESSION['nubuilder_session_data']['DB_NAME'];
		$f->forms[0]->dimensions				= isset($formAndSessionData->dimensions) ? $formAndSessionData->dimensions : null;
		$f->forms[0]->translation				= $formAndSessionData->translation;

		$f->forms[0]->tableSchema				= nuUpdateTableSchema($CT, $refreshCache && $globalAccess);
		$f->forms[0]->viewSchema				= nuBuildViewSchema();
		$f->forms[0]->formSchema				= nuUpdateFormSchema($refreshCache  && $globalAccess);

		if ($refreshCache) nuSetJSONData('REFRESH_CACHE','0');

		$f->forms[0]->session_id				= $_SESSION['nubuilder_session_data']['SESSION_ID'];

		$f->forms[0]->callback					= nuSetGlobalPropertiesJS()."\n".nuObjKey($_POST,'nuCallback');
		$f->forms[0]->errors					= nuObjKey($_POST,'nuErrors');
		$f->forms[0]->log_again					= nuObjKey($_POST,'nuLogAgain');
		$f->forms[0]->global_access				= $globalAccess ? '1' : '0';
		$f->forms[0]->data_mode					= $globalAccess ? null : nuGetFormPermission($F,'slf_data_mode');
		$f->forms[0]->form_type_access			= $globalAccess ? null : nuGetFormPermission($F,'slf_form_type');
		$f->forms[0]->is_demo					= nuDemo(false);
		$f->forms[0]->remember_me_2fa			= $_SESSION['nubuilder_session_data']['2FA_REMEMBER_ME'];
		$f->forms[0]->token_validity_time_2fa	= $_SESSION['nubuilder_session_data']['2FA_TOKEN_VALIDITY_TIME'];
		$f->forms[0]->form_access				= $GLOBALS['nuSetup']->set_denied;
		$f->forms[0]->javascript				= nuObjKey($GLOBALS,'EXTRAJS');
		$f->forms[0]->style						= nuObjKey($GLOBALS,'STYLE');
		$f->forms[0]->javascript_bc				= nuObjKey($GLOBALS,'EXTRAJS_BC');
		$f->forms[0]->target					= nuObjKey($P,'target');
		$b										= nuButtons($F, $P);

		$f->forms[0]->buttons					= $b[0];
		$f->forms[0]->run_code					= $b[1];
		$f->forms[0]->run_description			= $b[2];

	}

	$j											= json_encode($f->forms[0]);

	print $j;
?>
