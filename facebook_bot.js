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


controller.api.messenger_profile.greeting('Hello! I\'m a Botkit bot!');
controller.api.messenger_profile.get_started('sample_get_started_payload');
controller.api.messenger_profile.menu([{
    'locale': 'default',
    'composer_input_disabled': true,
    'call_to_actions': [
        {
            'title': 'My Skills',
            'type': 'nested',
            'call_to_actions': [
                {
                    'title': 'Hello',
                    'type': 'postback',
                    'payload': 'Hello'
                },
                {
                    'title': 'Hi',
                    'type': 'postback',
                    'payload': 'Hi'
                }
            ]
        },
        {
            'type': 'web_url',
            'title': 'Botkit Docs',
            'url': 'https://github.com/howdyai/botkit/blob/master/readme-facebook.md',
            'webview_height_ratio': 'full'
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
controller.hears(['^ahoj', '^čau', '^cau', '^zdravim', '^nazdar', '^hoj'], 'message_received,facebook_postback', function(bot, message) {
    controller.storage.users.get(message.user, function(err, user) {
        if (user && user.name) {
            bot.reply(message, 'Ahoj ' + user.name + '!!');
        } else {
            bot.reply(message, 'Ahoj.');
        }
    });
});

controller.hears(['^hi', '^hello', 'how are you'], 'message_received,facebook_postback', function(bot, message) {
    bot.reply(message, 'Mluv prosimtě česky, jo?');
});

controller.hears(['[rř][ií]kej mi (.*)', 'jmenuj[ui] se (.*)'], 'message_received', function(bot, message) {
    var name = message.match[1];
    controller.storage.users.get(message.user, function(err, user) {
        if (!user) {
            user = {
                id: message.user,
            };
        }
        user.name = name;
        controller.storage.users.save(user, function(err, id) {
            bot.reply(message, 'Jasně, budu ti říkat ' + user.name);
        });
    });
});

controller.hears(['jak se jmenuj[ui]', 'who am i'], 'message_received', function(bot, message) {
    controller.storage.users.get(message.user, function(err, user) {
        if (user && user.name) {
            bot.reply(message, 'Jsi ' + user.name);
        } else {
            bot.startConversation(message, function(err, convo) {
                if (!err) {
                    convo.say('To přece ještě nevim!');
                    convo.ask('Jak ti mám říkat?', function(response, convo) {
                        convo.ask('Chceš abych ti říkal `' + response.text + '`?', [
                            {
                                pattern: 'ano',
                                callback: function(response, convo) {
                                    // since no further messages are queued after this,
                                    // the conversation will end naturally with status == 'completed'
                                    convo.next();
                                }
                            },
                            {
                                pattern: 'ne',
                                callback: function(response, convo) {
                                    // stop the conversation. this will cause it to end with status == 'stopped'
                                    convo.stop();
                                }
                            },
                            {
                                default: true,
                                callback: function(response, convo) {
                                    convo.repeat();
                                    convo.next();
                                }
                            }
                        ]);

                        convo.next();

                    }, {'key': 'nickname'}); // store the results in a field called nickname

                    convo.on('end', function(convo) {
                        if (convo.status == 'completed') {
                            bot.reply(message, 'OK! Budu si to pamatovat.');

                            controller.storage.users.get(message.user, function(err, user) {
                                if (!user) {
                                    user = {
                                        id: message.user,
                                    };
                                }
                                user.name = convo.extractResponse('nickname');
                                controller.storage.users.save(user, function(err, id) {
                                    bot.reply(message, 'Jasan, budu ti říkat ' + user.name);
                                });
                            });



                        } else {
                            // this happens if the conversation ended prematurely for some reason
                            bot.reply(message, 'OK, nevadí!');
                        }
                    });
                }
            });
        }
    });
});

controller.hears(['shutdown'], 'message_received', function(bot, message) {

    bot.startConversation(message, function(err, convo) {

        convo.ask('Opravdu?', [
            {
                pattern: bot.utterances.yes,
                callback: function(response, convo) {
                    convo.say('Ahoj!');
                    convo.next();
                    setTimeout(function() {
                        process.exit();
                    }, 3000);
                }
            },
        {
            pattern: bot.utterances.no,
            default: true,
            callback: function(response, convo) {
                convo.say('*Phew!*');
                convo.next();
            }
        }
        ]);
    });
});


controller.hears(['uptime', 'p[rř]edstav se', 'kdo jsi', 'jak se jmenuje[sš]'], 'message_received',
    function(bot, message) {

        var hostname = os.hostname();
        var uptime = formatUptime(process.uptime());

        bot.reply(message,
            ':|] Jsem bot a běžím už ' + uptime + ' na ' + hostname + '.');
    });



controller.on('message_received', function(bot, message) {
    bot.reply(message, 'Zkus: jak se jmenuju, ahoj, kdo jsi nebo říkej mi (*)');
    return false;
});


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
    if (uptime != 1) {
        unit = unit + 's';
    }

    uptime = uptime + ' ' + unit;
    return uptime;
}
