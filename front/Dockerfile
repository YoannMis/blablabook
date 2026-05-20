FROM node:24-alpine AS builder

WORKDIR /app

ARG VITE_API_URL
ARG FRONTEND_LOCAL_PORT
ENV VITE_API_URL=$VITE_API_URL
ENV FRONTEND_LOCAL_PORT=$FRONTEND_LOCAL_PORT

RUN npm install -g pnpm

COPY package.json pnpm-lock.yaml ./

RUN pnpm install --frozen-lockfile --dangerously-allow-all-builds
RUN pnpm audit --fix=override

COPY . .

RUN pnpm build

FROM nginx:alpine

RUN rm -rf /usr/share/nginx/html/* 

COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
