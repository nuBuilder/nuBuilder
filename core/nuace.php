<?php
	require_once('nuchoosesetup.php');
	$jquery = "libs/jquery/jquery.js"; 	
?>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd">
<html>
<head>
<title>Ace Editor</title>

<script src="<?php echo $jquery; ?>" type="text/javascript"></script>

<script src="libs/ace/ace.js" type="text/javascript" charset="utf-8"></script>
<script src="libs/ace/src-min-noconflict/ace.js" type="text/javascript" charset="utf-8"></script>
<script src="libs/ace/src-min-noconflict/ext-language_tools.js" type="text/javascript" charset="utf-8"></script>
<link rel="stylesheet" href="css/nubuilder4.css">

<script>

window.c = opener.window.nuAce[0];
window.o = opener.window.nuAce[1];
window.t = opener.window.nuFORM.tableSchema;
window.f = opener.window.nuFORM.formSchema;
window.l = $('#' + o, window.opener.document).attr('data-nu-label');

function nuLoad(){

	ace.require("ace/ext/language_tools");
	
	window.editor = ace.edit("nu_editor");
	
	editor.setTheme("ace/theme/monokai");
	editor.setOptions({
		enableBasicAutocompletion: true,
		enableSnippets: true,
		enableLiveAutocompletion: true
	});
	
	editor.on('change', function() {$('#copy_to_nubuilder').css('background-color', 'red');});
	
	window.startValue = opener.window.document.getElementById(window.o).value;
	editor.setFontSize(14);
	var cl			= '';

	var language = window.c.toUpperCase();

	if ( language == 'HTML' ) {editor.getSession().setMode({path:"ace/mode/html", inline:true});cl='html';}
	if ( language == 'JAVASCRIPT' ) {editor.getSession().setMode({path:"ace/mode/javascript", inline:true});cl='js';}	
	if ( language == 'MYSQL' ){editor.getSession().setMode({path:"ace/mode/mysql", inline:true});cl='sql';}
	if ( language == 'PHP' ) {editor.getSession().setMode({path:"ace/mode/php", inline:true});cl='php';}
	if ( language == 'SQL' ) {editor.getSession().setMode({path:"ace/mode/sql", inline:true});cl='sql';}

	document.getElementById('nu_language').innerHTML	= c;

	if($('#' + o, window.opener.document)[0].id == 'deb_message'){
		$('#copy_to_nubuilder').remove();
	}else{
		document.getElementById('copy_to_nubuilder').value	= 'Copy changes back to ' + l;
	}
	
	
	nuResize();
	
	editor.setValue(window.startValue);
	editor.focus();
	editor.navigateFileStart();
	$('#copy_to_nubuilder').css('background-color', '');

}

function nuResize(){

	document.getElementById('nu_editor_pad').style.width	= String(Number(window.innerWidth)) 		+ 'px';
	document.getElementById('nu_editor').style.width		= String(Number(window.innerWidth)) 		+ 'px';
	document.getElementById('nu_editor').style.height		= String(Number(window.innerHeight) - 75) 	+ 'px';
	
}

function nuAceSave(){

	window.nuWarn      = 0;
	
	if(!opener.window.document.getElementById(window.o)){
	
		alert('The opening Form is no longer available.');
		return;
		
	}

	opener.window.document.getElementById(o).value = editor.getValue();

	if ("createEvent" in document) {

		var evt = document.createEvent("HTMLEvents");
		
		evt.initEvent("change", false, true);
		
		opener.window.document.getElementById(window.o).dispatchEvent(evt);
		
	}else{
		opener.window.document.getElementById(window.o).fireEvent("onchange");
	}

	window.close();

}

function nuWarning(){

	if(editor.getValue() != window.startValue && window.nuWarn == 1){
		return "Close this window without Saving?";
	}

}


function nuUpdateDrag(t){
	document.getElementById('nuDrag').value = document.getElementById('nuField')[t.value].innerHTML;
}

function nuChooseFields(){

	var n = document.getElementById('nuTable').value;
	var t = window.s[n];
	var f = document.getElementById('nuField').value;

	document.getElementById('nuDrag').value = t.fields[f];
	
}

function nuChooseSnips(t){
	document.getElementById('nuDrag').value = t.value;
}


window.nuWarn = 1;
window.onbeforeunload = nuWarning;

</script>

</head>
<body onload='nuLoad()' onresize='nuResize()'>

	<input type='button' id='copy_to_nubuilder' class='nuActionButton' style='top:8px;left:8px;position:absolute' onclick='nuAceSave()'>
	
	<span id='nu_language' 	 class="nuNotBreadcrumb" style='top:35px;left:10px;position:absolute;font-wieght:500'></span>
	<div  id='nu_editor_pad' style='width:1000px;height:10px;top:55px;left:0px;text-align:left;position:absolute;background-color:#272822;' ></div>
	<div  id='nu_editor'	 style='width:1000px;height:800px;top:65px;left:0px;text-align:left;position:absolute;' ></div>
	<img  id="nulogo" 		 style="position:absolute;top:5px;right:20px" width="120px" src="graphics/logo.png">
	
</body>
</html> 

