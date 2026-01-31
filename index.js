const express = require('express');
const { exec, execSync } = require('child_process');
const fs = require('fs');
const app = express();
const PORT = process.env.PORT || 7860;

// Startup Checks
try {
    const pythonVersion = execSync('python3 --version').toString().trim();
    const ytdlpVersion = execSync('yt-dlp --version').toString().trim();
    console.log(`🐍 System: ${pythonVersion} | 📦 Tool: ${ytdlpVersion}`);
} catch (err) {
    console.error('❌ Missing Prerequisites:', err.message);
}

// Cookies Load කිරීම
if (process.env.YT_COOKIES) {
    fs.writeFileSync('cookies.txt', process.env.YT_COOKIES);
    console.log('🍪 Cookies loaded');
}

app.get('/', (req, res) => {
    res.json({ status: "Online", engine: "yt-dlp" });
});

app.get('/download', (req, res) => {
    const videoUrl = req.query.url;
    if (!videoUrl) return res.status(400).json({ error: 'URL required' });

    console.log(`📥 Processing: ${videoUrl}`);

    // Base Command එක
    let baseCmd = 'yt-dlp --get-url --no-playlist --no-check-certificates --no-warnings ';
    baseCmd += '--add-header "User-Agent:Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36" ';
    
    if (fs.existsSync('cookies.txt')) {
        baseCmd += '--cookies cookies.txt ';
    }

    // විවිධ format ක්‍රම උත්සාහ කිරීම
    const attempts = [
        `${baseCmd}-f "ba[ext=m4a]" "${videoUrl}"`, 
        `${baseCmd}-f "ba/b" "${videoUrl}"`,       
        `${baseCmd}"${videoUrl}"`                   
    ];

    let currentAttempt = 0;

    function tryDownload() {
        if (currentAttempt >= attempts.length) {
            return res.status(500).json({ error: "All attempts failed" });
        }

        exec(attempts[currentAttempt], { timeout: 35000 }, (error, stdout) => {
            if (error || !stdout.trim()) {
                currentAttempt++;
                tryDownload();
                return;
            }
            res.json({ success: true, audio_url: stdout.trim() });
        });
    }

    tryDownload();
});

app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
