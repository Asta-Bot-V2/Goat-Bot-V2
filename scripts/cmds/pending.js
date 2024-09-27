module.exports = {
  config: {
    name: "pending",
    version: "1.0",
    author: "NTKhang | ArYAN",
    countDown: 5,
    role: 0,
    shortDescription: {
      en: "Approve pending groups"
    },
    longDescription: {
      en: "Approve pending groups in spam list or unapproved groups"
    },
    category: "boxchat"
  },

langs: {
    en: {
        invaildNumber: "⛔|𝗜𝗻𝘃𝗮𝗹𝗶𝗱 𝗡𝘂𝗺𝗯𝗲𝗿\n━━━━━━━━━━━━━━━\n\n➤ %1 is not an invalid number............",
        cancelSuccess: "⛔|𝗖𝗮𝗻𝗰𝗲𝗹 𝗥𝗲𝗾𝘂𝗲𝘀𝘁\n\n➤ Refused %1 thread!.........",
        approveSuccess: "✅|𝗔𝗽𝗽𝗿𝗼𝘃𝗲𝗱 𝗚𝗿𝗼𝘂𝗽\n\n➤ Group has been approved %1 successfully....",

        cantGetPendingList: "Can't get the pending list!",
        returnListPending: "📝|𝗣𝗲𝗻𝗱𝗶𝗻𝗴 𝗟𝗶𝘀𝘁\n\n➤ The whole number of threads to approve is: %1 thread \n\n%2",
        returnListClean: "⛔|𝗡𝗼 𝗗𝗮𝘁𝗮\n━━━━━━━━━━━━━━━\n\n➤ Currently these are no groups in the pending list........"
    }
  },

onReply: async function({ api, event, Reply, getLang, commandName, prefix }) {
    if (String(event.senderID) !== String(Reply.author)) return;
    const { body, threadID, messageID } = event;
    var count = 0;

    if (isNaN(body) && body.indexOf("c") == 0 || body.indexOf("cancel") == 0) {
        const index = (body.slice(1, body.length)).split(/\s+/);
        for (const singleIndex of index) {
            console.log(singleIndex);
            if (isNaN(singleIndex) || singleIndex <= 0 || singleIndex > Reply.pending.length) return api.sendMessage(getLang("invaildNumber", singleIndex), threadID, messageID);
            api.removeUserFromGroup(api.getCurrentUserID(), Reply.pending[singleIndex - 1].threadID);
            count+=1;
        }
        return api.sendMessage(getLang("cancelSuccess", count), threadID, messageID);
    }
    else {
        const index = body.split(/\s+/);
        for (const singleIndex of index) {
            if (isNaN(singleIndex) || singleIndex <= 0 || singleIndex > Reply.pending.length) return api.sendMessage(getLang("invaildNumber", singleIndex), threadID, messageID);
            api.sendMessage(`✨ 𝗡𝗼𝘁𝗶𝗳𝗶𝗰𝗮𝘁𝗶𝗼𝗻\nMateo 𝗁𝖺𝗌 𝖻𝖾𝖾𝗇 approved by 𝗈𝗐𝗇𝖾𝗋𝗌.`, Reply.pending[singleIndex - 1].threadID);
            return api.sendMessage(`【 ? 】· 𝗠𝗔𝗧𝗘𝗢 𝗕𝗢𝗧`, Reply.pending[singleIndex - 1].threadID);
            count+=1;
        }
        return api.sendMessage(getLang("approveSuccess", count), threadID, messageID);
    }
},

onStart: async function({ api, event, getLang, commandName }) {
  const { threadID, messageID } = event;

    var msg = "", index = 1;

    try {
    var spam = await api.getThreadList(100, null, ["OTHER"]) || [];
    var pending = await api.getThreadList(100, null, ["PENDING"]) || [];
  } catch (e) { return api.sendMessage(getLang("cantGetPendingList"), threadID, messageID) }

  const list = [...spam, ...pending].filter(group => group.isSubscribed && group.isGroup);

    for (const single of list) msg += `╭────────────⟡\n│\n│ℹ️ 𝗡𝗮𝗺𝗲\n│${single.name}\n│\n│🆔 𝗜𝗗\n│${single.threadID}\n│\n╰───────────⟡\n\n`;

    if (list.length != 0) return api.sendMessage(getLang("returnListPending", list.length, msg), threadID, (err, info) => {
    global.GoatBot.onReply.set(info.messageID, {
            commandName,
            messageID: info.messageID,
            author: event.senderID,
            pending: list
        })
  }, messageID);
    else return api.sendMessage(getLang("returnListClean"), threadID, messageID);
}
}