// ==UserScript==
// @name         Sort Discord bots by popularity
// @version      0.1
// @description  Sorts discord bots by how many servers they are on
// @author       Js41637
// @match        https://bots.discord.pw/
// @run-at       document-idle
// ==/UserScript==

var container = document.querySelector('#bot-table tbody');
var thing =  Array.prototype.slice.call(document.querySelectorAll('#bot-table tbody > tr')).map(elm => {
  elm.classList = [];
  return elm;
}).sort((a, b) => {
  var [aCount, bCount] = [
    a.querySelector('.tag.is-info') ? parseInt(a.querySelector('.tag.is-info').innerText.split(' ')[0]) : 0,
    b.querySelector('.tag.is-info') ? parseInt(b.querySelector('.tag.is-info').innerText.split(' ')[0]) : 0
  ];
  if (aCount > bCount) return -1;
  if (aCount < bCount) return 1;
  return 0;
});

container.innerHTML = "";
thing.forEach(a => {
  container.appendChild(a);
});
