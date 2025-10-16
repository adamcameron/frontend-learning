FROM node:24-bullseye

RUN echo "alias ll='ls -alF'" >> ~/.bashrc
RUN echo "alias cls='clear; printf \"\033[3J\"'" >> ~/.bashrc
RUN echo "set mouse-=a\nset expandtab\nset shiftwidth=4\nset tabstop=4\n" > ~/.vimrc

RUN ["apt-get", "update"]
RUN ["apt-get", "install", "-y", "zip", "unzip", "git", "vim"]

RUN ["apt-get", "install", "xdg-utils", "-y"]

WORKDIR  /usr/src/app
COPY package*.json ./
RUN npm install

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node --version || exit 1

EXPOSE 5173
EXPOSE 51204
