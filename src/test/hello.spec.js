'use strict'

const AWS = require('aws-sdk');
const assert = require('assert');
const config = require('../config');

function getBasePayload() {
    return {
        session: {
            new: false,
            sessionId: "amzn1.echo-api.session.[unique-value-here]",
            attributes: {
            },
            user: {
                userId: "amzn1.ask.account.[unique-value-here]"
            },
            application: {
                applicationId: "amzn1.ask.skill.[unique-value-here]"
            }
        },
        version: "1.0",
        request: {
            locale: "en-US",
            timestamp: "2016-10-27T21:06:28Z",
            type: "LaunchRequest",
            requestId: "amzn1.echo-api.request.[unique-value-here]"
        },
        context: {
            AudioPlayer: {
                playerActivity: "IDLE"
            },
            System: {
                device: {
                    supportedInterfaces: {
                        AudioPlayer: {}
                    }
                },
                application: {
                    applicationId: "amzn1.ask.skill.[unique-value-here]"
                },
                user: {
                    userId: "amzn1.ask.account.[unique-value-here]"
                }
            }
        }
    }
}

const lambda = new AWS.Lambda({
    region: 'eu-west-1'
});

function launchCheck(err, data) {
    assert.ifError(err);
    assert.equal(data.StatusCode, 200);
    const payload = JSON.parse(data.Payload);
    assert.equal(payload.response.outputSpeech.type, 'SSML');
    const outputSsml = payload.response.outputSpeech.ssml;
    assert(outputSsml.indexOf(config.greeting) >= 0);
    assert.equal(payload.response.shouldEndSession, false);
    assert(payload.sessionAttributes.asking);
};

describe('the LaunchRequest', function () {
    this.timeout(10000);

    it('should greet the user', function (done) {
        const params = {
            FunctionName: 'HalloGast',
            Payload: JSON.stringify(getBasePayload())
        };
        lambda.invoke(params, function (err, data) {
            launchCheck(err, data);
            done();
        });
    });
});

describe('the HelloIntent', function () {
    this.timeout(10000);

    it('should greet the user on first call', function (done) {
        const payload = getBasePayload();
        payload.request.type = 'IntentRequest';
        payload.request.intent = {
            name: 'HelloIntent'
        };
        const params = {
            FunctionName: 'HalloGast',
            Payload: JSON.stringify(payload)
        };
        lambda.invoke(params, function (err, data) {
            launchCheck(err, data);
            done();
        });
    });

    it('should say goodbye on second call', function (done) {
        const payload = getBasePayload();
        payload.session.new = false;
        payload.session.attributes.asking = true;
        payload.request.type = 'IntentRequest';
        payload.request.intent = {
            name: 'HelloIntent'
        };
        const params = {
            FunctionName: 'HalloGast',
            Payload: JSON.stringify(payload)
        };
        lambda.invoke(params, function (err, data) {
            assert.ifError(err);
            assert.equal(data.StatusCode, 200);
            const payload = JSON.parse(data.Payload);
            assert.equal(payload.response.outputSpeech.type, 'SSML');
            const outputSsml = payload.response.outputSpeech.ssml;
            assert(outputSsml.indexOf(config.noResponse) >= 0);
            assert.equal(payload.response.shouldEndSession, true);
            done();
        });
    });

});

describe('the AMAZON.YesIntent', function () {
    this.timeout(10000);

    it('should say a longer goodbye', function (done) {
        const payload = getBasePayload();
        payload.request.type = 'IntentRequest';
        payload.request.intent = {
            name: 'AMAZON.YesIntent'
        };
        const params = {
            FunctionName: 'HalloGast',
            Payload: JSON.stringify(payload)
        };
        lambda.invoke(params, function (err, data) {
            assert.ifError(err);
            assert.equal(data.StatusCode, 200);
            const payload = JSON.parse(data.Payload);
            assert.equal(payload.response.outputSpeech.type, 'SSML');
            const outputSsml = payload.response.outputSpeech.ssml;
            assert(outputSsml.indexOf(config.yesResponse) >= 0);
            assert.equal(payload.response.shouldEndSession, true);
            done();
        });
    });

});

describe('the AMAZON.NoIntent', function () {
    this.timeout(10000);

    it('should say goodbye', function (done) {
        const payload = getBasePayload();
        payload.request.type = 'IntentRequest';
        payload.request.intent = {
            name: 'AMAZON.YesIntent'
        };
        const params = {
            FunctionName: 'HalloGast',
            Payload: JSON.stringify(payload)
        };
        lambda.invoke(params, function (err, data) {
            assert.ifError(err);
            assert.equal(data.StatusCode, 200);
            const payload = JSON.parse(data.Payload);
            assert.equal(payload.response.outputSpeech.type, 'SSML');
            const outputSsml = payload.response.outputSpeech.ssml;
            assert(outputSsml.indexOf(config.noResponse) >= 0);
            assert.equal(payload.response.shouldEndSession, true);
            done();
        });
    });

});

describe('the SessionEndedRequest', function () {
    this.timeout(10000);

    it('should be successful', function (done) {
        const payload = getBasePayload();
        payload.request.type = 'SessionEndedRequest';
        const params = {
            FunctionName: 'HalloGast',
            Payload: JSON.stringify(payload)
        };
        lambda.invoke(params, function (err, data) {
            assert.ifError(err);
            assert.equal(data.StatusCode, 200);
            done();
        });
    });

});
