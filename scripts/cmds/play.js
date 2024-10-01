const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

const SPOTIFY_CLIENT_ID = "138ff8d23e264edba4d5838c811056ce";
const SPOTIFY_CLIENT_SECRET = "e3578c75d5e04cf59f21af566ef877cd";

module.exports = {
  config: {
    name: "play",
    aliases: ["spot"],
    version: "1.0.0",
    author: "Raphael scholar",
    role: 0,
    countDown: 5,
    shortDescription: {
      en: "Search and download songs from Spotify"
    },
    longDescription: {
      en: "Search for songs by name on Spotify and download them."
    },
    category: "music",
    guide: {
      en: "{prefix} Spotify (Song name) or (Spotify link)"
    }
  },

  getSpotifyToken: async function () {
    const tokenRes = await axios.post("https://accounts.spotify.com/api/token", new URLSearchParams({
      grant_type: "client_credentials"
    }).toString(), {
      headers: {
        "Authorization": `Basic ${Buffer.from(`${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`).toString('base64')}`,
        "Content-Type": "application/x-www-form-urlencoded"
      }
    });
    return tokenRes.data.access_token;
  },

  searchSpotifyTrack: async function (trackName, token) {
    const searchRes = await axios.get(`https://api.spotify.com/v1/search`, {
      headers: {
        "Authorization": `Bearer ${token}`
      },
      params: {
        q: trackName,
        type: "track",
        limit: 1
      }
    });

    if (searchRes.data.tracks.items.length === 0) {
      throw new Error("No track found with the given name.");
    }

    return searchRes.data.tracks.items[0];
  },

  onStart: async function ({ api, event, args }) {
    try {
      const trackName = args.join(" ").trim();

      if (!trackName) {
        return api.sendMessage(`Please provide a song name.\nFormat: ${this.config.guide.en}`, event.threadID, event.messageID);
      }

      const spotifyToken = await this.getSpotifyToken();

      const track = await this.searchSpotifyTrack(trackName, spotifyToken);
      const trackUrl = track.external_urls.spotify;

      const res = await axios.get(`https://for-devs.onrender.com/api/spotify/download?url=${encodeURIComponent(trackUrl)}&apikey=r-7cd80a49b615844502527915`);
      const songData = res.data;
//API Author Rishad Mirage

      if (!songData || !songData.downloadUrl) {
        return api.sendMessage(`Unable to download song for "${trackName}". Please try again.`, event.threadID, event.messageID);
      }

      const songPath = path.join(__dirname, 'cache', `${songData.id}.mp3`);

      const songResponse = await axios.get(songData.downloadUrl, { responseType: 'arraybuffer' });
      await fs.outputFile(songPath, songResponse.data);
      await api.sendMessage({
        attachment: fs.createReadStream(songPath),
        body: `🎵 Title: ${songData.title}\n👤 Artists: ${songData.artists}`
      }, event.threadID, event.messageID);

//Do Not Change Author Name
      await fs.remove(songPath);
    } catch (error) {
      console.error(error);
      return api.sendMessage(`An error occurred. ${error.message}`, event.threadID, event.messageID);
    }
  }
};
