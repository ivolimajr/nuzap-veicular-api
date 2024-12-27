# Etapa de construção
FROM node:22 AS builder
WORKDIR /app
COPY package*.json tsconfig*.json ./
RUN npm install
COPY . .
RUN npm run build

# Etapa final
FROM node:22-alpine
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
# Copia o arquivo .env para o contêiner apenas para teste local
# COPY .env ./
EXPOSE 8080
CMD ["node", "dist/main.js"]
