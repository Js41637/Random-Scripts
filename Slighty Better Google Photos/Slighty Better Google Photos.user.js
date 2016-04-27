// ==UserScript==
// @name        Slighty Better Google Photos
// @version     1.0
// @author      Js41637
// @match       *://photos.google.com/albums
// @grant       none
// @run-at      document-start
// ==/UserScript==

// Inject CSS into page
var css = '.MTmRkb{transition: opacity 0.1s;} .MTmRkb:hover {opacity: 0.95;}',
  head = document.head,
  style = document.createElement('style');
style.type = 'text/css';
style.appendChild(document.createTextNode(css));
head.appendChild(style);

var Albums = {
  Misc: [],
  Wallpapers: [],
  "Game Wallpapers": []
};

var selectors = {
  rootContainer: '.jZ7Nke',
  albumsContainer: '.Iwe7i',
  albums: '.MTmRkb',
  albumPad: '.D14YYd'
};

// Select all the albums
function getAlbumsOnPage() {
  return new Promise(function(resolve) {
    document.querySelectorAll(selectors.albums).forEach(function(album) {
      var out = {
        name: album.querySelector('.FmgwTd').innerText,
        html: album
      };
      if (out.name.indexOf('Wallpapers') === 0) {
        out.name.indexOf('Games') > 0 ? Albums['Game Wallpapers'].push(out) : Albums.Wallpapers.push(out);
      } else {
        Albums.Misc.push(out);
      }
    });
    padding = document.querySelectorAll(selectors.albumPad);
    return resolve(true);
  });
}

// Sort array by name alphabetically
// Feel free to cringe
function sortAlbumsByName() {
  return new Promise(function(resolve) {
    Albums.Wallpapers.sort(function(a, b) {
      if (a.name < b.name) return -1;
      if (a.name > b.name) return 1;
      return 0;
    });
    Albums['Game Wallpapers'].sort(function(a, b) {
      if (a.name < b.name) return -1;
      if (a.name > b.name) return 1;
      return 0;
    });
    Albums.Misc.sort(function(a, b) {
      if (a.name < b.name) return -1;
      if (a.name > b.name) return 1;
      return 0;
    });
    return resolve(true);
  });
}

// To prevent the flexbox showing 1 massive fucking image
function addPaddingToAlbums() {
  return new Promise(function(resolve) {
    for (var Album in Albums) {
      for (var i = 0; i < 13; i++) {
        // Apparently you need to create a new element every time, adding the same element gets ignored
        var pad = document.createElement('div');
        pad.className = selectors.albumPad.slice(1);
        var out = {
          name: 'pad',
          html: pad
        };
        Albums[Album].push(out);
      }
    }
    return resolve(true);
  });
}

// Umm, create new group for albums and yeah
// #nojQueryLyfe
function createAlbumGroups() {
  return new Promise(function(resolve) {
    // Set shit up
    var rootContainer = document.querySelector(selectors.rootContainer),
      albumsContainer = document.querySelector(selectors.albumsContainer);

    // Blank Slate
    albumsContainer.remove();

    // Setup new albums
    for (var Album in Albums) {
      // Set shit up
      var newAlbum = document.createElement('div'),
        newHeader = document.createElement('h2');
      newAlbum.id = Album.split(' ').join('');
      newAlbum.className = selectors.albumsContainer.slice(1);
      newHeader.innerText = Album;
      newHeader.style.width = '100%';
      newAlbum.appendChild(newHeader);
      rootContainer.appendChild(newAlbum);
    }
    return resolve(true);
  });
}

// Starts of the magic and then adds the albums to their respective categories
function updateAlbumsOnPage() {
  getAlbumsOnPage()
    .then(sortAlbumsByName())
    .then(addPaddingToAlbums())
    .then(createAlbumGroups())
    .then(function() {
      for (var Album in Albums) {
        var curAlbum = document.querySelector('#' + Album.split(' ').join(''));
        Albums[Album].forEach(function(album) {
          curAlbum.appendChild(album.html);
        });
      }
    });
}

// 1 second delay before messing with the DOM
setTimeout(function() {
  updateAlbumsOnPage();
}, 1000);
