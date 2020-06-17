# CloudStack Primate [![Build Status](https://travis-ci.org/apache/cloudstack-primate.svg?branch=master)](https://travis-ci.org/apache/cloudstack-primate)

A modern role-based progressive CloudStack UI based on VueJS and Ant Design.

![Primate Screenshot](docs/screenshot-dashboard.png)

## Getting Started

Install node: (Debian/Ubuntu)

    curl -sL https://deb.nodesource.com/setup_12.x | sudo -E bash -
    sudo apt-get install -y nodejs
    # Or use distro provided: sudo apt-get install npm nodejs

Install node: (CentOS/Fedora/RHEL)

    curl -sL https://rpm.nodesource.com/setup_12.x | sudo bash -
    sudo yum install nodejs

Optionally, you may also install system-wide dev tools:

    sudo npm install -g @vue/cli npm-check-updates

## Development

Clone the repository:

    git clone https://github.com/apache/cloudstack-primate.git
    cd cloudstack-primate
    npm install

Override the default `CS_URL` to a running CloudStack management server:

    cp .env.local.example .env.local
    Change the `CS_URL` in the `.env.local` file

To configure https, you may use `.env.local.https.example`.

Build and run:

    npm run serve
    # Or run: npm start

Upgrade dependencies to the latest versions:

    ncu -u

Run Tests:

    npm run test
    npm run lint
    npm run test:unit

Fix issues and vulnerabilities:

    npm audit

## Production

Fetch dependencies and build:

    npm install
    npm run build

This creates a static webpack application in `dist/`, which can then be served
from any web server or CloudStack management server (jetty).

To use CloudStack management server (jetty), you may copy the built Primate build
to a new/existing webapp directory on the management server host. For example:

    npm install
    npm run build
    cd dist
    mkdir -p /usr/share/cloudstack-management/webapp/primate
    cp -vr . /usr/share/cloudstack-management/webapp/primate/
    # Use Primate at {management-server}:8080/client/primate in browser

If the webapp directory is changed, please change the `webapp.dir` in the
`/etc/cloudstack/management/server.properties` and restart the management server host.

To use a separate webserver, note that the API server is accessed through the path
`/client`, which needs be forwarded to an actual CloudStack instance.

For example, a simple way to serve Primate with nginx can be implemented with the
following nginx configuration (to be put into /etc/nginx/conf.d/default.conf or similar):

```nginx
server {
    listen       80;
    server_name  localhost;
    location / {
        # /src/primate/dist contains the built Primate webpack
        root   /src/primate/dist;
        index  index.html;
    }
    location /client/ {
        # http://127.0.0.1:800 should be replaced your CloudStack management
        # server's actual URI
        proxy_pass   http://127.0.0.1:8000;
    }
}
```

### Docker

A production-ready Docker container can also be built with the provided
Dockerfile and build script. Official builds are available here:
https://hub.docker.com/r/apache/cloudstack-primate

Make sure Docker is installed, then run:

    bash tools/docker.sh

Change the example configuration in `nginx/default.conf` according to your needs.

Run Primate:

    docker run -ti --rm -p 8080:80 -v $(pwd)/nginx:/etc/nginx/conf.d:ro cloudstack-primate:latest

## Documentation

- VueJS Guide: https://vuejs.org/v2/guide/
- Vue Ant Design: https://www.antdv.com/docs/vue/introduce/
- Primate Developer [Docs](docs)
- JavaScript ES6 Reference: https://www.tutorialspoint.com/es6/
- Introduction to ES6: https://scrimba.com/g/gintrotoes6

## Attributions

Primate uses the following:

- [VueJS](https://vuejs.org/)
- [Ant Design Spec](https://ant.design/docs/spec/introduce)
- [Ant Design Vue](https://vue.ant.design/)
- [Ant Design Pro Vue](https://github.com/sendya/ant-design-pro-vue)
- [Fontawesome](https://github.com/FortAwesome/vue-fontawesome)
- [ViserJS](https://viserjs.github.io/docs.html#/viser/guide/installation)
- [Icons](https://www.iconfinder.com/iconsets/cat-force) by [Iconka](https://iconka.com/en/downloads/cat-power/)

## History

The project was created by [Rohit Yadav](https://rohityadav.cloud) over several
weekends during late 2018 and early 2019. During ApacheCon CCCUS19, on 9th
September 2019, Primate was introduced and demoed as part of the talk [Modern UI
for CloudStack](https://rohityadav.cloud/files/talks/cccna19-primate.pdf)
([video](https://www.youtube.com/watch?v=F2KwZhechzs)).
[Primate](https://markmail.org/message/vxnskmwhfaagnm4r) was accepted by the
Apache CloudStack project on 21 Oct 2019.

## License

Licensed to the Apache Software Foundation (ASF) under one
or more contributor license agreements.  See the NOTICE file
distributed with this work for additional information
regarding copyright ownership.  The ASF licenses this file
to you under the Apache License, Version 2.0 (the
"License"); you may not use this file except in compliance
with the License.  You may obtain a copy of the License at

  http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing,
software distributed under the License is distributed on an
"AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, either express or implied.  See the License for the
specific language governing permissions and limitations
under the License.
