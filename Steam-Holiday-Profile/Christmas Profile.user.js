// ==UserScript==
// @name         Christmas Profile
// @version      1.2
// @description  Client Side Christmas Themed Profile
// @author       Js41637
// @include      /^https?://steamcommunity.com/(id|profile)/
// @grant        none
// ==/UserScript==

// Original code from reddit user The_MAZZTer, taken from;
// http://www.reddit.com/r/Steam/comments/2pfyyj/theme_any_profile_with_the_holiday_profile_from/

/*
 * Steam hosted version
 * Depends on Steam Hosting the required files
 */
(function() {
  /*
   * CSS Stylesheet and Classes
   */

  // Add the Holiday Themed CSS
  $J("head").append(
    $J(document.createElement("link")).prop({
      href: "https://steamcommunity-a.akamaihd.net/public/css/skin_1/holidayprofile.css?v=" + new Date().valueOf(),
      rel: "stylesheet",
      type: "text/css"
    })
  );
  // Activate the CSS on the page
  $J(".profile_page").addClass("holidayprofile");
  // Avatar Outline (must be manually set) ONLY when user is 'online', not in-game or offline
  if($J(".playerAvatar.profile_header_size").hasClass("online")) {
    // Swap out the online class for the golden class
    // switchClass doesn't seem to work or be supported ?
    $J(".playerAvatar.profile_header_size").addClass("golden");
    $J(".playerAvatar.profile_header_size").removeClass("online");
  }
  // Online Status (must be manually set) ONLY when user is 'online', not in-game or offline
  if($J(".profile_in_game.persona").hasClass("online")) {
    // Swap out the online class for the golden class
    // switchClass doesn't seem to work or be supported ?
    $J(".profile_in_game.persona").addClass("golden");
    $J(".profile_in_game.persona").removeClass("online");
  }
  // Manually add the Holiday Profile Overlay thingy with the crystals.
  $J(".profile_header_bg_texture").append('<div class="holidayprofile_header_overlay"></div>');

  // Get the Javascript
  $J.getScript("https://steamcommunity-a.akamaihd.net/public/javascript/holidayprofile.js").done(function() {
    // Oddly the JS doesn't start itself
    StartAnimation();
  });

})();

