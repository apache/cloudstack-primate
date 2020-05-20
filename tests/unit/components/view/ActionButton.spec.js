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

describe('Components > View > Status.vue', () => {
  const routes = [
    {
      name: 'testRouter1',
      path: '/test-router-1',
      meta: {
        name: 'systemvm'
      }
    },
    {
      name: 'testRouter2',
      path: '/test-router-2',
      meta: {
        name: 'test-name'
      }
    }
  ]

  const state = {
    user: {
      apis: {
        'test-api-case-1': {},
        'test-api-case-2': {},
        'test-api-case-3': {},
        'test-api-case-4': {},
        'test-api-case-5': {},
        'test-api-case-6': {}
      }
    }
  }
  const messages = {
    en: { 'label.action': 'action-en' },
    de: { 'label.action': 'action-de' }
  }
  const router = mockRouter.mock(routes)
  const store = mockStore.mock(state)
  const i18n = mockI18n.mock('en', messages)

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Template', () => {
    /**
     * @name: testTemplateCase1
     * @description: Console component is visible
     * @condition: propData: { resource = { id: 'test-resource-id', state: 'Stopped' }, dataView = true }, testRouter1
     * @expected: contain:
     *  - <a href="/client/console?cmd=access&vm=test-resource-id" target="_blank">
     *  - <button disabled="disabled" type="button" class="ant-btn ant-btn-dashed ant-btn-circle" style="margin-right: 5px;">
     */
    it('testTemplateCase1', () => {
      const expectedLink = '<a href="/client/console?cmd=access&vm=test-resource-id" target="_blank">'
      const expectedButton = '<button disabled="disabled" type="button" class="ant-btn ant-btn-dashed ant-btn-circle" style="margin-right: 5px;">'
      const propsData = {
        dataView: true,
        resource: {
          id: 'test-resource-id',
          state: 'Stopped'
        }
      }

      const wrapper = mount(ActionButton, {
        localVue,
        router,
        store,
        i18n,
        propsData: propsData
      })

      router.push({ name: 'testRouter1' })

      wrapper.vm.$nextTick(() => {
        const wrapperHtml = wrapper.html()
        const received = decodeHtml(wrapperHtml)

        expect(received).toContain(expectedLink)
        expect(received).toContain(expectedButton)
      })
    })

    /**
     * @name: testTemplateCase2
     * @description: Console component is invisible
     * @condition: propData: { resource = { id: 'test-resource-id', state: 'Stopped' }, dataView = true }, testRouter2
     * @expected: not contain:
     *  - <a href="/client/console?cmd=access&vm=test-resource-id" target="_blank">
     *  - <button disabled="disabled" type="button" class="ant-btn ant-btn-dashed ant-btn-circle" style="margin-right: 5px;">
     */
    it('testTemplateCase2', () => {
      const expectedLink = '<a href="/client/console?cmd=access&vm=test-resource-id" target="_blank">'
      const expectedButton = '<button disabled="disabled" type="button" class="ant-btn ant-btn-dashed ant-btn-circle" style="margin-right: 5px;">'
      const propsData = {
        dataView: true,
        resource: {
          id: 'test-resource-id',
          state: 'Stopped'
        }
      }
      const wrapper = mount(ActionButton, {
        localVue,
        router,
        i18n,
        store,
        propsData: propsData
      })

      router.push({ name: 'testRouter2' })

      wrapper.vm.$nextTick(() => {
        const wrapperHtml = wrapper.html()
        const received = decodeHtml(wrapperHtml)

        expect(received).not.toContain(expectedLink)
        expect(received).not.toContain(expectedButton)
      })
    })

    /**
     * @name: testTemplateCase3
     * @description: Show button action
     * @condition: null
     * @expected: not contain: <i aria-label="icon: plus" class="anticon anticon-plus">
     */
    it('testTemplateCase3', () => {
      const expected = '<i aria-label="icon: plus" class="anticon anticon-plus">'
      const wrapper = mount(ActionButton, {
        localVue,
        router,
        i18n,
        store,
        propsData: {}
      })

      wrapper.vm.$nextTick(() => {
        const received = wrapper.html()

        expect(received).not.toContain(expected)
      })
    })

    /**
     * @name: testTemplateCase4
     * @description: Show normal button action
     * @condition: actions: [
        {
          label: 'label.action',
          api: 'test-api-case-1',
          showBadge: false,
          icon: 'plus',
          dataView: false,
          listView: true
        }
      ]
     * @expected: contain: <i aria-label="icon: plus" class="anticon anticon-plus">
     */
    it('testTemplateCase4', () => {
      const expected = '<i aria-label="icon: plus" class="anticon anticon-plus">'
      const propsData = {
        actions: [
          {
            label: 'label.action',
            api: 'test-api-case-1',
            showBadge: false,
            icon: 'plus',
            dataView: false,
            listView: true
          }
        ],
        dataView: false,
        listView: true
      }

      const wrapper = mount(ActionButton, {
        localVue,
        router,
        store,
        i18n,
        propsData: propsData
      })

      wrapper.vm.$nextTick(() => {
        const received = wrapper.html()

        expect(received).toContain(expected)
      })
    })

    /**
     * @name: testTemplateCase5
     * @description: Show badge button action
     * @condition: actions: [
        {
          label: 'label.action',
          api: 'test-api-case-2',
          showBadge: true,
          icon: 'plus',
          dataView: true
        }
     ]
     * @expected: contain: <span class="button-action-badge ant-badge">
     */
    it('testTemplateCase5', (done) => {
      const expected = '<span class="button-action-badge ant-badge">'
      const propsData = {
        actions: [
          {
            label: 'label.action',
            api: 'test-api-case-2',
            showBadge: true,
            icon: 'plus',
            dataView: true
          }
        ],
        dataView: true
      }
      const dataMock = {
        testapinameresponse: {
          count: 0,
          testapiname: []
        }
      }

      mockAxios.mockImplementation(() => Promise.resolve(dataMock))

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

        expect(received).toContain(expected)

        done()
      })
    })
  })

  describe('Method', () => {
    describe('handleShowBadge()', () => {
      /**
       * @name: testMethodHandleShowBadgeCase1
       * @description: handleShowBadge() is called and the api returned is not empty
       * @condition: actions: [
          {
            label: 'label.action',
            api: 'test-api-case-2',
            showBadge: true,
            icon: 'plus',
            dataView: true
          }
       ]
       * @expected:
       *  1. axios api is called
       *  2. axios api called with match url, params
       *  3. wrapper.actionBadge = { 'test-api-case-3': { badgeNum: 2 } }
       */
      it('testMethodHandleShowBadgeCase1', (done) => {
        const postData = new URLSearchParams()
        const expected = { 'test-api-case-3': { badgeNum: 2 } }
        const dataMock = { testapinameresponse: { count: 2 } }
        const propsData = {
          actions: [
            {
              label: 'label.action',
              api: 'test-api-case-3',
              showBadge: true,
              icon: 'plus',
              dataView: true
            }
          ],
          dataView: true
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
          expect(mockAxios).toHaveBeenCalledTimes(1)
          expect(mockAxios).toHaveBeenCalledWith({
            data: postData,
            method: 'GET',
            params: {
              command: 'test-api-case-3',
              response: 'json'
            },
            url: '/'
          })
          expect(wrapper.vm.actionBadge).toEqual(expected)

          done()
        })
      })

      /**
       * @name: testMethodHandleShowBadgeCase2
       * @description: handleShowBadge() is called and the api returned is empty
       * @condition: actions: [
         {
           label: 'label.action',
           api: 'test-api-case-4',
           showBadge: true,
           icon: 'plus',
           dataView: true
         }
       ]
       * @expected:
       *  1. axios api is called
       *  2. axios api called with match url, params
       *  3. wrapper.actionBadge = { 'test-api-case-4': { badgeNum: 0 } }
       */
      it('testMethodHandleShowBadgeCase2', (done) => {
        const postData = new URLSearchParams()
        const expected = { 'test-api-case-4': { badgeNum: 0 } }
        const dataMock = { data: [] }
        const propsData = {
          actions: [
            {
              label: 'label.action',
              api: 'test-api-case-4',
              showBadge: true,
              icon: 'plus',
              dataView: true
            }
          ],
          dataView: true
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
          expect(mockAxios).toHaveBeenCalledTimes(1)
          expect(mockAxios).toHaveBeenCalledWith({
            data: postData,
            method: 'GET',
            params: {
              command: 'test-api-case-4',
              response: 'json'
            },
            url: '/'
          })
          expect(wrapper.vm.actionBadge).toEqual(expected)

          done()
        })
      })

      /**
       * @name: testMethodHandleShowBadgeCase3
       * @description: handleShowBadge() is called and api throws exception
       * @condition: actions: [
         {
           icon: 'plus',
           label: 'label.action',
           api: 'test-api-case-6',
           showBadge: false,
           dataView: true
         }
       ]
       * @expected:
       *  1. axios api is called
       *  2. axios api called with match url, params
       *  3. wrapper.actionBadge = {}
       */
      it('testMethodHandleShowBadgeCase3', (done) => {
        const postData = new URLSearchParams()
        const propsData = {
          actions: [
            {
              label: 'label.action',
              api: 'test-api-case-5',
              showBadge: true,
              icon: 'plus',
              dataView: true
            }
          ],
          dataView: true
        }
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
          expect(mockAxios).toHaveBeenCalledTimes(1)
          expect(mockAxios).toHaveBeenCalledWith({
            data: postData,
            method: 'GET',
            params: {
              command: 'test-api-case-5',
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
      /**
       * @name: testMethodExecActionCase1
       * @description: execAction() is called and emitted events are executed
       * @condition: actions: [
         {
           icon: 'plus',
           label: 'label.action',
           api: 'test-api-case-6',
           showBadge: false,
           dataView: true
         }
       ]
       * @expected: emitted exec-action = [{
          icon: 'plus',
          label: 'label.action',
          api: 'test-api-case-6',
          showBadge: false,
          dataView: true,
          resource: {
            id: 'test-resource-id'
          }
        }]
       */
      it('testMethodHExecActionCase1', async () => {
        const expected = {
          icon: 'plus',
          label: 'label.action',
          api: 'test-api-case-6',
          showBadge: false,
          dataView: true,
          resource: {
            id: 'test-resource-id'
          }
        }
        const propsData = {
          actions: [
            {
              icon: 'plus',
              label: 'label.action',
              api: 'test-api-case-6',
              showBadge: false,
              dataView: true
            }
          ],
          dataView: true,
          resource: {
            id: 'test-resource-id'
          }
        }

        const wrapper = mount(ActionButton, {
          localVue,
          router,
          store,
          i18n,
          propsData: propsData
        })

        await wrapper.find('button').trigger('click')
        await wrapper.vm.$nextTick()

        expect(wrapper.emitted()['exec-action'][0]).toEqual([expected])
      })
    })
  })

  describe('Watcher', () => {
    describe('handleShowBadge()', () => {
      /**
       * @name: testWatcherResourceCase1
       * @description: watch resource > handleShowBadge() not called
       * @condition: actions: [{
         icon: 'plus',
         label: 'label.action',
         api: 'test-api-case-6',
         showBadge: false,
         dataView: true
       }]
       * @expected: handleShowBadge() not called
       */
      it('testWatcherResourceCase1', async () => {
        const wrapper = mount(ActionButton, {
          localVue,
          router,
          i18n,
          store,
          propsData: {
            resource: null
          }
        })
        const handleShowBadge = jest.spyOn(wrapper.vm, 'handleShowBadge')
        await wrapper.vm.$nextTick()
        expect(handleShowBadge).not.toBeCalled()
      })

      /**
       * @name: testWatcherResourceCase2
       * @description: watch resource > handleShowBadge() not called with resource containing id null
       * @condition: resource: { id: null }
       * @expected: handleShowBadge() not called
       */
      it('testWatcherResourceCase2', async () => {
        const wrapper = mount(ActionButton, {
          localVue,
          router,
          i18n,
          store,
          propsData: {
            resource: { id: null }
          }
        })

        const handleShowBadge = jest.spyOn(wrapper.vm, 'handleShowBadge')
        await wrapper.vm.$nextTick()
        expect(handleShowBadge).not.toBeCalled()
      })

      /**
       * @name: testWatcherResourceCase3
       * @description: watch resource > handleShowBadge() not called with changed resource data
       * @condition: resource: { id: 'test-resource-id-2' }
       * @expected: handleShowBadge() is called
       */
      it('testWatcherResourceCase3', async () => {
        const wrapper = mount(ActionButton, {
          localVue,
          router,
          i18n,
          store,
          propsData: {
            resource: {
              id: 'test-resource-id-1'
            }
          }
        })

        wrapper.setProps({
          resource: {
            id: 'test-resource-id-2'
          }
        })
        const handleShowBadge = jest.spyOn(wrapper.vm, 'handleShowBadge')
        await wrapper.vm.$nextTick()
        expect(handleShowBadge).toHaveBeenCalledTimes(1)
      })
    })
  })
})
