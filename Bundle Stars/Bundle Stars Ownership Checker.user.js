// ==UserScript==
// @name         Bundle Stars Game Ownership Checker
// @version      0.6
// @description  Checks games in the bundle if you own them on Steam
// @author       Js41637
// @match        https://www.bundlestars.com/*/bundle/*
// @connect      api.steampowered.com
// @grant        GM_xmlhttpRequest
// @run-at       document-end
// ==/UserScript==

var steamID = undefined;
var apikey = undefined;
var bundles;
var steamGames = [];
var bundledGames = [];

var css = `
.navbar .container {
  position: relative;
}

#thingy {
  position: absolute;
  right: -30px;
  top: 19px;
  width: 20px;
  background-color: grey;
  height: 20px;
  border-radius: 10px;
}
#thingy.good {
  background-color: green;
}
#thingy.bad {
  background-color: red;
}
#bundleStats {
  font-size: 15px;
  text-align: center;
  border-top: 1px solid rgb(128, 128, 128);
  border-bottom: 1px solid rgb(128, 128, 128);
  padding: 4px 0;
  font-family: monospace;
  font-weight: bold;
}
`;

setTimeout(function() {
  var style = document.createElement('style');
  style.innerHTML = css;
  document.head.appendChild(style);
  var div = document.createElement('div');
  div.id = 'thingy';
  document.querySelector('.navbar .container').appendChild(div);
}, 1000);

function getSteamGames() {
  return new Promise(function(resolve, reject) {
    console.info("Getting steam games");
    if (!steamID || !apikey) {
      return console.error("Error! No SteamID Key or API Key set");
    }

    var url =  `http://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key=${apikey}&steamid=${steamID}`;
    makeRequest('GET', url, function(err, data) {
      if (!err && data) {
        data.response.games.forEach(function(game) {
          steamGames.push(game.appid);
        });
        resolve();
      } else {
        console.error("Returned an error", data);
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
          console.info("Unable to fetch bundles, trying again");
          setTimeout(function() {
            _getBundles();
          }, 1500);
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
        bundledGames.push({
          appid: game.steam.id,
          features: game.features
        });
      });
    });
    console.info("Found games", bundledGames.length);
    return resolve();
  });
}

function checkTradingCards() {
  return new Promise(function(resolve) {
    var matched = 0;
    bundledGames.forEach(function(game, index) {
      game.features.forEach(function(feature) {
        if (feature == 'Steam Trading Cards') {
          matched++;
          bundledGames[index].tradingCards = true;
        }
      });
    });
    console.info("Found", matched, 'games with trading cards');
    return resolve();
  });
}

function matchGames() {
  return new Promise(function(resolve) {
    var matched = 0;
    var trading = 0;
    bundledGames.forEach(function(game, i) {
      if (steamGames.indexOf(game.appid) != -1) {
        matched++;
        document.querySelectorAll('.panel-group .panel')[i].querySelector('.panel-heading').style.backgroundColor = 'rgba(72, 239, 72, 0.4)';
      }
      if (game.tradingCards) {
        trading++;
        document.querySelectorAll('.panel-group .panel')[i].querySelector('.panel-heading').style.borderRight = '5px solid lightseagreen';
      }
    });

    var statsMessage = [
      bundledGames.length,
      'games in total |',
      matched,
      'games already owned |',
      trading,
      'games with trading cards'
    ];

    var statsElm = document.createElement('div');
    statsElm.id="bundleStats";
    statsElm.innerText = statsMessage.join(' ');
    insertAfter(statsElm, document.querySelector('.bundle-desc:last-of-type'));

    console.info(matched ? 'Matched ' + matched + ' games' : 'Matched no games');
    resolve();
  });
}

function makeRequest(method, url, done) {
  GM_xmlhttpRequest({
    method: method,
    url: url,
    onload: function(response) {
      try {
        done(false, JSON.parse(response.response));
      } catch (e) {
        console.error("Error prasing response JSON", e);
        done(true, response);
      }
    },
    onerror: function(response) {
      done(true, response);
    }
  });
}

function ohNo() {
  document.querySelector('#thingy').classList.remove('good');
  document.querySelector('#thingy').classList.add('bad');
}

function allG() {
  document.querySelector('#thingy').classList.remove('bad');
  document.querySelector('#thingy').classList.add('good');
}

// https://stackoverflow.com/a/4793630
function insertAfter(newNode, referenceNode) {
  referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
}

setTimeout(function() {
  getSteamGames()
    .then(getBundles)
    .then(getGamesOnPage)
    .then(checkTradingCards)
    .then(matchGames)
    .then(allG)
    .catch(ohNo);
}, 1500);
