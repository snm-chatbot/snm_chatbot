require('dotenv').config()

if (!process.env.page_token) {
    console.log('Error: Specify page_token in environment');
    process.exit(1);
}

if (!process.env.verify_token) {
    console.log('Error: Specify verify_token in environment');
    process.exit(1);
}

if (!process.env.app_secret) {
    console.log('Error: Specify app_secret in environment');
    process.exit(1);
}

var Botkit = require('./lib/Botkit.js');
var os = require('os');
var commandLineArgs = require('command-line-args');
var localtunnel = require('localtunnel');

const ops = commandLineArgs([
      {name: 'lt', alias: 'l', args: 1, description: 'Use localtunnel.me to make your bot available on the web.',
      type: Boolean, defaultValue: false},
      {name: 'ltsubdomain', alias: 's', args: 1,
      description: 'Custom subdomain for the localtunnel.me URL. This option can only be used together with --lt.',
      type: String, defaultValue: null},
   ]);

if (ops.lt === false && ops.ltsubdomain !== null) {
    console.log('error: --ltsubdomain can only be used together with --lt.');
    process.exit();
}

var controller = Botkit.facebookbot({
    debug: true,
    log: true,
    access_token: process.env.page_token,
    verify_token: process.env.verify_token,
    app_secret: process.env.app_secret,
    validate_requests: true, // Refuse any requests that don't come from FB on your receive webhook, must provide FB_APP_SECRET in environment variables
    require_delivery: true,
});

var bot = controller.spawn({
});

controller.setupWebserver(process.env.PORT || 3000, function(err, webserver) {
    controller.createWebhookEndpoints(webserver, bot, function() {
        console.log('ONLINE!');
        if (ops.lt) {
            var tunnel = localtunnel(process.env.PORT || 3000, {subdomain: ops.ltsubdomain}, function(err, tunnel) {
                if (err) {
                    console.log(err);
                    process.exit();
                }
                console.log('Your bot is available on the web at the following URL: ' + tunnel.url + '/facebook/receive');
            });

            tunnel.on('close', function() {
                console.log('Your bot is no longer available on the web at the localtunnnel.me URL.');
                process.exit();
            });
        }
    });
});


controller.api.messenger_profile.greeting('Ahoj! Já jsem Lev Manovich!');
controller.api.messenger_profile.get_started('sample_get_started_payload');
controller.api.messenger_profile.menu([{
    'locale': 'default',
    'composer_input_disabled': true,
    'call_to_actions': [
        {
            'title': 'Co umím?',
            'type': 'nested',
            'call_to_actions': [
                {
                    'title': 'Ahoj',
                    'type': 'postback',
                    'payload': 'ahoj'
                },
                {
                    'title': 'Jaký je rozvrh?',
                    'type': 'postback',
                    'payload': 'rozvrh'
                },
                {
                    'title': 'Jaký je harmonogram?',
                    'type': 'postback',
                    'payload': 'harmonogram'
                },
                {
                    'title': 'Informace o praxi',
                    'type': 'postback',
                    'payload': 'praxe'
                }
            ]
        }
    ]
},
    {
        'locale': 'zh_CN',
        'composer_input_disabled': false
    }
]);

///////////////////////////////
// OUR CODEBASE ///////////////
///////////////////////////////

///////////////////////////////
// START OF THE CONVERSATION //
///////////////////////////////

// BASIC
// Always first
require('./skills/basics')(controller);

// PROCEDURAL
require('./skills/harmonogram')(controller);
require('./skills/school')(controller);

// GIFS
// giphy, gif
require('./skills/fun')(controller);

// FALLBACK
// Always last
require('./skills/fallback')(controller);

function formatUptime(uptime) {
    var unit = 'second';
    if (uptime > 60) {
        uptime = uptime / 60;
        unit = 'minute';
    }
    if (uptime > 60) {
        uptime = uptime / 60;
        unit = 'hour';
    }
    if (uptime !== 1) {
        unit = unit + 's';
    }

    uptime = uptime + ' ' + unit;
    return uptime;
}
