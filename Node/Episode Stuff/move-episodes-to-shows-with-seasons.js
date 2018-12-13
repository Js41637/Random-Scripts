#! /usr/bin/env node
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
  const shortEpName = `${videoInfo.title} S${videoInfo.season}E${videoInfo.episode}`
  
  if (folders.includes(showTitle)) {
    const seasons = fs.readdirSync(`./${showTitle}`)
      .filter(folder => fs.statSync(`./${showTitle}/${folder}`).isDirectory())
      .filter(folder => folder.toLowerCase().startsWith('season'))
      .map(folder => +folder.split(' ')[1])

    if ('season' in videoInfo && seasons.includes(videoInfo.season)) {
      const seasonDir = `./${showTitle}/Season ${videoInfo.season}`
      const epPath = `${seasonDir}/${video}`

      if (fs.existsSync(seasonDir)) {
        if (fs.existsSync(epPath)) {
          console.warn(` -- ${shortEpName} already exists!!`)
          continue
        }

        console.log(` -- Moving ${shortEpName} to ${showTitle} Season ${videoInfo.season}`)
        fs.renameSync(video, `${seasonDir}/${video}`)
      } else {
        console.warn(` -- Found no matching season for ${shortEpName}!`)
      }
    } else {
      console.warn(` -- Couldn't detect season for ${shortEpName}`)
    }
  } else {
    console.warn(` -- Found no matching show for ${shortEpName}`)
  }
}