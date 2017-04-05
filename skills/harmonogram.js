module.exports = function(controller) {
    controller.hears('harmonogram', 'message_received,facebook_postback', function(bot, message) {

        var attachment = {
            'type':'template',
            'payload':{
                'template_type':'button',
                'text':'Jaký harmonogram tě zajímá?',
                'buttons':[
                    {
                        'type':'postback',
                        'title':'Podrobný harmonogram',
                        'payload':'harmonogram_detail',
                    },
                    {
                        'type':'web_url',
                        'url':'http://novamedia.ff.cuni.cz/studium/rozvrh-harmonogram-semestru/',
                        'title':'Rozvrh a harmonogram'
                    },
                ]
            },
        };

        bot.reply(message, {
            attachment: attachment,
        });

    });

    controller.on('facebook_postback', function(bot, message) {

        if (message.payload === 'harmonogram_detail') {
            var attachment = {
                'type':'template',
                'payload':{
                    'template_type':'button',
                    'text':'Asi letošní, co?',
                    'buttons':[
                        {
                            'type':'web_url',
                            'url':'http://www.ff.cuni.cz/fakulta/predpisy-a-dokumenty/opatreni-dekana/harmonogram/harmonogram-akademickeho-roku-201617/',
                            'title':'Ano, letošní',
                        },
                        {
                            'type':'web_url',
                            'url':'http://www.ff.cuni.cz/fakulta/predpisy-a-dokumenty/opatreni-dekana/harmonogram/harmonogram2015-16/',
                            'title':'Ne ne, loňský',
                        },
                        {
                            'type':'web_url',
                            'url':'http://www.ff.cuni.cz/fakulta/predpisy-a-dokumenty/opatreni-dekana/harmonogram/',
                            'title':'Všechny!',
                        },
                    ]
                },
            };

            bot.reply(message, {
                attachment: attachment,
            });
        }
    });
};
