<?php
	require_once('nuchoosesetup.php');
?>
<!DOCTYPE html>
<html>
<head>
<?php

require_once('nucommon.php');	

nuJSInclude($_SESSION['nubuilder_session_data']['JQ_PATH']);

nuJSInclude('nuformclass.js');
nuJSInclude('nuform.js');
nuJSInclude('nuformdrag.js');
nuJSInclude('nudrag.js');
nuJSInclude('nureportdrag.js');
nuJSInclude('nucalendar.js');
nuJSInclude('nucommon.js');
nuJSInclude('nuajax.js');       //-- calls to server
nuJSInclude('nureportjson.js');

nuCSSInclude('nubuilder4.css');
nuCSSInclude('nudrag.css');


$f		= nuFormatList();
$ft 		= nuFontList();
$tt		= nuTTList($_GET['tt'], $_GET['launch']);				//-- Field list from Temp table
$i		= nuImageList(json_decode($tt));

echo $_SESSION['nubuilder_session_data']['PLUGIN'] ? '<script> var $ = jQuery; </script>' : '';

$h		= "
<script>
	window.nuFormats	= $f;
	window.nuFonts		= $ft;
	window.nuTT			= $tt;
	window.nuImages		= $i;

</script>

";


print $h;


?>


<script>


$(document).ready(function() {
	
	if(window.opener){
		
		if(String(window.opener.document.getElementById('sre_layout').value) == '') {
			window.nuREPORT = window.nuREPORTdefault;
		}else{
			window.nuREPORT = $.parseJSON(window.opener.sre_layout.value);
		}
		
	}else{
		window.nuREPORT 	= window.nuREPORTdefault;
    }
	 
	nuLoadReport();
	
});

function nuStringify(){

    if(window.opener.$('#sre_layout').length == 1){

		window.opener.$('#sre_layout')
		.val(JSON.stringify(window.nuREPORT))
		.change();
		
		alert('Copied to Report Successfully..');

		window.close();

	}else{

		alert('Cannot be saved to Report Form');
		
    }
}



</script>

</head>

<body onscroll="moveToolbar()" style="margin:0px"></body>

</html>
