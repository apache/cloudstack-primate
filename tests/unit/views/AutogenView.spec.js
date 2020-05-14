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

import { mount } from '@vue/test-utils'
import {
  localVue,
  mockI18n,
  mockRouter,
  mockAxios,
  mockStore
} from './../../setup'
import AutogenView from '@/views/AutogenView'

jest.mock('axios', () => mockAxios)

describe('Views > AutogenView.vue', () => {
  const routes = [
    {
      name: 'testRouter1',
      path: '/test-router-1',
      meta: {
        icon: 'test-router-1'
      }
    },
    {
      name: 'testRouter2',
      path: '/test-router-2',
      meta: {
        icon: 'test-router-2'
      }
    },
    {
      path: '/test-router-3',
      meta: {
        icon: 'test-router-3'
      }
    }
  ]

  const messages = {
    en: { 'label.name': 'test-name-en' },
    de: { 'label.name': 'test-name-de' }
  }

  const state = {
    user: {
      apis: {
        testApiCase3: {}
      }
    }
  }

  const router = mockRouter.mock(routes)
  const i18n = mockI18n.mock('en', messages)
  const store = mockStore.mock(state)

  let wrapper

  beforeEach(() => {
    if (wrapper) {
      wrapper.destroy()
    }
    jest.clearAllMocks()
    if (router.currentRoute.name !== 'home') {
      router.replace({ name: 'home' })
    }
  })

  describe('Navigation Guard', () => {
    it('beforeRouteUpdate() is called', () => {
      wrapper = mount(AutogenView, {
        localVue,
        router,
        store,
        i18n
      })

      router.push({ name: 'testRouter1' })

      const beforeRouteUpdate = wrapper.vm.$options.beforeRouteUpdate
      const nextFun = jest.fn()

      beforeRouteUpdate[0].call(wrapper.vm, {}, {}, nextFun)

      wrapper.vm.$nextTick(() => {
        expect(wrapper.vm.currentPath).toEqual('/test-router-1')
        expect(nextFun).toHaveBeenCalled()
      })
    })

    it('beforeRouteLeave() is called', () => {
      wrapper = mount(AutogenView, {
        localVue,
        router,
        store,
        i18n
      })

      router.push({ name: 'testRouter1' })

      const beforeRouteLeave = wrapper.vm.$options.beforeRouteLeave
      const nextFun = jest.fn()

      beforeRouteLeave[0].call(wrapper.vm, {}, {}, nextFun)

      wrapper.vm.$nextTick(() => {
        expect(wrapper.vm.currentPath).toEqual('/test-router-1')
        expect(nextFun).toHaveBeenCalled()
      })
    })
  })

  describe('Watchers', () => {
    describe('$route', () => {
      it('data does not change when $route does not change', () => {
        wrapper = mount(AutogenView, {
          localVue,
          router,
          store,
          i18n
        })

        const spy = jest.spyOn(wrapper.vm, 'fetchData')

        wrapper.setData({
          searchQuery: 'test-query',
          page: 2,
          itemCount: 10,
          selectedFilter: 'test-filter'
        })

        wrapper.vm.$nextTick(() => {
          expect(wrapper.vm.searchQuery).toEqual('test-query')
          expect(wrapper.vm.page).toEqual(2)
          expect(wrapper.vm.itemCount).toEqual(10)
          expect(wrapper.vm.selectedFilter).toEqual('test-filter')
          expect(spy).not.toBeCalled()
        })
      })

      it('data changes when $route changes', () => {
        wrapper = mount(AutogenView, {
          localVue,
          router,
          store,
          i18n
        })

        const spy = jest.spyOn(wrapper.vm, 'fetchData')

        wrapper.setData({
          searchQuery: 'test-query',
          page: 2,
          itemCount: 10,
          selectedFilter: 'test-filter'
        })

        router.push({ name: 'testRouter2' })

        wrapper.vm.$nextTick(() => {
          expect(wrapper.vm.searchQuery).toEqual('')
          expect(wrapper.vm.page).toEqual(1)
          expect(wrapper.vm.itemCount).toEqual(0)
          expect(wrapper.vm.selectedFilter).toEqual('')
          expect(spy).toBeCalled()
        })
      })
    })

    describe('$i18n.locale', () => {
      it('fetchData() is not called when locales not changes', () => {
        wrapper = mount(AutogenView, {
          localVue,
          router,
          store,
          i18n
        })

        const spy = jest.spyOn(wrapper.vm, 'fetchData')

        wrapper.vm.$nextTick(() => {
          expect(wrapper.vm.$t('label.name')).toEqual('test-name-en')
          expect(spy).not.toBeCalled()
        })
      })

      it('fetchData() is called when locales changes', async () => {
        wrapper = mount(AutogenView, {
          localVue,
          router,
          store,
          i18n
        })

        i18n.locale = 'de'
        const spy = jest.spyOn(wrapper.vm, 'fetchData')

        wrapper.vm.$nextTick(() => {
          expect(wrapper.vm.$t('label.name')).toEqual('test-name-de')
          expect(spy).toBeCalled()
        })
      })
    })
  })

  describe('Computed', () => {
    it('hasSelected is true when the selectedRowKeys not empty', () => {
      wrapper = mount(AutogenView, {
        localVue,
        router,
        store,
        i18n
      })

      wrapper.setData({ selectedRowKeys: ['test-select-id'] })

      wrapper.vm.$nextTick(() => {
        expect(wrapper.vm.hasSelected).toBeTruthy()
      })
    })

    it('hasSelected is false when the selectedRowKeys is empty', () => {
      wrapper = mount(AutogenView, {
        localVue,
        router,
        store,
        i18n
      })

      wrapper.setData({ selectedRowKeys: [] })

      wrapper.vm.$nextTick(() => {
        expect(wrapper.vm.hasSelected).toBeFalsy()
      })
    })
  })

  describe('Methods', () => {
    describe('fetchData()', () => {
      it('routeName is set by $route name', () => {
        wrapper = mount(AutogenView, {
          localVue,
          router,
          store,
          i18n
        })

        router.push({ name: 'testRouter1' })

        wrapper.vm.$nextTick(() => {
          expect(wrapper.vm.routeName).toEqual('testRouter1')
          expect(wrapper.vm.items).toEqual([])
        })
      })

      it('routeName is not set by $route name', () => {
        beforeEach(() => {
          wrapper.destroy()
          router.replace({ name: 'home' })
        })

        wrapper = mount(AutogenView, {
          localVue,
          router,
          store,
          i18n
        })

        router.replace('/test-router-3')

        wrapper.vm.$nextTick(() => {
          expect(wrapper.vm.routeName).toEqual('home')
        })
      })
    })
  })
})
