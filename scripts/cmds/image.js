const axios = require('axios');
 
module.exports = {
  config: {
    name: "image",
    aliases: ["mage-defusion"], 
    version: "1.0",
    author: "Samir Ã…â€™",
    countDown: 5,
    role: 0,
    shortDescription: "anime image generator",
    longDescription: "",
    category: "Ã°Ââ€”â€Ã°Ââ€”Å“-Ã°Ââ€”Å¡Ã°Ââ€”ËœÃ°Ââ€”Â¡Ã°Ââ€”ËœÃ°Ââ€”Â¥Ã°Ââ€”â€Ã°Ââ€”Â§Ã°Ââ€”ËœÃ°Ââ€”â€”",
    guide: {
      en: "{pn} <prompt>  --ar 16:9"
    }
  },
 
  onStart: async function ({ message, args }) {
    let prompt = args.join(" ");
    
 
    try {
      const apiUrl = `https://www.samirxpikachu.run.place/mageDef?prompt=${encodeURIComponent(prompt)}`;
      
      const imageStream = await global.utils.getStreamFromURL(apiUrl);
 
      if (!imageStream) {
        return message.reply("Failed to retrieve image.");
      }
      
      return message.reply({
        body: 'here is your image',
        attachment: imageStream
      });
    } catch (error) {
      console.error(error);
      return message.reply("Failed to retrieve image.");
    }
  }
};