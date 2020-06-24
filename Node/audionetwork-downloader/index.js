const needle = require('needle')
const fs = require('fs')
const _ = require('lodash')
const path = require('path')
const slugify = require('slugify')

async function main() {
  const urlOrId = process.argv[2]
  const output = process.argv[3]

  if (!urlOrId) {
    console.error('You must provide a track ID or a URL to a track.')
    return
  }

  if (!output) {
    console.error('You must provide a directory.')
    return
  }

  let trackId = +urlOrId
  if (!_.isFinite(trackId)) {
    const idMatch = urlOrId.match(/.*?_(\d+)/)
    trackId = +idMatch[1]
  }

  if (!_.isFinite(trackId)) {
    console.error('Unable to detect track ID! Either enter the ID or the URL of the track!')
    return
  }

  const trackInfo = await getTrackInfo(trackId)
  if (!trackInfo) {
    return
  }

  console.log(`Got track information!\n - Title: ${trackInfo.title}\n - Description: ${trackInfo.description}\n - Mixes: ${trackInfo.mixCount}`)

  const mixes = await getMixes(trackId)
  if (!mixes) {
    return
  }

  const titleSlug = slugify(trackInfo.title, { lower: true })
  const outputDir = path.join(output, titleSlug)

  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true })
  }

  for (const mix of mixes) {
    await downloadMix(mix, outputDir)
  }
}

async function getTrackInfo(trackId) {
  const response = await needle('get', `https://musicapi.audionetwork.com/tracks/${trackId}`, {}, {
    headers: {
      'x-api-key': 'TTqwdGFMje3EQ6QkzqnOC1KPSRGEQhfp9TLySucT'
    }
  })

  if (response.statusCode !== 200 || !response.body || !response.body.id) {
    console.error(`Error loading track info from audionetwork API! StatusCode=${response.statusCode} Message=${response.body.message || response.body}`)
    return
  }

  return response.body
}

async function getMixes(trackId) {
  const response = await needle('get', `https://musicapi.audionetwork.com/tracks/${trackId}/mixes`, {}, {
    headers: {
      'x-api-key': 'TTqwdGFMje3EQ6QkzqnOC1KPSRGEQhfp9TLySucT'
    }
  })

  if (response.statusCode !== 200) {
    console.error(`Error loading mixes from audionetwork API! StatusCode=${response.statusCode} Message=${response.body.message}`)
    return
  }

  if (Array.isArray(response.body)) {
    if (response.body.length === 0) {
      console.error('Got no mixes returned for track. Invalid track id?')
      return
    }

    return response.body
  } else {
    console.error('Got unknown response from API.')
    return
  }
}

async function downloadMix(mix, outputDir) {
  return new Promise(async resolve => {
    console.log(`Downloading mix:\n - Title: ${mix.title}\n - Description: ${mix.description}\n - URL: ${mix.previewUrl}`)

    const response = await needle('head', mix.previewUrl)
    if (response.statusCode !== 200) {
      console.error(`HEAD request returned ${response.statusCode}. File doesn't exist??`)
      return resolve()
    }

    const fileName = `${slugify(mix.title, { lower: true })}_${path.basename(mix.previewUrl)}`
    const out = fs.createWriteStream(path.join(outputDir, fileName))

    needle
      .get(mix.previewUrl)
      .pipe(out)
      .on('finish', () => {
        console.log(' -- Finished')
        return resolve()
      })
      .on('error', err => {
        console.error(' -- Error downloading!', err)
        return resolve()
      })
  })
}

try {
  main()
} catch (err) {
  // ignored
}
