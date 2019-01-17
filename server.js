const http = require('http')
const fs = require('fs')

const hostname = 'localhost'
const port = 3000

const text = 'Look at my shiny new web server!!'

const createStream = fs.createWriteStream('streams/output.txt')
createStream.write(text, 'UTF8')
createStream.end()
createStream.on('error', (err) => {
  if(err) {
    console.error(err.message)
    throw err
  }
})

createStream.on('finish', () => {
  const readStream = fs.createReadStream('streams/output.txt')
  readStream.setEncoding('UTF8')
  readStream.on('data', (chunk) => {
    let streamInput
    streamInput += chunk
  })

  readStream.on('error', (err) => {
    if (err) throw err;
  })
  const newInputStream = fs.createWriteStream('streams/input.txt')
  
  readStream.pipe(newInputStream)

})

const server = http.createServer((req, res) => {
  const streamSource = fs.createReadStream('streams/input.txt')
  
  res.writeHead(200, { 'Content-Type': 'text/html' })
  streamSource.pipe(res)
  
} )

server.listen(port, hostname, () => {
  console.log(`Server ${hostname} is listening on port ${port}`)
})