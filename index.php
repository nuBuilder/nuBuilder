<?php
$nb_path = __DIR__;

$nuconfig = "nuconfig.php";
if(! is_file($nuconfig)){
    die('nuconfig.php not found. Rename nuconfig-sample.php to nuconfig.php');
}
require_once('nuconfig.php');
require_once('core/nudatabase.php');
require_once('core/nusetuplibs.php');

$config = nuConfigScript();
eval($config['code']);

require_once('core/nuchoosesetup.php');
require_once('core/nuindexlibs.php');

nuImportNewDB();

require_once('core/nusystemupdatelibs.php');

if ( !isset($_SESSION['nubuilder_session_data']['NB_PATH']) || dirname($_SESSION['nubuilder_session_data']['NB_PATH']) != $nb_path ) {

	$_SESSION['nubuilder_session_data']['NB_PATH'] = null;
	nuLoadNewSession();
	header('Location: '.$_SERVER['PHP_SELF']);
	die;

}
?>

<!DOCTYPE html>
<html id="nuhtml" onclick="nuClick(event)">
<head>
<title><?php echo isset($nuConfigTitle) ? $nuConfigTitle : ''?></title>
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta http-equiv='Content-type' content='text/html;charset=UTF-8'>
<meta name="theme-color" content="##00adef">

<?php

function nuInclude($pfile, $type, $refreshCache = true){

	if ($pfile == '') return;

	$a = array();
	if (!is_array ($pfile)) {
		array_push($a, $pfile);
	} else {
		$a = $pfile;
	}

	foreach ($a as $value) {
		$timestamp =  $refreshCache ? date("YmdHis") : 1; //-- Add timestamp so JavaScript changes are effective immediately if $refreshCache is true
		if ($type == 'script') print "<script src='$value?ts=$timestamp' type='text/javascript'></script>\n";
		if ($type == 'stylesheet') print "<link rel='stylesheet' href='$value?ts=$timestamp' />\n";
	}

}

function nuJSIndexInclude($pfile, $refreshCache = true){
	nuInclude($pfile, 'script', $refreshCache);
}

function nuCSSIndexInclude($pfile, $refreshCache = true){
	nuInclude($pfile, 'stylesheet', $refreshCache);
}

function nuJSChartsInclude(){

	global $nuConfigIncludeGoogleCharts;
	global $nuConfigIncludeApexCharts;

	if ($nuConfigIncludeGoogleCharts != false) {
		$pfile = "https://www.gstatic.com/charts/loader.js";
		nuInclude($pfile, 'script');
	}

	if ($nuConfigIncludeApexCharts != false) {
		$pfile = "core/libs/apexcharts/apexcharts.min.js";
		nuInclude($pfile, 'script');
	}
}

function nuEndsWithStyleTag($style) {

	$tag = '</style>';
	$style = trim($style);
	return strpos($style, $tag) === strlen($style) - strlen($tag);

}

function nuHeader(){

	$sql				= "SELECT * FROM zzzzsys_setup WHERE zzzzsys_setup_id = 1 ";
	$rs 				= nuRunQuery($sql);
	$obj 				= db_fetch_object($rs);
	$style				= isset($obj->set_style) ? $obj->set_style : '';
	$style				= '</script>'. (nuEndsWithStyleTag($style) ? $style :  '<style>'.$style.'</style>') . '<script>';
	$HTMLHeader 		= $obj->set_header . $style;
	$j					= "\n\n" . $HTMLHeader . "\n\n";

	return $j;

}

function nuLastLoggedInUser() {
    if(isset($_SESSION['nuLastUser']['user_id'])) {
        return $_SESSION['nuLastUser']['user_id'];
    } else {
        return "";
    }
}

nuJSIndexInclude('core/libs/jquery/jquery-3.6.4.min.js', false);
nuJSIndexInclude('core/nuwysiwyg.js');
nuJSIndexInclude('core/nuformclass.js');
nuJSIndexInclude('core/nuform.js');
nuJSIndexInclude('core/nuformdrag.js');
nuJSIndexInclude('core/nucalendar.js');
nuJSIndexInclude('core/nucommon.js');
nuJSIndexInclude('core/nuadmin.js');
nuJSIndexInclude('core/nureportjson.js');
nuJSIndexInclude('core/nuajax.js');
nuJSChartsInclude();
nuJSIndexInclude('core/libs/ctxmenu/ctxmenu.min.js');
nuJSIndexInclude('core/libs/vanillajs-datepicker/datepicker-full.min.js');
nuJSIndexInclude('core/libs/jquery/jquery-confirm.min.js');
nuCSSIndexInclude('core/libs/uppy/uppy.min.css');
nuJSIndexInclude('core/libs/uppy/uppy.min.js');

nuJSIndexInclude('core/libs/select2/select2.min.js');

if (isset($nuConfigIncludeTinyMCE) && $nuConfigIncludeTinyMCE != false) {
	nuJSIndexInclude('core/libs/tinymce/tinymce.min.js');
}

nuCSSIndexInclude('core/css/nubuilder4.css');


$nuConfigIncludeJS = isset($nuConfigIncludeJS) ? $nuConfigIncludeJS : '';
nuJSIndexInclude($nuConfigIncludeJS);
$nuConfigIncludeCSS = isset($nuConfigIncludeCSS) ? $nuConfigIncludeCSS : '';
nuCSSIndexInclude($nuConfigIncludeCSS);

nuCSSIndexInclude('core/libs/select2/select2.min.css');
nuCSSIndexInclude('core/libs/vanillajs-datepicker/datepicker.min.css');
nuCSSIndexInclude('core/libs/jquery/jquery-confirm.min.css');

?>

<link href="core/libs/fontawesome/css/all.min.css" rel="stylesheet">

<script>

function nuValidCaller(o){

	if(o === null){return false;}
	return o.hasOwnProperty('nuVersion');
}

function nuSSOLoginRequest(u, p) {
  const btn = document.getElementById('submitSSO');
  btn.style.opacity = 0.5;
  btn.style.cursor = "wait";
  location.replace("/sso/login");
}

function nuLoginRequest(u, p){

	$(":submit").nuDisable();

	var w = {
				call_type		: 'login',
				username		: arguments.length == 0 ? $('#nuusername').val() : u,
				password		: arguments.length == 0 ? $('#nupassword').val() : p,
				login_form_id	: nuLoginF,
				login_record_id	: nuLoginR
			};

	w	= JSON.stringify(w);

	$.ajax({
		async		: true,
		dataType	: "json",
		url			: "core/nuapi.php",
		method		 : "POST",
		data		 : {nuSTATE : w
					},
		dataType : "json",
		success	: function(data,textStatus,jqXHR){

			if(nuDisplayError(data)){
				if(data.log_again == 1){location.reload();}
			} else {
				nuForm(data.form_id, data.record_id, data.filter, data.search);
			}
		},
		error		: function(jqXHR,textStatus,errorThrown){

			$(":submit").nuEnable();
			window.test = jqXHR.responseText;

			let err = nuFormatAjaxErrorMessage(jqXHR, errorThrown);
			nuMessage(err);

		},
	});
}

window.nuVersion 		= 'nuBuilder4.5';
window.nuDocumentID		= Date.now();

window.nuHASH				= [];

<?php
    global $nuConfigLogonMode;
    global $nuConfigHideNonSsoLogonExcept;
    $nuConfigLoginScreenTopRow = (isset($nuConfigLoginScreenTopRow)?$nuConfigLoginScreenTopRow:'');
    $loginTopRow            = addslashes($nuConfigLoginScreenTopRow);
	$nuWelcomeBodyInnerHTML	= (isset($nuWelcomeBodyInnerHTML)?$nuWelcomeBodyInnerHTML:'');
	$welcome				= addslashes($nuWelcomeBodyInnerHTML);
	$nuHeader				= nuHeader();
	$graphics				= json_encode(scandir('core/graphics'));
	$nuBrowseFunction		= 'browse';

	function nuSanitize(&$item) {
		$item = htmlspecialchars($item);
	}

	array_walk($_GET, 'nuSanitize');

	$nuUser			 	= $_GET['u'] ?? '';
	$nuPassword		 	= $_GET['p'] ?? '';
	$nuForm			 	= $_GET['f'] ?? '';
	$nuRecord		 	= $_GET['r'] ?? '';
	$nuHome			 	= $_GET['h'] ?? '';

	$opener			 	= $_GET['opener'] ?? '';
	$search			 	= $_GET['search'] ?? '';
	$iframe			 	= $_GET['iframe'] ?? '';
	$target			 	= $_GET['target'] ?? '';
	$like			 	= $_GET['like'] ?? '';
	$nuBrowseFunction	= $_GET['browsefunction'] ?? 'browse';

	$h1								= "
		window.nuLoginU		= '$nuUser';
		window.nuLoginP		= '$nuPassword';
		window.nuLoginF		= '$nuForm';
		window.nuLoginR		= '$nuRecord';
		window.nuLoginH		= '$nuHome';
		window.nuGraphics	= $graphics;
		window.nuIsWindow	= '$iframe';
		window.nuImages		= [];
	";

	$isSession	= isset($_SESSION['nubuilder_session_data']['SESSION_ID']);

	if ( $nuUser != '' && $nuPassword != '' ){
		$h2 = nuUseUP($nuBrowseFunction, $target, $welcome, $nuUser, $nuPassword);
	}else{

		if($opener == ''){
		    $lastUser = nuLastLoggedInUser();
			$onlySsoExcept = (isset($nuConfigSsoOnlyExcept) ? $nuConfigSsoOnlyExcept : array());
		    $h2 = nuGetJS_login($nuBrowseFunction, $target, $loginTopRow, $welcome, $nuForm, $nuRecord, $isSession, $nuConfigLogonMode, $onlySsoExcept, $lastUser);
        } else {
			$h2 = nuGetJS_action_screen($nuBrowseFunction, $target, $welcome, $opener, $search, $like);
	   }

	}

	$sessionAlive = '';

	if (isset($nuConfigKeepSessionAlive) && $nuConfigKeepSessionAlive) {
		$nuConfigKeepSessionAliveInterval = !isset($nuConfigKeepSessionAliveInterval) ? 600 : $nuConfigKeepSessionAliveInterval;
		$sessionAlive = "
		if (nuMainForm()) {

			function nuRunKeepAlive() {
				nuRunPHPHidden('nukeepalive', 0);
			}

			if (sessionStorage.getItem('nukeepalive') === null) {
				var refreshTime = 1000 * $nuConfigKeepSessionAliveInterval; // refresh interval in milliseconds
				var intervalID = setInterval(() => nuRunKeepAlive(), refreshTime);
				sessionStorage.setItem('nukeepalive', intervalID);
			}

		}
		";
	}

	$h3 = isset($nuJSOptions) ? $nuJSOptions : '';

	$h4 = "

	function nuResize(){

		if(typeof window['nuOnBeforeResize'] === 'function'){
			if (nuOnBeforeResize() == false) return;
		}

		$('#nuActionHolder').css('width', '100%');
		$('#nuBreadcrumbHolder').css('width', '100%');
		$('#nuTabHolder').css('width', '100%');
		$('.nuTabTitleColumn').css('width', '100%');
		$('body').css('width', '100%');

		if (window.nuVerticalTabs) {
			nuSetVerticalTabs();
		}

		if(typeof window['nuOnResize'] === 'function'){
			nuOnResize();
		}

	}

	$(document).on('select2:open', (element) => {
		const targetId = element.target.id;
		const searchField = document.querySelector(\"[aria-controls='select2-\"+targetId+\"-results']\");
		searchField.focus();
	});

	document.addEventListener('focus', nuOnFocus, true);

	</script>
	<script id='nuheader'>
		$nuHeader
		$sessionAlive
	</script>
	<script>
	";


	$h = $h1.$h2.$h3.$h4;
	print $h;
?>
</script>

<noscript>
<p style="padding-left: 30px;">It appears that JavaScript is disabled or your browser does not support it.</p>
</noscript>

</head>
<?php
	nuLoadBody();
?>
</body>
</html>
