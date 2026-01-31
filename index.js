const express = require('express');
const ytdl = require('@distube/ytdl-core');
const app = express();
const PORT = process.env.PORT || 7860;

app.get('/download', async (req, res) => {
    const videoUrl = req.query.url;
    if (!videoUrl) return res.status(400).json({ error: 'URL required' });

    try {
        console.log(`📥 Processing: ${videoUrl}`);

        const options = {
            requestOptions: {
                headers: {
                    // Render variable එකෙන් cookies ගන්නවා
                    'cookie': process.env.YT_COOKIES || '',
                    'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
                    'accept': '*/*',
                    'accept-language': 'en-US,en;q=0.9',
                    'origin': 'https://www.youtube.com',
                    'referer': 'https://www.youtube.com/'
                }
            }
        };

        const info = await ytdl.getInfo(videoUrl, options);
        
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

app.listen(PORT, () => console.log(`🚀 API is running on port ${PORT}`));
