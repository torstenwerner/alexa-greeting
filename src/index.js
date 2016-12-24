'use strict';
var Alexa = require("alexa-sdk");
var config = require('./config');

exports.handler = function(event, context, callback) {
    var alexa = Alexa.handler(event, context);
    alexa.registerHandlers(handlers);
    alexa.execute();
};

var handlers = {
    'LaunchRequest': function () {
        this.emit('SayHello');
    },
    'HelloIntent': function () {
        this.emit('SayHello')
    },
    'SayHello': function () {
        if (Object.keys(this.attributes).length === 0) {
            this.attributes['asking'] = true;
            this.emit(':ask', config.greeting, config.greetingRepeat);
      } else {
            this.emit('SayGoodbye');
        }
    },
    'AMAZON.YesIntent': function () {
        this.emit(':tell', config.yesResponse);
    },
    'AMAZON.NoIntent': function () {
        this.emit('SayGoodbye');
    },
    'SessionEndedRequest': function () {
        this.emit('SayGoodbye');
    },
    'SayGoodbye': function () {
        this.emit(':tell', config.noResponse);
    },
};