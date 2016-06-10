// ==UserScript==
// @name         Bundle Stars Game Ownership Checker
// @version      0.1
// @description  Checks games in the bundle if you own them on Steam
// @author       Js41637
// @match        https://www.bundlestars.com/*/bundle/*
// @connect      api.steampowered.com
// @grant        GM_xmlhttpRequest
// @run-at       document-end
// ==/UserScript==

var steamID = undefined;
var APIKey = undefined;
var gamesURL = 'http://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key=token&steamid=%q%';
var steamGames = null;
var bundledGames = null;

function getSteamGames() {
  return new Promise(function(resolve, reject) {
    console.info("Getting steam games");
    if (!steamID || !APIKey) {
      return console.error("Error! No SteamID or Steam API Key set");
    }

    makeRequest('GET', 'http://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key=' + APIKey + '&steamid=' + steamID, function(err, resp) {
      if (!err && resp) {
        console.info("Got games", resp.response.games.length);
        var appIDs = [];
        for (var i = 0; i < resp.response.games.length; i++) {
          appIDs.push(resp.response.games[i].appid);
        }
        steamGames = appIDs;
        resolve();
      } else {
        console.error("Returned an error", resp);
        reject();
      }
    });
  });
}

var attempts = 0;

function matchGamesOnPage() {
  bundledGames = angular.element(document.querySelector('.panel-group')).scope();

  if (!bundledGames && attempts < 2) {
    setTimeout(function() {
      console.info("Couldn't find bundled games, trying again");
      matchGamesOnPage();
    }, 1000);
    attempts++;
    return;
  } else if (!bundledGames) {
    console.info("Error fetching bundled Games");
    return;
  }

  bundledGames = angular.element(document.querySelector('.panel-group')).scope().tier.games;

  var matched = 0;
  console.info("Matching games", bundledGames.length);
  for (var i = 0; i < bundledGames.length; i++) {
    if (steamGames.indexOf(bundledGames[i].steam.id) != -1) {
      matched++;
      document.querySelectorAll('.panel-group .panel')[i].querySelector('.panel-heading').style.backgroundColor = 'rgba(72, 239, 72, 0.3)';
    }
  }
  console.info(matched ? 'Matched ' + matched + ' games' : 'Matched no games');
}

function makeRequest(method, url, done) {
  GM_xmlhttpRequest({
    method: method,
    url: url,
    onload: function(response) {
      done(false, JSON.parse(response.responseText));
    },
    onerror: function(response) {
      done(true, response);
    }
  });
}

setTimeout(function() {
  getSteamGames().then(matchGamesOnPage);
}, 2000);
