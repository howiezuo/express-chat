sio = require "socket.io"

socketio = (server) ->
	io = sio.listen server
	io.on 'connection', (socket) ->
		console.log 'connected'
		socket.on 'disconnected', ->
			console.log 'disconnected'
			return
		socket.on 'chat:message', (data) ->
			console.log "message: #{data.msg} at #{data.date}"
			io.emit 'chat:message', data
			return
		return
	return

module.exports = socketio