// ==UserScript==
// @name         Faster-Steam-Inventory-Selling
// @version      0.2
// @author       Js41637
// @match        http://steamcommunity.com/id/*/inventory*
// @grant        none
// ==/UserScript==

/** 
 * Removes the annoying second confirmation page after entering a price that cant 
 * be accepted with an enter like the first one.
 * After entering a price and pressing enter it will automatically click the second confirmation button
 * 
 * Has to be on the body, doesn't work anywhere else for some reason.
 **/
jQuery("body").keyup(function(event) {
	// This will fire on every enter but does nothing unless the first page has been confirmed
  if (event.keyCode == 13) { // 13 = enter key
  	jQuery("#market_sell_dialog_ok span").click();
  }
});

/**
 * Overrides the ReloadInventory function to prevent a full inventory reload
 * after selling an item that is like a 3 second delay
 * After selling an item the inventory won't reload, instead it will fade the item out.
 **/
CUserYou.prototype.ReloadInventory = function() {
	// Why we do we need all this to select a single item :/
	var appID = g_ActiveInventory.appid,
			contextID = g_ActiveInventory.selectedItem.contextid,
			itemID = g_ActiveInventory.selectedItem.id;

	jQuery("#item" + appID + "_" + contextID + "_" + itemID).css("opacity", "0.4");
	jQuery("#item" + appID + "_" + contextID + "_" + itemID).css("pointer-events", "none");
}