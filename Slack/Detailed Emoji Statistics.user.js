// ==UserScript==
// @name         [Slack] Detailed Emoji Statistics
// @version      0.4
// @description  Displays how many custom emojis you got
// @author       Js41637
// @match        https://*.slack.com/customize/emoji*
// ==/UserScript==

var emojis = document.querySelectorAll('#custom_emoji tbody > .emoji_row');
var userTotal = {};
var users_by_type = {
  "Image": {},
  "Alias": {}
};

var expanded = false;

emojis.forEach(function(emoji) {
  var adder = emoji.querySelector('.author_cell').innerText.trim();
  var type = emoji.querySelector('[headers="custom_emoji_type"]').innerText.split(' ')[0].trim();

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

  if (adder in userTotal) {
    userTotal[adder]++;
  } else {
    userTotal[adder] = 1;
  }
});

var text = '<h5 id="ec_count">You currently have ' + emojis.length + ' custom Emoji added by ' + Object.keys(userTotal).length + ' people</h5>';
var detailsText = ' <a id="ec_viewDetails">View Details</a>';
$(text).insertBefore('#custom_emoji');
$('#ec_count').append(detailsText);

var sorted = Object.keys(userTotal).sort(function(a, b) {
  return userTotal[b] - userTotal[a];
});

function col(text) {
  return '<td>' + text + '</td>';
}

function table(cols) {
  return '<table class="full_width"><tbody><tr><th>User</th><th>Images</th><th>Aliases</th><th>Total</th></tr>' + cols.join('\n') + '</tbody></table>';
}

var list = sorted.map(function(user) {
  var cols = col(user) + col(users_by_type.Image[user] || 0) + col(users_by_type.Alias[user] || 0) + col(userTotal[user]);
  return '<tr>' + cols + '</tr>';
});

var listTemplate = '<div id="ec_list" style="display:none">' + table(list) + '</div>';
$(listTemplate).insertAfter('#ec_count');
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
