// ==UserScript==
// @name         [Steam] Column Friends List
// @version      1.0.0
// @description  Changes the friends list so its a column not a grid.
// @author       Js41637
// @include      /^https?:\/\/steamcommunity.com\/(id|profile)\/[\w]+\/friends$/
// @grant        none
// ==/UserScript==

var friendsList = document.querySelector('#friendListForm .profile_friends')
var friendsBlocks = friendsList.querySelectorAll('.friendBlock')

var sortedData = {
    "in-game": [],
    "online": [],
    "offline": []

}

var categoryNames = {
    "in-game": "In-Game",
    "online": "Online",
    "offline": "Offline"
}

friendsList.innerHTML = ""
friendsBlocks.forEach(friend => {
    var type = friend.classList[2]
    sortedData[type].push(friend)
})

Object.keys(sortedData).forEach(category => {
    if (!sortedData[category].length) return
    var container = document.createElement('div')
    container.id = category
    container.innerHTML = `<h2>${categoryNames[category]}</h2>`
    sortedData[category].forEach(item => {
        item.style.float = 'initial'
        item.style.width = 'initial'
        item.style.marginRight = '8px'
        container.appendChild(item)
    })
    friendsList.appendChild(container)
})
