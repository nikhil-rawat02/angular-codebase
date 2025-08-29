FROM node:20.19-alpine AS build
WORKDIR /app
COPY . . 
RUN npm install --force
RUN npm run build
# RUN sh -c "ls -lthr dist"

FROM alpine 
COPY --from=build /app/dist /output/dist