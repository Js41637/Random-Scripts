// ==UserScript==
// @name         Show Loading Message ID
// @version      0.1
// @description  Shows the IDs of all the loading messages
// @author       Js41637
// @match        https://*.slack.com/customize/loading
// ==/UserScript==

$('#customs_table tr:first-of-type').append('<th>MessageID</th>')
$('#customs_table tr:not(:first-of-type)').each(function(i) {
	$(this).append('<td>' + this.id.slice(4, -1) + '</td>')
})
