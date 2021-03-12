
function nuInitJSOptions() {

	if (window.nuAdminButtons === undefined) {

		window.nuAdminButtons =
			{'nuDebug'						: true, 
			'nuPHP'							: true, 
			'nuRefresh'						: true, 
			'nuObjects'						: true, 
			'nuProperties'					: true
			};

	}

	if (window.nuUXOptions === undefined) {

		window.nuUXOptions =
			{'nuEnableBrowserBackButton'		: true,			// Enable the browser's Back button 
			'nuPreventButtonDblClick'			: true,			// Disable a button for 1 5 s to prevent a double click
			'nuShowPropertiesOnMiddleClick'		: true,			// Show the Object Properties on middle mouse click
			'nuAutosizeBrowseColumns'			: true,			// Autosize columns to fit the document width
			'nuShowBackButton'					: false,		// Show a Back Button
			'nuBrowsePaginationInfo'			: 'default',	// Default Format is: '{StartRow} - {EndRow} ' + nuTranslate('of') + ' ' + '{TotalRows}'
			'nuShowNuBuilderLink'				: true,			// Show the link to nubuilder com
			'nuShowLoggedInUser'				: false,		// Show the logged in User
			'nuShowBeforeUnloadMessage'			: true,			// Show or disable "Leave site?" message
			'nuShowBrowserTabTitle'				: true,			// Show the Form Title in the Browser Tab
			'nuBrowserTabTitlePrefix'			: 'nuBuilder'	// Prefix in the Browser Tab
			};

	}

}

nuInitJSOptions();


function nuBuildForm(f){

	$('#nubody').off('.nuresizecolumn');						//removes (if exist) the cursormove/touchmove event listeners binded to nubody
	$('#nubody').css('transform', 'scale(1)');
	$('html,body').scrollTop(0).scrollLeft(0);

	nuSetProperty('CLONED_RECORD', 0);
	nuSetProperty('NEW_RECORD', 0);

	if(f.tableSchema === null){									//-- need to login again

		$('body').addClass('nuBrowseBody')
		$('body').removeClass('nuEditBody')

		sessionStorage.logout	= 'true';
		parent.parent.parent.parent.parent.location.reload();

		nuCursor('default');
		return;

	}

	if(nuFormType() == 'browse'){
		window.nuTimesSaved		= -1;
	}else{

		window.nuTimesSaved		= window.nuTimesSaved + 1;

		if(window.nuLastForm != f.form_id || (nuLastRecordId != f.record_id && nuLastRecordId !== "-1")) {
			window.nuTimesSaved	= 0;
		}

	}

	window.nuLastForm			= f.form_id;
	window.nuLastRecordId		= f.record_id;
	window.nuSubformRow			= -1;
	window.nuBeforeSave			= null;
	window.nuAfterSave			= null;
	window.nuBeforeDelete		= null;
	window.nuOnSearchAction		= null;
	window.nuOnClone			= null;
	window.nuOnBeforeGetBreadcrumb = null;	
	window.nuOnSetSaved			= null;
	window.nuOnTabSelected		= null;
	window.nuOnSelectTab		= null;
	window.nuBrowseFunction		= window.nuDefaultBrowseFunction;
	window.nuCLONE				= false;
	window.nuSERVERRESPONSE		= f;
	window.nuSERVERRESPONSELU	= [];
	window.nuSESSION			= f.session_id;
	window.nuSUBFORMROW			= [];
	window.nuHASH				= [];					//-- remove any hash variables previously set.
	window.nuTABHELP			= [];
	window.nuFORMHELP			= [];
	window.nuLOOKUPSTATE		= [];
	window.nuBROWSEROW			= -1;
	window.nuBROWSECLICKED		= false;
	window.nuUniqueID			= 'c' + String(Date.now());
	window.global_access		= f.global_access == '1';
	nuFORM.edited				= false;
	window.nuVerticalTabs 		= false;

	nuFORM.scroll				= [];
	nuSetSuffix(1000);
	nuSetBody(f);

	nuRedefine_nuSelectBrowse();

	nuFORM.tableSchema			= f.tableSchema;
	nuFORM.formSchema			= f.formSchema;
	window.nuLANGUAGE			= f.translation;

	nuSetProperty('refreshed', nuGetProperty('refreshed') + 1);

	var b 						= window.nuFORM.getCurrent();

	nuAddedByLookup(f);

	b.form_id 					= f.form_id;
	b.record_id 				= f.record_id;
	b.session_id 				= f.session_id;
	b.user_id 					= f.user_id;
	b.redirect_form_id			= f.redirect_form_id;
	b.title						= f.title;
	b.row_height				= f.row_height;
	b.rows						= f.rows;
	b.browse_columns			= f.browse_columns;
	b.browse_sql				= f.browse_sql;
	b.browse_rows				= f.browse_rows;
	b.browse_table_id			= f.browse_table_id;
	b.browse_filtered_rows		= f.browse_height;
	b.pages						= f.pages;
	b.form_code					= f.form_code;
	b.form_description			= f.form_description;
	b.form_type					= f.form_type;
	b.run_code					= f.run_code;
	b.run_description			= f.run_description;
	b.data_mode					= f.data_mode;

	nuAddHolder('nuBreadcrumbHolder');
	nuAddHomeLogout();
	nuAddHolder('nuActionHolder');

	if(nuFormType() == 'edit'){
		nuAddHolder('nuTabHolder');
	}

	nuAddHolder('nuRECORD');
	$('#nuRECORD').attr('data-nu-table', f.table);
	$('#nuRECORD').attr('data-nu-primary-key-name', f.primary_key);

	nuAddBreadcrumbs();
	nuAddEditTabs('', f);

	if(typeof window['nuBeforeAddActionButtons'] === 'function'){
		nuBeforeAddActionButtons();
	}

	nuAddActionButtons(f);
	nuRecordProperties(f, '');

	if(nuFormType() == 'edit'){

		nuOptions('', f.form_id, 'form', f.global_access);
		nuBuildEditObjects(f, '', '', f);
		nuResizeFormDialogCoordinates();
		nuCalculateForm(false);

		if(f.objects.length > 0){

			if($('#' + f.objects[0].id).attr('data-nu-type') == 'lookup'){
				var obj0	= $('#' + f.objects[0].id + 'code');
			}else{
				var obj0	= $('#' + f.objects[0].id);
			}

		}

	}

	nuGetStartingTab();

	if(nuFormType() == 'edit' && nuIsNewRecord() && f.objects.length > 0){
		obj0.focus();
	}

	if(f.record_id == '-2'){			// Arrange Objects
		nuCreateDragOptionsBox(f);
	}else{
		nuAddJavascript(f);
	}
	nuDragTitleEvents();

	if(window.nuLoginH != ''){

		var bc = $('#nuBreadcrumb0').length > 0 ? $('#nuBreadcrumb0') : $('#nuHomeGap')
		bc
		.html('<i class="fa fa-home" style="font-size:20px;padding:0px 5px 0px 0px"></i>')
		.attr('title', nuTranslate('Home'))
		.attr('onclick', '')
		.attr('onclick', 'nuForm("' + window.nuLoginH + '", -1, "", "", 1);');

		window.nuLoginH = ''

	}

	if(!nuIsMobile()){
		$('#nuSearchField').focus();
	}

	if(window.nuOnLoad){
		nuOnLoad();
	}

	if(nuFormType() == 'edit'){
		window.nuRESPONSIVE.getStartPositions();
	}else{	
		if (nuUXOptions["nuAutosizeBrowseColumns"] || nuDocumentID !== parent.nuDocumentID) {
			nuResizeBrowseColumns();
		}
	}

	if (nuUXOptions["nuShowBrowserTabTitle"]) {
		nuSetBrowserTabTitle(nuUXOptions["nuBrowserTabTitlePrefix"]);
	}

	if (Object.keys(window.nuAdminButtons).length) {
		nuAddAdminButtons();
	}

	if (nuUXOptions["nuEnableBrowserBackButton"]) {	
		nuEnableBrowserBackButton();
	}

	if (nuUXOptions["nuPreventButtonDblClick"]) {
		nuPreventButtonDblClick();
	}

	if (nuUXOptions["nuShowBackButton"]) {	
		nuAddBackButton();
	}

	if (nuUXOptions["nuShowPropertiesOnMiddleClick"]) {	
		document.addEventListener("mousedown", nuOpenPropertiesOnMiddleClick, { passive: true} );
	}

	if ((nuUXOptions["nuBrowsePaginationInfo"]) !== '') {
		nuShowBrowsePaginationInfo((nuUXOptions["nuBrowsePaginationInfo"]));
	}

	if (nuUXOptions["nuShowBeforeUnloadMessage"] == false) {
		window.onbeforeunload = () => {}
	}

	if (nuUXOptions["nuShowLoggedInUser"]) {
		nuDisplayLoggedInUser();
	} else
	if (! nuUXOptions["nuShowNuBuilderLink"]) {
		$('.nuBuilderLink').remove();
	}

	nuInitSetBrowseWidthHelper();
	
	if(window.nuMESSAGES.length > 0){

		nuMessage(window.nuMESSAGES);
		window.nuMESSAGES	= [];

	}

	if(window.nuTimesSaved > 0 && window.nuAfterSave){
		nuAfterSave();
	}

	nuSetSaved(true);

	nuCursor('default');

	nuWindowPosition();

}

function nuDisplayLoggedInUser() {
	$('.nuBuilderLink').html(window.global_access ? nuCurrentProperties().user_id : nuUserName()).attr('href', '').css({
		'cursor': 'pointer'
		, 'pointer-events': 'none'
	});
}

function nuAddHomeLogout(){

	if(nuMainForm()){

		if(window.nuFORM.breadcrumbs.length > 1){

			var c	= document.createElement('div');
			c.setAttribute('id', 'nuBreadcrumb0');

			$('#nuBreadcrumbHolder').append(c);

			$('#nuBreadcrumb0')
			.addClass('nuBreadcrumb')
			.css('cursor', "pointer")
			.css('font-size', 16)
			.attr('onclick', "nuGetBreadcrumb(0)")
			.html('<i class="fa fa-home" style="font-size:20px;padding:0px 5px 0px 0px"></i>')
			.attr('title', nuTranslate('Home'))

		}


		$('#nuBreadcrumbHolder').append('<span id="nulink"><a href="https://www.nubuilder.com" class="nuBuilderLink" target="_blank">nuBuilder</a></span>');

		nuAddIconToBreadCrumb('nuLogout', 'Log out', 16, 'nuAskLogout()', 'fa fa-external-link');

	}

}

function nuAddIconToBreadCrumb(id, title, right, handler, _class) {

		var l	= document.createElement('div');
		l.setAttribute('id', id);

		$('#nuBreadcrumbHolder').append(l);

		$('#' + id)
		.addClass('nuNotBreadcrumb')
		.css('cursor', "pointer")
		.css('font-size', 16)
		.css('position', 'absolute')
		.css('right', right)
		.attr('onclick', handler)
		.html('<i class="'+_class +'" style="font-size:20px;"></i>')
		.attr('title', nuTranslate(title))

}

function nuAddedByLookup(f){

	var isEdit			= nuFormType()			== 'edit';
	var isNewRecord		= window.nuLASTRECORD	== '-1';
	var isLookup		= window.nuTARGET		!= '';
	
	if(isEdit && isNewRecord && isLookup){
		window.parent.nuGetLookupId(nuFORM.getCurrent().record_id, window.nuTARGET);			//-- called from parent window
	}
	
}

function nuSetBody(f){

	$('body').html('');
	$('body').removeClass('nuBrowseBody nuEditBody');

	if(nuFormType() == 'browse'){
		$('body').addClass('nuBrowseBody')
	}else{

		var height = f.dimensions == null ? 0 : f.dimensions.edit.height;
		$('body').addClass('nuEditBody')
		.css('width', window.innerWidth-1)
		.css('height', height)

	}
	
}

function nuDialogHeadersHeight(){

	var h	= 0;

	h = h + nuTotalHeight('nuBreadcrumbHolder');
	h = h + nuTotalHeight('nuActionHolder');
	h = h + nuTotalHeight('nuTabHolder');
	h = h + nuTotalHeight('nuBrowseTitle0');
	h = h + nuTotalHeight('nuBrowseFooter');

	return h;

}

function nuTotalHeight(i){

	var h	= 0;

	let obj = $('#' + i);
	if(obj.length == 0){return 0;}

	h = h + parseInt(obj.css('height'));
	h = h + parseInt(obj.css('padding-top'));
	h = h + parseInt(obj.css('padding-bottom'));
	h = h + parseInt(obj.css('border-top-width'));
	h = h + parseInt(obj.css('border-bottom-width'));
	h = h + parseInt(obj.css('margin-top'));
	h = h + parseInt(obj.css('margin-bottom'));

	return h;

}

function nuTotalWidth(i){

	var h	= 0;

	let obj = $('#' + i);
	if(obj.length == 0){return 0;}

	h = h + parseInt(obj.css('width'));
	h = h + parseInt(obj.css('padding-left'));
	h = h + parseInt(obj.css('padding-right'));
	h = h + parseInt(obj.css('border-left-width'));
	h = h + parseInt(obj.css('border-right-width'));
	h = h + parseInt(obj.css('margin-left'));
	h = h + parseInt(obj.css('margin-right'));

	return h;

}

function nuTotalHolderWidth(i){

	var h	= 0;

	let obj = $('#' + i);
	if(obj.length == 0){return 0;}

	h = h + parseInt(obj.css('padding-left'));
	h = h + parseInt(obj.css('padding-right'));
	h = h + parseInt(obj.css('border-left-width'));
	h = h + parseInt(obj.css('border-right-width'));
	h = h + parseInt(obj.css('margin-left'));
	h = h + parseInt(obj.css('margin-right'));

	return h;

}

function nuDefine(v){

	if(v === undefined){
		v	= '';
	}

	return v;

}

function nuSearchFieldSetSearchType() {

	$("#nuSearchField")
		.prop("type", "search")
		.attr('autocomplete', 'off')
		.on('search', function () {
			nuSearchAction();
	});
 
}

function nuAddActionButtons(form){

	var draggable	= 0;
	var rid			= window.nuFORM.getProperty('record_id');

	if(rid == '-2') {
		draggable = 1;
	}

	var button	= form.buttons;

	if(nuFormType() == 'browse'){

		var s = nuDefine(nuFORM.getProperty('search'));
		var f = nuDefine(nuFORM.getProperty('filter'));

		$('#nuActionHolder').append("<input id='nuSearchField' type='text' class='nuSearch' onfocus='this.value = this.value;' onkeypress='nuSearchPressed(event)' onkeydown='nuArrowPressed(event)' value='" + s + "'>");
		nuSearchFieldSetSearchType();

		$('#nuActionHolder').append("<input id='nuFilter' style='visibility:hidden;width:0px' value='" + f + "'>");
		$('#nuActionHolder').append("<button id='nuSearchButton' type='button' class='nuActionButton' onclick='nuSearchAction()'><i class='fa fa-search'></i>&nbsp;" + nuTranslate('Search') + "</button>");

		if(button.Add == 1){nuAddActionButton('Add');}
		if(button.Print == 1){nuAddActionButton('Print');}

	}else{

		if(!draggable){

			if(button.Save == 1 && form.form_type != 'launch' && form.data_mode != 0) {	
				nuAddActionButton('Save');
			}

			if(rid != -1){

				if(button.Delete == 1)							{nuAddActionButton('Delete');}
				if(button.Clone == 1)							{nuAddActionButton('Clone');}

			}

			if(button.RunHidden != '')							{nuAddActionButton('runhidden', 'Run', button.RunHidden);}
			if(button.Run != '')								{nuAddActionButton('run', 'Run', button.Run);}

		}

	}

}

function nuAddActionButton(i, v, f, t){

	if(arguments.length == 1){

		v	= i;
		f	= 'nu' + i + 'Action()';

	}

	if (typeof t === 'undefined') {
		var t = '';
	}

	var nuClass = "";
	if (i == 'Save' || i == 'Add' || i == 'Clone' || i == 'Delete') { nuClass = " " + "nu" + i + "Button" };
	
	$('#nuActionHolder').append("<input id='nu" + i + "Button' type='button' title='" + nuTranslate(t) + "' class='nuActionButton" + nuClass + "' value='" + nuTranslate(v) + "' onclick='" + f + "'>");

}


function nuBuildEditObjects(f, p, o, prop){

	if(typeof(f.objects) != 'object'){return;}

	var l			= 3;
	var draggable	= 0;

	if(window.nuFORM.getProperty('record_id') == '-2'){
		draggable	= 1;
	}

	for(var i = 0 ; i < f.objects.length; i++){

		if(!draggable) {

			var t						= prop.objects[i].type;
			f.objects[i].parent_type	= o == '' ? '' : o.subform_type;

			if(t == 'input' || t == 'display' || t == 'lookup' || t == 'textarea' || t == 'calc'){
				l = l + nuINPUT(f, i, l, p, prop);
			}else if(t == 'run'){
				l = l + nuRUN(f, i, l, p, prop);
			}else if(t == 'html'){
				l = l + nuHTML(f, i, l, p, prop);
			}else if(t == 'image'){
				l = l + nuIMAGE(f, i, l, p, prop);
			}else if(t == 'select'){
				l = l + nuSELECT(f, i, l, p, prop);
			}else if(t == 'subform' && p == ''){
				l = l + nuSUBFORM(f, i, l, p, prop);
			}else if(t == 'word'){
				l = l + nuWORD(f, i, l, p, prop);
			}

			l	= l + 2;

		} else{

			$("body").css("overflow", "hidden");
			l = l + nuDRAG(f, i, l, p, prop);

		}

	}

}



function nuAddJSObjectEvents(i, j){

	var o			= document.getElementById(i);

	for(var J = 0 ; J < j.length ; J++){

		var code	= o.getAttribute(j[J].event);
		var ev		= j[J].event;
		code		= code === null ? '' : code + ';' ;

		if(ev == 'beforeinsertrow')		{ev	= 'data-nu-' + ev;}
		if(ev == 'afterinsertrow')		{ev	= 'data-nu-' + ev;}
		if(ev == 'clickdelete')			{ev	= 'data-nu-' + ev;}

		o.setAttribute(ev, code + j[J].js);

	}

}

function nuRecordProperties(w, p, l){

	var de		= p + 'nuDelete';
	var fh		= p + 'nuRECORD';						//-- Edit Form Id
	var chk		= document.createElement('input');
	var sf		= p.substr(0, p.length - 3);

	chk.setAttribute('id', de);
	chk.setAttribute('title', nuTranslate('Delete This Row When Saved'));
	chk.setAttribute('type', w.deletable == '0'?'text':'checkbox');
	chk.setAttribute('onclick', 'nuChange(event)');

	$('#' + fh)
	.append(chk)
	.addClass('nuSection')
	.attr('data-nu-form-id', w.id)
	.attr('data-nu-table', w.table)
	.attr('data-nu-primary-key', w.record_id)
	.attr('data-nu-foreign-key', w.foreign_key)
	.attr('data-nu-foreign-field', p == '' ? '' : w.foreign_key_name);

	$('#' + de)
	.attr('data-nu-data', '')
	.addClass('nuSubformCheckbox')
	.addClass(w.table)

	if(arguments.length == 3){

		$('#' + de)
		.prop('checked', w.record_id == -1)
		.attr('data-nu-checkbox', w.deletable == '0'?'':sf)
		.css({'top'			: 3, 
			'left'			: Number(l) + 2, 
			'position'		: 'absolute', 
			'visibility'	: 'visible'})

		if(w.deletable == '0'){				//-- Fike
			$('#' + de).css({'width' : 0, 'height' : 0, 'left' : -10, 'top' : 10})			//-- allows tabbing when there is no checkbox.
		}

	}else{

		$('#' + de).css('visibility', 'hidden')
		.prop('checked', false)
		.attr('data-nu-checkbox', sf);

	}

}

function nuDRAG(w, i, l, p, prop){

	var id				= p + prop.objects[i].id;
	var ef				= p + 'nuRECORD';
	var nuObjectType	= p + prop.objects[i].type;
	var drg				= document.createElement('div');
	drg.setAttribute('id', id);

	$('#' + ef).append(drg);

	$('#' + id).css({'top'		: Number(prop.objects[i].top),
					'left'		: Number(prop.objects[i].left),
					'width'		: Number(prop.objects[i].width),
					'height'	: Number(prop.objects[i].height),
					'text-align': prop.objects[i].align,
					'position'	: 'absolute',
					'overflow': 'hidden'
	}).addClass('nu_'+ nuObjectType);

	$('#' + id).text(id);
	$('#' + id).attr('data-drag',1);
	$('#' + id).attr('data-nu-object-id', prop.objects[i].object_id)

	nuAddDataTab(id, prop.objects[i].tab, p);

	return Number(prop.objects[i].width);

}

function nuINPUT(w, i, l, p, prop){

	var obj			= prop.objects[i];
	var ID			= p + obj.id;
	var id			= p + obj.id;
	var ef			= p + 'nuRECORD';							//-- Edit Form Id
	var ty			= 'textarea';
	var vis			= obj.display == 0 ? 'hidden' : 'visible';
	var inputType	= obj.input;
	var objectType	= obj.type;
	var hideSF		= '';

	if(objectType != 'textarea'){								//-- Input Object
		ty			= 'input';
	}

	if(inputType == 'file'){

		var inp = document.createElement('textarea');

		inp.setAttribute('id', id);

		$('#' + ef).append(inp);

		$('#' + id)
		.css('visibility', 'hidden')
		.attr('data-nu-field', id)
		.attr('data-nu-prefix', p)
		.attr('data-nu-data', '')
		.attr('onchange', 'this.className = "nuEdited"')
		.val(obj.value);

		id	= id + '_file';

	}

	if(inputType == 'button' && objectType == 'input'){
		var inp = document.createElement('button');
	}else{
		var inp = document.createElement(ty);
	}

	inp.setAttribute('id', id);

	$('#' + ef).append(inp);

	if(obj.parent_type == 'g'){				//-- in a grid subform

		obj.left	= l;
		obj.top		= 3;

	}else{

		if(inputType != 'button' && prop.title !== 'Insert-Snippet'){		//-- Input Object
			nuLabel(w, i, p, prop);
		}

	}

	if(ty == 'input'){														//-- Input Object

		inp.setAttribute('type', inputType);

		if(objectType == 'lookup'){
			$('#' + id).addClass('nuHiddenLookup');
		}else{
			$('#' + id).addClass('input_' + inputType);
		}

		if (prop.objects[i].datalist !== null && prop.objects[i].datalist !== '' && typeof prop.objects[i].datalist !== "undefined") {	
			nuAddDatalist(id, JSON.parse(prop.objects[i].datalist));
		}

	}

	var onChange	= 'nuChange(event)';

	if(inputType == 'file'){
		onChange	= 'nuChangeFile(event)';
	}

	if(objectType == 'lookup'){
		onChange	= 'nuGetLookupId(this.value, this.id)';
	}

	var bump		= 0;

	if(inputType == 'button' && p != ''){
		var bump	= 3;
	}

	nuAddDataTab(id, obj.tab, p);

	$('#' + id).css({'top'		: Number(obj.top),
					'left'		: Number(obj.left) + bump,
					'width'		: Number(obj.width),
					'height'	: Number(obj.height),
					'text-align': obj.align,
					'position'	: 'absolute'
	})
	.attr('onchange', onChange)
	.attr('data-nu-field', inputType == 'button' || inputType == 'file' ? null : obj.id)
	.attr('data-nu-object-id', w.objects[i].object_id)
	.attr('data-nu-format', '')
	.attr('data-nu-prefix', p)
	.attr('data-nu-type', w.objects[i].type)
	.attr('data-nu-subform-sort', 1)
	.attr('data-nu-label', w.objects[i].label)
	.attr('onfocus', 'nuLookupFocus(event)')

	if(inputType == 'nuScroll'){
		
		var input_js	= 'nuFORM.scrollList(event, ' + w.objects[i].scroll + ')';

		$('#' + id)
		.addClass('nuScroll')
		.attr('onkeydown', input_js)
		.attr("title", nuTranslate('Use the keyboard up and down arrows to scroll through the list or add text that is not in the list.'));

	}


	if(inputType == 'nuDate'){

		$('#' + id)
		.addClass('nuDate')
		.attr('data-nu-format', w.objects[i].format)
		.attr('autocomplete', 'off');
	}


	if(inputType == 'nuNumber'){

		$('#' + id)
		.addClass('nuNumber')
		.attr('data-nu-format', w.objects[i].format)

	}

	if(inputType != 'button'){
		$('#' + id).attr('data-nu-data', '')
	}else{

		$('#' + id)
		.addClass('nuButton')

	}

	if(w.objects[i].value != '' && window.nuFORM.getCurrent().record_id == '-1'){				//== check for Cannot be left blank
		$('#' + id).addClass('nuEdited');
	}

	if(inputType == 'nuDate'){
		$('#' + id).attr('onclick', 'nuPopupCalendar(this);');
	}

	if(inputType != 'file'){

		if(inputType == 'button'){
			
			$('#' + id).html(nuTranslate(w.objects[i].value))
		}else{

			if(inputType == 'datetime-local'){													//-- replace ' ' between date and time with 'T'
				w.objects[i].value = w.objects[i].value == null ? null : w.objects[i].value.replace(' ','T');
			}

			$('#' + id).val(nuFORM.addFormatting(w.objects[i].value, w.objects[i].format));
		}

	}

	nuAddJSObjectEvents(id, obj.js);

	if(w.objects[i].input == 'checkbox'){

		document.getElementById(id).checked	= (w.objects[i].value == '1');
		
	}


	if(objectType == 'display'){

		$('#' + id).addClass('nuReadonly');
		$('#' + id).prop('readonly', true);

	}

	if(objectType == 'calc'){

		var TOT	= String(w.objects[i].formula).replaceAll("al('", "al('" + p);

		$('#' + id).addClass('nuCalculator')
		.attr('data-nu-format', w.objects[i].format)
		.attr('data-nu-calc-order', w.objects[i].calc_order)
		.prop('readonly', true).prop('tabindex', -1)
		.attr('data-nu-formula', TOT);

		if(p != ''){
			$('#' + id).addClass('nuSubformObject');
		}

	}

	if(objectType == 'lookup'){

		$('#' + id).hide();
		$('#' + id).attr('data-nu-lookup-id','');
		$('#' + id).val(w.objects[i].values[0][1]);

		var target			= id;
		id					= target + 'code';
		var inp				= document.createElement('input');

		inp.setAttribute('id', id);

		$('#' + ef).append(inp);

		nuAddDataTab(id, obj.tab, p);

		$('#' + id).css({'top'	: Number(obj.top),
						'left'	: Number(obj.left),
						'width'	: Number(obj.width),
						'height': Number(obj.height)
		})
		.attr('data-nu-form-id', w.objects[i].form_id)
		.attr('data-nu-object-id', w.objects[i].object_id)
		.attr ("data-nu-prefix", p)
		.attr('data-nu-target', target)
		.attr('data-nu-type', 'lookup')
		.attr('data-nu-subform-sort', 1)
		.css('visibility', vis)
		.addClass('nuLookupCode')
		.attr('onchange', 'nuGetLookupCode(event)')
		.attr('onfocus', 'nuLookupFocus(event)');

		$('#' + id).enterKey(function ( ) {
			if ($(this).val().length == 0) {			
				var element = $('#' + target + 'button');
				var element = element[0];
				nuBuildLookup( element, "" );
			}
		})


		w.objects[i].values[0][0]	= p + obj.id;
		w.objects[i].values[1][0]	= p + obj.id + 'code';
		w.objects[i].values[2][0]	= p + obj.id + 'description';

		id				= target + 'button';
		var inp			= document.createElement('div');

		inp.setAttribute('id', id);

		$('#' + ef).append(inp);

		nuAddDataTab(id, obj.tab, p);

		var luClass = obj.label === 'Insert-Snippet' ? 'fa fa-code' : 'fa fa-search';

		$('#' + id).css({'top'			: Number(obj.top),
						'left'			: Number(obj.left) + Number(obj.width) + 6,
						'width'			: 15,
						'height'		: Number(obj.height -2)
		})
		.attr('type','button')
		.attr ("data-nu-prefix", p)
		.attr('data-nu-form-id', w.objects[i].form_id)
		.attr('data-nu-object-id', w.objects[i].object_id)
		.attr('data-nu-target', target)
		.attr('data-nu-subform-sort', 1)
		.attr('onfocus', 'nuLookupFocus(event)')
		.attr('onclick', 'nuBuildLookup(this,"")')
		.addClass('nuLookupButton')
		.html('<i style="padding:4px" class="'+luClass+'"></i>')
		.css('visibility', vis);

		if (obj.label === 'Insert-Snippet') $('#' + id).css('font-size','18px');

		id = p + obj.id + 'description';
		var inp = document.createElement('input');
		inp.setAttribute('id', id);
		
		$('#' + ef).append(inp);
		nuAddDataTab(id, obj.tab, p);
		$('#' + id).css({'top'		: Number(obj.top),
						'left'		: Number(obj.left) + Number(obj.width) + 25,
						'width'		: obj.description_width,
						'visibility': obj.description_width == 0 || obj.display == 0 ? 'hidden' : 'visible',
						'height'	: Number(obj.height)
		})
		.attr('tabindex','-1')
		.addClass('nuLookupDescription')
		.addClass('nuReadonly')
		.prop('readonly', true);

		nuPopulateLookup3(w.objects[i].values, p);

		nuSetAccess(ID, obj.read);

		return Number(obj.width) + Number(obj.description_width) + 30;

	}else{

		if(objectType == 'input' && inputType == 'nuAutoNumber'){
			$('#' + id)
			.prop('readonly', true)
			.addClass('nuReadonly')
			.val(obj.counter);
		}

		nuSetAccess(ID, obj.read);

		return Number(obj.width) + (obj.read == 2 ? -2 : 4);

	}

}

function nuLookupFocus(e){

	var p				= $(e.target).attr('data-nu-prefix');
	var t				= $(e.target).attr('data-nu-type');

	window.nuSubformRow	= Number(p.substr(p.length - 3));

	if(t != 'textarea'){
		$(e.target).select();
	}

}

function nuCurrentRow(){
	return window.nuSubformRow;
}

function nuSetAccess(i, r){

	if(r == 2){

		var o	= [i, i + 'code', i + 'button', i + 'description', 'label_' + i];

		for(var c = 0 ; c < o.length ; c++){

			$('#' + o[c])
			.attr('data-nu-tab', 'x')
			.hide();

		}
		
	}

	if(r == 1){
		nuReadonly(i);
	}

}

function nuHTML(w, i, l, p, prop){

	var id	= p + prop.objects[i].id;
	var ef	= p + 'nuRECORD';							//-- Edit Form Id
	var inp = document.createElement('div');

	inp.setAttribute('id', id);
	
	if(prop.objects[i].parent_type == 'g'){

		prop.objects[i].left = l;
		prop.objects[i].top = 3;

	}else{

		nuLabel(w, i, p, prop);

	}

	$('#' + ef).append(inp);

	nuAddDataTab(id, prop.objects[i].tab, p);
	
	$('#' + id).css({'top'		: Number(prop.objects[i].top),
					'left'		: Number(prop.objects[i].left),
					'width'		: Number(prop.objects[i].width),
					'height'	: Number(prop.objects[i].height),
					'position'	: 'absolute'
	})
	.addClass('nuHtml').html(w.objects[i].html);

	nuSetAccess(id, prop.objects[i].read);

	return Number(prop.objects[i].width);

}

function nuIMAGE(w, i, l, p, prop){

	var id	= p + prop.objects[i].id;
	var ef	= p + 'nuRECORD';						//-- Edit Form Id
	var inp = document.createElement('img');

	inp.setAttribute('id', id);

	if(prop.objects[i].parent_type == 'g'){

		prop.objects[i].left = l;
		prop.objects[i].top = 3;

	}else{

		nuLabel(w, i, p, prop);

	}

	$('#' + ef).append(inp);

	nuAddDataTab(id, prop.objects[i].tab, p);

	$('#' + id).css({'top'		: Number(prop.objects[i].top),
					'left'		: Number(prop.objects[i].left),
					'width'		: Number(prop.objects[i].width),
					'height'	: Number(prop.objects[i].height),
					'position'	: 'absolute'
	})
	.attr('src', atob(w.objects[i].src));

	nuSetAccess(id, prop.objects[i].read);

	nuAddJSObjectEvents(id, prop.objects[i].js);

	return Number(prop.objects[i].width);

}

function nuWORD(w, i, l, p, prop){

	var id	= p + prop.objects[i].id;
	var ef	= p + 'nuRECORD';							//-- Edit Form Id
	var inp = document.createElement('div');

	inp.setAttribute('id', id);

	$('#' + ef).append(inp);

	nuAddDataTab(id, prop.objects[i].tab, p);

	$('#' + id).css({'top'		: Number(prop.objects[i].top),
					'left'		: Number(prop.objects[i].left),
					'width'		: Number(prop.objects[i].width),
					'height'	: Number(prop.objects[i].height),
					'position'	: 'absolute',
					'text-align': prop.objects[i].align
	})
	.addClass('nuWord')
	.html(nuTranslate(w.objects[i].word))
	.attr('ondblclick','nuPopup("nuobject", "' + prop.objects[i].object_id + '")');

	nuSetAccess(id, prop.objects[i].read);

	return Number(prop.objects[i].width);

}

function nuRUN(w, i, l, p, prop){

	var id = p + prop.objects[i].id;
	var ef = p + 'nuRECORD';					//-- Edit Form Id
	var ele = 'button';

	if(prop.objects[i].parent_type == 'g'){

		prop.objects[i].left	= l;
		prop.objects[i].top		= 3;
		
	}

	if(prop.objects[i].run_method != 'b'){

		ele = 'iframe';

		if(!prop.objects[i].parent_type == 'g'){

			nuLabel(w, i, p, prop);

		}

	}

	var inp = document.createElement(ele);

	inp.setAttribute('id', id);
	
	$('#' + ef).append(inp);

	nuAddDataTab(id, prop.objects[i].tab, p);

	var O			= prop.objects[i];

	$('#' + id).css({'top'			: Number(O.top),
					'left'			: Number(O.left),
					'width'			: Number(O.width),
					'height'		: Number(O.height),
					'position'		: 'absolute',
					'text-align'	: prop.objects[i].align
	});

	if(O.run_method == 'b'){

		var clicker						= '';

		if(O.run_type == 'F'){clicker	= "nuStopClick(event);nuForm('" + O.form_id + "','" + O.record_id + "','" + O.filter + "', '')"}
		if(O.run_type == 'R'){clicker	= "nuRunReport('" + O.record_id + "')";}
		if(O.run_type == 'P'){

			if(O.run_hidden){clicker	= "nuRunPHPHidden('" + O.record_id + "')"}
			if(!O.run_hidden){clicker	= "nuRunPHP('" + O.record_id + "')"}
			
		}

		$('#' + id).attr({
					'type'		: 'button',
					'value'		: nuTranslate(O.label),
					'onclick'	: clicker
		})
		.html(nuTranslate(O.label))
		.addClass('nuButton');

	}else{

		var F		= O.form_id;
		var R		= O.record_id;
		var L		= O.filter;
		var PA		= O.parameters;
		var P		= window.location.pathname;
		var f		= P.substring(0,P.lastIndexOf('/') + 1)

		window.nuOPENER.push(new nuOpener(O.run_type, F, R, L, PA));

		var open	= window.nuOPENER[window.nuOPENER.length - 1];
		var u		= window.location.origin + f + O.src + '&opener=' + open.id;
		var u		= P + '?i=2&opener=' + open.id;

		$('#' + id).attr('src', u).removeClass('').addClass('nuIframe');

	}

	nuAddJSObjectEvents(id, O.js);

	nuSetAccess(id, prop.objects[i].read);

	return Number(O.width);
	
}

function nuSELECT(w, i, l, p, prop){

	var id = p + prop.objects[i].id;
	var ef = p + 'nuRECORD';					//-- Edit Form Id

	if(prop.objects[i].parent_type == 'g'){
		
		prop.objects[i].left = l;
		prop.objects[i].top = 3;

	}else{
		nuLabel(w, i, p, prop);
	}

	var sel = document.createElement('select');

	sel.setAttribute('id', id);

	$('#' + ef).append(sel);


	if(w.objects[i].value != '' && window.nuFORM.getCurrent().record_id == '-1'){
		$('#' + id).addClass('nuEdited');
	}

	nuAddDataTab(id, prop.objects[i].tab, p);

	if(prop.objects[i].multiple == 1){

		$('#' + id).attr('multiple', 'multiple');

	}

	if (prop.objects[i].select2 == 1) {
		$('#' + id).attr('date-nu-select2', 1);
		let select2Id = $('#' + id).attr('id') + "select2";
		$('#' + id).select2({
			dropdownParent: $('#nuRECORD'),
			theme: "default " + select2Id
		});
		$('.' + select2Id).css({
			position: 'absolute',
			width: Number(prop.objects[i].width),
			top: Number(prop.objects[i].top),
			left: Number(prop.objects[i].left)
		}).attr('id', select2Id);
		nuAddDataTab(select2Id, prop.objects[i].tab, p);
	};


	$('#' + id).css({'top'		: Number(prop.objects[i].top),
					'left'		: Number(prop.objects[i].left),
					'width'		: Number(prop.objects[i].width),
					'position'	: 'absolute'
	})
	.attr('onfocus', 'nuLookupFocus(event)')
	.attr('onchange', 'nuChange(event)')
	.attr('data-nu-field', prop.objects[i].id)
	.attr('data-nu-object-id', w.objects[i].object_id)
	.attr('data-nu-format', '')
	.attr('data-nu-subform-sort', 1)
	.attr('data-nu-data', '')
	.attr('data-nu-label', w.objects[i].label)
	.attr('data-nu-prefix', p);


	$('#' + id).css('height', Number(prop.objects[i].height));

	var s = String(w.objects[i].value);
	var a = [];

	if(w.objects[i].multiple == 0){
		a = [s];

	}

	if(s.substr(0,1) + s.substr(-1) == '[]'){
		eval('a = ' + s);
	}

	$('#' + id).append('<option value=""></option>');

	if(prop.objects[i].options != null){

		for(var n = 0 ; n < prop.objects[i].options.length ; n++){

			var opt	= String(prop.objects[i].options[n][1]).replaceAll(' ' ,'&#160;')

			if(a.indexOf(prop.objects[i].options[n][0]) == -1){
				$('#' + id).append('<option value="'+prop.objects[i].options[n][0]+'">' + opt + '</option>');
			}else{
				$('#' + id).append('<option selected="selected "value="'+prop.objects[i].options[n][0]+'">' + opt + '</option>');
			}

		}

	}

	nuAddJSObjectEvents(id, prop.objects[i].js);

	nuSetAccess(id, prop.objects[i].read);

	if(prop.objects[i].read == 1){
		nuDisable(id);
	}

	return Number(prop.objects[i].width);

}

function nuSUBFORM(w, i, l, p, prop){
	
	var SF			= prop.objects[i];						//-- First row
	var SFR			= w.objects[i];							//-- All rows
	var id			= p + SF.id;
	var ef			= p + 'nuRECORD';						//-- Edit Form Id
	var inp			= document.createElement('div');
	var fms			= SFR.forms;

	inp.setAttribute('id', id);

	if(SF.parent_type == 'g'){
		
		SF.left		= l;
		SF.top		= 3;

	}else{		
		nuLabel(w, i, p, prop);	
	}

	$('#' + ef).append(inp);

	nuAddDataTab(id, prop.objects[i].tab, p);

	$('#' + id).css({'top'			: Number(SF.top),
					'left'			: Number(SF.left),
					'width'			: Number(SF.width),
					'height'		: Number(SF.height) + 2,
					'overflow-x'	: 'hidden',
					'overflow-y'	: 'hidden'
	})
	.attr('data-nu-object-id', SF.object_id)
	.attr('data-nu-foreign-key-name', SF.foreign_key_name)
	.attr('data-nu-primary-key-name', SF.primary_key_name)
	.attr('data-nu-subform', 'true')
	.attr('data-nu-add', SF.add)
	.attr('data-nu-delete', SF.delete)
	.addClass('nuSubform');

	nuAddJSObjectEvents(id, SF.js);
	
	if(SF.forms[0] !== undefined){
		nuGetSubformRowSize(SF.forms[0].objects, SF, id);
	}

	if(SF.subform_type == 'f'){

		var rowHeight		= Number(SF.dimensions.edit.height	+ 10);
		var rowWidth		= Number(SF.dimensions.edit.width	+ 10);
		
	}else{

		var rowHeight		= Number(SF.dimensions.grid.height);
		var rowWidth		= Number(SF.dimensions.grid.width + 55);
		
	}

	if(SF.delete == '1'){
		rowWidth			= rowWidth - 3;
	}else{
		rowWidth			= rowWidth - 25;
	}

	var rowTop		= 50;

	if(SF.subform_type == 'f'){
		rowTop		= 33;
	}

	var tabId = id + 'nuTabHolder';
	var tabDiv = document.createElement('div');
	tabDiv.setAttribute('id', tabId);
	$('#' + id).prepend(tabDiv);
	$('#' + tabId).css({'top'		: 0,
					'left'			: 0,
					'width'			: rowWidth,
					'height'		: rowTop,
					'overflow-x'	: 'hidden',
					'overflow-y'	: 'hidden',
					'position'		: 'absolute',
					'padding'		: '12px 0px 0px 0px'
	})
	.addClass('nuTabHolder')
	.attr('data-nu-subform', tabId)
	.prepend('&nbsp;&nbsp;&nbsp;')

	if(SF.subform_type == 'f'){
		nuAddEditTabs(id, SF.forms[0]);
	}else{

		if(SFR.forms.length > 0){

			nuTABHELP[SFR.forms[0].tabs[0].id]	= SFR.forms[0].tabs[0].help;
			nuFORMHELP[prop.objects[i].id]		= SFR.forms[0].tabs[0].help;

		}

	}

	nuOptions(id, SF.sf_form_id, 'subform', w.global_access);

	var scrId		= id + 'scrollDiv';
	var scrDiv		= document.createElement('div');

	scrDiv.setAttribute('id', scrId);
	scrDiv.setAttribute('class', 'nuSubformScrollDiv');

	$('#' + id).append(scrDiv);
	$('#' + scrId).css({'top'		: rowTop,
					'left'			: 0,
					'width'			: Number(rowWidth) + 1,
					'height'		: Number(SF.height) - rowTop + 1,
					'border-width'	: 10,
					'overflow-x'	: 'hidden',
					'overflow-y'	: 'scroll',
					'position'		: 'absolute'
	});

	if(rowWidth > Number(SF.width)){
		
			$('#' + id).css('overflow-x', 'scroll');
			$('#' + scrId).css('height', SF.height - rowTop - 25);
			
	}
	
	rowTop			= 0;
	var even		= 0;

	for(var c = 0 ; c < fms.length ; c++){

		var prefix	= id + nuPad3(c);
		var frmId	= prefix + 'nuRECORD';
		var frmDiv	= document.createElement('div');

		frmDiv.setAttribute('id', frmId);
		$('#' + scrId).append(frmDiv);
		$('#' + frmId).css({'top'		: Number(rowTop),
						'left'			: 0,
						'width'			: Number(rowWidth),
						'height'		: Number(rowHeight),
						'position'		: 'absolute'
		})
		.addClass('nuSubform' + even);

		nuBuildEditObjects(SFR.forms[c], prefix, SF, SF.forms[0]);

		if(SF.delete == '1'){
			SF.forms[c].deletable = '1';
		}else{
			SF.forms[c].deletable = '0';				//-- Fike
		}

		nuRecordProperties(SF.forms[c], prefix, rowWidth - 40);

		rowTop		= Number(rowTop) + Number(rowHeight);
		even		= even == '0' ? '1' : '0'

	}

	if(prefix != ''){

		if(SF.add == 1){
			nuNewRowObject(String(prefix));
		}else{
			$('#' + prefix + 'nuRECORD').hide();

		}

	}

	nuSetAccess(id, prop.objects[i].read);

	return Number(SF.width);

}

function nuNewRowObject(p){

	var sf	= p.substr(0, p.length - 3);

	if($('#' + p + 'nuRECORD').length == 0){return;}

	var h	= document.getElementById(p + 'nuRECORD').outerHTML;

	window.nuSUBFORMROW[sf]	= String(h.replaceAll(p, '#nuSubformRowNumber#', true));

	$("[id^='" + p + "']").addClass('nuEdit')

}


function nuSubformLastRow(t){

	var i					= String($('#' + t.id).parent().attr('id'));
	var p					= i.substr(0, i.length - 17);
	var s					= parseInt(i.substr(11,3)) + 1;
	var n					= $('#' + p + nuPad3(s) + 'nuRECORD').length;

	return n == 0;

}


function nuRecordHolderObject(t){

	var h		= 'nuRECORD';
	var p		= $('#' + t.id).parent();
	var i		= String(p.attr('id'));
	var c		= 0;

	this.form	= i.substr(0, i.length - 3 - h.length);
	this.strNo	= i.substr(this.form.length, 3);
	this.intNo	= Number(this.strNo);

	while ($('#' + this.form + nuPad3(this.intNo + c) + h).length != 0){c++;}

	this.rows	= this.intNo + c;
	this.top	= (parseInt(p.css('height')+1) * this.rows);  //-- + this.rows adds the border height
	var s		= this.form + nuPad3(this.intNo + 1) + h;
	this.last	= $('#' + s).length == 0;
	var s		= this.form + nuPad3(this.rows - 1);
	this.html	= window.nuSUBFORMROW[s];
	this.even	= parseInt(this.rows/2) == this.rows/2 ? '0' : '1';

}


function nuAddSubformRow(t, e){

	if($('#' + t.id).parent().parent().parent().attr('data-nu-add') == 0){return;}


	var sfid	= $('#' + t.id).parent().parent().parent()[0].id;
	var before	= $('#' + sfid).attr('data-nu-beforeinsertrow');
	var after	= $('#' + sfid).attr('data-nu-afterinsertrow');

	var nuCancel = false;

	eval(before);

	if(nuCancel){return;}

	if(e !== false){e.stopPropagation();}

	var o = new nuRecordHolderObject(t);

	if(!o.last){return;}

	var h	= window.nuSUBFORMROW[o.form].replaceAll('#nuSubformRowNumber#', o.form + nuPad3(o.rows), true);

	$('#' + o.form + 'scrollDiv').append(h);

	$('#' + o.form + nuPad3(o.rows) + 'nuRECORD').addClass('nuSubform'+ o.even);
	$('#' + o.form + nuPad3(o.rows) + 'nuRECORD').css('top', o.top);
	$('#' + o.form + nuPad3(o.rows)).attr('data-nu-primary-key', '-1');
	$('#' + o.form + nuPad3(o.rows) + 'nuDelete').prop('checked', true);
	$('#' + o.form + nuPad3(o.rows-1) + 'nuDelete').prop('checked', false);

	$("[id^='" + o.form + nuPad3(o.rows) + "']").addClass('nuEdited')

	$('.nuTabSelected').click();

	$('#' + o.form + nuPad3(o.rows) + 'nuRECORD > .nuLookupButton')
	.on( "click", function() {
		nuBuildLookup(this,"");
	})

	eval(after);

}

function nuPad4(i){

	return String('000' + Number(i)).substr(-4);

}

function nuPad3(i){

	return String('00' + Number(i)).substr(-3);

}


function nuPad2(i){
	
	return String('0' + Number(i)).substr(-2);

}

function nuLabel(w, i, p, prop){

	let obj = prop.objects[i];
	if(obj.label == '' || obj.display == 0 || obj.label == "Insert-Snippet"){return;}

	var id		= 'label_' + p + obj.id;
	var ef		= p + 'nuRECORD';						//-- Edit Form Id

	if(obj.input == 'file'){
		var lab = document.createElement('div');
	}else{
		var lab = document.createElement('label');
	}

	var lab = document.createElement('label');
	var lwidth = nuGetWordWidth(nuTranslate(obj.label));

	lab.setAttribute('id', id);
	lab.setAttribute('for', p + obj.id);

	$('#' + ef).append(lab);

	nuAddDataTab(id, obj.tab, p);

	var l = String(nuTranslate(obj.label));

	$('#' + id).css({'top'		: Number(obj.top),
		'left'	: Number(obj.left) - lwidth + -17,
		'width'	: Number(lwidth + 12)
	})
	.html(l)
	.attr('ondblclick','nuPopup("nuobject", "' + obj.object_id + '")');

	if(obj.valid == 1){$('#' + id).addClass('nuBlank');}
	if(obj.valid == 2){$('#' + id).addClass('nuDuplicate');}

}

function nuPopulateLookup3(v, p){

		for(var i = 0 ; i < v.length ; i++){

			var fieldname	= String(v[i][0]).replace('#ROW#', p);
			
			$('#' + fieldname).val(v[i][1]);
		}

}

function nuAddHolder(t){

	var d	= document.createElement('div');

	d.setAttribute('id', t);

	$('body').append(d);
	$('#' + t).addClass(t)

}

function nuGetWordWidth(w){

	var h = "<div id='nuTestWidth' style='position:absolute;visible:hidden;width:auto'>" + w + "</div>";
	$('body').append(h);
	var l = parseInt($('#nuTestWidth').css('width'));
	$('#nuTestWidth').remove();

	return l + 5;

}	

function nuGetSubformRowSize(o, SF, id){

	var l = -3;
	var w = 0;

	for(var i = 0 ; i < o.length ; i++){

		var d = Number(o[i].description_width);
		var T = SF.subform_type			== 'g'		? 0		: Number(o[i].top);
		var B = o[i].type				== 'lookup'	? 26	: 0;					//-- lookup button
		var D = o[i].type				== 'lookup'	? d		: 0;					//-- lookup description

		if(o[i].type == 'select'){
			w = Number(o[i].width) + B + D - 4;
		}else{
			w = Number(o[i].width) + B + D;
		}

		if(SF.subform_type == 'g'){													//-- grid

			nuBuildSubformTitle(o[i], l, w, id, i);
			//l = l + w + 6;
			l = l + w + (o[i].read == 2 ? 0 : 6);									//-- kev1n

		}

	}

}

function nuBuildSubformTitle(o, l, w, id, col){

	var titleId = 'title_' + id + o.id;
	var div		= document.createElement('div');
	var label	= nuTranslate(o.label);

	if(o.read == 2){
		label	= '';
	}

	div.setAttribute('id', titleId);

	$('#' + id).append(div);

	$('#' + titleId).css({'top'			: 0,
					'left'				: Number(l) + 9,
					'width'				: Number(w),
					'height'			: 50,
					'text-align'		: 'center',
					'position'			: 'absolute'
	})
	.html(label)
	.attr('data-nu-field', o.id)
	.attr('data-nu-subform', id)
	.attr('onclick', 'nuSortSubform("' + id + '", "' + (col + 1) + '", event)')
	.attr('data-nu-order', 'asc')
	.attr('ondblclick', 'nuPopup("nuobject", "' + o.object_id + '")')
	.addClass('nuTabHolder')
	.addClass(o.input=='number'||o.input=='nuNumber'?'number':'text')

	if(o.valid == 1){$('#' + titleId).addClass('nuBlank');}
	if(o.valid == 2){$('#' + titleId).addClass('nuDuplicate');}

}

function nuBuildSubformDeleteTitle(l, id, subform_id){

	var titleId		= id + 'DeleteSF';
		var div		= document.createElement('div');

		div.setAttribute('id', titleId);

		$('#' + id).append(div);

	$('#' + titleId).css({'top'			: 0,
					'left'				: Number(l)-12,
					'width'				: 52,
					'height'			: 50,
					'text-align'		: 'center',
					'font-size'			: 10,
					'padding'			: 0,
					'position'			: 'absolute'
	})
	.html('<img id="nuMoveable" src="graphics/numove.png" style="padding:8px;width:12px;height:12px;" title="Arrange Objects"><br>Delete')
	.addClass('nuTabHolder')
	.attr('onclick','nuPopup("'+subform_id+'", "-2");');

}

function nuAddBreadcrumbs(){

	var b	= window.nuFORM.breadcrumbs.length;

	iStart = nuMainForm() ? 1 : 0;

	for(var i = iStart ; i < b ; i++){
		nuAddBreadcrumb(i);
	}

}


function nuAddBreadcrumb(i){

	var isLast	= (i + 1 == window.nuFORM.breadcrumbs.length);					//-- last breadcrumb
	var bc		= window.nuFORM.breadcrumbs[i];
	var id		= 'nuBreadcrumb' + i;
	var div		= document.createElement('div');
	var h		= '<div id="nuarrow'+i+'" class="nuBreadcrumbArrow">&nbsp;<i class="fa fa-caret-right"></i>&nbsp;</div>';

	div.setAttribute('id', id);

	$('#nuBreadcrumbHolder').append(div);

	$('#' + id)
	.css('font-size', 14)
	.attr('onclick', 'nuGetBreadcrumb(' + i + ')')
	.html(h + nuTranslate(bc.title));

	if(isLast){
		$('#' + id).addClass('nuNotBreadcrumb')
	}else{
		$('#' + id).addClass('nuBreadcrumb')
	}

	if(i==0){
		$('#nuarrow0').remove()
	}

}


function nuMainForm(){

	var result = false;

	if(opener){

		try {
			result = nuDocumentID == opener.nuDocumentID;
		} catch ( error ) {
			result = false;
		}
	}

	return nuDocumentID == parent.nuDocumentID;

}

function nuSetTitle(t){

	if(nuFormType() == 'browse'){return;}

	nuFORM.setProperty('title', t);

	var b	= $('.nuBreadcrumb').length;
	var h	= '<div id="nuarrow' + (b-1) + '" class="nuBreadcrumbArrow">&nbsp;<i class="fa fa-caret-right"></i>&nbsp;</div>';
	
	if(nuFORM.breadcrumbs.length == 1){
		h	= '';
	}

	$('#nuBreadcrumb' + b).html(h + t);

}


function nuAddEditTabs(p, w){

	if(nuFormType() == 'edit'){
		nuSetStartingTab(p, w);
	}

	for(var i = 0 ; i < w.tabs.length ; i++){

		nuEditTab(p, w.tabs[i], i);

	}

	var l = 7;

	for(var i = 0 ; i < w.browse_columns.length ; i++){
		l = nuBrowseTitle(w.browse_columns, i, l);

		if (w.browse_columns[i].width != '0') {
			p = i;
		} 

	}

	var f		= nuFORM.getProperty('nosearch_columns');

	for(var i = 0 ; i < f.length ; i++){
		$('#nusort_' + f[i]).addClass('nuNoSearch');
	}

	window.nuBrowseWidth	= l;

	nuDetach();

	if(w.browse_columns.length > 0){

		nuBrowseTable();
		nuOptions('nuBrowseTitle' + p, w.form_id, 'browse', w.global_access);
		
	}

}

function nuSetStartingTab(p, w){

	var t				= window.nuFORM.getProperty('tab_start');

	if(w.tabs.length == 0){
		nuFORMHELP[p]	= ''
		return;
	}else{
		nuFORMHELP[p]	= nuTABHELP[w.tabs[0].id]
	}

	for(var i = 0 ; i < t.length ; i++){

		nuFORMHELP[p]	= nuTABHELP[w.tabs[0].id];

		if(t[i].prefix == p){return;}

	}

	t.push(new nuStartingTab(p));

}

function nuGetStartingTab(){

	var t = window.nuFORM.getProperty('tab_start');

	for(var i = 0 ; i < t.length ; i++){

		$('#' + t[i].prefix + 'nuTab' + t[i].tabNumber).addClass('nuTabSelected');
		$('#' + t[i].prefix + 'nuTab' + t[i].tabNumber).click();

	}

}


function nuSetTab(pthis){

	var t = window.nuFORM.getProperty('tab_start');

	for(var i = 0 ; i < t.length ; i++){

		if(t[i].prefix == $('#' + pthis.id).attr('data-nu-form-filter')){
			
			$('#' + t[i].prefix + 'nuTab' + t[i].tabNumber).addClass('nuTabSelected');
			t[i].
			$('#' + t[i].prefix + 'nuTab' + t[i].tabNumber).click();

		}

	}

}

function nuStartingTab(p){

	this.prefix		= p;
	this.tabNumber	= 0;

}

function nuEditTab(p, t, i){

	var tabId	= p + 'nuTab' + i;
	var div		= document.createElement('div');
	div.setAttribute('id', tabId);

	$('#' + p + 'nuTabHolder').append(div);
	$('#' + tabId)
	.html(nuTranslate(t.title))
	.addClass('nuTab')
	.addClass('nuDragNoSelect')
	.attr('data-nu-tab-filter', i)
	.attr('data-nu-form-filter', p)
	.attr('data-nu-tab-id', t.id)
	.attr('onclick','nuSelectTab(this)')

	window.nuTABHELP[t.id]	= t.help;

}

function nuOptions(p, f, t, access){

	var R			= window.nuFORM.getProperty('record_id');

	if(R != '-2') {

		var id		= p + 'nuOptions';
		var img		= document.createElement('l');

		img.setAttribute('id', id);

		if(t == 'subform') {

			$('#' + p).prepend(img);	

			$('#' + id)
			.attr('title', 'Options')
			.attr('onclick', 'nuGetOptionsList("' + f + '", this, "' + p + '", "' + access + '", "' + t + '")')
			.css({'top'			: 4, 
			'left'				: 2, 
			'position'			: 'relative', 
			'z-index'			: 1, 
			'width'				: 15, 
			'height'			: 15, 
			'font-size'			: 20,
			'text-align'		: 'center',
			'border-style'		: 'none'})
			.addClass('nuIcon fa fa-ellipsis-v')
			.hover(function(){
				$( this ).css('color', 'red');
			}, function(){
				$( this ).css('color', '');
			});

		}else{

			$('#nuBreadcrumbHolder').prepend('<div id="nuHomeGap" class="nuHomeGap"></div>');	
			$('#nuBreadcrumbHolder').prepend(img);	

			$('#' + id)
			.attr('title', 'Options')
			.attr('onclick', 'nuGetOptionsList("' + f + '", this, "' + p + '", "' + access + '", "' + t + '")')
			.css({'top'			: 5, 
			'right'				: 5, 
			'width'				: 15, 
			'height'			: 15, 
			'font-size'			: 20,
			'padding-right'		: 10,
			'text-align'		: 'right',
			'border-style'		: 'none'})
			.addClass('nuIcon fa fa-ellipsis-v')
			.hover(function(){
				$( this ).css('color', 'red');
			}, function(){
				$( this ).css('color', '');
			});

		}

	}

}

function nuAllowChanges(f){
	return nuSERVERRESPONSE.form_access == 0 || String(f).substr(0,2) != 'nu' || f == 'nuuserhome';
}

function nuGetOptionsList(f, t, p, a, type){

	// f: form ID
	// a: global_access

	var u		= nuFORM.getProperty('user_id');
	var list	= [];
	var ul		= '<ul>';

	if(nuFormType() == 'browse'){

		list.push([nuTranslate('Searchable Columns'), 'nuGetSearchList()', 'fa-columns', 'Ctrl+Shft+C']);

		if(a == 1 || f == 'nuuserhome'){ 

			if(nuAllowChanges(f)){

				list.push([nuTranslate('Form Properties'), 'nuPopup("nuform", "' + f + '")', 'fa-cog',	'Ctrl+Shft+F']);
				list.push([nuTranslate('Form Object List'), 'nuPopup("nuobject", "", "' + f + '")', 'fa-th-list', 'Ctrl+Shft+O']);

			}

		}else{
			list.push([nuTranslate('Change Login'), 'nuPopup("nupassword", "' + u + '", "")','fa-password', 'Ctrl+Shft+L']);
		}

		list.push([nuTranslate('Refresh'), 'nuGetBreadcrumb()', 'fa-refresh', 'Ctrl+Shft+R']);
		list.push([nuTranslate('Search'), 'nuSearchAction();', 'fa-square', 'Ctrl+Shft+S']);

		if(nuSERVERRESPONSE.buttons.Add == '1'){list.push([nuTranslate('Add'), 'nuAddAction();', 'fa-square', 'Ctrl+Shft+A']);}
		if(nuSERVERRESPONSE.buttons.Print == '1'){list.push([nuTranslate('Print'), 'nuPrintAction();', 'fa-square', 'Ctrl+Shft+P']);}

	}

	if(nuFormType() == 'edit'){

		if(a == 1){

			if(nuAllowChanges(f)){

				if (nuSERVERRESPONSE.objects.length > 0) {
					list.push([nuTranslate('Arrange Objects'), 'nuPopup("' + f + '", "-2")', 'fa-arrows', 'Ctrl+Shft+A']);
				}
				list.push([nuTranslate('Form Properties'), 'nuPopup("nuform", "' + f + '")', 'fa-cog', 'Ctrl+Shft+F']);
				list.push([nuTranslate('Form Object List'), 'nuPopup("nuobject", "", "' + f + '")', 'fa-th-list', 'Ctrl+Shft+O']);				
			}

		}else{

			if(type != 'subform'){
				list.push([nuTranslate('Change Login'), 'nuPopup("nupassword", "' + u + '", "")', 'fa-lock', 'Ctrl+Shft+L']);
			}

		}

		if(type != 'subform'){

			list.push([nuTranslate('Refresh'), 'nuGetBreadcrumb()', 'fa-refresh', 'Ctrl+Shft+R']);

			if(nuFORM.getCurrent().form_type != 'launch'){

				var data_mode = nuFORM.getCurrent().data_mode;

				if(nuSERVERRESPONSE.buttons.Save == '1' && data_mode !== 0){list.push([nuTranslate('Save'), 'nuSaveAction();', 'fa-square', 'Ctrl+Shft+S']);}
				if(nuSERVERRESPONSE.buttons.Delete == '1'){list.push([nuTranslate('Delete'), 'nuDeleteAction();', 'fa-square', 'Ctrl+Shft+Y']);}
				if(nuSERVERRESPONSE.buttons.Clone == '1'){list.push([nuTranslate('Clone'), 'nuCloneAction();', 'fa-square', 'Ctrl+Shft+C']);}

			}

		}

		if(nuFORMHELP[p] != ''){
			list.push([nuTranslate('Help'), nuFORMHELP[p], 'fa-question-circle', 'Ctrl+Shft+?']);
		}

	}

	if (a == 1 && (nuFormType() == 'browse' || nuFormType() == 'edit') ) {

		if(type != 'subform'){

			list.push(['', '', '', '']);

			list.push([nuTranslate('nuDebug Results'), 'nuPopup("nudebug", "")', 'fa-bug', 'Ctrl+Shft+D']);					
			list.push([nuTranslate('Database'), 'nuStartDatabaseAdmin();', 'fa-database', 'Ctrl+Shft+E']);		
			list.push([nuTranslate('Setup'), 'nuForm("nusetup","1","", "", 2)', 'fa-cogs', 'Ctrl+Shft+U']);		
			list.push([nuTranslate('Form Info'), 'nuShowFormInfo();', 'fa-info', 'Ctrl+Shft+I']);					

		}

	}	

	if(list.length == 0){return;}

	var id		= 'nuOptionsListBox';
	var div		= document.createElement('div');

	div.setAttribute('id', id);

	$('body').append(div);

	$('#' + id)
	.css({'top'		: 0,
	'height'		: 20 + (list.length * 20),
	'width'			: 300,
	'position'		: 'absolute',
	'z-index'		: 99,
	'text-align'	: 'left'})
	.html('<span style="font-weight:bold">&nbsp;&nbsp;Options<\span>')
	.addClass('nuOptionsList');

	nuBuildOptionsList(list, p, type);
	$('[data-nu-option-title]').css('padding', 3);
	
}

function nuBuildOptionsList(l, p, type){												//-- loop through adding options to menu

	var icon		= $('#' + p + 'nuOptions');
	var off			= icon.offset();
	var top			= off.top;
	var left		= off.left < 240 ? 240 : off.left;
	var ul			= '';
	var	iprop		= {'position': 'absolute','text-align' : 'left' , 'width' : 15, 'height' : 15};
	var width		= 0;
	var height		= 30 + (l.length * 30);

	for(var i = 0 ; i < l.length ; i++){
		var width	= Math.max((nuGetWordWidth(l[i][0]) + nuGetWordWidth(l[i][3])), width);
	}

	for(var i = 0 ; i < l.length ; i++){

		var t			= l[i][0]; // Text
		var f			= l[i][1]; // onclick
		var c			= l[i][2]; // Icon
		var k			= l[i][3]; // Shortcut
		var itemtop		= 30 + (i * 20);

		// Add Icon
		if (icon_id !== '') {
			var icon	= document.createElement('i');
			var icon_id	= 'nuOptionList' + i.toString();
	
			icon.setAttribute('id', icon_id);

			$('#nuOptionsListBox').append(icon);

			$('#' + icon.id)
			.css(iprop)
			.css({'top'	: itemtop, 'left' : 9})
			.addClass('fa')
			.addClass(c)
		}

		// Add Option Text 

		isDivider = t == '' ? true : false;

		var desc = document.createElement(isDivider ? 'hr' : 'div');
		var desc_id		= 'nuOptionText' + i.toString();

		desc.setAttribute('id', desc_id);

		$('#nuOptionsListBox').append(desc);
		var	prop		= {'position' : 'absolute', 'text-align' : 'left', 'height' : (isDivider ? 0 : 15)};

		if (isDivider) {

			$('#' + desc.id)
			.css(prop)
			.css({'top'	: itemtop - 4,'left' : 30})
			.html(t)
			.attr('onclick', f)			
			.addClass('nuOptionsItem-divider');

		} else{	

			$('#' + desc.id)
			.css(prop)
			.css({'top'	: itemtop - 4,'left' : 30})
			.html(t)
			.attr('onclick', f)
			.attr('data-nu-option-title', t)
			.addClass('nuOptionsItem');
		}

		// Add ahortcut
		if (k !== '') {
			var shortcut_key			= document.createElement('div');
			var shortcut_key_id			= 'nuOptionTextShortcutKey' + i.toString();

			shortcut_key.setAttribute('id', shortcut_key_id);

			if(type !== 'subform'){
				$('#nuOptionsListBox').append(shortcut_key);
			}

			var	prop			= {'position' : 'absolute', 'text-align' : 'left', 'height' : 15, 'width' : 50};

			$('#' + shortcut_key.id)
			.css(prop)
			.css({'top'	: itemtop - 2, 'right' : 10})
			.html(k)
			.attr('onclick', f)
			.addClass('nuOptionsItemShortcutKey');
		}

	}

	var icon	= $('#' + p + 'nuOptions');
	var off		= icon.offset();
	var top		= off.top;
	var left	= off.left;
	var reduce	= 0;

	if(type == 'browse'){

		top		= off.top;
		left	= 12

	}

	if(type == 'form'){

		top		= off.top - 6;
		left	= 10;

	}

	if(type == 'subform'){

		top		= off.top - 70;
		left	= off.left;
		reduce	= 55;

	}

	$('#nuOptionsListBox').css({
			'height'	: 40 + (l.length * 20),
			'width'		: 40 + width - reduce,
			'left'		: left,
			'top'		: top + 70
	});

	$('.nuOptionsItem').css({'width' : width - 73, 'padding' : '0px 0px 0px 3px'});
	$('.nuOptionsItem-divider').css({'width' : 35 + width - reduce, 'left' : 0});

}

function nuSelectAllTabs(pthis){

	var t = pthis.value;

	window.nuRESPONSIVE.setTabsColumn(t);

	if(t != ''){
		nuSelectTab($('#' + t)[0]);
	}

}

function nuSelectTab(tab){

	if(window.nuOnSelectTab){
		if (nuOnSelectTab(tab) == false) return;
	}

	$('.nuTabTitleColumn').remove();

	var filt = $('#' + tab.id).attr('data-nu-tab-filter');
	var form = $('#' + tab.id).attr('data-nu-form-filter');
	var tabId = $('#' + tab.id).attr('data-nu-tab-id');

	window.nuFORMHELP[form]	= window.nuTABHELP[tabId]

	var t	= nuFORM.getProperty('tab_start');

	for(var i = 0 ; i < t.length ; i++){

		if(t[i].prefix == form){

			t[i].tabNumber	= filt;
		}

	}

	// Treating nuIframes and nuHtml differently as anything that needs to calculate size can't be display: none when the page loads 
	$("[data-nu-form='" + form + "']:not('.nuIframe, .nuHtml')").hide();	
	$(".nuIframe[data-nu-form='" + form + "']").css('visibility','hidden');
	$(".nuHtml[data-nu-form='" + form + "']").css('visibility','hidden');
	$("[data-nu-form-filter='" + form + "']").removeClass('nuTabSelected');	

	$("[data-nu-form='" + form + "'][data-nu-tab='" + filt + "']:not([data-nu-lookup-id]):not('.nuIframe, .nuHtml')").show();
	$(".nuIframe[data-nu-form='" + form + "'][data-nu-tab='" + filt + "']").css('visibility','visible');
	$(".nuHtml[data-nu-form='" + form + "'][data-nu-tab='" + filt + "']").css('visibility','visible');
	$('#' + tab.id).addClass('nuTabSelected');

	if(window.nuOnTabSelected){
		nuOnTabSelected();
	}

}

function nuSelectTabByTitle(s) {
	var tabs = JSON.parse(JSON.stringify(nuSERVERRESPONSE)).tabs;
	var l = tabs.findIndex(data => data.title === s);
	if (l > -1) nuSelectTab($('#' + 'nuTab' + l)[0]); 
}

function nuRemoveTabs(t){

	for(var i = 0 ; i < arguments.length ; i++){
		$('#nuTab' + arguments[i]).remove();
	}

}

function nuHideTabByTitle(s) {

	var tabs = JSON.parse(JSON.stringify(nuSERVERRESPONSE)).tabs;
	var l = tabs.findIndex(data => data.title === s);
	if (l > -1) nuHide('nuTab' + l);

}

function nuHideTabs(t) {

	for (var i = 0; i < arguments.length; i++) {
		if (arguments[i] == parseInt(arguments[i])) {
			$('#nuTab' + arguments[i]).hide();
		} else {
			nuHideTabByTitle(arguments[i]);
		}
	}

}

function nuAddDataTab(i, t, p){

	var P = String(p);
	var f = P.substr(0, P.length - 3);
	$('#' + i).attr('data-nu-tab', t).attr('data-nu-form', f);

}

function nuBrowseTitle(b, i, l){

	var bc		= window.nuFORM.getCurrent();
	var un		= bc.nosearch_columns.indexOf(i);
	var id		= 'nuBrowseTitle' + i;
	var w		= Number(b[i].width);
	var a		= b[i].align;
	var div		= document.createElement('div');
	var ar		= {l:'left', c:'center', r:'right'};

	div.setAttribute('id', id);

	var sp	= '<span id="nusort_' + i + '" class="nuSort" onclick="nuSortBrowse(' + i + ')" ontouchstart="nuSortBrowse(' + i + ')"> ' + nuTranslate(b[i].title) + ' </span>'

	if(bc.sort == i){

		if(a == 'l'){

			if(bc.sort_direction == 'asc'){
				sp	= '<span id="nusort_' + i + '" class="nuSort" onclick="nuSortBrowse(' + i + ')"> ' + nuTranslate(b[i].title) + ' <i id="nuSortIcon" class="fa fa-caret-up"></i></span>'
			}else{
				sp	= '<span id="nusort_' + i + '" class="nuSort" onclick="nuSortBrowse(' + i + ')"> ' + nuTranslate(b[i].title) + ' <i id="nuSortIcon" class="fa fa-caret-down"></i></span>'
			}

		}else{

			if(bc.sort_direction == 'asc'){
				sp	= '<span id="nusort_' + i + '" class="nuSort" onclick="nuSortBrowse(' + i + ')"><i id="nuSortIcon" class="fa fa-caret-up"></i> ' + nuTranslate(b[i].title) + ' </span>'
			}else{
				sp	= '<span id="nusort_' + i + '" class="nuSort" onclick="nuSortBrowse(' + i + ')"><i id="nuSortIcon" class="fa fa-caret-down"></i> ' + nuTranslate(b[i].title) + ' </span>'
			}

		}

	}

	$('#nuRECORD').append(div);

	$('#' + id)
	.html(sp)
	.addClass('nuBrowseTitle')
	.css({	'text-align'	: ar[a],
			'overflow'		: 'visible',
			'width'			: w,
			'left'			: l,
	});

	if(w == 0){
		$('#' + id).hide();
	}

	// $('#nusort_' + i)[0].addEventListener('touchstart', function(event) { nuSortBrowse(i);}, { passive: true });

	$('#nusearch_' + i).attr('checked', un == -1);

	return l + nuTotalWidth(id);

}

function nuTitleDrag(i){

	var bc				= window.nuFORM.getCurrent();
	var col				= bc.browse_columns;
	var rows			= bc.rows;
	var h				= bc.row_height;
	var div				= document.createElement('div');

	div.setAttribute('id', 'nuTitleDrag' + i);

	$('#' + 'nuBrowseTitle' + i).append(div);

	$('#' + div.id)
	.addClass('nuDragLineV')
	.css('height', h)
	.attr('onmousedown', 'nuDragBrowseDown(event)')
	.attr('onmousemove', 'nuDragBrowseMove(event)')
	.attr('onmouseup','nuDragBrowseUp(event)');

}

function nuDragBrowseDown(e){

	var t					= parseInt($('#nuBrowseTitle0').css('top'));
	var l					= parseInt($('#nuBrowseTitle0').css('left'));
	var f					= parseInt($('#nuBrowseFooter').css('top'));

	window.nuDRAGLINEVSTART	= e.pageX;
	window.nuDRAGLINEVID	= e.target.id;

	$('#' + e.target.id).css('height', f-t);

}

function nuDragBrowseMove(e){

	if(window.nuDRAGLINEVID == '' || e.buttons != 1){return;}

	var l	= e.x

	$('#' + nuDRAGLINEVID).css('left', l);

}

function nuDragBrowseUp(e){

	var l	= e.offsetX;
	var h	= parseInt($('#nuBrowseTitle0').css('height'));

	$('#' + e.target.id).css('height', h);
	window.nuDRAGLINEVID	= '';

}

function nuBrowseColumnSize(e){

	var l	= $('#' + e.target.id)

	var bc					= window.nuFORM.getCurrent();
	var totalBrowseHeight	= bc.rows * bc.row_height;

	$('#' + e.target.id).css('height', 400);

}

function nuBrowseTable(){

	var bc				= window.nuFORM.getCurrent();
	var col				= bc.browse_columns;
	var row				= bc.browse_rows;
	var rows			= bc.rows;
	var h				= bc.row_height;
	var t				= parseInt($('#nuBrowseTitle0').css('height'))- h - 10;
	var l				= 7;

	for(r = 0 ; r < rows ; r++){

		l				= 7;
		t				= t + h + 7;

		for(c = 0 ; c < col.length ; c++){

			var w		= Number(col[c].width);
			var a		= nuAlign(col[c].align);
			var f		= col[c].format;
			var rw		= r;
			var column	= c;
			var id		= 'nucell_' + rw + '_' + c;
			var div		= document.createElement('div');

			div.setAttribute('id', id);

			$('#nuRECORD').append(div);

			$('#' + id)
			.attr('data-nu-row', rw)
			.attr('data-nu-column', column)
			.addClass('nuCell' + ((r/2) == parseInt(r/2) ? 'Even' : 'Odd'))
			.addClass(w == 0 ? '' : 'nuBrowseTable')
			.css({	'text-align'	: a,
					'overflow'	: 'hidden',
					'width'		: w,
					'top'		: t,
					'left'		: l,
					'height'	: h,
					'position'	: 'absolute'
			});

			if(w == 0){
				$('#' + id).hide();
			}

			if(w < 0){
				
				$('#' + id)
				.css('padding', 0)
				.css('border-width', 0);

			}

			if(r < row.length){

				$('#' + id)
				.html(nuFORM.addFormatting(row[r][c+1], col[c].format))
				.attr('data-nu-primary-key', row[r][0])
				.attr('onclick', 'nuSelectBrowse(event, this)')
				.hover(

					function() {

						if (window.nuBROWSERESIZE.moving_element == '') {
							$("[data-nu-row]").addClass('nuBrowseTable');
							$("[data-nu-row]").removeClass('nuSelectBrowse');

							var rw				= $( this ).attr('data-nu-row');
							window.nuBROWSEROW	= -1;

							$("[data-nu-row='" + rw + "']").not('.nuCellColored').addClass('nuSelectBrowse');
							$("[data-nu-row='" + rw + "']").not('.nuCellColored').removeClass('nuBrowseTable');
						}

					}, function() {

						if (window.nuBROWSERESIZE.moving_element == '') {
							$("[data-nu-row]").addClass('nuBrowseTable');
							$("[data-nu-row]").removeClass('nuSelectBrowse');

							var rw				= $( this ).attr('data-nu-row');
							window.nuBROWSEROW	= -1;

							$("[data-nu-row='" + rw + "']").addClass('nuBrowseTable');
							$("[data-nu-row='" + rw + "']").removeClass('nuSelectBrowse');
						}

					}
				);

			}

			l = l + (w == 0 ? 0 : nuTotalWidth(id));

		}

	}

	var la	= '<span id="nuLast" onclick="nuGetPage(' + (bc.page_number)	+ ')" class="nuBrowsePage">&#9668;</span>';
	var ne	= '<span id="nuNext" onclick="nuGetPage(' + (bc.page_number		+ 2) + ')" class="nuBrowsePage">&#9658;</span>';

	// var ne	= '<span style="font-size: 30px;" id="nuNext" onclick="nuGetPage(' + (bc.page_number + 2) + ')" class="nuBrowsePage"><i class="fa fa-caret-right " aria-hidden="true"></i></span>';

	var pg	= '&nbsp;Page&nbsp;';
	var cu	= '<input id="browsePage" style="text-align:center;margin:3px 0px 0px 0px;width:40px" onchange="nuGetPage(this.value)" value="' + (bc.page_number + 1) + '" class="browsePage"/>';
	var of	= '&nbsp;/&nbsp;' + (bc.pages==0?1:bc.pages) + '&nbsp;';

	var id	= 'nuBrowseFooter';
	var footerTop	= t + h + 10;
	var div = document.createElement('div');
	div.setAttribute('id', id);

	$('#nuRECORD').append(div);

	$('#' + id)
	.addClass('nuBrowseFooter')
	.html(la+pg+cu+of+ne)
	.css({	'text-align'	: 'center',
			'width'			: l - 7,
			'top'			: footerTop,
			'left'			: 7,
			'height'		: 25,
			'position'		: 'absolute',
			'padding'		: '5px 0px',
	});

	nuHighlightSearch();
	nuBrowseBorders();

	var h = nuTotalHeight('nuBrowseTitle0') + nuTotalHeight('nuBrowseFooter') + parseInt($('#nuWindow', window.parent.document).css('height'))-99;

	var rows	= $("[data-nu-column|='0']").length;
	var rheight	= nuTotalHeight('nucell_0_0');

	h			= footerTop + 130;

	$('#nuDragDialog',	window.parent.document).css({'height': h + 30, 'visibility': 'visible', 'overflow': 'hidden'});
	$('#nuWindow',		window.parent.document).css({'height': h -14});

	$('body').css('height', h-30);
	$('#nuRECORD').css('height', 0).css('width', 0);

}

function nuAlign(a){

	if(a == 'l'){return 'left';}
	if(a == 'r'){return 'right';}
	if(a == 'c'){return 'center';}

}

function nuClickSearchColumn(e){

	var c	= e.target.id.substr(12);
	$('#nuSearchList' + c).click();
	nuSetSearchColumn();

}

function nuSetSearchColumn(){

	var nosearch = [];

	$('.nuSearchCheckbox').each(function( index ) {

		if(!$(this).is(':checked')){

			nosearch.push(index);
			
			$('#nusort_' + index)
			.addClass('nuNoSearch')

		}else{

			$('#nusort_' + index)
			.removeClass('nuNoSearch')
		}

	});

	window.nuFORM.setProperty('nosearch_columns', nosearch);

}

function nuSetNoSearchColumns(a){

	var s	= nuFORM.getCurrent().nosearch_columns;
	a		= s.concat(a);

	for(var i = 0 ; i < a.length ; i++){
		$('#nusort_' + a[i]).addClass('nuNoSearch');
	}

	nuFORM.setProperty('nosearch_columns', a);

}

function nuSearchPressed(e){

	if(!e){e=window.event;}

	if(e.keyCode == 13 && window.nuBROWSEROW == -1){					//-- enter key
		$('#nuSearchButton').click();
	}else if(e.keyCode == 13 && window.nuBROWSEROW != -1){				//-- enter key

		var i	= '#nucell_' + window.nuBROWSEROW + '_0';

		nuSelectBrowse('', $(i)[0]);

	}else{

		window.nuBROWSEROW = -1;
		$("[data-nu-row]").addClass('nuBrowseTable');
		$("[data-nu-row]").removeClass('nuSelectBrowse');

	}

}

function nuArrowPressed(e){

	if(!e){e=window.event;}

	var rows	= $("[data-nu-column='0'][data-nu-primary-key]").length - 1;

	if(e.keyCode == 38){					//-- up

		if(window.nuBROWSEROW == -1){
			window.nuBROWSEROW	= rows;
		}else{
			window.nuBROWSEROW	= window.nuBROWSEROW - 1;
		}

		$("[data-nu-row]").addClass('nuBrowseTable');
		$("[data-nu-row]").removeClass('nuSelectBrowse');

		$("[data-nu-row='" + window.nuBROWSEROW + "']").addClass('nuSelectBrowse');
		$("[data-nu-row='" + window.nuBROWSEROW + "']").removeClass('nuBrowseTable');

	}

	if(e.keyCode == 40){					//-- down

		if(window.nuBROWSEROW == rows){
			window.nuBROWSEROW	= -1;
		}else{
			window.nuBROWSEROW	= window.nuBROWSEROW + 1;
		}

		$("[data-nu-row]").addClass('nuBrowseTable');
		$("[data-nu-row]").removeClass('nuSelectBrowse');

		$("[data-nu-row='" + window.nuBROWSEROW + "']").addClass('nuSelectBrowse');
		$("[data-nu-row='" + window.nuBROWSEROW + "']").removeClass('nuBrowseTable');

	}

}

function nuSearchAction(S, F){

	if(arguments.length > 0){
		$('#nuSearchField').val(S);
	}
	if(arguments.length == 2){
		$('#nuFilter').val(F);
	}

	var s	= String($('#nuSearchField').val()).replaceAll("'","&#39;", true);
	var f	= String($('#nuFilter').val()).replaceAll("'","&#39;", true);
	var c	= arguments.callee.caller === null ? '' : arguments.callee.caller.name;

	if(window.nuOnSearchAction){
		let o = {search: s, filter: f};
		if(nuOnSearchAction(o) === false ){return;}
		s = o.search;
		f = o.filter;
	}

	window.nuFORM.setProperty('search', s);
	window.nuFORM.setProperty('filter', f);

//	if(arguments.length == 0 && arguments.callee.caller !== 'nuGetPage'){

	if(arguments.length === 0 && c != 'nuGetPage'){
		window.nuFORM.setProperty('page_number', 0);
	}
	if(arguments.length >= 1){
		window.nuFORM.setProperty('page_number', 0);
	}

	nuGetBreadcrumb();

}

function nuAddAction(){

	var bc					= window.nuFORM.getCurrent();
	nuForm(bc.redirect_form_id, '-1');

}

function nuRunPHPAction(code) {
	nuRunPHP(code);
}

function nuRunReportAction(code) {
	nuRunReport(code);
}

function nuEmailReportAction(code) {
	nuEmailReport(code);
}

function nuSortBrowse(c){

	var l					= window.nuFORM.getCurrent();
	l.filter				= $('#nuFilter').val();
	l.page_number			= 0;

	if(c == l.sort){
		l.sort_direction	= l.sort_direction == 'asc' ? 'desc' : 'asc';
	}else{

		l.sort				= c;
		l.sort_direction	= 'asc';

	}

	nuSearchAction();

}

function nuGetPage(p){

	var P = parseInt('00' + p);
	var B = window.nuFORM.getCurrent();

	if(P == 0){
		P = 1;
	}

	if(P > B.pages){
		P = B.pages;
	}

	B.page_number = P - 1;

	nuSearchAction();

}

function nuPopulateLookup(fm, target){

	var p		= String($('#' + target).attr('data-nu-prefix'));
	var f		= fm.lookup_values;

	window.nuSubformRow	= Number(p.substr(p.length - 3));

	for(var i = 0 ; i < f.length ; i++){

		var	id	= String(f[i][0]);

		if(id.substr(0, p.length) != p){
			id	= p + id;
		}

		$('#' + id).addClass('nuEdited');

		if($('#' + id).attr('type') == 'checkbox'){

			if(f[i][1] == '1'){
				$('#' + id).prop('checked', true); 
			}else{
				$('#' + id).prop('checked', false);
			}

		}else{

			$('#' + id).val(f[i][1]);

			if($('#' + id).attr('data-nu-format') !== undefined){

				nuReformat($('#' + id)[0]);
				$('#' + id).addClass('nuEdited')
				$('#' + p + 'nuDelete').prop('checked', false);

			}

		}

		if(i == 1){$('#' + id).focus();}

	}

	window.nuLOOKUPSTATE[$('#' + target).attr('data-nu-object-id')] = 'found';

	nuCalculateForm();

	eval(fm.lookup_javascript);

	$('#dialogClose').click();

}

function nuChooseOneLookupRecord(e, fm){

	var o						= new nuLookupObject(e.target.id);
	var i						= o.id_id;
	var t						= document.getElementById(e.target.id);
	var like					= nuEncode(fm.lookup_like);

	if(fm.lookup_values.length	== 0){
		nuGetLookupId('', i);
	}

	if(fm.lookup_values.length	== 1){

		if(e.target.value.toUpperCase() == fm.lookup_values[0][1].toUpperCase()){
			nuGetLookupId(fm.lookup_values[0][0], i);
		}else{
			nuBuildLookup(t, e.target.value);
		}

	}

	if(fm.lookup_values.length > 1){
		nuBuildLookup(t, e.target.value, like);
	}

}

function nuLookupObject(id, set, value){

	if($('#' + id).length == 0){

		this.id_id				= '';
		this.code_id			= '';
		this.description_id		= '';
		this.id_value			= '';
		this.code_value			= '';
		this.description_value	= '';

		return;

	}

	var i						= nuValidLookupId(id, 'code');
	i							= nuValidLookupId(i, 'description');
	this.id_id					= i;
	this.code_id				= i + 'code';
	this.description_id			= i + 'description';
	this.id_value				= $('#'	+ this.id_id).val();
	this.code_value				= $('#'	+ this.code_id).val();
	this.description_value		= $('#'	+ this.description_id).val();

	if(arguments.length == 3 && set == 'id'){
		$('#' + this.id).val(value);
	}
	if(arguments.length == 3 && set == 'code'){
		$('#' + this.code).val(value);
	}
	if(arguments.length == 3 && set == 'description'){
		$('#' + this.description).val(value);
	}

}

function nuValidLookupId(id, fld){

	var i	= String(id);
	var f	= String(fld);
	var il	= i.length;
	var fl	= f.length;

	if(i.substr(il-fl) === f){

		i			= i.substr(0, il - fl);

		if($('#' + i + f).length == 1 && $('#' + i + f + f).length == 1){
			
			i	= i + f;

		}

	}

	return i;

}

function nuHighlightSearch(){

	var bc		= window.nuFORM.getCurrent();
	if (bc.search.length == 0) return;

	var exclude	= bc.nosearch_columns;

	var search	= String(bc.search)
	.split(' ')
	.filter(function(a) {return (a != '' && a.substr(0,1) != '-')})
	.sort(function(a,b) {return (a.length > b.length)});

	$('.nuBrowseTable').each(function(index){
		
		var col	= Number(String($(this).attr('data-nu-column')));

		if(exclude.indexOf(col) == -1){

			for(var i = 0 ; i < search.length ; i++){

				$(this).nuHighlight(search[i]);

			}

		}

	});

}

function nuChange(e){

	if(e.target.id.substr(-8) == 'nuDelete'){

		var sfid	= $(e.target).parent().parent().parent()[0].id;
		var click	= $('#' + sfid).attr('data-nu-clickdelete');

		eval(click);

		nuHasBeenEdited();
		nuCalculateForm();

		return;

	}

	nuSetSaved(false);

	var t	= $('#' + e.target.id)[0];
	var p	= $('#' + t.id).attr('data-nu-prefix');

	nuReformat(t);

	$('#' + p + 'nuDelete').prop('checked', false);
	$('#' + t.id).addClass('nuEdited');
	nuHasBeenEdited();

	$('#nuCalendar').remove();
	$('#' + t.id).removeClass('nuValidate');
	nuCalculateForm();

	if(p == ''){return;}

	nuAddSubformRow(t, e);

}

function nuChooseEventList(){

	if($('#sob_all_type').val() == 'subform'){

		return ['beforeinsertrow','afterinsertrow','clickdelete'];

	}else{

		return ['onblur','onclick','onchange','onfocus','onkeydown'];

	}

}

function nuChangeFile(e){

	if(e.target.id.substr(-8) == 'nuDelete'){

		nuHasBeenEdited();
		return;

	}

	var theFile			= e.target.id;
	var theTextarea		= theFile.substr(0, theFile.length - 5);

	if($('#' + theFile).val()==''){return;}

	var a		= $('#' + theFile)[0].files[0];
	var r		= new FileReader();

	r.onload	= function(e) {

		var f	= btoa(r.result);
		var o	= {'file' : f, 'name' : a.name, 'size' : a.size, 'type' : a.type};
		var j	= JSON.stringify(o);

		if(j.length > 600000){

			nuMessage([nuTranslate('File is too large, cannot be saved. Must be under 300Kb')]);
			return;

		}

		$('#' + theTextarea).val(j).addClass('nuEdited');

	}

	r.readAsDataURL(a);

	var t	= $('#' + theFile)[0];
	var p	= $('#' + theTextarea).attr('data-nu-prefix');

	$('#' + p + 'nuDelete').prop('checked', false);
	$('#' + theTextarea).addClass('nuEdited');

	nuHasBeenEdited();

	if(p == ''){return;}

	nuAddSubformRow(t, e);

}

function nuCalculateForm(setAsEdited){	//-- calculate subform 'calcs' first

	var subformFirst	= function(a, b){

		var A			= $('#' + a.id).hasClass('nuSubformObject') ? 0 : 1000;
		var B			= $('#' + b.id).hasClass('nuSubformObject') ? 0 : 1000;
		var a			= parseInt($('#' + a.id).attr('data-nu-calc-order'));
		var b			= parseInt($('#' + b.id).attr('data-nu-calc-order'));

		if(arguments.length == 0){
			$('#' + a.id).addClass('nuEdited');
		}

		return (a + A) - (b + B);
	
	}

	var f	= $("[data-nu-formula]");

	f.sort(subformFirst);

	f.each(function( index ) {		//-- start with calculations inside a subform

		$(this).addClass('nuEdited');

		var formula		= $(this).attr('data-nu-formula');
		var fmt			= $(this).attr('data-nu-format');
		var v			= 0;

		if(formula != ''){
			eval('var v = ' + formula);
		}

		var fixed		= nuFORM.addFormatting(v, fmt);

		$(this).val(fixed);

	});	

}

function nuHasBeenEdited(){

	$('#nuSaveButton').addClass('nuSaveButtonEdited');
	nuFORM.edited	= true;
	nuSetSaved(false);

}

function nuHasNotBeenEdited(){

	$('#nuSaveButton').removeClass('nuSaveButtonEdited');
	nuFORM.edited	= false;
	nuSetSaved(true);

}

function nuDeleteAction(){

	if (confirm(nuTranslate("Delete This Record?"))){
		$('#nuDelete').prop('checked', true);

		nuUpdateData('delete');

	}

}

function nuDeleteAllAction(){

if (confirm(nuTranslate("Delete This Record?"))){
		$('#nuDelete').prop('checked', true);

		nuUpdateData('delete', 'all');

	}

}

function nuCloneAction(){

	nuSetProperty('CLONED_RECORD', 1);
	nuSetProperty('CLONED_RECORD_ID', nuFORM.getCurrent().record_id);

	window.nuTimesSaved	= 0;

	$('[data-nu-primary-key]').each(function(index){

			$(this).attr('data-nu-primary-key','-1');

	});

	$('[data-nu-field]').each(function(index){

		$(this).addClass('nuEdited');

	});

	window.nuFORM.setProperty('record_id', -1);

	$('#nuCloneButton').css('visibility','hidden');
	$('#nuDeleteButton').css('visibility','hidden');

	$('#nuSaveButton')
	.css('background-color', 'red')
	.css('visibility','visible');

	nuCLONE	= true;
	nuEmptyNoClone();

	if(window.nuOnClone){
		nuOnClone();
	}

}

function nuEmptyNoClone(){

	var c		= nuSERVERRESPONSE.noclone;

	if (c === null) return;

	for(var i = 0 ; i < c.length ; i++){

		if(c[i].subform){

			$('#' + c[i].id + 'scrollDiv' + ' > .nuSubform1').remove();
			$('#' + c[i].id + 'scrollDiv' + ' > .nuSubform0').each(function( index ) {

				if($(this)[0].id != c[i].id + '000nuRECORD'){
					$(this).remove();
				}

			});

			var k	= $('#' + c[i].id + '000nuRECORD').children();

			for(var s = 0 ; s < k.length ; s ++){

				if($('#' + k[s].id).hasClass('nuEdited')){

					$('#' + k[s].id).val('');

					if($('#' + k[s].id + 'button').length == 1){

						$('#' + k[s].id + 'code').val('');
						$('#' + k[s].id + 'description').val('');

					}

				}

			}

			$('#' + c[i].id + '000nuDelete').prop('checked', true);
			$('#' + c[i].id + '001nuRECORD').remove();

		}else{

			if($('#' + c[i].id).length == 1){
				$('#' + c[i].id).val('').change();
			}

		}

	}

}

function nuIsClone(){
	return nuCLONE;
}

function nuIsNewRecord(){
	return nuFORM.getCurrent().record_id == -1 && !nuCLONE;
}

function nuSaveAction(){

	if(!nuLookingUp()){

		if(nuNoDuplicates()){
			nuUpdateData('save');
		}
	}

}

function nuSavingProgressMessage(){

	var e = document.createElement('div');

	e.setAttribute('id', 'nuProgressSaved');

	$('#nuActionHolder').append(e);
	$('#' + e.id).html('<img src=\'core/ajax-loader.gif\'/>');
	$('#' + e.id).addClass('nuSaveMessageProgress');
	$('#' + e.id).css('position','absolute');
	$('#' + e.id).css('left',(($('#nuActionHolder').width() / 2) - ($('#nuProgressSaved').width() / 2))+ 'px');
	$('#' + e.id).show();

	$('.nuActionButton').hide();

}

function nuSavingMessage(){

	$("#nuProgressSaved").hide();

	var e = document.createElement('div');

	e.setAttribute('id', 'nuNowSaved');

	$('#nuActionHolder').append(e);
	$('#' + e.id).html('Record Saved');
	$('#' + e.id).addClass( 'nuSaveMessage');
	$('#' + e.id).css('position','absolute');
	$('#' + e.id).css('left',(($('#nuActionHolder').width() / 2) - ($('#nuNowSaved').width() / 2))+ 'px');
	$("#nuNowSaved").fadeToggle(3000);

	$('.nuActionButton').show();

} 

function nuAbortSave(){

	$("#nuProgressSaved").hide();
	$('.nuActionButton').show();

}

function nuSetSaved(v) {

	if(window.nuOnSetSaved){
		nuOnSetSaved();
	}

	window.nuSAVED = v;	
}

function nuFormsUnsaved() {

	let c = 0;
	$.each($('iframe'), function() {
		let t = $(this)[0];
		if (typeof t.contentWindow['nuIsSaved'] === 'function') {
			if (!t.contentWindow.nuIsSaved()) { c++; }
		}		
	})

	if (! nuIsSaved()) c++;
	return c;

}

function nuAddJavascript(o){

	var nuLoadEdit		= null;
	var nuLoadBrowse	= null;

	var s				= document.createElement('script');
	s.innerHTML			= "\n\n" + o.javascript + "\n\n";

	$('body').append(s);

}

function nuHashFromEditForm(){

	var A				= {};
	var S				= nuSubformObject('');
	var B				= nuFORM.getCurrent();

	if(S.rows.length == 0 ){return A;}

	for (var key in B) {
		A[key]	= B[key];
	}

	for(var i = 0 ; i < S.fields.length ; i++){
		A[S.fields[i]]	= S.rows[0][i];
	}

	return A;

}

function nuDetach(){

	$('.nuDragLineV').each(function( index ) {

		var j	= $(this);
		var o	= j.offset();
		var t	= j.css('top', o.top);
		var l	= j.css('left', o.left);

		j.appendTo('body')

	});	

}

function nuSearchableList(){

	var bc				= window.nuFORM.getCurrent();
	var col				= bc.browse_columns;
	var no				= bc.nosearch_columns;
	var div				= document.createElement('div');

	div.setAttribute('id', 'nuSearchableDialog');

	$('body').append(div);

	$('#nuSearchableDialog')
	.addClass('nuSearchableDialog')
	.css('width', 150)
	.css('height', 30 + (col.length * 20))
	.css('top', 10)
	.css('left', 10);

	for(var i = 0 ; i < col.length ; i++){

		var input				= document.createElement('input');
		var search				= bc.nosearch_columns.indexOf(i) == -1 ? false : true;

		input.setAttribute('id', 'nuSearchableCheckbox' + i);

		$('#nuSearchableDialog').append(input);

		$('#' + 'nuSearchableCheckbox' + i)
		.append(input)
		.addClass('nuSearchableDialog')
		.css('left', 5)
		.css('height', 25)
		.css('top', 10 + (i * 27))
		.checked				= search;

		if(search){
			$('#' + 'nuSearchableCheckbox' + i)
			.addClass('nuNoSearch')
		}

		var span				= document.createElement('span');

		span.setAttribute('id', 'nuSearchableTitle' + i);

		$('#nuSearchableDialog').append(input);

		$('#' + 'nuSearchableTitle' + i)
		.append(span)
		.addClass('nuSearchableDialog')
		.css('width', 25)
		.css('left', 25)
		.css('height', 25)
		.css('top', 10 + (i * 20))
		.html(col[i].title);

	}

}

function nuWidestTitle(c){

	var w		= 120;

	for(var i = 0 ; i < c.length ; i++){

		var t	= String(c[i].title).replaceAll('<br>', ' ').replaceAll('<p>', ' ');;
		w		= Math.max(nuGetWordWidth(t), w);

	}

	return w + 70;

}

function nuGetSearchList(){

	var n		= nuFORM.getProperty('nosearch_columns');
	var c		= nuFORM.getProperty('browse_columns');
	var d		= document.createElement('div');

	$('#nuOptionsListBox').remove();

	var widest	= nuWidestTitle(c) + 20;

	d.setAttribute('id', 'nuSearchList');

	$('body').append(d);

	$('#' + d.id).css({
		'width'				: widest + 20,
		'height'			: 10 + (c.length * 30),
		'top'				: 138,
		'left'				: (window.nuBrowseWidth - widest) / 2,
		'position'			: 'absolute',
		'text-align'		: 'left'
	})
	.html('<span style="font-weight:bold">&nbsp;&nbsp;' + nuTranslate('Include When Searching') + '<\span>')
	.addClass('nuOptionsList');

	for(var i = 0 ; i < c.length ; i++){

		var isChecked	= true;

		if($.inArray(i,nuFORM.getCurrent().nosearch_columns) != '-1') {
			isChecked	= false;
		}

		var p			= document.createElement('input');

		p.setAttribute('id', 'nuSearchList' + i);
		p.setAttribute('type', 'checkbox');

		$('#' + d.id).append(p);

		$('#' + p.id).css({
			'width'			: 20,
			'height'		: 25,
			'top'			: 30 + (i * 25),
			'left'			: 5,
			'position'		: 'absolute',
			'text-align'	: 'left'
		})
		.prop('checked', isChecked)
		.attr('onclick', 'nuSetSearchColumn();')
		.addClass('nuSearchCheckbox');

		var t			= document.createElement('div');
		var nobr		= String(c[i].title).replaceAll('<br>', ' ').replaceAll('<p>', ' ');;

		t.setAttribute('id', 'nuSearchText' + i);

		$('#' + d.id).append(t);

		$('#' + t.id).css({
			'height'		: 25,
			'top'			: 33 + (i * 25),
			'left'			: 40,
			'position'		: 'absolute',
			'text-align'	: 'left'
		})
		.attr('onclick', 'nuClickSearchColumn(event);')
		.addClass('nuOptionsItem')
		.html(nobr)
		.click(function() {

			var cb = $('#nuSearchList' + i).attr('checked');

			$('#' + 'nuSearchList' + i).attr('checked', !cb);

			nuSetSearchColumn();

		});

		var shortcut_key	= document.createElement('div');
		var shortcut_key_id	= 'nuSearchTextShortcutKey' + i.toString();

		shortcut_key.setAttribute('id', shortcut_key_id);

		$('#nuSearchList').append(shortcut_key);

		var	prop			= {'position' : 'absolute', 'text-align' : 'left', 'height' : 15, 'width' : 50};

		$('#' + shortcut_key.id)
		.css(prop)
		.css({'top'	: 37 + (i * 25), 'right' : 10})
		.html('Ctrl+Shift+' + i)
		.addClass('nuOptionsItemShortcutKey');
	}

	$('.nuOptionsItem').css({'width' : widest - 90, 'padding' : '3px 0px 0px 3px'});
	$('#nuSearchList').css({'height' : 50 + (c.length * 25)});

}

function nuTotal(f){
	return Number(nuFORM.calc(f));
}

function nuMessage(o){

	window.nuHideMessage	= false;

	var par		= window.document;

	$('#nuMessageDiv', par).remove();

	if(o.length == 0){return;}

	var widest	= 5;

	for(var i = 0 ; i < o.length ; i++){
		widest	= Math.max(widest, nuGetWordWidth(o[i]));
	}

	widest		= Math.min(widest + 200, 1000);
//
//	var l		= ( $(window.top.document).width() - widest) / 2;
	var w = $(this).innerWidth();
	var l = Math.max(0, $(this).scrollLeft() + ( w - widest) / 2);
//	$('body', par).append("<div id='nuMessageDiv' class='nuMessage' style='position:fixed; overflow:hidden;width:" + widest + "px;top:55px; left:10px' ></div>")	
	$('body', par).append("<div id='nuMessageDiv' class='nuMessage' style='overflow:hidden;width:" + widest + "px;left:" + l + "px' ></div>")

	for(var i = 0 ; i < o.length ; i++){

		$('#nuMessageDiv', par).append(o[i]);
		$('#nuMessageDiv', par).append('<br>');

	}

}

function nuWindowPosition(){

	var d						= $('#nuDragDialog', window.parent.document);

	var l						= parseInt(d.css('left'));
	var t						= parseInt(d.css('top'));
	var w						= parseInt(d.css('width'));
	var h						= parseInt(d.css('height'));

	window.nuDialogSize			= {left:l, top:t, width:w, height:h};

	var d						= $('#nuWindow', window.parent.document);

	var w						= parseInt(d.css('width'));
	var h						= parseInt(d.css('height'));

	window.nuWindowSize			= {width:w, height:h};

}

function nuNoDuplicates(){

	window.nuDuplicate	= true;

	$('.nuTabHolder.nuDuplicate').each(function( index ) {

		var t	= $(this).html();
		var f	= $(this).attr('data-nu-field');
		var s	= $(this).attr('data-nu-subform');
		var sf	= nuSubformObject(s);
		var a	= [];
		var c	= sf.fields.indexOf(f);

		for(var i = 0 ; i < sf.rows.length ; i++){

			if(sf.deleted[i] == 0){

				var rv	= sf.rows[i][c];

				if(a.indexOf(rv) != -1){

					nuMessage(['Duplicate <b>' + t + '</b> on row <b>' + i + '</b>']);

					window.nuDuplicate	= false;

					return;

				}

				a.push(sf.rows[i][c]);

			}

		}

	});

	return window.nuDuplicate;

}

function nuFormType(){

	if(nuFORM.getCurrent() == undefined){return '';}

	if(nuFORM.getCurrent().record_id == ''){
		return 'browse';
	}else{
		return 'edit';
	}

}

function nuBuildFastReport(){

	var sf				= nuSubformObject('fast_report_sf');
	var left			= 3;
	var rows			= sf.rows;
	window.nuNextID		= 0;
	window.nuREPORT		= JSON.parse(JSON.stringify(window.nuREPORTdefault));

	for(var i = 0 ; i < rows.length ; i++){

		if(sf.deleted[i] == '0'){

			var title	= rows[i][1];
			var field	= rows[i][2];
			var width	= Number(rows[i][3]);
			var sum		= rows[i][4];
			var align	= sum==0?'left':'right';

			var o		= JSON.parse(JSON.stringify(window.nuOBJECT));		//-- title
			o.left		= Number(left);
			o.width		= width;
			o.top		= 70;
			o.fieldName	= title;
			o.objectType= 'label';
			o.textAlign	= align;

			nuFastObject(2,0,o);

			var o		= JSON.parse(JSON.stringify(window.nuOBJECT));		//-- field
			o.left		= Number(left);
			o.width		= width;
			o.fieldName	= field;
			o.textAlign	= align;

			nuFastObject(0,0,o);

			if(align == 'right'){

				var o		= JSON.parse(JSON.stringify(window.nuOBJECT));		//-- sum
				o.left		= Number(left);
				o.width		= width;
				o.fieldName	= 'SUM(' + field + ')';
				o.textAlign	= align;

				nuFastObject(1,1,o);

			}

			left		= left + width + 2;

		}

	}

	nuFastReportFormat(left);

	$('#fieldlist').val(JSON.stringify(window.nuREPORT));

	nuFORM.setProperty('nuREPORT', window.nuREPORT);

}

function nuFastObject(g,s,o){

	o.id			= 'obj' + nuPad3(window.nuNextID);
	o.name			= o.id;
	o.left			= Number(o.left) + 2;

	nuREPORT.groups[g].sections[s].objects.push(o);

	window.nuNextID++;

}

function nuNewFastObject(){

	var o			= JSON.parse(JSON.stringify(window.nuOBJECT));
	o.id			= 'obj' + nuPad3(window.nuNextID);
	o.name			= o.id;

	window.nuNextID++;

	return o;

}

function nuFastReportFormat(width){

	var o			= nuNewFastObject();		//-- report title
	o.left			= 2;
	o.top			= 10;
	o.width			= 300;
	o.height		= 30;
	o.fontWeight	= 'b';
	o.fontSize		= '20';
	o.objectType	= 'label';
	nuREPORT.width	= 297;
	nuREPORT.height	= 210;
	var pageWidth	= 290 * 4;
	var sf			= nuSubformObject('fast_report_sf');

	nuREPORT.orientation = 'L';
	nuREPORT.groups[3].sortField			= sf.rows[0][2];
	nuREPORT.groups[2].sections[0].height	= 100;
	nuREPORT.groups[2].sections[0].objects.push(o);

	var o			= nuNewFastObject();		//-- underline titles
	o.left			= 2;
	o.top			= 93;
	o.width			= width;
	o.height		= 1;
	o.borderWidth	= 1;
	o.objectType	= 'label';
	o.fieldName		= 'KEEP EXACT HEIGHT';

	nuREPORT.groups[2].sections[0].objects.push(o);

	var o			= nuNewFastObject();		//-- page footer
	o.left			= 2;
	o.top			= 3;
	o.width			= pageWidth;
	o.height		= 1;
	o.borderWidth	= 1;
	o.objectType	= 'label';
	o.fieldName		= 'KEEP EXACT HEIGHT';

	nuREPORT.groups[2].sections[1].objects.push(o);

	var o			= nuNewFastObject();		//-- page footer date
	o.left			= 2;
	o.top			= 9;
	o.width			= 600;
	o.fieldName		= 'Printed : #day#-#month#-20#year# #hour#:#minute#:#second#';
	o.objectType	= 'label';

	nuREPORT.groups[2].sections[1].objects.push(o);

	var o			= nuNewFastObject();		//-- page footer page no.
	o.top			= 9;
	o.left			= pageWidth - 200;
	o.width			= 200;
	o.textAlign		= 'right';
	o.fieldName		= 'Page #page# of #pages#';
	o.objectType	= 'label';

	nuREPORT.groups[2].sections[1].objects.push(o);

	if(nuREPORT.groups[1].sections[1].objects.length > 0){

		var o			= nuNewFastObject();		//-- overline sums
		o.left			= 2;
		o.top			= 3;
		o.width			= width;
		o.height		= 1;
		o.borderWidth	= 1;
		o.objectType	= 'label';
		o.fieldName		= 'KEEP EXACT HEIGHT';

		nuREPORT.groups[1].sections[1].objects.push(o);

	}

}

function nuRedefine_nuSelectBrowse(){

	nuSelectBrowse = function (e, t){

		var y				= window.nuBrowseFunction;					//-- browse, lookup or custom function name
		var i				= window.nuTARGET;
		var p				= $('#' + t.id).attr('data-nu-primary-key');
		var f				= window.nuFORM.getProperty('form_id');
		var r				= window.nuFORM.getProperty('redirect_form_id');
		
		nuCursor('progress');

		if(y == 'browse'){

			if(r == ''){
				nuForm(f, p);
			}else{
				nuForm(r, p);
			}

		}else if(y == 'lookup'){

			window.parent.nuGetLookupId(p, i);			//-- called from parent window

		}else{

			window[y](e);

		}

		if (e.ctrlKey == false) {
			nuSelectBrowse = function (e, t) {} //-- so that it doesn't run twice.
		}

	}

}

function nuSetVerticalTabs(){

	$('#nuTabHolder').css('display', 'inline-block');
	$('.nuTab').css('display', 'block');
	$('#nuRecord').css('display', 'inline-block');
	$('.nuTab').css('padding', '8px 2px 0px 2px');
	$('#nuTabHolder').css('height', window.innerHeight)

	var w = 0;

	var s = '&nbsp;&nbsp;&nbsp;';
	$('.nuTab').each(function( index ) {
		$(this).html($(this).html().includes(s) ? $(this).html() : s + $(this).html());
		w = Math.max(w, nuGetWordWidth($(this).html()));

	});

	$('#nuTabHolder').css('width', w + 30);
	$('.nuTab').css('width', w + 30);

	window.nuVerticalTabs = true;
}

function nuHasBeenSaved(){

	return window.nuTimesSaved;	

}

function nuResponseDefault(){

	if(nuFormType() == 'edit'){
		nuRESPONSIVE.resetDefault('', false);
	}

}

function nuResponseWrap(){

	if(nuFormType() == 'edit'){
		nuRESPONSIVE.setTabsColumn('', false);
	}

}

function nuResponseNoWrap(){

	if(nuFormType() == 'edit'){
		nuRESPONSIVE.setTabsColumn('', true);
	}

}

function nuResponsiveWrap(width, wrap){

	if(window.innerWidth >= width){
		nuResponseDefault();		
	}

	if(window.innerWidth < width){

		if(window.innerWidth < wrap){
			nuResponseWrap();
		}else{
			nuResponseNoWrap();
		}

	}

}

function nuBrowseBorders(){

	var r	= nuSERVERRESPONSE.rows;
	var c	= nuSERVERRESPONSE.browse_columns.length;

	for(var i = 0 ; i < c ; i++){

		$('#nucell_0_' + i).addClass('nuBrowseBorderTop');				
		$('#nucell_' + (r-1) + '_' + i).addClass('nuBrowseBorderBottom');

	}

}

function nuObjectPosition(i) {

	var t = parseInt($(i).css('top'));
	var l = parseInt($(i).css('left'));
	var h = parseInt($(i).css('height'));
	var w = parseInt($(i).css('width'));

	var b = t + h; // bottom
	var r = l + w; // right 

	return [t, l, h, w, b, r];
}

function nuFormWH(){

	var w	= 0;
	var h	= 0;
	var s	= '[data-nu-object-id][data-nu-prefix=""]';

	if(nuSERVERRESPONSE.record_id == -2){
		s	= '[data-nu-object-id]';
	}

	$(s).each(function( index ) {

		w	= Math.max(w, parseInt($(this).css('width')) + parseInt($(this).css('left')));
		h	= Math.max(h, parseInt($(this).css('height')) + parseInt($(this).css('top')));

	});

	return {'width' : w, 'height' : h};

}

function nuResizeFormDialogCoordinates(){

	var wh	= nuFormWH();

	var w	= wh.width;
	var h	= wh.height;

	h		= h + nuDialogHeadersHeight() + 50;
	w		= w + 40

	if($('#nuDragDialog', window.parent.document).length == 0){return;}

	$('#nuDragDialog', window.parent.document).css('visibility', 'visible');
	$('#nuDragDialog', window.parent.document).css('width', w + 12);
	$('#nuWindow', window.parent.document).css('width', w );
	$('body').css('width', w);

	$('#nuDragDialog', window.parent.document).css('height', h + 50).css('visibility', 'visible');
	$('#nuWindow', window.parent.document).css('height', h + 10);
	$('body').css('height', window.innerHeight);

	if(h < window.innerHeight){
		$('body').css('height', '100%');
	}else{
		$('body').css('height', h);
	}

	if(w > window.innerWidth){

		$('#nuBreadcrumbHolder').css('width', window.innerHTML);
		$('#nuTabHolder').css('width', window.innerHTML);
		$('#nuActionHolder').css('width', window.innerHTML);

	}

}

function nuClickTab(t,s){

	t = "nuTab" + t;

	if(arguments.length == 2){
		t = s + t;
	}

	nuSelectTab($('#' + t)[0]);

}

function nuFilterRun(id, f){

	var r = JSON.parse(JSON.stringify(nuSERVERRESPONSE));
	var o = -1;

	for(var i = 0 ; i < r.objects.length ; i++){

		if(r.objects[i].id == id){

			if (typeof f !== 'undefined') {		
				if(r.objects[i].filter == f){return;}				
				r.objects[i].filter = f;

			}

			o = i;

		}

	}

	if(o == -1){return;}

	nuRUN(r, o, '', '', r);

}

function nuRecordRun(id, f){

	var r = JSON.parse(JSON.stringify(nuSERVERRESPONSE));
	var o = -1;

	for(var i = 0 ; i < r.objects.length ; i++){

		if(r.objects[i].id == id){

			if (typeof f !== 'undefined') {					
				if(r.objects[i].record_id == f){return;}				
				r.objects[i].record_id = f;
			}
				
			o = i;
				
		}

	}

	if(o == -1){return;}

	nuRUN(r, o, '', '', r);

}

function nuGetIframeValue(f, o){
	return $('#' + f).contents().find('#' + o).val();
}

function nuSetIframeValue(f, o, v){
	return $('#' + f).contents().find('#' + o).val(v);
}

function nuLookingUp(){

	for (var lu in window.nuLOOKUPSTATE){

		if(window.nuLOOKUPSTATE[lu] == 'looking'){

			nuMessage([nuTranslate('A Lookup is still being populated...')]);
			return true;

		}

	}

	return false;

}

function nuPortraitScreen(columns){

	$('#nubody').css('transform', 'scale(1)')

	if(nuFormType() == 'browse'){return;}

	$('.nuBuilderLink').remove();
	if(arguments.length == 0){columns = 1;}

	$('.nuPortraitTab').remove();

	var o = nuSERVERRESPONSE.objects;
	var lw = columns == 1 ? 0 : nuPortraitLabelWidth(o);
	var t = 10;
	var b = -1;
	var W = 0;

	for(var i = 0 ; i < o.length ; i++){

		var I = o[i].id;
		var L = $('#label_' + I).length == 0 ? 0 : $('#label_' + I).outerHeight()
		var O = $('#' + I).outerHeight()

		W	= Math.max(W, $('#' + I).outerWidth());

		if(o[i].tab != b){

			b = o[i].tab;
			var l = $('#nuTab' + o[i].tab).html();
			var d = '<div class="nuPortraitTab" id="nuPort' + b + '" style="top:' + t + 'px" >'+ l +'</div>';
			$('#nuRECORD').append(d);
			var OH = $('#nuPort' + b ).outerHeight()

			t = t + OH + 20;

		}

		if(o[i].read != 2){

			$('#label_' + o[i].id).css({'top' : t+2 , 'left' : 7, 'text-align' : 'left', 'font-weight' : 700});

			if(columns == 1){
				t = t + L + 5;
			}

			$('#'+o[i].id).css({'top' : t , 'left' : lw + 10});

			if(o[i].type == 'lookup'){

				var w = $('#'+o[i].id+'code').outerWidth()
				var d = $('#'+o[i].id+'description').outerWidth()
				W	= Math.max(W, w + d + 30);

				$('#'+o[i].id+'code').css({'top' : t , 'left' : lw + 10});
				$('#'+o[i].id+'button').css({'top' : t , 'left' : lw + w + 15});
				$('#'+o[i].id+'description').css({'top' : t , 'left' : lw + w + 35});

			}

			t = t + O + 5;

		}

	}

	$("[data-nu-tab!='x'][data-nu-form='']:not([data-nu-lookup-id])").show();
	$('#nuTabHolder').hide();

	t		= t + 50;

	$('#nuRECORD').append('<div id="nuPortEnd" style="left:0px;position:absolute;top:' + t + 'px" >&nbsp;</div>');

	if(columns == 1){
		$('label').css('text-align', 'right').css({'width':W,'text-align':'left','left':12});
	}else{
		$('label').css('text-align', 'left').css('width', lw);
	}

	var objectWidth = W + lw + 50;
	var screenWidth = window.innerWidth;
	var scale		= screenWidth/(objectWidth);

	$('#nubody').css('width', objectWidth)
	$('#nubody').css('transform', 'scale(' + scale + ')')
	$('html,body').scrollTop(0).scrollLeft(0);

	return scale;

}

function nuPortraitLabelWidth(o){

	var w	= 0
	$('label').css('width', '');

	for(var i = 0 ; i < o.length ; i++){
		w = nuGetWordWidth($('#label_' + o[i].id).html());
	}

	return w + 15;

}

function nuGetBrowsePaginationInfo() {

	r = $("div[id^='nucell_']" + "[id$='_1']").length // Number of Rows per page

	with(nuFORM.getCurrent()) {
		c = page_number; // Current page number
		f = browse_filtered_rows; // Number of records in the table after filtering
		p = pages; // Total number of pages
	}

	var e; // Row number of the last record on the current page
	var s; // Row number of the first record on the current page

	if (c == 0 && f > 0 & p == 1) {
		s = 1;
		e = f;
	} else
	if (p == c + 1 || f == 0) {
		s = f == 0 ? 0 : c * r + 1;
		e = f
	} else
	if (c == 0 && p > 1) {
		s = 1;
		e = r;
	} else
	if (c > 0 && c < p) {
		e = (c + 1) * r;
		s = e - r + 1;
	};

	return {
		startRow: s
		, endRow: e
		, totalRows: f // filtered rows
	};

}

function nuShowBrowsePaginationInfo(f) {

	if (nuFormType() == 'browse') {
		var {
			startRow
			, endRow
			, totalRows
		} = nuGetBrowsePaginationInfo();

		if (f === 'default')
			var f = '{StartRow} - {EndRow} ' + nuTranslate('of') + ' ' + '{TotalRows}';
		}

		p = f.nuFormat({StartRow:startRow, EndRow:endRow, TotalRows:totalRows });

		$('#nuBrowseFooter').append('<span class="nuPaginationInfo">' + p + '</span>');

}

function nuPrintEditForm(hideObjects, showObjects) {

	// hide some elements before calling the print dialog 
	$('#nuBreadcrumbHolder').hide();
	$('#nuTabHolder').hide();
	$('.nuActionButton').hide();

	if (typeof hideObjects === 'undefined') {
		let hideObjects = [];
	}

	if (typeof showObjects === 'undefined') {
		let showObjects = [];
	}

	for (var i = 0; i < hideObjects.length; i++) {
		nuHide(hideObjects[i]);
	}

	for (var i = 0; i < showObjects.length; i++) {
		nuShow(hideObjects[i]);
	}

	window.onafterprint = function(e){
		$(window).off('mousemove', window.onafterprint);

		// Show the elements again when the dialog closes
		$('#nuBreadcrumbHolder').show();
		$('#nuTabHolder').show();
		$('.nuActionButton').show();
		
	
		for (var i = 0; i < hideObjects.length; i++) {
			nuShow(hideObjects[i]);
		}

		for (var i = 0; i < showObjects.length; i++) {
			nuHide(hideObjects[i]);
		}
	
	};

	window.print();

	setTimeout(function(){
		$(window).one('mousemove', window.onafterprint);
	}, 1);
}

function nuAddBrowseAdditionalNavButtons() {

	if (nuFormType() == 'browse') {

		var disabled = {
			'opacity': '0.3',
			'pointer-events': 'none'
		};

		var currentPage = Number($('#browsePage').val());
		var lastPage = nuCurrentProperties().pages;

		var html = '<span id="nuFirst" class="nuBrowsePage" style="font-size: 15px;"><i class="fa fa-step-backward ml-5 mr-5" onclick="nuGetPage(0)">&nbsp;&nbsp;&nbsp;&nbsp;</i></span>';
		$(html).insertBefore("#nuLast");

		html = '<span id="nuEnd" class="nuBrowsePage" style="font-size: 15px;">&nbsp;&nbsp;&nbsp;&nbsp;<i class="fa fa-step-forward ml-5 mr-5" onclick="nuGetPage(' + lastPage + ')"></i></span>';
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
