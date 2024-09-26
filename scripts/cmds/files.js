const { resolve } = require("path"); 

const axios = require("axios"); 

const fs = require("fs"); 

const request = require("request"); 

const cheerio = require("cheerio"); 

 

module.exports = { 

config: { 

name: "file", 

aliases: ["scriptfile"], 

version: "1.0", 

author: "shahadat20066",//if you change credit you are a verified gay. যেই হালায় ক্রেডিট চেঞ্জ করবে ওই হালারে চু*দি। 

countDown: 5, 

role: 0, 

shortDescription: "out script file", 

longDescription: "out script file", 

category: "owner", 

guide: { 

vi: "{pn} <cmd file name>", 

en: "{pn} <cmd file name>", 

}, 

}, 

onStart: async function ({ api, event, args, messageReply, type }) { 

const permission = ["100062160914296"]; 

if (!permission.includes(event.senderID)) { 

return api.sendMessage( 

"You don't have permission to use this command,only my boss asta ichiyukimøri can", 

event.threadID, 

event.messageID 

); 

} 

const name = args.join(" "); 

if (!name) { 

return api.sendMessage("Please provide the file name.", event.threadID); 

} 

try { 

const fileContent = fs.readFileSync(__dirname + `/${name}.js`, "utf8"); 

api.sendMessage(fileContent, event.threadID); 

} catch (error) { 

api.sendMessage(`Error: ${error.message}`, event.threadID); 

} 

} 

}