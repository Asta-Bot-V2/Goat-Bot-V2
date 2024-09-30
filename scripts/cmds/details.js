const axios = require('axios');
const fs = require('fs-extra');
const path = require('path');
const countryFlagEmoji = require('country-flag-emoji');

const config = {
    name: "details",
    version: "1.0.0",
    hasPermssion: 0,
    credits: "Raphael Scholar",
    description: "Get details about a user or thread",
    commandCategory: "utility",
    usages: "[user] [userID/username]",
    cooldowns: 5,
    dependencies: {
        'axios': '',
        'fs-extra': '',
        'country-flag-emoji': ''
    }
};

module.exports = {
    config,
    onStart: async function ({ api, event, args }) {
        const { threadID, senderID, messageID } = event;

        if (args[0] === 'user') {
            await handleUserDetails(api, event, args[1] || senderID);
        } else {
            await handleThreadDetails(api, event, threadID);
        }
    }
};

async function handleUserDetails(api, event, userIdentifier) {
    const { threadID, messageID } = event;
    try {
        let userID = userIdentifier;
        if (isNaN(userIdentifier)) {
            userID = await getUserIDFromUsername(api, userIdentifier);
        }

        const userInfo = await api.getUserInfo(userID);
        const user = userInfo[userID];

        if (!user) {
            return api.sendMessage('❌ User not found.', threadID, messageID);
        }

        const profilePicUrl = await getProfilePicture(api, userID);
        const downloadedProfilePic = profilePicUrl ? await downloadImage(profilePicUrl, `profile_${userID}.jpg`) : null;

        const gender = user.gender === 1 ? '👩 Female' : (user.gender === 2 ? '👨 Male' : '⚧️ Other');
        const birthday = user.birthday ? new Date(user.birthday).toLocaleDateString() : 'Not available';
        const relationship = getRelationshipStatus(user.relationship_status);

        const countryInfo = user.locale ? countryFlagEmoji.get(user.locale.split('_')[1]) : null;
        const countryFlag = countryInfo ? countryInfo.emoji : '🌎';

        const mutualFriends = await getMutualFriends(api, userID);
        const joinedGroups = await getJoinedGroups(api, userID);

        const creationDate = new Date(parseInt(userID.substring(0, 13))).toLocaleString();

        const message = `👤 User Details for ${user.name}:\n\n` +
            `🆔 ID: ${userID}\n` +
            `📛 Name: ${user.name}\n` +
            `⚧️ Gender: ${gender}\n` +
            `🎂 Birthday: ${birthday}\n` +
            `💑 Relationship: ${relationship}\n` +
            `${countryFlag} Locale: ${user.locale || 'Not available'}\n` +
            `🔗 Profile URL: https://facebook.com/${userID}\n` +
            `👥 Mutual Friends: ${mutualFriends}\n` +
            `👥 Joined Groups: ${joinedGroups}\n` +
            `🗓️ Account Created: ${creationDate}\n\n` +
            `✨ Vanity: ${user.vanity || 'Not set'}\n` +
            `📱 Device: ${getUserDevice(user)}\n` +
            `🌐 Last Active: ${new Date(user.lastActiveTimestamp * 1000).toLocaleString()}`;

        if (downloadedProfilePic) {
            api.sendMessage({ body: message, attachment: fs.createReadStream(downloadedProfilePic) }, threadID, () => {
                fs.unlinkSync(downloadedProfilePic);
            }, messageID);
        } else {
            api.sendMessage(message, threadID, messageID);
        }
    } catch (error) {
        console.error(error);
        api.sendMessage(`❌ An error occurred: ${error.message}`, threadID, messageID);
    }
}

async function handleThreadDetails(api, event, threadID) {
    try {
        const threadInfo = await api.getThreadInfo(threadID);
        const adminIDs = threadInfo.adminIDs.map(admin => admin.id);

        const totalMembers = threadInfo.participantIDs.length;
        const adminCount = adminIDs.length;
        const botCount = threadInfo.participantIDs.filter(id => api.getCurrentUserID() === id).length;
        
        const genderCounts = await getGenderCounts(api, threadInfo.participantIDs);

        const threadImageUrl = threadInfo.imageSrc;
        const downloadedThreadImage = threadImageUrl ? await downloadImage(threadImageUrl, `thread_${threadID}.jpg`) : null;

        const creationDate = new Date(threadInfo.threadID.substring(0, 13)).toLocaleString();

        const message = `📊 Group Details for ${threadInfo.threadName}:\n\n` +
            `🆔 Thread ID: ${threadID}\n` +
            `👥 Total Members: ${totalMembers}\n` +
            `👑 Admins: ${adminCount}\n` +
            `🤖 Bots: ${botCount}\n` +
            `👩 Females: ${genderCounts.female}\n` +
            `👨 Males: ${genderCounts.male}\n` +
            `⚧️ Other: ${genderCounts.other}\n` +
            `💬 Messages: ${threadInfo.messageCount}\n` +
            `🎭 Emoji: ${threadInfo.emoji}\n` +
            `🎨 Color: ${threadInfo.color}\n` +
            `🗓️ Created: ${creationDate}\n\n` +
            `📝 Description: ${threadInfo.description || 'No description set.'}`;

        if (downloadedThreadImage) {
            api.sendMessage({ body: message, attachment: fs.createReadStream(downloadedThreadImage) }, threadID, () => {
                fs.unlinkSync(downloadedThreadImage);
            }, event.messageID);
        } else {
            api.sendMessage(message, threadID, event.messageID);
        }
    } catch (error) {
        console.error(error);
        api.sendMessage(`❌ An error occurred: ${error.message}`, threadID, event.messageID);
    }
}

async function getProfilePicture(api, userID) {
    try {
        const profilePic = await api.getUserInfoV2(userID);
        return profilePic.avatar;
    } catch (error) {
        console.error('Error getting profile picture:', error);
        return null;
    }
}

async function downloadImage(url, fileName) {
    if (!url) return null;
    try {
        const response = await axios.get(url, { responseType: 'arraybuffer' });
        const filePath = path.join(__dirname, fileName);
        await fs.writeFile(filePath, response.data);
        return filePath;
    } catch (error) {
        console.error('Error downloading image:', error);
        return null;
    }
}

function getRelationshipStatus(status) {
    const statuses = {
        1: "Single",
        2: "In a relationship",
        3: "Engaged",
        4: "Married",
        5: "It's complicated",
        6: "In an open relationship",
        7: "Widowed",
        8: "Separated",
        9: "Divorced"
    };
    return statuses[status] || "Not specified";
}

function getUserDevice(user) {
    if (user.devices && user.devices.length > 0) {
        return user.devices[0].hardware;
    }
    return 'Unknown';
}

async function getJoinedGroups(api, userID) {
    try {
        const groups = await api.getThreadList(100, null, ['GROUP']);
        return groups.filter(group => group.participantIDs.includes(userID)).length;
    } catch (error) {
        console.error('Error getting joined groups:', error);
        return 0;
    }
}

async function getGenderCounts(api, participantIDs) {
    const counts = { male: 0, female: 0, other: 0 };
    try {
        const userInfo = await api.getUserInfo(participantIDs);
        
        for (const id in userInfo) {
            const user = userInfo[id];
            if (user.gender === 1) counts.female++;
            else if (user.gender === 2) counts.male++;
            else counts.other++;
        }
    } catch (error) {
        console.error('Error getting gender counts:', error);
    }
    return counts;
}

async function getMutualFriends(api, userID) {
    try {
        const friendList = await api.getFriendsList();
        const userFriends = await api.getUserFriends(userID);
        const mutualFriends = friendList.filter(friend => userFriends.includes(friend.userID));
        return mutualFriends.length;
    } catch (error) {
        console.error('Error getting mutual friends:', error);
        return 0;
    }
}

async function getUserIDFromUsername(api, username) {
    try {
        const response = await api.getUserID(username);
        if (response && response.length > 0) {
            return response[0].userID;
        }
        throw new Error('User not found');
    } catch (error) {
        console.error('Error getting user ID from username:', error);
        throw error;
    }
}