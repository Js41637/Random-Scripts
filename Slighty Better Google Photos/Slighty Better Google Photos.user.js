// ==UserScript==
// @name        Slighty Better Google Photos
// @version     1.1
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

// Select all the albums and sort em into groups
function getAlbumsOnPage() {
  var shit = document.querySelectorAll(selectors.albums);
  for (var i = 0; i < shit.length; i++) {
    var out = {
      name: shit[i].querySelector('.FmgwTd').innerText,
      html: shit[i]
    };
    if (out.name.indexOf('Wallpapers') === 0) {
      out.name.indexOf('Games') > 0 ? Albums['Game Wallpapers'].push(out) : Albums.Wallpapers.push(out);
    } else {
      Albums.Misc.push(out);
    }
  };
}

// Sort array by name alphabetically
// Feel free to cringe
function sortAlbumsByName() {
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
}

// To prevent the flexbox showing 1 massive fucking image
function addPaddingToAlbums() {
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
}

// Umm, create new group for albums and yeah
// #nojQueryLyfe
function createAlbumGroups() {
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
    // Get shit just right
    newAlbum.id = Album.split(' ').join('');
    newAlbum.className = selectors.albumsContainer.slice(1);
    newHeader.innerText = Album;
    newHeader.style.width = '100%';
    newAlbum.appendChild(newHeader);
    rootContainer.appendChild(newAlbum);
  }
}

// Starts of the magic and then adds the albums to their respective categories
function updateAlbumsOnPage() {
  getAlbumsOnPage();
  sortAlbumsByName();
  addPaddingToAlbums();
  createAlbumGroups();

  for (var Album in Albums) {
    var curAlbum = document.querySelector('#' + Album.split(' ').join(''));
    Albums[Album].forEach(function(album) {
      curAlbum.appendChild(album.html);
    });
  }
}

// 1 second delay before messing with the DOM
setTimeout(function() {
  updateAlbumsOnPage();
}, 1000);
