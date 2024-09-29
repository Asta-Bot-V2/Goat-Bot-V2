const fs = require('fs');
const moment = require('moment-timezone');

module.exports = {
  config: {
    name: "info",
    version: "1.3",
    author: "AceGun",
    countDown: 5,
    role: 0,
    shortDescription: {
      vi: "",
      en: "Sends information about the bot and admin along with an image."
    },
    longDescription: {
      vi: "",
      en: "Sends information about the bot and admin along with an image."
    },
    category: "utility",
    guide: {
      en: "{pn}"
    },
    envConfig: {}
  },

  onStart: async function ({ message }) {
    const botName = "asta";
    const botPrefix = ".";
    const authorName = "Asta ichiyukimøri";
    const authorFB = "https://www.facebook.com/femi.gbemi.58";
    const authorInsta = "😎";
    const status = "SINGLE";

    const link = urls[Math.floor(Math.random() * urls.length)];

    const now = moment().tz('Asia/Dhaka');
    const date = now.format('MMMM Do YYYY');
    const time = now.format('h:mm:ss A');

    const uptime = process.uptime();
    const seconds = Math.floor(uptime % 60);
    const minutes = Math.floor((uptime / 60) % 60);
    const hours = Math.floor((uptime / (60 * 60)) % 24);
    const days = Math.floor(uptime / (60 * 60 * 24));
    const uptimeString = `${days} days ${hours} hours ${minutes} minutes ${seconds} seconds`;

    message.reply({
      body: `===「 Bot & Owner Info 」===\❏Bot Name: ${botName}\❏Bot Prefix: ${botPrefix}\❏Name: ${authorName}\❏Facebook: ${authorFB}\❏Instagram: ${authorInsta}\❏Status: ${status}\❏Date: ${date}\❏Time: ${time}\❏Uptime: ${uptimeString}\=====================`,
      }
  },

  onChat: async function({ event, message, getLang }) {
    if (event.body && event.body.toLowerCase() === "info") {
      this.onStart({ message });
    }
  }
};
