
window.nuCalColor = '#F0F0F0';
window.nuCalTop = - 30;

function nuAppendChild(p, t, i) {

	var o = document.createElement(t);

	o.setAttribute('id', i);

	$(p)
		.append(o)
		.css('zIndex', 3000);

	return document.getElementById(i);

}

function nuCalendarWeekStartNumber() {

	let ws = nuUXOptions['nuCalendarStartOfWeek'];
	if (ws !== undefined) {
		ws = String(ws);
		ws = ws.length == 1 ? ws : ws.replace('Sunday', 0).replace('Monday', 1);
	}

	return ws;

}

function nuPopupCalendarVanillaJs(pThis, d) {

	let id = pThis.id;
	let datepicker = window[id + '_datepicker'];

	if (datepicker) {
		datepicker.destroy();
	}

	let optionWeekStart = {};
	let weekStartNumber = nuCalendarWeekStartNumber();

	if (weekStartNumber !== undefined) {
		optionWeekStart = {
			weekStart: weekStartNumber
		}
	}

	let calendarOptionsDefault = {
		autohide: true,
		calendarWeeks: true,
		defaultViewDate: d,
		format: $(pThis).attr('data-nu-format').replace('D|', ''),
		optionWeekStart
	}

	let objCalendarOptionsDefault = { options: calendarOptionsDefault };
	let calendarUserOptions = [];

	if (typeof window['nuOnSetCalendarOptions'] === 'function') {
		calendarUserOptions = window.nuOnSetCalendarOptions(id, objCalendarOptionsDefault);
	}

	let calendarOptions = Object.assign(calendarUserOptions, objCalendarOptionsDefault.options);

	datepicker = new Datepicker(pThis, calendarOptions);
	window[id + '_datepicker'] = datepicker;

	datepicker.setOptions({ defaultViewDate: d });
	datepicker.show();

}


function nuPopupCalendar(pThis, d) {

	if (pThis === null) { return; }

	$('#nuCalendar').remove();
	$('#nuLookupList').remove();

	if (nuUXOptions['nuCalendarVanillaJS']) {
		nuPopupCalendarVanillaJs(pThis, d);
		return;
	}

	window.nuCalendarCaller = pThis.id;

	var o = $('#' + window.nuCalendarCaller);
	var f = o.attr('data-nu-format');

	if (d === undefined) {
		var v = o.val();
	} else {
		var v = d;
	}

	var u = nuFORM.removeFormatting(v, f);

	var i = pThis.id; 					//-- Object ID;
	var tar = $('#' + i);
	var h = parseInt(tar.css('height'), 10);
	var off = $('#' + i).offset();
	var top = off.top;
	var left = off.left;

	var bottomPos = $(window).scrollTop() + $(window).height();
	if ((off.top + h + 223) > bottomPos) {
		top = off.top - h - 233;
	}


	window.nuOnCalendar = 0;							//-- cursor not in calendar

	nuAppendChild('body', 'div', 'nuCalendar');
	var c = $('#nuCalendar');

	c
		.attr('onmouseover', 'window.nuOnCalendar = 1')
		.attr('onmouseout', 'window.nuOnCalendar = 0')
		.css({ 'top': (top + h + 3), left: left })
		.addClass('nuCalendar nuCalendarColor')
		.html('<img id="dialogCalClose" src="core/graphics/close.png" style="position: absolute; top: 0px; right: 0px;" onclick="$(\'#nuCalendar\').remove()">');

	nuAppendChild('#nuTabAreaHolder', 'div', 'nuCalCloser');
	c = $('#nuCalCloser');

	c
		.html('&#x2716;')
		.attr('onclick', "document.getElementById('nuCalendar').remove();")
		.css({
			'background-color': 'lightgrey',
			'position': 'absolute',
			'top': (window.nuCalTop + 32),
			'left': 2,
			'width': 20,
			'height': 20,
			'text-align': 'center',
			'font-size': 14,
			'font-style': 'bold',
			'color': '#000000',
			'cursor': 'pointer',
			'border-style': 'solid',
			'border-width': 1,
			'border-color': 'grey',
			'border-radius': 5
		});


	nuAppendChild('#nuCalendar', 'div', 'nuCalYear');
	c = $('#nuCalYear');

	c.css({
		'position': 'absolute',
		'top': (window.nuCalTop + 55),
		'left': 60,
		'width': 90,
		'height': 25,
		'text-align': 'center',
		'font-size': 14,
		'color': '#000000',
		'cursor': 'pointer',
	})
		.addClass('nuCalendarColor');


	nuAppendChild('#nuCalendar', 'div', 'nuCalYearLess');
	c = $('#nuCalYearLess');

	c.attr('onclick', "window.nuCalYear--;nuPopulateCalendar('')")
		.css({
			'position': 'absolute',
			'top': (window.nuCalTop + 55),
			'left': 11,
			'width': 30,
			'height': 21,
			'cursor': 'pointer',
			'text-align': 'center',
			'font-size': 14,
			'color': '#000000',
		})
		.html('&#9668;')
		.addClass('nuCalendarSelected nuCalendar');


	nuAppendChild('#nuCalendar', 'div', 'nuCalYearMore');
	c = $('#nuCalYearMore');

	c
		.attr('onclick', "window.nuCalYear++;nuPopulateCalendar('')")
		.css({
			'position': 'absolute',
			'top': (window.nuCalTop + 55),
			'left': 162,
			'width': 30,
			'height': 21,
			'cursor': 'pointer',
			'text-align': 'center',
			'font-size': 14,
			'color': '#000000',
		})
		.html('&#9658;')
		.addClass('nuCalendarSelected nuCalendar');

	nuAppendChild('#nuCalendar', 'select', 'nuCalMonth');
	c = $('#nuCalMonth');

	m = nuMonthNames();
	for (var i = 0; i < 12; i++) {
		c.append('<option value="' + m[i] + '">' + nuTranslate(m[i]) + '</option>');
	}

	c.click(function (event) {
		event.preventDefault();
		event.stopPropagation();
	});

	c.change(function (event) {
		window.nuCalMonth = document.getElementById("nuCalMonth").selectedIndex;
		nuPopulateCalendar(this.id)
	});

	c.css({
		'position': 'absolute',
		'top': window.nuCalTop + 75,
		'left': 40,
		'width': 120,
		'height': 25,
		'text-align': 'center',
		'font-size': 14,
		'color': '#000000',
	})
		.addClass('nuCalendarColor');

	nuAppendChild('#nuCalendar', 'div', 'nuCalMonthLess');
	c = $('#nuCalMonthLess');

	c
		.attr('onclick', "window.nuCalMonth--;nuPopulateCalendar(this.id)")
		.css({
			'position': 'absolute',
			'top': (window.nuCalTop + 78),
			'left': 11,
			'width': 30,
			'height': 21,
			'cursor': 'pointer',
			'text-align': 'center',
			'font-size': 14,
			'color': '#000000',
		})
		.html('&#9668;')
		.addClass('nuCalendarSelected nuCalendar');


	nuAppendChild('#nuCalendar', 'div', 'nuCalMonthMore');
	c = $('#nuCalMonthMore');

	c.attr('onclick', "window.nuCalMonth++;nuPopulateCalendar(this.id)")
		.css({
			'position': 'absolute',
			'top': (window.nuCalTop + 78),
			'left': 162,
			'width': 30,
			'height': 21,
			'cursor': 'pointer',
			'text-align': 'center',
			'font-size': 14,
			'color': '#000000',
		})
		.html('&#9658;')
		.addClass('nuCalendarSelected nuCalendar');

	var t = 100;
	var l = 0;

	for (var i = 0; i < 42; i++) {

		if (t == 100) { nuTitleBox(i, l); }

		nuDayBox(i, l, t);

		if (l == 180) {

			l = 0;
			t = t + 20;

		} else {
			l = l + 30;
		}

	}

	var d = String(u).split('-');

	if (u == '') {

		var n = new Date();
		d = [n.getFullYear(), n.getMonth() + 1, n.getDate()];

	}

	nuPopulateCalendar('', Number(d[0]), Number(d[1]), Number(d[2]));

}

function nuWeekDayFromString(n) {

	//-- legacy
	const wd = 'MTWTFSS';

	if (wd != nuTranslate(wd)) {
		let t = nuCalendarWeekStartNumber() == '1' ? nuTranslate('MTWTFSS') : nuTranslate('SMTWTFS');
		return t.substr(n, 1);
	}

	let t2 = nuCalendarWeekStartNumber() == '1' ? nuTranslate('M,T,W,T,F,S,S') : nuTranslate('S,M,T,W,T,F,S');

	return t2.split(',')[n];

}

function nuTitleBox(n, l) {

	nuAppendChild('#nuCalendar', 'div', 'nuCalTitle' + n);
	c = $('#nuCalTitle' + n);

	c
		.css({
			'position': 'absolute',
			'top': (window.nuCalTop + 108),
			'left': l,
			'width': 28,
			'height': 18,
			'cursor': 'pointer',
			'color': '#000000',
			'border-color': '#D3D3D3',
			'border-style': 'none',
			'border-width': 1,
			'text-align': 'center',
			'font-style': 'bold',
			'font-size': 14,
		})
		.html(nuWeekDayFromString(n))
		.addClass('nuCalendar nuCalendarColor');

}

function nuDayBox(n, l, t) {

	nuAppendChild('#nuCalendar', 'div', 'nuCalDay' + n);

	c = $('#nuCalDay' + n);

	c
		.attr('onclick', "window.nuCalDay=this.innerHTML;nuCalChoice(this)")
		.css({
			'position': 'absolute',
			'top': (window.nuCalTop + t + 30),
			'left': Number(l),
			'width': 30,
			'height': 20,
			'cursor': 'pointer',
			'text-align': 'center',
			'font-size': 14,
			'color': '#000000',
		})
		.addClass('nuCalendarSelected nuCalendar');

}

function nuPopulateCalendar(id, y, m, d) {

	if (arguments.length != 1) {

		window.nuCalDay = d;
		window.nuCalMonth = m - 1;
		window.nuCalYear = y;

	}

	window.nuCalMonth = nuMonthScope(window.nuCalMonth);

	if (id == 'nuCalMonthLess' && window.nuCalMonth == 11) {
		window.nuCalYear = window.nuCalYear - 1;
	}

	if (id == 'nuCalMonthMore' && window.nuCalMonth == 0) {
		window.nuCalYear = window.nuCalYear + 1;
	}

	document.getElementById('nuCalYear').innerHTML = window.nuCalYear;
	document.getElementById("nuCalMonth").options.selectedIndex = window.nuCalMonth;

	var s = new Date(window.nuCalYear, window.nuCalMonth, 1);
	var today = new Date();
	var day = 0;

	var weekDay = s.getDay();

	if (nuCalendarWeekStartNumber() == '1') { // Monday
		var firstDay = 0;
		if (weekDay == 0) {
			firstDay = 6;
		} else {
			firstDay = weekDay - 1;
		}
	} else {
		firstDay = weekDay;
	}

	for (var i = 0; i < 42; i++) {
		document.getElementById('nuCalDay' + i).innerHTML = '';
	}

	for (var i = firstDay; i < 42; i++) {

		day++;
		s.setDate(day);
		let c = document.getElementById('nuCalDay' + i);

		if (s.getDate() != day) {
			return;
		}

		if (today.getDate() == day && today.getMonth() == window.nuCalMonth && today.getFullYear() == window.nuCalYear) {
			c.style.color = 'red';
		} else {
			c.style.color = '#000000';
		}

		c.innerHTML = day;

	}

}


function nuPreviousMonth(y, m, d) {

	m = nuMonthScope(m - 1);

	var d = new Date(y, m, 1);
	var p = Array();
	var day = 1;

	while (d.getDate() == day) {

		p.push(day);
		d.setDate(day);
		day++;

	}
	return p;

}

function nuMonthNames() {

	let m = Array();

	m[0] = 'January';
	m[1] = 'February';
	m[2] = 'March';
	m[3] = 'April';
	m[4] = 'May';
	m[5] = 'June';
	m[6] = 'July';
	m[7] = 'August';
	m[8] = 'September';
	m[9] = 'October';
	m[10] = 'November';
	m[11] = 'December';

	return m;
}

function nuFullMonth(n) {

	let m = nuMonthNames();
	return String(m[n]);

}

function nu2Month(n) {

	let mth = Array();

	mth['Jan'] = '01';
	mth['Feb'] = '02';
	mth['Mar'] = '03';
	mth['Apr'] = '04';
	mth['May'] = '05';
	mth['Jun'] = '06';
	mth['Jul'] = '07';
	mth['Aug'] = '08';
	mth['Sep'] = '09';
	mth['Oct'] = '10';
	mth['Nov'] = '11';
	mth['Dec'] = '12';

	return String(mth[n]);

}


function nuCalChoice(t) {

	if (t.innerHTML == '') { return; }

	var FMT = nuFORM.setFormats();
	var o = $('#' + window.nuCalendarCaller);
	var f = o.attr('data-nu-format');

	var D = Number(t.innerHTML);
	var M = Number(FMT[nuPad2(window.nuCalMonth + 1)]['jsmonth']);

	var Y = Number($('#nuCalYear').html());

	var dt = new Date(Y, M, D, 0, 0, 0, 0);
	var d = dt.getFullYear() + '-' + nuPad2(dt.getMonth() + 1) + '-' + dt.getDate();
	var fd = nuFORM.addFormatting(d, f);

	o
		.val(fd)
		.change()
		.focus();

	$('#nuCalendar').remove();

}


function nuBuildDate() {

	var o = $('#' + window.nuCalendarCaller);
	var f = o.attr('data-nu-format');

	if (f == '' || v == '') { return; }
	if (f == '6') { o.val(); }

}


function nuMonthScope(m) {

	if (m < 0) { m = 11; }
	if (m > 11) { m = 0; }

	return m;

}
