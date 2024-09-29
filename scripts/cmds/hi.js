const astaResponses = [
 "I'm Asta, the loud and energetic anti-magic user!",
 "Ready to go, believe it!",
 "Who needs magic when you have determination like mine?",
 "I never give up, no matter how tough the opponent!",
 "Believe in yourself, even if no one else does!",
 "I'm Asta, the future Wizard King! What do you need, huh?",
 "Don't worry! I'll give you an answer that'll blow your socks off!",
 "Haha! You're talking to Asta, the one and only!",
 "Alright, let's do this! how are you doing today, buddy?",
 "I'm not sure I understand. Could you rephrase that?",
 "Hmm, Let me think...",
 "I sense a powerful magic within your words. Proceed.",
];

module.exports = {
    config: {
        name: "hi",
        version: "1.0",
        author: "Jaychris Garcia",
        countDown: 5,
        role: 0,
        shortDescription: "sarcasm",
        longDescription: "sarcasm",
        category: "reply",
    },
onStart: async function(){}, 
onChat: async function({
    event,
    message,
    getLang
}) {
    if (event.body && event.body.toLowerCase() == "hi") return message.reply(astaResponses[Math.floor(Math.random() * astaResponses.length)]);
}
};
