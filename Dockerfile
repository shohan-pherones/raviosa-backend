FROM node:18-alpine AS builder

ENV NODE_ENV=development

WORKDIR /app

COPY package*.json ./

RUN apk update && \ 
    apk add --no-cache make gcc g++ && \ 
    apk add --no-cache python3 || apk add --no-cache python && \ 
    npm install && \ 
    npm install bcrypt --force && \ 
    apk del make gcc g++

COPY . .

RUN npm run build

FROM node:18-alpine

ENV NODE_ENV=development

WORKDIR /app

COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist

EXPOSE 4000

CMD ["npm", "start"]