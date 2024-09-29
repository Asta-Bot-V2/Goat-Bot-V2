const axios = require("axios");

module.exports = {
  config: {
    name: 'stalk',
    version: '2.5',
    author: 'ArYAN',
    countDown: 10,
    role: 0,
    longDescription: {
      en: "Get info using uid/mention/reply to a message"
    },
    category: "info",
    guide: {
      vi: "",
      en: "${pn} uid/@mention/reply"
    },
  },

  onStart: async function ({ api, event, args, userData, usersData }) {
    let id;
    if (args.join().includes('@')) {
      id = Object.keys(event.mentions)[0];
    } else {
      id = args[0] || event.senderID;
    }

    if (event.type === "message_reply") {
      id = event.messageReply.senderID;
    }

    try {
      const uid = id;

      const response = await axios.get(`https://aryan-apis.onrender.com/stalk/fb?uid=${uid}&apikey=aryan`);
      const userData = response.data;

      const name = userData.name;
      const link_profile = userData.link;
      const first_name = userData.first_name;
      // Change the format of created_time
      const created_time = new Date(userData.created_time).toLocaleDateString('en-US');
      const web = userData.website || "No website data found!";
      const gender = userData.gender || "No Gender Data found!";
      const relationship_status = userData.relationship_status || "No relationship data found!";
      const love = userData.significant_other || "No love data found!";
      const bday = userData.birthday || "No birthday data found!";
      const follower = userData.subscribers?.summary?.total_count || "No followers data found!"; 
      const is_verified = userData.is_verified;
      const quotes = userData.quotes || "No quote data found!";
      const about = userData.about || "No about data found!";
      const locale = userData.locale || "No local data found!";
      const hometown = userData.hometown?.name || "No Hometown data found!";
      const cover = userData.cover || "No Cover photo found!";
      const messageBody = `
ðŸ’œ ð—™ð—®ð—°ð–¾ð–»ð—ˆð—ˆð—„ ð—¦ð˜ð—®ð—¹ð—¸
â”â”â”â”â”â”â”â”â”â”â”â”â”â”
\nð–­ð–ºð—†ð–¾: ${name}
ð–¥ð—‚ð—‹ð—Œð— ð–­ð–ºð—†ð–¾: ${first_name}
ð–¨ð–½: ${uid}
ð–¢ð—‹ð–¾ð–ºð—ð—‚ð—ˆð—‡ ð–£ð–ºð—ð–¾: ${created_time}
ð–¯ð—‹ð—ˆð–¿ð—‚ð—…ð–¾ ð–«ð—‚ð—‡ð—„: ${link_profile}
ð–¦ð–¾ð—‡ð–½ð–¾ð—‹: ${gender}
ð–±ð–¾ð—…ð–ºð—ð—‚ð—ˆð—‡ð—Œð—ð—‚ð—‰ ð–²ð—ð–ºð—ð—Žð—Œ: ${relationship_status}
ð–¡ð—‚ð—‹ð—ð—ð–½ð–ºð—’: ${bday}
ð–¥ð—ˆð—…ð—…ð—ˆð—ð–¾ð—‹ð—Œ: ${follower}
ð–¨ð—Œ ð–µð–¾ð—‹ð—‚ð–¿ð—‚ð–¾ð–½: ${is_verified}
ð–§ð—ˆð—†ð–¾ð—ð—ˆð—ð—‡: ${hometown}
ð–«ð—ˆð–¼ð–ºð—…ð–¾: ${locale}
â”â”â”â”â”â”â”â”â”â”â”â”â”â”`;

      const avatarUrl = await usersData.getAvatarUrl(uid);

      api.sendMessage({ body: messageBody, attachment: await global.utils.getStreamFromURL(avatarUrl)}, event.threadID);
    } catch (err) {
      api.sendMessage(`Error: ${err.message}`, event.threadID, event.messageID);
    }
  }
};