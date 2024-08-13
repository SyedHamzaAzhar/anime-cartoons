FROM node:16 AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install
COPY . .

FROM node:16

WORKDIR /app

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/src ./src

EXPOSE 3000
CMD [ "npm", "start" ]
