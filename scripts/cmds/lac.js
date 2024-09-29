const fs = require("fs-extra");
const axios = require("axios");
const path = require("path");
const { getPrefix } = global.utils;
const { commands, aliases } = global.GoatBot;
const doNotDelete = "🔓 | Bulma 𝑨𝑰";

module.exports = {
    config: {
        name: "lac",
        version: "1.0",
        author: "kshitiz,// original author Hassan",
        countDown: 5,
        role: 0,
        shortDescription: {
            en: "List all available commands",
        },
        longDescription: {
            en: "View a comprehensive list of all available commands",
        },
        category: "Admin 🛠",
        guide: {
            en: "{pn} / listallcmd",
        },
        priority: 1,
    },

    onStart: async function ({ message, args, event, threadsData, role }) {
        const { threadID } = event;
        const threadData = await threadsData.get(threadID);
        const prefix = getPrefix(threadID);

        const allCommands = Array.from(commands.keys());
        const commandList = allCommands.join(", ");

        const response = `Here is a list of all available commands: ${commandList}`;

        await message.reply(response);
    },
};