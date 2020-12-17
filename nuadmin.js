// Developer Buttons

function nuEditPHP(type) {
    nuForm('nuphp', nuCurrentProperties().form_id + '_' + type, 'justphp', '', 2);	
}

function nuOpenCurrentFormProperties() {
    nuForm('nuform', window.nuFORM.getCurrent().form_id, '', '', 2);
}

function nuOpenCurrentObjectList() {
    nuForm('nuobject','',window.nuFORM.getCurrent().form_id,'',2);
}

function nuOpenSetup() {
    nuForm('nusetup','1',window.nuFORM.getCurrent().form_id,'',2);
}

function nuOpenDatabase() {
	window.open('nupmalogin.php?sessid='+window.nuSESSION);
}

function nuAddDevButton(i, v, f, t) {
	
	if (typeof t === 'undefined') {
		var t = '';
	}
	
    var button = "<input id='nu" + i + "Button' type='button' type='button' title='" + nuTranslate(t) + "' class='nuActionButton' value='" + nuTranslate(v) + "' onclick='" + f + "'>";
    $('#nuActionHolder').prepend(button);
	
}

function nuShowFormInfo() {
	
    var cp = nuCurrentProperties();
	var code = nuCurrentProperties().form_code;
	
    var recordId = nuFormType() == 'edit' && cp.form_type !== 'launch' ? "<b>Record ID:</b> " + cp.record_id : '';
	var browseSQL = nuFormType() == 'browse' && ! code.startsWith('nu') ? "<b>Browse SQL:</b></br> " + cp.browse_sql : '';    	
	var table = nuSERVERRESPONSE.table !== '' && ! code.startsWith('nu') ? "<b>Table:</b> " + nuSERVERRESPONSE.table : '';

    nuMessage(["<h2><u>" + cp.form_description + "</u></h2>", "<b>Form ID:</b> " + cp.form_id, "<b>Form Code:</b> " + cp.form_code, table, recordId, browseSQL]);
	
}

function nuAddRefreshButton() {

    if (nuFormType() != 'browse') {
        nuAddActionButton('nuRefreshBtn', nuTranslate('Refresh'), 'nuGetBreadcrumb()');
    }

}

function nuIsDevMode() {
  
  var d = localStorage.getItem("nuDevMode");
  return d !== null && d !== 'null' && window.global_access;
  
}

function nuAddDevButtons() {

    if (global_access) {
        var ft = nuCurrentProperties().form_type;
        var b = ft.indexOf("browse") >= 0;
        var e = ft.indexOf("edit") >= 0;
        var l = ft.indexOf("launch") >= 0;

        $('#nuActionHolder').css('height', '50px');
        
        nuAddDevButton("DevBtnFormInfo", "Info", 'nuShowFormInfo();', nuTranslate('Form Info'));
        
		var devMode = nuIsDevMode();
		var code = nuCurrentProperties().form_code;
		if (! code.startsWith('nu') || devMode) { 		
		
			if (devMode) {			
				nuAddDevButton("DevBtnDB", "DB", 'nuOpenDatabase();',nuTranslate('Database'));
				nuAddDevButton("DevBtnSetup", "Setup", 'nuOpenSetup();',nuTranslate('Setup'));
			}	
					
			nuAddDevButton("DevBtnObjectList", "Obj", 'nuOpenCurrentObjectList();',nuTranslate('Object List'));
			nuAddDevButton("DevBtnProperties", "Prop", 'nuOpenCurrentFormProperties();',nuTranslate('Form Properties'));
		
			if (b || l) { nuAddDevButton("DevBtnBE", "BE", 'nuEditPHP("BE");','Before Edit'); }
			if (e) { nuAddDevButton("DevBtnBB", "BB", 'nuEditPHP("BB");','Before Browse'); }
			if (e) { nuAddDevButton("DevBtnBS", "BS", 'nuEditPHP("BS");','Before Save'); }
			if (e) { nuAddDevButton("DevBtnAS", "AS", 'nuEditPHP("AS");','After Save'); }
		}
		
		nuAddDevButton("DevBtnRefresh", nuTranslate("Refresh"), 'nuGetBreadcrumb();');

        var frame = parent.$('#nuDragDialog iframe')
        frame.css('height', frame.cssNumber("height") + 50);

        var dragDialog = parent.$('#nuDragDialog')
        dragDialog.css('height', dragDialog.cssNumber("height") + 50);

        $("input[type='button'][id^='nuDevBtn']").addClass('nuDevButton');
        $("<br>").insertAfter($("#nuDevBtnFormInfoButton"));
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
    var p = nuCurrentProperties();
    if ((p.form_id == 'nuform' && p.form_type == 'browseedit')) {
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
