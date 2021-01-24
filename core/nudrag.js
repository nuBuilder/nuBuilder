//-- object for dragging divs --//

window.nuBACKUP					= [];
window.nuLastClick				= [];
window.nuDIALOG					= {};
window.nuDIALOG.groupNumber		= '0';
window.nuDIALOG.sectionNumber	= '0';
window.nuDIALOG.dialog			= '';
window.nuDIALOG.dialogX			= 0;
window.nuDIALOG.dialogY			= 0;

function nuCreateDrag(){

	this.left				= 0;
	this.right				= 0;
	this.top				= 0;
	this.bottom				= 0;
	this.height				= 0;
	this.width				= 0;
	this.startX				= 0;
	this.startY				= 0;
	this.moveX				= 0;
	this.moveY				= 0;
	this.lastMoveX			= 0;
	this.lastMoveY			= 0;
	this.type				= '';
	this.classList	 = [];
	this.isReport		= false;
	

	this.setSelected = function() {

		if(nuREPORT.selected === undefined){
			nuREPORT.selected = [];
		}

		for(var i = 0 ; i < nuREPORT.selected.length ; i ++){
			
			$('#' + nuREPORT.selected[i]).addClass('nuDragSelected');

		}

	}



	this.getSelected = function() {

		var s						 = document.getElementsByClassName('nuDragSelected');
		nuREPORT.selected = [];
		
		for(var i = 0 ; i < s.length ; i ++){
		
			nuREPORT.selected.push(s[i].id);

		}

	}


	this.down = function(event) {
		
		var c = event.target.className;

		if(event.ctrlKey){
			if(c.indexOf('nuDragObject') != -1){
				$('#'+event.target.id).toggleClass('nuDragSelected');
			}

		}else{
			if(c.indexOf('nuDragObject') != -1 && $('#'+event.target.id).hasClass('nuDragSelected') == false){
				$('.nuDragSelected').removeClass('nuDragSelected');
				$('#'+event.target.id).addClass('nuDragSelected');
			}

			if(c.indexOf('nuDragArea') != -1){
				$('.nuDragSelected').removeClass('nuDragSelected');
			}
			
		}

		this.getSelected();
		this.classList	 = event.target.className.split(' ');
		this.startX			= event.clientX;
		this.startY			= event.clientY;
		this.moveX = 0;
		this.moveY = 0;


		this.setSelectedCoordinates();
		
		this.selectBox(event);
		
	}
	
	this.up = function(event) {
	
		this.classList	 = [];
		this.removeBox();

	}
	
	
	this.move = function(event) {
		
		this.lastMoveX = this.moveX;
		this.lastMoveY = this.moveY;
		
		if(event.clientX) {
			this.moveX	= event.clientX - this.startX ;
		}
		if(event.clientY) {
			this.moveY	= event.clientY - this.startY;
		}
		
		var k			 = event.keyCode;
		var m			 = (event.buttons == 1 && this.classList.indexOf('nuDragSelected') != -1);

		if(m || k == 37 || k == 38 || k == 39 || k == 40){
			
			if($('#nuDragDialog').is(":visible") == false){

				if(k == 38){
					this.moveY = -1;
					this.lastMoveY = 0;
				}
				if(k == 39){
					this.moveX = 1;
					this.lastMoveX = 0;
				}
				if(k == 40){
					this.moveY = 1;
					this.lastMoveY = 0;
				}
				if(k == 37){
					this.moveX = -1;
					this.lastMoveX = 0;
				}

				nuDragR.dragging	= true;
				
			}

			if(event.shiftKey){

				if(this.canResize(event)){
					this.resizeSelected();
				}

			}else{

				if(this.canMove(event)){
					this.moveSelected();
				}

			}
			
		}
		
		this.resizeBox(event);
		
	}
	
	this.multipleSections = function() {

		var s		 = $(".nuDragSelected").attr('data-order');
		var a		 = $(".nuDragSelected");
		var b		 = false;
		
		a.each(function() {
			
			if(s != $(this).attr('data-order')){b = true;}
			
		});

		return b;
	}


	this.canMove = function(event) {

		if(this.left + (this.moveX-this.lastMoveX) + this.areaLeft() < this.areaLeft())	{return false;}
		if(this.right + (this.moveX-this.lastMoveX) > this.areaWidth())					{return false;}
		if(this.top + (this.moveY - this.lastMoveY) + this.areaTop() < this.areaTop())	{return false;}
		if(this.isReport)																{return true;}
		if(this.bottom + (this.moveY - this.lastMoveY) > this.areaHeight())				{return false;}

		return true;

	}

	this.canResize = function(event) {
	
		if(this.right + (this.moveX-this.lastMoveX) > this.areaWidth())					{return false;}
		if(this.isReport)																{return true;}
		if(this.bottom + (this.moveY - this.lastMoveY) > this.areaHeight())				{return false;}
		
		return true;

	}


	this.moveSelected = function() {

		var s = document.getElementsByClassName('nuDragSelected');
		var l = 0;
		var t = 0;
		var o = {};
		var m = this.multipleSections();

		for(var i = 0 ; i < s.length ; i ++){
			
			o			 = s[i].style;
			l			 = parseInt(o.left) + (this.moveX - this.lastMoveX);
			t			 = parseInt(o.top)	+ (m ? 0 : (this.moveY - this.lastMoveY));
			o.left	= l + 'px';
			o.top	 = t + 'px';

		}
		this.setSelectedCoordinates();

	}
	
	
	this.resizeSelected = function() {

		var s					= document.getElementsByClassName('nuDragSelected');
		var w = 0;
		var h = 0;
		var o = {};
		var m = this.multipleSections();
		
		for(var i = 0 ; i < s.length ; i ++){
		
			o				= s[i].style;
			w				= parseInt(o.width) + (this.moveX - this.lastMoveX);
			h				= parseInt(o.height)	+ (m ? 0 : (this.moveY - this.lastMoveY));
			
			if(w == 0) {
				w = 1;
			}

			if(h == 0) {
				h = 1;
			}
			o.width	= w + 'px';
			o.height = h + 'px';	
		}
		
		this.setSelectedCoordinates();

	}
	
	
	this.setSelectedCoordinates = function() {

		var s					= document.getElementsByClassName('nuDragSelected');
		
		if(s.length == 0){return;}
		
		var o				= s[0].style;
		this.left			= parseInt(o.left);
		this.top			= parseInt(o.top);
		this.right			= parseInt(o.left)	+	(parseInt(o.borderWidth) * 2)
		this.bottom			= parseInt(o.top)	+	(parseInt(o.borderWidth)	* 2);
		this.width			= parseInt(o.width);
		this.height			= parseInt(o.height);
		
		for(var i = 0 ; i < s.length ; i ++){
			
			o				= s[i].style;
			this.left		= Math.min(this.left,	parseInt(o.left));
			this.right		= Math.max(this.right,	parseInt(o.left) + parseInt(o.width) + (parseInt(o.borderWidth) * 2))
			this.top		= Math.min(this.top,	parseInt(o.top));
			this.bottom		= Math.max(this.bottom,	parseInt(o.top)	+ parseInt(o.height) + (parseInt(o.borderWidth) * 2));
			this.width		= Math.min(this.width,	parseInt(o.width));
			this.height		= Math.min(this.height,	parseInt(o.height));

		}
		
	}
		
	
	this.selectBox = function(event) {

		if(this.classList.indexOf('nuDragArea') != -1){

			var e = document.createElement('div');
			e.setAttribute('id', 'nuSelectBox');
			$('body').append(e);
			$('#' + e.id).css({
				'width'						: 1,
				'height'					 : 1,
				'top'							: event.clientY + window.scrollY,
				'left'						 : event.clientX,
				'position'				 : 'absolute',
				'border-style'		 : 'dashed',
				'border-width'		 : 1,
				'border-color'		 : 'red',
				'z-index'					: '4000',
				'background-color' : 'transparent'
			});

			return true;
		}	
		
		return false;
	}
	

	this.resizeBox = function(event) {

		if($('#nuSelectBox').length == 0){return;}

		var x = parseInt($('#nuSelectBox').css('left'));
		var y = parseInt($('#nuSelectBox').css('top'));
		var w = parseInt($('#nuSelectBox').css('width'));
		var h = parseInt($('#nuSelectBox').css('height'));

		var X = event.clientX - this.startX;
		var Y = event.clientY	+ window.scrollY - this.startY;

		if(X > 0) {
			$('#nuSelectBox').css({
				'width'						: X
			});
		} else {
			$('#nuSelectBox').css({
				'width'						: -1 * X,
				'left'						: this.startX + X,
			});
		}
		
		if(Y > 0) {
			$('#nuSelectBox').css({
				'height'					: Y
			});
		} else {
			$('#nuSelectBox').css({
				'height'					: -1 *	Y,
				'top'						: this.startY + Y,
			});
		}

	}
	
		

	this.removeBox = function() {

		if($('#nuSelectBox').length == 0){return;}

		var L = parseInt($('#nuSelectBox').css('left')) - this.areaLeft() ;
		var T = parseInt($('#nuSelectBox').css('top')) - this.areaTop() ;
		var B = T + parseInt($('#nuSelectBox').css('height'));
		var R = L + parseInt($('#nuSelectBox').css('width'));

		$('#nuSelectBox').remove();

		var o = $('.nuDragObject');

		o.each(function(index) {

			var l =		 parseInt($(this).css('left'));
			var t =		 parseInt($(this).css('top'));
			var b = t + parseInt($(this).css('height'));
			var r = l + parseInt($(this).css('width'));

			//drag around selected objects points
			if(l >= L && l <= R && t >= T && t <= B) {
				$(this).addClass('nuDragSelected');
			} else if(r >= L && r <= R && t >= T && t <= B) {
				$(this).addClass('nuDragSelected');
			} else if(l >= L && l <= R && b >= T && b <= B) {
				$(this).addClass('nuDragSelected');
			} else if(r >= L && r <= R && b >= T && b <= B) {
				$(this).addClass('nuDragSelected');
			}

			//drag within selected objects points
			if(L >= l && L <= r && T >= t && T <= b) {
				$(this).addClass('nuDragSelected');
			} else if(R >= l && R <= r && T >= t && T <= b) {
				$(this).addClass('nuDragSelected');
			} else if(L >= l && L <= r && B >= t && B <= b) {
				$(this).addClass('nuDragSelected');
			} else if(R >= l && R <= r && B >= t && B <= b) {
				$(this).addClass('nuDragSelected');
			}

			//drag through object but not through any points
			if(L >= l && L <= r && T <= t && B >= b) {
				$(this).addClass('nuDragSelected');
			} else if(L <= l && R >= r && T >= t && B <= b) {
				$(this).addClass('nuDragSelected');
			}
		});

		this.getSelected();

	}


	this.areaLeft = function(a) {

		if(arguments.length == 1){
			return $('#nuDragArea').css('left', a);
		}
		return parseInt($('#nuDragArea').css('left'));

	}

	this.areaTop = function(a) {

		if(arguments.length == 1){
			return $('#nuDragArea').css('top', a);
		}
		return parseInt($('#nuDragArea').css('top'));

	}

	this.areaWidth = function(a) {

		if(arguments.length == 1){
			return $('#nuDragArea').css('width', a);
		}
		return parseInt($('#nuDragArea').css('width'));

	}

	this.areaHeight = function(a) {

		if(arguments.length == 1){
			return $('#nuDragArea').css('height', a);
		}
		return parseInt($('#nuDragArea').css('height'));

	}

	this.createArea = function(l, t, w, h) {

		var e = document.createElement('div');
		
		e.setAttribute('id', 'nuDragArea');

		$('body').append(e);

		$('#nuDragArea').css({'left':l, 'top':t, 'width':w, 'height':h});
		$('#nuDragArea').addClass('nuDragArea nuDragNoSelect');

	}


	this.createObject = function(id, prop) {

		var e = document.createElement('div');

		e.setAttribute('id', id);

		$('#nuDragArea').append(e);

		$('#' + id).addClass('nuDragObject');
		$('#' + id).css(prop);
		$('#' + id).css('z-index', 100 + $('.nuDragObject').length);
		$('#' + id).attr('data-section', '');
		$('#' + id).attr('data-x', 0);

	}
	
}
