FROM postgres

RUN echo "alias ll='ls -alF'" >> ~/.bashrc
RUN echo "alias cls='clear; printf \"\033[3J\"'" >> ~/.bashrc
RUN echo "set mouse-=a\nset expandtab\nset shiftwidth=4\nset tabstop=4\n" > ~/.vimrc

RUN ["apt-get", "update"]
RUN ["apt-get", "install", "-y", "vim"]

COPY ./postgres/docker-entrypoint-initdb.d/ /docker-entrypoint-initdb.d/
COPY --chmod=0600 ./secrets/POSTGRES_PASSWORD.private /root/.pgpass

EXPOSE 5432
