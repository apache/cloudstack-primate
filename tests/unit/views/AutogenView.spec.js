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
import { notifierPlugin } from '@/utils/plugins'

jest.mock('axios', () => mockAxios)
localVue.use(notifierPlugin)

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
  testApiNameCase4: {
    params: {},
    response: [
      {
        name: 'column2',
        type: 'string'
      },
      {
        name: 'column1',
        type: 'string'
      },
      {
        name: 'column3',
        type: 'string'
      }
    ]
  },
  testApiNameCase5: {
    params: [
      {
        name: 'column2',
        type: 'string'
      },
      {
        name: 'column1',
        type: 'string'
      },
      {
        name: 'column3',
        type: 'string'
      },
      {
        name: 'name',
        type: 'string'
      },
      {
        name: 'id',
        type: 'string'
      }
    ],
    response: []
  },
  testApiNameCase6: {
    params: [
      {
        name: 'id',
        type: 'uuid'
      },
      {
        name: 'tags',
        type: 'list'
      },
      {
        name: 'column1',
        type: 'list'
      },
      {
        name: 'column2',
        type: 'string'
      },
      {
        name: 'account',
        type: 'string'
      }
    ],
    response: []
  },
  listTemplates: {
    params: {},
    response: []
  },
  listIsos: {
    params: {},
    response: []
  },
  listRoles: {
    params: {},
    response: []
  },
  listHosts: {
    params: {},
    response: []
  },
  listTestApiNames: {
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
    id: 'uuid-en',
    displaytext: 'description-en',
    name: 'name-en',
    domainid: 'domain-en',
    self: 'self-en',
    all: 'all-en',
    tags: 'tags-en',
    account: 'account-en'
  },
  de: {
    'label.name': 'test-name-de',
    column1: 'column1-de',
    column2: 'column2-de',
    column3: 'column3-de',
    id: 'uuid-de',
    displaytext: 'description-de',
    name: 'name-de',
    domainid: 'domain-de',
    self: 'self-de',
    all: 'all-de',
    tags: 'tags-de',
    account: 'account-de'
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
      testApiNameCase4: {
        params: {},
        response: [
          {
            name: 'column2',
            type: 'string'
          },
          {
            name: 'column1',
            type: 'string'
          },
          {
            name: 'column3',
            type: 'string'
          }
        ]
      },
      testApiNameCase5: {
        params: [
          {
            name: 'column2',
            type: 'string'
          },
          {
            name: 'column1',
            type: 'string'
          },
          {
            name: 'column3',
            type: 'string'
          },
          {
            name: 'name',
            type: 'string'
          },
          {
            name: 'id',
            type: 'string'
          }
        ],
        response: []
      },
      testApiNameCase6: {
        params: [
          {
            name: 'id',
            type: 'uuid'
          },
          {
            name: 'tags',
            type: 'list'
          },
          {
            name: 'column1',
            type: 'list'
          },
          {
            name: 'column2',
            type: 'string'
          },
          {
            name: 'account',
            type: 'string'
          }
        ],
        response: []
      },
      listTemplates: {
        params: {},
        response: []
      },
      listIsos: {
        params: {},
        response: []
      },
      listHosts: {
        params: {},
        response: []
      },
      listRoles: {
        params: {},
        response: []
      },
      listTestApiName: {
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

let router
let store = mockStore.mock(state)
const i18n = mockI18n.mock('en', messages)
const mocks = {
  $notifyError: jest.fn((error) => {
    return error
  })
}

const createRouter = (newRoute = []) => {
  let routes = []
  if (!newRoute || Object.keys(newRoute).length === 0) {
    return mockRouter.mock(routes)
  }

  routes = [...newRoute]

  return mockRouter.mock(routes)
}

const factory = (propData = {}, data = {}) => {
  return mount(AutogenView, {
    localVue,
    router,
    i18n,
    store,
    propsData: propData,
    mocks,
    data () {
      return { ...data }
    }
  })
}

describe('Views > AutogenView.vue', () => {
  let wrapper

  beforeEach(() => {
    jest.clearAllMocks()
    if (wrapper) {
      wrapper.destroy()
    }
    if (router && router.currentRoute.name !== 'home') {
      router.replace({ name: 'home' })
    }
    state.user.info.roletype = 'Normal'
    store = mockStore.mock(state)
    if (i18n.locale !== 'en') {
      i18n.locale = 'en'
    }
  })

  describe('Navigation Guard', () => {
    it('beforeRouteUpdate() is called', () => {
      router = createRouter([{
        name: 'testRouter1',
        path: '/test-router-1',
        meta: {
          icon: 'test-router-1'
        }
      }])
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
      router = createRouter([{
        name: 'testRouter1',
        path: '/test-router-1',
        meta: {
          icon: 'test-router-1'
        }
      }])
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
        router = createRouter([{
          name: 'testRouter1',
          path: '/test-router-1',
          meta: {
            icon: 'test-router-1'
          }
        }])
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
        router = createRouter([{
          name: 'testRouter2',
          path: '/test-router-2',
          meta: {
            icon: 'test-router-2'
          }
        }])
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
        router = createRouter([{
          name: 'testRouter1',
          path: '/test-router-1',
          meta: {
            icon: 'test-router-1'
          }
        }])
        wrapper = factory()

        router.push({ name: 'testRouter1' })

        wrapper.vm.$nextTick(() => {
          expect(wrapper.vm.routeName).toEqual('testRouter1')
          expect(wrapper.vm.items).toEqual([])
        })
      })

      it('routeName is set by parent $route name', () => {
        router = createRouter([{
          path: '/test-router-3',
          meta: {
            icon: 'test-router-3'
          }
        }])
        wrapper = factory()

        router.replace('/test-router-3')

        wrapper.vm.$nextTick(() => {
          expect(wrapper.vm.routeName).toEqual('home')
        })
      })

      it('resource, dataView is set when $router params has id', () => {
        router = createRouter([{
          name: 'testRouter4',
          path: '/test-router-4/:id',
          meta: {
            icon: 'test-router-4'
          }
        }])
        wrapper = factory()

        router.push({ name: 'testRouter4', params: { id: 'test-id' } })

        wrapper.vm.$nextTick(() => {
          expect(wrapper.vm.resource).toEqual({})
          expect(wrapper.vm.dataView).toBeTruthy()
        })
      })

      it('columnKeys, actions is set when $router meta has columns, actions', () => {
        router = createRouter([{
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
        }])
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

      it('check columnKeys has assign and sort by store apis', () => {
        router = createRouter([{
          name: 'testRouter6',
          path: 'test-router-6',
          meta: {
            icon: 'test-router-6',
            permission: ['testApiNameCase4']
          }
        }])
        wrapper = factory()

        const mockData = {
          testapinamecase4response: {
            count: 0,
            testapinamecase4: []
          }
        }

        mockAxios.mockImplementation(() => Promise.resolve(mockData))
        router.push({ name: 'testRouter6' })

        wrapper.vm.$nextTick(() => {
          expect(wrapper.vm.columnKeys.length).toEqual(3)
          expect(wrapper.vm.columnKeys).toEqual(['column1', 'column2', 'column3'])
        })
      })

      it('check columns is set when columnKeys has object value', () => {
        router = createRouter([{
          name: 'testRouter7',
          path: 'test-router-7',
          meta: {
            icon: 'test-router-7',
            permission: ['testApiNameCase1'],
            columns: [{ name: 'string' }]
          }
        }])
        wrapper = factory()

        const mockData = {
          testapinamecase1response: {
            count: 0,
            testapinamecase1: []
          }
        }

        mockAxios.mockImplementation(() => Promise.resolve(mockData))
        router.push({ name: 'testRouter7' })

        wrapper.vm.$nextTick(() => {
          expect(wrapper.vm.columns.length).toEqual(1)
          expect(wrapper.vm.columns[0].title).toEqual('name-en')
          expect(wrapper.vm.columns[0].dataIndex).toEqual('name')
          expect(wrapper.vm.columns[0].scopedSlots).toEqual({ customRender: 'name' })
          expect(typeof wrapper.vm.columns[0].sorter).toBe('function')
        })
      })

      it('api is called with $router query params', (done) => {
        router = createRouter([{
          name: 'testRouter8',
          path: '/test-router-8',
          meta: {
            icon: 'test-router-8',
            permission: ['testApiNameCase2']
          }
        }])
        wrapper = factory()

        const postData = new URLSearchParams()
        const mockData = {
          testapinamecase2response: {
            count: 0,
            testapinamecase2: []
          }
        }

        mockAxios.mockImplementation(() => Promise.resolve(mockData))
        router.push({ name: 'testRouter8', query: { key: 'test-value' } })

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
        router = createRouter([{
          name: 'testRouter9',
          path: '/test-router-9',
          meta: {
            icon: 'test-router-9',
            permission: ['testApiNameCase3'],
            params: {
              key: 'test-value'
            }
          }
        }])
        wrapper = factory()

        const postData = new URLSearchParams()
        const mockData = {
          testapinamecase3response: {
            count: 0,
            testapinamecase3: []
          }
        }

        mockAxios.mockImplementation(() => Promise.resolve(mockData))
        router.push({ name: 'testRouter9' })

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
        router = createRouter([{
          name: 'testRouter10',
          path: '/test-router-10',
          meta: {
            icon: 'test-router-10',
            permission: ['listTemplates'],
            filters: ['name', 'domainid']
          }
        }])
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
          expect(wrapper.vm.selectedFilter).toEqual('self')
          expect(wrapper.vm.filters).toEqual(['name', 'domainid'])
        })
      })

      it('selectedFilter is `all` by $route meta filters and Admin user', () => {
        router = createRouter([{
          name: 'testRouter11',
          path: '/test-router-11',
          meta: {
            icon: 'test-router-11',
            permission: ['listTemplates'],
            filters: ['name', 'domainid']
          }
        }])
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
        router.push({ name: 'testRouter11' })

        wrapper.vm.$nextTick(() => {
          expect(wrapper.vm.selectedFilter).toEqual('all')
          expect(wrapper.vm.filters).toEqual(['all', 'name', 'domainid'])
        })
      })

      it('api call with params templatefilter', (done) => {
        router = createRouter([{
          name: 'testRouter12',
          path: '/template',
          meta: {
            icon: 'test-router-12',
            permission: ['listTemplates'],
            filters: ['name', 'domainid']
          }
        }])
        wrapper = factory()

        const mockData = {
          listtemplateresponse: {
            count: 0,
            template: []
          }
        }

        mockAxios.mockImplementation(() => Promise.resolve(mockData))
        router.push({ name: 'testRouter12' })

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
        router = createRouter([{
          name: 'testRouter13',
          path: '/iso',
          meta: {
            icon: 'test-router-13',
            permission: ['listTemplates'],
            filters: ['name', 'domainid']
          }
        }])
        wrapper = factory()

        const mockData = {
          listtemplateresponse: {
            count: 0,
            template: []
          }
        }

        mockAxios.mockImplementation(() => Promise.resolve(mockData))
        router.push({ name: 'testRouter13' })

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
        router = createRouter([{
          name: 'testRouter14',
          path: '/test-router-14',
          meta: {
            icon: 'test-router-14',
            permission: ['testApiNameCase2']
          }
        }])
        wrapper = factory()

        const mockData = {
          testapinamecase2response: {
            count: 0,
            testapinamecase2: []
          }
        }

        router.push({ name: 'testRouter14' })
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
        router = createRouter([{
          name: 'testRouter15',
          path: '/test-router-15',
          meta: {
            icon: 'test-router-15',
            permission: ['listRoles']
          }
        }])
        wrapper = factory()

        const mockData = {
          listrolesresponse: {
            count: 0,
            roles: []
          }
        }

        router.push({ name: 'testRouter15' })
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
        router = createRouter([{
          name: 'testRouter16',
          path: '/test-router-16',
          meta: {
            icon: 'test-router-16',
            permission: ['quotaEmailTemplateList']
          }
        }])
        wrapper = factory()

        const mockData = {
          quotaemailtemplatelistresponse: {
            count: 0,
            quotaemailtemplatelist: []
          }
        }

        router.push({ name: 'testRouter16' })
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

      it('api call with $router params id and `ssh` path', (done) => {
        router = createRouter([{
          name: 'testRouter17',
          path: '/ssh/:id',
          meta: {
            icon: 'test-router-17',
            permission: ['testApiNameCase1']
          }
        }])
        wrapper = factory()

        const mockData = {
          testapinamecase1response: {
            count: 0,
            testapinamecase1: []
          }
        }

        router.push({ name: 'testRouter17', params: { id: 'test-id' } })
        mockAxios.mockResolvedValue(mockData)

        wrapper.vm.$nextTick(() => {
          expect(mockAxios).toHaveBeenCalledTimes(1)
          expect(mockAxios).toHaveBeenCalledWith({
            url: '/',
            method: 'GET',
            data: new URLSearchParams(),
            params: {
              command: 'testApiNameCase1',
              listall: true,
              id: 'test-id',
              name: 'test-id',
              page: 1,
              pagesize: 10,
              response: 'json'
            }
          })

          done()
        })
      })

      it('api call with $router params id and `ldapsetting` path', (done) => {
        router = createRouter([{
          name: 'testRouter18',
          path: '/ldapsetting/:id',
          meta: {
            icon: 'test-router-18',
            permission: ['testApiNameCase1']
          }
        }])
        wrapper = factory()

        const mockData = {
          testapinamecase1response: {
            count: 0,
            testapinamecase1: []
          }
        }

        router.push({ name: 'testRouter18', params: { id: 'test-id' } })
        mockAxios.mockResolvedValue(mockData)

        wrapper.vm.$nextTick(() => {
          expect(mockAxios).toHaveBeenCalledTimes(1)
          expect(mockAxios).toHaveBeenCalledWith({
            url: '/',
            method: 'GET',
            data: new URLSearchParams(),
            params: {
              command: 'testApiNameCase1',
              listall: true,
              id: 'test-id',
              hostname: 'test-id',
              page: 1,
              pagesize: 10,
              response: 'json'
            }
          })

          done()
        })
      })

      it('check item result when api call with apiName equal `listTemplates` || `listIsos`', (done) => {
        router = createRouter([{
          name: 'testRouter19',
          path: '/templates',
          meta: {
            icon: 'test-router-19',
            permission: ['listTemplates']
          }
        }])
        wrapper = factory()

        const mockData = {
          listtemplatesresponse: {
            count: 2,
            templates: [{
              id: 'uuid1',
              templateid: 'templateid-1',
              name: 'template-test-1'
            }, {
              id: 'uuid2',
              templateid: 'templateid-2',
              name: 'template-test-2'
            }]
          }
        }

        router.push({ name: 'testRouter19' })
        mockAxios.mockResolvedValue(mockData)

        setTimeout(() => {
          expect(mockAxios).toHaveBeenCalledTimes(1)
          expect(mockAxios).toHaveBeenLastCalledWith({
            url: '/',
            method: 'GET',
            data: new URLSearchParams(),
            params: {
              command: 'listTemplates',
              listall: true,
              page: 1,
              pagesize: 10,
              response: 'json'
            }
          })

          expect(wrapper.vm.items.length).toEqual(2)
          expect(wrapper.vm.items).toEqual([
            {
              id: 'uuid1',
              templateid: 'templateid-1',
              name: 'template-test-1',
              key: 0
            },
            {
              id: 'uuid2',
              templateid: 'templateid-2',
              name: 'template-test-2',
              key: 1
            }
          ])
          expect(wrapper.vm.resource).toEqual({
            id: 'uuid1',
            templateid: 'templateid-1',
            name: 'template-test-1',
            key: 0
          })

          done()
        })
      })

      it('check item result when api call with columns has column customRender is object', (done) => {
        router = createRouter([{
          name: 'testRouter20',
          path: '/test-router-20',
          meta: {
            icon: 'test-router-20',
            permission: ['testApiNameCase1'],
            columns: [
              'id',
              'name',
              {
                column1: (record) => {
                  return record.name
                }
              }
            ]
          }
        }])
        wrapper = factory()

        const mockData = {
          testapinamecase1response: {
            count: 1,
            testapinamecase1: [{
              id: 'test-id',
              name: 'test-name-value'
            }]
          }
        }

        router.push({ name: 'testRouter20' })
        mockAxios.mockResolvedValue(mockData)

        setTimeout(() => {
          expect(wrapper.vm.items).toEqual([{
            id: 'test-id',
            name: 'test-name-value',
            key: 0,
            column1: 'test-name-value'
          }])
          expect(wrapper.vm.resource).toEqual({
            id: 'test-id',
            name: 'test-name-value',
            key: 0,
            column1: 'test-name-value'
          })

          done()
        })
      })

      it('check item result when api call with $router path start with `/ssh`', (done) => {
        router = createRouter([{
          name: 'testRouter21',
          path: '/ssh',
          meta: {
            icon: 'test-router-21',
            permission: ['testApiNameCase1']
          }
        }])
        wrapper = factory()

        const mockData = {
          testapinamecase1response: {
            count: 1,
            testapinamecase1: [{
              name: 'test-name-value'
            }]
          }
        }

        router.push({ name: 'testRouter21' })
        mockAxios.mockResolvedValue(mockData)

        setTimeout(() => {
          expect(wrapper.vm.items).toEqual([{
            id: 'test-name-value',
            name: 'test-name-value',
            key: 0
          }])
          expect(wrapper.vm.resource).toEqual({
            id: 'test-name-value',
            name: 'test-name-value',
            key: 0
          })

          done()
        })
      })

      it('check item result when api call with $router path start with `/ldapsetting`', (done) => {
        router = createRouter([{
          name: 'testRouter22',
          path: '/ldapsetting',
          meta: {
            icon: 'test-router-22',
            permission: ['testApiNameCase1']
          }
        }])
        wrapper = factory()

        const mockData = {
          testapinamecase1response: {
            count: 1,
            testapinamecase1: [{
              name: 'test-name-value',
              hostname: 'test-hostname-value'
            }]
          }
        }

        router.push({ name: 'testRouter22' })
        mockAxios.mockResolvedValue(mockData)

        setTimeout(() => {
          expect(wrapper.vm.items).toEqual([{
            id: 'test-hostname-value',
            name: 'test-name-value',
            hostname: 'test-hostname-value',
            key: 0
          }])
          expect(wrapper.vm.resource).toEqual({
            id: 'test-hostname-value',
            name: 'test-name-value',
            hostname: 'test-hostname-value',
            key: 0
          })

          done()
        })
      })

      it('api call with error message but not status', (done) => {
        router = createRouter([{
          name: 'testRouter22',
          path: '/test-router-22',
          meta: {
            icon: 'test-router-22',
            permission: ['testApiNameCase1']
          }
        }])

        wrapper = factory()

        const errorMock = {
          response: {},
          message: 'Error: throw exception error'
        }
        router.push({ name: 'testRouter22' })
        mockAxios.mockRejectedValue(errorMock)

        setTimeout(() => {
          expect(mocks.$notifyError).toHaveBeenCalledTimes(1)
          expect(mocks.$notifyError).toHaveBeenCalledWith(errorMock)
          done()
        })
      })

      it('api call with error is `Forbidden`', (done) => {
        router = createRouter([{
          name: 'testRouter23',
          path: '/test-router-23',
          meta: {
            icon: 'test-router-23',
            permission: ['testApiNameCase1']
          }
        }])

        wrapper = factory()

        const errorMock = {
          response: {
            status: 401
          },
          message: 'Error: Unauthorized'
        }
        router.push({ name: 'testRouter23' })
        mockAxios.mockRejectedValue(errorMock)

        setTimeout(() => {
          expect(mocks.$notifyError).toHaveBeenCalledTimes(1)
          expect(mocks.$notifyError).toHaveBeenCalledWith(errorMock)
          expect(router.currentRoute.path).toEqual('/exception/403')

          done()
        })
      })

      it('api call with error is `Not Found`', (done) => {
        router = createRouter([{
          name: 'testRouter23',
          path: '/test-router-23',
          meta: {
            icon: 'test-router-23',
            permission: ['testApiNameCase1']
          }
        }])

        wrapper = factory()

        const errorMock = {
          response: {
            status: 430
          },
          message: 'Error: Request Header Fields Too Large'
        }
        router.push({ name: 'testRouter23' })
        mockAxios.mockRejectedValue(errorMock)

        setTimeout(() => {
          expect(mocks.$notifyError).toHaveBeenCalledTimes(1)
          expect(mocks.$notifyError).toHaveBeenCalledWith(errorMock)
          expect(router.currentRoute.path).toEqual('/exception/404')

          done()
        })
      })

      it('api call with error is `Internal Server Error`', (done) => {
        router = createRouter([{
          name: 'testRouter23',
          path: '/test-router-23',
          meta: {
            icon: 'test-router-23',
            permission: ['testApiNameCase1']
          }
        }])

        wrapper = factory()

        const errorMock = {
          response: {
            status: 530
          },
          message: 'Error: Site is frozen'
        }
        router.push({ name: 'testRouter23' })
        mockAxios.mockRejectedValue(errorMock)

        setTimeout(() => {
          expect(mocks.$notifyError).toHaveBeenCalledTimes(1)
          expect(mocks.$notifyError).toHaveBeenCalledWith(errorMock)
          expect(router.currentRoute.path).toEqual('/exception/500')

          done()
        })
      })
    })

    describe('onSearch()', () => {
      it('fetchData() is call with searchQuery empty', (done) => {
        router = createRouter([{
          name: 'testRouter24',
          path: '/test-router-24',
          meta: {
            icon: 'test-router-24',
            permission: ['testApiNameCase1']
          }
        }])
        wrapper = factory({}, { page: 2 })
        router.push({ name: 'testRouter24' })

        const spy = jest.spyOn(wrapper.vm, 'fetchData')
        const mockData = {
          testapinamecase1response: {
            count: 1,
            testapinamecase1: [{
              id: 'test-id-value',
              name: 'test-name-value'
            }]
          }
        }
        mockAxios.mockResolvedValue(mockData)

        wrapper.vm.$nextTick(() => {
          wrapper.vm.onSearch('')

          expect(wrapper.vm.page).toEqual(1)
          expect(wrapper.vm.searchQuery).toEqual('')
          expect(spy).toHaveBeenCalled()

          done()
        })
      })

      it('fetchData() is call with searchQuery not empty', (done) => {
        router = createRouter([{
          name: 'testRouter25',
          path: '/test-router-25',
          meta: {
            icon: 'test-router-25',
            permission: ['testApiNameCase1']
          }
        }])
        wrapper = factory({}, { page: 2 })
        router.push({ name: 'testRouter25' })

        const spy = jest.spyOn(wrapper.vm, 'fetchData')
        const mockData = {
          testapinamecase1response: {
            count: 1,
            testapinamecase1: [{
              id: 'test-id-value',
              name: 'test-name-value'
            }]
          }
        }
        mockAxios.mockResolvedValue(mockData)

        wrapper.vm.$nextTick(() => {
          wrapper.vm.onSearch('test-query-value')

          expect(wrapper.vm.page).toEqual(1)
          expect(wrapper.vm.searchQuery).toEqual('test-query-value')
          expect(spy).toHaveBeenCalled()

          done()
        })
      })
    })

    describe('closeAction()', () => {
      it('reset all data action when called', () => {
        wrapper = factory({}, {
          currentAction: {
            loading: true
          },
          showAction: true
        })

        expect(wrapper.vm.currentAction).toEqual({ loading: true })
        expect(wrapper.vm.showAction).toBeTruthy()

        wrapper.vm.$nextTick(() => {
          wrapper.vm.closeAction()

          expect(wrapper.vm.currentAction).toEqual({})
          expect(wrapper.vm.showAction).toBeFalsy()
        })
      })
    })

    describe('execAction()', () => {
      it('is call and redirect to action api', () => {
        router = createRouter([{
          name: 'testRouter26',
          path: '/test-router-26',
          meta: {
            icon: 'test-router-26'
          }
        }])
        wrapper = factory({}, { actionData: [{ name: 'test-add-action' }] })

        expect(wrapper.vm.actionData).toEqual([{ name: 'test-add-action' }])
        expect(router.currentRoute.name).toEqual('home')

        wrapper.vm.$nextTick(() => {
          wrapper.vm.execAction({
            label: 'label.name',
            icon: 'plus',
            component: () => jest.fn(),
            api: 'testRouter26',
            popup: false
          })

          expect(wrapper.vm.showAction).toBeFalsy()
          expect(wrapper.vm.actionData).toEqual([])
          expect(router.currentRoute.name).toEqual('testRouter26')
        })
      })

      it('check currentAction params when execAction is call with action (`arg` not in action)', () => {
        wrapper = factory()

        wrapper.vm.$nextTick(() => {
          wrapper.vm.execAction({
            api: 'testApiNameCase5'
          })

          expect(wrapper.vm.currentAction.params).toEqual([
            { name: 'id', type: 'string' },
            { name: 'name', type: 'string' },
            { name: 'column1', type: 'string' },
            { name: 'column2', type: 'string' },
            { name: 'column3', type: 'string' }
          ])
          expect(wrapper.vm.currentAction.paramFields).toEqual([])
          expect(wrapper.vm.showAction).toBeTruthy()
        })
      })

      it('check currentAction params when execAction is call with action (`arg` exists in action)', () => {
        wrapper = factory()

        wrapper.vm.$nextTick(() => {
          wrapper.vm.execAction({
            api: 'testApiNameCase5',
            args: ['column1', 'column2', 'column3']
          })

          expect(wrapper.vm.currentAction.params).toEqual([
            { name: 'column1', type: 'string' },
            { name: 'column2', type: 'string' },
            { name: 'column3', type: 'string' },
            { name: 'name', type: 'string' },
            { name: 'id', type: 'string' }
          ])
          expect(wrapper.vm.currentAction.paramFields).toEqual([
            { name: 'column1', type: 'string' },
            { name: 'column2', type: 'string' },
            { name: 'column3', type: 'string' }
          ])
          expect(wrapper.vm.showAction).toBeTruthy()
        })
      })

      it('check currentAction when execAction is call with action (`arg` is function and exists in action)', () => {
        wrapper = factory()

        wrapper.vm.$nextTick(() => {
          wrapper.vm.execAction({
            api: 'testApiNameCase5',
            resource: { id: 'test-id-value', name: 'test-name-value' },
            args: (record, store) => {
              return ['Admin'].includes(store.userInfo.roletype) ? ['column1', 'column2', 'column3'] : ['id', 'name']
            }
          })

          expect(wrapper.vm.currentAction.params).toEqual([
            { name: 'id', type: 'string' },
            { name: 'name', type: 'string' },
            { name: 'column1', type: 'string' },
            { name: 'column2', type: 'string' },
            { name: 'column3', type: 'string' }
          ])
          expect(wrapper.vm.currentAction.paramFields).toEqual([
            { name: 'id', type: 'string' },
            { name: 'name', type: 'string' }
          ])
          expect(wrapper.vm.showAction).toBeTruthy()
        })
      })

      it('listUuidOpts() is called when params has `list` type and name equals `tags`, listUuidOpts is called', () => {
        wrapper = factory()
        const spy = jest.spyOn(wrapper.vm, 'listUuidOpts')

        wrapper.vm.$nextTick(() => {
          wrapper.vm.execAction({
            api: 'testApiNameCase6',
            args: ['id', 'tags', 'column1', 'column2', 'account'],
            mapping: {
              column2: () => {
                return 'test-value'
              }
            }
          })

          expect(wrapper.vm.currentAction.paramFields).toEqual([
            { name: 'id', type: 'uuid' },
            { name: 'tags', type: 'string' },
            { name: 'column1', type: 'list' },
            { name: 'column2', type: 'string' },
            { name: 'account', type: 'string' }
          ])
          expect(wrapper.vm.showAction).toBeTruthy()
          expect(spy).toHaveBeenCalled()
          expect(spy).toHaveBeenCalledWith({ name: 'id', type: 'uuid' })
          expect(spy).toHaveBeenCalledWith({ name: 'column1', type: 'list' })
          expect(spy).toHaveBeenCalledWith({ name: 'column2', type: 'string' })
          expect(spy).toHaveBeenCalledWith({ name: 'account', type: 'string' })
        })
      })

      it('fillEditFormFieldValues() is call when action has dataView and edit', () => {
        wrapper = factory()
        const spy = jest.spyOn(wrapper.vm, 'fillEditFormFieldValues')

        wrapper.vm.$nextTick(() => {
          wrapper.vm.execAction({
            api: 'testApiNameCase6',
            dataView: true,
            icon: 'edit'
          })

          expect(spy).toHaveBeenCalled()
        })
      })
    })

    describe('listUuidOpts()', () => {
      it('api is not called when the specified condition is not met.', (done) => {
        wrapper = factory({}, {
          currentAction: {
            mapping: {
              id: () => { return '' }
            }
          }
        })

        wrapper.vm.listUuidOpts({ name: 'id', type: 'uuid' })

        setTimeout(() => {
          expect(mockAxios).not.toHaveBeenCalled()
          done()
        })
      })

      it('api is not called when possibleApi is empty', (done) => {
        wrapper = factory({}, {
          currentAction: {
            mapping: {}
          }
        })

        wrapper.vm.listUuidOpts({ name: 'test-name', type: 'uuid' })

        setTimeout(() => {
          expect(mockAxios).not.toHaveBeenCalled()
          done()
        })
      })

      // it('api is called when qualifying is met.', (done) => {
      //   wrapper = factory({}, {
      //     currentAction: {
      //       mapping: {}
      //     }
      //   })
      //
      //   const mockData = {
      //     listtemplateresponse: {
      //       count: 0,
      //       templates: []
      //     }
      //   }
      //
      //   mockAxios.mockResolvedValue(mockData)
      //   wrapper.vm.listUuidOpts({ name: 'templateid', type: 'uuid' })
      //
      //   setTimeout(() => {
      //     expect(mockAxios).toHaveBeenCalledTimes(1)
      //     done()
      //   })
      // })

      it('api is called with possibleApi equal mapping api from action', (done) => {
        const param = { name: 'template', type: 'uuid' }
        const mockData = {
          testapinamecase1response: {
            count: 1,
            testapinamecase1: [{
              id: 'test-id-value',
              name: 'test-name-value'
            }]
          }
        }

        wrapper = factory({}, {
          currentAction: {
            mapping: {
              template: {
                api: 'testApiNameCase1'
              }
            }
          }
        })

        mockAxios.mockResolvedValue(mockData)
        wrapper.vm.listUuidOpts(param)

        setTimeout(() => {
          expect(mockAxios).toHaveBeenCalledTimes(1)
          expect(mockAxios).toHaveBeenCalledWith({
            url: '/',
            method: 'GET',
            data: new URLSearchParams(),
            params: {
              command: 'testApiNameCase1',
              listall: true,
              response: 'json'
            }
          })
          expect(param).toEqual({
            name: 'template',
            type: 'uuid',
            loading: false,
            opts: [{
              id: 'test-id-value',
              name: 'test-name-value'
            }]
          })

          done()
        })
      })

      it('api is called with possibleApi equal apiName when param name equal `id`', (done) => {
        const param = { name: 'id', type: 'uuid' }
        const mockData = {
          testapinamecase1response: {
            count: 1,
            testapinamecase1: [{
              id: 'test-id-value',
              name: 'test-name-value'
            }]
          }
        }

        wrapper = factory()

        mockAxios.mockResolvedValue(mockData)
        wrapper.setData({
          currentAction: {
            mapping: {}
          },
          apiName: 'testApiNameCase1'
        })
        wrapper.vm.listUuidOpts(param)

        setTimeout(() => {
          expect(mockAxios).toHaveBeenCalledTimes(1)
          expect(mockAxios).toHaveBeenCalledWith({
            url: '/',
            method: 'GET',
            data: new URLSearchParams(),
            params: {
              command: 'testApiNameCase1',
              listall: true,
              response: 'json'
            }
          })
          expect(param).toEqual({
            name: 'id',
            type: 'uuid',
            loading: false,
            opts: [{
              id: 'test-id-value',
              name: 'test-name-value'
            }]
          })

          done()
        })
      })

      it('api is called with possibleApi equal api from store apis', (done) => {
        const param = { name: 'testapiname', type: 'uuid' }
        const mockData = {
          listtestapinamesresponse: {
            count: 1,
            testapiname: [{
              id: 'test-id-value',
              name: 'test-name-value'
            }]
          }
        }

        wrapper = factory()

        mockAxios.mockResolvedValue(mockData)
        wrapper.vm.listUuidOpts(param)

        setTimeout(() => {
          expect(mockAxios).toHaveBeenCalledTimes(1)
          expect(mockAxios).toHaveBeenCalledWith({
            url: '/',
            method: 'GET',
            data: new URLSearchParams(),
            params: {
              command: 'listTestApiNames',
              listall: true,
              response: 'json'
            }
          })
          expect(param).toEqual({
            name: 'testapiname',
            type: 'uuid',
            loading: false,
            opts: [{
              id: 'test-id-value',
              name: 'test-name-value'
            }]
          })

          done()
        })
      })

      it('api is called with params assign with mapping params', (done) => {
        const param = { name: 'template', type: 'uuid' }
        const mockData = {
          testapinamecase1response: {
            count: 0,
            testapinamecase1: [{
              id: 'test-id-value',
              name: 'test-name-value'
            }]
          }
        }

        wrapper = factory({}, {
          currentAction: {
            mapping: {
              template: {
                api: 'testApiNameCase1',
                params: (record) => {
                  return {
                    name: record.name
                  }
                }
              }
            }
          }
        })

        mockAxios.mockResolvedValue(mockData)
        wrapper.setData({
          resource: {
            id: 'test-id-value',
            name: 'test-name-value'
          }
        })
        wrapper.vm.listUuidOpts(param)

        setTimeout(() => {
          expect(mockAxios).toHaveBeenCalledTimes(1)
          expect(mockAxios).toHaveBeenCalledWith({
            url: '/',
            method: 'GET',
            data: new URLSearchParams(),
            params: {
              command: 'testApiNameCase1',
              listall: true,
              name: 'test-name-value',
              response: 'json'
            }
          })
          expect(param).toEqual({
            name: 'template',
            type: 'uuid',
            loading: false,
            opts: [{
              id: 'test-id-value',
              name: 'test-name-value'
            }]
          })

          done()
        })
      })

      it('api is called with params templatefilter when possibleApi equal listTemplates', (done) => {
        const param = { name: 'id', type: 'uuid' }
        const mockData = {
          listtemplateresponse: {
            count: 1,
            templates: [{
              id: 'test-id-value',
              name: 'test-name-value'
            }]
          }
        }

        wrapper = factory()

        mockAxios.mockResolvedValue(mockData)
        wrapper.setData({
          apiName: 'listTemplates'
        })
        wrapper.vm.listUuidOpts(param)

        setTimeout(() => {
          expect(mockAxios).toHaveBeenCalledTimes(1)
          expect(mockAxios).toHaveBeenCalledWith({
            url: '/',
            method: 'GET',
            data: new URLSearchParams(),
            params: {
              command: 'listTemplates',
              listall: true,
              templatefilter: 'executable',
              response: 'json'
            }
          })
          expect(param).toEqual({
            name: 'id',
            type: 'uuid',
            loading: false,
            opts: [{
              id: 'test-id-value',
              name: 'test-name-value'
            }]
          })

          done()
        })
      })

      it('api is called with params isofilter when possibleApi equal listIsos', (done) => {
        const param = { name: 'id', type: 'uuid' }
        const mockData = {
          listisosresponse: {
            count: 1,
            iso: [{
              id: 'test-id-value',
              name: 'test-name-value'
            }]
          }
        }

        wrapper = factory()

        mockAxios.mockResolvedValue(mockData)
        wrapper.setData({
          apiName: 'listIsos'
        })
        wrapper.vm.listUuidOpts(param)

        setTimeout(() => {
          expect(mockAxios).toHaveBeenCalledTimes(1)
          expect(mockAxios).toHaveBeenCalledWith({
            url: '/',
            method: 'GET',
            data: new URLSearchParams(),
            params: {
              command: 'listIsos',
              listall: true,
              isofilter: 'executable',
              response: 'json'
            }
          })
          expect(param).toEqual({
            name: 'id',
            type: 'uuid',
            loading: false,
            opts: [{
              id: 'test-id-value',
              name: 'test-name-value'
            }]
          })

          done()
        })
      })

      it('api is called with params type when possibleApi equal listHosts', (done) => {
        const param = { name: 'id', type: 'uuid' }
        const mockData = {
          listhostresponse: {
            count: 1,
            hosts: [{
              id: 'test-id-value',
              name: 'test-name-value'
            }]
          }
        }

        wrapper = factory()

        mockAxios.mockResolvedValue(mockData)
        wrapper.setData({
          apiName: 'listHosts'
        })
        wrapper.vm.listUuidOpts(param)

        setTimeout(() => {
          expect(mockAxios).toHaveBeenCalledTimes(1)
          expect(mockAxios).toHaveBeenCalledWith({
            url: '/',
            method: 'GET',
            data: new URLSearchParams(),
            params: {
              command: 'listHosts',
              listall: true,
              type: 'routing',
              response: 'json'
            }
          })
          expect(param).toEqual({
            name: 'id',
            type: 'uuid',
            loading: false,
            opts: [{
              id: 'test-id-value',
              name: 'test-name-value'
            }]
          })

          done()
        })
      })

      it('api is called with throw exception error', (done) => {
        const param = { name: 'id', type: 'uuid', loading: true }
        const errorMock = {
          response: {},
          stack: 'Error: throw exception error'
        }

        wrapper = factory()

        mockAxios.mockRejectedValue(errorMock)
        wrapper.setData({
          apiName: 'testApiNameCase1'
        })
        wrapper.vm.listUuidOpts(param)

        setTimeout(() => {
          expect(mockAxios).toHaveBeenCalledTimes(1)
          expect(mockAxios).toHaveBeenCalledWith({
            url: '/',
            method: 'GET',
            data: new URLSearchParams(),
            params: {
              command: 'testApiNameCase1',
              listall: true,
              response: 'json'
            }
          })
          expect(param).toEqual({
            name: 'id',
            type: 'uuid',
            loading: false,
            opts: []
          })

          done()
        })
      })
    })
  })
})
