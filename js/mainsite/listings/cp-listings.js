/*!
 * Athabasca University Course/Program filtered listings and favorites
 * Web Services - Advancement
 */


//var pattern = /index\_(courses|programs)\.php/;
var pattern = /(course|program|mainsite)\-listings\.php/;
var patternCourse = /course\//;
var patternProgram = /programs\//;
var patternArea = /(\.area)/;
var patternCredential = /(\.cred)/;
var patternSubject = /(\.subject[0-9]{1,})/;
var patternLetter = /[a-z]{1}\-[a-z]{1}/i;
var patternLength = /\.length[0-9]{1}/i;

    
if (pattern.test(window.location)) {

    $(document).ready(function () {
        //Grabbing browser url to split it in an array
        var $fullPath = location.href.substr(location.href.indexOf("?")).replace(/(\#|\?)/, "").split("/"),
            $currentUrl = window.location.hash = "",
            $host = window.location.host,
            $pathName = window.location.pathname,
            $firstTime = true,
            $area = "*",
            $cred = "*",
            $credLabel = "",
            $subject = "*",
            $subjectLabel = "",
            $activeLetter = "*",
            $activeLetterLabel = "",
            $length = "*",
            $lengthLabel = "";
        
          
        if ($fullPath[1]) 
        {
            if ($fullPath[1] !== "undefined") {
                var $level = $fullPath[1];
            } 
            else 
            {
                var $level =  "undergraduate";
            }
        } 
        else 
        {
            var $level =  "undergraduate";
        }
        
        
        //Checking if Area is part of the url for cases of Bookmarked pages
        if($fullPath[2])
        {
            if (/[a-z]{3,}/.test($fullPath[2])) 
            {
                if ($fullPath[2] != "all")
                {
                    var $areaLabel = $fullPath[2];
                    $credLabel = $fullPath[2];
                }
                else
                {
                    var $areaLabel = "all";
                    $credLabel = "all";
                }
            } 
            else
            {
                var $areaLabel = "all";
                $credLabel = "all";
            }
        }
        else
        {
            var $areaLabel = "all";
            $credLabel = "all";
        }
        
        
        //Checking if Subject is part of the url for cases of Bookmarked pages
        if($fullPath[3])
        {
            if(/[a-z]{3,}/.test($fullPath[3])) 
            {
                var $subjectLabel = $fullPath[3];
                var $lengthLabel = $fullPath[3];
            } 
            else
            {
                var $subjectLabel = "all";
                var $lengthLabel = "all";
            }
        }
        else
        {
            var $subjectLabel = "all";
            var $lengthLabel = "all";
        }
        
        
        
        //Checking if Subject is part of the url for cases of Bookmarked pages
        if($fullPath[4])
        {
            if (/[a-z]{2}/.test($fullPath[4])) 
            {
                var $activeLetterLabel = $fullPath[4];
            } 
            else
            {
                var $activeLetterLabel = "";
            }
        }
        else
        {
            if ($fullPath[3] && $level == "graduate" && patternCourse.test($pathName))
            {
                if (/[a-z]{2}/.test($fullPath[3]))
                {
                    var $activeLetterLabel = $fullPath[3];
                }
                else
                {
                    var $activeLetterLabel = "";
                }
            }
            else
            {
                var $activeLetterLabel = "";
            }
        }
        
        
        //Identify if this is a program or course page.
        if (patternCourse.test($pathName))
        {
            var $path = "course";
            var $fileName = "course-listings.php";
        }
        else if(patternProgram.test($pathName))
        {
            var $path = "programs";
            var $fileName = "program-listings.php";
        }
        else
        {
            var $path = "";
            
            if (/index_courses\.php/.test($pathName))
            {
                var $fileName = "course-listings.php";
            }
            else
            {
                var $fileName = "program-listings.php";
            }
        }
        
        //Setting Up page default Path
        if ($host == "www-yp.athabascau.ca")
        {
            var $relativePath = "/onlinecourses/";
        }
        else if ($host == "alfresco-development.athabascau.ca")
        {
            var $relativePath = "/alfresco/athabasca-university-web-optimization-alfresco-development/"+$path+"/"+$fileName;
        }
        else 
        {
            var $relativePath = "/"+$path+"/"+$fileName;
        }
        
        var filters = {},
            $cpResults = $('#cp-results'),
            $cpCourses = $('.cp-courses'),  
            $cpPrograms = $('.cp-programs'),
            $cpFilters = $('#cp-filters');
        // init Isotope
        var $grid = $cpResults.isotope({
            itemSelector: '.card',
            layoutMode: 'fitRows',
            transitionDuration: 0,
        });


        if ($cpResults.length > 0) { 
            /* 
            Course Filtering
            =====================================================================*/
            var cpFilters = (function () {

                //Cache Dom
                var $heading = $('h1').find('span'),
                    $filterGroup = $('.button-group'),
                    $levelButton = $('.button-group button'),
                    $levelGroup = $('#button-group-sub, #button-group-area, #button-group-cred'),
                    $levelGroupArea = $('#button-group-area'),
                    $levelGroupCred = $('#button-group-cred'),
                    $levelGroupSub = $('#button-group-sub'),
                    $levelBtnGroup = $('#button-group-level'),
                    $startBtnGroup = $('#button-group-start'),
                    $startBtnGroupAll = $startBtnGroup.find('button').first(),
                    $descUnderGrad = $('#desc-undergraduate'),
                    $descGrad = $('#desc-graduate'),
                    $btnUnderGrad = $('#undergrad-btn'),
                    $btnGrad = $('#grad-btn'),
                    $btnRefine = $(".btn-refine"),
                    $btnSearch = $(".btn-search"),
                    $btnShow = $('.btn-show'),
                    $btnPanelClose = $('.mobile-panel-close'),
                    $filters = $(".filter-wrap"),
                    $mask = $(".mask"),
                    $scrolldiv = $(".scrollable"),
                    $filterLoader = $(".filter-loader"),
                    $filterColLength = $('.filter-col-length'),
                    $filterGroupCred = $('#button-group-level'),
                    $filterToggle = $('#filter-toggle'),
                    $filterSidebar = $('#filter-sidebar'),
                    $filterInner = $('.filter-inner'),
                    $filterSidebarAnchor = $('#filter-anchor'),
                    $listingContainer = $('.cp-listing-container'),  
                    $cpTypeNav = $('#cp-type'), 
                    $quickSearchLevel = 'undergrad',
                    $successMessage = $('.success-message'),
                    $failMessage = $('.fail-message'),
                    $searchLink = $('.cp-search-link'),
                    buttonFilter,
                    //Isotope Variables
                    qsRegex,
                    buttonFilter,
                    $cpReset = $('.program-reset'),
                    $filterPanel = $('#filter-sidebar'),
                    $searchPanel = $('#controls'),
                    $quicksearch = $('#quicksearch'),
                    initShow = 30, 
                    counter = initShow,
                    iso = $grid.data('isotope');
                    
                //Bind Events
                $filters.on('click', 'button', comboFilters);
                $levelBtnGroup.on('click', 'button', urlUpdate);
                $levelGroupArea.on('click', 'button', areaSubjectToggle);
                $levelGroupCred.on('click', 'button', credLevelReset); 
                $quicksearch.keyup(debounce(quickSearch));
                $cpReset.on('click', resetFilters);
                $filterToggle.on('click', filterPanelToggleDesktop); 
                $btnRefine.on('click', filterPanelToggleMobile);
                $btnSearch.on('click', searchPanelToggleMobile);
                $btnShow.on('click', hideMobilePanels);
                $searchLink.on('click', linkSearch);
                $btnPanelClose.on('click', hideMobilePanels);
                $(window).on('scroll', stickySidebar);
                
                //sticky filter panel toggle. on larger screens the user can hide the filters
                function filterPanelToggleDesktop(){
                    $this = $(this);
                    $this.toggleClass('filters-open');
                    $cpTypeNav.toggleClass('filters-open');
                    $listingContainer.toggleClass('filters-open');
                    $filterInner.toggleClass('filters-open');
                    $filterSidebar.toggleClass('filters-open');
                    
                    var $state = $(this).attr('aria-expanded') === 'false' ? true : false;

                    //update aria state
                    $(this).attr('aria-expanded', $state);
                    $filterInner.attr('aria-hidden', !$state); 
                    
                    stickySidebar();
                    
                    if(stickySidebar()){
                        $('html, body').animate({
                            scrollTop:  $cpResults.offset().top - 80
                        }, 500);   
                    }
                }
                
                //make filter sidebar sticky and stop at footer
                function stickySidebar(){
                    var $headerHeight = $('#main-header').outerHeight();
                    var window_top = $(window).scrollTop() + $headerHeight;
                    var footer_top = $("#main-footer").offset().top;
                    var div_top = $filterSidebarAnchor.offset().top;
                    var div_height = $filterSidebar.height();

                    //make scrollable divs go back to top
                    function backtoTop(){
                        $('.scrollable').scrollTop(0);                   
                    }
                    
                    console.log($headerHeight);
                    //sticky sidebar hit footer
                    if (window_top + div_height > footer_top){
                        if($filterSidebar.hasClass('filters-open')){
                            $filterSidebar.css({
                                position: 'absolute',
                                bottom: '0',
                                top: 'auto'
                            });
                            return true
                        }else{
                            $filterSidebar.css({
                                position: 'fixed',
                                bottom: '0',
                                top: $headerHeight
                            }); 
                            return false
                        }
                    //sticky sidebar is in middle of content
                    }else if (window_top > div_top) {
                        $filterSidebar.addClass('sticky');
                        $cpTypeNav.addClass('sticky');
                        $filterSidebar.css({
                            position: 'fixed',
                            bottom: 'auto',
                            top: $headerHeight
                        });
                    //sticky sidebar is at the top
                    } else {
                        $filterSidebar.removeClass('sticky');
                        $cpTypeNav.removeClass('sticky');
                        $filterSidebar.css({
                            position: 'absolute',
                            bottom: 'auto',
                            top: '0'
                        });
                        backtoTop();
                    }
                }               
   
                //toggle "is-checked" classes on clicked buttons
                function filterToggle() {
                    $filterGroup.each(function (i, buttonGroup) {
                        var $buttonGroup = $(buttonGroup);
                        $buttonGroup.on('click', 'button', function () {
                            var $this = $(this);
                            //reset search value
                            $quicksearch.val('');
                            //exclude loading animation on level toggle. This is handled in the urlUpdate()
                            if (!$(this).is("#undergrad-btn, #grad-btn, #button-group-start button")) {
                                //show filter loader
                                $filterLoader.fadeIn('100').delay(800).fadeOut();
                            }
                            //remove "is-checked" class from current filters
                            $buttonGroup.find('.is-checked').removeClass('is-checked');
                            //add "is-checked" class to the filter that was clicked
                            $this.addClass('is-checked');
                        });
                    });
                }
                
                //sets default filters on page load based on URL
                function defaultLevel() {
                    
                    //set default filter to be based on level. This would be either "Undergraduate" or "Graduate" 
                    if ($level == "undergraduate") {
                        filters = { level: ".undergrad" };

                        var filterValue = '';
                        for (var prop in filters) {
                            filterValue += filters[ prop ];
                        }

                        // set filter for Isotope
                        $grid.isotope({ filter: filterValue });
                    } else {
                        filters = { level: ".grad"};
                        var filterValue = '';
                        for (var prop in filters) {
                            filterValue += filters[ prop ];
                        }

                        // set filter for Isotope
                        $grid.isotope({ filter: filterValue });
                    }
                    
                    
                    var $add1 = "";
                    var $add2 = "";
                    var $add3 = "";
                    
                    
                    if ($fileName == "program-listings.php" || $path == "programs")
                    {
                        
                        
                        if ($credLabel != "")
                        {
                            $add1 = "/"+$credLabel;
                            $credLabel = $credLabel.replace("#","");
                            $(".cred-"+$credLabel).click();

                            if ($credLabel != "all")
                            {
                                
                                $(".credAll").removeClass('is-checked');
                                //add "is-checked" class to the filter that was clicked
                                $(".cred-"+$credLabel).addClass('is-checked');
                            }
                            else
                            {
                                if ($level == "graduate")
                                {
                                    $add1 = "/all";
                                }
                                $(".cred-"+$credLabel).click();

                                $(".credAll").addClass('is-checked');
                            }

                        }
                        else
                        {
                            $add1 = "/all";
                            $credLabel = "all";
                            if($level == "undergraduate")
                            {
                                $btnUnderGrad.click();
                            }
                            else
                            {
                                $btnGrad.click();
                            }
                                                      
                        }
                        
                        if ($level == "undergraduate")
                        {
                            if ($lengthLabel != "")
                            {
                                $add2 = "/"+$lengthLabel;
                                $lengthLabel = $lengthLabel.replace("#","");
                                $(".length-"+$lengthLabel).click();

                                
                                if ($lengthLabel != "all")
                                {
                                    $(".lengthAll").removeClass('is-checked');
                                    //add "is-checked" class to the filter that was clicked
                                    $(".length-"+$lengthLabel).addClass('is-checked');
                                }
                                else
                                {
                                    $(".lengthAll").addClass('is-checked');
                                }


                                
                            }
                            else
                            {
                                $add2 = "/all";
                                $lengthLabel = "all";

                            }
                        }
                        if ($activeLetterLabel != "")
                        {
                            $add3 = "/"+$activeLetterLabel;
                            
                            //This next condition is needed because the value gets reset when are.click() happens
                            if ($fullPath[4])
                            {
                                if (/[a-z]{2}/.test($fullPath[4])) 
                                {
                                    $activeLetterLabel = $fullPath[4];
                                }
                            }

                            
                            $activeLetterLabel = $activeLetterLabel.replace("#","");                        
                            $("."+$activeLetterLabel).click();

                            $(".letterAll").removeClass('is-checked');
                            //add "is-checked" class to the filter that was clicked
                            $("."+$activeLetterLabel).addClass('is-checked');

                        }
                        
                    }
                    else
                    {

                        if ($areaLabel != "")
                        {
                            $add1 = "/"+$areaLabel;
                        }

                        if ($subjectLabel != "")
                        {
                            $add2 = "/"+$subjectLabel;
                        }

                        if ($activeLetterLabel != "")
                        {
                            $add3 = "/"+$activeLetterLabel;
                        }

                        

                        if ($areaLabel != "")
                        {
                            $areaLabel = $areaLabel.replace("#","");
                            $(".area-"+$areaLabel).click();
                            
                            if ($areaLabel != "all")
                            {
                                $(".areaAll").removeClass('is-checked');
                                //add "is-checked" class to the filter that was clicked
                                $(".area-"+$areaLabel).addClass('is-checked');
                            }
                            else
                            {
                                $(".areaAll").addClass('is-checked');
                            }

                        }
                        else
                        {
                            $add1 = "/all";
                            $areaLabel = "all";
                            
                            if($level == "undergraduate")
                            {
                                $btnUnderGrad.click();
                            }
                            else
                            {
                                $btnGrad.click();
                            }
                        }


                        if ($subjectLabel != "")
                        {
                            $subjectLabel = $subjectLabel.replace("#","");
                            $(".subj-"+$subjectLabel).click();
                            
                            
                            if ($subjectLabel != "all")
                            {
                                $(".subjectAll").removeClass('is-checked');
                                //add "is-checked" class to the filter that was clicked
                                $(".subj-"+$subjectLabel).addClass('is-checked');
                            }
                            else
                            {
                                $(".subjectAll").addClass('is-checked');
                            }

                        }
                        else
                        {
                            $add2 = "/all";
                            $subjectLabel = "all";
                        }

                        if ($activeLetterLabel != "")
                        {
                            //This next condition is needed because the value gets reset when are.click() happens
                            if ($fullPath[4])
                            {
                                if (/[a-z]{2}/.test($fullPath[4])) 
                                {
                                    $activeLetterLabel = $fullPath[4];
                                }
                            }

                            
                            $activeLetterLabel = $activeLetterLabel.replace("#","");                        
                            $("."+$activeLetterLabel).click();

                            $(".letterAll").removeClass('is-checked');
                            //add "is-checked" class to the filter that was clicked
                            $("."+$activeLetterLabel).addClass('is-checked');

                        }
                    }
                    
                    $firstTime = false;
                    
                    var $newUrl = $currentUrl + $fileName + '?/'+$level+$add1+$add2+$add3;
                    
                    if (history.pushState) {
                        history.pushState({}, '', $newUrl);
                    }
                    
                }

                // Reset filter buttons to show "All" as being checked.
                function resetActiveFiltersToAll() {
                    $filterGroup.find('button').not( '#undergrad-btn, #grad-btn' ).removeClass('is-checked');
                    $filterGroup.find('button').removeClass('force-hidden');
                    $filterGroup.find('button:first-of-type').not( '#undergrad-btn, #grad-btn' ).addClass('is-checked');
                    $startBtnGroup.find('button').show();
                    
                } 

                // Check if there are any results from selected filters. if not, display message box
                function checkResults(callback) {
                    if ($firstTime === true){
                        $successMessage.hide();  
                    } else {
                        if (!$grid.data('isotope').filteredItems.length > 0) {
                            $failMessage.show();
                            $successMessage.hide();
                        } else {
                            $failMessage.hide();
                            $successMessage.show();
                        }
                    }
                    if (callback && typeof (callback) === "function") {
                        callback();
                    }
                }

                //Update url when the undergraduate or graduate filter is clicked
                function urlUpdate(e) {
                    
                    var $this = $(this);
                        
                    //hide any visible additional info text
                    $('#courses-additional-info').hide();
                    $('#courses-additional-info div').hide();
                    
                    //reset stored filters
                    filters = {};
                    
                    $level = $this.attr('data-link').replace("#","");
                    
                    //show subjects that belong to both 'graduate' and 'undergraduate'
                    $levelGroupSub.find('.button').filter('.undergraduateGraduate').show();  
                    
                    //Reset Subject and Area and Letter
                    $area = "*";
                    $areaLabel = "";
                    $cred = "*";
                    $credLabel = "";
                    $subject = "*";
                    $subjectLabel = "";
                    $length = "*";
                    $lengthLabel = "all";
                    $activeLetter = "*";
                    $activeLetterLabel = "all";
                    
                    e.preventDefault();
                    
                    var $url = $this.attr('data-link'),
                        $title = $this.attr('title'),
                        $newUrl = $currentUrl+"?/" + $url;    
                    
                    $mask.fadeIn('100', function () {
                        $filterLoader.fadeIn('100', function () {
                            if (history.pushState) {
                                $newUrl = $relativePath + $newUrl.replace("#","");
                                history.pushState({url: $newUrl, title: $title}, $title, $newUrl);
                            }
                            //check if there are any results from isotope
                            checkResults(function () {
                                //user switched levels. Reset filters to "All"
                                resetActiveFiltersToAll();
                                //toggle display on relevant filters
                                levelFilterToggle();
                                //toggle display on relevant headings and descriptions
                                levelHeadingToggle();
                                //fade out loader on filters
                                $filterLoader.fadeOut('500');
                                //fade out loader on listings
                                $mask.fadeOut('500');
                            });
                        });
                    });
                }

                //Only show subjects relevant to the area that was selected on courses page
                function areaSubjectToggle() { 
                    
                    var $this = $(this);
                    var $areaID = $this.attr('data-filter');
                    
                    //hide the additional info box above course cards. We only show them if an "area" is clicked
                    $('#courses-additional-info').hide();
                 
                    //show the starting with filters
                    $startBtnGroup.closest('.filter-col-toggle').show();

                    //reset classes on filters to "All"
                    resetActiveFiltersToAll();
                    
                    //reset stored filters
                    if ($level == "undergraduate")
                    {
                        filters = { level: ".undergrad", subject: "*" };
                    
                        //show additional undergraduate info above cards based on selected area
                        checkResults( function () {
                            if($areaID === '*'){
                                $('#courses-additional-info div').hide();
                                $('#courses-additional-info .undergrad.info-a').show();

                            }else{
                                $('#courses-additional-info').show();
                                $('#courses-additional-info div').hide();
                                $('#courses-additional-info .undergrad.info-all').show();
                                $('#courses-additional-info .undergrad'+$areaID).show();
                            }
                        });
                        
                    } else {
                        
                        //we need to force HRMT: Human Resource Management not to display in the graduate section.
                        //this is hacky
                        if($this.is('.area-arts')){
                            $('.subj-human-resource-management').addClass('force-hidden');
                        }
                        
                        filters = { level: ".grad", subject: "*" };
                        
                        checkResults( function () {
                            //show additional graduate info above cards based on selected area
                            if($areaID === '*'){
                                $('#courses-additional-info div').hide();
                                $('#courses-additional-info .grad.info-all').show();

                            }else{
                                $('#courses-additional-info').show(); 
                                $('#courses-additional-info div').hide();
                                $('#courses-additional-info .grad.info-all').show();
                                $('#courses-additional-info .grad'+$areaID).show();
                            }
                        });
                    }
                    
                    //only shows subjects that are relevant to the area that was selected
                    $levelGroupSub.find('.button').fadeOut('10000').filter($areaID).fadeIn('10000');
                }

                //Reset length filter when credential is selected on programs page
                function credLevelReset(){
                    
                    if ($level == "undergraduate")
                    {
                        filters = { level: ".undergrad", length: "*" };
                    } else {
                        filters = { level: ".grad"};
                    }    
                    
                    //reset classes on filters to "All"
                    resetActiveFiltersToAll();
                }
                
                //check the browser url and toggle filter options based on current course level selection
                function levelFilterToggle(callback) {
                    if ($level == "undergraduate")
                    {
                        //Add active class to undergradute filter button
                        $btnUnderGrad.addClass('is-checked');
                        //remove active class from graduate button
                        $btnGrad.removeClass('is-checked');
                        //show program length options if we are on the program page
                        if ($cpPrograms.length){
                            $filterColLength.show();        
                            $($filterColLength.selector + '+ hr').show();
                        }
                        //empty search value
                        $quicksearch.val('');
                        //remove class "grad" to hide areas and subjects that are NOT undergraduate items
                        $cpFilters.removeClass('grad');
                        //add class to indicate filters should show undergraduate items
                        $cpFilters.addClass('undergrad');
                    } else {
                        //Add active class to graduate filter button
                        $btnGrad.addClass('is-checked');
                         //remove active class from undergraduate button
                        $btnUnderGrad.removeClass('is-checked');
                        //hide program length options if we are on the program page
                        if ($cpPrograms.length){
                            $filterColLength.hide();              
                            $($filterColLength.selector + '+ hr').hide();
                        }
                        //empty search value
                        $quicksearch.val('');
                        //remove class "undergrad" to hide areas and subjects that are NOT GRADUATE items
                        $cpFilters.removeClass('undergrad');
                        //add class to indicate filters should show graduate items
                        $cpFilters.addClass('grad');
                    }
                    if (callback && typeof(callback) === "function") {
                        callback();
                    }
                }

                //depending on course level filter selection, change the h1 and description on the page
                function levelHeadingToggle() {
                    //user clicked undergraduate filter.
                    if ($level == "undergraduate"){
                        $descGrad.hide();
                        $descUnderGrad.fadeIn();
                        $heading.html('Undergrad<span>uate</span>');
                        $('#content-title').show();
                    //user clicked graduate filter.
                    } else {
                        $descUnderGrad.hide();
                        $descGrad.fadeIn();
                        $heading.text('Graduate').show();
                        $('#content-title').show();
                    }
                }

                // Resets all active filters
                function resetFilters() {
                    //spin refresh icon
                    $(this).find('i').toggleClass('spin');
                    
                    //reset stored filters
                    filters = {};
                    
                    //show loading animation first
                    $filterLoader.fadeIn('100', function () {
                        //if current level is undergraduate set filter to be undergrad
                        if ($level == "undergraduate"){
                            $levelGroupSub.find('.button').filter('.undergraduate').show();
                            $btnUnderGrad.click();
                        } else {
                            $levelGroupSub.find('.button').filter('.graduate').show();
                            $btnGrad.click();
                        }
                        //show subjects that belong to both 'graduate' and 'undergraduate'
                        $levelGroupSub.find('.button').filter('.undergraduateGraduate').show();                        
                        //reset classes on filters to "All"
                        resetActiveFiltersToAll();
                        //check if there are any results from isotope
                        checkResults();
                        //make scrollable div go back to top
                        $scrolldiv.scrollTop(0);
                        //reset search value
                        $quicksearch.val('');
                        //hide success message
                        $successMessage.hide();
                        //show reset animation
                    }).delay(800).fadeOut('slow');
                    
                    //show starting with button group
                    $startBtnGroup.closest('.filter-col-toggle').show();
                }
                
                //Function to build elements for the Browser Friendly url
                function buildPath(x, text, component)
                {
                    //Reset URL
                    
                    var $buildUrl = "/";
                    
                    if (patternArea.test(x))
                    {
                        $area = x;
                        $areaLabel = text.toLowerCase().replace(/ /gi, '-');
                        $areaLabel = $areaLabel.toLowerCase().replace(/\&/gi, 'and');
                        
                        if( component == "area")
                        {
                            //Reset Subject and Letter
                            if ($firstTime == false)
                            {
                                $subject = "*";
                                $subjectLabel = "all";
                                $activeLetter = "*";
                                $activeLetterLabel = "all";
                                $cred = "*";
                                $credLabel = "all";
                            }
                        }
                        else
                        {
                            //This will load the Program content
                            $cred = x;
                            $credLabel = text.toLowerCase().replace(/ /gi, '-');
                            //Reset Subject and Letter
                            if ($firstTime == false)
                            {
                                $subject = "*";
                                $subjectLabel = "";
                                $activeLetter = "*";
                                $activeLetterLabel = "all";
                                $area = "*";
                                $areaLabel = "";
                                $length = "*";
                                $lengthLabel = "all";
                            }
                        }
                        
                        
                    }
                    else if (patternCredential.test(x) || component == "cred")
                    {
                        $cred = x;
                        $credLabel = text.toLowerCase().replace(/ /gi, '-');
                        
                        //Reset Subject and Letter
                        if ($firstTime == false)
                        {
                            $subject = "*";
                            $subjectLabel = "";
                            $activeLetter = "*";
                            $activeLetterLabel = "all";
                            $area = "*";
                            $areaLabel = "";
                            $length = "*";
                            $lengthLabel = "all";
                        }
                        
                    }
                    else if (patternSubject.test(x))
                    {
                        $subject = x;
                        $subjectLabel = text.toLowerCase().replace(/ /gi, '-');
                        $subjectLabel = $subjectLabel.replace(/[a-z]{4}\:/gi, '');
                        
                        if ($subjectLabel.charAt( 0 ) == '-')
                        {
                            $subjectLabel = $subjectLabel.substr(1);
                        }
                        
                    }
                    else if (patternLetter.test(text))
                    {
                        $activeLetter = x;
                        $activeLetterLabel = text.toLowerCase().replace(/\-/gi, '');
                    }
                    else if (patternLength.test(x))
                    {
                        $length = x;
                        $lengthLabel = text.toLowerCase().replace(/(\-|\s)/gi, '-');
                        
                    }
                    
                    if ($areaLabel != "" && text != "All" && component == "area") {
                        
                        $buildUrl += $areaLabel + "/";
                        
                    }
                    else if (text == "All" && component == "area")
                    {
                        $areaLabel = "all";
                        $area = "*";
                        $subjectLabel = "all";
                        $subject = "*";
                        
                        $buildUrl += "all/";
                    }
                    else if ($credLabel != "" && component == "cred") 
                    {
                        
                        if (text == "All" && component == "cred")
                        {
                            $credLabel = "all";
                            $cred = "*";
                            $lengthLabel = "all";
                            $length = "*";
                            $buildUrl += "all/";
                        }
                        else
                        {
                            $buildUrl += $credLabel + "/";
                            $lengthLabel = "all";
                            $length = "*";
                        }
                        
                    }
                    else
                    {
                        if (component == "area" || component == "cred")
                        {    
                            $buildUrl += "all/";
                        }
                        else 
                        {
                            if ($fileName == "program-listings.php" || $path == "programs")
                            {
                                $buildUrl += $credLabel + "/";
                            }
                            else
                            {
                                $buildUrl += $areaLabel + "/";
                            }
                            
                        }
                        
                        
                    }
                    
                    if ( $fileName == "course-listings.php")
                    {
                        
                        if ($subjectLabel != "" && text != "All" && component == "subject") {
                            //
                            $buildUrl += $subjectLabel + "/";
                            $startBtnGroup.find('button').removeClass('is-checked');
                            $('.letterAll').addClass('is-checked').click();
                        }
                        else
                        {
                            if (component == "subject")
                            {
                                $buildUrl += "";
                                $subjectLabel = "all";
                                $startBtnGroup.find('button').removeClass('is-checked');
                                $('.letterAll').addClass('is-checked').click();
                            }
                            else
                            {
                                $buildUrl += $subjectLabel + "/";
                            }
                        }
                        
                    }
                    
                    //Length
                    if ($fileName == "program-listings.php" || $path == "programs")
                    {
                        
                        if ($credLabel == "")
                        {
                            $credLabel = "all";
                            $buildUrl += "all/";
                        }
                        
                    
                        if ($level == "undergraduate")
                        {
                            if ($lengthLabel != "" && text != "All" && component == "length") {
                                $buildUrl += $lengthLabel + "/";
                                $startBtnGroup.find('button').removeClass('is-checked');
                                $('.letterAll').addClass('is-checked').click();
                            }
                            else
                            {
                                if (text == "All" && component == "length")
                                {
                                    $buildUrl += "";
                                    $lengthLabel = "all";
                                    $startBtnGroup.find('button').removeClass('is-checked');
                                    $('.letterAll').addClass('is-checked').click();
                                }
                                else
                                {
                                    $buildUrl += $lengthLabel + "/";
                                }
                            }
                        }
                        
                    }
                    
                    
                    if ($activeLetterLabel != "" && text != "All" && component == "letter") {
                        
                        $buildUrl += $activeLetterLabel + "/";
                    }
                    else
                    {
                        $buildUrl += "";
                        $activeLetterLabel = "all";
                    }
                    
                    
                    if ($firstTime == false)
                        if (history.pushState) {
                            history.pushState(null,null, $relativePath+"?/"+$level+$buildUrl.replace(/\/\//,"/"));    
                        }
                    
                }

                // Gives isotope the ability to have combination filters
                function comboFilters(event) {
                    var $this = $(this);
                    var $target = $( event.target );
                    
                    if($cpCourses.length){
                        //force all accordions to close
                        $(".accordion-content").hide().attr('aria-hidden', true);
                        $(".accordion-trigger").hide();  
                        $(".accordion-trigger").find('button').removeClass('active').attr('aria-expanded', false);
                    }
                    
                    //unhighlight any previous search words
                    $('.card').unhighlight();
                    
                    if($firstTime == false)
                        buildPath($this.attr('data-filter'), $this.find('span').text(), $this.attr('data-component'));

                    //show listing loader first
                    $mask.fadeIn('100', function () {
                        // get group key
                        var $buttonGroup = $this.parents('.button-group');
                        var filterGroup = $buttonGroup.attr('data-filter-group');
                        
                        // set filter for group
                        filters[filterGroup] = $this.attr('data-filter');
                        
                        // combine filters
                        var filterValue = '';
                        for (var prop in filters) {
                            filterValue += filters[ prop ]; 
                        }
                        buttonFilter = filterValue;
                        
                        // set filter for Isotope
                        $grid.isotope({ filter: filterValue }); 
                        
                        //check if there are any results from isotope
                        checkResults( function () {
                            //make sure sticky filter bar is still stuck          
                            stickySidebar();     
                            //hide listing loader
                            $mask.fadeOut('slow'); 
                            //if a subject is clicked open the matching accordion
                            if($buttonGroup.is('#button-group-sub')){
                                $buttonRel = $this.attr("rel");
                                listingsAccordion.accordionFilterToggle($buttonRel);
                                //hide the "starting with" button group
                                $startBtnGroup.closest('.filter-col-toggle').hide();
                            }
                            //show "starting with" button group if user clicked on the "all" button
                            if($this.is('.subjectAll')){
                                $startBtnGroup.closest('.filter-col-toggle').show();
                            }
                            //if users is on a larger screen scroll to top of results
                            if (event.originalEvent !== undefined) {
                                if ($(window).width() >= 943) {  
                                    setTimeout(function(){
                                        $('html, body').animate({
                                            scrollTop:  $cpResults.offset().top - 80
                                        }, 500);   
                                    }, 300);
                                }    
                            }
                            
                            listingsAccordion.countCourses($target);   
                            
                        }); 
                    });
                }
                
                // Performs a search on a link with the class of .cp-search-link and a title attribute
                function linkSearch(e) {
                    e.preventDefault();
                    var $searchQuery = $searchLink.attr('title');    
                    $quicksearch.val($searchQuery);
                    $quicksearch.click();
                    $quicksearch.trigger('keyup');
                }

                // Quicksearch functionality for isotope
                function quickSearch() {
                    var $searchTerm = $quicksearch.val();
                    var pattern = /[a-z]{4}[0-9]{3}/i;
                    
                    //unhiglight previous search tems
                    $('.card').unhighlight();
                                   
                    if( pattern.test($searchTerm))
                    {
                        var subj = $searchTerm.substr(0,4);
                        var numb = $searchTerm.substr(4,3);
                        
                        $searchTerm = subj + " " + numb;
                    }
                    
                    qsRegex = new RegExp($searchTerm, 'gi');
                    var searchLevel = '';
                    
                    $grid.isotope({
                        filter: function () {
                            var searchResult = qsRegex ? $(this).text().match(qsRegex) : true;
                            var buttonResults = buttonFilter ? $(this).is( buttonFilter ) : true;
                            if($level == "undergraduate"){
                                searchLevel = '.undergrad' ? $(this).is( '.undergrad' ) : true;
                            }else{
                                searchLevel = '.grad' ? $(this).is( '.grad' ) : true;
                            }
                            return searchResult && searchLevel && buttonResults;
                        }
                    });
                    
                    //check if there is a value entered into the quicksearch input
                    if($searchTerm){
                        checkResults( function () {
                            //highlight text in cards that match search value
                            $('.card').highlight($searchTerm);
                            //update course count. if there are results show the accordion triggers and content
                            listingsAccordion.countCourses($quicksearch, function () {
                                $('.accordion-trigger.hasResults').each(function(){
                                    $(this).show().find('button').addClass('active').attr('aria-expanded', true);
                                    $(this).next('.accordion-content').show().attr('aria-hidden', false); 
                                }); 
                                $('.accordion-trigger.noResults').each(function(){
                                    $(this).find('button').removeClass('active').attr('aria-expanded', false);
                                    $(this).next('.accordion-content').hide().attr('aria-hidden', true); 
                                }); 
                            });
                        });  
                    }else{
                        //if there are no result hide all accordion content, update aria attributes, remove accordion-trigger 'active' classes
                        if ($cpCourses.length){
                            listingsAccordion.countCourses();
                            $('.accordion-content').hide().attr('aria-hidden', true);
                            $('.accordion-trigger').find('button').removeClass('active').attr('aria-expanded', false);   
                        }                 
                    }
                }

                // debounce so filtering doesn't happen every millisecond on keyup
                function debounce(fn, threshold) {
                    var timeout;
                    return function debounced() {
                        $mask.fadeIn('100');
                        if (timeout) {
                            clearTimeout(timeout);
                        }
                        function delayed() {
                            fn();
                            timeout = null;
                            $mask.delay('500').fadeOut('100');
                        }
                        setTimeout(delayed, threshold || 3000);
                    };
                }

                // open filter panel for mobile
                function filterPanelToggleMobile(event) {
                    //was there a click event?
                    if(event){
                        $(this).toggleClass('active');
                        $filterPanel.toggleClass('visible');
                    }
                    //update aria attribute on smaller devices
                    if ($(window).width() >= 943 && $firstTime === true) {
                        $filterInner.attr('aria-hidden', true); 
                    }
                    $(this).attr('aria-expanded', true);
                    $filterInner.attr('aria-hidden', false);  
                }
                
                // open search panel for mobile
                function searchPanelToggleMobile(event) {
                    //was there a click event?
                    if(event){
                        $(this).toggleClass('active');
                        $searchPanel.toggleClass('visible');
                    }
                    //update aria attribute on smaller devices
                    if ($(window).width() >= 943 && $firstTime === true) {
                        $searchPanel.attr('aria-hidden', true); 
                    }
                    $(this).attr('aria-expanded', true);
                    $searchPanel.attr('aria-hidden', false);  
                }
                
                //hide "refine by" and "search" mobile panels
                function hideMobilePanels() {
                    $this = $(this);
                    
                    //update button aria attribute
                    $this.attr('aria-expanded', false);
                    
                    //update content panel aria attribute
                    $filterInner.attr('aria-hidden', true);  
                    $searchPanel.attr('aria-hidden', true);  
                    
                    //hide panel
                    $('#controls, #filter-sidebar').removeClass('visible');
                    
                    //scroll to results
                    setTimeout(function(){
                        $(window).scrollTop(($cpResults).offset().top - 80); 
                    }, 300);
                }
                
                //hide mobile search panel when enter key is pressed
                function hideSearchOnEnter() {            
                    $quicksearch.keypress(function(event){
                        var keycode = (event.keyCode ? event.keyCode : event.which);
                        if(keycode == '13'){
                            hideMobilePanels();
                        }
                    });
                }
                
                //Do this on page load
                function init() {
                    stickySidebar();
                    levelFilterToggle();
                    defaultLevel();
                    levelHeadingToggle();
                    filterToggle();
                    filterPanelToggleMobile();
                    searchPanelToggleMobile();
                    hideSearchOnEnter();
                    $mask.fadeOut('slow');
                }

                return {
                    init: init,
                    checkResults: checkResults,
                    stickySidebar: stickySidebar,
                };

            }());

            cpFilters.init();

        }

        /* Toggle filter help panel
        =====================================================================*/
        $( ".filter-help-trigger" ).click(function() {
            $( ".filter-help" ).slideToggle( "slow");
        });
        
        /* 
        Course subject accordions
        =====================================================================*/
        var listingsAccordion= (function () {
            //cache dom
            var $accordionContent = $(".accordion-content"),
                $accordionTrigger = $(".accordion-trigger"),
                $accordionTriggerBoth = $(".accordion-trigger.undergraduateGraduate");

            //hide all accordion content divs
            $accordionContent.hide();

            //bind events
            $accordionTrigger.on("click",'button', accordionToggle);

            //open accordion content when .accordion-trigger is clicked 
            function accordionToggle() {
                //make sure sidebar is still stuck
                cpFilters.stickySidebar();
                
                //hide all accordion content divs
                $accordionContent.hide().attr('aria-hidden', true);

                //get rel attribute so we can use its value as an id to display the matching accordion content
                var activeAccordion = $(this).attr('rel'); 

                var $state = $(this).attr('aria-expanded') === 'false' ? true : false;

                //remove active class from previously opened accordion triggers
                $accordionTrigger.find('button').removeClass('active').attr('aria-expanded', false);   

                if($state){
                    $('#'+activeAccordion+'+ div').show();
                    $('[rel="'+activeAccordion+'"]').addClass('active');
                }else{
                    $accordionTrigger.find('button').removeClass('active');
                }

                //update aria state
                $(this).attr('aria-expanded', $state);
                $('#'+activeAccordion+'+ div').attr('aria-hidden', !$state);

                //smooth scroll to active accordion trigger
                if (!$(this).hasClass('accordion-trigger')) {
                    scrollToActive(activeAccordion);
                }
            }

            //toggle matching accordion when filter button is clicked. buttonRel parameter is passed from the comboFilters() function
            function accordionFilterToggle(buttonRel) {
                //store active accordion rel attribute
                var activeAccordion = buttonRel;

                //hide all accordion content divs
                $accordionContent.hide().attr('aria-hidden', true);

                //remove active class from previously opened accordion triggers
                $accordionTrigger.find('button').removeClass("active").attr('aria-expanded', false);

                //add active class to accordion trigger that matches the subject filter rel attribute
                $('[rel="'+activeAccordion+'"]').addClass('active');

                //update aria state
                $('.accordion-trigger button[rel="'+activeAccordion+'"]').attr('aria-expanded', true);
                $('#'+activeAccordion+'+ div').attr('aria-hidden', false);   

                $('#'+activeAccordion+'+ div').show();
            } 

            // count the courses that are visible
            function countCourses(event, callback){
                //remove noResults class from all accordions
                $accordionTrigger.removeClass('noResults');

                //loop through all .accordion-triggers
                $accordionTrigger.each(function() {
                    //cache reference to this
                    $this = $(this); 

                    //get default count number element
                    $countDefault = $this.find('.course-count strong');

                    //start counter
                    var i = 0;  

                    //find next .accordion-content dev and loop through each card
                    $this.next('div').find('.card').each(function() {
                        //if the card is visible we will add it to the counter
                        if ($(this).css('display') != 'none') {
                            i++;                         
                        }
                    });

                    //update count number
                    $countDefault.text(i); 
                    
                    //update count on subject filters to match the accordion count
                    $subjectRel = $(this).find('button').attr('rel');
                    $subjectFilterBtn = $('.filter-col-sub button[rel="'+ $subjectRel+'" ]');
                    
                    //update count on specific events
                    if(event){ 
                        //update count if area is selected
                        if(event.parent().is('#button-group-area')){
                            $subjectFilterBtn.find('strong.badge').text(i);   
                            
                        //update count if the "All" button is clicked in the subject group
                        //ignore the rest of the subject buttons as well as the search field   
                        } else if ( !(!$(event).hasClass('subjectAll') || event.is('#quicksearch')) ) {
                            $subjectFilterBtn.find('strong.badge').text(i);  
                            
                        }

                    } else {
                        //update count on load
                        $subjectFilterBtn.find('strong.badge').text(i); 
                    }
                    
                    //add class to the accordion trigger if there are results
                    if(i >= '1'){
                        $this.addClass('hasResults');
                        $this.removeClass('noResults');
                    } else {
                        $this.removeClass('hasResults');
                        $this.addClass('noResults');
                    }                            
                });


                if (callback && typeof(callback) === "function") {
                    callback();
                }
            }   

            //smooth scroll to active accordion
            function scrollToActive(activeAccordion){
                $('html, body').animate({
                    scrollTop:  $("#"+activeAccordion).offset().top - 80
                }, 500);              
            } 

            //Do this on page load
            function init() {
                countCourses();
            }

            return {
                init: init,
                countCourses: countCourses,
                accordionFilterToggle: accordionFilterToggle
            };

        }());    

        listingsAccordion.init();
    });
    
    /* 
    Switch layout mode from grid or list
    =====================================================================*/
    var viewSwitcher = (function () {
        var $viewBtns = $('.view-switcher'),
            $viewWrap = $('#cp-results');
        //bind events
        $viewBtns.on("click", changeView);

        //Change layout
        function changeView() {
            var $selectedView = $(this).attr('data-view');
            now = new Date();

            $viewBtns.removeClass('active');
            $(this).addClass('active');
            
            //delete previous cookies
            document.cookie = "view-grid=grid; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;"
            document.cookie = "view-list=list; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;"
            
            //add new cookie
            document.cookie = "view-" + $selectedView + "=" + $selectedView + "; expires=18 Dec " + (now.getFullYear() + 1) + " 12:00:00 UTC; path=/";

            $viewWrap.removeClass('list');
            $viewWrap.removeClass('grid');
            $viewWrap.addClass($selectedView);
        }
    }()); 
    
}

$(window).load(function() {
    $('#cp-initial-loading').hide();
});