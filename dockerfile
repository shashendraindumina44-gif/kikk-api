# Node.js සහ Python තියෙන Image එකක් ගන්නවා
FROM node:18-bullseye-slim

# System එකට අවශ්‍ය දේවල් install කරනවා (Python, Pip, FFmpeg)
RUN apt-get update && \
    apt-get install -y python3 python3-pip ffmpeg curl && \
    apt-get clean

# yt-dlp අලුත්ම version එක කෙලින්ම download කරනවා
RUN curl -L https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp -o /usr/local/bin/yt-dlp
RUN chmod a+rx /usr/local/bin/yt-dlp

# App එක setup කරනවා
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .

# Port එක open කරනවා
EXPOSE 7860

# App එක start කරනවා
CMD ["node", "index.js"]
