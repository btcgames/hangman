http = require('http')
io = require('socket.io')
express = require('express')


# TODO: package the server into a class

#app = express()
#server = http.createServer(app)
#io = io.listen(server)

#server.listen(8080)

#app.use((req, res, next) ->
#  if (/\/public\/hidden\/*/.test(req.path))
#    res.send(404, "Not Found")
#  next()
#)
#app.use(express.static(__dirname + "/../public"))
#app.use(express.static(__dirname + "/views"))
#app.use(express.directory(__dirname + "/"));
#app.get('/', (req, res) -> res.sendfile(__dirname + '/views/index.html'))

#io.sockets.on('connection', (socket) ->
#  socket.emit('news', { hello: 'world' })
#  socket.on('my other event', (data) -> console.log(data))
#)


Server = require('./socket').Server

server = new Server process.env.PORT || 8080

if not module.parent
  server.start (done) ->
    console.log "Server successfull started"

module.exports.start = (done)->
  server.start () ->
    console.log "Server successfull started"
    done()

module.exports.reconfigure = (done)->
  done()

module.exports.stop = (done)->
  server.stop done