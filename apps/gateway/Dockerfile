FROM node:alpin AS development

WORKDIR /usrr/src/app

COPY package.json ./
COPY pnpm-lock.yaml ./
COPY tsconfig.json ./
COPY nest-cli.json ./

RUN npm install -g pnpm
RUN pnpm install

COPY apps/gateway apps/gateway
COPY libs libs

RUN cd apps/gateway && pnpm install
RUN pnpm run build gateway

FROM node:alpine AS production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/src/app

COPY package.json ./
COPY pnpm-lock.yaml ./

RUN npm install -g pnpm
RUN pnpm install --prod

COPY --from=development ./usr/src/app/dist ./dist
COPY proto proto

CMD [ "node", "dist/apps/gateway/main.js" ]