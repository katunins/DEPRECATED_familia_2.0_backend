FROM node:18

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package.json ./

#RUN npm i -g npm@latest
COPY . .
RUN npm i
# If you are building your code for production
# RUN npm ci --only=production

# Bundle app source

EXPOSE 3000
CMD [ "npm", "run","start:dev" ]

