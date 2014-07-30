(function() {
  "use strict";
  window.ChatApp = Ember.Application.create();

  ChatApp.ApplicationAdapter = DS.FixtureAdapter.extend();

  ChatApp.socket = io.connect();

  ChatApp.Router.map(function() {
    this.resource('chat', {
      path: '/'
    });
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

  ChatApp.Chat = DS.Model.extend({
    message: DS.attr('string'),
    sendDate: DS.attr('date')
  });

  ChatApp.Chat.FIXTURES = [];

  ChatApp.ChatController = Ember.ArrayController.extend({
    actions: {
      sendMessage: function() {
        var date, msg;
        msg = this.get('message');
        if (!msg.trim()) {
          return;
        }
        console.log("send " + msg);
        date = new Date();
        ChatApp.socket.emit('chat:message', {
          msg: msg,
          date: date
        });
        this.set('message', '');
      }
    },
    gotMessage: function(data) {
      var chat;
      console.log(data);
      chat = this.get('store').createRecord('chat', {
        message: data.msg,
        sendDate: new Date(data.date)
      });
      chat.save();
    }
  });

  Ember.Handlebars.registerBoundHelper('format-date', function(date) {
    return moment(date).format('DD/MM HH:mm');
  });

}).call(this);
