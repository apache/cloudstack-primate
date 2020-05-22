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
import { pollJobPlugin, notifierPlugin } from '@/utils/plugins'

jest.mock('axios', () => mockAxios)
localVue.use(pollJobPlugin)
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
  createAccount: {
    params: {},
    response: []
  },
  addAccountToProject: {
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
    account: 'account-en',
    domainids: 'domainids-en',
    keypair: 'keypair-en'
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
    account: 'account-de',
    domainids: 'domainids-de',
    keypair: 'keypair-de'
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
      createAccount: {
        params: {},
        response: []
      },
      addAccountToProject: {
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
const spyConsole = {
  log: null,
  warn: null
}
const i18n = mockI18n.mock('en', messages)
const mocks = {
  $notifyError: jest.fn((error) => {
    return error
  }),
  $notification: {
    info: jest.fn((option) => {
      return {
        message: option.message,
        description: 'test-description',
        duration: 0
      }
    })
  }
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
  if (!router) {
    router = createRouter()
  }

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
    if (spyConsole.log) {
      spyConsole.log.mockClear()
      spyConsole.log.mockRestore()
    }
    if (spyConsole.warn) {
      spyConsole.warn.mockClear()
      spyConsole.warn.mockRestore()
    }
  })

  describe('Navigation Guard', () => {
    /**
     * @name: testNavigationGuardCase1
     * @description: check beforeRouteUpdate() is called
     * @condition: testRouter1
     * @expected:
     *  - currentPath = `/test-router-1`
     *  - next() is called
     */
    it('testNavigationGuardCase1', () => {
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

    /**
     * @name: testNavigationGuardCase2
     * @description: check beforeRouteLeave() is called
     * @condition: testRouter1
     * @expected:
     *  - currentPath = `/test-router-1`
     *  - next() is called
     */
    it('testNavigationGuardCase2', () => {
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
      /**
       * @name: testWatchersRouteCase1
       * @description: if $router doesn't change then wrapper data not change
       * @condition: null
       * @expected: wrapper data doesn't change and still init value
       */
      it('testWatchersRouteCase1', () => {
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

      /**
       * @name: testWatchersRouteCase2
       * @description: if $router is change then wrapper data is change
       * @condition: testRouter2
       * @expected: wrapper data is change with new value
       */
      it('testWatchersRouteCase2', () => {
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
      /**
       * @name: testWatchersI18nCase1
       * @description: The language doesn't change when locales don't change
       * @condition: null
       * @expected:
       *  - The language doesn't change
       *  - fetchData() not called
       */
      it('testWatchersI18nCase1', () => {
        wrapper = factory()

        const spy = jest.spyOn(wrapper.vm, 'fetchData')

        wrapper.vm.$nextTick(() => {
          expect(wrapper.vm.$t('label.name')).toEqual('test-name-en')
          expect(spy).not.toBeCalled()
        })
      })

      /**
       * @name: testWatchersI18nCase2
       * @description: The language is change when locales change
       * @condition: i18n.locale = 'de'
       * @expected:
       *  - The language is change by new locale
       *  - fetchData() is called
       */
      it('testWatchersI18nCase2', async () => {
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
    /**
     * @name: testComputedSelectedRowKeysCase1
     * @description: hasSelected = true when the selectedRowKeys doesn't empty
     * @condition: selectedRowKeys.length > 0
     * @expected: hasSelected = true
     */
    it('testComputedSelectedRowKeysCase1', () => {
      wrapper = factory({}, { selectedRowKeys: ['test-select-id'] })

      wrapper.vm.$nextTick(() => {
        expect(wrapper.vm.hasSelected).toBeTruthy()
      })
    })

    /**
     * @name: testComputedSelectedRowKeysCase2
     * @description: hasSelected = false when the selectedRowKeys is empty
     * @condition: selectedRowKeys.length === 0
     * @expected: hasSelected = false
     */
    it('testComputedSelectedRowKeysCase2', () => {
      wrapper = factory({}, { selectedRowKeys: [] })

      wrapper.vm.$nextTick(() => {
        expect(wrapper.vm.hasSelected).toBeFalsy()
      })
    })
  })

  describe('Methods', () => {
    describe('fetchData()', () => {
      /**
       * @name: testMethodFetchDataCase1
       * @description: fetchData() is called and routeName = $route.name
       * @condition: testRouter1
       * @expected: routeName = 'testRouter1'
       */
      it('testMethodFetchDataCase1', () => {
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

      /**
       * @name: testMethodFetchDataCase2
       * @description: fetchData() is called and routeName = $route.parent.name
       * @condition: router path = `/test-router-3`
       * @expected: routeName = 'home'
       */
      it('testMethodFetchDataCase2', () => {
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

      /**
       * @name: testMethodFetchDataCase3
       * @description: fetchData () is called and resource, dataView is set to new value
       * @condition: testRouter4, params: { id: 'test-id' }
       * @expected:
       *  - resource = {}
       *  - dataView = true
       */
      it('testMethodFetchDataCase3', () => {
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

      /**
       * @name: testMethodFetchDataCase4
       * @description: fetchData () is called and columnKeys, actions is set to new value
       * @condition:
       *  - router name: testRouter5
       *  - route.meta.permission = 'testApiNameCase1'
       *  - route.meta.actions.length > 0
       *  - route.meta.columns.length > 0
       * @expected:
       *  - columnKeys.length > 0
       *  - actions.length > 0
       */
      it('testMethodFetchDataCase4', () => {
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

      /**
       * @name: testMethodFetchDataCase5
       * @description: fetchData () is called and columnKeys assign by store apis
       * @condition:
       *  - router name: testRouter6
       *  - route.meta.permission = 'testApiNameCase4'
       *  - store.apis.testApiNameCase4.response.length > 0
       * @expected:
       *  - columnKeys.length = store.apis.testApiNameCase4.response.length
       */
      it('testMethodFetchDataCase5', () => {
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

      /**
       * @name: testMethodFetchDataCase6
       * @description: fetchData () is called and columns assign by new value
       * @condition:
       *  - router name: testRouter7
       *  - route.meta.permission = 'testApiNameCase1'
       *  - object exists in route.meta.columns
       * @expected:
       *  - columns.length = 1
       *  - columns.length[0].title = 'name-en'
       *  - columns.length[0].dataIndex = 'name'
       *  - columns.length[0].scopedSlots = { customRender: 'name' }
       */
      it('testMethodFetchDataCase6', () => {
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

      /**
       * @name: testMethodFetchDataCase7
       * @description: fetchData () is called and api is called
       * @condition:
       *  - router name: testRouter8
       *  - router query: { key: 'test-value' }
       *  - route.meta.permission = 'testApiNameCase2'
       * @expected:
       *  - api is called
       *  - api called with params has assign by route query key and value
       */
      it('testMethodFetchDataCase7', (done) => {
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

      /**
       * @name: testMethodFetchDataCase8
       * @description: fetchData () is called and api is called
       * @condition:
       *  - router name: testRouter9
       *  - route.meta.params = { key: 'test-value' }
       *  - route.meta.permission = testApiNameCase3
       * @expected:
       *  - api is called
       *  - api called with params has assign by route.params
       */
      it('testMethodFetchDataCase8', (done) => {
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

      /**
       * @name: testMethodFetchDataCase9
       * @description: fetchData () is called and check selectfilter by user role type
       * @condition:
       *  - router name: testRouter10
       *  - route.meta.permission = listTemplates
       *  - route.meta.filters = ['name', 'domainid']
       *  - user role type = Normal
       * @expected:
       *  - selectedFilter = self
       *  - filters = route.meta.filters
       */
      it('testMethodFetchDataCase9', () => {
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

      /**
       * @name: testMethodFetchDataCase10
       * @description: fetchData () is called and check selectfilter by user role type
       * @condition:
       *  - router name: testRouter11
       *  - route.meta.permission = listTemplates
       *  - route.meta.filters = ['name', 'domainid']
       *  - user role type = Admin
       * @expected:
       *  - selectedFilter = all
       *  - filters = ['all', 'name', 'domainid']
       */
      it('testMethodFetchDataCase10', () => {
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

      /**
       * @name: testMethodFetchDataCase11
       * @description: fetchData () is called and api is called
       * @condition:
       *  - router name: testRouter12
       *  - router path: /template
       *  - route.meta.permission = listTemplates
       * @expected:
       *  - api is called
       *  - api called with params has item templatefilter: 'self'
       */
      it('testMethodFetchDataCase11', (done) => {
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

      /**
       * @name: testMethodFetchDataCase12
       * @description: fetchData () is called and api is called
       * @condition:
       *  - router name: testRouter13
       *  - router path: /iso
       *  - route.meta.permission = listTemplates
       * @expected:
       *  - api is called
       *  - api called with params has item isofilter: 'self'
       */
      it('testMethodFetchDataCase12', (done) => {
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

      /**
       * @name: testMethodFetchDataCase13
       * @description: fetchData () is called and api is called
       * @condition:
       *  - router name: testRouter14
       *  - route.meta.permission = testApiNameCase2
       *  - searchQuery = 'test-query'
       * @expected:
       *  - api is called
       *  - api called with params has item keyword: 'test-query'
       */
      it('testMethodFetchDataCase13', (done) => {
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

      /**
       * @name: testMethodFetchDataCase14
       * @description: fetchData () is called and api is called
       * @condition:
       *  - router name: testRouter15
       *  - route.meta.permission = listRoles
       *  - searchQuery = 'test-query'
       * @expected:
       *  - api is called
       *  - api called with params has item name: 'test-query'
       */
      it('testMethodFetchDataCase14', (done) => {
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

      /**
       * @name: testMethodFetchDataCase15
       * @description: fetchData () is called and api is called
       * @condition:
       *  - router name: testRouter16
       *  - route.meta.permission = quotaEmailTemplateList
       *  - searchQuery = 'test-query'
       * @expected:
       *  - api is called
       *  - api called with params has item templatetype: 'test-query'
       */
      it('testMethodFetchDataCase15', (done) => {
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

      /**
       * @name: testMethodFetchDataCase16
       * @description: fetchData () is called and api is called
       * @condition:
       *  - router name: testRouter17
       *  - router params: { id: 'test-id' }
       *  - route.meta.permission = testApiNameCase1
       * @expected:
       *  - api is called
       *  - api called with params has item {id: 'test-id', name: 'test-id'}
       */
      it('testMethodFetchDataCase16', (done) => {
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

      /**
       * @name: testMethodFetchDataCase17
       * @description: fetchData () is called and api is called
       * @condition:
       *  - router name: testRouter18
       *  - router path: /ldapsetting/:id
       *  - router params: { id: 'test-id' }
       *  - route.meta.permission = testApiNameCase1
       * @expected:
       *  - api is called
       *  - api called with params has item {id: 'test-id', hostname: 'test-id'}
       */
      it('testMethodFetchDataCase17', (done) => {
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

      /**
       * @name: testMethodFetchDataCase18
       * @description: fetchData () is called and api is called
       * @condition:
       *  - router name: testRouter19
       *  - router path: /templates
       *  - route.meta.permission = listTemplates
       * @expected:
       *  - api is called
       *  - items.length > 0
       *  - resource = items[0]
       */
      it('testMethodFetchDataCase18', (done) => {
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

      /**
       * @name: testMethodFetchDataCase19
       * @description: fetchData () is called and api is called
       * @condition:
       *  - router name: testRouter20
       *  - route.meta.columns has object
       *  - route.meta.permission = testApiNameCase1
       * @expected:
       *  - api is called
       *  - items.length > 0
       *  - resource = items[0]
       */
      it('testMethodFetchDataCase19', (done) => {
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

      /**
       * @name: testMethodFetchDataCase20
       * @description: fetchData () is called and api is called
       * @condition:
       *  - router name: testRouter21
       *  - router path: /ssh
       *  - route.meta.permission = testApiNameCase1
       * @expected:
       *  - api is called
       *  - items.length > 0
       *  - resource = items[0]
       */
      it('testMethodFetchDataCase20', (done) => {
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

      /**
       * @name: testMethodFetchDataCase21
       * @description: fetchData () is called and api is called
       * @condition:
       *  - router name: testRouter22
       *  - router path: /ldapsetting
       *  - route.meta.permission = testApiNameCase1
       * @expected:
       *  - api is called
       *  - items.length > 0
       *  - resource = items[0]
       */
      it('testMethodFetchDataCase21', (done) => {
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

      /**
       * @name: testMethodFetchDataCase22
       * @description: fetchData () is called and api is called with throw error
       * @condition:
       *  - router name: testRouter22
       *  - route.meta.permission = testApiNameCase1
       *  - error.message = 'string'
       * @expected:
       *  - $notifyError is called with message
       */
      it('testMethodFetchDataCase22', (done) => {
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

      /**
       * @name: testMethodFetchDataCase23
       * @description: fetchData () is called and api is called with throw error
       * @condition:
       *  - router name: testRouter23
       *  - route.meta.permission = testApiNameCase1
       *  - error.message = 'string'
       *  - error.response.status = 401
       * @expected:
       *  - $notifyError is called with message
       *  - router.currentRoute.path = /exception/403
       */
      it('testMethodFetchDataCase23', (done) => {
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

      /**
       * @name: testMethodFetchDataCase24
       * @description: fetchData () is called and api is called with throw error
       * @condition:
       *  - router name: testRouter23
       *  - route.meta.permission = testApiNameCase1
       *  - error.message = 'string'
       *  - error.response.status = 430
       * @expected:
       *  - $notifyError is called with message
       *  - router.currentRoute.path = /exception/404
       */
      it('testMethodFetchDataCase24', (done) => {
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

      /**
       * @name: testMethodFetchDataCase25
       * @description: fetchData () is called and api is called with throw error
       * @condition:
       *  - router name: testRouter23
       *  - route.meta.permission = testApiNameCase1
       *  - error.message = 'string'
       *  - error.response.status = 530
       * @expected:
       *  - $notifyError is called with message
       *  - router.currentRoute.path = /exception/500
       */
      it('testMethodFetchDataCase25', (done) => {
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
      /**
       * @name: testMethodOnSearchCase1
       * @description: onSearch() is called and check fetchData() is call
       * @condition:
       *  - router name: testRouter24
       *  - route.meta.permission = testApiNameCase1
       *  - page: 2
       * @expected:
       *  - page = 1
       *  - searchQuery = ''
       *  - fetchData is called
       */
      it('testMethodOnSearchCase1', (done) => {
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

      /**
       * @name: testMethodOnSearchCase2
       * @description: onSearch() is called and check fetchData() is call
       * @condition:
       *  - router name: testRouter25
       *  - route.meta.permission = testApiNameCase1
       *  - page: 2
       * @expected:
       *  - page = 1
       *  - searchQuery = test-query-value
       *  - fetchData is called
       */
      it('testMethodOnSearchCase2', (done) => {
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
      /**
       * @name: testMethodCloseActionCase1
       * @description: closeAction() is called and check data after call
       * @condition:
       *  - currentAction.loading = true
       *  - showAction = true
       * @expected:
       *  - currentAction = {}
       *  - showAction = false
       */
      it('testMethodCloseActionCase1', () => {
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
      /**
       * @name: testMethodExecActionCase1
       * @description: execAction() is called and check new route name
       * @condition:
       *  - router name: testRouter26
       *  - actionData[0].name = 'test-add-action'
       *  - showAction = true
       * @expected:
       *  - actionData = []
       *  - showAction = false
       *  - router.currentRoute.name = testRouter26
       */
      it('testMethodExecActionCase1', () => {
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

      /**
       * @name: testMethodExecActionCase1
       * @description: execAction() is called and check currentAction params
       * @condition:
       *  - actions.api: testApiNameCase5
       *  - `arg` not in action
       * @expected:
       *  - currentAction.params.length > 0
       *  - currentAction.paramFields = []
       *  - showAction: true
       */
      it('testMethodExecActionCase1', () => {
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

      /**
       * @name: testMethodExecActionCase2
       * @description: execAction() is called and check currentAction params
       * @condition:
       *  - actions.api: testApiNameCase5
       *  - `arg` exists in action
       * @expected:
       *  - currentAction.params.length > 0
       *  - currentAction.paramFields.length > 0
       *  - showAction: true
       */
      it('testMethodExecActionCase2', () => {
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

      /**
       * @name: testMethodExecActionCase3
       * @description: execAction() is called and check currentAction params
       * @condition:
       *  - actions.api: testApiNameCase5
       *  - `arg` is function and exists in action
       * @expected:
       *  - currentAction.params.length > 0
       *  - currentAction.paramFields.length > 0
       *  - showAction: true
       */
      it('testMethodExecActionCase3', () => {
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

      /**
       * @name: testMethodExecActionCase4
       * @description: execAction() is called and check listUuidOpts() is called
       * @condition:
       *  - action.api: testApiNameCase5
       *  - action.args has tags
       *  - params in store.apis.testApiNameCase6 has list type
       * @expected:
       *  - listUuidOpts() is called
       */
      it('testMethodExecActionCase4', () => {
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

      /**
       * @name: testMethodExecActionCase5
       * @description: execAction() is called and check fillEditFormFieldValues() is called
       * @condition:
       *  - actions.api:testApiNameCase6
       *  - action.dataView = true
       *  - action.icon = edit
       * @expected:
       *  - fillEditFormFieldValues() is called
       */
      it('testMethodExecActionCase5', () => {
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
      /**
       * @name: testMethodListUuidOptsCase1
       * @description: listUuidOpts() is called and check api not called
       * @condition:
       *  - currentAction.mapping.id = ''
       *  - params = { name: 'id', type: 'uuid' }
       * @expected:
       *  - api not called
       */
      it('testMethodListUuidOptsCase1', (done) => {
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

      /**
       * @name: testMethodListUuidOptsCase2
       * @description: listUuidOpts() is called and check api not called
       * @condition:
       *  - currentAction.mapping = {}
       *  - params = { name: 'test-name', type: 'uuid' }
       * @expected:
       *  - api not called
       */
      it('testMethodListUuidOptsCase2', (done) => {
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

      /**
       * @name: testMethodListUuidOptsCase3
       * @description: listUuidOpts() is called and check api is called
       * @condition:
       *  - currentAction.mapping.template.api = testApiNameCase1
       *  - param = { name: 'template', type: 'uuid' }
       * @expected:
       *  - api is called
       */
      it('testMethodListUuidOptsCase3', (done) => {
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

      /**
       * @name: testMethodListUuidOptsCase4
       * @description: listUuidOpts() is called and check api is called
       * @condition:
       *  - apiName = testApiNameCase1
       *  - param = { name: 'id', type: 'uuid' }
       * @expected:
       *  - api is called
       */
      it('testMethodListUuidOptsCase4', (done) => {
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

      /**
       * @name: testMethodListUuidOptsCase5
       * @description: listUuidOpts() is called and check api is called
       * @condition:
       *  - store.getters.apis = testApiNameCase1
       *  - param = { name: 'testapiname', type: 'uuid' }
       * @expected:
       *  - api is called with command `listTestApiNames`
       */
      it('testMethodListUuidOptsCase5', (done) => {
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

      /**
       * @name: testMethodListUuidOptsCase6
       * @description: listUuidOpts() is called and check api is called
       * @condition:
       *  - currentAction.mapping.template.api = 'testApiNameCase1'
       *  - param = { name: 'template', type: 'uuid' }
       * @expected:
       *  - api is called
       *  - api is called with params has item {name: 'test-name-value'}
       */
      it('testMethodListUuidOptsCase6', (done) => {
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

      /**
       * @name: testMethodListUuidOptsCase7
       * @description: listUuidOpts() is called and check api is called
       * @condition:
       *  - apiName: 'listTemplates'
       *  - param = { name: 'id', type: 'uuid' }
       * @expected:
       *  - api is called
       *  - api is called with params has item {templatefilter: 'executable'}
       */
      it('testMethodListUuidOptsCase7', (done) => {
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

      /**
       * @name: testMethodListUuidOptsCase8
       * @description: listUuidOpts() is called and check api is called
       * @condition:
       *  - apiName: 'listIsos'
       *  - param = { name: 'id', type: 'uuid' }
       * @expected:
       *  - api is called
       *  - api is called with params has item {isofilter: 'executable'}
       *  - param = { name: 'id', type: 'uuid', loading: false, opts.length > 0 }
       */
      it('testMethodListUuidOptsCase8', (done) => {
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

      /**
       * @name: testMethodListUuidOptsCase9
       * @description: listUuidOpts() is called and check api is called
       * @condition:
       *  - apiName: 'listHosts'
       *  - param = { name: 'id', type: 'uuid' }
       * @expected:
       *  - api is called with command = listHosts
       *  - param = { name: 'id', type: 'uuid', loading: false, opts.length > 0 }
       */
      it('testMethodListUuidOptsCase9', (done) => {
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

      /**
       * @name: testMethodListUuidOptsCase10
       * @description: listUuidOpts() is called and check api is called
       * @condition:
       *  - apiName: 'testApiNameCase1'
       *  - param = { name: 'id', type: 'uuid', loading: true }
       * @expected:
       *  - api is called with throw error
       *  - param = { name: 'id', type: 'uuid', loading: false, opts: [] }
       */
      it('testMethodListUuidOptsCase10', (done) => {
        const param = { name: 'id', type: 'uuid', loading: true }
        const errorMock = {
          response: {},
          stack: 'Error: throw exception error'
        }

        wrapper = factory()

        spyConsole.log = jest.spyOn(console, 'log').mockImplementation(() => {})
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

    describe('pollActionCompletion()', () => {
      /**
       * @name: testMethodPollActionCompletionCase1
       * @description: pollActionCompletion() is called with no notification
       * @condition:
       *  - jobId = 'test-job-id'
       *  - $pollJob response with jobstatus: 1 and jobresult.name = 'test-name-value'
       * @expected:
       *  - api is called with params has item { jobId }
       *  - fetchData() is called
       *  - $notification.info not called
       */
      it('testMethodPollActionCompletionCase1', async (done) => {
        const mockData = {
          queryasyncjobresultresponse: {
            jobstatus: 1,
            jobresult: {
              name: 'test-name-value'
            }
          }
        }

        wrapper = factory()

        const jobId = 'test-job-id'
        const action = {}
        const spy = jest.spyOn(wrapper.vm, 'fetchData')

        mockAxios.mockResolvedValue(mockData)
        await wrapper.vm.$nextTick()
        await wrapper.vm.pollActionCompletion(jobId, action)

        setTimeout(() => {
          expect(spy).toHaveBeenCalled()
          expect(mocks.$notification.info).not.toHaveBeenCalled()
          expect(mockAxios).toHaveBeenCalledTimes(1)
          expect(mockAxios).toHaveBeenCalledWith({
            url: '/',
            method: 'GET',
            data: new URLSearchParams(),
            params: {
              command: 'queryAsyncJobResult',
              jobId: jobId,
              response: 'json'
            }
          })

          done()
        })
      })

      /**
       * @name: testMethodPollActionCompletionCase2
       * @description: pollActionCompletion() is called with notification
       * @condition:
       *  - jobId = 'test-job-id'
       *  - $pollJob response with jobstatus: 1 and jobresult.name = 'test-name-value'
       * @expected:
       *  - api is called with params has item { jobId }
       *  - $notification.info is called
       *  - fetchData() is called
       */
      it('testMethodPollActionCompletionCase2', async (done) => {
        const mockData = {
          queryasyncjobresultresponse: {
            jobstatus: 1,
            jobresult: {
              name: 'test-name-value'
            }
          }
        }

        wrapper = factory()

        const jobId = 'test-job-id'
        const action = {
          label: 'label.name',
          response: (jobResult) => {
            return jobResult.name
          }
        }
        const spy = jest.spyOn(wrapper.vm, 'fetchData')

        mockAxios.mockResolvedValue(mockData)
        await wrapper.vm.$nextTick()
        await wrapper.vm.pollActionCompletion(jobId, action)

        setTimeout(() => {
          expect(spy).toHaveBeenCalled()
          expect(mocks.$notification.info).toHaveBeenCalledTimes(1)
          expect(mocks.$notification.info).toHaveLastReturnedWith({
            message: 'test-name-en',
            description: 'test-description',
            duration: 0
          })
          expect(mockAxios).toHaveBeenCalledTimes(1)
          expect(mockAxios).toHaveBeenCalledWith({
            url: '/',
            method: 'GET',
            data: new URLSearchParams(),
            params: {
              command: 'queryAsyncJobResult',
              jobId: jobId,
              response: 'json'
            }
          })

          done()
        })
      })

      /**
       * @name: testMethodPollActionCompletionCase3
       * @description: pollActionCompletion() is called with notification
       * @condition:
       *  - jobId = 'test-job-id'
       *  - $pollJob response with jobstatus: 2 and jobresult.errortext = 'test-error-message'
       * @expected:
       *  - api is called with params has item { jobId }
       *  - fetchData() is called
       */
      it('testMethodPollActionCompletionCase3', async (done) => {
        const mockData = {
          queryasyncjobresultresponse: {
            jobstatus: 2,
            jobresult: {
              errortext: 'test-error-message'
            }
          }
        }

        wrapper = factory()

        const jobId = 'test-job-id'
        const action = {
          label: 'label.name',
          response: (jobResult) => {
            return jobResult.name
          }
        }
        const spy = jest.spyOn(wrapper.vm, 'fetchData')

        mockAxios.mockResolvedValue(mockData)
        await wrapper.vm.$nextTick()
        await wrapper.vm.pollActionCompletion(jobId, action)

        setTimeout(() => {
          expect(spy).toHaveBeenCalled()
          expect(mockAxios).toHaveBeenCalledTimes(1)
          expect(mockAxios).toHaveBeenCalledWith({
            url: '/',
            method: 'GET',
            data: new URLSearchParams(),
            params: {
              command: 'queryAsyncJobResult',
              jobId: jobId,
              response: 'json'
            }
          })

          done()
        })
      })
    })

    describe('fillEditFormFieldValues()', () => {
      /**
       * @name: testMethodFillEditFormFieldValuesCase1
       * @description: check form getFieldDecorator() is called
       * @condition: currentAction.paramFields has field type = uuid
       * @expected: getFieldDecorator() is called with mapping data value
       */
      it('testMethodFillEditFromFiledValuesCase1', async (done) => {
        wrapper = factory({}, {
          currentAction: {
            paramFields: [
              { name: 'id', type: 'uuid' }
            ],
            mapping: {
              column1: () => { return 'test-column' }
            }
          },
          resource: {
            name: 'test-name-value'
          }
        })

        const spy = jest.spyOn(wrapper.vm.form, 'getFieldDecorator')
        await wrapper.vm.$nextTick()
        await wrapper.vm.fillEditFormFieldValues()

        setTimeout(() => {
          expect(spy).toHaveBeenCalled()
          expect(spy).toBeCalledWith('id', {
            initialValue: 'test-name-value'
          })

          done()
        })
      })

      /**
       * @name: testMethodFillEditFromFiledValuesCase2
       * @description: check form getFieldDecorator() is called
       * @condition: currentAction.paramFields has field type = list
       * @expected: getFieldDecorator() is called with mapping data value
       */
      it('testMethodFillEditFromFiledValuesCase2', async (done) => {
        wrapper = factory({}, {
          currentAction: {
            paramFields: [
              { name: 'domainids', type: 'list' }
            ],
            mapping: {
              column1: () => { return 'test-column' }
            }
          },
          resource: {
            domainname: ['test-domain-value-1', 'test-domain-value-2']
          }
        })

        const spy = jest.spyOn(wrapper.vm.form, 'getFieldDecorator')

        await wrapper.vm.$nextTick()
        await
          wrapper.vm.fillEditFormFieldValues()
        setTimeout(() => {
          expect(spy).toHaveBeenCalled()
          expect(spy).toBeCalledWith('domainids', {
            initialValue: ['test-domain-value-1', 'test-domain-value-2']
          })

          done()
        })
      })

      /**
       * @name: testMethodFillEditFromFiledValuesCase3
       * @description: check form getFieldDecorator() is called
       * @condition: currentAction.paramFields has field name = account
       * @expected: getFieldDecorator() is called with mapping data value
       */
      it('testMethodFillEditFromFiledValuesCase3', async (done) => {
        wrapper = factory({}, {
          currentAction: {
            paramFields: [
              { name: 'account', type: 'string' }
            ],
            mapping: {
              column1: () => { return 'test-column' }
            }
          },
          resource: {
            account: 'test-account-value'
          }
        })

        const spy = jest.spyOn(wrapper.vm.form, 'getFieldDecorator')
        await wrapper.vm.$nextTick()
        await wrapper.vm.fillEditFormFieldValues()

        setTimeout(() => {
          expect(spy).toHaveBeenCalled()
          expect(spy).toBeCalledWith('account', {
            initialValue: 'test-account-value'
          })

          done()
        })
      })

      /**
       * @name: testMethodFillEditFromFiledValuesCase4
       * @description: check form getFieldDecorator() is called
       * @condition: currentAction.paramFields has field name in currentAction.mapping
       * @expected: getFieldDecorator() is called with mapping data value
       */
      it('testMethodFillEditFromFiledValuesCase4', async (done) => {
        wrapper = factory({}, {
          currentAction: {
            paramFields: [
              { name: 'column1', type: 'string' }
            ],
            mapping: {
              column1: () => { return 'test-column' }
            }
          },
          resource: {
            column1: 'test-column-value'
          }
        })

        const spy = jest.spyOn(wrapper.vm.form, 'getFieldDecorator')
        await wrapper.vm.$nextTick()
        await wrapper.vm.fillEditFormFieldValues()

        setTimeout(() => {
          expect(spy).toHaveBeenCalled()
          expect(spy).toBeCalledWith('column1', {
            initialValue: 'test-column-value'
          })

          done()
        })
      })

      /**
       * @name: testMethodFillEditFromFiledValuesCase5
       * @description: check form getFieldDecorator() is called
       * @condition: currentAction.paramFields has field not pass condition (field.type in [uuid, list] || field.name = account && field.name in currentAction.mapping)
       * @expected: getFieldDecorator() is called with mapping data value
       */
      it('testMethodFillEditFromFiledValuesCase5', async (done) => {
        wrapper = factory({}, {
          currentAction: {
            paramFields: [
              { name: 'column1', type: 'string' }
            ]
          },
          resource: {
            column1: 'test-column-value'
          }
        })

        const spy = jest.spyOn(wrapper.vm.form, 'getFieldDecorator')
        await wrapper.vm.$nextTick()
        await wrapper.vm.fillEditFormFieldValues()

        setTimeout(() => {
          expect(spy).toHaveBeenCalled()
          expect(spy).toBeCalledWith('column1', {
            initialValue: 'test-column-value'
          })

          done()
        })
      })

      /**
       * @name: testMethodFillEditFromFiledValuesCase6
       * @description: check form getFieldDecorator() not called
       * @condition: currentAction.paramFields has field not in resource
       * @expected: getFieldDecorator() not called
       */
      it('testMethodFillEditFromFiledValuesCase6', async (done) => {
        wrapper = factory({}, {
          currentAction: {
            paramFields: [
              { name: 'column1', type: 'string' }
            ]
          },
          resource: {}
        })

        const spy = jest.spyOn(wrapper.vm.form, 'getFieldDecorator')

        await wrapper.vm.$nextTick()
        await wrapper.vm.fillEditFormFieldValues()

        setTimeout(() => {
          expect(spy).not.toHaveBeenCalled()

          done()
        })
      })

      /**
       * @name: testMethodFillEditFromFiledValuesCase7
       * @description: check form getFieldDecorator() not called
       * @condition: resource field value equal null
       * @expected: getFieldDecorator() not called
       */
      it('testMethodFillEditFromFiledValuesCase7', (done) => {
        wrapper = factory({}, {
          currentAction: {
            paramFields: [
              { name: 'column1', type: 'string' }
            ]
          },
          resource: {
            column1: null
          }
        })

        const spy = jest.spyOn(wrapper.vm.form, 'getFieldDecorator')

        wrapper.vm.$nextTick(() => {
          wrapper.vm.fillEditFormFieldValues()

          expect(spy).not.toHaveBeenCalled()

          done()
        })
      })
    })

    describe('changeFilter()', () => {
      /**
       * @name: testMethodChangeFilterCase1
       * @description: changeFilter() is called
       * @condition: filter = 'test'
       * @expected:
       *  before:
       *    1. selectedFilter = ''
       *    2. fetchData: not called
       *  after:
       *    1. selectedFilter = 'test'
       *    2. fetchData: is called
       */
      it('testMethodChangeFilterCase1', () => {
        wrapper = factory({}, {
          selectedFilter: ''
        })

        const spy = jest.spyOn(wrapper.vm, 'fetchData')

        wrapper.vm.$nextTick(() => {
          expect(wrapper.vm.selectedFilter).toEqual('')
          expect(spy).not.toHaveBeenCalled()

          wrapper.vm.changeFilter('test')

          expect(wrapper.vm.selectedFilter).toEqual('test')
          expect(spy).toHaveBeenCalled()
        })
      })
    })

    describe('changePage()', () => {
      /**
       * @name: testMethodChangePageCase1
       * @description: changePage() is called
       * @condition: page = 2, pageSize = 20
       * @expected:
       *  before:
       *    1. page = 1
       *    2. pageSize: 10
       *    3. fetchData: not called
       *  after:
       *    1. page = 2
       *    2. pageSize: 20
       *    3. fetchData: is called
       */
      it('testMethodChangePageCase1', () => {
        wrapper = factory({}, {
          page: 1,
          pageSize: 10
        })

        const spy = jest.spyOn(wrapper.vm, 'fetchData')

        wrapper.vm.$nextTick(() => {
          expect(wrapper.vm.page).toEqual(1)
          expect(wrapper.vm.pageSize).toEqual(10)
          expect(spy).not.toBeCalled()

          wrapper.vm.changePage(2, 20)

          expect(wrapper.vm.page).toEqual(2)
          expect(wrapper.vm.pageSize).toEqual(20)
          expect(spy).toBeCalled()
        })
      })
    })

    describe('changePageSize()', () => {
      /**
       * @name: testMethodChangePageSizeCase1
       * @description: changePageSize() is called
       * @condition: page = 2, pageSize = 20
       * @expected:
       *  before:
       *    1. page = 1
       *    2. pageSize: 10
       *    3. fetchData: not called
       *  after:
       *    1. page = 2
       *    2. pageSize: 20
       *    3. fetchData: is called
       */
      it('testMethodChangePageSizeCase1', () => {
        wrapper = factory({}, {
          page: 1,
          pageSize: 10
        })

        const spy = jest.spyOn(wrapper.vm, 'fetchData')

        wrapper.vm.$nextTick(() => {
          expect(wrapper.vm.page).toEqual(1)
          expect(wrapper.vm.pageSize).toEqual(10)
          expect(spy).not.toBeCalled()

          wrapper.vm.changePageSize(2, 20)

          expect(wrapper.vm.page).toEqual(2)
          expect(wrapper.vm.pageSize).toEqual(20)
          expect(spy).toBeCalled()
        })
      })
    })

    describe('start()', () => {
      /**
       * @name: testMethodStartCase1
       * @description: start() is called
       * @condition: page = 2, pageSize = 20
       * @expected:
       *  before:
       *    1. loading = true
       *    2. fetchData is called
       *    3. selectedRowKeys = ['test-selected']
       *  after:
       *    1. loading = false
       *    2. selectedRowKeys = []
       */
      it('testMethodStartCase1', (done) => {
        jest.useFakeTimers()

        wrapper = factory({}, {
          loading: false,
          selectedRowKeys: ['test-selected']
        })

        const spy = jest.spyOn(wrapper.vm, 'fetchData')

        wrapper.vm.$nextTick(() => {
          wrapper.vm.start()

          expect(wrapper.vm.loading).toBeTruthy()
          expect(wrapper.vm.selectedRowKeys).toEqual(['test-selected'])
          expect(spy).toBeCalled()

          setTimeout(() => {
            expect(wrapper.vm.loading).toBeFalsy()
            expect(wrapper.vm.selectedRowKeys).toEqual([])

            done()
          }, 1000)

          jest.runAllTimers()
        })
      })
    })

    describe('toggleLoading()', () => {
      /**
       * @name: testMethodToggleLoadingCase1
       * @description: toggleLoading() is called
       * @condition: null
       * @expected:
       *  before: loading = false
       *  after: loading = true
       */
      it('testMethodToggleLoadingCase1', () => {
        wrapper = factory({}, {
          loading: false
        })

        wrapper.vm.$nextTick(() => {
          expect(wrapper.vm.loading).toBeFalsy()

          wrapper.vm.toggleLoading()

          expect(wrapper.vm.loading).toBeTruthy()
        })
      })
    })

    describe('startLoading()', () => {
      /**
       * @name: testMethodStartLoadingCase1
       * @description: startLoading() is called
       * @condition: null
       * @expected:
       *  before: loading = false
       *  after: loading = true
       */
      it('testMethodStartLoadingCase1', () => {
        wrapper = factory({}, {
          loading: false
        })

        wrapper.vm.$nextTick(() => {
          expect(wrapper.vm.loading).toBeFalsy()

          wrapper.vm.startLoading()

          expect(wrapper.vm.loading).toBeTruthy()
        })
      })
    })

    describe('finishLoading()', () => {
      /**
       * @name: testMethodFinishLoadingCase1
       * @description: finishLoading() is called
       * @condition: null
       * @expected:
       *  before: loading = true
       *  after: loading = false
       */
      it('testMethodFinishLoadingCase1', () => {
        wrapper = factory({}, {
          loading: true
        })

        wrapper.vm.$nextTick(() => {
          expect(wrapper.vm.loading).toBeTruthy()

          wrapper.vm.finishLoading()

          expect(wrapper.vm.loading).toBeFalsy()
        })
      })
    })

    describe('handleSubmit()', () => {
      /**
       * @name: testMethodHandleSubmitCase1
       * @description: check error from validateFields when handleSubmit() is called
       * @condition: paramFields has field is required
       * @expected: api not called
       */
      it('testMethodHandleSubmitCase1', (done) => {
        wrapper = factory({}, {
          showAction: true,
          currentAction: {
            loading: false,
            label: 'label.name',
            params: [
              { name: 'id', type: 'uuid' }
            ],
            paramFields: [
              { name: 'id', type: 'uuid', description: '', required: true }
            ],
            mapping: {}
          },
          resource: {
            id: 'test-id-value'
          }
        })

        spyConsole.warn = jest.spyOn(console, 'warn').mockImplementation(() => {})
        spyConsole.log = jest.spyOn(console, 'log').mockImplementation(() => {})

        wrapper.vm.$nextTick(() => {
          const event = document.createEvent('Event')
          wrapper.vm.handleSubmit(event)

          expect(mockAxios).not.toBeCalled()

          done()
        })
      })

      /**
       * @name: testMethodHandleSubmitCase2
       * @description: check api is called and params when handleSubmit() is called
       * @condition: `id` in resource && currentAction.params has name = `id`
       * @expected:
       *  1. api is called
       *  2. api called with params has id = 'test-id-value'
       */
      it('testMethodHandleSubmitCase2', (done) => {
        wrapper = factory({}, {
          showAction: true,
          currentAction: {
            api: 'testApiNameCase1',
            loading: false,
            label: 'label.name',
            params: [
              { name: 'id', type: 'uuid' }
            ],
            paramFields: [
              { name: 'id', type: 'uuid', description: '', required: false }
            ],
            mapping: {}
          },
          resource: {
            id: 'test-id-value'
          }
        })

        const mockData = {
          testapinamecase1response: {
            testapinamecase1: {}
          }
        }
        mockAxios.mockResolvedValue(mockData)
        spyConsole.log = jest.spyOn(console, 'log').mockImplementation(() => {})

        wrapper.vm.$nextTick(() => {
          const event = document.createEvent('Event')
          wrapper.vm.handleSubmit(event)

          expect(mockAxios).toHaveBeenCalledTimes(1)
          expect(mockAxios).toHaveBeenCalledWith({
            url: '/',
            method: 'GET',
            data: new URLSearchParams(),
            params: {
              command: 'testApiNameCase1',
              id: 'test-id-value',
              response: 'json'
            }
          })

          done()
        })
      })

      /**
       * @name: testMethodHandleSubmitCase3
       * @description: check api is called and params when handleSubmit() is called
       * @condition: form has input key:
       *  - value is undefined
       *  - exist in currentAction.params and type is boolean
       * @expected:
       *  1. api is called
       *  2. api called with params has key = false
       */
      it('testMethodHandleSubmitCase3', (done) => {
        wrapper = factory({}, {
          showAction: true,
          currentAction: {
            api: 'testApiNameCase1',
            loading: false,
            label: 'label.name',
            params: [
              { name: 'column1', type: 'boolean' }
            ],
            paramFields: [
              { name: 'column1', type: 'boolean', description: '', required: false }
            ],
            mapping: {}
          },
          resource: {}
        })

        const mockData = {
          testapinamecase1response: {
            testapinamecase1: {}
          }
        }
        mockAxios.mockResolvedValue(mockData)
        spyConsole.log = jest.spyOn(console, 'log').mockImplementation(() => {})

        wrapper.vm.$nextTick(() => {
          const event = document.createEvent('Event')
          wrapper.vm.handleSubmit(event)

          expect(mockAxios).toHaveBeenCalledTimes(1)
          expect(mockAxios).toHaveBeenCalledWith({
            url: '/',
            method: 'GET',
            data: new URLSearchParams(),
            params: {
              command: 'testApiNameCase1',
              column1: false,
              response: 'json'
            }
          })

          done()
        })
      })

      /**
       * @name: testMethodHandleSubmitCase4
       * @description: check api is called and params when handleSubmit() is called
       * @condition: form has input key:
       *  - exists in currentAction.mapping
       * @expected:
       *  1. api is called
       *  2. api called with params has key is value set by currentAction.mapping[key].options
       */
      it('testMethodHandleSubmitCase4', (done) => {
        wrapper = factory({}, {
          showAction: true,
          currentAction: {
            api: 'testApiNameCase1',
            loading: false,
            label: 'label.name',
            params: [
              { name: 'column1', type: 'list' }
            ],
            paramFields: [
              { name: 'column1', type: 'list', description: '', required: false }
            ],
            mapping: {
              column1: {
                options: ['column-value1', 'column-value2']
              }
            }
          },
          resource: {}
        })

        const mockData = {
          testapinamecase1response: {
            testapinamecase1: {}
          }
        }
        mockAxios.mockResolvedValue(mockData)
        spyConsole.log = jest.spyOn(console, 'log').mockImplementation(() => {})

        wrapper.vm.$nextTick(() => {
          wrapper.vm.form.getFieldDecorator('column1', { initialValue: 1 })
          const event = document.createEvent('Event')
          wrapper.vm.handleSubmit(event)

          expect(mockAxios).toHaveBeenCalledTimes(1)
          expect(mockAxios).toHaveBeenCalledWith({
            url: '/',
            method: 'GET',
            data: new URLSearchParams(),
            params: {
              command: 'testApiNameCase1',
              column1: 'column-value2',
              response: 'json'
            }
          })

          done()
        })
      })

      /**
       * @name: testMethodHandleSubmitCase5
       * @description: check api is called and params when handleSubmit() is called
       * @condition: form has input key:
       *  - type uuid
       *  - not exists in currentAction.mapping
       *  - exists in currentAction.params
       *  - currentAction.params[input] has id
       * @expected:
       *  1. api is called
       *  2. api called with params has key is value set by currentAction.params.opts[key].id
       */
      it('testMethodHandleSubmitCase5', (done) => {
        wrapper = factory({}, {
          showAction: true,
          currentAction: {
            api: 'testApiNameCase1',
            loading: false,
            label: 'label.name',
            params: [
              {
                name: 'column1',
                type: 'uuid',
                opts: [
                  { id: 'test-id-1', value: 'test-value-1' },
                  { id: 'test-id-2', value: 'test-value-2' }
                ]
              }
            ],
            paramFields: [
              { name: 'column1', type: 'uuid', description: '', required: false }
            ],
            mapping: {
            }
          },
          resource: {}
        })

        const mockData = {
          testapinamecase1response: {
            testapinamecase1: {}
          }
        }
        mockAxios.mockResolvedValue(mockData)
        spyConsole.log = jest.spyOn(console, 'log').mockImplementation(() => {})

        wrapper.vm.$nextTick(() => {
          wrapper.vm.form.getFieldDecorator('column1', { initialValue: 1 })
          const event = document.createEvent('Event')
          wrapper.vm.handleSubmit(event)

          expect(mockAxios).toHaveBeenCalledTimes(1)
          expect(mockAxios).toHaveBeenCalledWith({
            url: '/',
            method: 'GET',
            data: new URLSearchParams(),
            params: {
              command: 'testApiNameCase1',
              column1: 'test-id-2',
              response: 'json'
            }
          })

          done()
        })
      })

      /**
       * @name: testMethodHandleSubmitCase6
       * @description: check api is called and params when handleSubmit() is called
       * @condition: form has input key:
       *  - type list
       *  - not exists in currentAction.mapping
       *  - currentAction.params[input] has id
       * @expected:
       *  1. api is called
       *  2. api called with params has key is value set by currentAction.params[key].id
       */
      it('testMethodHandleSubmitCase6', (done) => {
        wrapper = factory({}, {
          showAction: true,
          currentAction: {
            api: 'testApiNameCase1',
            loading: false,
            label: 'label.name',
            params: [
              {
                name: 'column1',
                type: 'list',
                opts: [
                  { id: 'test-id-1', value: 'test-value-1' },
                  { id: 'test-id-2', value: 'test-value-2' },
                  { id: 'test-id-3', value: 'test-value-3' }
                ]
              }
            ],
            paramFields: [
              { name: 'column1', type: 'list', description: '', required: false }
            ],
            mapping: {
            }
          },
          resource: {}
        })

        const mockData = {
          testapinamecase1response: {
            testapinamecase1: {}
          }
        }
        mockAxios.mockResolvedValue(mockData)
        spyConsole.log = jest.spyOn(console, 'log').mockImplementation(() => {})

        wrapper.vm.$nextTick(() => {
          wrapper.vm.form.getFieldDecorator('column1', { initialValue: [1, 2] })
          const event = document.createEvent('Event')
          wrapper.vm.handleSubmit(event)

          expect(mockAxios).toHaveBeenCalledTimes(1)
          expect(mockAxios).toHaveBeenCalledWith({
            url: '/',
            method: 'GET',
            data: new URLSearchParams(),
            params: {
              command: 'testApiNameCase1',
              column1: 'test-id-2,test-id-3',
              response: 'json'
            }
          })

          done()
        })
      })

      /**
       * @name: testMethodHandleSubmitCase7
       * @description: check api is called and params when handleSubmit() is called
       * @condition: form has input key:
       *  - name is `account`
       *  - currentAction.api is`createAccount`
       * @expected:
       *  1. api is called
       *  2. api called with params has key is value set by form key value
       */
      it('testMethodHandleSubmitCase7', (done) => {
        wrapper = factory({}, {
          showAction: true,
          currentAction: {
            api: 'createAccount',
            loading: false,
            label: 'label.name',
            params: [
              {
                name: 'account',
                type: 'string'
              }
            ],
            paramFields: [
              { name: 'account', type: 'string', description: '', required: false }
            ],
            mapping: {}
          },
          resource: {}
        })

        const mockData = {
          testapinamecase1response: {
            testapinamecase1: {}
          }
        }
        mockAxios.mockResolvedValue(mockData)
        spyConsole.log = jest.spyOn(console, 'log').mockImplementation(() => {})

        wrapper.vm.$nextTick(() => {
          wrapper.vm.form.getFieldDecorator('account', { initialValue: 'test-account-value' })
          const event = document.createEvent('Event')
          wrapper.vm.handleSubmit(event)

          expect(mockAxios).toHaveBeenCalledTimes(1)
          expect(mockAxios).toHaveBeenCalledWith({
            url: '/',
            method: 'GET',
            data: new URLSearchParams(),
            params: {
              command: 'createAccount',
              account: 'test-account-value',
              response: 'json'
            }
          })

          done()
        })
      })

      /**
       * @name: testMethodHandleSubmitCase8
       * @description: check api is called and params when handleSubmit() is called
       * @condition: form has input key:
       *  - name is `keypair`
       *  - currentAction.api is`addAccountToProject`
       * @expected:
       *  1. api is called
       *  2. api called with params has key is value set by form key value
       */
      it('testMethodHandleSubmitCase8', (done) => {
        wrapper = factory({}, {
          showAction: true,
          currentAction: {
            api: 'addAccountToProject',
            loading: false,
            label: 'label.name',
            params: [
              {
                name: 'keypair',
                type: 'string'
              }
            ],
            paramFields: [
              { name: 'keypair', type: 'string', description: '', required: false }
            ],
            mapping: {}
          },
          resource: {}
        })

        const mockData = {
          testapinamecase1response: {
            testapinamecase1: {}
          }
        }
        mockAxios.mockResolvedValue(mockData)
        spyConsole.log = jest.spyOn(console, 'log').mockImplementation(() => {})

        wrapper.vm.$nextTick(() => {
          wrapper.vm.form.getFieldDecorator('keypair', { initialValue: 'test-keypair-value' })
          const event = document.createEvent('Event')
          wrapper.vm.handleSubmit(event)

          expect(mockAxios).toHaveBeenCalledTimes(1)
          expect(mockAxios).toHaveBeenCalledWith({
            url: '/',
            method: 'GET',
            data: new URLSearchParams(),
            params: {
              command: 'addAccountToProject',
              keypair: 'test-keypair-value',
              response: 'json'
            }
          })

          done()
        })
      })

      /**
       * @name: testMethodHandleSubmitCase9
       * @description: check api is called and params when handleSubmit() is called
       * @condition: form has input key:
       *  - name is `account` | `keypair`
       *  - currentAction.api not equals `addAccountToProject` && `createAccount`
       *  - currentAction.params[input] has name
       * @expected:
       *  1. api is called
       *  2. api called with params has key is value set by currentAction.params.opts[input].name
       */
      it('testMethodHandleSubmitCase9', (done) => {
        wrapper = factory({}, {
          showAction: true,
          currentAction: {
            api: 'testApiNameCase1',
            loading: false,
            label: 'label.name',
            params: [
              {
                name: 'keypair',
                type: 'string',
                opts: [
                  { id: 'test-id-1', name: 'test-name-1' },
                  { id: 'test-id-2', name: 'test-name-2' }
                ]
              }
            ],
            paramFields: [
              { name: 'keypair', type: 'string', description: '', required: false }
            ],
            mapping: {}
          },
          resource: {}
        })

        const mockData = {
          testapinamecase1response: {
            testapinamecase1: {}
          }
        }
        mockAxios.mockResolvedValue(mockData)
        spyConsole.log = jest.spyOn(console, 'log').mockImplementation(() => {})

        wrapper.vm.$nextTick(() => {
          wrapper.vm.form.getFieldDecorator('keypair', { initialValue: 1 })
          const event = document.createEvent('Event')
          wrapper.vm.handleSubmit(event)

          expect(mockAxios).toHaveBeenCalledTimes(1)
          expect(mockAxios).toHaveBeenCalledWith({
            url: '/',
            method: 'GET',
            data: new URLSearchParams(),
            params: {
              command: 'testApiNameCase1',
              keypair: 'test-name-2',
              response: 'json'
            }
          })

          done()
        })
      })

      /**
       * @name: testMethodHandleSubmitCase10
       * @description: check api is called and params when handleSubmit() is called
       * @condition: form has input key:
       *  - under the remaining conditions
       * @expected:
       *  1. api is called
       *  2. api called with params has key is value set by form key value
       */
      it('testMethodHandleSubmitCase10', (done) => {
        wrapper = factory({}, {
          showAction: true,
          currentAction: {
            api: 'testApiNameCase1',
            loading: false,
            label: 'label.name',
            params: [
              {
                name: 'column1',
                type: 'string'
              }
            ],
            paramFields: [
              { name: 'column1', type: 'string', description: '', required: false }
            ],
            mapping: {}
          },
          resource: {}
        })

        const mockData = {
          testapinamecase1response: {
            testapinamecase1: {}
          }
        }
        mockAxios.mockResolvedValue(mockData)
        spyConsole.log = jest.spyOn(console, 'log').mockImplementation(() => {})

        wrapper.vm.$nextTick(() => {
          wrapper.vm.form.getFieldDecorator('column1', { initialValue: 'test-column-value' })
          const event = document.createEvent('Event')
          wrapper.vm.handleSubmit(event)

          expect(mockAxios).toHaveBeenCalledTimes(1)
          expect(mockAxios).toHaveBeenCalledWith({
            url: '/',
            method: 'GET',
            data: new URLSearchParams(),
            params: {
              command: 'testApiNameCase1',
              column1: 'test-column-value',
              response: 'json'
            }
          })

          done()
        })
      })

      /**
       * @name: testMethodHandleSubmitCase11
       * @description: check api is called and params when handleSubmit() is called
       * @condition:
       *  - currentAction has defaultArgs
       * @expected:
       *  1. api is called
       *  2. api called with params has key is value set by currentAction.defaultArgs
       */
      it('testMethodHandleSubmitCase11', (done) => {
        wrapper = factory({}, {
          showAction: true,
          currentAction: {
            api: 'testApiNameCase1',
            loading: false,
            label: 'label.name',
            params: [
              { name: 'column1', type: 'string' }
            ],
            paramFields: [
              { name: 'column1', type: 'string', description: '', required: false }
            ],
            mapping: {},
            defaultArgs: {
              column2: 'test-column2-value'
            }
          },
          resource: {}
        })

        const mockData = {
          testapinamecase1response: {
            testapinamecase1: {}
          }
        }
        mockAxios.mockResolvedValue(mockData)
        spyConsole.log = jest.spyOn(console, 'log').mockImplementation(() => {})

        wrapper.vm.$nextTick(() => {
          wrapper.vm.form.getFieldDecorator('column1', { initialValue: 'test-column1-value' })
          const event = document.createEvent('Event')
          wrapper.vm.handleSubmit(event)

          expect(mockAxios).toHaveBeenCalledTimes(1)
          expect(mockAxios).toHaveBeenCalledWith({
            url: '/',
            method: 'GET',
            data: new URLSearchParams(),
            params: {
              command: 'testApiNameCase1',
              column1: 'test-column1-value',
              column2: 'test-column2-value',
              response: 'json'
            }
          })

          done()
        })
      })

      /**
       * @name: testMethodHandleSubmitCase12
       * @description: check api is called and params when handleSubmit() is called
       * @condition:
       *  - currentAction.mapping has value
       * @expected:
       *  1. api is called
       *  2. api called with params has key is value set by currentAction.mapping and resource
       */
      it('testMethodHandleSubmitCase12', (done) => {
        wrapper = factory({}, {
          showAction: true,
          currentAction: {
            api: 'testApiNameCase1',
            loading: false,
            label: 'label.name',
            params: [
              { name: 'column1', type: 'string' }
            ],
            paramFields: [
              { name: 'column1', type: 'string', description: '', required: false }
            ],
            mapping: {
              column2: {
                value: (record, params) => {
                  return record.name
                }
              }
            }
          },
          resource: {
            id: 'test-id-value',
            name: 'test-name-value'
          }
        })

        const mockData = {
          testapinamecase1response: {
            testapinamecase1: {}
          }
        }
        mockAxios.mockResolvedValue(mockData)
        spyConsole.log = jest.spyOn(console, 'log').mockImplementation(() => {})

        wrapper.vm.$nextTick(() => {
          wrapper.vm.form.getFieldDecorator('column1', { initialValue: 'test-column1-value' })
          const event = document.createEvent('Event')
          wrapper.vm.handleSubmit(event)

          expect(mockAxios).toHaveBeenCalledTimes(1)
          expect(mockAxios).toHaveBeenCalledWith({
            url: '/',
            method: 'GET',
            data: new URLSearchParams(),
            params: {
              command: 'testApiNameCase1',
              column1: 'test-column1-value',
              column2: 'test-name-value',
              response: 'json'
            }
          })

          done()
        })
      })
    })
  })
})
