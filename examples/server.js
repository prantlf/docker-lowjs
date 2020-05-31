const http = require('http')
const fs = require('fs')

process.on('SIGINT', function () {
  console.log('exiting')
  process.exit(0)
})

const wwwPath = process.env.WWWPATH || '.'
function handleRequest (req, res) {
  const path = req.url === '/' ? '/index.html' : req.url
  console.log('streaming ' + wwwPath + path)
  var contentType
  if (path.endsWith('.png')) contentType = 'image/png'
  else if (path.endsWith('.jpg')) contentType = 'image/jpeg'
  else if (path.endsWith('.svg')) contentType = 'image/svg+xml'
  else if (path.endsWith('.css')) contentType = 'text/css'
  else if (path.endsWith('.js')) contentType = 'text/javascript'
  else if (path.endsWith('.htm')) contentType = 'text/html'
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
