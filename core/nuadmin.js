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
	if ((d === '1' || d === true) && window.global_access) {
		nuSetProperty('nuDevMode', '1', true);
		return true;
	} 
	if (m === false) {
		nuSetProperty('nuDevMode', '0', true);
	}

	return false;
}

function nuAddAdminButtons() {

	if (global_access) {

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

	if (window.global_access) {

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

	if (window.global_access) {

		$("*").each(function() {
			var id = $(this).attr('id');
			if (id !== undefined) {
				$(this).attr('title', 'ID: ' + id);
			}
		});

	}
}
