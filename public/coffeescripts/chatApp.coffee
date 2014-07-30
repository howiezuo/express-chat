"use strict"

# App
window.ChatApp = Ember.Application.create()

ChatApp.ApplicationAdapter = DS.FixtureAdapter.extend()

# socket.io
ChatApp.socket = io.connect()


# Routes
ChatApp.Router.map () ->
	@resource 'chat', path: '/'
	return
ChatApp.ChatRoute = Ember.Route.extend 
	model: () ->
		@store.find 'chat'
	setupController: (controller, model) ->
		controller.set 'model', model
		ChatApp.socket.on 'chat:message', (data) ->
			controller.gotMessage data
			return
		return


# Models
ChatApp.Chat = DS.Model.extend 
	message: DS.attr 'string'
	sendDate: DS.attr 'date'
ChatApp.Chat.FIXTURES = []


# Controllers
ChatApp.ChatController = Ember.ArrayController.extend
	actions:
		sendMessage: () ->
			msg = @get 'message'
			return if not msg.trim()

			console.log "send #{msg}"
			date = new Date()
			ChatApp.socket.emit 'chat:message', msg: msg, date: date
			@set 'message', ''
			return
	gotMessage:
		(data) ->
			console.log data
			chat = @get('store').createRecord 'chat',
				message: data.msg
				sendDate: new Date data.date
			chat.save()
			return


# Helper
Ember.Handlebars.registerBoundHelper 'format-date', (date) ->
	moment(date).format 'DD/MM HH:mm'
