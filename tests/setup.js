import Vue from 'vue'
import Antd from 'ant-design-vue'
import { createLocalVue } from '@vue/test-utils'
import localeEn from '@/locales/en'
import VueI18n from 'vue-i18n'

const localVue = createLocalVue()

Vue.use(Antd)
localVue.use(VueI18n)

module.exports = {
  localVue,
  i18n: new VueI18n({
    locale: 'en',
    fallbackLocale: 'en',
    silentTranslationWarn: true,
    messages: { en: localeEn }
  })
}

window.matchMedia = window.matchMedia || function () {
  return {
    matches: false,
    addListener: function () {},
    removeListener: function () {}
  }
}
