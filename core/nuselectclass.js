
class nuSelectObject{
	
	constructor() {
		
		this.boxID		= '';
		this.table		= '';
		this.joins		= [];
		this.boxes		= [];
		this.tempTables	= [];
		this.tempJoins	= [];
		
	}
	

	addBox(t, id){

		this.table		= t;
		var s			= parent.nuFORM.tableSchema;
		var n			= s[t].names;
		var p			= s[t].types;
		var i			= arguments.length == 1 ? nuID() : String(id).substr(3);
		this.boxID		= 'box' + i;
		this.scrollID	= 'scroll' + i;
		var w			= this.boxWidth(s, t);
		var box			= document.createElement('div');		//-- box

		this.boxes.push(this.boxID);		
		
		box.setAttribute('id', this.boxID);
		$('body').append(box);
		$('#' + this.boxID).css({
			'width'				: w,
			'height'			: Math.min(20 + (n.length * 20), 190),
			'top'				: 25 + (25 * $('.nuBox').length),
			'left'				: 22 + (22 * $('.nuBox').length),
			'position'			: 'absolute',
			'border'			: 'solid grey 1px',
			'overflow'			: 'hidden',
			'padding-top'		: '5px',
			'background-color'	: '#c5c3c3',
			'z-index'			: -1,
		})
		.addClass('nuBox')
		.addClass('nuDragNoSelect')
		.addClass('nuBoxHeader')
		.addClass('nuBoxShadow');
		
		
		var scroll	= document.createElement('div');			//-- scroll

		scroll.setAttribute('id', this.scrollID);
		
		$('#' + this.boxID).append(scroll);
		$('#' + scroll.id).css({
			'width'				: w,
			'height'			: Math.min(20 + (n.length * 20), 175),
			'top'				: 22,
			'left'				: 0,
			'overflow'			: 'scroll',
			'overflow-x'		: 'hidden',
			'line-height'		: 1,
		})
		.addClass('nuDragNoSelect')
		.addClass('nuBoxHeader');

		var tbl	= document.createElement('div');				//-- tablename

		tbl.setAttribute('id', 'tablename' + this.boxID);
		
		$('#' + this.boxID).append(tbl);
		
		$('#' + tbl.id)
		.css({
			'position'			: 'absolute',
			'width'				: 280,
			'height'			: 15,
			'top'				: 2,
			'left'				: 0,
			'padding-left'		: 22,
			'text-align'		: 'left',
			'border' 			: 'none',
			'font-weight'		: 'bold',
			'background-color'	: '#c5c3c3',
		})
		.html(t)
		.addClass('nuDragNoSelect')
		.addClass('nuTableName')
		.addClass('nuBoxTitle');
		
		var bck	= document.createElement('input');								//-- checkbox all

		bck.setAttribute('id', 'checkall' + this.boxID);
		
		$('#' + this.boxID).append(bck);
		
		$('#' + bck.id)
		.css({
			'position'			: 'absolute',
			'width'				: 20,
			'top'				: 2,
			'left'				: -1,
		})
		.attr('type', 'checkbox')
		.attr('onchange', 'window.nuSQL.buildSQL("table","' + this.boxID + '")')
		.prop('checked', true);
		
		var col	= document.createElement('input'); 								//-- table alias

		col.setAttribute('id', 'alias' + this.boxID);
		
		$('#' + this.boxID).append(col);
		
		$('#' + col.id)
		.css({
			'position'			: 'absolute',
			'width'				: 30,
			'top'				: 2,
			'right'				: 18,
			'background-color'	: '#c5c3c3',
		})
		.change(function(){
			nuSQL.buildSQL();
		})
		
		for(var rows = 0 ; rows < n.length ; rows++){								//-- add field list
			this.boxRow(rows, n[rows], p[rows], w);
		}

		var x 	= document.createElement('div');									//-- close box
		
		x.setAttribute('id', 'nuBoxClose' + this.boxID);
		
		$('#' + this.boxID).append(x);
		
		$('#' + x.id).css({
			'width'				: 16,
			'height'			: 15,
			'top'				: 3,
			'right'				: 1,
			'position'			: 'absolute',
			'color'				: 'black',
			'text-align'		: 'center',
		})
		.html('<img onclick="$(this).parent().parent().remove();nuSQL.buildSQL()" id="nbc' + this.boxID + '" src="graphics/nu_box_close.png" width="10px" height="10px">')
		.addClass('nuDragNoSelect')
		.addClass('nuButtonHover')
		.addClass('nuClose');
		
	}

	buildSQL(c, b){

		if(parent.$('#sse_edit').val() == 1){return;}

		nuAngle();
	
		var s 	= this.buildSelect(c, b);
		var f	= this.buildFrom();
		var c	= this.buildClauses();
		
		parent.$('#sse_sql')
		.val(s + f + c + "\n")
		.change();
		
		parent.$('#sse_json')
		.val(this.buildJSON())
		.change();


		if(parent.$('#nuSaveToTextareaButton').length == 1){
			
			parent.$('#nuSaveToTextareaButton').hide();
			parent.$('#nuSaveButton').show();
			
		}
	}
	
	buildSelect(c, b){				//-- checkbox type, boxID
	
		if(c == 'field'){
			
			$('#checkall' + b)
			.prop('checked', false);
			
		}
		
		if(c == 'table'){
			
			$('.checkfield.' + b)
			.prop('checked', false);
			
		}
		
		var	s		= [];
		
		for(var i = 0 ; i < this.boxes.length ; i++){
			
			var b				= this.boxes[i];
			
			if($('#' + b).length == 1){
				
				var t			= $('#tablename' + b).html();
				var a			= $('#alias' + b).val();
				var u			= a == '' ? t : a;
				var T			= this.justAlias(t, a);

				
				if($('#checkall' + b).is(':checked')){
					s.push(T + '.*');
				}else{
					
					$('.checkfield.' + b).each(function(index){
						
						var f	= 'field' + $(this)[0].id.substr(6);
						
						if($(this).is(':checked')){
							
							var box 	= String($(this)[0].id).split('_')[2];
							var alias 	= $('#alias' + box).val();
							
							if(alias == undefined || alias == ''){
								s.push(T + '.' + $('#' + f).html());
							}else{
								s.push(T + '.' + $('#' + f).html() + ' AS ' + T + '_' + $('#' + f).html());
							}
						}
						
					});

				}
				
			}
			
		}
		
		var SQL	= "SELECT\n " + s.join(',\n    ') + "\n";
		
		return SQL;
		
	}
	
	buildFrom(){

		var THIS			= this;
		this.tempTables		= this.usedTables();
		this.tempJoins		= this.getJoinObjects();													//-- current visible joins

		for(var i = 0 ; i < this.tempTables.length ; i++){

			if(this.tempTables[i].used != -1){

				var f		= this.tempTables.sort(torder);
				var more	= true;
				var t		= this.tempTables[i].table;
				var a		= this.tempTables[i].alias;
				var A		= this.fromAlias(f[0].table, f[0].alias);
				var defined	= [A, a];												//-- growing list of used tables
				var ob		= {};
				var s		= '';
				var F		= [];

				while(more){
					
					var q	= this.getJoinObject(defined);
					ob		= q[1];
					more	= q[0];

					if(more){
						
						var a1		= ob.type == 'LEFT' ? "\n        LEFT JOIN " :  "\n        JOIN ";
						
						var a		= this.justAlias(ob.tables[0], ob.aliases[0]);

						if(defined.indexOf(A) == -1 || defined.indexOf(a) == -1){

							var a2	= this.buildAlias(ob.tables[0], ob.aliases[0]);
							A		= this.justAlias(ob.tables[0], ob.aliases[0]);

						}else{

							var a2	= this.buildAlias(ob.tables[1], ob.aliases[1]);
							A		= this.justAlias(ob.tables[1], ob.aliases[1]);

						}
						
						defined.push(A);
						defined.push(a);

						this.markTableAsUsed(ob.tables[0], ob.aliases[0]);
						this.markTableAsUsed(ob.tables[1], ob.aliases[1]);

						var a3		= ob.joins.join(' AND ');

						this.tempTables[i].joins.push(a1 + a2 + ' ON ' + a3);

					}
					
				}
			}
			
		}
		
		
		var torder 		= function(b, a){
			return (a.joins.length < b.joins.length);
		}

		var f			= this.tempTables.sort(torder);
		var F			= [];
		
		for(var i = 0 ; i < f.length ; i++){

			if(f[i].joins.length > 0 || f[i].used != -1){

				var a	= this.fromAlias(f[i].table, f[i].alias);
				var j	= f[i].joins.join("");

				F.push("\n    " + a + j);
				
			}
			
		}
		
		return "\nFROM" + F;
		
	}
	
	markTableAsUsed(t, a){

		for(var i = 0 ; i < this.tempTables.length ; i++){
			
			if(this.tempTables[i].table == t || this.tempTables[i].alias == a){

				this.tempTables[i].used	= -1;

				return;

			}
			
		}
		
	}


	usedTables(){
		
		var T			= [];
		var THIS		= this;
		this.tempJoins	= this.getJoinObjects();													//-- current visible joins
		
		$('.nuBox').each(function(index){

			var b		= $(this)[0].id;
			var t		= $('#tablename' + b).html();
			var a		= $('#alias' + b).val();
			var u		= 0;

			for (var k in THIS.joins){

				var o	= THIS.joins[k];

				if(o.fromalias == a || o.fromtable == t || o.toalias == a || o.totable == t){u ++;}

			}

			T.push({'table' : t, 'alias' : THIS.justAlias(t,a), 'used' : u, 'joins' : []});
			
		});


		var uses 		= function(b, a){
			return (b.used < a.used);
		}

		T.sort(uses);
		
		return T;
		
	}

	
	getJoinObject(a){
	
		var tj		= this.tempJoins;
		var aList	= [];
		
		for(var i = 0 ; i < a.length ; i++){
			
			var s	= a[i].split(' ');
			
			aList.push(s[0]);
			aList.push(s[s.length - 1]);
		}
		
		for(var i = 0 ; i < tj.length ; i++){
			
			var o	= tj[i];
			
			var j	= this.justAlias(o.tables[0], o.aliases[0]);
			var J	= this.justAlias(o.tables[1], o.aliases[1]);
			
			if(aList.indexOf(j) != -1 || aList.indexOf(J) != -1){
				
				var r	= this.tempJoins.splice(i, 1);
				
				return [true,o];
				
			}
			
		}
		
		return [false,{}];
		
	}

	
	
	
	getJoinObjects(){
		
		var r		= this.joins;													//-- JOIN
		var j		= [];
		var J		= [];
			
		for (var k in r){
		
			var R	= r[k];
			var T	= R.fromtable;
			var t	= R.totable;
			var A	= R.fromalias;
			var a	= R.toalias;
			var B	= this.justAlias(R.fromtable, R.fromalias);
			var b	= this.justAlias(R.totable, R.toalias);
			var n	= String(B + '.' + R.fromfield +  ' = ' + b + '.' + R.tofield);
			var id	= [B, b].sort().join('--');
			
			if(j[id] === undefined){
				
				j[id]	= {
					'tables' 	: [T, t], 
					'aliases' 	: [A, a], 
					'type' 		: R.join, 
					'joins' 	: [n],
					'used'		: false
				};
				
			}else{
				j[id].joins.push(n);
				
				if(R.type == 'LEFT'){
					R.type = 'LEFT';
				}
				
			}
			
		}
			
		for (var k in j){
			J.push(j[k]);
		}
		
		return J;
		
	}


	fromAlias(t, a){

		if(a == t){
			return t;
		}else{
			return t + ' AS ' + a;
		}
		
	}

	buildAlias(t, a){

		if(a == ''){
			return t;
		}else{
			return t + ' AS ' + a;
		}
		
	}
	

	justAlias(t, a){
		
		if(a == ''){
			return t;
		}else{
			return a;
		}
		
	}
	

	refreshJoins(r){										//-- build objects to draw relationship lines  from
	
		this.joins	= [];
		
		for (var k in r){
			
			var I		= String(k).split('--')[0];
			var i		= String(k).split('--')[1];

			var B		= String(I).split('_')[2];
			var b		= String(i).split('_')[2];

			var T		= $('#tablename' + B).html();
			var A		= $('#alias' + B).val();
			var F		= $('#' + I).html();
			
			var t		= $('#tablename' + b).html();
			var a		= $('#alias' + b).val();
			var f		= $('#' + i).html();
			
			var o	= 	{
				
						'from' 		: I, 
						'fromtable'	: T,
						'fromalias'	: A,
						'fromfield' : F, 

						'to' 		: i, 
						'totable'	: t,
						'toalias'	: a,
						'tofield' 	: f, 

						'join' 		: r[k],
						
						};
						
			this.joins[I + '--' + i]	= o;

		}

	}

	
	buildClauses(){
		
		var o 		= function(b, a){														//-- used to order clauses
			return (b[1] + 10000 + Number(b[4])) - (a[1] + 10000 + Number(a[4]));
		}
		
		var T		= '';
		var F		= '';
		var C		= '';
		var S		= '';
		var WHERE	= [];
		var ORDERBY	= [];
		var GROUPBY	= [];
		var HAVING	= [];
		var c		= parent.nuFORM.subform('zzzzsys_select_clause_sf').rows;

		c.sort(o);

		var clauses	= '';
		
		for(var i = 0 ; i < c.length ; i++){
			
			var T	= c[i][1];
			var F	= c[i][2];
			var C	= c[i][3];
			var S	= c[i][4];
			var D	= c[i][6];
			var cl	= F != '' && C != '';			//-- valid statement for WHERE and HAVING
			var gr	= F != '' && S != '';			//-- valid statement for ORDER BY and GROUP BY

			if(D == 0){
				
				if(T == 1 && cl){WHERE.push('(' + F + ' ' + C + ')');}
				if(T == 4 && cl){HAVING.push('(' + F + C + ')');}
				if(T == 2 && gr){GROUPBY.push(F + ' ' + S);}
				if(T == 3 && gr){ORDERBY.push(F + ' ' + S);}
				
			}

		}

		if(WHERE.length > 0){clauses	+= "\n\nWHERE\n    ("	+ WHERE.join(" AND \n    ") 	+ ")\n";}
		if(GROUPBY.length > 0){clauses	+= "\nGROUP BY\n    " 	+ GROUPBY.join(",\n    ") 		+ "\n";}
		if(HAVING.length > 0){clauses	+= "\nHAVING\n    " 	+ HAVING.join(" AND \n    ") 	+ "\n";}
		if(ORDERBY.length > 0){clauses	+= "\nORDER BY\n    " 	+ ORDERBY.join(",\n    ") 		+ "\n";}

		return clauses;
		
	}


	boxWidth(s, t){
		
		var s	= parent.nuFORM.tableSchema
		var n	= s[t].names;
		var w	= nuGetWordWidth(t) + 130;
		
		for(var i = 0 ; i < s[t].names.length ; i++){
			w	= Math.max(w, nuGetWordWidth(s[t].names[i]));
		}
		
		return w;

	}
	

	boxRow(i, v, t, w){
			
		this.boxColumn('select', i, 0, 	18,	v, '');
		this.boxColumn('field', i, 22, 	300,v,  t, w);
		
	}
	
	
	boxColumn(c, t, l, w, v, title){

		var suf		= '_' + t + '_' + this.boxID;

		if(c == 'select'){
			var col	= document.createElement('input');
		}else{
			var col	= document.createElement('span');
		}
		
		col.setAttribute('id', c + suf);
		
		$('#' + this.scrollID).append(col);
		
		$('#' + col.id)
		.css({
			'position'	: 'absolute',
			'width'		: w,
			'top'		: t * 18,
			'left'		: l,
		})
		.attr('title', title);

		if(c == 'select'){			//-- checkbox

			$('#' + col.id)
			.attr('data-nu-field', 'field' + suf)
			.attr('onchange', 'window.nuSQL.buildSQL("field","' + this.boxID + '")')
			.attr('type', 'checkbox')
			.addClass(this.boxID)
			.addClass('checkfield');
			
		}else{

			$('#' + col.id)
			.addClass('nuBoxTitle')
			.addClass('nuBoxField')
			.addClass(this.boxID)
			.css('width', Number(w))
			.css('padding-top', 2)
			.hover(
			
				function(event){
					if(event.buttons == 1 && window.nuCurrentID != ''){
						
						$(this).css('color','green');
						$(this).css('cursor','e-resize');
						
					}else{
						
						$(this).css('color','red');
						$(this).css('cursor','e-resize');
						
					}
				}, 
				function() {

					$(this).css('color','');
					$(this).css('cursor','default');
					
				})
				
			.html(v);
			
		}
		
	}
	
	buildJSON(){
		
		var j				= {};
		var a				= [];
		var THIS 			= this;
		
		$('.nuBox').each(function(index){
			
			var i			= $(this)[0].id;
			var o			= {}
			
			o.id			= i;
			o.position		= $(this).position();
			o.tablename		= $('#tablename' + i).html();
			o.alias			= $('#alias' + i).val();
			o.checkall		= $('#checkall' + i).is(':checked');
			o.checkboxes	= THIS.getCheckboxes(i);
			
			a.push(o);
			
		});

		j.tables			= a;
		var joins			= {};
		var r				= this.joins;
		
		for (var k in r){
			
			var jFrom		= r[k].from;
			var jTo			= r[k].to;
			var jJoin		= r[k].join;
			
			joins[jFrom + '--' + jTo]	= jJoin;
			
		}
		
		j.joins				= joins;

		return JSON.stringify(j);
		
	}

	addJoinsToJSON(){
		
	}

	
	getCheckboxes(b){

		var c		= [];
		
		$(':checkbox.' + b).each(function(index){
			c.push($(this).is(':checked'));
		});
		
		return c;
		
	}
	
	
	getJoins(){
		
		var a						= [];
		var j						= [];
		var r						= this.joins;
		
		for (var k in r){
			
			a[r[k].from + '--' + r[k].to]	= r[k];
			j.push(a[r[k].from + '--' + r[k].to]);
			
		}

		return this.joins;
		
	}
	
	rebuildGraphic(){
		
		var j		= $('#sse_json', parent.document).val();

		if(j == '' || j === undefined){return true;}
		
		var J		=	JSON.parse(j);
		
		for(var i = 0 ; i < J.tables.length ; i++){	
		
			if(typeof(parent.nuFORM.tableSchema[J.tables[i].tablename]) == 'undefined'){
				
				nuMessage(['No table named <b>' + J.tables[i].tablename + '</b>.']);
				
				return false;
				
			}
			
		}

		for(var i = 0 ; i < J.tables.length ; i++){	
			
			var t	= J.tables[i];
			var cb	= J.tables[i].checkboxes;
			
			this.addBox(t.tablename, t.id);
			
			$('#' + t.id)
			.css('top', t.position.top)
			.css('left', t.position.left);
			
			$('#tablename' 	+ t.id).html(t.tablename);
			$('#alias' 		+ t.id).val(t.alias);
			$('#checkall'	+ t.id).prop('checked', t.checkall);
			
			for(var c = 0 ; c < cb.length ; c++){
				$('#select_' + c + '_' + t.id).prop('checked', cb[c]);
			}
			
		}
		
		var r							= J.joins;				//-- JOIN
		
		for (var k in r){
			
			var I						= String(k).split('--')[0];
			var i						= String(k).split('--')[1];

			this.joins[I + '--' + i]	= r[k];

		}

		nuAngle();
		
		return true;
		
	}
	
	addJoin(key, v){

		var j		= parent.$('#sse_json').val();
		
		if(j == ''){
			var J 	= {'joins':[]};
		}else{
			var J	= JSON.parse(j);
		}

		J.joins[key] = v;
		
		var u	= JSON.stringify(J);
		
		parent.$('#sse_json').val(u);

	}
	
	
}




//=========functions==========================================================================

function nuUp(e){

	var el						= $(e.target);
	
	if(el.hasClass('nuTableName')){

		window.nuY	= parseInt($(e.target).parent().css('top'));
		window.nuX	= parseInt($(e.target).parent().css('left'));

	}

	if(el.hasClass('nuBoxField')){
		
		var id				= String(window.nuCurrentID);
		
		if(id.split('_').length == 3){							//-- eg. field_1_boxc14966188848055365
			
			var I				= id;
			var i				= e.target.id;
			
			if(I.split('_')[2] != i.split('_')[2]){				//-- different box
			
				nuSQL.addJoin(I + '--' + i, '')
				nuAngle();	
				
			}
			
		}

	}
	
	window.nuCurrentID	= '';
	
	nuSQL.buildSQL();
	
}


function nuDown(e){

	var el						= $(e.target);

	if(el.hasClass('nuRelationships')){
		
		nuChangeJoin(e);		
		return;

	}

	window.nuCurrentID			= e.target.id;
	
	if(el.hasClass('nuTableName')){

		window.nuY				= e.clientY - parseInt($(e.target).parent().css('top'));
		window.nuX				= e.clientX - parseInt($(e.target).parent().css('left'));

	}

}



function nuMove(e){

	if(window.nuCurrentID == ''){return;}

	var el						= $('#' + window.nuCurrentID);

	if(el.hasClass('nuTableName')){
		
		if(e.buttons == 1){
			
			if(e.clientY - window.nuY > 0){
				el.parent().css('top', e.clientY - window.nuY);
			}
			if(e.clientX - window.nuX > 0){
				el.parent().css('left', e.clientX - window.nuX);
			}
			
			nuAngle();
			
		}
		
	}
		
}


function nuAngle(){

	$('.nuRelationships').remove();

	var j			= parent.$('#sse_json').val();
	
	if(j == ''){return;}

	var J			= JSON.parse(j);
	var r			= J.joins;
	var ok			= [];
	
	for (var key in r){																//-- remove links to closed boxes
	
		var I		= key.split('--')[0];
		var i		= key.split('--')[1];

		if($('#' + I).length == 1 && $('#' + i).length == 1){
			ok[I + '--' + i]	= r[key]
		}

	}
	
	nuSQL.refreshJoins(ok);
	
	for (var key in nuSQL.joins){

		var F	= $('#' + nuSQL.joins[key].from);
		var T	= $('#' + nuSQL.joins[key].to);
		var f	= F.offset();
		var t	= T.offset();
		var d 	= Math.atan2(t.top - f.top, t.left - f.left) * 180 / Math.PI;		//-- angle in degrees
		var w	= Math.sqrt(Math.pow(f.top - t.top, 2) + Math.pow(f.left - t.left, 2));
		var i	= 'joins' + nuID();
		var jt	= nuSQL.joins[key].join;
		var lm	= 7;

		var L = document.createElement('div');										//-- relationship box (line)
		
		L.setAttribute('id', i);
		
		$('body').append(L);
		
		$('#' + L.id).css({
			'width'				: jt == 'LEFT' ? w - lm : w,
			'height'			: 6,
			'left'				: f.left,
			'top'				: f.top,
			'position'			: 'absolute',
			'text-align'    	: 'center',
			'border'			: 'rgba(255, 153, 0, .5) 0px solid',
			'border-left-width'	: jt == 'LEFT' ? lm : 0,
			'border-left-color'	: 'purple',
			'background-color'	: 'rgba(255, 153, 0, .5)',
			'transform'			: 'rotate(' + d + 'deg)',
		})
		.attr('data-nu-join', key)
		.attr('title', jt + ' JOIN ON ' + nuSQL.joins[key].fromfield + ' = ' + nuSQL.joins[key].tofield + ' (Click to Change Join)')
		.addClass('nuRelationships')
		.hover(function(){
			$(this).css('border-top-width', 2);
			$(this).css('border-bottom-width', 2);
			}, function(){
			$(this).css('border-top-width', 0);
			$(this).css('border-bottom-width', 0);
		});

		var L		= $('#' + L.id);
		var top 	= parseInt(f.top + f.top - L.top);
		var left	= parseInt(f.left + f.left - L.left);

		$('#' + i)
		.css('top', top)
		.css('left', left);
		
		
		var Ltop	= parseInt(L.css('top'));
		var Lleft	= parseInt(L.css('left'));

		if(F.offset().top < T.offset().top){
			L.css('top', 7 + Ltop + F.offset().top - L.offset().top);
		}else{
			L.css('top', 7 + Ltop + L.offset().top - F.offset().top);
		}
		
		if(F.offset().left < T.offset().left){
			L.css('left', -20 + Lleft - (L.offset().left - F.offset().left));
		}else{
			L.css('left', -20 + Lleft - (L.offset().left - T.offset().left));
		}

	}
	
}


function nuChangeJoin(e){
	
	var v			= parent.$('#sse_json').val();
	var j			= JSON.parse(v);
	var i			= $(e.target).attr('data-nu-join');

	if(j.joins[i] == ''){
		j.joins[i] 	= 'LEFT';
	}else{
		j.joins[i] 	= '';
	}

	parent.$('#sse_json')
	.val(JSON.stringify(j))
	.change();

	nuSQL.buildSQL();
	
}
