// ==UserScript==
// @name         Emoji Count
// @version      0.1
// @description  Displays how many custom emojis you got
// @author       Js41637
// @match        https://*.slack.com/customize/emoji
// ==/UserScript==

var length = $('#custom_emoji tbody > .emoji_row').length;
$('#custom_emoji').prepend('<h5>You currently have ' + length + ' custom Emoji</h5>');
