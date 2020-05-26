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
import { localVue, mockAxios, mockI18n, mockStore } from './../../../setup'
import MigrateWizard from '@/views/compute/MigrateWizard'

jest.mock('axios', () => mockAxios)

let wrapper = null
let store = null

const messages = {
  en: {
    name: 'name-en',
    Suitability: 'Suitability-en',
    cpuused: 'cpuused-en',
    memused: 'memused-en',
    select: 'select-en',
    ok: 'ok-en'
  },
  de: {
    name: 'name-de',
    Suitability: 'Suitability-de',
    cpuused: 'cpuused-de',
    memused: 'memused-de',
    select: 'select-de',
    ok: 'ok-de'
  }
}
const state = {}
const i18n = mockI18n.mock('en', messages)
const mocks = {
  $message: {
    error: jest.fn((message) => {})
  },
  $pollJob: jest.fn((obj) => {
    switch (obj.jobId) {
      case 'test-job-id-case-1':
        if ('successMethod' in obj) {
          obj.successMethod()
        }
        break
      case 'test-job-id-case-2':
        if ('errorMethod' in obj) {
          obj.errorMethod()
        }
        break
      case 'test-job-id-case-3':
        if ('catchMethod' in obj) {
          obj.catchMethod()
        }
        break
    }
  })
}
const actions = {
  AddAsyncJob: jest.fn((jobObject) => {})
}

store = mockStore.mock(state, actions)

const factory = (component, propData = {}, data = {}, methods = {}) => {
  return mount(component, {
    localVue,
    i18n,
    store,
    propsData: propData,
    methods: methods,
    mocks,
    data () {
      return { ...data }
    }
  })
}

describe('Views > compute > MigrateWizard.vue', () => {
  beforeEach(() => {
    jest.clearAllMocks()

    if (wrapper) {
      wrapper.destroy()
    }

    if (i18n.locale !== 'en') {
      i18n.locale = 'en'
    }
  })

  describe('Mounted', () => {
    it('check fetchData() is called when component loaded', () => {
      const mockData = {
        findhostsformigrationresponse: {
          count: 0,
          host: []
        }
      }

      mockAxios.mockResolvedValue(mockData)
      const fetchData = jest.fn()
      wrapper = factory(MigrateWizard, { resource: {} }, {}, { fetchData })

      wrapper.vm.$nextTick(() => {
        expect(fetchData).toHaveBeenCalled()
      })
    })
  })

  describe('Methods', () => {
    describe('fetchData()', () => {
      it('check api is called with resource is empty and searchQuery is null', () => {
        const mockData = {
          findhostsformigrationresponse: {
            count: 0,
            host: []
          }
        }

        mockAxios.mockResolvedValue(mockData)
        wrapper = factory(MigrateWizard, { resource: {} })

        wrapper.vm.$nextTick(() => {
          expect(mockAxios).toHaveBeenCalled()
          expect(mockAxios).toHaveBeenCalledWith({
            url: '/',
            method: 'GET',
            data: new URLSearchParams(),
            params: {
              command: 'findHostsForMigration',
              virtualmachineid: undefined,
              keyword: '',
              page: 1,
              pagesize: 10,
              response: 'json'
            }
          })
        })
      })

      it('check api is called with resource.id is null and searchQuery is null', () => {
        const mockData = {
          findhostsformigrationresponse: {
            count: 0,
            host: []
          }
        }

        mockAxios.mockResolvedValue(mockData)
        wrapper = factory(MigrateWizard, { resource: { id: null } })

        wrapper.vm.$nextTick(() => {
          expect(mockAxios).toHaveBeenCalled()
          expect(mockAxios).toHaveBeenCalledWith({
            url: '/',
            method: 'GET',
            data: new URLSearchParams(),
            params: {
              command: 'findHostsForMigration',
              virtualmachineid: null,
              keyword: '',
              page: 1,
              pagesize: 10,
              response: 'json'
            }
          })
        })
      })

      it('check api is called with resource.id is not null and searchQuery is null', () => {
        const mockData = {
          findhostsformigrationresponse: {
            count: 0,
            host: []
          }
        }

        mockAxios.mockResolvedValue(mockData)
        wrapper = factory(MigrateWizard, { resource: { id: 'test-id-value' } })

        wrapper.vm.$nextTick(() => {
          expect(mockAxios).toHaveBeenCalled()
          expect(mockAxios).toHaveBeenCalledWith({
            url: '/',
            method: 'GET',
            data: new URLSearchParams(),
            params: {
              command: 'findHostsForMigration',
              virtualmachineid: 'test-id-value',
              keyword: '',
              page: 1,
              pagesize: 10,
              response: 'json'
            }
          })
        })
      })

      it('check api is called with resource.id is not null and searchQuery is not null', () => {
        const mockData = {
          findhostsformigrationresponse: {
            count: 0,
            host: []
          }
        }

        mockAxios.mockResolvedValue(mockData)
        wrapper = factory(MigrateWizard, { resource: { id: 'test-id-value' } }, { searchQuery: 'test-query-value' })

        wrapper.vm.$nextTick(() => {
          expect(mockAxios).toHaveBeenCalled()
          expect(mockAxios).toHaveBeenCalledWith({
            url: '/',
            method: 'GET',
            data: new URLSearchParams(),
            params: {
              command: 'findHostsForMigration',
              virtualmachineid: 'test-id-value',
              keyword: 'test-query-value',
              page: 1,
              pagesize: 10,
              response: 'json'
            }
          })
        })
      })

      it('check api is called with params assign by resource, searchQuery, page, pageSize', () => {
        const mockData = {
          findhostsformigrationresponse: {
            count: 0,
            host: []
          }
        }

        mockAxios.mockResolvedValue(mockData)
        wrapper = factory(MigrateWizard, {
          resource: { id: 'test-id-value' }
        },
        {
          searchQuery: 'test-query-value',
          page: 2,
          pageSize: 20
        })

        wrapper.vm.$nextTick(() => {
          expect(mockAxios).toHaveBeenCalled()
          expect(mockAxios).toHaveBeenCalledWith({
            url: '/',
            method: 'GET',
            data: new URLSearchParams(),
            params: {
              command: 'findHostsForMigration',
              virtualmachineid: 'test-id-value',
              keyword: 'test-query-value',
              page: 2,
              pagesize: 20,
              response: 'json'
            }
          })
        })
      })

      it('check hosts, totalCount when api is called with response result is empty', async (done) => {
        const mockData = {
          findhostsformigrationresponse: {
            count: 0,
            host: []
          }
        }

        mockAxios.mockResolvedValue(mockData)
        wrapper = factory(MigrateWizard, { resource: {} })

        await wrapper.vm.$nextTick()

        setTimeout(() => {
          expect(wrapper.vm.hosts).toEqual([])
          expect(wrapper.vm.totalCount).toEqual(0)

          done()
        })
      })

      it('check hosts, totalCount when api is called with response result is not empty', async (done) => {
        const mockData = {
          findhostsformigrationresponse: {
            count: 1,
            host: [{
              id: 'test-host-id',
              name: 'test-host-name',
              suitability: 'test-host-suitability',
              cpuused: 'test-host-cpuused',
              memused: 'test-host-memused',
              select: 'test-host-select'
            }]
          }
        }

        mockAxios.mockResolvedValue(mockData)
        wrapper = factory(MigrateWizard, { resource: {} })

        await wrapper.vm.$nextTick()

        setTimeout(() => {
          expect(wrapper.vm.hosts).toEqual([{
            id: 'test-host-id',
            name: 'test-host-name',
            suitability: 'test-host-suitability',
            cpuused: 'test-host-cpuused',
            memused: 'test-host-memused',
            select: 'test-host-select'
          }])
          expect(wrapper.vm.totalCount).toEqual(0)

          done()
        })
      })

      it('check $message.error is called when api is called with throw error', async (done) => {
        const mockError = 'Error: throw error message'
        console.error = jest.fn()

        mockAxios.mockRejectedValue(mockError)
        wrapper = factory(MigrateWizard, { resource: {} })

        await wrapper.vm.$nextTick()

        setTimeout(() => {
          expect(mocks.$message.error).toHaveBeenCalled()
          expect(mocks.$message.error).toHaveBeenCalledWith(`Failed to load hosts: ${mockError}`)

          done()
        })
      })
    })

    describe('submitForm()', () => {
      it('check api is called when selectedHost.requiresStorageMotion is true', async (done) => {
        const fetchData = jest.fn()
        const mockData = {
          migratevirtualmachineresponse: {
            jobid: 'test-job-id'
          },
          queryasyncjobresultresponse: {
            jobstatus: 1,
            jobresult: {
              name: 'test-name-value'
            }
          }
        }

        wrapper = factory(MigrateWizard, {
          resource: {
            id: 'test-resource-id',
            name: 'test-resource-name'
          }
        },
        {
          selectedHost: {
            requiresStorageMotion: true,
            id: 'test-host-id',
            name: 'test-host-name'
          }
        },
        { fetchData })

        mockAxios.mockResolvedValue(mockData)

        await wrapper.vm.$nextTick()
        await wrapper.vm.submitForm()

        setTimeout(() => {
          expect(mockAxios).toHaveBeenCalled()
          expect(mockAxios).toHaveBeenCalledWith({
            url: '/',
            method: 'GET',
            data: new URLSearchParams(),
            params: {
              command: 'migrateVirtualMachineWithVolume',
              hostid: 'test-host-id',
              virtualmachineid: 'test-resource-id',
              response: 'json'
            }
          })

          done()
        })
      })

      it('check api is called when selectedHost.requiresStorageMotion is false', async (done) => {
        const fetchData = jest.fn()
        const mockData = {
          migratevirtualmachineresponse: {
            jobid: 'test-job-id'
          },
          queryasyncjobresultresponse: {
            jobstatus: 1,
            jobresult: {
              name: 'test-name-value'
            }
          }
        }

        wrapper = factory(MigrateWizard, {
          resource: {
            id: 'test-resource-id',
            name: 'test-resource-name'
          }
        },
        {
          selectedHost: {
            requiresStorageMotion: false,
            id: 'test-host-id',
            name: 'test-host-name'
          }
        },
        { fetchData })

        mockAxios.mockResolvedValue(mockData)

        await wrapper.vm.$nextTick()
        await wrapper.vm.submitForm()

        setTimeout(() => {
          expect(mockAxios).toHaveBeenCalled()
          expect(mockAxios).toHaveBeenCalledWith({
            url: '/',
            method: 'GET',
            data: new URLSearchParams(),
            params: {
              command: 'migrateVirtualMachine',
              hostid: 'test-host-id',
              virtualmachineid: 'test-resource-id',
              response: 'json'
            }
          })

          done()
        })
      })

      it('check store dispatch `AddAsyncJob` and $pollJob have successMethod() is called', async (done) => {
        const fetchData = jest.fn()
        const mockData = {
          migratevirtualmachineresponse: {
            jobid: 'test-job-id-case-1'
          },
          queryasyncjobresultresponse: {
            jobstatus: 1,
            jobresult: {
              name: 'test-name-value'
            }
          }
        }

        wrapper = factory(MigrateWizard, {
          resource: {
            id: 'test-resource-id',
            name: 'test-resource-name'
          }
        },
        {
          selectedHost: {
            requiresStorageMotion: true,
            id: 'test-host-id',
            name: 'test-host-name'
          }
        },
        { fetchData })

        mockAxios.mockResolvedValue(mockData)

        await wrapper.vm.$nextTick()
        await wrapper.vm.submitForm()

        setTimeout(() => {
          expect(actions.AddAsyncJob).toHaveBeenCalled()
          expect(mocks.$pollJob).toHaveBeenCalled()
          expect(wrapper.emitted()['close-action'][0]).toEqual([])

          done()
        })
      })

      it('check store dispatch `AddAsyncJob` and $pollJob have errorMethod() is called', async (done) => {
        const fetchData = jest.fn()
        const mockData = {
          migratevirtualmachineresponse: {
            jobid: 'test-job-id-case-2'
          },
          queryasyncjobresultresponse: {
            jobstatus: 2,
            jobresult: {
              errortext: 'test-error-message'
            }
          }
        }

        wrapper = factory(MigrateWizard, {
          resource: {
            id: 'test-resource-id',
            name: 'test-resource-name'
          }
        },
        {
          selectedHost: {
            requiresStorageMotion: true,
            id: 'test-host-id',
            name: 'test-host-name'
          }
        },
        { fetchData })

        mockAxios.mockResolvedValue(mockData)

        await wrapper.vm.$nextTick()
        await wrapper.vm.submitForm()

        setTimeout(() => {
          expect(actions.AddAsyncJob).toHaveBeenCalled()
          expect(mocks.$pollJob).toHaveBeenCalled()
          expect(wrapper.emitted()['close-action'][0]).toEqual([])

          done()
        })
      })

      it('check store dispatch `AddAsyncJob` and $pollJob have catchMethod() is called', async (done) => {
        const fetchData = jest.fn()
        const mockData = {
          migratevirtualmachineresponse: {
            jobid: 'test-job-id-case-3'
          }
        }

        wrapper = factory(MigrateWizard, {
          resource: {
            id: 'test-resource-id',
            name: 'test-resource-name'
          }
        },
        {
          selectedHost: {
            requiresStorageMotion: true,
            id: 'test-host-id',
            name: 'test-host-name'
          }
        },
        { fetchData })

        mockAxios.mockResolvedValue(mockData)

        await wrapper.vm.$nextTick()
        await wrapper.vm.submitForm()

        setTimeout(() => {
          expect(actions.AddAsyncJob).toHaveBeenCalled()
          expect(mocks.$pollJob).toHaveBeenCalled()
          expect(wrapper.emitted()['close-action'][0]).toEqual([])

          done()
        })
      })

      it('check $message.error is called when api is called with throw error', async (done) => {
        const fetchData = jest.fn()
        const mockError = 'Error: throw error message'

        wrapper = factory(MigrateWizard, {
          resource: {}
        },
        {
          selectedHost: {
            requiresStorageMotion: true,
            id: 'test-host-id',
            name: 'test-host-name'
          }
        },
        { fetchData })

        mockAxios.mockRejectedValue(mockError)

        await wrapper.vm.$nextTick()
        await wrapper.vm.submitForm()

        setTimeout(() => {
          expect(mocks.$message.error).toHaveBeenCalled()
          expect(mocks.$message.error).toHaveBeenCalledWith(`Failed to migrate VM to host test-host-name`)

          done()
        })
      })
    })

    describe('handleChangePage()', () => {
      it('check page, pageSize and fetchData() when handleChangePage() is called', () => {
        const fetchData = jest.fn()

        wrapper = factory(MigrateWizard, {
          resource: {}
        }, {
          page: 1,
          pageSize: 10
        }, {
          fetchData
        })

        wrapper.vm.$nextTick(() => {
          wrapper.vm.handleChangePage(2, 20)

          expect(wrapper.vm.page).toEqual(2)
          expect(wrapper.vm.pageSize).toEqual(20)
          expect(fetchData).toBeCalled()
        })
      })
    })

    describe('handleChangePageSize()', () => {
      it('check page, pageSize and fetchData() when handleChangePageSize() is called', () => {
        const fetchData = jest.fn()

        wrapper = factory(MigrateWizard, {
          resource: {}
        }, {
          page: 1,
          pageSize: 10
        }, {
          fetchData
        })

        wrapper.vm.$nextTick(() => {
          wrapper.vm.handleChangePageSize(2, 20)

          expect(wrapper.vm.page).toEqual(2)
          expect(wrapper.vm.pageSize).toEqual(20)
          expect(fetchData).toBeCalled()
        })
      })
    })
  })
})
