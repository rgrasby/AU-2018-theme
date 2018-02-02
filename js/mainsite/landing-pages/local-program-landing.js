/**
 * AU Program Landing Pages
 * Web Services - Advancement
 */

$(function () {

    /* 
    Add a class to the stats based on count
    =====================================================================*/
    var getStatCount = (function () {
        function statCountClass() {
            $countStats = $('.stats li').length;
            $('#stats-wrap ul').addClass('stats-'+$countStats);
        }
        statCountClass(); 
    }());
    
    /* 
    Fade Hero content on scroll
    =====================================================================*/
    var fadeStart = 100,
        fadeUntil = 700,
        $fading = $('.hero-content');

    $(window).bind('scroll', function(){
        var offset = $(document).scrollTop(),
            opacity = 0;
        if( offset<=fadeStart ){
            opacity = 1;
        }else if( offset<=fadeUntil ){
            opacity = 1 - offset/fadeUntil;
        }
        $fading.css('opacity',opacity);
    });
    
    /* 
    Full Progams Details Panel
    =====================================================================*/
    var contentReveal = (function () {
        var $contentRevealTrigger1 = $("#reveal-trigger-1, #hero-reveal-trigger"),
            $contentRevealTrigger2 = $("#reveal-trigger-2"),
            $contentRevealDates = $("#content-reveal-dates"),
            $contentWrapper = $("#tab-wrapper"),
            url = document.location.toString();
        
        //bind events
        $contentRevealTrigger2.on("click", toggleContent);
        $contentRevealTrigger1.on("click", openContent);
        $contentRevealDates.on("click", openContent);     
        
        //toogle details panel visibility when user interacts with large trigger button
        function toggleContent() {
            $contentRevealTrigger2.toggleClass('is-open');
            $contentWrapper.slideToggle('fast', function(){            
                $('html, body').animate({
                  scrollTop: $contentWrapper.offset().top - 175
                }, 1000);
                return false;
            });
            //toggle aria attributes
            $contentWrapper.attr('aria-hidden', function (i, attr) {
                return attr == 'true' ? 'false' : 'true'
            });
            $(this).attr("aria-expanded", function (i, attr) {
                return attr == 'true' ? 'false' : 'true'
            });
        }
        
        //open details panel when user clicks on "full program details" button in sticky nav
        function openContent() {
            $contentRevealTrigger2.addClass('is-open');
            $contentWrapper.slideDown('fast', function(){            
                $('html, body').animate({
                  scrollTop: $contentWrapper.offset().top - 175
                }, 1000);
                return false;
            });
            //toggle aria attributes
            $contentWrapper.attr('aria-hidden', false);
            $(this).attr('aria-expanded', true);
        }
            
        //open program summary tab with URL (#program-summary)
        function urlOpen() {
            if (url.match('#program-summary')) {
                openContent();
            }
        }
        
        urlOpen();
        
        return {
            openContent: openContent
        };
        
    }());
    
}());

    