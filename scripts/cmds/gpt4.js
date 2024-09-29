const axios = require("axios");



module.exports = {

  config: {

    name: "gpt4",

    aliases: [""],

    version: "1.0",

    author: "SiAM",

    countDown: 15,

    role: 0,

    shortDescription: {

      vi: "",

      en: ""

    },

    longDescription: {

      vi: "",

      en: "chatGPT with GPT 4 like model ( this is not the original gpt4 but its inspired from gpt4 model structure.."

    },

    category: "GPT",

    guide: {

      en: "{pn} 'query'\nexample:\n{pn} hi there"

    }

  },

  onStart: async function ({ api, message, event, args, commandName }) {

    const userID = event.senderID;

    const query = encodeURIComponent(args.join(" ")); 





    if (!query) {

      message.reply("Please provide a query. \n\nExample: /gpt How does photosynthesis work?");

      return;

    }



    try {

      const response = await axios.get(`https://gpt4.siam-apiproject.repl.co/api?uid=${userID}&query=${query}`);



      const answer = response.data.lastAnswer; 



      if (answer) {

        message.reply(

          {

            body: answer,

            attachment: ''

          },

          (err, info) => {

            global.GoatBot.onReply.set(info.messageID, {

              commandName,

              messageID: info.messageID,

              author: event.senderID

            });

          }

        );

      } else {

        console.error("Invalid API Response:", response.data);

        sendErrorMessage(message, "Server response is invalid ❌");

      }

    } catch (error) {

      console.error("Request Error:", error);

      sendErrorMessage(message, "Server not responding ❌");

    }

  },

  onReply: async function ({ message, event, Reply, args }) {

    let { author, commandName } = Reply;

    if (event.senderID !== author) return;

    const userID = author;

    const query = encodeURIComponent(args.join(" ")); 



    if (query.toLowerCase() === "clear") {

      global.GoatBot.onReply.delete(message.messageID);

      message.reply("Previous conversation has been cleared.");

      return;

    }



    try {

      const response = await axios.get(`https://gpt4.siam-apiproject.repl.co/api?uid=${userID}&query=${query}`);



      const answer = response.data.lastAnswer; 



      if (answer) {

        message.reply(

          {

            body: answer,

            attachment: ''

          },

          (err, info) => {

            global.GoatBot.onReply.set(info.messageID, {

              commandName,

              messageID: info.messageID,

              author: event.senderID

            });

          }

        );

      } else {

        console.error("Invalid API Response:", response.data);

        sendErrorMessage(message, "Server response is invalid ❌");

      }

    } catch (error) {

      console.error("Request Error:", error);

      sendErrorMessage(message, "Server not responding ❌");

    }

  }

};



function sendErrorMessage(message, errorMessage) {

  message.reply({ body: errorMessage });

                    }
