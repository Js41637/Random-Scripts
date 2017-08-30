// ==UserScript==
// @name         [Slack] Detailed Emoji Statistics
// @version      0.3
// @description  Displays how many custom emojis you got
// @author       Js41637
// @match        https://*.slack.com/customize/emoji*
// ==/UserScript==

var emojis = document.querySelectorAll('#custom_emoji tbody > .emoji_row');
var users = {};
var users_by_type = {};

var expanded = false;

emojis.forEach(function(emoji) {
  var adder = emoji.querySelector('.author_cell').innerText.trim();
  var type = emoji.querySelector('[headers="custom_emoji_type"').innerText.trim().slice(0, 5);

  if (users_by_type[type]) {
    if (adder in users_by_type[type]) {
      users_by_type[type][adder]++;
    } else {
      users_by_type[type][adder] = 1;
    }
  } else {
    var user = {};
    user[adder] = 1;
    users_by_type[type] = user;
  }

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
  var out = user + ': ' + users[user];
  if (users_by_type['Image'][user]) {
    out += ', Images:' + users_by_type['Image'][user];
  }
  if (users_by_type['Alias'][user]) {
    out += ', Aliases:' + users_by_type['Alias'][user];
  }
  return out;
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
