const http = require('http')
const path = require('path')
const fs = require('fs')

const Gun = require('gun')

const server = http.createServer(function(req, res) {
  if (Gun.serve(req, res)) {
    return
  } // filters gun requests!

  res.writeHead(404, {'Content-Type': 'text/plain'})
  res.end('Sorry. Page not found.')
})

const gun = Gun({
  file: 'data.json',
  web: server,
})

// start listening for requests
server.listen(8000)
