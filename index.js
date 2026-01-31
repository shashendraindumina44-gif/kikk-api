const express = require('express');
const { exec, execSync } = require('child_process');
const fs = require('fs');
const app = express();
const PORT = process.env.PORT || 7860;

// 1. Startup Checks (Prerequisites තිබේදැයි බැලීම)
try {
    const pythonVersion = execSync('python3 --version').toString().trim();
    const ytdlpVersion = execSync('yt-dlp --version').toString().trim();
    console.log(`🐍 System: ${pythonVersion} | 📦 Tool: ${ytdlpVersion}`);
} catch (err) {
    console.error('❌ Missing Prerequisites:', err.message);
}

// 2. Cookies Load කිරීම
if (process.env.YT_COOKIES) {
    fs.writeFileSync('cookies.txt', process.env.YT_COOKIES);
    console.log('🍪 Cookies configuration saved to cookies.txt');
}

app.get('/', (req, res) => {
    res.json({ status: "API Online", engine: "yt-dlp", version: "3.1.0" });
});

// 3. Main Download Endpoint
app.get('/download', (req, res) => {
    const videoUrl = req.query.url;
    if (!videoUrl) return res.status(400).json({ error: 'URL required' });

    console.log(`📥 Processing: ${videoUrl}`);

    // Base Command එක (හැම attempt එකකම පොදු කොටස)
    let baseCmd = 'yt-dlp --get-url --no-playlist --no-check-certificates --no-warnings ';
    baseCmd += '--add-header "User-Agent:Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36" ';
    
    if (fs.existsSync('cookies.txt')) {
        baseCmd += '--cookies cookies.txt ';
    }

    // උත්සාහ කළ යුතු විවිධ Format ක්‍රම 3ක්
    const attempts = [
        `${baseCmd}-f "ba[ext=m4a]" "${videoUrl}"`, // 1. Best M4A Audio
        `${baseCmd}-f "ba/b" "${videoUrl}"`,       // 2. Any Audio or Best Video+Audio
        `${baseCmd}"${videoUrl}"`                   // 3. Default (No format spec)
    ];

    let currentAttempt = 0;

    function tryDownload() {
        if (currentAttempt >= attempts.length) {
            return res.status(500).json({ 
                success: false,
                error: "All download attempts failed",
                details: "YouTube may have blocked this IP or the link is invalid."
            });
        }

        const command = attempts[currentAttempt];
        console.log(`🔄 Attempt ${currentAttempt + 1}: Executing...`);

        exec(command, { timeout: 35000 }, (error, stdout, stderr) => {
            if (error) {
                console.error(`⚠️ Attempt ${currentAttempt + 1} failed.`);
                currentAttempt++;
                tryDownload(); // ඊළඟ ක්‍රමය උත්සාහ කරයි
                return;
            }

            const resultUrl = stdout.trim();
            if (resultUrl && resultUrl.startsWith('http')) {
                console.log(`✅ Success with method ${currentAttempt + 1}`);
                return res.json({
                    success: true,
                    audio_url: resultUrl,
                    method_used: currentAttempt + 1
                });
            } else {
                currentAttempt++;
                tryDownload();
            }
        });
    }

    tryDownload();
});

// 4. Debug Endpoint (Formats බැලීමට)
app.get('/debug', (req, res) => {
    const videoUrl = req.query.url;
    if (!videoUrl) return res.status(400).json({ error: 'URL required' });

    let debugCmd = `yt-dlp --list-formats "${videoUrl}"`;
    if (fs.existsSync('cookies.txt')) debugCmd += ` --cookies cookies.txt`;

    exec(debugCmd, (error, stdout, stderr) => {
        if (error) return res.status(500).send(`<pre>Error:\n${stderr}</pre>`);
        res.send(`<h3>Available Formats:</h3><pre>${stdout}</pre>`);
    });
});

app.listen(PORT, () => console.log(`🚀 API Server running on port ${PORT}`));const express = require('express');
const { exec, execSync } = require('child_process');
const fs = require('fs');
const app = express();
const PORT = process.env.PORT || 7860;

// 1. Startup Checks (Prerequisites තිබේදැයි බැලීම)
try {
    const pythonVersion = execSync('python3 --version').toString().trim();
    const ytdlpVersion = execSync('yt-dlp --version').toString().trim();
    console.log(`🐍 System: ${pythonVersion} | 📦 Tool: ${ytdlpVersion}`);
} catch (err) {
    console.error('❌ Missing Prerequisites:', err.message);
}

// 2. Cookies Load කිරීම
if (process.env.YT_COOKIES) {
    fs.writeFileSync('cookies.txt', process.env.YT_COOKIES);
    console.log('🍪 Cookies configuration saved to cookies.txt');
}

app.get('/', (req, res) => {
    res.json({ status: "API Online", engine: "yt-dlp", version: "3.1.0" });
});

// 3. Main Download Endpoint
app.get('/download', (req, res) => {
    const videoUrl = req.query.url;
    if (!videoUrl) return res.status(400).json({ error: 'URL required' });

    console.log(`📥 Processing: ${videoUrl}`);

    // Base Command එක (හැම attempt එකකම පොදු කොටස)
    let baseCmd = 'yt-dlp --get-url --no-playlist --no-check-certificates --no-warnings ';
    baseCmd += '--add-header "User-Agent:Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36" ';
    
    if (fs.existsSync('cookies.txt')) {
        baseCmd += '--cookies cookies.txt ';
    }

    // උත්සාහ කළ යුතු විවිධ Format ක්‍රම 3ක්
    const attempts = [
        `${baseCmd}-f "ba[ext=m4a]" "${videoUrl}"`, // 1. Best M4A Audio
        `${baseCmd}-f "ba/b" "${videoUrl}"`,       // 2. Any Audio or Best Video+Audio
        `${baseCmd}"${videoUrl}"`                   // 3. Default (No format spec)
    ];

    let currentAttempt = 0;

    function tryDownload() {
        if (currentAttempt >= attempts.length) {
            return res.status(500).json({ 
                success: false,
                error: "All download attempts failed",
                details: "YouTube may have blocked this IP or the link is invalid."
            });
        }

        const command = attempts[currentAttempt];
        console.log(`🔄 Attempt ${currentAttempt + 1}: Executing...`);

        exec(command, { timeout: 35000 }, (error, stdout, stderr) => {
            if (error) {
                console.error(`⚠️ Attempt ${currentAttempt + 1} failed.`);
                currentAttempt++;
                tryDownload(); // ඊළඟ ක්‍රමය උත්සාහ කරයි
                return;
            }

            const resultUrl = stdout.trim();
            if (resultUrl && resultUrl.startsWith('http')) {
                console.log(`✅ Success with method ${currentAttempt + 1}`);
                return res.json({
                    success: true,
                    audio_url: resultUrl,
                    method_used: currentAttempt + 1
                });
            } else {
                currentAttempt++;
                tryDownload();
            }
        });
    }

    tryDownload();
});

// 4. Debug Endpoint (Formats බැලීමට)
app.get('/debug', (req, res) => {
    const videoUrl = req.query.url;
    if (!videoUrl) return res.status(400).json({ error: 'URL required' });

    let debugCmd = `yt-dlp --list-formats "${videoUrl}"`;
    if (fs.existsSync('cookies.txt')) debugCmd += ` --cookies cookies.txt`;

    exec(debugCmd, (error, stdout, stderr) => {
        if (error) return res.status(500).send(`<pre>Error:\n${stderr}</pre>`);
        res.send(`<h3>Available Formats:</h3><pre>${stdout}</pre>`);
    });
});

app.listen(PORT, () => console.log(`🚀 API Server running on port ${PORT}`));
