window.nuDialog = new nuCreateDialog('');
window.nuFORM = new nuFormObject();
window.nuRESPONSIVE = new nuResponseForm();
window.nuOnLoad = null;
window.nuHideMessage = true;
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


String.prototype.nuEndsWith = function(substr, ignoreCase) {

	if (ignoreCase === undefined || ignoreCase === false) return this.endsWith(substr);
	return this.toLowerCase().endsWith(substr.toLowerCase());

}

String.prototype.nuStartsWith = function(substr, ignoreCase) {

	if (ignoreCase === undefined || ignoreCase === false) return this.startsWith(substr);
	return this.toLowerCase().startsWith(substr.toLowerCase());

}

String.prototype.nuReplaceAll = function (str1, str2, ignore) {
	return this.replace(new RegExp(str1.replace(/([\,\!\\\^\$\{\}\[\]\(\)\.\*\+\?\|\<\>\-\&])/g, function (c) { return "\\" + c; }), "g" + (ignore ? "i" : "")), str2);
};

String.prototype.ltrim = function () {
	return this.replace(/^\s+/, "");
}

String.prototype.rtrim = function () {
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

String.prototype.fixNbsp = function () {
	return this.replace(/\xA0/g, " ")
}

String.prototype.capitalise = function () {
	return this.charAt(0).toUpperCase() + this.slice(1);
}

String.prototype.toTitleCase = function () {
	return this.toLowerCase().replace(/^(\w)|\s(\w)/g, (grp) => grp.toUpperCase());
}

String.prototype.justNumbers = function () {
	return this.replace(/[^0-9]/g, '');
}

String.prototype.withoutNumbers = function () {
	return this.replace(/\d+/g, '');
}

String.prototype.nuInsertString = function (index, string) {

	if (index > 0) {
		return this.substring(0, index) + string + this.substr(index);
	}

	return string + this;

};

String.prototype.isEmpty = function () {
	return (this === null || this.length === 0);
}

Date.prototype.withoutTime = function () {
	var d = new Date(this);
	d.setHours(0, 0, 0, 0);
	return d;
}

Date.prototype.addDays = function (days) {
	var date = new Date(this.valueOf());
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

$.fn.nuFocusWithoutScrolling = function () {

	let t = $(this)[0];
	let x = t.scrollX, y = t.scrollY;

	this.focus();
	t.scrollTo(x, y);
	return this;

};

jQuery.fn.extend({
	nuEnable: function (enable) {
		return this.each(function () {
			nuEnable(this.id, enable);
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
	nuSelectRemoveEmpty: function (setIndex) {
		return this.each(function () {
			nuSelectRemoveEmpty(this.id, setIndex);
		});
	},
	nuGetValue: function (method) {
		return nuGetValue(this.attr('id'), method);
	},
	nuSetValue: function (v, method) {
		return this.each(function () {
			return nuSetValue(this.id, v, method);
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
	nuSetPlaceholder: function(placeholder, translate) {
		return nuSetPlaceholder(this.attr('id'), placeholder, translate);
	}

});

function nuPad4(i) {
	return nuPad(i, 4);
}

function nuPad3(i) {
	return nuPad(i, 3);
}

function nuPad2(i) {
	return nuPad(i, 2);
}

function nuPad(i, length, pad) {

	if (typeof (pad) == "undefined") { var pad = 0; }
	return i.toString().padStart(length, pad).toString();

}

function nuGlobalAccess() {
	return window.global_access;
}

function loginInputKeyup(event) {
	if (event.keyCode == 13) {
		$('input#submit').click();
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

	for (var i = 0; i < pOPENER.length; i++) {
		if (pOPENER[i].id == pid) {
			return pOPENER[i];
		}
	}

	return;
}

function nuRemoveOpenerById(o, pid) {

	for (var i = 0; i < o.length; i++) {

		if (o[i].id == pid) {
			o.splice(i, 1);
		}

	}

}

function nuGetBreadcrumb(bc) {

	if (window.nuOnBeforeGetBreadcrumb) {
		if (nuOnBeforeGetBreadcrumb(bc) == false) return;
	}

	nuCursor('progress');

	var a = arguments.length;
	var e = nuFORM.edited;

	if (a == 0) {
		var b = nuFORM.breadcrumbs.length - 1;
	} else {
		var b = bc;
	}

	window.nuTimesSaved = -1;

	if (e && nuFORM.getCurrent().form_type != 'launch') {

		if (!confirm(nuTranslate('Leave this form without saving?'))) {
			nuCursor('default');
			return;
		}

	}

	window.nuFORM.removeAfter(b);

	var c = window.nuFORM.getCurrent();

	if (c === undefined) {
		$('#nuDragDialog iframe').remove();
	} else {
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

function nuDisplayError(e) {

	if (e.errors === undefined || e.errors.length == 0) {			//-- no error messages
		return false;
	}

	let msgDiv = nuMessage(e.errors);

	if (window.nuOnMessage) {
		nuOnMessage(msgDiv, e.errors);
	}

	return e.after_event == false;								//-- errors are really just messages if from after save or after delete.

}

function nuFormatAjaxErrorMessage(jqXHR, exception) {

	if (jqXHR.status === 0) {
		return nuTranslate('Not connected. Please verify your network connection.');
	} else if (jqXHR.status == 403) {
		return ['<h3>' + nuTranslate('Access Forbidden.') + '</h3>', jqXHR.responseText];
	} else if (jqXHR.status == 404) {
		return nuTranslate('The requested page was not found.') + ' [404]';
	} else if (jqXHR.status == 500) {
		return nuTranslate('Internal Server Error.') + ' [500]';
	} else if (exception === 'parsererror') {
		return nuTranslate('Requested JSON parse failed.');
	} else if (exception === 'timeout') {
		return nuTranslate('Time out error.');
	} else if (exception === 'abort') {
		return nuTranslate('Ajax request aborted.');
	}

	return ['<h3>' + nuTranslate('Uncaught Error.') + '</h3>', jqXHR.responseText];

}

function nuLogin(nuconfigNuWelcomeBodyInnerHTML) {

	var HTML = String(nuconfigNuWelcomeBodyInnerHTML).trim();
	window.nuSESSION = '';
	window.nuFORM = new nuFormObject();

	$('body').html('');

	var h = `

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

	var H = HTML == '' ? h : HTML

	var e = document.createElement('div');

	e.setAttribute('id', 'loginbg');

	window.nuLoginU = window.nuLoginU === undefined ? '' : window.nuLoginU;
	window.nuLoginP = window.nuLoginP === undefined ? '' : window.nuLoginP;

	$('body').html(H);

	if (nuIsMobile()) {
		$('body').css('width', 300).css('height', 300)
	}

	if (window.nuLoginU == '' && window.nuLoginP == '') {
		$('#nuusername').focus();
	}

	if (window.nuLoginU != '' && window.nuLoginP == '') {

		$('#nuusername').val(window.nuLoginU);
		$('#nupassword').focus();

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

	if (e.keyCode == 13) {
		$('#submit').click();
	}

}

function nuBuildLookup(t, s, like) {

	if ($(t).prop('disabled')) { return; }

	nuCursor('progress');

	let obj = $('#' + t.id);
	var f = obj.attr('data-nu-form-id');
	var tar = obj.attr('data-nu-target');
	var p = obj.attr('data-nu-prefix');
	window.nuSubformRow = Number(p.substr(p.length - 3));

	if (arguments.length < 3) {
		like = '';
	}

	window.nuOPENER.push(new nuOpener('F', f, ''));

	var open = window.nuOPENER[window.nuOPENER.length - 1];

	if (parent.window == window) {
		let left = nuIsMobile() ? 0 : 50;
		window.nuDialog.createDialog(left, 25, 50, 50, '');
	} else {
		window.nuDialog.createDialog(0, 30, 50, 50, '');
	}

	$('#nuDragDialog')
		.css('visibility', 'hidden')
		.append('<iframe style="border-style:none;right:5px;top:35px;width:400px;height:400px;position:absolute" id="nuWindow" src="index.php?&opener=' + open.id + '&target=' + tar + '&search=' + s + '&like=' + like + '&browsefunction=lookup&iframe=1"></iframe>');

}

function nuPopup(f, r, filter) {

	nuCursor('progress');

	if (!nuGlobalAccess() && f == 'nuobject') { return; }
	if (nuSERVERRESPONSE.objects.length == 0 && r == '-2') { return; }

	$('#nuCalendar').remove();

	window.nuOPENER.push(new nuOpener('F', f, r, filter));

	var id = window.nuOPENER[window.nuOPENER.length - 1].id;

	if (parent.window == window) {
		let left = nuIsMobile() ? 0 : 50;
		window.nuDialog.createDialog(left + window.pageXOffset, 25 + window.pageYOffset, 50, 50, '');
	} else {
		window.nuDialog.createDialog(0, 30, 50, 50, '');
	}

	$('#nuDragDialog')
		.css('visibility', 'hidden')
		.append('<iframe style="border-style:none;right:5px;top:35px;width:400px;height:400px;position:absolute" id="nuWindow" src="index.php?opener=' + id + '&browsefunction=browse&iframe=1"></iframe>')
		.prepend('<div id="nuDraggingBox" style="position:absolute; bottom:0px; right:0px; width:20px; height:20px; z-index:200"></div>');

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

		var dir = event.target.parentElement.baseURI.includes('nureportdesigner') ? '' : 'core/';

		if (event.target.id == 'dialogClose') {
			$('#dialogClose').attr("src", dir + "graphics/close_red.png");
		} else {
			$('#dialogClose').attr("src", dir + "graphics/close.png");
		}

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

	this.moveDialog = function (e) {

		if (window.nuCurrentID == 'nuModal') { return; }

		var s = document.getElementById('nuDragDialog');
		if (s === null) return;

		var o = s.style;
		var l = parseInt(o.left) + this.moveX;
		var t = parseInt(o.top) + this.moveY;

		if (e.target.classList == '' && e.target.id != 'nuSelectBox') {

			o.left = l + 'px';
			o.top = t + 'px';

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

		$('body')
			.on('mousemove.popup', function (event) { nuDialog.move(event); })
			.on('click.popup', function (event) { nuDialog.click(event); })
			.on('mousedown.popup', function (event) { nuDialog.down(event); })
			.on('mouseup.popup', function (event) { window.nuCurrentID = ''; $('#nuPopupModal').remove(); })
			.on('dblclick.popup', function (event) { nuResizeWindow(event); })

		this.startX = l;
		this.startY = t;

	}

}

function nuReformat(t) {

	function nuReapplyFormat(v, f) {

		let r = nuFORM.removeFormatting(v, f);
		return nuFORM.addFormatting(r, f);

	}

	let o = $('#' + t.id);
	let f = o.attr('data-nu-format');
	let v = o.val();

	if (f == '' || v == '') {
		return v;
	}

	if (f[0] == 'D') {

		let a = nuReapplyFormat(v, f);
		if (v != a) {
			o.val('');
		}

	}

	if (f[0] == 'N') {

		let a = nuReapplyFormat(v, f);
		o.val(a);

	}

}


function nuOpenAce(lang, obj) {

	var ts = new Date().getTime();
	window.nuAce = [lang, obj];

	window.open('core/nuace.php?' + ts);

}


function nuRunIt(t, email, type) {

	var r = $('#' + t.id).attr('data-nu-row');
	var c = '000';
	var p = $('#' + r + c).html();

	if (arguments.length < 3) {										//-- set type

		var type = $('#' + r + '001').html();					//-- report - PDF,or procedure - PHP

	}

	if (arguments.length == 1) {										//-- set email

		var email = 0;

	}

	var f = $('#' + t.id).attr('data-nu-primary-key');
	var i = nuRecordId();

	if (email == 1) {

		if (type == 'php') {
			nuEmailPHP(i);
		}

		if (type == 'pdf') {
			nuEmailPDF(i);
		}

	} else {

		if (type == 'php') {
			nuGetPHP(f, p);
		}

		if (type == 'pdf') {
			nuGetReport(f, p);
		}

	}

}

function nuBindCtrlEvents() {

	var nuCtrlKeydownListener = function (e) {

		if (e.keyCode === 114 || ((nuIsMacintosh() ? e.metaKey : e.ctrlKey) && e.keyCode === 70)) { // exclude Ctrl + f
			window.nuNEW = 0;
		} else {
			if (e.keyCode == 17) { 									//-- Ctrl
				window.nuNEW = 1;
			}

		}

	}

	$(document).keydown(function (e) {

		if (e.keyCode == 27) {										//-- ESC

			if (nuIsVisible('nuMessageDiv')) {
				$('#nuMessageDiv').remove();
			} else if (nuIsVisible('nuOptionsListBox')) {
				$('#nuOptionsListBox').remove();
			} else if (parent.$('#nuModal').length == 1) {
				let ae = document.activeElement;
				$(ae).blur();
				$(ae).focus();
				if (nuFormsUnsaved() == 0) nuClosePopup();
			} else if (nuFormType() == 'browse') {
				nuSearchAction("");
			}

		}


		if ((nuIsMacintosh() ? e.metaKey : e.ctrlKey) && e.shiftKey) {

			window.nuNEW = 0;

			e.preventDefault();

			var g = nuGlobalAccess();
			var formId = window.nuFORM.getCurrent().form_id;

			if (nuFormType() == 'browse' || nuFormType() == 'edit') {

				if (e.keyCode == 70 && g) {							//-- f		Form Properties
					nuPopup("nuform", formId);
				} else if (e.keyCode == 79 && g) {					//-- O		Object List
					nuPopup("nuobject", "", formId);
				} else if (e.keyCode == 77 && g) {					//-- m		Form Info
					nuShowFormInfo();
				} else if (e.keyCode == 69 && g) {					//-- e		Database
					nuStartDatabaseAdmin();
				} else if (e.keyCode == 66 && g) {					//-- b		Backup
					nuRunBackup();
				} else if (e.keyCode == 82) {						//-- r		Refresh
					nuGetBreadcrumb();
				} else if (e.keyCode == 85 && g) {					//-- u		Setup
					nuForm('nusetup', '1', '', '', 2);
				} else if (e.keyCode == 68 && g) {					//-- d		nuDebug Results
					nuPopup("nudebug", "");
				} else if (e.keyCode == 89 && g) {					//-- y		Current Properties
					nuPrettyPrintMessage(e, nuCurrentProperties());
				}
			}

			if (nuFormType() == 'browse') {

				if (e.keyCode == 67 && g) {							//-- c		Searchable Columns
					nuGetSearchList();
				} else if (e.keyCode == 83) {						//-- s		Search
					nuSearchAction();
				} else if (e.keyCode == 65 && g) {					//-- a		Add
					nuAddAction();
				} else if (e.keyCode == 80 && g) {					//-- p		Print
					nuPrintAction();
				}

			}

			if (nuFormType() == 'edit') {

				if (e.keyCode == 65 && g) {							//-- a		Arrange
					nuPopup(formId, "-2");
				} else if (e.keyCode == 76 && g) {					//-- l		Change Password
					nuPopup("nupassword", "5b6bb7108a75efc", "");
				} else if (e.keyCode == 72 && g) {					//-- t		Add Object
					nuPopup('nuobject', '-1', '');
				} else if (e.keyCode == 71 && g) {					//-- G		Object Grid
					nuForm("nuobjectgrid", formId, "", "", 2);
				} else if (e.keyCode == 83) {						//-- s		Save
					$(":focus").blur();
					nuSaveAction();
				} else if (e.keyCode == 67) {						//-- c		Clone
					nuCloneAction();
				} else if (e.keyCode == 98) {						//-- y		Delete
					nuDeleteAction();
				} else if (e.keyCode == 39) {						//-- ->		Select next tab
					nuSelectNextTab(1);
				} else if (e.keyCode == 37) {						//-- <-		Select previous tab
					nuSelectNextTab(-1);
				}

			}

			var nosearch = window.nuFORM.getProperty('nosearch_columns');
			var searchIndex = -1;

			//Numbers
			if (e.keyCode >= 49 && e.keyCode <= 57) {
				searchIndex = Math.abs(49 - e.keyCode);
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
	});

	var nuCtrlKeyupListener = function (e) {

		window.nuNEW = 0;
	}

	$(document).on('keydown.nubindctrl', nuCtrlKeydownListener);

	$(document).on('keyup.nubindctrl', nuCtrlKeyupListener);

}

function nuUnbindDragEvents() {
	$(document).off('.nubindctrl');
}


function nuTranslate(s) {

	if (typeof s === 'undefined' || s === '' || s === null) {
		return '';
	}

	s = String(s);
	if (s.charAt(0) == '|') return s.substring(1);

	let l = nuLANGUAGE.find(elem => elem.english === s);
	return !l ? s : l.translation;

}

function nuTranslateToEnglish(s) {

	if (!s || s === '' || s === null) {
		return '';
	}

	if (s.charAt(0) == '|') return s.substring(1);

	let l = nuLANGUAGE.find(elem => elem.translation === s);
	return !l ? s : l.english;

}

function nuIsOpener() {

	if (window.opener !== null) {
		return true;
	}

	return false;
}

function nuPreview(a) {

	const r = nuRecordId();

	if (r == '-1') {

		alert(nuTranslate('Form must be saved first..'));
		return;

	}

	const arg = a === undefined ? '-3' : '';
	nuPopup(r, arg);

}

function nuPopPHP(e, nuE) {			//-- used in database

	var i = nuRecordId();

	if (i == '') {

		alert(nuTranslate('Cannot create Event Until This Form Has Been Saved..'));
		return;

	}

	nuPopup('nuphp', i + '_' + nuE, 'justphp');

}


function nuPopSQL(e, nuE) {			//-- used in database

	var i = nuRecordId();

	if (i == '') {

		alert(nuTranslate('Cannot create SQL Until This Form Has Been Saved..'));
		return;

	}

	nuPopup('nuselect', i + '_' + nuE, 'justsql');

}

function nuPopJS() {				//-- used in database

	var i = $('#sob_all_zzzzsys_form_id').val();

	if (i == '') {

		alert(nuTranslate('Cannot Create Event Until This Form Has Been Saved..'));
		return;

	}

	nuPopup('nuform', i, 'justjs');

}

function nuGetLookupFields(id) {

	var i = id.substr(0, id.length - 4);
	var o = $('#' + id);
	var a = [];

	if (o.length == 1) {

		if (o.attr('data-nu-type') == 'subform') {

			a.push(i);
			a.push(id);
			a.push(i + 'description');

		} else {
			a.push('nunosuchfield');
			a.push(id);
			a.push('nunosuchfield');
		}

	}

	return a;

}

function nuObjectComponents(i) {

	let o = [i, 'label_' + i];
	const obj = $('#' + i);
	if (obj.attr('data-nu-type') == 'lookup') o.push(i + 'code', i + 'button', i + 'description')
	if (obj.hasClass('select2-hidden-accessible')) o.push(i + '_select2');

	return o;

}

function nuEnable(i, enable) {					//-- Enable Edit Form Object

	if (enable === false) {
		nuDisable(i);
		return;
	}

	var a = [];
	if (!$.isArray(i)) {
		a.push(i);
	} else {
		a = i;
	}

	$.each(a, function (index, value) {

		i = a[index];

		var o = nuObjectComponents(i);

		for (var c = 0; c < o.length; c++) {

			if (c === 1) { continue; }		// skip label

			$('#' + o[c])
				.removeClass('nuReadonly')
				.prop('readonly', false)
				.prop('disabled', false);

			if (c == 2) { //-- button

				$('#' + o[c])
					.on("click", function () {
						nuBuildLookup(this, "");
					})

			}
		}
	});

}

function nuReadonly(i) {					//-- set Edit Form Object to readonly

	var o = nuObjectComponents(i);

	for (var c = 0; c < o.length; c++) {

		if (c === 1) { continue; }		// skip label

		$('#' + o[c])
			.addClass('nuReadonly')
			.attr('onclick', "return false")
			.prop('readonly', true);

	}

}

function nuDisable(i) {					//-- Disable Edit Form Object

	var a = [];
	if (!$.isArray(i)) {
		a.push(i);
	} else {
		a = i;
	}

	$.each(a, function (index, value) {

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

function nuShow(i, visible, openTab) {

	var arr = [];
	if (!$.isArray(i)) {
		arr.push(i);
	} else {
		arr = i;
	}

	let counter = 0;
	for (var s = 0; s < arr.length; s++) {

		if (visible === false) {
			nuHide(arr[s]);
		} else {

			var o = nuObjectComponents(arr[s]);

			for (var c = 0; c < o.length; c++) {

				var t = String($('#' + o[c]).attr('data-nu-tab'));

				if (nuIsHidden(o[c])) {
					if (t[0] == 'x') {

						$('#' + o[c])
							.attr('data-nu-tab', t.substr(1))
							.show();

					} else {

						$('#' + o[c]).show();

					}
					counter++;
				}

			}

		}

		if (openTab !== false && counter > 0) nuOpenTab($('.nuTabSelected')[0].id.substr(5));

	}

}


function nuHide(i) {

	var arr = [];
	if (!$.isArray(i)) {
		arr.push(i);
	} else {
		arr = i;
	}

	for (var s = 0; s < arr.length; s++) {
		var o = nuObjectComponents(arr[s]);

		for (var c = 0; c < o.length; c++) {

			var t = String($('#' + o[c]).attr('data-nu-tab'));

			if (t[0] == 'x') {

				$('#' + o[c])
					.hide();

			} else {

				$('#' + o[c])
					.attr('data-nu-tab', 'x' + t)
					.hide();

			}

		}
	}

}

function nuIsVisible(i) {
	return $('#' + i).is(':visible');
}

function nuIsHidden(i) {
	return !$('#' + i).is(':visible');
}

function nuIsEnabled(i) {
	let o = $('#' + i);
	return !o.is(':disabled') && !o.hasClass('nuReadonly');
}

function nuIsDisabled(i) {
	let o = $('#' + i);
	return o.is(':disabled') || o.hasClass('nuReadonly');
}

function nuAddThousandSpaces(s, c) {
	return s.replace(/\B(?=(\d{3})+(?!\d))/g, c)
}

function nuDuplicates(arr) {

	var s = arr.slice().sort();
	var d = [];

	for (var i = 0; i < arr.length - 1; i++) {

		if (s[i + 1] == s[i]) {
			d.push(s[i]);
		}

	}

	return d;

}

function nuResizeWindow(e) {

	if (e.target.id != 'dialogTitleWords') { return; }

	var d = $('#nuDragDialog');
	var D = $('.nuDragOptionsBox');
	var W = 0;
	var w = $('#nuWindow');
	var f = $('#nuDragDialog iframe')[0].contentWindow;
	var l = parseInt(d.css('left'));

	if (D.length != 0) {
		W = parseInt(D.css('width'));
	}

	if (l == 2) {

		d.css(f.nuDialogSize);
		w.css(f.nuWindowSize);

	} else {

		d.css({ top: 0, left: 2, width: window.innerWidth - 30, height: window.innerHeight });

		var dh = parseInt(d.css('height')) - 50;
		var dw = parseInt(d.css('width')) - W - 10;

		w.css({ top: 30, width: dw, height: dh });

	}

	window.frames[window.frames.length - 1].frameElement.contentWindow.nuResize();

}

function nuGetFunctionList() {

	var f = '';

	for (var k in window) {

		if (window.hasOwnProperty(k)) {

			if (String(k).substr(0, 2) === 'nu') {
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

function nuWhen(w) {

	const numax = (Date.now() / 1000) - Number(w);
	const numin = numax;
	const nusec = String(Math.ceil(numin));
	var nuhtm = nusec + (nusec == 1 ? ' second ago' : ' seconds ago');

	return nuhtm;

}

function nuSpaces(s) {
	return String('&nbsp;').repeat(s);
}

function nuAddEditFieldsToHash(w) {

	var d = nuFORM.data()[0];
	var f = d.fields;
	var r = d.rows[0];

	for (let i = 2; i < f.length; i++) {
		w[f[i]] = r[i];
	}

	return w;

}

function nuOnFocus(e) {
	$('.nuTabSelected').attr('nu-data-active-element', document.activeElement.id);
}

function nuClick(e) {

	const t = $(e.target);

	if (t.parent().parent().attr('class') !== 'ctxmenu') {
		nuContextMenuClose();
	}

	if (!t.hasClass('nuOptionsItem') && ! t.hasClass('nuSearchCheckbox') && ! t.hasClass('nuOptionsList')
	&& ! $(e.target.parentElement).hasClass('nuOptionsList')) {
		$('#nuSearchList').remove();
	}

	if (!t.hasClass('nuIcon') && ! t.hasClass('nuOptionsList') && ! t.hasClass('nuOptionsListTitle')) {
		$('#nuOptionsListBox').remove();
	}

	if (e.target.id != 'nuMessageDiv' && t.attr('data-nu-option-title') != 'Help') {

		if (window.nuHideMessage) {
			$('#nuMessageDiv').remove();
		}

		window.nuHideMessage = true;

	}

	if (t.attr('type') != 'nuDate' && !t.hasClass('nuCalendar')) {
		$('#nuCalendar').remove();
	}

}

function nuAddSlashes(s) {
	return String(s).replace(/[\\"']/g, '\\$&').replace(/\u0000/g, '\\0');
}


function nuOpenTab(i) {
	$('#nuTab' + i).click();
}

function nuSelectedTabNumber(parent = null) {

	let t = parent === null ? window.nuFORM.getProperty('tab_start') : window.parent.nuFORM.getProperty('tab_start');
	return t.length == 0 ? null : t[0].tabNumber;

}

function nuSelectedTabId(parent = null) {

	let n = nuSelectedTabNumber(parent);
	if (n === null) return null;
	return parent == null ? $('#nuTab' + n).attr('data-nu-tab-id') : parent.$('#nuTab' + n).attr('data-nu-tab-id');

}

function nuSelectedTab(parent = null) {

	let n = nuSelectedTabNumber(parent);
	if (n === null) return null;
	return parent == null ? $('#nuTab' + n) : parent.$('#nuTab' + n);

}

function nuSelectedTabTitle(parent = null) {

	let n = nuSelectedTabNumber(parent)
	if (n === null) return null;
	return parent === null ? $('#nuTab' + n).html() : parent.$('#nuTab' + n).html();

}

function nuSelectNextTab(i) {

	let selectedTab = $('.nuTabSelected')[0].id.substring(5);
	let nextTab = parseInt(selectedTab) + i;
	let e = document.getElementById('nuTab' + nextTab);
	if (e !== null) {
		nuSelectTab(e);
	}

}

function nuHideHolders(h) {

	for (var i = 0; i < arguments.length; i++) {

		if (arguments[i] == 0) { $('#nuActionHolder').hide(); }
		if (arguments[i] == 1) { $('#nuBreadcrumbHolder').hide(); }
		if (arguments[i] == 2) { $('#nuTabHolder').hide(); }

	}

}

function nuRemoveHolders(h) {

	for (var i = 0; i < arguments.length; i++) {

		if (arguments[i] == 0) { $('#nuActionHolder').remove(); }
		if (arguments[i] == 1) { $('#nuBreadcrumbHolder').remove(); }
		if (arguments[i] == 2) { $('#nuTabHolder').remove(); }

	}

}

function nuAttachFontAwesome(i, c, s, after) {

	let size = s === undefined ? 'medium' : s;

	let o = '#' + i;
	if (i instanceof jQuery) {
		o = i;
	}

	let html = '<i style="font-size:' + size + '" class="' + c + '"></i>';
	let obj = $(o);
	if (obj.length === 0) return;

	let h = obj.html().trim();
	let nbsp = h.length == 0 ? '' : '&nbsp';

	if (after === true) {
		obj.append(nbsp + html);
	} else {
		obj.prepend(html + nbsp);
	}

}

function nuAttachHTML(i, text, after) {

	let o = '#' + i;
	if (i instanceof jQuery) {
		o = i;
	}

	if (after === true) {
		$(o).append('&nbsp;' + text);
	} else {
		$(o).prepend(text + '&nbsp;');
	}

}

function nuAttachFile(j, c) {

	if (window.nuGraphics.indexOf(c + '.png') != -1) {						//-- check filenames in graphics dir.

		$(j)
			.css('background-image', 'url("graphics/' + c + '.png')
			.css('background-repeat', 'no-repeat')
			.css('padding', '0px 0px 0px 0px')
			.css('text-align', 'left')

		return;

	}

	if (nuImages[c] !== undefined) {

		var p = JSON.parse(g);
		var b = atob(p.file);

		$(j)
			.css('background-image', 'url("' + b + '")')
			.css('background-repeat', 'no-repeat')
			.css('padding', '0px 0px 0px 0px')
			.css('text-align', 'left')

		return;

	}

}

function nuButtonIcon(j) {

	$(j)
		.css('text-align', 'left')
		.css('padding', '0px 0px 0px 35px')
		.css('background-size', '30px')
		.css('background-repeat', 'no-repeat')

}

function nuChart(i, t, a, h, x, y, st, is) {

	let obj = document.getElementById(i);
	if (obj === null) return;

	a = eval(a);

	if (a === undefined || a === '' || a.length === 0) { return; }

	try {
		google.charts.load('current', { 'packages': ['corechart'] });
	} catch (error) {
		return;
	}

	google.charts.setOnLoadCallback(drawVisualization);

	if (a == '') { return; }

	function drawVisualization() {

		let data = google.visualization.arrayToDataTable(a);
		let wrapper = new google.visualization.ChartWrapper({

			chartType: t,
			dataTable: data,
			containerId: i,

			options: {
				title: h,
				vAxis: { title: y },
				hAxis: { title: x },
				seriesType: st,
				isStacked: is,
			}

		});

		var readyListener = google.visualization.events.addListener(wrapper, 'ready', function () {
			if (window.nuChartOnReady) {
				google.visualization.events.removeListener(readyListener);
				nuChartOnReady(i, wrapper);
			}
		});

		wrapper.draw();

		window[i + '_wrapper'] = wrapper;

	}

}

function nuEncode(s) {
	return window.btoa(unescape(encodeURIComponent(s)))
}

function nuDecode(s) {
	return decodeURIComponent(escape(window.atob(s)))
}

function nuAddRow(s) {

	var o = nuSubformObject(s);

	var i = s + nuPad3(o.rows.length - 1) + o.fields[1];

	$('#' + i).change();

	i = s + nuPad3(o.rows.length) + o.fields[1];

	$('#' + i).focus();

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

function nuUserPosition() {
	return nuSERVERRESPONSE.user_position;
}

function nuUserDepartment() {
	return nuSERVERRESPONSE.user_department;
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

function nuUserId() {
	return nuSERVERRESPONSE.user_id;
}

function nuUserLogin() {
	return nuSERVERRESPONSE.login_name;
}

function nuUserLanguage() {
	let l = nuSERVERRESPONSE.language;
	return l === null ? '' : l;
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
			h = parseInt($(this).css('height'));

			const objF = $('#' + f + so);
			t = objF.hasClass('input_number') || objF.hasClass('input_nuNumber') || objF.hasClass('nuCalculator');
			let v = objF.val();
			let m = objF.attr('data-nu-format')
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
		objSf.find('.nuSubformFilter').first().change();
	}

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

function nuEmbedObject(f, d, w, h) {

	if (f == '') { return; }

	if (w === undefined) { w = 300; }
	if (h === undefined) { h = 300; }

	var ob = JSON.parse(f);
	var ty = ob.type;
	var ur = atob(ob.file);
	var x = document.createElement("EMBED");

	x.setAttribute("type", ty);
	x.setAttribute("src", ur);

	if (w !== -1) x.setAttribute("width", w + "px");
	if (h !== -1) x.setAttribute("height", h + "px");

	$('#' + d).html('');
	document.getElementById(d).appendChild(x);

}

function nuStartDatabaseAdmin() {
	window.open("core/nupmalogin.php?sessid=" + window.nuSESSION);
}

function nuIsMobile() {
	return navigator.userAgent.toLowerCase().split('mobile').length > 1
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

function nuSetBrowserColumns(c) {

	const p = nuTotalWidth('nucell_0_0') - $('#nucell_0_0').width();	//-- padding
	var l = 7;

	for (var i = 0; i < c.length; i++) {

		$('[data-nu-column="' + i + '"]').css({ 'left': l, 'width': c[i] });
		$('#nuBrowseTitle' + i).css({ 'left': l, 'width': c[i] });
		l = l + c[i] + (c[i] == 0 ? 0 : p);

	}

	$('#nuBrowseFooter').css('width', l - 7);

	nuFORM.breadcrumbs[nuFORM.breadcrumbs.length - 1].column_widths = c;

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

function nuResizeBrowseColumns(force) {

	var w = nuArrayColumn(nuSERVERRESPONSE.browse_columns, 'width').map(Number);
	var t = 0;
	var p = nuTotalWidth('nucell_0_0') - $('#nucell_0_0').width();	//-- padding

	if ((nuFORM.getCurrent().refreshed != 0 && force !== true) && nuMainForm()) { return; }

	if (nuMainForm()) {

		for (var i = 0; i < w.length; i++) {
			t = t + w[i];
		}

		for (var i = 0; i < w.length; i++) {
			w[i] = parseInt((window.innerWidth - 30) * w[i] / t) - p;
		}

	} else {

		var W = nuTotalWidth('nuBrowseFooter') + 22;

		$('#nuDragDialog', window.parent.document).css('width', W + 14);
		$('#nuWindow', window.parent.document).css('width', W);

		$('body').css('width', W);

	}

	if (nuFORM.getCurrent().refreshed != 0 && force !== true) { return; }

	nuSetBrowserColumns(w);

}

function nuDragTitleEvents() {

	if (nuFormType() != 'browse') { return; }

	var last = nuFORM.breadcrumbs.length - 1;

	if (nuFORM.getCurrent().column_widths == 0) {
		nuSetBrowserColumns(nuGetColumWidths());
	} else {
		nuSetBrowserColumns(nuFORM.getCurrent().column_widths);
	}

	$('#nubody').on('mousemove.nuresizecolumn', function (event) { nuDragBrowseColumn(event, 'pointer'); });

	$('.nuBrowseTitle').on('mousedown.nuresizecolumn', function (event) { nuDownBrowseResize(event, 'pointer') });

	$('#nubody').on('mouseup.nuresizecolumn', function (event) { nuEndBrowseResize(); });

	$('.nuBrowseTitle').on('touchstart.nuresizecolumn', function (event) { nuDownBrowseResize(event, 'finger_touch'); });

	$('.nuBrowseTitle').on('touchmove.nuresizecolumn', function (event) { nuDragBrowseColumn(event, 'finger_touch'); });

	$('.nuBrowseTitle').on('touchend.nuresizecolumn', function (event) { nuEndBrowseResize(event); });

	$('.nuBrowseTitle').on('touchcancel.nuresizecolumn', function (event) { nuEndBrowseResize(event); });

}

function nuGetColumWidths() {

	var a = [];

	$("div[id^='nuBrowseTitle']").each(function (index) {
		a.push(parseInt($(this).css('width')));
	});

	return a;

}

function nuDownBrowseResize(e, p) {

	e.preventDefault();

	window.nuBROWSERESIZE.mouse_down = true;
	window.nuBROWSERESIZE.pointer = p;

	let target = e.target.id.replace('nusort_', 'nuBrowseTitle');

	window.nuBROWSERESIZE.moving_element = target;
	window.nuBROWSERESIZE.x_position = e.clientX;

	$('#' + target).css('background-color', '#badeeb');

}



function nuEndBrowseResize(e) {

	window.nuBROWSERESIZE.mouse_down = false;
	window.nuBROWSERESIZE.moving_element = '';
	$('.nuBrowseTitle').css('background-color', '');

}



function nuDragBrowseColumn(e, p) {

	if (e.target.id === '') return; 	//  not on ctxmenu

	e.preventDefault();

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
				nuSetBrowserColumns(nuFORM.breadcrumbs[nuFORM.breadcrumbs.length - 1].column_widths)

			} else {
				console.log('Offset size exceeds limit');
			}

		}

	}

}


function nuRemovePX(s) {
	return Number(String(s).split('px')[0]);
}


function nuImportCSV(t, s) {

	var csv = String(s).split('\n');
	var header = String(s[0]).split(',');
	var inserts = [];

	for (var i = 1; i < c.length; i++) {

		var r = String(c[i]);
		var c = nuCSVcolumn(r);

		if (r.substr(0, 2) == '"') {
			R.push('"' + r.join('","') + '"');
		} else {

			for (var f = 0; f < r.length; f++) {

				if (String(r[f]).substr(0, 1) == '"') {

					var Q = f;

					for (var q = f; q < r.length; q++) {

						if (String(r[q]).substr(String(r[q]).length - 1) != '"') {

							r[f] = r[f] + ',' + r[q];
							r.splice(q, 1)

						}

					}

				}

			}

			R.push('"' + r.join('","') + '"');

		}

	}

}

function nuImportUsersFromCSV(file) {

	file = nuDefine(file, 'user_import.csv');

	nuSetProperty('nuimportusers_file', file);

	nuRunPHP('NUIMPORTUSERS', '', 0);

}

function nuIsIframe() {

	return parent.window.nuDocumentID != window.nuDocumentID && parent.window.nuDocumentID !== undefined;

}

// After clicking a nuActionButton (Save, Delete, Print, Clone etc.), disable it for 1.3 secs to prevent a user from double-clicking it.

function nuPreventButtonDblClick() {

	$('.nuActionButton, .nuButton, #nuLogout').not(".nuAllowDblClick").click(function () {

		if ($(this).hasClass('nuReadonly') || $(this).hasClass('nuAllowDblClick')) return;

		var id = $(this).attr("id");

		$('#' + id).prop('disabled', true);

		setTimeout(
			function () {
				$('#' + id).prop('disabled', false);
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

function nuBrowseTitleMultiLine() {

	$('#nuActionHolder').css({ 'height': '40px' });
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

	window.onafterprint = function (e) {
		$(window).off('mousemove', window.onafterprint);

		$('#nuBreadcrumbHolder').show();
		$('#nuTabHolder').show();
		$('.nuActionButton').show();
	};

	window.print();

	setTimeout(function () {
		$(window).one('mousemove', window.onafterprint);
	}, 1);

}

function nuSetPlaceholder(i, placeholder, translate) {

	var f = $('#' + i);

	translate = nuDefine(translate, true);

	if (!placeholder) {
		placeholder = f.attr('data-nu-format').substring(2);
	} else {
		placeholder = translate ? nuTranslate(placeholder) : placeholder;
	}

	f.attr("placeholder", placeholder);

}

function nuSetToolTip(i, message, labelHover) {

	// Show tooltip on object hover
	$("#" + i).hover(function () {
		$(this).attr("title", message);
	});

	if (labelHover === true) {
		// Show tooltip on label hover
		$("#label_" + i).hover(function () {
			$(this).attr("title", message);
		});
	}
}

function nuAddDatalist(i, arr, showAllOnArrowClick) {

	if (!$.isArray(arr)) {
		console.error('Argument #2 is not an array in nuAddDatalist() for object ' + i);
		return;
	}

	var id = i + "_datalist";
	var datalist = document.getElementById(id);

	if (!datalist) {
		var datalist = document.createElement('datalist');
		datalist.id = id;
		document.body.appendChild(datalist);
		if (showAllOnArrowClick !== false) nuDatalistShowAllOnArrowClick(i);
	} else {
		datalist.innerHTML = '';
	}

	arr.forEach(function (data) {

		var option = document.createElement('option');
		option.value = $.isArray(data) ? data[0] : data;
		if (data.length == 2) option.text = $.isArray(data) ? data[1] : data;
		datalist.appendChild(option);
	});

	$('#' + i).attr('list', datalist.id).attr('autocomplete', 'off');

}

function nuLabelOnTop(include, exclude, offsetTop = -18, offsetLeft = 0) {

	if (include === undefined) {
		include = [];
		for (var i = 0; i < nuSERVERRESPONSE.objects.length; i++) {
			include.push(nuSERVERRESPONSE.objects[i].id);
		}
	}

	if (exclude === undefined) var exclude = [];

	for (var i = 0; i < include.length; i++) {

		if (jQuery.inArray(include[i], exclude) == -1) {

			$('#' + 'label_' + include[i]).css({
				'top': $('#' + include[i]).cssNumber('top') + offsetTop
				, 'left': $('#' + include[i]).cssNumber('left') + offsetLeft
				, 'text-align': 'left'
			});

			$('#' + include[i]).attr('data-nu-label-position', 'top');

		}
	}

}

jQuery.fn.nuLabelOnTop = function (offsetTop = -18, offsetLeft = 0) {

	return this.each(function () {

		$('#' + 'label_' + this.id).css({
			'top': $(this).cssNumber("top") + offsetTop
			, 'left': $(this).cssNumber("left") + offsetLeft
			, 'text-align': 'left'
		});

		$(this).attr('data-nu-label-position', 'top');

	});

};

jQuery.fn.cssNumber = function (prop) {

	var v = parseInt(this.css(prop), 10);
	return isNaN(v) ? 0 : v;

};

function nuEnableDisableAllObjects(v, excludeTypes, excludeIds) {

	excludeTypes = nuDefine(excludeTypes, []);
	excludeIds = nuDefine(excludeIds, []);

	var r = JSON.parse(JSON.stringify(nuSERVERRESPONSE));
	for (var i = 0; i < r.objects.length; i++) {
		let obj = r.objects[i];

		if ($.inArray(obj.type, excludeTypes) == -1 && $.inArray(obj.id, excludeIds) == -1) {
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

	var o = $('#' + i);

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
		$(this).parent().change();
	});

}

function nuSelectRemoveEmpty(i, setIndex) {

	let id = i === undefined ? 'select' : '#' + i;

	$(id + ' option').filter(function () {
		return ($(this).val().trim() === "" && $(this).text().trim() === "");
	}).remove();

	if (setIndex !== undefined) $('#' + i).prop('selectedIndex', setIndex);

}

function nuSelectRemoveOption(i, value) {

	var o;
	if (typeof i !== 'object') {
		o = $('#' + i) || i;
	} else {
		o = i;
	}

	o.find('[value="' + value + '"]').remove();
	return o;

}

function nuSelectRemoveMultiple(i) {

	var id = i === undefined || i === null ? 'select' : '#' + i;
	$(id + "[multiple]").removeAttr('multiple').attr('size', '5');

}

function nuSelectSelectAll(id, value) {

	if (value === undefined) var value = true;

	$("#" + id).find('option:not(:empty)').prop('selected', value);
	$("#" + id).change();

}

function nuSelectSelectedValueArray(id) {

	var a = [];
	$('#' + id + ' option:selected').each(function (index) {
		if ($(this).val() !== '') {
			a.push($(this).val())
		}
	});

	return a;

}

function nuSelectSelectedTextArray(id) {

	var a = [];
	$('#' + id + ' option:selected').each(function (index) {
		if ($(this).val() !== '') {
			a.push($(this).text())
		}
	});

	return a;

}

function nuPasteText(i) {

	navigator.clipboard.readText()
		.then(text => {
			$('#' + i).val(text);
		});

}

function nuCopyText(i) {
	return nuCopyToClipboard($('#' + i).val());
}

function nuCopyToClipboard(s) {

	navigator.clipboard.writeText(s).then(function () {
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

jQuery.fn.nuHighlight = function (pat) {
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
	return this.length && pat && pat.length ? this.each(function () {
		innerHighlight(this, pat.toUpperCase());
	}) : this;
};


function nuInputMaxLength(id, maxLength, label) {

	$('#' + id).attr('maxlength', maxLength);

	if (label) {
		$('#' + label).html(maxLength + '/' + maxLength);
		$('#' + id).keyup(function () {
			var textlen = maxLength - $(this).val().length;
			$('#' + label).html(textlen + '/' + maxLength);
		});
	}

}

function nuDebugMode() {
	return nuUXOptions["nuDebugMode"];
}

function nuDebugOut(obj, i) {

	if (nuDebugMode() && obj.length == 0) {
		console.warn(nuTranslate('Object does not exist:'), i);
		return true;
	}

	return false;

}

function nuGetValue(i, method) {

	var obj = $('#' + i);
	if (i === undefined || nuDebugOut(obj, i)) return null;

	if (obj.is(':checkbox')) return obj.is(":checked");
	if (obj.is('select') && method === 'text') return $("#" + i + " option:selected").text().fixNbsp();
	if (method === undefined && obj.is(':button')) return obj.text();

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

function nuGetText(i, method) {
	return nuGetValue(i, 'text');
}

function nuSetValue(i, v, method) {

	var obj = $('#' + i);

	if (i === undefined || nuDebugOut(obj, i)) return false;

	if (method === undefined && obj.is(':button')) {
		obj.text(v);
	} else if (obj.is(':checkbox')) {
		obj.prop('checked', v).change();
	} else if (obj.is('select') && method === 'text') {
		$('#' + i + ' option').each(function () {
			if ($(this).text().fixNbsp() === v) {
				$(this).prop("selected", "selected");
				obj.change();
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
				obj.val(v).change();
		}
	}

	return true;

}

function nuSetText(i, v) {
	return nuSetValue(i, v, 'text');
}

function nuCurrentDate(format) {

	let d = new Date();
	let
		yyyy = d.getFullYear(),
		mm = nuPad2(d.getMonth() + 1),
		dd = nuPad2(d.getDate());

	let df = yyyy + '-' + mm + '-' + dd;
	if (format !== undefined) {
		df = nuFORM.addFormatting(df, 'D|' + format);
	}

	return df;

};

function nuCurrentDateTime(format) {

	let d = new Date();
	let
		yyyy = d.getFullYear(),
		mm = nuPad2(d.getMonth() + 1),
		dd = nuPad2(d.getDate()),
		hh = nuPad2(d.getHours()),
		nn = nuPad2(d.getMinutes()),
		ss = nuPad2(d.getSeconds());

	let df = yyyy + '-' + mm + '-' + dd + ' ' + hh + ':' + nn + ':' + ss;
	if (format !== undefined) {
		df = nuFORM.addFormatting(df, 'D|' + format);
	}

	return df;

};

function nuSetDateValue(i, d) {

	var obj = $('#' + i);

	if (i === undefined || nuDebugOut(obj, i)) return false;

	if (d === undefined) {
		var d = new Date();
	}

	var df = d.getFullYear() + '-' + nuPad2(d.getMonth() + 1) + '-' + nuPad2(d.getDate());

	var format = obj.attr('data-nu-format');
	obj.val(nuFORM.addFormatting(df, format)).change();

	return true;

}

function nuArrayIsUnique(arr) {
	return arr.length === new Set(arr).size;
}

function nuArrayColumn(arr, n) {
	return arr.map(x => x[n]);
}

function nuSetSaveButtonPosition(t, l, h, w, fs) {

	var sb = $('#nuSaveButton');
	sb.appendTo('div#nuRECORD');

	if (!w || w === 0) w = sb.cssNumber("width");
	if (!h || h === 0) h = sb.cssNumber("height");

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

	if (fs && fs !== 0) sb[0].style.fontSize = fs + "px";
	if (nuSelectedTabNumber() !== '0') sb.css('display', 'none');

	return sb;

}

function nuAttachSaveButtonTo(i, dx, dy, h, w, fs) {

	var sb = $('#nuSaveButton');
	var dest = $('#' + i);

	if (dest === undefined || nuDebugOut(dest, i)) return false;

	dest.after(sb);

	if (!dx || dx == 0) dx = 0;
	if (!dy || dy == 0) dy = 0;
	if (!w || w == 0) w = sb.cssNumber("width");
	if (!h || h == 0) h = sb.cssNumber("height");

	sb.css({
		"top": dest.cssNumber("top") + dest.cssNumber("height") + 15 + dy,
		"left": dest.cssNumber("left") + dx,
		"width": w,
		"position": "absolute",
		"height": h,
		"margin": "unset"
	});

	sb.attr('data-nu-tab', '0');
	sb.attr('data-nu-form', '');

	if (fs && fs !== 0) sb[0].style.fontSize = fs + "px";
	if (nuSelectedTabNumber() !== '0') sb.css('display', 'none');

	return sb;

}

function nuBase64decode(str) {

	const text = atob(str);
	const length = text.length;
	const bytes = new Uint8Array(length);

	for (let i = 0; i < length; i++) {
		bytes[i] = text.charCodeAt(i);
	}

	const decoder = new TextDecoder(); // default is utf-8
	return decoder.decode(bytes);

}

function nuBase64encode(str) {

	let encode = encodeURIComponent(str).replace(/%([a-f0-9]{2})/gi, (m, $1) => String.fromCharCode(parseInt($1, 16)))
	return btoa(encode);

}

function nuOpenWiki(page) {
	window.open('https://wiki.nubuilder.cloud/index.php' + page);
}

function nuSetLabelText(i, str, translate) {

	if (translate === true) { str = nuTranslate(str); }

	let label = $('#label_' + i);
	let lwidth = nuGetWordWidth(str);

	let obj = $('#' + i);
	let left = obj.cssNumber('left');
	let top = obj.cssNumber('top');

	label.css({
		'top': Number(top),
		'left': Number(left) - lwidth - 17,
		'width': Number(lwidth + 12)
	}).html(str);

	if (obj.attr('data-nu-label-position') == 'top') {
		obj.nuLabelOnTop();
	}

}

function nuRunBackup() {

	if (! nuGlobalAccess()) return;

	const c = confirm(nuTranslate("Perform the Backup now?"));
	if (c === true) {
		nuMessage(nuTranslate("Backup is running") + "...");
		nuRunPHPHidden("NUBACKUP", 0);
	}

}

function nuAddCSSStyle(styleString, id) {

	let i = id === undefined ? 'nucssstyle' : id;
	$('#' + i).remove();

	let regex = /( |<([^>]+)>)/ig;
	styleString = styleString.replace(regex, "");

	if (styleString.trim() === '') return;

	let css = document.createElement('style');
	css.id = i;
	css.appendChild(document.createTextNode(styleString));
	document.getElementsByTagName("head")[0].appendChild(css);

}

function nuObjectClassList(i) {

	let c = $('#' + i).attr('class');
	return c === undefined ? '' : c.split(/\s+/).join(' ');

}

function nuGetStorageItem(key, storage) {

	var storage = storage === undefined || storage === 'session' ? window.sessionStorage : window.localStorage;

	const itemStr = storage.getItem(key)

	if (!itemStr) {
		return null
	}

	const item = JSON.parse(itemStr)
	const now = new Date()

	if (now.getTime() > item.expiry && item.expiry !== null) {
		storage.removeItem(key)
		return null
	}
	return item.value;

}

function nuSetStorageItem(key, value, storage, ttl) {

	var storage = storage === undefined || storage === 'session' ? window.sessionStorage : window.localStorage;

	const now = new Date()
	const item = {
		value: value,
		expiry: ttl === undefined ? null : now.getTime() + ttl * 1000,
	}
	storage.setItem(key, JSON.stringify(item));

}

function nuCtrlCmdShiftName(keyName) {

	if (keyName === '') return '';
	const modifier = nuIsMacintosh() ? 'Cmd' : 'Ctrl';
	return modifier + '+Shift+' + keyName;

}
