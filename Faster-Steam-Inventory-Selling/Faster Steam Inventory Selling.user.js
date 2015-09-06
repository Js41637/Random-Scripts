// ==UserScript==
// @name         Faster-Steam-Inventory-Selling
// @version      0.2
// @author       Js41637
// @match        http://steamcommunity.com/id/*/inventory*
// @grant        none
// ==/UserScript==

// Removes the second confirmation page after entering a price.
jQuery("body").keyup(function(event) {
    if(event.keyCode == 13) {
    	jQuery("#market_sell_dialog_ok span").click();
    }
});

// Override reload function to prevent reload and disable currently selected item
CUserYou.prototype.ReloadInventory = function() {
	var appID = g_ActiveInventory.appid,
		contextID = g_ActiveInventory.selectedItem.contextid,
		itemID = g_ActiveInventory.selectedItem.id;

	jQuery("#item" + appID + "_" + contextID + "_" + itemID).css("opacity", "0.45");
	jQuery("#item" + appID + "_" + contextID + "_" + itemID).css("pointer-events", "none");
}