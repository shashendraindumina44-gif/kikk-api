const express = require('express');
const { exec } = require('child_process');
const cors = require('cors');
const app = express();

// Render එකෙන් දෙන Port එක පාවිච්චි කිරීම
const PORT = process.env.PORT || 3000;

app.use(cors());

app.get('/', (req, res) => {
    res.send('🚀 Master API is Online and Running!');
});

app.get('/download', (req, res) => {
    let videoUrl = req.query.url;
    
    if (!videoUrl) {
        return res.status(400).json({ success: false, error: "සින්දුවේ URL එකක් අවශ්‍යයි!" });
    }

    // URL එකේ "https://" නැත්නම් ඒක හරිගැස්සීම
    if (!videoUrl.startsWith('http')) {
        videoUrl = `https://www.youtube.com/watch?v=${videoUrl}`;
    }

    /**
     * yt-dlp පාවිච්චි කරලා direct ලින්ක් එක ලබා ගැනීම.
     * --get-url : direct ලින්ක් එක විතරක් ගන්නවා.
     * -f "bestaudio" : හොඳම audio එක විතරක් තෝරනවා.
     */
    const command = `python3 -m pip install -U yt-dlp && yt-dlp -f "bestaudio" --get-url "${videoUrl}"`;

    exec(command, (error, stdout, stderr) => {
        if (error) {
            console.error(`Error: ${error.message}`);
            return res.status(500).json({ success: false, error: "සින්දුව බාගත කිරීමට නොහැකි විය." });
        }
        
        const audioLink = stdout.trim();
        
        res.json({
            success: true,
            title: "YouTube Audio",
            audio_url: audioLink,
            server: "Render USA",
            owner: "Indumina"
        });
    });
});

app.listen(PORT, () => {
    console.log(`✅ Server is running on port ${PORT}`);
});
