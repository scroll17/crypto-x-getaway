FROM node:18-bullseye

ENV HOME_DIR /home/app
ENV WEB_DIR $HOME_DIR/crypto_x_web

COPY ./client $WEB_DIR

WORKDIR $WEB_DIR
RUN npm install

EXPOSE $PORT