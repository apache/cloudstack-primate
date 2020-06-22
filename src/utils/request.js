// Licensed to the Apache Software Foundation (ASF) under one
// or more contributor license agreements.  See the NOTICE file
// distributed with this work for additional information
// regarding copyright ownership.  The ASF licenses this file
// to you under the Apache License, Version 2.0 (the
// "License"); you may not use this file except in compliance
// with the License.  You may obtain a copy of the License at
//
//   http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing,
// software distributed under the License is distributed on an
// "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
// KIND, either express or implied.  See the License for the
// specific language governing permissions and limitations
// under the License.

import Vue from 'vue'
import axios from 'axios'
import router from '@/router'
import store from '@/store'
import { VueAxios } from './axios'
import notification from 'ant-design-vue/es/notification'
import { CURRENT_PROJECT } from '@/store/mutation-types'

const service = axios.create({
  baseURL: store.getters.configs.apiBase,
  timeout: 600000
})

const err = (error) => {
  const response = error.response
  if (response) {
    console.log(response)
    if (response.status === 403) {
      const data = response.data
      notification.error({ message: 'Forbidden', description: data.message })
    }
    if (response.status === 401) {
      if (response.config && response.config.params && ['listIdps'].includes(response.config.params.command)) {
        return
      }
      notification.error({
        message: 'Unauthorized',
        description: 'Session expired, authorization verification failed',
        key: 'http-401'
      })
      store.dispatch('Logout').then(() => {
        setTimeout(() => {
          window.location.reload()
        }, 1500)
      })
    }
    if (response.status === 404) {
      notification.error({ message: 'Not Found', description: 'Resource not found' })
      router.push({ path: '/exception/404' })
    }
  }
  if (error.isAxiosError && !error.response) {
    notification.warn({
      message: error.message || 'Network Error',
      description: 'Unable to reach the management server or a browser extension may be blocking the network request.',
      key: 'network-error'
    })
  }
  return Promise.reject(error)
}

// request interceptor
service.interceptors.request.use(config => {
  if (config && config.params) {
    config.params.response = 'json'
    const project = Vue.ls.get(CURRENT_PROJECT)
    if (!config.params.projectid && project && project.id) {
      config.params.projectid = project.id
    }
  }
  return config
}, err)

// response interceptor
service.interceptors.response.use((response) => {
  return response.data
}, err)

const installer = {
  vm: {},
  install (Vue) {
    Vue.use(VueAxios, service)
  }
}

export {
  installer as VueAxios,
  service as axios
}
