var api;

// page init
jQuery(function(){

	initTabs();
	initSameHeight();
	initAccordion();
	initGalleries();
	initNavigation();
	initSelectNavigation();
	initPlaceHolders();

});
jQuery(window).load(function(){

	initGreyScale();
	initAttrSorting();
	
});

function initPlaceHolders(){
	if(!jQuery.browser.ie && jQuery.browser.version >9) return;

	var elements = jQuery('input[type="text"], textarea'),
		clearInputs =  function(){
			jQuery('input:text, input:password, textarea').each(function(){
				var _el = jQuery(this);
				_el.data('val', _el.val());
				_el.bind('focus', function(){
					if(_el.val() == _el.data('val')) _el.val('');
				}).bind('blur', function(){
					if(_el.val() == '') _el.val(_el.data('val'));
				});
			});
		};

	elements.each(function(){
		var $this = jQuery(this),
			itemText = $this.attr('placeholder');

		if(itemText == 'undefined' || itemText == '') return;

		this.value = itemText;
	});

	clearInputs();
}

function initNavigation(){
	var navigation = jQuery('#navigation'),
		links = navigation.find('a');

	navigation.on('click', 'a', function(e){
		if(jQuery(this).attr('href') == "#"){
			return false;
		}
	});
}

function initSelectNavigation(){
	var nav = jQuery('.navigationSelect');
	
	nav.each(function(){
		var nodes = this.getElementsByTagName('option');

		this.onchange = function (e){
			if(this.value){
				window.location = this.value;
			}
		}

	});
}

function initGreyScale(){
	
	var elements = jQuery(".clients-list img");

	// Fade in images so there isn't a color "pop" document load and then on window load
	elements.fadeIn(500);
	
	// clone image
	elements.each(function(){
		var el = jQuery(this);
		el.css({"position":"absolute"}).wrap("<div class='img_wrapper' style='display: inline-block'>").clone().addClass('img_grayscale').css({"position":"absolute","z-index":"998","opacity":"0"}).insertBefore(el).queue(function(){
			var el = jQuery(this);
			el.parent().css({
				"width":this.width,
				"height":this.height,
				"margin-top":(el.parent().parent().height() - el.height())*0.5
			});
			el.dequeue();
		});
		this.src = grayscale(this.src);
	});
	
	// Fade image
	jQuery('.img_grayscale')
		.on('mouseenter', function(){
			jQuery(this).stop().animate({opacity:1}, 400);
		})
		.on('mouseout', function(){
			jQuery(this).stop().animate({opacity:0}, 400);
		});

}

function initAccordion(){

	jQuery('.accordion-group').OpenClose({
		opener:'.accordion-toggle',
		slider:'.accordion-body'
	});
}

function adjustElementsWidth(){
	
	var _item = jQuery('.item');
	var _itemProjectList = jQuery('.recent-works-slider .project-list slide');

	checkCarouselitems(_item);
	checkCarouselitems(_itemProjectList);

	jQuery(window).resize(function(){
		checkCarouselitems(_item);
		checkCarouselitems(_itemProjectList);
	});

}

function initGalleries(){

	jQuery('.flexslider').flexslider();

	jQuery('div.carousel-post').gallerySlider({
		duration: 600,
		transitionEffect : 'easeInOutQuad',
		sliderHold: '.carousel-inner',
		needWrap : 'wrap-holder',
		slideElement : '.item',
		prevControl : '[data-slide = "prev"]',
		nextControl : '[data-slide = "next"]',
		showSwitcher: '.carousel-nav',
		autorun : true
	});

	jQuery('.slider').oneWaySlider({
		duration: 600,
		transitionEffect : 'easeInOutQuad',
		sliderHold: '.slides-list',
		needWrap : false,
		slideElement : '.slide',
		prevControl : '.nav-btns .prev',
		nextControl : '.nav-btns .next',
		showSwitcher: false,
		autorun : true
	});

	adjustElementsWidth();
}

/* init tabs */
function initTabs(){
	jQuery('.nav-tabs a').click(function (e) {
	    e.preventDefault();
	    jQuery(this).tab('show');
    })
}

function initAttrSorting(){
	jQuery('.sorter-area').each(function(){
		var _el = jQuery(this);
		var _ctrl = _el.find('.sorter-control');
		var _itemHold = _el.find(_ctrl.attr('data-control'));
		var _nav = _ctrl.find('>li a');
		var res = _el.find('.res-container');
		var _fake = _itemHold.find('li');
		var _sortRule = [];
		var sortEl;
		var _w = res.find('li').eq(0).get(0).clientWidth;
		jQuery(window).resize(function(){
			 _w = res.find('li').eq(0).get(0).clientWidth;
		});
		_nav.on('click',function(){
			_nav.closest('li').removeClass('active');
			jQuery(this).closest('li').addClass('active');
			initSorting();
			return false;
		});
		function initSorting(){
			_sortRule = [];
			_nav.each(function(){
				if(jQuery(this).closest('li').hasClass('active')){
					_sortRule.push($(this).attr('data-filter'));
				}
			});
			sortEl = _itemHold.find('li[data-filter~="'+_sortRule[0]+'"]');
			for (var _i=1; _i<_sortRule.length; _i++){
				sortEl = sortEl.add(_itemHold.find('li[data-filter~="'+_sortRule[_i]+'"]'))
			}
			setTimeout(function(){
				res.find('li').width(_w);
			},10);
			res.attributeFilterSort(sortEl,{
				adjustHeight: 'dynamic',
				duration : 600,
				easing: 'easeInOutQuad'
			}, function() {
			  	setTimeout(function(){
			  		res.height('auto');
			  	},200);
			});
		}		
	});
	
}
function checkCarouselitems(_item, checkpadding){
	if(!checkpadding) checkpadding = 0;
	_item.each(function(){
		var $this = jQuery(this),
			width = $this.closest('.carousel-inner').outerWidth() - checkpadding;

		this.style.width = width + 'px';
	})
}

// set same column height
function initSameHeight(){
	jQuery('.same-height').sameHeight({
		elements: '.stretch',
		flexible: true,
		multiLine: true
	});
}
	
// Grayscale w canvas method
function grayscale(src){
	var canvas = document.createElement('canvas');
	var ctx = canvas.getContext('2d');
	var imgObj = new Image();
	imgObj.src = src;
	canvas.width = imgObj.width;
	canvas.height = imgObj.height; 
	ctx.drawImage(imgObj, 0, 0); 
	var imgPixels = ctx.getImageData(0, 0, canvas.width, canvas.height);
	for(var y = 0; y < imgPixels.height; y++){
		for(var x = 0; x < imgPixels.width; x++){
			var i = (y * 4) * imgPixels.width + x * 4;
			var avg = (imgPixels.data[i] + imgPixels.data[i + 1] + imgPixels.data[i + 2]) / 3;
			imgPixels.data[i] = avg; 
			imgPixels.data[i + 1] = avg; 
			imgPixels.data[i + 2] = avg;
		}
	}
	ctx.putImageData(imgPixels, 0, 0, 0, 0, imgPixels.width, imgPixels.height);
	return canvas.toDataURL();
}

/*
 * jQuery SameHeight plugin
 */
;(function(jQuery){
	jQuery.fn.sameHeight = function(opt) {
		var options = jQuery.extend({
			skipClass: 'same-height-ignore',
			leftEdgeClass: 'same-height-left',
			rightEdgeClass: 'same-height-right',
			elements: '>*',
			flexible: false,
			multiLine: false,
			useMinHeight: false
		},opt);
		return this.each(function(){
			var holder = jQuery(this);
			var elements = holder.find(options.elements).not('.' + options.skipClass);
			if(!elements.length) return;
			
			// resize handler
			function doResize() {
				elements.css(options.useMinHeight && supportMinHeight ? 'minHeight' : 'height', '');
				if(options.multiLine) {
					// resize elements row by row
					resizeElementsByRows(elements, options);
				} else {
					// resize elements by holder
					resizeElements(elements, holder, options);
				}
			}
			doResize();
			
			// handle flexible layout / font resize
			if(options.flexible) {
				jQuery(window).bind('resize orientationchange fontresize', function(e){
					doResize();
					setTimeout(doResize, 100);
				});
			}
			// handle complete page load including images and fonts
			jQuery(window).bind('load', function(){
				doResize();
				setTimeout(doResize, 100);
			});
		});
	}
	
	// detect css min-height support
	var supportMinHeight = typeof document.documentElement.style.maxHeight !== 'undefined';
	
	// get elements by rows
	function resizeElementsByRows(boxes, options) {
		var currentRow = jQuery(), maxHeight, firstOffset = boxes.eq(0).offset().top;
		boxes.each(function(ind){
			var curItem = jQuery(this);
			if(curItem.offset().top === firstOffset) {
				currentRow = currentRow.add(this);
			} else {
				maxHeight = getMaxHeight(currentRow);
				resizeElements(currentRow, maxHeight, options);
				currentRow = curItem;
				firstOffset = curItem.offset().top;
			}
		});
		if(currentRow.length) {
			maxHeight = getMaxHeight(currentRow);
			resizeElements(currentRow, maxHeight, options);
		}
	}
	
	// calculate max element height
	function getMaxHeight(boxes) {
		var maxHeight = 0;
		boxes.each(function(){
			maxHeight = Math.max(maxHeight, jQuery(this).outerHeight());
		});
		return maxHeight;
	}
	
	// resize helper function
	function resizeElements(boxes, parent, options) {
		var parentHeight = typeof parent === 'number' ? parent : parent.height();
		boxes.removeClass(options.leftEdgeClass).removeClass(options.rightEdgeClass).each(function(i){
			var element = jQuery(this);
			var depthDiffHeight = 0;
			
			if(typeof parent !== 'number') {
				element.parents().each(function(){
					var tmpParent = jQuery(this);
					if(this === parent[0]) {
						return false;
					} else {
						depthDiffHeight += tmpParent.outerHeight() - tmpParent.height();
					}
				});
			}
			var calcHeight = parentHeight - depthDiffHeight - (element.outerHeight() - element.height());
			if(calcHeight > 0) {
				element.css(options.useMinHeight && supportMinHeight ? 'minHeight' : 'height', calcHeight);
			}
		});
		boxes.filter(':first').addClass(options.leftEdgeClass);
		boxes.filter(':last').addClass(options.rightEdgeClass);
	}
}(jQuery));

/*
 * jQuery FontResize Event
 */
jQuery.onFontResize = (function(jQuery) {
	jQuery(function() {
		var randomID = 'font-resize-frame-' + Math.floor(Math.random() * 1000);
		var resizeFrame = jQuery('<iframe>').attr('id', randomID).addClass('font-resize-helper');
		
		// required styles
		resizeFrame.css({
			width: '100em',
			height: '10px',
			position: 'absolute',
			borderWidth: 0,
			top: '-9999px',
			left: '-9999px'
		}).appendTo('body');
		
		// use native IE resize event if possible
		if (jQuery.browser.msie && jQuery.browser.version < 9) {
			resizeFrame.bind('resize', function () {
				jQuery.onFontResize.trigger(resizeFrame[0].offsetWidth / 100);
			});
		}
		// use script inside the iframe to detect resize for other browsers
		else {
			var doc = resizeFrame[0].contentWindow.document;
			doc.open();
			doc.write('<scri' + 'pt>window.onload = function(){var em = parent.jQuery("#' + randomID + '")[0];window.onresize = function(){if(parent.jQuery.onFontResize){parent.jQuery.onFontResize.trigger(em.offsetWidth / 100);}}};</scri' + 'pt>');
			doc.close();
		}
		jQuery.onFontResize.initialSize = resizeFrame[0].offsetWidth / 100;
	});
	return {
		// public method, so it can be called from within the iframe
		trigger: function (em) {
			jQuery(window).trigger("fontresize", [em]);
		}
	};
}(jQuery));

// IE browser detection
var browserInfo = /(MSIE) ([\w.]+)/.exec(navigator.userAgent);
if(browserInfo) {
	browserInfo = {
		msie: true,
		version: browserInfo[2]
	};
} else {
	browserInfo = {};
}
jQuery.fn.gallerySlider = function(_options){
	// defaults options	
	var _options = jQuery.extend({
		duration: 700,
		autoSlide: 5000,
		showSwitcher : false,
		autorun : false,
		needWrap : false,
		transitionEffect : 'swing',
		slideElement: '>li',
		nextControl: 'a.next, .btn-next',
		prevControl: 'a.prev, .btn-prev',
		sliderHold : 'ul.slides'
	},_options);

	this.each(function () {
		jQuery(this).data('gallerySlider', new GallerySlider(jQuery(this), _options));
	});
    return this;
}
function GallerySlider(el, _options){
	var oSelf = this;
	var _hold = el;
	var _speed = _options.duration;
	var _timer = _options.autoSlide;
	var _wrap = _hold.find( _options.sliderHold);
	var _el = _hold.find(_options.slideElement);
	var _next = _hold.find(_options.nextControl);
	var _prev = _hold.find(_options.prevControl);
	var _count = _el.index(_el.filter(':last'));
	var _w = _el.outerWidth(true);
	
	if(_options.needWrap){
		_wrapel = jQuery('<div class="'+_options.needWrap+'"></div>');
		_el.wrapAll(_wrapel);
		_wrap = _hold.find('.'+_options.needWrap);
		_wrap.css({
			width : '99999px',
			position : 'relative',
			overflow : 'hidden' 
		});
		_el.show();
	}

	var _wrapHolderW = _options.visibleEls || Math.ceil(_wrap.parent().width()/_w);
	var _t;
	var _active = 0;

	var _btn = jQuery('<ul class="switcher"></ul>');
	if(_options.showSwitcher) {
		var _btn = _hold.find(_options.showSwitcher);
		_btn.empty();
		_el.each(function(_i){
			_btn.append('<a href="#" title="'+(_i+1)+'">'+(_i+1)+'</a>');
		});
	}else{
		_el.each(function(_i){
			_btn.append('<a href="#">'+(_i+1)+'</a></li>');
		});
	}
	_btn = _btn.find('a');
	
	function scrollEl(){
		_wrap.eq(0).animate({
			marginLeft: -(_w * _active) + "px"
		}, {queue:false, duration: _speed, easing: _options.transitionEffect});
		_btn.removeClass('active');
		_btn.eq(_active).addClass('active');
		_btn.closest('li').removeClass('active');
		_btn.eq(_active).closest('li').addClass('active');
	}
	function runTimer(){
		if(!_options.autorun) return;
		_t = setInterval(function(){
			_active++;
			if (_active > (_count - _wrapHolderW + 1)) _active = 0;
			scrollEl();
		}, _timer);
	}
	runTimer();
	
	_btn.click(function(){
		_active = _btn.index(jQuery(this));
		if (_active > (_count - _wrapHolderW + 1)) _active = 0;
		scrollEl();
		return false;
	});
	_next.off('click.carousel.data-api');
	_prev.off('click.carousel.data-api');
	_next.on('click.slideGallery.next',function(){
		_active++;
		if (_active > (_count - _wrapHolderW + 1)) _active = 0;
		scrollEl();
		return false;
	});
	_prev.on('click.slideGallery.prev', function(){
		_active--;
		if (_active < 0) _active = _count - _wrapHolderW + 1;
		scrollEl();
		return false;
	});

	_hold.mouseenter(function(){
		if(_t) clearTimeout(_t);
	}).mouseleave(function(){
		runTimer();
	});
	function init(){
		return oSelf;
	}
	var recheckTimer;
	this.reCheckDimensions = function(){
		if(recheckTimer) clearTimeout(recheckTimer);
		recheckTimer = setTimeout(function(){
			_w = _el.eq(0).outerWidth();
			_wrapHolderW = _options.visibleEls || Math.ceil(_wrap.parent().width()/_w);
			scrollEl();
		},300);
	}
	this.onTouchStart =  function() {
		var e = window.event;
		if(_t) clearTimeout(_t);
		this.start = {
		  pageX: e.touches[0].pageX,
		  pageY: e.touches[0].pageY,
		  time: Number(new Date())
		};

		this.isScrolling = undefined;
		this.deltaX = 0;

		_wrap.css('MozTransitionDuration', 0);
		_wrap.css('webkitTransitionDuration', 0);
		e.stopPropagation();
	};

	this.onTouchMove =  function() {
		var e = window.event;
		// ensure swiping with one touch and not pinching
		if(e.touches && e.touches.length > 1 || e.scale && e.scale !== 1) return;

		this.deltaX = e.touches[0].pageX - this.start.pageX;
		// determine if scrolling test has run - one time test
		if ( typeof this.isScrolling == 'undefined') {
		  this.isScrolling = !!( this.isScrolling || Math.abs(this.deltaX) < Math.abs(e.touches[0].pageY - this.start.pageY) );
		}

		// if user is not trying to scroll vertically
		if (!this.isScrolling) {

			// prevent native scrolling 
			e.preventDefault();

			// cancel slideshow
			//clearTimeout(this.interval);

			// increase resistance if first or last slide
			this.deltaX = 
			this.deltaX / 
				( (!_active && this.deltaX > 0               // if first slide and sliding left
					|| _active == this.length - 1              // or if last slide and sliding right
					&& this.deltaX < 0                            // and if sliding at all
				) ?                      
				( Math.abs(this.deltaX) / _w + 1 )      // determine resistance level
				: 1 );                                          // no resistance if false

				// translate immediately 1-to-1
				//_wrap.css('MozTransform', 'translate3d(' + (this.deltaX - _active * _w) + 'px,0,0)');
				//_wrap.css('webkitTransform', 'translate3d(' + (this.deltaX - _active * _w) + 'px,0,0)');
				//this.element.style.MozTransform = this.element.style.webkitTransform = 'translate3d(' + (this.deltaX - this.index * this.width) + 'px,0,0)';
				_wrap.css('marginLeft', (this.deltaX - _active * _w));
				e.stopPropagation();
		}

	};

	this.onTouchEnd =  function(e) {
		// determine if slide attempt triggers next/prev slide
		if(!this.start || !this.start.time) return;
		var isValidSlide = 
		      Number(new Date()) - this.start.time < 250      // if slide duration is less than 250ms
		      && Math.abs(this.deltaX) > 20                   // and if slide amt is greater than 20px
		      || Math.abs(this.deltaX) > _w/2,        // or if slide amt is greater than half the width

		// determine if slide attempt is past start and end
		    isPastBounds = 
		      !this.index && this.deltaX > 0                          // if first slide and slide amt is greater than 0
		      || this.index == this.length - 1 && this.deltaX < 0;    // or if last slide and slide amt is less than 0

		// if not scrolling vertically
		if (!this.isScrolling) {

			// call slide function with slide end value based on isValidSlide and isPastBounds tests
			_active = _active + ( isValidSlide && !isPastBounds ? (this.deltaX < 0 ? 1 : -1) : -1 );
			if(_active < 0) _active = 0;
			else if (_active >= (_count - _wrapHolderW + 1)){
				_active = (_count - _wrapHolderW + 1);
			}
			scrollEl();
			runTimer();
		}

		e.stopPropagation();
	}

	_wrap.on('touchstart', this.onTouchStart);
	_wrap.on('touchmove', this.onTouchMove);
	_wrap.on('touchend', this.onTouchEnd);
	_wrap.on('webkitTransitionEnd', this.onTouchEnd);
	_wrap.on('transitionEnd', this.onTouchEnd);
	jQuery(window).on('resize', this.reCheckDimensions);
	this.reCheckDimensions();

	this.callback = _options.callbackFn || function() {};
	return init();
}

jQuery.fn.oneWaySlider = function(_options){
	// defaults options	
	var _options = jQuery.extend({
		duration: 700,
		autoSlide: 5000,
		showSwitcher : false,
		autorun : false,
		needWrap : false,
		widthHolder : false,
		transitionEffect : 'swing',
		slideElement: '>li',
		nextControl: 'a.next, .btn-next',
		prevControl: 'a.prev, .btn-prev',
		sliderHold : 'ul.slides'
	},_options);

	this.each(function () {
		jQuery(this).data('oneWaySlider', new OneWaySlider(jQuery(this), _options));
	});
    return this;
}
	function OneWaySlider(el, _options){
		var oSelf = this;
		var _hold = el;
		var _speed = _options.duration;
		var _timer = _options.autoSlide;
		var _wrap = _hold.find( _options.sliderHold);
		var _el = _hold.find(_options.slideElement);
		var _next = _hold.find(_options.nextControl);
		var _prev = _hold.find(_options.prevControl);
		var _count = _el.index(_el.filter(':last'));
		var _w = _el.outerWidth(true);
		

		if(_el.length <= 0) return;
		if(_options.needWrap){
			_wrapel = jQuery('<div class="'+_options.needWrap+'"></div>');
			_el.wrapAll(_wrapel);
			_wrap = _hold.find('.'+_options.needWrap);
			_wrap.css({
				width : '99999px',
				position : 'relative',
				overflow : 'hidden' 
			});
			_el.show();
		}

		var _wrapHolderW = _options.visibleEls || Math.ceil(_wrap.parent().width()/_w);
		if(_options.widthHolder){
			var _wrapHolderW = Math.ceil(_hold.find(_options.widthHolder).outerWidth()/_w);
		}
		var _t;
		var _active = 0;

		var _btn = jQuery('<ul class="switcher"></ul>');
		if(_options.showSwitcher) {
			var _btn = _hold.find(_options.showSwitcher);
			_btn.empty();
			_el.each(function(_i){
				_btn.append('<a href="#" title="'+(_i+1)+'">'+(_i+1)+'</a>');
			});
		}else{
			_el.each(function(_i){
				_btn.append('<a href="#">'+(_i+1)+'</a></li>');
			});
		}
		_btn = _btn.find('a');
		_prev.removeClass('inactive');
		function scrollEl(){
			if(_active >= _count - _wrapHolderW + 1){
				_next.addClass('inactive');
				_prev.removeClass('inactive');
			}else if(_active <= 0){
				_prev.addClass('inactive');
				_next.removeClass('inactive');
			}else{
				_prev.removeClass('inactive');
				_next.removeClass('inactive');
			}
			_wrap.eq(0).animate({
				marginLeft: -(_w * _active) + "px"
			}, {queue:false, duration: _speed, easing: _options.transitionEffect});
			_btn.removeClass('active');
			_btn.eq(_active).addClass('active');
			_btn.closest('li').removeClass('active');
			_btn.eq(_active).closest('li').addClass('active');
		}
		function runTimer(){
			if(!_options.autorun) return;
			_t = setInterval(function(){
				_active++;
				if (_active > (_count - _wrapHolderW + 1)) _active = _count - _wrapHolderW + 1;
				scrollEl();
			}, _timer);
		}
		runTimer();
		
		_btn.click(function(){
			_active = _btn.index(jQuery(this));
			if (_active > (_count - _wrapHolderW + 1)) _active = 0;
			scrollEl();
			return false;
		});
		_next.off('click.carousel.data-api');
		_prev.off('click.carousel.data-api');
		_next.on('click.slideGallery.next',function(){
			_active++;
			if (_active > (_count - _wrapHolderW + 1)) _active = _count - _wrapHolderW + 1;
			scrollEl();
			return false;
		});
		_prev.on('click.slideGallery.prev', function(){
			_active--;
			if (_active < 0) _active = 0;
			scrollEl();
			return false;
		});

		_hold.mouseenter(function(){
			if(_t) clearTimeout(_t);
		}).mouseleave(function(){
			runTimer();
		});
		function init(){
			return oSelf;
		}
		var recheckTimer;
		this.reCheckDimensions = function(){
			if(recheckTimer) clearTimeout(recheckTimer);
			recheckTimer = setTimeout(function(){
				_w = _el.eq(0).outerWidth();
				_wrapHolderW = _options.visibleEls || Math.ceil(_wrap.parent().width()/_w);
				if(_options.widthHolder){
					var _wrapHolderW = Math.ceil(_hold.find(_options.widthHolder).outerWidth()/_w);
				}
				scrollEl();
			},300);
		}
		this.onTouchStart =  function() {
			var e = window.event;
			if(_t) clearTimeout(_t);
			this.start = {
			  pageX: e.touches[0].pageX,
			  pageY: e.touches[0].pageY,
			  time: Number(new Date())
			};

			this.isScrolling = undefined;
			this.deltaX = 0;

			_wrap.css('MozTransitionDuration', 0);
			_wrap.css('webkitTransitionDuration', 0);
			e.stopPropagation();
		};

		this.onTouchMove =  function() {
			var e = window.event;
			// ensure swiping with one touch and not pinching
			if(e.touches && e.touches.length > 1 || e.scale && e.scale !== 1) return;

			this.deltaX = e.touches[0].pageX - this.start.pageX;
			// determine if scrolling test has run - one time test
			if ( typeof this.isScrolling == 'undefined') {
			  this.isScrolling = !!( this.isScrolling || Math.abs(this.deltaX) < Math.abs(e.touches[0].pageY - this.start.pageY) );
			}

			// if user is not trying to scroll vertically
			if (!this.isScrolling) {

				// prevent native scrolling 
				e.preventDefault();

				// cancel slideshow
				//clearTimeout(this.interval);

				// increase resistance if first or last slide
				this.deltaX = 
				this.deltaX / 
					( (!_active && this.deltaX > 0               // if first slide and sliding left
						|| _active == this.length - 1              // or if last slide and sliding right
						&& this.deltaX < 0                            // and if sliding at all
					) ?                      
					( Math.abs(this.deltaX) / _w + 1 )      // determine resistance level
					: 1 );                                          // no resistance if false

					// translate immediately 1-to-1
					//_wrap.css('MozTransform', 'translate3d(' + (this.deltaX - _active * _w) + 'px,0,0)');
					//_wrap.css('webkitTransform', 'translate3d(' + (this.deltaX - _active * _w) + 'px,0,0)');
					//this.element.style.MozTransform = this.element.style.webkitTransform = 'translate3d(' + (this.deltaX - this.index * this.width) + 'px,0,0)';
					_wrap.css('marginLeft', (this.deltaX - _active * _w));
					e.stopPropagation();
			}

		};

		this.onTouchEnd =  function(e) {
			// determine if slide attempt triggers next/prev slide
			if(!this.start || !this.start.time) return;
			var isValidSlide = 
			      Number(new Date()) - this.start.time < 250      // if slide duration is less than 250ms
			      && Math.abs(this.deltaX) > 20                   // and if slide amt is greater than 20px
			      || Math.abs(this.deltaX) > _w/2,        // or if slide amt is greater than half the width

			// determine if slide attempt is past start and end
			    isPastBounds = 
			      !this.index && this.deltaX > 0                          // if first slide and slide amt is greater than 0
			      || this.index == this.length - 1 && this.deltaX < 0;    // or if last slide and slide amt is less than 0

			// if not scrolling vertically
			if (!this.isScrolling) {

				// call slide function with slide end value based on isValidSlide and isPastBounds tests
				_active = _active + ( isValidSlide && !isPastBounds ? (this.deltaX < 0 ? 1 : -1) : -1 );
				if(_active < 0) _active = 0;
				else if (_active >= (_count - _wrapHolderW + 1)){
					_active = (_count - _wrapHolderW + 1);
				}
				scrollEl();
				runTimer();
			}

			e.stopPropagation();
		}

		_wrap.on('touchstart', this.onTouchStart);
		_wrap.on('touchmove', this.onTouchMove);
		_wrap.on('touchend', this.onTouchEnd);
		_wrap.on('webkitTransitionEnd', this.onTouchEnd);
		_wrap.on('transitionEnd', this.onTouchEnd);
		jQuery(window).on('resize', this.reCheckDimensions);
		this.reCheckDimensions();

		this.callback = _options.callbackFn || function() {};
		return init();
	}

	// open-close init
function initOpenClose() {
	$('div.open-close').OpenClose({
		activeClass:'active',
		opener:'>a.opener',
		slider:'>div.slide',
		slideSpeed: 400
	});
}

// open-close plugin
jQuery.fn.OpenClose = function(_options){
	// default options
	var _options = jQuery.extend({
		activeClass:'active',
		opener:'.opener',
		slider:'.slide',
		slideSpeed: 400,
		animStart:false,
		animEnd:false,
		event:'click'
	},_options);

	return this.each(function(){
		// options
		var _holder = jQuery(this);
		var _slideSpeed = _options.slideSpeed;
		var _activeClass = _options.activeClass;
		var _opener = jQuery(_options.opener, _holder);
		var _slider = jQuery(_options.slider, _holder);
		var _animStart = _options.animStart;
		var _animEnd = _options.animEnd;
		var _event = _options.event;

		if(_slider.length) {
			_opener.bind(_event,function(){
				if(!_slider.is(':animated')) {
					if(typeof _animStart === 'function') _animStart();
					if(_holder.hasClass(_activeClass)) {
						_slider.slideUp(_slideSpeed,function(){
							if(typeof _animEnd === 'function') _animEnd();
						});
						_holder.removeClass(_activeClass);
					} else {
						_holder.addClass(_activeClass);
						_slider.slideDown(_slideSpeed,function(){
							if(typeof _animEnd === 'function') _animEnd();
						});
					}
				}
				return false;
			});
			if(_holder.hasClass(_activeClass)) _slider.show();
			else _slider.hide();
		}
	});
}
/*
 HTML5 Shiv v3.6.2pre | @afarkas @jdalton @jon_neal @rem | MIT/GPL2 Licensed
*/
/*@cc_on
;(function(l,f){function m(){var a=e.elements;return"string"==typeof a?a.split(" "):a}function i(a){var b=n[a[o]];b||(b={},h++,a[o]=h,n[h]=b);return b}function p(a,b,c){b||(b=f);if(g)return b.createElement(a);c||(c=i(b));b=c.cache[a]?c.cache[a].cloneNode():r.test(a)?(c.cache[a]=c.createElem(a)).cloneNode():c.createElem(a);return b.canHaveChildren&&!s.test(a)?c.frag.appendChild(b):b}function t(a,b){if(!b.cache)b.cache={},b.createElem=a.createElement,b.createFrag=a.createDocumentFragment,b.frag=b.createFrag();
a.createElement=function(c){return!e.shivMethods?b.createElem(c):p(c,a,b)};a.createDocumentFragment=Function("h,f","return function(){var n=f.cloneNode(),c=n.createElement;h.shivMethods&&("+m().join().replace(/\w+/g,function(a){b.createElem(a);b.frag.createElement(a);return'c("'+a+'")'})+");return n}")(e,b.frag)}function q(a){a||(a=f);var b=i(a);if(e.shivCSS&&!j&&!b.hasCSS){var c,d=a;c=d.createElement("p");d=d.getElementsByTagName("head")[0]||d.documentElement;c.innerHTML="x<style>article,aside,figcaption,figure,footer,header,hgroup,nav,section{display:block}mark{background:#FF0;color:#000}</style>";
c=d.insertBefore(c.lastChild,d.firstChild);b.hasCSS=!!c}g||t(a,b);return a}var k=l.html5||{},s=/^<|^(?:button|map|select|textarea|object|iframe|option|optgroup)jQuery/i,r=/^(?:a|b|code|div|fieldset|h1|h2|h3|h4|h5|h6|i|label|li|ol|p|q|span|strong|style|table|tbody|td|th|tr|ul)jQuery/i,j,o="_html5shiv",h=0,n={},g;(function(){try{var a=f.createElement("a");a.innerHTML="<xyz></xyz>";j="hidden"in a;var b;if(!(b=1==a.childNodes.length)){f.createElement("a");var c=f.createDocumentFragment();b="undefined"==typeof c.cloneNode||
"undefined"==typeof c.createDocumentFragment||"undefined"==typeof c.createElement}g=b}catch(d){g=j=!0}})();var e={elements:k.elements||"abbr article aside audio bdi canvas data datalist details figcaption figure footer header hgroup mark meter nav output progress section summary time video",version:"3.6.2pre",shivCSS:!1!==k.shivCSS,supportsUnknownElements:g,shivMethods:!1!==k.shivMethods,type:"default",shivDocument:q,createElement:p,createDocumentFragment:function(a,b){a||(a=f);if(g)return a.createDocumentFragment();
for(var b=b||i(a),c=b.frag.cloneNode(),d=0,e=m(),h=e.length;d<h;d++)c.createElement(e[d]);return c}};l.html5=e;q(f)})(this,document); 
@*/

if(browserInfo.msie && browserInfo.version < 9) {
/*! matchMedia() polyfill - Test a CSS media type/query in JS. Authors & copyright (c) 2012: Scott Jehl, Paul Irish, Nicholas Zakas. Dual MIT/BSD license */
/*! NOTE: If you're already including a window.matchMedia polyfill via Modernizr or otherwise, you don't need this part */
;window.matchMedia=window.matchMedia||(function(e,f){var c,a=e.documentElement,b=a.firstElementChild||a.firstChild,d=e.createElement("body"),g=e.createElement("div");g.id="mq-test-1";g.style.cssText="position:absolute;top:-100em";d.style.background="none";d.appendChild(g);return function(h){g.innerHTML='&shy;<style media="'+h+'"> #mq-test-1 { width: 42px; }</style>';a.insertBefore(d,b);c=g.offsetWidth==42;a.removeChild(d);return{matches:c,media:h}}})(document);

/*! Respond.js v1.1.0: min/max-width media query polyfill. (c) Scott Jehl. MIT/GPLv2 Lic. j.mp/respondjs  */
(function(e){e.respond={};respond.update=function(){};respond.mediaQueriesSupported=e.matchMedia&&e.matchMedia("only all").matches;if(respond.mediaQueriesSupported){return}var w=e.document,s=w.documentElement,i=[],k=[],q=[],o={},h=30,f=w.getElementsByTagName("head")[0]||s,g=w.getElementsByTagName("base")[0],b=f.getElementsByTagName("link"),d=[],a=function(){var D=b,y=D.length,B=0,A,z,C,x;for(;B<y;B++){A=D[B],z=A.href,C=A.media,x=A.rel&&A.rel.toLowerCase()==="stylesheet";if(!!z&&x&&!o[z]){if(A.styleSheet&&A.styleSheet.rawCssText){m(A.styleSheet.rawCssText,z,C);o[z]=true}else{if((!/^([a-zA-Z:]*\/\/)/.test(z)&&!g)||z.replace(RegExp.jQuery1,"").split("/")[0]===e.location.host){d.push({href:z,media:C})}}}}u()},u=function(){if(d.length){var x=d.shift();n(x.href,function(y){m(y,x.href,x.media);o[x.href]=true;u()})}},m=function(I,x,z){var G=I.match(/@media[^\{]+\{([^\{\}]*\{[^\}\{]*\})+/gi),J=G&&G.length||0,x=x.substring(0,x.lastIndexOf("/")),y=function(K){return K.replace(/(url\()['"]?([^\/\)'"][^:\)'"]+)['"]?(\))/g,"jQuery1"+x+"jQuery2jQuery3")},A=!J&&z,D=0,C,E,F,B,H;if(x.length){x+="/"}if(A){J=1}for(;D<J;D++){C=0;if(A){E=z;k.push(y(I))}else{E=G[D].match(/@media *([^\{]+)\{([\S\s]+?)jQuery/)&&RegExp.jQuery1;k.push(RegExp.jQuery2&&y(RegExp.jQuery2))}B=E.split(",");H=B.length;for(;C<H;C++){F=B[C];i.push({media:F.split("(")[0].match(/(only\s+)?([a-zA-Z]+)\s?/)&&RegExp.jQuery2||"all",rules:k.length-1,hasquery:F.indexOf("(")>-1,minw:F.match(/\(min\-width:[\s]*([\s]*[0-9\.]+)(px|em)[\s]*\)/)&&parseFloat(RegExp.jQuery1)+(RegExp.jQuery2||""),maxw:F.match(/\(max\-width:[\s]*([\s]*[0-9\.]+)(px|em)[\s]*\)/)&&parseFloat(RegExp.jQuery1)+(RegExp.jQuery2||"")})}}j()},l,r,v=function(){var z,A=w.createElement("div"),x=w.body,y=false;A.style.cssText="position:absolute;font-size:1em;width:1em";if(!x){x=y=w.createElement("body");x.style.background="none"}x.appendChild(A);s.insertBefore(x,s.firstChild);z=A.offsetWidth;if(y){s.removeChild(x)}else{x.removeChild(A)}z=p=parseFloat(z);return z},p,j=function(I){var x="clientWidth",B=s[x],H=w.compatMode==="CSS1Compat"&&B||w.body[x]||B,D={},G=b[b.length-1],z=(new Date()).getTime();if(I&&l&&z-l<h){clearTimeout(r);r=setTimeout(j,h);return}else{l=z}for(var E in i){var K=i[E],C=K.minw,J=K.maxw,A=C===null,L=J===null,y="em";if(!!C){C=parseFloat(C)*(C.indexOf(y)>-1?(p||v()):1)}if(!!J){J=parseFloat(J)*(J.indexOf(y)>-1?(p||v()):1)}if(!K.hasquery||(!A||!L)&&(A||H>=C)&&(L||H<=J)){if(!D[K.media]){D[K.media]=[]}D[K.media].push(k[K.rules])}}for(var E in q){if(q[E]&&q[E].parentNode===f){f.removeChild(q[E])}}for(var E in D){var M=w.createElement("style"),F=D[E].join("\n");M.type="text/css";M.media=E;f.insertBefore(M,G.nextSibling);if(M.styleSheet){M.styleSheet.cssText=F}else{M.appendChild(w.createTextNode(F))}q.push(M)}},n=function(x,z){var y=c();if(!y){return}y.open("GET",x,true);y.onreadystatechange=function(){if(y.readyState!=4||y.status!=200&&y.status!=304){return}z(y.responseText)};if(y.readyState==4){return}y.send(null)},c=(function(){var x=false;try{x=new XMLHttpRequest()}catch(y){x=new ActiveXObject("Microsoft.XMLHTTP")}return function(){return x}})();a();respond.update=a;function t(){j(true)}if(e.addEventListener){e.addEventListener("resize",t,false)}else{if(e.attachEvent){e.attachEvent("onresize",t)}}})(this);
}
//easings extend
(function(){var baseEasings={};jQuery.each(["Quad","Cubic","Quart","Quint","Expo"],function(i,name){baseEasings[name]=function(p){return Math.pow(p,i+2);};});jQuery.extend(baseEasings,{Sine:function(p){return 1-Math.cos(p*Math.PI/2);},Circ:function(p){return 1-Math.sqrt(1-p*p);},Elastic:function(p){return p===0||p===1?p:-Math.pow(2,8*(p-1))*Math.sin(((p-1)*80-7.5)*Math.PI/15);},Back:function(p){return p*p*(3*p-2);},Bounce:function(p){var pow2,bounce=4;while(p<((pow2=Math.pow(2,--bounce))-1)/11){}
return 1/Math.pow(4,3-bounce)-7.5625*Math.pow((pow2*3-2)/22-p,2);}});jQuery.each(baseEasings,function(name,easeIn){jQuery.easing["easeIn"+name]=easeIn;jQuery.easing["easeOut"+name]=function(p){return 1-easeIn(1-p);};jQuery.easing["easeInOut"+name]=function(p){return p<0.5?easeIn(p*2)/2:1-easeIn(p*-2+2)/2;};});})();



(function($){$.fn.attributeFilterSort=function(collection,customOptions){var options={duration:750,easing:'swing',attribute:'data-id',adjustHeight:'auto',useScaling:true,enhancement:function(c){},selector:'> *',dx:0,dy:0};$.extend(options,customOptions);if($.browser.msie||(typeof($.fn.scale)=='undefined')){options.useScaling=false;}
var callbackFunction;if(typeof(arguments[1])=='function'){var callbackFunction=arguments[1];}else if(typeof(arguments[2]=='function')){var callbackFunction=arguments[2];}
return this.each(function(i){var val;var animationQueue=[];var $collection=$(collection).clone();var $sourceParent=$(this);var sourceHeight=$(this).css('height');var destHeight;var adjustHeightOnCallback=false;var offset=$($sourceParent).offset();var offsets=[];var $source=$(this).find(options.selector);if($.browser.msie&&parseInt($.browser.version)<7){$sourceParent.html('').append($collection);return;}
var postCallbackPerformed=0;var postCallback=function(){if(!postCallbackPerformed){postCallbackPerformed=1;$toDelete=$sourceParent.find('> *');$sourceParent.prepend($dest.find('> *'));$toDelete.remove();if(adjustHeightOnCallback){$sourceParent.css('height',destHeight);}
options.enhancement($sourceParent);if(typeof callbackFunction=='function'){callbackFunction.call(this);}}};var $correctionParent=$sourceParent.offsetParent();var correctionOffset=$correctionParent.offset();if($correctionParent.css('position')=='relative'){if($correctionParent.get(0).nodeName.toLowerCase()=='body'){}else{correctionOffset.top+=(parseFloat($correctionParent.css('border-top-width'))||0);correctionOffset.left+=(parseFloat($correctionParent.css('border-left-width'))||0);}}else{correctionOffset.top-=(parseFloat($correctionParent.css('border-top-width'))||0);correctionOffset.left-=(parseFloat($correctionParent.css('border-left-width'))||0);correctionOffset.top-=(parseFloat($correctionParent.css('margin-top'))||0);correctionOffset.left-=(parseFloat($correctionParent.css('margin-left'))||0);}
if(isNaN(correctionOffset.left)){correctionOffset.left=0;}
if(isNaN(correctionOffset.top)){correctionOffset.top=0;}
correctionOffset.left-=options.dx;correctionOffset.top-=options.dy;$sourceParent.css('height',$(this).height());$source.each(function(i){offsets[i]=$(this).offset();});$(this).stop();var dx=0;var dy=0;$source.each(function(i){$(this).stop();var rawObj=$(this).get(0);if(rawObj.style.position=='absolute'){dx=-options.dx;dy=-options.dy;}else{dx=options.dx;dy=options.dy;}
rawObj.style.position='absolute';rawObj.style.margin='0';rawObj.style.top=(offsets[i].top-parseFloat(rawObj.style.marginTop)-correctionOffset.top+dy)+'px';rawObj.style.left=(offsets[i].left-parseFloat(rawObj.style.marginLeft)-correctionOffset.left+dx)+'px';});var $dest=$($sourceParent).clone();var rawDest=$dest.get(0);rawDest.innerHTML='';rawDest.setAttribute('id','');rawDest.style.height='auto';rawDest.style.width=$sourceParent.width()+'px';$dest.append($collection);$dest.insertBefore($sourceParent);$dest.css('opacity',0.0);rawDest.style.zIndex=-1;rawDest.style.margin='0';rawDest.style.position='absolute';rawDest.style.top=offset.top-correctionOffset.top+'px';rawDest.style.left=offset.left-correctionOffset.left+'px';if(options.adjustHeight==='dynamic'){$sourceParent.animate({height:$dest.height()},options.duration,options.easing);}else if(options.adjustHeight==='auto'){destHeight=$dest.height();if(parseFloat(sourceHeight)<parseFloat(destHeight)){$sourceParent.css('height',destHeight);}else{adjustHeightOnCallback=true;}}
$source.each(function(i){var destElement=[];if(typeof(options.attribute)=='function'){val=options.attribute($(this));$collection.each(function(){if(options.attribute(this)==val){destElement=$(this);return false;}});}else{destElement=$collection.filter('['+options.attribute+'='+$(this).attr(options.attribute)+']');}
if(destElement.length){if(!options.useScaling){animationQueue.push({element:$(this),animation:{top:destElement.offset().top-correctionOffset.top,left:destElement.offset().left-correctionOffset.left,opacity:1.0}});}else{animationQueue.push({element:$(this),animation:{top:destElement.offset().top-correctionOffset.top,left:destElement.offset().left-correctionOffset.left,opacity:1.0,scale:'1.0'}});}}else{if(!options.useScaling){animationQueue.push({element:$(this),animation:{opacity:'0.0'}});}else{animationQueue.push({element:$(this),animation:{opacity:'0.0',scale:'0.0'}});}}});$collection.each(function(i){var sourceElement=[];var destElement=[];if(typeof(options.attribute)=='function'){val=options.attribute($(this));$source.each(function(){if(options.attribute(this)==val){sourceElement=$(this);return false;}});$collection.each(function(){if(options.attribute(this)==val){destElement=$(this);return false;}});}else{sourceElement=$source.filter('['+options.attribute+'='+$(this).attr(options.attribute)+']');destElement=$collection.filter('['+options.attribute+'='+$(this).attr(options.attribute)+']');}
var animationOptions;if(sourceElement.length===0){if(!options.useScaling){animationOptions={opacity:'1.0'};}else{animationOptions={opacity:'1.0',scale:'1.0'};}
d=destElement.clone();var rawDestElement=d.get(0);rawDestElement.style.position='absolute';rawDestElement.style.margin='0';rawDestElement.style.top=destElement.offset().top-correctionOffset.top+'px';rawDestElement.style.left=destElement.offset().left-correctionOffset.left+'px';d.css('opacity',0.0);if(options.useScaling){d.css('transform','scale(0.0)');}
d.appendTo($sourceParent);animationQueue.push({element:$(d),animation:animationOptions});}});$dest.remove();options.enhancement($sourceParent);for(i=0;i<animationQueue.length;i++){animationQueue[i].element.animate(animationQueue[i].animation,options.duration,options.easing,postCallback);}});};})(jQuery);


/*! HTML5 Shiv vpre3.6 | @afarkas @jdalton @jon_neal @rem | MIT/GPL2 Licensed */
;(function(o,s){var g=o.html5||{};var j=/^<|^(?:button|map|select|textarea|object|iframe|option|optgroup)jQuery/i;var d=/^<|^(?:a|b|button|code|div|fieldset|form|h1|h2|h3|h4|h5|h6|i|iframe|img|input|label|li|link|ol|option|p|param|q|script|select|span|strong|style|table|tbody|td|textarea|tfoot|th|thead|tr|ul)jQuery/i;var x;var k="_html5shiv";var c=0;var u={};var h;(function(){var A=s.createElement("a");A.innerHTML="<xyz></xyz>";x=("hidden" in A);h=A.childNodes.length==1||(function(){try{(s.createElement)("a")}catch(B){return true}var C=s.createDocumentFragment();return(typeof C.cloneNode=="undefined"||typeof C.createDocumentFragment=="undefined"||typeof C.createElement=="undefined")}())}());function i(A,C){var D=A.createElement("p"),B=A.getElementsByTagName("head")[0]||A.documentElement;D.innerHTML="x<style>"+C+"</style>";return B.insertBefore(D.lastChild,B.firstChild)}function q(){var A=n.elements;return typeof A=="string"?A.split(" "):A}function w(A){var B=u[A[k]];if(!B){B={};c++;A[k]=c;u[c]=B}return B}function t(D,A,C){if(!A){A=s}if(h){return A.createElement(D)}C=C||w(A);var B;if(C.cache[D]){B=C.cache[D].cloneNode()}else{if(d.test(D)){B=(C.cache[D]=C.createElem(D)).cloneNode()}else{B=C.createElem(D)}}return B.canHaveChildren&&!j.test(D)?C.frag.appendChild(B):B}function y(C,E){if(!C){C=s}if(h){return C.createDocumentFragment()}E=E||w(C);var F=E.frag.cloneNode(),D=0,B=q(),A=B.length;for(;D<A;D++){F.createElement(B[D])}return F}function z(A,B){if(!B.cache){B.cache={};B.createElem=A.createElement;B.createFrag=A.createDocumentFragment;B.frag=B.createFrag()}A.createElement=function(C){if(!n.shivMethods){return B.createElem(C)}return t(C)};A.createDocumentFragment=Function("h,f","return function(){var n=f.cloneNode(),c=n.createElement;h.shivMethods&&("+q().join().replace(/\w+/g,function(C){B.createElem(C);B.frag.createElement(C);return'c("'+C+'")'})+");return n}")(n,B.frag)}function e(A){if(!A){A=s}var B=w(A);if(n.shivCSS&&!x&&!B.hasCSS){B.hasCSS=!!i(A,"article,aside,figcaption,figure,footer,header,hgroup,nav,section{display:block}mark{background:#FF0;color:#000}")}if(!h){z(A,B)}return A}var n={elements:g.elements||"abbr article aside audio bdi canvas data datalist details figcaption figure footer header hgroup mark meter nav output progress section summary time video",shivCSS:!(g.shivCSS===false),supportsUnknownElements:h,shivMethods:!(g.shivMethods===false),type:"default",shivDocument:e,createElement:t,createDocumentFragment:y};o.html5=n;e(s);var b=/^jQuery|\b(?:all|print)\b/;var l="html5shiv";var r=!h&&(function(){var A=s.documentElement;return !(typeof s.namespaces=="undefined"||typeof s.parentWindow=="undefined"||typeof A.applyElement=="undefined"||typeof A.removeNode=="undefined"||typeof o.attachEvent=="undefined")}());function f(E){var F,C=E.getElementsByTagName("*"),D=C.length,B=RegExp("^(?:"+q().join("|")+")jQuery","i"),A=[];while(D--){F=C[D];if(B.test(F.nodeName)){A.push(F.applyElement(v(F)))}}return A}function v(C){var D,A=C.attributes,B=A.length,E=C.ownerDocument.createElement(l+":"+C.nodeName);while(B--){D=A[B];D.specified&&E.setAttribute(D.nodeName,D.nodeValue)}E.style.cssText=C.style.cssText;return E}function a(D){var F,E=D.split("{"),B=E.length,A=RegExp("(^|[\\s,>+~])("+q().join("|")+")(?=[[\\s,>+~#.:]|jQuery)","gi"),C="jQuery1"+l+"\\:jQuery2";while(B--){F=E[B]=E[B].split("}");F[F.length-1]=F[F.length-1].replace(A,C);E[B]=F.join("}")}return E.join("{")}function p(B){var A=B.length;while(A--){B[A].removeNode()}}function m(A){var E,C,B=A.namespaces,D=A.parentWindow;if(!r||A.printShived){return A}if(typeof B[l]=="undefined"){B.add(l)}D.attachEvent("onbeforeprint",function(){var F,J,H,L=A.styleSheets,I=[],G=L.length,K=Array(G);while(G--){K[G]=L[G]}while((H=K.pop())){if(!H.disabled&&b.test(H.media)){try{F=H.imports;J=F.length}catch(M){J=0}for(G=0;G<J;G++){K.push(F[G])}try{I.push(H.cssText)}catch(M){}}}I=a(I.reverse().join(""));C=f(A);E=i(A,I)});D.attachEvent("onafterprint",function(){p(C);E.removeNode(true)});A.printShived=true;return A}n.type+=" print";n.shivPrint=m;m(s)}(this,document));