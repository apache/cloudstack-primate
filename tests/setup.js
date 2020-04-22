import Vue from 'vue'
import Antd from 'ant-design-vue'

Vue.use(Antd)

window.matchMedia = window.matchMedia || function () {
  return {
    matches: false,
    addListener: function () {},
    removeListener: function () {}
  }
}
