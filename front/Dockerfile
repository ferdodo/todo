FROM node
WORKDIR /todo/front
COPY package.json .
RUN npm install

WORKDIR /todo
COPY --from=todo-git /todo/.git .git
COPY --from=todo-ui /todo/ui ./ui
COPY --from=todo-browser /todo/browser ./browser
COPY --from=todo-core /todo/core ./core

WORKDIR /todo/front
COPY . .
CMD ["npm", "run", "dev"]