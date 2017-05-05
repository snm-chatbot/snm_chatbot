module.exports = function(controller) {
    controller.hears(['st[áa]tnice .* ot[áa]zky', 'ot[áa]zky .* st[áa]tnice' ], 'message_received,facebook_postback', function(bot, message) {
        bot.reply(message, 'Můžeš využít třeba oborovou wiki na Wikisofia.cz, která obsahuje více či méně podrobně a kvalitně vypracované otázky.');
    });

    controller.hears(['posudek', 'posudky' ], 'message_received,facebook_postback', function(bot, message) {
        bot.reply(message, 'Posudky najdeš v SISu nejpozději 5 dnů před termínem obhajoby, v záznamu odevzdané kvalifikační práce.');
    });

    controller.hears(['jak[eé] jsou okruhy', 'jak[ée] jsou ot[áa]zky', 'st[áa]tnicov[ée] ot[áa]zky', 'obsah st[áa]tnice' ], 'message_received,facebook_postback', function(bot, message) {
        bot.reply(message, 'SSZK se skládá z:');
        bot.reply(message, 'obhajoby diplomové práce');
        bot.reply(message, 'ústní zkoušky ze tří povinných předmětů');
        bot.reply(message, 'informační věda, filozofie a nová média a informační politika');
        bot.reply(message, 'a ústní zkoušky z jednoho ze tří volitelných předmětů');
        bot.reply(message, 'digitální kultura, interaktivní média nebo informační design.');
    });

    controller.hears(['p[rř]ihl[aá][sš]k[ua] st[aá]tnice', 'p[rř]ihl[aá][sš]k[ua] SSZK', 'jak se p[rř]ihl[aá]s[ií][tm] na st[aá]tnice' ], 'message_received,facebook_postback', function(bot, message) {
        bot.reply(message, 'Elektronicky přes SIS: http://www.ff.cuni.cz/wp-content/uploads/2013/11/SZZK_-el_prihl2013.pdf');
    });

    controller.hears(['podm[ií]nky .* st[aá]tnic[ií]m', 'jak se dostat .* st[áa]tnice', 'jak se dostat .* st[áa]tnic[ií]m' ], 'message_received,facebook_postback', function(bot, message) {
        bot.reply(message, 'Abys mohla přistoupit ke státní závěrečné zkoušce (SZZK), musíš splnit tři kroky: 1.odevzdat diplomovou práci, 2.podat přihlášku k SZZK, 3. provést kontrolu studijních povinností.');
        bot.reply(message, 'Nezapomeň si zkontrolovat studijní povinnosti, protože jejich nesplnění není důvodem k omluvení ze státní závěrečné zkoušky (v takovém případě je termín započítán jako neúspěšný).');
    });

    controller.hears(['st[áa]tnice .* kdy', 'kdy .* st[áa]tnice' ], 'message_received,facebook_postback', function(bot, message) {
        bot.reply(message, 'Ke státním závěrečným zkouškám se obvykle hlásíš před odevzdáním závěrečné práce. Pro termíny sleduj zveřejňované studijním oddělením FF UK a ÚISKem.');
    });
};
