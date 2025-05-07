
function nuInitJSOptions() {

	const defaults = {
		'nuEnableBrowserBackButton': true,		// Enable the browser's Back button
		'nuPreventButtonDblClick': true,		// Disable a button for 1.5 s to prevent a double click
		'nuShowPropertiesOnMiddleClick': true,	 // Show the Object Properties on middle mouse click
		'nuAutosizeBrowseColumns': true,		// Autosize columns to fit the document width
		'nuShowBackButton': false,				// Show a Back Button
		'nuMobileView': false,					// Optimize view for mobile devices
		'nuBrowsePaginationInfo': 'default',	// Default Format is: '{StartRow} - {EndRow} ' + nuTranslate('of') + ' ' + '{TotalRows}'
		'nuShowNuBuilderLink': true,			// Show the link to nubuilder com
		'nuShowLoggedInUser': false,			// Show the logged in User
		'nuShowBrowserTabTitle': true,			// Show the Form Title in the Browser Tab
		'nuDebugMode': true,					// Debug Mode
		'nuBrowserTabTitlePrefix': 'nuBuilder',	// Prefix in the Browser Tab
		'nuCalendarStartOfWeek': 'Sunday',		// nuCalendar: Start of Week: Sunday (default) or Monday
		'nuCalendarWeekNumbers': 'None',		// nuCalendar: 0 = None, 1 = ISO 8601, 2 = Western traditional, 3 = Middle Eastern
		'nuSelect2Theme': 'default',			// select2 theme (default, classic) Default: default
		'nuEditCloseAfterSave': 'None',			// Close forms after saving. Values: None, All, User, System
		'nuShowJSErrors': 'None',				// Show JS errors in alert message
		'nuShowURLPermaLink': false,			// Show URL permalink
		'nuDebugIcon': true,
		'nuPHPIcon': true,
		'nuRefreshIcon': true,
		'nuObjectsIcon': true,
		'nuPropertiesIcon': true
	};

	if (typeof window.nuUXOptions === "undefined") {
		window.nuUXOptions = defaults;
	} else {
		// Merge defaults only if the property is not already defined
		for (var key in defaults) {
			if (defaults.hasOwnProperty(key) && typeof window.nuUXOptions[key] === "undefined") {
				window.nuUXOptions[key] = defaults[key];
				console.log('added: ' + key + ' - ' + defaults[key]);
			}
		}
	}
}

function nuBuildForm(formObj) {

	nuInitJSOptions();

	window.nuOnSetSelect2Options = null;		// can be overwritten by nuAddJavaScript()
	window.nuSERVERRESPONSE = formObj;

	if (nuArrangingObjects(formObj.record_id)) {
		nuAddJavaScript(formObj.javascript_bc);
	}

	$('#nubody').off('.nuresizecolumn').css('transform', 'scale(1)');
	$('html,body').scrollTop(0).scrollLeft(0);

	if (nuNeedToLoginAgain(formObj)) return;

	const formType = nuFormType();
	nuSetDefaultWindowProperties(formObj, formType);

	nuInitShowJSErrors();

	nuFORM.edited = false;

	if (nuEditDoCloseAfterSave(formObj)) {
		return;
	}

	nuFORM.scroll = [];
	nuSetSuffix(1000);
	nuSetBody(formObj);

	nuRedefineNuSelectBrowse();

	nuFORM.tableSchema = formObj.tableSchema;
	nuFORM.formSchema = formObj.formSchema;
	window.nuLANGUAGE = formObj.translation;

	nuSetProperty('refreshed', nuGetProperty('refreshed') + 1);

	nuAddedByLookup(formObj);

	var currentForm = nuSetFormProperties(formObj);

	nuAddHolder('nuBreadcrumbHolder');
	nuAddHomeLogout();
	nuAddHolder('nuActionHolder');

	if (formType == 'edit') {
		nuAddHolder('nuTabHolder');
	}

	// const nuRecordDiv =
	nuAddHolder('nuRECORD')
		.attr('data-nu-table', formObj.table)
		.attr('data-nu-primary-key-name', formObj.primary_key);

	// DEV: nuWrapWithForm(nuRecordDiv[0], '#', '');
	nuAddBreadcrumbs();

	nuAddEditTabs('', formObj);

	if (typeof window.nuBeforeAddActionButtons === 'function') {
		nuBeforeAddActionButtons();
	}

	nuAddActionButtons(formObj);
	nuRecordProperties(formObj, '');

	let firstObject = null;

	if (formType == 'edit') {

		nuOptions(formObj.form_id, '', 'form', formObj.global_access);
		nuBuildEditObjects(formObj, '', '', formObj);
		nuResizeFormDialogCoordinates();
		nuCalculateForm(false);

		firstObject = nuGetFirstObject(formObj.objects, -1);

	}

	nuGetStartingTab();

	if (formType == 'edit' && nuIsNewRecord() && (firstObject !== null)) {
		firstObject.nuFocusWithoutScrolling();
	}

	if (nuArrangingObjects(formObj.record_id)) {
		nuCreateDragOptionsBox(formObj);
	} else {
		nuAddJavaScript(formObj.javascript);
	}

	nuDragTitleEvents();

	nuAddHome();

	nuShowLastUpdatedMessage();

	nuShowMessages();

	if (window.nuOnEditorLoad) {
		nuOnEditorLoad();
	} else {
		$('.nuEditor').each((index, element) => {
			nuInitTinyMCE(element.id);
		});
	}

	nuEvaluateOnLoadEvents(formType);

	if (window.nuLoadEditGlobal && formType == 'edit') {
		nuLoadEditGlobal(formObj.form_id, formObj.form_code);
	}

	if (window.nuLoadBrowseGlobal && formType == 'browse') {
		nuLoadBrowseGlobal(formObj.form_id, formObj.form_code);
	}

	if (window.nuOnLoad) {
		nuOnLoad(formObj.form_id, formObj.form_code);
	}

	if (formType == 'edit') {
		window.nuRESPONSIVE.getStartPositions();
	} else {

		if (currentForm.browse_autoresize_columns !== '0' || nuDocumentID !== parent.nuDocumentID) {

			if (nuUXOptions.nuAutosizeBrowseColumns || currentForm.browse_autoresize_columns === '1' || nuDocumentID !== parent.nuDocumentID) {
				nuResizeBrowseColumns(true);
			}

		}
	}

	if (nuUXOptions.nuShowBrowserTabTitle) {
		nuSetBrowserTabTitle(nuUXOptions.nuBrowserTabTitlePrefix);
	} else {
		document.title = nuUXOptions.nuBrowserTabTitlePrefix;
	}

	if (nuGlobalAccess()) {
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

	if (nuUXOptions.nuShowURLPermaLink) {
		nuSetURLPermaLink();
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

	nuProcessAfterSave();

	nuAddFormStyle(formObj.style);

	const globalAccess = nuGlobalAccess();
	if (globalAccess) {
		nuContextMenuUpdate();
		nuUpdateDebugButton();
	}

	nuSetSaved(true);

	nuCursor('default');

	window.nuPORTRAITSCREEN = false;
	if (!nuIsMobile()) {
		$('#nuSearchField').trigger("focus");
	} else {
		if (nuUXOptions.nuDevMobileView2) {
			nuInitMobileView();
		} else {
			nuSetMobileView1();
		}
	}

	nuWindowPosition();

	nuFormModification();

	nuRestoreScrollPositions();

	if ((nuSERVERRESPONSE.user_a11y || globalAccess) && window.nuSetAccessibility) {
		nuSetAccessibility(formType, globalAccess);
	}

}

function nuProcessAfterSave() {

	if (window.nuTimesSaved > 0) {

		if (window.nuAfterSaveGlobal) nuAfterSaveGlobal();
		if (window.nuAfterSave) nuAfterSave();

	}

}

function nuSetFormProperties(formObj) {

	const properties = ['form_id',
		'record_id', 'session_id',
		'user_id',
		'redirect_form_id',
		'redirect_other_form_id', 'title',
		'row_height', 'rows',
		'browse_columns', 'browse_sql',
		'browse_rows', 'browse_table_id',
		'browse_filtered_rows',
		'browse_title_multiline',
		'browse_autoresize_columns',
		'mobile_view', 'pages',
		'form_code', 'form_description',
		'form_group', 'form_type',
		'run_code', 'run_description',
		'data_mode'
	];

	var currentForm = window.nuFORM.getCurrent();
	properties.forEach(prop => {
		currentForm[prop] = formObj[prop];
	});

	return currentForm;

}

function nuEditDoCloseAfterSave(formObj) {

	if (nuHasBeenSaved() < 1 || nuGetProperty('nuEditCloseAfterSave') == '0') {
		return false;
	}

	const closeAfterSave = window.nuUXOptions.nuEditCloseAfterSave.toLowerCase()
	const isUserForm = !formObj.form_id.startsWith('nu');
	const shouldCloseAllForms = closeAfterSave === 'allforms';
	const shouldCloseUserForms = closeAfterSave === 'userforms' && isUserForm;
	const shouldCloseSystemForms = closeAfterSave === 'systemforms' && !isUserForm;

	if (shouldCloseAllForms || shouldCloseUserForms || shouldCloseSystemForms) {
		return nuCloseAfterSave();
	}

	return false;

}

function nuUpdateDebugButton() {

	const debugMessages = nuSERVERRESPONSE && nuSERVERRESPONSE.nu_debug;

	if (Array.isArray(debugMessages) && debugMessages.length > 0) {
		$("#nuDebugButton")
			.addClass("nuDebugButtonHighlight")
			.attr("title", debugMessages.join(" "));
	}

}

function nuInitShowJSErrors() {

	if (window.nuUXOptions.nuShowJSErrors) {

		const nuShowJSErrors = window.nuUXOptions.nuShowJSErrors;
		let enableShowJSErrors = false;

		switch (nuShowJSErrors.toLowerCase()) {
			case "globeadmin":
				enableShowJSErrors = nuGlobalAccess()
				break;
			case "everyone":
				enableShowJSErrors = true;
				break;
		}

		if (enableShowJSErrors) {
			nuConsoleErrorsToMessage();
		}

	}

}

function nuAddHome() {

	if (window.nuLoginH != '') {

		let breadCrumb = $('#nuBreadcrumb0').length > 0 ? $('#nuBreadcrumb0') : $('#nuHomeGap');
		breadCrumb
			.html('<i class="fa fa-home fa-fw" style="font-size:17px;"></i>')
			.attr('title', nuTranslate('Home'))
			.attr('onclick', '')
			.attr('onclick', 'nuForm("' + window.nuLoginH + '", -1, "", "", 1);')
			.css('cursor', 'pointer');

		window.nuLoginH = '';

	}

}

function nuNeedToLoginAgain(f) {

	let result = f.tableSchema === null;
	if (result) {
		$('body').addClass('nuBrowseBody').removeClass('nuEditBody');
		sessionStorage.logout = 'true';
		window.top.location.reload();
		nuCursor('default');
	}

	return result;

}

function nuSetDefaultWindowProperties(f, formType) {

	if (formType == 'edit' && nuCurrentProperties().form_type !== 'launch') {

		window.nuTimesSaved++;

		if (window.nuLastForm != f.form_id || (window.nuLastRecordId != f.record_id && window.nuLastRecordId !== "-1")) {
			window.nuTimesSaved = 0;
		}

	} else {
		window.nuTimesSaved = -1;
	}

	window.nuLastForm = f.form_id;
	window.nuLastRecordId = f.record_id;
	window.nuSubformRow = -1;
	window.nuBrowseNoData = false;
	window.nuBrowseNoSearchResults = false;
	window.nuBeforeSave = null;
	window.nuAfterSave = null;
	window.nuBeforeDelete = null;
	window.nuAfterDelete = null;
	window.nuOnSearchAction = null;
	window.nuOnClone = null;
	window.nuOnEditorLoad = null;
	window.nuOnBeforeGetBreadcrumb = null;
	window.nuOnSetSaved = null;
	window.nuOnTabSelected = null;
	window.nuOnSelectTab = null;
	window.nuOnAddAction = false;
	window.onSubformTitleClick = null;
	window.nuOnMessage = null;
	window.nuFormatValueCleared = null;
	window.nuDisplayObjectRefreshed = null;
	window.nuOnSetCalendarOptions = null;
	window.nuOnLookupPopulated = null;
	window.nuCalculated = null;
	window.nuOnPropertySet = null;
	window.nuEnableCalculation = null;
	window.nuPortraitScreenShowTabTitles = true;
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
	window.nuVerticalTabs = false;
	window.nuOnMobileVievLoaded = false;

}

function nuFormModification() {

	if (nuFormType() == 'browse') {

		if (!nuIsIframe()) {

			$record = $('#nuRECORD');
			$record.css({
				'width': '99.7vw',
				'height': '80vh',
				'overflow-x': 'auto',
				'overflow-y': 'auto'
			});

			$('#nuActionHolder').css({
				'width': '100vw'
			});

			$('.nuBrowseTitle, .nuBrowseTitleMultiline').wrapAll('<div id= "btitle"></div>');

			nuBrowseStickyColumns($record);

			document.body.style.overflow = 'hidden';
		}
	} else {
		document.body.style.overflow = 'visible';
	}

}

function nuCloseAfterSave() {

	if (window.nuCloseAfterSaveGlobal) {
		if (!window.nuCloseAfterSaveGlobal(doClose)) {
			return false;
		}
	}

	nuDelay(100).then(() => {
		nuHasNotBeenEdited();
		if (nuIsPopup()) {
			nuClosePopup();
		} else {
			if (!nuOpenPreviousBreadcrumb()) {
				window.close();
			}
		}

	})

	return true;

}

function nuBrowseStickyColumns($record) {

	$record.on("scroll", function () {

		const scrollLeft = $record.scrollLeft();
		const scrollTop = $record.scrollTop();

		if (scrollTop >= 0 && scrollLeft >= 0) {

			$('#btitle').css({
				'z-index': '95',
				'position': 'fixed',
				'left': 5 - scrollLeft + 'px'
			});
			$('.nuBrowseTitle').css({
				'top': '0',
				'height': '28px'
			});
			$('.nuBrowseTitleMultiline').css({
				'top': '0',
				'height': '48px'
			});

		} else {

			$('#btitle').css({
				'z-index': '0',
				'position': 'absolute'
			});
			$('.nuBrowseTitle,.nuBrowseTitleMultiline ').css({
				'top': '3px'
			});

		}

	});

}

function nuBrowseRowsPerPageFilter(rowsPerPageOptions) {

	if (nuFormType() !== 'browse') return;

	const selectId = 'nuBrowseRowsPerPage';
	const hashCookie = 'ROWS_PER_PAGE';
	const selectStyle = 'margin-left: 20px; width: 50px; height: 22px; text-align: left';
	const selectElement = $(`<select style="${selectStyle}" id="${selectId}" aria-label="Number of Rows per Page"></select>`);

	selectElement.attr('title', nuTranslate('Number of Rows'));
	selectElement.append($(`<option value="" disabled selected>${nuGetProperty('rows')}</option>`));

	rowsPerPageOptions = rowsPerPageOptions || [10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 150, 200];
	for (let optionValue of rowsPerPageOptions) {
		$(`<option value="${optionValue}">${optionValue}</option>`).appendTo(selectElement);
	}

	selectElement.insertBefore('#nuSearchField');

	selectElement.on("change", function () {
		nuSetProperty('page_number', 0);
		nuSetProperty(hashCookie, this.value);
		nuSearchAction();
	});

	selectElement.val(nuGetProperty(hashCookie) ?? '');

}

function nuPrintIncludeColumns($arr) {
	nuSetProperty('nuPrintincludedColumns', nuEncode($arr));
}

function nuRestoreScrollPositions() {

	$(function () {

		$('textarea').each(function () {
			const position = window['nuScrollTop_' + this.id] || 0;
			$(this).scrollTop(position);
		});

	});

}

function nuSaveScrollPositions() {

	$('textarea:visible').each(function () {
		window['nuScrollTop_' + this.id] = $(this).scrollTop();
	});

}

function nuEvaluateOnLoadEvents(formType) {

	if (formType === 'browse') return;

	const serverResponse = JSON.parse(JSON.stringify(nuSERVERRESPONSE));

	for (const obj of serverResponse.objects) {
		if (obj.js.length > 0) {
			for (const jsEvent of obj.js) {
				if (jsEvent.event === 'onnuload') {
					let modifiedJS = jsEvent.js
						.replaceAll('(this)', `("#${obj.id}")`)
						.replaceAll('this.', `${obj.id}.`);

					eval(modifiedJS);
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

	if (nuMainForm(true)) {

		if (window.nuFORM.breadcrumbs.length > 1) {

			const div = nuCreateElementWithId('div', 'nuBreadcrumb0', 'nuBreadcrumbHolder');

			$(div)
				.addClass('nuBreadcrumb')
				.css('cursor', "pointer")
				.css('font-size', '16px')
				.attr('onclick', "nuGetBreadcrumb(0)")
				.html('<i class="fa fa-home" style="font-size:17px;padding:0px 5px 0px 0px"></i>')
				.attr('title', nuTranslate('Home'));

		}

		if (!nuIsMobile() || $('.nuBreadcrumb').length == 0) {
			$('#nuBreadcrumbHolder').append('<span id="nulink"><a href="https://www.nubuilder.com" class="nuBuilderLink" target="_blank">nuBuilder</a></span>');
			nuAddIconToBreadCrumb('nuLogout', 'Log out', 16, 'nuAskLogout()', 'fas fa-sign-out-alt');
		}

	}

}

function nuAddIconToBreadCrumb(id, title, right, handler, iconClass) {

	const div = nuCreateElementWithId('div', id, 'nuBreadcrumbHolder');

	$(div)
		.addClass('nuBreadcrumbIcon')
		.attr('onclick', handler)
		.css('right', right)
		.html(`<i class="${iconClass}" style="font-size:17px;"></i>`)
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

	if (nuFormType() === 'browse') {
		$body.addClass('nuBrowseBody');
	} else {

		var height = f.dimensions === null ? 0 : f.dimensions.edit.height;
		$body.addClass('nuEditBody')
			.css('width', window.innerWidth - 1)
			.css('height', height);

	}

}

function nuCSSPropertySum(id, arr) {
	let elem = document.getElementById(id);
	if (!elem) {
		return 0;
	}

	let sum = 0;
	arr.forEach(function (property) {
		sum += parseInt(getComputedStyle(elem).getPropertyValue(property), 10);
	});

	return sum;
}

function nuDialogHeadersHeight() {
	let height = 0;
	const arr = [
		"nuBreadcrumbHolder",
		"nuActionHolder",
		"nuTabHolder",
		"nuBrowseTitle0",
		"nuBrowseFooter",
	];
	arr.forEach(function (elem) {
		height += nuTotalHeight(elem);
	});

	return height;
}

function nuTotalHeight(id) {
	const arrProperties = [
		"height",
		"padding-top",
		"padding-bottom",
		"border-top-width",
		"border-bottom-width",
		"margin-top",
		"margin-bottom",
	];
	return nuCSSPropertySum(id, arrProperties);
}

function nuTotalWidth(id) {
	const arrProperties = [
		"width",
		"padding-left",
		"padding-right",
		"border-left-width",
		"border-right-width",
		"margin-left",
		"margin-right",
	];
	return nuCSSPropertySum(id, arrProperties);
}

function nuTotalHolderWidth(id) {
	const arrProperties = [
		"padding-left",
		"padding-right",
		"border-left-width",
		"border-right-width",
		"margin-left",
		"margin-right",
	];
	return nuCSSPropertySum(id, arrProperties);
}

function nuDefine(v, defaultValue = '') {

	if (v === undefined) {
		v = defaultValue;
	}

	return v;

}

function nuSearchFieldSetSearchType(isMobile) {

	const $searchField = $("#nuSearchField");

	$searchField
		.prop("type", "search")
		.attr('autocomplete', 'off')
		.on('search', function () {
			nuSearchAction();
		});

	if (isMobile) {
		$searchField.css('height', '32px');
	}

}

function nuAddActionButtons(form) {

	const recordId = nuRecordId();
	const arrangingObjects = nuArrangingObjects(recordId);

	var button = form.buttons;
	const isMobile = nuIsMobile();

	if (nuFormType() == 'browse') {

		var s = nuDefine(nuFORM.getProperty('search'));
		var f = nuDefine(nuFORM.getProperty('filter'));

		$('#nuActionHolder').append("<input id='nuSearchField' type='text' class='nuSearch' onfocus='this.value = this.value;' onkeypress='nuSearchPressed(event)' onkeydown='nuArrowPressed(event)' value='" + s + "'>")
			.append("<input id='nuFilter' style='visibility:hidden;width:0px' value='" + f + "'>");

		const searchCaption = isMobile ? "<i class='fa-fw fa fa-search fa-lg'></i>" : "<i class='fa-fw fa fa-search'></i>" + "&nbsp;" + nuTranslate('Search');
		const printCaption = nuTranslate('Print');
		const addCaption = isMobile ? "<i class='fa-fw fa fa-add fa-lg'></i>" : nuTranslate('Add');

		nuAddActionButton("Search", searchCaption, 'nuSearchAction()');

		if (button.Add == 1) {
			nuAddActionButton('Add', addCaption, 'nuAddAction()');
		}

		if (button.Print == 1 && nuFORM.getCurrent().browse_rows.length > 0 && !isMobile) {
			nuAddActionButton('Print', printCaption, 'nuPrintAction()');
		}

		nuSearchFieldSetSearchType(isMobile);

	} else {

		if (!arrangingObjects) {

			if (button.Save == 1 && form.form_type != 'launch') {
				if ((nuIsNewRecord() && form.data_mode == 0) || form.data_mode != 0) {
					nuAddActionButton('Save');
				}
			}

			if (recordId != -1) {

				if (button.Delete == 1) { nuAddActionButton('Delete'); }
				if (button.Clone == 1) { nuAddActionButton('Clone'); }

			}

			if (button.RunHidden != '') { nuAddActionButton('runhidden', 'Run', button.RunHidden); }
			if (button.Run != '') { nuAddActionButton('run', 'Run', button.Run); }

		}

	}

	if (isMobile) {
		$('#nuSearchButton #nuSaveButton #nuAddButton').addClass('nuActionButtonIcon');
	}

}

function nuAddActionButton(id, value, func, text, e) {

	if (arguments.length == 1) {
		value = id;
		func = 'nu' + id + 'Action()';
	}

	if (typeof (value) == 'object') {
		value = nuUseMobileView() ? value.valueMobile : nuTranslate(nuDefine('value'));
	} else {
		value = nuTranslate(nuDefine(value));
	}

	text = nuTranslate(nuDefine(text));

	let nuClass = "nuActionButton";
	if (id == 'Save' || id == 'Add' || id == 'Clone' || id == 'Delete') {
		nuClass += " " + "nu" + id + "Button";
	}

	id = "nu" + id + "Button";
	let html = `<button id='${id}' type='button' class='${nuClass}' title = '${text}' onclick='${func}'>${value}` + "</button>";

	if (e) {
		$(html).insertAfter('#' + e);
	} else {
		$('#nuActionHolder').append(html);
	}

	if (nuIsMobile()) {
		$('.nuActionButton').css('height', '28px');
	}

	return $('#' + id);
}

function nuAddActionButtonSaveClose(caption) {

	nuAddActionButton('SaveClose', nuTranslate(caption === undefined ? 'Save & Close' : caption), "nuSaveAction(true)", '', 'nuSaveButton');
	$('#nuSaveCloseButton').addClass('nuSaveButton');

}

function nuBuildEditObjects(formObj, p, o, prop) {

	if (typeof (formObj.objects) != 'object') { return; }

	var left = 3;

	const arrangingObjects = nuArrangingObjects();

	for (let objIndex = 0; objIndex < formObj.objects.length; objIndex++) {

		if (arrangingObjects) {

			$("body").css("overflow", "hidden");
			left = left + nuDRAG(formObj, objIndex, left, p, prop);

		} else {

			var obj = prop.objects[objIndex];
			var t = obj.type;
			formObj.objects[objIndex].parent_type = o == '' ? '' : o.subform_type;

			const typeFunctionMap = {
				'input': nuINPUT,
				'display': nuINPUT,
				'lookup': nuINPUT,
				'textarea': nuINPUT,
				'calc': nuINPUT,
				'run': nuRUN,
				'html': nuHTML,
				'contentbox': nuCONTENTBOX,
				'editor': nuEDITOR,
				'image': nuIMAGE,
				'select': nuSELECT,
				'subform': nuSUBFORM,
				'word': nuWORD
			};

			// Execute the function based on the type
			if (typeFunctionMap[t] && (t !== 'subform' || p === '')) {
				let newLeft = typeFunctionMap[t](formObj, objIndex, left, p, prop);
				left += newLeft;
			}

			if (obj.labelOnTop) {
				$('#' + obj.id).nuLabelOnTop();
			}

			const tableColumn = formObj.objects[objIndex].table_column;
			$('#' + p + obj.id).attr('data-nu-table-column', tableColumn);

			if (obj.visible === false) {
				nuHide(obj.id);
			}

			nuAddAttributes(p + obj.id, obj.attributes);

			if (!(t == 'contentbox' && nuIsMobile())) {
				left = left + 2;
			}

		}

	}

}

function nuAddJSObjectEvents(id, events) {

	const element = document.getElementById(id);

	for (let eventObj of events) {
		let code = element.getAttribute(eventObj.event) || '';
		let ev = eventObj.event;
		if (['beforeinsertrow', 'afterinsertrow', 'clickdelete'].includes(ev)) {
			ev = 'data-nu-' + ev;
		} else if (element.classList.contains('nuLookupCode') && ev === 'onclick') {
			continue;
		} else if (element.classList.contains('nuLookupButton') && ev !== 'onclick') {
			continue;
		}

		if (ev === 'onenter') {
			$(element).nuOnEnterKey(function (e) {
				eval(eventObj.js);
			});
		} else {
			code += ';' + eventObj.js;
			element.setAttribute(ev, code);
		}
	}

	if (element.tagName === "BUTTON") {
		let ele = $(element);
		var existingOnclick = ele.attr('onclick');
		if (existingOnclick) {
			const newOnclick = `if (nuIsDisabled(this.id)) return; ${existingOnclick}`;
			ele.attr('onclick', newOnclick);
		}
	}
}

function nuRecordProperties(w, p, l) {

	var del = p + 'nuDelete';
	var sf = p.substr(0, p.length - 3);

	const chk = nuCreateElementWithId('input', del);

	chk.setAttribute('title', nuTranslate('Delete This Row When Saved'));
	chk.setAttribute('type', w.deletable == '0' ? 'text' : 'checkbox');
	chk.setAttribute('onclick', 'nuChange(event)');

	$('#' + p + 'nuRECORD')
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

	let tagType = 'div';
	if (nuObjectType == 'textarea' || nuObjectType == 'input') {
		tagType = nuObjectType;
	}

	const drgDiv = nuCreateElementWithId(tagType, id, p + 'nuRECORD');
	let $id = $(drgDiv);

	nuSetObjectBounds(drgDiv, obj.top, obj.left, obj.width, obj.height)
		.css({
			'text-align': obj.align,
			'overflow': 'hidden',
			'display': 'flex',
			'align-items': 'center',
			'padding-left': '4px',
			'cursor': 'pointer',
			'caret-color': 'transparent'
		}).addClass('nu_' + nuObjectType);

	if (obj.read == '2') {	// hidden
		$id.addClass('nuDragHidden').css('visibility', 'hidden')
	}

	$id.attr('data-drag', 1)
		.attr('data-nu-object-id', obj.object_id);

	if (tagType == 'div') {
		$id.text(id);
	} else {
		$id.val(id).attr('spellcheck', 'false').prop('readonly', true);
	}

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

function nuGetDBColumnLengh(tableName, id) {

	const tableSchema = nuSERVERRESPONSE?.tableSchema;
	if (!tableSchema || !tableName || !tableSchema[tableName]) return 0;

	const columnIndex = tableSchema[tableName].names.indexOf(id);
	if (columnIndex === -1) return 0;

	const dataType = tableSchema[tableName].types[columnIndex].toUpperCase();
	switch (dataType) {
		case "TINYTEXT": return 255;
		case "TEXT": return 65535;
		case "MEDIUMTEXT": return 16777215;
		default:
			if (dataType.includes('CHAR')) {
				return parseInt(dataType.match(/\d+/), 10) || 0;
			}
			return 0;
	}

}

function nuINPUTfileDatabase($formId, obj, id, p) {

	const newElement = nuCreateElementWithId('textarea', id);
	$formId.append(newElement);

	const $id = $(newElement);

	$id
		.css('visibility', 'hidden')
		.attr('data-nu-field', id)
		.attr('data-nu-prefix', p)
		.attr('data-nu-data', '')
		.attr('onchange', 'this.className = "nuEdited"');

	if (!nuIsNewRecord()) {
		$id.val(obj.value);
	}

	return id + '_input';

}

function nuINPUTfileFileSystem($formId, w, i, l, p, prop, id) {

	var obj = prop.objects[i];
	id = id !== undefined ? id : p + obj.id;

	nuCreateElementWithId('div', 'nuBreadcrumb0', p + 'nuRECORD');

	obj = nuLabelOrPosition(obj, w, i, l, p, prop);

	nuAddDataTab(id, obj.tab, p);

	let html = w.objects[i].html;
	html = html.replaceAll('#uppy_div#', id + '_uppy_div');
	html = html.replaceAll('#this_object_id#', id);
	html = html.replaceAll('nuInitUppy()', 'nuInitUppy' + '_' + id + '()');
	html = html.replaceAll('.cssNumber(', '.nuCSSNumber(');

	html = html.replaceAll('new Uppy.Core()', 'new Uppy.Uppy()');

	nuSetObjectBounds($('#' + id), obj.top, obj.left, obj.width, obj.height)
		.addClass('nuFileUppy').html(html);

	nuSetAccess(id, obj.read);
	nuAddStyle(id, obj);

	return Number(obj.width);

}

function nuINPUTInput(inp, inputType, obj, objectType) {

	inp.setAttribute('type', inputType);

	const className = objectType === 'lookup' ? 'nuHiddenLookup' : 'input_' + inputType;
	inp.classList.add(className);

	if (obj.datalist !== null && obj.datalist !== '' && typeof obj.datalist !== "undefined") {
		let dl = obj.datalist;
		if (!Array.isArray(dl)) dl = JSON.parse(dl);
		if (!Array.isArray(dl)) dl = eval(dl);
		nuAddDatalist(inp.id, dl);
	}

}

function nuINPUTnuScroll($id, thisObj) {

	const inputJS = 'nuFORM.scrollList(event, ' + thisObj.scroll + ')';

	$id.addClass('nuScroll')
		.attr('onkeydown', inputJS)
		.attr("title", nuTranslate('Use the keyboard up and down arrows to scroll through the list or add text that is not in the list.'));

}

function nuINPUTnuDate($id, thisObj) {

	$id.addClass('nuDate')
		.attr('data-nu-format', thisObj.format)
		.attr('autocomplete', 'off');

}

function nuINPUTnuNumber($id, thisObj) {

	$id.addClass('nuNumber')
		.attr('data-nu-format', thisObj.format);

}

function nuINPUTCheckbox($id, thisObj, obj) {

	document.getElementById($id.attr('id')).checked = (thisObj.value == '1');

	if (obj.parent_type == 'g') {
		$id.css('margin-top', '1px');
	}

}

function nuINPUTDisplay($id) {
	nuDisable($id.attr('id'));
}

function nuINPUTLookup(id, objId, thisObj, obj, $formId, p, vis) {

	let $id = $('#' + id);
	$id.hide();
	$id.attr('data-nu-lookup-id', '');

	const luv = thisObj.values[0][1];
	if (!nuIsNewRecord() || luv !== '') {
		$('#' + id).val(luv);
	}

	const target = id;
	id = target + 'code';

	const inp = nuCreateElementWithId('input', id);
	$formId.append(inp);

	nuAddDataTab(id, obj.tab, p);

	$id = $('#' + id);
	nuSetObjectBounds($id, obj.top, obj.left, obj.width, obj.height)
		.attr('data-nu-form-id', thisObj.form_id)
		.attr('data-nu-object-id', thisObj.object_id)
		.attr("data-nu-prefix", p)
		.attr('data-nu-target', target)
		.attr('data-nu-type', 'lookup')
		.attr('data-nu-subform-sort', 1)
		.attr('onchange', 'nuGetLookupCode(event)')
		.attr('onfocus', 'nuLookupFocus(event)')
		.css('visibility', vis)
		.addClass('nuLookupCode');

	nuAddJSObjectEvents(id, obj.js);

	if (Number(obj.width) == 0) nuHide(id);

	$id.nuOnEnterKey(function () {
		if ($(this).val().length == 0) {
			let element = $('#' + target + 'button')[0];
			nuBuildLookup(element, "");
		}
	});

	thisObj.values[0][0] = p + obj.id;
	thisObj.values[1][0] = p + obj.id + 'code';
	thisObj.values[2][0] = p + obj.id + 'description';

	id = target + 'button';

	const div = nuCreateElementWithId('div', id);
	$formId.append(div);

	nuAddDataTab(id, obj.tab, p);

	let luClass = obj.label === 'Insert-Snippet' ? 'fa fa-code' : 'fa fa-search';
	let luStyle = "padding:4px";
	if (thisObj.parent_type !== 'g' && nuIsMobile()) {
		luClass += ' fa-lg';
		luStyle += ';padding-top: 15px';
	}

	nuSetObjectBounds(div, obj.top, Number(obj.left) + Number(obj.width) + 6, 15, Number(obj.height - 2))
		.attr('type', 'button')
		.attr("data-nu-prefix", p)
		.attr('data-nu-form-id', thisObj.form_id)
		.attr('data-nu-object-id', thisObj.object_id)
		.attr('data-nu-target', target)
		.attr('data-nu-subform-sort', 1)
		.attr('onfocus', 'nuLookupFocus(event)')
		.attr('onclick', 'nuBuildLookup(this,"")')
		.addClass('nuLookupButton')
		.html('<i style="' + luStyle + '" class="' + luClass + '"></i>')
		.css('visibility', vis);

	if (obj.label === 'Insert-Snippet') $('#' + id).css('font-size', '18px');

	nuAddJSObjectEvents(id, obj.js);

	id = p + obj.id + 'description';
	const desc = nuCreateElementWithId('input', id);
	$formId.append(desc);

	$formId.append(desc);
	nuAddDataTab(id, obj.tab, p);
	$('#' + id).css({
		'top': obj.mobile ? Number(obj.top) + Number(obj.height) + 5 : Number(obj.top),
		'left': obj.mobile ? Number(obj.left) : Number(obj.left) + Number(obj.width) + 25,
		'width': obj.mobile ? Number(obj.width) : obj.description_width,
		'visibility': obj.description_width == 0 || obj.display == 0 ? 'hidden' : 'visible',
		'height': Number(obj.height)
	})
		.attr("data-nu-prefix", p)
		.addClass('nuLookupDescription')
		.nuDisable();


	nuPopulateLookup3(thisObj.values, p);

	nuSetAccess(objId, obj.read);

	nuAddStyle(id, obj);

	return Number(obj.width) + Number(obj.description_width) + 30;

}

function nuINPUTnuAutoNumber($id, obj) {

	nuDisable($id.attr('id'));

	if (!nuIsNewRecord()) {
		$id.val(obj.counter);
	}

}

function nuINPUTCalc($id, thisObj, p) {

	const formula = String(thisObj.formula).nuReplaceAll("al('", "al('" + p);

	$id.addClass('nuCalculator')
		.attr('data-nu-format', thisObj.format)
		.attr('data-nu-calc-order', thisObj.calc_order)
		.attr('data-nu-formula', formula)
		.nuDisable();

	if (p != '') {
		$id.addClass('nuSubformObject');
	}

}

function nuINPUTSetValue($id, thisObj, inputType) {

	if (inputType == 'button') {
		$id.html(nuTranslate(thisObj.value));
		$id.attr("data-nu-org-label", thisObj.value);
	} else {

		if (inputType == 'datetime-local') {													//-- replace ' ' between date and time with 'T'
			thisObj.value = thisObj.value === null ? null : thisObj.value.replace(' ', 'T');
		}

		if (!nuIsNewRecord() || thisObj.value !== '') {
			$id.val(nuFORM.addFormatting(thisObj.value, thisObj.format));
		}

	}

}

function nuIPUTNuChangeEvent(obj, inputType, objectType) {

	let change = 'nuChange(event)';

	if (inputType == 'file' && obj.file_target == '1') {
		change = '';
	} else if (inputType == 'file') {
		change = 'nuChangeFile(event)';
	} else if (objectType == 'lookup') {
		change = 'nuGetLookupId(this.value, this.id)';
	}

	return change;

}

function nuINPUTSetProperties($id, obj, inputType, objectType, thisObj, p) {

	const leftInc = inputType == 'button' && p != '' ? 3 : 0;

	$id.css({
		'top': Number(obj.top),
		'left': Number(obj.left) + leftInc,
		'width': Number(obj.width),
		'height': Number(obj.height),
		'text-align': obj.align,
		'position': 'absolute'
	})
		.attr('onchange', nuIPUTNuChangeEvent(obj, inputType, objectType))
		.attr('data-nu-field', inputType == 'button' || inputType == 'file' ? null : obj.id)
		.attr('data-nu-object-id', thisObj.object_id)
		.attr('data-nu-format', '')
		.attr('data-nu-prefix', p)
		.attr('data-nu-type', objectType)
		.attr('data-nu-subform-sort', 1)
		.attr('onfocus', 'nuLookupFocus(event)');

	if (inputType != 'button') {
		$id.attr('data-nu-data', '')
			.attr('data-nu-label', thisObj.label)
	} else {
		$id.addClass('nuButton');
	}

	if (thisObj.value != '' && nuRecordId() == '-1') {				//== check for Cannot be left blank
		$id.addClass('nuEdited');
	}

}

function nuINPUTSetMaxLength($id, inputType, objectType, w) {

	const types = ['text', 'url', 'telephone', 'search', 'password', 'month', 'email', 'color', 'nuScroll'].indexOf(inputType) !== -1;
	if ((types && objectType == 'input') || objectType == 'textarea') {

		const field = $id.attr('data-nu-field');
		const len = nuGetDBColumnLengh(w.table, field);

		if (len !== 0) $id.attr('maxlength', len);

	}

}

function nuINPUT(formObj, index, layer, prefix, properties) {

	var obj = properties.objects[index];
	const thisObj = formObj.objects[index];
	const objectId = prefix + obj.id;
	const formId = $('#' + prefix + 'nuRECORD');
	const visibility = obj.display === 0 ? 'hidden' : 'visible';
	const inputType = obj.input;

	let objType = obj.type;
	let inputElementType = obj.type === 'textarea' ||
		(obj.type === 'display' && String(obj?.value).includes("\n"))
		? 'textarea'
		: 'input';

	const isFileInputWithTarget = inputType === 'file' && obj.file_target === '1';
	if (inputElementType === 'input' && isFileInputWithTarget) {
		inputElementType = 'div';
	}

	obj = nuLabelOrPosition(obj, formObj, index, layer, prefix, properties);

	let elementId = objectId;
	if (inputElementType === 'input' && inputType === 'file' && !isFileInputWithTarget) {
		elementId = nuINPUTfileDatabase(formId, obj, objectId, prefix);
	}

	const htmlElementType = inputType === 'button' && objType === 'input' ? 'button' : inputElementType;
	const element = nuCreateElementWithId(htmlElementType, elementId, formId.attr('id'));
	const $id = $(element);

	nuAddDataTab(elementId, obj.tab, prefix);
	nuINPUTSetProperties($id, obj, inputType, objType, thisObj, prefix);

	if (inputElementType === 'input' && !isFileInputWithTarget) {
		nuINPUTInput(element, inputType, obj, objType);
	}

	if (isFileInputWithTarget) {
		nuINPUTfileFileSystem(formId, formObj, index, layer, prefix, properties, elementId);
	}

	nuApplyInputTypeSpecificBehaviors($id, inputType, objType, thisObj, obj, prefix);

	if (objType !== 'lookup') {
		nuINPUTSetMaxLength($id, inputType, objType, formObj);
		nuAddJSObjectEvents(elementId, obj.js);
		nuSetAccess(objectId, obj.read);
		nuAddStyle(elementId, obj);
		return Number(obj.width) + (obj.read === 2 ? -2 : 4);
	} else {
		return nuINPUTLookup(elementId, objectId, thisObj, obj, formId, prefix, visibility);
	}

}

function nuApplyInputTypeSpecificBehaviors($id, inputType, objType, thisObj, obj, prefix) {

	switch (inputType) {
		case 'nuScroll':
			nuINPUTnuScroll($id, thisObj);
			break;
		case 'nuDate':
			nuINPUTnuDate($id, thisObj);
			$id.attr('onclick', 'nuPopupCalendar(this);');
			break;
		case 'nuNumber':
			nuINPUTnuNumber($id, thisObj);
			break;
		case 'checkbox':
			nuINPUTCheckbox($id, thisObj, obj);
			break;
	}

	if (objType === 'display') {
		nuINPUTDisplay($id);
	}

	if (objType === 'calc') {
		nuINPUTCalc($id, thisObj, prefix);
	}

	if (inputType !== 'file') {
		nuINPUTSetValue($id, thisObj, inputType);
	}

	if (thisObj.input === 'nuAutoNumber') {
		nuINPUTnuAutoNumber($id, thisObj);
	}

	if (inputType == 'button' && objType == 'input') {
		nuAddInputIcon($id.attr('id'), thisObj.input_icon);
	}

}

function nuParseAttributes(attr = '') {

	if (!attr) return [];
	const parts = attr.match(/(?:[^,"']+|"[^"]*")+/g) || [];
	return parts.map(part => {
		let [rawKey, ...rest] = part.split('=');
		const key = rawKey.trim();
		const value = rest.join('=').trim().replace(/^"(.*)"$/, '$1');
		return { key, value };
	});

}

function nuApplyAttributes(id, attrs) {

	const el = document.getElementById(id);
	if (!el) return;
	attrs.forEach(({ key, value }) => {
		switch (key) {
			case 'value':
				if (value && nuIsNewRecord()) {
					const type = $('#' + id).attr('data-nu-type');
					if (type === 'lookup') {
						nuGetLookupId(value, id, false, false);
					} else {
						$('#' + id).nuSetValue(value);
					}
					nuHasNotBeenEdited();
				}
				break;
			case 'nu-label-position':
				if (value === 'top') {
					$('#' + id).nuLabelOnTop();
				} else {
					el.setAttribute(key, value);
				}
				break;
			default:
				el.setAttribute(key, value);
		}
	});

}

function nuAddAttributes(id, attr = '') {

	const attrs = nuParseAttributes(attr);
	nuApplyAttributes(id, attrs);

}


function nuAddInputIcon(id, icon) {

	function addIcon(id, string, after) {
		if (string.startsWith('fa')) {
			nuAttachFontAwesome(id, string, 'normal', after);
		} else {
			nuAttachHTML(id, string, after);
		}
		$('#' + id)[0].setAttribute('nu-data-icon', string);
		//	$('#' + id)[0].setAttribute('nu-data-icon-after', after);
	}

	if (icon !== undefined && icon !== null && icon !== '' && !nuUserA11Y()) {

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

	const $id = $('#' + id);

	if (obj.style_type !== '' && obj.style !== '') {

		if (obj.style_type == 'CSS') {

			if (obj.style.startsWith('{')) {
				nuAddStyleFromArray(id, obj);
			} else {
				let css = $('#' + id)[0].getAttribute("style");
				css = css === null ? obj.style : css += obj.style;
				$id[0].setAttribute("style", css);
			}
		} else if (obj.style_type == 'Class') {

			if (obj.style.startsWith('{')) {
				nuAddStyleFromArray(id, obj);
			} else {
				$id.addClass(obj.style);
			}

		}
	}

}

function nuAddDblClickOpenObjectProperties(obj, objId) {
	if (nuGlobalAccess()) {
		obj.on('dblclick', function () {
			nuDestroyWindowProperty('nudatepickers');
			nuOptionsListAction("nuobject", objId);
		});
	}
}

function nuLookupFocus(e) {

	const objT = $(e.target);
	const p = objT.attr('data-nu-prefix');
	const t = objT.attr('data-nu-type');

	window.nuSubformRow = Number(p.substr(p.length - 3));

	if (t != 'textarea') {
		objT.trigger("select");
	}

}

function nuSelectOnFocus(e) {

	const $field = $(e.target);
	$field.attr('data-nu-org-value', $field.val());
	nuLookupFocus(e);

}

function nuCurrentRow() {
	return window.nuSubformRow;
}

function nuSetAccess(id, r) {

	if (r == 2 || r == 3 || r == 4) { // hidden

		const o = [id, id + 'code', id + 'button', id + 'description', 'label_' + id];

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

	if (r == 1 || r == 4) {
		nuDisable(id);
	}

	$('#' + id).attr('data-nu-access', r);

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

function nuSetObjectBounds(obj, top = null, left = null, width = null, height = null, absolute = null) {

	obj = obj.jquery ? obj[0] : obj;

	if (top !== null)
		obj.style.top = top + 'px';
	if (left !== null)
		obj.style.left = left + 'px';
	if (height !== null)
		obj.style.height = height + 'px';
	if (width !== null)
		obj.style.width = width + 'px';
	if (absolute || absolute === null)
		obj.style.position = 'absolute';

	return $(obj);

}

function nuHTML(w, i, l, p, prop, id) {

	let obj = prop.objects[i];
	id = id !== undefined ? id : p + obj.id;

	const div = nuCreateElementWithId('div', id, p + 'nuRECORD');

	obj = nuLabelOrPosition(obj, w, i, l, p, prop);

	nuAddDataTab(id, obj.tab, p);

	nuSetObjectBounds(div, obj.top, obj.left, obj.width, obj.height)
		.addClass('nuHtml').html(w.objects[i].html);

	nuSetAccess(id, obj.read);
	nuAddStyle(id, obj);

	return Number(obj.width);

}

function nuEDITOR(w, i, l, p, prop) {

	const obj = prop.objects[i];

	prop.objects[i].type = 'textarea';
	nuINPUT(w, i, l, p, prop);
	$('#' + obj.id).addClass('nuEditor');

	const id = obj.id + '_parent_container';
	nuHTML(w, i, l, p, prop, id);

	$('#' + id).html('<div style="width:' + obj.width + 'px;height:' + obj.height + 'px" id="' + obj.id + '_container" class="' + "nuTinyMCE" + '"> </div>');
	nuAddStyle(id, obj);

	return Number(obj.width);

}

function nuCONTENTBOX(w, i, l, p, prop) {

	const obj = prop.objects[i];
	const id = p + obj.id;

	const div = nuCreateElementWithId('div', id, p + 'nuRECORD');

	nuAddDataTab(id, obj.tab, p);
	if (nuIsMobile()) {
		obj.width = 0;
	}
	nuSetObjectBounds(div, obj.top, obj.left, obj.width, obj.height).css('z-index', '-1')
		.attr('data-nu-object-id', w.objects[i].object_id)
		.attr('data-nu-prefix', p)
		.addClass('nuContentBoxContainer').html(w.objects[i].html);

	nuAddDblClickOpenObjectProperties($('#label_' + id), obj.object_id);

	nuSetAccess(id, obj.read);
	nuAddStyle(id, obj);

	return Number($(div).width());

}

function nuIMAGE(w, i, l, p, prop) {

	let obj = prop.objects[i];
	const id = p + obj.id;

	const img = nuCreateElementWithId('img', id, p + 'nuRECORD');

	obj = nuLabelOrPosition(obj, w, i, l, p, prop);

	nuAddDataTab(id, obj.tab, p);

	let $img = $(img);
	nuSetObjectBounds(img, obj.top, obj.left, obj.width).addClass('nuImage');
	if (obj.height !== "-1" && obj.width !== "-1") {
		nuSetObjectBounds($img, null, null, obj.width, obj.height);
	}

	$img.attr('src', atob(w.objects[i].src));
	$img.on('error', function () {
		$(this).off('error').attr('src', 'core/graphics/default-image.png');
	});

	nuSetAccess(id, obj.read);
	nuAddJSObjectEvents(id, obj.js);
	nuAddStyle(id, obj);

	return Number($img.width());

}

function nuWORD(w, i, l, p, prop) {

	const obj = prop.objects[i];
	const id = p + obj.id;

	const div = nuCreateElementWithId('div', id, p + 'nuRECORD');

	nuAddDataTab(id, obj.tab, p);

	let t = w.objects[i].word;
	const r = /<n>(.*?)<\/n>/g.exec(t);
	t = r === null ? t : r[1];

	let $div = $(div);
	nuSetObjectBounds(div, obj.top, obj.left, obj.width, obj.height)
		.css('text-align', obj.align)
		.addClass('nuWord')
		.html(nuTranslate(t));

	nuAddDblClickOpenObjectProperties($div, obj.object_id);

	if (r !== null) {
		$div.css('font-weight', 'normal');
	}

	nuAddInputIcon(id, obj.input_icon);
	nuSetAccess(id, obj.read);
	nuAddStyle(id, obj);

	return Number(obj.width);

}

function nuRUNGetOnClickEvent(obj) {

	let result = '';
	const runTarget = obj.run_target || '0';

	const stopClick = runTarget == '0' ? 'nuStopClick(event);' : '';
	const jsPopup = `nuPopup('${obj.form_id}','${obj.record_id}','${obj.filter}')`;
	const jsForm = `nuForm('${obj.form_id}','${obj.record_id}','${obj.filter}', '','${runTarget}')`;
	const runAction = runTarget == '3' ? jsPopup : jsForm;

	const runType = obj.run_type;
	if (runType == 'F') {
		result = stopClick + runAction;
	} else
		if (runType == 'R') {
			result = "nuRunReport('" + obj.record_id + "')";
		} else
			if (runType == 'P') {

				result = obj.run_hidden
					? `nuRunPHPHidden('${obj.record_id}')`
					: `nuRunPHP('${obj.record_id}')`;

			}

	return result;

}

function nuRUN(w, i, l, p, prop) {

	let obj = prop.objects[i];
	let id = p + obj.id;
	let tagName = 'button';

	if (obj.parent_type == 'g') {
		obj.left = l;
		obj.top = 3;
	}

	if (obj.run_method != 'b') {
		tagName = 'iframe';
		if (obj.parent_type !== 'g') {
			nuLabel(w, i, p, prop);
		}
	}

	const div = nuCreateElementWithId(tagName, id, p + 'nuRECORD');
	const $div = $(div);

	nuAddDataTab(id, obj.tab, p);

	nuSetObjectBounds(div, obj.top, obj.left, obj.width, obj.height).css('text-align', obj.align)
		.attr('data-nu-object-id', w.objects[i].object_id)
		.attr('data-nu-prefix', p);

	if (obj.run_method == 'b') {

		$div.attr({
			'type': 'button',
			'value': nuTranslate(obj.label),
			'onclick': nuRUNGetOnClickEvent(obj)
		})
			.html(nuTranslate(obj.label))
			.addClass('nuButton');

		$('#' + id).attr("data-nu-org-label", obj.label);

		nuAddInputIcon(id, obj.input_icon);

	} else {

		window.nuOPENER.push(new nuOpener(obj.run_type, obj.form_id, obj.record_id, obj.filter, obj.parameters));

		const open = window.nuOPENER[window.nuOPENER.length - 1];
		const url = window.location.pathname + '?i=2&opener=' + open.id;

		$div.attr('src', url).removeClass('').addClass('nuIframe');

	}

	nuAddJSObjectEvents(id, obj.js);
	nuSetAccess(id, obj.read);
	nuAddStyle(id, obj);

	return Number(obj.width);

}

function nuSELECT(w, i, l, p, prop) {

	let obj = prop.objects[i];
	const id = p + obj.id;

	obj = nuLabelOrPosition(obj, w, i, l, p, prop);

	const sel = nuCreateElementWithId('select', id, p + 'nuRECORD');

	let $sel = $(sel);

	if (w.objects[i].value != '' && nuRecordId() == '-1') {
		$sel.addClass('nuEdited');
	}

	nuAddDataTab(id, obj.tab, p);

	if (obj.multiple == 1) {
		$sel.attr('multiple', 'multiple');
	}

	if (obj.select2 == 1) {

		let select2Id = nuSetSelect2(id, obj);
		nuAddDataTab(select2Id, obj.tab, p);

	};

	$sel.css({
		'top': Number(obj.top),
		'left': Number(obj.left),
		'width': Number(obj.width),
		'position': 'absolute'
	})
		.attr('onfocus', 'nuSelectOnFocus(event)')
		.attr('onchange', 'nuChange(event)')
		.attr('data-nu-field', obj.id)
		.attr('data-nu-object-id', w.objects[i].object_id)
		.attr('data-nu-format', '')
		.attr('data-nu-subform-sort', 1)
		.attr('data-nu-data', '')
		.attr('data-nu-label', w.objects[i].label)
		.attr('data-nu-prefix', p);


	$sel.css('height', Number(obj.height));

	var s = String(w.objects[i].value);
	var a = [];

	if (w.objects[i].multiple == 0 || w.objects[i].multiple === null) {
		a = [s];
	}

	// Check if the string starts and ends with '[]'
	if (/^\[.*\]$/.test(s)) {
		eval('a = ' + s);
	}

	$sel.append('<option value=""></option>');

	let hasSelected = false;
	if (obj.options !== null) {

		for (let n = 0; n < obj.options.length; n++) {

			const opt = String(obj.options[n][1]); // .replaceAll(' ', '&#160;');

			if (a.indexOf(String(obj.options[n][0])) == -1) {
				$sel.append('<option value="' + obj.options[n][0] + '">' + opt + '</option>');
			} else {
				$sel.append('<option selected="selected "value="' + obj.options[n][0] + '">' + opt + '</option>');
				hasSelected = true;
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

function nuSUBFORMAddCSS(id, SF) {

	nuSetObjectBounds($('#' + id), SF.top, SF.left, SF.width, Number(SF.height) + 2)
		.css({
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

}

function nuSUBFORMScrollDivAddCSS(id, SF, scrId, rowTop, rowWidth) {

	nuSetObjectBounds($('#' + scrId), rowTop, 0, Number(rowWidth) + 1, Number(SF.height) - rowTop + 1)
		.css({
			'border-width': 10,
			'overflow-x': 'hidden',
			'overflow-y': 'scroll',
			'position': 'absolute'
		});

	if (rowWidth > Number(SF.width)) {

		$('#' + id).css('overflow-x', 'scroll');
		$('#' + scrId).css('height', SF.height - rowTop - 25);

	}

}

function nuSUBFORMnuTabHolderAddCSS(tabId, rowTop, rowWidth) {

	nuSetObjectBounds($('#' + tabId), 0, 0, rowWidth, rowTop)
		.css({
			'overflow-x': 'hidden',
			'overflow-y': 'hidden',
			'position': 'absolute',
			'padding': '12px 0px 0px 0px'
		})
		.addClass('nuTabHolder')
		.attr('data-nu-subform', tabId)
		.prepend('&nbsp;&nbsp;&nbsp;');

}

function nuSUBFORMnuRECORDAddCSS(frmId, rowTop, rowWidth, rowHeight, even) {

	nuSetObjectBounds($('#' + frmId), rowTop, 0, rowWidth, rowHeight)
		.addClass('nuSubform' + even);

}

function nuCreateElementWithId(tagName, id, parentElement) {

	const newElement = document.createElement(tagName);
	newElement.setAttribute('id', id);
	if (parentElement !== undefined) {
		document.getElementById(parentElement).appendChild(newElement);
	}

	return newElement;

}

function nuGetSubformDimensions(SF) {

	let sfTypeGrid = SF.subform_type == 'g';
	let sfType = sfTypeGrid ? 'grid' : 'edit';
	let rowHeight = Number(SF.dimensions[sfType].height + (sfTypeGrid ? 0 : 10));
	let rowWidth = Number(SF.dimensions[sfType].width + (sfTypeGrid ? 55 : 10));
	rowWidth = SF.delete == '1' ? rowWidth - 3 : rowWidth - 25;
	rowTop = sfTypeGrid ? 52 : 33;

	return { rowHeight, rowWidth, rowTop };
}

function nuSUBFORM(w, i, l, p, prop) {

	var SF = prop.objects[i];								//-- First row
	var subformRows = w.objects[i];							//-- All rows

	let id = p + SF.id;
	nuCreateElementWithId('div', id, p + 'nuRECORD');  		//-- Edit Form Id
	nuAddDataTab(id, SF.tab, p);
	nuSUBFORMAddCSS(id, SF);
	nuAddJSObjectEvents(id, SF.js);

	if (SF.forms[0] !== undefined) {
		nuGetSubformRowSize(SF.forms[0].objects, SF, id);
	}

	let sfDimensions = nuGetSubformDimensions(SF);
	let rowHeight = sfDimensions.rowHeight;
	let rowWidth = sfDimensions.rowWidth;
	let rowTop = sfDimensions.rowTop;

	var tabId = id + 'nuTabHolder';
	var tabDiv = document.createElement('div');
	tabDiv.setAttribute('id', tabId);
	$('#' + id).prepend(tabDiv);

	nuSUBFORMnuTabHolderAddCSS(tabId, rowTop, rowWidth);

	if (SF.subform_type == 'f') {
		nuAddEditTabs(id, SF.forms[0]);
	} else {

		if (subformRows.forms.length > 0) {

			let tab0 = subformRows.forms[0].tabs[0];
			nuTABHELP[tab0.id] = tab0.help;
			nuFORMHELP[SF.id] = tab0.help;

		}

	}

	nuOptions(SF.sf_form_id, id, 'subform', w.global_access);

	var scrId = id + 'scrollDiv';
	let scrDiv = nuCreateElementWithId('div', scrId, id);
	scrDiv.setAttribute('class', 'nuSubformScrollDiv');

	nuSUBFORMScrollDivAddCSS(id, SF, scrId, rowTop, rowWidth);

	rowTop = 0;
	let prefix;

	for (var c = 0; c < subformRows.forms.length; c++) {

		prefix = id + nuPad3(c);
		const frmId = prefix + 'nuRECORD';
		nuCreateElementWithId('div', frmId, scrId);

		nuSUBFORMnuRECORDAddCSS(frmId, rowTop, rowWidth, rowHeight, c % 2 == 0 ? '1' : '0');
		nuBuildEditObjects(subformRows.forms[c], prefix, SF, SF.forms[0]);
		SF.forms[c].deletable = SF.delete == '1' ? '1' : '0';
		nuRecordProperties(SF.forms[c], prefix, rowWidth - 40);

		rowTop = Number(rowTop) + Number(rowHeight);

	}

	if (prefix != '') {

		if (SF.add == 1) {
			nuNewRowObject(String(prefix));
		} else {
			$('#' + prefix + 'nuRECORD').hide();

		}

	}

	nuLabelOrPosition(SF, w, i, l, p, prop);
	nuSetAccess(id, SF.read);
	nuAddStyle(id, SF);

	return Number(SF.width);

}

// DEV:
function nuWrapWithForm(element, formAction, formMethod) {
	// 1. Create the form element
	const form = document.createElement('form');
	// form.onsubmit = function() { return false; }; // Add the onsubmit handler
	form.setAttribute('onsubmit', 'return false'); // Add onsubmit attribute

	form.id = 'myForm'; // Set the desired ID

	// form.action = formAction;
	//  form.method = formMethod;

	// 2. Get the element's parent (to insert the form before it)
	const parent = element.parentNode;

	// 3. Insert the form before the original element
	parent.insertBefore(form, element);

	// 4. Move the original element inside the form
	form.appendChild(element);
}


function nuNewRowObject(p) {

	const sf = p.substr(0, p.length - 3);
	if ($('#' + p + 'nuRECORD').length == 0) {
		return;
	}

	let html = document.getElementById(p + 'nuRECORD').outerHTML;

	window.nuSUBFORMROW[sf] = String(html.nuReplaceAll(p, '#nuSubformRowNumber#', true));

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

	const formCode = $('#' + id).attr('data-nu-form');
	return $('#' + formCode + nuSubformRowNumber(id) + column);

}

function nuSubformValue(t, id) {

	const p = $(t).attr('data-nu-prefix');
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

function nuSubformHideHeader(id) {
	const scrollDiv = $('#' + id + 'scrollDiv');
	scrollDiv.css({ top: 0, height: $('#' + id).nuCSSNumber('height') });
}

function nuSubformFocusLastRow(id, f) {

	const sf = nuSubformObject(id);
	const c = f === undefined ? sf.fields[1] : sf.fields.indexOf(f);
	const r = sf.rows.length - 1;

	$('#' + id + nuPad3(r) + c).trigger("focus");

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
			h = window.innerHeight - sf.nuCSSNumber('Top') - nuDialogHeadersHeight() - 50;
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
	let totalwidth = $('#' + sf).nuCSSNumber('width');

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
				totalwidth -= h.nuCSSNumber('width');
				h.nuHide();
			}
		} else {

			if (obj(p0).attr('data-nu-type') == 'lookup') {
				obj(p + 'code').css('left', width);
				width = obj('code').nuCSSNumber('width') + width + 6;
				obj(p + 'button').css('left', width);
				width += 19;
				obj(p + 'description').css('left', width);
				width = obj('description').nuCSSNumber('width') + width + 6;
			} else {
				obj(p).css('left', width);
				width = obj(p0).nuCSSNumber('width') + width + 6;
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

	$arr =
		$('#' + sfName).children().filter('.nuSubformTitle').map(function () {
			return this.getAttribute("data-nu-field");
		}).get();

	return $arr;

}

function nuSubformMoveFocus(activeElement, d) {

	let row = activeElement.attr('data-nu-prefix').slice(-3);
	let nextRow = $('#' + activeElement.attr('data-nu-form') + nuPad3(Number(row) + d) + activeElement.attr('id').substr(activeElement.attr('data-nu-form').length + 3));
	if (nextRow.length == 1 && !nextRow.prop('disabled')) nextRow.trigger("focus");

	return true;

}

function nuSubformHandleArrowKeyEvent(e) {

	let activeElement = $(document.activeElement);
	let nuScroll = activeElement.hasClass('nuScroll');

	var result;
	switch (e.key) {
		case 'ArrowUp':
			result = !nuScroll && nuSubformMoveFocus(activeElement, -1);
			break;
		case 'Enter':
			result = nuSubformMoveFocus(activeElement, 1);
			break;
		case 'ArrowDown':
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
				if (prop !== undefined && prop.placeholder) obj.nuSetPlaceholder(prop.placeholder);

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
			top = rec.nuCSSNumber('top');
			let o = { 'obj': rec.attr('id'), 'top': top };
			rec.data('nu-top-position', top); // save top position

			arr.push(o);
			r++;
		});

		let rows = arr.sort(nuSubformSortTop);

		let rowHeight = $('#' + sfName + '000nuRECORD').nuCSSNumber('height');
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

function nuSortSubform(sfName, c, e) {

	if (!e.target.classList.contains('nuSubformTitle')) return;

	var sf = [];
	const obj = nuSubformObject(sfName);
	const so = obj.fields[c];
	const count = obj.rows.length;
	var h = 0;
	var t = false;
	const objSf = $('#' + sfName);
	var noAdd = objSf.attr('data-nu-add') == '0';

	const records = $("[ID^='" + sfName + "'][ID$='nuRECORD']");
	const newRecord = records.last();
	const newRecordId = newRecord.attr('id');

	records.each(function (index) {

		var id = this.id;

		if (id !== newRecordId) { // exclude new record

			const f = this.id.replaceAll('nuRECORD', '');
			h = parseInt($(this).css('height'), 10);

			const objF = $('#' + f + so);
			t = objF.hasClass('input_number') || objF.hasClass('input_nuNumber') || objF.hasClass('nuCalculator');
			let v = objF.val();
			let m = objF.attr('data-nu-format');
			const l = objF.hasClass('nuHiddenLookup');

			if (m != '') {
				v = nuFORM.removeFormatting(v, m);
			}

			if (l) {
				v = $('#' + f + so + 'code').val();
			}

			const o = { 'form': id, 'value': v };
			if (!(index == count && noAdd)) sf.push(o);

		}

	});

	let rows;
	if ($(e.target).attr('data-nu-order') == 'asc') {

		rows = t ? sf.sort(nuDecendingSortNumberColumn) : sf.sort(nuDecendingSortColumn);
		$(e.target).attr('data-nu-order', 'desc');

	} else {

		rows = t ? sf.sort(nuAscendingSortNumberColumn) : sf.sort(nuAscendingSortColumn);
		$(e.target).attr('data-nu-order', 'asc');

	}

	let top = 0;

	for (let i = 0; i < rows.length; i++) {

		$('#' + rows[i].form).css('top', top).data('nu-top-position', top); // save top position
		top = top + h;

	}

	newRecord.css('top', top).data('nu-top-position', top);

	if (objSf.data('nu-filtered') === true) {
		objSf.find('.nuSubformFilter').first().trigger("change");
	}

}

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

	nuRunPHPHidden(p);

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

	nuRunPHPHidden(p);

}

function nuGetClipboardText(e) {

	const cb = (e.clipboardData || e.originalEvent.clipboardData || window.clipboardData);
	const dataFormat = cb?.getData ? (window.clipboardData ? 'Text' : 'text/plain') : '';
	return cb && dataFormat ? cb.getData(dataFormat) : '';

}

function nuSubformUndoPaste(t) {

	if (confirm(nuTranslate("Undo the last paste? (The values before the insertion will be restored)?"))) {
		$("[data-prevalue]").each(function () {
			var v = $(this).attr("data-prevalue");
			$(this).val(v).trigger("change");
		});
		nuHide($(this).attr('id'));
	}
}

function nuSubformPaste(e, jsonObj) {

	const id = e.target.id;
	$id = $('#' + id);

	const sfId = $id.attr('data-nu-form');
	const field = $id.attr('data-nu-field');
	const dRow = parseInt($('#' + String(id)).attr('data-nu-prefix').slice(-3), 10);
	const obj = nuSubformObject(sfId);
	const dColStart = obj.fields.indexOf(field);
	const sNumRows = jsonObj.length;
	const sNumCols = Object.keys(jsonObj[0]).length;

	let sc = 0;

	let modifiedObjects = [];
	for (let c = dColStart; c < (dColStart + sNumCols); c++) {
		var sr = 0;
		for (let r = dRow; r < parseInt(dRow + sNumRows, 10); r++) {
			let dest = $('#' + sfId + nuPad3(r) + obj.fields[c]);
			dest.attr("data-prevalue", dest.val());
			dest.val(jsonObj[sr][sc]).trigger("change");
			modifiedObjects.push(dest);
			sr++;
		}
		sc++;
	}

	return modifiedObjects;

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

function nuCopyToClipboard(s) {

	navigator.clipboard.writeText(s).then(function () {
		return true;
	}, function () {
		return false;
	});

}

function nuSubformEnableMultiPaste(subformId, selector, undoButton, callback) {

	$(selector).not(".nuReadonly").on('paste', function (e) {
		var clipText = nuGetClipboardText(e);

		if (clipText.indexOf('\t') >= 0 || clipText.indexOf('\n') >= 0) {

			var clipRows = nuGetClipboardRows(clipText);
			var jsonObj = nuGetClipboardJson(clipRows);

			e.stopPropagation();
			e.preventDefault();

			if (confirm(nuTranslate("Paste Data? Existing data might get overwritten"))) {
				$('[data-nu-form="' + subformId + '"]').removeAttr("data-prevalue");
				const modifiedObjects = nuSubformPaste(e, jsonObj);

				if (undoButton) {
					nuShow(undoButton);
				}

				if (callback !== undefined) {
					callback(modifiedObjects);
				}

				window.nuNEW = 0;

			}
		}

	});

}

function nuSubformHeaderToSeparatedString(fields, delimiter, includeId) {

	const start = includeId ? 0 : 1;
	let headerString = '';
	for (let i = start; i < fields.length; i++) {
		headerString += fields[i] + delimiter;
	}
	return headerString.slice(0, -1) + '\n'; // Remove the last delimiter and add a newline

}

function nuSubformRowToSeparatedString(rows, delimiter, includeId) {

	const processRow = function (row, includeId) {
		let finalVal = '';
		const start = includeId ? 0 : 1;
		for (let j = start; j < row.length; j++) {
			let innerValue = row[j] === null ? '' : row[j].toString();
			if (row[j] instanceof Date) {
				innerValue = row[j].toLocaleString();
			}
			let result = innerValue.replace(/"/g, '""');
			if (result.search(/("|,|\n)/g) >= 0)
				result = '"' + result + '"';
			if (j > start)
				finalVal += delimiter;
			finalVal += result;
		}
		return finalVal + '\n';
	};

	let output = "";
	for (let i = 0; i < rows.length; i++) { // Include the last row
		output += processRow(rows[i], includeId);
	}

	return output;

}

function nuSubformToClipboard(id, delimiter, includeHeader, includeId) {

	const obj = nuSubformObject(id);

	let s = "";

	delimiter = delimiter || '\t';
	includeId = Boolean(includeId);

	if (includeHeader) {
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

	this.form = i.substring(0, i.length - 3 - h.length);
	this.strNo = i.substring(this.form.length, this.form.length + 3);

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
	ts.trigger("click");

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

function nuLabelGetValidationClass(validationId) {

	const classMap = {
		0: 'nuNone',
		1: 'nuBlank',
		2: 'nuDuplicate',
		3: 'nuDuplicateOrBlank'
	};

	return classMap[validationId];

}

function nuLabel(w, i, p, prop) {

	let obj = prop.objects[i];

	if (!obj.label && obj.type === 'subform') {
		obj.label = ' ';
	}

	if (obj.label == '' || obj.display == 0 || obj.label == "Insert-Snippet") {
		return;
	}

	const id = 'label_' + p + obj.id;
	// Workaround: Prevent label from being added twice for Editor
	let objLabel = document.getElementById(id);
	if (objLabel) {
		return objLabel;
	}

	objLabel = nuCreateElementWithId('label', id, p + 'nuRECORD');
	const label = nuTranslate(String(obj.label));
	const lwidth = nuGetWordWidth(label, 'label');
	const forId = obj.type == 'lookup' ? p + obj.id + 'code' : p + obj.id;

	if (obj.type === 'subform') {
		const subform = nuSubformObject(forId);
		const fieldId = subform.fields?.[1];
		if (fieldId) {
			const firstSfElement = `${forId}000${fieldId}`;
			objLabel.setAttribute('for', firstSfElement);
		}
	} else {
		objLabel.setAttribute('for', forId);
	}

	nuAddDataTab(id, obj.tab, p);
	nuSetObjectBounds(objLabel, obj.top, Number(obj.left) - lwidth + -17, Number(lwidth + 12)).html(label);

	nuAddDblClickOpenObjectProperties($('#' + id), obj.object_id);

	if (label == ' ') {
		label.innerHTML = '&#8199;';
	}

	$('#' + id).attr("data-nu-org-label", obj.label);

	objLabel.classList.add(nuLabelGetValidationClass(obj.valid), 'nuLabel');

	return objLabel;

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

	return $('#' + t);

}


function nuGetWordWidth(text, refElem) {

	const W = 'nuTestWidth';

	// Create temporary measuring element
	const $temp = $("<div>", {
		id: W,
		text: text,
		css: {
			position: 'absolute',
			visibility: 'hidden',
			whiteSpace: 'nowrap',
			width: 'auto'
		}
	}).appendTo('body');

	// Copy font-related styles from the reference element
	if (refElem && refElem.length && refElem[0] instanceof Element) {
		const computed = window.getComputedStyle(refElem[0]);
		$temp.css({
			fontSize: computed.fontSize,
			fontFamily: computed.fontFamily,
			fontWeight: computed.fontWeight,
			fontStyle: computed.fontStyle,
			letterSpacing: computed.letterSpacing,
			textTransform: computed.textTransform
		});
	}

	const width = $temp.outerWidth();
	$temp.remove();

	return width + 5; // Optional buffer

}

function nuGetSubformRowSize(o, SF, id) {

	var l = -3;
	var w = 0;

	for (var i = 0; i < o.length; i++) {

		var descriptionWidth = Number(o[i].description_width);
		const oType = o[i].type;

		var B = oType == 'lookup' ? 26 : 0;						//-- lookup button
		var D = oType == 'lookup' ? descriptionWidth : 0;		//-- lookup description

		if (oType == 'select') {
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
		'font-size': '10px',
		'padding': 0,
		'position': 'absolute'
	})
		.html('<img id="nuMoveable" src="graphics/numove.png" style="padding:8px;width:12px;height:12px;" title="Arrange Objects"><br>Delete')
		.addClass('nuTabHolder')
		.attr('onclick', 'nuPopup("' + subform_id + '", "-2");');

}

function nuAddBreadcrumbs() {

	const breadcrumbLength = window.nuFORM.breadcrumbs.length;
	const iStart = nuMainForm() ? 1 : 0;

	for (let i = iStart; i < breadcrumbLength; i++) {
		nuAddBreadcrumb(i);
	}

}

function nuGetTitleNew(bc, title = 'New') {

	if (nuFormType() == 'edit' && bc.form_type != 'launch' && nuIsNewRecord()) {
		const breadcrumbLength = nuFORM.breadcrumbs.length;
		const browseFormId = breadcrumbLength < 2 ? '' : nuFORM.breadcrumbs[breadcrumbLength - 2].form_id;
		const thisFormId = bc.form_id;
		return thisFormId !== browseFormId ? `${nuTranslate(bc.form_description)} (${title})` : title;
	}

	return false;

}

function nuBreadcrumbTitleWithoutBrowse() {

	const breadcrumbs = window.nuFORM.breadcrumbs;
	const lastBreadcrumb = breadcrumbs[breadcrumbs.length - 2];

	if (!(lastBreadcrumb?.form_id === nuFormId() && lastBreadcrumb?.browse_columns.length)) {
		const title = breadcrumbs[breadcrumbs.length - 1].title;
		const formDescription = nuTranslate(nuCurrentProperties().form_description);
		const breadcrumbLength = $('.nuBreadcrumb').length;
		if (formDescription !== title) {
			$('#nuBreadcrumb' + breadcrumbLength).html(formDescription + ' | ' + title);
		}
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

	let title = bc.title;

	/* DEV
	if (bc.form_code.startsWith('nu')) {
		title = nuGetTitleNew('New') || title;
	}
	*/

	$id.css('font-size', '14px')
		.html(h + nuTranslate(title));

	if (nuFormId().startsWith('nu') && nuFormType() == 'edit') {
		nuBreadcrumbTitleWithoutBrowse();
	}

	if (isLast) {
		$id.addClass('nuNotBreadcrumb');
	} else {
		$id.addClass('nuBreadcrumb')
			.attr('onclick', 'nuGetBreadcrumb(' + i + ')')
	}

	if (i == 0) {
		$('#nuarrow0').remove();
	}

}

function nuMainForm(ignoreOpener = false) {

	if (opener && !ignoreOpener) {

		try {
			return nuDocumentID == opener.nuDocumentID;
		} catch (error) {
			return false;
		}
	}

	return nuDocumentID == parent.nuDocumentID;

}

function nuSetBrowseTitle(title) {
	nuSetTitle(title, true);
}


function nuSetTitle(title, browse) {

	if (nuFormType() == 'browse' && !browse == true) {
		return;
	}

	title = nuEscapeHTML(title);

	nuFORM.setProperty('title', title);

	const b = $('.nuBreadcrumb').length;
	let h = '<div id="nuarrow' + (b - 1) + '" class="nuBreadcrumbArrow">&nbsp;<i class="fa fa-caret-right"></i>&nbsp;</div>';

	if (nuFORM.breadcrumbs.length == 1) {
		h = '';
	}

	$('#nuBreadcrumb' + b).html(h + title);

}

function nuAddEditTabs(p, w) {

	if (nuFormType() === 'edit') {
		nuSetStartingTab(p, w);
	}

	w.tabs.forEach(function (tab, i) {
		nuEditTab(p, tab, i);
	});

	let browseTitleMaxLength = 7;

	w.browse_columns.forEach(function (column, i) {
		browseTitleMaxLength = nuBrowseTitle(w.browse_columns, i, browseTitleMaxLength, w.browse_title_multiline);

		if (column.width !== '0') {
			p = i;
		}
	});

	const noSearchColumns = nuFORM.getProperty('nosearch_columns');

	noSearchColumns.forEach(function (column) {
		const nuSortElement = document.getElementById(`nusort_${column}`);
		if (nuSortElement) {
			nuSortElement.classList.add('nuNoSearch');
		}
	});

	window.nuBrowseWidth = browseTitleMaxLength;

	nuDetach();

	if (w.browse_columns.length > 0) {
		nuBrowseTable();
		nuOptions(w.form_id, `nuBrowseTitle${p}`, 'browse', w.global_access);
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

		ts.trigger("click");

	}

}

function nuSetTab(pthis) {

	const tabStart = window.nuFORM.getProperty('tab_start');
	const prefix = pthis.getAttribute('data-nu-form-filter');

	for (let i = 0; i < tabStart.length; i++) {
		if (tabStart[i].prefix === prefix) {
			const tabSelector = `#${tabStart[i].prefix}nuTab${tabStart[i].tabNumber}`;
			const ts = document.querySelector(tabSelector);

			ts.classList.add('nuTabSelected');
			ts.setAttribute('nu-data-clicked-by-system', '');

			ts.trigger("click");

			break;
		}
	}

}

function nuStartingTab(p) {

	this.prefix = p;
	this.tabNumber = 0;

}

function nuEditTab(p, t, i) {

	const tabId = p + 'nuTab' + i;
	let div = document.createElement('div');
	div.setAttribute('id', tabId);

	$('#' + p + 'nuTabHolder').append(div);
	$('#' + tabId)
		.html(nuTranslate(t.title))
		.addClass('nuTab')
		.addClass('nuDragNoSelect')
		.attr('data-nu-tab-filter', i)
		.attr('data-nu-form-filter', p)
		.attr('data-nu-tab-id', t.id)
		.attr('onclick', 'nuSelectTab(this, true)')
		.attr("data-nu-org-label", t.title);

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

function nuOptions(formId, subformId, t, access) {

	if (!nuArrangingObjects()) {

		var id = subformId + 'nuOptions';
		var img = document.createElement('l');

		img.setAttribute('id', id);

		if (t == 'subform') {
			if (nuAllowChanges(formId) && nuGlobalAccess()) {

				$('#' + subformId).prepend(img);

				$('#' + id)
					.attr('title', nuTranslate('Options'))
					.attr('onclick', 'nuGetOptionsList("' + formId + '", "' + subformId + '", "' + access + '", "' + t + '")')
					.addClass('nuIcon nuOptionsSubform fa-fw');

			}

		} else {

			$('#nuBreadcrumbHolder').prepend('<div id="nuHomeGap" class="nuHomeGap"></div>').prepend(img);

			$('#' + id)
				.attr('title', 'Options')
				.attr('onclick', 'nuGetOptionsList("' + formId + '", "' + subformId + '", "' + access + '", "' + t + '")')
				.addClass('nuIcon nuOptions fa-fw');

		}

	}

}

function nuAllowChanges(f) {
	return nuSERVERRESPONSE.form_access == 0 || !String(f).startsWith('nu') || f == 'nuuserhome';
}

function nuHideOptionsItemShortcutKeys() {
	$('.nuOptionsItemShortcutKey').css('visibility', 'hidden');
}

function nuGetOptionsList(formId, subformId, globalAccess, type) {

	const MENU_ID = 'nuOptionsListBox';
	const $existing = $('#' + MENU_ID);

	if ($existing.length) {
		$existing.remove();
		return;
	}

	const buttons = nuSERVERRESPONSE.buttons;
	const canChange = nuAllowChanges(formId);
	const isAdmin = (globalAccess == 1);
	const formHelp = nuFORMHELP[subformId];
	const hasHelp = Boolean(formHelp) && type !== 'subform';
	const [modeFlag] = nuFormType();
	const isEditMode = (modeFlag === 'e');
	const isBrowseMode = (modeFlag === 'b');
	const isSubform = (type === 'subform');
	const isLaunch = (nuFORM.getCurrent().form_type !== 'launch');

	const getLabelSelector = () => {
		const parentId = $('#' + subformId + 'scrollDiv').parent().attr('id');
		return '#label_' + parentId;
	};

	const subformAction = `$("` + getLabelSelector() + `").trigger("dblclick");`;
	const ITEMS = {
		Divider: ['', '', '', ''],
		AddObject: ['Add Object', 'nuPopup("nuobject","-1","")', 'fa fa-plus', 'H'],
		ArrangeObjects: ['Arrange Objects', `nuPopup("${formId}", "-2")`, 'fas fa-arrows-alt', 'A'],
		FormProperties: ['Form Properties', `nuOptionsListAction("nuform", "${formId}")`, 'fa-cog', 'F'],
		SearchableColumns: ['Searchable Columns', 'nuGetSearchList()', 'fa-columns', 'C'],
		SubformObject: [nuTranslate('Subform Object'), subformAction, 'fa-cog', ''],
		FormObjectList: ['Form Object List', `nuOptionsListAction("nuobject", "", "${formId}")`, 'fa-th-list', 'O'],
		Search: ['Search', 'nuSearchAction()', 'fas fa-search', 'S'],
		Add: ['Add', 'nuAddAction()', 'fas fa-plus', 'A'],
		Print: ['Print', 'nuPrintAction()', 'fas fa-print', 'P'],
		Save: ['Save', 'nuSaveAction()', 'far fa-save', 'S'],
		Delete: ['Delete', 'nuDeleteAction()', 'far fa-trash-alt', 'Y'],
		Clone: ['Clone', 'nuCloneAction()', 'far fa-clone', 'C'],
		Refresh: ['Refresh', `if (nuGlobalAccess()) { nuRunPHPHidden("NUSETREFRESHCACHE"); } else { nuGetBreadcrumb(); }`, 'fas fa-sync-alt', 'R'],
		Help: ['Help', nuFORMHELP[subformId], 'fa-question-circle', '?'],
		ChangePassword: ['Change Password', 'nuPopup("nupassword","","")', 'fa-password', 'Q'],
		DebugResults: ['nuDebug Results', 'nuOptionsListAction("nudebug","")', 'fa-bug', 'D'],
		Database: ['Database', 'nuVendorLogin("PMA")', 'fa-database', 'E'],
		Sessions: ['Sessions', 'nuForm("nusession","","", "", 2)', 'fas fa-key', 'J'],
		FileManager: ['File Manager', 'nuVendorLogin("TFM")', 'far fa-file-code', 'Q'],
		Backup: ['Backup', 'nuRunBackup()', 'far fa-hdd', 'B'],
		Setup: ['Setup', 'nuForm("nusetup","1","", "", 2)', 'fa-cogs', 'U'],
		FormInfo: ['Form Info', 'nuShowFormInfo()', 'fa-info', 'M'],
		VersionInfo: ['Version Info', 'nuShowVersionInfo()', 'fa-info', 'V'],
		Logout: ['Log out', 'nuAskLogout()', 'fas fa-sign-out-alt', 'L']
	};

	const menuList = [];
	if (isEditMode && isAdmin && canChange) {
		if (nuCanArrangeObjects()) menuList.push(ITEMS.ArrangeObjects);
		if (!isSubform) {
			menuList.push(ITEMS.AddObject, ITEMS.Divider);
		}
	}

	if (isBrowseMode) menuList.push(ITEMS.SearchableColumns);
	if (isAdmin && canChange) menuList.push(ITEMS.FormProperties);
	if (isSubform && canChange) menuList.push(ITEMS.SubformObject);
	if (isAdmin && canChange) menuList.push(ITEMS.FormObjectList);
	if (!isSubform && isAdmin) menuList.push(ITEMS.Divider);

	if (isBrowseMode) {
		menuList.push(ITEMS.Search);
		if (buttons.Add === '1') menuList.push(ITEMS.Add);
		if (buttons.Print === '1' && nuFORM.getCurrent().browse_rows.length > 0)
			menuList.push(ITEMS.Print);
	}

	if (isLaunch && isEditMode && !isSubform) {
		const { data_mode } = nuFORM.getCurrent();
		if (buttons.Save === '1' && data_mode !== 0) menuList.push(ITEMS.Save);
		if (buttons.Delete === '1' && !nuIsNewRecord()) menuList.push(ITEMS.Delete);
		if (buttons.Clone === '1' && !nuIsNewRecord()) menuList.push(ITEMS.Clone);
	}

	if (hasHelp) menuList.push(ITEMS.Help);

	if (!isSubform) {
		menuList.push(ITEMS.Refresh);
		if (isAdmin) menuList.push(ITEMS.Divider);
	}

	if (!isAdmin) menuList.push(ITEMS.Divider, ITEMS.ChangePassword);

	if (isAdmin && !isSubform) {
		menuList.push(
			ITEMS.DebugResults, ITEMS.Divider,
			ITEMS.Database, ITEMS.Sessions,
			ITEMS.FileManager, ITEMS.Backup,
			ITEMS.Setup, ITEMS.FormInfo,
			ITEMS.VersionInfo
		);
	}

	if (!isSubform && nuIsMobile()) {
		menuList.push(ITEMS.Divider, ITEMS.Logout);
	}

	if (!menuList.length) return;

	$('<div>', { id: MENU_ID })
		.addClass('nuOptionsList')
		.css({ top: 0, width: 30 })
		.html(`<span class="nuOptionsListTitle">&nbsp;&nbsp;${nuTranslate('Options')}</span>`)
		.appendTo('body');

	nuBuildOptionsList(menuList, subformId, type);

	if (nuIsMobile()) nuHideOptionsItemShortcutKeys();

	$('[data-nu-option-title]').css('padding', 3);

	nuDragElement($('#' + MENU_ID)[0], 30);

	if (window.nuOnOptionsListLoadedGlobal) nuOnOptionsListLoadedGlobal();
}

function nuBuildOptionsList(items, parentId, contextType) {

	const BOX_SEL = '#nuOptionsListBox';
	const ITEM_HEIGHT = 20;
	const TITLE_HEIGHT = 30;

	items.forEach(it => {
		it[0] = it[0] ? nuTranslate(it[0]) : '';
		it[3] = nuCtrlCmdShiftName(it[3]);
	});

	const maxWidth = items.reduce((max, [text, , , key]) => {
		return Math.max(max, nuGetWordWidth(text) + nuGetWordWidth(key));
	}, 0);

	items.forEach(([text, action, iconCls, shortcut], idx) => {
		const topPos = TITLE_HEIGHT + idx * ITEM_HEIGHT;
		const isDivider = (text === '');
		const handler = (typeof action === 'function')
			? action
			: new Function(action);

		$('<i>')
			.addClass(`fa ${iconCls} nuOptionList`)
			.css({ position: 'absolute', top: topPos, left: 9, width: 15, height: 15 })
			.appendTo(BOX_SEL);

		const $entry = isDivider
			? $('<hr>').addClass('nuOptionsItem-divider').css({
				position: 'absolute',
				top: topPos - 4,
				left: 30,
				width: 35 + maxWidth - (contextType === 'subform' ? 55 : 0),
				height: 0
			})
			: $('<div>')
				.attr('data-nu-option-title', text)
				.addClass('nuOptionsItem')
				.css({
					position: 'absolute',
					top: topPos - 4,
					left: 30,
					width: maxWidth - 57,
					height: 15,
					padding: '0px 0px 0px 3px',
					'text-align': 'left'
				})
				.html(text);

		$entry.on('click', handler).appendTo(BOX_SEL);
		if (shortcut && contextType !== 'subform') {
			$('<div>')
				.addClass('nuOptionsItemShortcutKey')
				.css({
					position: 'absolute',
					top: topPos - 2,
					right: 10,
					width: 50,
					height: 15,
					'text-align': 'left'
				})
				.on('click', handler)
				.html(shortcut)
				.appendTo(BOX_SEL);
		}
	});

	const $trigger = $('#' + parentId + 'nuOptions');
	const offset = $trigger.offset();
	const finalTop = offset.top + 70;

	const finalLeft = (contextType === 'browse')
		? 12
		: (contextType === 'form')
			? 10
			: offset.left;

	const widthReduce = (contextType === 'subform') ? 55 : 0;
	$(BOX_SEL).css({
		top: finalTop,
		left: finalLeft,
		width: 50 + maxWidth - widthReduce,
		height: TITLE_HEIGHT + items.length * ITEM_HEIGHT + 10
	});

}

function nuSelectAllTabs(pthis) {

	var t = pthis.value;

	window.nuRESPONSIVE.setTabsColumn(t);

	if (t != '') {
		nuSelectTab($('#' + t)[0]);
	}

}

function nuSelectTab(tab, byUser = false) {

	if (window.nuOnSelectTab) {
		if (nuOnSelectTab(tab) == false) return;
	}

	let $tabId = $('#' + tab.id);

	byUser = byUser && !$tabId.is('[nu-data-clicked-by-system]');

	if (byUser) nuSaveScrollPositions();

	$tabId.removeAttr('nu-data-clicked-by-system');

	$('.nuTabTitleColumn').remove();

	const filt = $tabId.attr('data-nu-tab-filter');
	const form = $tabId.attr('data-nu-form-filter');
	const tabId = $tabId.attr('data-nu-tab-id');

	window.nuFORMHELP[form] = window.nuTABHELP[tabId];

	let tabStart = nuFORM.getProperty('tab_start');
	for (let i = 0; i < tabStart.length; i++) {

		if (tabStart[i].prefix == form) {
			tabStart[i].tabNumber = filt;
		}

	}

	let selector = "[data-nu-form='" + form + "']";
	$(selector + ":not('.nuIframe, .nuHtml')").hide();
	$(".nuIframe" + selector + ", .nuHtml" + selector).css('visibility', 'hidden');
	$("[data-nu-form-filter='" + form + "']").removeClass('nuTabSelected');

	selector = "[data-nu-form='" + form + "'][data-nu-tab='" + filt + "']";
	$(selector + ":not([data-nu-lookup-id]):not('.nuIframe, .nuHtml')").show();
	$(".nuIframe" + selector + ", .nuHtml" + selector).css('visibility', 'visible');

	if (nuIsMobile()) {
		$("[data-nu-mobile-hidden]").hide();
	}

	$('#' + tab.id).addClass('nuTabSelected');

	if (byUser) {

		nuRestoreScrollPositions();

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

	if (window.nuOnTabSelectedGlobal) {
		nuOnTabSelectedGlobal(tab);
	}

	if (window.nuOnTabSelected) {
		nuOnTabSelected(tab);
	}

}

function nuGetTabIndexByTitle(title) {
	const tabs = nuSERVERRESPONSE.tabs;
	return tabs.findIndex(data => data.title.replace(/\|/g, "") === title);
}

function nuGetSelectedTabId() {
	return $('.nuTabSelected').attr('data-nu-tab-id')
}

function nuSelectTabByTitle(title) {
	const index = nuGetTabIndexByTitle(title);
	if (index > -1) {
		nuSelectTab($('#nuTab' + index)[0]);
	}
}

function nuSelectTabById(id) {
	const element = $('div[data-nu-tab-id=' + id + ']');
	if (element) {
		nuSelectTab(element[0]);
	}
}

function nuRemoveTabByTitle(title) {
	const index = nuGetTabIndexByTitle(title);
	if (index > -1) {
		$('#nuTab' + index).remove();
	}
}

function nuShowTabByTitle(title, visible) {
	const index = nuGetTabIndexByTitle(title);
	if (index > -1) {
		nuShow('nuTab' + index, visible);
	}
}

function nuRemoveTabs(t) {

	for (let i = 0; i < arguments.length; i++) {
		$('#nuTab' + arguments[i]).remove();
	}

}

function nuRemoveTabById(id) {

	let obj = $('div#' + id);
	if (obj.length == 1) {
		obj.remove();
	} else {
		$('div[data-nu-tab-id=' + id + ']').filter('.nuTab').remove();
	}

}

function nuHideTabById(id) {
	nuShowTabById(id, false);
}

function nuShowTabById(id, visible) {

	let obj = $('div#' + id);
	if (obj.length == 1) {
		obj.nuShow(visible);
	} else {
		$('div[data-nu-tab-id=' + id + ']').filter('.nuTab').nuShow(visible);
	}

}

function nuHideTabByTitle(s) {
	nuShowTabByTitle(s, false);
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

function nuAddDataTab(id, tabNr, formIdPrefix) {

	let formId = '';
	if (formIdPrefix) {
		let formIdPrefixStr = String(formIdPrefix);
		formId = formIdPrefixStr.substr(0, formIdPrefixStr.length - 3);
	}

	$('#' + id).attr('data-nu-tab', tabNr).attr('data-nu-form', formId);

}

function nuAlignmentStyle(alignment) {

	const alignmentOptions = { l: 'left', c: 'center', r: 'right' };
	return alignmentOptions[alignment];

}

function nuBrowseTitle(columns, index, left, multiline) {

	function nuGenerateSortSpan(index, title, sortDirection) {
		const sortIconClass = sortDirection === 'asc' ? 'fa-caret-up' : 'fa-caret-down';

		return `<span id="nusort_${index}" class="nuSort" onclick="nuSortBrowse(${index})">
				 ${nuTranslate(title)}
				 <i id="nuSortIcon" class="fa ${sortIconClass}"></i>
			  </span>`;
	}

	const currentForm = window.nuFORM.getCurrent();
	const columnIndex = currentForm.nosearch_columns.indexOf(index);
	const elementId = 'nuBrowseTitle' + index;
	const container = nuCreateElementWithId('div', elementId, 'nuRECORD');
	const spanContent = `<span id="nusort_${index}" class="nuSort" onclick="nuSortBrowse(${index})" > ${nuTranslate(columns[index].title)} </span>`;
	const sortedSpan = currentForm.sort === index ? nuGenerateSortSpan(index, columns[index].title, currentForm.sort_direction) : spanContent;
	const titleClass = multiline === '1' ? 'nuBrowseTitleMultiline nuBrowseTitle' : 'nuBrowseTitle';
	const columnWidth = Number(columns[index].width);

	const element = $(container);
	element
		.html(sortedSpan)
		.addClass(titleClass)
		.css({
			'text-align': nuAlignmentStyle(columns[index].align),
			'overflow': 'visible',
			'width': columnWidth,
			'left': left
		})
		.attr('data-nu-title-id', columns[index].id);

	if (columnWidth === 0) {
		element.hide();
	}

	$('#nusearch_' + index).attr('checked', columnIndex === -1);

	return left + nuTotalWidth(elementId);
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

function nuResizeBrowseColumns(force) {

	const currentForm = nuFORM.getCurrent();
	const columnWidths = nuArrayColumn(nuSERVERRESPONSE.browse_columns, 'width').map(Number);
	const padding = nuTotalWidth('nucell_0_0') - $('#nucell_0_0').width();

	if ((currentForm.refreshed != 0 && force !== true) && nuMainForm()) {
		return;
	}

	if (nuMainForm()) {

		let totalWidth = 0;
		for (let i = 0; i < columnWidths.length; i++) {
			totalWidth = totalWidth + columnWidths[i];
		}

		for (let i = 0; i < columnWidths.length; i++) {
			columnWidths[i] = parseInt((window.innerWidth - 30) * columnWidths[i] / totalWidth) - padding;
		}

		nuSetBrowseColumns(columnWidths);

	} else {

		const browseFooterWidth = nuTotalWidth('nuBrowseFooter') + 22;
		const bodyWidth = `${browseFooterWidth}px`;

		$('#nuDragDialog', window.parent.document).css('width', browseFooterWidth + 14);
		$('#nuWindow', window.parent.document).css('width', browseFooterWidth);

		document.body.style.width = bodyWidth;

	}

}

function nuSetBrowseColumns(columnWidths) {

	const padding = nuTotalWidth('nucell_0_0') - $('#nucell_0_0').width();
	let left = 7;

	columnWidths.forEach((width, i) => {
		const columnElements = document.querySelectorAll(`[data-nu-column="${i}"], #nuBrowseTitle${i},#nuBrowseTitle${i}_select`);

		columnElements.forEach(element => {
			element.style.left = `${left}px`;
			element.style.width = `${width}px`;
		});

		left += width + (width === 0 ? 0 : padding);
	});

	const browseFooterWidth = left - 7;

	$('#nuBrowseFooter').css('width', `${browseFooterWidth}px`);

	nuFORM.breadcrumbs[nuFORM.breadcrumbs.length - 1].column_widths = columnWidths;

	if (nuCurrentProperties().browse_filtered_rows === 0) {
		const nucell00 = document.getElementById('nucell_0_0');
		nucell00.style.width = `${browseFooterWidth - 22}px`;
		nucell00.style.zIndex = '2';

		$("div[id^='nucell_']").not('#nucell_0_0').hide();
	}

}

function nuGetColumWidths() {

	let a = [];

	$("div[id^='nuBrowseTitle']").each(function (index) {
		a.push(parseInt($(this).css('width'), 10));
	});

	return a;

}

function nuDownBrowseResize(e, source) {

	if (e.target.tagName === 'I') {
		return;
	}

	const id = e.target.id.replace('nusort_', 'nuBrowseTitle');

	window.nuBROWSERESIZE.mouse_down = true;
	window.nuBROWSERESIZE.pointer = source;
	window.nuBROWSERESIZE.moving_element = id;
	window.nuBROWSERESIZE.x_position = e.clientX;

	$('#' + id).addClass('nuBrowseResize');

}

function nuEndBrowseResize(e) {

	window.nuBROWSERESIZE.mouse_down = false;
	window.nuBROWSERESIZE.moving_element = '';
	$('.nuBrowseTitle').removeClass('nuBrowseResize');

}

function nuDragBrowseColumn(e, p) {

	const targetId = e.target.id;

	if (targetId === '' || targetId === 'nuSearchField') { //  ctxmenu or Search field
		return;
	}

	if (window.nuBROWSERESIZE.mouse_down) {

		window.nuBROWSERESIZE.pointer = p; // added
		const id = window.nuBROWSERESIZE.moving_element;
		const offset_limit = 100000000;
		const min_offset = 2;
		var x = e.pageX;

		if (window.nuBROWSERESIZE.pointer == "finger_touch") {
			x = e.changedTouches[0].clientX;
		}

		var x_offset = x - window.nuBROWSERESIZE.x_position;

		window.nuBROWSERESIZE.x_position = x;

		if (x !== 0 && Math.abs(x_offset) > min_offset) {

			if (x_offset < offset_limit) {

				let c = Number(id.substr(13));

				let m = nuFORM.breadcrumbs[nuFORM.breadcrumbs.length - 1].column_widths[c] + x_offset
				if (m < 40) { m = 40; }

				nuFORM.breadcrumbs[nuFORM.breadcrumbs.length - 1].column_widths[c] = m;
				nuSetBrowseColumns(nuFORM.breadcrumbs[nuFORM.breadcrumbs.length - 1].column_widths)

			}

		}

	}

}

function nuAlign(a) {

	const alignmentMap = {
		l: 'left',
		r: 'right',
		c: 'center'
	};

	return alignmentMap[a] || '';

}

function nuBrowseTableHoverIn() {

	if (window.nuBROWSERESIZE.moving_element == '') {

		if ((this.offsetWidth < this.scrollWidth ||
			this.offsetHeight < this.scrollHeight) &&
			!$(this).is('[title]')) {
			$(this).attr('title', $(this).html().replace(/(<([^>]+)>)/ig, '')); // Remove HTML tags
		}

		$("[data-nu-row]").addClass('nuBrowseTable').removeClass('nuSelectBrowse');
		window.nuBROWSEROW = -1;

		const dataRow = $(this).attr('data-nu-row');
		$("[data-nu-row='" + dataRow + "']").not('.nuCellColored').addClass('nuSelectBrowse').removeClass('nuBrowseTable');
	}

}

function nuBrowseTableHoverOut() {

	if (window.nuBROWSERESIZE.moving_element == '') {
		$("[data-nu-row]").addClass('nuBrowseTable').removeClass('nuSelectBrowse');

		window.nuBROWSEROW = -1;

		const dataRow = $(this).attr('data-nu-row');
		$("[data-nu-row='" + dataRow + "']").addClass('nuBrowseTable').removeClass('nuSelectBrowse');
	}

}

function nuBrowseTable() {

	const currentForm = window.nuFORM.getCurrent();
	const columns = currentForm.browse_columns;
	const rows = currentForm.browse_rows;
	const rowCount = rows.length;
	const rowHeight = currentForm.row_height;

	let incrementalWidth = 0;
	let topOffset = nuBrowseCalculateInitialTopOffset(rowHeight);
	let leftOffset = 7;

	for (let rowIndex = 0; rowIndex < currentForm.rows; rowIndex++) {
		leftOffset = 7;
		topOffset += rowHeight + 7;

		if (rowCount === 0 && rowIndex > 0) {
			nuBrowseHandleNoDataScenario();
			break;
		}

		for (let colIndex = 0; colIndex < columns.length; colIndex++) {
			leftOffset = nuBrowseHandleCellCreation(rowIndex, colIndex, columns, rows, topOffset, leftOffset, rowHeight, incrementalWidth);
		}
	}

	nuBrowseCreateFooter(currentForm, topOffset, leftOffset, rowHeight);

	nuHighlightSearch();
	nuBrowseBorders();

	nuBrowseUpdateParentDocumentStyles(topOffset + rowHeight + 140);

}

function nuBrowseCalculateInitialTopOffset(rowHeight) {
	return parseInt($('#nuBrowseTitle0').css('height'), 10) - rowHeight - 2;
}

function nuBrowseHandleNoDataScenario() {

	const searchLengthZero = nuCurrentProperties().search.length === 0;
	const noDataMessage = searchLengthZero ? 'No data to display' : 'No search results found';
	const firstCellClass = searchLengthZero ? 'nuBrowseNoData' : 'nuBrowseNoResults';
	$('#nucell_0_0').html(nuTranslate(noDataMessage)).addClass(firstCellClass);
	window[`nuBrowseNo${firstCellClass === 'nuBrowseNoData' ? 'Data' : 'SearchResults'}`] = true;

}

function nuBrowseHandleCellCreation(rowIndex, colIndex, browseColumns, browseRows, topOffset, leftOffset, rowHeight, incrementalWidth) {

	const columnWidth = Number(browseColumns[colIndex].width);
	const id = `nucell_${rowIndex}_${colIndex}`;

	const div = nuCreateElementWithId('div', id, 'nuRECORD');
	const $div = nuSetObjectBounds(div, topOffset, leftOffset, columnWidth, rowHeight, true);
	nuBrowseSetCellAttributes(div, rowIndex, colIndex, browseColumns[colIndex]);

	if (columnWidth === 0) {
		$div.hide();
	} else {
		div.classList.add('nuBrowseTable', 'nuCell');
	}

	if (rowIndex < browseRows.length) {
		nuBrowseSetCellContentAndEvents($div, browseRows, rowIndex, colIndex, browseColumns[colIndex]);
	}

	if (rowIndex === 0 && colIndex === 0) {
		incrementalWidth = nuTotalWidth(id) - columnWidth;
	}

	return leftOffset + (columnWidth === 0 ? 0 : columnWidth + incrementalWidth);

}

function nuBrowseSetCellAttributes(div, rowIndex, colIndex, column) {

	div.setAttribute('data-nu-row', rowIndex);
	div.setAttribute('data-nu-column', colIndex);
	div.style.textAlign = nuAlign(column.align);
	div.style.overflow = 'hidden';
	div.style.padding = (column.width < 0 ? 0 : undefined) + 'px';
	div.style.borderWidth = (column.width < 0 ? 0 : undefined) + 'px';
	div.classList.add(`nuCell${(rowIndex / 2 === parseInt(rowIndex / 2, 10)) ? 'Even' : 'Odd'}`);

}

function nuBrowseSetCellContentAndEvents($div, browseRows, rowIndex, colIndex, currentColumn) {

	const value = currentColumn.format === '' ? browseRows[rowIndex][colIndex + 1] : nuFORM.addFormatting(browseRows[rowIndex][colIndex + 1], currentColumn.format);
	$div.html(value)
		.attr('data-nu-primary-key', browseRows[rowIndex][0])
		.on('click', (event) => nuInternalSelectBrowse(event, $div[0]))
		.on('mouseenter', nuBrowseTableHoverIn)
		.on('mouseleave', nuBrowseTableHoverOut);

}

function nuBrowseCreateFooter(currentForm, topOffset, leftOffset, rowHeight) {

	const footerTopOffset = topOffset + rowHeight + 10;
	const divFooter = nuCreateElementWithId('div', 'nuBrowseFooter', 'nuRECORD');
	const footerHtml = nuBrowseCreateFooterHtml(currentForm);

	$(divFooter)
		.addClass('nuBrowseFooter')
		.html(footerHtml)
		.css({
			'text-align': 'center',
			width: leftOffset - 7,
			top: footerTopOffset,
			left: 7,
			height: 25,
			position: 'absolute',
			padding: '5px 0px'
		});

	nuBrowseAdditionalNavButtons();

}

function nuBrowseCreateFooterHtml(currentForm) {

	const last = `<span id="nuLast" onclick="nuGetPage(${currentForm.page_number})" class="nuBrowsePage">&#9668;</span>`;
	const next = `<span id="nuNext" onclick="nuGetPage(${currentForm.page_number + 2})" class="nuBrowsePage">►</span>`;
	const pageLabel = '&nbsp;Page&nbsp;';
	const currentPageInput = `<input id="browsePage" style="text-align:center;margin:3px 0px 0px 0px;width:40px" onchange="nuGetPage(this.value)" value="${currentForm.page_number + 1}" class="browsePage"/>`;
	const totalPagesLabel = ' / ' + (currentForm.pages === 0 ? 1 : currentForm.pages) + ' ';

	return last + pageLabel + currentPageInput + totalPagesLabel + next;

}

function nuBrowseAdditionalNavButtons() {

	if ($('#nuFirst').length > 0) return;

	const currentPage = Number($('#browsePage').val());
	const lastPage = nuCurrentProperties().pages;

	const disabledStyle = {
		opacity: '0.3',
		'pointer-events': 'none'
	};

	const firstBtn = '<span id="nuFirst" class="nuBrowsePage"><i class="fa fa-step-backward" style="font-size: 16px" onclick="nuGetPage(1)">&nbsp;&nbsp;&nbsp;&nbsp;</i></span>';
	$(firstBtn).insertBefore('#nuLast');

	const endBtn = `<span id="nuEnd" class="nuBrowsePage">&nbsp;&nbsp;&nbsp;&nbsp;<i class="fa fa-step-forward nuBrowsePage" style="font-size: 16px" onclick="nuGetPage(${lastPage})"></i></span>`;
	$(endBtn).insertAfter('#nuNext');

	if (currentPage === 1) {
		$('#nuFirst, #nuLast').css(disabledStyle);
	}

	if (currentPage >= lastPage) {
		$('#nuNext, #nuEnd').css(disabledStyle);
	}

}

function nuBrowseUpdateParentDocumentStyles(totalHeight) {

	const parentDocument = window.parent.document;
	$('#nuDragDialog', parentDocument).css({
		height: totalHeight + 30,
		visibility: 'visible',
		overflow: 'hidden'
	});

	$('#nuWindow', parentDocument).css({
		height: totalHeight - 14
	});

	$('body').css('height', totalHeight - 30);
	$('#nuRECORD').css({
		height: 0,
		width: 0
	});

}

function nuBrowseTitleMultiLine() {

	$('#nuActionHolder').css({ 'height': '40px' });
	$('.nuBrowseTitle').css('top', "-20px");

}

function nuSetBrowseColumnWidth(column, width) {

	let cw = this;
	if (nuIsIframe()) {
		cw = parent.$("#" + window.frameElement.id)[0].contentWindow;
	}
	cw.nuFORM.breadcrumbs[cw.nuFORM.breadcrumbs.length - 1].column_widths[column] = width;
	cw.nuSetBrowseColumns(cw.nuFORM.breadcrumbs[cw.nuFORM.breadcrumbs.length - 1].column_widths);

}

function nuClickSearchColumn(e) {

	const c = e.target.id.substr(12);
	$('#nuSearchList' + c).trigger("click");
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

function nuSetNoSearchColumns(columnsArr) {

	const s = nuFORM.getCurrent().nosearch_columns;
	columnsArr = s.concat(columnsArr);

	for (let i = 0; i < columnsArr.length; i++) {
		$('#nusort_' + columnsArr[i]).addClass('nuNoSearch');
	}

	nuFORM.setProperty('nosearch_columns', columnsArr);

}

function nuSetSearchColumns(columnsArr) {

	const numBrowseColumns = $(".nuBrowseTitle").length;
	let arr = [];

	for (let i = 0; i <= numBrowseColumns; i++) {
		if (!columnsArr.includes(i)) {
			arr.push(i);
		}
	}

	nuSetNoSearchColumns(arr);

}

function nuSearchColumnsReset() {

	for (let i = 0; i < $(".nuBrowseTitle").length; i++) {
		$('#nusort_' + i).removeClass('nuNoSearch');
	}

	nuFORM.setProperty('nosearch_columns', []);

}

function nuSearchPressed(e) {

	if (e.key !== 'Enter') {
		window.nuBROWSEROW = -1;
		$('[data-nu-row]').addClass('nuBrowseTable').removeClass('nuSelectBrowse');
		return;
	}

	e.preventDefault();

	if (window.nuBROWSEROW === -1) {
		$('#nuSearchButton').trigger("click");
		return;
	}

	const cellId = `#nucell_${window.nuBROWSEROW}_0`;
	nuSelectBrowse('', $(cellId)[0]);

}

function nuArrowPressed(e) {

	if (e.key == 'ArrowUp' || e.key == 'ArrowDown') {

		const rows = $("[data-nu-column='0'][data-nu-primary-key]").length - 1;
		const targetRow = window.nuBROWSEROW + (e.key === 'ArrowUp' ? -1 : 1);

		window.nuBROWSEROW = (targetRow < 0 || targetRow > rows) ? window.nuBROWSEROW : targetRow;

		$("[data-nu-row]").addClass('nuBrowseTable').removeClass('nuSelectBrowse');
		$("[data-nu-row='" + window.nuBROWSEROW + "']").addClass('nuSelectBrowse').removeClass('nuBrowseTable');

	}

}

function nuSearchAction(searchValue, filterValue) {

	if (arguments.length > 0) {
		$('#nuSearchField').val(searchValue);
	}
	if (arguments.length === 2) {
		$('#nuFilter').val(filterValue);
	}

	let searchString = String($('#nuSearchField').val()).nuReplaceAll("'", "&#39;", true);
	let filterString = String($('#nuFilter').val()).nuReplaceAll("'", "&#39;", true);

	if (window.nuOnSearchActionGlobal) {
		let globalObject = { search: searchString, filter: filterString };
		if (nuOnSearchActionGlobal(globalObject) === false) {
			return;
		}
		searchString = globalObject.search;
		filterString = globalObject.filter;
	}

	if (window.nuOnSearchAction) {
		let localObject = { search: searchString, filter: filterString };
		if (nuOnSearchAction(localObject) === false) {
			return;
		}
		searchString = localObject.search;
		filterString = localObject.filter;
	}

	window.nuFORM.setProperty('search', searchString);
	window.nuFORM.setProperty('filter', filterString);

	const callerName = nuSearchAction.caller === null ? '' : nuSearchAction.caller.name;
	if ((arguments.length === 0 && callerName !== 'nuGetPage') || arguments.length >= 1) {
		window.nuFORM.setProperty('page_number', 0);
	}

	nuDisable('nuSearchField');
	nuGetBreadcrumb();

}

function nuAddAction() {

	const bc = window.nuFORM.getCurrent();

	if (window.nuOnAddAction) {
		if (nuOnAddAction(bc) == false) return;
	}

	nuForm(bc.redirect_form_id, '-1');

}

function nuRunPHPAction(code) {
	nuRunPHP(code, '', true);
}

function nuRunReportAction(code) {
	nuRunReport(code);
}

function nuEmailReportAction(code) {
	nuEmailReport(code);
}

function nuSortBrowse(column) {

	const currentForm = window.nuFORM.getCurrent();
	currentForm.filter = $('#nuFilter').val();
	currentForm.page_number = 0;

	if (column === currentForm.sort) {
		currentForm.sort_direction = (currentForm.sort_direction === 'asc') ? 'desc' : 'asc';
	} else {
		currentForm.sort = column;
		currentForm.sort_direction = 'asc';
	}

	nuSearchAction();

}

function nuGetPage(pageNumber) {

	let paddedPageNumber = parseInt('00' + pageNumber, 10);

	if (pageNumber > nuCurrentProperties().pages || pageNumber === 0) {
		return;
	}

	let currentForm = window.nuFORM.getCurrent();

	if (paddedPageNumber === 0) {
		paddedPageNumber = 1;
	}

	if (paddedPageNumber > currentForm.pages) {
		paddedPageNumber = currentForm.pages;
	}

	currentForm.page_number = paddedPageNumber - 1;

	nuSearchAction();

}

function nuBuildLookup(id, search, like) {

	if ($(id).prop('disabled')) { return; }

	nuCursor('progress');

	const obj = $('#' + id.id);
	const f = obj.attr('data-nu-form-id');
	const target = obj.attr('data-nu-target');
	const prefix = obj.attr('data-nu-prefix');
	window.nuSubformRow = Number(prefix.substr(prefix.length - 3));

	if (arguments.length < 3) {
		like = '';
	}

	window.nuOPENER.push(new nuOpener('F', f, ''));

	if (parent.window === window) {
		let left = nuIsMobile() ? 0 : 50;
		window.nuDialog.createDialog(left, 25, 50, 50, '');
	} else {
		window.nuDialog.createDialog(0, 30, 50, 50, '');
	}

	const opener = window.nuOPENER[window.nuOPENER.length - 1];

	const dialog = $('#nuDragDialog');
	dialog.css({
		visibility: 'hidden',
		top: `${window.scrollY + 30}px`
	});

	const iframe = $('<iframe>', {
		id: 'nuWindow',
		src: `index.php?opener=${opener.id}&target=${target}&search=${search}&like=${like}&browsefunction=lookup&iframe=1`,
		css: {
			right: '5px',
			top: '30px',
			width: '400px',
			height: '400px',
			position: 'absolute'
		}
	});

	dialog.append(iframe);

}

function nuPopulateLookup(form, targetId, setFocus) {

	const targetElement = $('#' + targetId);
	const prefix = String(targetElement.attr('data-nu-prefix'));
	const lookupValues = form.lookup_values;

	window.nuSubformRow = Number(prefix.slice(-3));

	for (let i = 0; i < lookupValues.length; i++) {
		const id = String(lookupValues[i][0]);
		let $element = $('#' + id);

		if (id.substring(0, prefix.length) !== prefix) {
			$element = $('#' + prefix + id);
		}

		$element.addClass('nuEdited');

		if ($element.attr('type') === 'checkbox') {
			$element.prop('checked', lookupValues[i][1] === '1');
		} else {
			$element.val(lookupValues[i][1]);

			if ($element.attr('data-nu-format')) {
				nuReformat($element[0]);
				$element.addClass('nuEdited');
				$('#' + prefix + 'nuDelete').prop('checked', false);
			}

		}

		if (i === 1 && setFocus !== false) {
			$element.trigger("focus");
		}
	}

	window.nuLOOKUPSTATE[targetElement.attr('data-nu-object-id')] = 'found';

	nuCalculateForm();

	eval(form.lookup_javascript);

	$('#dialogClose').trigger("click");

	if (window.nuaction === 'save' && !nuLookingUp()) {
		nuSaveAction();
	}

}

function nuChooseOneLookupRecord(event, fm) {

	const targetId = event.target.id;
	const lookupObject = new nuLookupObject(targetId);
	const lookupId = lookupObject.id_id;
	const targetElement = document.getElementById(targetId);
	const likeEncoded = nuEncode(fm.lookup_like);
	const lookupValues = fm.lookup_values;
	const inputValue = event.target.value.toUpperCase();

	if (lookupValues.length === 0) {
		nuGetLookupId('', lookupId);
		return;
	}

	if (lookupValues.length === 1) {
		const lookupValue = String(lookupValues[0][1]).toUpperCase();

		if (inputValue === lookupValue) {
			nuGetLookupId(lookupValues[0][0], lookupId);
		} else {
			nuBuildLookup(targetElement, event.target.value);
		}
		return;
	}

	nuBuildLookup(targetElement, event.target.value, likeEncoded);

}

function nuLookupObject(id, set, value) {

	const $id = $('#' + id);

	const nuResetLookupProperties = (obj) => {
		const props = ['id_id', 'code_id', 'description_id', 'id_value', 'code_value', 'description_value'];
		props.forEach(prop => obj[prop] = '');
	}

	if (!$id.length) {
		nuResetLookupProperties(this);
		return;
	}

	const nuUpdateLookupProperties = (obj, id) => {
		Object.assign(obj, {
			id_id: id,
			code_id: id + 'code',
			description_id: id + 'description',
			id_value: $('#' + id).val(),
			code_value: $('#' + id + 'code').val(),
			description_value: $('#' + id + 'description').val()
		});
	}

	const nuValidLookupId = (originalId, suffix) => {
		const idString = String(originalId);
		const suffixString = String(suffix);

		if (idString.endsWith(suffixString)) {
			const idWithoutSuffix = idString.slice(0, -suffixString.length);
			const elementWithSuffix = $(`#${idString}${suffixString}`);
			const elementWithDoubleSuffix = $(`#${idString}${suffixString}${suffixString}`);

			if (elementWithSuffix.length === 1 && elementWithDoubleSuffix.length === 1) {
				return `${idWithoutSuffix}${suffixString}`;
			}
		}

		return idString;
	}

	const nuLookupShouldSetValue = (value) => value !== undefined && ['id', 'code', 'description'].includes(set);

	const lookupId = nuValidLookupId(nuValidLookupId(id, 'code'), 'description');
	nuUpdateLookupProperties(this, lookupId);

	if (nuLookupShouldSetValue(value)) {
		$('#' + this[set]).val(value);
	}

}

function nuHighlightSearch() {

	const currentSearch = window.nuFORM.getCurrent().search;

	if (!currentSearch || !currentSearch.length) {
		return;
	}

	const exclude = new Set(window.nuFORM.getCurrent().nosearch_columns || []);

	const search = currentSearch
		.split(' ')
		.filter(a => a && a[0] !== '-')
		.sort((a, b) => a.length - b.length);

	$('.nuBrowseTable').each(function () {
		const column = Number($(this).attr('data-nu-column'));
		if (!exclude.has(column)) {
			search.forEach(term => $(this).nuHighlight(term));
		}
	});

}
function nuOnSubformDeleteClick(event) {

	const id = event.target.id;
	const sf = $('#' + id).attr('data-nu-checkbox');
	const row = id.substring(sf.length, sf.length + 3);
	const checked = $('#' + id).is(":checked");

	$('[id^=' + sf + nuPad3(row) + ']')
		.not(':button, :checkbox')
		.toggleClass('nuSubformDeleteTicked', checked)
		.filter(function () {
			return $(this).attr('data-nu-access') !== "1";
		})
		.toggleClass('nuReadonly', checked)
		.nuEnable(!checked);

}

function nuChangeDeleteClicked(e) {

	const sfid = $(e.target).attr('data-nu-checkbox');
	const click = $('#' + sfid).attr('data-nu-clickdelete');

	nuOnSubformDeleteClick(e);

	if (click) eval(click);

	nuHasBeenEdited();
	nuCalculateForm();

}

function nuChange(e) {

	if (e.target.id.endsWith('nuDelete')) {
		nuChangeDeleteClicked(e);
		return;
	}

	const t = $('#' + e.target.id)[0];
	const $id = $(t);
	const prefix = $id.attr('data-nu-prefix');

	if ($id.is('select') && nuIsDisabled(e.target.id)) {

		const oldValue = $id.attr('data-nu-org-value');
		const newValue = $id.val();
		if (oldValue !== newValue) {
			$id.val(oldValue);
			return;
		}
	}

	nuReformat(t);

	$('#' + prefix + 'nuDelete').prop('checked', false);
	$id.addClass('nuEdited');

	$id.removeClass('nuValidate');
	nuCalculateForm();

	if (prefix !== '') {
		nuAddSubformRow(t, e);
	}

	if ($id.attr('data-nu-table-column') != '0') {
		nuSetSaved(false);
		nuHasBeenEdited();
	}

}

function nuChooseEventList() {

	if ($('#sob_all_type').val() == 'subform') {
		return ['beforeinsertrow', 'afterinsertrow', 'clickdelete'];
	}

	return ['onchange', 'oninput', 'onclick', 'onblur', 'onnuload', 'onfocus', 'onkeydown', 'onenter'];

}

function nuChangeFile(e) {

	if (e.target.id.substr(-8) == 'nuDelete') {

		nuHasBeenEdited();
		return;

	}

	var id = e.target.id;
	var theTextarea = id.substr(0, id.length - 6);

	if ($('#' + id).val() == '') { return; }

	var a = $('#' + id)[0].files[0];
	var r = new FileReader();

	r.onload = function () {

		var f = btoa(r.result);
		var obj = { 'file': f, 'name': a.name, 'size': a.size, 'type': a.type };
		var json = JSON.stringify(obj);

		if (window.nuOnFileLoad) {
			if (nuOnFileLoad(e, id, json) === false) { return; }
		} else {
			if (a.size > 300000) {
				nuMessage(nuTranslate('Error'), [nuTranslate('File is too large, cannot be saved. Must be under 300Kb')]);
				$('#' + id).val('');
				return;
			}
		}

		$('#' + theTextarea).val(json).addClass('nuEdited');

		if (window.nuOnFileLoaded) {
			nuOnFileLoaded(e, id, json);
		}

	};

	r.readAsDataURL(a);

	var t = $('#' + id)[0];
	var p = $('#' + theTextarea).attr('data-nu-prefix');

	$('#' + p + 'nuDelete').prop('checked', false);
	$('#' + theTextarea).addClass('nuEdited');

	nuHasBeenEdited();

	if (p == '') { return; }

	nuAddSubformRow(t, e);

}

function nuCalculateForm(setAsEdited) {

	if (window.nuEnableCalculation == false) return;

	const subformFirst = (a, b) => {
		const A = $('#' + a.id).hasClass('nuSubformObject') ? 0 : 1000;
		const B = $('#' + b.id).hasClass('nuSubformObject') ? 0 : 1000;
		const orderA = parseInt($('#' + a.id).attr('data-nu-calc-order'), 10);
		const orderB = parseInt($('#' + b.id).attr('data-nu-calc-order'), 10);

		if (setAsEdited === undefined) {
			$('#' + a.id).addClass('nuEdited');
		}

		return (orderA + A) - (orderB + B);
	};

	const formulas = $("[data-nu-formula]").toArray();

	formulas.sort(subformFirst);

	formulas.forEach((formula) => {
		$(formula).addClass('nuEdited');

		const formulaString = $(formula).attr('data-nu-formula');
		const format = $(formula).attr('data-nu-format');

		let value = 0;

		if (formulaString) {
			const computeFormula = new Function('return ' + formulaString);
			value = computeFormula();
		}

		const formattedValue = nuFORM.addFormatting(value, format);

		$(formula).val(formattedValue);

		if (window.nuCalculated) {
			nuCalculated(formula, value, formattedValue);
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

	const formCode = nuCurrentProperties().form_code;
	const isNuRecord = String(nuRecordId()).startsWith('nu');
	const isNuForm = formCode === 'nuform';

	if (isNuForm && isNuRecord) {
		nuMessage(`${nuTranslate('Error')}`, `${nuTranslate("nuBuilder's core forms cannot be deleted.")}`);
		return;
	}

	const confirmMessage = isNuForm ?
		nuTranslate("Are you sure you want to delete this form and all its associated objects, events and codes?") :
		nuTranslate("Delete This Record?");

	if (confirm(confirmMessage)) {
		$('#nuDelete').prop('checked', true);
		nuUpdateData('delete');
	}

}

function nuDeleteAllAction() {

	if (confirm(nuTranslate("Delete All Records?"))) {

		$('#nuDelete').prop('checked', true);
		nuUpdateData('delete', 'all');

	}

}

function nuCloneAction() {

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

	const noclone = nuSERVERRESPONSE.noclone;

	if (!noclone || !Array.isArray(noclone)) return;

	noclone.forEach(function (item) {

		if (item.subform) {
			$('#' + item.id + 'scrollDiv .nuSubform1, #' + item.id + 'scrollDiv .nuSubform0').each(function () {
				if (this.id !== item.id + '000nuRECORD') {
					$(this).remove();
				}
			});

			$('#' + item.id + '000nuRECORD').children().each(function () {
				if ($(this).hasClass('nuEdited')) {
					$(this).val('');
					if ($('#' + this.id + 'button').length) {
						$('#' + this.id + 'code, #' + this.id + 'description').val('');
					}
				}
			});

			$('#' + item.id + '000nuDelete').prop('checked', true);
			$('#' + item.id + '001nuRECORD').remove();
		} else {
			$('#' + item.id).val('').trigger("change");
		}
	});

}

function nuIsClone() {
	return nuCLONE;
}

function nuIsNewRecord() {
	return nuRecordId() == -1 && !nuCLONE;
}

function nuSaveAction(close) {

	if (nuCurrentProperties().form_type == 'launch') {
		return;
	}

	window.nuaction = 'save';
	if (nuLookingUp()) {
		return;
	}

	if (nuNoDuplicates()) {

		nuSaveScrollPositions();
		nuUpdateData('save', close ? 'close' : null);

	}

	window.nuaction = '';
}

function nuSavingProgressMessage() {

	$('.nuUpdateMessageProgress').remove();
	let div = nuCreateElementWithId('div', 'nuProgressUpdate', 'nuActionHolder');
	$div = $(div);
	$div.html('<img src="core/graphics/ajax-loader.gif">').addClass('nuUpdateMessageProgress');

	const left = ($('#nuActionHolder').width() / 2) - ($div.width() / 2);
	const top = ($('#nuBreadcrumbHolder').outerHeight() - $div.outerHeight()) / 2;
	nuSetObjectBounds(div, top, left, null, null, true);

	$('.nuActionButton').hide();

}

function nuShowLastUpdatedMessage() {

	if (window.last_action) {
		nuUpdateMessage(window.last_action);
		window.last_action = "";
	}

}

function nuShowMessages() {

	if (window.messages?.length) {
		nuMessage(window.messages);
		window.messages = "";
	}

}

function nuUpdateMessage(actionMessage) {

	let msgClass = '';
	let msg = actionMessage;

	if (actionMessage === 'delete') {
		msg = 'Record Deleted';
		msgClass = 'nuUpdateMessageDelete';
	} else if (actionMessage === 'save') {
		msg = 'Record Saved';
		msgClass = 'nuUpdateMessageSave';
	}

	$("#nuProgressUpdate").hide();

	let div = nuCreateElementWithId('div', 'nuNowUpdated', 'nuActionHolder');
	$div = $(div);
	$div.html(nuTranslate(msg));
	$div.addClass('nuUpdateMessage').addClass(msgClass);

	const left = ($('#nuActionHolder').width() / 2) - ($div.width() / 2);
	const top = ($('#nuBreadcrumbHolder').outerHeight() - $div.outerHeight()) / 2;

	nuSetObjectBounds(div, top, left, null, null, true);

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

function nuAddJavaScript(js) {

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

		if (i < 9) {

			var shortcut_key = document.createElement('div');
			var shortcut_key_id = 'nuSearchTextShortcutKey' + i.toString();

			shortcut_key.setAttribute('id', shortcut_key_id);

			$('#nuSearchList').append(shortcut_key);

			var prop = { 'position': 'absolute', 'text-align': 'left', 'height': 15, 'width': 50 };

			$('#' + shortcut_key.id)
				.css(prop)
				.css({ 'top': 37 + (i * 25), 'right': 10 })
				.html(nuCtrlCmdShiftName(i + 1))
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

function nuMessage(options, options2, options3, options4) {

	const rootElement = window.top.document;
	nuMessageRemove(true);

	let argCount = nuCountDefinedArguments(...arguments);
	let title = '';
	let messages = [];
	let timeout = null;
	let callback = null;

	const extractMessageParts = (msg) => {
		const headerPattern = /<h[1-5]>(.*?)<\/h[1-5]>/i;
		const match = msg.match(headerPattern);

		if (match) {
			const title = match[1];
			const message = msg.replace(headerPattern, '');
			return {
				title: title,
				message: message
			};
		}

		return false;
	}

	const isArrayWithLengthOne = Array.isArray(options) && options.length == 1;
	if (argCount === 1 && (typeof options == "string" || isArrayWithLengthOne)) {
		if (isArrayWithLengthOne) options = options[0];
		const messageParts = extractMessageParts(options);
		if (messageParts) {
			options = messageParts.title;
			options2 = messageParts.message;
			argCount = 2;
		}
	}

	if (argCount === 1) {
		messages = Array.isArray(options) ? options : [options];
	} else if (argCount >= 2) {
		if (Number.isInteger(options2)) {
			timeout = options2;
			messages = Array.isArray(options) ? options : [options];
			callback = typeof options3 === 'function' ? options3 : null;
		} else {
			title = options;
			messages = Array.isArray(options2) ? options2 : [options2];
			timeout = Number.isInteger(options3) ? options3 : null;
			callback = typeof options4 === 'function' ? options4 : null;
		}
	}

	rootElement.nuHideMessage = false;
	messages = Array.isArray(messages) ? messages : [messages];

	let widest = messages.reduce((maxWidth, msg) => Math.max(maxWidth, nuGetWordWidth(msg)), 5);
	widest = Math.min(widest + 200, 1000);

	const viewportWidth = Math.min(document.documentElement.clientWidth - 42, widest);
	const leftPosition = Math.max(0, (document.documentElement.clientWidth - viewportWidth) / 2);
	const topPosition = window.scrollY + 10;

	const messageContainer = $('<div>', {
		id: 'nuMessageDiv',
		class: 'nuMessage',
		style: `overflow:hidden;top:${topPosition}px;width:${viewportWidth}px;left:${leftPosition}px`
	});

	const header = $('<div>', { class: 'nuMessageHeader' });
	const titleElement = $('<div>', { class: 'nuMessageTitle', html: title });

	let closeButtonClass = 'fas fa-times nuMessageClose';
	if (nuIsMobile()) closeButtonClass += ' fa-2x';
	const closeButton = $('<i>', { class: closeButtonClass });

	closeButton.on('click touchstart', function () {
		messageContainer.fadeOut("slow", function () {
			nuMessageRemove();
		});
	});

	header.append(titleElement).append(closeButton);
	messageContainer.append(header);

	const formatTitle = (titleElement, str) => {
		const headerTag = str.nuHasHTMLTag(['h1', 'h2', 'h3', 'h4', 'h5', 'h6']);
		if (headerTag) {
			titleElement.html(str);
			titleElement.find(headerTag).css('margin', '0px');
		}
		return headerTag;
	};

	if (title) {
		if (!formatTitle(titleElement, title)) {
			formatTitle(titleElement, '<h3>' + title + '</h3>');
		}
	}

	const messageBody = $('<div>', { class: 'nuMessageBody' });
	for (let i = 0; i < messages.length; i++) {

		let hasTag = false;
		if (i === 0 && !title) {
			hasTag = formatTitle(titleElement, messages[i]);
			if (hasTag) {
				title = messages[i];
			}
		}

		if (!hasTag) {
			messageBody.append($('<div>').html(messages[i])).append('<br>');
		}
	}

	messageContainer.append(messageBody);
	$('body', rootElement).append(messageContainer);

	if (!title) {
		header.css('padding', 15);
	}

	if (timeout) {
		setTimeout(() => {
			messageContainer.fadeOut("slow", () => messageContainer.remove());
			if (callback) callback();
		}, timeout);
	}

	if (nuUseMobileView()) {
		const scale = nuMobileViewGetTransformScale();
		$('#nuMessageDiv').css({
			'width': nuMobileViewGetScaledDocumentWidth(scale) - 40,
			'left': '5px'
		});
	}

	nuDragElement(messageContainer[0], 30);

	return messageContainer;

}

function nuMessageRemove(force = false) {

	const windowTopDoc = window.top.document;
	if (force || windowTopDoc.nuHideMessage) {
		windowTopDoc.nuHideMessage = false;
		$('#nuMessageDiv', windowTopDoc).remove();
	}

}

function nuWindowPosition() {

	const p = window.parent.document;

	let d = $('#nuDragDialog', p);
	let { l, t, w, h } = nuObjectPosition(d);

	window.nuDialogSize = { left: l, top: t, width: w, height: h };

	d = $('#nuWindow', p);

	w = parseInt(d.css('width'), 10);
	h = parseInt(d.css('height'), 10);

	window.nuWindowSize = { width: w, height: h };

}

function nuNoDuplicates() {

	window.nuDuplicate = true;

	$('.nuTabHolder.nuDuplicate').each(function () {
		const $this = $(this);
		const tabHolderHtml = $this.html();
		const fieldName = $this.attr('data-nu-field');
		const sfId = $this.attr('data-nu-subform');
		const sfObj = nuSubformObject(sfId);
		const uniqueValues = [];
		const fieldIndex = sfObj.fields.indexOf(fieldName);

		for (let rowIndex = 0; rowIndex < sfObj.rows.length; rowIndex++) {
			if (sfObj.deleted[rowIndex] == 0) {
				const rowValue = sfObj.rows[rowIndex][fieldIndex];
				if (uniqueValues.includes(rowValue)) {
					nuMessage(`${nuTranslate('Validation Error')}`, `Duplicate <b>${tabHolderHtml}</b> on row <b>${rowIndex}</b>`);
					window.nuDuplicate = false;
					return;
				}
				uniqueValues.push(rowValue);
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

function nuIsDoubleClick(event, element) {

	const now = event.timeStamp;
	const lastClickTime = parseInt(element.getAttribute('nu-last-clicked-time'), 10) || 0;
	const doubleClickThreshold = 1000;

	if (lastClickTime && (now - lastClickTime < doubleClickThreshold)) {
		return true;
	} else {
		element.setAttribute('nu-last-clicked-time', now.toString());
		return false;
	}

}

function nuInternalSelectBrowse(event, element) {

	if (!nuIsDoubleClick(event, element)) {
		return nuSelectBrowse(event, element);
	}

}

function nuRedefineNuSelectBrowse() {

	nuSelectBrowse = function (e, t) {

		const y = window.nuBrowseFunction;					//-- browse, lookup or custom function name
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

function nuObjectPosition(id) {

	const $id = nujQueryObj(id);

	const t = parseInt($id.css('top'), 10);
	const l = parseInt($id.css('left'), 10);
	const h = parseInt($id.css('height'), 10);
	const w = parseInt($id.css('width'), 10);

	const b = t + h;			// bottom
	const r = l + w;			// right

	return { t, l, h, w, b, r };

}

function nuFormWH() {

	let width = 0;
	let height = 0;
	let s = '[data-nu-object-id][data-nu-prefix=""], [data-nu-subform=true]';

	if (nuSERVERRESPONSE.record_id == -2) {
		s = '[data-nu-object-id]';
	}

	$(s).each(function () {

		let { t, l, h, w } = nuObjectPosition($(this).attr('id'));

		width = Math.max(width, w + l);
		height = Math.max(height, h + t);

	});

	return { 'width': width, 'height': height };

}

function nuResizeFormDialogCoordinates() {

	const wh = nuFormWH();
	let w = wh.width;
	let h = wh.height;

	w = w + 40;
	h = h + nuDialogHeadersHeight() + 50;

	const parentDocument = window.parent.document;
	const windowInnerHeight = window.innerHeight;
	const $body = $('body');

	let dragDlg = $('#nuDragDialog', parentDocument);
	if (dragDlg.length == 0) { return; }

	dragDlg.css('visibility', 'visible');
	dragDlg.css('width', w + 12);
	$('#nuWindow', parentDocument).css('width', w);
	$body.css('width', w);

	dragDlg.css('height', h + 50).css('visibility', 'visible');
	$('#nuWindow', parentDocument).css('height', h + 10);
	$body.css('height', windowInnerHeight);

	if (h < windowInnerHeight) {
		$body.css('height', '100%');
	} else {
		$body.css('height', h);
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

	const r = JSON.parse(JSON.stringify(nuSERVERRESPONSE));
	let o = -1;

	for (let i = 0; i < r.objects.length; i++) {

		const obj = r.objects[i];
		if (obj.id == id) {

			if (filter) {
				if (obj.filter == filter) { return; }
				obj.filter = filter;

			}

			o = i;

		}

	}

	if (o == -1) { return; }

	nuRUN(r, o, '', '', r);

}

function nuRecordRun(id, filter) {

	const r = JSON.parse(JSON.stringify(nuSERVERRESPONSE));
	let o = -1;

	for (let i = 0; i < r.objects.length; i++) {

		const obj = r.objects[i];
		if (obj.id == id) {

			if (filter) {
				if (obj.record_id == filter) { return; }
				obj.record_id = filter;
			}

			o = i;

		}

	}

	if (o == -1) { return; }

	nuRUN(r, o, '', '', r);

}

function nuGetIframeValue(iframeId, elementId, method = 'val') {

	const $iframe = $('#' + iframeId);
	if (!$iframe.length) return null;

	const $element = $iframe.contents().find('#' + elementId);
	if (!$element.length) return null;

	return method === 'html' ? $element.html() : $element.val();

}

function nuSetIframeValue(iframeId, elementId, value, method = 'val') {

	const $iframe = $('#' + iframeId);
	if (!$iframe.length) return false;

	const $element = $iframe.contents().find('#' + elementId);
	if (!$element.length) return false;

	if (method === 'html') {
		$element.html(value);
	} else {
		$element.val(value);
	}
	return true;

}

function nuGetIframeProperty(frameId, property) {

	const el = document.getElementById(frameId);
	if (!el) return null;
	const win = el.contentWindow;
	if (win && typeof win.nuGetProperty === 'function') {
		return win.nuGetProperty(property);
	}

	return null;

}

function nuSetIframeProperty(frameId, property, value, refresh = true) {

	const el = document.getElementById(frameId);

	if (!el) return false;

	const win = el.contentWindow;
	if (win && typeof win.nuSetProperty === 'function') {
		win.nuSetProperty(property, value);
		if (refresh && typeof win.nuGetBreadcrumb === 'function') {
			win.nuGetBreadcrumb();
		}
		return true;
	}

	return false;

}

function nuRefreshIframe(frameId) {

	const iframeEl = document.getElementById(frameId);

	if (!iframeEl || !iframeEl.contentWindow) {
		return false;
	}

	if (typeof iframeEl.contentWindow.nuGetBreadcrumb !== 'function') {
		return false;
	}

	iframeEl.contentWindow.nuGetBreadcrumb();
	return true;

}

function nuLookingUp() {

	for (let lu in window.nuLOOKUPSTATE) {

		if (window.nuLOOKUPSTATE[lu] == 'looking') {
			return true;
		}

	}

	return false;

}

function nuPortraitScreen(columns = 1) {

	function nuPortraitScreenObjDimensions(id, element) {

		let height = element.outerHeight()

		if (element.is('[data-select2-id]')) {
			const incHeight = element.attr('multiple') ? 10 : 5;
			height = element.data('nu-org-height') + incHeight;
		}

		if (!element.is("[data-nu-mobile-hidden]")) {
			maxWidth = Math.max(maxWidth, element.outerWidth());
		}

		let heightLabel = $('#label_' + id).length == 0 ? 0 : $('#label_' + id).outerHeight()

		if (element.is('input') || element.is('select')) {
			height = height * 1.5;
			element.height(height);
		}

		const maxHeight = element.attr('data-nu-mobile-max-height');
		if (maxHeight) {
			element.css('height', Math.min(element.nuCSSNumber('height'), parseFloat(maxHeight)));
		}

		return { height, maxWidth, heightLabel }

	}

	const nuPortraitSetTransformScale = (objectWidth, screenWidth) => {
		const maxScale = 2.5;
		const scale = Math.min(screenWidth / objectWidth, maxScale);
		$('#nubody').css({ 'width': objectWidth, 'transform': `scale(${scale})` });
		return scale;
	};

	const nuPortraitAppendTab = (tabId, top) => {
		const tabElement = $(`#nuTab${tabId}`);
		const tabContent = tabElement.html();
		const tabDiv = `<div class="nuPortraitTab" id="nuPort${tabId}" style="top:${top}px">${tabContent}</div>`;

		if ($('#' + `nuPort${tabId}`).length === 0) {
			$('#nuRECORD').append(tabDiv);
			return $(`#nuPort${tabId}`).outerHeight();
		} else {
			return 0;
		}
	};

	const nuSetPortraitElementPosition = (element, top, sameRow, previousWidth, previousTop, labelWidth) => {
		const spacing = Number(element.attr('data-nu-mobile-same-row') || 0);
		if (sameRow) {
			element.css({ 'top': previousTop, 'left': previousWidth + spacing });
		} else {
			element.css({ 'top': top, 'left': labelWidth + 10 });
		}

		const maxWidth = element.attr('data-nu-mobile-max-width');
		if (maxWidth) {
			element.css('width', Math.min(element.nuCSSNumber('width'), parseFloat(maxWidth)));
		}

	};

	const nuPortraitHandleLookup = (id, top, labelWidth) => {
		const codeElement = $(`#${id}code`);
		const descElement = $(`#${id}description`);
		const buttonElement = $(`#${id}button`);

		const codeWidth = codeElement.outerWidth();
		const descWidth = descElement.outerWidth();

		codeElement.css({ 'top': top, 'left': labelWidth + 10 });
		buttonElement.css({ 'top': top, 'left': labelWidth + codeWidth + 15 });

		let height = codeElement.outerHeight() * 1.5;
		codeElement.height(height);
		descElement.height(height);
		top += height;

		top += 15;
		descElement.css({ 'top': top, 'left': labelWidth + 10, 'width': codeWidth - 5 });

		return { top, width: codeWidth + descWidth + 30 };
	};

	const nuPortraitHandleFileInput = (id, top, labelWidth) => {
		const inputElement = $(`#${id}_input`);
		top += 5;
		inputElement.css({ 'top': top, 'left': labelWidth + 10 });
		return top + 5;
	};

	const nuPortraitAdjustLabelStyles = (columns, maxWidth, labelWidth) => {
		if (columns === 1) {
			$('label').css({ 'text-align': 'left', 'width': maxWidth, 'left': 12 });
		} else {
			$('label').css({ 'text-align': 'left', 'width': labelWidth });
		}
	};

	$('#nubody').css('transform', 'scale(1)');

	if (nuFormType() === 'browse') { return; }

	window.nuPORTRAITSCREEN = true;
	$('.nuBuilderLink').remove();
	$('.nuPortraitTab').remove();

	const objects = nuSERVERRESPONSE.objects;
	const labelWidth = columns === 1 ? 0 : nuPortraitLabelWidth(objects);
	let top = 0;
	let currentTab = -1;
	var maxWidth = 0;
	let objWidth = 0;
	let objTop = 0;

	objects.forEach(obj => {
		const { id, type: objType, tab: objTab, read, input } = obj;
		let element = $(`#${id}`);

		var { height, maxWidth, heightLabel } = nuPortraitScreenObjDimensions(id, element);

		const tabElement = $(`#nuTab${objTab}`);
		let tabVisible = tabElement.nuIsVisible();

		if (objTab !== currentTab && tabVisible && window.nuPortraitScreenShowTabTitles !== false && objType !== 'contentbox') {
			if ($('.nuTab').length > 1) {
				currentTab = objTab;
				if (currentTab > 0) {
					top += 20;
				}
				const tabHeight = nuPortraitAppendTab(currentTab, top);
				top += tabHeight + 5;
			}
		}

		tabVisible = tabElement.nuIsVisible() || $('.nuTab').length === 1;

		if (element.is("[data-nu-mobile-hidden]") || !tabVisible) {
			const { componentIds } = nuObjectComponents(id);
			componentIds.forEach(compId => {
				const comp = $(`#${compId}`);
				comp.attr('data-nu-mobile-hidden', '');
				comp.hide();
			});
		} else {
			if (read !== 2) {
				if (objType === 'contentbox') {
					element.attr('data-nu-mobile-hidden', '');
					element.hide();
				} else {
					$('#label_' + id).css({ 'top': top + 2, 'left': 7, 'text-align': 'left', 'font-weight': 700 });

					const sameRow = element.is('[data-nu-mobile-same-row]');
					if (columns === 1 && !sameRow) {
						top += heightLabel + 5;
					}

					if (element.is('[data-select2-id]')) {
						element = $(`#${id}_select2`);
					}

					nuSetPortraitElementPosition(element, top, sameRow, objWidth, objTop, labelWidth);

					if (objType === 'lookup') {
						const lookupResult = nuPortraitHandleLookup(id, top, labelWidth);
						top = lookupResult.top;
						maxWidth = Math.max(maxWidth, lookupResult.width);
					} else if (input === 'file') {
						top = nuPortraitHandleFileInput(id, top, labelWidth);
					}

					objWidth = labelWidth + 10 + Number(obj.width);
					objTop = top;

					if (!sameRow) {
						top += height + 5;
					}

				}
			}
		}
	});

	$("[data-nu-tab!='x'][data-nu-form='']:not([data-nu-lookup-id]):not([data-nu-mobile-hidden])").show();
	$('#nuTabHolder').hide();

	top += 50;
	$('#nuRECORD').append(`<div id="nuPortEnd" style="left:0px;position:absolute;top:${top}px">&nbsp;</div>`);

	nuPortraitAdjustLabelStyles(columns, maxWidth, labelWidth);

	let windowInnerWidth = nuGetWindowProperty('nuWindowInnerWidth', nuFormId());

	if (!windowInnerWidth) {
		windowInnerWidth = window.innerWidth;
		nuSetWindowProperty('nuWindowInnerWidth', nuFormId(), windowInnerWidth);
	};

	const objectWidth = maxWidth + labelWidth + 50;
	const scale = nuPortraitSetTransformScale(objectWidth, windowInnerWidth);

	$('html, body').scrollTop(0).scrollLeft(0);
	window.scrollTo(0, 0);

	$('#nuBreadcrumbHolder').css('width', window.visualViewport.width);

	return scale;
}

function nuUseMobileView() {
	return nuIsMobile() && nuUXOptions.nuMobileView && nuCurrentProperties().mobile_view == "1";
}

function nuSetMobileView1() {

	if (nuUseMobileView()) {
		if (nuFormType() == 'edit') {
			nuPortraitScreen();
			$('button').css('text-align', 'left');
		} else {
			$('#nuBreadcrumbHolder').css('width', window.visualViewport.width);
		}
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
	// Number of rows displayed per page
	const rowsPerPage = $("div[id^='nucell_']" + "[id$='_1']").length;

	// Get current form data
	const currentFormData = nuFORM.getCurrent();

	// Extract relevant pagination details
	const currentPageNumber = currentFormData.page_number;
	const totalFilteredRows = currentFormData.browse_filtered_rows;
	const totalPages = currentFormData.pages;

	// Variables to hold calculated values
	let startRow;
	let endRow;

	// Logic to determine start and end rows based on pagination state
	if (currentPageNumber == 0 && totalFilteredRows > 0 && totalPages == 1) {
		// Special case: Single page with results
		startRow = 1;
		endRow = totalFilteredRows;
	} else if (totalPages == currentPageNumber + 1 || totalFilteredRows == 0) {
		// Last page or no results
		startRow = totalFilteredRows == 0 ? 0 : currentPageNumber * rowsPerPage + 1;
		endRow = totalFilteredRows;
	} else if (currentPageNumber == 0 && totalPages > 1) {
		// First page with multiple pages
		startRow = 1;
		endRow = rowsPerPage;
	} else if (currentPageNumber > 0 && currentPageNumber < totalPages) {
		// Any middle page
		endRow = (currentPageNumber + 1) * rowsPerPage;
		startRow = endRow - rowsPerPage + 1;
	}

	// Return the calculated pagination details
	return {
		startRow: startRow,
		endRow: endRow,
		totalRows: totalFilteredRows
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

		var html = '<span id="nuFirst" class="nuBrowsePage" style="font-size: 15px;"><i class="fa fa-step-backward ml-5 mr-5" onclick="nuGetPage(1)">&nbsp;&nbsp;&nbsp;&nbsp;</i></span>';
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

class nuPromptModal {

	constructor() {
		this.modalElement = document.getElementById('nupromptmodal');
		this.promptElement = document.getElementById('nuprompt');
		this.headElement = document.getElementById('nuprompthead');
		this.bodyElement = document.getElementById('nupromptbody');
		this.footElement = document.getElementById('nupromptfoot');
	}

	displayModal(visible = false) {
		const displayStyle = visible ? "block" : "none";
		this.modalElement.style.display = this.promptElement.style.display = displayStyle;
	}

	setPosition() {
		const winW = window.innerWidth;
		const winH = window.innerHeight;
		this.modalElement.style.height = `${winH}px`;
		this.promptElement.style.left = `${(winW / 2) - (560 / 2)}px`;
		this.promptElement.style.top = "5px";
	}

	render(text, caption, defaultValue, format, fctn) {
		this.setPosition();
		this.displayModal(true);

		this.headElement.innerHTML = caption;
		this.bodyElement.innerHTML =
			`${text}<br><input id="prompt_value1" style="width: 450px; margin-top: 10px; border: 1px solid #CCC; padding: 10px; border-radius: 4px;" />`;
		this.footElement.innerHTML =
			`<button class="nuActionButton" onclick="nuPromptWindow.ok('${fctn}', true)">OK</button> <button class="nuActionButton" onclick="nuPromptWindow.cancel('${fctn}', false)">Cancel</button>`;

		const inputElement = document.getElementById("prompt_value1");
		inputElement.value = nuDefine(defaultValue, '')
		inputElement.onkeyup = (e) => this.handleKeyup(e, fctn);
		inputElement.focus();
	}

	handleKeyup(e, fctn) {
		if (e.key === "Enter") {
			this.ok(fctn);
		} else if (e.key === "Escape") {
			this.cancel(fctn);
		}
	}

	cancel(fctn) {
		window[fctn](null, false);
		this.displayModal(false);
	}

	ok(fctn) {
		const value = document.getElementById('prompt_value1')
			.value;
		window[fctn](value, true);
		this.displayModal(false);
	}

}

function nuPrompt(text, caption, defaultValue, format, fctn) {

	if (!document.getElementById('nupromptmodal')) {
		const nuPromptDiv =
			`
		<div id="nupromptmodal"></div>
		<div id="nuprompt">
		  <div id="nuprompthead"></div>
		  <div id="nupromptbody"></div>
		  <div id="nupromptfoot"></div>
		</div>`;
		document.body.insertAdjacentHTML('beforeend', nuPromptDiv);
		nuPromptWindow = new nuPromptModal();
	}

	fctn = nuDefine(fctn, 'nuOnPromptClose');
	nuPromptWindow.render(text, caption, defaultValue, format, fctn);

}

function nuOnPromptClose(val, ok) {
}

function nuAddBrowseTitleSelect(index, data, w) {

	if (!Array.isArray(data)) return;

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

	return $('#' + id);

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

	let $id = $('#' + id);

	$id.attr('date-nu-select2', 1);

	let select2Id = $('#' + id).attr('id') + "_select2";

	let lang = (nuSERVERRESPONSE.language === null ? 'en' : nuSERVERRESPONSE.language.toLowerCase());
	let select2OptionsDefault = {
		dropdownParent: $('#nuRECORD'),
		selectionCssClass: select2Id,
		theme: nuUXOptions.nuSelect2Theme ? nuUXOptions.nuSelect2Theme : 'default',
		language: lang
		//	placeholder: $id.attr('placeholder')
	};

	let objSelect2OptionsDefault = { options: select2OptionsDefault };
	let select2UserOptions = [];

	if (typeof window.nuOnSetSelect2Options === 'function') {
		select2UserOptions = window.nuOnSetSelect2Options(id, objSelect2OptionsDefault);
	}

	let select2Options = Object.assign(select2UserOptions, objSelect2OptionsDefault.options);
	// select2Options = {...objSelect2OptionsDefault.options, ...select2UserOptions};

	$id.data('nu-org-height', $id.outerHeight());

	$id.select2(select2Options);

	$('.' + select2Id).parent().parent().css({
		position: 'absolute',
		width: Number(obj.width),
		top: Number(obj.top),
		left: Number(obj.left)
	}).attr('id', select2Id);

	return select2Id;

}

function nuSelectAddEnglishOption(id) {

	var lang = $('#' + id);
	if (lang.val() === '') {
		lang.append($('<option>', {
			value: 1,
			text: nuTranslate("English"),
			disabled: true,
			selected: true,
			hidden: true
		}));
	}

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
		element.innerHTML = '<br>&nbsp<span style="padding: 1px 10px 1px 10px;" class="nuActionButton"><i class="' + icon + '"></i></span>';
	}

	if (nuIsMobile() || force === true) {
		setInnerHTML(title_accformslf_add_button, 'fas fa-plus');
		setInnerHTML(title_accformslf_print_button, 'fas fa-print');
		setInnerHTML(title_accformslf_save_button, 'fas fa-save');
		setInnerHTML(title_accformslf_clone_button, 'fas fa-clone');
		setInnerHTML(title_accformslf_delete_button, 'fas fa-trash-alt');
	}

}

function nuSetBrowseNoDataMessage(str) {
	$('.nuBrowseNoData').html(nuTranslate(str));
}

function nuSetBrowseNoSearchResultsMessage(str) {
	$('.nuBrowseNoResults').html(nuTranslate(str));
}

function nuSetSaveButtonProperties(sb, t, l, h, w, fs) {

	sb.css({
		"top": t + "px",
		"left": l + "px",
		"width": w + "px",
		"position": "absolute",
		"height": h + "px",
		"margin": "unset"
	});

	sb.attr('data-nu-tab', '0');
	sb.attr('data-nu-form', '');

	if (fs) sb[0].style.fontSize = fs + "px";
	if (nuSelectedTabNumber() !== '0') sb.css('display', 'none');

	return sb;

}

function nuSetSaveButtonPosition(t, l, h, w, fs) {

	var sb = $('#nuSaveButton');
	sb.appendTo('div#nuRECORD');

	if (!w) w = sb.nuCSSNumber("width");
	if (!h) h = sb.nuCSSNumber("height");

	return nuSetSaveButtonProperties(sb, t, l, h, w, fs);

}

function nuAttachSaveButtonTo(i, dx, dy, h, w, fs) {

	var sb = $('#nuSaveButton');
	var dest = $('#' + i);

	if (dest === undefined || nuDebugOut(dest, i)) return false;

	dest.after(sb);

	if (!dx || dx == 0) dx = 0;
	if (!dy || dy == 0) dy = 0;
	if (!w || w == 0) w = sb.nuCSSNumber("width");
	if (!h || h == 0) h = sb.nuCSSNumber("height");

	return nuSetSaveButtonProperties(sb, dest.nuCSSNumber("top") + dest.nuCSSNumber("height") + 15 + dy, dest.nuCSSNumber("left") + dx, h, w, fs);

}

function nuUppyGetLanguageCodeAndLocale(language) {

	const languagesData = [
		{ language: 'Vietnamese', code: 'vi_VN', locale: Uppy.locales.vi_VN },
		{ language: 'Turkish', code: 'tr_TR', locale: Uppy.locales.tr_TR },
		{ language: 'Spanish', code: 'es_ES', locale: Uppy.locales.es_ES },
		{ language: 'Slovak', code: 'sk_SK', locale: Uppy.locales.sk_SK },
		{ language: 'Russian', code: 'ru_RU', locale: Uppy.locales.ru_RU },
		{ language: 'Romanian', code: 'ro_RO', locale: Uppy.locales.ro_RO },
		{ language: 'Portuguese', code: 'pt_PT', locale: Uppy.locales.pt_PT },
		{ language: 'Polish', code: 'pl_PL', locale: Uppy.locales.pl_PL },
		{ language: 'Japanese', code: 'ja_JP', locale: Uppy.locales.ja_JP },
		{ language: 'Italian', code: 'it_IT', locale: Uppy.locales.it_IT },
		{ language: 'Hindi', code: 'hi_IN', locale: Uppy.locales.hi_IN },
		{ language: 'Greek', code: 'el_GR', locale: Uppy.locales.el_GR },
		{ language: 'German', code: 'de_DE', locale: Uppy.locales.de_DE },
		{ language: 'French', code: 'fr_FR', locale: Uppy.locales.fr_FR },
		{ language: 'Dutch', code: 'nl_NL', locale: Uppy.locales.nl_NL },
		{ language: 'Danish', code: 'da_DK', locale: Uppy.locales.da_DK },
		{ language: 'Czech', code: 'cs_CZ', locale: Uppy.locales.cs_CZ },
		{ language: 'Chinese', code: 'zh_CN', locale: Uppy.locales.zh_CN },
		{ language: 'Catalan', code: 'ca_ES', locale: Uppy.locales.ca_ES },
		{ language: 'Armenian', code: 'hy_AM', locale: Uppy.locales.hy_AM },
		{ language: 'Arabic', code: 'ar_SA', locale: Uppy.locales.ar_SA },
		{ language: 'Afrikaans', code: 'af_ZA', locale: Uppy.locales.af_ZA }
	];

	const languageData = languagesData.find(data => data.language === language);

	if (languageData) {
		return { code: languageData.code, locale: languageData.locale };
	} else {
		return null;
	}

}

function nuUppyCreate(language, languageFallback = null) {

	let uppy = new Uppy.Uppy();
	nuUppySetLanguage(uppy, language, languageFallback)
	return uppy;

}

function nuUppySetLanguage(uppy, language, languageFallback) {

	let userLanguage = language || nuUserLanguage();
	if (!userLanguage) {
		userLanguage = languageFallback;
	}

	if (!userLanguage) return;

	let langResult = nuUppyGetLanguageCodeAndLocale(userLanguage);

	if (!langResult) return;

	const setUppyLanguage = (locale) => {
		if (locale) {
			uppy.setOptions({ locale });
		}
	};

	if (!langResult.locale) {
		$.getScript(`core/libs/uppy/locales/${langResult.code}.min.js`, function (data, textStatus, jqxhr) {
			langResult = nuUppyGetLanguageCodeAndLocale(userLanguage);
			setUppyLanguage(langResult.locale);
		});
	} else {
		setUppyLanguage(langResult.locale);
	}

	return langResult;

}

function nuACEInitDblClickHandlers() {

	$('.js, .sql, .html, .php, .css').on('dblclick', function () {
		const language = $(this).attr('class').split(' ')[0].toUpperCase();
		nuOpenAce(language, this.id);
	});

}

function nuCalendarWeekStartNumber() {

	let ws = nuUXOptions.nuCalendarStartOfWeek;
	if (ws !== undefined) {
		ws = String(ws);
		ws = ws.length == 1 ? ws : ws.replace('Sunday', 0).replace('Monday', 1);
	}

	return ws;

}

function nuCalendarWeekNumbers() {

	const weekNum = nuUXOptions.nuCalendarWeekNumbers || 0;

	const mapping = {
		"None": 0,
		"ISO 8601": 1,
		"Western traditional": 2,
		"Middle Eastern": 3
	};

	if (weekNum in mapping) {
		return mapping[weekNum];
	} else {
		return 0;
	}
}

function nuConvertToVanillaJSCalendarFormat(format) {

	const formatMapping = {
		'D|': '',
		'mmmm': 'MM',
		'dddd': 'DD',
		'ddd': 'D',
		'mmm': 'M'
	};

	let vanillaJSFormat = format;
	for (const [key, value] of Object.entries(formatMapping)) {
		vanillaJSFormat = vanillaJSFormat.split(key).join(value);
	}

	return vanillaJSFormat;

}

function nuPopupCalendar(pThis, d) {

	if (pThis === null) { return; }
	if ($(pThis).is("[nu-disable-calendar]")) return;

	let id = pThis.id;
	nuDestroyWindowProperty('nudatepickers', id)

	let optionWeekStart = {};
	let weekStartNumber = nuCalendarWeekStartNumber();

	let calendarOptionsDefault = {
		autohide: true,
		calendarWeeks: nuCalendarWeekNumbers(),
		defaultViewDate: d,
		format: nuConvertToVanillaJSCalendarFormat($(pThis).attr('data-nu-format')),
		todayHighlight: true,
		clearBtn: true,
		// updateOnBlur: false,
		weekStart: (weekStartNumber !== undefined ? weekStartNumber : 0)
	}

	let objCalendarOptionsDefault = { options: calendarOptionsDefault };
	let calendarUserOptions = [];

	if (typeof window.nuOnSetCalendarOptions === 'function') {
		calendarUserOptions = window.nuOnSetCalendarOptions(id, objCalendarOptionsDefault);
	}

	let calendarOptions = Object.assign(calendarUserOptions, objCalendarOptionsDefault.options);

	Datepicker.locales.en = {
		days: nuTranslate(["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]),
		daysShort: nuTranslate(["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]),
		daysMin: nuTranslate(["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"]),
		months: nuTranslate(["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]),
		monthsShort: nuTranslate(["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]),
		today: nuTranslate("Today"),
		clear: nuTranslate("Clear"),
		titleFormat: "MM y"
	}

	datepicker = new Datepicker(pThis, calendarOptions);

	const nuChangeDate = function (e) {
		$(e.target).trigger('change');
		datepicker.destroy();
	}

	$(pThis).off('changeDate.vanillajspicker').on('changeDate.vanillajspicker', nuChangeDate);

	nuSetWindowProperty('nudatepickers', id, datepicker);

	datepicker.setOptions({ defaultViewDate: d });
	datepicker.show();

	nuSetCalendarOnTop();

}

function nuSetCalendarOnTop() {

	const $innerDiv = $('.datepicker');
	const offset = $innerDiv.offset();

	$innerDiv.appendTo('body');
	$innerDiv.css({ position: 'absolute', top: offset.top, left: offset.left });

}
