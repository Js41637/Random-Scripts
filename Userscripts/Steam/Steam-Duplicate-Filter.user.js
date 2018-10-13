// ==UserScript==
// @name          [Steam] Duplicate Item Filter
// @author        Js41637
// @version       1.1.0
// @description   Adds a duplicate filter to Steams inventory filter options
// @match					*://steamcommunity.com/*/inventory
// @match					*://steamcommunity.com/*/inventory*
// @run-at				document-body
// ==/UserScript==

var OriginalCInventoryAddInventoryData = CInventory.prototype.AddInventoryData;
var OriginalCInventoryLoadMoreAssets = CInventory.prototype.LoadMoreAssets;

// Steam loads a fixed amount, hijack any LoadMoreAsset calls and tell it to load 2500
CInventory.prototype.LoadMoreAssets = function() {
	console.log("Load More Assets");
	return OriginalCInventoryLoadMoreAssets.call(this, 2500);
};

var classids = [];
var duplicates = [];

// Hijicak the AddInventoryData function first check all items for duplicates, then send the new data to the original function
CInventory.prototype.AddInventoryData = function(data) {
	console.log("Extended CInventory.initialize called");
	var duplicateFilter = {
		category: "misc",
		internal_name: "duplicate",
		localized_category_name: "Misc",
		localized_tag_name: "Duplicate"
	};

	var marketableDuplicateFilter = {
		category: "misc",
		internal_name: "m_duplicate",
		localized_category_name: "Misc",
		localized_tag_name: "Marketable Duplicates"
	};

	if (data.assets) {
		for (var i = 0; i < data.assets.length; i++) {
			var key = data.assets[i].classid;
			if (classids.includes(key)) {
				if (!duplicates.includes(key)) {
					duplicates.push(key);
				}
			} else {
				classids.push(key);
			}
		}
	}

	if (data.descriptions) {
		for (var b = 0; b < data.descriptions.length; b++) {
			var description = data.descriptions[b];
			var id = description.classid;
			var marketable = description.marketable;
			if (!description.tags) {
				description.tags = [];
			}
			if (duplicates.includes(id)) {
				description.tags.push(duplicateFilter);
				if (marketable) {
					description.tags.push(marketableDuplicateFilter);
				}
			}
		}
	}

	OriginalCInventoryAddInventoryData.call(this, data);
};
