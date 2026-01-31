const express = require('express');
const { exec, execSync } = require('child_process');
const fs = require('fs');
const app = express();
const PORT = process.env.PORT || 7860;

// Startup check: yt-dlp version එක log කිරීම
try {
    const version = execSync('yt-dlp --version').toString().trim();
    console.log(`📦 yt-dlp version: ${version}`);
} catch (e) {
    console.error("❌ yt-dlp not found!");
}

// Cookies load කිරීම
if (process.env.YT_COOKIES) {
    fs.writeFileSync('cookies.txt', process.env.YT_COOKIES.trim());
    console.log('🍪 Cookies loaded successfully');
}

app.get('/', (req, res) => res.json({ status: "Online", engine: "yt-dlp" }));

app.get('/download', (req, res) => {
    const videoUrl = req.query.url;
    if (!videoUrl) return res.status(400).json({ success: false, error: 'URL required' });

    console.log(`📥 Request: ${videoUrl}`);

    // වඩාත්ම සාර්ථක flags එකතු කර ඇත
    let command = `yt-dlp -f "ba[ext=m4a]/ba/best" -g --no-playlist --no-check-certificates `;
    command += `--no-warnings --force-ipv4 --ignore-config `;
    
    // Cookies තිබේ නම් පමණක් භාවිතා කරයි
    if (fs.existsSync('cookies.txt')) {
        command += `--cookies cookies.txt `;
    }

    command += `"${videoUrl}"`;

    exec(command, { timeout: 60000 }, (error, stdout, stderr) => {
        if (error) {
            console.error(`❌ Error: ${stderr}`);
            return res.json({ 
                success: false, 
                error: "YouTube Restriction", 
                details: stderr.split('\n')[0] 
            });
        }

        const urls = stdout.trim().split('\n');
        const audioUrl = urls[0];

        if (audioUrl && audioUrl.startsWith('http')) {
            console.log("✅ Link Generated");
            return res.json({ success: true, audio_url: audioUrl });
        } else {
            return res.json({ success: false, error: "Empty link returned" });
        }
    });
});

app.listen(PORT, () => console.log(`🚀 API Server on port ${PORT}`));
