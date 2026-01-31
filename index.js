const express = require('express');
const ytdl = require('@distube/ytdl-core');
const app = express();
const PORT = process.env.PORT || 7860;

app.get('/', (req, res) => {
    res.json({ status: "API Online", message: "Ready to download!" });
});

app.get('/download', async (req, res) => {
    const videoUrl = req.query.url;

    if (!videoUrl) {
        return res.status(400).json({ error: 'URL එක ඇතුළත් කරන්න.' });
    }

    try {
        console.log(`📥 Processing: ${videoUrl}`);

        // 1. Render Secret එකෙන් cookies සහ User-Agent එක සකස් කිරීම
        const options = {
            requestOptions: {
                headers: {
                    'cookie': process.env.YT_COOKIES || '', // Render වල දාපු Secret එක මෙතනට එනවා
                    'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36'
                }
            }
        };

        // 2. Options සමඟ සින්දුවේ විස්තර ලබා ගැනීම
        const info = await ytdl.getInfo(videoUrl, options);
        
        const format = ytdl.chooseFormat(info.formats, { 
            quality: 'highestaudio', 
            filter: 'audioonly' 
        });

        res.json({
            success: true,
            title: info.videoDetails.title,
            audio_url: format.url,
            author: info.videoDetails.author.name,
            thumbnail: info.videoDetails.thumbnails[0].url
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
