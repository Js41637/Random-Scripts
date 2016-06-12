// ==UserScript==
// @name         Bundle Stars Game Ownership Checker
// @version      0.3
// @description  Checks games in the bundle if you own them on Steam
// @author       Js41637
// @match        https://www.bundlestars.com/*/bundle/*
// @connect      api.steampowered.com
// @grant        GM_xmlhttpRequest
// @run-at       document-end
// ==/UserScript==

var steamID = undefined;
var APIKey = undefined;
var bundles;
var steamGames = [];
var bundledGames = [];

function getSteamGames() {
  return new Promise(function(resolve, reject) {
    console.info("Getting steam games");
    if (!steamID || !APIKey) {
      return console.error("Error! No SteamID or Steam API Key set");
    }

    makeRequest('GET', 'http://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key=' + APIKey + '&steamid=' + steamID, function(err, resp) {
      if (!err && resp) {
        console.info("Got games", resp.response.games.length);
        for (var i = 0; i < resp.response.games.length; i++) {
          steamGames.push(resp.response.games[i].appid);
        }
        resolve();
      } else {
        console.error("Returned an error", resp);
        reject();
      }
    });
  });
}

function getBundles() {
  return new Promise(function(resolve, reject) {
    var attempts = 0;

    function _getBundles() {
      if (angular.element(document.querySelector('.col-xs-12.col-md-8.col-md-pull-4')).scope()) {
        console.info("Got bundles");
        bundles = angular.element(document.querySelector('.col-xs-12.col-md-8.col-md-pull-4')).scope().product.bundles;
        resolve();
      } else {
        if (attempts < 5) {
          console.info("Unable to fetch bundles, trying again in 1 second");
          setTimeout(function() {
            _getBundles();
          }, 1200);
        } else {
          console.info("Error fetching bundles after 5 tries");
          reject();
        }
      }
    }
    _getBundles();
  });
}

function getGamesOnPage() {
  return new Promise(function(resolve) {
    bundles.forEach(function(bundle) {
      bundle.games.forEach(function(game) {
        bundledGames.push(game.steam.id);
      });
    });
    console.info("Found games", bundledGames.length);
    return resolve();
  });
}

function matchGames() {
  var matched = 0;
  for (var i = 0; i < bundledGames.length; i++) {
    if (steamGames.indexOf(bundledGames[i]) != -1) {
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
  getSteamGames()
    .then(getBundles)
    .then(getGamesOnPage)
    .then(matchGames);
}, 1000);
