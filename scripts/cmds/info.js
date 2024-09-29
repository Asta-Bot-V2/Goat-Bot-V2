const moment = require('moment-timezone');

module.exports = {
  config: {
    name: "adinfo",
    version: "1.0",
    author: "Rahman Leon",
    role: 0,
    cooldown: 5,
    shortDescription: {
      vi: "",
      en: "Sends information about the bot and admin."
    },
    longDescription: {
      vi: "",
      en: "Sends information about the bot and admin."
    },
    category: "utility",
    guide: {
      en: "{pn}"
    },
    envConfig: {}
  },

  onStart: async function ({ message, prefix }) {
    const botPrefix = prefix; // Use the provided bot prefix
    const authorName = "Asta ichiyukimøri 🌹";
    const authorFB = "https://www.facebook.com/femi.gbemi.58";

    const now = moment();
    const date = now.format('MMMM Do YYYY');
    const time = now.format('h:mm:ss A');

    const uptime = process.uptime();
    const seconds = Math.floor(uptime % 60);
    const minutes = Math.floor((uptime / 60) % 60);
    const hours = Math.floor((uptime / (60 * 60)) % 24);
    const days = Math.floor(uptime / (60 * 60 * 24));
    const uptimeString = `${days} days ${hours} hours ${minutes} minutes ${seconds} seconds`;

    const additionalText = "Thanks asta ichiyukimøri 🌹 to provide FB account!! 🙏";

    // Combine the bot information and additional text in a single message
    message.reply(`
      ℹ Bot Information:
      ⏩ Bot Prefix: ${botPrefix}
      👤 Owner: ${authorName}
      🔗 Facebook: [${authorName}](${authorFB})
      📅 Date: ${date}
      🕒 Time: ${time}
      ⏰ Uptime: ${uptimeString}
      
      ${additionalText}
    `);
  },

  onChat: async function ({ event, message, getLang, prefix }) {
    if (event.body && event.body.toLowerCase() === "info") {
      this.onStart({ message, prefix });
    }
  }
};