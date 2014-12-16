// ==UserScript==
// @name         Hide Empty Showcase
// @version      0.1
// @description  Hides the empty showcase
// @author       Js41637
// @include        *://steamcommunity.com/id/*
// @include        *://steamcommunity.com/profiles/*
// @grant        none
// ==/UserScript==

var hidethingy = document.querySelectorAll('.profile_customization.customization_edit.none_selected');
hidethingy[0].style.display = 'none';