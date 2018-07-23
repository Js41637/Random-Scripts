const fs = require('fs')
const http = require('http')

const searchApi = 'https://steamcommunity.com/actions/SearchApps'
const detailsApi = 'https://store.steampowered.com/api/appdetails?filters=categories&appids='

let titlesFile
try {
  titlesFile = fs.readFileSync('./games.txt', 'utf8')
} catch (e) {
  console.error("Couldn't find games.txt file??")
  process.exit()
}

const titles = titlesFile.split('\n').filter(Boolean)
if (titles.length === 0) {
  console.error('File is empty??')
  process.exit()
}

function processTitles(array, fn) {
  const results = []
  let i = 1
  return array.reduce((p, item) => {
      return p.then(() => {
        return fn(item).then((data) => {
          console.log(` -- [${i}/${array.length}]: Fetched ${item}`)
          i++
          results.push(data)
          return results
        })
      })
  }, Promise.resolve())
}

const searchForTitle = title => _http(`${searchApi}/${title.trim()}`).then(data => {
  if (!data[0]) return [title, undefined]
  const id = data[0].appid
  return _http(`${detailsApi}${id}`).then(categories => {
    if (!categories) return [title, data[0]]
    const categoryIds = (categories[id] && categories[id].data && categories[id].data.categories ? categories[id].data.categories : []).map(c => c.id)
    if (categoryIds.includes(29)) data[0].cards = true
    return [title, data[0]]
  })
})

const _http = url => new Promise(resolve => http.get(url, res => {
  res.setEncoding("utf8")
  let rawData = ''
  res.on('data', (chunk) => { rawData += chunk })
  res.on("end", () => resolve(JSON.parse(rawData)))
}))

console.log('Processing', titles.length, 'titles')
processTitles(titles, searchForTitle).then(matches => {
  const out = ['original_title,name,store_url,has_cards']
  console.log('Matches:')
  matches.forEach(match => {
    const [ title, data ] = match
    console.log(data ? ` -- ${title}\n\tFound "${data.name}" (${data.appid}) | Cards: ${!!data.cards}` : ` -- ${title}\n\tFound no matches`)

    const url = data ? `https://store.steampowered.com/app/${data.appid}` : ''
    out.push(`"${title.trim()}","${data ? data.name : ''}",${url},${data ? !!data.cards : false}`)
  })

  fs.writeFileSync('./games.csv', out.join('\n'))
})