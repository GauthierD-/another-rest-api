FROM node:10.12.0-alpine

MAINTAINER Gauthier Deroo <g.deroo@gmail.com>

ARG COMMIT

ENV DOCKER_USER node
ENV HOME /home/$DOCKER_USER
ENV COMMIT=$COMMIT
ENV PORT 8000

RUN apk add --no-cache make gcc g++ python ca-certificates openssl libc6-compat musl-dev git --repository http://dl-2.alpinelinux.org/alpine/v3.4/main/
RUN wget -O /usr/local/bin/dumb-init https://github.com/Yelp/dumb-init/releases/download/v1.2.2/dumb-init_1.2.2_amd64
RUN chmod +x /usr/local/bin/dumb-init

USER $DOCKER_USER

WORKDIR $HOME

ENTRYPOINT ["/usr/local/bin/dumb-init", "--"]

COPY package.json .
COPY package-lock.json .

RUN npm set progress=false && npm config set depth 0
RUN npm install --only=production --no-package-lock

COPY config config/
COPY src src/

EXPOSE $PORT
CMD ["npm", "start"]
