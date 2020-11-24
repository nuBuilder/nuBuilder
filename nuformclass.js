

class nuResponseForm {
	
	getStartPositions() {
		
		var SR				= window.nuSERVERRESPONSE;
		var scale			= nuTransformScale();
		this.top			= 0;
		this.objects		= SR.objects;
		this.StartPositions	= [];
		this.tabs			= SR.tabs;
		$('body').css('transform', 'scale(1)');
	
		for (var i = 0 ; i < SR.objects.length ; i++){
			
			var sp			= this.setStartPosition(SR.objects[i]);

			this.StartPositions.push(sp);
			
		}

		this.getLongestLabel(this.StartPositions);

		$('body').css('transform', 'scale(' + scale + ')');

	}

	setStartPosition(O){

		var	id		= O.id
		var	lid		= 'label_' + O.id;

		var o		= $('#' + id);
		var l		= $('#' + lid);
		var c 		= $('#' + id + 'code');
		var d 		= $('#' + id + 'description');
		
		if(O.input == 'file'){
			
			id		= id + '_file';
			O.type	= 'file';
			
		}
		
		
		var sp		= {
			id			: id,
			labelid		: lid,
			type		: O.type,
			top			: Number(O.top),
			left		: Number(O.left),
			height		: Number(O.height),  
			tab			: Number(O.tab),  
			lleft		: l.length == 0 ? 0 : parseInt(l.css('left')),
			lheight		: l.length == 0 ? 0 : parseInt(l.css('height')),
			owidth		: parseInt(o.css('width')),
			lwidth		: l.length == 0 ? 0 : parseInt(l.css('width')),
			cwidth		: isNaN(parseInt(c.css('width'))) ? 0 : parseInt(c.css('width')),
			dwidth		: isNaN(parseInt(d.css('width'))) ? 20 : parseInt(d.css('width')) + 20,
			tabtitle	: window.nuSERVERRESPONSE.tabs[O.tab].title
		};

		return sp;
		
	}
	
	getLongestLabel(o){
		
		this.label_length = 0;
		
		for(var i = 0 ; i < o.length ; i++){
			
			if(o[i].lleft > 0){
				
				var w 	= $('#label_' + o.id).html();
				var ww	= nuGetWordWidth(w);
				this.label_length = Math.max(this.label_length, ww);

			}
			
		}
		
		this.label_length  = this.label_length  + 5;
	
	}
	

	setSelect(){
		
		if($('#nuResponseTabs').length == 1){return;}
		
		var sel = document.createElement('select');
		sel.setAttribute('id', 'nuResponseTabs');
		$('#nuResponseTabs').remove();
		$('.nuTab').hide();
		$('#nuTabHolder').prepend(sel);
		$('#nuResponseTabs').attr('onchange', 'nuSelectAllTabs(this)');

		var tabs	= nuSERVERRESPONSE.tabs;

		for(var n = 0 ; n < tabs.length ; n++){
			
			var t = tabs[n].title.replaceAll(' ', '&#160;')

			$('#nuResponseTabs').append('<option value="nuTab' + n + '">' + t + '</option>');

		}

		$('#nuResponseTabs').val($('.nuTabSelected')[0].id);

	}
	


	
	setTabsColumn(all, wrap){
	
		var D	 = this.StartPositions;
		var top = 10;
		var scr	= 0;


		if($('#nuResponseTabs').length == 1){
			var tab	= String($('#nuResponseTabs').val()).substr(5);
		}else{
			var tab	= $('.nuTabSelected')[0].id.substr(5);
		}


		
		$('.nuTabTitleColumn').remove();
		
		this.setSelect();

		for (var i = 0 ; i < D.length ; i++){
			
			if(scr < D[i].cwidth + D[i].dwidth + 50){scr = (D[i].cwidth + D[i].dwidth + 50)}
			
			var dl	= D[i].left;

			if(arguments.length == 2){
				window.nuRESPONSEWRAP	= wrap;
			}

			if(tab == D[i].tab){

				top 	= this.placeObject(D[i], top, window.nuRESPONSEWRAP);
				
				if($('#' + D[i].id).attr('data-nu-tab') != 'x'){
					top = top + D[i].height + 10;
				}

			}
			
		}

		top = top + 30;

		$('#nuRECORD').append("<div id='nuTabTitleColumnBottom' style='left:0px;top:" + top + "px;position:absolute;visibility:hidden'>.<div>");
		
		$("[data-nu-form][data-nu-tab]:not([data-nu-lookup-id]):not('.nuIframe, .nuHtml')").show();
		$(".nuIframe").css('visibility','visible');
		$(".nuHtml").css('visibility','visible');
		$("[data-nu-tab='x']").css('visibility','hidden');

		$('.nuTabSelected').click();
		
	}
	
	placeObject(O, t, one_row){
	
		var left= 5;
		var o 	= $('#' + O.id);
		var l	= $('#label_' + O.id);
		var c 	= $('#' + O.id + 'code');
		var b 	= $('#' + O.id + 'button');
		var d 	= $('#' + O.id + 'description');
		var ll	= this.label_length + 5;

		if(O.type == 'file'){
			l	= $('#' + O.labelid);
		}

		if(one_row){
			
			l.css({top:t, left:left, width:this.label_length, 'text-align':'right'});
			
		}else{
			
			ll	= 0;
			l.css({top:t, left:left, 'text-align':'left'});
			
			if($('#' + O.id).attr('data-nu-tab') != 'x'){
				t = t + O.lheight + 2;
			}
			
		}

		o.css({top:t, left:left + ll});
		c.css({top:t, left:left + ll});
		b.css({top:t, left:left + ll + O.cwidth + 7});
		d.css({top:t, left:left + ll + O.cwidth + 26});
	
		return t;
		
	}







	
	resetDefault(){
	
		var D	= this.StartPositions;
		var ll	= this.label_length + 5;
		
		$('.nuTabTitleColumn').remove();
		
		this.unsetSelect();

		for (var i = 0 ; i < D.length ; i++){
			
			$('#' + D[i].id).css({top:D[i].top, left:D[i].left})
			$('#' + D[i].labelid).css({top:D[i].top, left:D[i].lleft, width:D[i].lwidth, 'text-align':'right'})
			
			if(D[i].type == 'lookup'){
				
				$('#' + D[i].id + 'code').css({top:D[i].top, left:D[i].left})
				$('#' + D[i].id + 'button').css({top:D[i].top, left:D[i].left + D[i].cwidth + 7});
				$('#' + D[i].id + 'description').css({top:D[i].top, left:D[i].left + D[i].cwidth + 26});

			}
		}
			
		$('.nuTabSelected').click();

	}
	


	unsetSelect(){
		
		$('#nuResponseTabs').remove()
		$('.nuTab').show();
		
	}
	














	
}


class nuFormObject {
	
	constructor() {
		
		this.tableSchema		= [];
		this.formSchema			= [];
		this.formats			= this.setFormats();
		this.breadcrumbs 		= [];
		this.scroll		 		= [];
		this.edited				= false;
		this.deleteForm			= false;
		
	}
	
	getCurrent(){
		
		return this.breadcrumbs[this.breadcrumbs.length - 1];
		
	}
	
	removeLast(){
		
		this.breadcrumbs.pop();
		
	}
	
	removeAfter(b) {

		while(this.breadcrumbs.length - 1 > b) {
			this.removeLast();
		}
		
	}
	
	scrollList(e, l){
		
		if(this.scroll[e.target.id] === undefined){
			
			this.scroll[e.target.id]	= {'list' : l, 'index' : 0};
			
			for(var i = 0 ; i < l.length ; i++){
				
				if(e.target.value == l[i]){
					this.scroll[e.target.id].index = i;
				}
				
			}
			
		}

		if(JSON.stringify(this.scroll[e.target.id].list) != JSON.stringify(l)){
			this.scroll[e.target.id].index = 0;
		}
		
		this.scroll[e.target.id].list	= l;

		var s	= this.scroll[e.target.id];
		
		if(e.keyCode == 38){
			
			s.index --;
			
			if(s.index == -1){
				this.scroll[e.target.id].index = s.list.length -1;
			}
			
		}else if(e.keyCode == 40){
			
			s.index ++;

			if(s.index == s.list.length){
				this.scroll[e.target.id].index = 0;
			}
			
		}else{
			return false;
		}
		
		var theid 		= e.target.id;
		var theindex	= this.scroll[theid].index;
		var thevalue	= s.list[theindex];
		
		$('#' + e.target.id)
		.val(thevalue)
		.change();
		
		nuHasBeenEdited();
		
	}
	
	addBreadcrumb(){
		
		var b				= {};
		b.form_id 			= '';
		b.redirect_form_id	= '';
		b.record_id 		= '';
		b.title				= '';
		b.call_type        	= '';
		b.column_widths    	= 0;
		b.filter           	= '';
		b.forms        		= [];
		b.iframe			= 0;
		b.lookup_id        	= '';
		b.object_id        	= '1';
		b.page_number      	= 0;
		b.password     		= '';
		b.rows        		= -1;
		b.row_height		= 25;
		b.search           	= '';	
		b.session_id		= '';
		b.nosearch_columns 	= [];
		b.sort             	= '-1';
		b.sort_direction   	= 'desc';
		b.subforms			= 0;
		b.tab_start      	= [];
		b.username			= '';
		b.user_id			= '';
		b.refreshed			= -1;
		
		this.breadcrumbs.push(b);
		
		return this.getCurrent();
		
	}

	setProperty(f, v) {
		this.breadcrumbs[this.breadcrumbs.length -1][f] = v;
	}
	

	getProperty(f) {
		return this.breadcrumbs[this.breadcrumbs.length - 1][f];
	}
	
	dataType(t, f){
		
		var tab	= this.tableSchema[t];
		
		for(var i = 0 ; i < tab.length ; i++){
			
			if(tab[i][0] == f){
				return tab[i][1];
			}
		}
	
	}
	
	tablesFromSQL(sql){
		
		var t		= [];
		var tables	= this.getTables();
		sql			= sql + ' ';
		sql			= sql.replace(/[\n\r]/g, ' ');
		
		for(var i = 0 ; i < tables.length ; i++){
			
			if(sql.indexOf(' ' + tables[i] + ' ') != -1){
				t.push(tables[i]);
			}
			
		}
		
		return t;
	
	}
	
	formFields(t){
		
		var tab	= this.formSchema[t];
		var fld	= [];
		
		if(tab === undefined){
			return fld;
		}
		
		
		for(var i = 0 ; i < tab.length ; i++){
			fld.push(tab[i]);
		}
		
		return fld;
	
	}
	
	tableFields(t){
		
		var tab	= this.tableSchema[t];
		var fld	= [];
		
		if(tab === undefined){
			return fld;
		}
		
		
		for(var i = 0 ; i < tab.length ; i++){
			fld.push(tab[i]);
		}
		
		return fld;
	
	}
	
	
	SQLFields(sql){										//-- sfo_browse_sql

		var tab		= this.tablesFromSQL(sql);
		var fld		= [];
		
		for(var i = 0 ; i < tab.length ; i++){
			
			var f	= nuFORM.tableSchema[tab[i]].names;
			fld		= fld.concat(f);
			
		}
		
		return fld;
	
	}
	
	
	selectFields(){									//-- from SELECT builder

		var fld		= [];
		
		$('#sqlframe').contents().find('.nuBox').each(function(index) {
			
			var b	= $(this)[0].id;
			var a	= $('#sqlframe').contents().find('#alias' + b).val();
			var t	= $('#sqlframe').contents().find('#tablename' + b).html();
			
			if(a == ''){
				a	= t;
			}
			
			var f	= nuFORM.tableSchema[t].names;
			
			for(var i = 0 ; i < f.length ; i ++){
				fld.push(a + '.' + f[i]);
			}
			
			
		});
		
		return fld;
	
	}
	
	
	relationshipFields(){

		var t		= [];
		var fld		= [];

		$('.nuBox').each(function(index) {
			
			var b	= $(this)[0].id;
			var T	= $('#tablename' + b).val();
			var A	= $('#alias' + b).val();
			
			t.push({'tablename' : T, 'alias' : A});
			
		});

		for(var i = 0 ; i < t.length ; i++){
			
			var f	= nuFORM.tableSchema[t[i].tablename].names;
			
			for(var I = 0 ; I < f.length ; I ++){
				fld.push(t[i].alias + '.' + f[I]);
			}
			
		}
		
		return fld;
	
	}
	
	getForms(){
	
		var forms	= [];
		
		for (var key in nuFORM.formSchema) {

			if (nuFORM.formSchema.hasOwnProperty(key)) {
				forms.push(key) 
			}
			
		}
		
		return forms;
		
	}
	
	getTables(){
	
		var tables	= [];
		
		for (var key in nuFORM.tableSchema) {

			if (nuFORM.tableSchema.hasOwnProperty(key)) {
				tables.push(key) 
			}
			
		}
		
		return tables;
		
	}
	
	getJustTables(){
	
		var tables	= [];
		
		for (var key in nuFORM.tableSchema) {

			if (nuFORM.tableSchema.hasOwnProperty(key)) {
				
				if(nuSERVERRESPONSE.viewSchema.indexOf(key) == -1){
					tables.push(key);
				}
			}
			
		}
		
		return tables;
		
	}
	
	calc(field){
		
		if(field.split('.').length == 2){
			
			var subform_name	= field.split('.')[0];
			var field_name		= field.split('.')[1];
			
		}else{
			
			var o				= $('#' + field);
			var f				= o.attr('data-nu-format');
			var v				= o.val();
			
			return nuFORM.removeFormatting(v, f);
			
		}

		var d				= this.data();											//-- an array of all data as subforms (the mainform is the first element)
		var v				= 0;
		var u				= 0;
		
		for(var i =  0 ; i < d.length ; i++){
			
			var SF			= d[i];
			
			if(SF.id == subform_name){												//-- i've got the right subform
			
				var fmt		= $("[id$='" + field_name + "']input[id^='" + subform_name + "']").attr('data-nu-format')			
				var f		= SF.fields.indexOf(field_name);						//-- check for valid field(column)
				
				if(f == -1){return 0;}
				
				for(var c = 0 ; c < SF.rows.length ; c++){

					if(SF.deleted[c] == 0){										//-- add up only stuff not being deleted
						
//						u	= nuFORM.removeFormatting(SF.rows[c][f], fmt);
						u	= SF.rows[c][f];
						v	= parseFloat(Number(v) + Number(u)).toPrecision(10)
						
					}
					
				}
				
				return Number(v);
				
			}
		}
		
		return 0;
	
	}
	
	data(action = 'save'){
		
		var d					= [];
		var sf					= this.subforms();

		for(var i = 0 ; i < sf.length ; i++){
			
			var o				= this.subform(sf[i], action);
			
			o.columns			= null;
			o.chartData			= null;
			o.chartDataPivot	= null;
			
			d.push(o);
			
		}
		
		return d;
		
	}
	
	subforms(){
		
		var s	= [''];
			
		$("[data-nu-subform='true']").each(function(index) {
			s.push($(this)[0].id);
		});
		
		return s;

	}

	subform(sf, action = 'save'){

		var id			= sf;
		var deleteAll	= action == 'delete';
		
		if(sf == ''){
			
			id			= 'nuBuilder4EditForm';
			var oi		= 	-1;
			var fk		= '';
			var pk		= $('#nuRECORD').attr('data-nu-primary-key-name');
			var table	= $('#nuRECORD').attr('data-nu-table');
			var sel		= '#nuRECORD';
			var sf		= 'nuRECORD';
			
			if(table === undefined){
				oi		= parent.nuFORM.getCurrent().form_id;
			}else{
				oi		= nuFORM.getCurrent().form_id;
			}
		
		}else{
			
			var sel		= "[id*='" + sf + "'][id*='nuRECORD']";
			var table	= $(sel).attr('data-nu-table');
			var oi		= $('#' + sf).attr('data-nu-object-id');
			var fk		= $('#' + sf).attr('data-nu-foreign-key-name');
			var pk		= $('#' + sf).attr('data-nu-primary-key-name');
			var nd		= $('#' + sf).attr('data-nu-delete');
			var na		= $('#' + sf).attr('data-nu-add');

		}
		
		var o			= {'id':id, 'foreign_key':fk, 'primary_key':pk, 'object_id':oi, 'table':table, 'action':action};	//-- foreign_key id id Form's record_id (which might change if cloned.)
		var F			= ['ID'];
		o.rows			= [];
		o.columns		= [];
		o.chartData		= [];
		o.chartDataPivot= [];
		o.edited		= [];
		o.deleted		= [];
		var deleteRow	= false;
		
		$(sel).each(function(index){
			
			var THIS			= $(this);
			var dnpk			= $(this).attr('data-nu-primary-key')
			var V				= [dnpk];
			var E				= [0];
			var C				= 1;
			var chk				= $('#' + this.id).prop("checked");

			THIS.children('[data-nu-data]').each(function(){
				
				if(this.id.substr(-8) == 'nuDelete'){
					chk			=($('#' + this.id).prop("checked") || deleteAll) ? 1 : 0 ;
				}

				
				if(sf == 'nuRECORD'){						//-- the main Form
					F[C]		= this.id;
				}else{
					F[C]		= this.id.substr(sf.length + 3);
				}
				
				var dnf			= $('#' + this.id).attr('data-nu-format');
				var typ			= $('#' + this.id).attr('type');
				var val			= $('#' + this.id).val();

				if(typ == 'checkbox'){
					val			= $('#' + this.id).prop("checked") ? 1 : 0 ;
				}
				
				if(typeof($('#' + this.id).val()) == 'object'){						//-- multi SELECT Object
					val			= JSON.stringify($('#' + this.id).val());
				}
				
				V[C]			= nuFORM.removeFormatting(val, dnf);
				E[C]			= $('#' + this.id).hasClass('nuEdited') ? 1 : 0 ;

				C++;
				
			});
			
		if(!(na == 0 && dnpk == -1)){
			o.rows.push(V);
			o.edited.push(E);
			o.deleted.push(chk);
		}
			
		});
		
		o.fields				= F;
		var titles				= [];

		
		for(var f = 0 ; f < o.fields.length - 1 ; f++){
			
			var c				= [];
			var d				= 0;
			
			titles.push($('#title_' + sf + o.fields[f]).html())
			
			for(var r = 0 ; r < o.rows.length ; r++){
				
				if(o.rows[r][o.fields.length - 1] == 0){
					c.push(o.rows[r][f]);
				}
				
			}
			
			o.columns.push(c);
		
		}
		
		for(var i = 0 ; i < o.rows.length ; i++){
			
			var row				= JSON.parse(JSON.stringify(o.rows[i]));
			
			row.shift();
			row.pop();
			
			if(o.deleted[i] == 0){
				
				for(var ro = 0 ; ro < row.length ; ro++){
					
					if(ro != 0){
						row[ro]	= Number(row[ro]);
					}
					
				}
				
				o.chartData.push(row);
			}
			
		}

		titles.shift();
		o.chartData.splice(0,0, titles);
		
		for(var i = 0 ; i < o.chartData[0].length ; i++){
			
			row					= [];

			for(var p = 0 ; p < o.chartData.length ; p++){
				row.push(o.chartData[p][i]);
			}
			
			o.chartDataPivot.push(row);
			
		}
		
		if(nd == 0){								//-- no deleting allowed
		
			for(var i = 0 ; i < o.rows.length ; i ++){
				o.deleted[i]	= 0;
			}
			
			if(na == 1){
				o.deleted[o.deleted.length - 1]	= 1;
			}
			
		}
		
		return o;
		
	}	
	
	

	setFormats(){
		
		var f	= {};

		f['01']		= {'mmm' : 'Jan', 'mmmm' : 'January',	'mm' : '01' , 'm' : '1',  'jsmonth' : 0};
		f['02']		= {'mmm' : 'Feb', 'mmmm' : 'February',	'mm' : '02' , 'm' : '2',  'jsmonth' : 1};
		f['03']		= {'mmm' : 'Mar', 'mmmm' : 'March', 	'mm' : '03' , 'm' : '3',  'jsmonth' : 2};
		f['04']		= {'mmm' : 'Apr', 'mmmm' : 'April', 	'mm' : '04' , 'm' : '4',  'jsmonth' : 3};
		f['05']		= {'mmm' : 'May', 'mmmm' : 'May',		'mm' : '05' , 'm' : '5',  'jsmonth' : 4};
		f['06']		= {'mmm' : 'Jun', 'mmmm' : 'June',		'mm' : '06' , 'm' : '6',  'jsmonth' : 5};
		f['07']		= {'mmm' : 'Jul', 'mmmm' : 'July',		'mm' : '07' , 'm' : '7',  'jsmonth' : 6};
		f['08']		= {'mmm' : 'Aug', 'mmmm' : 'August', 	'mm' : '08' , 'm' : '8',  'jsmonth' : 7};
		f['09']		= {'mmm' : 'Sep', 'mmmm' : 'September',	'mm' : '09' , 'm' : '9',  'jsmonth' : 8};
		f['10']		= {'mmm' : 'Oct', 'mmmm' : 'October', 	'mm' : '10' , 'm' : '10', 'jsmonth' : 9};
		f['11']		= {'mmm' : 'Nov', 'mmmm' : 'November', 	'mm' : '11' , 'm' : '11', 'jsmonth' : 10};
		f['12']		= {'mmm' : 'Dec', 'mmmm' : 'December', 	'mm' : '12' , 'm' : '12', 'jsmonth' : 11};

		f.Jan		= {'mmm' : 'Jan', 'mmmm' : 'January',	'mm' : '01' , 'm' : '1',  'jsmonth' : 0};
		f.Feb		= {'mmm' : 'Feb', 'mmmm' : 'February',	'mm' : '02' , 'm' : '2',  'jsmonth' : 1};
		f.Mar		= {'mmm' : 'Mar', 'mmmm' : 'March', 	'mm' : '03' , 'm' : '3',  'jsmonth' : 2};
		f.Apr		= {'mmm' : 'Apr', 'mmmm' : 'April', 	'mm' : '04' , 'm' : '4',  'jsmonth' : 3};
		f.May		= {'mmm' : 'May', 'mmmm' : 'May',		'mm' : '05' , 'm' : '5',  'jsmonth' : 4};
		f.Jun		= {'mmm' : 'Jun', 'mmmm' : 'June',		'mm' : '06' , 'm' : '6',  'jsmonth' : 5};
		f.Jul		= {'mmm' : 'Jul', 'mmmm' : 'July',		'mm' : '07' , 'm' : '7',  'jsmonth' : 6};
		f.Aug		= {'mmm' : 'Aug', 'mmmm' : 'August', 	'mm' : '08' , 'm' : '8',  'jsmonth' : 7};
		f.Sep		= {'mmm' : 'Sep', 'mmmm' : 'September',	'mm' : '09' , 'm' : '9',  'jsmonth' : 8};
		f.Oct		= {'mmm' : 'Oct', 'mmmm' : 'October', 	'mm' : '10' , 'm' : '10', 'jsmonth' : 9};
		f.Nov		= {'mmm' : 'Nov', 'mmmm' : 'November', 	'mm' : '11' , 'm' : '11', 'jsmonth' : 10};
		f.Dec		= {'mmm' : 'Dec', 'mmmm' : 'December', 	'mm' : '12' , 'm' : '12', 'jsmonth' : 11};

		f.January	= {'mmm' : 'Jan', 'mmmm' : 'January',	'mm' : '01' , 'm' : '1',  'jsmonth' : 0};
		f.February	= {'mmm' : 'Feb', 'mmmm' : 'February',	'mm' : '02' , 'm' : '2',  'jsmonth' : 1};
		f.March		= {'mmm' : 'Mar', 'mmmm' : 'March', 	'mm' : '03' , 'm' : '3',  'jsmonth' : 2};
		f.April		= {'mmm' : 'Apr', 'mmmm' : 'April', 	'mm' : '04' , 'm' : '4',  'jsmonth' : 3};
		f.May		= {'mmm' : 'May', 'mmmm' : 'May',		'mm' : '05' , 'm' : '5',  'jsmonth' : 4};
		f.June		= {'mmm' : 'Jun', 'mmmm' : 'June',		'mm' : '06' , 'm' : '6',  'jsmonth' : 5};
		f.July		= {'mmm' : 'Jul', 'mmmm' : 'July',		'mm' : '07' , 'm' : '7',  'jsmonth' : 6};
		f.August	= {'mmm' : 'Aug', 'mmmm' : 'August', 	'mm' : '08' , 'm' : '8',  'jsmonth' : 7};
		f.September	= {'mmm' : 'Sep', 'mmmm' : 'September',	'mm' : '09' , 'm' : '9',  'jsmonth' : 8};
		f.October	= {'mmm' : 'Oct', 'mmmm' : 'October', 	'mm' : '10' , 'm' : '10', 'jsmonth' : 9};
		f.November	= {'mmm' : 'Nov', 'mmmm' : 'November', 	'mm' : '11' , 'm' : '11', 'jsmonth' : 10};
		f.December	= {'mmm' : 'Dec', 'mmmm' : 'December', 	'mm' : '12' , 'm' : '12', 'jsmonth' : 11};

		f.Sun		= {'ddd' : 'Sun', 'dddd' : 'Sunday', 	'dd' : '01', 	'd' : '1'};
		f.Mon		= {'ddd' : 'Mon', 'dddd' : 'Monday', 	'dd' : '02', 	'd' : '2'};
		f.Tue		= {'ddd' : 'Tue', 'dddd' : 'Tueday', 	'dd' : '03', 	'd' : '3'};
		f.Wed		= {'ddd' : 'Wed', 'dddd' : 'Wednesday',	'dd' : '04', 	'd' : '4'};
		f.Thu		= {'ddd' : 'Thu', 'dddd' : 'Thursday', 	'dd' : '05', 	'd' : '5'};
		f.Fri		= {'ddd' : 'Fri', 'dddd' : 'Friday', 	'dd' : '06', 	'd' : '6'};
		f.Sat		= {'ddd' : 'Sat', 'dddd' : 'Saturday', 	'dd' : '07', 	'd' : '7'};

		f.Sunday	= {'ddd' : 'Sun', 'dddd' : 'Sunday', 	'dd' : '01', 	'd' : '1'};
		f.Monday	= {'ddd' : 'Mon', 'dddd' : 'Monday', 	'dd' : '02', 	'd' : '2'};
		f.Tuesday	= {'ddd' : 'Tue', 'dddd' : 'Tueday', 	'dd' : '03', 	'd' : '3'};
		f.Wednesday	= {'ddd' : 'Wed', 'dddd' : 'Wednesday',	'dd' : '04', 	'd' : '4'};
		f.Thursday	= {'ddd' : 'Thu', 'dddd' : 'Thursday', 	'dd' : '05', 	'd' : '5'};
		f.Friday	= {'ddd' : 'Fri', 'dddd' : 'Friday', 	'dd' : '06', 	'd' : '6'};
		f.Saturday	= {'ddd' : 'Sat', 'dddd' : 'Saturday', 	'dd' : '07', 	'd' : '7'};

		return f;
		
	}
	
	addFormatting(v, f){

		
		if(v == undefined)	{return '';}
		if(v == null)		{return '';}
		if(f == undefined)	{return v;}
		if(f == '')			{return v;}
		if(v == '')			{return v;}
		
		v				= String(v);
		f				= String(f);
		
		if(f[0] == 'N'){													//-- number  '456.789','N|€ 1,000.00'

			//var F		= nuNumberFormat(f);
			var CF		= nuGetNumberFormat(f);								//-- CF[0]=sign, CF[1]=separator, CF[2]=decimal, CF[3]=places
			v			= Number(v.replace(CF.decimal, '.')).toFixed(CF[3]);
			
			if(isNaN(Number(v))){return '';}
			var splitNumber		= v.split('.');
		//	return String(CF[0] + ' ' + nuAddThousandSpaces(splitNumber[0], CF[1]) + CF[2] + splitNumber[1]).trim();
			var decimals = splitNumber.length == 1 ? '' : splitNumber[1];
			return String(CF[0] + ' ' + nuAddThousandSpaces(splitNumber[0], CF[1]) + CF[2] + decimals).trim();		
			
		}
		
		if(f[0] == 'D'){	//-- date

			if(String(v.split(' ')[0]) == '0000-00-00'){return '';}
			if(v == ''){return '';}
			
			var FMT		= this.setFormats();
			var d		= String(v.split(' ')[0]).split('-');
			var t		= String(v.split(' ')[1]).split(':');

			if(t[0] == 'undefined'){
				var t	= [0, 0, 0];
			}
			
			var o 		= new Date(d[0], d[1]-1, d[2], t[0], t[1], t[2], 0);			//-- (year, month, day, hours, minutes, seconds, milliseconds)
			
			if(o =='Invalid Date'){return '';}
			
			var wee		= o.toString().split(' ')[0];								//-- Tue Sep 07 2004 11:11:12 GMT+0930 (Cen. Australia Standard Time)
			var mth		= o.toString().split(' ')[1];
			var day		= o.toString().split(' ')[2];
			var yea		= o.toString().split(' ')[3];
			var hou		= String(o.toString().split(' ')[4]).split(':')[0];
			var min		= String(o.toString().split(' ')[4]).split(':')[1];
			var sec		= String(o.toString().split(' ')[4]).split(':')[2];
			
			var s		= String(f);
			
			if(Number(hou) > 11){
				
				s		= s.replaceAll('pp', 	'pm');
				s		= s.replaceAll('PP', 	'PM');
				
			}else{
				
				s		= s.replaceAll('pp', 	'am');
				s		= s.replaceAll('PP', 	'AM');

			}
			
			s			= s.replaceAll('yyyy',		yea);
			s			= s.replaceAll('yy',		String(yea).substr(2));
			s			= s.replaceAll('mmmm',		FMT[mth]['mmmm']);
			s			= s.replaceAll('mmm',		FMT[mth]['mmm']);
			s			= s.replaceAll('mm',		FMT[mth]['mm']);
			s			= s.replaceAll('dddd',		FMT[wee]['dddd']);
			s			= s.replaceAll('ddd',		FMT[wee]['ddd']);
			s			= s.replaceAll('dd',		day);
			s			= s.replaceAll('hh',	 	hou);
			s			= s.replaceAll('nn',		min);
			s			= s.replaceAll('ss', 		sec);
			
			return s.substr(2);
			
		}
		
		return v;
		
	}

	
	removeFormatting(v, f){
		
		if(v == undefined)	{return '';}
		if(f == undefined)	{return v;}
		if(f == '')			{return v;}
		if(v == '')			{return v;}
		
		v				= String(v);
		f				= String(f);

		if(f[0] == 'N'){										//-- number

			//var F		= nuNumberFormat(f);
			var CF		= nuGetNumberFormat(f);								//-- CF[0]=sign, CF[1]=separator, CF[2]=decimal, CF[3]=places
			
			if(CF[2] == ''){
				return v.replace(CF[0], '').replace(' ', '').replaceAll(CF[1], '');
			}else{
				return v.replace(CF[0], '').replace(' ', '').replaceAll(CF[1], '').replace(CF[2], '.');
			}
			
		}

		if(f[0] == 'D'){										//-- date
			
			if(f.substr(0, 10) == '0000-00-00'){
				return '';
			}
			
			var FMT		= this.setFormats();
			var hasTime	= f.indexOf('hh') != -1 || f.indexOf('nn') != -1 || f.indexOf('ss') != -1; 	//-- looking for the time
			
			v			= String(v)
							.replaceAll(':', ' ')
							.replaceAll('/', ' ')
							.replaceAll('.', ' ')
							.replaceAll('-', ' ')
							.replaceAll(',', ' ')
							.split(' ');
							
			f			= String(f)
							.substr(2)
							.replaceAll(':', ' ')
							.replaceAll('/', ' ')
							.replaceAll('.', ' ')
							.replaceAll('-', ' ')
							.replaceAll(',', ' ')
							.split(' ');
							
							
			var o 		= Date().toString().split(' ', 6)								//-- Tue Sep 07 2004 11:11:12 GMT+0930 (Cen. Australia Standard Time)
			var time	= String(o[4]).split(':');
			
			var d		= {'y' : o[3], 'm' : FMT[o[1]].jsmonth, 'd' : o[2], 'h' : time[0], 'n' : time[1], 's' : time[2]};	//-- today's date
			for(var i = 0 ; i < f.length ; i++){
				
				var fmt	= String(f[i]);
				var l	= fmt[0];
				
				if(l == 'm' && FMT[v[i]] !== undefined){
					d.m		= FMT[v[i]]['mm'];					//-- javascript month
				}
				
				if(fmt == 'dd'){
					d.d		= v[i];
				}
				if(l == 'y'){
					d.y 	= v[i];
				}
				
				if(l == 'h'){d.h = v[i];}
				if(l == 'n'){d.n = v[i];}
				if(l == 's'){d.s = v[i];}
				
			}
			
			var o 	= new Date(d.y, Number(d.m) - 1, d.d, Number(d.h), Number(d.n), Number(d.s), 0);
			var y	= String(o.getFullYear()) 	+ '-';
			var m	= nuPad2(o.getMonth() + 1)	+ '-';
			var a	= nuPad2(o.getDate())		+ ' ';
			var h	= nuPad2(o.getHours()) 		+ ':';
			var n	= nuPad2(o.getMinutes()) 	+ ':';
			var s	= nuPad2(o.getSeconds());

			if(hasTime){
				return  String(y+m+a+h+n+s);
			}else{
				return  String(y+m+a).trim();
			}
			
		}
		
	}
	
}


function nuNumberFormat(f){
	
	var o				= {type : ''};

	if(f[0] == 'N'){										//-- number

		var spl			= f.substr(2).split(' ');			//-- array [sign, number]
		var n			= spl[spl.length-1];				//-- number format
		
		o.type			= 'Number';
		o.separator		= n.substr(1,3).replaceAll('0','');
		o.decimal		= n.substr(3).replaceAll('0','');
		o.sign			= spl[0];
		o.places		= 0;
		o.format		= f;
		
		if(spl.length == 1){
			
			o.sign		= '';
			spl.unshift('');
			
		}
		
		if(o.decimal.length == 1){
			o.places	= spl[1].split(o.decimal)[1].length;
		}

	}
	
	return o;
	
}


function nuGetNumberFormat(f){

	var a = ['','','',''];
	var n = nuSERVERRESPONSE.number_formats;
	
	for(var i = 0 ; i < n.length ; i++){

		if(n[i][0] == f){
			return JSON.parse(n[i][1])
		}
		
	}
	
	return a;
	
}


function nuCurrentProperties(){
	return nuFORM.getCurrent();
}


function nuSetProperty(f, v){
	nuFORM.setProperty(f, v);
}


function nuGetProperty(f){
	return nuFORM.getProperty(f);
}



