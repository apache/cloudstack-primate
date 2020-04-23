import { mount } from '@vue/test-utils'
import VueRouter from 'vue-router'
import AutogenView from '@/views/AutogenView'
import { localVue, i18n } from '../setup'
import {BasicLayout} from "../../src/layouts";

describe('AutogenView', () => {
  // it('beforeRouteUpdate', () => {
  //   const $route = {
  //     name: 'account',
  //     path: '/account',
  //     fullPath: '/account',
  //     matched: [],
  //     meta: {
  //       params: {},
  //       docHelp: 'docHelp'
  //     },
  //     query: {}
  //   }
  //   const wrapper = mount(AutogenView, {
  //     localVue,
  //     i18n,
  //     mocks: {
  //       $route
  //     }
  //   })
  //   const beforeRouteUpdate = wrapper.vm.$options.beforeRouteUpdate
  //   const nextFun = jest.fn()
  //   beforeRouteUpdate.call(wrapper.vm, {}, {}, nextFun)
  //   expect(wrapper.vm.currentPath).toEqual('/account')
  //   expect(nextFun).toHaveBeenCalled()
  // })
  //
  // it('beforeRouteLeave', () => {
  //   const $route = {
  //     name: 'account',
  //     path: '/account',
  //     fullPath: '/account',
  //     matched: [],
  //     meta: {
  //       params: {},
  //       docHelp: 'docHelp'
  //     },
  //     query: {}
  //   }
  //   const wrapper = mount(AutogenView, {
  //     localVue,
  //     i18n,
  //     mocks: {
  //       $route
  //     }
  //   })
  //   const beforeRouteLeave = wrapper.vm.$options.beforeRouteLeave
  //   const nextFun = jest.fn()
  //   beforeRouteLeave.call(wrapper.vm, {}, {}, nextFun)
  //   expect(nextFun).toHaveBeenCalled()
  //   // expect(wrapper.vm.currentPath).toEqual('/account')
  // })
  //
  // it('should be have router name', function () {
  //   const $route = {
  //     name: 'account',
  //     path: '/account',
  //     fullPath: '/account',
  //     matched: [],
  //     meta: {
  //       params: {},
  //       docHelp: 'docHelp'
  //     },
  //     query: {}
  //   }
  //   const wrapper = mount(AutogenView, {
  //     localVue,
  //     i18n,
  //     mocks: {
  //       $route
  //     }
  //   })
  //
  //   expect(wrapper.vm.routeName).toEqual('account')
  // })

  describe('Watchers - $route', () => {
    localVue.use(VueRouter)
    const router = new VueRouter({
      routes: [
        {
          path: '/',
          name: 'index',
          component: BasicLayout,
          meta: { icon: 'home' },
          redirect: '/dashboard',
          children: [
            {
              path: '/dashboard',
              name: 'dashboard',
              meta: {}
            },
            {
              path: '/account',
              name: 'account',
              meta: {}
            },
            {
              path: '/domain',
              name: 'domain',
              meta: {}
            }
          ]
        }
      ]
    })
    const wrapper = mount(AutogenView, {
      localVue,
      router,
      i18n
    })

    let spy

    beforeAll(() => {
      spy = jest.spyOn(wrapper.vm, 'fetchData')
    })

    afterEach(() => {
      spy.mockClear()
    })

    it('should call fetchData when route changes', () => {
      router.push({ name: 'domain' })
      setTimeout(() => {
        expect(spy).toBeCalled()
      }, 0)
    })
  })
})
