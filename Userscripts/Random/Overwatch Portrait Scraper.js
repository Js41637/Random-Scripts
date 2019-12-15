const url = 'https://d1u1mce87gyfbn.cloudfront.net/game/skins/'
const numbers = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 'A', 'B', 'C', 'D', 'E', 'F']

// Goes through 0x0250000000000 + index (9) + small numbers (01, 02, 03... FD, FE, FF)
// 0x0250000000000|9|00 > 0x0250000000000|9|FF
const start = '0x0250000000002'

let index = '5'

let container = document.createElement('div')
container.id = "border_cont"
container = document.body.appendChild(container)

var doShit = (index2) => {
  numbers.forEach((num) => {
    let currentNumber = start + index + index2 + num
    let imgUrl = url + currentNumber + '.jpg'
    makeRequest(imgUrl).then(() => {
      let cont = document.createElement('div')
      let img = document.createElement('img')
      img.src = imgUrl

      let thing = container.appendChild(cont)
      thing.appendChild(img)
      thing.innerHTML = thing.innerHTML + currentNumber
    }).catch(
      console.info("Failed fetching")
    )
  })
}

offset = 0
numbers.forEach(number => {
  setTimeout(() => {
    console.info("~~ STARTING", start + index + number)
    doShit(number)
  }, 2000 + offset);
  offset += 2000
})

var makeRequest = what => {
  return new Promise((resolve, reject) => {
    let xhr = new XMLHttpRequest()

    xhr.addEventListener("readystatechange", function() {
      if(this.readyState === 4) {
        if(this.status === 403) return reject()
        else if(this.status === 0) return resolve()
        else if(this.status === 200) return resolve()
        else {
          console.info("Got unknown response", this.status)
        }
      }
    })

    xhr.open("GET", what)
    xhr.send()
  })
}

var css = `
#border_cont {
  display: flex;
  flex-wrap: wrap;
}
#border_cont div {
  text-align: center;
  border-bottom: 2px solid black;
  display: flex;
  flex-direction: column;
  min-height: 300px;
  justify-content: space-between;
}
#border_cont div img:nth-of-type(2) {
  margin-top: -120px;
}
`
var style = document.createElement('style')
style.innerHTML = css
document.head.appendChild(style)
