const express = require('express');
const { exec } = require('child_process');
const fs = require('fs');
const app = express();
const PORT = process.env.PORT || 7860;

if (process.env.YT_COOKIES) {
    fs.writeFileSync('cookies.txt', process.env.YT_COOKIES.trim());
}

app.get('/', (req, res) => res.json({ status: "API Online" }));

app.get('/download', (req, res) => {
    const videoUrl = req.query.url;
    if (!videoUrl) return res.status(400).json({ error: 'URL required' });

    console.log(`📥 Request: ${videoUrl}`);

    // වඩාත්ම සාර්ථක Format එක (m4a වලට මුල් තැන)
    // -g flag එක පාවිච්චි කරලා direct ලින්ක් එක විතරක් ගන්නවා
    let command = `yt-dlp -f "ba[ext=m4a]/ba/best" -g --no-playlist --no-check-certificates `;
    
    if (fs.existsSync('cookies.txt')) {
        command += `--cookies cookies.txt `;
    }
    command += `"${videoUrl}"`;

    exec(command, { timeout: 60000 }, (error, stdout, stderr) => {
        if (error) {
            console.error(`❌ YT-DLP Error: ${stderr}`);
            // Bot එකට 500 යවන්නේ නැතුව, success: false කියලා ලස්සනට යවනවා
            return res.status(200).json({ 
                success: false, 
                error: "YouTube Restriction",
                details: stderr.split('\n')[0]
            });
        }

        const urls = stdout.trim().split('\n');
        const finalUrl = urls[0];

        if (finalUrl && finalUrl.startsWith('http')) {
            return res.json({ success: true, audio_url: finalUrl });
        } else {
            return res.json({ success: false, error: "Invalid link returned" });
        }
    });
});

app.listen(PORT, () => console.log(`🚀 API on ${PORT}`));
