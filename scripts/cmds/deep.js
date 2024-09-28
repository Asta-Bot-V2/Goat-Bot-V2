const axios = require('axios');

module.exports = {
  config: {
    name: "deep",
    version: "1.0",
    author: "Asta ichiyukimøri",
    countDown: 5,
    role: 0,
    shortDescription: "Creates a new command using AI",
    longDescription: "Creates a new command using DeepAI API",
    category: "Development",
    guide: "createcommand"
  },
  onStart: async function ({ api, args, message, event }) {
    const prompt = args.join(" ");
    
    if (!prompt) {
      api.sendMessage("Please provide a command prompt!", event.threadID, event.messageID);
      return;
    }
    
    // DeepAI API
    const response = await axios.post('https://api.deepai.org/api/text-generator', {
      text: prompt,
    }, {
      headers: {
        'Api-Key': 'dd666507-a9c5-4498-af89-19b7aa4a02fb',
      }
    });
    
    const commandCode = response.data.output;
    
    api.sendMessage(`Generated Command:\n\`\`\`javascript\n${commandCode}\n\`\`\``, event.threadID, event.messageID);
  }
};