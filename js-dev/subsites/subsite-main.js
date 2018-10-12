//Self-Executing Anonymous Functions to keep our global variables from interfering with any other JS
$(function () {
    
    //Global Variables
    var $mainHeader = $('#main-header'),
        $utility = $('#utility'),
        $mainNavContainer = $('#main-navigation-container'),
        $mainNavigationInner = $('#main-navigation-inner'),
        $utilityHeight = $utility.outerHeight(),
        $scrollTop = $(window).scrollTop(),
        $headerHeight = $mainHeader.outerHeight(),
        $navAnchor = $('#nav-anchor'),
        breakpoint = 703,  
        $combinedHeight = $utilityHeight + $headerHeight,
        resizeTimer;        
    
    //make sure #sidebar-nav is in the correct location
    moveElements();
 
    /* 
    Formating for presidents past Neils notes
    =====================================================================*/
    if ($('.display_archive').length > 0) { 
        $('.campaign').each(function(){
            var $neilsNotes = $(this).html();
            $neilsNotes = $neilsNotes.replace(/-/,"");
            $(this).html($neilsNotes);
        }); 
    }
    
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
    Hero scroll button
    =====================================================================*/   
    var heroScroll = (function () {

    //variables
    var $scrollBtn = $('.scroll-btn');

    //bind events
    $scrollBtn.on('click', scrollToContent);

    //slide #main-navigation-container into visible canvas
    function scrollToContent() {
        $('html,body').animate({
            scrollTop: $(this).offset().top - $headerHeight + 20
        }, 500);  
    }

    }());   
    
    /*
    Wrap tables in .table-wrap div if it does not have one
    =====================================================================*/   
    $('table').each(function () {
        if (!$(this).closest('div').hasClass('table-wrap')) {
            $(this).wrap("<div class='table-wrap'></div>")
        }
    });
    
    /*
    Changes font weight of <h2> if an area of study is present
    =====================================================================*/
    function checkAreasofStudy() {
        if( $('#header-site-id h2 strong').length) {
             $('#header-site-id').addClass('change-font-weight')
        }
    }
    checkAreasofStudy()
    
    /*
    Homepage Slide In Nav
    =====================================================================*/
     var sidebarNavSlideIn = (function () {

        //variables
        var $navOpenBtn = $('#open-main-nav'),
            $contentContainer = $('.content-container'),
            $hamburger = $('.hamburger'),
            $breadcrumb = $('.breadcrumb');
         
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
            if ( !jQuery(target).is('#main-navigation-container *, #open-main-nav, #open-main-nav *') ) {
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
    $( '.accordion' ).accordion({
        heightStyle: "content",
        active: false,
        collapsible: true,
        activate: function( event, ui ) {
            //make sure fixed right navigation is positioned correctly
            sidebarNav.fixedMainNav();   
            
            //offset accordions
            $('html,body').animate({
                scrollTop: $(this).offset().top - 200
            }, 1000);
        }
    });
    
    $( '.accordion-open' ).accordion({
        heightStyle: "content",
        active: false,
        collapsible: false,
        activate: function( event, ui ) {
            //make sure fixed right navigation is positioned correctly
            sidebarNav.fixedMainNav();    
        }
    });
    
    /* Owl Carousel
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
            $breadCrumb = $('#breadcrumb'),
  		    mobile = checkWindowWidthSm();
        //we are in mobile
        if ( mobile ) {
            $navigation.detach();
            $siteID.detach();
     
            $navigation.appendTo('#au-site-nav-panel');
            $siteID.prependTo('.content-container').delay(100).fadeIn();

        //now we are in desktop
        } else {
            $navigation.detach();

            $navigation.appendTo('#main-navigation-container');
            $siteID.insertAfter('#au-logo');

        }
	}
     
    /*
    Slide open "on this page" div
    =====================================================================*/
    var anchorScroll = (function () {
        //variables
        var $anchorDropdownTrigger = $('#anchor-dropdown-trigger'),
            $anchorDropdown = $('#anchor-dropdown'),
            $anchorDropdownLinks = $('#anchor-dropdown a');
        
        //bind events
        $anchorDropdownTrigger.on('click', openPageJumpLinks);
        $anchorDropdownLinks.on('click', offsetStickyNav);
        
        //scroll to anchor and add offset for sticky header
        function openPageJumpLinks() {
            $anchorDropdownTrigger.toggleClass('open');  
            
            if(($anchorDropdown).is(":visible")) {
                $anchorDropdownTrigger.removeClass('open').attr('aria-expanded', false);
                $anchorDropdown.slideUp('fast').attr('aria-hidden', true);
            } else {
                $anchorDropdownTrigger.addClass('open').attr('aria-expanded', true);
                $anchorDropdown.slideDown('fast').attr('aria-hidden', false);
            }
        }
        
        //smooth scroll to section and offset sticky navigation
        function offsetStickyNav() {
            $('html,body').animate({
                scrollTop: $(this.hash).offset().top - $headerHeight
            }, 500);   
        }
    }());
    
    /*
    Multilevel accordion main navigation
    =====================================================================*/
    var sidebarNav = (function () {
        //declare variables
        var $auMenu = $('.au-accordion-menu'),
            $auMenuCheckboxes = $('.has-children input[type="checkbox"]');

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
                        $this.siblings('ul').slideDown(300).attr('aria-expanded', true);
                        $this.closest('li').addClass('open').attr('aria-hidden', false);  
                    //if it is unchecked we will close sibling <ul> and remove open class on closest <li>
                    } else {
                        $this.siblings('ul').attr('aria-expanded', false).slideUp(300, function() {
                            $this.closest('li').removeClass('open').attr('aria-hidden', true);
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
                    $this.parent('li').last('li').addClass('open').attr('aria-hidden', false);
                    $this.prop('checked', true);
                    $this.next('label').siblings('ul').slideDown(300).attr('aria-expanded', true);         
                } else {
                    $this.prop('checked', false);
                    $this.next('label').siblings('ul').slideUp(300);  
                }
            });
        }
        
        //fix #main-navigation-container to the far left. 
        //Do a little magic to stop it at the footer
        function fixedMainNav(){
            //delcare variables
            var $headerHeight = $('#main-header').outerHeight(),
                $window_top = $(window).scrollTop() + $headerHeight,
                $footer_top = $("#main-footer").offset().top,
                $div_top = $navAnchor.offset().top,
                $div_height = $mainNavContainer.height();

            //sticky sidebar is at the bottom of viewport
            if ($window_top + $div_height > $footer_top){
                $mainNavContainer.removeClass('sticky');
                $mainNavContainer.removeClass('at-top');
                $mainNavContainer.css({
                    'position': 'absolute',
                    'bottom': 0,
                    'top': 'auto'
                });
            //sticky sidebar is in middle of viewport
            } else if ($window_top > $div_top) {
                $mainNavContainer.addClass('sticky');
                $mainNavContainer.removeClass('at-top');
                $mainNavContainer.css({
                    'position': 'fixed',
                    'bottom': 'auto',
                    'top': 0
                });
            //sticky sidebar is at the top
            } else {
                $mainNavContainer.removeClass('sticky');
                $mainNavContainer.addClass('at-top');
                $mainNavContainer.css({
                    'position': 'fixed',
                    'bottom': '0',
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
        
        //declare variables
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
    
    /* 
    Search toggle
    =====================================================================*/
    var relatedSearchToggle = (function () {
        
        //declare variables
        var $relMore = $('.related-more'),
            $relLess = $('.related-less'),
            $relContent = $('blockquote'); 
        
        //bind events
        $relMore.on('click', openRelatedSearch);
        $relLess.on('click', closeRelatedSearch);
        
        function openRelatedSearch(e){
            $(this).parent('.result').addClass('related-shown');
            e.preventDefault();
        }
        function closeRelatedSearch(){
            $('.result').removeClass('related-shown');
            e.preventDefault();
        }
         
    }());
    
}());