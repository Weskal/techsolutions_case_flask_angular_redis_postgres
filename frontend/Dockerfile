# Dockerfile Angular 19 + Node 18 + Vite (testes)
FROM node:18-bullseye

# Diretório de trabalho
WORKDIR /app

# Copia apenas package.json e package-lock.json para instalar dependências
COPY package*.json ./

# Downgrade npm para evitar bugs com optional dependencies nativas
RUN npm install -g npm@9

# Instala dependências de forma limpa
RUN npm ci

# Copia o restante do código
COPY . .

# Build do Vite para garantir que binários nativos sejam baixados
RUN npx vite build || true

# Porta padrão do dev server Angular/Vite
EXPOSE 4200

# Comando para rodar a aplicação em dev mode (ou troque para "start" / prod se quiser)
CMD ["npm", "run", "dev"]
