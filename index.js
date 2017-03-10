
var APP_ID = "amzn1.echo-sdk-ams.app.8aa45f78-0dea-4db6-af50-930259e6eefc";

var fs = require('fs');
var QUOTE_RESPONSE = fs.readFileSync('QUOTE.txt').toString().split("\n");
var NOTE_RESPONSE = fs.readFileSync('NOTE.txt').toString().split("\n");
var MESSAGE_RESPONSE = fs.readFileSync('MESSAGE.txt').toString().split("\n");
var SECRET_RESPONSE = fs.readFileSync('SECRET.txt').toString().split("\n");

var AlexaSkill = require('./AlexaSkill');
var https = require('https');

var LoveNote = function () {
    AlexaSkill.call(this, APP_ID);
};

// Extend AlexaSkill
LoveNote.prototype = Object.create(AlexaSkill.prototype);
LoveNote.prototype.constructor = LoveNote;
LoveNote.prototype.eventHandlers.onLaunch = function (launchRequest, session, response) {
    console.log("LoveNote onLaunch requestId: " + launchRequest.requestId + ", sessionId: " + session.sessionId);
    handleLoveRequest(response, "help");
};

LoveNote.prototype.intentHandlers = {
    "NoteIntent": function (intent, session, response) {
        var gest = intent.slots.gestures;
        var gestName;
        if (gest && gest.value){
            gestName = gest.value.toLowerCase();
        }
        handleLoveRequest(response, gestName);
    }
};

function handleLoveRequest(response, gestName) {
    var loveIndex;
    var loveResp;

    switch (gestName)
    {
        case "yoda":
            loveIndex = Math.floor(Math.random() * QUOTE_RESPONSE.length);
            loveResp = QUOTE_RESPONSE[loveIndex];
            var escapedSpaces = loveResp.split(' ').join('+');
            // var qs = require("querystring");
            // var urlEncode = loveResp.qs (loveResp);
            var options = {
              hostname: 'yoda.p.mashape.com',
              port: 443,
              path: '/yoda?sentence=' + escapedSpaces,
              // path: '/yoda?sentence=' + urlEncode,
              method: 'GET',
              headers: {
                'X-Mashape-Key': 'kB5cbGpOgJmsha1pkWLG59b9O3vMp1L0cxEjsn2nom1AKwVrcT',
                'Accept': 'text/plain'
              }
            };

            var req = https.request(options, function (res) {
              console.log('statusCode: ', res.statusCode);
              console.log('headers: ', res.headers);

              res.on('data', function (d) {
                console.log(d.toString('utf8'));
				console.log("Yoda Reply.");
				response.tellWithCard(d.toString('utf8'), "LoveNote - " + gestName, d.toString('utf8'));
              });
            });
            req.end();

            req.on('error', function (e) {
              console.error(e);
              console.log("Yoda Reply.");
				response.tellWithCard(loveResp, "LoveNote - " + gestName, loveResp);
            });
            break;
		case "quote":
            loveIndex = Math.floor(Math.random() * QUOTE_RESPONSE.length);
            loveResp = QUOTE_RESPONSE[loveIndex];
			break;	
        case "note":
            loveIndex = Math.floor(Math.random() * NOTE_RESPONSE.length);
            loveResp = NOTE_RESPONSE[loveIndex];
            break;
        case "message":
            loveIndex = Math.floor(Math.random() * MESSAGE_RESPONSE.length);
            loveResp = MESSAGE_RESPONSE[loveIndex];
            break;
        case "secret":
            loveIndex = Math.floor(Math.random() * SECRET_RESPONSE.length);
            loveResp = SECRET_RESPONSE[loveIndex];
            break;
        case "help":
            loveResp = "I know about love messages, notes, and quotes.  I might even know some secrets.  Do, or do not ask, there is no try.";
            break;
        default:
            loveResp = "I know about love messages, notes, and quotes... but I do kinda like " + gestName;
            break;
    }
	
	if (gestName != "yoda")
	{
		console.log("None Yoda Reply.");
		response.tellWithCard(loveResp, "LoveNote - " + gestName, loveResp);
	}
}

// Create the handler that responds to the Alexa Request.
exports.handler = function (event, context) {
    var loveNote = new LoveNote();
    loveNote.execute(event, context);
};

