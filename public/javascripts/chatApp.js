'use strict';

// App
window.ChatApp = Ember.Application.create();

ChatApp.ApplicationAdapter = DS.FixtureAdapter.extend();


// socket.io
ChatApp.socket = io.connect();

// Routes
ChatApp.Router.map(function() {
    this.resource('chat', {path: '/'});
});
ChatApp.ChatRoute = Ember.Route.extend({
    model: function() {
        return this.store.find('chat');
    },
    setupController: function(controller, model) {
        controller.set('model', model);
        ChatApp.socket.on('chat:message', function(data) {
            controller.gotMessage(data);
        });
    }
});


// Model
ChatApp.Chat = DS.Model.extend({
    message: DS.attr('string'),
    sendDate: DS.attr('date')
});
ChatApp.Chat.FIXTURES = [
// {
//     id: 1,
//     message: 'AAA'
// },
// {
//     id: 2,
//     message: 'BBB'
// },
// {
//     id: 3,
//     message: 'CCC'
// }
];


// Controller
ChatApp.ChatController = Ember.ArrayController.extend({
    actions: {
        sendMessage: function() {
            var msg = this.get('message');
            if (!msg.trim()) return;

            console.log('send:' + msg);
            var date = new Date();
            ChatApp.socket.emit('chat:message', {msg: msg, date: date});
            this.set('message', '');
        }
    },
    gotMessage: function(data) {
        console.log(data);
        var chat = this.get('store').createRecord('chat', {
            message: data.msg,
            sendDate: new Date(data.date)
        });
        chat.save();
    }
});


// Helper
Ember.Handlebars.registerBoundHelper('format-date', function(date) {
    return moment(date).format('DD/MM HH:mm');
});
