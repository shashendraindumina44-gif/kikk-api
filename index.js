// ... පරණ කේතය ...

app.get('/download', (req, res) => {
    const videoUrl = req.query.url;

    if (!videoUrl) {
        return res.status(400).json({ error: 'URL required' });
    }

    console.log(`📥 Processing: ${videoUrl}`);

    // 🔥 අපි මෙතන format එක වෙනස් කරනවා: "ba/b" කියන්නේ bestaudio නැත්නම් best කියන එකයි.
    // ඒ වගේම --no-playlist දානවා වැරදිලා playlist එකක් ආවොත් ඒක නවත්තන්න.
    let formatParams = "-f \"ba/b\" --no-playlist --get-url --no-warnings";

    let command = `yt-dlp ${formatParams} "${videoUrl}"`;

    // Cookies file එක තියෙනවා නම් ඒක පාවිච්චි කරනවා
    if (fs.existsSync('cookies.txt')) {
        command = `yt-dlp ${formatParams} --cookies cookies.txt "${videoUrl}"`;
    }

    exec(command, (error, stdout, stderr) => {
        if (error) {
            console.error(`❌ Error: ${stderr}`);
            if (stderr.includes("Sign in")) {
                return res.status(403).json({ error: "YouTube Blocked IP. Need valid cookies." });
            }
            return res.status(500).json({ error: "Download Failed", details: stderr });
        }

        const audioUrl = stdout.trim();
        
        if (!audioUrl) {
             return res.status(500).json({ error: "No URL found" });
        }

        res.json({
            success: true,
            audio_url: audioUrl
        });
        
        console.log("✅ Success!");
    });
});

// ... පරණ කේතය ...// ... පරණ කේතය ...

app.get('/download', (req, res) => {
    const videoUrl = req.query.url;

    if (!videoUrl) {
        return res.status(400).json({ error: 'URL required' });
    }

    console.log(`📥 Processing: ${videoUrl}`);

    // 🔥 අපි මෙතන format එක වෙනස් කරනවා: "ba/b" කියන්නේ bestaudio නැත්නම් best කියන එකයි.
    // ඒ වගේම --no-playlist දානවා වැරදිලා playlist එකක් ආවොත් ඒක නවත්තන්න.
    let formatParams = "-f \"ba/b\" --no-playlist --get-url --no-warnings";

    let command = `yt-dlp ${formatParams} "${videoUrl}"`;

    // Cookies file එක තියෙනවා නම් ඒක පාවිච්චි කරනවා
    if (fs.existsSync('cookies.txt')) {
        command = `yt-dlp ${formatParams} --cookies cookies.txt "${videoUrl}"`;
    }

    exec(command, (error, stdout, stderr) => {
        if (error) {
            console.error(`❌ Error: ${stderr}`);
            if (stderr.includes("Sign in")) {
                return res.status(403).json({ error: "YouTube Blocked IP. Need valid cookies." });
            }
            return res.status(500).json({ error: "Download Failed", details: stderr });
        }

        const audioUrl = stdout.trim();
        
        if (!audioUrl) {
             return res.status(500).json({ error: "No URL found" });
        }

        res.json({
            success: true,
            audio_url: audioUrl
        });
        
        console.log("✅ Success!");
    });
});

// ... පරණ කේතය ...
