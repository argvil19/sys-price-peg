 
FROM node:10-alpine

USER node
RUN mkdir /home/node/node-app

WORKDIR /home/node/node-app
COPY package.json ./
RUN npm i

CMD [ "npm", "run", "dev" ]