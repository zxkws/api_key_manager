FROM node:23.4.0-alpine3.21
WORKDIR /app
COPY server/* package.json ./
RUN npm install
EXPOSE 3000
CMD ["node", "index.js"]