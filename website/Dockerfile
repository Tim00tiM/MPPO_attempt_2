FROM node:alpine3.15

WORKDIR /website
COPY package.json /website
RUN npm i 
COPY . /website
EXPOSE 5173

CMD ["npx", "vite", "dev"]