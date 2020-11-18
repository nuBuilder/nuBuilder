<?php	

	require_once('nuchoosesetup.php');
	require_once('nuindexlibs.php');

	if ( !$_SESSION['nubuilder_session_data']['PLUGIN'] ) {
		require_once('nustandalonesetuplibs.php'); 
		nuStandaloneImportNewDB();
	}

	if ( $_SESSION['nubuilder_session_data']['PLUGIN'] && !isset($_SESSION['nubuilder_session_data']['SESSION_ID']) ) {
                require_once('nuwordpresssetuplibs.php');
		nuCheckWPUser();
        }

	require_once('nusystemupdatelibs.php');
	nuMigrateSQL();
?>
<!DOCTYPE html>
<html id="nuhtml" onclick="nuClick(event)">
<head>
<title><?php echo $nuConfigTitle;?></title>
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta http-equiv='Content-type' content='text/html;charset=UTF-8'>
<script type="text/javascript" src="https://www.gstatic.com/charts/loader.js"></script>
<?php

function nuJSIndexInclude($pfile){

    	//$timestamp = date("YmdHis", filemtime($pfile));                                         //-- Add timestamp so javascript changes are effective immediately
	$timestamp = date("YmdHis");
    	print "<script src='$pfile?ts=$timestamp' type='text/javascript'></script>\n";
}

function nuCSSIndexInclude($pfile){

	$timestamp = date("YmdHis", filemtime($pfile));                                         //-- Add timestamp so javascript changes are effective immediately
	print "<link rel='stylesheet' href='$pfile?ts=$timestamp' />\n";
}

function nuHeader(){

	$getHTMLHeaderSQL 	= "SELECT set_header FROM zzzzsys_setup WHERE zzzzsys_setup_id = 1 ";
	$rs 			= nuRunQuery($getHTMLHeaderSQL);
    	$obj 			= db_fetch_object($rs);
    	$HTMLHeader 		= $obj->set_header;
    	$j  			= "\n\n" . $HTMLHeader . "\n\n";
    	return $j;
}

nuJSIndexInclude($_SESSION['nubuilder_session_data']['JQ_PATH']);

nuJSIndexInclude('nuformclass.js');
nuJSIndexInclude('nuform.js');
nuJSIndexInclude('nuformdrag.js');
nuJSIndexInclude('nucalendar.js');
nuJSIndexInclude('nucommon.js');
nuJSIndexInclude('nureportjson.js');
nuJSIndexInclude('nuajax.js');       //-- calls to server
nuJSIndexInclude('fastclick.js');
nuCSSIndexInclude('nubuilder4.css');
?>

<link href="//maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css" rel="stylesheet">

<script>

<?php echo $_SESSION['nubuilder_session_data']['PLUGIN'] ? 'var $ = jQuery;' : ''; ?>

function nuValidCaller(o){
	
	if(o === null){return false;}
	return o.hasOwnProperty('nuVersion');
}
  
function nuHomeWarning(){

	if(window.nuEDITED){
		return nuTranslate('Leave this form without saving ?')+'  '+nuTranslate('Doing this will return you to the login screen.');
	}
	return nuTranslate('Doing this will return you to the login screen.');
}

function nuLoginRequest(u, p){

	var w = {
				call_type		: 'login', 
				username		: arguments.length == 0 ? $('#nuusername').val() : u, 
				password		: arguments.length == 0 ? $('#nupassword').val() : p,
				login_form_id	: nuLoginF,
				login_record_id	: nuLoginR
			};

	w	= JSON.stringify(w);

    $.ajax({
        async    : true,  
        dataType : "json",
        url      : "nuapi.php",
        method   : "POST",
        data     : {nuSTATE : w
					},
        dataType : "json",          
        success  : function(data,textStatus,jqXHR){
			
            if(nuDisplayError(data)){
                if(data.log_again == 1){location.reload();}
            } else {
                window.nuFORM.addBreadcrumb();
                var last            = window.nuFORM.getCurrent();
                last.call_type      = 'getform';
                last.form_id        = data.form_id;
                last.record_id      = data.record_id;
                last.filter         = data.filter;
                last.search         = data.search;

				if(parent['nuHashFromEditForm']===undefined){
					last.hash           = [];
				}else{
					last.hash           = parent.nuHashFromEditForm();
				}
				
                last.FORM           = data.form;
                nuBuildForm(data);
            }
        },
        error    : function(jqXHR,textStatus,errorThrown){
            
            var msg         = String(jqXHR.responseText).split("\n");
            nuMessage(msg);
            window.test = jqXHR.responseText;
            
            nuFormatAjaxErrorMessage(jqXHR, errorThrown);
            
        },
    }); 
}

window.nuVersion 		= 'nuBuilder4';
window.nuDocumentID		= Date.now();

if(parent.window.nuDocumentID == window.nuDocumentID){
	window.onbeforeunload	= nuHomeWarning;
}
window.nuHASH				= [];

<?php
	$nuWelcomeBodyInnerHTML	= (isset($nuWelcomeBodyInnerHTML)?$nuWelcomeBodyInnerHTML:'');
	$welcome				= addslashes($nuWelcomeBodyInnerHTML);
	$nuHeader				= nuHeader();
    $opener         		= '';
    $search             	= '';
    $iframe					= '';
    $target					= '';
	$l 						= scandir('graphics');
	$f  					= JSON_encode($l);
    $nuBrowseFunction 		= 'browse';
	$like					= '';
	$nuUser					= '';
	$nuPassword				= '';
	$nuForm					= '';
	$nuRecord				= '';
	$nuHome					= '';

//-- $_GETS are sanitized in nuchoosesetup.php

	if(isset($_GET['u']))				{$nuUser 		= $_GET['u'];}
	if(isset($_GET['p']))				{$nuPassword 	= $_GET['p'];}
	if(isset($_GET['f']))				{$nuForm 		= $_GET['f'];}
	if(isset($_GET['r']))				{$nuRecord 		= $_GET['r'];}
	if(isset($_GET['h']))				{$nuHome 		= $_GET['h'];}

	if(isset($_GET['opener']))			{$opener 		= $_GET['opener'];}
	if(isset($_GET['search']))			{$search 		= $_GET['search'];}
	if(isset($_GET['iframe']))			{$iframe 		= $_GET['iframe'];}
	if(isset($_GET['target']))			{$target 		= $_GET['target'];}
	if(isset($_GET['like']))			{$like	 		= $_GET['like'];}
	if(isset($_GET['browsefunction']))	{$nuBrowseFunction 	= $_GET['browsefunction'];}

	$h1								= "
	window.nuLoginU							= '$nuUser';
	window.nuLoginP							= '$nuPassword';
	window.nuLoginF							= '$nuForm';
	window.nuLoginR							= '$nuRecord';
	window.nuLoginH							= '$nuHome';
	window.nuGraphics						= $f;
	window.nuIsWindow						= '$iframe';
	window.nuImages							= [];
	";

	if ( $_SESSION['nubuilder_session_data']['PLUGIN'] ) {
			$h1 .= "\nwindow.nuWordpress = true;\n";
			$p	= true;
	} else {
			$h1 .= "\nwindow.nuWordpress = false;\n";
			$p	= false;
	}
	
	$s	= isset($_SESSION['nubuilder_session_data']['SESSION_ID']);



	if ( $nuUser != ''  &&  $nuPassword != '' ){
		$h2 = nuUseUP($nuBrowseFunction, $target, $welcome, $nuUser, $nuPassword);
	}else{
		
		if($p){
			
			if($s){
				$h2 = nuGetJS_action_screen($nuBrowseFunction, $target, $welcome, $opener, $search, $like);
			}else{
				$h2 = nuGetJS_plugin_login($nuBrowseFunction, $target);
			}
			
		}else{
			
			if($opener == ''){
				$h2 = nuGetJS_standalone_login($nuBrowseFunction, $target, $welcome);
			}else{
				$h2 = nuGetJS_action_screen($nuBrowseFunction, $target, $welcome, $opener, $search, $like);
			}
			
		}
	}

	// end choose h2
	
	$h3 = "

	function nuResize(){

		var w = window.innerWidth;
		$('#nuActionHolder').css('width', '100%');
		$('#nuBreadcrumbHolder').css('width', '100%');
		$('#nuTabHolder').css('width', '100%');
		$('.nuTabTitleColumn').css('width', '100%');
		$('body').css('width', '100%');
		
		if (window.nuVerticalTabs) {
			nuSetVerticalTabs();
		}

	}

	</script>
	<script id='nuheader'>
		$nuHeader
	</script>
	<script>
	";

	$h = $h1.$h2.$h3;
	print $h;
?>
</script>
</head>
<?php
	nuLoadBody();
	//nuLoadBody(true);
?>
</body>
</html>
