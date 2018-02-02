$(function () {

    //global variables
    var breakpoint = 1119,
        $mainHeader = $('#main-header'),
        $headerShiv = $('.header-shiv'),
        $utility = $('#utility'),
        $primaryNav = $('#au-primary-nav'),
        $secondaryNav = $('.cd-secondary-nav'),
        $subNav = $('#sub-nav-primary'),
        $subNavShiv = $('.sticky-shiv'),
        $navPanel = $('.nav-panel'),
        $utilityHeight = $utility.outerHeight(),
        $headerHeight = $mainHeader.outerHeight(),
        $combinedHeight = $utilityHeight + $headerHeight,        
        resizeTimer;

    //check if element is in viewport
    $.fn.isInViewport = function() {
        var elementTop = $(this).offset().top;
        var elementBottom = elementTop + $(this).outerHeight();

        var viewportTop = $(window).scrollTop() + $headerHeight;
        var viewportBottom = viewportTop + $(window).height();

        return elementBottom > viewportTop && elementTop < viewportBottom;
    };
    
    
    $('#site-search input').focusin(function() {
        $('#scope').show("slide", { direction: "right" }, 400).delay( 300 );  
    });
			
    
    //check if window resizing is done
    $(window).on('resize', function(e) {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function() {
            $utilityHeight = $utility.outerHeight(),
            $headerHeight = $mainHeader.outerHeight(),
            $combinedHeight = $utilityHeight + $headerHeight,
                
            //move #au-site-nav if necessary
            moveNavigation()

            //stick navigation if necessary
            stickyMainNav.stickNav();
            
        }, 250);
    });
    
    //check window width (scrollbar included)   
    function checkWindowWidth() {
		var e = window, 
            a = 'inner';
        if (!('innerWidth' in window )) {
            a = 'client';
            e = document.documentElement || document.body;
        }
        if ( e[ a+'Width' ] >= breakpoint ) {
			return true;
		} else {
			return false;
		}
	}
    
    //move #au-site-nav depending on breakpoint variable
    function moveNavigation(){
		var $navigation = $('#au-site-nav'),
            $utility = $('.util-item'),
  		    desktop = checkWindowWidth();
        
        if(!$('body').hasClass('subsite')){
            //we are on the AU main site
            if ( desktop ) {
                $utility.detach();
                $navigation.detach();
                $navigation.insertAfter('#au-logo').removeClass('nav-panel');
                $utility.appendTo('#util-nav nav ul').removeClass('minor');
            } else {
                $utility.detach();
                $navigation.detach();
                $navigation.appendTo('#au-site-nav-panel');
                $utility.appendTo($primaryNav).addClass('minor');
            }
        }
	}
    //make sure #au-site-nav is in the correct location
    moveNavigation();
    
 
    //check each nav item href attribute. If it matches current URL the user is on, add a current class and move navigation to correct level.
    //this is probably better to do on the server side, but for now this will do
    function setNavCurrentState(){
        var url = window.location.protocol + "//" + window.location.host + window.location.pathname,
        desktop = checkWindowWidth();

        console.log(url);

        //add current state to nav if url matches
        $('#au-primary-nav a').each(function() {
            var href = $(this).attr('href'); 
            var $this = $(this);
            if (href == url) {

                $primaryNav.add('li').removeClass('current');

                //add a class of ".current" to the top most level navigation links. This is used for desktop styling
                $this.addClass('current').parents('li').last('li').children('a').addClass('current');

                //add a class of ".current" to the navigation link with its href attribute matching the browser url
                $this.parent('li').children('a').addClass('current').attr('aria-expanded', 'false'); 

                //remove ".is-hidden" from the parent ul of the link that matches the browser url
                $this.parents('li').closest('ul').removeClass('is-hidden').attr('aria-hidden', 'false').prev('a').attr('aria-expanded', 'true')
                //move out all parent uls to the left
                .parents('ul').addClass('moves-out').attr('aria-hidden', 'false').removeClass('is-hidden');

            }
            if ( desktop ) {

                //on desktop we need to make sure that .cd-secondary-nav is hidden and aria attributes are set correctly
                $this.attr('aria-expanded', 'false');    
                $secondaryNav.addClass('is-hidden').attr('aria-hidden', 'true');   

            } else {

                $primaryNav.attr('aria-hidden', 'false');    

            }
        });    
    }
    
    //set class on nav itema to current based on page url
    setNavCurrentState();   
    
    /* 
    Scroll sub navigation horizontaly. 
    Scroll position is determined by which nav item is clicked.
    Sub navigation can be found on landing pages and program pages.
    =====================================================================*/
    var hScrollNav = (function () {
        
        var $subNavItems = $('#section-jump li');
        
        $subNavItems.on('click', hScrollToCurrent);

        function hScrollToCurrent(event) {
            // gets current left position of item that is clicked
            var scrollTo = $(this).position().left - 40;  
            
            // scroll #sub-nav-primary wrapper to selected li item
            $subNav.animate({
                scrollLeft:  '+='+scrollTo
            }, 300);
        }
        
    }());
    
    /* 
    Landing page sub navigation. This uses a plugin called jQuery-One-Page-Nav
    Source code for this plugin is located in the global-plugins.js file
    =====================================================================*/
    if($subNav.length) {
        $('#section-jump').onePageNav({
            currentClass: 'current',
            changeHash: true,
            scrollSpeed: 750,
            scrollThreshold: 0.25,
            filter: '',
            easing: 'swing',
            scrollChange: function($currentListItem) {
                /* Scroll sub navigation horizontaly.  Scroll position is determined by which nav item is active. */
                var scrollTo = $currentListItem.position().left - 40; 
                $subNav.animate({
                    scrollLeft:  '+='+scrollTo
                }, 300);
            }
        });
        
        function jumpNavHeight(){
            //set the subnav height in mobile devices when it is NOT sticky
            $subNavH = $subNav.outerHeight();
            $totalSubItems = $("#sub-nav-primary li").length;
            $newSubNavHeight = $subNavH * $totalSubItems + 40;

            $subNav.css('height', $newSubNavHeight);
            $subNavShiv.css('height', $newSubNavHeight);
        }
        jumpNavHeight();
    }

    /* 
    Landing page sticky sub navigation
    =====================================================================*/
    var landingSticky = (function () {
        if($('#sub-nav').length) {
            var $subNav = $('#sub-nav'),
                $subNavH = $subNav.outerHeight(),
                $stickyNavTopUp = $subNav.offset().top,
                $stickyNavTopBottom = ($stickyNavTopUp + $subNavH) - $combinedHeight,
                iScrollPos = 0,
                scrollValue = 0,
                scrollTimeout = false;
        
            function makeSticky(){
                $subNav.addClass('sticky');
                setTimeout(function () { 
                    $subNav.addClass('slideDown');
                    $subNav.find('.applyBtnSlide').addClass('animated');
                }, 300);
            }

            function unSticky(){
                $subNav.removeClass('sticky'); 
                $subNav.removeClass('slideDown');
                $subNav.find('.applyBtnSlide').removeClass('animated');             
                 
            }

            // sticky sub navigation
            function stickySubNav(scrollTop) {
                if (scrollTop > $stickyNavTopBottom) { 
                    makeSticky();
                } else {
                    unSticky();
                }
            }

            return {
                stickySubNav: stickySubNav
            };
        }
    })();
    
    /*
    Sticky Header for #main-header
    =====================================================================*/
    var stickyMainNav = (function () {

        var $stickyMainNavTop = $mainHeader.offset().top;
            
        $(window).on('scroll', stickNav);
        
        //offsets the utility and main header bars. We override this value in css for larger devices
        $navPanel.css('padding-top', $combinedHeight);

        function stickNav(){
            var $scrollTop = $(window).scrollTop();
            
            //nav is sticky
            if ($scrollTop > $stickyMainNavTop) { 
                $mainHeader.addClass('sticky');
                $('body').addClass('header-stuck');
                $headerShiv.addClass('header-sticky');
                $navPanel.css('padding-top', $headerHeight);
                var $headerHeight = $mainHeader.outerHeight();
                $navPanel.css('padding-top', $headerHeight);
                
                //stick landing page sub navigation 
                if($('#sub-nav').length) {
                    landingSticky.stickySubNav($scrollTop);
                }
                
            //nav is not sticky
            } else {
                $('body').removeClass('header-stuck');
                $mainHeader.removeClass('sticky');
                $headerShiv.removeClass('header-sticky');
                $navPanel.css('padding-top', $combinedHeight);
                $headerHeight = $mainHeader.outerHeight();
                
            }
        };
        
        return{
            stickNav: stickNav
        }
        
    }());

    stickyMainNav.stickNav();    
    /*
    Multilevel Responsive Navigation. Used ONLY on main AU site
    =====================================================================*/
    var multiLevelNav = (function () {
        
        var $auSiteNav = $('#au-site-nav'),
            $hasChildren = $('.has-children').children('a'),
            $goBack = $('.go-back'),
            $subNavToggle = $('#au-site-nav > ul > li > a'),
            desktop = checkWindowWidth();
        
        $hasChildren.on('click', openNextLevel);
        $goBack.on('click', goBack);
        $(document).on('click', closeAll);
        $auSiteNav.on('keypress', openNextLevelSpacebar);
        
        //prevent default clicking on direct children of .au-primary-nav 
        $auSiteNav.children('.has-children').children('a').on('click', function(event){
            event.preventDefault();
        });

        //slide to next level 
        function openNextLevel(event) {
            event.preventDefault();
            var $this = $(this);
            $('#au-site-nav li').removeClass('active');
            
            if( $this.next('ul').hasClass('is-hidden') ) {
                $this.addClass('selected').attr('aria-expanded', 'true').next('ul').removeClass('is-hidden').attr('aria-hidden', 'false').end().parent('.has-children').parent('ul').addClass('moves-out');
                $this.parent('.has-children').siblings('.has-children').children('ul').addClass('is-hidden').attr('aria-hidden', 'true').end().children('a').removeClass('selected');
            } else {
                $this.removeClass('selected').attr('aria-expanded', 'false').next('ul').addClass('is-hidden').attr('aria-hidden', 'true').end().parent('.has-children').parent('ul').removeClass('moves-out');
            }
        }
        
        //open submenu if user presses the spacebar
        function openNextLevelSpacebar(event){
            if (event.which === 32) {
                event.preventDefault();
                $(document.activeElement).click();
            }
        }
        
        //if clicked outside of nav element, close all
        function closeAll(event) {
            var target = event.target; //target div recorded
            if (!jQuery(target).is('#au-primary-nav a, #mobile-menu-trigger *') ) {
                if(desktop){
                    $('.cd-secondary-nav').addClass('is-hidden');
                    $('#au-site-nav a').removeClass('selected');
                }
            }
        }
        
        //go back to previous parent menu ul
        function goBack(event) {
            $(this).parent('ul').prev('a').removeClass('selected').attr('aria-expanded','false')
            $(this).parent('ul').addClass('is-hidden').attr('aria-hidden', 'true').parent('.has-children').parent('ul').removeClass('moves-out');  
        }
        
    }());
        
    
    /* 
    Navigation panels for Support centre, search and mobile menu
    =====================================================================*/
    var navPanels = (function () {
        
        var $navPanelToggle = $('.nav-panel-toggle'),
            $navPanel = $('.nav-panel'),
            $body = $('body');
        
        $navPanelToggle.on('click', openNavPanel);
        $(document).on('click', closeNavPanels);
        $('#au-right-nav').on('keypress', openNavPanelSpacebar);
        
        
        //open nav panels if user presses the spacebar
        function openNavPanelSpacebar(event){
            if (event.which === 32) {
                event.preventDefault();
                $(document.activeElement).click();
            }
        }
        
        function openNavPanel(e) {
            var $this = $(this),
                $activePanel = $(this).attr('href'); 
                
            //position .nav-panels based on if #main-header is sticky
            stickyMainNav.stickNav();
            
            e.preventDefault();
            
            $navPanelToggle.not($this).removeClass('active').attr("aria-expanded", 'false');
            
            $navPanel.removeClass('is-visible').attr("aria-hidden", 'true');
            
            $this.toggleClass('active');
            
            //automatically focus to search input on click of #search-trigger a
            if($activePanel === '#site-search'){
                $('#au-search').find('input[type=text]').val('');
            }
            
            if ($navPanelToggle.hasClass('active')){
                $this.attr("aria-expanded", 'true');
                $($activePanel).addClass('is-visible').attr("aria-hidden", 'false');
                $body.addClass('nav-panel-visible');
            } else {
                $($activePanel).removeClass('is-visible').attr("aria-hidden", 'true');
                $this.attr("aria-expanded", 'false');
                $body.removeClass('nav-panel-visible');
            } 
        }
        
        //close nav panels if clicked anywhere outside of them
        function closeNavPanels(event){
            if(event){
                var target = event.target; 
                if (!jQuery(target).is('#au-right-nav *') ) {
                    $navPanelToggle.removeClass('active').attr("aria-expanded", 'false');
                    $navPanel.removeClass('is-visible').attr("aria-hidden", 'true');
                    $body.removeClass('nav-panel-visible');    
                }
            }
        }

    }());
    

    /* 
    Help and Support centre tabs inside header
    =====================================================================*/
    var headerHelpCentre = (function () {
        
        var $helpTabsWrapper = $('#help-centre'),
            $helpTabContent = $('.help-tab-content'),
            $helpTabs = $('.help-tabs a');
            
        $helpTabs.on('click', helpTabToggle);
        $helpTabsWrapper.on('keypress', openTabKeyBoard);
        
        //open tabs with Spacebar or Enter key
        function openTabKeyBoard(event){
            if (event.which === 32 || event.which === 13) {
                
                //prevent default browser behaviour which in this case is to scroll down the page
                event.preventDefault();
                
                //get currently focused element
                var activeTab = $(document.activeElement).attr('href');
                
                //perform click event on focused element
                $(document.activeElement).click();
                
                //find first link and add focus to to
                $(activeTab).find('a').first().focus();
               
            }
        }
        
        function helpTabToggle(e) {
            
            //prevent default browser behaviour
            e.preventDefault();

            //get href of tabbed that was click and open matching panel
            var activeTab = $(this).attr('href'); 
            
            $helpTabContent.hide().attr("aria-hidden", 'true'),
            $helpTabs.removeClass('active').attr("aria-selected", 'false');
            
            $('[href="'+activeTab+'"]').addClass('active').attr("aria-selected", 'true');
            $(activeTab).show().attr("aria-hidden", 'false');
            
        }

    }());

    
}());
