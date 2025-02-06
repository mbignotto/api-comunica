FROM node:20-bullseye

WORKDIR /app

RUN apt-get update && apt-get install -y python3 make g++ wait-for-it

COPY package*.json ./
COPY tsconfig.json .

RUN npm install --force && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

COPY . .

CMD ["./wait-for-it.sh", "postgres:5432", "--", "sh", "-c", "npm run migrate && npm run dev"]