module.exports = {
  config: {
    name: "blacklist",
    aliases: ["bl"],
    version: "1.0",
    author: "GoatAI by LiANE",
    role: 1,
    shortDescription: {
      en: "Blacklist Command",
      tl: "Command ng Blacklist"
    },
    longDescription: {
      en: "Command to add, remove, and list banned users",
      tl: "Command para magdagdag, magtanggal, at maglista ng mga banned na users"
    },
    category: "goatBot",
    guide: {
      en: "{p}blacklist add <userID>\{p}blacklist remove <userID>\{p}blacklist list",
      tl: "{p}blacklist add <userID>\{p}blacklist remove <userID>\{p}blacklist list"
    }
  },
  
  onStart: async function ({ event, message, event, args, threadsData, usersData, api, commandName, role }) {
    // Check if the user has the required role
    if (role < 1) {
      message.reply("You don't have permission to use this command.");
      return;
    }
    
    const action = args[0];
    
    if (action === "add") {
      const userID = args[1];
      
      if (!userID) {
        message.reply("Please provide a user ID to add to the blacklist.");
        return;
      }
      
      // Add the user to the blacklist
      await blacklistAdd(userID);
      
      message.reply(`User with ID ${userID} has been added to the blacklist.`);
    } else if (action === "remove") {
      const userID = args[1];
      
      if (!userID) {
        message.reply("Please provide a user ID to remove from the blacklist.");
        return;
      }
      
      // Remove the user from the blacklist
      await blacklistRemove(userID);
      
      message.reply(`User with ID ${userID} has been removed from the blacklist.`);
    } else if (action === "list") {
      // Get the list of banned users
      const blacklist = await getBlacklist();
      
      // Check if the blacklist is empty
      if (blacklist.length === 0) {
        message.reply("The blacklist is empty.");
      } else {
        message.reply(`Blacklisted users:\${blacklist.join(", ")}`);
      }
    } else {
      message.reply("Invalid action. Please use `add`, `remove`, or `list`.");
    }
  }
};