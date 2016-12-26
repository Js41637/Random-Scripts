// ==UserScript==
// @name         [Slack] Detailed Emoji Statistics
// @version      0.3
// @description  Displays how many custom emojis you got
// @author       Js41637
// @match        https://*.slack.com/customize/emoji*
// ==/UserScript==

var emojis = document.querySelectorAll('#custom_emoji tbody > .emoji_row');
var users = {};
var expanded = false;

emojis.forEach(function(emoji) {
  var adder = emoji.querySelector('.author_cell').innerText.trim();
  if (adder in users) {
    users[adder]++;
  } else {
    users[adder] = 1;
  }
});

var text = '<h5 id="ec_count">You currently have ' + emojis.length + ' custom Emoji added by ' + Object.keys(users).length + ' people</h5>';
var detailsText = ' <a id="ec_viewDetails">View Details</a>';
$(text).insertBefore('#custom_emoji');
$('#ec_count').append(detailsText);

var sorted = Object.keys(users).sort(function(a, b) {
  return users[b] - users[a];
});

var list = sorted.map(function(user) {
  return user + ': ' + users[user];
});
var listTemplate = '<div id="ec_list" style="display: none">' + list.join('<br>') + '</div>';
$('#ec_count').append(listTemplate);
$('#ec_viewDetails').click(function() {
  if (!expanded) {
    expanded = true;
    $('#ec_list').slideDown();
    $('#ec_viewDetails').text('Hide Details');
  } else {
    expanded = false;
    $('#ec_list').slideUp();
    $('#ec_viewDetails').text('View Details');
  }
});
