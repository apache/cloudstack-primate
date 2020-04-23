import Vue from 'vue'
import VueI18n from 'vue-i18n'
import VueRouter from 'vue-router'
import Antd from 'ant-design-vue'
import { createLocalVue } from '@vue/test-utils'

const localVue = createLocalVue()

Vue.use(Antd)
localVue.use(VueI18n)
localVue.use(VueRouter)

module.exports = {
  localVue,
  configI18n: (locale = 'en', localeMessages = {}) => {
    const messages = {}
    messages[locale] = localeMessages

    return new VueI18n({
      locale: locale,
      fallbackLocale: locale,
      silentTranslationWarn: true,
      messages: messages
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
