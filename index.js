const express = require('express');
const { exec } = require('child_process');
const fs = require('fs');
const app = express();
const PORT = process.env.PORT || 7860;

// Render Secret එකෙන් Cookies ෆයිල් එකක් හදනවා
if (process.env.YT_COOKIES) {
    fs.writeFileSync('cookies.txt', process.env.YT_COOKIES);
    console.log("✅ Cookies loaded");
}

app.get('/', (req, res) => {
    res.json({ status: "API Online", engine: "yt-dlp" });
});

app.get('/download', (req, res) => {
    const videoUrl = req.query.url;
    if (!videoUrl) return res.status(400).json({ error: 'URL required' });

    console.log(`📥 Processing: ${videoUrl}`);

    // වඩාත් සාර්ථක format එකක් (best audio)
    const format = "bestaudio/best";
    
    // Command එක සකස් කිරීම
    let command = `yt-dlp -f "${format}" --get-url --no-playlist --no-warnings "${videoUrl}"`;

    if (fs.existsSync('cookies.txt')) {
        command = `yt-dlp -f "${format}" --get-url --no-playlist --cookies cookies.txt --no-warnings "${videoUrl}"`;
    }

    exec(command, (error, stdout, stderr) => {
        if (error) {
            console.error(`❌ Error: ${stderr}`);
            return res.status(500).json({ error: "Failed", details: stderr });
        }

        const audioUrl = stdout.trim();
        res.json({
            success: true,
            audio_url: audioUrl
        });
    });
});

app.listen(PORT, () => console.log(`🚀 Running on port ${PORT}`));
