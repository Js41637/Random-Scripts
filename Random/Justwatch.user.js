// ==UserScript==
// @name         Justwatch ID Viewer
// @version      1.0
// @description  try to take over the world!
// @author       Who knows
// @match        https://www.justwatch.com/*/search*
// ==/UserScript==

// Wait for the page to load and return the results when they are available
function getElements() {
  return new Promise(function(resolve) {
    function delay() {
      var elms = document.querySelectorAll('.main-content__list-element');
      if (!elms.length) {
        setTimeout(delay, 50);
      } else {
        return resolve(Array.prototype.filter.call(elms, function(e) {
          return !e.querySelector('.idthingy'); // Remove elements that already have ids
        }));
      }
    }
    delay();
  });
}

// Return the scope of every element which contains it's data
function fetchDaScopes(elements) {
  return new Promise(function(resolve) {
    return resolve(Array.prototype.map.call(elements, function(elm) {
      var scope = angular.element(elm).scope();

      // If there is no scope we probably aren't in debug mode so reload with debug mode enabled
      if (!scope) {
        angular.reloadWithDebugInfo();
        return;
      }

      return { element: elm, data: scope.title };
    }));
  });
}

var normalDivStyle = 'display: inline-block;border: 2px solid #a80000;border-radius: 5px;padding: 3px 5px;';
var clickedDivStyle = 'display: inline-block;border: 2px solid #1aa800;border-radius: 5px;padding: 3px 5px;';

function getDivText(id, clicked) {
   return [
     '<span style="font-size:14px;">',
     'ID: </span><span class="additional-filter__button" style="font-size:15px;cursor:auto;">',
     id,
     '</span> - <span style="color:gray">',
     clicked ? 'Copied!' : 'Click to copy',
     '</span>'
   ].join('');
}

function addIDsToDaPage(results) {
  return new Promise(function(resolve) {
    results.forEach(function(item) {
      var div = document.createElement('div');
      div.className = "idthingy";
      div.style = normalDivStyle;
      div.innerHTML = getDivText(item.data.id);
      div.addEventListener('click', function(event) {
        event.preventDefault();
        copyTextToClipboard(item.data.id);
        div.style = clickedDivStyle;
        div.innerHTML = getDivText(item.data.id, true);
        setTimeout(function() {
          div.style = normalDivStyle;
          div.innerHTML = getDivText(item.data.id);
        }, 1500);
      });
      insertAfter(div, item.element.querySelector('a.main-content__list-element__title'));
    });
  });
}

function insertAfter(el, referenceNode) {
  referenceNode.parentNode.insertBefore(el, referenceNode.nextSibling);
}

function copyTextToClipboard(text) {
  var textArea = document.createElement("textarea");
  textArea.style.position = 'fixed';
  textArea.style.top = 0;
  textArea.style.left = 0;
  textArea.style.width = '2em';
  textArea.style.height = '2em';
  textArea.style.padding = 0;
  textArea.style.border = 'none';
  textArea.style.outline = 'none';
  textArea.style.boxShadow = 'none';
  textArea.style.background = 'transparent';
  textArea.value = text;
  document.body.appendChild(textArea);
  textArea.select();

  try {
    var successful = document.execCommand('copy');
    var msg = successful ? 'successful' : 'unsuccessful';
    console.log('Copying text command was ' + msg);
  } catch (err) {
    console.log('Oops, unable to copy');
  }

  document.body.removeChild(textArea);
}

setInterval(function() {
  getElements()
    .then(fetchDaScopes)
    .then(addIDsToDaPage);
}, 800);

