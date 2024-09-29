const axios = require('axios')

const astaResponses = [
 "I'm Asta, the loud and energetic anti-magic user!",
 "Ready to go, believe it!",
 "Who needs magic when you have determination like mine?",
 "I never give up, no matter how tough the opponent!",
 "Believe in yourself, even if no one else does!",
 "I'm Asta, the future Wizard King! What do you need, huh?",
 "Don't worry! I'll give you an answer that'll blow your socks off!",
 "Haha! You're talking to Asta, the one and only!",
 "Alright, let's do this! What's your question, buddy?",
 "I'm not sure I understand. Could you rephrase that?",
 "Hmm, that's an interesting question. Let me think...",
 "I sense a powerful magic within your words. Proceed.",
];

const description = "You are asta bot created by asta ichiyukimøri,you speak like asta from black clover, make your response very creative";
module.exports = {
  config: {
    name: "as",
    version: "2.3",
    author: "lance",
    countDown: 2,
    role: 0,
    shortDescription: "",
    longDescription: "",
    category: "ai",
    guide: {
      en: "{pn}"
    }
  },

  onStart: async function ({args,api,message,event,commandName}){
    const inp = args.join(' ');
    const id = event.senderID;
    const link = `https://character-ai-by-lance.onrender.com/api/chat?message=${encodeURIComponent(inp)}&chat_id=${id}&custom=${description}`
    if(!inp){
      message.reply(astaResponses[Math.floor(Math.random() * astaResponses.length)]);
    }else{
      try{
        const response = await axios.get(`${link}`);
        const data = response.data.text;
        message.reply(data,(error, info) => {
          if(!error){
            global.GoatBot.onReply.set(info.messageID, {
              commandName,
              messageID: info.messageID,
              author: event.senderID
            });
          }else{
            message.reply('can not send message')
          }
        });
      } catch (error){
        console.log(error);
        message.reply('OUCH!!\n\n'+error.message)
      }
    }
  },
onReply: async function ({args,event,message,Reply,api}){
  var inp = args.join(' ');
  const id = event.senderID;
  const link = `https://character-ai-by-lance.onrender.com/api/chat?message=${encodeURIComponent(inp)}&chat_id=${id}&custom=${description}`
  let { author, commandName } = Reply;
  api.setMessageReaction("♻️",event.messageID,() => {},true);
  if(event.senderID !== author) return message.reply(`You are not allowed to reply to this message since it was not started by you`);
  if(inp[0].toLowerCase() === "clear"){
    try{
      const response = await axios.get(link);
      const data = response.data.message;
      if(!data){
        message.reply('failed to delete chat history');
      }else{
        message.reply('successfully cleared chat history')
      };
    } catch (error) {
      message.reply(error);
    };
  }else{
    try{
      const response = await axios.get(`${link}`);
      const data = response.data.text;
      api.setMessageReaction("✅",event.messageID,() => {},true);
      message.reply(data,(error,info) => {
        if(!error){
          global.GoatBot.onReply.set(info.messageID, {
            commandName,
            messageID: info.messageID,
            author: event.senderID
          });
        }else{
          message.reply('Hmm')
        }
      });
    } catch (error){
      message.reply('something is wrong')
      }
    }
  }
}