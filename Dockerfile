# Inherit from base node
FROM node:10.15.2
ARG NPM_REGISTRY=https://registry.npmjs.org/
ARG PACKAGE_INSTALLER=npm

# Set our env vars
ENV PORT=3000\
    PATH=/app/user/node_modules/.bin:$PATH

# Create some needed directories
RUN mkdir -p /app/user && \
    rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/* &&\
    ${PACKAGE_INSTALLER} config set registry "$NPM_REGISTRY"

WORKDIR /app/user
COPY package.json package-lock.json /app/user/
RUN $PACKAGE_INSTALLER cache verify && \
    $PACKAGE_INSTALLER install
COPY . /app/user
RUN npm run build
CMD ["npm", "run", "start"]
