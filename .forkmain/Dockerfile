FROM node:16 as builder

WORKDIR /workdir

COPY ./ ./

RUN yarn install && yarn build && cp -r public .next/standalone &&  cp -r .next/static .next/standalone/.next

EXPOSE 3000

FROM node:16 as runner

WORKDIR /workdir

COPY --from=builder /workdir/.next/standalone .

CMD ["sh", "-c", "node server.js"]
