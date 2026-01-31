FROM node:18-bookworm

# Python සහ yt-dlp install කිරීම
RUN apt-get update && apt-get install -y python3 python3-pip && \
    pip3 install --no-cache-dir -U yt-dlp --break-system-packages

WORKDIR /app

# Dependencies install කිරීම
COPY package*.json ./
RUN npm install

# ඉතිරි සියලුම ෆයිල් copy කිරීම
COPY . .

# Port එක open කිරීම
EXPOSE 7860

CMD ["node", "index.js"]
