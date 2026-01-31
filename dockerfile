# Debian Bookworm පාවිච්චි කිරීමෙන් Python 3.11 ලබාගත හැක
FROM node:18-bookworm-slim

# අවශ්‍ය system පද්ධති install කිරීම
RUN apt-get update && \
    apt-get install -y python3 python3-pip ffmpeg curl && \
    apt-get clean

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
