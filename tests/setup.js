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
import Vuex from 'vuex'
import Antd from 'ant-design-vue'
import VueRouter from 'vue-router'
import VueI18n from 'vue-i18n'
import VueStorage from 'vue-ls'
import config from '@/config/settings'
import { createLocalVue } from '@vue/test-utils'

import mockI18n from './mock/mockI18n'
import mockStore from './mock/mockStore'
import mockRouter from './mock/mockRouter'
import mockAxios from './mock/mockAxios'

const localVue = createLocalVue()

Vue.use(Antd)
Vue.use(VueStorage, config.storageOptions)

localVue.use(VueRouter)
localVue.use(VueI18n)
localVue.use(Vuex)

window.matchMedia = window.matchMedia || function () {
  return {
    matches: false,
    addListener: function () {},
    removeListener: function () {}
  }
}

const decodeHtml = (html) => {
  const text = document.createElement('textarea')
  text.innerHTML = html

  return text.value
}

module.exports = {
  localVue,
  mockI18n,
  mockStore,
  mockRouter,
  mockAxios,
  decodeHtml
}
