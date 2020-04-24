import { mount } from '@vue/test-utils'
import VueRouter from 'vue-router'
import axios from 'axios'
import { localVue, configI18n, configStore } from './../setup'
import AutogenView from '@/views/AutogenView'
import Vuex from "vuex";
import getters from "../../src/store/getters";

const routes = [{
  path: '/',
  name: 'default-router',
  meta: { icon: 'default' },
  redirect: '/router-1',
  children: [{
    name: 'router-1',
    path: '/router-1',
    meta: { icon: 'router-1' }
  }]
}]
const messages = {
  en: { key: 'test-en-content' },
  de: { key: 'test-de-content' }
}
const i18n = configI18n('en', messages)

describe('AutogenView.vue', () => {
  // // test Navigation Gaurd
  // describe('Navigation Gaurd', () => {
  //   const router = new VueRouter({ routes: routes })
  //   const wrapper = mount(AutogenView, {
  //     localVue,
  //     router,
  //     i18n
  //   })
  //
  //   it('is called beforeRouteUpdate', () => {
  //     const beforeRouteUpdate = wrapper.vm.$options.beforeRouteUpdate
  //     const nextFun = jest.fn()
  //     beforeRouteUpdate[0].call(wrapper.vm, {}, {}, nextFun)
  //     expect(wrapper.vm.currentPath).toEqual('/router-1')
  //     expect(nextFun).toHaveBeenCalled()
  //   })
  //
  //   it('is called beforeRouteLeave', () => {
  //     const beforeRouteLeave = wrapper.vm.$options.beforeRouteLeave
  //     const nextFun = jest.fn()
  //     beforeRouteLeave[0].call(wrapper.vm, {}, {}, nextFun)
  //     expect(wrapper.vm.currentPath).toEqual('/router-1')
  //     expect(nextFun).toHaveBeenCalled()
  //   })
  // })
  //
  // // test Watchers
  // describe('Watchers', () => {
  //   // mockup router
  //   routes[0].children.push({
  //     name: 'router-2',
  //     path: '/router-2',
  //     meta: { icon: 'router-2' }
  //   })
  //   const router = new VueRouter({ routes: routes })
  //   const wrapper = mount(AutogenView, {
  //     localVue,
  //     router,
  //     i18n
  //   })
  //   wrapper.setData({
  //     searchQuery: 'test-query',
  //     page: 2,
  //     pageSize: 20
  //   })
  //
  //   const spy = jest.spyOn(wrapper.vm, 'fetchData')
  //
  //   afterEach(() => {
  //     spy.mockClear()
  //   })
  //
  //   it('Data does not change when route not changes', () => {
  //     setTimeout(() => {
  //       expect(wrapper.vm.searchQuery).toEqual('test-query')
  //       expect(wrapper.vm.page).toEqual(2)
  //       expect(wrapper.vm.pageSize).toEqual(20)
  //       expect(spy).not.toBeCalled()
  //     })
  //   })
  //
  //   it('Data changed when route changes', () => {
  //     router.push({ name: 'router-2' })
  //
  //     setTimeout(() => {
  //       expect(wrapper.vm.searchQuery).toEqual('')
  //       expect(wrapper.vm.page).toEqual(1)
  //       expect(wrapper.vm.pageSize).toEqual(10)
  //       expect(spy).toBeCalled()
  //     })
  //   })
  //
  //   it('fetchData not call and translate not accept when locale not changes', () => {
  //     setTimeout(() => {
  //       expect(wrapper.vm.$t('key')).toEqual('test-en-content')
  //       expect(spy).not.toBeCalled()
  //     })
  //   })
  //
  //   it('fetchData is call and translate accept when locale changes', () => {
  //     i18n.locale = 'de'
  //
  //     setTimeout(() => {
  //       expect(wrapper.vm.$t('key')).toEqual('test-de-content')
  //       expect(spy).toBeCalled()
  //     })
  //   })
  // })
  //
  // // test computed
  // describe('computed', () => {
  //   const router = new VueRouter({ routes: routes })
  //   const wrapper = mount(AutogenView, {
  //     localVue,
  //     router,
  //     i18n
  //   })
  //
  //   it('hasSelected return true when selectedRowKeys not empty', () => {
  //     wrapper.setData({ selectedRowKeys: ['test-domain-id'] })
  //
  //     expect(wrapper.vm.hasSelected).toEqual(true)
  //   })
  //
  //   it('hasSelected return false when selectedRowKeys is empty', () => {
  //     wrapper.setData({ selectedRowKeys: [] })
  //
  //     expect(wrapper.vm.hasSelected).toEqual(false)
  //   })
  // })

  // test method
  describe('Method', () => {
    // fetchData
    describe('fetchData', () => {
      routes[0].children.push({
        name: 'router-2',
        path: '/router-2',
        meta: {
          icon: 'router-2',
          permission: ['routerGet2']
        }
      })
      const router = new VueRouter({ routes: routes })
      mount(AutogenView, {
        localVue,
        router,
        i18n,
        mocks: {
          $store: {
            state: {
              user: {
                apis: {
                  test: '123'
                }
              }
            }
          }
        }
      })

      let mock

      beforeEach(() => {
        mock = jest.spyOn(axios, 'get')
      })

      afterEach(() => {
        mock.mockRestore()
      })

      it('route query is not empty', async () => {
        router.push({ name: 'router-2' })
        // mock.mockResolvedValue()
        //
        // expect(mock).toHaveBeenCalledWith('/api/client/', {})
      })
    })
  })
})
