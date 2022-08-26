FROM node:16

WORKDIR /workdir

COPY ./ ./

RUN yarn install && yarn build && cp -r public .next/standalone &&  cp -r .next/static .next/standalone/.next

EXPOSE 3000

CMD ["sh", "-c", "node server.js"]