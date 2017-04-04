var giphy = require('giphy-api')();

module.exports = function(controller) {
    controller.on('message_received', function(bot, message) {
        bot.startTyping(message, function () {
            giphy.random('idk', function (err, res) {
                if (res.data.id) {
                    var gif = {
                        'attachment': {
                            'type': 'image',
                            'payload': {
                                'url': res.data.fixed_height_downsampled_url
                            }
                        }
                    };
                }
                var responses = [
                    'Teď ti moc nerozumim.',
                    'Cože??',
                    'Znovu a lépe.',
                    'WTF.',
                    'tlhIngan Hol vIjatlhlaHbe\'.', //Neumím hovořit klingonsky. :D
                ];
                var response = responses[Math.floor(Math.random() * responses.length)];
                bot.reply(message, response + ' Zkus: jak se jmenuju, ahoj, kdo jsi nebo říkej mi (*)');
                bot.reply(message, gif);
                return false;
            });
        });
    });
};
