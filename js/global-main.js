$(function () {    

    /*
    Check if mobile device and add a class to the body
    =====================================================================*/
    (function(){
        if (typeof(WURFL) != 'undefined'){
            if (WURFL.is_mobile === true) {
                //mobile device detected
                $('body').addClass('mobile-device');  
            }
        }
    })();  
    
    /*
    Fancybox 3 Options
    =====================================================================*/    
    $("[data-fancybox]").fancybox({
        loop : true,
        buttons: [
            'fullScreen',
            'thumbs',
            'zoom',
            'close'
        ],
    });
    
    /*
    Match height of elements
    =====================================================================*/
    $('.equal').matchHeight();
    $('.equal2').matchHeight('false');
    
    /* 
    Readmore toggle
    =====================================================================*/
    var readeMoreToggle = (function () {

        //declare variables
        var $readMoreTrigger = $('.readmore');

        //bind events
        $readMoreTrigger.on('click', openReadMore);

        //toggle element open or closed
        function openReadMore(e) {
            e.preventDefault();
            var elementToOpen = $(this).attr('rel');
            //toggle accordions open and closed
            if ($('#' + elementToOpen).is(":visible")) {
                $(this).removeClass('open').attr('aria-expanded', false);
                $('#' + elementToOpen).slideUp('fast').attr('aria-hidden', false);
            } else {
                $(this).addClass('open').attr('aria-expanded', true);
                $('#' + elementToOpen).slideDown('fast').attr('aria-hidden', true);
            }
        }
    }());

    /* 
    Google inspired form input focus
    =====================================================================*/
    $('.material-form .input-group input, .material-form .input-group textarea, .au-form .input-group input, .au-form .input-group textarea').focusout(function(){
        if(!$(this).val()) {
            $(this).removeClass('has-value');
        } else {
            $(this).addClass('has-value');
        }
    });
    
    /*
    Smooth scroll to anchor
    =====================================================================*/
    var smoothScroll = (function () {
        //declare variables
        var $smoothLinks = $('.smooth-link, #section-jump-nav li a')
        //bind events    
        $smoothLinks.on('click', smoothScrollIt);
        
        function smoothScrollIt() {
        
            if (location.pathname.replace(/^\//,'') == this.pathname.replace(/^\//,'') && location.hostname == this.hostname) {
                var target = $(this.hash);
                target = target.length ? target : $('[name=' + this.hash.slice(1) +']');
                if (target.length) {
                    $('html, body').animate({
                        scrollTop: target.offset().top
                    }, 1000);
                    //update URL hash
                    window.location.hash = $(this).attr('href');
                    return false;
                }
            }
        }
    }());
    
});