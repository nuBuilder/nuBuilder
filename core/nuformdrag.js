function nuBindDragEvents(){

	$(document).on('mousemove.nuformdrag', function(e) {

		var draggable		= 0;

		if(window.nuFORM.breadcrumbs.length != -1) {

			if(window.nuFORM.getProperty('record_id') == '-2') {
				draggable	= 1;
			}

		}

		if(draggable) {

			if(e.stopPropagation) e.stopPropagation();
			if(e.preventDefault) e.preventDefault();

			e.cancelBubble	= true;
			e.returnValue	= false;

			if(e.buttons) {
				nuDragBox(e);
			}

		}

	});

	$(document).on('mousedown.nuformdrag', function(e) {

		window.startX		= e.clientX + window.scrollX;
		window.startY		= e.clientY + window.scrollY;
		window.moveX		= 0;
		window.moveY		= 0;

		var draggable		= 0;

		if(window.nuFORM.last != -1) {

			if(window.nuFORM.getProperty('record_id') == '-2') {
				draggable	= 1;
			}

		}

		if(draggable) {

			let id = e.target.id;

			if (id === '') return;

			isCb = $('#'+ id).hasClass('nuContentBoxFrame');

			if(e.target === document.body || isCb || e.target === $('#nuRECORD')[0]) {

				if(!(nuIsMacintosh() ? e.metaKey : e.ctrlKey)) {
					$('.nuDragSelected').removeClass('nuDragSelected');
				}

				nuCreateBox(e);

			} else {

				if(!(nuIsMacintosh() ? e.metaKey : e.ctrlKey) && !$('#'+ id).hasClass('nuDragSelected')) {
					$('.nuDragSelected').removeClass('nuDragSelected');
				}

				if($('#'+ id).attr('data-drag')) {
					$('#'+ id).addClass('nuDragSelected');
				}

			}

		}

		nuUpdateDragFieldsListbox();

	});

	$(document).on('mouseup.nuformdrag', function(e) {

		var draggable		= 0;

		if(window.nuFORM.last != -1) {

			if(window.nuFORM.getProperty('record_id') == '-2') {
				draggable	= 1;
			}

		}

		if(draggable) {

			if($('#nuSelectBox').length > 0) {
				nuRemoveBox((nuIsMacintosh() ? e.metaKey : e.ctrlKey));
			}

		}

		nuUpdateDragFieldsListbox();

	});

	var nuDragKeydownListener = function(e){

		if ((nuIsMacintosh() ? e.metaKey : e.ctrlKey) && e.key === "a") {
			nuSelectAllDragObjects();
			nuUpdateDragFieldsListbox();
			e.preventDefault();
			return;

		}

		var keyDirection = '';

		if(e.keyCode == 37){
			keyDirection	= 'left';
		} else if(e.keyCode == 39){
			keyDirection	= 'right';
		} else if(e.keyCode == 38){
			keyDirection	= 'up';
		} else if(e.keyCode == 40){
			keyDirection	= 'down';
		}

		if(keyDirection != ''){

			$('div.nuDragSelected').each(function(){

				var prop	= '';
				var val	= '';

				var t = $(this);
				var tLabel = $('#label_' + t.attr('id'));
				var cb = $('#frame_' + t.attr('id'));

				if(keyDirection == 'left'){

					if(e.shiftKey){

						prop = 'width';
						val = t.width() - 1;

					} else {

						prop = 'left';
						val = t.position().left - 1;
						if (tLabel.length !== 0) valLabel = tLabel.position().left - 1;

					}

				} else if(keyDirection == 'right'){

					if(e.shiftKey){

						prop = 'width';
						val	= t.width() + 1;

					} else {

						prop = 'left';
						val = t.position().left + 1;
						if (tLabel.length !== 0) valLabel = tLabel.position().left + 1;

					}

				} else if(keyDirection == 'up'){

					if(e.shiftKey){

						prop = 'height';
						val = cb.length == 0 ? t.height() - 1 : cb.height() -1;

					} else {

						prop = 'top';
						val = t.position().top - 1;
						if (tLabel.length !== 0) valLabel = tLabel.position().top - 1;

					}

				} else if(keyDirection == 'down'){

					if(e.shiftKey){

						prop = 'height';
						val = cb.length == 0 ? t.height() +1 : cb.height() +1;

					} else {

						prop = 'top';
						val = t.position().top + 1;
						if (tLabel.length !== 0) valLabel = tLabel.position().top + 1;

					}

				}

				if (!(prop == 'height' && t.hasClass('nu_contentbox'))) {
					t.css(prop,val+'px');
				}

				if ((prop == 'left' || prop == 'top') && (tLabel.length !== 0)) {
					tLabel.css(prop,valLabel+'px');
				}


				// ContentBox
				var cb = $('#frame_' + t.attr('id'));
				if (cb.length == 1) {
					if (prop == 'top') val += 18;
					cb.css(prop,val+'px');
				}

			});
		}
	}

	$(document).on('keydown.nuformdrag', nuDragKeydownListener);
	$(window.parent.document).on('keydown.nuformdrag', nuDragKeydownListener);

}

function nuUnbindDragEvents(){
	$(document).off('.nuformdrag');
}

function nuUpdateDragFieldsListbox(){

	$('#nuDragOptionsFields option:selected',window.parent.document.body).prop('selected',false);

	$('.nuDragSelected').each(function(){
		$('#nuDragOptionsFields option[id="drag_'+$(this).prop('id')+'"]',window.parent.document.body).prop('selected','selected');
	});

	nuCheckIfMovingTabOrderAllowed($('#nuDragOptionsFields',window.parent.document.body));
	nuCheckIfMovingFieldToOtherTabAllowed($('#nuDragOptionsFields',window.parent.document.body));
}

function nuCreateBox(event){

	var e			= document.createElement('div');

	e.setAttribute('id', 'nuSelectBox');

	$('body').append(e);

	$('#' + e.id).css({
		'width'				: 1,
		'height'			: 1,
		'top'				: event.clientY + window.scrollY,
		'left'				: event.clientX,
		'position'			: 'absolute',
		'border-style'		: 'dashed',
		'border-width'		: 1,
		'border-color'		: 'red',
		'z-index'			: '4000',
		'background-color'	: 'transparent'
	});

}

function nuDragBox(event) {

	window.lastMoveX	= window.moveX;
	window.lastMoveY	= window.moveY;
	window.moveX		= event.clientX - window.startX;
	window.moveY		= event.clientY - window.startY;

	if($('#nuSelectBox').length > 0) {
		nuResizeDrag(event);
	} else {

		if($('#nuSelectBox').length == 0 && nuCanMove()){
			nuMoveSelected();
		}

	}

}

function nuResizeDrag(event) {

	var selectBox = $('#nuSelectBox');
	var X = event.clientX - window.startX;
	var Y = event.clientY + window.scrollY - window.startY;

	if(X > 0) {

		selectBox.css({
			'width' : X
		});

	} else {

		selectBox.css({
			'width' : -1 * X,
			'left' : window.startX + X,
		});

	}

	if(Y > 0) {

		selectBox.css({
			'height' : Y
		});

	} else {

		selectBox.css({
			'height' : -1 * Y,
			'top' : window.startY + Y,
		});

	}

}

function nuAddDragSelected(t) {
	t.addClass('nuDragSelected');
}

function nuRemoveBox(ctrlKey) {

	var selectBox	= $('#nuSelectBox');

	var L			= parseInt(selectBox.css('left'), 10);
	var T			= parseInt(selectBox.css('top'), 10) - nuGetTopArea();
	var B			= T + parseInt(selectBox.css('height'), 10);
	var R			= L + parseInt(selectBox.css('width'), 10);

	selectBox.remove();

	var o = $('[data-drag]');

	if(!ctrlKey) {
		$('.nuDragSelected').removeClass('nuDragSelected');
	}

	var selectedTab = $('.nuTabSelected').length > 0 ? $('.nuTabSelected')[0].id.substring(5): 0;

	o.each(function(index) {

		if($(this).attr('data-nu-tab') == selectedTab) {
			var l	=		parseInt($(this).css('left'), 10);
			var t	=		parseInt($(this).css('top'), 10);
			var b	= t +	parseInt($(this).css('height'), 10);
			var r	= l +	parseInt($(this).css('width'), 10);

			//drag around selected objects points
			if(l >= L && l <= R && t >= T && t <= B) {
				nuAddDragSelected($(this));
			} else if(r >= L && r <= R && t >= T && t <= B) {
				nuAddDragSelected($(this));
			} else if(l >= L && l <= R && b >= T && b <= B) {
				nuAddDragSelected($(this));
			} else if(r >= L && r <= R && b >= T && b <= B) {
				nuAddDragSelected($(this));
			}

			//drag within selected objects points
			if(L >= l && L <= r && T >= t && T <= b) {
				nuAddDragSelected($(this));
			} else if(R >= l && R <= r && T >= t && T <= b) {
				nuAddDragSelected($(this));
			} else if(L >= l && L <= r && B >= t && B <= b) {
				nuAddDragSelected($(this));
			} else if(R >= l && R <= r && B >= t && B <= b) {
				nuAddDragSelected($(this));
			}

			//drag through object but not through any points
			if(L >= l && L <= r && T <= t && B >= b) {
				nuAddDragSelected($(this));
			} else if(L <= l && R >= r && T >= t && B <= b) {
				nuAddDragSelected($(this));
			}

		}

	});

}

function nuInitialiseDragState(){

	window.nuDragOptionsState		= {'tabs': []};

	var tabOrderCounter				= 10;

	$('div.nuTab[id^="nuTab"]').each(function(){

		var objects = {
			'tab_id': $(this).attr('data-nu-tab-id'),
			'objects': []
		};

		$('div#nuRECORD div[data-nu-tab="'+$(this).prop('id').replace('nuTab','')+'"]').each(function(){

			var objectPosition		= $(this).position();

			var objectProperties	= {

				'object_id': $(this).attr('data-nu-object-id'),
				'id': $(this).prop('id'),
				'left': objectPosition.left,
				'top': objectPosition.top,
				'width': $(this).width(),
				'height': $(this).height(),
				'tab_order': tabOrderCounter

			};

			objects.objects.push(objectProperties);
			tabOrderCounter		= tabOrderCounter + 10;

		});

		window.nuDragOptionsState.tabs.push(objects);

	});

}

function nuSetTabOrderDataAttrs(){

	var currentTabNo	= $('div.nuTabSelected[id^="nuTab"]').attr('data-nu-tab-filter');
	if (currentTabNo === undefined) currentTabNo = 0;

	for(var i=0; i<window.nuDragOptionsState.tabs[currentTabNo].objects.length; i++){

		var field		= window.nuDragOptionsState.tabs[currentTabNo].objects[i];

		$('#nuDragOptionsFields option[id="drag_'+field.id+'"]',window.parent.document.body).attr('data-nu-tab-order',field.tab_order);

	}

}

function nuMoveUpOrder(){

	var currentTabNo						= $('div.nuTabSelected[id^="nuTab"]', $('#nuDragDialog iframe').contents()).attr('data-nu-tab-filter');
	var currentSelectedFieldOption			= $('select#nuDragOptionsFields option:selected');

	for(var i=0; i<$('#nuDragDialog iframe')[0].contentWindow.nuDragOptionsState.tabs[currentTabNo].objects.length; i++){

		var field							= $('#nuDragDialog iframe')[0].contentWindow.nuDragOptionsState.tabs[currentTabNo].objects[i];

		if(field.id == currentSelectedFieldOption.prop('id').replace('drag_','')){

			// if it's at the top, dont re-order anything
			if(field.id == $('select#nuDragOptionsFields option')[0].id.replace('drag_',''))
				return;

			var previousFieldDOM			= $('select#nuDragOptionsFields option[data-nu-tab-order="'+(Number(currentSelectedFieldOption.attr('data-nu-tab-order'))-10)+'"]');
			var previousFieldSTATE			= nuFindFieldInState(currentTabNo, previousFieldDOM.prop('id').replace('drag_',''));

			field.tab_order					= Number(previousFieldDOM.attr('data-nu-tab-order'));
			previousFieldSTATE.tab_order	= field.tab_order + 10;

			$('option#drag_'+field.id).attr('data-nu-tab-order',field.tab_order);

			var previousFieldDOMID = previousFieldDOM.prop('id');
			previousFieldDOM.attr('data-nu-tab-order',previousFieldSTATE.tab_order);

			var previousFieldDOMHTML = $('option#'+previousFieldDOMID)[0].outerHTML;

			$('option#'+previousFieldDOMID).remove();
			$('option#drag_'+field.id).after(previousFieldDOMHTML);

		}

	}

}

function nuMoveDownOrder(){

	var currentTabNo					= $('div.nuTabSelected[id^="nuTab"]', $('#nuDragDialog iframe').contents()).attr('data-nu-tab-filter');
	var currentSelectedFieldOption		= $('select#nuDragOptionsFields option:selected');

	for(var i=0; i<$('#nuDragDialog iframe')[0].contentWindow.nuDragOptionsState.tabs[currentTabNo].objects.length; i++){

		var field						= $('#nuDragDialog iframe')[0].contentWindow.nuDragOptionsState.tabs[currentTabNo].objects[i];

		if(field.id == currentSelectedFieldOption.prop('id').replace('drag_','')){

			// if it's at the bottom, dont re-order anything
			if(field.id == $('select#nuDragOptionsFields option')[($('select#nuDragOptionsFields option').length-1)].id.replace('drag_','')){
				return;
			}

			var nextFieldDOM = $('select#nuDragOptionsFields option[data-nu-tab-order="'+(Number(currentSelectedFieldOption.attr('data-nu-tab-order'))+10)+'"]');
			var nextFieldSTATE = nuFindFieldInState(currentTabNo, nextFieldDOM.prop('id').replace('drag_',''));

			field.tab_order = Number(nextFieldDOM.attr('data-nu-tab-order'));
			nextFieldSTATE.tab_order = field.tab_order - 10;

			$('option#drag_'+field.id).attr('data-nu-tab-order',field.tab_order);

			var nextFieldDOMID = nextFieldDOM.prop('id');

			nextFieldDOM.attr('data-nu-tab-order',nextFieldSTATE.tab_order);

			var nextFieldDOMHTML = $('option#'+nextFieldDOMID)[0].outerHTML;

			$('option#'+nextFieldDOMID).remove();
			$('option#drag_'+field.id).before(nextFieldDOMHTML);

		}

	}

}

function nuFindFieldInState(tabNo, fieldID){

	for(var i=0; i<$('#nuDragDialog iframe')[0].contentWindow.nuDragOptionsState.tabs[tabNo].objects.length; i++){

		if($('#nuDragDialog iframe')[0].contentWindow.nuDragOptionsState.tabs[tabNo].objects[i].id == fieldID){
			return $('#nuDragDialog iframe')[0].contentWindow.nuDragOptionsState.tabs[tabNo].objects[i];
		}

	}

	return null;

}

function nuCreateDragOptionsBox(form){

	var dragOptionsBoxWidth		= 400;
	var dragOptionsBoxMinHeight	= 520;
	var wh	= nuFormWH();
	var w	= wh.width;

	var optionsBoxHTML = '<div id="nuDragOptionsBox" class="nuDragOptionsBox" style="width:'+(dragOptionsBoxWidth-80)+'px;height:100%;min-height:'+dragOptionsBoxMinHeight+'px;">'+
		'<div class="nuDragOptionsBoxContainer">'+
			'<div id="dragOptionsTitle" class="nuDragOptionsBoxTitle">Options</div>'+
			'<label for="nuDragOptionsFields" class="nuDragOptionsFieldsLabel">Object Tab Order</label>'+
			'<select multiple id="nuDragOptionsFields" class="nuDragOptionsFields" onchange="nuUpdateDragSelections(this);"></select>'+
				'<table>'+
					'<tbody>'+
						'<tr>'+
							'<td><button id="move_up_btn" class="nuDragOptionsButton nuButton" onclick="nuMoveUpOrder();"><i class="nuDragOptionsIcon fa fa-arrow-up"></i> Up</button></td>'+
							'<td><button id="move_top_btn" class="nuDragOptionsButton nuButton" onclick="nuAlignTop();"><i class="nuDragOptionsIcon270 fa fa-step-forward"></i> Top</button></td>'+
						'</tr>'+
						'<tr>'+
							'<td><button id="move_down_btn" class="nuDragOptionsButton nuButton" onclick="nuMoveDownOrder();"><i class="nuDragOptionsIcon fa fa-arrow-down"></i> Down</button></td>'+
							'<td><button id="move_bottom_btn" class="nuDragOptionsButton nuButton" onclick="nuAlignBottom();"><i class="nuDragOptionsIcon90 fa fa-step-forward"></i> Bottom</button></td>'+
						'</tr>'+
						'<tr>'+
							'<td><button id="move_ver_btn" class="nuDragOptionsButton nuButton" onclick="nuSpaceVertically();"><i class="nuDragOptionsIcon fa fa-bars"></i> Vertical</button></td>'+
							'<td><button id="move_left_btn" class="nuDragOptionsButton nuButton" onclick="nuAlignLeft();"><i class="nuDragOptionsIcon180 fa fa-step-forward"></i> Left</button></td>'+
						'</tr>'+
						'<tr>'+
							'<td><button id="move_hor_btn" class="nuDragOptionsButton nuButton" onclick="nuSpaceHorizontally();"><i class="nuDragOptionsIcon90 fa fa-bars"></i> Horizontal</button></td>'+
							'<td><button id="move_right_btn" class="nuDragOptionsButton nuButton" onclick="nuAlignRight();"><i class="nuDragOptionsIcon fa fa-step-forward"></i> Right</button></td>'+
						'</tr>'+
						'<tr>'+
							'<td><button id="move_short_btn" class="nuDragOptionsButton nuButton" onclick="nuResizeToLowest();"><i class="nuDragOptionsIcon135 fa fa-compress"></i> Shortest</button></td>'+
							'<td><button id="move_thin_btn" class="nuDragOptionsButton nuButton" onclick="nuResizeToThinnest();"><i class="nuDragOptionsIcon45 fa fa-compress"></i> Thinnest</button></td>'+
						'</tr>'+
						'<tr>'+
							'<td><button id="move_tall_btn" class="nuDragOptionsButton nuButton" onclick="nuResizeToHighest();"><i class="nuDragOptionsIcon135 fa fa-expand"></i> Tallest</button></td>'+
							'<td><button id="move_wide_btn" class="nuDragOptionsButton nuButton" onclick="nuResizeToWidest();"><i class="nuDragOptionsIcon45 fa fa-expand"></i> Widest</button></td>'+
						'</tr>'+
						'<tr>'+
							'<td><select id="nuDragOptionsTabsDropdown" class="nuDragOptionsButton" style="border: none"></select></td>'+
							'<td><button id="move_tab_btn" class="nuDragOptionsButton nuButton nuSaveButtonEdited" style="font-weight: bold; text-align: center;" onclick="nuMoveNuDrag();">Move to Tab</button></td>'+
						'</tr>'+
						'<tr>'+
							'<td>&nbsp;</td>'+
							'<td>&nbsp;</td>'+
						'</tr>'+
						'<tr>'+
							'<td><input type="checkbox" id="nuShowDragLabels" value="Show Labels" onclick="nuToggleDragLabels();"><label for="nuShowDragLabels">Show Labels</label></td>'+
							'<td><button id="save_btn" class="nuDragOptionsButton nuButton nuSaveButtonEdited" style="font-weight: bold; text-align: center;" onclick="nuSaveNuDrag();">Save</button></td>'+
						'</tr>'+
					'</tbody>'+
				'</table>'+
		'</div>'+
	'</div>';

	$('#nuWindow',window.parent.document.body).css('right', 15);

	$('#nuDragDialog',window.parent.document.body)
	.css('top', 35)
	.prepend(optionsBoxHTML)
	.css('height', Math.max(dragOptionsBoxMinHeight + 10, window.innerHeight + 40))
	.css('width', w + dragOptionsBoxWidth - 15);

	$('#nuBreadcrumbHolder').remove();

	nuInitialiseDragState();

	let tabSelected = $('.nuTabSelected');
	let t = tabSelected.length > 0 ? tabSelected.attr('id').replace('nuTab','') : 0;
	nuPopulateFieldsList(t);
	nuPopulateTabDropdown(t);

	$('.nuTab[id^="nuTab"]').prop('onclick','');
	$('.nuTab[id^="nuTab"]').click(function(){

		if($(this).hasClass('nuTabSelected')){
			return;
		}

		nuClearFieldsList();
		nuUnselectAllDragObjects();
		nuSelectTab(this);
		nuShowContentBoxFrames();

		nuPopulateFieldsList(Number($(this).attr('data-nu-tab-filter')));
		nuPopulateTabDropdown(Number($(this).attr('data-nu-tab-filter')));
		nuCheckIfMovingTabOrderAllowed($('#nuDragOptionsFields',window.parent.document.body));
		nuCheckIfMovingFieldToOtherTabAllowed($('#nuDragOptionsFields',window.parent.document.body));

	});

	nuCheckIfMovingTabOrderAllowed($('#nuDragOptionsFields'));
	nuCheckIfMovingFieldToOtherTabAllowed($('#nuDragOptionsFields'));

	let help	= "<input id='run_sam' type='button' class='input_button nuButton' value='?' ";
	help		+= "onclick='nuMessage([";

	help		+= "\"Use arrow keys to move selected Objects.\", ";
	help		+= "\"Use arrow keys + SHIFT to resize selected Objects.\", ";
	help		+= "\"Draw a square around Objects to highlight them.\", ";
	help		+= "\"Hold CTRL to add Objects to the current selection.\", ";

	help		+= "])' ";
	help		+= "style='top: 2px; right: 15px; width: 21px; height: 21px; text-align: center; padding-left: 5px; position: absolute;'>";

	$('body').append(help);

	nuAddContentBoxFrames();
	nuShowContentBoxFrames();

	if ($('div.nuTab[id^="nuTab"]').length == 1) {
		$('#move_tab_btn', window.parent.document.body).css('visibility', 'hidden')
		$('#nuDragOptionsTabsDropdown', window.parent.document.body).css('visibility', 'hidden')
	}

	$('#nuRECORD').css('height', window.innerHeight);
	$('.nuRECORD').css("width", "99.3%");

}

function nuToggleDragLabels() {

	$('.nuDragLabel',$('#nuDragDialog iframe').contents()).each(function(){
		let obj = $(this);
		if (obj.css('visibility') ==='visible'){
			obj.css('visibility', 'hidden')
		} else {
			obj.css('visibility', 'visible')
		}
	});

	$("[data-drag-button-label]",$('#nuDragDialog iframe').contents()).each(function(){
		let obj = $(this);
		if (obj.is("[data-drag-value-visible]")) {
			obj.text(this.id);
			obj.removeAttr('data-drag-value-visible');
		} else {
			obj.text(obj.attr('data-drag-button-label'));
			obj.attr('data-drag-value-visible','');
		}
	});

}

function nuShowContentBoxFrames() {

	$('.nu_contentbox').each(function() {

		var id = 'frame_' + $(this).attr('id');
		var obj = $("#"+id);

		if ($(this).is(":visible")){
			obj.css('visibility', 'visible')
		} else {
			obj.css('visibility', 'hidden')
		}
	})

}

function nuAddContentBoxFrames() {

	$('.nu_contentbox').each(function() {
		var w = $(this).cssNumber('width');
		var t = $(this).cssNumber('top') + 18;
		var l = $(this).cssNumber('left');
		var h = $(this).cssNumber('height');
		var id = 'frame_' + $(this).attr('id');
		var bg = $(this).css('background-color');
		var div = '<div class="nuContentBoxFrame" id="' + id + '" style="position: absolute; border:2px double ' + bg + ';width:' + w + 'px;height:' + h + 'px;top:' + t + 'px;left:' + l + 'px"></div>';
		$(div).insertAfter($(this));
	});

	$('.nu_contentbox').css({
		'height': '16'
	});

}

function nuDragSelected() {
	return $('div.nuDragSelected',$('#nuDragDialog iframe').contents());
}

function nuThisContentBox(t) {
	return $('#frame_' + $(t).attr('id'),$('#nuDragDialog iframe').contents());
}

function nuThisLabel(t) {
	return $('#label_' + $(t).attr('id'),$('#nuDragDialog iframe').contents());
}

// Shortest
function nuResizeToLowest(){

	var lowest		= 1000000;
	var selected	= nuDragSelected();

	selected.each(function(){

		var cb = nuThisContentBox(this);
		h = cb.length == 0 ? $(this).height() : cb.height();

		if(h < lowest){
			lowest	= h;
		}

	});

	selected.each(function(){

		var cb = nuThisContentBox(this);
		if (cb.length == 0) {
			$(this).css('height',lowest+'px');
		} else {
			cb.css('height',lowest+'px');
		}
	});

}

function nuResizeToThinnest(){

	var thinnest	= 1000000;
	var selected	= nuDragSelected();

	selected.each(function(){

		if($(this).width() < thinnest){
			thinnest	= $(this).width();
		}

	});

	selected.each(function(){
		$(this).css('width',thinnest+'px');
		var cb = nuThisContentBox(this);
		if (cb.length == 1) cb.css('width', thinnest +'px');
	});

}

// Tallest
function nuResizeToHighest(){

	var highest	= 0;
	var selected	= nuDragSelected();

	selected.each(function(){

		var cb = nuThisContentBox(this);
		h = cb.length == 0 ? $(this).height() : cb.height();

		if(h > highest){
			highest	= h;
		}

	});

	selected.each(function(){
		var cb = nuThisContentBox(this);
		if (cb.length == 0) {
			$(this).css('height',highest+'px');
		} else {
			cb.css('height',highest+'px');
		}
	});

}

function nuResizeToWidest(){

	var widest		= 0;
	var selected	= nuDragSelected();

	selected.each(function(){

		if($(this).width() > widest){
			widest	= $(this).width();
		}

	});

	selected.each(function(){
		$(this).css('width',widest+'px');
		var cb = nuThisContentBox(this);
		if (cb.length == 1) cb.css('width',widest +'px');
	});

}

function nuSortObjAsc(a,b) {

	return a.top - b.top;

}

function nuSpacingNotSupported() {

	var supported = $('div.nuDragSelected',$('#nuDragDialog iframe').contents()).filter('.nu_contentbox').length == 0;
	if (!supported) {
		nuMessage('Vertical spacing of ContentBox is not supported yet.');
	}

	return supported;

}

function nuSpaceHorizontally(){

	if (!nuSpacingNotSupported()) return;

	var selectedFields		= [];

	$('div.nuDragSelected',$('#nuDragDialog iframe').contents()).each(function(){

		selectedFields.push({
			left: $(this).position().left,
			width: $(this).width(),
			id: $(this).prop('id')
		});

	});

	selectedFields.sort(nuSortObjAsc);

	var gapTotal			= 0;
	var leftTotal			= 0;

	for(var i=1; i<selectedFields.length; i++){

		gapTotal			+= selectedFields[i].left-(selectedFields[i-1].left+selectedFields[i-1].width);
		leftTotal			+= selectedFields[i].left-selectedFields[i-1].left;

	}

	var gapAvg				= Math.round(gapTotal/(selectedFields.length-1));
	var leftAvg				= Math.round(leftTotal/(selectedFields.length-1));

	if(gapAvg < 0){

		for(var i=1; i<selectedFields.length; i++){
			$('#'+selectedFields[i].id,$('#nuDragDialog iframe').contents()).css('left',($('#'+selectedFields[i-1].id,$('#nuDragDialog iframe').contents()).position().left+leftAvg)+'px');
		}

	} else {

		for(var i=1; i<selectedFields.length; i++){
			$('#'+selectedFields[i].id,$('#nuDragDialog iframe').contents()).css('left',($('#'+selectedFields[i-1].id,$('#nuDragDialog iframe').contents()).position().left+$('#'+selectedFields[i-1].id,$('#nuDragDialog iframe').contents()).width()+gapAvg)+'px');
		}

	}

}

function nuSpaceVertically(){

	if (!nuSpacingNotSupported()) return;

	var selectedFields	= [];

	$('div.nuDragSelected',$('#nuDragDialog iframe').contents()).each(function(){

		selectedFields.push({

			top: $(this).position().top,
			height: $(this).height(),
			id: $(this).prop('id')

		});

	});

	selectedFields.sort(nuSortObjAsc);

	var gapTotal	= 0;
	var topTotal	= 0;

	for(var i=1; i<selectedFields.length; i++){

		gapTotal	+= selectedFields[i].top-(selectedFields[i-1].top+selectedFields[i-1].height);
		topTotal	+= selectedFields[i].top-selectedFields[i-1].top;

	}

	var gapAvg		= Math.round(gapTotal/(selectedFields.length-1));
	var topAvg		= Math.round(topTotal/(selectedFields.length-1));

	if(gapAvg < 0){

		for(var i=1; i<selectedFields.length; i++){
			$('#'+selectedFields[i].id,$('#nuDragDialog iframe').contents()).css('top',($('#'+selectedFields[i-1].id,$('#nuDragDialog iframe').contents()).position().top+topAvg)+'px');
		}

	} else {

		for(var i=1; i<selectedFields.length; i++){
			$('#'+selectedFields[i].id,$('#nuDragDialog iframe').contents()).css('top',($('#'+selectedFields[i-1].id,$('#nuDragDialog iframe').contents()).position().top+$('#'+selectedFields[i-1].id,$('#nuDragDialog iframe').contents()).height()+gapAvg)+'px');
		}

	}

}

function nuAlignRight(){

	var rightestPoint = 0;
	var selected = nuDragSelected();

	selected.each(function(){

		if($(this).position().left+$(this).width() > rightestPoint){

			rightestPoint	= $(this).position().left+$(this).width();

		}

	});

	selected.each(function(){
		$(this).css('left',(rightestPoint-$(this).width())+'px');

		var tLabel = nuThisLabel(this);
		if (tLabel.length == 1) tLabel.css('left',rightestPoint - $(this).width() - tLabel.cssNumber('width') - 5  +'px');

	});

}

function nuAlignLeft(){

	var leftestPoint		= 1000000;

	var selected	= nuDragSelected();

	selected.each(function(){

		if($(this).position().left < leftestPoint){

			leftestPoint	= $(this).position().left;

		}

	});

	selected.each(function(){
		$(this).css('left',leftestPoint+'px');
		var cb = nuThisContentBox(this);

		var tLabel = nuThisLabel(this);
		if (tLabel.length == 1) tLabel.css('left',leftestPoint -  tLabel.cssNumber('width') - 5  +'px');

		if (cb.length == 1) {
			cb.css('left',leftestPoint +'px');
		}
	});

}

function nuAlignTop(){

	var highestPoint		= 1000000;

	var selected	= nuDragSelected();

	selected.each(function(){

		if($(this).position().top < highestPoint){

			highestPoint	= $(this).position().top;

		}

	});

	selected.each(function(){

		$(this).css('top',highestPoint+'px');
		var cb = nuThisContentBox(this);
		if (cb.length == 1) cb.css('top',highestPoint + 18 +'px');

		var tLabel = nuThisLabel(this);
		if (tLabel.length == 1) tLabel.css('top',highestPoint +'px');

	});

}

function nuAlignBottom(){

	// its 0 here because technically top: 0px is the highest...
	var lowestPoint			= 0;

	var selected	= nuDragSelected();

	selected.each(function(){

		if($(this).position().top + $(this).height() > lowestPoint){

			lowestPoint		= $(this).position().top + $(this).height();

			var cb = nuThisContentBox(this);
			lowestPoint = cb.length == 0 ? $(this).position().top + $(this).height() : cb.position().top + cb.height();

		}

	});

	selected.each(function(){

		var cb = nuThisContentBox(this);
		if (cb.length == 0) {
			$(this).css('top',(lowestPoint-$(this).height())+'px');
		} else {
			$(this).css('top',(lowestPoint-cb.height()-18)+'px');
			cb.css('top', $(this).cssNumber('top')+ 18 + 'px');
		}

		var tLabel = nuThisLabel(this);
		if (tLabel.length == 1) tLabel.css('top',lowestPoint - $(this).height() +'px');

	});
}

function nuMoveNuDrag() {

	//find tab we are moving objects to
	var moveToTab				= $('#nuDragOptionsTabsDropdown').val().substring(5);

	$('#nuDragOptionsFields :selected').each(function(i, selected){

		var fieldToMove		= $(selected).text();
		var initialTab			= $('#nuWindow').contents().find('#'+fieldToMove).attr('data-nu-tab');

		//hide objects on screen so they can be redrawn on correct tab.
		$('#nuWindow').contents().find('#'+fieldToMove).attr('data-nu-tab',moveToTab).hide();

		//get tab objects array
		var tabObjects			= $("#nuWindow")[0].contentWindow.nuDragOptionsState.tabs[initialTab];
		var index				= 0;
		var foundField			= false;

		for(var i = 0; i < tabObjects.objects.length; i++) {

			if(tabObjects.objects[i].id == fieldToMove) {

				var fieldObject = $("#nuWindow")[0].contentWindow.nuDragOptionsState.tabs[initialTab].objects[i];

				foundField = true;

				$("#nuWindow")[0].contentWindow.nuDragOptionsState.tabs[moveToTab].objects.push(fieldObject);
				$("#nuWindow")[0].contentWindow.nuDragOptionsState.tabs[initialTab].objects.splice(i,1);

				i--;

			} else if(foundField) {
				$("#nuWindow")[0].contentWindow.nuDragOptionsState.tabs[initialTab].objects[i].tab_order -= 10;
			}
		}

		//update orders
		var tabObjectsU			= $("#nuWindow")[0].contentWindow.nuDragOptionsState.tabs[moveToTab];

		for(var j = 0; j < tabObjectsU.objects.length; j++) {
			tabObjectsU.objects[j].tab_order = Number(j * 10) + Number(moveToTab * 100);
		}

	});

	//go to new tab
	$('#nuWindow').contents().find('#nuTab'+moveToTab).click();

}

function nuSaveNuDrag(){

	$("body").append('<div id="overlay" style="background-color:grey;position:absolute;top:0;left:0;height:100%;width:100%;z-index:999;"></div>');

	if(!nuPutFieldDimensionsIntoState()){
		return;
	}

	if(parent['nuFORM'] !== undefined){
		parent.nuFORM.edited = false;
	}

	nuSaveAfterDrag();

}

function nuAbortSaveDrag(){

	 $("#overlay").remove();

}

function nuPutFieldDimensionsIntoState(){

	for(var tabNo=0; tabNo<$('#nuDragDialog iframe')[0].contentWindow.nuDragOptionsState.tabs.length; tabNo++){

		for(var fieldNo=0; fieldNo<$('#nuDragDialog iframe')[0].contentWindow.nuDragOptionsState.tabs[tabNo].objects.length; fieldNo++){

			var field = $('#nuDragDialog iframe')[0].contentWindow.nuDragOptionsState.tabs[tabNo].objects[fieldNo];

			var contents = $('div#'+field.id,$('#nuDragDialog iframe').contents());
			var cb = $('div#frame_'+field.id,$('#nuDragDialog iframe').contents());

			if(contents.length == 1){

				contents.show();

				field.left			= contents.position().left;
				field.top			= contents.position().top;
				field.width			= contents.width();

				if (cb.length == 0) {
					field.height	= contents.height();
				} else {
					field.height	= cb.height();
				}

				contents.hide();

			} else {

				alert('Error putting field dimensions into state with id: '+field.id);

				return false;

			}

		}

	}

	return true;

}

function nuUpdateDragSelections(fieldsSelectBox){

	nuUnselectAllDragObjects();
	nuCheckIfMovingTabOrderAllowed(fieldsSelectBox);
	nuCheckIfMovingFieldToOtherTabAllowed(fieldsSelectBox);

	$('option:selected', fieldsSelectBox).each(function(){
		$('#'+$(this).prop('id').replace('drag_',''),$('#nuDragDialog iframe').contents()).addClass('nuDragSelected');
	});

}

function nuCheckIfMovingTabOrderAllowed(fieldsSelectBox){

	var upDownBtn = $('#move_down_btn, #move_up_btn');
	var upDownBtnParent = $('#move_down_btn, #move_up_btn', window.parent.document.body);

	if($('option:selected', fieldsSelectBox).length == 1){

		upDownBtn.removeAttr('disabled');
		upDownBtn.removeClass('nuDragOptionsButtonDisabled');
		upDownBtnParent.removeAttr('disabled');
		upDownBtnParent.removeClass('nuDragOptionsButtonDisabled');

	} else {

		upDownBtn.prop('disabled','disabled');
		upDownBtn.addClass('nuDragOptionsButtonDisabled');
		upDownBtnParent.prop('disabled','disabled');
		upDownBtnParent.addClass('nuDragOptionsButtonDisabled');

	}

}

function nuCheckIfMovingFieldToOtherTabAllowed(fieldsSelectBox){

	var tabDropdown		= $('#nuDragOptionsTabsDropdown',window.parent.document.body);

	if($('option:selected', fieldsSelectBox).length >= 1){
		tabDropdown.removeAttr('disabled');
	} else {
		tabDropdown.prop('disabled','disabled');
	}

}


function nuUnselectAllDragObjects(){

	$('.nuDragSelected').each(function(){
		$(this).removeClass('nuDragSelected');
	});

	$('.nuDragSelected',$('#nuDragDialog iframe').contents()).each(function(){
		$(this).removeClass('nuDragSelected');
	});

}

function nuSelectAllDragObjects(){

	$('[data-drag]').each(function(){
		if ($(this).is(":visible")){
			nuAddDragSelected($(this));
		}
	});

	$('[data-drag]',$('#nuDragDialog iframe').contents()).each(function(){
		if ($(this).is(":visible")){
			nuAddDragSelected($(this));
		}
	});

}

function nuClearFieldsList(){

	$('#nuDragOptionsFields',window.parent.document.body).html('');
	$('#nuDragOptionsTabsDropdown',window.parent.document.body).html('');

}


function nuPopulateFieldsList(currentlySelectedTabNo){

	var tabOrderSearch	= nuGetMinTabOrderInTab(currentlySelectedTabNo);
	var field			= null;

	for(var i=0; i<window.nuDragOptionsState.tabs[currentlySelectedTabNo].objects.length; i++){

		for(var j=0; j<window.nuDragOptionsState.tabs[currentlySelectedTabNo].objects.length; j++){

			field		= window.nuDragOptionsState.tabs[currentlySelectedTabNo].objects[j];

			if(field.tab_order == tabOrderSearch){
				$('#nuDragOptionsFields',window.parent.document.body).append('<option id="drag_'+field.id+'">'+field.id+'</option>');
			}

		}

		tabOrderSearch	= tabOrderSearch + 10;

	}

	nuSetTabOrderDataAttrs();

}


function nuGetMinTabOrderInTab(currentTabNo){

	var minTabOrder			= 1000000;

	for(var i=0; i<window.nuDragOptionsState.tabs[currentTabNo].objects.length; i++){

		if(window.nuDragOptionsState.tabs[currentTabNo].objects[i].tab_order < minTabOrder)
			minTabOrder		= window.nuDragOptionsState.tabs[currentTabNo].objects[i].tab_order;

	}

	if(minTabOrder == 1000000){
		return null;
	}

	return minTabOrder;
}

function nuMoveSelected() {

	var s		= document.getElementsByClassName('nuDragSelected');
	var l		= 0;
	var t		= 0;
	var o		= {};

	for(var i = 0 ; i < s.length ; i ++){

		o		= s[i].style;
		l		= parseInt(o.left, 10)	+ (window.moveX - window.lastMoveX);
		t		= parseInt(o.top, 10)	+ (window.moveY - window.lastMoveY);
		o.left	= l + 'px';
		o.top	= t + 'px';

		// Move ContentBox too
		var cb = $('#frame_' + $(s[i]).attr('id'));
		if (cb.length == 1) {
			cb.css('left', l);
			cb.css('top', t + 18);
		}

		var tLabel = $('#label_' + $(s[i]).attr('id'));
		if (tLabel.length !== 0) {
			tLabel.css('left', l-tLabel.cssNumber('width')-5);
			tLabel.css('top', t);
		}

	}
}

function nuCanMove() {

	var s		= document.getElementsByClassName('nuDragSelected');
	var l		= 0;
	var t		= 0;
	var o		= {};

	for(var i = 0 ; i < s.length ; i ++){

		o		= s[i].style;
		l		= parseInt(o.left, 10) + (window.moveX - window.lastMoveX);
		r		= l + parseInt(o.width, 10);
		t		= parseInt(o.top, 10) + (window.moveY - window.lastMoveY);
		b		= t + parseInt(o.height, 10);

		if(l < 0) {
			return false;
		}

		if(t < 0) {
			return false;
		}

	}

	return true;

}

function nuGetTopArea() {

	var nuActionHolder		= parseInt($('#nuActionHolder').css('height'), 10);
	var nuTabHolder			= parseInt($('#nuTabHolder').css('height'), 10);
	var dialogTitle			= parseInt(p('#dialogTitle').css('height'), 10);

	var nuBreadcrumbHolder;
	if($('#nuBreadcrumbHolder').length == 1){
		nuBreadcrumbHolder	= parseInt($('#nuBreadcrumbHolder').css('height'), 10);
	}else{
		nuBreadcrumbHolder	= 0;
	}

	return nuActionHolder + nuBreadcrumbHolder + nuTabHolder + dialogTitle;

}

function nuPopulateTabDropdown(currentlySelectedTabNo){

	// Create a dropdown with the values of the tabs
	$('div.nuTab[id^="nuTab"]').each(function(){

		var tabNumber		= $(this).attr('data-nu-tab-filter');
		var tabName			= $(this).text();

		if(tabNumber != currentlySelectedTabNo) {
			$('#nuDragOptionsTabsDropdown',window.parent.document.body).append('<option value="nuTab'+tabNumber+'">'+tabName+'</option>');
		}

	});

	// Select the current tab
	$('#nuDragOptionsTabsDropdown').find('option:first').prop('selected', 'selected');

}

function nuDragElement(element, dragHeaderOffset) {
	var startX = 0, startY = 0, endX = 0, endY = 0;
	element.onmousedown = dragStart;
	element.ontouchstart = dragStart;

	function dragStart(e) {
		e = e || window.event;
		if (dragHeaderOffset !== undefined) {
			if  (e.clientY - e.currentTarget.offsetTop > dragHeaderOffset) {
				return;
			}
		}

		e.preventDefault();
		// mouse cursor position at start

		if (e.clientX) {  // mousemove
			startX = e.clientX;
			startY = e.clientY;
		} else { // touchmove - assuming a single touchpoint
			startX = e.touches[0].clientX
			startY = e.touches[0].clientY
		}
		document.onmouseup = dragStop;
		document.ontouchend = dragStop;
		document.onmousemove = elementDrag;  // call whenever the cursor moves
		document.ontouchmove = elementDrag;
	}

	function elementDrag(e) {
		e = e || window.event;
		e.preventDefault();

		// calculate new cursor position
		if (e.clientX) {
			endX = startX - e.clientX;
			endY = startY - e.clientY;
			startX = e.clientX;
			startY = e.clientY;
		} else {
			endX = startX - e.touches[0].clientX;
			endY = startY - e.touches[0].clientY;
			startX = e.touches[0].clientX;
			startY = e.touches[0].clientY;
		}

		// set the new position
		element.style.left = (element.offsetLeft - endX) + "px";
		element.style.top = (element.offsetTop - endY) + "px";
	}

	function dragStop() {
		// stop moving on touch end / mouse btn is released
		document.onmouseup = null;
		document.onmousemove = null;
		document.ontouchend = null;
		document.ontouchmove = null;
	}
}

