
class nuResponseForm {

	getStartPositions() {

		var SR = window.nuSERVERRESPONSE;
		var scale = nuTransformScale();
		this.top = 0;
		this.objects = SR.objects;
		this.StartPositions = [];
		this.tabs = SR.tabs;
		$('body').css('transform', 'scale(1)');

		for (var i = 0; i < SR.objects.length; i++) {

			var sp = this.setStartPosition(SR.objects[i]);

			this.StartPositions.push(sp);

		}

		this.getLongestLabel(this.StartPositions);

		$('body').css('transform', 'scale(' + scale + ')');

	}

	setStartPosition(O) {

		var id = O.id;
		var lid = 'label_' + O.id;

		var o = $('#' + id);
		var l = $('#' + lid);
		var c = $('#' + id + 'code');
		var d = $('#' + id + 'description');

		if (O.input == 'file') {

			id = id + '_file';
			O.type = 'file';

		}


		var sp = {
			id: id,
			labelid: lid,
			type: O.type,
			top: Number(O.top),
			left: Number(O.left),
			height: Number(O.height),
			tab: Number(O.tab),
			lleft: l.length == 0 ? 0 : parseInt(l.css('left'), 10),
			lheight: l.length == 0 ? 0 : parseInt(l.css('height'), 10),
			owidth: parseInt(o.css('width'), 10),
			lwidth: l.length == 0 ? 0 : parseInt(l.css('width'), 10),
			cwidth: isNaN(parseInt(c.css('width'), 10)) ? 0 : parseInt(c.css('width'), 10),
			dwidth: isNaN(parseInt(d.css('width'), 10)) ? 20 : parseInt(d.css('width'), 10) + 20,
			tabtitle: window.nuSERVERRESPONSE.tabs[O.tab].title
		};

		return sp;

	}

	getLongestLabel(o) {

		this.label_length = 0;

		for (var i = 0; i < o.length; i++) {

			if (o[i].lleft > 0) {

				var w = $('#label_' + o.id).html();
				var ww = nuGetWordWidth(w, 'label');
				this.label_length = Math.max(this.label_length, ww);

			}

		}

		this.label_length = this.label_length + 5;

	}

	setSelect() {

		if ($('#nuResponseTabs').length == 1) { return; }

		var sel = document.createElement('select');
		sel.setAttribute('id', 'nuResponseTabs');
		$('#nuResponseTabs').remove();
		$('.nuTab').hide();
		$('#nuTabHolder').prepend(sel);
		$('#nuResponseTabs').attr('onchange', 'nuSelectAllTabs(this)');

		var tabs = nuSERVERRESPONSE.tabs;

		for (var n = 0; n < tabs.length; n++) {

			var t = tabs[n].title.nuReplaceAll(' ', '&#160;');

			$('#nuResponseTabs').append('<option value="nuTab' + n + '">' + t + '</option>');

		}

		$('#nuResponseTabs').val($('.nuTabSelected')[0].id);

	}

	setTabsColumn(all, wrap) {

		var D = this.StartPositions;
		var top = 10;
		var scr = 0;
		var tab;

		if ($('#nuResponseTabs').length == 1) {
			tab = String($('#nuResponseTabs').val()).substr(5);
		} else {
			tab = $('.nuTabSelected')[0].id.substr(5);
		}

		$('.nuTabTitleColumn').remove();

		this.setSelect();

		for (var i = 0; i < D.length; i++) {

			if (scr < D[i].cwidth + D[i].dwidth + 50) {
				scr = (D[i].cwidth + D[i].dwidth + 50);
			}

			if (arguments.length == 2) {
				window.nuRESPONSEWRAP = wrap;
			}

			if (tab == D[i].tab) {

				top = this.placeObject(D[i], top, window.nuRESPONSEWRAP);

				if ($('#' + D[i].id).attr('data-nu-tab') != 'x') {
					top = top + D[i].height + 10;
				}

			}

		}

		top = top + 30;

		$('#nuRECORD').append("<div id='nuTabTitleColumnBottom' style='left:0px;top:" + top + "px;position:absolute;visibility:hidden'>.<div>");

		$("[data-nu-form][data-nu-tab]:not([data-nu-lookup-id]):not('.nuIframe, .nuHtml')").show();
		$(".nuIframe").css('visibility', 'visible');
		$(".nuHtml").css('visibility', 'visible');
		$("[data-nu-tab='x']").css('visibility', 'hidden');

		$('.nuTabSelected').trigger("click");

	}

	placeObject(O, t, one_row) {

		var left = 5;
		var o = $('#' + O.id);
		var l = $('#label_' + O.id);
		var c = $('#' + O.id + 'code');
		var b = $('#' + O.id + 'button');
		var d = $('#' + O.id + 'description');
		var ll = this.label_length + 5;

		if (O.type == 'file') {
			l = $('#' + O.labelid);
		}

		if (one_row) {

			l.css({ top: t, left: left, width: this.label_length, 'text-align': 'right' });

		} else {

			ll = 0;
			l.css({ top: t, left: left, 'text-align': 'left' });

			if ($('#' + O.id).attr('data-nu-tab') != 'x') {
				t = t + O.lheight + 2;
			}

		}

		o.css({ top: t, left: left + ll });
		c.css({ top: t, left: left + ll });
		b.css({ top: t, left: left + ll + O.cwidth + 7 });
		d.css({ top: t, left: left + ll + O.cwidth + 26 });

		return t;

	}

	resetDefault() {

		var D = this.StartPositions;

		$('.nuTabTitleColumn').remove();

		this.unsetSelect();

		for (var i = 0; i < D.length; i++) {

			$('#' + D[i].id).css({ top: D[i].top, left: D[i].left })
			$('#' + D[i].labelid).css({ top: D[i].top, left: D[i].lleft, width: D[i].lwidth, 'text-align': 'right' })

			if (D[i].type == 'lookup') {

				$('#' + D[i].id + 'code').css({ top: D[i].top, left: D[i].left })
				$('#' + D[i].id + 'button').css({ top: D[i].top, left: D[i].left + D[i].cwidth + 7 });
				$('#' + D[i].id + 'description').css({ top: D[i].top, left: D[i].left + D[i].cwidth + 26 });

			}
		}

		$('.nuTabSelected').trigger("click");

	}



	unsetSelect() {

		$('#nuResponseTabs').remove()
		$('.nuTab').show();

	}

}


class nuFormObject {

	constructor() {

		this.tableSchema = [];
		this.formSchema = [];
		this.formats = this.getFormats();
		this.breadcrumbs = [];
		this.scroll = [];
		this.edited = false;
		this.deleteForm = false;

	}

	getCurrent() {

		return this.breadcrumbs[this.breadcrumbs.length - 1];

	}

	removeLast() {

		this.breadcrumbs.pop();

	}

	removeAfter(b) {

		while (this.breadcrumbs.length - 1 > b) {
			this.removeLast();
		}

	}

	scrollList(e, l) {

		if (!$(e.target).hasClass('nuScroll')) return false;

		if (this.scroll[e.target.id] === undefined) {

			this.scroll[e.target.id] = { 'list': l, 'index': 0 };

			for (var i = 0; i < l.length; i++) {

				if (e.target.value == l[i]) {
					this.scroll[e.target.id].index = i;
				}

			}

		}

		if (JSON.stringify(this.scroll[e.target.id].list) != JSON.stringify(l)) {
			this.scroll[e.target.id].index = 0;
		}

		this.scroll[e.target.id].list = l;

		var s = this.scroll[e.target.id];

		if (e.key == 'ArrowUp') {

			s.index--;

			if (s.index == -1) {
				this.scroll[e.target.id].index = s.list.length - 1;
			}

		} else if (e.key == 'ArrowDown') {

			s.index++;

			if (s.index == s.list.length) {
				this.scroll[e.target.id].index = 0;
			}

		} else {
			return false;
		}

		var theid = e.target.id;
		var theindex = this.scroll[theid].index;
		var thevalue = s.list[theindex];

		$('#' + e.target.id)
			.val(thevalue)
			.change();

		nuHasBeenEdited();

	}

	addBreadcrumb() {

		var b = {};
		b.form_id = '';
		b.redirect_form_id = '';
		b.record_id = '';
		b.title = '';
		b.call_type = '';
		b.column_widths = 0;
		b.filter = '';
		b.forms = [];
		b.iframe = 0;
		b.lookup_id = '';
		b.object_id = '1';
		b.page_number = 0;
		b.password = '';
		b.rows = -1;
		b.row_height = 25;
		b.search = '';
		b.session_id = '';
		b.nosearch_columns = [];
		b.sort = '-1';
		b.sort_direction = 'desc';
		b.subforms = 0;
		b.tab_start = [];
		b.username = '';
		b.user_id = '';
		b.refreshed = -1;

		this.breadcrumbs.push(b);

		return this.getCurrent();

	}

	setProperty(f, v) {
		this.breadcrumbs[this.breadcrumbs.length - 1][f] = v;
	}

	getProperty(f) {
		return this.breadcrumbs[this.breadcrumbs.length - 1][f];
	}

	dataType(t, f) {

		var tab = this.tableSchema[t];

		for (var i = 0; i < tab.length; i++) {

			if (tab[i][0] == f) {
				return tab[i][1];
			}
		}

	}

	tablesFromSQL(sql) {

		var t = [];
		var tables = this.getTables();
		sql = sql + ' ';
		sql = sql.replace(/[\n\r]/g, ' ');

		for (var i = 0; i < tables.length; i++) {

			if (sql.indexOf(' ' + tables[i] + ' ') != -1) {
				t.push(tables[i]);
			}

		}

		return t;

	}

	formFields(t) {

		var tab = this.formSchema[t];
		var fld = [];

		if (tab === undefined) {
			return fld;
		}

		for (var i = 0; i < tab.length; i++) {
			fld.push(tab[i]);
		}

		return fld;

	}

	tableFields(t) {

		var tab = this.tableSchema[t];
		var fld = [];

		if (tab === undefined) {
			return fld;
		}

		for (var i = 0; i < tab.length; i++) {
			fld.push(tab[i]);
		}

		return fld;

	}

	SQLFields(sql) {										//-- sfo_browse_sql

		var tab = this.tablesFromSQL(sql);
		var fld = [];

		for (var i = 0; i < tab.length; i++) {

			var f = nuFORM.tableSchema[tab[i]].names;
			fld = fld.concat(f);

		}

		return fld;

	}

	selectFields() {									//-- from SELECT builder

		var fld = [];

		const sqlFrameContents = $('#sqlframe').contents();
		sqlFrameContents.find('.nuBox').each(function () {

			var b = $(this)[0].id;
			var a = sqlFrameContents.find('#alias' + b).val();
			var t = sqlFrameContents.find('#tablename' + b).html();

			if (a == '') {
				a = t;
			}

			var f = nuFORM.tableSchema[t].names;

			for (var i = 0; i < f.length; i++) {
				fld.push(a + '.' + f[i]);
			}

		});

		return fld;

	}

	relationshipFields() {

		var t = [];
		var fld = [];

		$('.nuBox').each(function (index) {

			var b = $(this)[0].id;
			var T = $('#tablename' + b).val();
			var A = $('#alias' + b).val();

			t.push({ 'tablename': T, 'alias': A });

		});

		for (var i = 0; i < t.length; i++) {

			var f = nuFORM.tableSchema[t[i].tablename].names;

			for (var I = 0; I < f.length; I++) {
				fld.push(t[i].alias + '.' + f[I]);
			}

		}

		return fld;

	}

	getForms() {

		var forms = [];

		for (var key in nuFORM.formSchema) {

			if (Object.prototype.hasOwnProperty.call(nuFORM.formSchema, key)) {
				forms.push(key)
			}

		}

		return forms;

	}

	getTables() {

		var tables = [];

		for (var key in nuFORM.tableSchema) {

			if (Object.prototype.hasOwnProperty.call(nuFORM.tableSchema, key)) {
				tables.push(key)
			}

		}

		return tables;

	}

	getJustTables() {

		var tables = [];

		for (var key in nuFORM.tableSchema) {

			if (Object.prototype.hasOwnProperty.call(nuFORM.tableSchema, key)) {

				if (nuSERVERRESPONSE.viewSchema.indexOf(key) == -1) {
					tables.push(key);
				}
			}

		}

		return tables;

	}

	calc(field) {

		if (field.split('.').length == 2) {

			var subform_name = field.split('.')[0];
			var field_name = field.split('.')[1];

		} else {

			var o = $('#' + field);
			var f = o.attr('data-nu-format');
			var v = o.val();

			return nuFORM.removeFormatting(v, f);

		}

		var d = this.data();											//-- an array of all data as subforms (the mainform is the first element)
		var v = 0;
		var u = 0;

		for (var i = 0; i < d.length; i++) {

			var SF = d[i];
			if (SF.id == subform_name) {												//-- i've got the right subform
				// var fmt = $("[id$='" + field_name + "']input[id^='" + subform_name + "']").attr('data-nu-format')
				var f = SF.fields.indexOf(field_name);									//-- check for valid field(column)
				if (f == -1) { return 0; }
				for (var c = 0; c < SF.rows.length; c++) {

					if (SF.deleted[c] == 0) {										//-- add up only stuff not being deleted
						u = SF.rows[c][f];
						v = parseFloat(Number(v) + Number(u)).toPrecision(10);

					}

				}

				return Number(v);

			}
		}

		return 0;

	}

	data(action = 'save') {

		var d = [];
		var sf = this.subforms();

		for (var i = 0; i < sf.length; i++) {

			var o = this.subform(sf[i], action);

			o.columns = null;
			o.chartData = null;
			o.chartDataPivot = null;

			d.push(o);

		}

		return d;

	}

	subforms() {

		var s = [''];

		$("[data-nu-subform='true']").each(function (index) {
			s.push($(this)[0].id);
		});

		return s;

	}

	subformCollectRecordChildren(element, subformId, isMarkedForDeletion, deleteAll, values, edited, fieldNames, counter) {

		let $this = $('#' + element.id);

		if (element.id.endsWith('nuDelete')) {
			isMarkedForDeletion = ($this.prop("checked") || deleteAll) ? 1 : 0;
		}

		if (subformId == 'nuRECORD') { // Main form
			fieldNames[counter] = element.id;
		} else {
			fieldNames[counter] = element.id.substr(subformId.length + 3);
		}

		const dataFormat = $this.attr('data-nu-format');
		const inputType = $this.attr('type');

		let value = $this.val() === null ? '' : $this.val();

		if (inputType == 'checkbox') {
			value = $this.prop("checked") ? 1 : 0;
		}

		if (typeof value === 'object') { // Multi SELECT Object
			value = JSON.stringify(value);
		}

		values[counter] = nuFORM.removeFormatting(value, dataFormat, element.id);
		edited[counter] = $this.hasClass('nuEdited') ? 1 : 0;

		counter++;

		return {
			element,
			isMarkedForDeletion,
			values,
			edited,
			fieldNames,
			counter
		};

	}

	subform(formId, action = 'save') {

		var id = formId;
		var deleteAction = action == 'delete';
		var selector;
		var oi;
		var table;
		var fk;
		var pk;
		var nuDelete;
		var na;
		let cThis = this;

		if (formId == '') {

			id = 'nuBuilder4EditForm';
			oi = -1;
			fk = '';
			pk = $('#nuRECORD').attr('data-nu-primary-key-name');
			table = $('#nuRECORD').attr('data-nu-table');
			selector = '#nuRECORD';
			var formId = 'nuRECORD';

			if (table === undefined) {
				oi = parent.nuFORM === undefined ? undefined : parent.nuFORM.getCurrent().form_id;
			} else {
				oi = nuFORM.getCurrent().form_id;
			}

		} else {

			selector = "[id*='" + formId + "'][id*='nuRECORD']";
			table = $(selector).attr('data-nu-table');

			let $subform = $('#' + formId);
			oi = $subform.attr('data-nu-object-id');
			fk = $subform.attr('data-nu-foreign-key-name');
			pk = $subform.attr('data-nu-primary-key-name');
			nuDelete = $subform.attr('data-nu-delete');
			na = $subform.attr('data-nu-add');

		}

		var obj = { 'id': id, 'foreign_key': fk, 'primary_key': pk, 'object_id': oi, 'table': table, 'action': action };
		//-- foreign_key id id Form's record_id (which might change if cloned.)
		var fieldNames = ['ID'];
		obj.rows = [];
		obj.columns = [];
		obj.chartData = [];
		obj.chartDataPivot = [];
		obj.edited = [];
		obj.deleted = [];

		$(selector).each(function (index) {

			var $this = $(this);
			var dnpk = $(this).attr('data-nu-primary-key');
			var values = [dnpk];
			var edited = [0];
			var counter = 1;
			var isMarkedForDeletion = $('#' + this.id).prop("checked");

			const childrenInNuForm = $this.children('[data-nu-data]');
			// var childrenInHTMLForm = $this.children('form').find('[data-nu-data]');
			// var combinedChildren = childrenInNuForm.add(childrenInHTMLForm);

			childrenInNuForm.each(function () {

				let children = cThis.subformCollectRecordChildren(this, formId, isMarkedForDeletion, deleteAction, values, edited, fieldNames, counter);
				isMarkedForDeletion = children.isMarkedForDeletion;
				values = children.values;
				edited = children.edited;
				counter = children.counter;
				fieldNames = children.fieldNames;

			});

			if (!(na == 0 && dnpk == -1)) {
				obj.rows.push(values);
				obj.edited.push(edited);
				obj.deleted.push(isMarkedForDeletion);
			}

		});

		obj.fields = fieldNames;

		var titles = [];

		for (let fieldIndex = 0; fieldIndex < obj.fields.length - 1; fieldIndex++) {
			const columnData = []; // Stores data for the current column
			const fieldTitle = $('#title_' + formId + obj.fields[fieldIndex]).html();
			titles.push(fieldTitle);

			for (let rowIndex = 0; rowIndex < obj.rows.length; rowIndex++) {
				const row = obj.rows[rowIndex];
				if (row[obj.fields.length - 1] == 0) { // Assuming the last field is a status/flag
					columnData.push(row[fieldIndex]);
				}
			}

			obj.columns.push(columnData);
		}

		for (let rowIndex = 0; rowIndex < obj.rows.length; rowIndex++) {
			const originalRow = obj.rows[rowIndex];
			const modifiedRow = JSON.parse(JSON.stringify(originalRow)); // Deep copy of the row

			modifiedRow.shift(); // Remove the first element
			modifiedRow.pop();  // Remove the last element

			if (obj.deleted[rowIndex] == 0) { // Check if the row is not marked for deletion
				for (let columnIndex = 1; columnIndex < modifiedRow.length; columnIndex++) { // Skip the first element
					modifiedRow[columnIndex] = Number(modifiedRow[columnIndex]); // Convert to number
				}

				obj.chartData.push(modifiedRow);
			}
		}

		titles.shift();
		obj.chartData.splice(0, 0, titles);

		for (let i = 0; i < obj.chartData[0].length; i++) {

			let row = [];

			for (var p = 0; p < obj.chartData.length; p++) {
				row.push(obj.chartData[p][i]);
			}

			obj.chartDataPivot.push(row);

		}

		if (nuDelete == 0) {								//-- no deleting allowed

			for (let i = 0; i < obj.rows.length; i++) {
				obj.deleted[i] = 0;
			}

			if (na == 1) {
				obj.deleted[obj.deleted.length - 1] = 1;
			}

		}

		return obj;

	}

	setFormats() {

		const f = {};

		// Define month details
		const months = [
			{ num: '01', mmm: 'Jan', mmmm: 'January' },
			{ num: '02', mmm: 'Feb', mmmm: 'February' },
			{ num: '03', mmm: 'Mar', mmmm: 'March' },
			{ num: '04', mmm: 'Apr', mmmm: 'April' },
			{ num: '05', mmm: 'May', mmmm: 'May' },
			{ num: '06', mmm: 'Jun', mmmm: 'June' },
			{ num: '07', mmm: 'Jul', mmmm: 'July' },
			{ num: '08', mmm: 'Aug', mmmm: 'August' },
			{ num: '09', mmm: 'Sep', mmmm: 'September' },
			{ num: '10', mmm: 'Oct', mmmm: 'October' },
			{ num: '11', mmm: 'Nov', mmmm: 'November' },
			{ num: '12', mmm: 'Dec', mmmm: 'December' }
		];

		// Populate the object for months using numeric, abbreviated, and full names as keys
		months.forEach((month, index) => {
			const data = {
				mmm: month.mmm,
				mmmm: month.mmmm,
				mm: month.num,
				m: String(index + 1),
				jsmonth: index
			};
			f[month.num] = data;
			f[month.mmm] = data;
			f[month.mmmm] = data;
		});

		// Define day details
		const days = [
			{ ddd: 'Sun', dddd: 'Sunday', dd: '01', d: '1' },
			{ ddd: 'Mon', dddd: 'Monday', dd: '02', d: '2' },
			{ ddd: 'Tue', dddd: 'Tuesday', dd: '03', d: '3' },
			{ ddd: 'Wed', dddd: 'Wednesday', dd: '04', d: '4' },
			{ ddd: 'Thu', dddd: 'Thursday', dd: '05', d: '5' },
			{ ddd: 'Fri', dddd: 'Friday', dd: '06', d: '6' },
			{ ddd: 'Sat', dddd: 'Saturday', dd: '07', d: '7' }
		];

		// Populate the object for days using both abbreviated and full names
		days.forEach(day => {
			f[day.ddd] = day;
			f[day.dddd] = day;
		});

		return f;

	}

	getFormats() {

		let formats = window.nuFormats;
		if (formats) {
			return formats;
		}

		formats = this.setFormats();

		window.nuFormats = formats;
		return formats;

	}

	addFormatting(v, f) {

		if (v === undefined || v === '') { return ''; }
		if (!f) { return v; }

		v = String(v);
		f = String(f);

		if (f[0] === 'N') {  // number formatting: e.g. '456.789','N|€ 1,000.00'
			var CF = nuGetNumberFormat(f);  // CF[0]=sign, CF[1]=separator, CF[2]=decimal, CF[3]=places
			v = Number(v.replace(CF.decimal, '.')).toFixed(CF[3]);
			if (isNaN(Number(v))) { return ''; }
			var splitNumber = v.split('.');
			var decimals = splitNumber.length === 1 ? '' : splitNumber[1];
			return String(CF[0] + ' ' + nuAddThousandSpaces(splitNumber[0], CF[1]) + CF[2] + decimals).trim();
		}

		if (f[0] === 'D') {  // date formatting
			if (String(v.split(' ')[0]) === '0000-00-00') { return ''; }
			if (v === '') { return ''; }

			var FMT = this.getFormats();

			if (v.includes('-')) {
				var d = String(v.split(' ')[0]).split('-');
				var t = String(v.split(' ')[1]).split(':');
			} else {
				var d = [0, 0, 0];
				var t = String(v.split(' ')[0]).split(':');
			}

			if (t[0] === 'undefined') {
				t = [0, 0, 0];
			}

			var o = new Date(d[0], d[1] - 1, d[2], t[0], t[1], t[2], 0);
			if (!nuDateIsValid(o)) { return ''; }

			const splitDate = o.toString().split(' ');
			var wee = splitDate[0]; // e.g. "Tue" from "Tue Jul 07 2022 11:11:12 ..."
			var mth = splitDate[1];
			var day = splitDate[2];
			var yea = splitDate[3];

			var timeParts = splitDate[4].split(':');
			var hou = timeParts[0];
			var min = timeParts[1];
			var sec = timeParts[2];

			var s = String(f);

			if (Number(hou) > 11) {
				s = s.replaceAll('pp', 'pm');
				s = s.replaceAll('PP', 'PM');
			} else {
				s = s.replaceAll('pp', 'am');
				s = s.replaceAll('PP', 'AM');
			}

			s = s.replaceAll('yyyy', yea);
			s = s.replaceAll('yy', String(yea).substr(2));
			s = s.replaceAll('mmmm', nuTranslate(FMT[mth].mmmm));
			s = s.replaceAll('mmm', nuTranslate(FMT[mth].mmm));
			s = s.replaceAll('mm', FMT[mth].mm);

			const tokens = {
				dddd: nuTranslate(FMT[wee].dddd),
				ddd: nuTranslate(FMT[wee].ddd),
				dd: day,
				hh: hou,
				nn: min,
				ss: sec,
			};

			s = s.replace(/(dddd|ddd|dd|hh|nn|ss)/g, token => tokens[token]);

			// Remove the initial "D|" (or equivalent) prefix
			return s.slice(2);
		}

		return v;

	}


	removeFormatting(v, f, id) {

		if (v === undefined || v === '' || v === null) { return ''; }
		if (f === undefined || f === '') { return v; }

		v = String(v);
		f = String(f);

		if (f[0] === 'N') {  // number formatting
			var CF = nuGetNumberFormat(f); // CF[0]=sign, CF[1]=separator, CF[2]=decimal, CF[3]=places

			let rawValue = '';
			if (CF[2] === '') {
				rawValue = v.replace(CF[0], '')
					.replace(' ', '')
					.nuReplaceAll(CF[1], '');
			} else {
				rawValue = v.replace(CF[0], '')
					.replace(' ', '')
					.nuReplaceAll(CF[1], '')
					.replace(CF[2], '.');
			}

			if (typeof window.nuOnRawValueFormatted === 'function') {
				let modifiedValue = window.nuOnRawValueFormatted(id, rawValue, f);
				if (modifiedValue !== undefined) {
					rawValue = modifiedValue;
				}
			}

			return rawValue;

		}

		if (f[0] === 'D') {  // date formatting
			if (f.substr(0, 10) === '0000-00-00') {
				return '';
			}

			var FMT = this.getFormats();
			var hasTime = f.indexOf('hh') !== -1 || f.indexOf('nn') !== -1 || f.indexOf('ss') !== -1;  // look for time tokens

			v = String(v)
				.nuReplaceAll(':', ' ')
				.nuReplaceAll('/', ' ')
				.nuReplaceAll('.', ' ')
				.nuReplaceAll('-', ' ')
				.nuReplaceAll(',', ' ')
				.split(' ');

			f = String(f)
				.substr(2)
				.nuReplaceAll(':', ' ')
				.nuReplaceAll('/', ' ')
				.nuReplaceAll('.', ' ')
				.nuReplaceAll('-', ' ')
				.nuReplaceAll(',', ' ')
				.split(' ');

			// Use today's date/time as defaults
			var o = Date().toString().split(' ', 6);  // e.g. "Tue Sep 07 2004 11:11:12 ..."
			var time = String(o[4]).split(':');
			var d = { 'y': o[3], 'm': FMT[o[1]].jsmonth, 'd': o[2], 'h': time[0], 'n': time[1], 's': time[2] };

			for (var i = 0; i < f.length; i++) {
				var fmt = String(f[i]);

				// Check for month token: it must be translated before lookup.
				if (fmt[0] === 'm' && FMT[nuTranslateToEnglish(v[i])] !== undefined) {
					d.m = FMT[nuTranslateToEnglish(v[i])].mm;  // set month from format data
				}

				// If token is exactly "dd", use the value directly
				if (fmt === 'dd') {
					d.d = v[i];
				}

				if (fmt === 'dddd' && FMT[nuTranslateToEnglish(v[i])] !== undefined) {
					d.d = FMT[nuTranslateToEnglish(v[i])].dd;
				}

				if (fmt[0] === 'y') {
					d.y = v[i] || '';
					if (d.y.length === 2) { d.y = '20' + d.y; }
				}
				if (fmt[0] === 'h') { d.h = v[i]; }
				if (fmt[0] === 'n') { d.n = v[i]; }
				if (fmt[0] === 's') { d.s = v[i]; }
			}

			// Create the new Date object using the parsed parts.
			var oDate = new Date(d.y, Number(d.m) - 1, d.d, Number(d.h), Number(d.n), Number(d.s), 0);



			var y = String(oDate.getFullYear()) + '-';
			var m = nuPad2(oDate.getMonth() + 1) + '-';
			var a = nuPad2(oDate.getDate()) + ' ';
			var h = nuPad2(oDate.getHours()) + ':';
			var n = nuPad2(oDate.getMinutes()) + ':';
			var s = nuPad2(oDate.getSeconds());

			let rawValue = '';
			if (hasTime) {
				rawValue = y + m + a + h + n + s;
			} else {
				rawValue = String(y + m + a).trim();
			}

			if (typeof window.nuOnRawValueFormatted === 'function') {
				let modifiedValue = window.nuOnRawValueFormatted(id, rawValue, f);
				if (modifiedValue !== undefined) {
					rawValue = modifiedValue;
				}
			}

			return rawValue;

		}

	}

}

function nuNumberFormat(f) {

	var o = { type: '' };

	if (f[0] == 'N') {										//-- number

		var spl = f.substr(2).split(' ');					//-- array [sign, number]
		var n = spl[spl.length - 1];						//-- number format

		o.type = 'Number';
		o.separator = n.substr(1, 3).nuReplaceAll('0', '');
		o.decimal = n.substr(3).nuReplaceAll('0', '');
		o.sign = spl[0];
		o.places = 0;
		o.format = f;

		if (spl.length == 1) {

			o.sign = '';
			spl.unshift('');

		}

		if (o.decimal.length == 1) {
			o.places = spl[1].split(o.decimal)[1].length;
		}

	}

	return o;

}

function nuGetNumberFormat(f) {

	var a = ['', '', '', ''];
	var n = nuSERVERRESPONSE.number_formats;

	for (var i = 0; i < n.length; i++) {

		if (n[i][0] == f) {
			return JSON.parse(n[i][1])
		}

	}

	return a;

}

function nuCurrentProperties() {
	return nuFORM.getCurrent();
}

function nuSetProperty(name, value, persist) {

	nuFORM.setProperty(name, value);
	if (persist === true) { // global scope
		nuSetProperty('nu_set_hash_cookie_name', name);
		nuSetProperty('nu_set_hash_cookie_value', value);
		nuRunPHPHidden('nu_set_hash_cookie');
	}

}

function nuGetProperty(name) {
	return nuFORM.getProperty(name);
}
