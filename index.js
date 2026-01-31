const express = require('express');
const ytdl = require('@distube/ytdl-core');
const app = express();
const PORT = process.env.PORT || 7860;

app.get('/', (req, res) => {
    res.json({ status: "API Online", provider: "Render + VPN" });
});

app.get('/download', async (req, res) => {
    const videoUrl = req.query.url;

    if (!videoUrl) {
        return res.status(400).json({ error: 'සින්දුවේ URL එක ඇතුළත් කරන්න.' });
    }

    try {
        console.log(`📥 Processing: ${videoUrl}`);

        // සින්දුවේ විස්තර ලබා ගැනීම
        const info = await ytdl.getInfo(videoUrl);
        
        // හොඳම quality audio format එක තෝරා ගැනීම
        const format = ytdl.chooseFormat(info.formats, { 
            quality: 'highestaudio', 
            filter: 'audioonly' 
        });

        res.json({
            success: true,
            title: info.videoDetails.title,
            audio_url: format.url,
            author: info.videoDetails.author.name,
            thumbnail: info.videoDetails.thumbnails[0].url,
            duration: info.videoDetails.lengthSeconds + " seconds"
        });

        console.log(`✅ Success: ${info.videoDetails.title}`);

    } catch (error) {
        console.error('❌ API ERROR:', error.message);
        res.status(500).json({ 
            error: 'සින්දුව ලබා ගැනීමට අපොහොසත් විය.', 
            details: error.message 
        });
    }
});

app.listen(PORT, () => console.log(`🚀 API is running on port ${PORT}`));
