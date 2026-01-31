const express = require('express');
const { exec, execSync } = require('child_process');
const fs = require('fs');
const app = express();
const PORT = process.env.PORT || 7860;

// Startup checks
try {
    const pythonVersion = execSync('python3 --version').toString().trim();
    const ytdlpVersion = execSync('yt-dlp --version').toString().trim();
    console.log(`🐍 ${pythonVersion} | 📦 yt-dlp: ${ytdlpVersion}`);
} catch (err) {
    console.error('❌ Prerequisites missing:', err.message);
}

if (process.env.YT_COOKIES) {
    fs.writeFileSync('cookies.txt', process.env.YT_COOKIES);
    console.log('🍪 Cookies loaded');
}

app.get('/', (req, res) => {
    res.json({ status: "Online", engine: "yt-dlp", timestamp: new Date().toISOString() });
});

app.get('/download', (req, res) => {
    const videoUrl = req.query.url;
    
    if (!videoUrl || !videoUrl.includes('youtube.com') && !videoUrl.includes('youtu.be')) {
        return res.status(400).json({ error: 'Valid YouTube URL required' });
    }

    console.log(`📥 Processing: ${videoUrl}`);

    // YouTube එක රැවටීමට හොඳම headers සහ options
    const options = [
        '-f "ba/ba*/best"', // Best audio නැත්නම් ඕනෑම audio එකක්
        '--get-url',
        '--no-playlist',
        '--no-check-certificates',
        '--no-warnings',
        '--force-ipv4', // Cloud වලදී IPv6 block වෙන්න පුළුවන් නිසා
        '--add-header "User-Agent:Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36"',
        '--add-header "Accept-Language:en-US,en;q=0.9"',
        '--referer "https://www.youtube.com/"'
    ];

    if (fs.existsSync('cookies.txt')) {
        options.push('--cookies cookies.txt');
    }

    const command = `yt-dlp ${options.join(' ')} "${videoUrl}"`;

    exec(command, { timeout: 40000 }, (error, stdout, stderr) => {
        if (error) {
            console.error(`❌ Error: ${stderr}`);
            
            // Format ප්‍රශ්නයක් නම් විතරක් 'best' එක try කරනවා
            if (stderr.includes('Requested format is not available')) {
                const fallbackCmd = command.replace('-f "ba/ba*/best"', '-f "best"');
                exec(fallbackCmd, { timeout: 40000 }, (err2, out2) => {
                    if (err2) return res.status(500).json({ error: "YouTube Blocked", details: stderr.split('\n')[0] });
                    return res.json({ success: true, audio_url: out2.trim() });
                });
            } else {
                return res.status(500).json({ error: "Download Failed", details: stderr.split('\n')[0] });
            }
            return;
        }

        const audioUrl = stdout.trim();
        if (audioUrl) {
            res.json({ success: true, audio_url: audioUrl });
            console.log(`✅ Success!`);
        } else {
            res.status(500).json({ error: "No URL returned" });
        }
    });
});

app.listen(PORT, () => console.log(`🚀 API running on port ${PORT}`));
