const express = require('express');
const { exec } = require('child_process');
const fs = require('fs');
const app = express();
const PORT = process.env.PORT || 7860;

// Render Secret එකෙන් Cookies ෆයිල් එකක් හදනවා
if (process.env.YT_COOKIES) {
    fs.writeFileSync('cookies.txt', process.env.YT_COOKIES);
    console.log("✅ Cookies loaded from Secret to cookies.txt");
}

app.get('/', (req, res) => {
    res.json({ status: "Online", tool: "yt-dlp (Python Version)" });
});

app.get('/download', (req, res) => {
    const videoUrl = req.query.url;

    if (!videoUrl) {
        return res.status(400).json({ error: 'URL required' });
    }

    console.log(`📥 Processing: ${videoUrl}`);

    // yt-dlp Command එක හදනවා
    // --cookies cookies.txt : Cookies පාවිච්චි කරන්න
    // -f bestaudio : Audio විතරක් ගන්න
    // --get-url : Download නොකර Link එක විතරක් එවන්න
    
    let command = `yt-dlp -f bestaudio --get-url --no-warnings "${videoUrl}"`;

    // Cookies file එක තියෙනවා නම් විතරක් ඒක පාවිච්චි කරන්න
    if (fs.existsSync('cookies.txt')) {
        command = `yt-dlp -f bestaudio --get-url --cookies cookies.txt --no-warnings "${videoUrl}"`;
    }

    exec(command, (error, stdout, stderr) => {
        if (error) {
            console.error(`❌ Error: ${stderr}`);
            // Bot error එකක් ආවොත් කියනවා
            if (stderr.includes("Sign in")) {
                return res.status(403).json({ error: "YouTube Blocked IP. Need valid cookies." });
            }
            return res.status(500).json({ error: "Download Failed", details: stderr });
        }

        // Output එකෙන් Link එක ගන්නවා
        const audioUrl = stdout.trim();
        
        // අමතර විස්තර ගන්න ඕනේ නම් තව command එකක් run කරන්න වෙනවා, 
        // නමුත් දැනට ලින්ක් එක විතරක් යවමු.
        res.json({
            success: true,
            audio_url: audioUrl
        });
        
        console.log("✅ Success!");
    });
});

app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));const express = require('express');
const { exec } = require('child_process');
const fs = require('fs');
const app = express();
const PORT = process.env.PORT || 7860;

// Render Secret එකෙන් Cookies ෆයිල් එකක් හදනවා
if (process.env.YT_COOKIES) {
    fs.writeFileSync('cookies.txt', process.env.YT_COOKIES);
    console.log("✅ Cookies loaded from Secret to cookies.txt");
}

app.get('/', (req, res) => {
    res.json({ status: "Online", tool: "yt-dlp (Python Version)" });
});

app.get('/download', (req, res) => {
    const videoUrl = req.query.url;

    if (!videoUrl) {
        return res.status(400).json({ error: 'URL required' });
    }

    console.log(`📥 Processing: ${videoUrl}`);

    // yt-dlp Command එක හදනවා
    // --cookies cookies.txt : Cookies පාවිච්චි කරන්න
    // -f bestaudio : Audio විතරක් ගන්න
    // --get-url : Download නොකර Link එක විතරක් එවන්න
    
    let command = `yt-dlp -f bestaudio --get-url --no-warnings "${videoUrl}"`;

    // Cookies file එක තියෙනවා නම් විතරක් ඒක පාවිච්චි කරන්න
    if (fs.existsSync('cookies.txt')) {
        command = `yt-dlp -f bestaudio --get-url --cookies cookies.txt --no-warnings "${videoUrl}"`;
    }

    exec(command, (error, stdout, stderr) => {
        if (error) {
            console.error(`❌ Error: ${stderr}`);
            // Bot error එකක් ආවොත් කියනවා
            if (stderr.includes("Sign in")) {
                return res.status(403).json({ error: "YouTube Blocked IP. Need valid cookies." });
            }
            return res.status(500).json({ error: "Download Failed", details: stderr });
        }

        // Output එකෙන් Link එක ගන්නවා
        const audioUrl = stdout.trim();
        
        // අමතර විස්තර ගන්න ඕනේ නම් තව command එකක් run කරන්න වෙනවා, 
        // නමුත් දැනට ලින්ක් එක විතරක් යවමු.
        res.json({
            success: true,
            audio_url: audioUrl
        });
        
        console.log("✅ Success!");
    });
});

app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));const express = require('express');
const { exec } = require('child_process');
const fs = require('fs');
const app = express();
const PORT = process.env.PORT || 7860;

// Render Secret එකෙන් Cookies ෆයිල් එකක් හදනවා
if (process.env.YT_COOKIES) {
    fs.writeFileSync('cookies.txt', process.env.YT_COOKIES);
    console.log("✅ Cookies loaded from Secret to cookies.txt");
}

app.get('/', (req, res) => {
    res.json({ status: "Online", tool: "yt-dlp (Python Version)" });
});

app.get('/download', (req, res) => {
    const videoUrl = req.query.url;

    if (!videoUrl) {
        return res.status(400).json({ error: 'URL required' });
    }

    console.log(`📥 Processing: ${videoUrl}`);

    // yt-dlp Command එක හදනවා
    // --cookies cookies.txt : Cookies පාවිච්චි කරන්න
    // -f bestaudio : Audio විතරක් ගන්න
    // --get-url : Download නොකර Link එක විතරක් එවන්න
    
    let command = `yt-dlp -f bestaudio --get-url --no-warnings "${videoUrl}"`;

    // Cookies file එක තියෙනවා නම් විතරක් ඒක පාවිච්චි කරන්න
    if (fs.existsSync('cookies.txt')) {
        command = `yt-dlp -f bestaudio --get-url --cookies cookies.txt --no-warnings "${videoUrl}"`;
    }

    exec(command, (error, stdout, stderr) => {
        if (error) {
            console.error(`❌ Error: ${stderr}`);
            // Bot error එකක් ආවොත් කියනවා
            if (stderr.includes("Sign in")) {
                return res.status(403).json({ error: "YouTube Blocked IP. Need valid cookies." });
            }
            return res.status(500).json({ error: "Download Failed", details: stderr });
        }

        // Output එකෙන් Link එක ගන්නවා
        const audioUrl = stdout.trim();
        
        // අමතර විස්තර ගන්න ඕනේ නම් තව command එකක් run කරන්න වෙනවා, 
        // නමුත් දැනට ලින්ක් එක විතරක් යවමු.
        res.json({
            success: true,
            audio_url: audioUrl
        });
        
        console.log("✅ Success!");
    });
});

app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
