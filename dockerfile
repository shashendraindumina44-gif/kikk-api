# Python 3.10 සහ Node.js 18 එකට තියෙන image එකක් පාවිච්චි කරමු
FROM node:18-bullseye-slim

# අවශ්‍ය system දේවල් install කිරීම
RUN apt-get update && \
    apt-get install -y python3 python3-pip ffmpeg curl && \
    apt-get clean

# Python 3.10 හෝ ඊට වැඩි එකක් තියෙනවද බලන්න සහ 
# yt-dlp අලුත්ම version එක download කිරීම
RUN curl -L https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp -o /usr/local/bin/yt-dlp && \
    chmod a+rx /usr/local/bin/yt-dlp

# වැඩ කරන තැන (App directory)
WORKDIR /app

# Dependencies install කිරීම
COPY package*.json ./
RUN npm install

# මුළු code එකම copy කිරීම
COPY . .

# Port එක open කිරීම
EXPOSE 7860

# App එක start කිරීම
CMD ["node", "index.js"]
