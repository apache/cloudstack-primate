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
import user from '@/store/modules/user'

jest.mock('axios', () => mockAxios)

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
  },
  {
    name: 'testRouter4',
    path: '/test-router-4/:id',
    meta: {
      icon: 'test-router-4'
    }
  },
  {
    name: 'testRouter5',
    path: '/test-router-5',
    meta: {
      icon: 'test-router-5',
      permission: ['testApiNameCase1'],
      columns: ['column1', 'column2', 'column3'],
      actions: [
        {
          name: 'label.name',
          icon: 'plus',
          listView: true
        }
      ]
    }
  },
  {
    name: 'testRouter6',
    path: '/test-router-6',
    meta: {
      icon: 'test-router-6',
      permission: ['testApiNameCase2']
    }
  },
  {
    name: 'testRouter7',
    path: '/test-router-7',
    meta: {
      icon: 'test-router-7',
      permission: ['testApiNameCase3'],
      params: {
        key: 'test-value'
      }
    }
  },
  {
    name: 'testRouter8',
    path: '/test-router-8',
    meta: {
      icon: 'test-router-8',
      permission: ['listTemplates'],
      filters: ['name', 'domainid']
    }
  },
  {
    name: 'testRouter9',
    path: '/template',
    meta: {
      icon: 'test-router-9',
      permission: ['listTemplates'],
      filters: ['name', 'domainid']
    }
  },
  {
    name: 'testRouter10',
    path: '/iso',
    meta: {
      icon: 'test-router-10',
      permission: ['listTemplates'],
      filters: ['name', 'domainid']
    }
  },
  {
    name: 'testRouter11',
    path: '/test-router-11',
    meta: {
      icon: 'test-router-11',
      permission: ['testApiNameCase2']
    }
  },
  {
    name: 'testRouter12',
    path: '/test-router-12',
    meta: {
      icon: 'test-router-12',
      permission: ['listRoles']
    }
  },
  {
    name: 'testRouter13',
    path: '/test-router-13',
    meta: {
      icon: 'test-router-12',
      permission: ['quotaEmailTemplateList']
    }
  }
]

user.state.apis = {
  testApiNameCase1: {
    params: {},
    response: []
  },
  testApiNameCase2: {
    params: {},
    response: []
  },
  testApiNameCase3: {
    params: {},
    response: []
  },
  listTemplates: {
    params: {},
    response: []
  },
  listRoles: {
    params: {},
    response: []
  },
  quotaEmailTemplateList: {
    params: {},
    response: []
  }
}

const messages = {
  en: {
    'label.name': 'test-name-en',
    column1: 'column1-en',
    column2: 'column2-en',
    column3: 'column3-en',
    name: 'name-en',
    domainid: 'domain-en',
    self: 'self-en',
    all: 'all-en'
  },
  de: {
    'label.name': 'test-name-de',
    column1: 'column1-de',
    column2: 'column2-de',
    column3: 'column3-de',
    name: 'name-de',
    domainid: 'domain-de',
    self: 'self-de',
    all: 'all-de'
  }
}

const state = {
  user: {
    apis: {
      testApiNameCase1: {
        params: {},
        response: {}
      },
      testApiNameCase2: {
        params: {},
        response: {}
      },
      testApiNameCase3: {
        params: {},
        response: {}
      },
      listTemplates: {
        params: {},
        response: []
      },
      listRoles: {
        params: {},
        response: []
      },
      quotaEmailTemplateList: {
        params: {},
        response: []
      }
    },
    info: {
      roletype: 'Normal'
    }
  }
}

const router = mockRouter.mock(routes)
const i18n = mockI18n.mock('en', messages)
let store = mockStore.mock(state)

const factory = (propData = {}, data = {}) => {
  return mount(AutogenView, {
    localVue,
    router,
    i18n,
    store,
    propsData: propData,
    data () {
      return { ...data }
    }
  })
}

describe('Views > AutogenView.vue', () => {
  let wrapper

  beforeEach(() => {
    if (wrapper) {
      wrapper.destroy()
    }
    jest.clearAllMocks()
    if (router.currentRoute.name !== 'home') {
      router.replace({ name: 'home' })
    }
    state.user.info.roletype = 'Normal'
    store = mockStore.mock(state)
  })

  describe('Navigation Guard', () => {
    it('beforeRouteUpdate() is called', () => {
      wrapper = factory()
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
      wrapper = factory()
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
        wrapper = factory()

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
        wrapper = factory()

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
        wrapper = factory()

        const spy = jest.spyOn(wrapper.vm, 'fetchData')

        wrapper.vm.$nextTick(() => {
          expect(wrapper.vm.$t('label.name')).toEqual('test-name-en')
          expect(spy).not.toBeCalled()
        })
      })

      it('fetchData() is called when locales changes', async () => {
        wrapper = factory()

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
      wrapper = factory({}, { selectedRowKeys: ['test-select-id'] })

      wrapper.vm.$nextTick(() => {
        expect(wrapper.vm.hasSelected).toBeTruthy()
      })
    })

    it('hasSelected is false when the selectedRowKeys is empty', () => {
      wrapper = factory({}, { selectedRowKeys: [] })

      wrapper.vm.$nextTick(() => {
        expect(wrapper.vm.hasSelected).toBeFalsy()
      })
    })
  })

  describe('Methods', () => {
    describe('fetchData()', () => {
      it('routeName is set by $route name', () => {
        wrapper = factory()

        router.push({ name: 'testRouter1' })

        wrapper.vm.$nextTick(() => {
          expect(wrapper.vm.routeName).toEqual('testRouter1')
          expect(wrapper.vm.items).toEqual([])
        })
      })

      it('routeName is set by parent $route name', () => {
        wrapper = factory()

        router.replace('/test-router-3')

        wrapper.vm.$nextTick(() => {
          expect(wrapper.vm.routeName).toEqual('home')
        })
      })

      it('resource, dataView is set when $router params has id', () => {
        wrapper = factory()

        router.push({ name: 'testRouter4', params: { id: 'test-id' } })

        wrapper.vm.$nextTick(() => {
          expect(wrapper.vm.resource).toEqual({})
          expect(wrapper.vm.dataView).toBeTruthy()
        })
      })

      it('columnKeys, actions is set when $router meta has columns, actions', () => {
        wrapper = factory()
        const mockData = {
          testapinamecase1response: {
            count: 0,
            testapinamecase1: []
          }
        }

        mockAxios.mockImplementation(() => Promise.resolve(mockData))
        router.push({ name: 'testRouter5' })

        wrapper.vm.$nextTick(() => {
          expect(wrapper.vm.columnKeys.length).toEqual(3)
          expect(wrapper.vm.actions.length).toEqual(1)
          expect(wrapper.vm.columnKeys).toEqual(['column1', 'column2', 'column3'])
          expect(wrapper.vm.actions).toEqual([{
            name: 'label.name',
            icon: 'plus',
            listView: true
          }])
        })
      })

      it('api is called with $router query params', (done) => {
        wrapper = factory()

        const postData = new URLSearchParams()
        const mockData = {
          testapinamecase2response: {
            count: 0,
            testapinamecase2: []
          }
        }

        mockAxios.mockImplementation(() => Promise.resolve(mockData))
        router.push({ name: 'testRouter6', query: { key: 'test-value' } })

        wrapper.vm.$nextTick(() => {
          expect(mockAxios).toHaveBeenCalledTimes(1)
          expect(mockAxios).toHaveBeenCalledWith({
            data: postData,
            method: 'GET',
            params: {
              command: 'testApiNameCase2',
              listall: true,
              key: 'test-value',
              page: 1,
              pagesize: 10,
              response: 'json'
            },
            url: '/'
          })

          done()
        })
      })

      it('api is called with $router meta params', (done) => {
        wrapper = factory()

        const postData = new URLSearchParams()
        const mockData = {
          testapinamecase3response: {
            count: 0,
            testapinamecase3: []
          }
        }

        mockAxios.mockImplementation(() => Promise.resolve(mockData))
        router.push({ name: 'testRouter7' })

        wrapper.vm.$nextTick(() => {
          expect(mockAxios).toHaveBeenCalledTimes(1)
          expect(mockAxios).toHaveBeenCalledWith({
            data: postData,
            method: 'GET',
            params: {
              command: 'testApiNameCase3',
              listall: true,
              key: 'test-value',
              page: 1,
              pagesize: 10,
              response: 'json'
            },
            url: '/'
          })

          done()
        })
      })

      it('selectedFilter is `self` by $route meta filters and normal user', () => {
        wrapper = factory()

        const mockData = {
          listtemplateresponse: {
            count: 0,
            template: []
          }
        }

        mockAxios.mockImplementation(() => Promise.resolve(mockData))
        router.push({ name: 'testRouter8' })

        wrapper.vm.$nextTick(() => {
          expect(wrapper.vm.selectedFilter).toEqual('self')
          expect(wrapper.vm.filters).toEqual(['name', 'domainid'])
        })
      })

      it('selectedFilter is `all` by $route meta filters and Admin user', () => {
        state.user.info.roletype = 'Admin'
        store = mockStore.mock(state)
        wrapper = factory()

        const mockData = {
          listtemplateresponse: {
            count: 0,
            template: []
          }
        }

        mockAxios.mockImplementation(() => Promise.resolve(mockData))
        router.push({ name: 'testRouter8' })

        wrapper.vm.$nextTick(() => {
          expect(wrapper.vm.selectedFilter).toEqual('all')
          expect(wrapper.vm.filters).toEqual(['all', 'name', 'domainid'])
        })
      })

      it('api call with params templatefilter', (done) => {
        wrapper = factory()

        const mockData = {
          listtemplateresponse: {
            count: 0,
            template: []
          }
        }

        mockAxios.mockImplementation(() => Promise.resolve(mockData))
        router.push({ name: 'testRouter9' })

        wrapper.vm.$nextTick(() => {
          expect(mockAxios).toHaveBeenCalledTimes(1)
          expect(mockAxios).toHaveBeenCalledWith({
            data: new URLSearchParams(),
            method: 'GET',
            params: {
              command: 'listTemplates',
              templatefilter: 'self',
              listall: true,
              page: 1,
              pagesize: 10,
              response: 'json'
            },
            url: '/'
          })

          done()
        })
      })

      it('api call with params isofilter', (done) => {
        wrapper = factory()

        const mockData = {
          listtemplateresponse: {
            count: 0,
            template: []
          }
        }

        mockAxios.mockImplementation(() => Promise.resolve(mockData))
        router.push({ name: 'testRouter10' })

        wrapper.vm.$nextTick(() => {
          expect(mockAxios).toHaveBeenCalledTimes(1)
          expect(mockAxios).toHaveBeenCalledWith({
            data: new URLSearchParams(),
            method: 'GET',
            params: {
              command: 'listTemplates',
              isofilter: 'self',
              listall: true,
              page: 1,
              pagesize: 10,
              response: 'json'
            },
            url: '/'
          })

          done()
        })
      })

      it('api call with searchQuery', (done) => {
        wrapper = factory()

        const mockData = {
          testapinamecase2response: {
            count: 0,
            testapinamecase2: []
          }
        }

        router.push({ name: 'testRouter11' })
        mockAxios.mockResolvedValue(mockData)
        wrapper.setData({ searchQuery: 'test-query' })
        wrapper.vm.fetchData()

        wrapper.vm.$nextTick(() => {
          expect(mockAxios).toHaveBeenCalledTimes(2)
          expect(mockAxios).toHaveBeenCalledWith({
            url: '/',
            method: 'GET',
            data: new URLSearchParams(),
            params: {
              command: 'testApiNameCase2',
              listall: true,
              keyword: 'test-query',
              page: 1,
              pagesize: 10,
              response: 'json'
            }
          })

          done()
        })
      })

      it('api call with searchQuery and apiName equal `listRoles`', (done) => {
        wrapper = factory()

        const mockData = {
          listrolesresponse: {
            count: 0,
            roles: []
          }
        }

        router.push({ name: 'testRouter12' })
        mockAxios.mockResolvedValue(mockData)
        wrapper.setData({ searchQuery: 'test-query' })
        wrapper.vm.fetchData()

        wrapper.vm.$nextTick(() => {
          expect(mockAxios).toHaveBeenCalledTimes(2)
          expect(mockAxios).toHaveBeenCalledWith({
            url: '/',
            method: 'GET',
            data: new URLSearchParams(),
            params: {
              command: 'listRoles',
              listall: true,
              name: 'test-query',
              page: 1,
              pagesize: 10,
              response: 'json'
            }
          })

          done()
        })
      })

      it('api call with searchQuery and apiName equal `quotaEmailTemplateList`', (done) => {
        wrapper = factory()

        const mockData = {
          quotaemailtemplatelistresponse: {
            count: 0,
            quotaemailtemplatelist: []
          }
        }

        router.push({ name: 'testRouter13' })
        mockAxios.mockResolvedValue(mockData)
        wrapper.setData({ searchQuery: 'test-query' })
        wrapper.vm.fetchData()

        wrapper.vm.$nextTick(() => {
          expect(mockAxios).toHaveBeenCalledTimes(2)
          expect(mockAxios).toHaveBeenCalledWith({
            url: '/',
            method: 'GET',
            data: new URLSearchParams(),
            params: {
              command: 'quotaEmailTemplateList',
              listall: true,
              templatetype: 'test-query',
              page: 1,
              pagesize: 10,
              response: 'json'
            }
          })

          done()
        })
      })
    })
  })
})
