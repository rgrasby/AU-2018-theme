jQuery(document).ready(function($){


    var $mainHeader = $('#main-header'),
        $utility = $('#utility'),
        $utilityHeight = $utility.outerHeight(),
        $headerHeight = $mainHeader.outerHeight(),
        $combinedHeight = $utilityHeight + $headerHeight;
                
    /*
    Styleable scrollbars
    =====================================================================*/
    $('.scrollable').scrollbar({
        "ignoreOverlay" : true,
    });
    
   /*
    Fancybox 3 Options
    =====================================================================*/    
    $("[data-fancybox]").fancybox({
        buttons: [
            'slideShow',
            'fullScreen',
            'thumbs',
            'zoom',
            'close'
        ],
    });
    
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

    /* Carousel
    =====================================================================*/
    var $carousel = $('.owl-carousel');
    
    $carousel.owlCarousel({
        loop: false,
        nav: true,
        margin: 20,
        navText: ['<i class="fa fa-angle-left" aria-hidden="true"></i>','<i class="fa fa-angle-right" aria-hidden="true"></i>'],
        responsive :{
            0:{
                items: 1,
                stagePadding: 0,
            },
            478:{
                items: 2,
            },
            1250:{
                items: 3,
            },
        }
    })
    
    /*
    Match height of elements
    =====================================================================*/
    $('.equal, #section-jump-nav li').matchHeight();
    $('.equal2').matchHeight('false');
    
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
        var $animatedElements = $('.shield-seperator, #reveal-trigger-2');
        if (typeof(WURFL) != 'undefined'){
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
    Smooth scroll to anchor
    =====================================================================*/
    var smoothScroll = (function () {
        
        var $smoothLinks = $('.smooth-link, #section-jump-nav li a')
            
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
    Hidden apply and register panel on homepage
    =====================================================================*/
    var homeApplyCTA = (function () {
        var $applyTrigger = $('#cta-secondary-apply-trigger');
        var $applyPanel = $('#cta-secondary-apply');

        $applyTrigger.on('click', togglePanel);

        function togglePanel(){
            $(this).find('button').toggleClass('active');
            $applyPanel.toggleClass('open').attr('aria-hidden', function (i, attr) {
                return attr == 'true' ? 'false' : 'true'
            });
            $(this).find('button').attr("aria-expanded", function (i, attr) {
                return attr == 'true' ? 'false' : 'true'
            });
        }
    }());
    
    /* 
    Tabs that change to accordions in mobile
    =====================================================================*/
    var tabstoAccordion = (function () {
        
        var $tabWrapper = $("[id*='tab-wrapper']"),
            $tabContent = $('.tab_content'),
            $tabs = $('.tabs a'),
            $tabTrigger = $('.tab-trigger'),
            $tabDrawer = $('.tab_drawer_heading')
        
        $tabContent.hide();
    
        $tabWrapper.find('.tab_content:first').show();

        $tabWrapper.filter('.accordion-collapsed').each(function(i) {
            $(this).find('.tab_content:first').hide();
        });
                                                          
        $tabs.on('click', tabToggle);
        $tabDrawer.on('click', accordionToggle);

        function tabToggle(e) {
            if(e){
                e.preventDefault();
            }
            $tabContent.hide();
            var activeTab = $(this).attr('href'); 
            
            $(activeTab).fadeIn();		

            $tabs.removeClass('active');
            
            $('[href="'+activeTab+'"]').addClass('active');
            
            if (!$(this).hasClass("tab-trigger")) {
                $('html, body').animate({
                    scrollTop:  $(activeTab).offset().top - ($combinedHeight + 30)
                }, 500);
            }
            
            $tabContent.toggleClass('open').attr('aria-hidden', function (i, attr) {
                return attr == 'true' ? 'false' : 'true'
            });
            $(this).find('button').attr('aria-expanded', function (i, attr) {
                return attr == 'true' ? 'false' : 'true'
            });
            
        }
        
        function accordionToggle() {
            
            var d_activeTab = $(this).attr('rel'); 
            
            //update URL hash with active accordion toggle
            window.location.hash = '#' + d_activeTab;
            
            //default closed state
            $tabContent.slideUp('fast').find('button').attr('aria-hidden', true);
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
                        scrollTop: $(".tab_drawer_heading[rel ='"+d_activeTab+"']").offset().top - $combinedHeight
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
            $('#section-jump-nav ul li').find('a').each(function(index) {
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
                        $(".tab_drawer_heading[rel^='"+anchorText+"']").addClass('active');  
                        $('#' + anchorText).slideDown();
                        $('html, body').animate({
                            scrollTop: $(".tab_drawer_heading[rel='"+anchorText+"']").offset().top - 200
                        }, 500); 
                    }
                }
            }
        }
    })();
    
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
        errorElement: "span",
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
                url: 'http://news.athabascau.ca/mailchimp/discover-au.php',
                crossDomain: true,
                type: 'GET',
                dataType: 'html',
                data: $("#lead-gen").serialize(),
                success: function (response) {
                        $("#lead-gen").fadeOut("fast", function () {
                        $("#thank-you").fadeIn("fast", function () {});
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
        errorElement: "span",
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
                url: 'http://news.athabascau.ca/mailchimp/program-landing.php',
                crossDomain: true,
                type: 'GET',
                dataType: 'html',
                data: $("#lead-gen-program").serialize(),
                success: function (response) {
                    emailFOB(); // This Function is at the bottom of this file
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
        submitHandler: function submitForm() {
            $.ajax({
                type: 'POST',
                url: '/globalIncludes/contact/feedback-sendmail.php',
                data: $('#website-feedback').serialize(),
                success: function (response) {
                    $("#website-feedback").fadeOut("slow", function () {
                        $("#thank-you").fadeIn("slow", function () {});
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
    Shadowbox initialization
    =====================================================================*/
    //Shadowbox.init();
    
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
                $("#lead-gen-program").fadeOut("fast", function () {
                $("#thank-you").fadeIn("fast", function () {});
            });
        },
        error: function (e) {
            console.log(e);
        }
    });
    return false;
}