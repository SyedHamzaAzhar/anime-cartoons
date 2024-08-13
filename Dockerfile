# FROM node:16 as builder

# LABEL version="1.0.0"
# LABEL description="Gogoanime API docker image"
# LABEL org.opencontainers.image.source https://github.com/riimuru/gogoanime

# # update packages, to reduce risk of vulnerabilities
# RUN apt-get update && apt-get upgrade -y && apt-get autoclean -y && apt-get autoremove -y

# # set a non privileged user to use when running this image
# RUN groupadd -r nodejs && useradd -g nodejs -s /bin/bash -d /home/nodejs -m nodejs
# USER nodejs
# # set right (secure) folder permissions
# RUN mkdir -p /home/nodejs/app/node_modules && chown -R nodejs:nodejs /home/nodejs/app

# WORKDIR /app

# # set default node env
# ARG NODE_ENV=development
# ARG PORT=3000
# # ARG NODE_ENV=production
# # to be able to run tests (for example in CI), do not set production as environment
# ENV NODE_ENV=${NODE_ENV}
# ENV PORT=${PORT}

# ENV NPM_CONFIG_LOGLEVEL=warn

# # copy project definition/dependencies files, for better reuse of layers
# COPY --chown=nodejs:nodejs package*.json ./

# # install dependencies here, for better reuse of layers
# RUN npm install && npm update && npm cache clean --force

# # copy all sources in the container (exclusions in .dockerignore file)
# COPY --chown=nodejs:nodejs . .

# # exposed port/s
# EXPOSE 3000

# HEALTHCHECK --interval=30s --timeout=10s --start-period=5s CMD npm run healthcheck-manual

# CMD [ "npm", "start" ]

# # end.

FROM node:16 AS builder

# Create app directory
WORKDIR /app

# Copy application dependency manifests to the container image.
# A wildcard is used to ensure copying both package.json AND package-lock.json (when available).
# Copying this first prevents re-running npm install on every code change.
COPY package*.json ./

# Install app dependencies using the `npm ci` command instead of `npm install`
RUN npm install

# Bundle app source
COPY . .

FROM node:16

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/dist ./dist

EXPOSE 3000
CMD [ "npm", "start" ]
