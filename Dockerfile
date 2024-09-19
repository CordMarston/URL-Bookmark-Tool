FROM node:lts-alpine
WORKDIR /myapp
COPY ./package.json ./
RUN npm install
COPY ./ .
ENV NODE_ENV=production
# CMD ["npm", “run” ,"start"] # will launch the remix app when we run this Docker image.
RUN echo "fs.inotify.max_user_instances=524288" >> /etc/sysctl.conf
RUN echo "fs.inotify.max_user_watches=524288" >> /etc/sysctl.conf
RUN echo "fs.inotify.max_queued_events=524288" >> /etc/sysctl.conf