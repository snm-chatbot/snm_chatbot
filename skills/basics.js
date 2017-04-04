var os = require('os');

module.exports = function(controller) {

    controller.hears(['^ahoj', '^čau', '^cau', '^zdravim', '^nazdar', '^hoj'], 'message_received,facebook_postback', function(bot, message) {
        controller.storage.users.get(message.user, function(err, user) {
            if (user && user.name) {
                bot.reply(message, 'Ahoj ' + user.name + '!!');
            } else {
                bot.reply(message, 'Ahoj.');
            }
        });
    });

    controller.hears(['jak je?', 'jak se m[aá][sš]', 'jak se da[rř][ií]', '^jaksemas'], 'message_received', function(bot,message) {
        var askUser = function(err, convo) {
            convo.ask('U mě dobrý. Co u tebe?', function(response, convo) {
                convo.say('Cool cool cool.');
                convo.next();
            });
        };

        bot.startConversation(message, askUser);
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
                            if (convo.status === 'completed') {
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

    /* Utility function to format uptime */
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

        uptime = parseInt(uptime) + ' ' + unit;
        return uptime;
    }

};
