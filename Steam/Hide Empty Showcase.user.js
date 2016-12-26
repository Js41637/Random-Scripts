// ==UserScript==
// @name         Hide Empty Showcase
// @version      0.3
// @description  Hides the empty showcase
// @author       Js41637
// @include      /^https?:\/\/steamcommunity.com\/(id|profile)\/[\w]+\/?$/
// @grant        none
// ==/UserScript==

//Find and hide the empty showcase field button thing
$J('.profile_customization.customization_edit.none_selected').remove();

console.info("Add New Showcase field removed");
