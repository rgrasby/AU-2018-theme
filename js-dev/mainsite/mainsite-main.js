//Self-Executing Anonymous Functions to keep our global variables from interfering with any other JS
$(function () {

    //global variables
    var $mainHeader = $('#main-header'),
        $utility = $('#utility'),
        $utilityHeight = $utility.outerHeight(),
        $headerHeight = $mainHeader.outerHeight(),
        $combinedHeight = $utilityHeight + $headerHeight,
        $totalPaths;        

    /* Owl Carousel
    =====================================================================*/
    var $carousel = $('.owl-carousel'),
        $carouselWithContent = $('.owl-carousel-with-info'),
        $carouselContent = $('#carousel-info');
    
    $carousel.owlCarousel({
        loop: false,
        nav: true,
        dots: true,
        margin: 20,
        navText: ['<i class="fa fa-angle-left" aria-hidden="true"></i>', '<i class="fa fa-angle-right" aria-hidden="true"></i>'],
        responsive : {
            0: {
                items: 1,
                stagePadding: 0
            },
            478: {
                items: 2
            },
            1250: {
                items: 3
            }
        }
    });
    
    /* Fancybox iframe options
    =====================================================================*/
    $('[data-fancybox]').fancybox({
        toolbar  : false,
        smallBtn : true,
        iframe : {
            preload : false
        }
    })
    
    /* Custom Owl Carousel that reveals content that matches the carousel index number
    =====================================================================*/
    $carouselWithContent.children().each(function (index) {
        $(this).attr('data-position', index); 
    });

    //check how many paths a student can take. We will initialize the correct owl carousel based on this number
    $totalPaths = $('.item').length;

    //if there is MORE than 2 paths, initialize owl carousel making sure one is centered and it loops
    if ($totalPaths > 2) {
        $carouselWithContent.owlCarousel({
            loop: true,
            nav: true,
            dots: true,
            margin: 20,
            center: true, 
            startPosition: 0,
            navText: ['<i class="fa fa-angle-left" aria-hidden="true"></i>','<i class="fa fa-angle-right" aria-hidden="true"></i>'],
            responsive :{
                0:{
                    items: 1,
                },
                478:{
                    items: 2,
                },
                1250:{
                    items: 3,
                },
            }
        });
        
        //allows users to click on carousel item so it brings it to the center. ONLY for items with 3 or more
        $('document').on('click', '.owl-item > div', function() {
            $carouselWithContent.trigger('to.owl.carousel', $(this).data( 'position' ) );
        });
        
    //if there is LESS than 2 paths, initialize owl carousel making sure the first one is selected and it does not loop  
    } else {
        $carouselWithContent.owlCarousel({
            loop: false,
            dots: true,
            nav: true,
            margin: 20,
            mouseDrag: false,
            startPosition: 0,
            navText: ['<i class="fa fa-angle-left" aria-hidden="true"></i>','<i class="fa fa-angle-right" aria-hidden="true"></i>'],
            responsive :{
                0:{
                    items: 1,
                    touchDrag: true,
                    mouseDrag: true
                },
                1250:{
                    items: 2
                },
            }
        });   
        if ($totalPaths <= 2){
            $('.owl-item:first-of-type').addClass('center');
            $( '.owl-item > div').click(function() {
                var current = $(this).attr('rel');
                $('.owl-item').removeClass('center');
                $(this).closest('.owl-item').addClass('center');
                $('[id*="item"]').fadeOut();          
                $('#' + current).fadeIn();                        
            });
        }
    }
    

    /*
    Animated stats
    =====================================================================*/
    if ($('.discover-au-content, .counter').length > 0) { 
        $('#home-stats li strong span').counterUp({
            time: 500
        });
    }
    
    /*
    Check if mobile device
    =====================================================================*/
    (function(){
        var $animatedElements = $('.shield-seperator, #reveal-trigger-2, #cursor-apply-btn');
        if (typeof(WURFL) !== 'undefined'){
            if (WURFL.is_mobile === true) {
                //mobile device detected
                $animatedElements.addClass('no-animation');
                $('body').addClass('mobile-device');
            } else {
                //desktop device detected
                $animatedElements.waypoint(function() {
                $animatedElements.addClass('animated fadeInDown');
               },{ offset: 'bottom-in-view' });       
            }
        }
    })();  
    
    /* 
    Initialize jQuery UI widgets   
    =====================================================================*/  
    
    //accordion component
    $('.accordion').accordion({
        heightStyle: "content",
        active: false,
        collapsible: false,
        activate: function (event, ui) { 
            $('html,body').animate({
                scrollTop: $(this).offset().top - 200
            }, 1000);
        }
    });
    
    //allows extra markup on accordion which we need on the professional development page
    $('.pro-dev-accordion').accordion({
        header: "> div > h3",
        heightStyle: "content",
        active: false,
        collapsible: false,
        activate: function (event, ui) { 
            $('html,body').animate({
                scrollTop: $(this).offset().top - 200
            }, 1000);
        }

    });
    

    
    /* 
    Tabs that change to accordions in mobile
    =====================================================================*/
    var tabstoAccordion= (function () {
        //declare variables
        var $tabWrapper = $("[id*='tab-wrapper']"),
            $tabContent = $('.tab_content'),
            $tabs = $('.tabs a'),
            $tabTrigger = $('.tab-trigger'),
            $tabDrawer = $('.tab_drawer_heading'),
            $tabContentChild = $('.tab_content_inner'),
            $tabDrawerChild = $('.tab_drawer_heading_inner');
        
        
        $tabContent.hide();
    
        $tabWrapper.find('.tab_content:first').show();

        $tabWrapper.filter('.accordion-collapsed').each(function(i) {
            $(this).find('.tab_content:first').hide();
        });
               
        //bind events
        $tabs.on('click', tabToggle);
        $tabDrawer.on('click', accordionToggle);
        $tabDrawerChild.on('click', accordionToggleMultilevel);
        
        //Accordion within accordion accordio. Accordion Inception. 
        function accordionToggleMultilevel(){
            
            var d_activeChildTab = $(this).attr('rel'); 
            
            $tabDrawerChild.removeClass('active');
                                       
            //update URL hash with active accordion toggle
            //window.location.hash = '#' + d_activeChildTab;
            
            //default closed state
            $tabContentChild.slideUp('fast').attr('aria-hidden', true);
            $tabContentChild.removeClass('active').find('button').attr('aria-expanded', false);
            
            //toggle accordions open and closed
            if($('#'+d_activeChildTab).is(":visible")) {
                $('#'+d_activeChildTab).slideUp('fast').attr('aria-hidden', true);
                $(this).removeClass('active').find('button').attr('aria-expanded', false);
            } else {
                $('#'+d_activeChildTab).slideDown('fast').attr('aria-hidden', false);
                $(this).addClass('active').find('button').attr('aria-expanded', true);    
            }
      
            //smooth scroll to top of accordion after short delay
            setTimeout(function(){
                $('html, body').animate({
                        scrollTop: $(".tab_drawer_heading_inner[rel ='"+d_activeChildTab+"']").offset().top - 100
                }, 500);
            }, 200);
            
        }
        
        function tabToggle(e) {
            if(e){
                e.preventDefault();
            }    
            var activeTab = $(this).attr('href'); 
            
            $tabContent.hide();
            
            $(activeTab).fadeIn();		

            $tabs.removeClass('active');
            
            $('[href="'+activeTab+'"]').addClass('active');
            
            if (!$(this).hasClass("tab-trigger")) {
                $('html, body').animate({
                    scrollTop:  $(activeTab).offset().top - 80
                }, 500);
            }
            
            $tabContent.toggleClass('open').attr('aria-hidden', function (i, attr) {
                return attr == 'true' ? 'false' : 'true';
            });
            $(this).find('button').attr('aria-expanded', function (i, attr) {
                return attr == 'true' ? 'false' : 'true';
            });
            
        }
        
        function accordionToggle() {
            
            var d_activeTab = $(this).attr('rel'); 
            
            //update URL hash with active accordion toggle
            window.location.hash = '#' + d_activeTab;
            
            //default closed state
            $tabContent.slideUp('fast').attr('aria-hidden', true);
            $tabDrawer.removeClass('active').find('button').attr('aria-expanded', false);
            
            //toggle accordions open and closed
            if($('#'+d_activeTab).is(":visible")) {
                $('#'+d_activeTab).slideUp('fast').attr('aria-hidden', true);
                $(this).removeClass('active').find('button').attr('aria-expanded', false);
            } else {
                $('#'+d_activeTab).slideDown('fast').attr('aria-hidden', false);
                $(this).addClass('active').find('button').attr('aria-expanded', true);    
            }
      
            //smooth scroll to top of accordion after short delay
            setTimeout(function(){
                $('html, body').animate({
                        scrollTop: $(".tab_drawer_heading[rel ='"+d_activeTab+"']").offset().top - 100
                }, 500);
            }, 200);
        }
        
    }());
     
    /* 
    Open accordion or jump to page section if URL hash is present
    =====================================================================*/
    var urlOpen = (function () {
        
        var url = document.location.toString();
    
        //check for anchor link in URL
        if (url.match('#')) {
            
            var anchorText = url.split('#')[1],
                jumpNavPresent = false;
            
            //check if icon jump navigation links are present. These are always at the top of content pages and accompanied by an icon.
            //If the URL hash matches one of the jump links, set variable to TRUE
            $('#section-jump-nav ul li, #section-jump li').find('a').each(function(index) {
                var hasAnchor = $(this).attr('href');
                if (location.hash === hasAnchor){
                    jumpNavPresent = true;
                } 
            });
            
            if($('#'+anchorText).length){
                //this is a jump navigation URL hash
                if(jumpNavPresent){
                    $('html, body').animate({
                        scrollTop: $('#' + anchorText).offset().top - $combinedHeight
                    }, 500);  
                //this is a accordion URL hash
                } else if ($('.tab_drawer_heading').length) {
                    if(!$('#program-landing').length){
                        $(".tab_drawer_heading[rel^='"+anchorText+"']").addClass('active').find('button').attr('aria-expanded', true);  
                        $('#' + anchorText).slideDown().attr('aria-hidden', false);  
                        $('html, body').animate({
                            scrollTop: $(".tab_drawer_heading[rel='"+anchorText+"']").offset().top - 200
                        }, 500); 
                    }
                }    
            }
        }
    })();
    
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
    Full Progams Details Panel. Seen on program landing pages
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

            });
            $(this).attr("aria-expanded", function (i, attr) {
                return attr == 'true' ? 'false' : 'true';
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
    
    /* 
    Show modal window in about AU Accreditation Page
    =====================================================================*/
    var accreditationModal = (function () {
        var $countries = $('#canada, #united-states'),
            $modalWindow = $('.modal'),
            $modalClose = $('.close'),
            $modalWindowHeight = $('.modal-content').outerHeight() / 2;
        
        $countries.on("click", openModal);
        $modalClose.on("click", closeModal);
        
        function openModal(){
            $selected = $(this).prop('id');
            //hide other modal windows first
            $modalWindow.removeClass('modal-showing');
            //open the modal window you want
            $('.'+ $selected).addClass('modal-showing').css('margin-top', - $modalWindowHeight);
        }
        function closeModal(){
            $modalWindow.removeClass('modal-showing');
        }

    }());
    
    /* 
    Form validation
    =====================================================================*/
    /* Discover AU Lead Generation form validation. Adds users to MailChimp list */
    $("#lead-gen").validate({
        errorElement: "span",
        errorPlacement: function(error, element) {
            error.insertBefore( element.parent('.input-group, .checkbox, .radio-group') );
        },
        errorLabelContainer: "#form-error",
        rules: {
            "fname": {
                required: true,
            },  
            "lname": {
                required: true,
            },  
            "email": {
                required: true,
                email: true,
            },  
            "interested": {
                required: true,
            },
            "casl": {
                required: true,
            }
        },
        messages: {
            "fname": {
                required: "Please enter your first name.",
            },  
            "lname": {
                required: "Please enter your last name.",
            },
            "email": {
                required: "Please enter your email address.",
            },
            "interested": {
                required: "Please select what you're interest in.",
            },
            "casl": {
                required: "Please confirm that you would like to receive email from Athabasca University",
            },
        },
        submitHandler: function (form) {
            var form = $("#lead-gen"); // contact form
            var submitButton = $("#submit"); // submit button
            var message = $('#thank-you'); // alert div for show alert message
            $.ajax({
                url: 'https://news.athabascau.ca/mailchimp/discover-au.php',
                crossDomain: true,
                type: 'GET',
                dataType: 'html',
                data: $("#lead-gen").serialize(),
                success: function (response) {
                    $("#lead-gen").fadeOut("fast", function () {
                        $("#thank-you").fadeIn("fast");
                    });
                },
                error: function (e) {
                    console.log(e);
                }
            });
            return false;
        }
    });
    
    /* Program Lead Generation form validation. Adds users to MailChimp list */
    $("#lead-gen-program").validate({
        errorElement: "span",
        errorPlacement: function(error, element) {
            error.insertBefore( element.parent('.input-group, .checkbox, .radio-group') );
        },
        errorLabelContainer: "#form-error",
        rules: {
            "fname": {
                required: true,
            },  
            "lname": {
                required: true,
            },  
            "email": {
                required: true,
                email: true,
            },  
            "interested": {
                required: true,
            },
            "casl": {
                required: true,
            }
        },
        messages: {
            "fname": {
                required: "Please enter your first name.",
            },  
            "lname": {
                required: "Please enter your last name.",
            },
            "email": {
                required: "Please enter your email address.",
            },
            "interested": {
                required: "Please select what you're interest in.",
            },
            "casl": {
                required: "Please confirm that you would like to receive email from Athabasca University",
            },
        },
        submitHandler: function (form) {
            var form = $("#lead-gen-program"); // contact form
            var submitButton = $("#submit"); // submit button
            var message = $('#thank-you'); // alert div for show alert message
            $.ajax({
                url: 'https://news.athabascau.ca/mailchimp/program-landing.php',
                crossDomain: true,
                type: 'GET',
                dataType: 'html',
                data: $("#lead-gen-program").serialize(),
                success: function (response) {
                    $("#lead-gen-program").fadeOut("fast", function () {
                        $("#thank-you").fadeIn("fast");
                    });
                },
                error: function (e) {
                    console.log(e);
                }
            });
            return false;
        }
    });
    
    /* Professional development lead capture form */
    $("#lead-gen-professional-development").validate({
        errorElement: "span",
        errorPlacement: function(error, element) {
            error.insertBefore( element.parent('.input-group, .checkbox, .radio-group') );
        },
        errorLabelContainer: "#form-error",
        rules: {
            "fname": {
                required: true,
            },  
            "lname": {
                required: true,
            },  
            "email": {
                required: true,
                email: true,
            },  
            "casl": {
                required: true,
            }
        },
        messages: {
            "fname": {
                required: "Please enter your first name.",
            },  
            "lname": {
                required: "Please enter your last name.",
            },
            "email": {
                required: "Please enter your email address.",
            },
            "casl": {
                required: "Please confirm that you would like to receive email from Athabasca University",
            },
        },
        submitHandler: function (form) {
            var $form = $("#lead-gen-professional-development"); // contact form
            var submitButton = $("#submit"); // submit button
            var message = $('#thank-you'); // alert div for show alert message
            $.ajax({
                url: 'https://news.athabascau.ca/mailchimp/professional-development.php',
                crossDomain: true,
                type: 'GET',
                dataType: 'html',
                data: $("#lead-gen-professional-development").serialize(),
                success: function (response) {
                    $('form').fadeOut("fast", function () {
                        $("#thank-you").fadeIn("fast");
                    });
                },
                error: function (e) {
                    console.log(e);
                }
            });
            return false;
        }
    });
    /* Request info form validation. */
    $("#request-info-form").validate({
        rules: {
            email: {
                required: true,
                email: true
            }
        },
        submitHandler: function (form) {
            var form = $("#request-info-form"); // contact form
            var submitButton = $("#submit"); // submit button
            var message = $('#thank-you'); // alert div for show alert message
            $.ajax({
                url: '/globalIncludes/contact/request-info-sendmail.php',
                // form action url
                type: 'POST',
                // form submit method get/post
                dataType: 'html',
                // request type html/json/xml
                data: $("#request-info-form").serialize(),
                // serialize form data
                success: function (response) {
                    $("#request-info-form").fadeOut("fast", function () {
                        $("#thank-you").fadeIn("fast", function () {});
                    });
                },
                error: function (e) {
                    console.log(e);
                },
            });
            return false;
        }
    });

    /* Website feedback form validation. */
    $("#website-feedback").validate({
        ignore: ".ignore",
        errorElement: "span",
        errorPlacement: function(error, element) {
            error.insertBefore( element.parent('.input-group, .checkbox, .radio-group') );
        },
        errorLabelContainer: "#form-error",
        submitHandler: function submitForm() {
            $.ajax({
                type: 'POST',
                url: '/globalIncludes/contact/feedback-sendmail.php',
                data: $('#website-feedback').serialize(),
                success: function (response) {
                    $("#website-feedback").fadeOut("slow", function () {
                        $("#thank-you").fadeIn("slow");
                    });
                },
                error: function (exception) {
                    console.log(exception);
                }
            });
            return false;
        },
        rules: {
            something: {
                required: true,
                email: true
            }
        }
    });

    /* Default form validation. */
    $("form.validate").validate({
        ignore: ".ignore",
        rules: {
            email: {
                required: true,
                email: true
            }
        }
    });
    
    /* 
    Better browser support for SVG sprite system
    scotchPanel menu was causing issues with svg icons in IE
    =====================================================================*/
    svg4everybody();
    
    /* 
    Protect email addresses from spammers
    =====================================================================*/
    mailtoellements = jQuery("a[href^='mailto:']");
    mailtoellements.each(function(item){
        mailto = jQuery(this).attr('href');
        $(this).attr('href',mailto.replace(/_\[\at\]\_/gi,"@"));
    });
    
});


//Submit Email to FOB in Case of BComm or MBA programs
function emailFOB()
{
    $.ajax({
        url: 'http://cdn.athabascau.ca/submit-email/fob-program-summary.php',
        crossDomain: true,
        type: 'GET',
        dataType: 'html',
        data: $("#lead-gen-program").serialize(),
        success: function (response) {
            $("#lead-gen-program").fadeOut("slow", function () {
                $("#thank-you").fadeIn("fast");
            });
        },
        error: function (e) {
            console.log(e);
        }
    });
    return false;
}