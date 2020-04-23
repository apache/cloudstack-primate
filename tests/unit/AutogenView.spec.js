import { mount } from '@vue/test-utils'
import VueRouter from 'vue-router'
import { localVue, configI18n } from './../setup'
import AutogenView from '@/views/AutogenView'

const i18n = configI18n()
const routes = [{
  path: '/',
  name: 'home',
  meta: { icon: 'home' },
  redirect: '/dashboard',
  children: [{
    name: 'dashboard',
    path: '/dashboard',
    meta: {}
  }, {
    name: 'domain',
    path: '/domain',
    meta: {}
  }]
}]
const router = new VueRouter({ routes: routes })

describe('AutogenView.vue', () => {
  // test Navigation Gaurd
  describe('Navigation Gaurd', () => {
    const wrapper = mount(AutogenView, {
      localVue,
      router,
      i18n
    })

    router.push({ name: 'domain' })

    it('is called beforeRouteUpdate', () => {
      const beforeRouteUpdate = wrapper.vm.$options.beforeRouteUpdate
      const nextFun = jest.fn()
      beforeRouteUpdate[0].call(wrapper.vm, {}, {}, nextFun)
      expect(wrapper.vm.currentPath).toEqual('/domain')
      expect(nextFun).toHaveBeenCalled()
    })

    it('is called beforeRouteLeave', () => {
      const beforeRouteLeave = wrapper.vm.$options.beforeRouteLeave
      const nextFun = jest.fn()
      beforeRouteLeave[0].call(wrapper.vm, {}, {}, nextFun)
      expect(wrapper.vm.currentPath).toEqual('/domain')
      expect(nextFun).toHaveBeenCalled()
    })
  })

  // test Watchers
  describe('Watchers', () => {
    const wrapper = mount(AutogenView, {
      localVue,
      router,
      i18n
    })

    const spy = jest.spyOn(wrapper.vm, 'fetchData')

    it('is not called fetchData when route not changes', () => {
      expect(spy).not.toBeCalled()
      spy.mockClear()
    })

    it('is called fetchData when route changes', () => {
      router.push({ name: 'domain' })
      setTimeout(() => { expect(spy).toBeCalled() })
      spy.mockClear()
    })
  })
})
