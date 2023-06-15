FROM node:19-alpine

WORKDIR /app

COPY package.json .

RUN npm install

EXPOSE 800

COPY . .

CMD ["npm", "run", "Dev"]