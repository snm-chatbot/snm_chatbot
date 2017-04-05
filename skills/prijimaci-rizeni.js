var os = require('os');

module.exports = function(controller) {
  controller.hears(['kdy .* p[rř]ihl[aá][sš]k[au]'], 'message_received,facebook_postback', function(bot, message) {
      bot.reply(message, 'Přihlášku musíš poslat do 31. března! Tik tak ... :-D');
  });

  controller.hears(['kdy .* p[rř]ij[ií]ma[čc]ky'], 'message_received,facebook_postback', function(bot, message) {
      bot.reply(message, 'Přijimačky jsou 17. června v 9:00, tak nezaspi!');
  });

  controller.hears(['bod[uůy] .* test'], 'message_received,facebook_postback', function(bot, message) {
      bot.reply(message, 'Z testu je třeba 25 z 50 bodů aby ses dostal k ústní zkoušce.');
  });

  controller.hears(['uk[a]ázkov[yý] test', 'zkusit', 'nane[cč]isto'], 'message_received,facebook_postback', function(bot, message) {
      bot.reply(message, 'Zkusit si přijímačku můžeš tady: http://snmprijimacky.cz/testy/');
  });

  controller.hears(['kolik [cč]asu .* test', 'jak dlouho .* test'], 'message_received,facebook_postback', function(bot, message) {
      bot.reply(message, 'Na test je 1 hodina - dost času na to, abys stihl špatné odpovědi nahradit za dobré.');
      giphy.random('time', function (err, res) {
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
      bot.reply(message, gif);
  });

  controller.hears(['uk[a]ázkov[yý] test', 'zkusit', 'nane[cč]isto'], 'message_received,facebook_postback', function(bot, message) {
      bot.reply(message, 'Zkusit si přijímačku můžeš tady: http://snmprijimacky.cz/testy/');
  });
}

