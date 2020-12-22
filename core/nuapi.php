<?php
	header("Content-Type: application/json");
	header("Cache-Control: no-cache, must-revalidate");
	$_POST['nuSTATE'] = json_decode($_POST['nuSTATE'], JSON_OBJECT_AS_ARRAY);
	require_once('nuconfig.php');
	require_once('nusession.php');
	require_once('nucommon.php');
	require_once('nuform.php'); 
	require_once('nudata.php');
	require_once('nudrag.php');
	require_once('nudatabase.php');

	$_POST['nuCounter']						= rand(0, 999);
	$_POST['nuErrors']						= array();
	$U										= nuGetUserAccess();
	$formAndSessionData						= nuGatherFormAndSessionData($U['HOME_ID']);
	$F										= $formAndSessionData->form_id;
	$R										= $formAndSessionData->record_id;
	$P										= $_POST['nuSTATE'];
	$CT										= $P['call_type'];
	
	$_POST['FORM_ID'] 						= $F;
	$_POST['nuHash']						= array_merge($U, nuSetHashList($P));
	$_POST['nuHash']['PREVIOUS_RECORD_ID'] 	= $R;
	$_POST['nuHash']['RECORD_ID'] 			= $R;
	$_POST['nuHash']['FORM_ID'] 			= $F;
	$_POST['nuHash']['nuFORMdata']			= json_decode(json_encode($_POST['nuSTATE']['nuFORMdata']));		//-- this holds data from an Edit Form
	$_POST['nuHash']['TABLE_ID'] 			= nuTT();
	$_POST['nuHash']['SESSION_ID'] 			= $_SESSION['nubuilder_session_data']['SESSION_ID'];
	$_POST['nuValidate']					= array();
	$_POST['nuCallback']					= '';
	$_POST['nuAfterEvent']					= false;

	$f										= new stdClass;
	$f->forms[0]							= new stdClass;

    if(count($formAndSessionData->errors) == 0){
		
    	if($CT == 'logout')			{nuLogout();}
    	if($CT == 'login')			{nuBeforeEdit($F, $R);$f->forms[0] 	= nuGetFormObject($F, $R, 0, $P);}
    	if($CT == 'getform')		{nuBeforeEdit($F, $R);$f->forms[0] 	= nuGetFormObject($F, $R, 0, $P);}
    	if($CT == 'getphp')			{nuBeforeEdit($F, $R);$f->forms[0] 	= nuGetFormObject($F, $R, 0, $P);}
    	if($CT == 'getreport')		{nuBeforeEdit($F, $R);$f->forms[0] 	= nuGetFormObject($F, $R, 0, $P);}
    	if($CT == 'getlookupid')	{$f->forms[0]				 		= nuGetAllLookupValues();}
    	if($CT == 'getlookupcode')	{$f->forms[0]				 		= nuGetAllLookupList();}
    	if($CT == 'getfile')		{$f->forms[0]->JSONfile		 		= nuGetFile();}
    	if($CT == 'runhiddenphp')	{$f->forms[0]						= nuRunPHPHidden($R);}
    	if($CT == 'runphp')			{$f->forms[0]->id					= nuRunPHP($F);}
    	if($CT == 'runreport')		{$f->forms[0]->id					= nuRunReport($F);}
    	if($CT == 'runhtml')		{$f->forms[0]->id					= nuRunHTML();}
    	if($CT == 'update')			{$f->forms[0]->record_id			= nuUpdateDatabase();}
        if($CT == 'nudragsave')		{$f->forms[0]						= nuDragSave($P);}
    	if($CT == 'systemupdate')	{$f->forms[0]->id					= nuRunSystemUpdate();}
		
    }
	$f->forms[0]->after_event				= $_POST['nuAfterEvent'];
	$f->forms[0]->user_name					= nuUser($U['USER_ID'])->sus_name;
	$f->forms[0]->access_level_id			= $U['USER_GROUP_ID'];
	$f->forms[0]->access_level_code			= $U['ACCESS_LEVEL_CODE'];
	$f->forms[0]->user_id					= $U['USER_ID'];
	$f->forms[0]->database					= $nuConfigDBName;
	$f->forms[0]->dimensions				= $formAndSessionData->dimensions;
	$f->forms[0]->translation				= $formAndSessionData->translation;
	$f->forms[0]->tableSchema				= nuUpdateTableSchema($CT);
	$f->forms[0]->viewSchema				= nuBuildViewSchema($CT);
	$f->forms[0]->formSchema				= nuUpdateFormSchema();
	$f->forms[0]->session_id				= $_SESSION['nubuilder_session_data']['SESSION_ID'];
	

	$f->forms[0]->callback					= $_POST['nuCallback'];
	$f->forms[0]->errors					= $_POST['nuErrors'];
	$f->forms[0]->log_again				    = $_POST['nuLogAgain'];
	$f->forms[0]->global_access				= $_POST['nuHash']['GLOBAL_ACCESS'];
	$f->forms[0]->form_access				= $GLOBALS['nuSetup']->set_denied;
	$f->forms[0]->javascript				= $GLOBALS['EXTRAJS'];
	$f->forms[0]->target					= $P['target'];
	$b										= nuButtons($F, $P);
	
	$f->forms[0]->buttons					= $b[0];
	$f->forms[0]->run_code					= $b[1];
	$f->forms[0]->run_description			= $b[2];
	

	$j								    	= json_encode($f->forms[0]);

	print $j;
?>
