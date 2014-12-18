// ==UserScript==
// @name         Christmas Profile
// @version      1.3.2
// @description  Client Side Christmas Themed Profile
// @author       Js41637
// @include      /^https?://steamcommunity.com/(id|profile)/
// @downloadURL https://github.com/Js41637/Userscripts/raw/master/Steam-Holiday-Profile/Christmas%20Profile.user.js
// @grant        none
// ==/UserScript==

// Original code from reddit user The_MAZZTer, taken from;
// http://www.reddit.com/r/Steam/comments/2pfyyj/theme_any_profile_with_the_holiday_profile_from/

/*
 * Steam hosted version
 * Depends on Steam Hosting the required files
 */
(function() {

  console.info("Holiday Profile 2014 loading");

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

  // Find Avatar and Online Status elements
  var iAvatar = $J(".playerAvatar.profile_header_size");
  var iOnlineStatus = $J(".profile_in_game.persona");
  // If the user is online, swap out the 'online' class for the 'golden' class
  // Only swap to the golden class when the user is 'online' and not 'offline' or 'in-game'
  // Manually adds and removes required classes, switchClass function doesn't seem to work or be supported
  if(iAvatar.hasClass("online")) {
    iAvatar.addClass("golden");
    iAvatar.removeClass("online");
  }
  if(iOnlineStatus.hasClass("online")) {
    iOnlineStatus.addClass("golden");
    iOnlineStatus.removeClass("online");
  }

  // Manually add the Holiday Profile Overlay thingy with the crystals.
  $J(".profile_header_bg_texture").append('<div class="holidayprofile_header_overlay"></div>');

  /*
   * Javascript for image animations
   */

  // Get the Javascript
  $J.getScript("https://steamcommunity-a.akamaihd.net/public/javascript/holidayprofile.js").done(function() {
    // Oddly the JS doesn't start itself
    StartAnimation();
  });

})();

