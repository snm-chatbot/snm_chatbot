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

  controller.hears(['kolik stoj[ií] .* p[rř]ihl[aá][sš]ka', 'za kolik je p[rř]ihl[aá][sš]ka', 'cena .* p[rř]ihl[aá]šk[ya]'], 'message_received,facebook_postback', function(bot, message) {
      var question = function(err, convo) {
          convo.ask('500Kč. A víš co ještě stojí 500Kč?', function(response, convo) {
              convo.say('17 piv. To je ta přihláška lepší, ne?');
              convo.next();
          });
      };

      bot.startConversation(message, question);
  });

  controller.hears(['[uú]stn[íi]'], 'message_received,facebook_postback', function(bot, message) {
      bot.reply(message, 'Ústní kolo vypadá asi méně eroticky, než si myslíš. Musíš si připravit literaturu, diplomku, a tak dále.');
  });

  controller.hears(['jak .* p[řr]ihl[aá]sit', 'podat p[řr]ihl[áa][šs]ku'], 'message_received,facebook_postback', function(bot, message) {
      bot.reply(message, 'Příhlášku muže podat tady http://is.cuni.cz/studium/prijimacky/index.php?do=detail_obor&id_obor=17437');
  });

  controller.hears(['kolik .* hl[áa]s[íi]', 'kolik .* p[rř]ij[íi]m[áa]', 'kolik berou', 'kolik .* bere'], 'message_received,facebook_postback', function(bot, message) {
      bot.reply(message, 'Hlásí se tak 200 lidí, a konkurence stoupá!');
      bot.reply(message, 'No a bere se cca 25...');
  });

  controller.hears(['kde .* p[řr]ij[ií]ma[čc]ky'], 'message_received,facebook_postback', function(bot, message) {
      bot.reply(message, 'Písmená část je na fildě ve městě a ústní na konci světa v Jinonicích');
  });

  controller.hears(['kolik .* komis[ei]', 'komis[ei] .* kolik'], 'message_received,facebook_postback', function(bot, message) {
      bot.reply(message, 'Komise na ústní část se skládá alespoň ze 3 expertů na problematiku.');
  });
}

