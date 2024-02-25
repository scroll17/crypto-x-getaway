FROM node:18-bullseye

ENV HOME_DIR /home/app
ENV WEB_DIR $HOME_DIR/crypto_x_web

WORKDIR $WEB_DIR

COPY ./client/package*.json ./
RUN npm install

COPY ./client $WEB_DIR

EXPOSE $PORT