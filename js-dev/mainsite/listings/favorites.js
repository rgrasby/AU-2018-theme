$(document).ready(function () {
    /* Course and Programs favorites list
    =====================================================================*/
    var cpFavorites = (function () {

        //cache dom
        var $favWrapper = $('.cp-fav-container'),
            $favPanel = $('.cp-fav'),
            $favBody = $favWrapper.find('.body'),
            $favList = $('#cp-fav-list ul'),
            $favTrigger = $favWrapper.children('.cp-fav-trigger'),
            $favCount = $favTrigger.find('.count'),
            $addToFavBtn = $('.add-to-favorites'),
            $favNotice = $('.cp-fav-notice'),
            $favTabs = $('.cp-fav-tabs'),
            $favList = $('#cp-fav-list ul'),
            $favTabsBtns = $('.cp-fav-tabs').find('button'),
            $noFavs = $('.no-favs'),
            $cpResults = $('#cp-results'),
            $cpCourses = $('.cp-courses'),  
            $cpPrograms = $('.cp-programs'),
            $programLanding = $('#program-landing');
            $protocol = location.protocol;
                
        //Bind Events
        $favWrapper.on('click', closeFav);
        $favTrigger.on('click', toggleFav);
        $favList.on('click', '.remove-fav', removeFav);
        $addToFavBtn.on('click', addToFavList);
        $favTabs.on('click', 'button', toggleFavTabs);

        //Toggle visibility of favorites list
        function toggleFav(event) {
            $favWrapper.toggleClass('favs-open');
            $favTabsBtns.removeClass('active');
            var $favID = $(this).attr('data-fav-id'),
                $favType = $(this).attr('data-fav-type'),
                $state = $(this).attr('aria-expanded') === 'false' ? true : false;
            //update aria state
            $(this).attr('aria-expanded', $state);
            $favPanel.attr('aria-hidden', !$state);  
            //show tab based on if user is viewing courses or programs. 
            //For example, if user is on the program listings we show the program tab.
            if ($cpPrograms.add($programLanding).length){
                $favTabsBtns.last().addClass('active');
                $favList.find('li').hide();
                $favList.find('li').filter('.au-program').show(); 
                noFavCheck('.au-program');
            } else {
                $favTabsBtns.first().addClass('active');
                $favList.find('li').hide();
                $favList.find('li').filter('.au-course').show();   
                noFavCheck('.au-course');
            } 
        }

        //Close favorite list if user click outside of .cp-fav div
        function closeFav(e) {
            if ($(e.target).is($(this))) {
                $(this).removeClass('favs-open');
                $favTrigger.attr('aria-expanded', false);
                $favWrapper.attr('aria-hidden', true); 
                $favPanel.attr('aria-hidden', true);  
            }
        }

        //Add to favorites
        function addToFavList() {
            var $favID = $(this).attr('data-fav-id'),
                $favType = $(this).attr('data-fav-type'),
                $favName = $(this).closest('.card').find('h3').text();
                now = new Date();
            if(!$favName){
                $favName = $(this).closest('#program-landing-hero').find('li').text();
                $favName += ' ' + $(this).closest('#program-landing-hero').find('h1').text();
            }
            
            if ( $( this ).hasClass( "favorited" ) ) {
                $(this).removeClass('favorited');
                document.cookie = $favType + "-" + $favID + "=" + $favID + '=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
                favsNotice($favName, false);
            } else {
                $(this).addClass('favorited');
                document.cookie = $favType + "-" + $favID + "=" + $favID + "; expires=18 Dec " + (now.getFullYear() + 1) + " 12:00:00 UTC; path=/";
                favsNotice($favName, true);
            }
            //send ajax request to php file for cookie creation
            updateCurrentFavs($favID);
        }

        function favsNotice(name, status){
            $favNotice.addClass('notice-showing');
            $favNotice.removeAttr('role','alert'),
            setTimeout(function () { 
                $favNotice.removeClass('notice-showing');
            }, 4000);
            if(status === true){
                $favNotice.attr('role','alert'),
                $favNotice.find('p').html('<strong>'+ name + '</strong> was added to your favorites');
                $favNotice.find('i').hide();
                $favNotice.find('i:first-of-type').show();
            } else if (status === false) {
                $favNotice.attr('role','alert'),
                $favNotice.find('p').html('<strong>'+ name + '</strong> was removed from your favorites');  
                $favNotice.find('i').hide();
                $favNotice.find('i:last-of-type').show();
            }
        }
        //add favorite to cookies then update list and counter
        function updateCurrentFavs(cookieID) {
            //Ajax code to send results to php file for cookie creation.
            $.ajax({
                method: "POST",
                url: $protocol+"//www.athabascau.ca/archive/course_program/cookie.php",
                //url: "http://alfresco-development.athabascau.ca/alfresco/athabasca-university-web-optimization-alfresco-development/archive/course_program/cookie.php",
                data: { course: cookieID }
            }).done(function (msg) {
                $favList.html(msg);
                //Count number of items favorited
                getFavCount();
            });
        }

        //Get current favorites users has stored in their cookies
        function getCurrentFavs() {
            $.ajax({
                method: "GET",
                url: $protocol+"//www.athabascau.ca/archive/course_program/cookie.php",
                //url: "http://alfresco-development.athabascau.ca/alfresco/athabasca-university-web-optimization-alfresco-development/archive/course_program/cookie.php",
            }).done(function (msg) {
                $favList.html(msg);
                //Count number of items favorited
                getFavCount();
            });
        }

        //Count the total number of favorite items by getting how many li elements are present
        function getFavCount() {
            var $count = $favList.children().length;
            if ($count > 0) {
                var showTrigger = true;
            } else {
                var showTrigger = false;
            }
            //update favorite count
            updateFavCount($count, showTrigger);
        }

        //Remove favorite from list
        function removeFav(e) {
            e.preventDefault();
            $this = $(this);
            var $favID = $this.attr("data-fav-id"),
                $favType = $(this).attr('data-fav-type'),
                $favToRemove = $this.parents('.fav-item'),
                //what is the active tab
                $activeTab = $(this).closest('.cp-fav').find('.wrapper').find('.cp-fav-tabs').find('.active').attr('data-tabs'),
                $activeTabText = $(this).closest('.cp-fav').find('.wrapper').find('.cp-fav-tabs').find('.active').find('span').text();
            //Remove "favorited" class on card
            $('[data-fav-id="'+$favID+'"]').removeClass('favorited');
            //Apply some animation to show item being removed
            $favToRemove.removeClass('in-list'),
            //Remove item from dom after slight delay
            setTimeout(function () {
                $favToRemove.remove();
                //Count number of items favorited after item removal
                getFavCount();
                //check if there is any more favorites in the current active tab. 
                noFavCheck($activeTab, $activeTabText)
            }, 500);
            //after removal from DOM, delete the cookie
            delete_cookie($favType, $favID);
        }

        //test whether or not we need to show a message to the user that no favorites exist
        function noFavCheck(favTabsActive, favTabsText) {
            //get the count for programs and course favorites
            var $countPrograms = $('.fav-item.au-program').length,
                $countCourses = $('.fav-item.au-course').length,
                $noFavsType = $noFavs.find('span'),
                $showNoFav = false;

            //if current tab is programs and it has at least one saved favorite, don't show message
            if(favTabsActive === '.au-program' && $countPrograms > 0 ){
                showNoFav = false;
            //if current tab is courses and it has at least one saved favorite, don't show message
            } else if (favTabsActive === '.au-course' && $countCourses > 0 ) {
                showNoFav = false;
            } else {
            //otherwise we will show a message to the user
                showNoFav = true;
            }
            //show or don't show a message to user based on the conditions above
            if(showNoFav === true){
                $noFavs.show();
                //update no favorites message based on current tab selection
                $noFavsType.text(favTabsText);
            }else{
                $noFavs.hide();
            }
        }

        //Delete cookie function. Passes cookie name and sets an expiry date in the past.
        function delete_cookie(ctype, cname) {
            document.cookie = ctype + "-" + cname + '=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
        }

        //update favorite number
        function updateFavCount(count, showTrigger) {
            //if users has saved courses/programs, remove empty class on cp-fav-container
            //by default we don't show the favorites trigger if there is nothing saved in users list
            if (showTrigger) {
                $favWrapper.removeClass('empty');
                $cpResults.addClass('active-favs');
            } else {
                $favWrapper.addClass('empty');
                $cpResults.removeClass('active-favs');
            }
            //update count
            $favCount.text(count);
        }

        //tabs for favorites list. Shows courses or programs that users has added to their list in a tab format
        function toggleFavTabs(e) {
            e.preventDefault();
            //hide all list items first
            $favList.find('li').hide();
            var $favTabsActive = $(this).attr('data-tabs'),
                $favTabsBtnsTitle = $(this).find('span').text();
            //remove active state on other tab
            $favTabsBtns.not(this).removeClass('active');
            //add active state on clicked tab
            $(this).addClass('active');
            //show favorites that relate to currently selected tab
            $favList.find('li').filter($favTabsActive).show();
            //check if favorites are present and decided if we need to show a message
            noFavCheck($favTabsActive, $favTabsBtnsTitle);
        }

        //returns the value of a specified cookie:
        function getCookie(cname) {
            var name = cname + "=",
                ca = document.cookie.split(';'),
                i;
            for (i = 0; i < ca.length; i++) {
                var c = ca[i];
                while (c.charAt(0) === ' ') {
                    c = c.substring(1);
                }
                if (c.indexOf(name) === 0) {
                    return c.substring(name.length, c.length);
                }
            }
            return "";
        }

        //Do this on page load
        function init() {
            getCurrentFavs();
        }

        return {
            init: init
        };
    }());

    if ($('.cp-fav-container').length){
        cpFavorites.init(); 
    }
});