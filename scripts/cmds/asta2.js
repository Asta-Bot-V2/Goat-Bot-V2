const { Hercai } = require('hercai');
const herc = new Hercai();
const bot = 'Asta bot';
const custom_Instructions = 'From now on your name is ' + bot + ' You were developed by a teenage boy named Asta ichiyukimøri, your response must speak like asta in black clover, your response must be as creative as possible. ';
const config = {
  name: 'asta',
  aliases: ['as'],
  version: '1.0',
  author: 'Riley Nelson 🇵🇱',
  countDown: 5,
  role: 0,
  longDescription: {
    id: 'Chatbot AI dengan riwayat percakapan',
    en: 'AI chatbot with conversation history',
    es: 'Chatbot de IA con historial de conversación',
    ms: 'Chatbot AI dengan sejarah perbualan',
    vi: 'Trò chuyện trí tuệ nhân tạo với lịch sử cuộc trò chuyện'
  },
  category: 'ai',
  guide: {
    id: '{pn} <pertanyaan>',
    en: '{pn} <query>',
    es: '{pn} <pregunta>',
    ms: '{pn} <soalan>',
    vi: '{pn} <câu hỏi>'
  }
};

const langs = {
  id: {
    er: "Ah, bisakah kamu mengatakannya lagi?",
    na: "❎ Perintah ini hanya berfungsi digrup!",
    se: "❗ Harap berikan pertanyaan atau kueri",
    tk: "𝐀𝐈 sedang berfikir...",
  },
  es: {
    er: "Ah, ¿puedes decirlo de nuevo?",
    na: "¡Este comando solo funciona en grupos! ❎",
    se: "❗ Por favor, proporciona una pregunta o consulta",
    tk: "𝐀𝐈 está pensando..."
  },
  en: {
    er: "Ah, can you say that again?",
    na: "❎ This command only works in groups!",
    se: "❗ Please provide a question or query",
    tk: "𝐀𝐈 is thinking..."
  },
  ms: {
    er: "Eh, bolehkah kamu mengatakan itu lagi?",
    na: "❎ Perintah ini hanya berfungsi dalam kumpulan!",
    se: "❗ Sila berikan soalan atau pertanyaan",
    tk: "𝐀𝐈 sedang memikirkan..."
  },
  vi: {
    er: "Ồ, bạn có thể nói lại không?",
    na: "❎ Lệnh này chỉ hoạt động trong nhóm!",
    se: "❗ Vui lòng cung cấp một câu hỏi hoặc truy vấn",
    tk: "𝐀𝐈 đang suy nghĩ..."
  }
};

const onStart = async ({ message, event, args, api, getLang, usersData }) => {
  if (!event.isGroup) return message.send(getLang("na")); 
  const name = await usersData.getName(event.senderID);
  const prompt = args.join(' ');
  if (!args[0]) return message.reply(getLang("se"));
  const mid = event.messageID;
  message.send(getLang("tk"));
  await herc.betaQuestion({ content: `{{${custom_Instructions}}}. \nuser: ${name}.\nmessage: ${prompt}`, 
user: event.senderID })
    .then((response) => {
      message.reply(response.reply, (error, info) => global.GoatBot.onReply.set(info.messageID, { commandName: 'ggpt', author: event.senderID }));
    })
    .catch((error) => {
      message.send(getLang("er"));
    });
};

const onReply = async ({ Reply, event, api, message, getLang }) => {
  await herc.betaQuestion({ content: event.body, user: event.senderID })
    .then((response) => {
      message.reply(response.reply, (error, info) => global.GoatBot.onReply.set(info.messageID, { commandName: 'ggpt', author: event.senderID }));
    })
    .catch((error) => {
      message.reply(getLang("er"));
    });
};

module.exports = { config, langs, onStart, onReply };