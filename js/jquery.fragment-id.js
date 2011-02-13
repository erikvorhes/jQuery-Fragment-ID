/*
 * An attempt to implement http://simonstl.com/articles/cssFragID.html.
 * It will scroll to http://example.com/#css(.class :nth-child(2)) or whatever 
 * jQuery selector you include within "#css()".
 * Note: this will evolve very much. Right now it's pretty fragile!
 * By: Erik Vorhes (Thanks to Jeremy Kahn for helping me think through this.)
 *
 * This fork was exuberantly modified by Jeremy Kahn - jeremyckahn@gmail.com
 *
 * Tested in Chrome, Firefox, Safari, IE 7 and 8.
 * 
 * Usage:  Somewhere in `$.ready()`, call `$.gotoFrag()` with your options, detailed below.
 * When the page is opened with the proper URL hash string format, the page will scroll to the
 * element specified by the jQuery selector string.  Here's the format:
 * 
 * http://example.com/#css(_selector_)
 *     - Where _selector_ is the jQuery selector string
 *
 * Parameters!
 * 
 * @param {Object} options This is the object containing the options to set
 *    @param {Number} duration How long the scrolling animation runs for
 *    @param {Function} complete The callback function that is called when the animation completes.  It gets the jQuery object for the targeted element in the hash string as the first parameter
 *
 * @example
 *
 * 	$(function() {
 *      $.gotoFrag({
 *        'duration': 2500,
 *        'complete': function (el) {
 *           el.css({
 *             'background' : '#ff8'
 *           })
 *        }
 *      });
 *  });
 *
 * Yay!  It's like magic!
 */
(function ($) {
	
	var defaults = {
		'duration': 1000
	};

    $.gotoFrag = function gotoFrag(options) {
        var hash = decodeURIComponent(window.location.hash).match(/^#css\((.+)\)$/i),
            targetEl, 
			targetClass, 
			fakeEl;

		// Copy any options that were not defined in `options` from `defaults`.
        options = $.extend( (options || {}), defaults);
        targetClass = options.targetClassName || 'target';

        if (hash && hash[1]) {
            targetEl = $(hash[1]).first();

            if ( !! targetEl.length) {

                fakeEl = $('<div>');
                fakeEl.css({
                    'width': document.body.scrollTop
                }).animate({
                    'width': targetEl.offset().top
                }, {
                    'duration': options.duration || 750,
                    'step': function () {
                        // You need to set the scrollTop property for both the body and documentElement
                        // for this to work cross-browser, SWEET
                        document.documentElement.scrollTop = document.body.scrollTop = fakeEl.css('width').replace(/px$/, '');
                    },
                    'complete': function () {
                        targetEl.addClass(targetClass);

                        if (options.complete) {
                            options.complete(targetEl);
                        }
                    }
                });
            }

        }
        return this;
    };

	// Detect to see if Ben Alman's jQuery Hashchange plugin is present.
	if (!!$.fn.hashchange) {
		$(window).hashchange(function (ev) {
			$.gotoFrag();
		});
	}

})(jQuery);