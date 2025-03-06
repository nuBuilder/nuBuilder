window.nuDialog = new nuCreateDialog('');
window.nuFORM = new nuFormObject();
window.nuRESPONSIVE = new nuResponseForm();
window.nuOnLoad = null;
window.nuBeforeSaveGlobal = null;
window.nuLoadBrowseGlobal = null;
window.nuLoadEditGlobal = null;
window.nuOnLookupPopulatedGlobal = null;
window.nuOnTabSelectedGlobal = null;
window.nuOnPopupOpenedGlobal = null;
window.nuOnOptionsListLoadedGlobal = null;
window.nuOnDisableGlobal = null;
window.top.document.nuHideMessage = true;
window.nuDragID = 1000;
window.nuLastForm = '';
window.nuNEW = '';
window.nuColor = '';
window.nuImage = '';
window.nuSESSION = '';
window.nuDRAGLINEVSTART = '';
window.nuDRAGLINEVID = '';
window.nuLASTRECORD = '';
window.nuMESSAGES = [];
window.nuSAVED = true;
window.nuImages = [];
window.nuOPENER = [];
window.nuSUBFORMROW = [];
window.nuSUBFORMJSON = [];
window.nuSCHEMA = [];
window.nuLANGUAGE = [];
window.nuFIELD = [];
window.nuHASH = [];
window.nuBEFORE = [];
window.nuAFTER = [];
window.nuBROWSERESIZE = {
	x_position: 0,
	mouse_down: false,
	moving_element: '',
	pointer: '',
	current_cell_width: 0,
	next_cell_left: 0,
	array_current_cell_left: '',
	last_moved_element: ''
};

String.prototype.nuEndsWith = function (substr, ignoreCase = false) {
	if (!ignoreCase) return this.endsWith(substr);
	return this.toLowerCase().endsWith(substr.toLowerCase());
};

String.prototype.nuStartsWith = function (substr, ignoreCase = false) {
	if (!ignoreCase) return this.startsWith(substr);
	return this.toLowerCase().startsWith(substr.toLowerCase());
};

String.prototype.nuReplaceAll = function (str1, str2, ignore) {
	return this.replace(new RegExp(str1.replace(/([\,\!\\\^\$\{\}\[\]\(\)\.\*\+\?\|\<\>\-\&])/g, function (c) { return "\\" + c; }), "g" + (ignore ? "i" : "")), str2);
};

String.prototype.nuStringToArray = function (separator = ',', trim = true) {
	const result = this.split(separator);
	return trim ? result.map(item => item.trim()) : result;
}

String.prototype.nuLeftTrim = function () {
	return this.replace(/^\s+/, "");
}

String.prototype.nuRightTrim = function () {
	return this.replace(/\s+$/, "");
}

String.prototype.containsAny = String.prototype.containsAny || function (arr) {
	for (var i = 0; i < arr.length; i++) {
		if (this.indexOf(arr[i]) > -1) {
			return true;
		}
	}
	return false;
};

String.prototype.nuReplaceNonBreakingSpaces = function (replaceWith = ' ') {
	return this.replace(/\xA0/g, replaceWith)
}

String.prototype.nuCapitalise = function () {
	return this.charAt(0).toUpperCase() + this.slice(1);
}

String.prototype.nuToTitleCase = function () {
	return this.toLowerCase().replace(/^(\w)|\s(\w)/g, (grp) => grp.toUpperCase());
}

String.prototype.nuJustNumbers = function () {
	return this.replace(/[^0-9]/g, '');
}

String.prototype.nuWithoutNumbers = function () {
	return this.replace(/\d+/g, '');
}

String.prototype.nuInsertString = function (index, string) {
	if (index > 0) {
		return this.substring(0, index) + string + this.substring(index);
	}
	return string + this;
};

String.prototype.nuIsEmpty = function () {
	return (this === null || this.length === 0);
}

String.prototype.nuHasHTMLTag = function (tag) {
	const escapeTagName = (name) => name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

	let regex;
	if (Array.isArray(tag)) {
		const escapedTags = tag.map(escapeTagName);
		const regexString = `(${escapedTags.join('|')})\\b[^>]*>`;
		regex = new RegExp(regexString, 'i');
	} else {
		const escapedTagName = escapeTagName(tag);
		regex = new RegExp(`(${escapedTagName})\\b[^>]*>`, 'i');
	}

	const match = this.match(regex);
	return match ? match[1] : false;
};

Date.prototype.nuWithoutTime = function () {
	let d = new Date(this);
	d.setHours(0, 0, 0, 0);
	return d;
}

Date.prototype.nuAddDays = function (days) {
	let date = new Date(this.valueOf());
	date.setDate(date.getDate() + days);
	return date;
}

String.prototype.nuFormat = function () {
	var args;
	args = arguments;
	if (args.length === 1 && args[0] !== null && typeof args[0] === 'object') {
		args = args[0];
	}
	return this.replace(/{([^}]*)}/g, function (match, key) {
		return (typeof args[key] !== "undefined" ? args[key] : match);
	});
};

$.fn.nuOnEnterKey = function (fn, preventDefault = false) {
	return this.each(function () {
		$(this).on('keydown', e => {
			if (e.key === 'Enter') {
				if (preventDefault) {
					e.preventDefault();
				}
				fn.call(this, e);
			}
		});
	});
};

$.fn.nuFocusWithoutScrolling = function () {

	let element = $(this)[0];

	if (element === undefined) {
		return;
	}

	let x = element.scrollX, y = element.scrollY;

	this.attr('inputmode', 'none');
	this.trigger("focus");
	this.removeAttr('inputmode');

	element.scrollTo(x, y);
	return this;

};

jQuery.fn.extend({
	nuEnable: function (enable) {
		return this.each(function () {
			nuEnable(this.id, enable);
		});
	},
	nuReadonly: function (readonly) {
		return this.each(function () {
			nuReadonly(this.id, readonly);
		});
	},
	nuDisable: function () {
		return this.each(function () {
			nuDisable(this.id);
		});
	},
	nuShow: function (visible, openTab) {
		return this.each(function () {
			nuShow(this.id, visible, openTab);
		});
	},
	nuHide: function () {
		return this.each(function () {
			nuHide(this.id);
		});
	},
	nuRemove: function () {
		return this.each(function () {
			nuRemove(this.id);
		});
	},
	nuSelectRemoveEmpty: function (setIndex) {
		return this.each(function () {
			nuSelectRemoveEmpty(this.id, setIndex);
		});
	},
	nuGetValue: function (method) {
		return nuGetValue(this.attr('id'), method);
	},
	nuSetValue: function (v, method, change) {
		return this.each(function () {
			return nuSetValue(this.id, v, method, change);
		});
	},
	nuGetText: function () {
		return nuGetValue(this.attr('id'), 'text');
	},
	nuSetText: function (v) {
		return this.each(function () {
			return nuSetValue(this.id, v, 'text');
		});
	},
	nuGetHTML: function () {
		return nuGetValue(this.attr('id'), 'html');
	},
	nuTranslate: function (method) {
		return this.each(function () {
			nuSetValue(this.id, nuTranslate(nuGetValue(this.id, method)), method);
		});
	},
	nuRemoveFormatting: function () {
		return nuFORM.removeFormatting($(this).val(), $(this).attr('data-nu-format'));
	},
	nuIsVisible: function () {
		return nuIsVisible(this.attr('id'));
	},
	nuIsHidden: function () {
		return nuIsHidden(this.attr('id'));
	},
	nuIsDisabled: function () {
		return nuIsDisabled(this.attr('id'));
	},
	nuIsEnabled: function () {
		return nuIsEnabled(this.attr('id'));
	},
	nuSetPlaceholder: function (placeholder, translate) {
		return this.each(function () {
			return nuSetPlaceholder(this.id, placeholder, translate);
		});
	},
	nuSetLabelText: function (str, translate) {
		return this.each(function () {
			nuSetLabelText(this.id, str, translate);
		});
	},
	nuTogglePassword: function (show) {
		return this.each(function () {
			let $input = $(this);
			let type = $input.attr('type') === 'password' ? 'text' : 'password';
			if (show !== undefined) {
				type = show ? 'text' : 'password';
			}
			$input.attr('type', type);
		});
	}

});

function nujQueryObj(id) {

	if (typeof id === 'string') {
		return $('#' + id);
	} else if (id instanceof HTMLElement) {
		return $(id);
	} else if (id instanceof jQuery) {
		return id;
	} else {
		return jQuery([]);
	}

}

function nuPad4(id, pad = '0') {
	return nuPad(id, 4, pad);
}

function nuPad3(id, pad = '0') {
	return nuPad(id, 3, pad);
}

function nuPad2(id, pad = '0') {
	return nuPad(id, 2, pad);
}

function nuPad(id, length, pad = '0') {
	return id.toString().padStart(length, pad);
}

function nuGlobalAccess() {
	return window.global_access;
}

function nuTriggerEvent(element, event = 'change') {

	if (element instanceof jQuery) {
		element.trigger(event);
	} else {
		let ev = new Event(event);
		element.dispatchEvent(ev);
	}

}

function nuOpener(t, f, r, filter, parameters) {

	nuSetSuffix();

	this.id = String(Date.now()) + String(window.nuSuffix);
	this.form_id = f;
	this.record_id = r;
	this.type = t;

	this.filter = nuDefine(filter);
	this.parameters = nuDefine(parameters);

}

function nuOpenerAppend(t, k) {
	window.nuOPENER[window.nuOPENER.length - 1][t] = k;
}

function nuGetOpenerById(pOPENER, pid) {

	for (let i = 0; i < pOPENER.length; i++) {
		if (pOPENER[i].id == pid) {
			return pOPENER[i];
		}
	}

	return;
}

function nuRemoveOpenerById(o, pid) {

	for (let i = 0; i < o.length; i++) {

		if (o[i].id == pid) {
			o.splice(i, 1);
		}

	}

}

function nuGetBreadcrumb(bc) {

	if (window.nuOnBeforeGetBreadcrumb) {
		if (nuOnBeforeGetBreadcrumb(bc) == false) return;
	}

	nuSaveScrollPositions();

	const breadCrumbIndex = arguments.length === 0 ? nuFORM.breadcrumbs.length - 1 : bc;

	window.nuTimesSaved = -1;

	if (nuFORM.edited && nuFORM.getCurrent().form_type != 'launch') {

		if (!confirm(nuTranslate('Leave this form without saving?'))) {
			return;
		}

	}

	window.nuFORM.removeAfter(breadCrumbIndex);

	const current = window.nuFORM.getCurrent();
	if (current === undefined) {
		nuGetNuDragDialogIframes().remove();
	} else {
		nuForm(current.form_id, current.record_id, current.filter, current.search, 1);
	}

}

function nuOpenPreviousBreadcrumb(offset = 1) {

	const modal = parent.$('#nuModal');
	if (modal.length) {
		nuClosePopup();
		return true;
	}

	const bcIndex = Math.max(2, offset + 1);
	const bcLength = window.nuFORM.breadcrumbs.length;

	if (bcLength > 1) {
		nuGetBreadcrumb(bcLength - bcIndex);
		return true;
	}

	return false;

}

function nuDisplayError(errorObj) {

	if (!errorObj.errors || errorObj.errors.length === 0) {
		return false;
	}

	const messageDiv = nuMessage(errorObj.errors);
	window.nuOnMessage?.(messageDiv, errorObj.errors);

	return !errorObj.after_event;

}

function nuFormatAjaxErrorMessage(jqXHR, exception) {

	const errorMessages = {
		0: nuTranslate('Not connected. Please verify your network connection.'),
		403: [`<h3>${nuTranslate('Access Forbidden.')}</h3>`, jqXHR.responseText],
		404: nuTranslate('The requested page was not found.') + ' [404]',
		500: nuTranslate('Internal Server Error.') + ' [500]',
		parsererror: nuTranslate('Requested JSON parse failed.'),
		timeout: nuTranslate('Time out error.'),
		abort: nuTranslate('Ajax request aborted.'),
	};

	const errorMessage = errorMessages[jqXHR.status] || errorMessages[exception] ||
		[`<h3>${nuTranslate('Uncaught Error.')}</h3>`, jqXHR.responseText]

	return errorMessage;

}

function nuLogin(loginTopRow, nuconfigNuWelcomeBodyInnerHTML, logonMode = 'normal', onlySsoExcept = {}, lastUser = "") {

	var HTML = String(nuconfigNuWelcomeBodyInnerHTML).trim();
	loginTopRow = String(loginTopRow).trim();
	window.nuSESSION = '';
	window.nuFORM = new nuFormObject();

	$('body').html('');

	var defaulTopRow = `
						<tr>
							<td align='center' style='padding:0px 0px 0px 33px; text-align:center;'>
							<img src='core/graphics/logo.png'><br><br>
							</td>
						</tr>
			`;

	var topRow = loginTopRow == '' ? defaulTopRow : loginTopRow;

	var h1 = `
			<div id='outer' style='width:100%'>
			<form id='nuLoginForm' action='#' method='post' onsubmit='return false'>
				<div id='login' class='nuLogin'>
					<table align="center">`
		+ topRow + `
			`;
	var h2sso = `
						<tr>
							<td align='center' style='text-align:center' colspan='2'>
								<input id='submitSSO' style='width:90px' type='submit' class='nuButton' onclick='nuSSOLoginRequest()' value='SSO Log in'/>
								<br><br>
							</td>
						</tr>`;
	var h3normal = `
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
						</tr>`;
	var h4 = `
					</table>
				</div>
			</form>
			</div>
	`;


	if (logonMode == 'normal') {
		var h = h1 + h3normal + h4;
	} else if (logonMode == 'sso') {
		var h = h1 + h2sso + h4;
	} else if (logonMode == 'both') {
		if (lastUser in onlySsoExcept || "allusers" in onlySsoExcept) {  // Selectively show username/password login option if found in 'onlySsoExcept' dictionary - most users only see SSO button
			var h = h1 + h2sso + h3normal + h4;
		} else {
			var h = h1 + h2sso + h4;
		}
	} else {  // Original/normal mode
		var h = h1 + h3normal + h4;
	}

	var H = HTML == '' ? h : HTML;

	var e = document.createElement('div');

	e.setAttribute('id', 'loginbg');

	window.nuLoginU = window.nuLoginU === undefined ? '' : window.nuLoginU;
	window.nuLoginP = window.nuLoginP === undefined ? '' : window.nuLoginP;

	$('body').html(H);

	if (nuIsMobile()) {
		$('body').css('width', 300).css('height', 300);
	}

	if (window.nuLoginU == '' && window.nuLoginP == '') {
		$('#nuusername').trigger("focus");
	}

	if (window.nuLoginU != '' && window.nuLoginP == '') {

		$('#nuusername').val(window.nuLoginU);
		$('#nupassword').trigger("focus");

	}

	if (window.nuLoginU != '' && window.nuLoginP != '') {

		$('#nuusername').val(window.nuLoginU);
		$('#nupassword').val(window.nuLoginP);

		nuLoginRequest();

	}

	if (sessionStorage.logout == 'true') {
		nuMessage(['You have been logged out']);
	}

	sessionStorage.logout = '';

}

function nuSubmit(e) {

	if (e.key == 'Enter') {
		$('#submit').trigger("click");
	}

}

function nuArrangingObjects(recordId) {

	recordId = nuDefine(recordId, nuRecordId());
	return recordId == '-2';

}

function nuCanArrangeObjects() {

	const hasObjects = nuSERVERRESPONSE.objects && nuSERVERRESPONSE.objects.length > 0;
	const isNotPortraitScreen = !window.nuPORTRAITSCREEN;
	const isNotMobileView = !nuUseMobileView();

	return nuGlobalAccess() && hasObjects && isNotPortraitScreen && isNotMobileView && !nuArrangingObjects();

}

function nuPopup(formId, recordId, filter) {

	nuCursor('progress');

	if (!nuGlobalAccess() && formId == 'nuobject') { return; }
	if (nuArrangingObjects(recordId) && !nuCanArrangeObjects()) { return; }

	window.nuOPENER.push(new nuOpener('F', formId, recordId, filter));

	const openerId = window.nuOPENER[window.nuOPENER.length - 1].id;

	if (parent.window == window) {
		let dialogLeft = nuIsMobile() ? 0 : 50;
		window.nuDialog.createDialog(dialogLeft + window.scrollX, 25 + window.scrollY, 50, 50, '');
	} else {
		window.nuDialog.createDialog(0, 30, 50, 50, '');
	}

	$('#nuDragDialog')
		.css('visibility', 'hidden')
		.append('<iframe style="border-style:none;right:5px;top:35px;width:400px;height:400px;position:absolute" id="nuWindow" src="index.php?opener=' + openerId + '&browsefunction=browse&iframe=1"></iframe>')
		.prepend('<div id="nuDraggingBox" style="position:absolute; bottom:0px; right:0px; width:20px; height:20px; z-index:200"></div>');


	if (window.nuOnPopupOpenedGlobal) {
		nuOnPopupOpenedGlobal(formId, recordId, filter);
	}

}

function nuOptionsListAction(f, r, filter) {

	if (!(nuIsMacintosh() ? window.event.metaKey : window.event.ctrlKey)) {
		nuPopup(f, r, filter)
	} else {
		nuForm(f, r, filter, '', '');
	}
}

//-- object for dragging dialog --//

function nuCreateDialog(t) {

	this.startX = 0;
	this.startY = 0;
	this.moveX = 0;
	this.moveY = 0;
	this.title = t;
	this.pos = {};

	this.move = function (event) {

		this.moveX = event.clientX - this.startX;
		this.moveY = event.clientY - this.startY;
		this.startX = event.clientX;
		this.startY = event.clientY;

		if (event.buttons == 1) {
			this.moveDialog(event);
		}

		const dir = event.target.parentElement.baseURI.includes('nureportdesigner') ? '' : 'core/';
		$('#dialogClose').attr("src", dir + "graphics/close" + (event.target.id === 'dialogClose' ? "_red" : "") + ".png");

	}

	this.click = function (event) {

		if (event.target.id == 'dialogClose') {

			if ($('#nuWindow').contents().find('#nuSaveButton.nuSaveButtonEdited').length > 0) {

				if (!confirm(nuTranslate('Leave this form without saving?'))) {
					return false;
				}

			}
			$('#nuDragDialog').remove();
			$('#nuModal').remove();
			$('body').off('.popup');

		}

	}


	this.down = function (event) {

		window.nuCurrentID = event.target.id;

		if (event.target.id == 'dialogTitleWords') {

			$('#nuDragDialog').append('<div id="nuPopupModal"></div>');
		}

	}

	this.moveDialog = function (event) {

		if (window.nuCurrentID === 'nuModal') {
			return;
		}

		const dialog = document.getElementById('nuDragDialog');
		if (dialog === null) return;

		let style = dialog.style;
		let newLeft = parseInt(style.left, 10) + this.moveX;
		let newTop = parseInt(style.top, 10) + this.moveY;

		if (event.target.classList.length === 0 && event.target.id !== 'nuSelectBox') {
			style.left = newLeft + 'px';
			style.top = newTop + 'px';
		}

	}


	this.createDialog = function (l, t, w, h, title) {

		var callerName = this.createDialog.caller.name;
		nuDialog.dialog = callerName;

		var e = document.createElement('div');

		var translation = nuTranslate(title);

		e.setAttribute('id', 'nuDragDialog');

		let scrollHeight = Math.max(
			document.body.scrollHeight, document.documentElement.scrollHeight,
			document.body.offsetHeight, document.documentElement.offsetHeight,
			document.body.clientHeight, document.documentElement.clientHeight
		);

		$('body').append('<div id="nuModal" style="height:' + scrollHeight + 'px"></div>')
			.append(e);

		var subDir = callerName == 'nuPopup' || callerName == 'nuBuildLookup' ? 'core/' : '';

		$('#nuDragDialog').addClass('nuDragDialog nuDragNoSelect')
			.css({
				'left': l,
				'top': t,
				'width': w,
				'height': h,
				'background-color': '#fff',
				'z-index': 3000,
				'position': 'absolute',
				'visibility': 'hidden'
			})
			.html('<div id="dialogTitle" class="nuDialogTitle"><div id="dialogTitleWords">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' + translation + '</div><img id="dialogClose" src="' + subDir + 'graphics/close.png" style="position:absolute; top:2px; left:0px"></div>')

		const $body = $('body');
		if (!$body.attr('data-nu-popup-events')) {
			$body.attr('data-nu-popup-events', '')
				.on('mousemove.popup', function (event) { nuDialog.move(event); })
				.on('click.popup', function (event) { nuDialog.click(event); })
				.on('mousedown.popup', function (event) { nuDialog.down(event); })
				.on('mouseup.popup', function (event) { window.nuCurrentID = ''; $('#nuPopupModal').remove(); })
				.on('dblclick.popup', function (event) { nuResizeWindow(event); })
		}

		this.startX = l;
		this.startY = t;

	}

}

function nuReformat(element) {

	const $element = $('#' + element.id);
	const formatType = $element.attr('data-nu-format');
	const currentValue = $element.val();

	if (!formatType || !currentValue) {
		return currentValue;
	}
	const reapplyFormat = function (value, format) {
		let rawValue = nuFORM.removeFormatting(value, format);
		return nuFORM.addFormatting(rawValue, format);
	};

	const formattedValue = reapplyFormat(currentValue, formatType);

	if (formatType.startsWith('D') && currentValue !== formattedValue) {
		$element.val('');

		if (window.nuFormatValueClearedGlobal) {
			nuFormatValueClearedGlobal($element, currentValue);
		}

		if (window.nuFormatValueCleared) {
			nuFormatValueCleared($element, currentValue);
		}
	} else if (formatType.startsWith('N')) {
		$element.val(formattedValue);
	}

}

function nuOpenAce(lang, obj) {

	const ts = Date.now();
	const theme = nuUXOptions.nuAceTheme || 'default';

	window.nuAce = [lang, obj, theme];
	window.open(`core/nuace.php?${ts}`);

}

function nuBindCtrlEvents() {

	const nuCtrlKeydownListener = function (e) {

		if (e.key === 'F3' || ((nuIsMacintosh() ? e.metaKey : e.ctrlKey) && e.key === 'f')) { // exclude Ctrl + f
			window.nuNEW = 0;
		} else {
			if (e.key == 'Control') {
				window.nuNEW = 1;
			}

		}

	}

	const nuHtml = document.getElementById('nuhtml');
	nuAddEventListenerOnce(nuHtml, 'keydown', function (e) {

		if (e.isComposing || e.keyCode === 229) {
			return;
		}

		if ((e.key === 'PageDown' || e.key === 'PageUp') && nuFormType() == 'browse') {
			const $nuRecord = $("#nuRECORD");
			const scrollBy = e.key === 'PageDown' ? 400 : -400;
			$nuRecord.scrollTop($nuRecord.scrollTop() + scrollBy);
		}

		if (e.key == 'Escape') {

			if (nuIsVisible('nuMessageDiv')) {
				nuMessageRemove(true);
			} else if (nuIsVisible('nuOptionsListBox')) {
				$('#nuOptionsListBox').remove();
			} else if (parent.$('#nuModal').length === 1) {
				let ae = document.activeElement;
				$(ae).trigger("blur").trigger("focus");
				if (nuFormsUnsaved() == 0) {
					nuClosePopup();
				} else {
					if (confirm(nuTranslate('Leave this form without saving?'))) {
						nuClosePopup();
					}
				}
			} else if (nuFormType() == 'browse') {
				nuSearchAction("");
			}

		}

		if ((nuIsMacintosh() ? e.metaKey : e.ctrlKey) && e.shiftKey) {

			window.nuNEW = 0;

			const globalAccess = nuGlobalAccess();
			const formId = nuFormId();
			const formType = nuFormType();
			const isBrowseOrEdit = formType === 'browse' || formType === 'edit';
			const isEditOnly = formType === 'edit';
			const isBrowseOnly = formType === 'browse';
			const isLaunch = nuCurrentProperties().form_type === 'launch';

			// Define actions in a more structured way to avoid redundancy
			const actions = {
				// Common actions for both 'browse' and 'edit'
				'r': { action: () => nuGetBreadcrumb(), condition: true },
				// Actions specific to 'browse' form type
				...(isBrowseOnly && {
					'c': { action: () => nuGetSearchList(), condition: true },
					's': { action: () => nuSearchAction(), condition: true },
					'a': { action: () => nuAddAction(), condition: true },
					'p': { action: () => nuPrintAction(), condition: globalAccess },
					'arrowright': { action: () => $('#nuNext').trigger('click'), condition: true },
					'arrowleft': { action: () => $('#nuLast').trigger('click'), condition: true },
					'end': { action: () => $('#nuEnd i').trigger('click'), condition: true },
					'home': { action: () => $('#nuFirst i').trigger('click'), condition: true }
				}),
				// Actions specific to 'edit' form type
				...(isEditOnly && {
					'a': { action: () => nuPopup(formId, "-2"), condition: nuCanArrangeObjects() },
					'q': { action: () => nuPopup("nupassword", "", ""), condition: !globalAccess },
					'h': { action: () => nuPopup('nuobject', '-1', ''), condition: globalAccess },
					'g': { action: () => nuForm("nuobjectgrid", formId, "", "", 2), condition: globalAccess },
					's': { action: () => { $(":focus").trigger("blur"); nuSaveAction(); }, condition: true },
					'c': { action: () => { if (!isLaunch) { nuCloneAction() } }, condition: true },
					'y': { action: () => { if (!isLaunch) { nuDeleteAction() } }, condition: true },
					'arrowright': { action: () => nuSelectNextTab(1), condition: true },
					'arrowleft': { action: () => nuSelectNextTab(-1), condition: true },
					'?': { action: () => nuOpenFormHelp(), condition: true }
				}),
				// Actions available on 'browse' or 'edit' form types
				...(isBrowseOrEdit && {
					'f': { action: () => nuPopup("nuform", formId), condition: globalAccess },
					'o': { action: () => nuPopup("nuobject", "", formId), condition: globalAccess },
					'm': { action: () => nuShowFormInfo(), condition: globalAccess },
					'v': { action: () => nuShowVersionInfo(), condition: globalAccess },
					'e': { action: () => nuVendorLogin('PMA'), condition: globalAccess },
					'j': { action: () => nuForm("nusession", "", "", "", 2), condition: globalAccess },
					'q': { action: () => nuVendorLogin("TFM"), condition: globalAccess && isBrowseOrEdit },
					'b': { action: () => nuRunBackup(), condition: globalAccess },
					'u': { action: () => nuForm('nusetup', '1', '', '', 2), condition: globalAccess },
					'd': { action: () => nuPopup("nudebug", ""), condition: globalAccess },
					'x': { action: () => nuPrettyPrintMessage(e, nuCurrentProperties()), condition: globalAccess },
					'l': { action: () => nuAskLogout(), condition: true }
				}),
			};

			// Execute action based on key press if condition is met
			const key = e.key.toLowerCase();
			const action = actions[key];

			if (action?.condition) {
				e.preventDefault();
				action.action();
			}

			let nosearch = window.nuFORM.getProperty('nosearch_columns');
			let searchIndex = -1;

			//Numbers
			const numberCode = e.code.replace('Digit', '');
			if (numberCode >= "1" && numberCode <= "9") {
				searchIndex = Number(numberCode) - 1;
			}

			if (searchIndex != -1) {

				if ($.inArray(searchIndex, nosearch) != '-1') {
					nosearch.pop(searchIndex);
					$('#nusort_' + searchIndex).removeClass('nuNoSearch');
				} else {
					nosearch.push(searchIndex);
					$('#nusort_' + searchIndex).addClass('nuNoSearch');
				}

			}

			window.nuFORM.setProperty('nosearch_columns', nosearch);
		}

	}, { passive: false }, 'nu-keydown-added');


	const nuCtrlKeyupListener = function (e) {
		window.nuNEW = 0;
	}

	$(document).on('keydown.nubindctrl', nuCtrlKeydownListener);
	$(document).on('keyup.nubindctrl', nuCtrlKeyupListener);

}

function nuUnbindDragEvents() {
	$(document).off('.nubindctrl');
}

function nuTranslate(obj) {

	const isEnglish = nuUserLanguage() === '';

	if (Array.isArray(obj)) {

		if (isEnglish) {
			return obj;
		}

		let arr = obj;
		arr.forEach(function (item, index) {
			const l = nuLANGUAGE.find(elem => elem.english === item);
			arr[index] = !l ? item : l.translation;
		})

		return arr;

	} else {
		if (!obj) return '';

		str = String(obj);
		if (str.charAt(0) == '|') return str.substring(1);

		if (isEnglish) {
			return str;
		}

		const l = nuLANGUAGE.find(elem => elem.english === str);
		return !l ? str : l.translation;
	}

}

function nuTranslateToEnglish(str) {

	if (!str) return '';

	str = String(str);
	if (str.charAt(0) === '|') return str.substring(1);

	const l = nuLANGUAGE.find(({ translation }) => translation === str);
	return l ? l.english : str;

}

function nuIsOpener() {
	return window.opener !== null;
}

function nuPreview(a) {

	const r = nuRecordId();

	if (r === '-1') {

		alert(nuTranslate('Form must be saved first..'));
		return;

	}

	const arg = a === undefined ? '-3' : '';
	nuPopup(r, arg);

}

function nuPopEvent(e, formId, nuEvent) {

	const recordId = nuRecordId();

	if (formId === 'nuphp') {
		nuPopup('nuphp', recordId + '_' + nuEvent, 'justphp');
	} else if (formId === 'nuselect') {
		nuPopup('nuselect', recordId + '_' + nuEvent, 'justsql');
	}

}

function nuPopPHP(e, nuEvent) {
	nuPopEvent(e, 'nuphp', nuEvent);
}

function nuPopSQL(e, nuEvent) {
	nuPopEvent(e, 'nuselect', nuEvent);
}

function nuGetLookupFields(id) {

	const prefix = id.slice(0, -4);
	const $id = $('#' + id);
	const lookupFields = [];

	if ($id.length === 1) {
		const type = $id.attr('data-nu-type');
		if (type === 'subform') {
			lookupFields.push(prefix, id, prefix + 'description');
		} else {
			lookupFields.push('nunosuchfield', id, 'nunosuchfield');
		}
	}

	return lookupFields;

}

function nuObjectComponents(id) {

	let componentIds = [id, `label_${id}`];
	let type = '';
	const element = $(`#${id}`);

	if (element.attr('data-nu-type') === 'lookup') {
		componentIds.push(`${id}code`, `${id}button`, `${id}description`);
		type = 'lookup';
	} else
		if (element.hasClass('select2-hidden-accessible')) {
			componentIds.push(`${id}_select2`);
			type = 'select2';
		}

	return {
		componentIds,
		type
	};

}

function nuEnable(i, enable) {

	if (enable === false) {
		nuDisable(i);
		return;
	}

	const ids = Array.isArray(i) ? i : [i];

	$.each(ids, function (index) {

		const id = ids[index];
		let { componentIds, type } = nuObjectComponents(id);

		for (let c = 0; c < componentIds.length; c++) {

			if (c === 1) {
				continue;
			} // skip label

			let $current = $('#' + componentIds[c]);

			$current
				.removeClass('nuReadonly')
				.prop('readonly', false)
				.prop('disabled', false);

			if (type === 'Lookup' && c === 2) { //-- button
				$current.on("click", () => nuBuildLookup(componentIds[c], ""));
			}

		}

	});

}

function nuDisable(id) {

	const ids = Array.isArray(id) ? id : [id];

	$.each(ids, function (index) {
		const id = ids[index];
		const { componentIds } = nuObjectComponents(id);

		for (let c = 0; c < componentIds.length; c++) {
			if (c === 1) {
				continue;
			} // skip label

			let $component = $('#' + componentIds[c]);
			$component.addClass('nuReadonly')

			let result = true;
			if (window.nuOnDisableGlobal) {
				result = nuOnDisableGlobal(id, $component);
			}

			if (result !== false) {
				$component
					.prop('readonly', true)
					.prop('disabled', true);
			}

			if (c === 2) { //-- button
				$component.off();
			}

		}
	});

}

function nuReadonly(id, readonly = true) {

	let { componentIds } = nuObjectComponents(id);

	componentIds.forEach((component, index) => {
		// Skip label by index
		if (index === 1) return;
		$(`#${component}`)
			.toggleClass('nuReadonly', readonly)
			.prop('readonly', readonly);
	});

}

function nuShow(ids, visible, openTab) {

	const elementIds = Array.isArray(ids) ? ids : [ids];
	let shownCounter = 0;

	for (const elementId of elementIds) {
		if (visible === false) {
			nuHide(elementId);
		} else {
			const { componentIds } = nuObjectComponents(elementId);

			for (const componentId of componentIds) {
				const nuTab = String($('#' + componentId).attr('data-nu-tab'));

				if (nuIsHidden(componentId)) {
					if (nuTab[0] === 'x') {
						$('#' + componentId)
							.attr('data-nu-tab', nuTab.substring(1))
							.show();
					} else {
						$('#' + componentId).show();
					}
					shownCounter++;
				}
			}
		}

		if (openTab !== false && shownCounter > 0 && $('.nuTabSelected').length > 0) {
			nuOpenTab($('.nuTabSelected')[0].id.substr(5));
		}
	}

}

function nuHide(ids) {

	let elementIds = [];

	if (!Array.isArray(ids)) {
		elementIds.push(ids);
	} else {
		elementIds = ids;
	}

	for (let i = 0; i < elementIds.length; i++) {
		const { componentIds } = nuObjectComponents(elementIds[i]);

		for (let j = 0; j < componentIds.length; j++) {
			const elementId = componentIds[j];
			const nuTab = String($('#' + elementId).attr('data-nu-tab'));

			if (nuTab[0] === 'x') {
				$('#' + elementId).hide();
			} else {
				$('#' + elementId)
					.attr('data-nu-tab', 'x' + nuTab)
					.hide();
			}
		}
	}
}

function nuRemove(id) {

	const elementIds = Array.isArray(id) ? id : [id];

	for (const elementId of elementIds) {
		const { componentIds } = nuObjectComponents(elementId);

		for (const componentId of componentIds) {
			$('#' + componentId).remove();
		}
	}

}

function nuIsVisible(id) {

	if (!id) return;

	const $id = typeof id === 'string' ? $('#' + id) : id;
	if ($id.length === 0) return null;

	const display = $id.css('display');
	const visibility = $id.css('visibility');
	const isHidden = $id.is(':hidden');
	return display !== 'none' && visibility !== 'hidden' && !isHidden;

}

function nuIsHidden(id) {
	return !nuIsVisible(id);
}

function nuIsEnabled(id) {
	const $id = $('#' + id);
	return !$id.is(':disabled') && !$id.hasClass('nuReadonly');
}

function nuIsDisabled(id) {
	let $id = $('#' + id);
	return $id.is(':disabled') || $id.hasClass('nuReadonly');
}

function nuAddThousandSpaces(numberString, delimiter) {
	return numberString.replace(/\B(?=(\d{3})+(?!\d))/g, delimiter);
}

function nuResizeWindow(e) {

	if (e.target.id !== 'dialogTitleWords') return;

	const dialog = $('#nuDragDialog');
	const dialogLeft = parseInt(dialog.css('left'), 10);
	const win = $('#nuWindow');
	const dragOptionsBox = $('.nuDragOptionsBox');

	if (dialogLeft === 2) {
		const contentWin = nuGetNuDragDialogIframes()[0].contentWindow;
		dialog.css(contentWin.nuDialogSize);
		win.css(contentWin.nuWindowSize);
	} else {

		dialog.css({
			top: 0,
			left: 2,
			width: window.innerWidth - 30,
			height: window.innerHeight
		});

		const dialogWidth = dragOptionsBox.length ? parseInt(dragOptionsBox.css('width'), 10) : 0;

		win.css({
			top: 30,
			width: parseInt(dialog.css('width'), 10) - dialogWidth - 10,
			height: parseInt(dialog.css('height'), 10) - 50
		});

	}
}

function nuGetFunctionList() {

	var f = '';

	for (var k in window) {

		if (Object.prototype.hasOwnProperty.call(window, k)) {
			if (String(k).startsWith('nu')) {
				f += k + "\n";
			}

		}

	}

	return f;

}

function nuID() {

	nuSetSuffix();

	window.nuUniqueID = 'c' + String(Date.now());

	return window.nuUniqueID + String(window.nuSuffix);

}

function nuSetSuffix(a) {

	if (arguments.length == 1) {
		window.nuSuffix = a;
	}

	if (window.nuSuffix == 9999) {
		window.nuSuffix = 0
	} else {
		window.nuSuffix++;
	}

}

function nuWhen(timestamp) {

	if (!timestamp) return;

	const secondsElapsed = Math.ceil((Date.now() / 1000) - timestamp);
	const timeUnit = secondsElapsed === 1 ? 'second' : 'seconds';
	return `${secondsElapsed} ${timeUnit} ago`;

}

function nuSpaces(s) {
	return String('&nbsp;').repeat(s);
}

function nuAddEditFieldsToHash(w) {

	const { fields, rows } = nuFORM.data()[0];
	const rowData = rows[0];

	fields.slice(2).forEach((field, index) => {
		w[field] = rowData[index + 2];
	});

	return w;

}

function nuOnFocus(e) {
	$('.nuTabSelected').attr('nu-data-active-element', document.activeElement.id);
}

function nuClick(e) {

	const target = $(e.target);
	const parentClasses = target.parents().map(function () {
		return this.className;
	}).get();

	if (!parentClasses.includes('ctxmenu')) {
		nuContextMenuClose();
	}

	if (!target.closest('.nuOptionsItem, .nuSearchCheckbox, .nuOptionsList').length) {
		$('#nuSearchList').remove();
	}

	if (!target.is('.nuIcon, .nuOptionsList, .nuOptionsListTitle')) {
		$('#nuOptionsListBox').remove();
	}

	if (target.attr('id') !== 'nuMessageDiv' && !parentClasses.includes('nuMessage') && target.attr('data-nu-option-title') !== 'Help') {
		nuMessageRemove();
		window.top.document.nuHideMessage = true;
	}


}

function nuAddSlashes(s) {
	return String(s).replace(/[\\"']/g, '\\$&').replace(/\u0000/g, '\\0');
}

function nuOpenTab(i) {
	$('#nuTab' + i).trigger("click");
}

function nuSelectedTabNumber(parent = null) {

	const nuForm = parent === null ? window.nuFORM : window.parent.nuFORM;
	const tabStart = nuForm.getProperty('tab_start');

	return tabStart.length > 0 ? tabStart[0].tabNumber : null;

}

function nuSelectedTabId(parent = null) {

	const n = nuSelectedTabNumber(parent);
	if (n === null) {
		return null;
	}
	const selectorBase = parent === null ? $(`#nuTab${n}`) : parent.$(`#nuTab${n}`);
	return selectorBase.attr('data-nu-tab-id');

}

function nuSelectedTab(parent = null) {

	const n = nuSelectedTabNumber(parent);
	if (n === null) return null;
	return parent === null ? $('#nuTab' + n) : parent.$('#nuTab' + n);

}

function nuSelectedTabTitle(parent = null) {

	const n = nuSelectedTabNumber(parent)
	if (n === null) return null;
	return parent === null ? $('#nuTab' + n).html() : parent.$('#nuTab' + n).html();

}

function nuSelectNextTab(i, includeInvisible = false, byUser = true) {

	const selectedTab = $('.nuTabSelected')[0];
	const selectedTabId = selectedTab.id.substring(5);
	let nextTabId = parseInt(selectedTabId, 10) + i;

	let element;
	while (!includeInvisible && (element = document.getElementById('nuTab' + nextTabId)) && !nuIsVisible(element.id)) {
		nextTabId += i;
	}

	if (element) {
		nuSelectTab(element, byUser);
	}

}

function nuModifyHolders(action, ...args) {
	const actions = {
		0: '#nuActionHolder',
		1: '#nuBreadcrumbHolder',
		2: '#nuTabHolder',
	};
	args.forEach(arg => {
		if (actions[arg]) $(actions[arg])[action]();
	});
}

function nuHideHolders(...args) {
	nuModifyHolders('hide', ...args);
}

function nuRemoveHolders(...args) {
	nuModifyHolders('remove', ...args);
}

function nuAttachFontAwesome(id, iconClass, size = 'medium', appendToEnd = false) {

	const sizeMap = {
		small: '12px',
		medium: '16px',
		large: '24px'
	};

	const actualSize = sizeMap[size] || size;

	let target = typeof id === 'string' ? `#${id}` : id;
	const iconHtml = `<i style="font-size:${actualSize};" class="fa-fw ${iconClass}"></i>`;
	let targetObj = $(target);
	if (targetObj.length === 0) return;

	const needsSpace = targetObj.html().trim().length > 0 ? '&nbsp;' : '';
	const content = appendToEnd ? needsSpace + iconHtml : iconHtml + needsSpace;

	appendToEnd ? targetObj.append(content) : targetObj.prepend(content);

}

function nuAttachHTML(id, html, appendToEnd = false) {

	const target = id instanceof jQuery ? id : $(`#${id}`);

	if (target.length === 0) {
		console.warn('Target element not found.');
		return;
	}

	const content = appendToEnd ? `&nbsp;${html}` : `${html}&nbsp;`;
	appendToEnd ? target.append(content) : target.prepend(content);

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

function nuAttachFile(id, name) {

	let cssProperties = {
		'background-repeat': 'no-repeat',
		'padding': '0px',
		'text-align': 'left'
	};

	if (window.nuGraphics.indexOf(name + '.png') !== -1) {
		$('#' + id).css({
			...cssProperties,
			'background-image': `url("graphics/${name}.png")`
		});
	} else if (nuImages[name] !== undefined) {
		let p = JSON.parse(g);
		let b = atob(p.file);
		$('#' + id).css({
			...cssProperties,
			'background-image': `url("${b}")`
		});
	}

}

function nuButtonIcon(id) {

	$(id).css({
		'text-align': 'left',
		'padding': '0px 0px 0px 35px',
		'background-size': '30px',
		'background-repeat': 'no-repeat'
	});

}

function nuChart(chartId, chartType, dataArray, chartTitle, xAxisTitle, yAxisTitle, seriesType, isStacked) {

	const chartElement = document.getElementById(chartId);
	if (!chartElement) return;

	const data = eval(dataArray);
	if (!data || data.length === 0) return;

	try {
		google.charts.load('current', {
			packages: ['corechart']
		});
	} catch (error) {
		return;
	}

	google.charts.setOnLoadCallback(drawChart);

	function drawChart() {
		const dataTable = google.visualization.arrayToDataTable(data);
		const chartWrapper = new google.visualization.ChartWrapper({
			chartType,
			dataTable,
			containerId: chartId,
			options: {
				title: chartTitle,
				vAxis: {
					title: yAxisTitle
				},
				hAxis: {
					title: xAxisTitle
				},
				seriesType,
				isStacked,
			},
		});

		const readyListener = google.visualization.events.addListener(chartWrapper, 'ready', () => {
			if (window.nuChartOnReady) {
				google.visualization.events.removeListener(readyListener);
				window.nuChartOnReady(chartId, chartWrapper);
			}
		});

		chartWrapper.draw();
		window[`${chartId}_wrapper`] = chartWrapper;
	}

}

function nuEncode(s) {
	return window.btoa(unescape(encodeURIComponent(s)))
}

function nuDecode(s) {
	return decodeURIComponent(escape(window.atob(s)))
}

function nuAddRow(id, setFocus = true) {

	const o = nuSubformObject(id);
	const index = nuPad3(o.rows.length - 1) + o.fields[1];
	$(`#${id}${index}`).trigger("change");

	if (setFocus) {
		const newIndex = nuPad3(o.rows.length) + o.fields[1];
		const $newInput = $(`#${id}${newIndex}`);
		$newInput.trigger("focus");
	}

}

function nuAccessLevelGroup() {
	return nuSERVERRESPONSE.access_level_group;
}

function nuAccessLevelCode() {
	return nuSERVERRESPONSE.access_level_code;
}

function nuAccessLevelId() {
	return nuSERVERRESPONSE.access_level_id;
}

function nuUserName() {
	return nuSERVERRESPONSE.user_name;
}

function nuUserFirstName() {
	return nuSERVERRESPONSE.user_first_name;
}

function nuUserLastName() {
	return nuSERVERRESPONSE.user_last_name;
}

function nuUserPosition() {
	return nuSERVERRESPONSE.user_position;
}

function nuUserDepartment() {
	return nuSERVERRESPONSE.user_department;
}

function nuUserA11Y() {
	return nuSERVERRESPONSE.user_a11y;
}

function nuUserTeam() {
	return nuSERVERRESPONSE.user_team;
}

function nuUserCode() {
	return nuSERVERRESPONSE.user_code;
}
function nuUserAdditional1() {
	return nuSERVERRESPONSE.user_additional1;
}

function nuUserAdditional2() {
	return nuSERVERRESPONSE.user_additional2;
}

function nuUserPermissions() {
	return nuSERVERRESPONSE.user_permissions.nuStringToArray();
}

function nuUserHasPermission(item, userOnly = false) {

	const hasPermission = nuUserPermissions().indexOf(item) !== -1;

	if (userOnly === false && nuGlobalAccess()) {
		return true;
	}

	return hasPermission;

}

function nuUserId() {
	return nuSERVERRESPONSE.user_id;
}

function nuUserLogin() {
	return nuSERVERRESPONSE.login_name;
}

function nuUserLanguage() {
	if (typeof nuSERVERRESPONSE !== 'undefined') {
		const l = nuSERVERRESPONSE.language;
		return l === null ? '' : l;
	} else {
		return '';
	}
}

function nuDatabase() {
	return nuSERVERRESPONSE.database;
}

function nuClosePopup() {

	parent.$('#nuModal').remove();
	parent.$('#nuDragDialog').remove();

}

function nuStopClick(e) {

	if (window.nuCLICKER != '' && ((nuIsMacintosh() ? e.metaKey : e.ctrlKey) == false)) {
		$(e.target).prop('onclick', null).off('click');
	}
}

function nuIsSaved() {

	return window.nuSAVED;
}

function nuAscendingSortColumn(a, b) {

	if (a.value < b.value) { return -1; }
	if (a.value > b.value) { return 1; }

	return 0;

}

function nuDecendingSortColumn(b, a) {

	if (a.value < b.value) { return -1; }
	if (a.value > b.value) { return 1; }

	return 0;

}

function nuAscendingSortNumberColumn(a, b) {

	if (Number(a.value) < Number(b.value)) { return -1; }
	if (Number(a.value) > Number(b.value)) { return 1; }

	return 0;

}

function nuDecendingSortNumberColumn(b, a) {

	if (Number(a.value) < Number(b.value)) { return -1; }
	if (Number(a.value) > Number(b.value)) { return 1; }

	return 0;

}

function nuEmbedObject(json, containerId, width, height) {

	if (json === '') { return; }

	width = nuDefine(width, 300);
	height = nuDefine(height, 300);

	const fileData = JSON.parse(json);
	const fileType = fileData.type;
	let dataUrl = atob(fileData.file);

	if (!dataUrl.startsWith('data:')) {
		dataUrl = `data:${fileType};base64,${fileData.file}`;
	}

	const embedElement = document.createElement("EMBED");
	embedElement.setAttribute("type", fileType);
	embedElement.setAttribute("src", dataUrl);

	if (width !== -1) embedElement.setAttribute("width", width + "px");
	if (height !== -1) embedElement.setAttribute("height", height + "px");

	$('#' + containerId).html('');
	document.getElementById(containerId).appendChild(embedElement);
}

function nuVendorLogin(appId, table) {
	const tableName = table || nuSERVERRESPONSE.table;
	window.open("core/nuvendorlogin.php?sessid=" + window.nuSESSION + "&appId=" + appId + "&table=" + tableName);
}

function nuIsMobile() {
	return navigator.userAgent.toLowerCase().split('mobile').length > 1;
}

function nuIsMacintosh() {
	return /mac/i.test(navigator.userAgentData ? navigator.userAgentData.platform : navigator.platform);
}

function nuTransformScale() {

	if ($('body').css('transform') == 'none') {
		return 1;
	}

	return Number($('body').css('transform').split('(')[1].split(',')[0]);

}

function nuStopBrowserResize() {

	if (nuFormType() == 'browse') {
		nuFORM.breadcrumbs[nuFORM.breadcrumbs.length - 1].refreshed = 1;
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

function nuAddEventListenerOnce(target, eventType, eventFunction, options, eventClass) {
	if (!target.classList.contains(eventClass)) {
		target.addEventListener(eventType, eventFunction, options);
		target.classList.add(eventClass);
	}
}

function nuDragTitleEvents() {

	if (nuFormType() != 'browse') {
		return;
	}

	let colWidths = nuFORM.getCurrent().column_widths || nuGetColumWidths();
	nuSetBrowseColumns(colWidths);

	const body = document.getElementById('nubody');
	const browseTitle = document.querySelectorAll('.nuBrowseTitle');

	nuAddEventListenerOnce(body, 'mousemove', function (event) {
		nuDragBrowseColumn(event, 'pointer');
	}, { passive: true }, 'nu-mousemove-added');

	nuAddEventListenerOnce(body, 'mouseup', function (event) {
		nuEndBrowseResize();
	}, { passive: true }, 'nu-mouseup-added');

	browseTitle.forEach(elem => {
		nuAddEventListenerOnce(elem, 'mousedown', function (event) {
			nuDownBrowseResize(event, 'pointer');
		}, { passive: true }, 'nu-mousedown-added');

		nuAddEventListenerOnce(elem, 'touchstart', function (event) {
			nuDownBrowseResize(event, 'finger_touch');
		}, { passive: true }, 'nu-touchstart-added');

		nuAddEventListenerOnce(elem, 'touchmove', function (event) {
			nuDragBrowseColumn(event, 'finger_touch');
		}, { passive: true }, 'nu-touchmove-added');

		nuAddEventListenerOnce(elem, 'touchend', function (event) {
			nuEndBrowseResize(event);
		}, { passive: true }, 'nu-touchend-added');

		nuAddEventListenerOnce(elem, 'touchcancel', function (event) {
			nuEndBrowseResize(event);
		}, { passive: true }, 'nu-touchcancel-added');
	});

}

function nuRemovePX(s) {
	return Number(String(s).split('px')[0]);
}

function nuImportUsersFromCSV(file, delimiter) {

	file = nuDefine(file, 'user_import.csv');

	nuSetProperty('NUIMPORTUSERS_file', file);
	nuSetProperty('NUIMPORTUSERS_delimiter', delimiter);

	nuRunPHP('NUIMPORTUSERS', '', 0);

}

function nuIsIframe() {
	return parent.window.nuDocumentID != window.nuDocumentID && parent.window.nuDocumentID !== undefined;
}

function nuIsPopup() {
	return window.frameElement && $(window.frameElement).closest('.nuDragDialog').length > 0;
}

function nuPreventButtonDblClick() {

	$('.nuActionButton, .nuButton, #nuLogout').not(".nuAllowDblClick").on("click", function () {

		const button = $(this);
		if (button.hasClass('nuReadonly') || button.hasClass('nuAllowDblClick')) {
			return;
		}

		const id = button.attr("id");
		button.addClass('nuPreventDblClick');
		nuDisable(id);

		setTimeout(function () {
			nuEnable(id);
			button.removeClass('nuPreventDblClick');
		}, 1300);
	});

}

function nuAddBackButton() {

	var b = $('.nuBreadcrumb').length;
	if (b > 0) {
		nuAddActionButton('BackBtn', nuTranslate('Back'), 'if (!nuFORM.edited) { nuDisable(this.id) }; nuOpenPreviousBreadcrumb();');
	}

}

function nuEnableBrowserBackButton() {

	window.history.pushState({ page: 1 }, "", "");
	window.onpopstate = function (event) {
		if (event) {
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

function nuSetPlaceholder(i, placeholder = null, translate = true) {

	const $i = $('#' + i);

	if (!placeholder) {
		placeholder = $i.attr('data-nu-format').substring(2);
	}

	if (translate) {
		placeholder = nuTranslate(placeholder);
	}

	$i.attr('placeholder', placeholder);

}

function nuSetToolTip(i, message, labelHover) {

	const setToolTip = selector => {
		$(selector)
			.on("mouseenter", function () {
				$(this).attr("title", message);
			})
			.on("mouseleave", function () {
				$(this).removeAttr("title");
			});
	};

	setToolTip("#" + i);
	if (labelHover) setToolTip("#label_" + i);

}

function nuAddDatalist(i, arr, showAllOnArrowClick = true) {

	if (!Array.isArray(arr)) {
		console.error(`Argument #2 is not an array in nuAddDatalist() for object ${i}`);
		return;
	}

	let datalist = document.getElementById(`${i}_datalist`);
	if (!datalist) {
		datalist = document.createElement('datalist');
		datalist.id = `${i}_datalist`;
		document.body.appendChild(datalist);
		if (showAllOnArrowClick) nuDatalistShowAllOnArrowClick(i);
	} else {
		datalist.innerHTML = '';
	}

	arr.forEach(data => {
		let option = document.createElement('option');
		option.value = Array.isArray(data) ? data[0] : data;
		if (Array.isArray(data) && data.length == 2) option.text = data[1];
		datalist.appendChild(option);
	});

	$(`#${i}`).attr('list', datalist.id).attr('autocomplete', 'off');

}

function nuLabelOnTop(include, exclude, offsetTop = -18, offsetLeft = 0) {

	include = include || nuSERVERRESPONSE.objects.map(obj => obj.id);
	exclude = exclude || [];

	for (let i = 0; i < include.length; i++) {

		if (jQuery.inArray(include[i], exclude) == -1) {
			$element = $('#' + include[i]);
			$('#' + 'label_' + include[i]).css({
				'top': $element.nuCSSNumber('top') + offsetTop
				, 'left': $element.nuCSSNumber('left') + offsetLeft
				, 'text-align': 'left'
			});

			$element.attr('data-nu-label-position', 'top');

		}
	}

}

jQuery.fn.nuLabelOnTop = function (offsetTop = -18, offsetLeft = 0) {

	return this.each(function () {

		$element = $(this);
		$('#' + 'label_' + this.id).css({
			'top': $element.nuCSSNumber("top") + offsetTop
			, 'left': $element.nuCSSNumber("left") + offsetLeft
			, 'text-align': 'left'
		});

		$element.attr('data-nu-label-position', 'top');

	});

};

jQuery.fn.nuCSSNumber = function (prop) {

	var v = parseInt(this.css(prop), 10);
	return isNaN(v) ? 0 : v;

};

function nuEnableDisableAllObjects(enable, excludeTypes = [], excludeIds = []) {

	const responseObjects = {
		objects: [...nuSERVERRESPONSE.objects]
	};

	for (const obj of responseObjects.objects) {
		if (!excludeTypes.includes(obj.type) && !excludeIds.includes(obj.id) && obj.type !== 'contentbox' && obj.type !== 'html') {
			nuEnable(obj.id, enable);
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

	var o = $('#' + i);

	const textarea = o[0];

	textarea.setRangeText(
		text,
		textarea.selectionStart,
		textarea.selectionEnd,
		'end'
	);

	o.trigger("change");

}

function nuObjectIdFromId(id) {

	if (id !== null && window.nuSERVERRESPONSE) {
		const obj = window.nuSERVERRESPONSE.objects.find(object => object.id === id);
		return obj ? obj.object_id : null;
	}

	return null;

}

function nuSetBrowseColumnSize(column, size) {

	let contextWindow = nuIsIframe() ? parent.document.getElementById(window.frameElement.id).contentWindow : this;
	const currentBreadcrumb = contextWindow.nuFORM.breadcrumbs[contextWindow.nuFORM.breadcrumbs.length - 1];

	if (size === undefined) {
		return currentBreadcrumb.column_widths[column];
	}

	currentBreadcrumb.column_widths[column] = size;
	contextWindow.nuSetBrowseColumns(currentBreadcrumb.column_widths);

}


function nuSelectMultiWithoutCtrl(i, active) {

	var id = i === undefined || i === null ? 'select' : '#' + i;

	if (active == false) {
		$(id + "[multiple] option").off('mousedown.selectmultinoctrl');
		return;
	}

	$(id + "[multiple] option").on('mousedown.selectmultinoctrl', function (event) {
		if (event.shiftKey) return;
		event.preventDefault();
		this.focus();
		var scroll = this.scrollTop;
		event.target.selected = !event.target.selected;
		this.scrollTop = scroll;
		$(this).parent().trigger("change");
	});

}

function nuSelectRemoveEmpty(elementId, setIndex) {

	const selector = elementId === undefined ? 'select' : `#${elementId}`;

	$(`${selector} option`).each(function () {
		const option = $(this);
		if (option.val().trim() === "" && option.text().trim() === "") {
			option.remove();
		}
	});

	if (setIndex !== undefined) {
		$(`${selector}`).each(function () {
			$(this).prop('selectedIndex', setIndex);
		});
	}

}

function nuSelectRemoveOption(id, searchValue, findByText = false) {

	const $select = typeof id === 'object' ? id : $('#' + id);
	const selector = findByText ? `option:contains("${searchValue}")` : `[value="${searchValue}"]`;
	const $option = $select.find(selector);
	$option.remove();

	return $select;

}

function nuSelectRemoveMultiple(i) {

	var id = i ? '#' + i : 'select';
	$(id + "[multiple]").prop('multiple', false).attr('size', '5');

}

function nuSelectSelectAll(id, value = true) {

	const $id = $("#" + id);
	$id.find('option:not(:empty)').prop('selected', value);
	$id.trigger("change");

}

function nuSelectSelectedInfo(id) {

	let option = {
		values: [],
		texts: []
	};

	$('#' + id + ' option:selected').each(function () {
		let $this = $(this);
		if ($this.val() !== '') {
			option.values.push($this.val());
			option.texts.push($this.text());
		}
	});

	return option;

}

function nuSelectSelectedValueArray(id) {
	return nuSelectSelectedInfo(id).values;
}

function nuSelectSelectedTextArray(id) {
	return nuSelectSelectedInfo(id).texts;
}

function nuSelectSetIndex(id, index) {
	$("#" + id).prop("selectedIndex", index).change();
}

function nuPasteText(id, callback) {

	navigator.clipboard.readText()
		.then(text => {
			nuSetValue(id, text);
			if (typeof callback === 'function') {
				callback();
			}
		});

}

function nuCopyToClipboard(obj) {

	if (typeof obj !== 'string') {
		obj = nujQueryObj(obj).val();
	}

	navigator.clipboard.writeText(obj).then(function () {
		return true;
	}, function () {
		return false;
	});

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

jQuery.fn.nuHighlight = function (pattern) {

	function nuApplyHighlight(node, pattern) {

		let skipNode = 0;
		if (node.nodeType === 3) {
			const regex = new RegExp(pattern.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
			const match = node.data.match(regex);
			if (match) {
				const matchStart = match.index;
				const spanElement = document.createElement('span');
				spanElement.className = 'nuBrowseSearch';
				const matchedText = node.splitText(matchStart);
				const cloneMatchedText = matchedText.cloneNode(true);
				spanElement.appendChild(cloneMatchedText);
				matchedText.parentNode.replaceChild(spanElement, matchedText);
				skipNode = 1;
			}
		} else if (node.nodeType === 1 && node.childNodes && !/(script|style)/i.test(node.tagName)) {
			for (let i = 0; i < node.childNodes.length; ++i) {
				i += nuApplyHighlight(node.childNodes[i], pattern);
			}
		}
		return skipNode;
	}

	return this.length && pattern && pattern.length ? this.each(function () {
		nuApplyHighlight(this, pattern);
	}) : this;

};

function nuInputMaxLength(id, maxLength, labelId) {

	const $input = $('#' + id);

	// If maxLength is not provided, return the current maxlength of the input
	if (maxLength === undefined) {
		return parseInt($input.attr('maxlength'), 10) || null; // Return null if maxlength is not set
	}

	$input.attr('maxlength', maxLength);

	if (labelId) {
		const $label = $('#' + labelId);
		$label.html(`${maxLength}/${maxLength}`);
		$input.on('input', function () {
			const textLen = maxLength - this.value.length;
			$label.html(`${textLen}/${maxLength}`);
		});
	}

}

function nuDebugMode() {
	return nuUXOptions.nuDebugMode;
}

function nuDebugOut(obj, i) {

	if (nuDebugMode() && obj.length == 0) {
		console.warn(nuTranslate('Object does not exist:'), i);
		return true;
	}

	return false;

}

function nuGetValue(id, method) {

	const obj = $('#' + id);
	if (!id || nuDebugOut(obj, id)) return null;

	if (obj.is(':checkbox')) return obj.is(":checked");
	if (obj.is('select') && method === 'text') return $("#" + id + " option:selected").text().nuReplaceNonBreakingSpaces();
	if (!method && obj.is(':button')) return obj.text();

	switch (method) {
		case 'html':
			return obj.html();
		case 'val':
			return obj.val();
		case 'text':
			return obj.text();
		default:
			return obj.val();
	}

}

function nuGetText(id) {
	return nuGetValue(id, 'text');
}

function nuGetHTML(id) {
	return nuGetValue(id, 'html');
}

function nuSetValue(i, v, method, change) {

	var obj = $('#' + i);

	if (i === undefined || nuDebugOut(obj, i)) return false;

	change = (change || change === undefined);

	if (method === undefined && obj.is(':button')) {
		obj.text(v);
	} else if (obj.is(':checkbox')) {
		if (change) obj.prop('checked', v).trigger("change");
	} else if (obj.is('select') && method === 'text') {
		$('#' + i + ' option').each(function () {
			if ($(this).text().nuReplaceNonBreakingSpaces() === v) {
				$(this).prop("selected", "selected");
				if (change) obj.trigger("change");
				return true;
			}
		});

	} else {

		switch (method) {
			case 'html':
				obj.html(v);
				break;
			case 'text':
				obj.text(v);
				break;
			default:
				obj.val(v);
				if (change) obj.trigger("change");
		}
	}

	return true;

}

function nuSetText(i, v) {
	return nuSetValue(i, v, 'text');
}

function nuCurrentDate(format) {

	const d = new Date();
	const
		yyyy = d.getFullYear(),
		mm = nuPad2(d.getMonth() + 1),
		dd = nuPad2(d.getDate());

	let dateFormat = `${yyyy}-${mm}-${dd}`;
	if (format !== undefined) {
		dateFormat = nuFORM.addFormatting(dateFormat, 'D|' + format);
	}

	return dateFormat;

}

function nuCurrentDateTime(format) {

	const d = new Date();
	const
		yyyy = d.getFullYear(),
		mm = nuPad2(d.getMonth() + 1),
		dd = nuPad2(d.getDate()),
		hh = nuPad2(d.getHours()),
		nn = nuPad2(d.getMinutes()),
		ss = nuPad2(d.getSeconds());

	let dateTimeFormat = `${yyyy}-${mm}-${dd} ${hh}:${nn}:${ss}`;

	if (format !== undefined) {
		dateTimeFormat = nuFORM.addFormatting(dateTimeFormat, 'D|' + format);
	}

	return dateTimeFormat;

}

function nuSetDateValue(id, date) {

	const obj = $('#' + id);

	if (!id || nuDebugOut(obj, id)) return false;
	date = date instanceof Date && !isNaN(date) ? date : new Date(date);

	if (!(date instanceof Date) || isNaN(date)) {
		date = new Date();
	}

	const df = date.getFullYear() + '-' + nuPad2(date.getMonth() + 1) + '-' + nuPad2(date.getDate());

	const format = obj.attr('data-nu-format');
	obj.val(nuFORM.addFormatting(df, format)).trigger("change");

	return true;

}

function nuArrayIsUnique(arr) {
	return arr.length === new Set(arr).size;
}

function nuArrayColumn(arr, n) {
	return arr.map(x => x[n]);
}

function nuOpenWiki(page) {
	window.open('https://wiki.nubuilder.cloud/index.php' + page);
}

function nuOpenFormHelp(page) {

	const help = nuFORMHELP[""];
	if (help) eval(help);

}


function nuSetLabelText(id, text, translate) {

	if (translate) {
		text = nuTranslate(text);
	}

	const label = $('#label_' + id);
	const lwidth = nuGetWordWidth(text);

	const obj = $('#' + id);
	const left = obj.nuCSSNumber('left');
	const top = obj.nuCSSNumber('top');

	label.css({
		'top': top,
		'left': left - lwidth - 17,
		'width': lwidth + 12
	}).html(text);

	if (obj.attr('data-nu-label-position') === 'top') {
		obj.nuLabelOnTop();
	}

}

function nuRunBackup() {

	if (!nuGlobalAccess()) return;

	if (confirm(nuTranslate("Perform the Backup now?"))) {
		nuMessage(`${nuTranslate('Information')}`, `${nuTranslate('Backup is running')}` + "...");
		nuRunPHPHidden("NUBACKUP");
	}

}

function nuAddCSSStyle(styleString, id = 'nucssstyle') {

	let existingStyle = document.getElementById(id);
	if (existingStyle) existingStyle.remove();

	styleString = styleString.replace(/( |<([^>]+)>)/ig, "").trim();
	if (styleString === '') return;

	const css = document.createElement('style');
	css.id = id;
	css.appendChild(document.createTextNode(styleString));
	document.head.appendChild(css);

}

function nuObjectClassList(id) {

	const element = $('#' + id);
	const classList = element.attr('class');
	return classList ? classList.trim().split(/\s+/).join(' ') : '';

}

function nuGetStorageItem(key, storageType = 'session') {

	const storage = storageType === 'session' ? window.sessionStorage : window.localStorage;
	const itemStr = storage.getItem(key);

	if (!itemStr) {
		return null;
	}

	const item = JSON.parse(itemStr);
	const now = new Date();

	if (item.expiry !== null && now.getTime() > item.expiry) {
		storage.removeItem(key);
		return null;
	}

	return item.value;

}

function nuSetStorageItem(key, value, storageType = 'session', ttl = undefined) {

	const storage = storageType === 'session' ? window.sessionStorage : window.localStorage;
	const now = new Date();
	const item = {
		value: value
		, expiry: ttl === undefined ? null : now.getTime() + ttl * 1000
		,
	};

	storage.setItem(key, JSON.stringify(item));

}

function nuCtrlCmdShiftName(keyName) {

	if (keyName === '') return '';
	const modifier = nuIsMacintosh() ? 'Cmd' : 'Ctrl';
	return modifier + '+Shift+' + keyName;

}

function nuDateIsValid(date) {

	return (
		Object.prototype.toString.call(date) === '[object Date]' && !isNaN(date)
	);

}

function nuObjectIdIsValid(id) {

	if (typeof id !== 'string' || id.length === 0) {
		return false;
	}

	const validIdPattern = /^[^\d\s][^\s]*$/u;
	return validIdPattern.test(id);

}

function nuEscapeHTML(string, extraReplacements = {}) {

	if (typeof string !== 'string') return '';

	const baseReplacements = {
		'<': '&lt;',
		'>': '&gt;',
		'&': '&amp;',
		'"': '&quot;',
		"'": '&#039;',
		'`': '&#x60;',
		'\\': '&#92;'
	};

	const replacements = {
		...baseReplacements,
		...extraReplacements
	};
	const pattern = new RegExp(`[${Object.keys(replacements).map(c => '\\' + c).join('')}]`, 'g');

	return string.replace(pattern, character => replacements[character]);
}

function nuDelay(ms) {
	return new Promise(resolve => setTimeout(resolve, ms));
}

function nuInsertAtCaret(id, string) {

	const txt = $('#' + id);
	const caretPos = txt[0].selectionStart;
	const value = txt.val();

	txt.val(value.substring(0, caretPos) + string + value.substring(caretPos));
	txt.trigger("focus");

	const endOfText = caretPos + string.length;
	txt.prop('selectionStart', endOfText);
	txt.prop('selectionEnd', endOfText);

}

function nuGetURLParameterValue(parameterName) {
	const urlParams = new URLSearchParams(window.location.search);
	return urlParams.get(parameterName);
}

function nuSetURLPermaLink() {

	const prop = nuCurrentProperties();
	if (window.top === window.self) {
		let home = nuGetURLParameterValue('h') || '';
		home = home ? '&h=' + home : '';

		const urlParams = `?f=${prop.form_id}&r=${prop.record_id}${home}`;
		const urlContainsI = window.location.search.includes('?i=');
		const historyMethod = urlContainsI ? 'replaceState' : 'pushState';

		window.history[historyMethod]('', document.title, urlParams);
	}

}

function nuShuffleArray(arr) {
	for (let i = arr.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[arr[i],
		arr[j]] = [arr[j],
		arr[i]];
	}
}

function nuCharacterArray(symbols = true, numbers = true, lowerAlpha = true, upperAlpha = true) {

	const characterSets = {
		lowerAlpha: 'abcdefghijklmnopqrstuvwxyz',
		upperAlpha: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
		numbers: '0123456789',
		symbols: '!@#%&*()-_+={}[]|:;<>.?'
	};

	let characters = [];
	if (symbols) characters.push(...characterSets.symbols);
	if (numbers) characters.push(...characterSets.numbers);
	if (lowerAlpha) characters.push(...characterSets.lowerAlpha);
	if (upperAlpha) characters.push(...characterSets.upperAlpha);

	return characters;

}

function nuRandomPassword(characterArray, size) {

	let shuffled = characterArray.slice();
	nuShuffleArray(shuffled);
	return shuffled.slice(0, size).join("");

}

function nuMonthArray(options = { month: 'long' }, locale = 'en-US') {

	const arr = [];

	for (let i = 0; i < 12; i++) {
		const date = new Date(Date.UTC(2000, i, 1));
		const item = date.toLocaleString(locale, options);
		arr.push(item);
	}

	return arr;

}

function nuEventName(eventName = null) {

	if (!eventName) {
		eventName = nuRecordId().slice(-2);
	}

	const ev = [];

	ev.BB = 'Before Browse';
	ev.BE = 'Before Edit';
	ev.BS = 'Before Save';
	ev.AS = 'After Save';
	ev.BD = 'Before Delete';
	ev.AD = 'After Delete';
	ev.AB = 'After Browse';

	return ev[eventName];

}

function nuConsoleErrorsToMessage(cancel = false) {

	if (cancel) {
		window.onerror = () => true;
		return;
	}

	if (window.onerror) return;

	window.onerror = function (msg, url, lineNo, columnNo, error) {

		const msgDevConsole = nuTranslate('Please check the browser developer console for details.');

		if (msg == "ResizeObserver loop limit exceeded")
			return; // ignore

		if (msg.toLowerCase().indexOf('script error') > -1) {
			nuMessage(nuTranslate('JavaScript Error'), msgDevConsole);
		} else {
			const message = [
				msg,
				'',
				msgDevConsole
			];

			nuMessage(nuTranslate('JavaScript Error'), message);
		}

		return false;
	};

}

function nuSetAttributes(element, attributes) {

	for (const key in attributes) {
		if (Object.prototype.hasOwnProperty.call(attributes, key)) {
			element.setAttribute(key, attributes[key]);
		}
	}

}


function nuGetWindowProperty(key, property) {

	if (!window[key]) {
		return undefined;
	}

	if (property === undefined) {
		return window[key];
	}

	if (window[key][property] !== undefined) {
		return window[key][property];
	}

	return undefined;

}

function nuDestroyWindowProperty(key, property) {

	if (!window[key]) {
		return;
	}

	if (property !== undefined) {
		if (window[key].hasOwnProperty(property)) {
			if (typeof window[key][property].destroy === 'function') {
				window[key][property].destroy();
			}
			delete window[key][property];
		}
	} else {
		for (let prop in window[key]) {
			if (window[key].hasOwnProperty(prop)) {
				if (typeof window[key][prop].destroy === 'function') {
					window[key][prop].destroy();
				}
				delete window[key][prop];
			}
		}
	}

}

function nuSetWindowProperty(key, property, value) {

	if (!window[key]) {
		window[key] = {};
	}

	if (value !== undefined) {
		window[key][property] = value;
	}

}

function nuCountDefinedArguments(...args) {
	return args.filter(arg => arg !== undefined).length;
}

