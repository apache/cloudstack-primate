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
  mockStore,
  mockRouter,
  mockAxios,
  decodeHtml
} from './../../../setup'
import ActionButton from '@/components/view/ActionButton'

jest.mock('axios', () => mockAxios)

describe('Components > view > Status.vue', () => {
  describe('Template', () => {
    beforeAll(() => {
      jest.resetModules()
      jest.clearAllMocks()
    })

    afterAll(() => {
      jest.resetModules()
      jest.clearAllMocks()
    })

    it('console component show', () => {
      const routes = [
        {
          name: 'testRouter2',
          path: '/test-router-2',
          meta: {
            name: 'systemvm'
          }
        }
      ]
      const router = mockRouter.mock(routes)
      const propsData = {
        dataView: true,
        resource: {
          id: 'test-resource-id',
          state: 'Stopped'
        }
      }
      router.push({ name: 'testRouter2' })
      const wrapper = mount(ActionButton, {
        localVue,
        router,
        propsData: propsData
      })

      const wrapperHtml = wrapper.html()
      const received = decodeHtml(wrapperHtml)

      const expectedLink = '<a href="/client/console?cmd=access&vm=test-resource-id" target="_blank">'
      const expectedButton = '<button disabled="disabled" type="button" class="ant-btn ant-btn-dashed ant-btn-circle" style="margin-right: 5px;">'

      expect(received).toContain(expectedLink)
      expect(received).toContain(expectedButton)
    })

    it('console component not show', () => {
      const routes = [
        {
          name: 'testRouter2',
          path: '/test-router-2',
          meta: {
            name: 'test-name'
          }
        }
      ]
      const router = mockRouter.mock(routes)
      const propsData = {
        dataView: true,
        resource: {
          id: 'test-resource-id',
          state: 'Stopped'
        }
      }
      router.push({ name: 'testRouter2' })
      const wrapper = mount(ActionButton, {
        localVue,
        router,
        propsData: propsData
      })

      const wrapperHtml = wrapper.html()
      const received = decodeHtml(wrapperHtml)

      const expectedLink = '<a href="/client/console?cmd=access&vm=test-resource-id" target="_blank">'
      const expectedButton = '<button disabled="disabled" type="button" class="ant-btn ant-btn-dashed ant-btn-circle" style="margin-right: 5px;">'

      expect(received).not.toContain(expectedLink)
      expect(received).not.toContain(expectedButton)
    })

    it('do not show button', () => {
      const wrapper = mount(ActionButton)

      const received = wrapper.html()
      const expected = '<i aria-label="icon: plus" class="anticon anticon-plus">'

      expect(received).not.toContain(expected)
    })

    it('show button not badge', () => {
      const propsData = {
        actions: [
          {
            label: 'label.action',
            api: 'testApiName',
            showBadge: false,
            icon: 'plus',
            dataView: false,
            listView: true
          }
        ],
        dataView: false,
        listView: true
      }
      const messages = { en: { 'label.action': 'action-en' } }
      const state = {
        user: {
          apis: {
            testApiName: {}
          }
        }
      }
      const i18n = mockI18n.mock('en', messages)
      const store = mockStore.mock(state)

      const wrapper = mount(ActionButton, {
        localVue,
        store,
        i18n,
        propsData: propsData
      })

      const received = wrapper.html()
      const expected = '<i aria-label="icon: plus" class="anticon anticon-plus">'

      expect(received).toContain(expected)
    })

    it('show button badge', (done) => {
      const propsData = {
        actions: [
          {
            label: 'label.action',
            api: 'testApiName',
            showBadge: true,
            icon: 'plus',
            dataView: true
          }
        ],
        dataView: true
      }
      const state = {
        user: {
          apis: {
            testApiName: {}
          }
        }
      }
      const messages = { en: { 'label.action': 'action-en' } }
      const router = mockRouter.mock()
      const store = mockStore.mock(state)
      const i18n = mockI18n.mock('en', messages)
      const dataMock = {
        testapinameresponse: {
          count: 0,
          testapiname: []
        }
      }
      mockAxios.mockImplementation(() => Promise.resolve(dataMock))

      beforeEach(() => {
        jest.resetModules()
        jest.clearAllMocks()
      })

      const wrapper = mount(ActionButton, {
        localVue,
        router,
        store,
        i18n,
        propsData: propsData
      })

      wrapper.vm.$nextTick(() => {
        const wrapperHtml = wrapper.html()
        const received = decodeHtml(wrapperHtml)

        expect(received).toContain('<span class="button-action-badge ant-badge">')
        done()
      })
    })
  })

  describe('Method', () => {
    beforeAll(() => {
      jest.resetModules()
      jest.clearAllMocks()
    })

    afterAll(() => {
      jest.resetModules()
      jest.clearAllMocks()
    })

    describe('handleShowBadge()', () => {
      it('called and the api returned is not empty', (done) => {
        const propsData = {
          actions: [
            {
              label: 'label.action',
              api: 'testApiName',
              showBadge: true,
              icon: 'plus',
              dataView: true
            }
          ],
          dataView: true
        }
        const state = {
          user: {
            apis: {
              testApiName: {}
            }
          }
        }
        const messages = { en: { 'label.action': 'action-en' } }
        const router = mockRouter.mock()
        const store = mockStore.mock(state)
        const i18n = mockI18n.mock('en', messages)
        const dataMock = {
          testapinameresponse: {
            count: 2
          }
        }
        mockAxios.mockResolvedValue(dataMock)

        const wrapper = mount(ActionButton, {
          localVue,
          router,
          store,
          i18n,
          propsData: propsData
        })

        setTimeout(() => {
          const postData = new URLSearchParams()

          expect(mockAxios).toHaveBeenCalledTimes(1)
          expect(mockAxios).toHaveBeenCalledWith({
            data: postData,
            method: 'GET',
            params: {
              command: 'testApiName',
              response: 'json'
            },
            url: '/'
          })
          expect(wrapper.vm.actionBadge).not.toEqual({})

          done()
        })
      })

      it('called and the api returned is empty', (done) => {
        const propsData = {
          actions: [
            {
              label: 'label.action',
              api: 'testApiName',
              showBadge: true,
              icon: 'plus',
              dataView: true
            }
          ],
          dataView: true
        }
        const state = {
          user: {
            apis: {
              testApiName: {}
            }
          }
        }
        const messages = { en: { 'label.action': 'action-en' } }
        const router = mockRouter.mock()
        const store = mockStore.mock(state)
        const i18n = mockI18n.mock('en', messages)
        const dataMock = {
          data: []
        }

        mockAxios.mockResolvedValue(dataMock)

        const wrapper = mount(ActionButton, {
          localVue,
          router,
          store,
          i18n,
          propsData: propsData
        })

        setTimeout(() => {
          const postData = new URLSearchParams()

          expect(mockAxios).toHaveBeenCalledTimes(1)
          expect(mockAxios).toHaveBeenCalledWith({
            data: postData,
            method: 'GET',
            params: {
              command: 'testApiName',
              response: 'json'
            },
            url: '/'
          })

          const expected = {
            testApiName: {
              badgeNum: 0
            }
          }

          expect(wrapper.vm.actionBadge).toEqual(expected)

          done()
        })
      })

      it('called and api throws exception', (done) => {
        const propsData = {
          actions: [
            {
              label: 'label.action',
              api: 'testApiName',
              showBadge: true,
              icon: 'plus',
              dataView: true
            }
          ],
          dataView: true
        }
        const state = {
          user: {
            apis: {
              testApiName: {}
            }
          }
        }
        const messages = { en: { 'label.action': 'action-en' } }
        const router = mockRouter.mock()
        const store = mockStore.mock(state)
        const i18n = mockI18n.mock('en', messages)
        const errorMessage = 'errMethodMessage'
        mockAxios.mockImplementationOnce(() => Promise.reject(errorMessage))

        const wrapper = mount(ActionButton, {
          localVue,
          router,
          store,
          i18n,
          propsData: propsData
        })

        setTimeout(() => {
          const postData = new URLSearchParams()

          expect(mockAxios).toHaveBeenCalledTimes(1)
          expect(mockAxios).toHaveBeenCalledWith({
            data: postData,
            method: 'GET',
            params: {
              command: 'testApiName',
              response: 'json'
            },
            url: '/'
          })
          expect(wrapper.vm.actionBadge).toEqual({})

          done()
        })
      })
    })

    describe('execAction()', () => {
      it('called and emitted events are executed', async () => {
        const propsData = {
          actions: [
            {
              icon: 'plus',
              label: 'label.action',
              api: 'testApiName',
              showBadge: false,
              dataView: true
            }
          ],
          dataView: true,
          resource: {
            id: 'test-resource-id'
          }
        }
        const state = {
          user: {
            apis: {
              testApiName: {}
            }
          }
        }
        const messages = { en: { 'label.action': 'action-en' } }
        const router = mockRouter.mock()
        const store = mockStore.mock(state)
        const i18n = mockI18n.mock('en', messages)

        const wrapper = mount(ActionButton, {
          localVue,
          router,
          store,
          i18n,
          propsData: propsData
        })

        await wrapper.find('button').trigger('click')
        await wrapper.vm.$nextTick()

        const expected = {
          icon: 'plus',
          label: 'label.action',
          api: 'testApiName',
          showBadge: false,
          dataView: true,
          resource: {
            id: 'test-resource-id'
          }
        }

        expect(wrapper.emitted()['exec-action'][0]).toEqual([expected])
      })
    })
  })

  describe('Watcher', () => {
    beforeAll(() => {
      jest.resetModules()
      jest.clearAllMocks()
    })

    afterAll(() => {
      jest.resetModules()
      jest.clearAllMocks()
    })

    describe('handleShowBadge()', () => {
      it('not called with empty resource', (done) => {
        const props = {}
        const handleShowBadge = jest.fn(() => {})

        const wrapper = mount(ActionButton, {
          localVue,
          propsData: props,
          methods: {
            handleShowBadge
          }
        })

        wrapper.setProps({ resource: null })

        wrapper.vm.$nextTick(() => {
          expect(handleShowBadge).toHaveBeenCalledTimes(1)

          done()
        })
      })

      it('not called with resource containing id null', (done) => {
        const props = {}
        const handleShowBadge = jest.fn(() => {})

        const wrapper = mount(ActionButton, {
          localVue,
          propsData: props,
          methods: {
            handleShowBadge
          }
        })

        wrapper.setProps({ resource: { id: null } })

        wrapper.vm.$nextTick(() => {
          expect(handleShowBadge).toHaveBeenCalledTimes(1)
          done()
        })
      })

      it('not called with changed resource data', (done) => {
        const props = {
          resource: {
            id: 'test-resource-id-1'
          }
        }
        const mockMethods = {
          handleShowBadge: jest.fn()
        }

        const wrapper = mount(ActionButton, {
          localVue,
          methods: mockMethods,
          propsData: props
        })

        wrapper.setProps({
          resource: {
            id: 'test-resource-id-2'
          }
        })

        wrapper.vm.$nextTick(() => {
          expect(mockMethods.handleShowBadge).toHaveBeenCalledTimes(2)

          done()
        })
      })
    })
  })
})
