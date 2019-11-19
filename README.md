# CloudStack Primate [![Build Status](https://travis-ci.org/apache/cloudstack-primate.svg?branch=master)](https://travis-ci.org/apache/cloudstack-primate)

A modern role-based progressive CloudStack UI based on VueJS and Ant Design.

![Primate Screenshot](docs/screenshot-dashboard.png)

## Getting Started

Install node: (Debian/Ubuntu)

    sudo apt-get install npm nodejs

Install node: (CentOS/Fedora)

    curl -sL https://rpm.nodesource.com/setup_10.x | sudo bash -
    sudo yum install nodejs

Install tools and dependencies:

    sudo npm install -g @vue/cli webpack eslint
    sudo npm install -g npm@next
    sudo npm install -g npm-check-updates
    ncu -u # optional: upgrade dependencies
    npm install

## Development

Override the default `CS_URL` to a running CloudStack management server:

    cp .env.local.example .env.local
    Change the `CS_URL` in the `.env.local` file

To configure https, you may use `.env.local.https.example`.

Build and run:

    npm start
    or
    npm run serve

Production Build:

    npm run build

Upgrade dependencies:

    ncu -u

Run Tests:

    npm run test
    npm run lint
    npm run test:unit

Fix issues and vulnerabilities:

    npm audit

### Docker

A production-ready Docker container can also be built with the provided
Dockerfile and build script.

Make sure Docker is installed, then run build.sh:

    ./build.sh

Change the example configuration in `nginx/default.conf` according to your needs.

Run Primate:

    docker run -ti --rm -p 8080:80 -v $(pwd)/nginx:/etc/nginx/conf.d:ro cloudstack-primate:latest

## Documentation

### Learning Resources

- VueJS Guide: https://vuejs.org/v2/guide/
- Ant Design Spec: https://ant.design/docs/spec/introduce
- Vue Ant Design: https://vue.ant.design/docs/vue/introduce/
- JavaScript ES6 Reference: https://www.tutorialspoint.com/es6/
- Introduction to ES6: https://scrimba.com/g/gintrotoes6

### Primate Development

- Router [Configuration](config.md)
- [Resource List View](listview.md) customisation
- [Resource Detail View](detailview.md) customisation
- [Action](action.md) customisation
- Styling
- Testing
- [Theme](https://vue.ant.design/docs/vue/customize-theme/): Customise via `vue.config.js`
```ecmascript 6
  css: {
    loaderOptions: {
      less: {
        modifyVars: {
          /* Less variables, required modifyVars*/
          /* Refer to variables at https://vue.ant.design/docs/vue/customize-theme/ */
          'primary-color': '#F5222D',
          'link-color': '#F5222D',
          'border-radius-base': '4px',
        },
        javascriptEnabled: true,
      }
    }
  }
```

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
