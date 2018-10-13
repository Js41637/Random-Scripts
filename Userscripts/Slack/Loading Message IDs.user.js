// ==UserScript==
// @name         [Slack] Show Loading Message ID
// @version      0.2
// @description  Shows the IDs of all the loading messages
// @author       Js41637
// @match        https://*.slack.com/customize/loading
// ==/UserScript==

$('<th>MessageID</th>').insertBefore('#customs_table thead tr th:last-of-type');
var messages = $('#customs_table tbody tr');
messages.each(function() {
	$('<td class="msgID">' + this.id.slice(4) + '</td>').insertBefore($('td:last-of-type', this));
});
