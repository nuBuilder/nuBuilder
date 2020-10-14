
function nuAjax(w,successCallback,errorCallback){

	w	= nuAddEditFieldsToHash(w);
	
	w	= JSON.stringify(w);
	
 	$.ajax({

		async    : true,  
		dataType : "json",
		url      : "nuapi.php",
		method   : "POST",
		data     : {nuSTATE : w},
		dataType : "json",			
		success	 : function(data,textStatus,jqXHR){
				successCallback(data,textStatus,jqXHR);
		},
		error    : function(jqXHR,textStatus,errorThrown){
			
			var msg			= String(jqXHR.responseText).split("\n");
 			nuMessage(msg);
			window.test = jqXHR.responseText;

			if (errorCallback !== undefined) {
				errorCallback(jqXHR,textStatus,errorThrown);
			}
			
			nuFormatAjaxErrorMessage(jqXHR, errorThrown);
			
		},

		complete: function(jqXHR,textStatus){
			//--
		}
		
	});    

}

function nuForm(f, r, filter, search, n, like){
	
	if(n == 2){
		
		window.nuNEW	= 1;
		search			= '';
		
	}

	if(like==undefined){
		like 			= '';
	}else{
		like 			= nuDecode(like);
	}
	
	if(nuOpenNewBrowserTab('getform', f, r, filter)){return;}

	var u 				= '';
	var p 				= '';
	var s				= '';
		
	if(n != 1){   //-- add a new breadcrumb
		window.nuFORM.addBreadcrumb();
	}

	var current					= window.nuFORM.getCurrent();
	current.search				= search;
	
	if(current.filter == ''){
		
		if(filter != ''){
			current.filter 		= filter;
		}else{
			
			if(window.nuFILTER != ''){
				current.filter 	= window.nuFILTER;
			}
			
		}
		
	}
	
	var last	 		= $.extend(true, {}, current);

	last.call_type		= 'getform';
	last.form_id 		= f;
	last.record_id		= r;
	last.filter 		= filter==''?window.nuFILTER:filter;
	last.search 		= search;

	if(parent['nuHashFromEditForm']===undefined){
		last.hash           = [];
	}else{
		last.hash           = parent.nuHashFromEditForm();
	}

//    last.hash	 		= parent.nuHashFromEditForm();
    last.AAA	 		= 'hw';
    last.like	 		= like;

	var successCallback = function(data,textStatus,jqXHR){

		var fm 			= data;

		if(nuDisplayError(fm)){

			parent.$('#nuModal').remove();
			nuFORM.breadcrumbs.pop();
			
			if(fm.log_again == 1){location.reload();}
		
		}else{
			
			var last		= window.nuFORM.getCurrent();
			last.record_id	= fm.record_id;
			last.FORM 		= fm.form;

			nuBuildForm(fm);
			
		}
     };

	nuAjax(last,successCallback);
	
}


function nuGetReport(f, r){

	if(nuOpenNewBrowserTab('getreport', f, r, '')){return;}

	var last			= window.nuFORM.addBreadcrumb();

	last.session_id 	= window.nuSESSION;
	last.call_type 		= 'getreport';
	last.form_id 		= f;
	last.record_id		= r;

	if(parent['nuHashFromEditForm']===undefined){
		last.hash           = [];
	}else{
		last.hash           = parent.nuHashFromEditForm();
	}
	
//	last.hash 			= parent.nuHashFromEditForm();

	var successCallback = function(data,textStatus,jqXHR){
	
		var fm  = data;
		
		if(!nuDisplayError(fm)){
			nuBuildForm(fm);
		}
			
	}
		
     nuAjax(last, successCallback);
		
}


function nuRunReport(f, iframe){

	var current			= nuFORM.getCurrent();
	var last	 		= $.extend(true, {}, current);

	last.session_id 	= window.nuSESSION;
	last.call_type		= 'runreport';
	last.form_id		= f;
	last.hash 			= parent.nuHashFromEditForm();

	var successCallback = function(data,textStatus,jqXHR){
		
		var fm 			= data;
		
		if(!nuDisplayError(fm)){
			
			var pdfUrl	= 'nurunpdf.php?i=' + fm.id;
			
			if(iframe === undefined){
				window.open(pdfUrl);
			}else{
				parent.$('#'+ iframe).attr('src', pdfUrl);
			}
			
		}
		
	}
	
	nuAjax(last,successCallback);
	
}

function nuRunReportSave(f){

	var current   			= nuFORM.getCurrent();
	var last                = $.extend(true, {}, current);
	last.session_id         = window.nuSESSION;
	last.call_type          = 'runreport';
	last.form_id			= f;
	last.hash				= nuHashFromEditForm();
	var successCallback		= function(data,textStatus,jqXHR){
		
		var fm				= data;
		
		if(!nuDisplayError(fm)){

			var fd 			= new FormData();
			fd.append('ID', fm.id);
			var xhr 		= new XMLHttpRequest();
			xhr.open('POST', 'nurunpdf.php', true);
			xhr.send(fd);
			
		}
		
	};
	
	nuAjax(last,successCallback);

}

function nuLogout(f, iframe){

	nuFORM.addBreadcrumb();

	var last			= nuFORM.getCurrent();

	last.session_id 	= window.nuSESSION;
	last.call_type		= 'logout';
	
	var successCallback = function(data,textStatus,jqXHR){
		
		var fm 			= data;
		
		if(!nuDisplayError(fm)){
			window.open('index.php', '_self');
		}
		
	}
	
	nuAjax(last,successCallback);
	
}



function nuGetPHP(f, r){

	if(nuOpenNewBrowserTab('getphp', f, r, '')){return;}

	window.nuFORM.addBreadcrumb();

	var current			= nuFORM.getCurrent();
	var last	 		= $.extend(true, {}, current);

	last.session_id 	= window.nuSESSION;
	last.call_type 		= 'getphp';
	last.form_id 		= f;
	last.record_id		= r;

	if(parent['nuHashFromEditForm']===undefined){
		last.hash           = [];
	}else{
		last.hash           = parent.nuHashFromEditForm();
	}
	
//	last.hash 			= parent.nuHashFromEditForm();

	var successCallback = function(data,textStatus,jqXHR){
		
		var fm  		= data;
		
		if(!nuDisplayError(fm)){

			nuFORM.setProperty('record_id', fm.record_id);
			nuBuildForm(fm);
			
		} else {
			window.nuFORM.breadcrumbs.pop();
		}
	}
	
	nuAjax(last, successCallback);
	
}


function nuRunPHP(pCode, iframe, rbs){

	if(arguments.length < 3 ){
		
		if(window.nuBeforeSave){
			if(nuBeforeSave() === false ){return;}
		}
		
	}

	var current				= nuFORM.getCurrent();
	var last		 		= $.extend(true, {}, current);
	
	last.session_id			= nuSESSION;
	last.call_type 			= 'runphp';
	last.form_id 			= pCode;
	last.nuFORMdata			= nuFORM.data();
	
	if(nuFORM.getCurrent() === undefined){
		
		last.record_id 		= parent.nuFORM.getCurrent().record_id;

		if(parent['nuHashFromEditForm']===undefined){
			last.hash       = [];
		}else{
			last.hash       = parent.nuHashFromEditForm();
		}
		
//		last.hash 			= parent.nuHashFromEditForm();
		
	}else{

		last.record_id 		= nuFORM.getCurrent().record_id;
		last.hash 			= nuHashFromEditForm();
		
	}
	
	var successCallback 	= function(data,textStatus,jqXHR){
		
		var fm				= data;
		
		if(!nuDisplayError(fm)){
			
			var pdfUrl		= 'nurunphp.php?i=' + fm.id;
			
			if(iframe === undefined || iframe === ''){
				window.open(pdfUrl);
			}else{
				parent.$('#' + iframe).attr('src', pdfUrl);
			}
			
		}
		
	};
	
	nuAjax(last,successCallback);
	
}


function nuRunPHPHidden(i, rbs){

	if(arguments.length == 1){
		
		if(window.nuBeforeSave){
			if(nuBeforeSave() === false ){return;}
		}
		
	}

	var current				= nuFORM.getCurrent();
	var last		 		= $.extend(true, {}, current);

	last.session_id			= window.nuSESSION;
	last.call_type 			= 'runhiddenphp';
	last.form_id  			= 'doesntmatter';
	last.hash_record_id		= last.record_id;
	last.record_id			= i;								//-- php code
	last.nuFORMdata			= nuFORM.data();
	last.hash  				= nuHashFromEditForm();
//	last.HIDDEN_ID			= arguments.length == 2 ? h : '';
	
	var successCallback 	= function(data,textStatus,jqXHR){
		
		var fm				= data;
		
		if(nuDisplayError(fm)){return;};

		window.nuSERVERRESPONSE_HIDDEN	= fm;
		eval(fm.callback + ';');
		
	};
	
	nuAjax(last,successCallback);
	
}


function nuSystemUpdate(){
	
	var mess				= nuTranslate("Update system? Be sure to backup first.");
    if(confirm(mess) == false){return;}
	
	var current				= nuFORM.getCurrent();
	var last		 		= $.extend(true, {}, current);
	
	last.session_id			= nuSESSION;
	last.call_type 			= 'systemupdate';
	last.form_id 			= 'systemupdate';
	last.nuFORMdata			= nuFORM.data();
	last.hash  				= nuHashFromEditForm();
	
	var successCallback 	= function(data,textStatus,jqXHR){
		
		var fm				= data;
		
		if(!nuDisplayError(fm)){
			
			var pdfUrl		= 'nusystemupdate.php?i=' + fm.id;
			window.open(pdfUrl);
			
		}
		
	};
	
	nuAjax(last,successCallback);
	
}



function nuAttachImage(i, c){
	
	c						= String(c).toLowerCase();
	var imgID				= 'image_' + i;
	var w					= $('#' + i).css('width');
	var h					= $('#' + i).css('height');

	
	$('#' + i).html('<img id="' + imgID + '" class="nuBrowseImage" width="' + w + '" height="' + h + '" src="">');

	if(window.nuGraphics.indexOf(c + '.png') != -1){						//-- check filenames in graphics dir.
	
		$('#' + imgID).attr('src', "graphics/" + c + ".png")

		return;
		
	}
	
	var PARENT				= parent.parent.parent.parent.parent.parent.parent.parent.parent;
	
	if(PARENT.nuImages[c] !== undefined){
		
		var p				= JSON.parse(PARENT.nuImages[c]);
		var b				= atob(p.file);
		
		$('#' + imgID).attr('src', b)

		return;
		
	}
	
	var current				= nuFORM.getCurrent();
	var last		 		= $.extend(true, {}, current);

	last.session_id			= window.nuSESSION;
	last.call_type 			= 'getfile';
	last.fileCode			= c;
	
	var successCallback 	= function(data,textStatus,jqXHR){
		
		if(nuDisplayError(data)){return;};

		if(data.JSONfile !== null){
			
			PARENT.nuImages[c] 	= data.JSONfile;
			var p			= JSON.parse(PARENT.nuImages[c]);
			var b			= atob(p.file);
			
			$('#' + imgID).attr('src', b)
		
		}
		
	};
	
	nuAjax(last,successCallback);
	
}


function nuAttachButtonImage(i, c){
	
	c						= String(c).toLowerCase();

	if(window.nuGraphics.indexOf(c + '.png') != -1){						//-- check filenames in graphics dir.

		$('#' + i)
		.css('background-image', 'url("graphics/' + c + '.png')
		.css('background-repeat', 'no-repeat')
		.css('background-size', '30px')
		.css('padding', '0px 0px 0px 33px')
		.css('text-align', 'left')

		return;
		
	}
	
	var PARENT				= parent.parent.parent.parent.parent.parent.parent.parent.parent;
	
	if(PARENT.nuImages[c] !== undefined){
		
		var p				= JSON.parse(PARENT.nuImages[c]);
		var b				= atob(p.file);
		
		$('#' + i)
		.css('background-image', 'url("' + b + '")')
		.css('background-repeat', 'no-repeat')
		.css('background-size', '30px')
		.css('padding', '0px 0px 0px 33px')
		.css('text-align', 'left')

		return;
		
	}
	
	var current				= nuFORM.getCurrent();
	var last		 		= $.extend(true, {}, current);

	last.session_id			= window.nuSESSION;
	last.call_type 			= 'getfile';
	last.fileCode			= c;
	
	var successCallback 	= function(data,textStatus,jqXHR){
		
		if(nuDisplayError(data)){return;};

		if(data.JSONfile !== null){
			
			PARENT.nuImages[c] 	= data.JSONfile;
			var p			= JSON.parse(PARENT.nuImages[c]);
			var b			= atob(p.file);
			
			$('#' + i)
			.css('background-image', 'url("' + b + '")')
			.css('background-repeat', 'no-repeat')
			.css('background-size', '30px')
			.css('padding', '0px 0px 0px 30px')
			.css('text-align', 'left')
		
		}
		
	};
	
	nuAjax(last,successCallback);
	
}


function nuGetLookupId(pk, id){

	$('#nuLookupList').remove();
	
	var l				= $('#' + id);
	
	var last			= nuFORM.getCurrent();

	last.session_id		= nuSESSION;
	last.call_type 		= 'getlookupid';
	last.object_id		= l.attr('data-nu-object-id');
	last.target			= l.attr('data-nu-target');
	last.prefix			= l.attr('data-nu-prefix');
	last.primary_key 	= pk;

	var successCallback = function(data,textStatus,jqXHR){		
	
		nuSERVERRESPONSELU 	= data;

		if(!nuDisplayError(data)){
			
			nuPopulateLookup(data, id);
			$('#' + id).addClass('nuEdited');
			nuHasBeenEdited();
			
			var o		= $('#' + id);

			if(o.attr('data-nu-prefix') == ''){return;}
			
			nuAddSubformRow(o[0], false);

		}
		
	};
	
	nuAjax(last,successCallback);
	
}


function nuGetLookupCode(e){

/*
	if(e.target.value == ''){			//-- set to blank
		
		var id				= e.target.id.substr(0, e.target.id.length - 4);
		
		$('#' + id).val('');
		$('#' + id + 'code').val('');
		$('#' + id + 'description').val('');
		
		$('#' + id).addClass('nuEdited');
		$('#nuSaveButton').addClass('nuSaveButtonEdited');

		return;
		
	}

*/	
	
	var last				= window.nuFORM.getCurrent();

	last.session_id			= window.nuSESSION;
	last.call_type 			= 'getlookupcode';
	last.object_id			= e.target.getAttribute('data-nu-object-id');
	last.target				= e.target.getAttribute('data-nu-target')
	last.code		 		= e.target.value;
	last.hash  				= nuHashFromEditForm();
	
	window.nuLOOKUPSTATE[last.object_id] = 'looking';

	var successCallback = function(data,textStatus,jqXHR){		
		
		nuSERVERRESPONSELU 	= data;
	
		if(!nuDisplayError(data)){
			nuChooseOneLookupRecord(e, data);
		}
			
	};

	nuAjax(last,successCallback);
	
}


function nuPrintAction(){

	var last			= window.nuFORM.getCurrent();

	last.call_type 		= 'runhtml';
	last.browse_columns	= nuSERVERRESPONSE.browse_columns;
	last.browse_sql 	= nuSERVERRESPONSE.browse_sql;
	last.session_id 	= window.nuSESSION;
	
	var successCallback = function(data,textStatus,jqXHR){		

		var fm 					= data;
		
		if(!nuDisplayError(fm)){
			
			var p   			= 'nurunhtml.php?i=' + fm.id;
			
			window.open(p);

		}
		
	};

	nuAjax(last,successCallback);

}

function nuUpdateData(action, instruction){
	
	if(action == 'save' && window.nuBeforeSave){if(nuBeforeSave() === false ){return;}}
	if(action != 'save' && window.nuBeforeDelete){if(nuBeforeDelete() === false ){return;}}
	if(nuFORM.getCurrent().record_id == -1){nuSetProperty('NEW_RECORD', 1);}



	var current				= window.nuFORM.getCurrent();
	var last		 		= $.extend(true, {}, current);

	var f					= last.form_id;
	var r					= last.record_id;
	window.nuLASTRECORD		= last.record_id;

	if(arguments.length == 2){
		last.instruction	= instruction;
	}
	
	last.call_type 			= 'update';
	last.deleteAll 			= $('#nuDelete').is(":checked") ? 'Yes' : 'No';
	last.nuFORMdata			= nuFORM.data(action);
	last.hash 				= nuHashFromEditForm();
	last.session_id 		= window.nuSESSION;
	
	$('.nuActionButton').hide();
	
	var successCallback 	= function(data,textStatus,jqXHR){
		
		var fm 				= data;

		if(nuDisplayError(fm)){
			
			$('.nuActionButton').show();
		
			nuAbortSave();
			
		}else{
			
			if(fm.after_event){
				nuMESSAGES	= fm.errors;
			}
			
			if($('#nuDelete').prop('checked')){
				
				if (action == "delete" && instruction == "all" && fm.record_id == ""){
					
					nuSearchAction();
					nuGetBreadcrumb();
					return;
					
				}
				
				
				window.nuFORM.removeLast();						//-- return to browse
				nuGetBreadcrumb();
				
				if(nuCurrentProperties() == undefined){

					parent.$('#nuModal').remove();
					parent.$('#nuDragDialog').remove();
					
				}
				
			}else{

				nuForm(f, fm.record_id, fm.filter, fm.search, 1);		//-- go to saved or created record
				
			}
			
			nuSavingMessage();
			
		}
	};

	nuAjax(last,successCallback,nuAbortSave);
	
}

function nuSaveAfterDrag() {
	
	var f				= $('#nuDragDialog iframe')[0].contentWindow.nuFORM;

	var last			= f.getCurrent();

    last.call_type		= 'nudragsave';
    last.nuDragState	= $('#nuDragDialog iframe')[0].contentWindow.nuDragOptionsState;
	
	var successCallback	= function(data,textStatus,jqXHR){

		if(nuDisplayError(data.errors)){
			alert(data.errors[0]);
		} else {
			
			$('div#nuDragDialog div#dialogTitle img#dialogClose').click();
			nuGetBreadcrumb();
			
		}
		
		$("#overlay").remove();
	};
		
	nuAjax(last,successCallback,nuAbortSaveDrag);
	
}

function nuOpenNewBrowserTab(c, f, r, filter){
	
	if(window.nuNEW == 1) {
		
		window.nuNEW 	= 0;
		
		window.nuOPENER.push(new nuOpener('F', f, r, filter));

		nuOpenerAppend('type', c);
		
	    var len 	  	= window.nuOPENER.length - 1;
		var id 	    	= window.nuOPENER[window.nuOPENER.length - 1].id;
		var u			= window.location.origin + window.location.pathname + '?i=' + len + '&opener=' + id ;
		
		window.open(u);

		return true;

	}else{
		
		return false;
		
	}
		
}


function nuAbortSave(){
	
    $("#nuProgressSaved").hide();
    $('.nuActionButton').show();
	
}

