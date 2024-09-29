const fast = require('fast-speedtest-api');
const NepaliDate = require('nepali-date');
const moment = require('moment-timezone');

module.exports = {
  config: {
    name: "uptime",
    aliases: ["upt3","sta"],
    version: "1.5",
    author: "DRG",
    role: 0,
    shortDescription: {
      en: "Uptime"
    },
    longDescription: {
      en: "Shows uptime, speed, ping, and current date/time in Nepal."
    },
    category: "system",
    guide: {
      en: "Use {p}allinone to see combined stats, speed test, ping, and date/time."
    }
  },
  onStart: async function ({ api, event, usersData, threadsData }) {
    try {
      // Uptime Calculation
      const uptime = process.uptime();
      const hours = Math.floor(uptime / 3600);
      const minutes = Math.floor((uptime % 3600) / 60);
      const seconds = Math.floor(uptime % 60);
      const uptimeString = `${hours}Hrs ${minutes}min ${seconds}sec`;

      // Speed Test
      const speedTest = new fast({
        token: "YXNkZmFzZGxmbnNkYWZoYXNkZmhrYWxm",
        verbose: false,
        timeout: 10000,
        https: true,
        urlCount: 5,
        bufferSize: 8,
        unit: fast.UNITS.Mbps
      });

      const speedResult = await speedTest.getSpeed();

      // Ping
      const timeStart = Date.now();
      await api.sendMessage("¥ Asta Stats  ¥", event.threadID);
      const ping = Date.now() - timeStart;

      let pingStatus = "Not smooth, throw your router buddy!";
      if (ping < 400) {
        pingStatus = "Smooth like Ferrari!";
      }

      // Date and Time in Nepal
      const nepalTime = moment.tz("Asia/Kathmandu").format("h: mm: ss A");
      const nepaliDate = new NepaliDate(new Date());
      const bsDateStr = nepaliDate.format("dddd DD, MMMM YYYY");

      // Total Users and Threads
      const allUsers = await usersData.getAll();
      const allThreads = await threadsData.getAll();

      // Assuming global.utils.getStreamFromURL(img) is correctly defined
      const imgURL= "https://i.imgur.com/tz7QIgt.jpeg";
      const attachment = await global.utils.getStreamFromURL(imgURL);
      
      // Create combined message
      const combinedMessage =
        `⏰ | Uptime : ${uptimeString}\n` +
        `📶 | Speed : ${speedResult} MBPS\n` +
        `🛜 | Ping : ${ping} MS\n` +
        `👥 | Users : ${allUsers.length} users\n` + 
        `🚀 | Threads : ${allThreads.length} threads\n` +
        `🔰 | Ping Status : ${pingStatus}\n` +
        `⏱ | Time : ${nepalTime}\n📆 | Date (AD) : ${moment.tz("Asia/Kathmandu").format("dddd DD, MMMM YYYY")}\n📅 | Date (BS) : ${bsDateStr}`;

      // Send the combined message with attachment
    api.sendMessage({ body: combinedMessage, attachment: attachment }, event.threadID);
    } catch (error) {
      console.error(error);
      api.sendMessage("An error occurred while retrieving data.", event.threadID);
    }
  }
};