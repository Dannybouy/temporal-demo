FROM node:20-bullseye

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

RUN test -f dist/worker.js || (echo "Build failed: dist/worker.js not found" && exit 1)

RUN npm prune --production

EXPOSE 9090

HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 CMD node -e "require('http').get('http://localhost:9090/health', res => { process.exit(res.statusCode === 200 ? 0 : 1); });"

CMD ["node", "dist/worker.js"]