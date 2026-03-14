# Vulnerabilities are not important as image is only used in build stage
FROM node:25-alpine AS builder

ARG PNPM_VERSION=latest-10

# Get node + pnpm
RUN npm install -g pnpm@${PNPM_VERSION}

WORKDIR /app

# Build backend
COPY package*.json *-lock* ./
RUN pnpm install --prod=false
COPY . ./
RUN pnpm build


FROM alpine:latest AS production

RUN apk add --no-cache nodejs

WORKDIR /usr/app

COPY --from=builder /app/build .

CMD ["node", "index.js"]