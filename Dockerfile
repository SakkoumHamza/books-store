FROM node:20

WORKDIR /app

COPY package-lock.json package.json .

RUN npm i --include=dev

COPY index.js dao.js ./

CMD npm start