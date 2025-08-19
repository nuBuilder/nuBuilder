
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
		'nuEditCloseAfterSave': 'None',			// Close forms after saving. Values: none, All, User, System
		'nuShowJSErrors': 'None',				// Show JS errors in alert message
		'nuHideTabTitleIfOnlyOne': 'None',		// Hide tab title if only one tab. Values: none, globeadmin, user, everyone
		'nuShowURLPermaLink': false,			// Show URL permalink
		'nuPrintButton': false,
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
			}
		}
	}
}

function nuBuildForm(formObj) {

	$('.nuSearchablePopup, .nuSearchableMultiPopup').remove();
	nuInitJSOptions();

	window.nuOnSetSelect2Options = null;		// can be overwritten by nuAddJavaScript()
	window.nuSERVERRESPONSE = formObj;

	if (nuArrangingObjects(formObj.record_id)) {
		nuAddJavaScript(formObj.javascript_bc);
	}

	$('#nubody').off('.nuresizecolumn').css('transform', 'scale(1)');
	$('html,body').scrollTop(0).scrollLeft(0);

	if (nuNeedToLoginAgain(formObj)) return;

	if (window.nuInfoBarHideOnFormClose) {
		$.nuInfoBar.closeAll({ animationType: 'none', animationDuration: 0 });
	}

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
	nuSetHideTabIfOnlyOne();

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

	if (nuGlobalAccess()) {
		nuAddAdminButtons();
	}

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

		nuActionButtonsToggleVisibility();

	}

	if (nuUXOptions.nuShowBrowserTabTitle) {
		nuSetBrowserTabTitle(nuUXOptions.nuBrowserTabTitlePrefix);
	} else {
		document.title = nuUXOptions.nuBrowserTabTitlePrefix;
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
	nuAddObjectFunctions();
	nuSetBrowseHeight();

	const globalAccess = nuGlobalAccess();
	if (globalAccess) {
		nuContextMenuUpdate();
		nuUpdateDebugButtonTitle();
	}

	nuSetSaved(true);

	nuCursor('default');

	window.nuPORTRAITSCREEN = false;
	if (!nuIsMobile() && formType == 'browse') {
		$('#nuSearchField').nuSetFocus();
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
		'browse_target',
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

function nuDebugLastMessages() {

	if (!nuSERVERRESPONSE || !nuSERVERRESPONSE.nu_debug_last) {
		return '';
	}
	const debugMessages = JSON.parse(nuSERVERRESPONSE.nu_debug_last);
	return debugMessages.map(item =>
		`User: ${item.user}\nTimestamp: ${item.timestamp_from_message}\nWhere: ${item.where}\nMessage: ${item.message}`
	).join('\n\n');

}

function nuUpdateDebugButtonTitle() {

	if (!nuGlobalAccess()) return;

	const debugMessages = nuSERVERRESPONSE?.nu_debug;
	const lastMessages = nuDebugLastMessages();

	let titleParts = [];

	if (Array.isArray(debugMessages) && debugMessages.length > 0) {
		titleParts.push(debugMessages.join(" "));
	}

	if (lastMessages) {
		titleParts.push(lastMessages);
	}

	let title = titleParts.join('\n').trim();

	if (!title) {
		title = "No messages";
	}

	$("#nuDebugButton")
		.toggleClass("nuDebugButtonHighlight", Array.isArray(debugMessages) && debugMessages.length > 0)
		.attr("title", title);
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

function nuSetHideTabIfOnlyOne() {

	if (window.nuUXOptions.nuHideTabTitleIfOnlyOne && $('.nuTab:visible').length === 1) {

		const nuHideTabTitleIfOnlyOne = window.nuUXOptions.nuHideTabTitleIfOnlyOne;
		let hideTab = false;
		switch (nuHideTabTitleIfOnlyOne.toLowerCase()) {
			case "globeadmin":
				hideTab = nuGlobalAccess()
				break;
			case "user":
				hideTab = !nuGlobalAccess();
				break;
			case "everyone":
				hideTab = true;
				break;
		}

		if (hideTab) {
			$('.nuTab').hide();
			$('.nuTabHolder').hide();
		}

	}

}


function nuAddHome() {

	if (window.nuLoginH != '') {

		let breadCrumb = $('#nuBreadcrumb0').length > 0 ? $('#nuBreadcrumb0') : $('#nuHomeGap');
		breadCrumb
			.html('<i class="fa fa-home fa-width-auto" style="font-size:17px;"></i>')
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
	window.nuOnHelpIconClick = null;
	window.nuOnAddHelpIcon = null;
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

		if (window['nuBrowseNoData'] || window['nuBrowseNoSearchResults']) $('.nuBrowseFooter').hide();

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

function nuBrowseStyleBadge(column) {

	function createBadgeHtml(text) {
		return `
			<span class="text-badge" style="
				background-color: #e7f3ff;
				color: #2964bd;
				border: none;
				border-color: transparent;
				border-radius: 12px;
				padding: 2px 10px;
				box-shadow: none;
				display: inline-block;
				white-space: nowrap;
				line-height: 1.2;
				transition: all 0.2s ease;
				margin-top:1px
			">${text}</span>
		`;
	}

	nuBrowseLoop([column], function (cell) {
		const $cell = $(cell);
		const cellText = $cell.text().trim();

		if (cellText && cellText.length > 0) {
			$cell.html(createBadgeHtml(cellText));
		}
	});

}

function nuBrowseStyleStatusColumn(column) {

	const statusConfig = {
		active: {
			color: '#28a745',
			bgColor: '#d4edda',
			icon: '✓',
			text: 'Active'
		},
		draft: {
			color: '#6c757d',
			bgColor: '#e2e3e5',
			icon: '&#9998;',
			text: 'Draft',
			italic: true
		},
		archived: {
			color: '#6c757d',
			bgColor: '#f1f3f5',
			icon: '&#128230;',
			text: 'Archived'
		}
	};

	function createStatusHtml(config) {
		return `
			<span class="status-enhanced status-${config.text.toLowerCase()}" style="
				color: ${config.color};
				position: relative;
				padding-left: 28px;
				display: inline-flex;
				align-items: center;
				font-size: 13px;
				${config.italic ? 'font-style: italic;' : ''}
			">
				<span class="status-icon" style="
					position: absolute;
					left: 0;
					top: 50%;
					transform: translateY(-50%);
					background: ${config.bgColor};
					color: ${config.color};
					width: 20px;
					height: 20px;
					border-radius: 50%;
					font-size: 10px;
					font-weight: bold;
					line-height: 1;
					display: flex;
					align-items: center;
					justify-content: center;
					box-shadow: 0 1px 3px rgba(${config.color === '#28a745' ? '40, 167, 69' : '108, 117, 125'}, 0.3);
				">${config.icon}</span>
				${config.text}
			</span>
		`;
	}

	nuBrowseLoop([column], function (cell) {
		const $cell = $(cell);
		const cellText = $cell.text().trim().toLowerCase();
		for (const [status, config] of Object.entries(statusConfig)) {
			if (cellText.includes(status)) {
				$cell.html(createStatusHtml(config));
				break;
			}
		}
	});

}

function nuBrowseRowsPerPageFilter(rowsPerPageOptions, insertBeforeTarget = '#nuFirst', customStyle) {

	if (nuFormType() !== 'browse') return;

	const defaultOptions = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 150, 200];
	const options = rowsPerPageOptions ?? defaultOptions;
	const isDefaultPosition = insertBeforeTarget === '#nuFirst';
	const defaultMarginLeft = isDefaultPosition ? '0px' : '20px';
	const defaultMarginRight = isDefaultPosition ? '10px' : '0px';
	const defaultStyle = `margin-left: ${defaultMarginLeft}; margin-right: ${defaultMarginRight}; width: 50px; height: 22px; text-align: left`;
	const style = customStyle ?? defaultStyle;

	const selectId = 'nuBrowseRowsPerPage';
	const hashCookie = 'ROWS_PER_PAGE';
	const selectElement = $(
		`<select id="${selectId}" style="${style}" aria-label="Number of Rows per Page"></select>`
	);

	selectElement
		.attr('title', nuTranslate('Number of Rows'))
		.append(`<option value="" disabled selected>${nuGetProperty('rows')}</option>`);

	for (let val of options) {
		selectElement.append(`<option value="${val}">${val}</option>`);
	}

	const $target = insertBeforeTarget instanceof jQuery
		? insertBeforeTarget
		: $(insertBeforeTarget);

	selectElement.insertBefore($target);

	selectElement.on('change', function () {
		nuSetProperty('page_number', 0);
		nuSetProperty(hashCookie, this.value);
		nuSearchAction();
	});

	selectElement.val(nuGetProperty(hashCookie) ?? '');

}

function nuPrintIncludeColumns(arr) {
	nuSetProperty('nuPrintIncludedColumns', nuEncode(arr));
}

function nuPrintExcludeColumns(arr) {
	nuSetProperty('nuPrintExcludedColumns', nuEncode(arr));
}

function nuPrintIncludeHiddenColumns(include) {
	nuSetProperty('nuPrintIncludeHiddenColumns', include ? '1' : '0');
}

function nuPrintUseBrowseFormats(value) {
	nuSetProperty('nuPrintUseBrowseFormats', value ? '1' : '0');
}

function nuPrintCSVExportOptions(options) {
	nuSetProperty('nuPrintCSVExportOptions', nuEncode(JSON.stringify(options)));
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

	for (const { id, js } of JSON.parse(JSON.stringify(nuSERVERRESPONSE)).objects) {
		js.filter(e => e.event === 'onnuload').forEach(e => {
			let modifiedJS = e.js.replaceAll('(this)', `("#${id}")`).replaceAll('this.', `${id}.`);
			eval(modifiedJS);
		});
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
			nuAddIconToBreadCrumb2('nuLogout', 'Log out', 16, 'nuAskLogout()', 'fa-solid fa-sign-out-alt');
		}

	}

}

function nuAddIconToBreadCrumb2(id, title, right, handler, iconClass) {

	const div = nuCreateElementWithId('div', id, 'nuBreadcrumbHolder');

	$(div)
		.addClass('nuBreadcrumbIcon2')
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
			.css('width', window.innerWidth - 1);
		//	.css('height', height);

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
	const button = form.buttons;
	const isMobile = nuIsMobile();

	if (nuFormType() == 'browse') {
		const searchValue = nuDefine(nuFORM.getProperty('search'));
		const filter = nuDefine(nuFORM.getProperty('filter'));

		$('#nuActionHolder').append(
			'<div class="nuSearchWrapper">' +
			'<input '
			+ 'id="nuSearchField" '
			+ 'type="text" '
			+ 'class="nuSearch" '
			+ 'onkeypress="nuSearchPressed(event)" '
			+ 'onkeydown="nuArrowPressed(event)" '
			+ 'value="' + searchValue + '" '
			+ '/>' +
			'<button '
			+ 'type="button" '
			+ 'id="nuSearchBtn" '
			+ 'class="nuSearchBtn" '
			+ 'title="Search">'
			+ '<i class="fa-solid fa-magnifying-glass"></i>' +
			'</button>' +
			'</div>'
		).append(
			"<input id='nuFilter' style='visibility:hidden;width:0px' value='" + filter + "'>"
		);

		$('#nuSearchBtn').on('click', function () {
			nuSearchAction();
		});

		if (button.Add == 1) {
			nuAddActionButton('Add');
		}

		if (button.Print == 1 && nuFORM.getCurrent().browse_rows.length > 0 && !isMobile) {
			nuAddActionButton('Print');
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
				if (button.Delete == 1) {
					nuAddActionButton('Delete');
				}
				if (button.Clone == 1) {
					nuAddActionButton('Clone');
				}
			}

			if (button.RunHidden != '') {
				nuAddActionButton('RunHidden', 'Run', button.RunHidden);
			}

			if (button.Run != '') {
				nuAddActionButton('Run', 'Run', button.Run);
			}
		}
	}

	if (isMobile) {
		$('#nuSearchButton #nuSaveButton #nuAddButton').addClass('nuActionButtonIcon');
	}

}

function nuAddActionButton(id, value, func, title, icon, insertAfterElement) {

	const DEFAULT_ICON_BASE = 'fa-regular';
	const ICON_SIZE_CLASSES = 'fa-width-auto fa-lg';

	const defaults = {
		Save: {
			value: 'Save',
			func: 'nuSaveAction()',
			text: '',
			iconSuffix: 'fa-floppy-disk',
			iconBaseClass: DEFAULT_ICON_BASE
		},
		SaveClose: {
			value: 'Save & Close',
			func: 'nuSaveAction(true)',
			text: '',
			iconSuffix: 'fa-floppy-disk',
			iconBaseClass: DEFAULT_ICON_BASE
		},
		Delete: {
			value: 'Delete',
			func: 'nuDeleteAction()',
			text: '',
			iconSuffix: 'fa-square-minus',
			iconBaseClass: DEFAULT_ICON_BASE
		},
		Add: {
			value: '',
			func: 'nuAddAction()',
			text: '',
			iconSuffix: 'fa-plus',
			iconBaseClass: 'fa-solid'
		},
		Print: {
			value: '',
			func: 'nuPrintAction()',
			text: '',
			iconSuffix: 'fa-list-ul',
			iconBaseClass: 'fa-solid'
		},
		Back: {
			value: 'Back',
			func: 'nuBackAction(this)',
			text: '',
			iconSuffix: 'fa-chevron-left',
			iconBaseClass: 'fa-solid'
		},
		Clone: {
			value: 'Clone',
			func: 'nuCloneAction()',
			text: '',
			iconSuffix: 'fa-clone',
			iconBaseClass: DEFAULT_ICON_BASE
		},
		BuildFastForm: {
			value: 'Build Fast Form',
			func: 'nuRunPHPHidden("nu_run_fast_form", true)',
			text: '',
			iconSuffix: 'fa-bolt',
			iconBaseClass: 'fa-solid'
		},
		BuildFastReport: {
			value: 'Build Fast Report',
			func: 'nuRunPHPHidden("nu_run_fast_report", true)',
			text: '',
			iconSuffix: 'fa-bolt',
			iconBaseClass: 'fa-solid'
		},
		RunHidden: {
			value: 'Run',
			func: 'nuRunHiddenAction()',
			text: '',
			iconSuffix: 'fa-circle-play',
			iconBaseClass: DEFAULT_ICON_BASE
		},
		Run: {
			value: 'Run',
			func: 'nuRunAction()',
			text: '',
			iconSuffix: 'fa-circle-play',
			iconBaseClass: DEFAULT_ICON_BASE
		}
	};

	if (['Save', 'SaveClose', 'Delete', 'Clone', 'Add', 'Print', 'Run', 'Back', 'RunHidden', 'BuildFastForm', 'BuildFastReport'].includes(id)) {
		const def = defaults[id] || {
			value: id,
			func: `nu${id}Action()`,
			text: id,
			iconSuffix: null,
			iconBaseClass: DEFAULT_ICON_BASE
		};

		value = value ?? def.value;
		func = func ?? def.func;
		title = title ?? def.text;

		const baseClass = def.iconBaseClass ?? DEFAULT_ICON_BASE;

		icon = icon ?? (
			def.iconSuffix
				? `${baseClass} ${ICON_SIZE_CLASSES} ${def.iconSuffix}`
				: null
		);

	}

	if (nuSERVERRESPONSE.form_type === 'launch' && $('.nuActionButton').length === 0) {

		const hasAdminButtons = $('.nuAdminButton').length > 0;
		const actionHolderHeight = nuTotalHeight('nuActionHolder');

		if (actionHolderHeight < 72 && hasAdminButtons) {
			$('.nuActionHolder').css('height', '72')
		} else if (actionHolderHeight < 45 && !hasAdminButtons) {
			$('.nuActionHolder').css('height', '45')
		}

	}

	if (typeof value === 'object') {
		value = nuUseMobileView() ? value.valueMobile : nuTranslate(nuDefine('value'));
	} else {
		value = nuTranslate(nuDefine(value));
	}

	title = nuTranslate(nuDefine(title));

	let nuClass = "nuActionButton";
	if (['Save', 'Add', 'Clone', 'Delete'].includes(id)) {
		nuClass += " nu" + id + "Button";
	}

	const elementId = "nu" + id + "Button";
	let html = `<button id="${elementId}" type="button" class="${nuClass}"
		title="${title}">` +
		(value ? `<span class="nuButtonLabel">${value}</span>` : '') +
		`</button>`;

	if (insertAfterElement) {
		$(html).insertAfter('#' + insertAfterElement);
	} else {
		$('#nuActionHolder').append(html);
	}

	if (icon) {
		nuAddInputIcon(elementId, icon);
	}

	if (nuIsMobile()) {
		$('.nuActionButton').css('height', '35px');
	}

	if (func) {
		$('#' + elementId).off('click').on('click', function () {
			if (typeof func === 'string') {
				try {
					new Function(func)();
				} catch (e) {
					console.error('Error executing button action:', e);
				}
			} else if (typeof func === 'function') {
				func();
			}
		});
	}

	return $('#' + elementId);

}

function nuAddActionButtonSaveClose(caption) {

	caption = nuDefine(caption, 'Save & Close');
	nuAddActionButton('SaveClose', caption);
	$('#nuSaveCloseButton').addClass('nuSaveButton');

}

(function ($) {

	$.fn.nuActionCheckbox = function (options) {
		const settings = $.extend({
			id: nuID(),
			text: 'Checkbox',
			checked: false,
			storage: 'property',	// 'property' | 'session' | 'local'
			onChecked: function (checked) { }
		}, options);

		function getStorageValue(key) {
			switch (settings.storage) {
				case 'session':
					return nuGetStorageItem(key, 'session');
				case 'local':
					return nuGetStorageItem(key, 'local');
				default:
					return nuGetProperty(key);
			}
		}

		function setStorageValue(key, value) {
			switch (settings.storage) {
				case 'session':
					nuSetStorageItem(key, value, 'session');
					break;
				case 'local':
					nuSetStorageItem(key, value, 'local');
					break;
				default:
					nuSetProperty(key, value);
			}
		}

		return this.each(function () {
			const key = settings.id + '_filter';
			const initial = getStorageValue(key) === '1' || settings.checked;

			const $label = $('<label>', {
				class: 'nuActionCheckbox',
				style: 'margin-left: 5px;'
			});

			const $checkbox = $('<input>', {
				type: 'checkbox',
				id: settings.id,
				checked: initial
			});

			const $iconUnchecked = $('<i>', { class: 'fa-regular fa-square unchecked-icon' });
			const $iconChecked = $('<i>', { class: 'fa-regular fa-square-check checked-icon' });
			const $span = $('<span>').text(settings.text);

			$label.append($checkbox, $iconUnchecked, $iconChecked, $span);
			$(this).empty().append($label);

			$checkbox.on('change', function () {
				const val = this.checked ? '1' : '0';
				setStorageValue(key, val);
				settings.onChecked(this.checked);
			});
		});
	};

}(jQuery));

function nuAddActionCheckbox(settings = {}) {

	const { insertAfterElement, ...pluginOpts } = settings;
	const $span = $('<span></span>');
	if (insertAfterElement) {
		$span.insertAfter('#' + insertAfterElement);
	} else {
		$span.appendTo('#nuActionHolder');
	}
	$span.nuActionCheckbox(pluginOpts);

}

function nuActionButtonsToggleVisibility() {

	const nuSearchField = document.getElementById('nuSearchField');
	const addButton = document.getElementById('nuAddButton');
	const printButton = document.getElementById('nuPrintButton');

	if (!addButton || !printButton) return;

	const tolerance = 5;
	const printButtonAligned = Math.abs(addButton.offsetTop - nuSearchField.offsetTop) <= tolerance;
	const addButtonAligned = Math.abs(addButton.offsetTop - nuSearchField.offsetTop) <= tolerance;

	printButton.style.display = (nuUXOptions.nuPrintButton !== false && printButtonAligned) ? '' : 'none';
	addButton.style.display = addButtonAligned ? '' : 'none';

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
				'chart': nuHTML,
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
	/*
	if (nuObjectType == 'textarea' || nuObjectType == 'input') {
		tagType = nuObjectType;
	}
	*/

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
	let luStyle = "padding: 4px 4px 4px 1px";
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
		$id.html(`<span class="nuButtonLabel">${nuTranslate(thisObj.value)}</span>`)
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
	const inputType = obj.input ?? 'text';

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

	const $id = $('#' + id);
	let el = document.getElementById(id);
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
			case 'nu-help-icon-text':
			case 'nu-help-icon-position':
				if ($id.hasClass('nuHiddenLookup')) {
					const descWidth = $('#' + id + 'description').width();
					if (descWidth === 0) {
						el = document.getElementById(id + 'code');
					} else {
						el = document.getElementById(id + 'description');
					}
					el.setAttribute(key, value);
				}
				/*

				 else if (value === 'left-aligned') {
									//	$('#' + id).nuLabelLeftAligned();
								}

				*/
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
			nuAttachFontAwesome(id, string, 'medium', after);
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

function nuAddDblClickOpenObjectProperties(obj, objId) {
	if (nuGlobalAccess()) {
		obj.on('dblclick', function (e) {
			nuDestroyWindowProperty('nudatepickers');
			nuOptionsListAction("nuobject", objId, '', e);
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
			.html(`<span class="nuButtonLabel">${nuTranslate(obj.label)}</span>`)
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

function nuSUBFORMnuTabHolderAddCSS(tabId, sfType, rowTop, rowWidth) {

	const objBounds = nuSetObjectBounds($('#' + tabId), 0, 0, rowWidth, rowTop);

	objBounds
		.css({
			'overflow-x': 'hidden',
			'overflow-y': 'hidden',
			'position': 'absolute',
			...(sfType === 'g' && { padding: '12px 0 0 0' })
		})
		.addClass('nuSubformTitleHolder')
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
	rowTop = sfTypeGrid ? 52 : 21;

	return { rowHeight, rowWidth, rowTop };
}

function nuSUBFORM(w, i, l, p, prop) {

	var SF = prop.objects[i];								//-- First row
	var subformRows = w.objects[i];							//-- All rows

	let id = p + SF.id;
	nuCreateElementWithId('div', id, p + 'nuRECORD');		//-- Edit Form Id
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

	nuSUBFORMnuTabHolderAddCSS(tabId, SF.subform_type, rowTop, rowWidth);

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

	nuSUBFORMScrollDivAddCSS(id, SF, scrId, rowTop + 12, rowWidth);

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
	// form.method = formMethod;

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

function nuSubformGetObjectId(sfId, fieldName, rowIndex) {

	const subform = nuSubformObject(sfId);
	if (!subform?.rows?.length) return null;

	if (rowIndex === undefined) {
		rowIndex = nuCurrentRow();
	}

	const targetIndex = rowIndex === -1
		? subform.rows.length - 1
		: rowIndex;

	const objId = `${sfId}${nuPad3(targetIndex)}${fieldName}`;
	return objId;

}

function nuSubformSetValue(sfId, fieldName, value, options = {}) {

	const {
		rowIndex,
		method = "value",
		change = true,
		onlyIfBlank = false
	} = options;

	const objId = nuSubformGetObjectId(sfId, fieldName, rowIndex);
	if (!objId) return;

	if (onlyIfBlank) {
		const currentValue = nuGetValue(objId, method);
		if (currentValue !== '') {
			return;
		}
	}

	nuSetValue(objId, value, method, change);

}

function nuSubformGetValue(sfId, fieldName, options = {}) {

	const {
		rowIndex,
		method = "value"
	} = options;

	const objId = nuSubformGetObjectId(sfId, fieldName, rowIndex);
	if (!objId) return null;

	return nuGetValue(objId, method);

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

	$('#' + id + nuPad3(r) + c).nuSetFocus();

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
	if (nextRow.length == 1 && !nextRow.prop('disabled')) nextRow.nuSetFocus();

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

			// Extract the actual row number from the record ID
			let recordId = rows[row].obj;
			let actualRowNumber = parseInt(recordId.replace(sfName, '').replace('nuRECORD', ''));

			if (arrFilter !== null) {

				for (let columnId in arrFilter) {

					let data = [];
					// Use the actual row number instead of the visual row index
					data.val = nuSubformFilterCellValue(sfName, columnId, actualRowNumber);
					data.filter = arrFilter[columnId].value;
					data.type = arrFilter[columnId].type;
					data.optionAll = arrFilter[columnId].all;
					data.optionBlank = data.filter == '' && data.type == 'search';
					data.isMatch = (data.type == 'search' && data.val.toLowerCase().includes(data.filter.toLowerCase())) ||
						(data.type == 'select' && (data.val.toLowerCase() == data.filter.toLowerCase() || data.optionAll));

					if (window.nuSubformOnFilterRows) {
						hide = nuSubformOnFilterRows(sfName, data, actualRowNumber, rows.length);
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
	const isFiltered = objSf.data('nu-filtered') === true;

	const records = $("[ID^='" + sfName + "'][ID$='nuRECORD']");
	const newRecord = records.last();
	const newRecordId = newRecord.attr('id');

	records.each(function (index) {

		var id = this.id;

		if (id !== newRecordId) { // exclude new record

			// If filtering is active, only process visible rows
			if (isFiltered && $(this).is(':hidden')) {
				return; // skip hidden rows when filtering is active
			}

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
		top = top + h + 1; // Add 1 for consistent spacing

	}

	// Position the new record at the bottom of visible rows
	if (!isFiltered || newRecord.is(':visible')) {
		newRecord.css('top', top).data('nu-top-position', top);
	}

	// If filtering was active, reapply the filter to ensure proper positioning
	if (isFiltered) {
		// Get the current filter configuration
		const filterSelects = objSf.find('.nuSubformFilter');
		if (filterSelects.length > 0) {
			// Trigger change on the first filter to reapply all filters
			filterSelects.first().trigger("change");
		}
	}

}

function nuRefreshSelectObject(selectId, formId, removeBlank) {

	nuSubformRefreshSelectObject('', selectId, formId, removeBlank);

}

function nuSubformRefreshSelectObject(prefix, selectId, formId, removeBlank) {

	formId = nuDefine(formId);

	const p = 'nu_refresh_select_object';
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

	const p = 'nu_refresh_display_object';
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

			const title = nuBuildSubformTitle(o[i], l, w, id, i);
			title.css('border', 'none');

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
		.addClass('nuSubformTitleHolder nuSubformTitle')
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
		oTitle.on('dblclick', () => {
			nuOptionsListAction("nuobject", o.object_id);
		});
	}

	if (o.valid == 1) { oTitle.addClass('nuBlank'); }
	if (o.valid == 2) { oTitle.addClass('nuDuplicate'); }

	return oTitle;

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
	const h = '<div id="nuarrow' + i + '" class="nuBreadcrumbArrow"><i class="fa fa-caret-right"></i></div>';

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

	const readID = w => { try { return w.nuDocumentID } catch { } };
	const src = (!ignoreOpener && opener) ? opener : parent;
	const id = readID(src);
	return id == null || id === nuDocumentID;

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
	let h = '<div id="nuarrow' + (b - 1) + '" class="nuBreadcrumbArrow"><i class="fa fa-caret-right"></i></div>';

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

	if (p !== '') {
		$('#' + tabId).addClass('nuSubformTab');
	}

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
					.addClass('nuIcon nuOptionsSubform fa-width-auto');

			}

		} else {

			$('#nuBreadcrumbHolder').prepend('<div id="nuHomeGap" class="nuHomeGap"></div>').prepend(img);

			$('#' + id)
				.attr('title', 'Options')
				.attr('onclick', 'nuGetOptionsList("' + formId + '", "' + subformId + '", "' + access + '", "' + t + '")')
				.addClass('nuIcon nuOptions fa-width-auto');

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

	const subformAction = '$("' + getLabelSelector() + '").trigger("dblclick");';
	const ITEMS = {
		Divider: ['', '', '', ''],
		AddObject: ['Add Object', 'nuPopup("nuobject","-1","")', 'fa fa-plus', 'H'],
		ArrangeObjects: ['Arrange Objects', `nuPopup("${formId}", "-2")`, 'fa-solid fa-arrows-alt', 'A'],
		FormProperties: ['Form Properties', `nuOptionsListAction("nuform", "${formId}", "", event)`, 'fa-cog', 'F'],
		SearchableColumns: ['Searchable Columns', 'nuGetSearchList()', 'fa-columns', 'C'],
		SubformObject: [nuTranslate('Subform Object'), subformAction, 'fa-cog', ''],
		FormObjectList: ['Form Object List', `nuOptionsListAction("nuobject", "", "${formId}", event)`, 'fa-th-list', 'O'],
		Search: ['Search', 'nuSearchAction()', 'fa-solid fa-search', 'S'],
		Add: ['Add', 'nuAddAction()', 'fa-solid fa-plus', 'A'],
		Print: ['Print', 'nuPrintAction()', 'fa fa-list-ul', 'P'],
		Save: ['Save', 'nuSaveAction()', 'far fa-save', 'S'],
		Delete: ['Delete', 'nuDeleteAction()', 'far fa-trash-alt', 'Y'],
		Clone: ['Clone', 'nuCloneAction()', 'far fa-clone', 'C'],
		Refresh: ['Refresh', 'if (nuGlobalAccess()) { nuRunPHPHidden("nu_set_refresh_cache"); } else { nuGetBreadcrumb(); }', 'fa-solid fa-sync-alt', 'R'],
		Help: ['Help', nuFORMHELP[subformId], 'fa-question-circle', '?'],
		ChangePassword: ['Change Password', 'nuPopup("nupassword","","")', 'fa-password', 'Q'],
		DebugResults: ['nuDebug Results', 'nuOptionsListAction("nudebug","","", event)', 'fa-bug', 'D'],
		Database: ['Database', 'nuVendorLogin("PMA")', 'fa-database', 'E'],
		Sessions: ['Sessions', 'nuForm("nusession","","", "", 2)', 'fa-solid fa-key', 'J'],
		Cloner: ['Cloner', 'nuPopup("nucloner","-1")', 'far fa-clone', 'Z'],
		FileManager: ['File Manager', 'nuVendorLogin("TFM")', 'far fa-file-code', 'Q'],
		Backup: ['Backup', 'nuRunBackup()', 'far fa-hdd', 'B'],
		Setup: ['Setup', 'nuForm("nusetup","1","", "", 2)', 'fa-cogs', 'U'],
		FormInfo: ['Form Info', 'nuShowFormInfo()', 'fa-info', 'M'],
		VersionInfo: ['Version Info', 'nuShowVersionInfo()', 'fa-info', 'V'],
		Logout: ['Log out', 'nuAskLogout()', 'fa-solid fa-sign-out-alt', 'L']
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
			ITEMS.Cloner, ITEMS.FileManager, ITEMS.Backup,
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
		iconCls += ' fa-width-auto';
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
				width: maxWidth - (contextType === 'subform' ? 55 : 0) + 10,
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

		$entry.on('click', function (e) {
			if (typeof action === 'function') {
				action(e);
			} else {
				new Function('event', action).call(this, e);
			}
		}).appendTo(BOX_SEL);

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

	nuSetHideTabIfOnlyOne();

}

function nuShowTabByTitle(title, visible) {

	const index = nuGetTabIndexByTitle(title);
	if (index > -1) {
		nuShow('nuTab' + index, visible);
	}
	nuSetHideTabIfOnlyOne();

}

function nuRemoveTabs(t) {

	for (let i = 0; i < arguments.length; i++) {
		$('#nuTab' + arguments[i]).remove();
	}

	nuSetHideTabIfOnlyOne();

}

function nuRemoveTabById(id) {

	let obj = $('div#' + id);
	if (obj.length == 1) {
		obj.remove();
	} else {
		$('div[data-nu-tab-id=' + id + ']').filter('.nuTab').remove();
	}

	nuSetHideTabIfOnlyOne();

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

	nuSetHideTabIfOnlyOne();

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
		.attr('data-nu-title-id', columns[index].id)
		.attr('data-nu-org-title', columns[index].title)

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
			totalWidth = totalWidth + columnWidths[i] + padding;
		}

		for (let i = 0; i < columnWidths.length; i++) {
			columnWidths[i] = parseInt((window.innerWidth - 20) * columnWidths[i] / totalWidth);
		}

		nuSetBrowseColumns(columnWidths);

	} else {

		const browseFooterWidth = nuTotalWidth('nuBrowseFooter') + 22;

		$('#nuDragDialog', window.parent.document).css('width', browseFooterWidth + 14);
		$('#nuWindow', window.parent.document).css('width', browseFooterWidth);

		// const bodyWidth = `${browseFooterWidth}px`;
		// document.body.style.width = bodyWidth;

	}

	nuTogglePaginationInfo();

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

	let target = e.target;
	if (!target || !target.id) {
		return;
	}

	const classList = target.classList;
	if (classList.contains('nuBrowserFilterSelectedTextContent') || classList.contains('nuBrowseFilterIcon')) {
		return;
	}

	if (target.tagName.toLowerCase() === 'i') {
		return;
	}
	const id = target.id.replace('nusort_', 'nuBrowseTitle');

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

	if (targetId === '' || targetId === 'nuSearchField') { 	//	ctxmenu or Search field
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

		nuTogglePaginationInfo();

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
	const rowHeight = currentForm.row_height + 5;

	let incrementalWidth = 0;
	let topOffset = nuBrowseCalculateInitialTopOffset(rowHeight);
	let leftOffset = 7;

	for (let rowIndex = 0; rowIndex < currentForm.rows; rowIndex++) {
		leftOffset = 7;
		topOffset += rowHeight + 1;

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

}

function nuSetBrowseHeight() {

	if (nuFormType() !== 'browse') return;
	const cellsHeight = nuTotalHeight('nucell_0_0') * nuCurrentProperties().rows;
	const footerHeight = nuTotalHeight('nuBrowseFooter');
	const dialogTitleHeight = nuSelectInParentDocument('#dialogTitle').nuCSSNumber('height');
	const actionHolderHeight = nuTotalHeight('nuActionHolder');
	const BreadcrumbOlderHeight = nuTotalHeight('nuBreadcrumbHolder');
	const totalHeight = cellsHeight + footerHeight + dialogTitleHeight + actionHolderHeight + BreadcrumbOlderHeight + 10;
	nuBrowseUpdateParentDocumentStyles(totalHeight);

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
	div.setAttribute('data-nu-column-id', column.id);
	div.style.textAlign = nuAlign(column.align);
	div.style.overflow = 'hidden';
	div.style.padding = (column.width < 0 ? 0 : undefined) + 'px';
	div.style.borderWidth = (column.width < 0 ? 0 : undefined) + 'px';
	div.classList.add(`nuCell${(rowIndex / 2 === parseInt(rowIndex / 2, 10)) ? 'Even' : 'Odd'}`);

	if (colIndex === 0) {
		div.classList.add('nuBrowseBorderLeft');
	}

	if (rowIndex === 0) {
		div.classList.add('nuBrowseBorderTop');
	}

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

	const footerTopOffset = topOffset + rowHeight + 20;
	const divFooter = nuCreateElementWithId('div', 'nuBrowseFooter', 'nuRECORD');
	const footerHtml = nuBrowseCreateFooterHtml(currentForm);

	$(divFooter)
		.addClass('nuBrowseFooter')
		.html(footerHtml)
		.css({
			width: 400,
			top: footerTopOffset
		});

	nuBrowseAdditionalNavButtons();

	return nuTotalHeight('nuBrowseFooter');

}

function nuBrowseCreateFooterHtml(currentForm) {

	const isFirstPage = currentForm.page_number === 0;
	const isLastPage = currentForm.page_number + 1 >= currentForm.pages;
	const totalPages = currentForm.pages === 0 ? 1 : currentForm.pages;
	const disabledStyle = ' style="opacity: 0.3; pointer-events: none;"';

	const nuFirst = `<span id="nuFirst" class="nuBrowsePage"${isFirstPage ? disabledStyle : ''}><i class="fa fa-step-backward" style="font-size: 16px" onclick="nuGetPage()"></i></span>`;
	const nuLast = `<span id="nuLast" onclick="nuGetPage(${currentForm.page_number})" class="nuBrowsePage"${isFirstPage ? disabledStyle : ''}">&#9668;</span>`;
	const currentPageInput = `<input id="browsePage" onchange="nuGetPage(this.value)" value="${currentForm.page_number + 1}" class="browsePage"/>`;
	const nuNext = `<span id="nuNext" onclick="nuGetPage(${currentForm.page_number + 2})" class="nuBrowsePage"${isLastPage ? disabledStyle : ''}">&#x25BA;</span>`;
	const nuEnd = `<span id="nuEnd" class="nuBrowsePage"${isLastPage ? disabledStyle : ''}><i class="fa fa-step-forward" style="font-size: 16px" onclick="nuGetPage(${totalPages})"></i></span>`;

	return nuFirst + nuLast + '&nbsp;Page&nbsp;' + currentPageInput + ` / ${totalPages} ` + nuNext + nuEnd;

}

function nuBrowseAdditionalNavButtons() {

	if ($('#nuFirst').length > 0) return;

	const currentPage = Number($('#browsePage').val());
	const lastPage = nuCurrentProperties().pages;

	const disabledStyle = {
		opacity: '0.3',
		'pointer-events': 'none'
	};

	const firstBtn = '<span id="nuFirst" class="nuBrowsePage"><i class="fa fa-step-backward" style="font-size: 16px" onclick="nuGetPage()">&nbsp;&nbsp;&nbsp;&nbsp;</i></span>';
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

	nuSelectInParentDocument('#nuDragDialog').css({
		height: totalHeight + 30,
		visibility: 'visible',
		overflow: 'hidden'
	});

	nuSelectInParentDocument('#nuWindow').css({
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

function nuBrowseRow(elOrEvent, columnNumberOrId) {

	// Normalise to a jQuery-wrapped element
	const $invoked = (elOrEvent && elOrEvent.target)
		? $(elOrEvent.currentTarget || elOrEvent.target)
		: $(elOrEvent);

	// Read the row index from the invoking element
	const rowAttr = $invoked.attr('data-nu-row');
	const row = rowAttr != null ? parseInt(rowAttr, 10) : null;

	// If a columnNumberOrId was provided, select that cell in the same row,
	// otherwise stick with the invoking element itself
	let $cell = $invoked;

	if (columnNumberOrId != null && row != null) {
		// 1) try to find a cell in this row by data-nu-column-id override
		const $byPk = $(`.nuCell[data-nu-row="${row}"][data-nu-column-id="${columnNumberOrId}"]`);
		if ($byPk.length) {
			$cell = $byPk;
		}
		// 2) otherwise fall back to the row/column-id lookup
		else {
			$cell = $(`#nucell_${row}_${columnNumberOrId}`);
		}
	}

	const pk = $cell.attr('data-nu-primary-key');
	const colAttr = $cell.attr('data-nu-column');
	const column = parseInt(colAttr, 10);
	const colId = $cell.attr('data-nu-column-id');
	const html = $cell.html();
	const value = $cell.text();

	return {
		pk,
		row,
		column,
		colId,
		html,
		value,
		$cell
	};

}

function nuBrowseCells(row) {
	return $(`div.nuBrowseTable[id^='nucell_${row}_']`);
}

function nuBrowseLoop(columns, callback) {

	const props = nuCurrentProperties();
	if (!Array.isArray(columns) || columns.length === 0) {
		const colCount = props.column_widths.length;
		columns = Array.from({ length: colCount }, (_, i) => i);
	}

	const cells = document.querySelectorAll('#nuRECORD .nuCell');
	const results = [];

	cells.forEach(cell => {

		const row = parseInt(cell.getAttribute('data-nu-row'), 10);
		const column = +cell.getAttribute('data-nu-column');
		const columnId = cell.getAttribute('data-nu-column-id');

		const isMatch = columns.some(colSpec =>
			(typeof colSpec === 'number' && column === colSpec) ||
			(typeof colSpec === 'string' && colSpec === columnId)
		);

		if (!isMatch) return;

		cell.row = row;
		cell.column = column;
		cell.columnId = columnId;
		cell.text = cell.textContent;
		cell.html = cell.innerHTML;

		const ret = callback(cell);

		if (ret !== undefined) {
			results.push(ret);
		}

	});

	return results;

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
		nuSearchAction();
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

	nuDisableSearchField();
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

function nuGetPage(pageNumber = 1) {

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
	window.nuLastFocus = $('#' + target + 'code');

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
			$element.nuSetFocus();
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

	$('.nuSaveButton').addClass('nuSaveButtonEdited')
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

function nuBackAction() {

	if (!nuFORM.edited) {
		nuDisable(this.id)
	};

	nuOpenPreviousBreadcrumb();

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
	} else if (actionMessage === 'refresh_required') {
		msg = 'Refresh Required';
		msgClass = 'nuUpdateMessageRefreshRequired';
	}

	$("#nuProgressUpdate").hide();

	let div = nuCreateElementWithId('div', 'nuNowUpdated', 'nuActionHolder');
	$div = $(div);
	$div.html(nuTranslate(msg));
	$div.addClass('nuUpdateMessage').addClass(msgClass);

	const left = ($('#nuActionHolder').width() / 2) - ($div.width() / 2);
	const top = ($('#nuBreadcrumbHolder').outerHeight() - $div.outerHeight()) / 2;

	nuSetObjectBounds(div, top, left, null, null, true);

	if (actionMessage !== 'refresh_required') {
		$("#nuNowUpdated").fadeToggle(3000);
	}

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

function nuAddObjectFunctions() {

	nuAttachHelpIconsToObjects({
		gapRight: 8,
		iconSize: 16,
		onClick: (element, helpText) => {
			if (window.nuOnHelpIconClick) {
				nuOnHelpIconClick(element, helpText);
			}
		}
	});

	if (typeof nuLabelCustomPosition === "function") {

		if (typeof window.nuOnLabelCustomPosition === 'function') {
			window.nuOnLabelCustomPosition();
		}
	}

}

function nuAttachHelpIconsToObjects({
	selector = '[nu-help-icon-text]',
	gapRight = 8,
	iconSize = 16,
	zIndex = 50,
	iconClasses = 'fa-solid fa-circle-question',
	onClick = null,
	tooltipPosition = 'top',
	arrowSize = 'default', // 'small', 'default', 'large'
	theme = 'light', // 'dark', 'light', 'blue', 'green', 'purple'
	animationDuration = 200, // fade animation timing
	accessibility = true, // accessibility features
} = {}) {

	let tooltip = document.getElementById('nu-help-tooltip');
	if (!tooltip) {
		tooltip = document.createElement('div');
		tooltip.id = 'nu-help-tooltip';
		tooltip.className = 'nuHelpToolTip';
		tooltip.style.zIndex = String(zIndex + 1);
		tooltip.setAttribute('role', 'tooltip');
		tooltip.setAttribute('aria-hidden', 'true');
		document.body.appendChild(tooltip);
	}

	let overlay = document.getElementById('nu-help-overlay');
	if (!overlay) {
		overlay = document.createElement('div');
		overlay.id = 'nu-help-overlay';
		overlay.className = 'nuHelpOverlay';
		overlay.style.zIndex = String(zIndex);
		overlay.setAttribute('aria-hidden', 'true');
		document.body.appendChild(overlay);
	}

	const ICONS = nuAttachHelpIconsToObjects._icons || new Map();
	nuAttachHelpIconsToObjects._icons = ICONS;

	const fields = Array.from(document.querySelectorAll(selector))
		.filter(el => {
			const helpText = el.getAttribute('nu-help-icon-text');
			return helpText && helpText.trim();
		});

	const current = new Set(fields);

	fields.forEach((el) => {
		let rec = ICONS.get(el);
		if (!rec) {
			const elementSettings = {
				selector,
				gapRight,
				iconSize,
				zIndex,
				iconClasses,
				onClick,
				tooltipPosition,
				arrowSize,
				theme,
				animationDuration,
				accessibility
			};

			if (typeof window.nuOnAddHelpIcon === 'function') {
				try {
					window.nuOnAddHelpIcon(el, elementSettings);
				} catch (error) {
					console.warn('Error in nuOnAddHelpIcon callback:', error);
				}
			}

			const icon = document.createElement('i');
			icon.className = elementSettings.iconClasses;
			icon.id = el.id + '_helpicon';

			Object.assign(icon.style, {
				position: 'absolute',
				fontSize: elementSettings.iconSize + 'px',
				lineHeight: '1',
				pointerEvents: 'auto',
				opacity: '0.95',
				cursor: elementSettings.onClick ? 'pointer' : 'help',
				color: 'var(--help-icon-color, #53a1c4)',
				transition: `opacity ${elementSettings.animationDuration}ms ease`,
				zIndex: String(elementSettings.zIndex)
			});

			if (elementSettings.accessibility) {
				const helpText = el.getAttribute('nu-help-icon-text') || '';
				icon.setAttribute('aria-label', 'Help: ' + helpText);
				icon.setAttribute('tabindex', '0');
				icon.setAttribute('role', 'button');

				icon.addEventListener('keydown', (e) => {
					if (e.key === 'Enter' || e.key === ' ') {
						e.preventDefault();
						const helpText = el.getAttribute('nu-help-icon-text') || '';
						if (elementSettings.onClick) {


							elementSettings.onClick(el, helpText);
						}

						if (typeof window.nuOnHelpIconClick === 'function') {
							window.nuOnHelpIconClick(el, helpText);
						}
						if (!elementSettings.onClick) {
							showTooltip(icon, el, helpText, elementSettings);
						}
					}
					if (e.key === 'Escape') {
						hideTooltip();
					}
				});
			}

			let hoverTimeout;
			icon.addEventListener('mouseenter', () => {
				clearTimeout(hoverTimeout);
				const helpText = el.getAttribute('nu-help-icon-text') || '';
				if (helpText.trim()) {
					showTooltip(icon, el, helpText, elementSettings);
				}
			});

			icon.addEventListener('mouseleave', () => {
				hoverTimeout = setTimeout(hideTooltip, 100);
			});


			icon.addEventListener('click', (e) => {
				e.preventDefault();
				e.stopPropagation();
				hideTooltip();
				const helpText = el.getAttribute('nu-help-icon-text') || '';
				if (typeof elementSettings.onClick === 'function') {
					elementSettings.onClick(el, helpText);
				}


				if (typeof window.nuOnHelpIconClick === 'function') {
					window.nuOnHelpIconClick(el, helpText);
				}
			});

			overlay.appendChild(icon);

			const ro = new ResizeObserver((entries) => {
				try {
					positionIcon(el, icon);
				} catch (error) {
					console.warn('Error positioning help icon:', error);
				}
			});
			ro.observe(el);

			const mo = new MutationObserver((mutations) => {
				mutations.forEach(mutation => {
					if (mutation.type === 'attributes') {
						if (mutation.attributeName === 'nu-help-icon-text') {
							const newText = el.getAttribute('nu-help-icon-text');
							if (accessibility && newText) {
								icon.setAttribute('aria-label', 'Help: ' + newText);
							}
						}
					}
				});
			});
			mo.observe(el, {
				attributes: true,
				attributeFilter: ['nu-help-icon-text', 'nu-help-icon-position', 'nu-help-icon-arrow-size', 'nu-help-icon-theme']
			});

			rec = { icon, ro, mo, element: el, settings: elementSettings };
			ICONS.set(el, rec);
		}

		positionIcon(el, rec.icon, rec.settings);
	});

	ICONS.forEach((rec, el) => {
		if (!current.has(el) || !document.body.contains(el)) {
			try {
				rec.ro?.disconnect();
			} catch (error) {
				console.warn('Error disconnecting ResizeObserver:', error);
			}
			try {
				rec.mo?.disconnect();
			} catch (error) {
				console.warn('Error disconnecting MutationObserver:', error);
			}
			if (rec.icon?.parentNode === overlay) {
				try {
					overlay.removeChild(rec.icon);
				} catch (error) {
					console.warn('Error removing icon:', error);
				}
			}
			ICONS.delete(el);
		}
	});

	if (!nuAttachHelpIconsToObjects._bound) {
		const refreshAll = debounce(() => {
			ICONS.forEach((rec, el) => {
				try {
					positionIcon(el, rec.icon, rec.settings);
				} catch (error) {
					console.warn('Error refreshing icon position:', error);
				}
			});
		}, 16);

		window.addEventListener('scroll', refreshAll, { passive: true });
		window.addEventListener('resize', refreshAll, { passive: true });

		document.addEventListener('click', (e) => {
			if (!e.target.closest('.nuHelpToolTip') && !e.target.closest('[class*="fa-circle-question"]')) {
				hideTooltip();
			}
		});

		nuAttachHelpIconsToObjects._bound = true;
	}

	nuAttachHelpIconsToObjects.refresh = () => {
		ICONS.forEach((rec, el) => positionIcon(el, rec.icon, rec.settings));
	};

	nuAttachHelpIconsToObjects.destroy = () => {
		ICONS.forEach((rec) => {
			try { rec.ro?.disconnect(); } catch { }
			try { rec.mo?.disconnect(); } catch { }
			rec.icon?.remove();
		});
		ICONS.clear();
		tooltip?.remove();
		overlay?.remove();
		nuAttachHelpIconsToObjects._bound = false;
	};

	function debounce(func, wait) {
		let timeout;
		return function executedFunction(...args) {
			const later = () => {
				clearTimeout(timeout);
				func(...args);
			};
			clearTimeout(timeout);
			timeout = setTimeout(later, wait);
		};
	}

	function showTooltip(icon, el, helpText, settings = {}) {
		tooltip.innerHTML = sanitizeHTML(helpText);
		const elementPosition = el.getAttribute('nu-help-icon-position') || settings.tooltipPosition || tooltipPosition;
		const elementArrowSize = el.getAttribute('nu-help-icon-arrow-size') || settings.arrowSize || arrowSize;
		const elementTheme = el.getAttribute('nu-help-icon-theme') || settings.theme || theme;
		const arrowClass = getArrowClass(elementPosition);
		const arrowSizeClass = elementArrowSize !== 'default' ? `arrow-${elementArrowSize}` : '';
		const themeClass = elementTheme !== 'dark' ? `theme-${elementTheme}` : '';

		tooltip.className = `nuHelpToolTip ${arrowClass} ${arrowSizeClass} ${themeClass}`.trim();
		tooltip.style.display = 'block';
		tooltip.setAttribute('aria-hidden', 'false');

		const currentAnimationDuration = settings.animationDuration || animationDuration;
		requestAnimationFrame(() => {
			positionTooltip(icon, tooltip, elementPosition);
			tooltip.style.opacity = '1';
			tooltip.style.transition = `opacity ${currentAnimationDuration}ms ease`;
		});
	}

	function hideTooltip() {
		tooltip.style.opacity = '0';
		tooltip.setAttribute('aria-hidden', 'true');
		setTimeout(() => {
			tooltip.style.display = 'none';
		}, animationDuration);
	}

	function sanitizeHTML(html) {

		const allowedTags = ['br', 'strong', 'b', 'em', 'i', 'u', 'small', 'code', 'span'];
		const allowedAttributes = ['class', 'style'];

		const temp = document.createElement('div');
		temp.innerHTML = html;

		function cleanElement(element) {
			const children = Array.from(element.childNodes);

			children.forEach(child => {
				if (child.nodeType === Node.TEXT_NODE) {
					return;
				}

				if (child.nodeType === Node.ELEMENT_NODE) {
					const tagName = child.tagName.toLowerCase();

					if (allowedTags.includes(tagName)) {

						const attributes = Array.from(child.attributes);
						attributes.forEach(attr => {
							if (!allowedAttributes.includes(attr.name.toLowerCase())) {
								child.removeAttribute(attr.name);
							}
						});
						cleanElement(child);
					} else {
						const textNode = document.createTextNode(child.textContent);
						child.parentNode.replaceChild(textNode, child);
					}
				} else {
					child.parentNode.removeChild(child);
				}
			});
		}

		cleanElement(temp);
		return temp.innerHTML;
	}

	function positionIcon(el, icon, settings = {}) {
		try {
			const r = el.getBoundingClientRect();
			const pageX = window.pageXOffset;
			const pageY = window.pageYOffset;

			const currentGapRight = settings.gapRight || gapRight;
			const currentIconSize = settings.iconSize || iconSize;

			const iconLeft = r.right + currentGapRight + pageX;
			const iconTop = r.top + pageY + Math.round(r.height / 2) - Math.round(currentIconSize / 2);

			icon.style.left = Math.max(0, iconLeft) + 'px';
			icon.style.top = Math.max(0, iconTop) + 'px';
		} catch (error) {
			console.warn('Error positioning icon:', error);
		}
	}

	function getArrowClass(position) {
		const arrowMap = {
			'top': 'arrow-bottom',
			'bottom': 'arrow-top',
			'left': 'arrow-right',
			'right': 'arrow-left'
		};
		return arrowMap[position] || 'arrow-top';
	}

	function positionTooltip(icon, tooltip, position) {
		const iconRect = icon.getBoundingClientRect();
		const pageX = window.pageXOffset;
		const pageY = window.pageYOffset;
		const gap = 8;

		const iconCenterX = iconRect.left + iconRect.width / 2;
		const iconCenterY = iconRect.top + iconRect.height / 2;

		let tooltipLeft, tooltipTop, arrowPosition;
		const positions = {
			top: () => {
				tooltipLeft = iconCenterX + pageX - tooltip.offsetWidth / 2;
				tooltipTop = iconRect.top + pageY - tooltip.offsetHeight - gap;
				arrowPosition = tooltip.offsetWidth / 2;
				tooltip.style.setProperty('--arrow-left', arrowPosition + 'px');
			},
			bottom: () => {
				tooltipLeft = iconCenterX + pageX - tooltip.offsetWidth / 2;
				tooltipTop = iconRect.bottom + pageY + gap;
				arrowPosition = tooltip.offsetWidth / 2;
				tooltip.style.setProperty('--arrow-left', arrowPosition + 'px');
			},
			left: () => {
				tooltipLeft = iconRect.left + pageX - tooltip.offsetWidth - gap;
				tooltipTop = iconCenterY + pageY - tooltip.offsetHeight / 2;
				arrowPosition = tooltip.offsetHeight / 2;
				tooltip.style.setProperty('--arrow-top', arrowPosition + 'px');
			},
			right: () => {
				tooltipLeft = iconRect.right + pageX + gap;
				tooltipTop = iconCenterY + pageY - tooltip.offsetHeight / 2;
				arrowPosition = tooltip.offsetHeight / 2;
				tooltip.style.setProperty('--arrow-top', arrowPosition + 'px');
			}
		};

		(positions[position] || positions.bottom)();

		const viewport = {
			width: window.innerWidth,
			height: window.innerHeight,
			scrollX: window.pageXOffset,
			scrollY: window.pageYOffset
		};

		if (position === 'top' || position === 'bottom') {
			const minLeft = viewport.scrollX + 10;
			const maxLeft = viewport.scrollX + viewport.width - tooltip.offsetWidth - 10;

			if (tooltipLeft < minLeft) {
				const adjustment = minLeft - tooltipLeft;
				tooltipLeft = minLeft;
				arrowPosition = Math.max(10, arrowPosition - adjustment);
				tooltip.style.setProperty('--arrow-left', arrowPosition + 'px');
			} else if (tooltipLeft > maxLeft) {
				const adjustment = tooltipLeft - maxLeft;
				tooltipLeft = maxLeft;
				arrowPosition = Math.min(tooltip.offsetWidth - 10, arrowPosition + adjustment);
				tooltip.style.setProperty('--arrow-left', arrowPosition + 'px');
			}
		}

		if (position === 'left' || position === 'right') {
			const minTop = viewport.scrollY + 10;
			const maxTop = viewport.scrollY + viewport.height - tooltip.offsetHeight - 10;

			if (tooltipTop < minTop) {
				const adjustment = minTop - tooltipTop;
				tooltipTop = minTop;
				arrowPosition = Math.max(10, arrowPosition - adjustment);
				tooltip.style.setProperty('--arrow-top', arrowPosition + 'px');
			} else if (tooltipTop > maxTop) {
				const adjustment = tooltipTop - maxTop;
				tooltipTop = maxTop;
				arrowPosition = Math.min(tooltip.offsetHeight - 10, arrowPosition + adjustment);
				tooltip.style.setProperty('--arrow-top', arrowPosition + 'px');
			}
		}

		tooltip.style.left = tooltipLeft + 'px';
		tooltip.style.top = tooltipTop + 'px';
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

	const c = nuFORM.getProperty('browse_columns');
	const d = document.createElement('div');
	const widest = nuWidestTitle(c) + 20;

	$('#nuOptionsListBox').remove();
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
		.html('<input type="checkbox" id="nuMasterSearchCheckbox" checked style="width: 20px; height: 25px; margin-left: 9px; margin-right: 8px;"><span style="font-weight:bold; vertical-align: top; line-height: 25px;">' + nuTranslate('Include When Searching') + '</span>')
		.addClass('nuOptionsList');

	$('#nuMasterSearchCheckbox').click(function () {
		const isChecked = $(this).prop('checked');
		for (let j = 0; j < c.length; j++) {
			$('#nuSearchList' + j).prop('checked', isChecked);
		}
		nuSetSearchColumn();
	});

	for (var i = 0; i < c.length; i++) {
		let isChecked = true;
		if ($.inArray(i, nuFORM.getCurrent().nosearch_columns) != '-1') {
			isChecked = false;
		}

		const p = document.createElement('input');
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

		const t = document.createElement('div');
		const nobr = String(c[i].title).nuReplaceAll('<br>', ' ').nuReplaceAll('<p>', ' ');

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
				const cb = $('#nuSearchList' + i).attr('checked');
				$('#' + 'nuSearchList' + i).attr('checked', !cb);
				nuSetSearchColumn();
			});

		if (i < 9) {
			const shortcut_key = document.createElement('div');
			const shortcut_key_id = 'nuSearchTextShortcutKey' + i.toString();
			shortcut_key.setAttribute('id', shortcut_key_id);
			$('#nuSearchList').append(shortcut_key);
			const prop = { 'position': 'absolute', 'text-align': 'left', 'height': 15, 'width': 50 };
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

	let closeButtonClass = 'fa-solid fa-times nuMessageClose';
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

	let dialog = nuSelectInParentDocument('#nuDragDialog');
	if (dialog.length !== 0) {
		let { l, t, w, h } = nuObjectPosition(dialog);
		window.nuDialogSize = { left: l, top: t, width: w, height: h };
	}

	win = nuSelectInParentDocument('#nuWindow');
	if (win.length !== 0) {
		w = parseInt(win.css('width'), 10);
		h = parseInt(win.css('height'), 10);
		window.nuWindowSize = { width: w, height: h };
	}

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

		const browseFunction = window.nuBrowseFunction;					//-- browse, lookup or custom function name
		const pk = $('#' + t.id).attr('data-nu-primary-key');
		const formId = window.nuFORM.getProperty('form_id');
		const formIdRedirect = window.nuFORM.getProperty('redirect_form_id');
		let browseTarget = window.nuFORM.getProperty('browse_target');
		const formType = window.nuFORM.getProperty('form_type');
		const ro = window.nuFORM.getProperty('redirect_other_form_id');

		if (formType == 'browse' && ro == '' && parent.$('#nuDragDialog').length == 0) {
			nuSelectBrowse = function (e, t) { }
			return;
		}

		nuCursor('progress');

		if (browseFunction == 'browse') {
			const browseFormId = formIdRedirect == '' ? formId : formIdRedirect;
			if (browseTarget === '') browseTarget = '0'; 				// default: new breadcrumb
			if (browseTarget != 3) {
				nuForm(browseFormId, pk, '', '', browseTarget);
			} else {
				nuPopup(browseFormId, pk, '');
			}
		} else if (browseFunction == 'lookup') {
			window.parent.nuGetLookupId(pk, window.nuTARGET);			//-- called from parent window
		} else {
			window[browseFunction](e);
		}

		const isCtrlOrCmdPressed = nuIsCtrlOrCmdPressed(e);
		if (!isCtrlOrCmdPressed) {
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

		$('#nuBrowseFooter').append('<span class="nuPaginationInfo" id="nuPaginationInfo">' + p + '</span>');

		nuTogglePaginationInfo();
	}

}

function nuTogglePaginationInfo() {
	nuShow('nuPaginationInfo', $('#nuBrowseFooter').nuCSSNumber('width') > 335);
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

		var html = '<span id="nuFirst" class="nuBrowsePage" style="font-size: 15px;"><i class="fa fa-step-backward ml-5 mr-5" onclick="nuGetPage()">&nbsp;&nbsp;&nbsp;&nbsp;</i></span>';
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

		this.callback = null; // store function reference
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
			`<button class="nuActionButton" onclick="nuPromptWindow.ok()">OK</button> <button class="nuActionButton" onclick="nuPromptWindow.cancel()">Cancel</button>`;

		const inputElement = document.getElementById("prompt_value1");
		inputElement.value = nuDefine(defaultValue, '');
		inputElement.onkeyup = (e) => this.handleKeyup(e);

		// store callback
		this.callback = fctn;

		inputElement.focus();
	}

	handleKeyup(e) {
		if (e.key === "Enter") {
			this.ok();
		} else if (e.key === "Escape") {
			this.cancel();
		}
	}

	cancel() {
		this.invokeCallback(null, false);
		this.displayModal(false);
	}

	ok() {
		const value = document.getElementById('prompt_value1').value;
		this.invokeCallback(value, true);
		this.displayModal(false);
	}

	invokeCallback(value, confirmed) {
		if (typeof this.callback === 'string') {
			if (typeof window[this.callback] === 'function') {
				window[this.callback](value, confirmed);
			} else {
				console.error('Callback function not found:', this.callback);
			}
		} else if (typeof this.callback === 'function') {
			this.callback(value, confirmed);
		} else {
			console.error('Invalid callback type');
		}
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

function nuAddBrowseTitleSelect(column, optionsData, customWidth, style) {

	if (!Array.isArray(optionsData) || optionsData.length === 0) return null;

	let columnId = null;
	const isNum = typeof column === 'number';

	if (!isNum) {
		columnId = column;
		column = nuCurrentProperties().browse_columns.findIndex(
			object => object.id === column
		);
	}

	const { column_widths: columnWidths, browse_columns: browseColumns } = nuCurrentProperties();
	const selectId = `nuBrowseTitle${column}_select`;
	let propertyId = '';

	if (isNum) {
		propertyId = `nuBrowseTitle${column}_select`;
	} else {
		propertyId = `nuBrowseTitle_${columnId}_select`;
	}

	const containerSelector = `#nuBrowseTitle${column}`;

	const computedWidth = typeof customWidth !== 'undefined'
		? customWidth
		: (columnWidths === 0
			? browseColumns[column].width
			: columnWidths[column] - 3
		);

	const cssProps = { width: `${computedWidth}px`, ...(style || {}) };
	const $select = $('<select>', { id: selectId, css: cssProps });

	const isSimpleArray = !Array.isArray(optionsData[0]);
	optionsData.forEach(item => {
		const [value, label] = isSimpleArray ? [item, item] : item;
		$('<option>', { value, text: label }).appendTo($select);
	});

	const $container = $(containerSelector);
	if ($container.length === 0) {
		console.warn(`nuAddBrowseTitleSelect2: no container found for selector "${containerSelector}"`);
		return null;
	}

	$container.append('<br/>', $select);

	$select.on('change', () => {
		nuSetProperty(propertyId, $select.val());
		nuSearchAction();
	});

	$container.on('mousedown', 'select', e => e.stopPropagation());

	$select.val(nuGetProperty(propertyId));
	if (!isNum) {
		$select.attr('data-nu-title-id', columnId)
	}

	return $select;
}

function nuAddBrowseFilter(column) {

	let columnId = null;
	const isNum = typeof column === 'number';

	if (!isNum) {
		columnId = column;
		column = 'nuBrowseTitle' + nuCurrentProperties().browse_columns.findIndex(
			object => object.id === column
		);
	} else {
		column = 'nuBrowseTitle' + column;
	}

	const $parent = $('#' + column);
	const $nusort = $parent.find('.nuSort');
	$parent.find('.nuBrowseFilterIcon, .nuBrowserFilterSelectedText').remove();

	const $newDiv = $('<span>', {
		id: nuID(),
		class: 'nuBrowseFilterIcon',
		css: {
			display: 'inline-block',
			position: 'relative'
		}
	});

	$newDiv.data('column', column);
	$newDiv.data('column_id', columnId);

	const $newIcon = $('<i>', {
		class: 'fa-solid fa-filter'
	});

	$newDiv.append($newIcon);
	const $selectedText = $('<div>', {
		class: 'nuBrowserFilterSelectedText',
		css: {
			display: 'none',
			position: 'absolute',
			top: '25px',
			cursor: 'pointer'
		}
	});

	const $clearIcon = $('<i>', {
		class: 'fa-solid fa-times',
		css: {
			'margin-right': '4px',
			'font-size': '10px'
		}
	});

	const $textSpan = $('<span>', {
		class: 'nuBrowserFilterSelectedTextContent'
	});

	$selectedText.append($clearIcon).append($textSpan);

	$selectedText.insertAfter($nusort);
	$newDiv.insertAfter($selectedText);

	return $newDiv;
}

var nuSearchablePopupUtils = {

	PropertyManager: {
		getFilterKey(column, columnId) {
			return columnId ? `${columnId}_filter` : `${column}_filter`;
		},

		getFilterValue(column, columnId) {
			const key = this.getFilterKey(column, columnId);
			return nuGetProperty(key);
		},

		setFilterValue(column, columnId, value) {
			const key = this.getFilterKey(column, columnId);
			nuSetProperty(key, value);
		},

		clearFilterValue(column, columnId) {
			this.setFilterValue(column, columnId, '');
		}
	},

	ArrayNormalizer: {
		to2DArray(arr) {
			const is1D = Array.isArray(arr) && arr.every(item => !Array.isArray(item));
			return is1D ? arr.map(item => [item, item]) : arr;
		},

		flattenSingles(arr) {
			if (!Array.isArray(arr)) return arr;

			if (arr.length > 1) {
				const restAreArrays = arr.slice(1).every(item => Array.isArray(item) && item.length === 1);
				if (restAreArrays) {
					return arr.slice(1).map(item => item[0]);
				}
			}

			if (arr.every(item => Array.isArray(item) && item.length === 1)) {
				return arr.map(item => item[0]);
			}

			return arr;
		},

		normalize(items) {
			const flattened = this.flattenSingles(items);
			return this.to2DArray(flattened);
		}
	},

	PositionManager: {
		calculatePosition(mouseX, mouseY, popupWidth = 300, popupHeight = 400) {
			const windowWidth = $(window).width();
			const windowHeight = $(window).height();

			let left = mouseX;
			let top = mouseY;

			if (left + popupWidth > windowWidth) {
				left = windowWidth - popupWidth - 10;
			}

			if (top + popupHeight > windowHeight) {
				top = mouseY - popupHeight;
				if (top < 0) {
					top = 10;
				}
			}

			return { left, top };
		},

		applyPosition($popup, position, centered = false) {
			if (centered) {
				$popup.css({
					position: 'fixed',
					left: '50%',
					top: '50%',
					transform: 'translate(-50%, -50%)'
				});
			} else {
				$popup.css({
					position: 'fixed',
					left: position.left + 'px',
					top: position.top + 'px',
					height: '400px',
					transform: 'none',
					'justify-content': 'unset',
					'align-items': 'unset'
				});
			}
		}
	},

	FilterIconManager: {
		getFilterIcon(column) {
			return column ? $('#' + column).find('.nuBrowseFilterIcon') : $();
		},

		setupClearEvent(column, clearFilterFn, onClearCallback) {
			if (!column) return;

			const $clearElement = $('#' + column).find('.nuBrowserFilterSelectedText');
			$clearElement.on('click', (e) => {
				e.stopPropagation();
				clearFilterFn();
				onClearCallback();
			});
		}
	}
};

$.fn.nuSearchableMultiPopup = function (options) {
	const settings = $.extend({
		title: "Select Options",
		items: [],
		searchPlaceholder: "Search...",
		searchText: "Search",
		applyText: "Apply",
		clearText: "Clear All",
		selectText: "Select All",
		checked: [],
		positionAtMouse: true,
		onSelected: function (selectedItems) { },
		onClear: function () { }
	}, options);

	settings.items = nuSearchablePopupUtils.ArrayNormalizer.normalize(settings.items);

	const normalizedItems = settings.items.map(item => ({
		value: item[0],
		label: item[1]
	}));

	const $this = $(this);
	const column = $this.data('column');
	const columnId = $this.data('column_id');

	const nuToggleIcon = (filterActive, selectedCount = 0, tooltipText = '') => {
		const $filterIcon = nuSearchablePopupUtils.FilterIconManager.getFilterIcon(column);
		const $txt = $filterIcon.siblings('.nuBrowserFilterSelectedText');

		if (filterActive && selectedCount > 0) {
			$('#' + $filterIcon.attr('id')).css('color', 'red');
			const displayText = selectedCount === 1 ?
				(tooltipText.split('\n')[0] || '1 item') :
				`${selectedCount} items`;

			$txt.find('.nuBrowserFilterSelectedTextContent').text(displayText);
			const finalTooltip = tooltipText || `${selectedCount} items selected`;

			if (selectedCount > 1) {
				$filterIcon.attr('title', finalTooltip);
				$txt.attr('title', finalTooltip);
			}

			$txt.show();
		} else {
			$('#' + $filterIcon.attr('id')).css('color', '');
			$txt.hide().find('.nuBrowserFilterSelectedTextContent').text('');

			$filterIcon.removeAttr('title');
			$txt.removeAttr('title');
		}
	};

	const $popup = $(`
		<div class="nuSearchableMultiPopup">
			<div class="nuPopupContent">
				<div class="popup-header">
					<button class="close-btn" title="Close">&times;</button>
					<div class="filter-container">
						<input type="text" id="nuPopupSearch" class="nuInputNumber" placeholder="${settings.searchPlaceholder}">
					</div>
				</div>
				<div class="nuOptionsContainer">
					<div class="nuCheckboxOptions"></div>
				</div>
				<div class="nuButtons">
					<button class="nuClear"><i class="fa-solid fa-filter-circle-xmark"></i> ${settings.clearText}</button>
					<button class="nuApply"><i class="fa-solid fa-filter"></i>${settings.applyText}</button>
				</div>
			</div>
		</div>
	`).hide();

	const $search = $popup.find('.filter-container input');
	const $options = $popup.find('.nuCheckboxOptions');
	const $applyButton = $popup.find('.nuApply');
	const $clearButton = $popup.find('.nuClear');
	const $closeBtn = $popup.find('.close-btn');

	const nuGetCheckboxes = () => $options.find('input[type="checkbox"]');

	const nuUpdateClearButton = (updateIcon = true) => {
		const checkedCheckboxes = nuGetCheckboxes().filter(':checked');
		const checkedCount = checkedCheckboxes.length;
		$applyButton.prop('disabled', false);

		if (checkedCount === 0) {
			$clearButton.html(`<i class="fa-regular fa-check-square"></i> ${settings.selectText}`);
			$clearButton.attr('data-action', 'select-all');
		} else {
			$clearButton.html(`<i class="fa-solid fa-filter-circle-xmark"></i> ${settings.clearText}`);
			$clearButton.attr('data-action', 'clear-all');
		}

		if (updateIcon) {
			const selectedLabels = [];
			checkedCheckboxes.each(function () {
				const $checkbox = $(this);
				const label = $checkbox.next('label').text();
				selectedLabels.push(label);
			});

			const tooltipText = selectedLabels.join('\n');
			nuToggleIcon(checkedCount > 0, checkedCount, tooltipText);
		}
	};

	const nuTickCheckboxesWithString = (searchString) => {
		nuGetCheckboxes().each((index, checkbox) => {
			const labelText = $(checkbox).next('label').text().toLowerCase();
			if (labelText.includes(searchString)) {
				$(checkbox).prop('checked', true);
			}
		});
	};

	const nuRenderItems = () => {
		$options.empty();

		$.each(normalizedItems, (index, item) => {
			const checkboxId = `nuCheckbox${index}`;
			const $checkbox = $('<input type="checkbox">')
				.attr('id', checkboxId)
				.attr('value', item.value);

			const $label = $('<label>')
				.attr('for', checkboxId)
				.text(item.label)
				.addClass('nuNoSelect');

			const $div = $('<div>')
				.addClass('nuCheckboxItem')
				.append($checkbox)
				.append($label);

			if (Array.isArray(settings.checked) && settings.checked.includes(item.value)) {
				$checkbox.prop('checked', true);
			}

			$options.append($div);
		});

		nuUpdateClearButton();
	};

	$options.on('change', 'input[type="checkbox"]', () => {
		nuUpdateClearButton(false);
	});

	$options.on('click', '.nuCheckboxItem', function (e) {
		e.preventDefault();
		e.stopPropagation();
		const $checkbox = $(this).find('input[type="checkbox"]');
		const currentState = $checkbox.prop('checked');
		$checkbox.prop('checked', !currentState).trigger('change');
	});

	$search.on('input', () => {
		nuGetCheckboxes().prop('checked', false);
		const searchString = $search.val().trim().toLowerCase();
		nuTickCheckboxesWithString(searchString);
		nuUpdateClearButton(false);
	});

	$closeBtn.on('click', function (e) {
		e.stopPropagation();
		$popup.hide();
	});

	$applyButton.on('click', function () {
		let selectedItems = [];
		let selectedLabels = [];

		nuGetCheckboxes().filter(':checked').each(function (index, checkbox) {
			const $checkbox = $(checkbox);
			selectedItems.push($checkbox.val());
			selectedLabels.push($checkbox.next('label').text());
		});

		nuSearchablePopupUtils.PropertyManager.setFilterValue(column, columnId, selectedItems.join(','));

		const tooltipText = selectedLabels.join('\n');
		nuToggleIcon(selectedItems.length > 0, selectedItems.length, tooltipText);

		$popup.hide();
		settings.onSelected(selectedItems);
		window.nuFORM.getCurrent().page_number = 1;
		nuSearchAction();
	});

	$clearButton.on('click', function () {
		const action = $(this).attr('data-action');
		if (action === 'select-all') {
			nuGetCheckboxes().prop('checked', true);
		} else {
			nuGetCheckboxes().prop('checked', false);
			settings.onClear();
		}
		nuUpdateClearButton(false);
	});

	$popup.on('click', function (e) {
		if (e.target === this) $popup.hide();
	});

	$popup.find('.nuPopupContent').on('click', function (e) {
		e.stopPropagation();
	});

	$this.on('click', (e) => {
		nuRenderItems();
		$popup.appendTo($('#nuhtml'));

		const position = settings.positionAtMouse
			? nuSearchablePopupUtils.PositionManager.calculatePosition(e.pageX, e.pageY)
			: null;

		nuSearchablePopupUtils.PositionManager.applyPosition($popup, position, !settings.positionAtMouse);
		$popup.show();
		$search.val('').focus();
		nuUpdateClearButton();
	});

	nuSearchablePopupUtils.FilterIconManager.setupClearEvent(column, () => {
		this.clearFilter();
	}, settings.onClear);

	if (column) {
		const existingValue = nuSearchablePopupUtils.PropertyManager.getFilterValue(column, columnId);
		if (existingValue) {
			const existingItems = existingValue.split(',').filter(item => item);
			if (existingItems.length > 0) {
				settings.checked = existingItems;

				const existingLabels = [];
				existingItems.forEach(value => {
					const foundItem = normalizedItems.find(item =>
						String(item.value) === String(value) || item.value == value
					);
					if (foundItem) {
						existingLabels.push(foundItem.label);
					}
				});

				const tooltipText = existingLabels.length > 0 ? existingLabels.join('\n') : '';
				nuToggleIcon(true, existingItems.length, tooltipText);
				settings.onSelected(existingItems, null, true);
			}
		}
	}

	this.clearFilter = function () {
		nuSearchablePopupUtils.PropertyManager.clearFilterValue(column, columnId);
		settings.checked = [];
		nuToggleIcon(false);
		window.nuFORM.getCurrent().page_number = 1;
		nuSearchAction();
	};

	return this;
};

$.fn.nuSearchablePopup = function (options) {

	if (options && options.multiSelect === true) {
		const checkboxOptions = $.extend({}, options);
		delete checkboxOptions.multiSelect;
		if (checkboxOptions.searchPlaceholder === undefined) {
			checkboxOptions.searchPlaceholder = "Search...";
		}
		return this.nuSearchableMultiPopup(checkboxOptions);
	}

	const settings = $.extend({
		title: "Select Options",
		items: [],
		searchPlaceholder: "Filter options...",
		positionAtMouse: true,
		onSelected: function (selectedItem) { },
		onClear: function () { }
	}, options);

	settings.items = nuSearchablePopupUtils.ArrayNormalizer.normalize(settings.items);

	const $this = $(this);
	const column = $this.data('column');
	const columnId = $this.data('column_id');

	const toggleIcon = (filterActive, selectedText = '') => {
		const $filterIcon = nuSearchablePopupUtils.FilterIconManager.getFilterIcon(column);
		const $txt = $filterIcon.siblings('.nuBrowserFilterSelectedText');
		if (filterActive) {
			$('#' + $filterIcon.attr('id')).css('color', 'red');
			$txt.find('.nuBrowserFilterSelectedTextContent').text(selectedText);
			$txt.show();
		} else {
			$('#' + $filterIcon.attr('id')).css('color', '');
			$txt.hide().find('.nuBrowserFilterSelectedTextContent').text('');
		}
	};

	const $popup = $(`
		<div class="nuSearchablePopup" style="position: fixed; z-index: 10000; width: 300px; max-width: 300px;">
			<div class="popup-content">
				<div class="popup-header">
					<button class="close-btn" title="Close">&times;</button>
					<div class="filter-container">
						<input id="nuPopupSearch" type="text" class="filter-input" placeholder="${settings.searchPlaceholder}">
					</div>
				</div>
				<div class="options-container">
					<div class="options"></div>
				</div>
			</div>
		</div>
	`).hide();

	const $options = $popup.find('.options');
	const $filterInput = $popup.find('.filter-input');
	const $closeBtn = $popup.find('.close-btn');

	const renderItems = (filterText = '') => {
		$options.empty();

		const filteredItems = settings.items.filter(item =>
			item[1].toLowerCase().includes(filterText.toLowerCase())
		);

		if (filteredItems.length === 0) {
			$options.append($('<div>').addClass('no-results').text('No results found'));
		} else {
			$.each(filteredItems, (index, item) => {
				const $item = $('<div>')
					.addClass('listbox-item')
					.attr('data-value', item[0])
					.text(item[1]);
				if (index % 2 === 0) $item.addClass('even');
				else $item.addClass('odd');

				$item.on('click', function (e) {
					e.stopPropagation();
					const selectedValue = $(this).attr('data-value');
					const selectedLabel = $(this).html();

					nuSearchablePopupUtils.PropertyManager.setFilterValue(column, columnId, selectedValue);
					toggleIcon(true, selectedLabel);
					settings.onSelected(selectedValue, selectedLabel, false);
					$popup.hide();
					window.nuFORM.getCurrent().page_number = 1;
					nuSearchAction();
				});

				$options.append($item);
				$item.nuHighlight(filterText);
			});
		}
	};

	$filterInput.on('input', function () {
		renderItems($(this).val());
	});

	$filterInput.on('keydown', function (e) {
		if (e.key === 'Escape') {
			$popup.hide();
		}

		if (e.key === 'Enter') {
			e.preventDefault();
			const $visibleItems = $options.find('.listbox-item');

			if ($visibleItems.length === 1) {
				const $selectedItem = $visibleItems.first();
				const selectedValue = $selectedItem.attr('data-value');
				const selectedLabel = $selectedItem.html();

				nuSearchablePopupUtils.PropertyManager.setFilterValue(column, columnId, selectedValue);
				toggleIcon(true, selectedLabel);
				settings.onSelected(selectedValue, selectedLabel, false);
				$popup.hide();
				window.nuFORM.getCurrent().page_number = 1;
				nuSearchAction();
			}
		}
	});

	$closeBtn.on('click', function (e) {
		e.stopPropagation();
		$popup.hide();
	});

	$popup.on('click', function (e) {
		if (e.target === this) $popup.hide();
	});

	$popup.find('.popup-content').on('click', function (e) {
		e.stopPropagation();
	});

	$this.on('click', (e) => {
		$filterInput.val('');
		renderItems();
		$popup.appendTo($('#nuhtml'));

		const position = settings.positionAtMouse
			? nuSearchablePopupUtils.PositionManager.calculatePosition(e.pageX, e.pageY)
			: null;

		nuSearchablePopupUtils.PositionManager.applyPosition($popup, position, !settings.positionAtMouse);
		$popup.show();

		if (!nuIsMobile()) {
			$filterInput.trigger("focus");
		}
	});

	nuSearchablePopupUtils.FilterIconManager.setupClearEvent(column, () => {
		this.clearFilter();
	}, settings.onClear);

	if (column) {
		const existingValue = nuSearchablePopupUtils.PropertyManager.getFilterValue(column, columnId);
		if (existingValue) {
			const existingItem = settings.items.find(item => item[0] == existingValue);
			if (existingItem) {
				toggleIcon(true, existingItem[1]);
				settings.onSelected(existingValue, existingItem[1], true);
			}
		}
	}

	this.clearFilter = function () {
		nuSearchablePopupUtils.PropertyManager.clearFilterValue(column, columnId);
		toggleIcon(false);
		window.nuFORM.getCurrent().page_number = 1;
		nuSearchAction();
	};

	return this;
};

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
		setInnerHTML(title_accformslf_add_button, 'fa-solid fa-plus');
		setInnerHTML(title_accformslf_print_button, 'fa-solid fa-print');
		setInnerHTML(title_accformslf_save_button, 'fa-solid fa-save');
		setInnerHTML(title_accformslf_clone_button, 'fa-solid fa-clone');
		setInnerHTML(title_accformslf_delete_button, 'fa-solid fa-trash-alt');
	}

}

function nuSetBrowseNoDataMessage(str) {
	$('.nuBrowseNoData').html(nuTranslate(str));
}

function nuSetBrowseNoSearchResultsMessage(str) {
	$('.nuBrowseNoResults').html(nuTranslate(str));
}

function nuSetSaveButtonProperties(id, top, left, hight, width, fontSizeOrStyle) {

	id.css({
		"top": top + "px",
		"left": left + "px",
		"width": width + "px",
		"position": "absolute",
		"height": hight + "px",
		"margin": "unset"
	});

	id.attr('data-nu-tab', '0');
	id.attr('data-nu-form', '');

	if (fontSizeOrStyle !== undefined) {
		if (typeof fontSizeOrStyle === 'number') {
			id[0].style.fontSize = fontSizeOrStyle + "px";
		} else {
			id.css(fontSizeOrStyle);
		}
	}

	if (nuSelectedTabNumber() !== '0') {
		id.css('display', 'none');
	}

	return id;

}

function nuSetSaveButtonPosition(t, l, h, w, fs) {

	var sb = $('#nuSaveButton');
	sb.appendTo('div#nuRECORD');

	if (!w) w = sb.nuCSSNumber("width");
	if (!h) h = sb.nuCSSNumber("height");

	return nuSetSaveButtonProperties(sb, t, l, h, w, fs);

}

function nuAttachSaveButtonTo(id, dx, dy, hight, width, fontSize) {

	const sb = $('#nuSaveButton');
	const dest = $('#' + id);
	if (dest === undefined || nuDebugOut(dest, id)) return false;

	dest.after(sb);

	if (!dx || dx == 0) dx = 0;
	if (!dy || dy == 0) dy = 0;
	if (!width || width == 0) width = sb.nuCSSNumber("width");
	if (!hight || hight == 0) hight = sb.nuCSSNumber("height");

	return nuSetSaveButtonProperties(sb, dest.nuCSSNumber("top") + dest.nuCSSNumber("height") + 15 + dy, dest.nuCSSNumber("left") + dx, hight, width, fontSize);

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
		{ language: 'Hungarian', code: 'hu_HU', locale: Uppy.locales.hu_HU },
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
		$.getScript(`third_party/uppy/locales/${langResult.code}.min.js`, function (data, textStatus, jqxhr) {
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

function nuTabSetMarker(tabId, fieldIdOrFlag, className = 'nuTabMarker') {

	if (!tabId || fieldIdOrFlag == null) return;

	const tab = document.querySelector(`[data-nu-tab-id="${tabId}"]`);
	if (!tab) return;

	const shouldMark =
		typeof fieldIdOrFlag === 'boolean'
			? fieldIdOrFlag
			: String(nuGetValue(fieldIdOrFlag) || '').trim() !== '';

	className.split(/\s+/).forEach(cls => {
		tab.classList.toggle(cls, shouldMark);
	});

}

function nuHideSearchField() {

	const $searchField = $('.nuSearchWrapper');
	if ($searchField.length > 0) {
		$searchField.hide()
	}

}

function nuDisableSearchField() {

	const $wrapper = $('.nuSearchWrapper');
	if ($wrapper.length > 0) {
		$wrapper.find('#nuSearchField, #nuSearchBtn').prop('disabled', true);
	}

}
