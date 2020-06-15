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
    labelname: 'test-name-en',
    displaytext: 'description-en',
    'label.column1': 'column1-en',
    'label.column2': 'column2-en',
    'label.column3': 'column3-en',
    'label.id': 'uuid-en',
    'label.name': 'name-en',
    'label.domainid': 'domain-en',
    'label.self': 'self-en',
    'label.all': 'all-en',
    'label.tags': 'tags-en',
    'label.account': 'account-en',
    'label.domainids': 'domainids-en',
    'label.keypair': 'keypair-en',
    'label.filterby': 'filterby-en',
    'label.refresh': 'refresh-en',
    'message.error.required.input': 'required-en',
    'message.error.select': 'select-en',
    'label.search': 'search-en'
  },
  de: {
    labelname: 'test-name-de',
    displaytext: 'description-de',
    'label.column1': 'column1-de',
    'label.column2': 'column2-de',
    'label.column3': 'column3-de',
    'label.id': 'uuid-de',
    'label.name': 'name-de',
    'label.domainid': 'domain-de',
    'label.self': 'self-de',
    'label.all': 'all-de',
    'label.tags': 'tags-de',
    'label.account': 'account-de',
    'label.domainids': 'domainids-de',
    'label.keypair': 'keypair-de',
    'label.filterby': 'filterby-de',
    'label.refresh': 'refresh-de',
    'message.error.required.input': 'required-de',
    'message.error.select': 'select-de',
    'label.search': 'search-de'
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
const actions = {
  AddAsyncJob: jest.fn((jobId) => {})
}
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
        duration: option.duration
      }
    }),
    success: jest.fn((option) => {
      return {
        message: option.message,
        description: option.description
      }
    })
  },
  $message: {
    success: jest.fn((message) => {
      return message
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
    it('check beforeRouteUpdate() is called', () => {
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

    it('check beforeRouteLeave() is called', () => {
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
      it('The wrapper data does not change when $router do not change', () => {
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

      it('The wrapper data changes when $router changes', () => {
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
      it('Test language and fetchData() when not changing locale', () => {
        wrapper = factory()

        const spy = jest.spyOn(wrapper.vm, 'fetchData')

        wrapper.vm.$nextTick(() => {
          expect(wrapper.vm.$t('labelname')).toEqual('test-name-en')
          expect(spy).not.toBeCalled()
        })
      })

      it('Test languages and fetchData() when changing locale', async () => {
        wrapper = factory()

        i18n.locale = 'de'
        const spy = jest.spyOn(wrapper.vm, 'fetchData')

        wrapper.vm.$nextTick(() => {
          expect(wrapper.vm.$t('labelname')).toEqual('test-name-de')
          expect(spy).toBeCalled()
        })
      })
    })
  })

  describe('Computed', () => {
    it('check hasSelected is true when the selectedRowKeys is otherwise empty', () => {
      wrapper = factory({}, { selectedRowKeys: ['test-select-id'] })

      wrapper.vm.$nextTick(() => {
        expect(wrapper.vm.hasSelected).toBeTruthy()
      })
    })

    it('check hasSelected is false when the selectedRowKeys is empty', () => {
      wrapper = factory({}, { selectedRowKeys: [] })

      wrapper.vm.$nextTick(() => {
        expect(wrapper.vm.hasSelected).toBeFalsy()
      })
    })
  })

  describe('Methods', () => {
    describe('fetchData()', () => {
      it('check routeName when fetchData() is called with $route.name is not empty', () => {
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

      it('check routeName when fetchData() is called with $route.name is empty', () => {
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

      it('check resource, dataView when fetchData() is called with $route.meta.params is not empty', () => {
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

      it('check columnKeys, actions when fetchData() is called with $route.meta.actions, route.meta.columns is not empty', () => {
        router = createRouter([{
          name: 'testRouter5',
          path: '/test-router-5',
          meta: {
            icon: 'test-router-5',
            permission: ['testApiNameCase1'],
            columns: ['column1', 'column2', 'column3'],
            actions: [
              {
                name: 'labelname',
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
            name: 'labelname',
            icon: 'plus',
            listView: true
          }])
        })
      })

      it('check columnKeys assign by store.getters.apis when fetchData() is called', () => {
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

      it('check columnKeys assign by $route.meta.columns when fetchData() is called', () => {
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

      it('check api is called with params assign by $route.query', (done) => {
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

      it('check api is called with params assign by $route.meta.params', (done) => {
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

      it('check selectedFilter, filters when fetchData() is called with $route.meta.filters and user role is Normal', () => {
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

      it('check selectedFilter, filters when fetchData() is called with $route.meta.filters and user role is Admin', () => {
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

      it('check api is called with params has item templatefilter', (done) => {
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

      it('check api is called with params has item isofilter', (done) => {
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

      it('check api is called with params has item keyword when searchQuery is not empty', (done) => {
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

      it('check api is called with params has item name when searchQuery is not empty', (done) => {
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

      it('check api is called with params has item templatetype when searchQuery is not empty', (done) => {
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

      it('check api is called with params has item id, name when $route.path startWith /ssh/', (done) => {
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

      it('check api is called with params has item id, hostname when $route.path startWith /ldapsetting/', (done) => {
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

      it('check items, resource when api is called with result is not empty', (done) => {
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

      it('check items, resource when api is called and $route.meta.columns has function', (done) => {
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

      it('check items, resource when api is called and $route.path startWith /ssh', (done) => {
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

      it('check items, resource when api is called and $route.path startWith /ldapsetting', (done) => {
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

      it('check $notifyError is called when api is called with throw error', (done) => {
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

      it('check $notifyError is called and router path = /exception/403 when api is called with throw error', (done) => {
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

      it('check $notifyError is called and router path = /exception/404 when api is called with throw error', (done) => {
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

      it('check $notifyError is called and router path = /exception/500 when api is called with throw error', (done) => {
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
      it('check page, searchQuery value when onSearch() is called with query param is empty', (done) => {
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

      it('check page, searchQuery value when onSearch() is called with query param is not empty', (done) => {
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
      it('check currentAction, showAction when closeAction() is called', () => {
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
      it('check showAction, actionData and router name when execAction() is called', () => {
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
            label: 'labelname',
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

      it('check currentAction params and paramsField when execAction() is called', () => {
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

      it('check currentAction params and paramsField when execAction() is called with args is exists', () => {
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

      it('check currentAction params and paramsField when execAction() is called with args is function', () => {
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

      it('check currentAction paramsField and listUuidOpts() is called when execAction() is called', () => {
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

      it('check fillEditFormFieldValues() is called when execAction() is called', () => {
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
      it('check api not called when listUuidOpts() is called with currentAction.mapping.id is null', (done) => {
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

      it('check api not called when listUuidOpts() is called with currentAction.mapping is empty', (done) => {
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

      it('check api is called and param.opts when listUuidOpts() is called with currentAction.mapping[param.name].api', (done) => {
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

      it('check api is called with apiName when listUuidOpts() is called', (done) => {
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

      it('check api is called when listUuidOpts() is called with store apis has api startWith param.name', (done) => {
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

      it('check api is called with params has item name and value assign by resource', (done) => {
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

      it('check api is called with params has item templatefilter when apiName is listTemplates', (done) => {
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

      it('check api is called with params has item isofilter when apiName is listIsos', (done) => {
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

      it('check api is called with params has item type = routing when apiName is listHosts', (done) => {
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

      it('check api is called and param.opts is empty when api throw error', (done) => {
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
      it('check $notification, fetchData() when pollActionCompletion() is called with action is empty', (done) => {
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
        wrapper.vm.pollActionCompletion(jobId, action)

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

      it('check $notification, fetchData() when pollActionCompletion() is called with action is not empty', (done) => {
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
          label: 'labelname',
          response: (jobResult) => {
            return jobResult.name
          }
        }
        const spy = jest.spyOn(wrapper.vm, 'fetchData')

        mockAxios.mockResolvedValue(mockData)
        wrapper.vm.pollActionCompletion(jobId, action)

        setTimeout(() => {
          expect(spy).toHaveBeenCalled()
          expect(mocks.$notification.info).toHaveBeenCalled()
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

      it('check fetchData() is called when $pollJob error response', (done) => {
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
          label: 'labelname',
          response: (jobResult) => {
            return jobResult.name
          }
        }
        const spy = jest.spyOn(wrapper.vm, 'fetchData')

        mockAxios.mockResolvedValue(mockData)
        wrapper.vm.pollActionCompletion(jobId, action)

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
      it('check form getFieldDecorator() is called and formModel when currentAction.paramFields has item type = list', (done) => {
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

        wrapper.vm.fillEditFormFieldValues()

        wrapper.vm.$nextTick(() => {
          expect(spy).toHaveBeenCalled()
          expect(spy).toBeCalledWith('domainids', {
            initialValue: ['test-domain-value-1', 'test-domain-value-2']
          })
          expect(wrapper.vm.formModel).toEqual({ domainids: ['test-domain-value-1', 'test-domain-value-2'] })

          done()
        })
      })

      it('check form getFieldDecorator() is called and formModel when currentAction.paramFields has item name = account', (done) => {
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

        wrapper.vm.fillEditFormFieldValues()

        wrapper.vm.$nextTick(() => {
          expect(spy).toHaveBeenCalled()
          expect(spy).toBeCalledWith('account', {
            initialValue: 'test-account-value'
          })
          expect(wrapper.vm.formModel).toEqual({ account: 'test-account-value' })

          done()
        })
      })

      it('check form getFieldDecorator() is called and formModel when currentAction.paramFields has item exists in currentAction. mapping', (done) => {
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

        wrapper.vm.fillEditFormFieldValues()

        wrapper.vm.$nextTick(() => {
          expect(spy).toHaveBeenCalled()
          expect(spy).toBeCalledWith('column1', {
            initialValue: 'test-column-value'
          })
          expect(wrapper.vm.formModel).toEqual({ column1: 'test-column-value' })

          done()
        })
      })

      it('check form getFieldDecorator() is called and formModel when currentAction.paramFields has item exists in resource', (done) => {
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

        wrapper.vm.$nextTick(() => {
          wrapper.vm.fillEditFormFieldValues()

          expect(spy).toHaveBeenCalled()
          expect(spy).toBeCalledWith('column1', {
            initialValue: 'test-column-value'
          })
          expect(wrapper.vm.formModel).toEqual({ column1: 'test-column-value' })

          done()
        })
      })

      it('check form getFieldDecorator() is called and formModel when currentAction.paramFields have not item in resource', (done) => {
        wrapper = factory({}, {
          currentAction: {
            paramFields: [
              { name: 'column1', type: 'string' }
            ]
          },
          resource: {}
        })

        const spy = jest.spyOn(wrapper.vm.form, 'getFieldDecorator')

        wrapper.vm.$nextTick(() => {
          wrapper.vm.fillEditFormFieldValues()

          expect(spy).not.toHaveBeenCalled()
          expect(wrapper.vm.formModel).toEqual({})

          done()
        })
      })

      it('check form getFieldDecorator() is not called when field value is null', (done) => {
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
      it('check selectedFilter, fetchData() when changeFilter() is called', () => {
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
      it('check page, pageSize and fetchData() when changePage() is called', () => {
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
      it('check page, pageSize and fetchData() when changePageSize() is called', () => {
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
      it('check loading, selectedRowKeys, fetchData() when start() is called', async (done) => {
        wrapper = factory({}, {
          loading: false,
          selectedRowKeys: ['test-selected']
        })

        const spy = jest.spyOn(wrapper.vm, 'fetchData')
        await wrapper.vm.$nextTick()
        await wrapper.vm.start()

        expect(wrapper.vm.loading).toBeTruthy()
        expect(wrapper.vm.selectedRowKeys).toEqual(['test-selected'])
        expect(spy).toBeCalled()

        setTimeout(() => {
          expect(wrapper.vm.loading).toBeFalsy()
          expect(wrapper.vm.selectedRowKeys).toEqual([])

          done()
        }, 1000)
      })
    })

    describe('toggleLoading()', () => {
      it('check loading when toggleLoading() is called', () => {
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
      it('check loading when startLoading() is called', () => {
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
      it('check loading when finishLoading() is called', () => {
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
      it('check error from validateFields', (done) => {
        wrapper = factory({}, {
          showAction: true,
          currentAction: {
            loading: false,
            label: 'labelname',
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

      it('check api is called with params has item id equal resource.id', (done) => {
        wrapper = factory({}, {
          showAction: true,
          currentAction: {
            api: 'testApiNameCase1',
            loading: false,
            label: 'labelname',
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

      it('check api is called when form has input key not exist in currentAction.params', (done) => {
        wrapper = factory({}, {
          showAction: true,
          currentAction: {
            api: 'testApiNameCase1',
            loading: false,
            label: 'labelname',
            params: [
              { name: 'id', type: 'uuid' }
            ],
            paramFields: [
              { name: 'name', type: 'string', description: '', required: false },
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

      it('check api is called when form has input key exist in currentAction.params, type is boolean and value is undefined', (done) => {
        wrapper = factory({}, {
          showAction: true,
          currentAction: {
            api: 'testApiNameCase1',
            loading: false,
            label: 'labelname',
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

      it('check api is called when form has input key exist in currentAction.params, type is boolean and value is null', (done) => {
        wrapper = factory({}, {
          showAction: true,
          currentAction: {
            api: 'testApiNameCase1',
            loading: false,
            label: 'labelname',
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
          wrapper.vm.form.getFieldDecorator('column1', { initialValue: null })
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

      it('check api is called when form has input key exist in currentAction.mapping', (done) => {
        wrapper = factory({}, {
          showAction: true,
          currentAction: {
            api: 'testApiNameCase1',
            loading: false,
            label: 'labelname',
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

      it('check api is called when form has input key not exist in currentAction.mapping, type is list and currentAction.params[input] has id', (done) => {
        wrapper = factory({}, {
          showAction: true,
          currentAction: {
            api: 'testApiNameCase1',
            loading: false,
            label: 'labelname',
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

      it('check api is called when form has input key has name = account, currentAction.api = createAccount', (done) => {
        wrapper = factory({}, {
          showAction: true,
          currentAction: {
            api: 'createAccount',
            loading: false,
            label: 'labelname',
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

      it('check api is called when form has input key has name = keypair, currentAction.api = addAccountToProject', (done) => {
        wrapper = factory({}, {
          showAction: true,
          currentAction: {
            api: 'addAccountToProject',
            loading: false,
            label: 'labelname',
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

      it('check api is called when form has input key name = (account | keypair), currentAction.api != (addAccountToProject | createAccount)', (done) => {
        wrapper = factory({}, {
          showAction: true,
          currentAction: {
            api: 'testApiNameCase1',
            loading: false,
            label: 'labelname',
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

      it('check api is called when form has input key do not fall under special condition.', (done) => {
        wrapper = factory({}, {
          showAction: true,
          currentAction: {
            api: 'testApiNameCase1',
            loading: false,
            label: 'labelname',
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

      it('check api is called when currentAction has defaultArgs', (done) => {
        wrapper = factory({}, {
          showAction: true,
          currentAction: {
            api: 'testApiNameCase1',
            loading: false,
            label: 'labelname',
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

      it('check api is called when currentAction.mapping has value and value is function', (done) => {
        wrapper = factory({}, {
          showAction: true,
          currentAction: {
            api: 'testApiNameCase1',
            loading: false,
            label: 'labelname',
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

      it('check router name when api is called and currentAction.icon = delete and dataView is true', async (done) => {
        router = createRouter([{
          name: 'testRouter26',
          path: '/test-router-26',
          meta: {
            icon: 'test-router-26'
          }
        }])
        wrapper = factory()
        router.push({ name: 'testRouter26' })

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
        spyConsole.log = jest.spyOn(console, 'log').mockImplementation(() => {})
        await wrapper.vm.$nextTick()

        expect(router.currentRoute.name).toEqual('testRouter26')

        wrapper.setData({
          currentAction: {
            icon: 'delete',
            api: 'testApiNameCase1',
            loading: false,
            label: 'labelname',
            params: [
              { name: 'column1', type: 'string' }
            ],
            paramFields: [
              { name: 'column1', type: 'string', description: '', required: false }
            ]
          },
          dataView: true
        })

        wrapper.vm.form.getFieldDecorator('column1', { initialValue: 'test-column1-value' })
        const event = document.createEvent('Event')
        await wrapper.vm.handleSubmit(event)

        setTimeout(() => {
          expect(router.currentRoute.name).toEqual('home')
          done()
        }, 1000)
      })

      it('check pollActionCompletion() and action AddAsyncJob is called when api is called and response have jobId result', async (done) => {
        store = mockStore.mock(state, actions)
        wrapper = factory({}, {
          showAction: true,
          currentAction: {
            api: 'testApiNameCase1',
            loading: false,
            label: 'labelname',
            params: [
              { name: 'column1', type: 'string' }
            ],
            paramFields: [
              { name: 'column1', type: 'string', description: '', required: false }
            ]
          },
          resource: {}
        })

        const spyPollAction = jest.spyOn(wrapper.vm, 'pollActionCompletion').mockImplementation(() => {})
        const mockData = {
          testapinamecase1response: {
            jobid: 'test-job-id'
          }
        }

        mockAxios.mockResolvedValue(mockData)
        spyConsole.log = jest.spyOn(console, 'log').mockImplementation(() => {})

        await wrapper.vm.$nextTick()
        wrapper.vm.form.getFieldDecorator('column1', { initialValue: 'test-column1-value' })
        const event = document.createEvent('Event')
        wrapper.vm.handleSubmit(event)

        setTimeout(() => {
          expect(actions.AddAsyncJob).toHaveBeenCalled()
          expect(spyPollAction).toHaveBeenCalled()

          done()
        })
      })

      it('check $notification when api is called and response have not jobId result', async (done) => {
        wrapper = factory({}, {
          showAction: true,
          currentAction: {
            api: 'testApiNameCase1',
            loading: false,
            label: 'labelname',
            params: [
              { name: 'column1', type: 'string' }
            ],
            paramFields: [
              { name: 'column1', type: 'string', description: '', required: false }
            ]
          },
          resource: {
            name: 'test-name-value'
          }
        })

        const mockData = {
          testapinamecase1response: {
            count: 1,
            testapinamecase1: [{
              id: 'test-id-value'
            }]
          }
        }

        mockAxios.mockResolvedValue(mockData)
        spyConsole.log = jest.spyOn(console, 'log').mockImplementation(() => {})

        await wrapper.vm.$nextTick()
        wrapper.vm.form.getFieldDecorator('column1', { initialValue: 'test-column1-value' })
        const event = document.createEvent('Event')
        wrapper.vm.handleSubmit(event)

        setTimeout(() => {
          expect(mocks.$message.success).toHaveBeenCalled()
          expect(mocks.$message.success).toHaveLastReturnedWith('test-name-en - test-name-value')

          done()
        })
      })

      it('check $notifyError is called when api is called with throw error', async (done) => {
        wrapper = factory()

        const errorMock = {
          response: {},
          message: 'Error: throw exception error'
        }
        mockAxios.mockRejectedValue(errorMock)
        spyConsole.log = jest.spyOn(console, 'log').mockImplementation(() => {})

        await wrapper.vm.$nextTick()
        const event = document.createEvent('Event')
        await wrapper.vm.handleSubmit(event)

        setTimeout(() => {
          expect(mocks.$notifyError).toHaveBeenCalledTimes(1)
          expect(mocks.$notifyError).toHaveBeenCalledWith(errorMock)

          done()
        })
      })
    })
  })
})
