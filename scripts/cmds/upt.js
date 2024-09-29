const os = require('os');
const process = require('process');
const axios = require('axios');
const crypto = require('crypto');
const fs = require('fs').promises;
const path = require('path');
const { promisify } = require('util');
const exec = promisify(require('child_process').exec);

module.exports = {
    config: {
        name: "upt",
        version: "2.0",
        author: "Raphael Scholar",
        countDown: 5,
        role: 0,
        shortDescription: "Advanced bot uptime and info",
        longDescription: "Displays comprehensive bot uptime, system information, statistics, and additional features with customization options.",
        category: "system",
        guide: {
            en: "Use: uptime [option] [theme]\nOptions: basic, system, stats, all\nThemes: default, dark, light, custom"
        }
    },

    onStart: async function ({ api, event, args, threadsData, usersData }) {
        const startTime = process.uptime();
        const uptimeString = formatUptime(startTime);
        const option = args[0]?.toLowerCase() || 'all';
        const theme = args[1]?.toLowerCase() || 'default';

        let responseMessage = "";
        const themeColors = getThemeColors(theme);

        try {
            switch (option) {
                case 'basic':
                    responseMessage = `${themeColors.highlight}🤖 Bot Uptime:${themeColors.text} ${uptimeString}\n`;
                    break;
                case 'system':
                    responseMessage = await getSystemInfo(themeColors);
                    break;
                case 'stats':
                    responseMessage = await getBotStats(threadsData, usersData, themeColors);
                    break;
                case 'all':
                    responseMessage = `${themeColors.highlight}🤖 Bot Uptime:${themeColors.text} ${uptimeString}\n\n` +
                                      `${await getSystemInfo(themeColors)}\n\n` +
                                      `${await getBotStats(threadsData, usersData, themeColors)}\n\n` +
                                      `${await getAdditionalInfo(themeColors)}`;
                    break;
                default:
                    responseMessage = "Invalid option. Use 'basic', 'system', 'stats', or 'all'.";
            }

            const gokuUrl = "https://tiny.one/vsecm9d7";
            const gokuImage = await global.utils.getStreamFromURL(gokuUrl);
            
            await api.sendMessage(
                {
                    body: responseMessage,
                    attachment: gokuImage,
                    mentions: [{
                        tag: '@everyone',
                        id: event.threadID
                    }]
                },
                event.threadID
            );
            await logCommand(event.senderID, event.threadID, option);
        } catch (error) {
            console.error("Error in uptime command:", error);
            api.sendMessage(`An error occurred: ${error.message}`, event.threadID);
        }
    }
};

function formatUptime(seconds) {
    const days = Math.floor(seconds / (3600 * 24));
    const hours = Math.floor((seconds % (3600 * 24)) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);

    return `${days}d ${hours}h ${minutes}m ${secs}s`;
}

async function getSystemInfo(colors) {
    const totalMem = os.totalmem();
    const freeMem = os.freemem();
    const usedMem = totalMem - freeMem;
    const cpuUsage = await getCPUUsage();
    const diskSpace = await getDiskSpace();
    
    return `${colors.highlight}📊 System Information:${colors.text}\n` +
           `${colors.subheading}🖥️ Platform:${colors.text} ${os.platform()}\n` +
           `${colors.subheading}💻 OS:${colors.text} ${os.type()} ${os.release()}\n` +
           `${colors.subheading}🧠 Memory:${colors.text} ${formatBytes(usedMem)}/${formatBytes(totalMem)} (${(usedMem / totalMem * 100).toFixed(2)}%)\n` +
           `${colors.subheading}💽 Disk:${colors.text} ${formatBytes(diskSpace.used)}/${formatBytes(diskSpace.total)} (${diskSpace.usedPercentage}%)\n` +
           `${colors.subheading}⚡ CPU:${colors.text} ${cpuUsage.toFixed(2)}% | ${os.cpus().length} cores\n` +
           `${colors.subheading}🌡️ Temp:${colors.text} ${await getCPUTemperature()}°C`;
}

async function getBotStats(threadsData, usersData, colors) {
    const totalThreads = await threadsData.getAll();
    const totalUsers = await usersData.getAll();
    const activeThreads = totalThreads.filter(thread => thread.isGroup && !thread.suspended).length;
    const activeUsers = totalUsers.filter(user => user.banned !== true).length;

    return `${colors.highlight}📈 Bot Statistics:${colors.text}\n` +
           `${colors.subheading}👥 Total Threads:${colors.text} ${totalThreads.length}\n` +
           `${colors.subheading}🟢 Active Threads:${colors.text} ${activeThreads}\n` +
           `${colors.subheading}👤 Total Users:${colors.text} ${totalUsers.length}\n` +
           `${colors.subheading}🟢 Active Users:${colors.text} ${activeUsers}\n` +
           `${colors.subheading}📅 Commands Today:${colors.text} ${await getCommandsToday()}\n` +
           `${colors.subheading}📊 Most Used Command:${colors.text} ${await getMostUsedCommand()}`;
}

async function getAdditionalInfo(colors) {
    try {
        const { data } = await axios.get('https://api.ipify.org?format=json');
        const weatherData = await getWeatherData(data.ip);
        const quote = await getRandomQuote();
        return `${colors.highlight}🌐 Additional Info:${colors.text}\n` +
               `${colors.subheading}🌡️ Weather:${colors.text} ${weatherData.temp}°C, ${weatherData.description} in ${weatherData.city}\n` +
               `${colors.subheading}💡 Quote:${colors.text} "${quote.content}" - ${quote.author}\n` +
               `${colors.subheading}🔗 Public IP:${colors.text} ${data.ip}`;
    } catch (error) {
        console.error("Error fetching additional info:", error);
        return `${colors.highlight}🌐 Additional Info:${colors.text} Unable to fetch.`;
    }
}

async function getWeatherData(ip) {
    try {
        const geoResponse = await axios.get(`http://ip-api.com/json/${ip}`);
        const { lat, lon, city } = geoResponse.data;
        const weatherResponse = await axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=a9b4c37c68380d91903251d40ffa89ec&units=metric`);
        const { main, weather } = weatherResponse.data;
        return { temp: main.temp, description: weather[0].description, city: city };
    } catch (error) {
        console.error("Error fetching weather data:", error);
        return { temp: "N/A", description: "N/A", city: "N/A" };
    }
}

async function getRandomQuote() {
    try {
        const { data } = await axios.get('https://api.quotable.io/random');
        return { content: data.content, author: data.author };
    } catch (error) {
        console.error("Error fetching random quote:", error);
        return { content: "Unable to fetch quote", author: "Unknown" };
    }
}

function formatBytes(bytes) {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

async function getCPUUsage() {
    const startMeasure = cpuAverage();
    await new Promise(resolve => setTimeout(resolve, 100));
    const endMeasure = cpuAverage();
    const idleDifference = endMeasure.idle - startMeasure.idle;
    const totalDifference = endMeasure.total - startMeasure.total;
    return 100 - ~~(100 * idleDifference / totalDifference);
}

function cpuAverage() {
    const cpus = os.cpus();
    let totalIdle = 0, totalTick = 0;
    for (const cpu of cpus) {
        for (const type in cpu.times) {
            totalTick += cpu.times[type];
        }
        totalIdle += cpu.times.idle;
    }
    return { idle: totalIdle / cpus.length, total: totalTick / cpus.length };
}

async function getCPUTemperature() {
    if (os.platform() !== 'linux') return 'N/A';
    try {
        const temp = await fs.readFile('/sys/class/thermal/thermal_zone0/temp', 'utf8');
        return (parseInt(temp) / 1000).toFixed(1);
    } catch (error) {
        console.error("Error getting CPU temperature:", error);
        return 'N/A';
    }
}

async function getDiskSpace() {
    try {
        if (os.platform() === 'win32') {
            const { stdout } = await exec('wmic logicaldisk get size,freespace,caption');
            const lines = stdout.trim().split('\n').slice(1);
            const total = lines.reduce((acc, line) => acc + parseInt(line.trim().split(/\s+/)[1]), 0);
            const free = lines.reduce((acc, line) => acc + parseInt(line.trim().split(/\s+/)[2]), 0);
            const used = total - free;
            return { total, used, free, usedPercentage: ((used / total) * 100).toFixed(2) };
        } else {
            const { stdout } = await exec('df -k / | tail -1');
            const [, total, used, free] = stdout.trim().split(/\s+/);
            return {
                total: parseInt(total) * 1024,
                used: parseInt(used) * 1024,
                free: parseInt(free) * 1024,
                usedPercentage: ((parseInt(used) / parseInt(total)) * 100).toFixed(2)
            };
        }
    } catch (error) {
        console.error("Error getting disk space:", error);
        return { total: 0, used: 0, free: 0, usedPercentage: '0' };
    }
}

async function getCommandsToday() {
    const date = new Date().toISOString().split('T')[0];
    const logPath = path.join(__dirname, '..', 'logs', `${date}.log`);
    try {
        const log = await fs.readFile(logPath, 'utf8');
        return log.split('\n').length - 1;
    } catch (error) {
        console.error("Error getting commands today:", error);
        return 0;
    }
}

async function getMostUsedCommand() {
    const date = new Date().toISOString().split('T')[0];
    const logPath = path.join(__dirname, '..', 'logs', `${date}.log`);
    try {
        const log = await fs.readFile(logPath, 'utf8');
        const commands = log.split('\n').map(line => line.split(' ')[1]);
        const commandCounts = commands.reduce((acc, cmd) => {
            acc[cmd] = (acc[cmd] || 0) + 1;
            return acc;
        }, {});
        const mostUsed = Object.entries(commandCounts).sort((a, b) => b[1] - a[1])[0];
        return mostUsed ? `${mostUsed[0]} (${mostUsed[1]} times)` : 'N/A';
    } catch (error) {
        console.error("Error getting most used command:", error);
        return 'N/A';
    }
}

async function logCommand(userId, threadId, option) {
    const date = new Date().toISOString().split('T')[0];
    const logPath = path.join(__dirname, '..', 'logs', `${date}.log`);
    const logEntry = `${new Date().toISOString()} uptime ${option} ${userId} ${threadId}\n`;
    try {
        await fs.appendFile(logPath, logEntry);
    } catch (error) {
        console.error("Error logging command:", error);
    }
}

function getThemeColors(theme) {
    const themes = {
        default: { highlight: '🔵', subheading: '🔹', text: '' },
        dark: { highlight: '⚪', subheading: '🔘', text: '' },
        light: { highlight: '⚫', subheading: '◼️', text: '' },
        custom: { highlight: '🟣', subheading: '🟡', text: '' }
    };
    return themes[theme] || themes.default;
}

const authorSignature = crypto.createHash('sha256').update("Raphael Scholar").digest('hex');
if (module.exports.config.author !== "Raphael Scholar" || crypto.createHash('sha256').update(module.exports.config.author).digest('hex') !== authorSignature) {
    throw new Error("Unauthorized: Author verification failed.");
}