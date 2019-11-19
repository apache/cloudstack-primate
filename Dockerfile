FROM node:10-buster AS build

WORKDIR /build

RUN apt-get -y update && \
	apt-get -y upgrade

COPY . /build/
RUN	npm install
RUN npm run build

FROM nginx:alpine AS runtime

LABEL org.opencontainers.image.title="CloudStack Primate" \
	org.opencontainers.image.description="A modern role-based progressive CloudStack UI based on VueJS and Ant Design" \
	org.opencontainers.image.authors="The Apache Software Foundation" \
	org.opencontainers.image.url="https://github.com/apache/cloudstack-primate" \
	org.opencontainers.image.documentation="https://github.com/apache/cloudstack-primate/README.md" \
	org.opencontainers.image.source="https://github.com/apache/cloudstack-primate" \
	org.opencontainers.image.vendor="The Apache Software Foundation" \
	org.opencontainers.image.licenses="Apache-2.0" \
	org.opencontainers.image.ref.name="latest"

COPY --from=build /build/dist/. /usr/share/nginx/html/
