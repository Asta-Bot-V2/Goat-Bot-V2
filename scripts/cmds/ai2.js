const axios = require("axios");
const path = require("path");
const fs = require("fs-extra");

const Prefixes = ["Asta", "staria", "Ai"];

global.chatHistory = {};

module.exports = {
  config: {
    name: "asta",
    version: "2.2.4",
    author: "Hassan", // do not change
    role: 2,
    category: "ai",
    shortDescription: {
      en: "Asks AI for an answer.",
    },
    longDescription: {
      en: "Asks AI for an answer based on the user prompt.",
    },
    guide: {
      en: `{pn} [prompt]

Example usage:
1. To ask the AI a question:
   - {pn} What is the meaning of life?

2. To fetch images:
   - {pn} etc, images image of 
   - {pn} AI send me images of nature.

3. To fetch waifu images:
   - {pn} waifu maid
   - {pn} waifu raiden-shogun

Available versatile waifu tags:
maid, waifu, marin-kitagawa, mori-calliope, raiden-shogun, oppai, selfies, uniform, kamisato-ayaka

Available NSFW waifu tags:
ass, hentai, milf, oral, paizuri, ecchi, ero`
    },
  },
  onStart: async function ({ message, api, event, args }) {
    // Initialization logic if needed
  },
  onChat: async function ({ api, event, args, message }) {
    try {
      const prefix = Prefixes.find(
        (p) => event.body && event.body.toLowerCase().startsWith(p)
      );

      if (!prefix) {
        return;
      }

      let prompt = event.body.substring(prefix.length).trim();

      if (!global.chatHistory[event.senderID]) {
        global.chatHistory[event.senderID] = [];
      }


      if (event.type === "message_reply" && global.chatHistory[event.senderID].length > 0) {
        const lastPrompt = global.chatHistory[event.senderID].slice(-1)[0];
        prompt = lastPrompt + " " + prompt;
      }
 global.chatHistory[event.senderID].push(prompt);

      let numberImages = 6; // Default to 6 images
      const match = prompt.match(/-(\d+)$/);

      if (match) {
        numberImages = Math.min(parseInt(match[1], 10), 8); // Max 8 images
        prompt = prompt.replace(/-\d+$/, "").trim(); // Remove the number part from prompt
      }

      if (prompt === "") {
        await api.sendMessage(
          "Please provide a question for me to respond to.",
          event.threadID
        );
        return;
      }

      api.setMessageReaction("âŒ›", event.messageID, () => {}, true);

      const response = await axios.get(
        `https://over-ai-yau-5001-center-hassan.vercel.app/ai?prompt=${encodeURIComponent(prompt)}`
      );

      if (response.status !== 200 || !response.data || !response.data.response) {
        throw new Error("Unable to respond. API error or no data returned.");
      }

      const messageText = response.data.response;

      const urls = messageText.match(/https?:\/\/\S+\.(jpg|jpeg|png|gif)/gi);

      if (urls && urls.length > 0) {
        const imgData = [];
        const limitedUrls = urls.slice(0, numberImages);

        for (let i = 0; i < limitedUrls.length; i++) {
          try {
            const imgResponse = await axios.get(limitedUrls[i], {
              responseType: "arraybuffer",
            });
            const imgPath = path.join(__dirname, "cache", `image_${i + 1}.jpg`);
            await fs.outputFile(imgPath, imgResponse.data);
            imgData.push(fs.createReadStream(imgPath));
          } catch (imgError) {
            console.error("Error fetching image:", imgError);
            await api.sendMessage(
              `Failed to load image from ${limitedUrls[i]}.`,
              event.threadID
            );
          }
        }

        if (imgData.length > 0) {
          await api.sendMessage(
            {
              body: `HERE IS YOUR RESULTSâœ…`,
              attachment: imgData,
            },
            event.threadID,
            event.messageID
          );
          await fs.remove(path.join(__dirname, "cache"));
        } else {
          await api.sendMessage("No images were fetched successfully.", event.threadID);
        }
      } else {
        await message.reply(messageText);
      }

      api.setMessageReaction("âœ…", event.messageID, () => {}, true);
    } catch (error) {
      console.error("Error in onChat:", error);
      await api.sendMessage(
        `Failed to get answer: ${error.message}`,
        event.threadID
      );
    }
  },
  onReply: async function ({ api, message, event, args }) {
    return this.onChat({ api, message, event, args });
  },
};