# Etapa de construção
FROM node:22-alpine AS builder
WORKDIR /app

# Copia apenas os arquivos necessários para instalar dependências
COPY package*.json tsconfig*.json ./

# Instala as dependências sem salvar os caches para reduzir o tamanho
RUN npm install --no-cache

# Copia o restante do código para o contêiner
COPY . .

# Faz o build da aplicação
RUN npm run build

# Etapa final
FROM node:22-alpine
WORKDIR /app

# Copia apenas os artefatos necessários da etapa de construção
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules

# Copia o arquivo .env para o contêiner apenas para teste local
# COPY .env ./

# Exposição da porta
EXPOSE 8080

# Define o comando para iniciar a aplicação
CMD ["node", "dist/main.js"]
