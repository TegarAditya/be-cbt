FROM oven/bun:debian AS build

WORKDIR /app

# Cache package installations
COPY package.json package.json
COPY bun.lockb bun.lockb
COPY prisma ./prisma 

RUN bun install

RUN bunx prisma generate

COPY ./src ./src

ENV NODE_ENV=production

RUN bun build \
    --compile \
    --minify-whitespace \
    --minify-syntax \
    --target bun \
    --outfile server \
    ./src/index.ts

FROM gcr.io/distroless/base

WORKDIR /app

COPY --from=build /app/server server

COPY --from=build /app/node_modules/.prisma /app/node_modules/.prisma
COPY --from=build /app/prisma ./prisma

ENV NODE_ENV=production

CMD ["./server"]

EXPOSE 3031