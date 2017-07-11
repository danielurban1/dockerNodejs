FROM node:7.10.0


WORKDIR /usr

COPY . .

WORKDIR /usr/app

RUN pwd

RUN npm install -y --quiet -g gulp node-gyp yo bower gulp-cli  generator-webapp pm2 
RUN npm install 
RUN bower install --allow-root
RUN apt-get -y update && apt-get -y install mc htop wget telnet




#COPY . .

#WORKDIR /usr/app


#RUN npm install --quiet



