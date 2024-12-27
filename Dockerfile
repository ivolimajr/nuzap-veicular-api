# Etapa 1: Construir a aplicação
FROM node:20 AS builder

# Define o diretório de trabalho dentro do contêiner
WORKDIR /app

# Copia os arquivos necessários para instalar dependências
COPY package*.json ./
COPY tsconfig*.json ./

# Instala as dependências
RUN npm install

# Instalar o curl usando apk
RUN apk add --no-cache curl

# Copia o restante do código para o contêiner
COPY . .

# Faz o build da aplicação
RUN npm run build

# Etapa 2: Servir a aplicação
FROM node:20-alpine

# Define o diretório de trabalho dentro do contêiner
WORKDIR /app

# Copia os artefatos de build da etapa anterior
COPY --from=builder /app/dist ./dist
COPY package*.json ./
# Copia o arquivo .env para o contêiner
# COPY .env ./

# Instala apenas as dependências de produção
RUN npm install --only=production

# Expõe a porta usada pela aplicação
EXPOSE 8080

# Define o comando para iniciar o servidor
CMD ["node", "dist/main.js"]
