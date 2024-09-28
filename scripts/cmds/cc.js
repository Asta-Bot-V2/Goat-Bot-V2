.cmd install cc.js const { v4: uuidv4 } = require('uuid');
const fs = require('fs');
const path = require('path');

module.exports = {
  config: {
    name: "cc",
    version: "1.0",
    author: "NTKhang03",
    countDown: 5,
    role: 0,
    shortDescription: "Create new GoatBot command",
    longDescription: "Creates a new GoatBot command using AI",
    category: "Development",
    guide: "createcmd <command_name> <command_description> [options]"
  },
  onStart: async function ({ api, args, message, event }) {
    if (args.length < 2) {
      api.sendMessage("Please provide command name and description!", event.threadID, event.messageID);
    } else {
      const commandName = args[0];
      const commandDescription = args.slice(1).join(" ");
      const options = {};

      // Parse options
      for (const arg of args.slice(2)) {
        if (arg.startsWith("--")) {
          const [key, value] = arg.split("=");
          options[key.replace("--", "")] = value;
        }
      }

      // Generate command code
      const commandCode = generateCommandCode(commandName, commandDescription, options);
      const commandFilePath = path.join(__dirname, `../cmds/${commandName}.js`);
      fs.writeFileSync(commandFilePath, commandCode);
      api.sendMessage(`Command created successfully!`, event.threadID, event.messageID);
    }
  }
};

function generateCommandCode(commandName, commandDescription, options) {
  const response = options.response || `You used the ${commandName} command!`;
  const category = options.category || "Custom";

  return `
module.exports = {
  config: {
    name: "${commandName}",
    version: "1.0",
    author: "Asta ichiyukimøri",
    countDown: 5,
    role: 0,
    shortDescription: "${commandDescription}",
    longDescription: "${commandDescription}",
    category: "${category}",
    guide: "${commandName}"
  },
  onStart: async function ({ api, args, message, event }) {
    api.sendMessage("${response}", event.threadID, event.messageID);
  },
  onChat: async function ({ api, message, event }) {
    // Add chat logic here
  }
};
`;
}