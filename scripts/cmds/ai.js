const axios = require('axios');

const Prefixes = [
  'asta'
];

module.exports = {
  config: {
    name: 'ai',
    version: '2.5',
    author: 'JV Barcenas | Shikaki', // do not change
    role: 0,
    category: 'ai',
    shortDescription: {
      en: 'Asks gemini AI for an answer.',
    },
    longDescription: {
      en: 'Asks gemini AI for an answer based on the user prompt.',
    },
    guide: {
      en: '{pn} [prompt]',
    },
  },
  onStart: async function () {},
  onChat: async function ({ api, event, args, message }) {
    try {
      const prefix = Prefixes.find((p) => event.body && event.body.toLowerCase().startsWith(p));

      if (!prefix) {
        return; 
      }

      const prompt = event.body.substring(prefix.length).trim();

      if (prompt === '') {
        await message.reply(
          "Kindly provide the question at your convenience and I shall strive to deliver an effective response. Your satisfaction is my top priority."
        );
        return;
      }


      await message.reply("Answering your question. Please wait a moment...");

      const response = await axios.get(`https://hercai.onrender.com/GEMINI/hercai?question=${encodeURIComponent(prompt)}`);

      if (response.status !== 200 || !response.data) {
        throw new Error('Invalid or missing response from API');
      }

      const messageText = response.data.reply;

      await message.reply(messageText);

      console.log('Sent answer as a reply to user');
    } catch (error) {
      console.error(`Failed to get answer: ${error.message}`);
      api.sendMessage(
        `${error.message}.\ou can try typing your question again or resending it, as there might be a bug from the server that's causing the problem. It might resolve the issue.`,
        event.threadID
      );
    }
  },
};