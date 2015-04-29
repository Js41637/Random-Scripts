// ==UserScript==
// @name       I'm Blue
// @namespace  http://use.i.E.your.homepage/
// @version    0.1
// @description  enter something useful
// @match      http://store.steampowered.com/
// @copyright  2012+, You
// ==/UserScript==

// Select area
var container = document.getElementById("home_main_cluster");

// Delete inner content
container.innerHTML = '';

//set height of element
container.style.height = "399px";

//Insert video
container.innerHTML = '<iframe width="100%" height="399px" src="https://youtube.com/embed/HgV1O0X4uXI?rel=0&autoplay=1" frameborder="0" allowfullscreen></iframe>';