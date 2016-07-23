var numbers = [0,1,2,3,4,5,6,7,8,9,'A','B','C','D','E','F']
var start = '0x0250000000000'
var url = 'https://blzgdapipro-a.akamaihd.net/game/playerlevelrewards/'
var index = 9
var index2 = 0

function doShit() {
    numbers.forEach(function(num) {
        console.log(start + index + index2 + num)
        var cont = document.createElement('div')
        var img = document.createElement('img')
        var img2 = document.createElement('img')
        img.src = url + start + index + index2 + num + '_Border.png'
        img2.src = url + start + index + index2 + num + '_Rank.png'
        var thing = document.body.appendChild(cont)
        thing.appendChild(img)
        thing.appendChild(img2)
        thing.innerHTML = thing.innerHTML + (start + index + index2 + num)
    })
    index2++
}

for (var i = 0; i < 10; i++) {
    doShit()
}
