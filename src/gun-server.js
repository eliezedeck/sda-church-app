// import the native http module
const http = require('http')
const path = require('path')
const fs = require('fs')

// import gun
const Gun = require('gun')

const server = http.createServer(function(req, res) {
  if (Gun.serve(req, res)) {
    return
  } // filters gun requests!

  fs.createReadStream(path.join(__dirname, req.url)).on('error', function() { // static files!
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.end(fs.readFileSync(path.join(__dirname, 'index.html'))); // or default to index
  }).pipe(res); // stream
});

// start listening for requests
server.listen(8000)
