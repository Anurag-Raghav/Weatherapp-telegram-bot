const telegrambot = require('node-telegram-bot-api');
require('dotenv').config();
const http = require('http');
const request = require('request');
const token = process.env.TOKEN_KEY;
const options = {
    webHook: {
      port: process.env.PORT
    }
  };
const url = process.env.APP_URL || 'https://goldyyweatherbot.herokuapp.com:443';
const bot = new telegrambot(token, options);


bot.onText(/\/start/, (msg) => {

    bot.sendMessage(msg.chat.id, "Welcome to Goldyy Weather bot. \n Type your city Name to get weather info: ");
        
    });

    bot.setWebHook(`${url}/bot${token}`);

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
            const max=res.main.temp_max;
            const min=res.main.temp_min;
            bot.sendMessage(chatID, `current_temp:-${temperature}°C\nmax_temp:-${max}°C\nmin_temp:-${min}`);
            
        } else {
            console.log(error);
        }
    })
});