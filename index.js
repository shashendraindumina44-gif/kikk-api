const express = require('express');
const ytdl = require('@distube/ytdl-core');
const app = express();
const PORT = process.env.PORT || 7860;

// 1. Render Secret එකෙන් Cookies JSON එක parse කරගැනීම
let cookies = [];
try {
    const rawCookies = process.env.YT_COOKIES || "[]";
    cookies = JSON.parse(rawCookies);
    console.log("✅ Cookies loaded successfully");
} catch (e) {
    console.error("❌ Cookie parsing error. Check if JSON is valid.");
}

// 2. අලුත් YTDL Agent එකක් නිර්මාණය කිරීම
// මෙය Bot detection මගහරින්න අත්‍යවශ්‍යයි
const agent = ytdl.createAgent(cookies);

app.get('/download', async (req, res) => {
    const videoUrl = req.query.url;

    if (!videoUrl) {
        return res.status(400).json({ error: 'කරුණාකර YouTube URL එකක් ලබා දෙන්න.' });
    }

    try {
        console.log(`📥 Processing Request for: ${videoUrl}`);

        // 3. Agent එක භාවිතා කරමින් Info ලබා ගැනීම
        const info = await ytdl.getInfo(videoUrl, { agent });
        
        const format = ytdl.chooseFormat(info.formats, { 
            quality: 'highestaudio', 
            filter: 'audioonly' 
        });

        res.json({
            success: true,
            title: info.videoDetails.title,
            audio_url: format.url,
            thumbnail: info.videoDetails.thumbnails[0].url,
            author: info.videoDetails.author.name
        });

        console.log(`✅ Success: ${info.videoDetails.title}`);

    } catch (error) {
        console.error('❌ API ERROR:', error.message);
        res.status(500).json({ 
            error: 'සින්දුව ලබා ගැනීමට නොහැකි විය.', 
            details: error.message 
        });
    }
});

app.listen(PORT, () => {
    console.log(`🚀 YouTube API is running on port ${PORT}`);
});
