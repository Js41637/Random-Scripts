const WebSocket = require('ws')

const ws = new WebSocket('wss://steamdb.info/api/realtime/', ['steam-pics'])

ws.on('open', function(wot) {
  console.log('open', wot)
})

ws.on('message', function(data) {
  console.log('message', data)
})

ws.on('error', function(err) {
  console.log(err)
})
