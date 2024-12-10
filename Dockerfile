FROM node:18-alpine

# Criar diretórios para o app e node_modules
RUN mkdir -p /home/node/src/node_modules && chown -R node:node /home/node/src

# Definir o diretório de trabalho na raiz do projeto
WORKDIR /home/node/app

# Copiar os arquivos de configuração do package.json
COPY package*.json ./

# Instalar as dependências
RUN npm install

# Instalar o curl usando apk
RUN apk add --no-cache curl

# Comando para exibir o IP de saída
RUN curl -s https://ifconfig.me > /home/node/app/ip.txt

# Copiar o restante dos arquivos do projeto
COPY --chown=node:node . .

# Expor a porta configurada
EXPOSE 8080

# Exibir o IP de saída no log ao iniciar o contêiner
CMD ["sh", "-c", "echo 'IP de saída:' && cat /home/node/app/ip.txt && node index.js"]
