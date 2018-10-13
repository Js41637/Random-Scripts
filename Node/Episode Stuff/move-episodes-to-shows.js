const fs = require('fs')
const ptn = require('parse-torrent-name')

const videos = []
const folders = []
const formatRegex = /.(mp4|avi|mkv)$/
const files = fs.readdirSync('./')

for (let file of files) {
  const fileStats = fs.statSync(file)

  if (fileStats.isDirectory()) {
    folders.push(file.toLowerCase())
    continue
  }

  if (!formatRegex.test(file)) continue
  videos.push(file)
}

for (let video of videos) {
  const videoInfo = ptn(video)
  const cleanShowTitle = videoInfo.title.replace(/\.$/, '')
  const year = videoInfo.year || ''
  const showTitle = `${cleanShowTitle} ${year ? `(${year})` : ''}`.trim().toLowerCase()
  
  if (folders.includes(showTitle)) {
    fs.renameSync(video, `./${showTitle}/${video}`)
  }
}