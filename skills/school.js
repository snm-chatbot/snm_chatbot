module.exports = function(controller) {
    controller.hears('rozvrh', 'message_received,facebook_postback', function(bot, message) {
        bot.reply(message, 'Here you go! 👉 http://novamedia.ff.cuni.cz/studium/rozvrh-harmonogram-semestru/');
    });

    controller.hears('prax[ei]', 'message_received,facebook_postback', function(bot, message) {
        bot.reply(message, 'Vše o praxi se dočteš tady 👉 http://novamedia.ff.cuni.cz/studium/praxe/');
    });
};
