#! /usr/bin/env node
const fs = require('fs')
const path = require('path')

function getDirectories(srcpath) {
  return new Promise(resolve => {
    resolve(fs.readdirSync(srcpath).filter(file => fs.statSync(path.join(srcpath, file)).isDirectory()))
  })
}

function getFiles(srcpath) {
  return new Promise(resolve => {
    resolve(fs.readdirSync(srcpath).filter(file => fs.statSync(path.join(srcpath, file)).isFile()))
  })
}

// Go through each folder and check all files to see if there any any episodes
getDirectories('./').then(folders => folders.forEach(show => getFiles(`./${show}`).then(files => {
  const episodeRegex = new RegExp(`^(.+) - (S\\d{2}E\\d{2}) - (.+)\\.[mp4|avi|mkv]+$`)
  const episodes = files.filter(file => file.match(episodeRegex))
  if (!episodes.length) return
  episodes.forEach(episode => {
    fs.renameSync(`./${show}/${episode}`, `./${episode}`) // Move episode to root directory
    // Delete the .nfo and .jpg files, don't need that crap
	try {
		fs.unlinkSync(`./${show}/${episode.replace(/\.[mp4|avi|mkv]+$/, '.nfo')}`)
		// I don't generate thumbs anymore
		//fs.unlinkSync(`./${show}/${episode.replace(/\.[mp4|avi|mkv]+$/, '-thumb.jpg')}`)
	} catch (e) {
		console.warn("Error deleting nfo")
	}
  })
})))
