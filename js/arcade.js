(function ($) {
	'use strict';
	/*jslint browser: true*/
	/*jslint nomen: true*/
	/*jshint smarttabs:true*/
	/*global jQuery, _*/
	var acc,
		activeCosts,
		activeItems,
		browserHeight,
		browserWidth,
		costsArray = [],
		currItem,
		fadePos,
		fades = [],
		fLen,
		gallery,
		galleryH,
		galleryPos,
		gameArray = ['dk', 'sf', 'pac', 'tron', 'ff', 'po', 'tron'],
		grandTotal,
		html5,
		iLen,
		isMSIE,
		itemPos,
		items,
		processScroll,
		screenW,
		scrollPos = window.pageYOffset,
		sidebarItems,
		sidebarOffset,
		sidebarWrap,
		stickyHeight,
		stickyX,
		stickyY,
		t,
		// throttledScroll = _.throttle(processScroll, 90),
		videoOne,
		videoPos1,
		videoPos2,
		videoTwo,
		vidH;

if (document.querySelector && window.localStorage && window.addEventListener) {
	document.onreadystatechange = function () {
        if (document.readyState === 'complete') {
			browserWidth = window.innerWidth || $(window).width();
			browserHeight = window.innerHeight || $(window).height();
			html5 = true;
			screenW = screen.width;
			isMSIE = /*@cc_on!@*/false;

			if (isMSIE) {
				$('body').addClass('ie');
			}

			if (/MSIE (\d+\.\d+);/.test(navigator.userAgent)) {
				$('body').addClass('ie');
			}

			if (screenW > 480) {
				sidebarOffset = $(document.getElementById('sidebar')).offset().top;
				sidebarWrap = document.getElementById('sidebar-wrap');
				fades = document.getElementsByClassName('fader');
				fLen = fades.length;
				items = document.getElementsByClassName('arcade-item');
				iLen = items.length;
				sidebarItems = sidebarWrap.getElementsByClassName('item');
				stickyX = $(sidebarWrap).offset().left;
				stickyY = $(sidebarWrap).offset().top;
				stickyHeight = (sidebarWrap.innerHeight || $(sidebarWrap).height()) + 100;
				videoOne = $('#video-1');
				videoTwo = $('#video-2');
				vidH = videoOne.height() + 200;
				activeItems = sidebarWrap.getElementsByClassName('active');
				activeCosts = $(activeItems).find('.item-cost');
				acc = sidebarWrap.getElementsByClassName('accessories')[0];
				t = $('.grand-total').find('.item-name');
				videoPos1 = $(videoOne).offset().top - 200;
				videoPos2 = $(videoTwo).offset().top - 200;

				$('.gallery-wrap').appendTo('#gallery-blank-canvas-wrapper');
				$('.cover-sequence video, .wrapper.first').removeClass('loading');

				gallery = $('.gallery-wrap');
				galleryH = gallery.height() + 200;
				galleryPos = $(gallery).offset().top - 200;

		        document.getElementsByTagName('video')[0].play();

		        setUpDek();
			}
		}
	};

	window.onload = function() {
		if (screenW > 480) {
			browserWidth = window.innerWidth || $(window).width();
			browserHeight = window.innerHeight || $(window).height();
			setUpDek();

			_.delay(function() {
				$('.cover-sequence *').removeClass('loading');
			}, 1500);
		}
	};

	$(window).on('scroll', function() {
		if (html5) {
			processScroll();
		}
	});

	$(window).on('resize', function() {
		if (screenW > 480) {
			browserWidth = window.innerWidth || $(window).width();
			browserHeight = window.innerHeight || $(window).height();
			sidebarOffset = $(document.getElementById('sidebar')).offset().top;
			videoPos1 = $(videoOne).offset().top - 200;
			videoPos2 = $(videoTwo).offset().top - 200;
			galleryPos = $(gallery).offset().top - 200;
			setUpDek();
		}
	});

} else {
	html5 = false;
	$('.fader').addClass('fade-in-up');
	$('#sidebar').hide();
}

	$('video').on('click', function() {
		this.play();
	});

	$('.accessories-toggle').on('click', function() {
		if (browserHeight > 760) {
			$(this).parent().find('li').toggleClass('show');
		}
	});

	$('.arcade-item').on('mouseenter', function() {
		var i = 0,
            len = gameArray.length;

        while (len--) {
			if ($(this).hasClass(gameArray[i])) {
				$('#sidebar-wrap').find('.' + gameArray[i]).addClass('active');
			}
            i += 1;
        }
	}).on('mouseleave', function() {
		$(sidebarWrap).find('.pullquote').removeClass('active');
	});

	function setUpDek() {
		if (browserHeight > ((browserWidth - 50) * 0.7)) {
			document.getElementsByClassName('cover-sequence')[0].style.height = 'auto';
		} else {
			$('.cover-sequence').css('height', (browserHeight - 50) + 'px');
		}

		$('hgroup').css({
            'margin-left': -($('hgroup').width() / 2),
            'margin-top': -($('hgroup').height() / 2)
        });
	}

	processScroll = _.throttle(function() {
		if (screenW > 480) {
			scrollPos = window.pageYOffset;
			stickyY = $(sidebarWrap).offset().top;
			stickyHeight = $(sidebarWrap).height() + 100;

			if ((scrollPos+stickyHeight) > videoPos1 && scrollPos < (videoPos1+vidH)) {
				sidebarWrap.style.display = 'none';
			} else if ((scrollPos+stickyHeight) > videoPos2 && scrollPos < (videoPos2+vidH)) {
				sidebarWrap.style.display = 'none';
			} else if ((scrollPos+stickyHeight) > galleryPos && scrollPos < (galleryPos+galleryH)) {
				sidebarWrap.style.display = 'none';
			} else {
				sidebarWrap.style.display = 'block';
			}

			if ((scrollPos + 100) > sidebarOffset) {
				sidebarWrap.classList.add('sticky');
			} else {
				sidebarWrap.classList.remove('sticky');
			}

			$.each(fades, function(index) {
				fadePos = $(this).offset().top;

				if (scrollPos > (fadePos - (browserHeight * 0.75))) {
					fades[index].classList.add('fade-in-up');
				} else {
					fades[index].classList.remove('fade-in-up');
				}
				if (fades[index].tagName === 'VIDEO') {
					fades[index].play();
				}
			});

			$.each(items, function(index) {
				itemPos = $(this).offset().top;
				currItem = sidebarWrap.getElementsByClassName('item')[index];

				if (scrollPos > (itemPos - (browserHeight * 0.75))) {
					this.classList.add('active');
					$(currItem).prepareTransition().addClass('active');
					if ($(this).hasClass('lotr')) {
						acc.classList.add('active');
						$(t).text('Grand Total');
						$(t).addClass('dark-gray');
					}
				} else {
					this.classList.remove('active');
					$(currItem).prepareTransition().removeClass('active is-transitioning');
					if ($(this).hasClass('lotr')) {
						acc.classList.remove('active');
						$(t).text('Sub Total');
						$(t).removeClass('dark-gray');
					}
				}
			});

			activeItems = $(sidebarWrap).find('.active');
			activeCosts = activeItems.find('.item-cost');
			costsArray.length = 0;
			grandTotal = 3000;

			activeCosts.each(function() {
				var activeString = this.innerHTML;
					activeString = activeString.replace('$', '');
					activeString = parseInt(activeString);

					costsArray.push(activeString);
			});

			$('.total-item-cost').html(
				'$' +
				costsArray.reduce(function(prev, curr) {
					return prev + curr;
				}, 0)
			);
		}
	}, 90);

/* CHECKS THE LOCATION OF THE BOTTOM OF EVERY "HIDEME" ELEMENT AGAINST THE BOTTOM EDGE OF YOUR VISIBLE WINDOW
$(window).scroll( function(){
	$('.hideme').each( function(i){
		var bottom_of_object =
		$(this).position().top +
		$(this).outerHeight();
			var bottom_of_window =
		$(window).scrollTop() +
		$(window).height();

if( bottom_of_window > bottom_of_object){
	$(this).animate({'opacity':'1'}, 500);
	}
});
});*/

}(jQuery));