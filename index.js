const express = require('express');
const { exec, execSync } = require('child_process');
const fs = require('fs');
const app = express();
const PORT = process.env.PORT || 7860;

// Cookies configuration
if (process.env.YT_COOKIES) {
    fs.writeFileSync('cookies.txt', process.env.YT_COOKIES.trim());
    console.log('🍪 Cookies loaded');
}

app.get('/', (req, res) => {
    res.json({ status: "Online", engine: "yt-dlp" });
});

app.get('/download', (req, res) => {
    const videoUrl = req.query.url;
    if (!videoUrl) return res.status(400).json({ error: 'URL required' });

    console.log(`📥 Request URL: ${videoUrl}`);

    // Command එක සරල කරමු: -g කියන්නේ URL එක විතරක් ගන්න එක
    // m4a වලට priority දෙනවා ඒක ගොඩක් වෙලාවට වැඩ කරන නිසා
    let command = `yt-dlp -f "ba[ext=m4a]/ba/best" -g --no-playlist --no-check-certificates `;
    
    if (fs.existsSync('cookies.txt')) {
        command += `--cookies cookies.txt `;
    }
    
    command += `"${videoUrl}"`;

    exec(command, { timeout: 40000 }, (error, stdout, stderr) => {
        if (error) {
            console.error(`❌ YT-DLP Error: ${stderr}`);
            // Error එක 500 විදියට යවන්නේ නැතුව 200 විදියටම යවමු Bot එකට තේරුම් ගන්න ලේසි වෙන්න
            return res.status(200).json({ 
                success: false, 
                error: "YouTube Blocked or Format Error",
                details: stderr.split('\n')[0]
            });
        }

        const urls = stdout.trim().split('\n');
        const finalUrl = urls[0]; // පළවෙනි URL එක ගමු

        if (finalUrl && finalUrl.startsWith('http')) {
            console.log(`✅ Success!`);
            return res.json({
                success: true,
                audio_url: finalUrl
            });
        } else {
            return res.json({
                success: false,
                error: "Invalid URL returned from YouTube"
            });
        }
    });
});

// Server crash වීම වැළැක්වීමට
process.on('uncaughtException', (err) => {
    console.error('Critical Error:', err.message);
});

app.listen(PORT, () => console.log(`🚀 API Running on port ${PORT}`));
