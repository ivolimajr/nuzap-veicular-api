FROM node:18-alpine

# Criar diretórios para o app e node_modules
RUN mkdir -p /home/node/src/node_modules && chown -R node:node /home/node/src

# Definir o diretório de trabalho na raiz do projeto
WORKDIR /home/node/app

# Copiar os arquivos de configuração do package.json
COPY package*.json ./

# Instalar as dependências
RUN npm install

# Copiar o restante dos arquivos do projeto
COPY --chown=node:node . .

# Expor a porta configurada
EXPOSE 3333

# Iniciar a aplicação com o arquivo index.js
CMD ["node", "index.js"]
