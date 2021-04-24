const telegrambot = require('node-telegram-bot-api');
const http = require('http');
const request = require('request');
const token = process.env.token;
const options = {
    webHook: {
      // Port to which you should bind is assigned to $PORT variable
      // See: https://devcenter.heroku.com/articles/dynos#local-environment-variables
      port: process.env.PORT
      // you do NOT need to set up certificates since Heroku provides
      // the SSL certs already (https://<app-name>.herokuapp.com)
      // Also no need to pass IP because on Heroku you need to bind to 0.0.0.0
    }
  };
const url = process.env.APP_URL || 'https://goldyyweatherbot.herokuapp.com:443';
const bot = new TelegramBot(token, options);


bot.onText(/\/start/, (msg) => {

    bot.sendMessage(msg.chat.id, "Welcome to Goldyy Weather bot. \n Type your city Name to get weather info: ");
        
    });



bot.on('message', msg => {
    if (msg.text === '/start') {
        return;
    }
    const chatID = msg.chat.id;
    const cityName = msg.text;

    request(`https://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=metric&appid=d301f96211ce70232728c51c966a6cf0`, function (error, response, body) {
        if (!error) {
            const res = JSON.parse(body);
            
            // Country not found.
            if (res.cod === '404') {
                bot.sendMessage(chatID, 'Invalid city name.', {reply_to_message_id: msg.message_id});
                return;
            }

            const temperature = res.main.temp;
            bot.sendMessage(chatID, `${temperature}°C`);
        } else {
            console.log(error);
        }
    })
});