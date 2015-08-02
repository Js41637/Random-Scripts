// ==UserScript==
// @name        Slighty Better Google Photos
// @version     1.0
// @author      Js41637
// @match       *://photos.google.com/*
// @grant       none
// @run-at      document-start
// ==/UserScript==

// Inject CSS into page
var css = '.MTmRkb{max-width:49.8%;background-color:white!important}.FLmEnf{transition: 0.2s opacity ease-in-out}.MTmRkb:hover .FLmEnf{opacity:0.93}.jZ7Nke{transition: opacity .2s ease-in-out;opacity:0}',
    head = document.head,
    style = document.createElement('style');
style.type = 'text/css';
style.appendChild(document.createTextNode(css));
head.appendChild(style);

var loadedOnPage = true;

var domAlbums, normalAlbums = [], gameAlbums = [];
var albumsContainer, newGroup, gamesGroup, normalGroup, normalHeader, gameHeader;
	
// Select all the albums
function getAlbumsOnPage() {
	domAlbums = document.querySelectorAll('.MTmRkb');
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
};

// Sort array by name alphabetically
function sortAlbumsByName() {
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
};

// Umm, create new group for albums and yeah
// #nojQueryLyfe
function createAlbumGroups() {
	normalGroup = document.querySelector('.Iwe7i');
	normalGroup.innerHTML = '';
	albumsContainer = document.querySelector('.jZ7Nke');
	newGroup = document.createElement('div');
	newGroup.className = 'Iwe7i';
	newGroup.id = 'gamesAlbum';
	albumsContainer.appendChild(newGroup);
	gamesGroup = document.querySelector('#gamesAlbum');
	normalHeader = document.createElement('h2');
	normalHeader.style.width = '100%';
	normalHeader.innerText = 'Wallpapers'
	normalGroup.appendChild(normalHeader);
	gameHeader = document.createElement('h2');
	gameHeader.style.width = '100%';
	gameHeader.innerText = 'Game Wallpapers'
	gamesGroup.appendChild(gameHeader);
};

function updateAlbumsOnPage() {
	sortAlbumsByName();
	createAlbumGroups();

	// Readd normal albums in order
	for (var i = 0; i < normalAlbums.length; i++) {
		normalGroup.appendChild(normalAlbums[i].html);
	};
	// Add the games album to its group in order
	for (var i = 0; i < gameAlbums.length; i++) {
		gamesGroup.appendChild(gameAlbums[i].html);
	};
	albumsContainer.style.opacity = 1;
};
/** Loading thingy
 * The script loads on any google photos page but this script only affects the /collections so we need to load at
 * the right time and give google time to do its thing.
 * 
 * If we load directly onto the /collections page after the initial 1000ms delayed init, update the page immediately.
 * If we didn't load onto the /collections page, set loadedOnPage to false and check every 200ms if we have
 * changed to the /collections page and once we have, do a 1000ms timeout before updating albums
 */
function delayedInit() {
	if (document.URL.indexOf('collections') > -1) {
		if (loadedOnPage) {
			getAlbumsOnPage();
			updateAlbumsOnPage();
		} else {
			setTimeout(function(){ getAlbumsOnPage();updateAlbumsOnPage(); }, 1000);
		}
	} else {
		loadedOnPage = false;
		setTimeout(function(){ delayedInit(); }, 200);
	}
};

setTimeout(function(){ delayedInit(); }, 1000);