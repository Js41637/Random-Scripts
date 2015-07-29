// ==UserScript==
// @name        Slighty Better Google Photos
// @version     0.3
// @author      Js41637
// @match       https://photos.google.com/collections
// @grant       none
// @run-at      document-end
// ==/UserScript==

// Inject CSS into page
var css = '.MTmRkb{max-width:49.8%;background-color:white!important}.MTmRkb:hover .FLmEnf{opacity:0.95}.jZ7Nke{transition: opacity .2s ease-in-out;opacity:0}',
    head = document.head,
    style = document.createElement('style');
style.type = 'text/css';
style.appendChild(document.createTextNode(css));
head.appendChild(style);

// Select all the albums
var domAlbums = document.querySelectorAll('.MTmRkb');
var normalAlbums = [];
var gameAlbums = [];

for (var i=0; i < domAlbums.length; i++) {
	var out = {
		name: domAlbums[i].querySelector('.FmgwTd').innerText,
		html: domAlbums[i]
	}
	if (out.name && out.name.indexOf('Games') > -1) {
		gameAlbums.push(out);
	} else {
		normalAlbums.push(out);
	}
}
// Sort array by name alphabetically
var sortAlbumsByName = function() {
	normalAlbums.sort(function(a,b) {
		if(a.name < b.name) return -1;
	    if(a.name > b.name) return 1;
	    return 0;
	})
	gameAlbums.sort(function(a,b) {
		if(a.name < b.name) return -1;
	    if(a.name > b.name) return 1;
	    return 0;
	})
}

// Umm, create new group for albums and yeah
// #nojQueryLyfe
var container = document.querySelector('.jZ7Nke');
var newGroup = document.createElement('div');
newGroup.className = 'Iwe7i';
newGroup.id = 'gamesAlbum';
container.appendChild(newGroup);
var gamesGroup = document.querySelector('#gamesAlbum');
var normalGroup = document.querySelector('.Iwe7i');

var updateAlbumsOnPage = function() {
	sortAlbumsByName();
	// Don't kill me
	normalGroup.innerHTML = '';
	var normalHeader = document.createElement('h2');
	normalHeader.style.width = '100%';
	normalHeader.innerText = 'Wallpapers'
	normalGroup.appendChild(normalHeader);
	var gameHeader = document.createElement('h2');
	gameHeader.style.width = '100%';
	gameHeader.innerText = 'Game Wallpapers'
	gamesGroup.appendChild(gameHeader);

	// Readd normal albums in order
	for (var i = 0; i < normalAlbums.length; i++) {
		normalGroup.appendChild(normalAlbums[i].html);
	};
	// Add the games album to its group in order
	for (var i = 0; i < gameAlbums.length; i++) {
		gamesGroup.appendChild(gameAlbums[i].html);
	};
	container.style.opacity = 1;
}

// Need a timeout google loads the small images first and then updates it to bigger version
// Updating page before this happens will cause the images to not update
setTimeout(function(){ updateAlbumsOnPage(); }, 1000);