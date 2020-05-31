const http = require('http')
const https = require('https')
const tls = require('tls')
const ws = require('ws')
const fs = require('fs')

process.on('SIGINT', function () {
  console.log('exiting')
  process.exit(0)
})

const wwwPath = process.env.WWWPATH || 'www'
function handleRequest (req, res) {
  const path = req.url === '/' ? '/index.html' : req.url
  console.log('streaming ' + wwwPath + path)
  var contentType
  if (path.endsWith('.png')) contentType = 'image/png'
  else if (path.endsWith('.css')) contentType = 'text/css'
  else if (path.endsWith('.js')) contentType = 'text/javascript'
  else if (path.endsWith('.html')) contentType = 'text/html'
  else contentType = 'text/plain'
  res.setHeader('Content-Type', contentType)
  const stream = fs.createReadStream(wwwPath + path)
  stream
    .on('error', function (err) {
      res.statusCode = 404
      res.end(err.message)
    })
    .pipe(res)
}

const port = parseInt(process.env.PORT || 80)
const server = http
  .createServer(handleRequest)
  .listen(port, function (err) {
    if (!err) console.log('listening on http://localhost:' + server.address().port)
  })

const securePort = parseInt(process.env.SECPORT || 443)
const key = process.env.SECKEY || 'server.key'
const cert = process.env.SECCERT || 'server.crt'
const secureServer = https
  .createServer({ key: fs.readFileSync(key), cert: fs.readFileSync(cert) }, handleRequest)
  .listen(securePort, function (err) {
    if (!err) console.log('listening on https://localhost:' + secureServer.address().port)
  })

const socketServer = new ws.Server({ noServer: true })
socketServer.on('connection', function (socket) {
  socket.on('message', function (data) {
    console.log('broadcasting ' + data)
    socketServer.clients.forEach(function (client) {
      if (client !== socket && client.readyState === WebSockets.OPEN) client.send(data)
    })
  })
})

function upgradeToWebSocket (req, socket, head) {
  if (req.url === '/chat') {
    console.log('connected to chat')
    socketServer.handleUpgrade(req, socket, head, function (socket) {
      socketServer.emit('connection', socket, req)
    })
  } else {
    socket.destroy()
  }
}

server.on('upgrade', upgradeToWebSocket)
secureServer.on('upgrade', upgradeToWebSocket)
