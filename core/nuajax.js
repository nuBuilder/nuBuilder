function nuAjax(w, successCallback, errorCallback) {

	// Serialize data
	const data = JSON.stringify(nuAddEditFieldsToHash(w));

	// Send AJAX request
	$.ajax({
		async: true,
		dataType: "json",
		url: "core/nuapi.php",
		method: "POST",
		data: {
			nuSTATE: data
		},
		success: (data, textStatus, jqXHR) => successCallback(data, textStatus, jqXHR),
		error: (jqXHR, textStatus, errorThrown) => {
			// Call error callback if defined
			if (errorCallback) {
				errorCallback(jqXHR, textStatus, errorThrown);
			}

			nuAjaxShowError(jqXHR, errorThrown);

		},
		complete: (jqXHR, textStatus) => {
			// Do something when the request completes
		},
	});
}

function nuAjaxShowError() {

	// Format error message and display it
	const err = nuFormatAjaxErrorMessage(jqXHR, errorThrown);
	let msgDiv;
	if (nuHasHiddenModalDragDialog()) {
		msgDiv = parent.nuMessage(err);
		nuClosePopup(); 
	} else {
		msgDiv = nuMessage(err);
	}
	if (window.nuOnMessage) {
		nuOnMessage(msgDiv, err);
	}

}

function nuHasHiddenModalDragDialog() {
	return parent.$('#nuModal').length > 0 && parent.$('#nuModal').siblings(".nuDragDialog").css("visibility") == "hidden";
}

function nuForm(f, r, filter, search, n, like) {

	if (n == 2) {

		window.nuNEW = 1;
		search = '';

	}

	if (like == undefined) {
		like = '';
	} else {
		like = nuDecode(like);
	}

	if (nuOpenNewBrowserTab('getform', f, r, filter)) { return; }

	if (n != 1) {	//-- add a new breadcrumb
		window.nuFORM.addBreadcrumb();
	}

	var current = window.nuFORM.getCurrent();
	current.search = search;

	if (current.filter == '') {

		if (filter != '') {
			current.filter = filter;
		} else {

			if (window.nuFILTER != '') {
				current.filter = window.nuFILTER;
			}

		}

	}

	var last = $.extend(true, {}, current);

	last.call_type = 'getform';
	last.form_id = f;
	last.record_id = r;
	last.filter = filter == '' ? window.nuFILTER : filter;
	last.search = search;

	if (parent['nuHashFromEditForm'] === undefined) {
		last.hash = [];
	} else {
		last.hash = parent.nuHashFromEditForm();
	}

	last.AAA = 'hw';
	last.like = like;

	var successCallback = function (data, textStatus, jqXHR) {

		var fm = data;

		if (nuDisplayError(fm)) {

			nuCursor('default');

			parent.$('#nuModal').remove();

			if (parent.$('#nuDragDialog').css('visibility') == 'hidden') {
				parent.nuDisplayError(fm);
				parent.$('#nuDragDialog').remove();
			}

			nuFORM.breadcrumbs.pop();

			if (fm.log_again == 1) { location.reload(); }

		} else {

			var last = window.nuFORM.getCurrent();
			last.record_id = fm.record_id;
			last.FORM = fm.form;

			nuBuildForm(fm);

		}
	};

	nuAjax(last, successCallback);

}


function nuGetReport(formId, recordId) {

	if (nuOpenNewBrowserTab('getreport', formId, recordId, '')) { 
		return; 
	}

	let last = window.nuFORM.addBreadcrumb();
	last.session_id = window.nuSESSION;
	last.call_type = 'getreport';
	last.form_id = formId;
	last.record_id = recordId;
	last.hash = parent.nuHashFromEditForm ? parent.nuHashFromEditForm() : [];

	let successCallback = function (data) {
		if (!nuDisplayError(data)) {
			nuBuildForm(data);
		}
	};

	nuAjax(last, successCallback);

}

function nuRunReport(formId, iFrame) {

	const current = nuFORM.getCurrent();
	let last = $.extend(true, {}, current);

	last.session_id = window.nuSESSION;
	last.call_type = 'runreport';
	last.form_id = formId;
	last.hash = parent.nuHashFromEditForm ? parent.nuHashFromEditForm() : [];

	const successCallback = function (data, textStatus, jqXHR) {

		if (!nuDisplayError(data)) {

			const pdfUrl = 'core/nurunpdf.php?i=' + data.id;

			if (iFrame === undefined) {
				window.open(pdfUrl);
			} else {
				parent.$('#' + iFrame).attr('src', pdfUrl);
			}

		}

	};

	nuAjax(last, successCallback);

}

function nuRunReportSave(formId, tag = null, callback = null) {

	const current = nuFORM.getCurrent();
	const last = $.extend(true, {}, current);

	last.session_id = window.nuSESSION;
	last.call_type = 'runreport';
	last.form_id = formId;
	last.hash = nuHashFromEditForm();

	const successCallback = function (data, textStatus, jqXHR) {

		const fm = data;

		if (!nuDisplayError(fm)) {

			let formData = new FormData();
			formData.append('ID', fm.id);
			formData.append('tag', tag);
			let xhr = new XMLHttpRequest();

			if (callback !== null) {
				xhr.onreadystatechange = function () {
					if (this.readyState == 4 && this.status == 200) {
						const data = JSON.parse(xhr.responseText);
						callback(data.filename, data.id, this);
					}
				}
			}

			xhr.open('POST', 'core/nurunpdf.php', true);
			xhr.send(formData);

		}

	};

	nuAjax(last, successCallback);

}

function nuAskLogout() {

	if (nuFormsUnsaved() > 0) {
		if (!confirm(nuTranslate('There are unsaved changes. Do you really want to leave the page?'))) return;
	}

	nuLogout();

}

function nuLogout() {

	const winTop = window.top;
    winTop.nuFORM.addBreadcrumb();

	const last = winTop.nuFORM.getCurrent();
	last.session_id = window.nuSESSION;
	last.call_type = 'logout';

	const successCallback = function (data, textStatus, jqXHR) {

		if (!nuDisplayError(data)) {
			sessionStorage.removeItem('nukeepalive');
			winTop.window.open('index.php', '_self');
		}

	};

	nuAjax(last, successCallback);

}

function nuGetPHP(formId, recordId) {

	if (nuOpenNewBrowserTab('getphp', formId, recordId, '')) {
		return;
	}

	window.nuFORM.addBreadcrumb();

	const current = nuFORM.getCurrent();
	let last = $.extend(true, {}, current);

	last.session_id = window.nuSESSION;
	last.call_type = 'getphp';
	last.form_id = formId;
	last.record_id = recordId;

	if (parent['nuHashFromEditForm'] === undefined) {
		last.hash = [];
	} else {
		last.hash = parent.nuHashFromEditForm();
	}

	const successCallback = function (data) {

		if (!nuDisplayError(data)) {
			nuFORM.setProperty('record_id', data.record_id);
			nuBuildForm(data);
		} else {
			window.nuFORM.breadcrumbs.pop();
		}
	};

	nuAjax(last, successCallback);

}

function nuRunPHP(code, iFrame, runBeforeSave) {

	if (!runBeforeSave) {
		if (nuBeforeSave && nuBeforeSave() === false) {
			return;
		}
	}

	const current = nuFORM.getCurrent();
	let last = $.extend(true, {}, current);

	last.session_id = nuSESSION;
	last.call_type = 'runphp';
	last.form_id = code;
	last.nuFORMdata = nuFORM.data();

	if (nuFORM.getCurrent() === undefined) {
		last.record_id = parent.nuFORM.getCurrent().record_id;
		last.hash = parent['nuHashFromEditForm'] === undefined ? [] : parent.nuHashFromEditForm();
	} else {
		last.record_id = nuFORM.getCurrent().record_id;
		last.hash = nuHashFromEditForm();
	}

	const successCallback = function (data, textStatus, jqXHR) {

		if (!nuDisplayError(data)) {

			const pdfUrl = `core/nurunphp.php?i=${fm.id}`;

			if (!iFrame) {
				window.open(pdfUrl);
			} else {
				parent.$('#' + iFrame).attr('src', pdfUrl);
			}

		}

	};

	nuAjax(last, successCallback);

}


function nuRunPHPHidden(code, rbs, params) {

	if (arguments.length == 1) {

		if (window.nuBeforeSave) {
			if (nuBeforeSave() === false) { return; }
		}

	}

	var current = nuFORM.getCurrent();
	var last = $.extend(true, {}, current);

	last.session_id = window.nuSESSION;
	last.call_type = 'runhiddenphp';
	last.form_id = 'doesntmatter';
	last.params = params ? params: null;
	last.hash_record_id = last.record_id;
	last.record_id = code;					//-- php code
	last.nuFORMdata = nuFORM.data();
	last.hash = nuHashFromEditForm();

	var successCallback = function (data, textStatus, jqXHR) {

		var fm = data;

		if (nuDisplayError(fm)) { return; };

		window.nuSERVERRESPONSE_HIDDEN = fm;
		eval(fm.callback + ';');

	};

	nuAjax(last, successCallback);

}

function nuRunPHPHiddenWithParams(code, paramName, paramValue, rbs) {
	nuSetProperty(paramName, btoa(JSON.stringify(paramValue)));
	nuRunPHPHidden(code, rbs);
}

function nuSystemUpdate() {

	var msg = nuTranslate("Update system? Be sure to backup first.");
	if (confirm(msg) == false) { return; }

	if (nuCurrentProperties().form_code == 'nuupdate') {
		var myWindow = window.open("", "_self");
		myWindow.document.write(nuTranslate('This tab can be closed after the update.') + ' <br> ' + nuTranslate('You will need to log in again for the changes to take effect.'));
	}

	var current = nuFORM.getCurrent();
	var last = $.extend(true, {}, current);

	last.session_id = nuSESSION;
	last.call_type = 'systemupdate';
	last.form_id = 'systemupdate';
	last.nuFORMdata = nuFORM.data();
	last.hash = nuHashFromEditForm();

	var successCallback = function (data, textStatus, jqXHR) {

		var fm = data;

		if (!nuDisplayError(fm)) {

			var updateUrl = 'core/nusystemupdate.php?i=' + fm.id;
			window.open(updateUrl);

		}

	};

	nuAjax(last, successCallback);

}

function nuAttachImage(i, code, fit) {

	code = String(code).toLowerCase();
	var imgID = 'image_' + i;
	var w = $('#' + i).css('width');
	var h = $('#' + i).css('height');

	let size = fit === false ? '' : ' width="' + w + '" height="' + h;
	$('#' + i).html('<img id="' + imgID + '" class="nuBrowseImage"' + size + '" src="data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs%3D">');

	if (window.nuGraphics.indexOf(code + '.png') != -1) {						//-- check filenames in graphics dir.

		$('#' + imgID).attr('src', "core/graphics/" + code + ".png");

		return;

	}

	var PARENT = parent.parent.parent.parent.parent.parent.parent.parent.parent;

	if (PARENT.nuImages[code] !== undefined) {

		const p = JSON.parse(PARENT.nuImages[code]);
		const b = atob(p.file);

		$('#' + imgID).attr('src', b);

		return;

	}

	const current = nuFORM.getCurrent();
	let last = $.extend(true, {}, current);

	last.session_id = window.nuSESSION;
	last.call_type = 'getfile';
	last.fileCode = code;

	var successCallback = function (data, textStatus, jqXHR) {

		if (nuDisplayError(data)) { return; };

		if (data.JSONfile !== null) {

			PARENT.nuImages[code] = data.JSONfile;
			const p = JSON.parse(PARENT.nuImages[code]);
			const b = atob(p.file);

			$('#' + imgID).attr('src', b)

		}

	};

	nuAjax(last, successCallback);

}

function nuAttachButtonImage(i, c, cssClass = 'nuButtonImage') {

	c = String(c).toLowerCase();

	if (window.nuGraphics.indexOf(c + '.png') != -1) {						//-- check filenames in graphics dir.

		$('#' + i)
			.css({ 'background-image': 'url("core/graphics/' + c + '.png', 'background-position': '3px 0' })
			.addClass(cssClass);

		return;

	}

	var PARENT = parent.parent.parent.parent.parent.parent.parent.parent.parent;

	var pi = PARENT.nuImages !== undefined ? PARENT.nuImages[c] : '';

	if (pi !== undefined && pi !== '') {

		var p = JSON.parse(pi);
		var b = atob(p.file);

		$('#' + i)
			.css('background-image', 'url("' + b + '")')
			.addClass(cssClass);

		return;

	}

	var current = nuFORM.getCurrent();
	var last = $.extend(true, {}, current);

	last.session_id = window.nuSESSION;
	last.call_type = 'getfile';
	last.fileCode = c;

	var successCallback = function (data, textStatus, jqXHR) {

		if (nuDisplayError(data)) { return; };

		if (data.JSONfile !== null) {

			PARENT.nuImages[c] = data.JSONfile;
			const p = JSON.parse(pi);
			const b = atob(p.file);

			$('#' + i)
				.css('background-image', 'url("' + b + '")')
				.addClass(cssClass);

		}

	};

	nuAjax(last, successCallback);

}


function nuGetLookupId(pk, id, setFocus, setEdited) {

	if (window.nuLOOKUPCLEARING) return;

	$('#nuLookupList').remove();

	var l = $('#' + id);

	var last = nuFORM.getCurrent();

	last.session_id = nuSESSION;
	last.call_type = 'getlookupid';
	last.object_id = l.attr('data-nu-object-id');
	last.target = l.attr('data-nu-target');
	last.prefix = l.attr('data-nu-prefix');
	last.primary_key = pk;

	var successCallback = function (data, textStatus, jqXHR) {

		nuSERVERRESPONSELU = data;

		nuCursor('default');

		if (!nuDisplayError(data)) {

			nuPopulateLookup(data, id, setFocus);
			$('#' + id).addClass('nuEdited');
			
			if (setEdited != false) {
				nuHasBeenEdited();
			}

			var o = $('#' + id);

			if (o.attr('data-nu-prefix') == '') { return; }

			nuAddSubformRow(o[0], false);

		}

	};

	nuAjax(last, successCallback);

}

function nuGetLookupCode(event) {
	
	const nuTarget = event.target.getAttribute('data-nu-target');
	
	if (event.currentTarget && event.currentTarget.value.length == 0) {
		window.nuLOOKUPCLEARING = true;
		$('#' + nuTarget).addClass('nuEdited');
		nuSetValue(nuTarget, '');
		nuSetValue(nuTarget + 'description', '');
		window.nuLOOKUPCLEARING = false;
		return;
	}
	
	let last = window.nuFORM.getCurrent();

	last.session_id = window.nuSESSION;
	last.call_type = 'getlookupcode';
	last.object_id = event.target.getAttribute('data-nu-object-id');
	last.target = nuTarget;
	last.code = event.target.value;
	last.hash = nuHashFromEditForm();

	window.nuLOOKUPSTATE[last.object_id] = 'looking';

	const successCallback = function (data) {

		nuSERVERRESPONSELU = data;

		if (!nuDisplayError(data)) {
			nuChooseOneLookupRecord(event, data);
		}

	};

	nuAjax(last, successCallback);

}


function nuPrintAction() {

	let last = window.nuFORM.getCurrent();

	last.call_type = 'runhtml';
	last.browse_columns = nuSERVERRESPONSE.browse_columns;
	last.browse_sql = nuSERVERRESPONSE.browse_sql;
	last.session_id = window.nuSESSION;

	const successCallback = function (data, textStatus, jqXHR) {

		if (!nuDisplayError(data)) {
			var p = 'core/nurunhtml.php?i=' + data.id;
			window.open(p);
		}

	};

	nuAjax(last, successCallback);

}

function nuUpdateData(action, instruction, close) {

	if (action == 'save') {

		if (window.nuBeforeSaveGlobal) {
			if (nuBeforeSaveGlobal() === false) { 
				return; 
			}
		}

		if (window.nuBeforeSave) { 
			if (nuBeforeSave() === false) { 
				return; 
			} 
		}

	}

	if (action != 'save' && window.nuBeforeDelete) {
		if (nuBeforeDelete() === false) {
			$('#nuDelete').prop('checked', false);
			return;
		}
	}

	if (action == 'save') {
		// nuSavingProgressMessage();
		nuSaveEditor();
	}

	if (nuFORM.getCurrent().record_id == -1) { nuSetProperty('NEW_RECORD', 1); }

	const current = window.nuFORM.getCurrent();
	let last = $.extend(true, {}, current);

	const formId = last.form_id;
	window.nuLASTRECORD = last.record_id;

	if (instruction !== undefined) {
		last.instruction = instruction;
	}

	last.call_type = 'update';
	last.deleteAll = $('#nuDelete').is(":checked") ? 'Yes' : 'No';
	last.nuFORMdata = nuFORM.data(action);
	last.hash = nuHashFromEditForm();
	last.session_id = window.nuSESSION;

	$('.nuActionButton').hide();

	const successCallback = function (data, textStatus, jqXHR) {

		if (nuDisplayError(data)) {

			$('.nuActionButton').show();
			nuAbortSave();

		} else {

			if (data.after_event) {
				nuMESSAGES = data.errors;
			}

			if ($('#nuDelete').prop('checked')) {

				if (action == "delete" && instruction == "all" && data.record_id == "") {

					nuSearchAction();
					nuGetBreadcrumb();
					return;

				}

				window.nuFORM.removeLast();						//-- return to browse
				if ($('.nuBreadcrumb').length == 0) {
					window.close();
				} else {
					nuGetBreadcrumb();
				}

				if (nuCurrentProperties() == undefined) {

					parent.$('#nuModal').remove();
					parent.$('#nuDragDialog').remove();

				}

				nuUpdateMessage('Record Deleted');

				if (window.nuAfterDeleteGlobal) {
					nuAfterDeleteGlobal();
				}

				if (window.nuAfterDelete) {
					nuAfterDelete();
				}

			} else {

				nuForm(formId, data.record_id, data.filter, data.search, 1);		//-- go to saved or created record
				nuUpdateMessage('Record Saved');

				if (instruction === 'close') {
					nuFORM.edited = false;
					nuOpenPreviousBreadcrumb();
				}
			}

		}
	};

	nuAjax(last, successCallback, nuAbortSave);

}

function nuSaveAfterDrag() {

	const contentWin = getNuDragDialogIframes[0].contentWindow;
	let last = contentWin.nuFORM.getCurrent();

	last.call_type = 'nudragsave';
	last.nuDragState = contentWin.nuDragOptionsState;

	const successCallback = function (data, textStatus, jqXHR) {

		if (nuDisplayError(data.errors)) {
			alert(data.errors[0]);
		} else {

			$('div#nuDragDialog div#dialogTitle img#dialogClose').click();
			nuGetBreadcrumb();

		}

		$("#overlay").remove();
	};

	nuAjax(last, successCallback, nuAbortSaveDrag);

}

function nuOpenNewBrowserTab(type, formId, recordId, filter) {

	if (window.nuNEW == 1) {

		window.nuNEW = 0;
		window.nuOPENER.push(new nuOpener('F', formId, recordId, filter));

		nuOpenerAppend('type', type);

		const len = window.nuOPENER.length - 1;
		const openerId = window.nuOPENER[len].id;
		const url = `${window.location.origin}${window.location.pathname}?i=${len}&opener=${openerId}`;

		window.open(url);

		return true;

	}

	return false;

}

function nuAbortSave() {

	$("#nuProgressUpdate").hide();
	$('.nuActionButton').show();

}
