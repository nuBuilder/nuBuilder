window.nuDialog 				= new nuCreateDialog('');
window.nuFORM					= new nuFormObject();
window.nuRESPONSIVE				= new nuResponseForm();
window.nuOnLoad					= null;
window.nuHideMessage			= true;
window.nuDragID					= 1000;
window.nuLastForm				= '';
window.nuNEW					= '';
window.nuColor					= '';
window.nuImage					= '';
window.nuSESSION				= '';
window.nuDRAGLINEVSTART			= '';
window.nuDRAGLINEVID			= '';
window.nuLASTRECORD				= '';
window.nuMESSAGES				= [];
window.nuSAVED					= true;
window.nuImages					= [];
window.nuOPENER					= [];
window.nuSUBFORMROW				= [];
window.nuSUBFORMJSON			= [];
window.nuSCHEMA					= [];
window.nuLANGUAGE				= [];
window.nuFIELD					= [];
window.nuHASH					= [];
window.nuBEFORE					= [];
window.nuAFTER					= [];
window.nuBROWSERESIZE			= {
									x_position				: 0, 
									mouse_down				: false, 
									moving_element			: '', 
									pointer					: '', 
									current_cell_width		: 0, 
									next_cell_left			: 0, 
									array_current_cell_left	: '', 
									last_moved_element		: ''
								};

function nuOpener(t, f, r, filter, parameters){
	
	nuSetSuffix();
	
	this.id					= String(Date.now()) + String(window.nuSuffix);
	this.form_id			= f;
	this.record_id			= r;
	this.type				= t;
	
	if(arguments.length		= 3){
		this.filter			= filter;
	}else{
		this.filter			= '';
	}
	
	if(arguments.length		= 4){
		this.parameters		= parameters;
	}else{
		this.parameters		= '';
	}
	
}

function nuOpenerAppend(t, k) {
	window.nuOPENER[window.nuOPENER.length - 1][t] = k;
}

function nuGetOpenerById(pOPENER, pid) {
	
	for (var i = 0; i < pOPENER.length; i++) {
		if(pOPENER[i].id == pid) {
			return pOPENER[i];
		}
	}
	
	return;
}

function nuRemoveOpenerById(o, pid) {

	for (var i = 0; i < o.length; i++) {
		
		if(o[i].id == pid) {
			o.splice(i,1);
		}
		
	}

}

function nuGetBreadcrumb(bc){

	if(window.nuOnBeforeGetBreadcrumb){
		if (nuOnBeforeGetBreadcrumb(bc) == false) return;
	}
	
	nuCursor('progress');
	
	var a			= arguments.length;
	var e			= nuFORM.edited;
	
	if(a == 0){
		var b		= nuFORM.breadcrumbs.length -1;
	}else{
		var b		= bc;
	}
	
	window.nuTimesSaved		= -1;
	
	if(e && nuFORM.getCurrent().form_type != 'launch'){
		
		if(!confirm(nuTranslate('Leave this form without saving?'))){
			nuCursor('default');
			return;
		}
		
	}

	window.nuFORM.removeAfter(b);
	
	var c					= window.nuFORM.getCurrent();
	
	if(c === undefined){
		$('#nuDragDialog iframe').remove();
	}else{
		nuForm(c.form_id, c.record_id, c.filter, c.search, 1);
	}

	
}

function nuOpenPreviousBreadcrumb(b) {

	// If a popup is open, close it
	if (parent.$('#nuModal').length > 0) {
		nuClosePopup();
		return;
	}

	if (b === undefined) {
		var b = 2; 
	} else {
		b = b + 1;
	}
 
	var l = window.nuFORM.breadcrumbs.length;
	if (l > 1) {
		nuGetBreadcrumb(l - b);
	}
}

function nuDisplayError(e){

	if(e.errors === undefined || e.errors.length == 0){			//-- no error messages
		return false;
	}

	nuMessage(e.errors);

	return e.after_event == false;								//-- errors are really just messages if from after save or after delete.
	
}


function nuFormatAjaxErrorMessage(jqXHR, exception) {

	if (jqXHR.status === 0) {
		return ('Not connected.\nPlease verify your network connection.');
	} else if (jqXHR.status == 404) {
		return ('The requested page not found. [404]');
	} else if (jqXHR.status == 500) {
		return ('Internal Server Error [500].');
	} else if (exception === 'parsererror') {
		return ('Requested JSON parse failed.');
	} else if (exception === 'timeout') {
		return ('Time out error.');
	} else if (exception === 'abort') {
		return ('Ajax request aborted.');
	} else {
		return ('Uncaught Error.\n' + jqXHR.responseText);
	}
}

String.prototype.replaceAll = function(str1, str2, ignore){
	return this.replace(new RegExp(str1.replace(/([\,\!\\\^\$\{\}\[\]\(\)\.\*\+\?\|\<\>\-\&])/g, function(c){return "\\" + c;}), "g"+(ignore?"i":"")), str2);
};

String.prototype.ltrim = function() {
	return this.replace(/^\s+/,"");
}

String.prototype.rtrim = function() {
	return this.replace(/\s+$/,"");
}

String.prototype.nuFormat = function() {
	var args;
	args = arguments;
	if (args.length === 1 && args[0] !== null && typeof args[0] === 'object') {
		args = args[0];
	}
	return this.replace(/{([^}]*)}/g, function(match, key) {
		return (typeof args[key] !== "undefined" ? args[key] : match);
	});
};
// Examples:
// "This is an example from {name}".format({name:"Blaine"});
// "This is an example from {0}".format("Blaine");

$.fn.enterKey = function (fnc) {
	return this.each(function () {
		$(this).keypress(function (ev) {
			var keycode = (ev.keyCode ? ev.keyCode : ev.which);
			if (keycode == '13') {
				fnc.call(this, ev);
			}
		})
	})
}

jQuery.fn.extend({
	nuEnable: function(enable) {
		return this.each(function() {
			nuEnable(this.id, enable);
		});
	},
	nuDisable: function() {
		return this.each(function() {
			nuDisable(this.id);
		});
	},
	nuShow: function(visible) {
		return this.each(function() {
			nuShow(this.id, visible);
		});
	}, 
	nuHide: function() {
		return this.each(function() {
			nuHide(this.id);
		});
	}
});

function loginInputKeyup(event){
	if(event.keyCode == 13){
		$('input#submit').click();
	}
}

function nuLogin(nuconfigNuWelcomeBodyInnerHTML){
	
	var HTML			= String(nuconfigNuWelcomeBodyInnerHTML).trim();
	window.nuSESSION	= '';
	window.nuFORM		= new nuFormObject();
	
	$('body').html('');

	var h 	= `	

			<div id='outer' style='width:100%'>
			<form id='nuLoginForm' action='#' method='post' onsubmit='return false'>
				<div id='login' class='nuLogin'>
					<table>
						<tr>
							<td align='center' style='padding:0px 0px 0px 33px; text-align:center;'>
							<img src='core/graphics/logo.png'><br><br>
							</td>
						</tr>
						<tr>
							<td><div style='width:90px; margin-bottom: 5px;'>Username</div><input class='nuLoginInput' id='nuusername' autocomplete='off' /><br><br></td>
						</tr>
						<tr>
							<td><div style='width:90px; margin-bottom: 5px;'>Password</div><input class='nuLoginInput' id='nupassword' type='password' autocomplete='off' onkeypress='nuSubmit(event)'/><br></td>
						</tr>
						<tr>
							<td style='text-align:center' colspan='2'><br><br>
								<input id='submit' style='width:90px' type='submit' class='nuButton' onclick='nuLoginRequest()' value='Log in'/>
							</td>
						</tr>
					</table>
				</div>
			</form>	
			</div>			
		

	`;
	
	var H	= HTML == '' ? h : HTML
	
	var e	= document.createElement('div');
	
	e.setAttribute('id', 'loginbg');
	
	window.nuLoginU	= window.nuLoginU===undefined?'':window.nuLoginU;
	window.nuLoginP	= window.nuLoginP===undefined?'':window.nuLoginP;

	$('body').html(H);

	if(nuIsMobile()){
		$('body').css('width', 300).css('height', 300)
	}
	
	if(window.nuLoginU == '' && window.nuLoginP == ''){
		$('#nuusername').focus();
	}
	
	if(window.nuLoginU != '' && window.nuLoginP == ''){
		
		$('#nuusername').val(window.nuLoginU);
		$('#nupassword').focus();
		
	}

	if(window.nuLoginU != '' && window.nuLoginP != ''){
		
		$('#nuusername').val(window.nuLoginU);
		$('#nupassword').val(window.nuLoginP);
		
		nuLoginRequest();
		
	}

	if(sessionStorage.logout == 'true'){
		nuMessage(['You have been logged out']);
	}
	
	sessionStorage.logout	= '';
		
}


function nuSubmit(e){

	if(e.keyCode == 13){
		$('#submit').click();
	}
	
}


function nuBuildLookup(t, s, like){

	if($(t).prop('disabled')){return;}

	nuCursor('progress');

	var f				= $('#' + t.id).attr('data-nu-form-id');
	var tar				= $('#' + t.id).attr('data-nu-target');
	var p				= $('#' + t.id).attr('data-nu-prefix');
	window.nuSubformRow	= Number(p.substr(p.length - 3));

	if(arguments.length < 3){
		like			= '';
	}

	window.nuOPENER.push(new nuOpener('F', f, ''));

	var open			= window.nuOPENER[window.nuOPENER.length - 1];
	
	if(parent.window == window){
		window.nuDialog.createDialog(50, 25, 50, 50, '');
	}else{
		window.nuDialog.createDialog(0, 30, 50, 50, '');
	}
	
	$('#nuDragDialog')
	.css('visibility', 'hidden')
	.append('<iframe style="border-style:none;right:5px;top:35px;width:400px;height:400px;position:absolute" id="nuWindow" src="index.php?&opener=' +open.id + '&target=' + tar + '&search=' + s + '&like=' + like + '&browsefunction=lookup&iframe=1"></iframe>');

}

function nuPopup(f, r, filter){

	nuCursor('progress');
	
	if(nuSERVERRESPONSE.global_access == '0' && f == 'nuobject'){return;}	
	if(nuSERVERRESPONSE.objects.length == 0 && r == '-2'){return;}
	
	$('#nuCalendar').remove();
	
	window.nuOPENER.push(new nuOpener('F', f, r, filter));

	var id = window.nuOPENER[window.nuOPENER.length - 1].id;
	
	if(parent.window==window){
		window.nuDialog.createDialog(50, 25, 50, 50, '');
	}else{
		window.nuDialog.createDialog(0, 30, 50, 50, '');
	}
	
	$('#nuDragDialog')
	.css('visibility', 'hidden')
	.append('<iframe style="border-style:none;right:5px;top:35px;width:400px;height:400px;position:absolute" id="nuWindow" src="index.php?opener=' + id + '&browsefunction=browse&iframe=1"></iframe>')
	.prepend('<div id="nuDraggingBox" style="position:absolute; bottom:0px; right:0px; width:20px; height:20px; z-index:200"></div>');
	
}

//-- object for dragging dialog --//

function nuCreateDialog(t){

	this.startX		= 0;
	this.startY		= 0;
	this.moveX		= 0;
	this.moveY		= 0;
	this.title		= t;
	this.pos		= {};
	
	this.move = function(event) {
			
		this.moveX	= event.clientX - this.startX ;
		this.moveY	= event.clientY - this.startY;
		this.startX	= event.clientX;
		this.startY	= event.clientY;
		
		if(event.buttons == 1){	
			this.moveDialog(event);
		}
		
		var dir = event.target.parentElement.baseURI.includes('nureportdesigner') ? '' : 'core/';
		
		if(event.target.id == 'dialogClose'){
			$('#dialogClose').attr("src",dir + "graphics/close_red.png"); 
		}else{
			$('#dialogClose').attr("src",dir + "graphics/close.png"); 
		}
		
	}
	
	this.click = function(event) {
	
		if(event.target.id == 'dialogClose'){

			if($('#nuWindow').contents().find('#nuSaveButton.nuSaveButtonEdited').length > 0){
				
				if(!confirm(nuTranslate('Leave this form without saving?'))){
					return false;
				}
				
			}
			$('#nuDragDialog').remove();
			$('#nuModal').remove();
			$('body').off('.popup');
			
		}
		
	}

	
	this.down = function(event) {
	
		window.nuCurrentID	= event.target.id;
		
		if(event.target.id == 'dialogTitleWords'){
			
			$('#nuDragDialog').append('<div id="nuPopupModal"></div>');
		}
		
	}

	this.moveDialog = function(e){

		if(window.nuCurrentID == 'nuModal'){return;}
		
		var s	= document.getElementById('nuDragDialog');
		if (s === null) return;
		
		var o	= s.style;
		var l	= parseInt(o.left)	+ this.moveX;
		var t	= parseInt(o.top)	+ this.moveY;
		
		if(e.target.classList == '' && e.target.id != 'nuSelectBox'){
			
			o.left	= l + 'px';
			o.top	= t + 'px';
			
		}
		
	}

	this.createDialog = function(l, t, w, h, title) {

		var callerName = this.createDialog.caller.name; 
		nuDialog.dialog = callerName;
		
		var e = document.createElement('div');
		
		var translation	= nuTranslate(title);

		e.setAttribute('id', 'nuDragDialog');

		$('body').append('<div id="nuModal" style="height:' + window.innerHeight + 'px"></div>')
		.append(e);
		
		var subDir = callerName == 'nuPopup' || callerName == 'nuBuildLookup' ? 'core/' : '';
		
		$('#nuDragDialog').addClass('nuDragDialog nuDragNoSelect')
		.css({
			'left'				: l, 
			'top'				: t, 
			'width'				: w, 
			'height'			: h, 
			'background-color'	: '#fff', 
			'z-index'			: 3000, 
			'position'			: 'absolute',
			'visibility'		: 'hidden'
		})
		.html('<div id="dialogTitle" class="nuDialogTitle"><div id="dialogTitleWords">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'+translation+'</div><img id="dialogClose" src="'+subDir+'graphics/close.png" style="position:absolute; top:2px; left:0px"></div>')

		$('body')
		.on('mousemove.popup',	function(event){nuDialog.move(event);})
		.on('click.popup',		function(event){nuDialog.click(event);})
		.on('mousedown.popup',	function(event){nuDialog.down(event);})
		.on('mouseup.popup',	function(event){window.nuCurrentID='';$('#nuPopupModal').remove();})
		.on('dblclick.popup',	function(event){nuResizeWindow(event);})

		this.startX = l;
		this.startY = t;

	}
	
}




function nuReformat(t){

	var o		= $('#' + t.id);
	var f		= o.attr('data-nu-format');
	var v		= o.val();
	
	if(f == '' || v == ''){
		return v;
	}
	
	if(f[0] == 'D'){
			
		var r		= nuFORM.removeFormatting(v, f);
		var a		= nuFORM.addFormatting(r, f);
		
		if(v != a){
			o.val('');
		}

	}
	
	if(f[0] == 'N'){
			
		var a		= nuFORM.addFormatting(v, f);
		o.val(a);

	}
	
}


function nuOpenAce(lang, obj){

	var ts			= new Date().getTime();
	window.nuAce	= [lang, obj];
	
	window.open('core/nuace.php?' + ts);

}


function nuRunIt(t, email, type){

	var r = $('#' + t.id).attr('data-nu-row');
	var c = '000';
	var p = $('#' + r + c).html();
	
	if(arguments.length < 3){										//-- set type
		
		var type	= $('#' + r + '001').html();					//-- report - PDF,or procedure - PHP
		
	}
	
	if(arguments.length == 1){										//-- set email
		
		var email	= 0;
		
	}
	
	var f	= $('#' + t.id).attr('data-nu-primary-key');
	var i	= window.nuFORM.getProperty('record_id');

	if(email == 1){
		
		if(type == 'php'){
			nuEmailPHP(i);
		}
		
		if(type == 'pdf'){
			nuEmailPDF(i);
		}
		
	}else{
		
		if(type == 'php'){
			nuGetPHP(f, p);
		}
		
		if(type == 'pdf'){
			nuGetReport(f, p);
		}
		
	}
		
}

function nuBindCtrlEvents(){

	var nuCtrlKeydownListener = function(e) {

		if (e.keyCode === 114 || (e.ctrlKey && e.keyCode === 70)) { // exclude Ctrl + f
			window.nuNEW = 0;
		} else {
			if (e.keyCode == 17) { //Ctrl
				window.nuNEW = 1;
			}

		}

	}
	
	$(document).keydown(function(e) {
		
		if (e.ctrlKey && e.shiftKey) {

			window.nuNEW = 0;
			
			e.preventDefault();
			
			if(nuFormType() == 'browse') {
			
				if(e.keyCode == 67 && window.global_access) {							//-- c		Searchable Columns
					nuGetSearchList();
				} else if(e.keyCode == 70 && window.global_access) {					//-- f		Form Properties
					nuPopup("nuform", window.nuFORM.getCurrent().form_id);
				} else if(e.keyCode == 79 && window.global_access) {					//-- O		Object List
					nuPopup("nuobject", "", window.nuFORM.getCurrent().form_id);
				} else if(e.keyCode == 68 && window.global_access) {					//-- d		nuDebug Results
					nuPopup("nudebug", "");
				} else if(e.keyCode == 73 && window.global_access) {					//-- i		Form Info
					nuShowFormInfo();
				} else if(e.keyCode == 69 && window.global_access) {					//-- t		Database
					nuStartDatabaseAdmin();		
				} else if(e.keyCode == 85 && window.global_access) {					//-- u		Setup
					nuForm('nusetup','1','', '', 2);						
				} else if(e.keyCode == 83) {											//-- s		Search
					nuSearchAction();
				} else if(e.keyCode == 65 && window.global_access) {					//-- a		Add
					nuAddAction();
				} else if(e.keyCode == 80 && window.global_access) {					//-- p		Print
					nuPrintAction();
				} else if (e.keyCode == 82) {											//-- r		Refresh
					nuGetBreadcrumb();
				}

			}


			if(nuFormType() == 'edit') {
			
				if(e.keyCode == 65 && window.global_access) {							//-- a		Arrange
					nuPopup(window.nuFORM.getCurrent().form_id, "-2");
				} else if(e.keyCode == 70 && window.global_access) {					//-- f		Form Properties
					nuPopup("nuform", window.nuFORM.getCurrent().form_id);
				} else if(e.keyCode == 76 && window.global_access) {					//-- L		Change Login
					nuPopup("nupassword", "5b6bb7108a75efc", "");
				} else if(e.keyCode == 79 && window.global_access) {					//-- O		Object List
					nuPopup("nuobject", "", window.nuFORM.getCurrent().form_id);
				} else if(e.keyCode == 71 && window.global_access) {					//-- G		Object Grid
					nuForm("nuobjectgrid", window.nuFORM.getCurrent().form_id,"", "", 2);
				} else if(e.keyCode == 68 && window.global_access) {					//-- d		nuDebug Results
					nuPopup("nudebug", "");
				} else if(e.keyCode == 85 && window.global_access) {					//-- u		Setup
					nuForm('nusetup','1','', '', 2);										
				} else if(e.keyCode == 73 && window.global_access) {					//-- i		Form Info
					nuShowFormInfo();					
				} else if(e.keyCode == 69 && window.global_access) {					//-- t		Database
					nuStartDatabaseAdmin();					
				} else if (e.keyCode == 82) {											//-- r		Refresh
					nuGetBreadcrumb();
				} else if(e.keyCode == 83) {											//-- s		Save
					$(":focus").blur();
					nuSaveAction();
				} else if(e.keyCode == 67) {											//-- c		Clone
					nuCloneAction();
				} else if(e.keyCode == 98) {											//-- y		Delete
					nuDeleteAction();
				}

			}


			var nosearch = window.nuFORM.getProperty('nosearch_columns');
			var searchIndex = -1;
			
			//Numbers
			if(e.keyCode >= 49 && e.keyCode <= 57) {
				searchIndex = Math.abs(49 - e.keyCode);
			}
				
			if(searchIndex != -1){
				
				if($.inArray(searchIndex,nosearch) != '-1'){
					
					nosearch.pop(searchIndex);
					$('#nusort_' + searchIndex).removeClass('nuNoSearch');					
					
				}else{
					
					nosearch.push(searchIndex);
					$('#nusort_' + searchIndex).addClass('nuNoSearch');
					
				}
				
			}
			
			window.nuFORM.setProperty('nosearch_columns', nosearch);
		}
	});
	
	var nuCtrlKeyupListener = function(e){	
		
		window.nuNEW = 0;
	}
	
	$(document).on('keydown.nubindctrl', nuCtrlKeydownListener);
	
	$(document).on('keyup.nubindctrl', nuCtrlKeyupListener);

}

function nuUnbindDragEvents(){
	$(document).off('.nubindctrl');
}


function nuTranslate(s){

	if (typeof s === 'undefined' || s === '' || s === null) {
		return '';
	}

	var l = nuLANGUAGE.find(elem => elem.english === s);
	return !l ? s : l.translation;

}


function nuIsOpener() {
	
	if(window.opener != null) {
		return true;
	}
	
	return false;
}

function nuPreview(a){

	var	t	= String($('#sfo_type').val());
	var b	= t.indexOf('browse') != -1;
	var f	= nuFORM.getProperty('redirect_form_id');
	var r	= nuFORM.getProperty('record_id');

	if(r == '-1'){

		alert(nuTranslate('Form must be saved first..'));
		return;

	}

	if(arguments.length == 1){
		nuPopup(r, '');
	}else{
		nuPopup(r, '-3');
	}

}

function nuPopPHP(e, nuE){			//-- used in database

	var i = nuFORM.getProperty('record_id');

	if(i == ''){

		alert(nuTranslate('Cannot create Event Until This Form Has Been Saved..'));
		return;
		
	}
	
	nuPopup('nuphp', i + '_' + nuE, 'justphp');

}


function nuPopSQL(e, nuE){			//-- used in database

	var i = nuFORM.getProperty('record_id');

	if(i == ''){

		alert(nuTranslate('Cannot create SQL Until This Form Has Been Saved..'));
		return;
		
	}
	
	nuPopup('nuselect', i + '_' + nuE, 'justsql');

}

function nuPopJS(){				//-- used in database

	var i = $('#sob_all_zzzzsys_form_id').val();
	
	if(i == ''){
		
		alert(nuTranslate('Cannot Create Event Until This Form Has Been Saved..'));
		return;
		
	}
	
	nuPopup('nuform', i, 'justjs');
	
}

function nuGetLookupFields(id){

	var i	= id.substr(0, id.length - 4);
	var o	= $('#' + id);
	var a	= [];
	
	if(o.length == 1){
		
		if(o.attr('data-nu-type') == 'subform'){
			
			a.push(i);
			a.push(id);
			a.push(i + 'description');

		}else{
			a.push('nunosuchfield');
			a.push(id);
			a.push('nunosuchfield');
		}

	}

	return a;
	
}

function nuObjectComponents(i) {

	var o	= [i, 'label_' + i];	
	if ($('#'+ i).attr('data-nu-type') == 'lookup') o.push(i + 'code', i + 'button', i + 'description')
	if ($('#'+ i).hasClass('select2-hidden-accessible')) o.push(i + 'select2');

	return o;

}

function nuEnable(i, enable) {					//-- Enable Edit Form Object

	if(enable === false){
		nuDisable(i);
		return;
	}
	
	a = [];
	if (!$.isArray(i)) {
		a.push(i);
	} else {
		a = i;
	}

	$.each(a, function(index, value) {

		i = a[index];

		var o =	nuObjectComponents(i);
	
		for (var c = 0; c < o.length; c++) {

			if (c === 1) { continue; }		// skip label

			$('#' + o[c])
				.removeClass('nuReadonly')
				.prop('readonly', false)
				.prop('disabled', false);

			if (c == 2) { //-- button

				$('#' + o[c])
					.on("click", function() {
						nuBuildLookup(this, "");
					})

			}
		}
	});

}

function nuReadonly(i){					//-- set Edit Form Object to readonly

	var o =	nuObjectComponents(i);

	for(var c = 0 ; c < o.length ; c++){

		if (c === 1) { continue; }		// skip label

		$('#' + o[c])
		.addClass('nuReadonly')
		.attr('onclick',"return false")
		.prop('readonly', true);

	}

}

function nuDisable(i){					//-- Disable Edit Form Object

	a = [];
	if (!$.isArray(i)) {
		a.push(i);
	} else {
		a = i;
	}

	$.each(a, function(index, value) {

		i = a[index];

		var o = nuObjectComponents(i);

		for (var c = 0; c < o.length; c++) {

			if (c === 1) { continue; }		// skip label

			$('#' + o[c])
				.addClass('nuReadonly')
				.prop('readonly', true)
				.prop('disabled', true);

			if (c == 2) { //-- button

				$('#' + o[c]).off();

			}

		}

	});

}

function nuShow(i, visible){

	if(visible === false){
		nuHide(i);
		return;
	}

	var o =	nuObjectComponents(i);

	for(var c = 0 ; c < o.length ; c++){

		var t	=	String($('#' + o[c]).attr('data-nu-tab'));

		if(t[0] == 'x'){

			$('#' + o[c])
			.attr('data-nu-tab', t.substr(1))
			.show();

		}else{

			$('#' + o[c])
			.show();

		}

	}

	nuOpenTab($('.nuTabSelected')[0].id.substr(5));

}

function nuHide(i){

	var o = nuObjectComponents(i);

	for(var c = 0 ; c < o.length ; c++){

		var t	=	String($('#' + o[c]).attr('data-nu-tab'));

		if(t[0] == 'x'){

			$('#' + o[c])
			.hide();

		}else{

			$('#' + o[c])
			.attr('data-nu-tab', 'x' + t)
			.hide();

		}

	}

}

function nuAddThousandSpaces(s, c){
	return s.replace(/\B(?=(\d{3})+(?!\d))/g, c)
}

function nuDuplicates(arr){

	var s	= arr.slice().sort();
	var d	= [];

	for (var i = 0; i < arr.length - 1; i++) {
		
		if (s[i + 1] == s[i]) {
			d.push(s[i]);
		}

	}

	return d;

}

function nuResizeWindow(e){

	if(e.target.id != 'dialogTitleWords'){return;}

	var d	= $('#nuDragDialog');
	var D	= $('.nuDragOptionsBox');
	var W	= 0;
	var w	= $('#nuWindow');
	var f	= $('#nuDragDialog iframe')[0].contentWindow;
	var l	= parseInt(d.css('left'));

	if(D.length != 0){
		W	= parseInt(D.css('width'));
	}
	
	if(l == 2){
			
		d.css(f.nuDialogSize);
		w.css(f.nuWindowSize);
										
	}else{

		d.css({top:0, left:2, width:window.innerWidth - 30, height:window.innerHeight});
		
		var dh	= parseInt(d.css('height')) - 50;
		var dw	= parseInt(d.css('width')) - W - 10;
		
		w.css({top:30, width:dw, height:dh});
		
	}
	
	window.frames[window.frames.length-1].frameElement.contentWindow.nuResize();
		
}

function nuSubformObject(id){
	return nuFORM.subform(id);
}

function nuGetFunctionList(){

	var f				= '';

	for (var k in window) {

		if (window.hasOwnProperty(k)){
			
			if(String(k).substr(0,2) === 'nu'){
				f += k + "\n";
			}
		
		}

	}

	return f;

}

function nuID(){

	nuSetSuffix();
	
	window.nuUniqueID		= 'c' + String(Date.now());
	
	return window.nuUniqueID + String(window.nuSuffix);

}

function nuSetSuffix(a){
	
	if(arguments.length == 1){
		window.nuSuffix		= a;
	}
		
	if(window.nuSuffix == 9999){
		window.nuSuffix		= 0
	}else{
		window.nuSuffix	++;
	}
	
	
}

function nuWhen(w){

	var nunow	= Date.now();
	var numax	= (Date.now()/1000) - Number(w);
	var numin	= numax;
	var nusec	= String(Math.ceil(numin));
	var nuhtm	= nusec + (nusec==1?' second ago':' seconds ago');

	return nuhtm;

}

function nuSpaces(s){
	return String('&nbsp;').repeat(s);
}

function nuAddEditFieldsToHash(w){

	var d	= nuFORM.data()[0];
	var f	= d.fields;
	var r	= d.rows[0];

	for(i = 2 ; i < f.length ; i++){
		w[f[i]] = r[i];
	}

	return w;

}

function nuClick(e){

	if(!$(e.target).hasClass('nuOptionsItem') && !$(e.target).hasClass('nuSearchCheckbox')){
		$('#nuSearchList').remove();
	}

	if(!$(e.target).hasClass('nuIcon')){
		$('#nuOptionsListBox').remove();
	}

	if(e.target.id != 'nuMessageDiv' && $(e.target).attr('data-nu-option-title')!= 'Help' ){

		if(window.nuHideMessage){
			$('#nuMessageDiv').remove();
		}

		window.nuHideMessage	= true;

	}

	if($(e.target).attr('type') != 'nuDate' && !$(e.target).hasClass('nuCalendar')){
		$('#nuCalendar').remove();
	}

}

function nuAddSlashes(s){
	return (s + '').replace(/[\\"']/g, '\\$&').replace(/\u0000/g, '\\0');
}


function nuOpenTab(i){
	$('#nuTab' + i).click();
}

function nuHideHolders(h){

	for(var i = 0 ; i < arguments.length ; i++){

		if(arguments[i] == 0){$('#nuActionHolder').hide();}
		if(arguments[i] == 1){$('#nuBreadcrumbHolder').hide();}
		if(arguments[i] == 2){$('#nuTabHolder').hide();}

	}

}

function nuRemoveHolders(h){

	for(var i = 0 ; i < arguments.length ; i++){

		if(arguments[i] == 0){$('#nuActionHolder').remove();}
		if(arguments[i] == 1){$('#nuBreadcrumbHolder').remove();}
		if(arguments[i] == 2){$('#nuTabHolder').remove();}

	}

}

function nuAttachFontAwesome(i, c, s) {

	var size = s === undefined ? 'medium' : s;

	var o = '#' + i;
	if (i instanceof jQuery){
		o = i; 
	}

	$(o).prepend('<i style="font-size:' + size + '" class="' + c + '"></i>&nbsp;');

}

function nuAttachFile(j, c){

	if(window.nuGraphics.indexOf(c + '.png') != -1){						//-- check filenames in graphics dir.

		$(j)
		.css('background-image', 'url("graphics/' + c + '.png')
		.css('background-repeat', 'no-repeat')
		.css('padding', '0px 0px 0px 0px')
		.css('text-align', 'left')

		return;

	}

	if(nuImages[c] !== undefined){

		var p				= JSON.parse(g);
		var b				= atob(p.file);

		$(j)
		.css('background-image', 'url("' + b + '")')
		.css('background-repeat', 'no-repeat')
		.css('padding', '0px 0px 0px 0px')
		.css('text-align', 'left')

		return;

	}

}

function nuButtonIcon(j){

	$(j)
	.css('text-align', 'left')
	.css('padding', '0px 0px 0px 35px')
	.css('background-size', '30px')
	.css('background-repeat', 'no-repeat')

}

function nuChart(d, t, a, h, x, y, st, is){

	a				= eval(a);

	try {
		google.charts.load('current', {'packages':['corechart']});	
	} catch(error) {
		return;
	}	

	google.charts.setOnLoadCallback(drawVisualization);

	if(a == ''){return;}

	function drawVisualization() {

		if(a === undefined){return;}

		var data		= google.visualization.arrayToDataTable(a);

		var options = {
			title		: h,
			vAxis		: {title: y},
			hAxis		: {title: x},
			seriesType	: st,
			isStacked	: is,
		};

		var chart		= new google.visualization[t](document.getElementById(d));

		chart.draw(data, options);

	}

}

function nuGetFontName(font) {
	return font.toLowerCase().replace(/\s/g, "-");		// Replace whitespaces
}

function nuQuillFonts(fonts) {

	var fontNames = fonts.map(font => nuGetFontName(font));
	// add fonts to style
	var fontStyles = "";
	fonts.forEach(function(font) {
		var fontName = nuGetFontName(font);
		fontStyles += ".ql-snow .ql-picker.ql-font .ql-picker-label[data-value=" + fontName + "]::before, .ql-snow .ql-picker.ql-font .ql-picker-item[data-value=" + fontName + "]::before {" +
			"content: '" + font + "';" +
			"font-family: '" + font + "', sans-serif;" +
			"}" +
			".ql-font-" + fontName + "{" +
			" font-family: '" + font + "', sans-serif;" +
			"}";
	});

	var node = document.createElement('style');
	node.innerHTML = fontStyles;
	document.body.appendChild(node);
	
	return fontNames;
	
}

function nuQuillToolbarOptions(fontNames) {
	
	var toolbarOptions = [

			['bold', 'italic', 'underline', 'strike'], // toggled buttons
			['blockquote', 'code-block'],
			
			[{ 'header': 1 }, { 'header': 2 }], // custom button values
			[{ 'list': 'ordered' }, { 'list': 'bullet' }],
			[{ 'script': 'sub' }, { 'script': 'super' }], // superscript/subscript
			[{ 'indent': '-1' }, { 'indent': '+1' }], // outdent/indent
			[{ 'direction': 'rtl' }], // text direction

			[{ 'size': ['small', false, 'large', 'huge'] }], // custom dropdown
			[{ 'header': [1, 2, 3, 4, 5, 6, false] }],

			[{ 'color': [] }, { 'background': [] }], // dropdown with defaults from theme
			[{ 'font': fontNames }],
			[{ 'align': [] }],

			['divider'],
			['link'],
	
			['clean'] // remove formatting button

	];
	
	
	return toolbarOptions;
	
}

function nuQuill(i, fontNames, toolbarOptions) {

	if (typeof fontNames === 'undefined') {
		var fontNames = nuQuillFonts(['Arial', 'Courier', 'Garamond', 'Tahoma', 'Verdana']);
	}

	if (typeof toolbarOptions === 'undefined') {
		var toolbarOptions = nuQuillToolbarOptions(fontNames);
	}
		
	nuHide(i);
		
	var Block = Quill.import('blots/block');
	class DivBlock extends Block {} 
	DivBlock.tagName = 'DIV';	
	Quill.register('blots/block', DivBlock, true); 
	
	var Font = Quill.import('formats/font');
	Font.whitelist = fontNames;
	Quill.register(Font, true);

	var quill = new Quill('#'+ i + '_container', {
		modules: {
			toolbar: toolbarOptions,
			divider: {
				cssText: 'border-top: 1px solid #bbb;'
			},
			 clipboard: {
				matchVisual: false
			}

		},
		theme: 'snow'
	});
		
	var content = $('#' + i).val();
	if (content !== '') {
		quill.clipboard.dangerouslyPasteHTML(content);
	}
	
	var startDate = new Date();
	quill.on('text-change', function(delta, oldDelta, source) {
		var endDate = new Date();
		if (endDate.getTime() - startDate.getTime() > 1000) {
			nuHasBeenEdited();
		}
	});

}

function nuQuillGetInstance(i) {

	var container = document.querySelector('#'+ i + '_container');
	var quill = new Quill(container);
	if (Quill.find(container) === quill) {
		return quill;
	} else {
		return null;
	}

}

function nuQuillSetContents(i, contents) {

	var quill = nuQuillGetInstance(i);
	if (quill !== null) {
		if ($.isArray(contents)) {
			quill.setContents(contents);
		} else {
			quill.clipboard.dangerouslyPasteHTML(contents);
		}
	}

}

function nuQuillGetContents(i) {

	var container = document.querySelector('#'+ i + '_container');
	return container.children[0].innerHTML;

}

function nuSubformRowId(t){
	return $(t).parent().attr('data-nu-primary-key');
}

function nuSubformValue(t, id){

	var p	= $(t).attr('data-nu-prefix');

	return $('#' + p + id).val();

}

function nuEncode(s){
	return window.btoa(unescape(encodeURIComponent(s)))
}

function nuDecode(s){
	return decodeURIComponent(escape(window.atob(s)))
}

function nuAddRow(s){

	var o	= nuSubformObject(s);

	var i	= s + nuPad3(o.rows.length - 1) + o.fields[1];

	$('#' + i).change();

	i		= s + nuPad3(o.rows.length) + o.fields[1];

	$('#' + i).focus();

}

function nuAccessLevelCode(){
	return nuSERVERRESPONSE.access_level_code;
}

function nuAccessLevelId(){
	return nuSERVERRESPONSE.access_level_id;
}

function nuUserName(){
	return nuSERVERRESPONSE.user_name;
}

function nuDatabase(){
	return nuSERVERRESPONSE.database;
}

function nuClosePopup(){

	parent.$('#nuModal').remove();
	parent.$('#nuDragDialog').remove();

}

function nuStopClick(e){

	if(window.nuCLICKER != '' && e.ctrlKey == false ){
		$(e.target).prop('onclick',null).off('click');
	}
}

function nuIsSaved(){

	return window.nuSAVED;
}

function nuSortSubform(s, c, e){

	var sf				= [];
	var so				= nuSubformObject(s).fields[c];;
	var h				= 0;
	var t				= false;

	$("[ID^='" + s + "'][ID$='nuRECORD']").each(function( index ){

		var i = this.id;
		var f = this.id.replaceAll('nuRECORD', '');
		h	= parseInt($(this).css('height'));
		t	= $('#' + f + so).hasClass('input_number') || $('#' + f + so).hasClass('input_nuNumber') || $('#' + f + so).hasClass('nuCalculator');
		var v = $('#' + f + so).val();
		var m = $('#' + f + so).attr('data-nu-format')
		var l = $('#' + f + so).hasClass('nuHiddenLookup');

		if(m != ''){
			v = nuFORM.removeFormatting(v, m);
		}

		if(l){
			v = $('#' + f + so + 'code').val();
		}

		var o = {'form' : i, 'value' : v};

		sf.push(o);

	});

	if($(e.target).attr('data-nu-order') == 'asc'){

		if(t){
			var rows				= sf.sort(nuDecendingSortNumberColumn);
		}else{
			var rows				= sf.sort(nuDecendingSortColumn);
		}

		$(e.target).attr('data-nu-order', 'desc');

	}else{

		if(t){
			var rows				= sf.sort(nuAscendingSortNumberColumn);
		}else{
			var rows				= sf.sort(nuAscendingSortColumn);
		}

		$(e.target).attr('data-nu-order', 'asc');

	}

	var top	= 0;

	for(var i = 0 ; i < rows.length ; i++){

		$('#' + rows[i].form).css('top', top);
		top	= top + h;

	}

}

function nuAscendingSortColumn(a, b) {

	if (a.value < b.value){return -1;}
	if (a.value > b.value){return 1;}

	return 0;

}

function nuDecendingSortColumn(b, a) {

	if (a.value < b.value){return -1;}
	if (a.value > b.value){return 1;}

	return 0;

}

function nuAscendingSortNumberColumn(a, b) {

	if (Number(a.value) < Number(b.value)){return -1;}
	if (Number(a.value) > Number(b.value)){return 1;}

	return 0;

}

function nuDecendingSortNumberColumn(b, a) {

	if (Number(a.value) < Number(b.value)){return -1;}
	if (Number(a.value) > Number(b.value)){return 1;}

	return 0;

}

function nuEmbedObject(f, d, w, h){

	if(f == ''){return;}

	if(w === undefined){w = 300;}
	if(h === undefined){h = 300;}

	var ob	= JSON.parse(f);
	var ty	= ob.type;
	var ur	= atob(ob.file);
	var x = document.createElement("EMBED");

	x.setAttribute("type", ty);
	x.setAttribute("src", ur);

	if (w !== -1) x.setAttribute("width", w + "px");
	if (h !== -1) x.setAttribute("height", h + "px");

	$('#' + d).html('');
	document.getElementById(d).appendChild(x);

}

function nuStartDatabaseAdmin() {
	window.open("core/nupmalogin.php?sessid="+window.nuSESSION);
}

function nuIsMobile(){
	return navigator.userAgent.toLowerCase().split('mobile').length > 1
}

function nuTransformScale(){

		if($('body').css('transform') == 'none'){
			return 1;
		}

		return Number($('body').css('transform').split('(')[1].split(',')[0]);

}

function nuSetBrowserColumns(c){

	var r	= $('[data-nu-column="0"]').length;
	var p	= nuTotalWidth('nucell_0_0') - $('#nucell_0_0').width();	//-- padding
	var l	= 7;

	for(var i = 0 ; i < c.length ; i++){

		$('[data-nu-column="' + i + '"]').css({'left' : l, 'width' : c[i]});
		$('#nuBrowseTitle' + i).css({'left' : l, 'width' : c[i]});
		l	= l + c[i] + (c[i] == 0 ? 0 : p);

	}

	$('#nuBrowseFooter').css('width', l-7);

	nuFORM.breadcrumbs[nuFORM.breadcrumbs.length-1].column_widths	= c;

}

function nuStopBrowserResize(){

	if(nuFormType() == 'browse'){
		nuFORM.breadcrumbs[nuFORM.breadcrumbs.length-1].refreshed		= 1;
	}

}

function nuDisableBrowseResize() {

	if (nuFormType() == 'browse') {
	$("div[id^='nuBrowseTitle']")
		.off('mousedown.nuresizecolumn')
		.off('touchstart.nuresizecolumn')
		.off('touchmove.nuresizecolumn')
		.off('touchstart.nuresizecolumn');
	}

}

function nuResizeBrowseColumns(){

	var w	= nuFORM.getCurrent().column_widths;
	var t	= 0;
	var p	= nuTotalWidth('nucell_0_0') - $('#nucell_0_0').width();	//-- padding

	if(nuFORM.getCurrent().refreshed != 0 && nuMainForm()){return;}

	if(nuMainForm()){

		for(var i = 0 ; i < w.length ; i++){
			t = t + w[i];
		}

		for(var i = 0 ; i < w.length ; i++){
			w[i] = parseInt((window.innerWidth - 30) * w[i] / t) - p;
		}

	}else{

		var W	= nuTotalWidth('nuBrowseFooter') + 22;

		$('#nuDragDialog',	window.parent.document).css('width', W + 14);
		$('#nuWindow',		window.parent.document).css('width', W);

		$('body').css('width', W);//.css('padding', '0px 0px 0px 7px');

	}

	if(nuFORM.getCurrent().refreshed != 0){return;}

	nuSetBrowserColumns(w);

}

function nuDragTitleEvents(){

	if(nuFormType() != 'browse'){return;}
	
	var last	= nuFORM.breadcrumbs.length-1;
	
	if(nuFORM.getCurrent().column_widths == 0){
		nuSetBrowserColumns(nuGetColumWidths());
	}else{
		nuSetBrowserColumns(nuFORM.getCurrent().column_widths);
	}

	$('#nubody').on('mousemove.nuresizecolumn',			function(event) {nuDragBrowseColumn(event, 'pointer');});

	$('.nuBrowseTitle').on('mousedown.nuresizecolumn',	function(event) {nuDownBrowseResize(event, 'pointer')});

	$('#nubody').on('mouseup.nuresizecolumn',			function(event) {nuEndBrowseResize();});

	$('.nuBrowseTitle').on('touchstart.nuresizecolumn',	function(event) {nuDownBrowseResize(event, 'finger_touch');});

	$('.nuBrowseTitle').on('touchmove.nuresizecolumn',	function(event) {nuDragBrowseColumn(event, 'finger_touch');});

	$('.nuBrowseTitle').on('touchend.nuresizecolumn',	function(event) {nuEndBrowseResize(event);});

	$('.nuBrowseTitle').on('touchcancel.nuresizecolumn',function(event) {nuEndBrowseResize(event);});

}

function nuGetColumWidths(){

	var a	= [];

	$("div[id^='nuBrowseTitle']").each(function( index ) {
		a.push(parseInt($(this).css('width')));
	});

	return a;

}

function nuDownBrowseResize(e, p){

	e.preventDefault();

	window.nuBROWSERESIZE.mouse_down		= true;
	window.nuBROWSERESIZE.pointer			= p;

	let target = e.target.id.replace('nusort_','nuBrowseTitle');

	window.nuBROWSERESIZE.moving_element	= target;
	window.nuBROWSERESIZE.x_position		= e.clientX;

	$('#' + target).css('background-color',	'#badeeb');

}



function nuEndBrowseResize(e){

	window.nuBROWSERESIZE.mouse_down		= false;
	window.nuBROWSERESIZE.moving_element	= '';
	$('.nuBrowseTitle').css('background-color', '');

}



function nuDragBrowseColumn(e, p){

	e.preventDefault();

//	if (window.nuBROWSERESIZE.mouse_down && window.nuBROWSERESIZE.moving_element == e.target.id){
	if (window.nuBROWSERESIZE.mouse_down){

		window.nuBROWSERESIZE.pointer = p; // added
		var id				= window.nuBROWSERESIZE.moving_element;
		var offset_limit	= 100000000;
		var min_offset		= 2;
		var x				= e.pageX;

		if (window.nuBROWSERESIZE.pointer == "finger_touch"){
			x				= e.changedTouches[0].clientX;
		}

		var x_offset		= x - window.nuBROWSERESIZE.x_position;
		
		window.nuBROWSERESIZE.x_position	= x;

		if (x !== 0 && Math.abs(x_offset) > min_offset){

			x_offset		= x_offset;
			
			if (x_offset < offset_limit){

				var c		= Number(window.nuBROWSERESIZE.moving_element.substr(13));
								
				var m		= nuFORM.breadcrumbs[nuFORM.breadcrumbs.length-1].column_widths[c] + x_offset

				if(m < 40){m=40;}

				nuFORM.breadcrumbs[nuFORM.breadcrumbs.length-1].column_widths[c] = m;
				nuSetBrowserColumns(nuFORM.breadcrumbs[nuFORM.breadcrumbs.length-1].column_widths)

			}else{
				console.log('Offset size exceeds limit');
			}

		}

	} 

}


function nuRemovePX(s){
	return Number(String(s).split('px')[0]);
}


function nuImportCSV(t, s){

	var csv		= String(s).split('\n');
	var	header	= String(c[0]).split(',');
	var inserts	= [];

	for(var i = 1 ; i < c.length ; i++){

		var r	= String(c[i]);
		var c	= nuCSVcolumn(r);

		if(r.substr(0,2) == '"'){
			R.push('"' + r.join('","') + '"');
		}else{

			for(var f = 0 ; f < r.length ; f++){

				if(String(r[f]).substr(0,1) == '"'){

					var Q = f;

					for(var q = f ; q < r.length ; q++){

						if(String(r[q]).substr(String(r[q]).length - 1) != '"'){

							r[f] = r[f] + ',' + r[q];
							r.splice(q,1)

						}

					}

				}

			}

			R.push('"' + r.join('","') + '"');

		}

	}

}

function nuIsIframe(){

	return parent.window.nuDocumentID != window.nuDocumentID;
		
}

// After clicking a nuActionButton (Save, Delete, Print, Clone etc.), disable it for 1.5 secs to prevent a user from double-clicking it.

function nuPreventButtonDblClick () {

	$('.nuActionButton, .nuButton, #nuLogout').not(".nuAllowDblClick").click(function() {

	var id = $(this).attr("id");

	$('#'+id).prop('disabled', true);

	setTimeout(

		function() {
			$('#'+id).prop('disabled', false);
		}
		, 1300);
	});

}

function nuAddBackButton() {

	var b = $('.nuBreadcrumb').length;
	if (b>0){
		nuAddActionButton('BackBtn', nuTranslate('Back'), 'if (!nuFORM.edited) { nuDisable(this.id) }; nuOpenPreviousBreadcrumb();');
	}
	
}

function nuEnableBrowserBackButton() {

	window.history.pushState({page: 1}, "", "");
	window.onpopstate = function(event) {
		if(event){
			nuOpenPreviousBreadcrumb();
		}
	}
	
}

function nuSetBrowserTabTitle(prefix) {
	
	var t = window.nuFORM.getProperty('title');
	if (t === '') {
		t = "Properties";
	}
	prefix = prefix === '' ? '' : prefix + ' - ';
	document.title = prefix + t;
	
}

function nuBrowseTitleMultiLine() {
		
	$('#nuActionHolder').css({'height': '40px'});
	$('.nuBrowseTitle').css('top', "-20px");
}


function nuSetBrowseColumnWidth(column, width) {

	var cw = this;
	if (nuIsIframe()) {
		cw = parent.$("#" + window.frameElement.id)[0].contentWindow;
	}
	cw.nuFORM.breadcrumbs[cw.nuFORM.breadcrumbs.length - 1].column_widths[column] = width;
	cw.nuSetBrowserColumns(cw.nuFORM.breadcrumbs[cw.nuFORM.breadcrumbs.length - 1].column_widths);
	
}

function nuBrowseAdditionalNavButtons() {

	if (nuFormType() == 'browse') {

		var disabled = {
			'opacity': '0.3',
			'pointer-events': 'none'
		};

		var currentPage = Number($('#browsePage').val());
		var lastPage = nuCurrentProperties().pages;

		var html = '<span id="nuFirst" class="nuBrowsePage"><i class="fa fa-step-backward" style="font-size: 16px" onclick="nuGetPage(0)">&nbsp;&nbsp;&nbsp;&nbsp;</i></span>';
		$(html).insertBefore("#nuLast");

		html = '<span id="nuEnd" class="nuBrowsePage">&nbsp;&nbsp;&nbsp;&nbsp;<i class="fa fa-step-forward nuBrowsePage" style="font-size: 16px" onclick="nuGetPage(' + lastPage + ')"></i></span>';
		$(html).insertAfter("#nuNext");


		if (currentPage == 1) {
			$('#nuFirst').css(disabled);
			$('#nuLast').css(disabled);
		}

		if (currentPage == lastPage) {
			$('#nuNext').css(disabled);
			$('#nuEnd').css(disabled);
		}
	}

}

function nuPrintEditForm() {

	$('#nuBreadcrumbHolder').hide();
	$('#nuTabHolder').hide();
	$('.nuActionButton').hide();

	window.onafterprint = function(e){
		$(window).off('mousemove', window.onafterprint);

		$('#nuBreadcrumbHolder').show();
		$('#nuTabHolder').show();
		$('.nuActionButton').show();
	};

	window.print();

	setTimeout(function(){
		$(window).one('mousemove', window.onafterprint);
	}, 1);

}

function nuSetPlaceholder(i, placeholder, translate) {

	var f = $('#'+i);

	if (typeof translate === 'undefined') {
		var translate = true;
	}

	if (typeof placeholder === 'undefined') {	
		 placeholder = f.attr('data-nu-format').substring(2);
	} else {
		placeholder = translate ? nuTranslate(placeholder) : placeholder;
	}	
		
	f.attr("placeholder", placeholder);
	
}

function nuSetToolTip(i, message, labelHover) {

	// Show tooltip on object hover
	$("#" + i).hover(function() {
		$(this).attr("title", message);
	});

	if (labelHover === true) {
		// Show tooltip on label hover
		$("#label_" + i).hover(function() {
			$(this).attr("title", message);
		});
	}
}

function nuAddDatalist(i, a) {
	
	if (!$.isArray(a)) {
		console.error('Argument #2 is not an array in nuAddDatalist()');
		return;
	}
	
	var datalist = document.createElement('datalist');
	datalist.id = "datalist" + i;
	document.body.appendChild(datalist);
	a.forEach(function (data) {
	
		var option = document.createElement('option');		

		option.value =	$.isArray(data) ? data[0]: data;
		if (data.length == 2) option.text =	$.isArray(data) ? data[1]: data;
		datalist.appendChild(option);
	});
	$('#' + i).attr('list', datalist.id).attr('autocomplete', 'off');
	
}

function nuLabelOnTop(f, e) {

	for (var i = 0; i < f.length; i++) {
		if (jQuery.inArray(f[i], e) == -1) {

			$('#' + 'label_' + f[i]).css({
					'top': parseInt($('#'+f[i]).css("top")) - 18
				, 'left': parseInt($('#'+f[i]).css("left"))
				, 'text-align': 'left'
			})
		}
	}
}

jQuery.fn.nuLabelOnTop = function (offsetTop = -18, offsetLeft = 0) {

	return this.each(function () {
		$('#' + 'label_' + this.id).css({
			'top': parseInt($(this).css("top")) + offsetTop
			, 'left': parseInt($(this).css("left")) + offsetLeft
			, 'text-align': 'left'
		})
	});

};

jQuery.fn.cssNumber = function(prop) {

	var v = parseInt(this.css(prop), 10);
	return isNaN(v) ? 0 : v;

};

function nuEnableDisableAllObjects(v, excludeTypes, excludeIds) {

	if (typeof excludeTypes === 'undefined') {
		let excludeTypes = [];
	}

	if (typeof excludeIds === 'undefined') {
		let excludeIds = [];
	}

	var r = JSON.parse(JSON.stringify(nuSERVERRESPONSE));
	for (var i = 0; i < r.objects.length; i++) {
		let obj = r.objects[i];

		if ($.inArray(obj.type, excludeTypes) == -1 && $.inArray(obj.id, excludeIds) == -1 ) {
			nuEnable(obj.id, v);
		}
	}

}

function nuEnableAllObjects(excludeTypes, excludeIds) {

	 nuEnableDisableAllObjects(true, excludeTypes, excludeIds);
 
}

function nuDisableAllObjects(excludeTypes, excludeIds) {

	nuEnableDisableAllObjects(false, excludeTypes, excludeIds);

}

function nuInsertTextAtCaret(i, text) {

	var o = $('#'+ i);
	
	const textarea = o[0];
	
	textarea.setRangeText(
		text,
		textarea.selectionStart,
		textarea.selectionEnd,
		'end'		
	);
	
	o.change();

}

function nuObjectIdFromId(i) {

	if (i !== null) {

		var f = window.nuSERVERRESPONSE;
		var objId;
		for (var o = 0; o < f.objects.length; o++) {
			if (f.objects[o].id == i) {
				objId = f.objects[o].object_id;
				return objId;
			}
		}
	}

	return null;
}

 /*
 * Set the column size of a Browse Screen
 *
 * @param	{int}	column	- Column number (first column = 0, second column = 1 etc.)
 * @param	{int}	size		- Size in pixels
 */
function nuSetBrowseColumnSize(column, size) {

	var cw = this;
	if (nuIsIframe()) {
		cw = parent.$("#" + window.frameElement.id)[0].contentWindow;
	}
	cw.nuFORM.breadcrumbs[cw.nuFORM.breadcrumbs.length - 1].column_widths[column] = size;
	cw.nuSetBrowserColumns(cw.nuFORM.breadcrumbs[cw.nuFORM.breadcrumbs.length - 1].column_widths)

}

function nuCreateAppendHTML(htmlStr) {

	var df = document.createDocumentFragment()
		, temp = document.createElement('div');
	temp.innerHTML = htmlStr;
	while (temp.firstChild) {
		df.appendChild(temp.firstChild);
	}
	return df;
}

function nuSelectMultiWithoutCtrl(i) {

	i = i === undefined ? 'select' : '#' + i;
	$(i + "[multiple] option").mousedown(function (event) {

	 if (event.shiftKey) return;
	 event.preventDefault();
	 this.focus();
	 var scroll = this.scrollTop;
	 event.target.selected = !event.target.selected;
	 this.scrollTop = scroll;
	 $(this).parent().change();

	});

}

function nuPasteText(t) {

	navigator.clipboard.readText()
		.then(text => {
			$('#' + t).val(text);
		});

}

function nuRefreshSelectObject(selectId, formId) {

	if (typeof formId === 'undefined') {
		var formId = '';
	}

	nuSetProperty('nurefreshselectobject_selectid',selectId);
	nuSetProperty('nurefreshselectobject_formid',formId);
	nuRunPHPHidden('nurefreshselectobject', 0);
}

function nuRefreshDisplayObject(displayId, formId) {

	if (typeof formId === 'undefined') {
		var formId = '';
	}

	nuSetProperty('nurefreshdisplayobject_displayid',displayId);
	nuSetProperty('nurefreshdisplayobject_formid',formId);
	nuRunPHPHidden('nurefreshdisplayobject', 0);
}

function nuCursor(c) {

	document.documentElement.style.cursor = c;
	parent.document.documentElement.style.cursor = c;

}

/*	*** Based on highlight v5: Highlights arbitrary terms.
	*** Renamed to nuHighlight using the className nuBrowseSearch
	*** <http://johannburkard.de/blog/programming/javascript/highlight-javascript-text-higlighting-jquery-plugin.html>
	*** MIT license.
	*** Johann Burkard <http://johannburkard.de> / <mailto:jb@eaio.com>
*/

jQuery.fn.nuHighlight = function(pat) {
	function innerHighlight(node, pat) {
		var skip = 0;
		if (node.nodeType == 3) {
			var pos = node.data.toUpperCase().indexOf(pat);
			pos -= (node.data.substr(0, pos).toUpperCase().length - node.data.substr(0, pos).length);
			if (pos >= 0) {
				var spannode = document.createElement('span');
				spannode.className = 'nuBrowseSearch';
				var middlebit = node.splitText(pos);
				var endbit = middlebit.splitText(pat.length);
				var middleclone = middlebit.cloneNode(true);
				spannode.appendChild(middleclone);
				middlebit.parentNode.replaceChild(spannode, middlebit);
				skip = 1;
			}
		} else if (node.nodeType == 1 && node.childNodes && !/(script|style)/i.test(node.tagName)) {
			for (var i = 0; i < node.childNodes.length; ++i) {
				i += innerHighlight(node.childNodes[i], pat);
			}
		}
		return skip;
	}
	return this.length && pat && pat.length ? this.each(function() {
		innerHighlight(this, pat.toUpperCase());
	}) : this;
};
