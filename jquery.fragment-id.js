/*
 * An attempt to implement http://simonstl.com/articles/cssFragID.html.
 * It will scroll to http://example.com/#css(.class :nth-child(2)) or whatever 
 * jQuery selector you include within "#css()".
 * Note: this will evolve very much. Right now it's pretty fragile!
 * By: Erik Vorhes (Thanks to Jeremy Khan for helping me think through this.)
 *
 */
(function ($) {
    var theHash = decodeURIComponent(window.location.hash).match(/^#css\((.+)\)$/i)[1];
    $(function () {
        if ($(theHash).length > 1) {
            theHash += ':first';
        }
        var $hash = $(theHash),
            targetClass = 'target';
        $('.' + targetClass).removeClass(targetClass);
        $('html,body').animate({scrollTop: $hash.offset().top}, {
            duration: 300,
            complete: function () {
                $hash.addClass(targetClass);
            }
        });
    });
})(jQuery);