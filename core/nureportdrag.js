//-- object for dragging sections --//


function nuLoadReport(b){
	
	window.addEventListener("keydown", function(e) {

		if([38, 40].indexOf(e.keyCode) > -1) {					// space and arrow keys
			e.preventDefault();
		}
		
	}, false);

	if($('#nuDragDialog').length == 0){
		
		nuDIALOG.dialog = '';
		nuDIALOG.dialogX = 0;
		nuDIALOG.dialogY = 0;
		
	}else{
		
		nuDIALOG.dialogX = parseInt($('#nuDragDialog').css('left'));
		nuDIALOG.dialogY = parseInt($('#nuDragDialog').css('top'));
		
	}
	
	$('body').children().remove();

	window.nuDrag  = new nuCreateDrag();
	window.nuDragD = new nuCreateDialog('');
	window.nuDragR = new nuDragReport();

	if(nuDragID == 1000){
		nuDragR.setIds();
	}
	
	$('body').off('keydown');
	$('body').off('keyup');
	$('body').off('mousedown');
	$('body').off('mouseup');
	$('body').off('mousemove');
	
	$('body').on('mousedown.nudrag', function(event){nuDrag.down(event);});
	$('body').on('keydown.nudrag',   function(event){nuDrag.move(event);});
	$('body').on('keyup.nudrag',     function(event){nuDrag.up(event);});
	$('body').on('mouseup.nudrag',   function(event){nuDrag.up(event);});
	$('body').on('mousemove.nudrag', function(event){nuDrag.move(event);});
	
	$('body').on('mousedown.nureport', function(event){nuDragR.down(event);});
	$('body').on('keydown.nureport',   function(event){nuDragR.move(event);});
	$('body').on('keyup.nureport',     function(event){nuDragR.up(event);});
	$('body').on('mouseup.nureport',   function(event){nuDragR.up(event);});
	$('body').on('mousemove.nureport', function(event){nuDragR.move(event);});

	if(arguments.length == 0){
		
		var r 		= JSON.stringify(nuREPORT);
		nuBACKUP.push(JSON.parse(r));
		
	}
	
	nuDrag.createArea(150, 50, nuREPORT.width * 4, 600);
	nuDrag.isReport = true;
	nuDragR.createSectionHolder();
	nuDrag.setSelected();
	nuSetTools();	
	nuSetDialog();
	
}


function nuSetnuScroll(l){

	var flds = ['#fieldName', "[id^='sortField']"]
	
	for(var i = 0 ; i < flds.length ; i++){

		$( flds[i] )
		.addClass('nuScroll')
		.keydown(function() {
			nuFORM.scrollList(event, l);
		});	

	}

}



function nuDragReport(){

	this.groups     = [[10],[0,20],[1,19],[2,18],[3,17],[4,16],[5,15],[6,14],[7,13],[8,12],[9,11]];
	this.height     = 0;
	this.startX     = 0;
	this.startY     = 0;
	this.moveX      = 0;
	this.moveY      = 0;
	this.beingMoved = '';
	this.moveFrom   = 0;
	this.moveTo     = 0;
	this.sectionTop = 0;
	this.dragging   = false;

	
	this.getObject = function(id) {

		for(var g = 0 ; g < nuREPORT.groups.length ; g++){
			
			for(var s = 0 ; s < nuREPORT.groups[g].sections.length ; s++){
				
				for(var o = 0 ; o < nuREPORT.groups[g].sections[s].objects.length ; o++){
					
					if(nuREPORT.groups[g].sections[s].objects[o].id == id){return nuREPORT.groups[g].sections[s].objects[o];}
					
				}
			
			}
			
		}
			
	}

	
	this.getGroupAndSection = function(id) {

		for(var g = 0 ; g < nuREPORT.groups.length ; g++){
			
			for(var s = 0 ; s < nuREPORT.groups[g].sections.length ; s++){
				
				for(var o = 0 ; o < nuREPORT.groups[g].sections[s].objects.length ; o++){
					
					if(nuREPORT.groups[g].sections[s].objects[o].id == id){return [g,s];}
					
				}
			
			}
			
		}
			
	}


	this.setObject = function(O) {

		for(var g = 0 ; g < nuREPORT.groups.length ; g++){
			
			for(var s = 0 ; s < nuREPORT.groups[g].sections.length ; s++){
				
				for(var o = 0 ; o < nuREPORT.groups[g].sections[s].objects.length ; o++){
					
					
					if(nuREPORT.groups[g].sections[s].objects[o].id == O.id){
						
						nuREPORT.groups[g].sections[s].objects.splice(o, 1);
						nuREPORT.groups[g].sections[s].objects.push(O);
						
						return;
						
					}
				}
			}
		}
			
	}

	this.addObject = function(g, s, O) {

		nuREPORT.groups[g].sections[s].objects.push(O);
		
	}

	this.removeObject = function(i) {
		
		for(var g = 0 ; g < nuREPORT.groups.length ; g++){
			
			for(var s = 0 ; s < nuREPORT.groups[g].sections.length ; s++){
				
				for(var o = 0 ; o < nuREPORT.groups[g].sections[s].objects.length ; o++){
					
					if(nuREPORT.groups[g].sections[s].objects[o].id == i){
						
						nuREPORT.groups[g].sections[s].objects.splice(o, 1);
						return;
						
					}
				}
			}
		}
	}

	

	this.setIds = function() {

		for(var g = 0 ; g < nuREPORT.groups.length ; g++){
			
			for(var s = 0 ; s < nuREPORT.groups[g].sections.length ; s++){
				
				for(var o = 0 ; o < nuREPORT.groups[g].sections[s].objects.length ; o++){
					
					var i = this.newId();
					
					nuREPORT.groups[g].sections[s].objects[o].id   = i;
					nuREPORT.groups[g].sections[s].objects[o].name = i;
					
				}
			}
		}
	}

	this.newId = function() {

		nuDragID = nuDragID + 1;
		return 'obj' + nuDragID;

	}


	this.createSectionHolder = function() {

		this.height = 0;
		
		var e = document.createElement('div');

		e.setAttribute('id', 'nuSectionHolder');

		$('body').append(e);
		
		$('#nuSectionHolder').css({'position':'absolute', 'left':10, 'top':0, 'width':nuDrag.areaWidth(), 'top':nuDrag.areaTop(), 'background-color':'yellow', 'border-width':1,'border-style':'solid none none solid'});

		for(i = 1 ; i < this.groups.length ; i++){
			this.createSection(i, 0);
		}
		
		this.createSection(0, 0);
			
		for(i = this.groups.length - 1 ; i > 0 ; i--){
			this.createSection(i, 1);
		}
		
		nuDrag.areaHeight(this.height);
		nuDragR.areaHeight(this.height);

		$('#nuDragArea').css('border-style', 'solid solid none solid');
		$('body').css('height', this.sectionTop + 500);

	}

	this.areaHeight = function(a) {

		if(arguments.length == 1){
			return $('#nuSectionHolder').css('height', a);
		}
		return parseInt($('#nuSectionHolder').css('height'));

	}
	
	this.createSection = function(g, s) {
		
		var i        = this.groups[g][s];
		var S        = nuREPORT.groups[g].sections[s]
		
		var v        = S.height == 0  ? 'hidden'           : 'visible';
		var b        = S.height == 0  ? 'none'             : 'none none solid none';
		var w        = S.height == 0  ? 0                  : 1;
		var t        = 'Detail';
		
		this.height  = this.height + S.height;

		if(i < 10){t = nuREPORT.groups[g].sortField + ' Header';}
		if(i > 10){t = nuREPORT.groups[g].sortField + ' Footer';}
		
		if(S.height < 20){t = '';}
		
		var e = document.createElement('div');
		
		e.setAttribute('id', 'nuSectionLeft' + i);
		
		$('#nuSectionHolder').append(e);
		$('#nuSectionLeft' + i).css({'position':'absolute', 'top': this.sectionTop, 'width':140, 'height':S.height - 3, 'background-color':S.color, 'border-style':b, 'visibility':v});
		$('#nuSectionLeft' + i).addClass('nuSection');
		$('#nuSectionLeft' + i).html(t);
		
		if(S.height > 2){
			$('#nuSectionLeft' + i).append('<div id="nuLeftMove'+i+'" data-group="'+g+'" data-section="'+s+'" class="nuDragLine" title="Resize ' + S.label + ' " style="left:0px; bottom:0px; width:139px;">');
		}

		var e = document.createElement('div');
		
		e.setAttribute('id', 'nuSection' + i);
		
		$('#nuDragArea').append(e);
		$('#nuSection' + i).css({'position':'absolute', 'top': this.sectionTop, 'width':nuDrag.areaWidth(), 'height':S.height - 3, 'background-color':S.color, 'border-style':b, 'visibility':v});
		$('#nuSection' + i).attr({'data-group': g, 'data-section':s, 'data-order':i});
		$('#nuSection' + i).addClass('nuSection nuDragArea nuRight');
		
		for(var I = 0 ; I < S.objects.length ; I++){

			this.createObject(this.sectionTop, S.objects[I], i);
			
		}

		this.sectionTop = this.sectionTop + S.height;

	}
	
	this.createObject = function(t, o, i) {

		var w  = {B:'bold', N:'normal', I:'italic'};
		var id = o.id;
		var e  = document.createElement('div');
		
		e.setAttribute('id', id);

		$('#nuDragArea').append(e);

		$('#' + id).css({
						'position':'absolute', 
						'left':Number(o.left), 
						'top':Number(o.top) + Number(t), 
						'width':o.width, 
						'height':o.height, 
						'background-color':o.backgroundColor, 
						'z-index':o.zIndex, 
						'border-color':o.borderColor,
						'border-width':o.borderWidth,
						'border-style':'solid',
						'font-family':o.fontFamily,
						'font-weight':w[o.fontWeight],
						'text-align':o.textAlign,
						'font-size':o.fontSize + 'px',
						'color':o.fontColor
						});
						
		$('#' + id).addClass('nuDragObject');
		$('#' + id).html(o.fieldName);
		$('#' + id).attr('data-order', i);
		
	}

	this.adjustObjectsForMovedSection = function(event) {

			var m = event.clientY - this.moveFrom;
			var g = $(this.beingMoved).attr('data-group');
			var s = $(this.beingMoved).attr('data-section');
			
			this.resizeSection(g, s, m);

			nuLoadReport();

	}

	this.adjustSectionForMovedObjects = function(event) {

		nuDrag.getSelected();

		var sel = document.getElementsByClassName('nuDragSelected');
		var m   = nuDrag.multipleSections();
		var min = 30;
		var grp = 0;
		var sec = 0;
		
		var o,S,g,s,T;
		
		
		for(var i = 0 ; i < sel.length ; i ++){
			
			min      = Math.min(min, this.sectionOfObject(sel[i].id));
			
		}
		
		grp           = $('#nuSection'+min).attr('data-group');
		sec           = $('#nuSection'+min).attr('data-section');
		
		for(var i = 0 ; i < sel.length ; i ++){
			
			o        = this.getObject(sel[i].id);
			S        = this.sectionOfObject(sel[i].id);
			g        = $('#nuSection'+S).attr('data-group');
			s        = $('#nuSection'+S).attr('data-section');
			o.width  = nuRemovePX($('#' + o.id).css('width'));
			o.height = nuRemovePX($('#' + o.id).css('height'));
			o.left   = nuRemovePX($('#' + o.id).css('left'));
			
			this.removeObject(o.id);

			if(m){

				T        = nuRemovePX($('#nuSection'+S).css('top'));
				o.top    = nuRemovePX($('#' + o.id).css('top')) - T;
				
				$('#' + o.id).attr('data-order', S);
				this.addObject(g, s, o);
				this.resizeSection(g, s, 0);

			}else{

				T        = nuRemovePX($('#nuSection'+min).css('top'));
				o.top    = nuRemovePX($('#' + o.id).css('top')) - T;
				this.addObject(grp, sec, o);
				$('#' + o.id).attr('data-order', min);
				this.resizeSection(grp, sec, 0);

			}
			
		}
		
		nuLoadReport();
		
	}


	this.resetObjectProperties = function(p, v) {

		nuDrag.getSelected();

		var sel = document.getElementsByClassName('nuDragSelected');

		for(var i = 0 ; i < sel.length ; i ++){
			
			var o = this.getObject(sel[i].id);
			o[p]  = v;
			this.setObject(o)
			
		}
		
		nuLoadReport();
		
	}


	this.resizeSection = function(g, s, c) {

		var i = this.groups[g][s];
		var l = this.lowestSectionObject(g, s);
		var h = nuRemovePX($('#nuSection' + i).css('height'));
		var m = Math.max(c, l - h);

		nuREPORT.groups[g].sections[s].height = h + m + 3;
		
	}


	this.lowestSectionObject = function(g, s) {

		var i        = this.groups[g][s];
		var T        = nuRemovePX($('#nuSection' + i).css('top'));
		var a        = $("[data-order='"+i+"']").filter(".nuDragObject");
		var t        = 0;
		var h        = 0;
		var b        = 0;
		
		a.each(function() {
			
			t   = parseInt($( this ).css('top')) - T;
			h   = parseInt($( this ).css('height')) + (parseInt('0'+$( this ).css('border-width')) * 2);
			b   = Math.max(b, Number(t) + Number(h) + 1);
			
		});

		return b;
		
	}



	this.sectionOfObject = function(o) {

		var t = parseInt($('#'+o).css('top'));
		
		for(i = 0 ; i < 21 ; i++){
			
			T = parseInt($('#nuSection'+i).css('top'));
			
			if(T > t){
				return i-1;
			}
			
		}

		return 20;
		
	}




	this.move = function(event) {

		if($('#nuDragLine').length == 1){
			
			var s = document.getElementById('nuDragLine');
			var o = s.style;

			this.moveY  = event.clientY - this.startY;
			this.startY = event.clientY;
			
			var t = parseInt(o.top)  + this.moveY;
			
			o.top   = t + 'px';

		}
		
		if(event.ctrlKey && event.keyCode == 90){
			
			nuUndo();
			
		}
		
		if(event.keyCode == 46){

			if($('#nuDragDialog').length == 1){return;}
			
			var sel 			= document.getElementsByClassName('nuDragSelected');
			
			for(var i = 0 ; i < sel.length ; i ++){
				
				this.removeObject(sel[i].id);

			}
			
			nuREPORT.selected 	= [];
			
			nuLoadReport();
			
		}
		
	}



	this.inSection = function() {
	
		if($('#nuDragLine').length == 1){
			
			var s = document.getElementById('nuDragLine');
			var o = s.style;

			this.moveY  = event.clientY - this.startY;
			this.startY = event.clientY;
			
			var t = parseInt(o.top)  + this.moveY;
			
			o.top   = t + 'px';

		}
		
	}

	this.down = function(event) {

		var lc = window.nuLastClick[event.target.id];
		
		if(lc == undefined){
			window.nuLastClick[event.target.id] = Date.now();
		}else{
			if((Date.now() - lc) > 300){
				window.nuLastClick[event.target.id] = Date.now();
			}else{
				nuObjectDialog();
				return;
			}
		}
		

		if(event.buttons == 1 && (String(event.target.className).split(' ')[1]) == 'nuDragSelected'){
			
			this.dragging   = true;
			
		}
		
		if(String(event.target.id).substr(0,10) == 'nuLeftMove'){
			
			this.beingMoved   = '#' + event.target.id;
			this.moveFrom     = event.clientY;
			this.startY       = event.clientY;
			var e             = document.createElement('div');
			var t             = $(this.beingMoved).offset().top
			
			$(this.beingMoved).css('background-color','red');

			e.setAttribute('id', 'nuDragLine');

			$('body').append(e);
			$('#nuDragLine').css({'left':10, 'top':t, 'width':140 + nuDrag.areaWidth()});
			$('#nuDragLine').addClass('nuDragLine');
			
		}
		
	}

	this.up = function(event) {

		if(event.target.id == 'nuSelectBox' && String($('#dialogTitleWords').html()).substr(12) == 'Object Properties'){
			nuLoadReport();
		}
		
		if($('#nuDragLine').length == 1){
			
			this.adjustObjectsForMovedSection(event);
			
		}

		if(this.dragging){
	
			this.adjustSectionForMovedObjects(event);
			this.dragging   = false;
			
		}

	}

}

function nuSetDialog(){ //-- reopen Dialog at set to last position

	if(nuDIALOG.dialog != ''){
		
		window[nuDIALOG.dialog]();
		$('#nuDragDialog').css('left', nuDIALOG.dialogX);
		$('#nuDragDialog').css('top', nuDIALOG.dialogY);
		$('#' + nuREPORT.setFocus).focus();
		
	}

	
}

function nuSetTools(){
	
		var e  = document.createElement('div');
		var h = '';
		h = h + '<img id="nuItema"  onclick="nuUndo()" src="graphics/nu_undo.png" title="Undo" style="position:absolute;top:5px;left:5px;height:15px;width:15px">';
//		h = h + '<div id="nuItemU" onclick="nuUndo()" title="Undo" class="nuToolbar" style="width:80px">Undo<span style="font-weight:normal;font-size:12px;">('+(nuBACKUP.length-1)+')</span></div>';
		h = h + '<div id="nuItem0" onclick="nuNewObject()" class="nuToolbar">' 			+ opener.nuTranslate('New Object') + '</div>';
		h = h + '<div id="nuItem1" onclick="nuCloneObjects(false)" class="nuToolbar">' 	+ opener.nuTranslate('Clone Object') + '</div>';
		h = h + '<div id="nuItem7" onclick="nuSelectDialog()" class="nuToolbar">' 		+ opener.nuTranslate('Select Objects') + '</div>';
		h = h + '<div id="nuItem2" onclick="nuAdjustDialog()" class="nuToolbar">' 		+ opener.nuTranslate('Adjust Objects') + '</div>';
		h = h + '<div id="nuItem4" onclick="nuObjectDialog()" class="nuToolbar">' 		+ opener.nuTranslate('Object Properties') + '</div>';
		h = h + '<div id="nuItem3" onclick="nuGroupDialog()" class="nuToolbar">' 		+ opener.nuTranslate('Group Properties') + '</div>';
		h = h + '<div id="nuItem5" onclick="nuReportDialog()" class="nuToolbar">' 		+ opener.nuTranslate('Report Properties') + '</div>';
		h = h + '<div id="nuItem6" onclick="nuStringify()" class="nuToolbar">' 			+ opener.nuTranslate('Copy Changes') + '</div>';
		
		e.setAttribute('id', 'nuToolBar');
		$('body').prepend(e);

		$('#nuToolBar').css({
						'position'			: 'absolute', 
						'left'				: 10, 
						'top'				: 10, 
						'width'				: 1200, 
						'height'			: 25, 
						'background-color'	: 'lightgrey', 
						'font-size'			: 16
						});

		$('#nuToolBar').html(h);
		$('#nuToolBar').addClass('nuSection nuDragToolbar nuDragDialog');
		moveToolbar();
	
	
}

function moveToolbar(){
	
		$('#nuToolBar').css('top', window.scrollY + 10);
		
}

function nuNewObject(){
	
	nuREPORT.selected 	= [];
	var o             	= JSON.parse(JSON.stringify(nuOBJECT));
	var i             	= nuDragR.newId();
	var l             	= nuREPORT.groups[0].sections[0].objects.length;
	
	o.id   				= i;
	o.name 				= i;
	
	nuREPORT.groups[0].sections[0].objects[l] = o;
	nuREPORT.selected.push(i);

	nuLoadReport();

}
	

function nuCloneObjects(){

	nuREPORT.selected = [];

	var sel = document.getElementsByClassName('nuDragSelected');
	
	for(var i = 0 ; i < sel.length ; i ++){
		
		var o		= nuDragR.getObject(sel[i].id);
		var gs		= nuDragR.getGroupAndSection(sel[i].id);
		var g		= gs[0];
		var s		= gs[1];
		var l		= nuREPORT.groups[g].sections[s].objects.length;
		var d		= nuDragR.newId();
		var j	 	= JSON.parse(JSON.stringify(o));

		j.id		= d;
		j.name		= d;
		j.left		= Number(j.left) + 2;
		
		nuREPORT.groups[g].sections[s].objects[l] = j;
		nuREPORT.selected.push(d);
		
	}
	
	nuLoadReport();
		
}
	

function nuSelectDialog(){

	nuDIALOG.dialog = 'nuSelectDialog';

	nuDragD.createDialog(200, window.scrollY + 50, 700, 600, 'Select Objects');
	
	var e          = document.createElement('select');
	e.multiple     = 'multiple';
	e.setAttribute('id', 'nuObjectList');

	$('#nuDragDialog').append(e);
	
	$('#nuObjectList').css({
		'width'            : '620px',
		'height'           : '500px',
		'top'              : '60px',
		'left'             : '40px',
		'position'         : 'absolute',
		'font-family'      : 'Lucida Console',
		'z-index'          : 5000
	})
	
	.change(function() {
		
		$('.nuDragObject').removeClass('nuDragSelected');
		
		$("#nuObjectList > option:selected").each(function() {
			
			$('#' + this.value).addClass('nuDragSelected');
			
		});
	});


	var a       = [];
	var sel     = document.getElementsByClassName('nuDragObject');

	for(var o = 0 ; o < sel.length ; o ++){
			
		a[a.length] = new nuOrderedSelectObjects(sel[o].id);
			
	}
	
	a.sort(nuSortObjects);
	
	for(var i = 0 ; i < a.length ; i ++){
			
		var o   = $('#' + a[i].id);
		var sec = $('#nuSectionLeft' + o.attr('data-order')).html();
		var val = o.html();
		var sel = o.hasClass('nuDragSelected')  ? ' selected ' : '';
		
		$("#nuObjectList").append("<option "+ sel +" value='"+ a[i].id +"'>"+sec + " : " + a[i].id + " : " + val +"</option>") ;
		
	}

	$('#nuDragDialog').css('visibility','visible');
	$('#nuModal').remove();
		

}


function nuAdjustDialog(){

	nuDIALOG.dialog = 'nuAdjustDialog';
	
	nuDragD.createDialog(400, window.scrollY + 50, 400, 350, opener.nuTranslate('Adjust Selected Objects'));
	nuAdjustButton(80, 10, 'nuMoverAlignLeftClick()', 		opener.nuTranslate('Align To Left'), 		opener.nuTranslate('Align All Selected Objects To Left'));
	nuAdjustButton(80, 270, 'nuMoverAlignRightClick()', 	opener.nuTranslate('Align To Right'), 		opener.nuTranslate('Align All Selected Objects To Right'));
	nuAdjustButton(65, 140, 'nuMoverAlignTopClick()', 		opener.nuTranslate('Align To Top'), 		opener.nuTranslate('Align All Selected Objects To Top'));
	nuAdjustButton(100, 140, 'nuMoverAlignBottomClick()', 	opener.nuTranslate('Align To Bottom'), 		opener.nuTranslate('Align All Selected Objects To Bottom'));
	nuAdjustButton(155, 140,'nuMoverAdjustVerClick()' , 	opener.nuTranslate('Space Vertically'), 	opener.nuTranslate('Adjust All Selected Objects Vertically'));
	nuAdjustButton(190, 140,'nuMoverAdjustHorClick()' , 	opener.nuTranslate('Space Horizontally'), 	opener.nuTranslate('Adjust All Selected Objects Horizontally'));
	nuAdjustButton(250, 140,'nuResizeTallestClick()' , 		opener.nuTranslate('Tallest'), 				opener.nuTranslate('Resize to Tallest'));
	nuAdjustButton(265, 270,'nuResizeWidestClick()' , 		opener.nuTranslate('Widest'), 				opener.nuTranslate('Resize to Widest'));
	nuAdjustButton(265, 10,'nuResizeThinestClick()' , 		opener.nuTranslate('Thinnest'), 			opener.nuTranslate('Resize to Thinnest'));
	nuAdjustButton(285, 140,'nuResizeShortestClick()' , 	opener.nuTranslate('Shortest'), 			opener.nuTranslate('Resize to Shortest'));

	$('#nuDragDialog').css('visibility','visible');
	$('#nuModal').remove();
	
}

function nuAdjustButton(top, left, funct, value, title){

	var e = document.createElement('input');                           //-- create button
	
	e.setAttribute('id', 'bt_' + String(title).split(' ').join('_'));
	e.setAttribute('type', 'button');
	e.setAttribute('value',   value);
	e.setAttribute('title',   title);
	e.setAttribute('onclick', funct );
	
	$('#nuDragDialog').append(e);
	$('#' + e.id).addClass('nuButton');
	$('#nuDrag').append(e);
	$('#' + e.id).css({
		'width'				: 120,
		'height'			: 30,
		'font-size'			: '12px',
		'top'				: top,
		'left'				: left,
		'z-index'			: 5000,
		'position'			: 'absolute',
	})

}


function nuREPORTUpdate(p, v){
	
	var s = document.getElementsByClassName('nuDragSelected');
	
	for(var i = 0 ; i < s.length ; i ++){
		
	}
	
}


function nuMoverAlignLeftClick(){
	
	var s = document.getElementsByClassName('nuDragSelected');
	var l = 100000;
	
	for(var i = 0 ; i < s.length ; i ++){
		
		l = Math.min(l, parseInt(s[i].style.left));

	}
	
	$('.nuDragSelected').css('left', l);
	nuDragR.resetObjectProperties('left', l);

}


function nuMoverAlignRightClick(){
	
	var s 				= document.getElementsByClassName('nuDragSelected');
	var r 				= 0;
	nuDragR.dragging	= true;
	var gs				= nuDragR.getGroupAndSection(s[0].id);
	
	for(var i = 0 ; i < s.length ; i ++){
		
		var o 			= nuDragR.getObject(s[i].id);
		r				= Math.max(r, o.left + o.width - (o.borderWidth * 2));
		
	}
	
	for(var i = 0 ; i < s.length ; i ++){
		
		var o 			= nuDragR.getObject(s[i].id);
		o.left			= r - o.width - (o.borderWidth * 2);
		
		nuDragR.setObject(o);
		
	}
	
	nuLoadReport();

}


function nuMoverAlignTopClick(){
	
	var s 				= document.getElementsByClassName('nuDragSelected');
	var t 				= 100000;
	nuDragR.dragging	= true;
	var gs				= nuDragR.getGroupAndSection(s[0].id);
	
	for(var i = 0 ; i < s.length ; i ++){
		
		if(JSON.stringify(nuDragR.getGroupAndSection(s[i].id)) != JSON.stringify(gs)){
			return;
		}
		
		var o 			= nuDragR.getObject(s[i].id);
		t				= Math.min(t, o.top);
		
	}
	
	for(var i = 0 ; i < s.length ; i ++){
		
		var o 			= nuDragR.getObject(s[i]);
		s[i].top		= t;
		
		nuDragR.getObject(s[i]);
		
	}
	
	nuDragR.resetObjectProperties('top', t);
	
}



function nuMoverAlignBottomClick(){
	
	var s 				= document.getElementsByClassName('nuDragSelected');
	var b 				= 0;
	nuDragR.dragging	= true;
	var gs				= nuDragR.getGroupAndSection(s[0].id);
	
	for(var i = 0 ; i < s.length ; i ++){
		
		if(JSON.stringify(nuDragR.getGroupAndSection(s[i].id)) != JSON.stringify(gs)){
			return;
		}
		
		var o 			= nuDragR.getObject(s[i].id);
		b				= Math.max(b, o.top + o.height - (o.borderWidth * 2));
		
	}
	
	for(var i = 0 ; i < s.length ; i ++){
		
		var o 			= nuDragR.getObject(s[i].id);
		o.top			= b - o.height - (o.borderWidth * 2);
		
		nuDragR.setObject(o);
		
	}
	
	nuLoadReport();

}


function nuMoverAdjustVerClick(){

	var t = 10000000;
	var b = 0;
	var h = 0;
	var a = [];
	var o = {};
	var d = document.getElementsByClassName('nuDragSelected');
	nuDragR.dragging	= true;
	
	for(var i = 0 ; i < d.length ; i ++){
		
		o   = new nuOrderedSelectObjects(d[i].id);
		
		t   = Math.min(t, Number(o.top));                                                            //-- calculate highest top
		b   = Math.max(b, Number(o.top) + Number(o.height));                                          //-- calculate lowest bottom
		h   = h + Number(o.height);                                                                   //-- total height of objects
		
		a.push(o);

	}

	if(b-t < h){return;}
	
	var s = a.sort(function(A, B){return A.top - B.top;});
	var newGap = (b-t-h) / (a.length-1);
	var newTop  = t;
	
	for(var i = 0 ; i < s.length - 1 ; i++) {                                      //-- reposition all Objects ordered by highest (except the last one)

		$('#' + s[i].id).css('top', newTop);                                       //-- move object
		newTop  = newTop + newGap + Number(s[i].height);
	
	}

}



function nuMoverAdjustHorClick(){

	var l 				= 10000000;
	var b 				= 0;
	var w 				= 0;
	var a 				= [];
	var o 				= {};
	var d 				= document.getElementsByClassName('nuDragSelected');
	nuDragR.dragging	= true;
	
	for(var i = 0 ; i < d.length ; i ++){
		
		o   = new nuOrderedSelectObjects(d[i].id);
		
		l   = Math.min(l, Number(o.left));                                                            //-- calculate leftest left
		b   = Math.max(b, Number(o.left) + Number(o.width));                                          //-- calculate lowest bottom
		w   = w + Number(o.width);                                                                    //-- total width of objects
		
		a.push(o);

	}
	
	if(b-l < w){return;}
	
	var s = a.sort(function(A, B){return A.left - B.left;});
	var newGap = (b-l-w) / (a.length-1);
	var newLeft  = l;
	
	for(var i = 0 ; i < s.length - 1 ; i++) {                                      //-- reposition all Objects ordered by leftest (except the last one)

		$('#' + s[i].id).css('left', newLeft);                                      //-- move object
		newLeft  = newLeft + newGap + Number(s[i].width);
	
	}
	

}



function nuResizeWidestClick(){
	
	var s = document.getElementsByClassName('nuDragSelected');
	var w = 0;
	
	for(var i = 0 ; i < s.length ; i ++){
		
		w = Math.max(w, parseInt(s[i].style.width));

	}
	
	
	for(var i = 0 ; i < s.length ; i ++){
		
		if(parseInt(s[i].style.left) + w < nuDrag.areaWidth()){
			s[i].style.width = String(w) + 'px';
			
		}else{
			s[i].style.width = (nuDrag.areaWidth() - parseInt(s[i].style.left)) + 'px';
		}

	}
	
	nuDragR.resetObjectProperties('width', w);
	nuDragR.dragging	= true;

}




function nuResizeTallestClick(){
	
	var s = document.getElementsByClassName('nuDragSelected');
	var h = 0;
	
	for(var i = 0 ; i < s.length ; i ++){
		
		h = Math.max(h, parseInt(s[i].style.height));

	}

	if(nuDrag.multipleSections()){return;}
	
	for(var i = 0 ; i < s.length ; i ++){
		
		s[i].style.height = String(h) + 'px';

	}
	
	nuDragR.resetObjectProperties('height', h);
	nuDragR.dragging	= true;

}


function nuResizeThinestClick(){
	
	var s = document.getElementsByClassName('nuDragSelected');
	var w = 10000000;
	
	for(var i = 0 ; i < s.length ; i ++){
		
		w = Math.min(w, parseInt(s[i].style.width));

	}

	if(nuDrag.multipleSections()){return;}
	
	for(var i = 0 ; i < s.length ; i ++){
		
		s[i].style.width = String(w) + 'px';

	}
	
	nuDragR.resetObjectProperties('width', w);
	nuDragR.dragging	= true;

}



function nuResizeShortestClick(){
	
	var s = document.getElementsByClassName('nuDragSelected');
	var h = 10000000;
	
	for(var i = 0 ; i < s.length ; i ++){
		
		h = Math.min(h, parseInt(s[i].style.height));

	}

	if(nuDrag.multipleSections()){return;}
	
	for(var i = 0 ; i < s.length ; i ++){
		
		s[i].style.height = String(h) + 'px';

	}
	
	nuDragR.resetObjectProperties('height', h);
	nuDragR.dragging	= true;

}




function nuSortObjects(a,b){

	return ((a.order * 10000) + Number(a.top)) - ((b.order * 10000) + Number(b.top))

}

	
function nuOrderedSelectObjects(i){
	
	this.id      = i;
	this.order   = parseInt($('#' + i).attr('data-order'));
	this.top     = parseInt($('#' + i).css('top'));
	this.height  = parseInt($('#' + i).css('height'));
	this.left    = parseInt($('#' + i).css('left'));
	this.width   = parseInt($('#' + i).css('width'));
	
	return this;

}


function nuObjectDialog(){

	var S = document.getElementsByClassName('nuDragSelected');
	
	if(S.length == 0){return;}
	
	nuDIALOG.dialog = 'nuObjectDialog';
	
	nuDragD.createDialog(400, window.scrollY + 50, 450, 450, 'Object Properties');

	var D   = nuDragR.getObject(S[0].id);
	var top = 60;
	var fun = 'nuUpdateProperties';
	
	top = nuDialogInput('ID', 'id', top, 200, D, fun);
	$('#id').attr('disabled', true);
	top = nuDialogInput('Object Type', 'objectType', top, 200, D, fun, [['field','Field'],['label','Label'],['image','Image']]);
	top = nuDialogInput('Left', 'left', top, 200, D, fun);
	top = nuDialogInput('Top', 'top', top, 200, D, fun);
	top = nuDialogInput('Height', 'height', top, 200, D, fun);
	top = nuDialogInput('Width', 'width', top, 200, D, fun);
	top = nuDialogInput('Background Color', 'backgroundColor', top, 200, D, fun);
	top = nuDialogInput('Border Color', 'borderColor', top, 200, D, fun);
	top = nuDialogInput('Border Width', 'borderWidth', top, 200, D, fun);
	top = nuDialogInput('Field Name', 'fieldName', top, 200, D, fun);
	top = nuDialogInput('Font Color', 'fontColor', top, 200, D, fun);
//	top = nuDialogInput('Font Family', 'fontFamily', top, 200, D, fun, [['Helvetica','Helvetica'],['Arial','Arial'],['Courier','Courier'],['Times','Times'],['Symbol','Symbol']]);
	top = nuDialogInput('Font Family', 'fontFamily', top, 200, D, fun, window.nuFonts);
	top = nuDialogInput('Font Size', 'fontSize', top, 200, D, fun);
	top = nuDialogInput('Font Weight', 'fontWeight', top, 200, D, fun, [['','Normal'],['b','Bold'],['i','Italic']]);
	top = nuDialogInput('Format', 'format', top, 200, D, fun,  window.nuFormats);
	top = nuDialogInput('Text Align', 'textAlign', top, 200, D, fun, [['left','Left'],['right','Right'],['center','Center']]);
	top = nuDialogInput('Image', 'image', top, 200, D, fun);
	top = nuDialogInput('Minimum Rows', 'minRows', top, 200, D, fun);
	top = nuDialogInput('Maximum Rows', 'maxRows', top, 200, D, fun);
	top = nuDialogInput('Z Index', 'zIndex', top, 200, D, fun);
	
	nuBlankMultipleValues(S);
	$('#nuDragDialog').css('height', top + 20);

//    $("#nuDragDialog").append('<img src="./trash_can.png" height="17px" width="17px" id="deleteObject" value="Delete" onclick="deleteSelectedObjects()"/>');
	
	$("#deleteObject")
	.css('position','absolute')
	.css('top','7px')
	.css('right','5px');

	var t	= 'Field Name';
	
	if(D['objectType'] == 'image'){t	= 'Source';}
	if(D['objectType'] == 'label'){t	= 'Title';}

	$('#caption_fieldName330').html(t);
/*	
	if(D['objectType'] == 'image'){
		nuSetnuScroll(window.nuImages);
	}else{
		nuSetnuScroll(window.nuTT);
	}

*/

	
	if(D['objectType'] == 'image'){
		nuSetnuScroll(window.nuImages);
	}
	
	if(D['objectType'] == 'field'){
		nuSetnuScroll(window.nuTT);
	}
	
	if(D['objectType'] == 'label'){
		nuSetnuScroll([["KEEP EXACT HEIGHT"]]);
	}
	

	$('#nuDragDialog').css('visibility','visible');
	$('#nuModal').remove();

}

function deleteSelectedObjects(){
	
	var sel 			= document.getElementsByClassName('nuDragSelected');
			
	for(var i = 0 ; i < sel.length ; i ++){
		
		window.nuDragR.removeObject(sel[i].id);

	}
	
	nuREPORT.selected	= [];
	nuLoadReport();
	
}

function findWithAttr(array, attr, value) {
    for(var i = 0; i < array.length; i += 1) {
        if(array[i][attr] === value) {
            return i;
        }
    }
}

function nuBlankMultipleValues(S){
	
	var f = nuDragR.getObject(S[0].id);  //-- first Object
	var k = Object.keys(f);
	
	for(var i = 0 ; i < k.length ; i ++){
		
		var v = f[k[i]];
		
		for(I = 1 ; I < S.length ; I++){

			var o = nuDragR.getObject(S[I].id);
			
			if(f[k[i]] != o[k[i]]){$('#' + k[i]).val('');}
			
		}
		
	}
	
}


function nuReportDialog(){

	nuDragD.createDialog(400, window.scrollY + 50, 450, 450, 'Report Properties');


	var top = 60;
	var fun = 'nuUpdateReport';
	
	nuDIALOG.dialog = 'nuReportDialog';
	

	top = nuDialogInput('Width', 'width', top, 180, nuREPORT, 'nuDoNothing');
	top = nuDialogInput('Height', 'height', top, 180, nuREPORT, 'nuDoNothing');
	top = nuDialogInput('Paper', 'paper', top, 180, nuREPORT, fun, [['A4','A4'],['A5','A5'],['Letter','Letter'],['Legal','Legal']]);
	top = nuDialogInput('Orientation', 'orientation', top, 180, nuREPORT, fun, [['P','Portrait'],['L','Landscape']]);
	
	$('#width').attr('disabled', true);
	$('#height').attr('disabled', true);

	$('#nuDragDialog').css('height', top + 20);
	$('#nuDragDialog').css('visibility','visible');

	$('#nuModal').remove();

}


function nuGroupDialog(){

	nuDIALOG.dialog = 'nuGroupDialog';
	
	nuDragD.createDialog(400, window.scrollY + 50, 650, 750, 'Group Properties');


	var top = 60;
	var left = 120;
	var fun = 'nuUpdateGroup';

	top = nuDialogInput('', 'sortField', top, left, nuREPORT.groups[1], 'nuDoNothing');
	$('#sortField').attr({'id' : 'sortField1', 'readonly' : true, 'data-group' : 1}).css('background-color','#DFDFDF').click(function(){nuClickGroup(this);});
	top = nuDialogInput('', 'sortField', top, left, nuREPORT.groups[2], 'nuDoNothing');
	$('#sortField').attr({'id' : 'sortField2', 'readonly' : true, 'data-group' : 2}).css('background-color','#DFDFDF').click(function(){nuClickGroup(this);});
	top = nuDialogInput('', 'sortField', top, left, nuREPORT.groups[3], fun);
	$('#sortField').attr({'id' : 'sortField3', 'data-group' : 3}).click(function(){nuClickGroup(this);});
	top = nuDialogInput('', 'sortField', top, left, nuREPORT.groups[4], fun);
	$('#sortField').attr({'id' : 'sortField4', 'data-group' : 4}).click(function(){nuClickGroup(this);});
	top = nuDialogInput('', 'sortField', top, left, nuREPORT.groups[5], fun);
	$('#sortField').attr({'id' : 'sortField5', 'data-group' : 5}).click(function(){nuClickGroup(this);});
	top = nuDialogInput('', 'sortField', top, left, nuREPORT.groups[6], fun);
	$('#sortField').attr({'id' : 'sortField6', 'data-group' : 6}).click(function(){nuClickGroup(this);});
	top = nuDialogInput('', 'sortField', top, left, nuREPORT.groups[7], fun);
	$('#sortField').attr({'id' : 'sortField7', 'data-group' : 7}).click(function(){nuClickGroup(this);});
	top = nuDialogInput('', 'sortField', top, left, nuREPORT.groups[8], fun);
	$('#sortField').attr({'id' : 'sortField8', 'data-group' : 8}).click(function(){nuClickGroup(this);});
	top = nuDialogInput('', 'sortField', top, left, nuREPORT.groups[9], fun);
	$('#sortField').attr({'id' : 'sortField9', 'data-group' : 9}).click(function(){nuClickGroup(this);});
	top = nuDialogInput('', 'sortField', top, left, nuREPORT.groups[10], fun);
	$('#sortField').attr({'id' : 'sortField10', 'data-group' : 10}).click(function(){nuClickGroup(this);});
	top = nuDialogInput('', 'sortField', top, left, nuREPORT.groups[0], fun);
	$('#sortField').attr({'id' : 'sortField0', 'readonly' : true, 'data-group' : 0}).css('background-color','#DFDFDF').click(function(){nuClickGroup(this);});

	var top = 120;
	var left = left + 210;
	
	top = nuDialogInput('', 'sortBy', top, left, nuREPORT.groups[3], 'nuDoNothing', [['a','Ascending'],['d','Descending']]);
	$('#sortBy').attr('id', 'sortBy3').css('width',105);
	top = nuDialogInput('', 'sortBy', top, left, nuREPORT.groups[4], 'nuDoNothing', [['a','Ascending'],['d','Descending']]);
	$('#sortBy').attr('id', 'sortBy4').css('width',105);
	top = nuDialogInput('', 'sortBy', top, left, nuREPORT.groups[5], 'nuDoNothing', [['a','Ascending'],['d','Descending']]);
	$('#sortBy').attr('id', 'sortBy5').css('width',105);
	top = nuDialogInput('', 'sortBy', top, left, nuREPORT.groups[6], 'nuDoNothing', [['a','Ascending'],['d','Descending']]);
	$('#sortBy').attr('id', 'sortBy6').css('width',105);
	top = nuDialogInput('', 'sortBy', top, left, nuREPORT.groups[7], 'nuDoNothing', [['a','Ascending'],['d','Descending']]);
	$('#sortBy').attr('id', 'sortBy7').css('width',105);
	top = nuDialogInput('', 'sortBy', top, left, nuREPORT.groups[8], 'nuDoNothing', [['a','Ascending'],['d','Descending']]);
	$('#sortBy').attr('id', 'sortBy8').css('width',105);
	top = nuDialogInput('', 'sortBy', top, left, nuREPORT.groups[9], 'nuDoNothing', [['a','Ascending'],['d','Descending']]);
	$('#sortBy').attr('id', 'sortBy9').css('width',105);
	top = nuDialogInput('', 'sortBy', top, left, nuREPORT.groups[10], 'nuDoNothing', [['a','Ascending'],['d','Descending']]);
	$('#sortBy').attr('id', 'sortBy10').css('width',105);
	
	var top = 430;
	var left = left - 100;
	
	top = nuDialogInput('Section Name', 'label', top, left, nuREPORT.groups[nuDIALOG.groupNumber].sections[0], 'nuDoNothing');
	$('#label').attr('id', 'label0').attr('readonly', true).css('background-color','#DFDFDF');
	top = nuDialogInput('Section Height', 'height', top-5, left, nuREPORT.groups[nuDIALOG.groupNumber].sections[0], 'nuUpdateSectionProperty');
	$('#height').attr({'id' : 'height0', 'data-property' : 'height', 'data-section' : '0'});
//	top = nuDialogInput('Section Color', 'color', top-5, left, nuREPORT.groups[nuDIALOG.groupNumber].sections[0], 'nuUpdateSectionProperty');
//	$('#color').attr({'id' : 'color0', 'data-property' : 'color', 'data-section' : '0'});
	top = nuDialogInput('Page Break', 'page_break', top-5, left, nuREPORT.groups[nuDIALOG.groupNumber].sections[0], 'nuUpdateSectionProperty', [['0','No'],['1','Yes']]);
	$('#page_break').attr({'id' : 'page_break0', 'data-property' : 'page_break', 'data-section' : '0'});

	var top = 550;
	
	if(nuREPORT.groups[nuDIALOG.groupNumber].sections.length == 2){

		top = nuDialogInput('Section Name', 'label', top, left, nuREPORT.groups[nuDIALOG.groupNumber].sections[1], 'nuDoNothing');
		$('#label').attr('id', 'label1').attr('readonly', true).css('background-color','#DFDFDF');
		top = nuDialogInput('Section Height', 'height', top-5, left, nuREPORT.groups[nuDIALOG.groupNumber].sections[1], 'nuUpdateSectionProperty');
		$('#height').attr({'id' : 'height1', 'data-property' : 'height', 'data-section' : '1'});
//		top = nuDialogInput('Section Color', 'color', top-5, left, nuREPORT.groups[nuDIALOG.groupNumber].sections[1], 'nuUpdateSectionProperty');
//		$('#color').attr({'id' : 'color1', 'data-property' : 'color', 'data-section' : '1'});
		top = nuDialogInput('Page Break', 'page_break', top-5, left, nuREPORT.groups[nuDIALOG.groupNumber].sections[1], 'nuUpdateSectionProperty', [['0','No'],['1','Yes']]);
		$('#page_break').attr({'id' : 'page_break0', 'data-property' : 'page_break', 'data-section' : '1'});

	}
	
	nuMoveGroup();
	
	$('#nuDragDialog').css('height', top + 20);
	$('#nuDragDialog').css('visibility','visible');

	nuSetnuScroll(window.nuTT);

	$('#nuModal').remove();
	
}




function nuMoveGroup(){

		var e = document.createElement('button');  
		e.setAttribute('id', 'grpup');
		$('#nuDragDialog').append(e);
		
		$('#' + e.id).css({'font-size':10,'position':'absolute','left':15,'top':150,'width':90,'height':30}).html(opener.nuTranslate('Move Up'));
		$('#' + e.id).click(function(){	nuMoveReportGroup(nuDIALOG.groupNumber, -1);});

		var e = document.createElement('button');  
		e.setAttribute('id', 'grpdn');
		$('#nuDragDialog').append(e);
		
		$('#' + e.id).css({'font-size':10,'position':'absolute','left':15,'top':200,'width':90,'height':30}).html(opener.nuTranslate('Move Down'));
		$('#' + e.id).click(function(){	nuMoveReportGroup(nuDIALOG.groupNumber, 1);});

}


function nuDialogInput(cap, id, top, left, val, fun, sel){

    if(cap != ''){
        var e = document.createElement('span');  
        e.setAttribute('id', 'caption_' + id + top);
        $('#nuDragDialog').append(e);
		
        $('#' + e.id).css({
						'position'    : 'absolute',
						'left'        : left-210,
						'top'         : top,
						'width'       : 200,
						'font-family' : 'helvetica',
						'text-align'  : 'right'
						});
		
        $('#' + e.id).html(opener.nuTranslate(cap));
    }

	if(arguments.length == 7){
		var e = document.createElement('select');  
		var ew = 4;
	}else{
		var e = document.createElement('input');  
		var ew = 0;
	}
    e.setAttribute('id', id);
    
    $('#nuDragDialog').append(e);
	
    $('#' + e.id).css({
					'position'    : 'absolute',
					'left'        : left,
					'top'         : top,
					'width'       : 200 + ew,
					'font-family' : 'helvetica',
					'font-size'   : '14px'
					});
							
	$('#' + e.id).change(function(){
		window[fun](this);
	});
		
	if(arguments.length == 7){

		for(var i = 0 ; i < sel.length ; i++){
			
			if(String(sel[i][0]).includes("'")){
				$('#' + id).append('<option value="'+ sel[i][0] +'">' + sel[i][1] + "</option>") ;
			}else{
				$('#' + id).append("<option value='"+ sel[i][0] +"'>" + sel[i][1] + "</option>") ;
			}
			
		}
		
	}

    $('#' + e.id).val( val[id]);
	
	return top + 30;
    
}

function nuUpdateGroup(t){
	
		var g = $('#' + t.id).attr('data-group');
		var G = nuREPORT.groups[g];
		var s = nuREPORT.groups[g].sections.length
		
		G.groupBy                  = $('#sortBy'     + g).val();
		G.sortField                = $('#sortField'  + g).val();
		
		for(var i = 0 ; i < s.length ; i++){
			G.sections[i].color        = $('#height' + i).val();
			G.sections[i].height       = $('#color' + i).val();
			G.sections[i].label        = 'Header ' + $('#label' + i).val();
			G.sections[i].page_break   = $('#page_break' + i).val();
			
			if(g == 0){G.sections[i].label  = 'Detail';}
			if(g == 1 && s == 0){G.sections[i].label  = $('#label' + i).val() + ' Header';}
			if(s == 1){G.sections[i].label  = $('#label' + i).val() + ' Footer';}
			
		}
		
	nuREPORT.setFocus = t.id;
	
	nuLoadReport();

	
}

	
function nuUpdateProperties(t){

	var sel 		= document.getElementsByClassName('nuDragSelected');
	nuDIALOG.dialog = 'nuObjectDialog';


	for(var i = 0 ; i < sel.length ; i ++){

		var o 		= nuDragR.getObject(sel[i].id);
		
		o[$(t).attr('id')]  = $(t).val();
		nuDragR.setObject(o);
		
	}

	nuREPORT.setFocus = $(t).attr('id');

	nuLoadReport();
	
}

function nuDoNothing(t){

}



function nuUpdateReport(t){

	var p        = $('#paper').val() + $('#orientation').val();
	var a        = [];
	
	a['A4P']     = [['297'],['210']];
	a['A5P']     = [['210'],['148']];
	a['LetterP'] = [['279.4'],['215.9']];
	a['LegalP']  = [['355.6'],['215.9']];
	a['A4L']     = [['210'],['297']];
	a['A5L']     = [['148'],['210']];
	a['LetterL'] = [['215.9'],['279.4']];
	a['LegalL']  = [['215.9'],['355.6']];

	
    nuREPORT[$(t).attr('id')] = $(t).val();
    nuREPORT['height']        = Number(a[p][0][0]);
    nuREPORT['width']         = Number(a[p][1][0]);
	
	nuREPORT.setFocus = $(t).attr('id');
	
	nuLoadReport();

}

function nuUndo(){

	if(nuBACKUP.length > 1){
		
		nuBACKUP.splice(nuBACKUP.length - 1, 1);
		nuREPORT = nuBACKUP[nuBACKUP.length - 1]
		
		nuLoadReport(1);
		
	}
	
}


function nuClickGroup(t){
	
	var g = $(t).attr('data-group');
	
	if(g > 0 && $('#sortField' + (g - 1)).val() == ''){
		nuLoadReport(1);
		return;
	}
	
	nuDIALOG.groupNumber = g;
	
	nuREPORT.groups[g].sections[0].label = $(t).val() + ' Header';
	
	if(nuREPORT.groups[g].sections.length == 2){
		nuREPORT.groups[g].sections[1].label = $(t).val() + ' Footer';
	}
	
	nuREPORT.setFocus = $(t).attr('id');
	
	nuLoadReport(1);
	
}



function nuUpdateSectionProperty(t){

	var g = nuDIALOG.groupNumber;
	var s = $(t).attr('data-section');
	var p = $(t).attr('data-property');
	var v = $(t).val();
	var o = {};
	
	if(p == 'height'){
		
		v = Math.max(v, nuDragR.lowestSectionObject(g, s));
		
	}
	
	nuREPORT.groups[g].sections[s][p] = v;
	
	nuREPORT.setFocus = $(t).attr('id');
	
	nuLoadReport();

}



function nuMoveReportGroup(ele, dir) {
	
	var groupNumber = Number(ele);
	if(dir == 1) {
		if(groupNumber >= 10 || nuREPORT.groups[groupNumber + 1].sortField == '') {
			return;
		} else {
			var tempObj = nuREPORT.groups[groupNumber];
			nuREPORT.groups[groupNumber] = nuREPORT.groups[groupNumber + 1];
			nuREPORT.groups[groupNumber + 1] = tempObj;
			nuREPORT.setFocus= $('#sortField' + (groupNumber + 1)).attr('id');
			nuDIALOG.groupNumber = groupNumber + 1;
		}
	} else if(dir == -1) {
		if(groupNumber <= 3 || nuREPORT.groups[groupNumber - 1].sortField == '') {
			return;
		} else {
			var tempObj = nuREPORT.groups[groupNumber];
			nuREPORT.groups[groupNumber] = nuREPORT.groups[groupNumber - 1];
			nuREPORT.groups[groupNumber - 1] = tempObj;
			nuREPORT.setFocus= $('#sortField' + (groupNumber - 1)).attr('id');
			nuDIALOG.groupNumber = groupNumber - 1;
		}
	}
	
	nuLoadReport();

}


