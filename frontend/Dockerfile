# Dockerfile Angular 19 + Node 18
FROM node:18-bullseye

# Diretório de trabalho
WORKDIR /app

# Copiar package.json e package-lock.json
COPY package*.json ./

# Instalar dependências
RUN npm ci

# Copiar o código
COPY . .

# Limpar cache do Angular
RUN rm -rf .angular dist

# Expor porta
EXPOSE 4200

# Comando para rodar em modo desenvolvimento
CMD ["npm", "start", "--", "--host", "0.0.0.0", "--poll", "2000"]