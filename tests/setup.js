import Vue from 'vue'
import Vuex from 'vuex'
import VueI18n from 'vue-i18n'
import VueRouter from 'vue-router'
import Antd from 'ant-design-vue'
import { createLocalVue } from '@vue/test-utils'

const localVue = createLocalVue()

Vue.use(Antd)
localVue.use(VueI18n)
localVue.use(VueRouter)
localVue.use(Vuex)

module.exports = {
  localVue,
  configI18n: (locale = 'en', messages = {}) => {
    return new VueI18n({
      locale: locale,
      messages: messages
    })
  },
  configStore: (apis) => {
    return new Vuex.Store({
      getters: () => {
        return {
          apis: apis
        }
      }
    })
  }
}

window.matchMedia = window.matchMedia || function () {
  return {
    matches: false,
    addListener: function () {},
    removeListener: function () {}
  }
}
