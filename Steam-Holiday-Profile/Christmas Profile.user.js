// ==UserScript==
// @name         Christmas Profile
// @version      0.1
// @description  Client Side Christmas Themed Profile
// @author       You
// @match        *.steamcommunity.com/id/*
// @match        *.steamcommunity.com/profile/*
// @grant        none
// ==/UserScript==

// Original code from reddit user The_MAZZTer, taken from;
// http://www.reddit.com/r/Steam/comments/2pfyyj/theme_any_profile_with_the_holiday_profile_from/

/*
 * Steam hosted version
 */
(function() {
  // Add Holiday CSS.
  $J("head").append(
      $J(document.createElement("link")).prop({
          href: "http://steamcommunity-a.akamaihd.net/public/css/skin_1/holidayprofile.css?v=" + new Date().valueOf(),
          rel: "stylesheet",
          type: "text/css"
      })
  );
  // Activate the CSS.
  $J(".profile_page").addClass("holidayprofile");

  // Get the Javascript
  $J.getScript("http://steamcommunity-a.akamaihd.net/public/javascript/holidayprofile.js").done(function() {
    // Oddly the JS doesn't start itself
    StartAnimation();
  });

  //Manually add the Holiday Profile Overlay thingy with the crystals.
  $J(".profile_header_bg_texture").append('<div class="holidayprofile_header_overlay"></div>')
})();
