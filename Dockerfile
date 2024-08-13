FROM node:18 AS builder

WORKDIR /usr/app

COPY package*.json ./
RUN npm install
COPY . .

FROM node:18

WORKDIR /usr/app

COPY --from=builder /usr/app/node_modules ./node_modules
COPY --from=builder /usr/app/package*.json ./
COPY --from=builder /usr/app/src ./src

EXPOSE 3000
CMD [ "npm", "start" ]
