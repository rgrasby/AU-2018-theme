// ==================================================
// Global JavaScript 
//
// University Relations Web Services
// This file is shared across all AU websites
//
// ==================================================
$(function () {    

    /*
    Adding call to action buttons to the syllabus pages
    =====================================================================*/
    $calls = $("#calls");
    $calls.addClass("button-links");
    $calls.wrapInner("<div class=\"button-links-inner\"></div>"); 
    $(".syllabus.undergraduate #calls #becomestudent").html("<a href='https://www.athabascau.ca/admissions/applying-undergraduate/'><i class=\"fa fa-user\" aria-hidden=\"true\"></i> Become a Student</a>");
    $(".syllabus.undergraduate #calls #registercourse").html("<a href='https://www.athabascau.ca/admissions/course-registration/'><i class=\"fa fa-mouse-pointer\" aria-hidden=\"true\"></i> Register for a Course</a>");
    $( "<div id='calculate-fees' class='call-to-action'><a href='https://www.athabascau.ca/globalIncludes/components/calculator-embed/' data-fancybox data-type=\"iframe\"><i class='fa fa-calculator'></i> Calculate Course Fees</a></div>" ).insertAfter( $( "#registercourse" ) );
    $(".syllabus.graduate #calls #becomestudent").html("<a href='https://www.athabascau.ca/admissions/applying-graduate/'><i class=\"fa fa-user\" aria-hidden=\"true\"></i>Become a Student</a>");
    $(".syllabus.graduate #calls #registercourse").html("<a href='https://tux.athabascau.ca/oros/servlet/DispatcherServlet'><i class=\"fa fa-mouse-pointer\" aria-hidden=\"true\"></i> Register for a Course</a>");
    $('#course-evaluation table br').remove();
    $('#course-details, #course-notes').wrapAll("<div class=\"course-details-wrap\"></div>");
    $('#course-header, #related-links, #graduate-related-links').wrapAll("<div class=\"clearfix\"></div>");
    $('#course-details, #course-notes').fadeIn();
     
    /*
    Check if mobile device and add a class to the body to indicate it is
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
    Tooltips
    =====================================================================*/
    $('.popup').tooltipster({
        animation: 'fade',
        delay: 200,
        theme: 'tooltipster-light',
        trigger: 'click',
        maxWidth: 300,
        arrow: false
    });
    
    /*
    Check if a list has links. If they do apply styling for list with links.
    This is something that should be done in the HTML code but this will 
    cover list that are missed so everything is consistent
    =====================================================================*/
    if(!$('ul').hasClass('link-list')){
        $('#main-content ul li a').closest('ul').addClass('link-list');
    }

    /*
    Add a horizontal rule on syllabus pages between every new <h2>
    If an <hr> is already there we won't bother adding it again
    =====================================================================*/  
    if (!$('.syllabus .section').closest('hr').length > 0){
        $('.syllabus h2').before('<hr>');   
    }

    /*
    Update links that use to be shadowbox to use fancybox instead. Ideally we 
    would want to do this in the HTML code, but this will do for now.
    =====================================================================*/  
    $('a').each(function() {
        if (this.href.indexOf('calculator-embed') != -1) {
            $(this).removeAttr('rel');
            $(this).attr('data-fancybox', '');
            $(this).attr('data-type', 'iframe');
        }
    });

    /*
    Fancybox 3 initialization and options
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
    Contact page pilot ITSS status script 
    =====================================================================*/
    var $issueName = $('#itss a img').prop('alt'),
        $systemMessage = $('.system .msg');

    if ($issueName == "System Status: yellow") {
        $systemMessage.addClass('warning').find('p').append('<i class="fa fa-exclamation-circle" aria-hidden="true"></i><strong>IT System Status: Issue or Alert - </strong> A system is currently unavailable or undergoing maintenance. [More Details]');
    } else if ($issueName == "System Status: red") {
        $systemMessage.addClass('error').find('p').append('<i class="fa fa-times-circle" aria-hidden="true"></i><strong>IT System Status: Warning - </strong> Our automated monitoring has detected potential issues/outages with one or more systems. [More Details]');
    } else if ($issueName == "System Status: success") {
        $systemMessage.addClass('success').find('p').append('<i class="fa fa-check-circle" aria-hidden="true"></i><strong>IT System Status: Optimal - </strong> There are currently no known issues or outages.');
    } else if ($issueName == "System Status: warning") {
        $systemMessage.addClass('warning').find('p').append('<i class="fa fa-info-circle" aria-hidden="true"></i><strong>IT System Status: Potential Issue:</strong> - We have detected potential issues/outages with one or more systems. [More Details]');
    } else {
        $systemMessage.addClass('info').find('p').append('<i class="fa fa-info-circle" aria-hidden="true"></i><strong>IT System Status:</strong> No system information available. [More Details]');
    }
    
    /*
    Match height of elements
    =====================================================================*/
    $('.equal, .equal2, .equal3, .equal4').matchHeight();
    $('.equal-no-row').matchHeight('false');
    
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
    
    /*
    Change links to HTTPS
    =====================================================================*/
    $('#main-content a').each(function(){
         this.href = this.href.replace('http://www.athabascau.ca', 'https://www.athabascau.ca');
    });   
    
    /*
    Bootstrap dropdown select
    =====================================================================*/
    $('.dropdown-toggle').dropdown();
    
});