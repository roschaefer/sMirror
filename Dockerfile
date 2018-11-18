FROM node:10-alpine
EXPOSE 8080
ENV HOST 0.0.0.0


ARG WORKDIR=/sMirror
RUN mkdir -p $WORKDIR
WORKDIR $WORKDIR

# See: https://github.com/nodejs/docker-node/pull/367#issuecomment-430807898
RUN apk --no-cache add git

COPY package.json .
COPY package-lock.json .
RUN npm install

RUN mkdir -p slave/displays
COPY slave/displays/package.json slave/displays/
COPY slave/displays/package-lock.json slave/displays/
RUN cd slave/displays && npm install

COPY . .
RUN cd slave/displays && npm run-script build

CMD node proxy.js

