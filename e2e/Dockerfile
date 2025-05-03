FROM node:alpine

WORKDIR /usr/src/app

COPY . .

RUN npm install -g pnpm
RUN rm -rf node_modules && pnpm install

CMD ["pnpm", "run", "test"]