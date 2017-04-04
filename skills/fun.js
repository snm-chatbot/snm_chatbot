var giphy = require('giphy-api')();

module.exports = function(controller) {
    controller.hears(['^giphy (.*)', '^gif (.*)'], 'message_received', function (bot, message) {
        var gif = message.match[1];
        bot.startTyping(message, function () {
            giphy.random(gif, function (err, res) {
                var gifmessage = 'Tak to fakt nevím, sorry jako.';
                if (res.data.id) {
                    gifmessage = {
                        'attachment': {
                            'type': 'image',
                            'payload': {
                                'url': res.data.fixed_height_downsampled_url
                            }
                        }
                    };
                }
                bot.reply(message, gifmessage);
            });
        });
    });
};
