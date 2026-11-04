FROM node
WORKDIR /todo/core
COPY package.json .
RUN npm install

WORKDIR /todo
COPY --from=todo-git /todo/.git .git

WORKDIR /todo/core
COPY . .
