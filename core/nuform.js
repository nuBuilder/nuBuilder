
function nuInitJSOptions() {

	if (window.nuAdminButtons === undefined) {

		window.nuAdminButtons =
		{
			'nuDebug': true,
			'nuPHP': true,
			'nuRefresh': true,
			'nuObjects': true,
			'nuProperties': true
		};

	}

	if (window.nuUXOptions === undefined) {

		window.nuUXOptions =
		{
			'nuEnableBrowserBackButton': true,			// Enable the browser's Back button
			'nuPreventButtonDblClick': true,			// Disable a button for 1 5 s to prevent a double click
			'nuShowPropertiesOnMiddleClick': true,		// Show the Object Properties on middle mouse click
			'nuAutosizeBrowseColumns': true,			// Autosize columns to fit the document width
			'nuShowBackButton': false,					// Show a Back Button
			'nuMobileView': false,						// Optimise view for mobile devices
			'nuBrowsePaginationInfo': 'default',		// Default Format is: '{StartRow} - {EndRow} ' + nuTranslate('of') + ' ' + '{TotalRows}'
			'nuShowNuBuilderLink': true,				// Show the link to nubuilder com
			'nuShowLoggedInUser': false,				// Show the logged in User
			'nuShowBrowserTabTitle': true,				// Show the Form Title in the Browser Tab
			'nuDebugMode': true,						// Debug Mode
			'nuBrowserTabTitlePrefix': 'nuBuilder',		// Prefix in the Browser Tab
			'nuCalendarStartOfWeek': 'Sunday',			// nuCalendar: Start of Week: Sunday (default) or Monday
			'nuSelect2Theme': 'default'					// select2 theme (default, classic) Default: default
		};

	}

}

nuInitJSOptions();

var promot;

function nuBuildForm(f) {

	window.nuOnSetSelect2Options = null;
	window.nuSERVERRESPONSE = f;						// can be overwritten by nuAddJavascript()

	if (f.record_id != '-2') {
		nuAddJavascript(f.javascript_bc);
	}

	$('#nubody').off('.nuresizecolumn')
		.css('transform', 'scale(1)');
	$('html,body').scrollTop(0).scrollLeft(0);

	nuSetProperty('CLONED_RECORD', 0);
	nuSetProperty('NEW_RECORD', 0);

	if (f.tableSchema === null) {									//-- need to login again

		$('body').addClass('nuBrowseBody').removeClass('nuEditBody');

		sessionStorage.logout = 'true';
		parent.parent.parent.parent.parent.location.reload();

		nuCursor('default');
		return;

	}

	if (nuFormType() == 'browse') {
		window.nuTimesSaved = -1;
	} else {

		window.nuTimesSaved = window.nuTimesSaved + 1;

		if (window.nuLastForm != f.form_id || (nuLastRecordId != f.record_id && nuLastRecordId !== "-1")) {
			window.nuTimesSaved = 0;
		}

	}

	window.nuLastForm = f.form_id;
	window.nuLastRecordId = f.record_id;
	window.nuSubformRow = -1;
	window.nuBeforeSave = null;
	window.nuAfterSave = null;
	window.nuBeforeDelete = null;
	window.nuOnSearchAction = null;
	window.nuOnClone = null;
	window.nuOnEditorLoad = null;
	window.nuOnBeforeGetBreadcrumb = null;
	window.nuOnSetSaved = null;
	window.nuOnTabSelected = null;
	window.nuOnSelectTab = null;
	window.onSubformTitleClick = null;
	window.nuOnMessage = null;
	window.nuDisplayObjectRefreshed = null;
	window.nuOnSetCalendarOptions = null;
	window.nuCalculated = null;
	window.nuBrowseFunction = window.nuDefaultBrowseFunction;
	window.nuCLONE = false;
	window.nuSERVERRESPONSELU = [];
	window.nuSESSION = f.session_id;
	window.nuSUBFORMROW = [];
	window.nuHASH = [];					//-- remove any hash variables previously set.
	window.nuTABHELP = [];
	window.nuFORMHELP = [];
	window.nuLOOKUPSTATE = [];
	window.nuBROWSEROW = -1;
	window.nuBROWSECLICKED = false;
	window.nuUniqueID = 'c' + String(Date.now());
	window.global_access = f.global_access == '1';
	nuFORM.edited = false;
	window.nuVerticalTabs = false;

	nuFORM.scroll = [];
	nuSetSuffix(1000);
	nuSetBody(f);

	nuRedefine_nuSelectBrowse();

	nuFORM.tableSchema = f.tableSchema;
	nuFORM.formSchema = f.formSchema;
	window.nuLANGUAGE = f.translation;

	nuSetProperty('refreshed', nuGetProperty('refreshed') + 1);

	var b = window.nuFORM.getCurrent();

	nuAddedByLookup(f);

	b.form_id = f.form_id;
	b.record_id = f.record_id;
	b.session_id = f.session_id;
	b.user_id = f.user_id;
	b.redirect_form_id = f.redirect_form_id;
	b.redirect_other_form_id = f.redirect_other_form_id;
	b.title = f.title;
	b.row_height = f.row_height;
	b.rows = f.rows;
	b.browse_columns = f.browse_columns;
	b.browse_sql = f.browse_sql;
	b.browse_rows = f.browse_rows;
	b.browse_table_id = f.browse_table_id;
	b.browse_filtered_rows = f.browse_height;
	b.browse_title_multiline = f.browse_title_multiline;
	b.browse_autoresize_columns = f.browse_autoresize_columns;
	b.pages = f.pages;
	b.form_code = f.form_code;
	b.form_description = f.form_description;
	b.form_type = f.form_type;
	b.run_code = f.run_code;
	b.run_description = f.run_description;
	b.data_mode = f.data_mode;

	nuAddHolder('nuBreadcrumbHolder');
	nuAddHomeLogout();
	nuAddHolder('nuActionHolder');

	if (nuFormType() == 'edit') {
		nuAddHolder('nuTabHolder');
	}

	nuAddHolder('nuRECORD');
	$('#nuRECORD')
		.attr('data-nu-table', f.table)
		.attr('data-nu-primary-key-name', f.primary_key);

	nuAddBreadcrumbs();

	nuAddEditTabs('', f);

	if (typeof window.nuBeforeAddActionButtons === 'function') {
		nuBeforeAddActionButtons();
	}

	nuAddActionButtons(f);
	nuRecordProperties(f, '');

	let obj0 = null;

	if (nuFormType() == 'edit') {

		nuOptions('', f.form_id, 'form', f.global_access);
		nuBuildEditObjects(f, '', '', f);
		nuResizeFormDialogCoordinates();
		nuCalculateForm(false);

		obj0 = nuGetFirstObject(f.objects, -1);

	}

	nuGetStartingTab();

	if (nuFormType() == 'edit' && nuIsNewRecord() && (obj0 !== null)) {
		obj0.nuFocusWithoutScrolling();
	}

	if (f.record_id == '-2') {			// Arrange Objects
		nuCreateDragOptionsBox(f);
	} else {
		nuAddJavascript(f.javascript);
	}

	nuDragTitleEvents();

	if (window.nuLoginH != '') {

		let bc = $('#nuBreadcrumb0').length > 0 ? $('#nuBreadcrumb0') : $('#nuHomeGap');
		bc
			.html('<i class="fa fa-home" style="font-size:17px;padding:0px 5px 0px 0px"></i>')
			.attr('title', nuTranslate('Home'))
			.attr('onclick', '')
			.attr('onclick', 'nuForm("' + window.nuLoginH + '", -1, "", "", 1);')
			.css('cursor', 'pointer');

		window.nuLoginH = '';

	}

	if (!nuIsMobile()) {
		$('#nuSearchField').focus();
	} else {

		if (nuUXOptions.nuMobileView) {
			nuMobileView();
		}

	}

	if (window.nuOnEditorLoad) {
		nuOnEditorLoad();
	} else {
		$('.nuEditor').each((index, element) => {

			if (nuUXOptions.nuDefaultUseQuill) {
				nuQuill(element.id);
			} else {
				nuInitTinyMCE(element.id);
			}

		});
	}

	nuEvalnuOnLoadEvents();

	if (window.nuOnLoad) {
		nuOnLoad();
	}

	if (nuFormType() == 'edit') {
		window.nuRESPONSIVE.getStartPositions();
	} else {

		if (b.browse_autoresize_columns !== '0' || nuDocumentID !== parent.nuDocumentID) {

			if (nuUXOptions.nuAutosizeBrowseColumns || b.browse_autoresize_columns === '1' || nuDocumentID !== parent.nuDocumentID) {
				nuResizeBrowseColumns();
			}

		}
	}

	if (nuUXOptions.nuShowBrowserTabTitle) {
		nuSetBrowserTabTitle(nuUXOptions.nuBrowserTabTitlePrefix);
	} else {
		document.title = nuUXOptions.nuBrowserTabTitlePrefix;
	}

	if (Object.keys(window.nuAdminButtons).length) {
		nuAddAdminButtons();
	}

	if (nuUXOptions.nuEnableBrowserBackButton) {
		nuEnableBrowserBackButton();
	}

	if (nuUXOptions.nuPreventButtonDblClick) {
		nuPreventButtonDblClick();
	}

	if (nuUXOptions.nuShowBackButton) {
		nuAddBackButton();
	}

	if (nuUXOptions.nuShowPropertiesOnMiddleClick) {
		document.addEventListener("mousedown", nuOpenPropertiesOnMiddleClick, { passive: true });
	}

	if ((nuUXOptions.nuBrowsePaginationInfo) !== '') {
		nuShowBrowsePaginationInfo((nuUXOptions.nuBrowsePaginationInfo));
	}

	if (nuUXOptions.nuShowLoggedInUser) {
		nuDisplayLoggedInUser();
	} else
		if (!nuUXOptions.nuShowNuBuilderLink) {
			$('.nuBuilderLink').remove();
		}

	nuInitSetBrowseWidthHelper();

	if (window.nuMESSAGES.length > 0) {

		let msgDiv = nuMessage(window.nuMESSAGES);

		if (window.nuOnMessage) {
			nuOnMessage(msgDiv, window.nuMESSAGES);
		}

		window.nuMESSAGES = [];

	}

	if (window.nuTimesSaved > 0 && window.nuAfterSave) {
		nuAfterSave();
	}

	nuAddFormStyle(f.style);

	if (nuGlobalAccess()) nuContextMenuUpdate();

	nuSetSaved(true);

	nuCursor('default');

	nuWindowPosition();

	nuRestoreScrollPositions();

}

function nuRestoreScrollPositions() {

	$(function () {

		$('textarea').each(function () {
			$(this).scrollTop(window['nuScrollTop_' + this.id]);
		});

	});

}

function nuSaveScrollPositions() {

	$('textarea:visible').each(function () {
		window['nuScrollTop_' + this.id] = $(this).scrollTop();
	});

}

function nuEvalnuOnLoadEvents() {

	let r = JSON.parse(JSON.stringify(nuSERVERRESPONSE));
	for (let i = 0; i < r.objects.length; i++) {
		let obj = r.objects[i];
		if (obj.js.length > 0) {

			for (let j = 0; j < obj.js.length; j++) {

				if (obj.js[j].event == 'onnuload') {
					let js = obj.js[j].js;
					js = js.replaceAll('(this)', '("#' + obj.id + '")');
					js = js.replaceAll('this.', obj.id + '.');
					eval(js);
				}
			}
		}

	}

}

function nuDisplayLoggedInUser() {

	let u = nuGlobalAccess() ? nuCurrentProperties().user_id : nuUserName();
	$('.nuBuilderLink').html(u).attr('href', '').css({
		'cursor': 'pointer',
		'pointer-events': 'none'
	});

}

function nuAddHomeLogout() {

	if (nuMainForm()) {

		if (window.nuFORM.breadcrumbs.length > 1) {

			var c = document.createElement('div');
			c.setAttribute('id', 'nuBreadcrumb0');

			$('#nuBreadcrumbHolder').append(c);

			$('#nuBreadcrumb0')
				.addClass('nuBreadcrumb')
				.css('cursor', "pointer")
				.css('font-size', 16)
				.attr('onclick', "nuGetBreadcrumb(0)")
				.html('<i class="fa fa-home" style="font-size:17px;padding:0px 5px 0px 0px"></i>')
				.attr('title', nuTranslate('Home'));

		}

		$('#nuBreadcrumbHolder').append('<span id="nulink"><a href="https://www.nubuilder.com" class="nuBuilderLink" target="_blank">nuBuilder</a></span>');

		nuAddIconToBreadCrumb('nuLogout', 'Log out', 16, 'nuAskLogout()', 'fas fa-sign-out-alt');

	}

}

function nuAddIconToBreadCrumb(id, title, right, handler, _class) {

	var l = document.createElement('div');
	l.setAttribute('id', id);

	$('#nuBreadcrumbHolder').append(l);

	$('#' + id)
		.addClass('nuNotBreadcrumb')
		.css('cursor', "pointer")
		.css('font-size', 16)
		.css('position', 'absolute')
		.css('right', right)
		.attr('onclick', handler)
		.html('<i class="' + _class + '" style="font-size:20px;"></i>')
		.attr('title', nuTranslate(title));

}

function nuAddedByLookup(f) {

	const isEdit = nuFormType() == 'edit';
	const isNewRecord = window.nuLASTRECORD == '-1';
	const isLookup = window.nuTARGET != '';

	if (isEdit && isNewRecord && isLookup) {
		window.parent.nuGetLookupId(nuRecordId(), window.nuTARGET);			//-- called from parent window
	}

}

function nuSetBody(f) {

	let $body = $('body');

	$body.html('');
	$body.removeClass('nuBrowseBody nuEditBody');

	if (nuFormType() == 'browse') {
		$body.addClass('nuBrowseBody');
	} else {

		var height = f.dimensions === null ? 0 : f.dimensions.edit.height;
		$body.addClass('nuEditBody')
			.css('width', window.innerWidth - 1)
			.css('height', height);

	}

}

function nuCSSPropertySum(id, arr) {

	let $id = $('#' + id);
	if ($id.length == 0) { return 0; }

	let sum = 0;
	arr.forEach(function(element){
		sum += parseInt($id.css(element), 10);
	 });

	return sum;

}

function nuDialogHeadersHeight() {

	let height = 0;
	let arr = ['nuBreadcrumbHolder','nuActionHolder','nuTabHolder','nuBrowseTitle0','nuBrowseFooter'];
	arr.forEach(function(element){
		height += nuTotalHeight(element);
	 });

	return height;

}

function nuTotalHeight(id) {

	const arrProperties = ['height','padding-top','padding-bottom','border-top-width','border-bottom-width','margin-top','margin-bottom'];
	return nuCSSPropertySum(id, arrProperties);

}

function nuTotalWidth(id) {

	const arrProperties = ['width','padding-left','padding-right','border-left-width','border-right-width','margin-left','margin-right'];
	return nuCSSPropertySum(id, arrProperties);

}

function nuTotalHolderWidth(id) {

	const arrProperties = ['padding-left','padding-right','border-left-width','border-right-width','margin-left','margin-right'];
	return nuCSSPropertySum(id, arrProperties);

}

function nuDefine(v, defaultValue = '') {

	if (v === undefined) {
		v = defaultValue;
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

function nuAddActionButtons(form) {

	let draggable = 0;
	const r = nuRecordId();

	if (r == '-2') {
		draggable = 1;
	}

	var button = form.buttons;

	if (nuFormType() == 'browse') {

		var s = nuDefine(nuFORM.getProperty('search'));
		var f = nuDefine(nuFORM.getProperty('filter'));

		$('#nuActionHolder').append("<input id='nuSearchField' type='text' class='nuSearch' onfocus='this.value = this.value;' onkeypress='nuSearchPressed(event)' onkeydown='nuArrowPressed(event)' value='" + s + "'>")
			.append("<input id='nuFilter' style='visibility:hidden;width:0px' value='" + f + "'>")
			.append("<button id='nuSearchButton' type='button' class='nuActionButton' onclick='nuSearchAction()'><i class='fa fa-search'></i>&nbsp;" + nuTranslate('Search') + "</button>");

		nuSearchFieldSetSearchType();

		if (button.Add == 1) { nuAddActionButton('Add'); }
		if (button.Print == 1) { nuAddActionButton('Print'); }

	} else {

		if (!draggable) {

			if (button.Save == 1 && form.form_type != 'launch') {
				if ((nuIsNewRecord() && form.data_mode == 0) || form.data_mode != 0) {
					nuAddActionButton('Save');
				}
			}

			if (r != -1) {

				if (button.Delete == 1) { nuAddActionButton('Delete'); }
				if (button.Clone == 1) { nuAddActionButton('Clone'); }

			}

			if (button.RunHidden != '') { nuAddActionButton('runhidden', 'Run', button.RunHidden); }
			if (button.Run != '') { nuAddActionButton('run', 'Run', button.Run); }

		}

	}

}

function nuAddActionButton(i, v, f, t, e) {

	if (arguments.length == 1) {

		v = i;
		f = 'nu' + i + 'Action()';

	}

	t = nuDefine(t);

	let nuClass = "";
	if (i == 'Save' || i == 'Add' || i == 'Clone' || i == 'Delete') {
		nuClass = " " + "nu" + i + "Button";
	}

	let id = "nu" + i + "Button";

	let html = "<input id='" + id + "' type='button' title='" + nuTranslate(t) + "' class='nuActionButton" + nuClass + "' value='" + nuTranslate(v) + "' onclick='" + f + "'>";

	if (e) {
		$(html).insertAfter('#' + e);
	} else {
		$('#nuActionHolder').append(html);
	}

	return $('#' + id);
}

function nuAddActionButtonSaveClose(caption) {

	nuAddActionButton('SaveClose', nuTranslate(caption === undefined ? 'Save & Close' : caption), "nuSaveAction(true)", '', 'nuSaveButton');
	$('#nuSaveCloseButton').addClass('nuSaveButton');

}

function nuBuildEditObjects(f, p, o, prop) {

	if (typeof (f.objects) != 'object') { return; }

	var l = 3;

	const draggable = nuRecordId() == '-2' ? 1 : 0;

	for (var i = 0; i < f.objects.length; i++) {

		if (!draggable) {

			var obj = prop.objects[i];
			var t = obj.type;
			f.objects[i].parent_type = o == '' ? '' : o.subform_type;

			if (t == 'input' || t == 'display' || t == 'lookup' || t == 'textarea' || t == 'calc') {
				l = l + nuINPUT(f, i, l, p, prop);
			} else if (t == 'run') {
				l = l + nuRUN(f, i, l, p, prop);
			} else if (t == 'html') {
				l = l + nuHTML(f, i, l, p, prop);
			} else if (t == 'contentbox') {
				l = l + nuCONTENTBOX(f, i, l, p, prop);
			} else if (t == 'editor') {
				l = l + nuEDITOR(f, i, l, p, prop);
			} else if (t == 'image') {
				l = l + nuIMAGE(f, i, l, p, prop);
			} else if (t == 'select') {
				l = l + nuSELECT(f, i, l, p, prop);
			} else if (t == 'subform' && p == '') {
				l = l + nuSUBFORM(f, i, l, p, prop);
			} else if (t == 'word') {
				l = l + nuWORD(f, i, l, p, prop);
			}

			if (obj.labelOnTop) {
				$('#' + obj.id).nuLabelOnTop();
			}

			if (obj.visible === false) {
				nuHide(obj.id);
			}
			nuAddAttributes(p + obj.id, obj.attributes);

			l = l + 2;

		} else {

			$("body").css("overflow", "hidden");
			l = l + nuDRAG(f, i, l, p, prop);

		}

	}

}

function nuAddJSObjectEvents(i, j) {

	var o = document.getElementById(i);

	for (var J = 0; J < j.length; J++) {

		var code = o.getAttribute(j[J].event);
		var ev = j[J].event;

		code = code === null ? '' : code + ';';

		if (ev == 'beforeinsertrow' || ev == 'afterinsertrow' || ev == 'clickdelete') {
			{ ev = 'data-nu-' + ev; }
		}

		if (o.classList.contains('nuLookupButton')) {

			if (ev == 'onclick') {
				o.setAttribute(ev, code + j[J].js);
			} else {
				$('#' + o.id.slice(0, -6) + 'code')[0].setAttribute(ev, code + j[J].js);
			}

		} else {
			o.setAttribute(ev, code + j[J].js);
		}

	}

}

function nuRecordProperties(w, p, l) {

	var del = p + 'nuDelete';
	var fh = p + 'nuRECORD';						//-- Edit Form Id
	var chk = document.createElement('input');
	var sf = p.substr(0, p.length - 3);

	chk.setAttribute('id', del);
	chk.setAttribute('title', nuTranslate('Delete This Row When Saved'));
	chk.setAttribute('type', w.deletable == '0' ? 'text' : 'checkbox');
	chk.setAttribute('onclick', 'nuChange(event)');

	$('#' + fh)
		.append(chk)
		.addClass('nuSection')
		.attr('data-nu-form-id', w.id)
		.attr('data-nu-table', w.table)
		.attr('data-nu-primary-key', w.record_id)
		.attr('data-nu-foreign-key', w.foreign_key)
		.attr('data-nu-foreign-field', p == '' ? '' : w.foreign_key_name);

	var objDel = $('#' + del);
	objDel
		.attr('data-nu-data', '')
		.addClass('nuSubformCheckbox')
		.addClass(w.table);

	if (arguments.length == 3) {

		objDel
			.prop('checked', w.record_id == -1)
			.attr('data-nu-checkbox', w.deletable == '0' ? '' : sf)
			.css({
				'top': 3,
				'left': Number(l) + 2,
				'position': 'absolute',
				'visibility': 'visible'
			});

		if (w.deletable == '0') {
			objDel.css({ 'width': 0, 'height': 0, 'left': -10, 'top': 10, 'tabindex': '-1' });			//-- allows tabbing when there is no checkbox.
		}

	} else {

		objDel.css('visibility', 'hidden')
			.prop('checked', false)
			.attr('data-nu-checkbox', sf);

	}

}

function nuDRAG(w, i, l, p, prop) {

	const obj = prop.objects[i];
	const id = p + obj.id;
	const nuObjectType = p + obj.type;
	let drgDiv = document.createElement('div');
	drgDiv.setAttribute('id', id);

	$('#' + p + 'nuRECORD').append(drgDiv);

	let $id = $('#' + id);

	$id.css({
		'top': Number(obj.top),
		'left': Number(obj.left),
		'width': Number(obj.width),
		'height': Number(obj.height),
		'text-align': obj.align,
		'position': 'absolute',
		'overflow': 'hidden',
		'display': 'flex',
		'align-items': 'center',
		'padding-left': '4px'
	}).addClass('nu_' + nuObjectType);

	$id.text(id);
	$id.attr('data-drag', 1)
		.attr('data-nu-object-id', obj.object_id);

	if (obj.input == 'button' || nuObjectType == 'run') {
		$id.attr('data-drag-button-label', obj.label);
	}

	if (obj.input != 'button' && nuObjectType != 'run' && nuObjectType != 'contentbox' && prop.title !== 'Insert-Snippet') {		//-- Input Object
		let lab = nuLabel(w, i, p, prop);
		$(lab).addClass('nuDragLabel').css('visibility', 'hidden');
	}

	nuAddDataTab(id, obj.tab, p);

	return Number(obj.width);

}


function getDBColumnLengh(w, id) {

	const tableSchema = nuSERVERRESPONSE.tableSchema;
	if (tableSchema === undefined || w.table == '' || tableSchema[w.table] === undefined) return 0;

	var len = 0;
	const index = tableSchema[w.table].names.indexOf(id);

	if (index !== -1) {

		const datatype = tableSchema[w.table]["types"][index].toUpperCase();

		switch (datatype) {
			case "TINYTEXT":
				len = 255;
				break;
			case "TEXT":
				len = 65535;
				break;
			case "MEDIUMTEXT":
				len = 16777215;
				break;
			default:
				if (datatype.includes('CHAR')) {
					len = parseInt(datatype.replace(/\D/g, ""), 10);
				}
		}
	}

	return len;

}

function nuINPUTfile($fromId, obj, id, p) {

	const inp = document.createElement('textarea');

	inp.setAttribute('id', id);

	$fromId.append(inp);
	const $id = $('#' + id);

	$id
		.css('visibility', 'hidden')
		.attr('data-nu-field', id)
		.attr('data-nu-prefix', p)
		.attr('data-nu-data', '')
		.attr('onchange', 'this.className = "nuEdited"');

	if (!nuIsNewRecord()) {
		$id.val(obj.value);
	}

	return id + '_file';

}

function nuINPUTInput($id, inp, inputType, obj, objectType) {

	inp.setAttribute('type', inputType);

	const className = objectType == 'lookup' ? 'nuHiddenLookup' : 'input_' + inputType;
	$id.addClass(className);

	if (obj.datalist !== null && obj.datalist !== '' && typeof obj.datalist !== "undefined") {
		let dl = obj.datalist;
		if (!$.isArray(dl)) dl = JSON.parse(dl);
		if (!$.isArray(dl)) dl = eval(dl);
		nuAddDatalist($id.attr('id'), dl);
	}
}

function nuINPUTnuScroll($id, wi) {

	const inputJS = 'nuFORM.scrollList(event, ' + wi.scroll + ')';

	$id.addClass('nuScroll')
		.attr('onkeydown', inputJS)
		.attr("title", nuTranslate('Use the keyboard up and down arrows to scroll through the list or add text that is not in the list.'));

}

function nuINPUTnuDate($id, wi) {

	$id.addClass('nuDate')
		.attr('data-nu-format', wi.format)
		.attr('autocomplete', 'off');

}

function nuINPUTnuNumber($id, wi) {

	$id.addClass('nuNumber')
		.attr('data-nu-format', wi.format);

}

function nuINPUTCheckbox($id, obj, wi) {

	document.getElementById($id.attr('id')).checked = (wi.value == '1');

	if (obj.parent_type == 'g') {
		$id.css('margin-top', '1px');
	}

}

function nuINPUTDisplay($id) {

	$id.addClass('nuReadonly')
		.prop('readonly', true);

}

function nuINPUTLookup(id, objId, wi, obj, $fromId, p, vis) {

	let $id = $('#' + id);
	$id.hide();
	$id.attr('data-nu-lookup-id', '');

	const luv = wi.values[0][1];
	if (!nuIsNewRecord() || luv !== '') {
		$('#' + id).val(luv);
	}

	const target = id;
	id = target + 'code';
	var inp = document.createElement('input');

	inp.setAttribute('id', id);

	$fromId.append(inp);

	nuAddDataTab(id, obj.tab, p);

	$('#' + id).css({
		'top': Number(obj.top),
		'left': Number(obj.left),
		'width': Number(obj.width),
		'height': Number(obj.height)
	})
	.attr('data-nu-form-id', wi.form_id)
	.attr('data-nu-object-id', wi.object_id)
	.attr("data-nu-prefix", p)
	.attr('data-nu-target', target)
	.attr('data-nu-type', 'lookup')
	.attr('data-nu-subform-sort', 1)
	.attr('onchange', 'nuGetLookupCode(event)')
	.attr('onfocus', 'nuLookupFocus(event)')
	.css('visibility', vis)
	.addClass('nuLookupCode');

	if (Number(obj.width) == 0) nuHide(id);

	$('#' + id).enterKey(function () {
		if ($(this).val().length == 0) {
			let element = $('#' + target + 'button')[0];
			nuBuildLookup(element, "");
		}
	});
/*
	wi.values[0][0] = p + obj.id;
	wi.values[1][0] = p + obj.id + 'code';
	wi.values[2][0] = p + obj.id + 'description';
*/
	id = target + 'button';
	var div = document.createElement('div');

	div.setAttribute('id', id);

	$fromId.append(div);

	nuAddDataTab(id, obj.tab, p);

	var luClass = obj.label === 'Insert-Snippet' ? 'fa fa-code' : 'fa fa-search';

	$('#' + id).css({
		'top': Number(obj.top),
		'left': Number(obj.left) + Number(obj.width) + 6,
		'width': 15,
		'height': Number(obj.height - 2)
	})
		.attr('type', 'button')
		.attr("data-nu-prefix", p)
		.attr('data-nu-form-id', wi.form_id)
		.attr('data-nu-object-id', wi.object_id)
		.attr('data-nu-target', target)
		.attr('data-nu-subform-sort', 1)
		.attr('onfocus', 'nuLookupFocus(event)')
		.attr('onclick', 'nuBuildLookup(this,"")')
		.addClass('nuLookupButton')
		.html('<i style="padding:4px" class="' + luClass + '"></i>')
		.css('visibility', vis);

	if (obj.label === 'Insert-Snippet') $('#' + id).css('font-size', '18px');

	nuAddJSObjectEvents(id, obj.js);

	id = p + obj.id + 'description';
	var desc = document.createElement('input');
	desc.setAttribute('id', id);

	$fromId.append(desc);
	nuAddDataTab(id, obj.tab, p);
	$('#' + id).css({
		'top': obj.mobile ? Number(obj.top) + Number(obj.height) + 5 : Number(obj.top),
		'left': obj.mobile ? Number(obj.left) : Number(obj.left) + Number(obj.width) + 25,
		'width': obj.mobile ? Number(obj.width) : obj.description_width,
		'visibility': obj.description_width == 0 || obj.display == 0 ? 'hidden' : 'visible',
		'height': Number(obj.height)
	})
		.attr('tabindex', '-1')
		.attr("data-nu-prefix", p)
		.addClass('nuLookupDescription')
		.addClass('nuReadonly')
		.prop('readonly', true);

	nuPopulateLookup3(wi.values, p);

	nuSetAccess(objId, obj.read);

	nuAddStyle(id, obj);

	return Number(obj.width) + Number(obj.description_width) + 30;

}

function nuINPUTnuAutoNumber($id, obj) {

	$id.prop('readonly', true)
		.addClass('nuReadonly');

	if (!nuIsNewRecord()) {
		$id.val(obj.counter);
	}

}

function nuINPUTCalc($id, wi, p) {

	const formula = String(wi.formula).nuReplaceAll("al('", "al('" + p);

	$id.addClass('nuCalculator')
		.attr('data-nu-format', wi.format)
		.attr('data-nu-calc-order', wi.calc_order)
		.attr('data-nu-formula', formula)
		.prop('readonly', true).prop('tabindex', -1);

	if (p != '') {
		$id.addClass('nuSubformObject');
	}

}

function nuINPUTSetValue($id, wi, inputType) {

	if (inputType == 'button') {
		$id.html(nuTranslate(wi.value));
	} else {

		if (inputType == 'datetime-local') {													//-- replace ' ' between date and time with 'T'
			wi.value = wi.value === null ? null : wi.value.replace(' ', 'T');
		}

		if (!nuIsNewRecord() || wi.value !== '') {
			$id.val(nuFORM.addFormatting(wi.value, wi.format));
		}

	}

}

function nuIPUTNuChangeEvent(inputType, objectType) {

	let change = 'nuChange(event)';
	if (inputType == 'file') {
		change = 'nuChangeFile(event)';
	} else if (objectType == 'lookup') {
		change = 'nuGetLookupId(this.value, this.id)';
	}

	return change;

}

function nuINPUTSetProperties($id, obj, inputType, objectType, wi, p) {

	const leftInc = inputType == 'button' && p != '' ? 3 : 0;

	$id.css({
		'top': Number(obj.top),
		'left': Number(obj.left) + leftInc,
		'width': Number(obj.width),
		'height': Number(obj.height),
		'text-align': obj.align,
		'position': 'absolute'
	})
	.attr('onchange', nuIPUTNuChangeEvent(inputType, objectType))
	.attr('data-nu-field', inputType == 'button' || inputType == 'file' ? null : obj.id)
	.attr('data-nu-object-id', wi.object_id)
	.attr('data-nu-format', '')
	.attr('data-nu-prefix', p)
	.attr('data-nu-type', objectType)
	.attr('data-nu-subform-sort', 1)
	.attr('data-nu-label', wi.label)
	.attr('onfocus', 'nuLookupFocus(event)');

	if (inputType != 'button') {
		$id.attr('data-nu-data', '');
	} else {
		$id.addClass('nuButton');
	}

	if (wi.value != '' && nuRecordId() == '-1') {				//== check for Cannot be left blank
		$id.addClass('nuEdited');
	}

}

function nuINPUTSetMaxLength($id, inputType, objectType, w) {

	const types = ['text', 'url', 'telephone', 'search', 'password', 'month', 'email', 'color', 'nuScroll'].indexOf(inputType) !== -1;
	if ((types && objectType == 'input') || objectType == 'textarea') {

		const field = $id.attr('data-nu-field');
		const len = getDBColumnLengh(w, field);
		if (len !== 0) $id.attr('maxlength', len);

	}

}

function nuINPUT(w, i, l, p, prop) {

	var obj = prop.objects[i];
	var wi = w.objects[i];

	const objId = p + obj.id;
	var id = p + obj.id;
	const $fromId = $('#' + p + 'nuRECORD');									//-- Edit Form Id
	var type = 'textarea';
	var vis = obj.display == 0 ? 'hidden' : 'visible';
	var inputType = obj.input;
	var objectType = obj.type;

	if (objectType != 'textarea') {												//-- Input Object
		type = 'input';
	}

	if (inputType == 'file') {
		id = nuINPUTfile($fromId, obj, id, p);
	}

	const inp = document.createElement(inputType == 'button' && objectType == 'input' ? 'button': type);
	inp.setAttribute('id', id);

	let $id = $(inp);


	$fromId.append(inp);

	obj = nuLabelOrPosition(obj, w, i, l, p, prop);

	nuAddDataTab(id, obj.tab, p);
	nuINPUTSetProperties($id, obj, inputType, objectType, wi, p);

	if (type == 'input') {														//-- Input Object
		nuINPUTInput($id, inp, inputType, obj, objectType);
	}

	if (inputType == 'nuScroll') {
		nuINPUTnuScroll($id, wi);
	} else if (inputType == 'nuDate') {
		nuINPUTnuDate($id, wi);
		$id.attr('onclick', 'nuPopupCalendar(this);');
	} else if (inputType == 'nuNumber') {
		nuINPUTnuNumber($id, wi);
	} else if (wi.input == 'checkbox') {
		nuINPUTCheckbox($id, obj, wi);
	} else if (objectType == 'display') {
		nuINPUTDisplay($id);
	} else if (objectType == 'calc') {
		nuINPUTCalc($id, wi, p);
	}

	if (inputType != 'file') {
		nuINPUTSetValue($id, wi, inputType);
	}

	if (objectType == 'input' && inputType == 'nuAutoNumber') {
		nuINPUTnuAutoNumber($id, obj);
	}

	if (inputType == 'button' && objectType == 'input') {
		nuAddInputIcon(id, obj.input_icon);
	}

	if (objectType == 'lookup') {

		return nuINPUTLookup(id, objId, wi, obj, $fromId, p, vis);

	} else {

		nuINPUTSetMaxLength($id, inputType, objectType, w);

		nuAddJSObjectEvents(id, obj.js);

		nuSetAccess(objId, obj.read);

		nuAddStyle(id, obj);

		return Number(obj.width) + (obj.read == 2 ? -2 : 4);

	}

}

function nuAddAttributes(id, attr) {

	if (attr !== undefined && attr !== null && attr !== '') {

		attr.trim().replace(/\"/g, "").split(",").forEach(attr => {

			let arr = attr.split('=');
			let key;
			let value;

			if (arr.length == 2) {
				[key, value] = arr;
			} else if (arr.length == 1) {
				key = attr;
				value = '';
			}

			if (arr.length == 1 || arr.length == 2) {
				$('#' + id)[0].setAttribute(key.trim(), value);
			}

		});

	}

}

function nuAddInputIcon(id, icon) {

	function addIcon(idIcon, string, after) {
		if (string.startsWith('fa')) {
			nuAttachFontAwesome(idIcon, string, 'normal', after);
		} else {
			nuAttachHTML(idIcon, string, after);
		}
	}

	if (icon !== undefined && icon !== null && icon !== '') {

		if (!icon.includes('|')) {
			addIcon(id, icon, false);
		} else {
			let icons = icon.split('|');
			if (icons[0].trim() !== '') addIcon(id, icons[0], false);
			if (icons[1].trim() !== '') addIcon(id, icons[1], true);
		}

	}

}

function nuAddStyleFromArray(id, obj) {

	var arr = JSON.parse(obj.style);

	for (let key in arr) {

		if (Object.prototype.hasOwnProperty.call(arr, key)) {

			let obj2;
			if (key == 'label') {
				obj2 = $('#' + 'label' + '_' + id);
			} else {
				obj2 = $('#' + id + ' .' + key);
				if (obj2.length === 0) {
					obj2 = $('#' + id);
				}
			}

			if (obj.style_type == 'CSS') {

				let css = obj2[0].getAttribute("style");
				css = css === null ? arr[key] : css += ';' + arr[key];
				obj2[0].setAttribute("style", css);

			} else if (obj.style_type == 'Class') {
				obj2.addClass(arr[key]);
			}

		}

	}

}

function nuAddStyle(id, obj) {

	if (obj.style_type !== '' && obj.style !== '') {

		if (obj.style_type == 'CSS') {

			if (obj.style.startsWith('{')) {
				nuAddStyleFromArray(id, obj);
			} else {
				let css = $('#' + id)[0].getAttribute("style");
				css = css === null ? obj.style : css += obj.style;
				$('#' + id)[0].setAttribute("style", css);
			}
		} else if (obj.style_type == 'Class') {

			if (obj.style.startsWith('{')) {
				nuAddStyleFromArray(id, obj);
			} else {
				$('#' + id).addClass(obj.style);
			}

		}
	}

}

function nuLookupFocus(e) {

	const objT = $(e.target);
	const p = objT.attr('data-nu-prefix');
	const t = objT.attr('data-nu-type');

	window.nuSubformRow = Number(p.substr(p.length - 3));

	if (t != 'textarea') {
		objT.select();
	}

}

function nuCurrentRow() {
	return window.nuSubformRow;
}

function nuSetAccess(i, r) {

	if (r == 2 || r == 3 || r == 4) {									// hidden

		const o = [i, i + 'code', i + 'button', i + 'description', 'label_' + i];

		for (let c = 0; c < o.length; c++) {

			if (r == 2 || ((r == 3 || r == 4) && !nuGlobalAccess())) {
				$('#' + o[c])
					.attr('data-nu-tab', 'x')
					.hide();
			} else if ((r == 3 || r == 4) && !(o[c].startsWith('label_') || o[c].endsWith('button'))) {
				$('#' + o[c]).addClass('nuAccessHiddenUser');
			}

		}

	}

	if (r == 1 || r == 4) {												// readonly
		nuReadonly(i);
	}

	$('#' + i).attr('data-nu-access', r);

}

function nuLabelOrPosition(obj, w, i, l, p, prop) {

	if (obj.parent_type == 'g') {

		obj.left = l;
		obj.top = 3;

	} else {

		if (obj.input != 'button' && prop.title !== 'Insert-Snippet') {			//-- Input Object
			nuLabel(w, i, p, prop);
		}

	}

	return obj;

}

function nuHTML(w, i, l, p, prop, id) {

	var obj = prop.objects[i];
	id = id !== undefined ? id : p + obj.id;
	var ef = p + 'nuRECORD';							//-- Edit Form Id
	var inp = document.createElement('div');

	inp.setAttribute('id', id);

	obj = nuLabelOrPosition(obj, w, i, l, p, prop);

	$('#' + ef).append(inp);

	nuAddDataTab(id, obj.tab, p);

	$('#' + id).css({
		'top': Number(obj.top),
		'left': Number(obj.left),
		'width': Number(obj.width),
		'height': Number(obj.height),
		'position': 'absolute'
	})
		.addClass('nuHtml').html(w.objects[i].html);

	nuSetAccess(id, obj.read);

	nuAddStyle(id, obj);

	return Number(obj.width);

}

function nuEDITOR(w, i, l, p, prop) {

	let obj = prop.objects[i];

	prop.objects[i].type = 'textarea';
	nuINPUT(w, i, l, p, prop);
	$('#' + obj.id).addClass('nuEditor');

	let mce = !prop.objects[i].attributes.includes('nuquiljs');

	if (!mce) nuSetAccess(obj.id, 2);
	let id = obj.id + '_parent_container';
	nuHTML(w, i, l, p, prop, id);

	let nuClass = mce ? "nuTinyMCE" : "nuQuiljs";
	$('#' + id).html('<div style="width:' + obj.width + 'px;height:' + obj.height + 'px" id="' + obj.id + '_container" class="' + nuClass + '"> </div>');
	nuAddStyle(id, obj);

	return Number(obj.width);

}

function nuCONTENTBOX(w, i, l, p, prop) {

	const obj = prop.objects[i];
	var id = p + obj.id;
	var ef = p + 'nuRECORD';							//-- Edit Form Id
	var inp = document.createElement('div');

	inp.setAttribute('id', id);

	$('#' + ef).append(inp);

	nuAddDataTab(id, obj.tab, p);

	const $id = $('#' + id);

	$id.css({
		'top': Number(obj.top),
		'left': Number(obj.left),
		'width': Number(obj.width),
		'height': Number(obj.height),
		'position': 'absolute',
		'z-index': '-1'
	}).attr('data-nu-object-id', w.objects[i].object_id)
		.attr('data-nu-prefix', p)
		.addClass('nuContentBoxContainer').html(w.objects[i].html);

	if (nuGlobalAccess()) $('#label_' + id).attr('ondblclick', 'nuOptionsListAction("nuobject", "' + obj.object_id + '")');

	nuSetAccess(id, obj.read);

	nuAddStyle(id, obj);

	return Number($id.width());

}

function nuIMAGE(w, i, l, p, prop) {

	var obj = prop.objects[i];
	var id = p + obj.id;
	var ef = p + 'nuRECORD';						//-- Edit Form Id
	var inp = document.createElement('img');

	inp.setAttribute('id', id);

	obj = nuLabelOrPosition(obj, w, i, l, p, prop);

	$('#' + ef).append(inp);

	nuAddDataTab(id, obj.tab, p);

	let objId = $('#' + id);
	objId.css({
		'top': Number(obj.top),
		'left': Number(obj.left),
		'position': 'absolute'
	}).addClass('nuImage');

	let width = obj.width;
	let height = obj.height;

	if (height !== "-1" && width !== "-1") {
		objId.css('height', Number(height));
		objId.css('width', Number(width));
	}

	objId.attr('src', atob(w.objects[i].src));

	nuSetAccess(id, obj.read);

	nuAddJSObjectEvents(id, obj.js);

	nuAddStyle(id, obj);

	return Number(objId.width());

}

function nuWORD(w, i, l, p, prop) {

	const obj = prop.objects[i];
	const id = p + obj.id;
	const ef = p + 'nuRECORD';							//-- Edit Form Id
	var inp = document.createElement('div');

	inp.setAttribute('id', id);

	$('#' + ef).append(inp);

	nuAddDataTab(id, obj.tab, p);

	var t = w.objects[i].word;
	const r = /<n>(.*?)<\/n>/g.exec(t);
	t = r === null ? t : r[1];

	var objId = $('#' + id);

	objId.css({
		'top': Number(obj.top),
		'left': Number(obj.left),
		'width': Number(obj.width),
		'height': Number(obj.height),
		'position': 'absolute',
		'text-align': obj.align
	})
		.addClass('nuWord')
		.html(nuTranslate(t));

	if (nuGlobalAccess()) objId.attr('ondblclick', 'nuOptionsListAction("nuobject", "' + obj.object_id + '")');

	if (r !== null) objId.css('font-weight', 'normal');

	nuAddInputIcon(id, obj.input_icon);

	nuSetAccess(id, obj.read);

	nuAddStyle(id, obj);

	return Number(obj.width);

}

function nuRUN(w, i, l, p, prop) {

	var obj = prop.objects[i];
	var id = p + obj.id;
	var ef = p + 'nuRECORD';					//-- Edit Form Id
	var ele = 'button';

	if (obj.parent_type == 'g') {

		obj.left = l;
		obj.top = 3;

	}

	if (obj.run_method != 'b') {

		ele = 'iframe';

		if (obj.parent_type !== 'g') {

			nuLabel(w, i, p, prop);

		}

	}

	var inp = document.createElement(ele);

	inp.setAttribute('id', id);

	$('#' + ef).append(inp);

	nuAddDataTab(id, obj.tab, p);

	$('#' + id).css({
		'top': Number(obj.top),
		'left': Number(obj.left),
		'width': Number(obj.width),
		'height': Number(obj.height),
		'position': 'absolute',
		'text-align': obj.align
	})
		.attr('data-nu-object-id', w.objects[i].object_id)
		.attr('data-nu-prefix', p);

	if (obj.run_method == 'b') {

		let clicker = '';
		var runTarget = obj.run_target;
		runTarget = runTarget == '' || runTarget === null ? '0' : runTarget;

		var stopClick = runTarget == '0' ? 'nuStopClick(event);' : '';
		var runAction = runTarget == '3' ? "nuPopup('" + obj.form_id + "','" + obj.record_id + "','" + obj.filter + "')" : "nuForm('" + obj.form_id + "','" + obj.record_id + "','" + obj.filter + "', '','" + runTarget + "')";

		if (obj.run_type == 'F') { clicker = stopClick + runAction; }
		if (obj.run_type == 'R') { clicker = "nuRunReport('" + obj.record_id + "')"; }
		if (obj.run_type == 'P') {

			if (obj.run_hidden) {
				clicker = "nuRunPHPHidden('" + obj.record_id + "')";
			} else {
				clicker = "nuRunPHP('" + obj.record_id + "')";
			}

		}

		$('#' + id).attr({
			'type': 'button',
			'value': nuTranslate(obj.label),
			'onclick': clicker
		})
			.html(nuTranslate(obj.label))
			.addClass('nuButton');

		nuAddInputIcon(id, obj.input_icon);

	} else {

		var F = obj.form_id;
		var R = obj.record_id;
		var L = obj.filter;
		var PA = obj.parameters;
		var P = window.location.pathname;

		window.nuOPENER.push(new nuOpener(obj.run_type, F, R, L, PA));

		var open = window.nuOPENER[window.nuOPENER.length - 1];
		// var f = P.substring(0, P.lastIndexOf('/') + 1)
		// var u = window.location.origin + f + obj.src + '&opener=' + open.id;
		var u = P + '?i=2&opener=' + open.id;

		$('#' + id).attr('src', u).removeClass('').addClass('nuIframe');

	}

	nuAddJSObjectEvents(id, obj.js);

	nuSetAccess(id, obj.read);

	nuAddStyle(id, obj);

	return Number(obj.width);

}

function nuSELECT(w, i, l, p, prop) {

	var obj = prop.objects[i];
	var id = p + obj.id;
	var ef = p + 'nuRECORD';					//-- Edit Form Id

	obj = nuLabelOrPosition(obj, w, i, l, p, prop);

	var sel = document.createElement('select');

	sel.setAttribute('id', id);

	$('#' + ef).append(sel);


	if (w.objects[i].value != '' && nuRecordId() == '-1') {
		$('#' + id).addClass('nuEdited');
	}

	nuAddDataTab(id, obj.tab, p);

	if (obj.multiple == 1) {
		$('#' + id).attr('multiple', 'multiple');
	}

	if (obj.select2 == 1) {

		let select2Id = nuSetSelect2(id, obj);
		nuAddDataTab(select2Id, obj.tab, p);

	};

	$('#' + id).css({
		'top': Number(obj.top),
		'left': Number(obj.left),
		'width': Number(obj.width),
		'position': 'absolute'
	})
		.attr('onfocus', 'nuLookupFocus(event)')
		.attr('onchange', 'nuChange(event)')
		.attr('data-nu-field', obj.id)
		.attr('data-nu-object-id', w.objects[i].object_id)
		.attr('data-nu-format', '')
		.attr('data-nu-subform-sort', 1)
		.attr('data-nu-data', '')
		.attr('data-nu-label', w.objects[i].label)
		.attr('data-nu-prefix', p);


	$('#' + id).css('height', Number(obj.height));

	var s = String(w.objects[i].value);
	var a = [];

	if (w.objects[i].multiple == 0 || w.objects[i].multiple === null) {
		a = [s];
	}

	if (s.substr(0, 1) + s.substr(-1) == '[]') {
		eval('a = ' + s);
	}

	$('#' + id).append('<option value=""></option>');

	if (obj.options !== null) {

		for (var n = 0; n < obj.options.length; n++) {

			var opt = String(obj.options[n][1]).replaceAll(' ', '&#160;');

			if (a.indexOf(obj.options[n][0]) == -1) {
				$('#' + id).append('<option value="' + obj.options[n][0] + '">' + opt + '</option>');
			} else {
				$('#' + id).append('<option selected="selected "value="' + obj.options[n][0] + '">' + opt + '</option>');
			}

		}

	}

	nuAddJSObjectEvents(id, obj.js);

	nuSetAccess(id, obj.read);

	if (obj.read == 1) {
		nuDisable(id);
	}

	nuAddStyle(id, obj);

	return Number(obj.width);

}

function nuSUBFORM(w, i, l, p, prop) {

	var SF = prop.objects[i];						//-- First row
	var SFR = w.objects[i];							//-- All rows
	var id = p + SF.id;
	var ef = p + 'nuRECORD';						//-- Edit Form Id
	var inp = document.createElement('div');
	var fms = SFR.forms;

	inp.setAttribute('id', id);

	if (SF.parent_type == 'g') {

		SF.left = l;
		SF.top = 3;

	} else {
		nuLabel(w, i, p, prop);
	}

	$('#' + ef).append(inp);

	nuAddDataTab(id, SF.tab, p);

	$('#' + id).css({
		'top': Number(SF.top),
		'left': Number(SF.left),
		'width': Number(SF.width),
		'height': Number(SF.height) + 2,
		'overflow-x': 'hidden',
		'overflow-y': 'hidden'
	})
		.attr('data-nu-object-id', SF.object_id)
		.attr('data-nu-foreign-key-name', SF.foreign_key_name)
		.attr('data-nu-primary-key-name', SF.primary_key_name)
		.attr('data-nu-subform', 'true')
		.attr('data-nu-add', SF.add)
		.attr('data-nu-delete', SF.delete)
		.addClass('nuSubform');

	nuAddJSObjectEvents(id, SF.js);

	if (SF.forms[0] !== undefined) {
		nuGetSubformRowSize(SF.forms[0].objects, SF, id);
	}

	let rowHeight;
	let rowWidth;

	if (SF.subform_type == 'f') {

		rowHeight = Number(SF.dimensions.edit.height + 10);
		rowWidth = Number(SF.dimensions.edit.width + 10);

	} else {

		rowHeight = Number(SF.dimensions.grid.height);
		rowWidth = Number(SF.dimensions.grid.width + 55);

	}

	if (SF.delete == '1') {
		rowWidth = rowWidth - 3;
	} else {
		rowWidth = rowWidth - 25;
	}

	var rowTop = 52;

	if (SF.subform_type == 'f') {
		rowTop = 33;
	}

	var tabId = id + 'nuTabHolder';
	var tabDiv = document.createElement('div');
	tabDiv.setAttribute('id', tabId);
	$('#' + id).prepend(tabDiv);
	$('#' + tabId).css({
		'top': 0,
		'left': 0,
		'width': rowWidth,
		'height': rowTop,
		'overflow-x': 'hidden',
		'overflow-y': 'hidden',
		'position': 'absolute',
		'padding': '12px 0px 0px 0px'
	})
		.addClass('nuTabHolder')
		.attr('data-nu-subform', tabId)
		.prepend('&nbsp;&nbsp;&nbsp;');

	if (SF.subform_type == 'f') {
		nuAddEditTabs(id, SF.forms[0]);
	} else {

		if (SFR.forms.length > 0) {

			nuTABHELP[SFR.forms[0].tabs[0].id] = SFR.forms[0].tabs[0].help;
			nuFORMHELP[SF.id] = SFR.forms[0].tabs[0].help;

		}

	}

	nuOptions(id, SF.sf_form_id, 'subform', w.global_access);

	var scrId = id + 'scrollDiv';
	var scrDiv = document.createElement('div');

	scrDiv.setAttribute('id', scrId);
	scrDiv.setAttribute('class', 'nuSubformScrollDiv');

	$('#' + id).append(scrDiv);
	$('#' + scrId).css({
		'top': rowTop,
		'left': 0,
		'width': Number(rowWidth) + 1,
		'height': Number(SF.height) - rowTop + 1,
		'border-width': 10,
		'overflow-x': 'hidden',
		'overflow-y': 'scroll',
		'position': 'absolute'
	});

	if (rowWidth > Number(SF.width)) {

		$('#' + id).css('overflow-x', 'scroll');
		$('#' + scrId).css('height', SF.height - rowTop - 25);

	}

	rowTop = 0;
	var even = 0;
	var prefix;

	for (var c = 0; c < fms.length; c++) {

		prefix = id + nuPad3(c);
		const frmId = prefix + 'nuRECORD';
		var frmDiv = document.createElement('div');

		frmDiv.setAttribute('id', frmId);
		$('#' + scrId).append(frmDiv);
		$('#' + frmId).css({
			'top': Number(rowTop),
			'left': 0,
			'width': Number(rowWidth),
			'height': Number(rowHeight),
			'position': 'absolute'
		})
		.addClass('nuSubform' + even);

		nuBuildEditObjects(SFR.forms[c], prefix, SF, SF.forms[0]);

		if (SF.delete == '1') {
			SF.forms[c].deletable = '1';
		} else {
			SF.forms[c].deletable = '0';
		}

		nuRecordProperties(SF.forms[c], prefix, rowWidth - 40);

		rowTop = Number(rowTop) + Number(rowHeight);
		even = even == '0' ? '1' : '0';

	}

	if (prefix != '') {

		if (SF.add == 1) {
			nuNewRowObject(String(prefix));
		} else {
			$('#' + prefix + 'nuRECORD').hide();

		}

	}

	nuSetAccess(id, SF.read);

	nuAddStyle(id, SF);

	return Number(SF.width);

}

function nuNewRowObject(p) {

	var sf = p.substr(0, p.length - 3);

	if ($('#' + p + 'nuRECORD').length == 0) { return; }

	var h = document.getElementById(p + 'nuRECORD').outerHTML;

	window.nuSUBFORMROW[sf] = String(h.nuReplaceAll(p, '#nuSubformRowNumber#', true));

	$("[id^='" + p + "']").addClass('nuEdit');

}

function nuSubformObject(id) {
	return nuFORM.subform(id);
}

function nuSubformRowId(t) {
	return $(t).parent().attr('data-nu-primary-key');
}

function nuSubformRowNumber(id) {
	return $('#' + id).attr('data-nu-prefix').slice(-3);
}

function nuSubformRowObject(id, column) {

	let formCode = $('#' + id).attr('data-nu-form');

	return $('#' + formCode + nuSubformRowNumber(id) + column);

}

function nuSubformValue(t, id) {

	var p = $(t).attr('data-nu-prefix');

	return $('#' + p + id).val();

}

function nuSubformColumnArray(id, column, includeDeleted = false) {

	var a = [];
	const sf = nuSubformObject(id);
	const c = Number.isInteger(column) ? column : sf.fields.indexOf(column);

	for (let i = 0; i < sf.rows.length; i++) {
		if (sf.deleted[i] == 0 || includeDeleted) {
			var rv = sf.rows[i][c];
			a.push(rv);
		}
	}
	return a;
}

function nuSubformDisable(sf, ob) {

	if (ob === undefined || ob === '') {
		$("[data-nu-form='" + sf + "']").nuDisable();
		return;
	}

	for (let i = 0; i < nuSubformObject(sf).rows.length; i++) {
		nuDisable(sf + nuPad3(i) + ob);
	}

}

function nuSubformEnable(sf, ob, enable) {

	if (ob === undefined || ob === '') {
		$("[data-nu-form='" + sf + "']").nuEnable(enable);
		return;
	}

	for (let i = 0; i < nuSubformObject(sf).rows.length; i++) {
		nuEnable(sf + nuPad3(i) + ob, enable);
	}

}

function nuSubformHide(sf, ob) {

	if (ob === undefined || ob === '') {
		$("[data-nu-form='" + sf + "']").nuHide();
		return;
	}

	for (let i = 0; i < nuSubformObject(sf).rows.length; i++) {
		nuHide(sf + nuPad3(i) + ob);
	}

}

function nuSubformShow(sf, ob, show) {

	if (ob === undefined || ob === '') {
		$("[data-nu-form='" + sf + "']").nuShow(true, false);
		return;
	}

	for (let i = 0; i < nuSubformObject(sf).rows.length; i++) {
		nuShow(sf + nuPad3(i) + ob, show, false);
	}

}

function nuSubformLastRow(t) {

	var i = String($('#' + t.id).parent().attr('id'));
	var p = i.substr(0, i.length - 17);
	var s = parseInt(i.substr(11, 3), 10) + 1;
	var n = $('#' + p + nuPad3(s) + 'nuRECORD').length;

	return n == 0;

}

function nuSubformFocusLastRow(id, f) {

	var sf = nuSubformObject(id);
	var c = f === undefined ? sf.fields[1] : sf.fields.indexOf(f);
	var r = sf.rows.length - 1;

	$('#' + id + nuPad3(r) + c).focus();

}

function nuSubformSetHeight(i, height, minHeight, maxHeight) {

	let div = $('#' + i + 'scrollDiv');
	let sf = $('#' + i);

	let h = sf.data('nu-org-height');
	if (h === undefined || h === null) {

		div.data('nu-org-height', div.height());
		sf.data('nu-org-height', sf.height());
		sf.data('nu-org-z-index', sf.css('z-index'));

		if (height === undefined || height === null) {
			h = window.innerHeight - sf.cssNumber('Top') - nuDialogHeadersHeight() - 50;
		} else {
			h = height;
		}

		if (maxHeight !== undefined && h > maxHeight) h = maxHeight;
		if (minHeight !== undefined && h < minHeight) h = minHeight;

		sf.height(h);
		let hh = $('#' + i + 'nuTabHolder').height() + 1;
		div.height(h - hh);

		sf.css('z-index', 1);

	} else {

		sf.height(h);
		div.height(div.data('nu-org-height'));
		sf.data('nu-org-height', null);
		sf.css('z-index', div.data('nu-org-z-index'));

	}

}

function nuSubformRearrangeColumns(sf, fields, row, maintainWidth) {

	function obj(p) {
		return $("[id$='" + p + "']");
	}

	let width = 3;
	let totalwidth = $('#' + sf).cssNumber('width');

	if (row !== '') row = nuPad3(row);

	nuHide(sf);

	for (let i = 1; i < fields.length; i++) {

		let p = row + fields[i][0];
		let p0 = '000' + fields[i][0];

		if (fields[i][1] == '0') {
			let h0 = obj(p0);
			if (!h0.is('[nu-subform-column-hidden]')) {
				h0.attr('nu-subform-column-hidden', '');
				let h = obj(p);
				totalwidth -= h.cssNumber('width');
				h.nuHide();
			}
		} else {

			if (obj(p0).attr('data-nu-type') == 'lookup') {
				obj(p + 'code').css('left', width);
				width = obj('code').cssNumber('width') + width + 6;
				obj(p + 'button').css('left', width);
				width += 19;
				obj(p + 'description').css('left', width);
				width = obj('description').cssNumber('width') + width + 6;
			} else {
				obj(p).css('left', width);
				width = obj(p0).cssNumber('width') + width + 6;
			}

		}
	}

	if (maintainWidth !== false) {
		$('#' + sf + 'scrollDiv').css('width', totalwidth - 1);
		$('#' + sf).css('width', totalwidth);
	}

	nuShow(sf);

}

function nuSubformHideColumns(sfId, columns, maintainWidth) {

	let fields = [];
	nuSubformObject(sfId).fields.forEach(function (col) {
		fields.push([col, columns.indexOf(col) !== -1 ? '0' : '1']);
	});

	nuSubformRearrangeColumns(sfId, fields, '', maintainWidth);

}

function nuSubformColumnUnique(id, column, label) {

	let arr = nuSubformColumnArray(id, column);

	if (arr.includes('') || !nuArrayIsUnique(arr)) {
		return nuTranslate(label) + ' ' + nuTranslate('must be both unique and not blank');
	}

	return true;

}

function nuSubformTitleArray(sfName) {

	let arr =
		$('#' + sfName).children().filter('.nuSubformTitle').map(function () {
			return this.getAttribute("data-nu-field");
		}).get();

	return arr;

}

function nuSubformMoveFocus(activeElement, d) {

	let row = activeElement.attr('data-nu-prefix').slice(-3);
	let nextRow = $('#' + activeElement.attr('data-nu-form') + nuPad3(Number(row) + d) + activeElement.attr('id').substr(activeElement.attr('data-nu-form').length + 3));
	if (nextRow.length == 1 && !nextRow.prop('disabled')) nextRow.focus();

	return true;

}

function nuSubformHandleArrowKeyEvent(e) {

	let keyCode = e.keyCode || e.which,
		keys = {
			up: 38,
			down: 40,
			enter: 13
		};

	let activeElement = $(document.activeElement);
	let nuScroll = activeElement.hasClass('nuScroll');

	var result;
	switch (keyCode) {
		case keys.up:
			result = !nuScroll && nuSubformMoveFocus(activeElement, -1);
			break;
		case keys.enter:
			result = nuSubformMoveFocus(activeElement, 1);
			break;
		case keys.down:
			result = !nuScroll && nuSubformMoveFocus(activeElement, 1);
			break;
		default:
			result = false;
	}

	return result;

}


// Subform filtering

function nuSubformAddFilter(filter) {

	for (const sfName in filter) {
		if (Object.prototype.hasOwnProperty.call(filter, sfName)) {
			nuSubformFiltersAdd(sfName, filter[sfName]);
		}
	}

	function nuSubformFilterId(sfName, columnId) {
		return sfName + columnId + '_filter';
	}

	function nuSubformFilterValue(sfName, columnId, type) {
		let filterId = nuSubformFilterId(sfName, columnId);
		return nuGetValue(filterId, type === 'select' ? 'text' : 'value');
	}

	function nuSubformFilterOptionAll(sfName, columnId) {
		let filterId = nuSubformFilterId(sfName, columnId);
		return $("#" + filterId + " option:selected").attr('data-nu-all') === 'true';
	}

	function nuSubformFilterArray(sfName, arrColumns) {

		let arr = {};
		let isArray = Array.isArray(arrColumns);

		for (let columnId in arrColumns) {
			if (isArray) columnId = arrColumns[columnId];
			arr[columnId] = {};
			arr[columnId].type = isArray ? 'select' : arrColumns[columnId].type;
			arr[columnId].value = nuSubformFilterValue(sfName, columnId, arr[columnId].type);
			arr[columnId].all = nuSubformFilterOptionAll(sfName, columnId);
		}

		return arr;

	}

	function nuSubformFilterSortOptions(sfName, columnId) {

		let filterId = nuSubformFilterId(sfName, columnId);
		$(filterId).html($(filterId + " option:not('[data-nu-persistent]')").sort(function (a, b) {
			return a.text == b.text ? 0 : a.text < b.text ? -1 : 1;
		}));

	}

	function nuSubformFiltersAdd(sfName, arrColumns) {

		let isArray = Array.isArray(arrColumns);
		for (let columnId in arrColumns) {

			if (Object.prototype.hasOwnProperty.call(arrColumns, columnId)) {

				if (isArray)
					columnId = arrColumns[columnId];

				const prop = arrColumns[columnId];
				const float = prop === undefined || prop.float === undefined ? 'center' : prop.float;

				let width = $('#' + sfName + '000' + columnId).width() - 3;
				width = prop === undefined || prop.width === undefined ? width : prop.width;

				let style = {
					'width': width + 'px',
					'float': float
				};

				const columnTitle = '#title_' + sfName + columnId;
				const filterId = nuSubformFilterId(sfName, columnId);
				const type = prop === undefined || prop.type === undefined ? 'select' : prop.type;
				let obj = nuSubformFilterAddObject(type, sfName, columnId, filterId, prop);

				$(columnTitle).append("<br />");

				 obj.appendTo(columnTitle).css(style);
				 if (prop.placeholder) obj.nuSetPlaceholder(prop.placeholder);

			}

		}

	}

	function nuSubformFilterAddObject(type, sfName, columnId, filterId, prop) {

		var obj;
		if (type == 'select') {
			obj = nuSubformFilterAddSelect(sfName, columnId, filterId, prop);
		} else if (type === 'search') {
			obj = nuSubformFilterAddSearch(sfName, columnId, filterId, prop);
		}

		return obj;

	}

	function nuSubformFilterAddSelect(sfName, columnId, filterId, prop) {

		let propAll = prop === undefined || prop.all === undefined ? '(' + nuTranslate('All') + ')' : prop.all;
		let optionAll = [];
		if (propAll !== false)
			optionAll = nuSubformFilterCreateSelectOption('', propAll, true, true, true);

		let propBlank = prop === undefined || prop.blank === undefined ? true : prop.blank;
		let optionBlank = [];
		if (propBlank !== false)
			optionBlank = nuSubformFilterCreateSelectOption('', '', true, false, false);

		return $('<select />', {
			id: filterId,
			class: 'nuSubformFilter',
			on: {
				change: function () {
					nuSubformFilterRows(sfName, nuSubformFilterArray(sfName, filter[sfName]));
				},
				focus: function () {
					nuSubformFilterAddValues(sfName, 'select', columnId);
					nuSubformFilterSortOptions(sfName, columnId);
				},
			},
			append: [
				optionAll,
				optionBlank
			]

		});

	}

	function nuSubformFilterAddSearch(sfName, columnId, filterId, prop) {

		let propDatalist = prop === undefined || prop.datalist === undefined ? true : prop.datalist;

		return $("<input/>", {
			type: "search",
			class: "nuSubformFilter",
			on: {
				input: function () {
					nuSubformFilterRows(sfName, nuSubformFilterArray(sfName, filter[sfName]));
				},
				focus: function () {
					if (propDatalist === true)
						nuSubformFilterAddValues(sfName, 'search', columnId);
				},
			},
			id: filterId
		});

	}

	function nuSubformFilterCreateSelectOption(_value, _text, persistent, all, _selected) {

		return $('<option />', {
			value: _value,
			text: _text,
			'data-nu-persistent': persistent,
			'data-nu-all': all,
			selected: _selected === true ? 'selected' : false
		});

	}

	function nuSubformFilterCellValue(sfName, columnId, row) {

		let id = sfName + nuPad3(row) + columnId;
		let obj = $('#' + id);
		let text = obj.nuGetValue(obj.is("select") ? 'text' : 'value');

		if (obj.hasClass('nuHiddenLookup')) {
			text = $('#' + id + 'code').nuGetValue();
		}

		return text;

	}

	function nuSubformFilterAddValues(sfName, type, columnId) {

		let sf = nuSubformObject(sfName);
		let columnIndex = sf.fields.indexOf(columnId);
		let filterId = nuSubformFilterId(sfName, columnId);
		let filterObj = $('#' + filterId);
		let selectedIndex = filterObj.prop('selectedIndex');
		let arr = [];

		filterObj.find('option').not('[data-nu-persistent]').remove();

		for (let row = 0; row < sf.rows.length - 1; row++) {

			let value = sf.rows[row][columnIndex];
			let text = nuSubformFilterCellValue(sfName, columnId, row);

			if (type === 'select') {
				if ($("#" + filterId + " option[value='" + value + "']").length == 0) {

					let add = true;

					if (window.nuSubformFilterOnAddValue) {
						let result = nuSubformFilterOnAddValue(sfName, add, text, value);
						value = result.value;
						text = result.text;
						add = result.add;
					}

					if (add) $("#" + filterId).append(new Option(text, value));

				}
			} else if (type === 'search') {
				if (arr.indexOf(text) === -1) {
					arr.push(text);
				}
			}
		}

		if (window.nuSubformFilterOnAddValues) {
			nuSubformFilterOnAddValues(sfName, filterId);
		}

		if (type === 'select') {
			filterObj.prop('selectedIndex', selectedIndex);
		} else if (type === 'search') {
			arr.sort(nuAscendingSortColumn);
			nuAddDatalist(filterId, arr);
		}

	}

	function nuSubformSortTop(a, b) {

		if (a.top < b.top) {
			return -1;
		}
		if (a.top > b.top) {
			return 1;
		}

		return 0;

	}

	function nuSubformFilterRows(sfName, arrFilter) {

		let arr = [];

		let lastRow = nuSubformObject(sfName).rows.length;
		let nuNoAdd = $('#' + sfName).attr('data-nu-add') == '0' ? 1 : 0;

		let r = 0;
		$("[ID^='" + sfName + "'][ID$='nuRECORD']").each(function () {
			let rec = $(this);

			// Restore positions:
			let top = rec.data('nu-top-position');
			if (top) {
				rec.css("top", top);
				if (nuNoAdd == '1' && lastRow !== r) rec.show();
			}

			// Get positions
			top = rec.cssNumber('top');
			let o = { 'obj': rec.attr('id'), 'top': top };
			rec.data('nu-top-position', top); // save top position

			arr.push(o);
			r++;
		});

		let rows = arr.sort(nuSubformSortTop);

		let rowHeight = $('#' + sfName + '000nuRECORD').cssNumber('height');
		let rowTop = 0;
		let hideCount = 0;

		for (let row = 0; row < rows.length - nuNoAdd; row++) {

			let hide = false;
			let rec = $('#' + rows[row].obj);

			if (arrFilter !== null) {

				for (let columnId in arrFilter) {

					let data = [];
					data.val = nuSubformFilterCellValue(sfName, columnId, row);
					data.filter = arrFilter[columnId].value;
					data.type = arrFilter[columnId].type;
					data.optionAll = arrFilter[columnId].all;
					data.optionBlank = data.filter == '' && data.type == 'search';
					data.isMatch = (data.type == 'search' && data.val.toLowerCase().includes(data.filter.toLowerCase())) ||
						(data.type == 'select' && (data.val.toLowerCase() == data.filter.toLowerCase() || data.optionAll));

					if (window.nuSubformOnFilterRows) {
						hide = nuSubformOnFilterRows(sfName, data, row, rows.length);
					} else {

						if (!data.isMatch && !data.optionBlank && rows.length - 1 !== row) {
							hide = true;
							break;
						} else {
							hide = false;
						}

					}

				}
			}

			if (hide === false) {
				rec.css("top", rowTop).show();
				rowTop = rowTop + rowHeight + 1;
			} else {
				hideCount++;
				rec.hide();
			}

		}

		$('#' + sfName).data('nu-filtered', hideCount > 0);

	}

}

// END Subform filtering

function nuRefreshSelectObject(selectId, formId, removeBlank) {

	nuSubformRefreshSelectObject('', selectId, formId, removeBlank);

}

function nuSubformRefreshSelectObject(prefix, selectId, formId, removeBlank) {

	formId = nuDefine(formId);

	const p = 'NUREFRESHSELECTOBJECT';
	nuSetProperty(p + '_prefix', prefix);
	nuSetProperty(p + '_selectid', selectId);
	nuSetProperty(p + '_formid', formId);
	nuSetProperty(p + '_removeblank', removeBlank === true ? '1' : '0');

	nuRunPHPHidden(p, 0);

}

function nuRefreshDisplayObject(displayId, formId) {

	nuSubformRefreshDisplayObject('', displayId, formId);

}

function nuSubformRefreshDisplayObject(prefix, displayId, formId) {

	formId = nuDefine(formId);

	const p = 'NUREFRESHDISPLAYOBJECT';
	nuSetProperty(p + '_prefix', prefix);
	nuSetProperty(p + '_displayid', displayId);
	nuSetProperty(p + '_formid', formId);

	nuRunPHPHidden(p, 0);

}

function nuGetClipboardText(e) {

	let cb;
	let clipText = '';
	if (window.clipboardData && window.clipboardData.getData) {
		cb = window.clipboardData;
		clipText = cb.getData('Text');
	} else if (e.clipboardData && e.clipboardData.getData) {
		cb = e.clipboardData;
		clipText = cb.getData('text/plain');
	} else {
		cb = e.originalEvent.clipboardData;
		clipText = cb.getData('text/plain');
	}
	return clipText;

}

function nuSubformUndoPaste(t) {

	if (confirm(nuTranslate("Undo the last paste? (The values before the insertion will be restored)?"))) {
		$("[data-prevalue]").each(function () {
			var v = $(this).attr("data-prevalue");
			$(this).val(v).change();
		});
		nuHide($(this).attr('id'));
	}
}

function nuSubformPaste(e, jsonObj) {

	var id = e.target.id;

	var sfId = $('#' + id).attr('data-nu-form');
	var field = $('#' + id).attr('data-nu-field');
	var dRow = parseInt($('#' + String(id), 10).attr('data-nu-prefix').slice(-3));

	var obj = nuSubformObject(sfId);
	var dColStart = obj.fields.indexOf(field);

	var sNumRows = jsonObj.length;
	var sNumCols = Object.keys(jsonObj[0]).length;

	var sc = 0;
	for (let c = dColStart; c < (dColStart + sNumCols); c++) {
		var sr = 0;
		for (let r = dRow; r < parseInt(dRow + sNumRows, 10); r++) {
			var dest = $('#' + sfId + nuPad3(r) + obj.fields[c]);
			dest.attr("data-prevalue", dest.val());
			dest.val(jsonObj[sr][sc]).change();
			sr++;
		}
		sc++;
	}
}

function nuGetClipboardRows(clipText) {

	let clipRows = clipText.split('\n');
	for (let i = 0; i < clipRows.length; i++) {
		clipRows[i] = clipRows[i].split('\t');
	}
	return clipRows;

}

function nuGetClipboardJson(clipRows) {

	var jsonObj = [];
	for (let i = 0; i < clipRows.length - 1; i++) {
		var item = {};
		for (let j = 0; j < clipRows[i].length; j++) {
			if (clipRows[i][j] != '\r') {
				item[j] = clipRows[i][j];
			}
		}
		jsonObj.push(item);
	}
	return jsonObj;

}

function nuSubformEnableMultiPaste(subformId, selector, undoButton) {

	$(selector).not(".nuReadonly").on('paste', function (e) {
		var clipText = nuGetClipboardText(e);

		if (clipText.indexOf('\t') >= 0 || clipText.indexOf('\n') >= 0) {

			var clipRows = nuGetClipboardRows(clipText);
			var jsonObj = nuGetClipboardJson(clipRows);

			e.stopPropagation();
			e.preventDefault();

			if (confirm(nuTranslate("Paste Data? Existing data might get overwritten"))) {
				$('[data-nu-form="' + subformId + '"]').removeAttr("data-prevalue");
				nuSubformPaste(e, jsonObj);

				if (undoButton) {
					nuShow(undoButton);
				}

				window.nuNEW = 0;

			}
		}

	});

}

function nuSubformHeaderToSeparatedString(fields, delimiter, includeId) {

	var start = includeId == true ? 0 : 1;
	var h = '';

	for (var i = start; i < fields.length - 1; i++) {
		h += fields[i] + delimiter;
	}
	return h + '\n';
}

function nuSubformRowToSeparatedString(rows, delimiter, includeId) {

	var processRow = function (row, includeId) {

		var finalVal = '';

		var start = includeId == true ? 0 : 1;
		for (var j = start; j < row.length - 1; j++) {
			var innerValue = row[j] === null ? '' : row[j].toString();
			if (row[j] instanceof Date) {
				innerValue = row[j].toLocaleString();
			}
			var result = innerValue.replace(/"/g, '""');
			if (result.search(/("|,|\n)/g) >= 0)
				result = '"' + result + '"';
			if (j > start)
				finalVal += delimiter;
			finalVal += result;
		}
		return finalVal + '\n';
	};

	var output = "";

	for (var i = 0; i < rows.length - 1; i++) {
		output += processRow(rows[i], includeId);
	}

	return output;
}


function nuCopyToClipboard(s) {

	navigator.clipboard.writeText(s).then(function () {
		return true;
	}, function () {
		return false;
	});

}

/**
 * Copy the data of a Subform to the Clipboard
 *
 * @param {string}	i				- Subform Object ID
 * @param {string}	delimiter			- Delimiter for the data. Default: \t (tabulator)
 * @param {bool}	[includeHeader]		- true to include the header (titles)
 * @param {bool}	[includeId]			- true to include the Id (Primary Key)
 *
 */

function nuSubformToClipboard(i, delimiter, includeHeader, includeId) {

	var obj = nuSubformObject(i);

	var s = "";

	if (!delimiter) {
		delimiter = '\t';
	}

	if (!includeId) {
		includeId = false;
	}

	if (includeHeader === true) {
		s = nuSubformHeaderToSeparatedString(obj.fields, delimiter, includeId);
	}

	s += nuSubformRowToSeparatedString(obj.rows, delimiter, includeId);

	nuCopyToClipboard(s);
}

function nuRecordHolderObject(t) {

	var h = 'nuRECORD';
	var p = $('#' + t.id).parent();
	var i = String(p.attr('id'));
	var c = 0;

	this.form = i.substr(0, i.length - 3 - h.length);
	this.strNo = i.substr(this.form.length, 3);
	this.intNo = Number(this.strNo);

	while ($('#' + this.form + nuPad3(this.intNo + c) + h).length != 0) { c++; }

	this.rows = this.intNo + c;
	this.top = (p.outerHeight() * this.rows);
	var s = this.form + nuPad3(this.intNo + 1) + h;
	this.last = $('#' + s).length == 0;
	s = this.form + nuPad3(this.rows - 1);
	this.html = window.nuSUBFORMROW[s];
	this.even = parseInt(this.rows / 2, 10) == this.rows / 2 ? '0' : '1';

}

function nuAddSubformRow(t, e) {

	if ($('#' + t.id).parent().parent().parent().attr('data-nu-add') == 0) { return; }

	var sfid = $('#' + t.id).parent().parent().parent()[0].id;
	var before = $('#' + sfid).attr('data-nu-beforeinsertrow');
	var after = $('#' + sfid).attr('data-nu-afterinsertrow');

	var nuCancel = false;

	eval(before);

	if (nuCancel) { return; }

	if (e !== false) { e.stopPropagation(); }

	var o = new nuRecordHolderObject(t);

	if (!o.last) { return; }

	var h = window.nuSUBFORMROW[o.form].nuReplaceAll('#nuSubformRowNumber#', o.form + nuPad3(o.rows), true);

	$('#' + o.form + 'scrollDiv').append(h);

	$('#' + o.form + nuPad3(o.rows) + 'nuRECORD').addClass('nuSubform' + o.even).css('top', o.top);
	$('#' + o.form + nuPad3(o.rows)).attr('data-nu-primary-key', '-1');
	$('#' + o.form + nuPad3(o.rows) + 'nuDelete').prop('checked', true);
	$('#' + o.form + nuPad3(o.rows - 1) + 'nuDelete').prop('checked', false);

	$("[id^='" + o.form + nuPad3(o.rows) + "']").removeClass('nuEdited');

	let ts = $('.nuTabSelected');
	ts.attr('nu-data-clicked-by-system', '');
	ts.click();

	$('#' + o.form + nuPad3(o.rows) + 'nuRECORD > .nuLookupButton')
		.on("click", function () {
			nuBuildLookup(this, "");
		});

	// Copy Datalist from previous row

	let objlist1 = $('#' + o.form + nuPad3(o.rows - 1) + 'nuRECORD').children().filter('[list]');
	if (objlist1.length !== 0) {
		let objlist2 = $('#' + o.form + nuPad3(o.rows) + 'nuRECORD').children().filter('[list]');
		objlist2.each(function (i) {
			$(this).attr('list', objlist1.eq(i).attr('list'));
		});
	}

	let objSelect = $('#' + o.form + nuPad3(o.rows) + 'nuRECORD > .select2-hidden-accessible');

	if (objSelect.length > 0) {
		objSelect.each(function () {

			let objSelect2 = $('#' + this.id + '_select2');
			let pos = objSelect2.position();
			let obj = {
				width: objSelect2.width(),
				top: pos.top,
				left: pos.left
			};

			objSelect2.remove();

			nuSetSelect2(this.id, obj);

		});
	}

	eval(after);

}

function nuLabel(w, i, p, prop) {

	let obj = prop.objects[i];
	if (obj.label == '' || obj.display == 0 || obj.label == "Insert-Snippet") { return; }

	var id = 'label_' + p + obj.id;
	var ef = p + 'nuRECORD';						//-- Edit Form Id

	var lab = document.createElement('label');
	var lwidth = nuGetWordWidth(nuTranslate(obj.label), 'label');

	lab.setAttribute('id', id);
	lab.setAttribute('for', p + obj.id);

	$('#' + ef).append(lab);

	nuAddDataTab(id, obj.tab, p);

	var l = String(nuTranslate(obj.label));

	var o = $('#' + id);
	o.css({
		'top': Number(obj.top),
		'left': Number(obj.left) - lwidth + -17,
		'width': Number(lwidth + 12)
	})
		.html(l);

	if (nuGlobalAccess()) o.attr('ondblclick', 'nuOptionsListAction("nuobject", "' + obj.object_id + '")');

	if (l == ' ') lab.innerHTML = '&#8199;';

	if (obj.valid == 0) { o.addClass('nuNone'); }
	if (obj.valid == 1) { o.addClass('nuBlank'); }
	if (obj.valid == 2) { o.addClass('nuDuplicate'); }
	if (obj.valid == 3) { o.addClass('nuDuplicateOrBlank'); }

	return lab;

}

function nuPopulateLookup3(v, p) {

	for (var i = 0; i < v.length; i++) {

		var fieldname = String(v[i][0]).replace('#ROW#', p);

		$('#' + fieldname).val(v[i][1]);
	}

}

function nuAddHolder(t) {

	var d = document.createElement('div');

	d.setAttribute('id', t);

	$('body').append(d);
	$('#' + t).addClass(t);

}

function nuGetWordWidth(w, objClass) {

	if (!objClass) {
		objClass = 'nuSection';
	}

	const W = 'nuTestWidth';
	const h = "<" + 'div' + " id='" + W + "' style='position:absolute;visible:hidden;width:auto'>" + w + "</" + 'div' + ">";
	$('body').append(h);
	let obj = $('#' + W);
	obj.addClass(objClass);
	let l = parseInt(obj.css('width'), 10);
	obj.remove();

	return l + 5;

}

function nuGetSubformRowSize(o, SF, id) {

	var l = -3;
	var w = 0;

	for (var i = 0; i < o.length; i++) {

		var d = Number(o[i].description_width);
		var B = o[i].type == 'lookup' ? 26 : 0;					//-- lookup button
		var D = o[i].type == 'lookup' ? d : 0;					//-- lookup description

		if (o[i].type == 'select') {
			w = Number(o[i].width) + B + D - 4;
		} else {
			w = Number(o[i].width) + B + D;
		}

		if (SF.subform_type == 'g') {							//-- grid

			nuBuildSubformTitle(o[i], l, w, id, i);
			l = l + w + (o[i].read == 2 ? 0 : 6);

		}

	}

}

function nuBuildSubformTitle(o, l, w, id, col) {

	var titleId = 'title_' + id + o.id;
	var div = document.createElement('div');
	var label = nuTranslate(o.label);

	if (o.read == 2) {
		label = '';
	}

	div.setAttribute('id', titleId);

	$('#' + id).append(div);

	var oTitle = $('#' + titleId);
	oTitle.css({
		'top': 0,
		'left': Number(l) + 9,
		'width': Number(w),
		'height': 50,
		'text-align': 'center',
		'position': 'absolute'
	})
		.html(label)
		.attr('data-nu-field', o.id)
		.attr('data-nu-subform', id)
		.attr('data-nu-order', 'asc')
		.addClass('nuTabHolder nuSubformTitle')
		.addClass(o.input == 'number' || o.input == 'nuNumber' ? 'number' : 'text');

	oTitle.on('click', e => {
		if (window.onSubformTitleClick) {
			if (onSubformTitleClick(e.target.parentElement.id, e) !== false) {
				nuSortSubform(id, col + 1, e);
			}
		} else {
			nuSortSubform(id, col + 1, e);
		}
	});

	if (nuGlobalAccess()) {
		oTitle.on('dblclick', e => {
			nuOptionsListAction("nuobject", o.object_id);
		});
	}

	if (o.valid == 1) { oTitle.addClass('nuBlank'); }
	if (o.valid == 2) { oTitle.addClass('nuDuplicate'); }

}

function nuBuildSubformDeleteTitle(l, id, subform_id) {

	var titleId = id + 'DeleteSF';
	var div = document.createElement('div');

	div.setAttribute('id', titleId);

	$('#' + id).append(div);

	$('#' + titleId).css({
		'top': 0,
		'left': Number(l) - 12,
		'width': 52,
		'height': 50,
		'text-align': 'center',
		'font-size': 10,
		'padding': 0,
		'position': 'absolute'
	})
		.html('<img id="nuMoveable" src="graphics/numove.png" style="padding:8px;width:12px;height:12px;" title="Arrange Objects"><br>Delete')
		.addClass('nuTabHolder')
		.attr('onclick', 'nuPopup("' + subform_id + '", "-2");');

}

function nuAddBreadcrumbs() {

	var b = window.nuFORM.breadcrumbs.length;

	const iStart = nuMainForm() ? 1 : 0;

	for (var i = iStart; i < b; i++) {
		nuAddBreadcrumb(i);
	}

}


function nuAddBreadcrumb(i) {

	const isLast = (i + 1 == window.nuFORM.breadcrumbs.length);					//-- last breadcrumb
	const bc = window.nuFORM.breadcrumbs[i];
	const id = 'nuBreadcrumb' + i;
	var div = document.createElement('div');
	const h = '<div id="nuarrow' + i + '" class="nuBreadcrumbArrow">&nbsp;<i class="fa fa-caret-right"></i>&nbsp;</div>';

	div.setAttribute('id', id);

	$('#nuBreadcrumbHolder').append(div);
	var $id = $('#' + id);

	$id.css('font-size', 14)
		.attr('onclick', 'nuGetBreadcrumb(' + i + ')')
		.html(h + nuTranslate(bc.title));

	if (isLast) {
		$id.addClass('nuNotBreadcrumb');
	} else {
		$id.addClass('nuBreadcrumb');
	}

	if (i == 0) {
		$('#nuarrow0').remove();
	}

}


function nuMainForm() {

	if (opener) {

		try {
			return nuDocumentID == opener.nuDocumentID;
		} catch (error) {
			return false;
		}
	}

	return nuDocumentID == parent.nuDocumentID;

}

function nuSetBrowseTitle(t) {
	nuSetTitle(t, true);
}

function nuSetTitle(t, browse) {

	if (nuFormType() == 'browse' && !browse == true) {
		return;
	}

	nuFORM.setProperty('title', t);

	let b = $('.nuBreadcrumb').length;
	if (b === 0 && !nuIsIframe()) {
		$('#nuHomeGap').append(t);
	} else {
		let h = '<div id="nuarrow' + (b - 1) + '" class="nuBreadcrumbArrow">&nbsp;<i class="fa fa-caret-right"></i>&nbsp;</div>';

		if (nuFORM.breadcrumbs.length == 1) {
			h = '';
		}

		$('#nuBreadcrumb' + b).html(h + t);
	}

}

function nuAddEditTabs(p, w) {

	if (nuFormType() == 'edit') {
		nuSetStartingTab(p, w);
	}

	for (let i = 0; i < w.tabs.length; i++) {
		nuEditTab(p, w.tabs[i], i);
	}

	var l = 7;

	for (let i = 0; i < w.browse_columns.length; i++) {
		l = nuBrowseTitle(w.browse_columns, i, l, w.browse_title_multiline);

		if (w.browse_columns[i].width != '0') {
			p = i;
		}

	}

	const f = nuFORM.getProperty('nosearch_columns');

	for (let i = 0; i < f.length; i++) {
		$('#nusort_' + f[i]).addClass('nuNoSearch');
	}

	window.nuBrowseWidth = l;

	nuDetach();

	if (w.browse_columns.length > 0) {

		nuBrowseTable();
		nuOptions('nuBrowseTitle' + p, w.form_id, 'browse', w.global_access);

	}

}

function nuSetStartingTab(p, w) {

	var t = window.nuFORM.getProperty('tab_start');

	if (w.tabs.length == 0) {
		nuFORMHELP[p] = '';
		return;
	}

	nuFORMHELP[p] = nuTABHELP[w.tabs[0].id];

	for (var i = 0; i < t.length; i++) {

		nuFORMHELP[p] = nuTABHELP[w.tabs[0].id];

		if (t[i].prefix == p) { return; }

	}

	t.push(new nuStartingTab(p));

}

function nuGetStartingTab() {

	let w = nuRecordId() == -2 ? parent.window : window;
	let t = w.nuFORM.getProperty('tab_start');

	for (let i = 0; i < t.length; i++) {

		let ts = $('#' + t[i].prefix + 'nuTab' + t[i].tabNumber);
		ts.addClass('nuTabSelected');
		ts.attr('nu-data-clicked-by-system', '');

		ts.click();

	}

}

function nuSetTab(pthis) {

	var t = window.nuFORM.getProperty('tab_start');

	for (var i = 0; i < t.length; i++) {

		if (t[i].prefix == $('#' + pthis.id).attr('data-nu-form-filter')) {

			let ts = $('#' + t[i].prefix + 'nuTab' + t[i].tabNumber);

			ts.addClass('nuTabSelected');
			ts.attr('nu-data-clicked-by-system');

			ts.click();

		}

	}

}

function nuStartingTab(p) {

	this.prefix = p;
	this.tabNumber = 0;

}

function nuEditTab(p, t, i) {

	var tabId = p + 'nuTab' + i;
	var div = document.createElement('div');
	div.setAttribute('id', tabId);

	$('#' + p + 'nuTabHolder').append(div);
	$('#' + tabId)
		.html(nuTranslate(t.title))
		.addClass('nuTab')
		.addClass('nuDragNoSelect')
		.attr('data-nu-tab-filter', i)
		.attr('data-nu-form-filter', p)
		.attr('data-nu-tab-id', t.id)
		.attr('onclick', 'nuSelectTab(this, true)');

	if (t.access !== undefined) {
		if (t.access == '2') nuHide('nuTab' + i);
		if (t.access == '3') {
			if (!nuGlobalAccess()) {
				nuHide('nuTab' + i);
			} else {
				$('#' + 'nuTab' + i).addClass('nuTabAccessHiddenUser');
			}
		}

	}

	window.nuTABHELP[t.id] = t.help;

}

function nuOptions(p, f, t, access) {

	var R = nuRecordId();

	if (R != '-2') {

		var id = p + 'nuOptions';
		var img = document.createElement('l');

		img.setAttribute('id', id);

		if (t == 'subform') {
			if (nuAllowChanges(f)) {

				$('#' + p).prepend(img);

				$('#' + id)
					.attr('title', nuTranslate('Options'))
					.attr('onclick', 'nuGetOptionsList("' + f + '", this, "' + p + '", "' + access + '", "' + t + '")')
					.addClass('nuIcon nuOptionsSubform')
					.hover(function () {
						$(this).css('color', 'red');
					}, function () {
						$(this).css('color', '');
					});

			}

		} else {

			$('#nuBreadcrumbHolder').prepend('<div id="nuHomeGap" class="nuHomeGap"></div>').prepend(img);

			$('#' + id)
				.attr('title', 'Options')
				.attr('onclick', 'nuGetOptionsList("' + f + '", this, "' + p + '", "' + access + '", "' + t + '")')
				.addClass('nuIcon nuOptions')
				.hover(function () {
					$(this).css('color', 'red');
				}, function () {
					$(this).css('color', '');
				});

		}

	}

}

function nuAllowChanges(f) {
	return nuSERVERRESPONSE.form_access == 0 || String(f).substr(0, 2) != 'nu' || f == 'nuuserhome';
}

function nuHideOptionsItemShortcutKeys() {
	$('.nuOptionsItemShortcutKey').css('visibility','hidden');
}





function nuGetOptionsList(f, t, p, a, type) {

	// f: form ID
	// a == 1: global_access

	const id = 'nuOptionsListBox';
	if ($('#' + id).length !== 0) {
		$('#nuOptionsListBox').remove();
		return;
	}

	let list = [];

	const buttons = nuSERVERRESPONSE.buttons;
	const objects = nuSERVERRESPONSE.objects;
	const canChange = nuAllowChanges(f);
	const admin = a == 1;
	const hasHelp = nuFORMHELP[p] != '' && nuFORMHELP[p] !== undefined && type != 'subform';
	const formType = nuFormType()[0];
	const typeEdit = formType == 'e';
	const typeBrowse = formType == 'b';
	const typeSf = type == 'subform';
	const typeLaunch = nuFORM.getCurrent().form_type != 'launch';
	const labelId = '#label_' + $('#' + p + 'scrollDiv').parent().attr('id');

	const items = {
		Divider : ['', '', '', ''],
		AddObject : ['Add Object', 'nuPopup("nuobject","-1","")', 'fa fa-plus', 'H'],
		ArrangeObjects : ['Arrange Objects', 'nuPopup("' + f + '", "-2")', 'fas fa-arrows-alt', 'A'],
		FormProperties : ['Form Properties', 'nuOptionsListAction("nuform", "' + f + '")', 'fa-cog', 'F'],
		SearchableColumns : ['Searchable Columns', 'nuGetSearchList()', 'fa-columns', 'C'],
		SubformObject : [nuTranslate('Subform Object'), '$("' + labelId + '").dblclick()', 'fa-cog', ''],
		FormObjectList : ['Form Object List', 'nuOptionsListAction("nuobject", "", "' + f + '")', 'fa-th-list', 'O'],
		Search : ['Search', 'nuSearchAction();', 'fas fa-search', 'S'],
		Add : ['Add', 'nuAddAction();', 'fas fa-plus', 'A'],
		Print : ['Print', 'nuPrintAction();', 'fas fa-table', 'P'],
		Save : ['Save', 'nuSaveAction();', 'far fa-save', 'Ss'],
		Delete : ['Delete', 'nuDeleteAction();', 'far fa-trash-alt', 'Y'],
		Clone : ['Clone', 'nuCloneAction();', 'far fa-clone', 'C'],
		Refresh : ['Refresh', 'if (nuGlobalAccess()) {nuRunPHPHidden("NUSETREFRESHCACHE", 0);} else {nuGetBreadcrumb();}', 'fas fa-sync-alt', 'R'],
		Help : ['Help', nuFORMHELP[p], 'fa-question-circle', '?'],
		ChangePassword : ['Change Password', 'nuPopup("nupassword", "", "")', 'fa-password', 'L'],
		DebugResults : ['nuDebug Results', 'nuOptionsListAction("nudebug", "")', 'fa-bug', 'D'],
		Database : ['Database', 'nuStartDatabaseAdmin();', 'fa-database', 'E'],
		Backup : ['Backup', 'nuRunBackup();', 'far fa-hdd', 'B'],
		Setup : ['Setup', 'nuForm("nusetup","1","", "", 2)', 'fa-cogs', 'U'],
		FormInfo : ['Form Info', 'nuShowFormInfo();', 'fa-info', 'M']
	};

	if (typeEdit && admin && canChange) {
		if (objects.length > 0) {
			list.push(items.ArrangeObjects);
		}
		if (!typeSf) {
			list.push(items.AddObject);
			list.push(items.Divider);
		}
	}

	if (typeBrowse)  list.push(items.SearchableColumns);
	if (admin && canChange) list.push(items.FormProperties);

	if (typeSf && canChange) {
		list.push(items.SubformObject);
	}

	if (admin && canChange) list.push(items.FormObjectList);

	if (!typeSf && admin) list.push(items.Divider);

	if (typeBrowse) {
		list.push(items.Search);
		if (buttons.Add == '1') { list.push(items.Add); }
		if (buttons.Print == '1') { list.push(items.Print); }
	}

	if (typeLaunch && typeEdit && type != 'subform') {

		const data_mode = nuFORM.getCurrent().data_mode;
		if (buttons.Save == '1' && data_mode !== 0) { list.push(items.Save); }
		if (buttons.Delete == '1' && !nuIsNewRecord()) { list.push(items.Delete); }
		if (buttons.Clone == '1' && !nuIsNewRecord()) { list.push(items.Clone); }

	}

	if (hasHelp) {
		list.push(items.Help);
	}

	if (!typeSf) {
		list.push(items.Refresh);
		if (admin) list.push(items.Divider);
	}

	if (!admin) {
		list.push(items.Divider);
		list.push(items.ChangePassword);
	}

	if (admin && !typeSf) {
		list.push(items.DebugResults);
		list.push(items.Divider);
		list.push(items.Database);
		list.push(items.Backup);
		list.push(items.Setup);
		list.push(items.FormInfo);
	}

	if (list.length == 0) { return; }

	let div = document.createElement('div');
	div.setAttribute('id', id);
	$('body').append(div);

	$('#' + id)
		.css({
			'top': 0,
			'height': 20 + (list.length * 20),
			'width': 30,
			'position': 'absolute',
			'z-index': 99,
			'text-align': 'left'
		})
		.html('<span class="nuOptionsListTitle">&nbsp;&nbsp;' + nuTranslate('Options') + '<\span>')
		.addClass('nuOptionsList');

	nuBuildOptionsList(list, p, type);

	if (nuIsMobile()) nuHideOptionsItemShortcutKeys();
	$('[data-nu-option-title]').css('padding', 3);
	nuDragElement($('#nuOptionsListBox')[0], 30);

}

function nuBuildOptionsList(l, p, type) {												//-- loop through adding options to menu

	var iprop = { 'position': 'absolute', 'text-align': 'left', 'width': 15, 'height': 15 };
	var width = 0;

	for (let i = 0; i < l.length; i++) {
		if (l[i][0] != '') l[i][0] = nuTranslate(l[i][0]); 		// Text
		l[i][3] = nuCtrlCmdShiftName(l[i][3]); 					// Shortcut
	}

	for (let i = 0; i < l.length; i++) {
		width = Math.max((nuGetWordWidth(l[i][0]) + nuGetWordWidth(l[i][3])), width);
	}

	for (let i = 0; i < l.length; i++) {

		var t = l[i][0];	// Text
		var f = l[i][1]; 	// onclick
		var c = l[i][2]; 	// Icon
		var k = l[i][3]; 	// Shortcut
		var itemtop = 30 + (i * 20);

		// Add Icon

		var icon = document.createElement('i');
		var icon_id = 'nuOptionList' + i.toString();

		icon.setAttribute('id', icon_id);

		$('#nuOptionsListBox').append(icon);

		$('#' + icon.id)
			.css(iprop)
			.css({ 'top': itemtop, 'left': 9 })
			.addClass('fa')
			.addClass(c)
			.addClass('nuOptionList');

		// Add Option Text

		const isDivider = t == '' ? true : false;

		var desc = document.createElement(isDivider ? 'hr' : 'div');
		var desc_id = 'nuOptionText' + i.toString();

		desc.setAttribute('id', desc_id);

		$('#nuOptionsListBox').append(desc);
		var style = { 'position': 'absolute', 'text-align': 'left', 'height': (isDivider ? 0 : 15) };

		if (isDivider) {

			$('#' + desc.id)
				.css(style)
				.css({ 'top': itemtop - 4, 'left': 30 })
				.html(t)
				.attr('onclick', f)
				.addClass('nuOptionsItem-divider');

		} else {

			$('#' + desc.id)
				.css(style)
				.css({ 'top': itemtop - 4, 'left': 30 })
				.html(t)
				.attr('onclick', f)
				.attr('data-nu-option-title', t)
				.addClass('nuOptionsItem');
		}

		// Add ahortcut
		if (k !== '') {
			var shortcut_key = document.createElement('div');
			var shortcut_key_id = 'nuOptionTextShortcutKey' + i.toString();

			shortcut_key.setAttribute('id', shortcut_key_id);

			if (type !== 'subform') {
				$('#nuOptionsListBox').append(shortcut_key);
			}

			style = { 'position': 'absolute', 'text-align': 'left', 'height': 15, 'width': 50 };

			$('#' + shortcut_key.id)
				.css(style)
				.css({ 'top': itemtop - 2, 'right': 10 })
				.html(k)
				.attr('onclick', f)
				.addClass('nuOptionsItemShortcutKey');
		}

	}

	var off = $('#' + p + 'nuOptions').offset();
	var top = off.top;
	var left = off.left;
	var reduce = 0;

	if (type == 'browse') {
		left = 12;
	}

	if (type == 'form') {
		top = off.top - 6;
		left = 10;
	}

	if (type == 'subform') {
		top = off.top - 70;
		left = off.left;
		reduce = 55;
	}

	$('#nuOptionsListBox').css({
		'height': 40 + (l.length * 20),
		'width': 50 + width - reduce,
		'left': left,
		'top': top + 70
	});

	$('.nuOptionsItem').css({ 'width': width - 57, 'padding': '0px 0px 0px 3px' });
	$('.nuOptionsItem-divider').css({ 'width': 35 + width - reduce - 7, 'left': 0 });

}

function nuSelectAllTabs(pthis) {

	var t = pthis.value;

	window.nuRESPONSIVE.setTabsColumn(t);

	if (t != '') {
		nuSelectTab($('#' + t)[0]);
	}

}

function nuSelectTab(tab, byUser) {

	if (window.nuOnSelectTab) {
		if (nuOnSelectTab(tab) == false) return;
	}

	if (byUser === undefined) byUser = false;

	let $tabId = $('#' + tab.id);

	byUser = byUser === true && ! $tabId.is('[nu-data-clicked-by-system]') ? true : false;

	if (byUser) nuSaveScrollPositions();

	$tabId.removeAttr('nu-data-clicked-by-system');

	$('.nuTabTitleColumn').remove();

	const filt = $tabId.attr('data-nu-tab-filter');
	const form = $tabId.attr('data-nu-form-filter');
	const tabId = $tabId.attr('data-nu-tab-id');

	window.nuFORMHELP[form] = window.nuTABHELP[tabId];

	let t = nuFORM.getProperty('tab_start');

	for (let i = 0; i < t.length; i++) {

		if (t[i].prefix == form) {
			t[i].tabNumber = filt;
		}

	}

	// Treating nuIframes and nuHtml differently as anything that needs to calculate size can't be display: none when the page loads
	$("[data-nu-form='" + form + "']:not('.nuIframe, .nuHtml')").hide();
	$(".nuIframe[data-nu-form='" + form + "']").css('visibility', 'hidden');
	$(".nuHtml[data-nu-form='" + form + "']").css('visibility', 'hidden');
	$("[data-nu-form-filter='" + form + "']").removeClass('nuTabSelected');

	$("[data-nu-form='" + form + "'][data-nu-tab='" + filt + "']:not([data-nu-lookup-id]):not('.nuIframe, .nuHtml')").show();
	$(".nuIframe[data-nu-form='" + form + "'][data-nu-tab='" + filt + "']").css('visibility', 'visible');
	$(".nuHtml[data-nu-form='" + form + "'][data-nu-tab='" + filt + "']").css('visibility', 'visible');
	$('#' + tab.id).addClass('nuTabSelected');

	if (byUser) nuRestoreScrollPositions();

	if (byUser === true) {

		let s = $('.nuTabSelected');
		let obj = null;
		let ae = document.activeElement;

		if (s.is("[nu-data-active-element]")) {
			let id = s.attr('nu-data-active-element');
			if (id !== '' && ae.id !== id) $('#' + id).nuFocusWithoutScrolling();
		} else {
			obj = nuGetFirstObject(nuSERVERRESPONSE.objects, tab.id.replace('nuTab', ''));
			if (obj !== null && ae.id !== obj.attr('id')) {
				obj.nuFocusWithoutScrolling();
				try {
					if ((obj.is('textarea') || obj.is('input')) && !obj.is(':checkbox')) {
						obj.prop({ 'selectionStart': 0, 'selectionEnd': 0 });
					}
				} catch (e) {
					console.log('Failed to set selectionStart', obj);
				}
			}
		}


	}

	if (window.nuOnTabSelected) {
		nuOnTabSelected(tab);
	}

}

function nuSelectTabByTitle(s) {

	var tabs = JSON.parse(JSON.stringify(nuSERVERRESPONSE)).tabs;
	var l = tabs.findIndex(data => data.title.replace(/\|/g, "") === s);
	if (l > -1) nuSelectTab($('#' + 'nuTab' + l)[0]);

}

function nuRemoveTabs(t) {

	for (var i = 0; i < arguments.length; i++) {
		$('#nuTab' + arguments[i]).remove();
	}

}

function nuHideTabByTitle(s) {
	nuShowTabByTitle(s, false);
}

function nuShowTabByTitle(s, visible) {

	let tabs = JSON.parse(JSON.stringify(nuSERVERRESPONSE)).tabs;
	let l = tabs.findIndex(data => data.title.replace(/\|/g, "") === s);
	if (l > -1) nuShow('nuTab' + l, visible);

}

function nuShowTabById(id, visible) {

	let obj = $('div#' + id);
	if (obj.length == 1) {
		obj.nuShow(visible);
	} else {
		$('div[data-nu-tab-id=' + id + ']').filter('.nuTab').nuShow(visible);
	}

}

function nuHideTabById(id) {
	nuShowTabById(id, false);
}

function nuHideTabs() {

	for (var i = 0; i < arguments.length; i++) {
		if (arguments[i] === parseInt(arguments[i], 10)) {
			$('#nuTab' + arguments[i]).hide();
		} else {
			nuHideTabByTitle(arguments[i]);
		}
	}

}

function nuAddDataTab(i, t, p) {

	var P = String(p);
	var f = P.substr(0, P.length - 3);
	$('#' + i).attr('data-nu-tab', t).attr('data-nu-form', f);

}

function nuBrowseTitle(b, i, l, m) {

	var bc = window.nuFORM.getCurrent();
	var un = bc.nosearch_columns.indexOf(i);
	var id = 'nuBrowseTitle' + i;
	var w = Number(b[i].width);
	var a = b[i].align;
	var div = document.createElement('div');
	var ar = { l: 'left', c: 'center', r: 'right' };

	div.setAttribute('id', id);

	var sp = '<span id="nusort_' + i + '" class="nuSort" onclick="nuSortBrowse(' + i + ')" ontouchstart="nuSortBrowse(' + i + ')"> ' + nuTranslate(b[i].title) + ' </span>';

	if (bc.sort == i) {

		if (a == 'l') {

			if (bc.sort_direction == 'asc') {
				sp = '<span id="nusort_' + i + '" class="nuSort" onclick="nuSortBrowse(' + i + ')"> ' + nuTranslate(b[i].title) + ' <i id="nuSortIcon" class="fa fa-caret-up"></i></span>';
			} else {
				sp = '<span id="nusort_' + i + '" class="nuSort" onclick="nuSortBrowse(' + i + ')"> ' + nuTranslate(b[i].title) + ' <i id="nuSortIcon" class="fa fa-caret-down"></i></span>';
			}

		} else {

			if (bc.sort_direction == 'asc') {
				sp = '<span id="nusort_' + i + '" class="nuSort" onclick="nuSortBrowse(' + i + ')"><i id="nuSortIcon" class="fa fa-caret-up"></i> ' + nuTranslate(b[i].title) + ' </span>';
			} else {
				sp = '<span id="nusort_' + i + '" class="nuSort" onclick="nuSortBrowse(' + i + ')"><i id="nuSortIcon" class="fa fa-caret-down"></i> ' + nuTranslate(b[i].title) + ' </span>';
			}

		}

	}

	$('#nuRECORD').append(div);

	var titleClass = m == '1' ? 'nuBrowseTitleMultiline nuBrowseTitle' : 'nuBrowseTitle';

	var obj = $('#' + id);

	obj
		.html(sp)
		.addClass(titleClass)
		.css({
			'text-align': ar[a],
			'overflow': 'visible',
			'width': w,
			'left': l
		});

	obj.attr('data-nu-title-id', b[i].id);

	if (w == 0) {
		obj.hide();
	}

	// $('#nusort_' + i)[0].addEventListener('touchstart', function(event) { nuSortBrowse(i);}, { passive: true });

	$('#nusearch_' + i).attr('checked', un == -1);

	return l + nuTotalWidth(id);

}

function nuTitleDrag(i) {

	const bc = window.nuFORM.getCurrent();
	const h = bc.row_height;
	const div = document.createElement('div');

	div.setAttribute('id', 'nuTitleDrag' + i);

	$('#' + 'nuBrowseTitle' + i).append(div);

	$('#' + div.id)
		.addClass('nuDragLineV')
		.css('height', h)
		.attr('onmousedown', 'nuDragBrowseDown(event)')
		.attr('onmousemove', 'nuDragBrowseMove(event)')
		.attr('onmouseup', 'nuDragBrowseUp(event)');

}

function nuDragBrowseDown(e) {

	const t = parseInt($('#nuBrowseTitle0').css('top'), 10);
	const f = parseInt($('#nuBrowseFooter').css('top'), 10);

	window.nuDRAGLINEVSTART = e.pageX;
	window.nuDRAGLINEVID = e.target.id;

	$('#' + e.target.id).css('height', f - t);

}

function nuDragBrowseMove(e) {

	if (window.nuDRAGLINEVID == '' || e.buttons != 1) { return; }

	$('#' + nuDRAGLINEVID).css('left', e.x);

}

function nuDragBrowseUp(e) {

	let h = parseInt($('#nuBrowseTitle0').css('height'), 10);

	$('#' + e.target.id).css('height', h);
	window.nuDRAGLINEVID = '';

}

function nuBrowseColumnSize(e) {

	$('#' + e.target.id).css('height', 400);

}

function nuBrowseTable() {

	var bc = window.nuFORM.getCurrent();
	var col = bc.browse_columns;
	var row = bc.browse_rows;
	var rows = bc.rows;
	var h = bc.row_height;
	var t = parseInt($('#nuBrowseTitle0').css('height'), 10) - h - 2;
	var l = 7;

	for (let r = 0; r < rows; r++) {

		l = 7;
		t = t + h + 7;

		for (let c = 0; c < col.length; c++) {

			var w = Number(col[c].width);
			var a = nuAlign(col[c].align);
			var rw = r;
			var column = c;
			var id = 'nucell_' + rw + '_' + c;
			var div = document.createElement('div');
			div.setAttribute('id', id);

			$('#nuRECORD').append(div);

			var $id = $('#' + id);

			$id.attr('data-nu-row', rw)
				.attr('data-nu-column', column)
				.addClass('nuCell' + ((r / 2) == parseInt(r / 2, 10) ? 'Even' : 'Odd'))
				.addClass(w == 0 ? '' : 'nuBrowseTable')
				.css({
					'text-align': a,
					'overflow': 'hidden',
					'width': w,
					'top': t,
					'left': l,
					'height': h,
					'position': 'absolute'
				});

			if (w == 0) {
				$id.hide();
			}

			if (w < 0) {

				$id
					.css('padding', 0)
					.css('border-width', 0);

			}

			if (r < row.length) {

				$id
					.html(nuFORM.addFormatting(row[r][c + 1], col[c].format))
					.attr('data-nu-primary-key', row[r][0])
					.attr('onclick', 'nuSelectBrowse(event, this)')
					.hover(

						function () {

							if (window.nuBROWSERESIZE.moving_element == '') {
								if (this.offsetWidth < this.scrollWidth && !$(this).is('[title]')) {
									$(this).attr('title', $(this).html().replace(/(<([^>]+)>)/ig, ''));		// Remove HTML tags
								}

								$("[data-nu-row]").addClass('nuBrowseTable').removeClass('nuSelectBrowse');

								window.nuBROWSEROW = -1;

								const dataRow = $(this).attr('data-nu-row');
								$("[data-nu-row='" + dataRow + "']").not('.nuCellColored').addClass('nuSelectBrowse').removeClass('nuBrowseTable');
							}

						}, function () {

							if (window.nuBROWSERESIZE.moving_element == '') {
								$("[data-nu-row]").addClass('nuBrowseTable').removeClass('nuSelectBrowse');

								window.nuBROWSEROW = -1;

								const dataRow = $(this).attr('data-nu-row');
								$("[data-nu-row='" + dataRow + "']").addClass('nuBrowseTable').removeClass('nuSelectBrowse');
							}

						}
					);

			}

			l = l + (w == 0 ? 0 : nuTotalWidth(id));

		}

	}

	const last = '<span id="nuLast" onclick="nuGetPage(' + (bc.page_number) + ')" class="nuBrowsePage">&#9668;</span>';
	const next = '<span id="nuNext" onclick="nuGetPage(' + (bc.page_number + 2) + ')" class="nuBrowsePage">&#9658;</span>';

	const pg = '&nbsp;Page&nbsp;';
	const cu = '<input id="browsePage" style="text-align:center;margin:3px 0px 0px 0px;width:40px" onchange="nuGetPage(this.value)" value="' + (bc.page_number + 1) + '" class="browsePage"/>';
	const pagesOf = '&nbsp;/&nbsp;' + (bc.pages == 0 ? 1 : bc.pages) + '&nbsp;';

	var footerTop = t + h + 10;
	var divFooter = document.createElement('div');
	divFooter.setAttribute('id', 'nuBrowseFooter');

	$('#nuRECORD').append(divFooter);

	$(divFooter)
		.addClass('nuBrowseFooter')
		.html(last + pg + cu + pagesOf + next)
		.css({
			'text-align': 'center',
			'width': l - 7,
			'top': footerTop,
			'left': 7,
			'height': 25,
			'position': 'absolute',
			'padding': '5px 0px',
		});

	nuHighlightSearch();
	nuBrowseBorders();

	h = footerTop + 130;
	const pDoc = window.parent.document;

	$('#nuDragDialog', pDoc).css({ 'height': h + 30, 'visibility': 'visible', 'overflow': 'hidden' });
	$('#nuWindow', pDoc).css({ 'height': h - 14 });

	$('body').css('height', h - 30);
	$('#nuRECORD').css('height', 0).css('width', 0);

}

function nuAlign(a) {

	if (a == 'l') { return 'left'; }
	if (a == 'r') { return 'right'; }
	if (a == 'c') { return 'center'; }

}

function nuClickSearchColumn(e) {

	var c = e.target.id.substr(12);
	$('#nuSearchList' + c).click();
	nuSetSearchColumn();

}

function nuSetSearchColumn() {

	var nosearch = [];

	$('.nuSearchCheckbox').each(function (index) {

		if (!$(this).is(':checked')) {

			nosearch.push(index);

			$('#nusort_' + index)
				.addClass('nuNoSearch');

		} else {

			$('#nusort_' + index)
				.removeClass('nuNoSearch');
		}

	});

	window.nuFORM.setProperty('nosearch_columns', nosearch);

}

function nuSetNoSearchColumns(a) {

	const s = nuFORM.getCurrent().nosearch_columns;
	a = s.concat(a);

	for (let i = 0; i < a.length; i++) {
		$('#nusort_' + a[i]).addClass('nuNoSearch');
	}

	nuFORM.setProperty('nosearch_columns', a);

}

function nuSearchPressed(e) {

	if (!e) { e = window.event; }

	if (e.keyCode == 13 && window.nuBROWSEROW == -1) {					//-- enter key

		e.preventDefault();
		$('#nuSearchButton').click();

	} else if (e.keyCode == 13 && window.nuBROWSEROW != -1) {				//-- enter key

		e.preventDefault();
		const i = '#nucell_' + window.nuBROWSEROW + '_0';

		nuSelectBrowse('', $(i)[0]);

	} else {

		window.nuBROWSEROW = -1;
		$("[data-nu-row]").addClass('nuBrowseTable');
		$("[data-nu-row]").removeClass('nuSelectBrowse');

	}

}

function nuArrowPressed(e) {

	if (!e) { e = window.event; }

	const rows = $("[data-nu-column='0'][data-nu-primary-key]").length - 1;

	if (e.keyCode == 38) {					//-- up

		if (window.nuBROWSEROW == -1) {
			window.nuBROWSEROW = rows;
		} else {
			window.nuBROWSEROW = window.nuBROWSEROW - 1;
		}

		$("[data-nu-row]").addClass('nuBrowseTable').removeClass('nuSelectBrowse');
		$("[data-nu-row='" + window.nuBROWSEROW + "']").addClass('nuSelectBrowse').removeClass('nuBrowseTable');

	}

	if (e.keyCode == 40) {					//-- down

		if (window.nuBROWSEROW == rows) {
			window.nuBROWSEROW = -1;
		} else {
			window.nuBROWSEROW = window.nuBROWSEROW + 1;
		}

		$("[data-nu-row]").addClass('nuBrowseTable').removeClass('nuSelectBrowse');
		$("[data-nu-row='" + window.nuBROWSEROW + "']").addClass('nuSelectBrowse').removeClass('nuBrowseTable');

	}

}

function nuSearchAction(S, F) {

	if (arguments.length > 0) {
		$('#nuSearchField').val(S);
	}
	if (arguments.length == 2) {
		$('#nuFilter').val(F);
	}

	var s = String($('#nuSearchField').val()).nuReplaceAll("'", "&#39;", true);
	var f = String($('#nuFilter').val()).nuReplaceAll("'", "&#39;", true);
	const caller = arguments.callee.caller === null ? '' : arguments.callee.caller.name;

	if (window.nuOnSearchAction) {
		let o = { search: s, filter: f };
		if (nuOnSearchAction(o) === false) { return; }
		s = o.search;
		f = o.filter;
	}

	window.nuFORM.setProperty('search', s);
	window.nuFORM.setProperty('filter', f);

	if ((arguments.length === 0 && caller != 'nuGetPage') || arguments.length >= 1) {
		window.nuFORM.setProperty('page_number', 0);
	}

	nuDisable('nuSearchField');
	nuGetBreadcrumb();

}

function nuAddAction() {

	var bc = window.nuFORM.getCurrent();
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

function nuSortBrowse(c) {

	var l = window.nuFORM.getCurrent();
	l.filter = $('#nuFilter').val();
	l.page_number = 0;

	if (c == l.sort) {
		l.sort_direction = l.sort_direction == 'asc' ? 'desc' : 'asc';
	} else {

		l.sort = c;
		l.sort_direction = 'asc';

	}

	nuSearchAction();

}

function nuGetPage(p) {

	var P = parseInt('00' + p, 10);
	var B = window.nuFORM.getCurrent();

	if (P == 0) {
		P = 1;
	}

	if (P > B.pages) {
		P = B.pages;
	}

	B.page_number = P - 1;

	nuSearchAction();

}

function nuPopulateLookup(fm, target, setFocus) {

	var p = String($('#' + target).attr('data-nu-prefix'));
	var f = fm.lookup_values;

	window.nuSubformRow = Number(p.slice(-3));

	for (var i = 0; i < f.length; i++) {

		var id = String(f[i][0]);
		var $id = $('#' + id);

		if (id.substring(0, p.length) != p) {
			$id = $('#' + p + id);
		}

		$id.addClass('nuEdited');

		if ($id.attr('type') == 'checkbox') {

			$id.prop('checked', f[i][1] == '1');

		} else {

			$id.val(f[i][1]);

			if ($id.attr('data-nu-format') !== undefined) {

				nuReformat($id[0]);
				$id.addClass('nuEdited');
				$('#' + p + 'nuDelete').prop('checked', false);

			}

		}

		if (i == 1 && setFocus !== false) {
			$id.focus();
		}

	}

	window.nuLOOKUPSTATE[$('#' + target).attr('data-nu-object-id')] = 'found';

	nuCalculateForm();

	eval(fm.lookup_javascript);

	$('#dialogClose').click();

}

function nuChooseOneLookupRecord(e, fm) {

	var o = new nuLookupObject(e.target.id);
	var i = o.id_id;
	var t = document.getElementById(e.target.id);
	var like = nuEncode(fm.lookup_like);

	if (fm.lookup_values.length == 0) {
		nuGetLookupId('', i);
	}

	if (fm.lookup_values.length == 1) {

		if (e.target.value.toUpperCase() == fm.lookup_values[0][1].toUpperCase()) {
			nuGetLookupId(fm.lookup_values[0][0], i);
		} else {
			nuBuildLookup(t, e.target.value);
		}

	}

	if (fm.lookup_values.length > 1) {
		nuBuildLookup(t, e.target.value, like);
	}

}

function nuLookupObject(id, set, value) {

	if ($('#' + id).length == 0) {

		this.id_id = '';
		this.code_id = '';
		this.description_id = '';
		this.id_value = '';
		this.code_value = '';
		this.description_value = '';

		return;

	}

	var i = nuValidLookupId(id, 'code');
	i = nuValidLookupId(i, 'description');
	this.id_id = i;
	this.code_id = i + 'code';
	this.description_id = i + 'description';
	this.id_value = $('#' + this.id_id).val();
	this.code_value = $('#' + this.code_id).val();
	this.description_value = $('#' + this.description_id).val();

	if (arguments.length == 3 && set == 'id') {
		$('#' + this.id).val(value);
	}
	if (arguments.length == 3 && set == 'code') {
		$('#' + this.code).val(value);
	}
	if (arguments.length == 3 && set == 'description') {
		$('#' + this.description).val(value);
	}

}

function nuValidLookupId(id, fld) {

	var i = String(id);
	var f = String(fld);
	var il = i.length;
	var fl = f.length;

	if (i.substr(il - fl) === f) {

		i = i.substr(0, il - fl);

		if ($('#' + i + f).length == 1 && $('#' + i + f + f).length == 1) {

			i = i + f;

		}

	}

	return i;

}

function nuHighlightSearch() {

	var bc = window.nuFORM.getCurrent();

	if (bc.search === undefined) return;
	if (bc.search.length == 0) return;

	var exclude = bc.nosearch_columns;

	var search = String(bc.search)
		.split(' ')
		.filter(function (a) { return (a != '' && a.substr(0, 1) != '-') })
		.sort(function (a, b) { return (a.length > b.length) });

	$('.nuBrowseTable').each(function (index) {

		var col = Number(String($(this).attr('data-nu-column')));

		if (exclude.indexOf(col) == -1) {

			for (var i = 0; i < search.length; i++) {

				$(this).nuHighlight(search[i]);

			}

		}

	});

}

function nuChange(e) {

	if (e.target.id.substr(-8) == 'nuDelete') {

		var sfid = $(e.target).parent().parent().parent()[0].id;
		var click = $('#' + sfid).attr('data-nu-clickdelete');

		eval(click);

		nuHasBeenEdited();
		nuCalculateForm();

		return;

	}

	nuSetSaved(false);

	var t = $('#' + e.target.id)[0];
	var p = $('#' + t.id).attr('data-nu-prefix');

	nuReformat(t);

	$('#' + p + 'nuDelete').prop('checked', false);
	$('#' + t.id).addClass('nuEdited');
	nuHasBeenEdited();

	$('#nuCalendar').remove();
	$('#' + t.id).removeClass('nuValidate');
	nuCalculateForm();

	if (p == '') { return; }

	nuAddSubformRow(t, e);

}

function nuChooseEventList() {

	if ($('#sob_all_type').val() == 'subform') {
		return ['beforeinsertrow', 'afterinsertrow', 'clickdelete'];
	}

	return ['onchange', 'oninput', 'onclick', 'onblur', 'onnuload', 'onfocus', 'onkeydown'];

}

function nuChangeFile(e) {

	if (e.target.id.substr(-8) == 'nuDelete') {

		nuHasBeenEdited();
		return;

	}

	var theFile = e.target.id;
	var theTextarea = theFile.substr(0, theFile.length - 5);

	if ($('#' + theFile).val() == '') { return; }

	var a = $('#' + theFile)[0].files[0];
	var r = new FileReader();

	r.onload = function () {

		var f = btoa(r.result);
		var o = { 'file': f, 'name': a.name, 'size': a.size, 'type': a.type };
		var j = JSON.stringify(o);

		if (window.nuOnFileLoad) {
			if (nuOnFileLoad(theFile, o) === false) { return; }
		} else {
			if (j.length > 600000) {

				nuMessage([nuTranslate('File is too large, cannot be saved. Must be under 300Kb')]);
				return;

			}
		}

		$('#' + theTextarea).val(j).addClass('nuEdited');

	};

	r.readAsDataURL(a);

	var t = $('#' + theFile)[0];
	var p = $('#' + theTextarea).attr('data-nu-prefix');

	$('#' + p + 'nuDelete').prop('checked', false);
	$('#' + theTextarea).addClass('nuEdited');

	nuHasBeenEdited();

	if (p == '') { return; }

	nuAddSubformRow(t, e);

}

function nuCalculateForm(setAsEdited) {	//-- calculate subform 'calcs' first

	var subformFirst = function (a, b) {

		var A = $('#' + a.id).hasClass('nuSubformObject') ? 0 : 1000;
		var B = $('#' + b.id).hasClass('nuSubformObject') ? 0 : 1000;
		a = parseInt($('#' + a.id).attr('data-nu-calc-order'), 10);
		b = parseInt($('#' + b.id).attr('data-nu-calc-order'), 10);

		if (setAsEdited === undefined) {
			$('#' + a.id).addClass('nuEdited');
		}

		return (a + A) - (b + B);

	}

	var f = $("[data-nu-formula]");

	f.sort(subformFirst);

	f.each(function (index) {		//-- start with calculations inside a subform

		$(this).addClass('nuEdited');

		var formula = $(this).attr('data-nu-formula');
		var fmt = $(this).attr('data-nu-format');
		var v = 0;

		if (formula != '') {
			eval('var v = ' + formula);
		}

		var fixed = nuFORM.addFormatting(v, fmt);

		$(this).val(fixed);

		if (window.nuCalculated) {
			nuCalculated(this, v, fixed);
		}

	});

}

function nuHasBeenEdited() {

	$('.nuSaveButton').addClass('nuSaveButtonEdited');
	nuFORM.edited = true;
	nuSetSaved(false);

}

function nuHasNotBeenEdited() {

	$('.nuSaveButton').removeClass('nuSaveButtonEdited');
	nuFORM.edited = false;
	nuSetSaved(true);

}

function nuDeleteAction() {

	if (confirm(nuTranslate("Delete This Record?"))) {

		$('#nuDelete').prop('checked', true);
		nuUpdateData('delete');

	}

}

function nuDeleteAllAction() {

	if (confirm(nuTranslate("Delete This Record?"))) {

		$('#nuDelete').prop('checked', true);
		nuUpdateData('delete', 'all');

	}

}

function nuCloneAction() {

	nuSetProperty('CLONED_RECORD', 1);
	nuSetProperty('CLONED_RECORD_ID', nuRecordId());

	window.nuTimesSaved = 0;

	$('[data-nu-primary-key]').each(function () {

		$(this).attr('data-nu-primary-key', '-1');

	});

	$('[data-nu-field]').each(function () {

		$(this).addClass('nuEdited');

	});

	window.nuFORM.setProperty('record_id', -1);

	$('#nuCloneButton').css('visibility', 'hidden');
	$('#nuDeleteButton').css('visibility', 'hidden');

	$('.nuSaveButton')
		.css('background-color', 'red')
		.css('visibility', 'visible');

	nuCLONE = true;
	nuEmptyNoClone();

	var b = $('.nuBreadcrumb').length;
	var nb = $('.nuNotBreadcrumb').not('#nuLogout').length;

	var bc = b == 0 && nb == 0 ? $('#nuHomeGap') : $('#nuBreadcrumb' + b);
	bc.append('&nbsp;<span class="nuCloning">&nbsp;' + nuTranslate('Cloning') + '&nbsp;</span>');

	if (window.nuOnClone) {
		nuOnClone();
	}

}

function nuEmptyNoClone() {

	var c = nuSERVERRESPONSE.noclone;

	if (c === null) return;

	for (var i = 0; i < c.length; i++) {

		if (c[i].subform) {

			$('#' + c[i].id + 'scrollDiv' + ' > .nuSubform1').remove();
			$('#' + c[i].id + 'scrollDiv' + ' > .nuSubform0').each(function () {

				if ($(this)[0].id != c[i].id + '000nuRECORD') {
					$(this).remove();
				}

			});

			var k = $('#' + c[i].id + '000nuRECORD').children();

			for (var s = 0; s < k.length; s++) {

				if ($('#' + k[s].id).hasClass('nuEdited')) {

					$('#' + k[s].id).val('');

					if ($('#' + k[s].id + 'button').length == 1) {

						$('#' + k[s].id + 'code').val('');
						$('#' + k[s].id + 'description').val('');

					}

				}

			}

			$('#' + c[i].id + '000nuDelete').prop('checked', true);
			$('#' + c[i].id + '001nuRECORD').remove();

		} else {

			if ($('#' + c[i].id).length == 1) {
				$('#' + c[i].id).val('').change();
			}

		}

	}

}

function nuIsClone() {
	return nuCLONE;
}

function nuIsNewRecord() {
	return nuRecordId() == -1 && !nuCLONE;
}

function nuSaveAction(close) {

	if (nuCurrentProperties().form_type == 'launch' || nuLookingUp()) return;

	if (nuNoDuplicates()) {

		nuSaveScrollPositions();
		nuUpdateData('save', close ? 'close' : null);

	}

}

function nuSavingProgressMessage() {

	var e = document.createElement('div');

	e.setAttribute('id', 'nuProgressUpdate');

	$('#nuActionHolder').append(e);
	$('#' + e.id).html('<img src=\'core/ajax-loader.gif\'/>');
	$('#' + e.id).addClass('nuUpdateMessageProgress');
	$('#' + e.id).css('position', 'absolute');
	$('#' + e.id).css('left', (($('#nuActionHolder').width() / 2) - ($('#nuProgressUpdate').width() / 2)) + 'px');
	$('#' + e.id).show();

	$('.nuActionButton').hide();

}

function nuUpdateMessage(msg) {

	$("#nuProgressUpdate").hide();

	var e = document.createElement('div');

	e.setAttribute('id', 'nuNowUpdated');

	$('#nuActionHolder').append(e);
	$('#' + e.id).html(nuTranslate(msg));
	$('#' + e.id).addClass('nuUpdateMessage');
	$('#' + e.id).css('position', 'absolute');
	$('#' + e.id).css('left', (($('#nuActionHolder').width() / 2) - ($('#nuNowUpdated').width() / 2)) + 'px');
	$("#nuNowUpdated").fadeToggle(3000);

	$('.nuActionButton').show();

}

function nuAbortSave() {

	$("#nuProgressUpdate").hide();
	$('.nuActionButton').show();

}

function nuSetSaved(v) {

	if (window.nuOnSetSaved) {
		nuOnSetSaved(v);
	}

	window.nuSAVED = v;
}

function nuFormsUnsaved() {

	let c = 0;
	$.each($('iframe'), function () {
		let t = $(this)[0];

		try {
			if (typeof t.contentWindow.nuIsSaved === 'function') {
				if (!t.contentWindow.nuIsSaved()) {
					c++;
				}
			}
		} catch (e) {
			// catch "DOMException: Blocked a frame with origin"
		}
	})

	if (!nuIsSaved()) c++;
	return c;

}

function nuAddJavascript(js) {

	var s = document.createElement('script');
	s.innerHTML = "\n\n" + js + "\n\n";

	$('body').append(s);

}

function nuAddFormStyle(style) {

	if (style !== '') {
		style = style.replace(/((<style>)|(<style type=.+)|(<\/style>))/gi, '');
		const span = '<span id="nufromcss" style="display:none"><style>' + style + '</style></span>';
		$('#nuRECORD').append(span);
	}

}

function nuHashFromEditForm() {

	var A = {};
	var S = nuSubformObject('');
	var B = nuFORM.getCurrent();

	if (S.rows.length == 0) { return A; }

	for (var key in B) {
		A[key] = B[key];
	}

	for (var i = 0; i < S.fields.length; i++) {
		A[S.fields[i]] = S.rows[0][i];
	}

	return A;

}

function nuDetach() {

	$('.nuDragLineV').each(function () {
		$(this).appendTo('body')

	});

}

function nuSearchableList() {

	const bc = window.nuFORM.getCurrent();
	const col = bc.browse_columns;
	const no = bc.nosearch_columns;
	var div = document.createElement('div');

	div.setAttribute('id', 'nuSearchableDialog');

	$('body').append(div);

	$('#nuSearchableDialog')
		.addClass('nuSearchableDialog')
		.css('width', 150)
		.css('height', 30 + (col.length * 20))
		.css('top', 10)
		.css('left', 10);

	for (let i = 0; i < col.length; i++) {

		var input = document.createElement('input');
		const search = no.indexOf(i) == -1 ? false : true;

		input.setAttribute('id', 'nuSearchableCheckbox' + i);

		$('#nuSearchableDialog').append(input);

		$('#' + 'nuSearchableCheckbox' + i)
			.append(input)
			.addClass('nuSearchableDialog')
			.css('left', 5)
			.css('height', 25)
			.css('top', 10 + (i * 27))
			.checked = search;

		if (search) {
			$('#' + 'nuSearchableCheckbox' + i)
				.addClass('nuNoSearch');
		}

		var span = document.createElement('span');

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

function nuWidestTitle(c) {

	var w = 120;

	for (let i = 0; i < c.length; i++) {

		const t = String(c[i].title).replaceAll('<br>', ' ').replaceAll('<p>', ' ');
		w = Math.max(nuGetWordWidth(t), w);

	}

	return w + 70;

}

function nuGetSearchList() {

	var c = nuFORM.getProperty('browse_columns');
	var d = document.createElement('div');

	$('#nuOptionsListBox').remove();

	var widest = nuWidestTitle(c) + 20;

	d.setAttribute('id', 'nuSearchList');

	$('body').append(d);

	$('#' + d.id).css({
		'width': widest + 20,
		'height': 10 + (c.length * 30),
		'top': 138,
		'left': (window.innerWidth - widest) < 0 ? 0 : 50,
		'position': 'absolute',
		'text-align': 'left'
	})
		.html('<span style="font-weight:bold">&nbsp;&nbsp;' + nuTranslate('Include When Searching') + '<\span>')
		.addClass('nuOptionsList');

	for (var i = 0; i < c.length; i++) {

		var isChecked = true;

		if ($.inArray(i, nuFORM.getCurrent().nosearch_columns) != '-1') {
			isChecked = false;
		}

		var p = document.createElement('input');

		p.setAttribute('id', 'nuSearchList' + i);
		p.setAttribute('type', 'checkbox');

		$('#' + d.id).append(p);

		$('#' + p.id).css({
			'width': 20,
			'height': 25,
			'top': 30 + (i * 25),
			'left': 5,
			'position': 'absolute',
			'text-align': 'left'
		})
			.prop('checked', isChecked)
			.attr('onclick', 'nuSetSearchColumn();')
			.addClass('nuSearchCheckbox');

		var t = document.createElement('div');
		var nobr = String(c[i].title).nuReplaceAll('<br>', ' ').nuReplaceAll('<p>', ' ');;

		t.setAttribute('id', 'nuSearchText' + i);

		$('#' + d.id).append(t);

		$('#' + t.id).css({
			'height': 25,
			'top': 33 + (i * 25),
			'left': 40,
			'position': 'absolute',
			'text-align': 'left'
		})
			.attr('onclick', 'nuClickSearchColumn(event);')
			.addClass('nuOptionsItem')
			.html(nobr)
			.click(function () {

				var cb = $('#nuSearchList' + i).attr('checked');

				$('#' + 'nuSearchList' + i).attr('checked', !cb);

				nuSetSearchColumn();

			});

		if (i < 10) {

			var shortcut_key = document.createElement('div');
			var shortcut_key_id = 'nuSearchTextShortcutKey' + i.toString();

			shortcut_key.setAttribute('id', shortcut_key_id);

			$('#nuSearchList').append(shortcut_key);

			var prop = { 'position': 'absolute', 'text-align': 'left', 'height': 15, 'width': 50 };

			$('#' + shortcut_key.id)
				.css(prop)
				.css({ 'top': 37 + (i * 25), 'right': 10 })
				.html(nuCtrlCmdShiftName(i))
				.addClass('nuOptionsItemShortcutKey');

		}

	}

	$('.nuOptionsItem').css({ 'width': widest - 90, 'padding': '3px 0px 0px 3px' });
	$('#nuSearchList').css({ 'height': 50 + (c.length * 25) });

	nuDragElement($('#nuSearchList')[0], 30);

	if (nuIsMobile()) nuHideOptionsItemShortcutKeys();

}

function nuTotal(f) {
	return Number(nuFORM.calc(f));
}

function nuMessage(o, timeout, callback) {

	window.nuHideMessage = false;

	const par = window.document;

	$('#nuMessageDiv', par).remove();

	if (o.length == 0) { return; }

	if (!$.isArray(o)) {
		let tmp = o;
		o = [];
		o.push(tmp);
	}

	let widest = 5;
	for (let i = 0; i < o.length; i++) {
		widest = Math.max(widest, nuGetWordWidth(o[i]));
	}

	widest = Math.min(widest + 200, 1000);
	let w = $(this).innerWidth() - 42; 								//-- subtract padding, border
	let l = Math.max(0, $(this).scrollLeft() + (w - widest) / 2);
	w = Math.min(w, widest);

	$('body', par).append("<div id='nuMessageDiv' class='nuMessage' style='overflow:hidden;width:" + w + "px;left:" + l + "px' ></div>");

	let msgDiv = $('#nuMessageDiv', par);

	for (let i = 0; i < o.length; i++) {
		msgDiv.append(o[i]).append('<br>');
	}

	if (timeout !== undefined) {
		setTimeout(function () {
			$('#nuMessageDiv', par).fadeOut("slow");

			if (callback !== undefined) {
				callback();
			}

		}, timeout);
	}

	nuDragElement(msgDiv[0], 30);

	return msgDiv;

}

function nuWindowPosition() {

	const p = window.parent.document;

	var d = $('#nuDragDialog', p);

	const l = parseInt(d.css('left'), 10);
	const t = parseInt(d.css('top'), 10);
	var w = parseInt(d.css('width'), 10);
	var h = parseInt(d.css('height'), 10);

	window.nuDialogSize = { left: l, top: t, width: w, height: h };

	d = $('#nuWindow', p);

	w = parseInt(d.css('width'), 10);
	h = parseInt(d.css('height'), 10);

	window.nuWindowSize = { width: w, height: h };

}

function nuNoDuplicates() {

	window.nuDuplicate = true;

	$('.nuTabHolder.nuDuplicate').each(function () {

		var t = $(this).html();
		var f = $(this).attr('data-nu-field');
		var s = $(this).attr('data-nu-subform');
		var sf = nuSubformObject(s);
		var a = [];
		var c = sf.fields.indexOf(f);

		for (var i = 0; i < sf.rows.length; i++) {

			if (sf.deleted[i] == 0) {

				var rv = sf.rows[i][c];

				if (a.indexOf(rv) != -1) {

					nuMessage(['Duplicate <b>' + t + '</b> on row <b>' + i + '</b>']);
					window.nuDuplicate = false;
					return;

				}

				a.push(sf.rows[i][c]);

			}

		}

	});

	return window.nuDuplicate;

}

function nuFormType() {

	if (nuFORM.getCurrent() == undefined) { return ''; }
	return nuRecordId() == '' ? 'browse' : 'edit';

}

function nuFormId() {

	if (nuFORM.getCurrent() == undefined) { return ''; }
	return nuFORM.getCurrent().form_id;

}

function nuRecordId() {

	if (nuFORM.getCurrent() == undefined) { return ''; }
	return nuFORM.getCurrent().record_id;

}

function nuBuildFastReport() {

	var sf = nuSubformObject('fast_report_sf');
	var left = 3;
	var rows = sf.rows;
	window.nuNextID = 0;
	window.nuREPORT = JSON.parse(JSON.stringify(window.nuREPORTdefault));

	for (var i = 0; i < rows.length; i++) {

		if (sf.deleted[i] == '0') {

			var title = rows[i][1];
			var field = rows[i][2];
			var width = Number(rows[i][3]);
			var sum = rows[i][4];
			var align = sum == 0 ? 'left' : 'right';

			var o = JSON.parse(JSON.stringify(window.nuOBJECT));		//-- title
			o.left = Number(left);
			o.width = width;
			o.top = 70;
			o.fieldName = title;
			o.objectType = 'label';
			o.textAlign = align;

			nuFastObject(2, 0, o);

			o = JSON.parse(JSON.stringify(window.nuOBJECT));		//-- field
			o.left = Number(left);
			o.width = width;
			o.fieldName = field;
			o.textAlign = align;

			nuFastObject(0, 0, o);

			if (align == 'right') {

				o = JSON.parse(JSON.stringify(window.nuOBJECT));		//-- sum
				o.left = Number(left);
				o.width = width;
				o.fieldName = 'SUM(' + field + ')';
				o.textAlign = align;

				nuFastObject(1, 1, o);

			}

			left = left + width + 2;

		}

	}

	nuFastReportFormat(left);

	$('#fieldlist').val(JSON.stringify(window.nuREPORT));

	nuFORM.setProperty('nuREPORT', window.nuREPORT);

}

function nuFastObject(g, s, o) {

	o.id = 'obj' + nuPad3(window.nuNextID);
	o.name = o.id;
	o.left = Number(o.left) + 2;

	nuREPORT.groups[g].sections[s].objects.push(o);

	window.nuNextID++;

}

function nuNewFastObject() {

	var o = JSON.parse(JSON.stringify(window.nuOBJECT));
	o.id = 'obj' + nuPad3(window.nuNextID);
	o.name = o.id;

	window.nuNextID++;

	return o;

}

function nuFastReportFormat(width) {

	var o = nuNewFastObject();		//-- report title
	o.left = 2;
	o.top = 10;
	o.width = 300;
	o.height = 30;
	o.fontWeight = 'b';
	o.fontSize = '20';
	o.objectType = 'label';
	nuREPORT.width = 297;
	nuREPORT.height = 210;
	var pageWidth = 290 * 4;
	var sf = nuSubformObject('fast_report_sf');

	nuREPORT.orientation = 'L';
	nuREPORT.groups[3].sortField = sf.rows[0][2];
	nuREPORT.groups[2].sections[0].height = 100;
	nuREPORT.groups[2].sections[0].objects.push(o);

	o = nuNewFastObject();		//-- underline titles
	o.left = 2;
	o.top = 93;
	o.width = width;
	o.height = 1;
	o.borderWidth = 1;
	o.objectType = 'label';
	o.fieldName = 'KEEP EXACT HEIGHT';

	nuREPORT.groups[2].sections[0].objects.push(o);

	o = nuNewFastObject();		//-- page footer
	o.left = 2;
	o.top = 3;
	o.width = pageWidth;
	o.height = 1;
	o.borderWidth = 1;
	o.objectType = 'label';
	o.fieldName = 'KEEP EXACT HEIGHT';

	nuREPORT.groups[2].sections[1].objects.push(o);

	o = nuNewFastObject();		//-- page footer date
	o.left = 2;
	o.top = 9;
	o.width = 600;
	o.fieldName = 'Printed : #day#-#month#-20#year# #hour#:#minute#:#second#';
	o.objectType = 'label';

	nuREPORT.groups[2].sections[1].objects.push(o);

	o = nuNewFastObject();		//-- page footer page no.
	o.top = 9;
	o.left = pageWidth - 200;
	o.width = 200;
	o.textAlign = 'right';
	o.fieldName = 'Page #page# of #pages#';
	o.objectType = 'label';

	nuREPORT.groups[2].sections[1].objects.push(o);

	if (nuREPORT.groups[1].sections[1].objects.length > 0) {

		nuNewFastObject();		//-- overline sums
		o.left = 2;
		o.top = 3;
		o.width = width;
		o.height = 1;
		o.borderWidth = 1;
		o.objectType = 'label';
		o.fieldName = 'KEEP EXACT HEIGHT';

		nuREPORT.groups[1].sections[1].objects.push(o);

	}

}

function nuRedefine_nuSelectBrowse() {

	nuSelectBrowse = function (e, t) {

		const y  = window.nuBrowseFunction;					//-- browse, lookup or custom function name
		const pk = $('#' + t.id).attr('data-nu-primary-key');
		const formId = window.nuFORM.getProperty('form_id');
		const formIdRedirect = window.nuFORM.getProperty('redirect_form_id');
		const formType = window.nuFORM.getProperty('form_type');
		const ro = window.nuFORM.getProperty('redirect_other_form_id');

		if (formType == 'browse' && ro == '' && parent.$('#nuDragDialog').length == 0) {
			nuSelectBrowse = function (e, t) { }
			return;
		}

		nuCursor('progress');

		if (y == 'browse') {

			nuForm(formIdRedirect == '' ? formId : formIdRedirect, pk);

		} else if (y == 'lookup') {

			window.parent.nuGetLookupId(pk, window.nuTARGET);			//-- called from parent window

		} else {

			window[y](e);

		}

		if ((nuIsMacintosh() ? e.metaKey : e.ctrlKey) == false) {
			nuSelectBrowse = function (e, t) { } 						//-- so that it doesn't run twice.
		}

	}

}

function nuSetVerticalTabs() {

	let tabHolder = $('#nuTabHolder');
	tabHolder.css('display', 'inline-block');
	$('.nuTab').css('display', 'block');
	$('#nuRecord').css('display', 'inline-block');
	$('.nuTab').css('padding', '8px 2px 0px 2px');
	tabHolder.css('height', window.innerHeight);

	var w = 0;

	var s = '&nbsp;&nbsp;&nbsp;';
	$('.nuTab').each(function () {
		$(this).html($(this).html().includes(s) ? $(this).html() : s + $(this).html());
		w = Math.max(w, nuGetWordWidth($(this).html()));

	});

	tabHolder.css('width', w + 30);
	$('.nuTab').css('width', w + 30);

	window.nuVerticalTabs = true;
}

function nuHasBeenSaved() {

	return window.nuTimesSaved;

}

function nuResponseDefault() {

	if (nuFormType() == 'edit') {
		nuRESPONSIVE.resetDefault('', false);
	}

}

function nuResponseWrap() {

	if (nuFormType() == 'edit') {
		nuRESPONSIVE.setTabsColumn('', false);
	}

}

function nuResponseNoWrap() {

	if (nuFormType() == 'edit') {
		nuRESPONSIVE.setTabsColumn('', true);
	}

}

function nuResponsiveWrap(width, wrap) {

	if (window.innerWidth >= width) {
		nuResponseDefault();
	}

	if (window.innerWidth < width) {

		if (window.innerWidth < wrap) {
			nuResponseWrap();
		} else {
			nuResponseNoWrap();
		}

	}

}

function nuBrowseBorders() {

	var r = nuSERVERRESPONSE.rows;
	var c = nuSERVERRESPONSE.browse_columns.length;

	for (var i = 0; i < c; i++) {

		$('#nucell_0_' + i).addClass('nuBrowseBorderTop');
		$('#nucell_' + (r - 1) + '_' + i).addClass('nuBrowseBorderBottom');

	}

}

function nuObjectPosition(i) {

	var t = parseInt($(i).css('top'), 10);
	var l = parseInt($(i).css('left'), 10);
	var h = parseInt($(i).css('height'), 10);
	var w = parseInt($(i).css('width'), 10);

	var b = t + h; // bottom
	var r = l + w; // right

	return [t, l, h, w, b, r];
}

function nuFormWH() {

	var w = 0;
	var h = 0;
	var s = '[data-nu-object-id][data-nu-prefix=""], [data-nu-subform=true]';

	if (nuSERVERRESPONSE.record_id == -2) {
		s = '[data-nu-object-id]';
	}

	$(s).each(function () {

		w = Math.max(w, parseInt($(this).css('width'), 10) + parseInt($(this).css('left'), 10));
		h = Math.max(h, parseInt($(this).css('height'), 10) + parseInt($(this).css('top'), 10));

	});

	return { 'width': w, 'height': h };

}

function nuResizeFormDialogCoordinates() {

	var wh = nuFormWH();

	var w = wh.width;
	var h = wh.height;

	h = h + nuDialogHeadersHeight() + 50;
	w = w + 40;

	let dragDlg = $('#nuDragDialog', window.parent.document);
	if (dragDlg.length == 0) { return; }

	dragDlg.css('visibility', 'visible');
	dragDlg.css('width', w + 12);
	$('#nuWindow', window.parent.document).css('width', w);
	$('body').css('width', w);

	dragDlg.css('height', h + 50).css('visibility', 'visible');
	$('#nuWindow', window.parent.document).css('height', h + 10);
	$('body').css('height', window.innerHeight);

	if (h < window.innerHeight) {
		$('body').css('height', '100%');
	} else {
		$('body').css('height', h);
	}

	if (w > window.innerWidth) {

		let html = window.innerHTML;
		$('#nuBreadcrumbHolder').css('width', html);
		$('#nuTabHolder').css('width', html);
		$('#nuActionHolder').css('width', html);

	}

}

function nuClickTab(t, s) {

	t = "nuTab" + t;

	if (arguments.length == 2) {
		t = s + t;
	}

	nuSelectTab($('#' + t)[0]);

}

function nuFilterRun(id, filter) {

	var r = JSON.parse(JSON.stringify(nuSERVERRESPONSE));
	var o = -1;

	for (var i = 0; i < r.objects.length; i++) {

		if (r.objects[i].id == id) {

			if (filter) {
				if (r.objects[i].filter == filter) { return; }
				r.objects[i].filter = filter;

			}

			o = i;

		}

	}

	if (o == -1) { return; }

	nuRUN(r, o, '', '', r);

}

function nuRecordRun(id, filter) {

	var r = JSON.parse(JSON.stringify(nuSERVERRESPONSE));
	var o = -1;

	for (var i = 0; i < r.objects.length; i++) {

		if (r.objects[i].id == id) {

			if (filter) {
				if (r.objects[i].record_id == filter) { return; }
				r.objects[i].record_id = filter;
			}

			o = i;

		}

	}

	if (o == -1) { return; }

	nuRUN(r, o, '', '', r);

}

function nuGetIframeValue(f, o, method) {

	let obj = $('#' + f).contents().find('#' + o)
	return (!method || method == 'val') ? obj.val() : obj.html();
}

function nuSetIframeValue(f, o, v, method) {

	let obj = $('#' + f).contents().find('#' + o)
	return (!method || method == 'val') ? obj.val(v) : obj.html(v);

}

function nuLookingUp() {

	for (var lu in window.nuLOOKUPSTATE) {

		if (window.nuLOOKUPSTATE[lu] == 'looking') {

			nuMessage([nuTranslate('A Lookup is still being populated...')]);
			return true;

		}

	}

	return false;

}

function nuPortraitScreen(columns) {

	$('#nubody').css('transform', 'scale(1)')

	if (nuFormType() == 'browse') { return; }

	$('.nuBuilderLink').remove();
	if (arguments.length == 0) { columns = 1; }

	$('.nuPortraitTab').remove();

	var o = nuSERVERRESPONSE.objects;
	var lw = columns == 1 ? 0 : nuPortraitLabelWidth(o);
	var t = 10;
	var b = -1;
	var W = 0;

	for (var i = 0; i < o.length; i++) {

		var I = o[i].id;
		var L = $('#label_' + I).length == 0 ? 0 : $('#label_' + I).outerHeight()
		var O = $('#' + I).outerHeight()

		W = Math.max(W, $('#' + I).outerWidth());

		if (o[i].tab != b) {

			b = o[i].tab;
			const l = $('#nuTab' + o[i].tab).html();
			const d = '<div class="nuPortraitTab" id="nuPort' + b + '" style="top:' + t + 'px" >' + l + '</div>';
			$('#nuRECORD').append(d);
			var OH = $('#nuPort' + b).outerHeight()

			t = t + OH + 20;

		}

		if (o[i].read != 2) {

			$('#label_' + o[i].id).css({ 'top': t + 2, 'left': 7, 'text-align': 'left', 'font-weight': 700 });

			if (columns == 1) {
				t = t + L + 5;
			}

			$('#' + o[i].id).css({ 'top': t, 'left': lw + 10 });

			if (o[i].type == 'lookup') {

				const w = $('#' + o[i].id + 'code').outerWidth()
				const d = $('#' + o[i].id + 'description').outerWidth()
				W = Math.max(W, w + d + 30);

				$('#' + o[i].id + 'code').css({ 'top': t, 'left': lw + 10 });
				$('#' + o[i].id + 'button').css({ 'top': t, 'left': lw + w + 15 });
				t = t + 25;
				$('#' + o[i].id + 'description').css({ 'top': t, 'left': lw + 35 });

			}

			t = t + O + 5;

		}

	}

	$("[data-nu-tab!='x'][data-nu-form='']:not([data-nu-lookup-id])").show();
	$('#nuTabHolder').hide();

	t = t + 50;

	$('#nuRECORD').append('<div id="nuPortEnd" style="left:0px;position:absolute;top:' + t + 'px" >&nbsp;</div>');

	if (columns == 1) {
		$('label').css('text-align', 'right').css({ 'width': W, 'text-align': 'left', 'left': 12 });
	} else {
		$('label').css('text-align', 'left').css('width', lw);
	}

	var objectWidth = W + lw + 50;
	var screenWidth = window.innerWidth;
	var scale = screenWidth / (objectWidth);

	$('#nubody').css('width', objectWidth)
		.css('transform', 'scale(' + scale + ')')
	$('html,body').scrollTop(0).scrollLeft(0);

	return scale;

}

function nuMobileView() {

	var f = nuCurrentProperties();
	if (nuFormType() == 'edit' && (f.form_id == 'nuhome' || f.form_id == 'nuaccess' || f.form_id == 'nuuser')) {
		nuPortraitScreen();
		$('#nuActionHolder').hide();
		$('button').css('text-align', 'left');
	}

}

function nuPortraitLabelWidth(o) {

	var w = 0
	$('label').css('width', '');

	for (var i = 0; i < o.length; i++) {
		w = nuGetWordWidth($('#label_' + o[i].id).html());
	}

	return w + 15;

}

function nuGetBrowsePaginationInfo() {

	const r = $("div[id^='nucell_']" + "[id$='_1']").length; // Number of Rows per page

	const cf = nuFORM.getCurrent();

	const c = cf.page_number; 							// Current page number
	const f = cf.browse_filtered_rows; 					// Number of records in the table after filtering
	const p = cf.pages; 								// Total number of pages

	var e; 												// Row number of the last record on the current page
	var s; 												// Row number of the first record on the current page

	if (c == 0 && f > 0 && p == 1) {
		s = 1;
		e = f;
	} else
		if (p == c + 1 || f == 0) {
			s = f == 0 ? 0 : c * r + 1;
			e = f;
		} else
			if (c == 0 && p > 1) {
				s = 1;
				e = r;
			} else
				if (c > 0 && c < p) {
					e = (c + 1) * r;
					s = e - r + 1;
				}

	return {
		startRow: s,
		endRow: e,
		totalRows: f // filtered rows
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
			f = '{StartRow} - {EndRow} ' + nuTranslate('of') + ' ' + '{TotalRows}';

		const p = f.nuFormat({ StartRow: startRow, EndRow: endRow, TotalRows: totalRows });

		$('#nuBrowseFooter').append('<span class="nuPaginationInfo">' + p + '</span>');

	}

}

function nuPrintEditForm(hideObjects, showObjects) {

	// hide some elements before calling the print dialog
	$('#nuBreadcrumbHolder').hide();
	$('#nuTabHolder').hide();
	$('.nuActionButton').hide();

	if (!hideObjects) {
		hideObjects = [];
	}

	if (!showObjects) {
		showObjects = [];
	}

	for (let i = 0; i < hideObjects.length; i++) {
		nuHide(hideObjects[i]);
	}

	for (let i = 0; i < showObjects.length; i++) {
		nuShow(hideObjects[i]);
	}

	window.onafterprint = function () {
		$(window).off('mousemove', window.onafterprint);

		// Show the elements again when the dialog closes
		$('#nuBreadcrumbHolder').show();
		$('#nuTabHolder').show();
		$('.nuActionButton').show();


		for (let i = 0; i < hideObjects.length; i++) {
			nuShow(hideObjects[i]);
		}

		for (let i = 0; i < showObjects.length; i++) {
			nuHide(hideObjects[i]);
		}

	};

	window.print();

	setTimeout(function () {
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

function nuPromptModal() {

	this.render = function (text, caption, defaultValue, format, fctn) {

		let winW = window.innerWidth;
		let winH = window.innerHeight;
		let modal = document.getElementById('nupromptmodal');
		let nuprompt = document.getElementById('nuprompt');
		modal.style.display = "block";
		modal.style.height = winH + "px";
		nuprompt.style.left = (winW / 2) - (560 * 0.5) + "px";
		nuprompt.style.top = "5px";
		nuprompt.style.display = "block";
		document.getElementById('nuprompthead').innerHTML = caption;
		let body = document.getElementById('nupromptbody');
		body.innerHTML = text;
		body.innerHTML += '<br><input id="prompt_value1" onkeyup="promot.inputkeyup(event, \'' + fctn + '\')" style="width: 450px; margin-top: 10px; border: 1px solid #CCC; padding: 10px; border-radius: 4px;"/>';
		document.getElementById('nupromptfoot').innerHTML = '<button class="nuActionButton" onclick="promot.ok(\'' + fctn + '\', true)">OK</button> <button class="nuActionButton" onclick="promot.cancel(\'' + fctn + '\', false)">Cancel</button>';

		let value1 = document.getElementById("prompt_value1");
		value1.value = defaultValue === undefined ? '' : defaultValue;
		value1.focus();

	}

	$('#prompt_value1').focus();

	this.inputkeyup = function (e, fctn) {
		if (e.which == 13) {			//-- Enter
			this.ok(fctn);
		} else if (e.which == 27) {		//-- ESC
			this.cancel(fctn);
		}
	}

	this.cancel = function (fctn) {
		window[fctn](null, false);
		document.getElementById('nupromptmodal').style.display = "none";
		document.getElementById('nuprompt').style.display = "none";
	}

	this.ok = function (fctn) {
		var prompt_value1 = document.getElementById('prompt_value1').value;
		window[fctn](prompt_value1, true);
		document.getElementById('nupromptmodal').style.display = "none";
		document.getElementById('nuprompt').style.display = "none";
	}

}

function nuOnPromptClose(val, ok) {
}

function nuPrompt(text, caption, defaultValue, format, fctn) {

	if ($('#nupromptmodal').length == 0) {

		let nuPromptDiv =
			`<div id="nupromptmodal"></div>

		<div id="nuprompt">
			<div id="nuprompthead"></div>
			<div id="nupromptbody"></div>
			<div id="nupromptfoot"></div>
		</div>`;

		$('body').append(nuPromptDiv);
		promot = new nuPromptModal();

	}

	fctn = nuDefine(fctn, 'nuOnPromptClose');

	promot.render(text, caption, defaultValue, format, fctn);

}

function nuAddBrowseTitleSelect(index, data, w) {

	if (!$.isArray(data)) return;

	var id = "nuBrowseTitle" + index + "_select";
	var list = document.createElement('select');
	list.setAttribute("id", id);

	if (w === undefined) {
		w = nuCurrentProperties().column_widths == 0 ? nuCurrentProperties().browse_columns[index].width : nuCurrentProperties().column_widths[index] - 3;
	}

	list.setAttribute('style', 'width:' + w + 'px');

	var is1DArray = data[0][0] === undefined;
	data.forEach(function (a) {
		var opt = document.createElement('option');
		opt.value = is1DArray ? a : a[0];
		opt.innerHTML = is1DArray ? a : a[1];
		list.appendChild(opt);
	});

	var obj = $('#nuBrowseTitle' + index);
	obj.append('<br/>').append(list);

	$('#' + id).on('change', function () {
		nuSetProperty(this.id, this.value);
		nuSearchAction();
	});

	obj.on('mousedown', '> select', function (e) {
		e.stopPropagation();
	});

	$("#" + id).val(nuGetProperty(id));

}

function nuDatalistValueRestoreValue(i) {

	let t = $('#' + i);
	if (t.val() === '') {

		if (t.attr('org-placeholder') !== t.attr('placeholder')) {
			t.val(t.attr('placeholder'));
		}

		t.attr('placeholder', '');
		if (t.val() === '') {
			t.attr('placeholder', t.attr('org-placeholder'));
		}

	}

}

// Show all dropdown items when clicking on the datalist arrow down button
function nuDatalistShowAllOnArrowClick(i) {

	$('#' + i)
		.on('click', function (e) {
			let t = $(this);
			if ((t.width() - (e.clientX - t.offset().left)) < 14) {
				if (t.val() !== "") {
					t.attr('placeholder', t.val());
					t.val('');
				}
			} else {
				nuDatalistValueRestoreValue(i)
			}
		})

		.on('mouseleave', function () {
			nuDatalistValueRestoreValue(this.id);
		})


		.on('mouseenter', function () {
			if (!$(this).is("[org-placeholder]")) $(this).attr('org-placeholder', $(this).attr('placeholder'));
		})

}

function nuSetSelect2(id, obj) {

	$('#' + id).attr('date-nu-select2', 1);

	let select2Id = $('#' + id).attr('id') + "_select2";

	let lang = (nuSERVERRESPONSE.language === null ? 'en' : nuSERVERRESPONSE.language.toLowerCase());
	let select2OptionsDefault = {
		dropdownParent: $('#nuRECORD'),
		selectionCssClass: select2Id,
		theme: nuUXOptions.nuSelect2Theme ? nuUXOptions.nuSelect2Theme : 'default',
		language: lang
	}

	let objSelect2OptionsDefault = { options: select2OptionsDefault };
	let select2UserOptions = [];

	if (typeof window.nuOnSetSelect2Options === 'function') {
		select2UserOptions = window.nuOnSetSelect2Options(id, objSelect2OptionsDefault);
	}

	let select2Options = Object.assign(select2UserOptions, objSelect2OptionsDefault.options);
	// select2Options = {...objSelect2OptionsDefault.options, ...select2UserOptions};

	$('#' + id).select2(select2Options);

	$('.' + select2Id).parent().parent().css({
		position: 'absolute',
		width: Number(obj.width),
		top: Number(obj.top),
		left: Number(obj.left)
	}).attr('id', select2Id);

	return select2Id;

}

function nuGetFirstObject(objects, tabNr) {

	if (objects.length > 0) {

		let obj0Id = null;

		for (let i = 0; i < objects.length; i++) {

			let id = objects[i].id;
			let obj = $('#' + id);

			if (tabNr == -1 || obj.attr('data-nu-tab') == tabNr) {
				if (nuIsEnabled(id) && (nuIsVisible(id) || nuIsVisible(id + 'code') || nuIsVisible(id + '_select2'))) {

					let c = obj.attr("class");
					if (c === undefined || !obj.attr("class").containsAny(['nuReadonly', 'nuHtml', 'nuImage', 'nuWord', 'nuCalculator', 'nuContentBoxContainer'])) {
						obj0Id = objects[i].id;
						break;
					}
				}
			}

		}

		if (obj0Id !== null) {

			let obj0Code = $('#' + obj0Id + 'code');
			if (obj0Code.length !== 0) {
				return obj0Code;
			}

			let select2 = $('#' + obj0Id + '_select2');
			return select2.length == 0 ? $('#' + obj0Id) : select2.children(":first").children(":first");

		}

	}

	return null;

}

function nuAccessFormSetButtonIcons(force) {

	function setInnerHTML(element, icon) {
		element.innerHTML = '<br>&nbsp<span style="padding: 1px 10px 1px 10px;" class="nuActionButton"><i class="' + icon +'"></i></span>';
	}

	if (nuUserLanguage() !== '' || force === true) {
		setInnerHTML(title_accformslf_add_button, 'fas fa-plus');
		setInnerHTML(title_accformslf_print_button, 'fas fa-print');
		setInnerHTML(title_accformslf_save_button, 'fas fa-save');
		setInnerHTML(title_accformslf_clone_button, 'fas fa-clone');
		setInnerHTML(title_accformslf_delete_button, 'fas fa-trash-alt');
	}

}

