/**
 * A Bot for Slack!
 */


/**
 * Define a function for initiating a conversation on installation
 * With custom integrations, we don't have a way to find out who installed us, so we can't message them :(
 */

function onInstallation(bot, installer) {
    if (installer) {
        bot.startPrivateConversation({user: installer}, function (err, convo) {
            if (err) {
                console.log(err);
            } else {
                convo.say('I am a bot that has just joined your team');
                convo.say('You must now /invite me to a channel so that I can be of use!');
            }
        });
    }
}


/**
 * Configure the persistence options
 */

var config = {};
if (process.env.MONGOLAB_URI) {
    var BotkitStorage = require('botkit-storage-mongo');
    config = {
        storage: BotkitStorage({mongoUri: process.env.MONGOLAB_URI}),
    };
} else {
    config = {
        json_file_store: ((process.env.TOKEN)?'./db_slack_bot_ci/':'./db_slack_bot_a/'), //use a different name if an app or CI
    };
}

/**
 * Are being run as an app or a custom integration? The initialization will differ, depending
 */

if (process.env.TOKEN || process.env.SLACK_TOKEN) {
    //Treat this as a custom integration
    var customIntegration = require('./lib/custom_integrations');
    var token = (process.env.TOKEN) ? process.env.TOKEN : process.env.SLACK_TOKEN;
    var controller = customIntegration.configure(token, config, onInstallation);
} else if (process.env.CLIENT_ID && process.env.CLIENT_SECRET && process.env.PORT) {
    //Treat this as an app
    var app = require('./lib/apps');
    var controller = app.configure(process.env.PORT, process.env.CLIENT_ID, process.env.CLIENT_SECRET, config, onInstallation);
} else {
    console.log('Error: If this is a custom integration, please specify TOKEN in the environment. If this is an app, please specify CLIENTID, CLIENTSECRET, and PORT in the environment');
    process.exit(1);
}


/**
 * A demonstration for how to handle websocket events. In this case, just log when we have and have not
 * been disconnected from the websocket. In the future, it would be super awesome to be able to specify
 * a reconnect policy, and do reconnections automatically. In the meantime, we aren't going to attempt reconnects,
 * WHICH IS A B0RKED WAY TO HANDLE BEING DISCONNECTED. So we need to fix this.
 *
 * TODO: fixed b0rked reconnect behavior
 */
// Handle events related to the websocket connection to Slack
controller.on('rtm_open', function (bot) {
    console.log('** The RTM api just connected!');
});

controller.on('rtm_close', function (bot) {
    console.log('** The RTM api just closed');
    // you may want to attempt to re-open
});


/**
 * Core bot logic goes here!
 */
// BEGIN EDITING HERE!

controller.on('bot_channel_join', function (bot, message) {
    bot.reply(message, "I'm here!")
});

controller.hears(['hello','hi'], ['direct_mention', 'mention', 'direct_message'], function (bot, message) {
    bot.reply(message, 'Hello!');
});

controller.hears(['How are you?'], ['direct_mention', 'mention', 'direct_message'], function (bot, message) {
    bot.reply(message, 'I am well. Thanks for asking');
});

controller.hears(['How do I set up my dev environment for Mobile SDK?'], ['direct_mention', 'mention', 'direct_message'], function (bot, message) {
    bot.replyInThread(message, 'https://github.com/SurveyMonkey/surveymonkey-android-sdk/blob/master/README.mdg');
});

controller.hears(['Where can I find the system architecture?'], ['direct_mention', 'mention', 'direct_message'], function (bot, message) {
    bot.replyInThread(message, 'https://treehouse.surveymonkey.com/display/eng/Architecture');
});
controller.hears(['How do I page the billing team?'], ['direct_mention', 'mention', 'direct_message'], function (bot, message) {
    bot.replyInThread(message, 'use ```/oncall-billing``` Do it NOW we dont want to miss out on any of that Cha ching!');
});
controller.hears(['When is the next deployment freeze?'], ['direct_mention', 'mention', 'direct_message'], function (bot, message) {
    bot.replyInThread(message, 'Friday August 7th. Hold your horses, we dont want you to ship and ruin your weekend and mine with an incident save it for Monday');
});
controller.hears(['Who should I contact in Usabilla?'], ['direct_mention', 'mention', 'direct_message'], function (bot, message) {
    bot.replyInThread(message, '@GregJohnson');
});
controller.hears(['What is the % of COs completed?'], ['direct_mention', 'mention', 'direct_message'], function (bot, message) {
    bot.replyInThread(message, '15%. We just are getting warmed up. 7 more weeks to the end of the quarter. Hang in there we will get there. For more details go to https://treehousle.surveymonkey.com/display/pm/2020+Q3+crtitical+Objectivies ');
});
controller.hears(['How many P1 customer bugs do we have?'], ['direct_mention', 'mention', 'direct_message'], function (bot, message) {
    bot.replyInThread(message, '0 critical bugs. Yay for happy customers ');
});

controller.hears(['What is the guest wifi password?'], ['direct_mention', 'mention', 'direct_message'], function (bot, message) {
    bot.replyInThread(message, '$urfTh3W3b!');
});

controller.hears(['save'], ['direct_mention', 'mention', 'direct_message'], function (bot, message) {
    bot.replyInThread(message, 'Thanks for making me smarter. Now I can help others with the same question without bothering anyone.');
});
controller.hears(['.*[?][ ?]*$'], 'direct_message', function(bot, message) {
    bot.replyInThread(message, 'Sorry I do not know the answer to that!! \n I am very curious to know the answer as well so I can help the next time.\n @here can someone answer this.');
});






// controller.hears(['.*'], 'direct_message', function(bot, message) {

//     bot.replyInThread(message, {
//         attachments:[
//             {
//                 title: 'Sorry I do not know the answer to that!! \n I am very curious to know the answer as well so I can help the next time.\n @here can someone answer this.',
//                 callback_id: '123',
//                 attachment_type: 'default',
//                 actions: [
//                     {
//                         "name":"answer",
//                         "text": "answer",
//                         "value": "answer",
//                         "type": "button",
//                     }
//                 ]
//             }
//         ]
//     });
// });


/**
 * AN example of what could be:
 * Any un-handled direct mention gets a reaction and a pat response!
 */
//controller.on('direct_message,mention,direct_mention', function (bot, message) {
//    bot.api.reactions.add({
//        timestamp: message.ts,
//        channel: message.channel,
//        name: 'robot_face',
//    }, function (err) {
//        if (err) {
//            console.log(err)
//        }
//        bot.reply(message, 'I heard you loud and clear boss.');
//    });
//});

