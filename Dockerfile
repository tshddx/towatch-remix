FROM node:24-trixie-slim

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=8080

COPY package.json package-lock.json ./
RUN npm ci --omit=dev

COPY . .

RUN mkdir -p /data/sessions

EXPOSE 8080

CMD ["npm", "run", "start"]
