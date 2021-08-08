function nuEditPHP(type) {
	nuForm('nuphp', nuCurrentProperties().form_id + '_' + type, 'justphp', '', 2);	
}

function nuOpenCurrentFormProperties() {
	nuForm('nuform', window.nuFORM.getCurrent().form_id, '', '', 2);
}

function nuOpenCurrentObjectList() {
	nuForm('nuobject','',window.nuFORM.getCurrent().form_id,'',2);
}

function nuAddAdminButton(i, v, f, t) {
	
	if (typeof t === 'undefined') {
		var t = '';
	}
	
	var button = "<input id='nu" + i + "Button' type='button' type='button' title='" + nuTranslate(t) + "' class='nuActionButton nuAdminButton' value='" + nuTranslate(v) + "' onclick='" + f + "'>";
	$('#nuActionHolder').prepend(button);
	
}

function nuShowFormInfo() {
	
	var cp = nuCurrentProperties();
	var code = nuCurrentProperties().form_code;
	var devMode = nuDevMode();
	
	var recordId = nuFormType() == 'edit' && cp.form_type !== 'launch' ? "<b>Record ID:</b> " + cp.record_id : '';
	var browseSQL = nuFormType() == 'browse' && (! code.startsWith('nu') || devMode) ? "<b>Browse SQL:</b></br> " + cp.browse_sql : '';
	var table = nuSERVERRESPONSE.table !== '' && (! code.startsWith('nu') || devMode) ? "<b>Table:</b> " + nuSERVERRESPONSE.table : '';

	nuMessage(["<h2><u>" + cp.form_description + "</u></h2>", "<b>Form ID:</b> " + cp.form_id, "<b>Form Code:</b> " + cp.form_code, table, recordId, browseSQL]);
	
}

function nuDevMode(m) {

	if (typeof m !== 'undefined') {
		if (m === true) localStorage.setItem("nuDevMode", '1');
		if (m === false) localStorage.setItem("nuDevMode", '0');
	}

	var d = localStorage.getItem("nuDevMode");
	if ((d === '1' || d === true) && nuGlobalAccess()) {
		nuSetProperty('nuDevMode', '1', true);
		return true;
	} 
	if (m === false) {
		nuSetProperty('nuDevMode', '0', true);
	}

	return false;
}

function nuAddAdminButtons() {

	if (nuGlobalAccess()) {

		var ft = nuCurrentProperties().form_type;
		if (ft === null || typeof ft === 'undefined') return;

		var devMode = nuDevMode();

		var b = ft.indexOf("browse") >= 0;
		var e = ft.indexOf("edit") >= 0;
		var l = ft.indexOf("launch") >= 0;

		if ((nuAdminButtons["nuDebug"] || devMode) && nuMainForm()) nuAddIconToBreadcrumbHolder('nuDebugButton','nuDebug Results','nuOpenNuDebug(2)','fa fa-bug','0px');
		if (nuFormType() !== 'browse' && nuAdminButtons["nuRefresh"]) nuAddIconToBreadcrumbHolder('nuRefreshButton','Refresh','nuGetBreadcrumb()','fa fa-refresh', '7px');

		var c = 0;
		var code = nuCurrentProperties().form_code;
		if (! code.startsWith('nu') || devMode) { 		

			if (nuAdminButtons["nuProperties"]) {c++; nuAddAdminButton("AdminProperties", "Prop", 'nuOpenCurrentFormProperties();',nuTranslate('Form Properties'));}
			if (nuAdminButtons["nuObjects"]) {c++; nuAddAdminButton("AdminObjectList", "Obj", 'nuOpenCurrentObjectList();',nuTranslate('Object List'));}

			if (e || l) {c++; nuAddAdminButton("AdminBE", "BE", 'nuEditPHP("BE");','Before Edit'); }
			if (b) {c++; nuAddAdminButton("AdminBB", "BB", 'nuEditPHP("BB");','Before Browse'); }
			if (e) {c++; nuAddAdminButton("AdminBS", "BS", 'nuEditPHP("BS");','Before Save'); }
			if (e) {c++; nuAddAdminButton("AdminAS", "AS", 'nuEditPHP("AS");','After Save'); }
		}

		if (c > 0) $('#nuActionHolder').css('height', '50px');

		var frame = parent.$('#nuDragDialog iframe')
		frame.css('height', frame.cssNumber("height") + 50);

		var dragDialog = parent.$('#nuDragDialog')
		dragDialog.css('height', dragDialog.cssNumber("height") + 50);

		$("<br>").insertAfter($("#nuAdminPropertiesButton"));
	}

}

// Set Browse Column Widths in a Browse Screen

function nuRoundNearest(n, v) {

	n = n / v;
	n = Math.round(n) * v;
	return n;
}

function nuSetBrowseColumnWidths() {

	if (confirm(nuTranslate("Copy Column Widths from the Browse Table (Overwrite existing values)?"))) {

		var sf = nuSubformObject('zzzzsys_browse_sf');
		for (var i = 0; i < sf.rows.length; i++) {

			if (sf.deleted[i] == 0) {
				var c = $("div[id='nuBrowseTitle" + i + "']", window.parent.document);
				var w = Math.ceil(nuRoundNearest(parseFloat(c[0].style.width), 5)).toString();
				$('#' + 'zzzzsys_browse_sf' + nuPad3(i) + 'sbr_width').val(w.replace('px', '')).change();
			}

		}
	}

}

function nuInitSetBrowseWidthHelper() {

	if (! nuMainForm() && nuCurrentProperties().form_id == 'nuform' && window.parent.nuFormType() == 'browse') {
		if (window.location != window.parent.location) {

			var w = $('#title_zzzzsys_browse_sfsbr_width');

			if (w.length == 1) {
				w.css({
					"text-decoration": "underline",
					"text-decoration-style": "dashed",
					"color": "blue"
				});

				w.prop('onclick', null).off('click');
				w.click(function (e) {
					nuSetBrowseColumnWidths();
				});
			}
		}
	}
} 

function nuOpenPropertiesOnMiddleClick(e) {

	if (nuGlobalAccess()) {

		if (e.button === 1) {

			var id = e.target.id;

			if (id == "nubody" || id == "nuRECORD" || id == "nuhtml") {
				// Form Properties
				nuForm('nuform', window.nuFORM.getCurrent().form_id, '', '', 2);
			} else {
				var objId = nuObjectIdFromId(e.target.id);
				if (objId !== null) {
					// Object Properties
					nuForm('nuobject', objId, '', '', '2');
				} 
			}
		}
	}	

}

function nuSetSnippetFormFilter(custom, setup, sql, php) {

	nuSetProperty('IS_CUSTOM_CODE',custom);
	nuSetProperty('IS_SETUP_HEADER',setup);    
	nuSetProperty('IS_SQL',sql);
	nuSetProperty('IS_PHP',php);

}

function nuOpenNuDebug(w) {
	nuForm('nudebug','','','',w);
}

function nuAddIconToBreadcrumbHolder(i, title, oClick, iClass, paddingLeft) {

	var h = "<div id='"+i+"' title='"+title+"' style='font-size: 16px; display: inline-block; cursor : pointer; padding-right:8px; padding-left:"+paddingLeft+"' onclick='"+oClick+"'><i class='"+iClass+"'></i>&nbsp;" + '' + "</div>";

	var fragment = nuCreateAppendHTML(h);
	if (window.nuFORM.breadcrumbs.length == 1) { 
	  var options = $('#nuBreadcrumbHolder').find("[id$=nuOptions]");
	  $(fragment).insertAfter(options); 
	} else 
	{
	  $(fragment).insertBefore("#nuBreadcrumb0");  
	}

}

function nuShowObjectTooltip() {

	if (nuGlobalAccess()) {

		$("*").each(function() {
			var id = $(this).attr('id');
			if (id !== undefined) {
				$(this).attr('title', 'ID: ' + id);
			}
		});

	}
}

var contextMenuCurrentTarget = null;
var nuContextMenuDefinition = [
  { 
	text: "{Object}",
	action: function (e) { nuContextMenuCopyIdToClipboard(); }
  },
  { isDivider: true },
  {
	text: "Rename",
	action: () => nuContextMenuLabelPrompt(),

  },

  { isDivider: true },

  {
	text: "Access",
	subMenu: [
	  {
		text: nuContextMenuItemText("Editable", "fa fa-pencil-square-o"),
		action: () => nuContextMenuSetAccess(0),
	  },
	  {
		text: nuContextMenuItemText("Readonly", "fa fa-lock"),
		action: () => nuContextMenuSetAccess(1),
	  },
	  {
		text: nuContextMenuItemText("Hidden", "fa fa-eye-slash"),
		action: () => nuContextMenuSetAccess(2),
	  },
	  {
		text: nuContextMenuItemText("Hidden (User)", "fa fa-eye-slash"),
		action: () => nuContextMenuSetAccess(3),
	  },
	],
  },
  {
	text: "Align",
	subMenu: [
	  {
		text: nuContextMenuItemText("Left", "fa fa-align-left"),
		action: () => nuContextMenuSetAlign("left"),
	  },
	  {
		text: nuContextMenuItemText("Right", "fa fa-align-right"),
		action: () => nuContextMenuSetAlign("right"),
	  },
	  {
		text: nuContextMenuItemText("Center", "fa fa-align-center"),
		action: () => nuContextMenuSetAlign("center"),
	  },
	],
  },
  {
	text: "Validation",
	subMenu: [
	  {
		text: nuContextMenuItemText("None", "fa fa-globe"),
		action: () => nuContextMenuSetValidation(0),
	  },
	  {
		text: nuContextMenuItemText("No Blanks", "fa fa-battery-full"),
		action: () => nuContextMenuSetValidation(1),
	  },
	  {
		text: nuContextMenuItemText("No Duplicates", "fa fa-diamond"),
		action: () => nuContextMenuSetValidation(2),
	  },
	  {
		text: nuContextMenuItemText("No Duplicates/Blanks", "fa fa-star"),
		action: () => nuContextMenuSetValidation(3),
	  },
	],
  },

  { isDivider: true },

  {
	html: "{Top}",
  },
  {
	html: "{Left}",
  },
  {
	html: "{Width}",
  },
  {
	html: "{Height}",
  },
];

function nuContextMenuBeforeRender(menu, event) {

	contextMenuCurrentTarget = event.currentTarget;
	let id = contextMenuCurrentTarget.id.substring(6);

	for (let i = 0; i < menu.length; i++) {
		if (menu[i].hasOwnProperty('html')) {
			if (menu[i].html == '{Top}') menu[i].html = nuContextMenuItemPosition("Top", $('#' + id).cssNumber('Top'));
			if (menu[i].html == '{Left}') menu[i].html = nuContextMenuItemPosition("Left", $('#' + id).cssNumber('Left'));
			if (menu[i].html == '{Width}') menu[i].html = nuContextMenuItemPosition("Width", $('#' + id).cssNumber('Width'));
			if (menu[i].html == '{Height}') menu[i].html = nuContextMenuItemPosition("Height", $('#' + id).cssNumber('Height'));
		} else if (menu[i].hasOwnProperty('text')) {
			if (menu[i].text == '{Object}') menu[i].text = "Object: " + id;
		}
	}

	$('#' + id).focus();
	
	setTimeout(function(){ $('.ctxmenu').css('top', $('.ctxmenu').cssNumber('top') + 20 + 'px');}, 5);

	return menu;

}



function nuContextMenuItemText(label, iconClass) {
	return '<i class="' + iconClass + ' fa-fw" aria-hidden="true"></i> <span style="padding-left:8px; white-space:nowrap; display: inline;">' + label + '</span>';
}

function nuContextMenuGetWordWidth(w){

	var h = "<div id='nuTestWidth' style='font-size:13px;position:absolute;visible:hidden;width:auto'>" + w + "</div>";
	$('body').append(h);
	var l = parseInt($('#nuTestWidth').css('width'));
	$('#nuTestWidth').remove();

	return l + 5;

}	

function nuContextMenuItemPositionChanged(t, update) {

	let id = contextMenuCurrentTarget.id.substring(6);
	let prop = $(t).attr("data-property").toLowerCase();

	if (update) {
		nuContextMenuUpdateObject(id, t.value, nuContextMenuGetFormId(id), 'sob_all_' + prop);
	} else {
		$('#' + id).css(prop, t.value + 'px');
	}

}

function nuContextMenuItemPosition(label, v) {

	var lwidth = nuContextMenuGetWordWidth(label);
	var left = 70 - lwidth + 17;
	if (label == 'Top') left += 2;
	if (label == 'Left') left += 1;	

	return '<span style="width: 100px; padding-left:20px; font-family: font-family: Verdana, sans-serif;white-space:nowrap; display: inline;">' + label + '</span>' +
	' <input data-property="' + label + '" onChange="nuContextMenuItemPositionChanged(this, false)" onBlur="nuContextMenuItemPositionChanged(this, true)" style="margin: 3px 10px 3px ' + left +'px; width: 40px; height: 22px" type="number" min="0" class="input_number" value="' + v + '"> </input>';

}

function nuContextMenuSetAccess(v) {

	let id = contextMenuCurrentTarget.id.substring(6);
	if (v == 0) { 				//-- editable
		nuEnable(id);
		nuShow(id);
	} else if (v == 1) { 		//-- readonly
		nuDisable(id);
	} else if (v == 2) { 		//-- hidden
		nuHide(id);
	}

	nuContextMenuUpdateObject(id, v, nuContextMenuGetFormId(id), 'sob_all_access');
}

function nuContextMenuSetAlign(v) {

	let id = contextMenuCurrentTarget.id.substring(6);
	$('#' + id).css('text-align', v);

	nuContextMenuUpdateObject(id, v, nuContextMenuGetFormId(id), 'sob_all_align');

}

function nuContextMenuSetValidation(v) {

	let objLabel = $('#' + contextMenuCurrentTarget.id);
	let id =  label.substring(6);

	if (v == 0) { //-- none
		objLabel.removeClass('nuBlank nuDuplicate nuDuplicateOrBlank');
	} else if (v == 1) { 												//-- no blanks
		objLabel.removeClass('nuDuplicate nuDuplicateOrBlank');
		objLabel.addClass('nuBlank');
	} else if (v == 2) { 												//-- no duplicates
		objLabel.addClass('nuDuplicate');
		objLabel.removeClass('nuBlank nuDuplicateOrBlank');
	} else if (v == 3) { 												//-- no duplicates/blanks
		objLabel.addClass('nuDuplicateOrBlank');
		objLabel.removeClass('nuBlank');
	}
	
	nuContextMenuUpdateLabelLeftWidth();

	nuContextMenuUpdateObject(id, v, nuContextMenuGetFormId(id), 'sob_all_validate');

}

function nuContextMenuUpdateLabelLeftWidth(id) {
	
	var objLabel = $('#label_' + id);
	var label = objLabel.html();
	var lwidth = nuGetWordWidth(label);

	objLabel.css({
            left: $('#' + id).cssNumber('left') - lwidth - 17,
            width: Number(lwidth + 12)
        });

}
	
function nuContextMenuGetFormId(id) {
	return $('#' + id).parent().attr('data-nu-form-id');
}

function nuContextMenuLabelPrompt(value, ok) {

	if (ok) {
		let id =  label.substring(6);
		$('#label_' + id).html(value);
		nuContextMenuUpdateObject(id, value, nuContextMenuGetFormId(id), 'sob_all_label');
	}

}
function nuContextMenuLabelPrompt() {

	let label = contextMenuCurrentTarget.id;
	let id =  label.substring(6);

	nuPrompt(nuTranslate("Label")+ ':', nuTranslate("Object") + ': ' +  $('#'+label).html(),label, '', 'nuContextMenuLabelPrompt');

}

function nuContextMenuCopyIdToClipboard() {

	let id = contextMenuCurrentTarget.id.substring(6);
	nuCopyToClipboard(id);

}

function nuContextMenuUpdateObject(id, value, formId, column) {

	nuSetProperty('nuupdateobject_id', id);
	nuSetProperty('nuupdateobject_value', value);
	nuSetProperty('nuupdateobject_form_id', formId);
	nuSetProperty('nuupdateobject_column', column);
	nuRunPHPHidden('nuupdateobject', 0);

}

function nuContextMenuUpdate() {

	$('label').each((index, element) => {
		ctxmenu.update("#"+element.id, nuContextMenuDefinition, nuContextMenuBeforeRender);
	});

}