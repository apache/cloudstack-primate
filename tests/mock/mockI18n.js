import VueI18n from 'vue-i18n'

const mockI18n = {
  mock: (locale = 'en', message = {}) => {
    return new VueI18n({
      locale: locale,
      messages: message
    })
  }
}

export default mockI18n
