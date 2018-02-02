//Self-Executing Anonymous Functions to keep our global variables from interfering with any other JS
$(function () {
    
    //Global Variables
    var $mainHeader = $('#main-header'),
        $utility = $('#utility'),
        $mainNavContainer = $('#main-navigation-container'),
        $mainNavigationInner = $('#main-navigation-inner'),
        $utilityHeight = $utility.outerHeight(),
        $headerHeight = $mainHeader.outerHeight(),
        $navAnchor = $('#nav-anchor'),
        breakpoint = 703,  
        $combinedHeight = $utilityHeight + $headerHeight,
        resizeTimer;        
    
    //make sure #sidebar-nav is in the correct location
    moveElements();
    
    /*
    Check if mobile device and aded a class to the body
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
    Form Validation   
    =====================================================================*/  
    $(".au-form").validate({
        ignore: ".ignore",
        errorElement: "span",
        errorPlacement: function(error, element) {
            error.insertBefore( element.parent('.input-group, .checkbox, .radio-group') );
        },
        rules: {
            email: {
                required: true,
                email: true
            }
        }
    });
    
    /*
    Wrap tables in .table-wrap div if it does not have one
    =====================================================================*/   
    $('table').each(function () {
        if (!$(this).closest('div').hasClass('table-wrap')) {
            $(this).wrap("<div class='table-wrap'></div>")
        }
    });
    
    /*
    Homepage Slide In Nav
    =====================================================================*/
     var sidebarNavSlideIn = (function () {

        //variables
        var $navOpenBtn = $('#open-main-nav'),
            $contentContainer = $('.content-container'),
            $hamburger = $('.hamburger'),
            $breadcrumb = $('#breadcrumb');
         
        //bind events
        $navOpenBtn.on('click', slideInNav);
        $(window).on('click', slideOutNav);
         
        //slide #main-navigation-container into visible canvas
        function slideInNav() {
            $mainNavContainer.toggleClass('visible');   
            $contentContainer.toggleClass('main-nav-showing');
            $breadcrumb.toggleClass('push-over');
        }

        //slide #main-navigation-container off canvas
        function slideOutNav(e){
            var target = e.target; 
            //allow close button to slide nav off canvas
            if ( !jQuery(target).is('#main-navigation-container *, #open-main-nav') ) {
                //remove visible class so it slides off canvas
                $mainNavContainer.removeClass('visible');
                $contentContainer.removeClass('main-nav-showing');
                $breadcrumb.removeClass('push-over');
            }
        }
         
    }());
       
    /* 
    Initialize jQuery UI widgets   
    =====================================================================*/  
    
    //accordion component
    $( "#accordion, .accordion" ).accordion({
        heightStyle: "content",
        active: false,
        collapsible: true,
    });
    
    //tooltips component
    $( document ).tooltip();
    
    /*
    Match height of elements
    =====================================================================*/
    $('.equal, .feature-content').matchHeight(false);
    
    /*
    Fancybox 3 Options
    =====================================================================*/    
    $("[data-fancybox]").fancybox({
        buttons: [
            'fullScreen',
            'thumbs',
            'zoom',
            'close'
        ],
    });
    
    /* Carousel
    =====================================================================*/
    var $carousel = $('.owl-carousel');
    
    //carousel options
    $carousel.owlCarousel({
        loop: false,
        nav: false,
        margin: 0,
        items: 1,
    })

    /* 
    Google inspired form input focus
    =====================================================================*/
    $('.au-form .input-group input, .au-form .input-group textarea').focusout(function(){
        if(!$(this).val()) {
            $(this).removeClass('has-value');
        } else {
            $(this).addClass('has-value');
        }
    });
    
    /* 
    Check if window resizing is done. We don't want to call function for every pixel moved, 
    ======================================================================================*/ 
    $(window).on('resize', function(e) {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function() {
        
            //move #sidebar-nav if necessary
            moveElements();
            
            //make sure side bar is stuck in the correct location
            sidebarNav.fixedMainNav();    
            
        }, 250);
    });
   
    /* 
    Check window width to see if we are on SM viewport (scrollbar included)   
    =====================================================================*/   
    function checkWindowWidthSm() {
		var e = window, 
            a = 'inner';
        if (!('innerWidth' in window )) {
            a = 'client';
            e = document.documentElement || document.body;
        }
        if ( e[ a+'Width' ] <= breakpoint ) {
			return true;
		} else {
			return false;
		}
	}    
    
    /* 
    Move elements depending on breakpoint variable
    =====================================================================*/   
    function moveElements(){
        
        //variables
		var $navigation = $('#main-navigation-inner'),
            $utility = $('.util-item'),
            $siteID = $('#header-site-id'),
  		    mobile = checkWindowWidthSm();
        
        //we are in mobile
        if ( mobile ) {
            $navigation.detach();
            $siteID.detach();
            $utility.detach();
            $navigation.appendTo('#au-site-nav-panel');
            $utility.appendTo($navigation).addClass('minor');
            $siteID.insertBefore('#breadcrumb');
        //now we are in desktop
        } else {
            $navigation.detach();
            $utility.detach();
            $navigation.prependTo('#main-navigation-container');
            $utility.appendTo('#util-nav nav ul');
            $siteID.insertAfter('#au-logo');
        }
	}

    /*
    Scroll to anchor
    =====================================================================*/
    var anchorScroll = (function () {
        
        //variables
        var $anchorLinks = $('#anchor-dropdown ul li a')
            
        //bind events
        $anchorLinks.on('click', anchorScroll);
        
        //scroll to anchor and add offset for sticky header
        function anchorScroll() {
            if (location.pathname.replace(/^\//,'') == this.pathname.replace(/^\//,'') && location.hostname == this.hostname) {
                var target = $(this.hash);
                target = target.length ? target : $('[name=' + this.hash.slice(1) +']');
                if (target.length) {
                    $('html, body').scrollTop(target.offset().top - 120);
                    return false;
                }
            }
        }
        
    }());
    
    /*
    Multilevel accordion subnavigation
    =====================================================================*/
    var sidebarNav = (function () {

        //variables
        var $auMenu = $('.au-accordion-menu'),
            $auMenuCheckboxes = $('.has-children input[type="checkbox');

        //bind events
        $(window).on('scroll', fixedMainNav);
        
        //open the sibling ul. We use a checkbox "hack" to accomplish this
        function openSubNav() {
            $auMenu.each(function(){
                
                var $accordion = $(this);

                //detect change in the input[type="checkbox"] value
                $accordion.on('change', 'input[type="checkbox"]', function(){
                    var $this = $(this);
                    //if it is checked, open sibling <ul> and add class to closest <li>
                    if ($this.prop('checked')){
                        $this.siblings('ul').slideDown(300);
                        $this.closest('li').addClass('open');  
                    //if it is unchecked we will close sibling <ul> and remove open class on closest <li>
                    } else {
                        $this.siblings('ul').slideUp(300, function() {
                            $this.closest('li').removeClass('open');
                        });
                    }
                });
                
            }); 
        }

        //if the li has the class of .selected open up it's sibling ul on page load
        function openactiveNavItems() {
            $auMenuCheckboxes.each(function(index, item){
                var $this = $(this);
                if($this.parent('li').hasClass('selected')) {
                    $this.parent('li').last('li').addClass('open');
                    $this.prop('checked', true);
                    $this.next('label').siblings('ul').slideDown(300);         
                } else {
                    $this.prop('checked', false);
                    $this.next('label').siblings('ul').slideUp(300);  
                }
            });
        }
        
        //fix #main-navigation-container to the far left. 
        //Do a little magic to stop it at the footer
        function fixedMainNav(){
            
            //variables
            var $headerHeight = $('#main-header').outerHeight(),
                $window_top = $(window).scrollTop() + $headerHeight,
                $footer_top = $("#main-footer").offset().top,
                $div_top = $navAnchor.offset().top,
                $div_height = $mainNavContainer.height();


            //sticky sidebar is at the top of viewport
            if ($window_top + $div_height > $footer_top){
                $mainNavContainer.css({
                    'position': 'absolute',
                    'bottom': 0,
                    'top': 'auto',
                    'padding-top': 0
                });
            //sticky sidebar is in middle of viewport
            } else if ($window_top > $div_top) {
                $mainNavContainer.css({
                    'position': 'fixed',
                    'bottom': 'auto',
                    'top' : 0,
                    'padding-top': 90
                });
            //sticky sidebar is at the bottom
            } else {
                $mainNavContainer.css({
                    'position': 'absolute',
                    'bottom': 'auto',
                    'padding-top': 0,
                    'top': 0
                });
            }
        }     
        
        openSubNav();
        openactiveNavItems();
        fixedMainNav()
        
        return {
            fixedMainNav: fixedMainNav,
        };
 
    }());
    
    /* 
    Open Able Player in a pop up window
    =====================================================================*/
    var ablePlayerLightBox= (function () {
        
        //variables
        var $ableVidTrigger = $('.able-vid-trigger'),
            $ableVidLightbox = $('.able-vid-lightbox'),
            $ableVidClose = $('#able-vid-close'),
            $ableVidPlayer = $('#able-vid-player');
        
        //bind events
        $ableVidTrigger.on('click', openAbleVideo);
        $ableVidClose.on('click', closeAbleVideo);
        $ableVidLightbox.on('click', closeAbleVideo);
        
        //open player in a makeshift lightbox
        function openAbleVideo(e) {
            //prevent default link behavior
            e.preventDefault();

            //variables
            var $videoSource = $(this).attr('href');
            
            //show video
            $ableVidLightbox.addClass('shown');
            $ableVidPlayer.html('<source src="'+ $videoSource +'" type="video/mp4"></source>' );
            $ableVidPlayer.load();
        }
        
        function closeAbleVideo(e){
            //variables
            var target = e.target; //target div recorded

            //close the makeshift lightbox by clicking outside of video player
            if (!jQuery(target).is('.able-wrapper *') ) {
                $ableVidPlayer.get(0).pause();
                $ableVidLightbox.removeClass('shown');
                $ableVidPlayer.html(' ');      
            }
        }
    }());
    
}());

