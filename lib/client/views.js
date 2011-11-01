var $ = require('jquery'),
    Backbone = require('backbone');

exports.HomePage = Backbone.View.extend({
    /*el: $('#home'),
    events: {
        'click #home .host': 'hostGame',
        'click #home .join': 'joinGame'
    },*/
    initialize: function () {
        //this.delegateEvents();
    },
    hostGame: function () {
        console.log('host game');
    },
    joinGame: function () {
        console.log('join game');
    }
});
