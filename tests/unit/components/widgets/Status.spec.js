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
import { localVue, mockRouter, mockI18n } from './../../../setup'
import Status from '@/components/widgets/Status'

let router
const messages = {
  en: {
    'state.running': 'Running',
    'state.migrating': 'Migrating',
    'state.stopped': 'Stopped',
    'state.starting': 'Starting',
    'state.stopping': 'Stopping',
    'state.suspended': 'Suspended',
    'state.pending': 'Pending',
    'state.expunging': 'Expunging',
    'state.error': 'Error',
    'message.publicip.state.allocated': 'Allocated',
    'message.publicip.state.created': 'Created',
    'message.vmsnapshot.state.active': 'Active',
    'message.vm.state.active': 'Active',
    'message.volume.state.active': 'Active',
    'message.guestnetwork.state.active': 'Active',
    'message.publicip.state.active': 'Active',
    Created: 'Created',
    Active: 'Active',
    Allocated: 'Allocated',
    Error: 'Error',
    Expunging: 'Expunging',
    Suspended: 'Suspended',
    Pending: 'Pending',
    Running: 'Running',
    Starting: 'Starting',
    Another: 'Another',
    Ready: 'Ready',
    Disabled: 'Disabled',
    Migrating: 'Migrating',
    Stopping: 'Stopping',
    Alert: 'Alert',
    Stopped: 'Stopped'
  }
}
const i18n = mockI18n.mock('en', messages)
const createRouter = (newRoute = []) => {
  let routes = []
  if (!newRoute || Object.keys(newRoute).length === 0) {
    return mockRouter.mock(routes)
  }

  routes = [...newRoute]

  return mockRouter.mock(routes)
}

describe('Components > Widgets > Status.vue', () => {
  describe('Methods', () => {
    describe('getText()', () => {
      it('getText() is called and the value returned is null', () => {
        const propsData = {
          text: 'Running',
          displayText: false
        }

        router = createRouter()

        const wrapper = mount(Status, {
          localVue,
          router,
          i18n,
          propsData: propsData
        })

        const received = wrapper.html()
        const expected = '<span class="ant-badge-status-text"></span>'

        expect(received).toContain(expected)
      })

      it('getText() is called with state equal Running', () => {
        const propsData = {
          text: 'Running',
          displayText: true
        }

        router = createRouter()

        const wrapper = mount(Status, {
          localVue,
          router,
          i18n,
          propsData: propsData
        })

        const received = wrapper.html()
        const expected = '<span class="ant-badge-status-text">Running</span>'

        expect(received).toContain(expected)
      })

      it('getText() is called with state equal Stopped', () => {
        const propsData = {
          text: 'Stopped',
          displayText: true
        }

        router = createRouter()

        const wrapper = mount(Status, {
          localVue,
          router,
          i18n,
          propsData: propsData
        })

        const received = wrapper.html()
        const expected = '<span class="ant-badge-status-text">Stopped</span>'

        expect(received).toContain(expected)
      })

      it('getText() is called with state equal Starting', () => {
        const propsData = {
          text: 'Starting',
          displayText: true
        }

        router = createRouter()

        const wrapper = mount(Status, {
          localVue,
          router,
          i18n,
          propsData: propsData
        })

        const received = wrapper.html()
        const expected = '<span class="ant-badge-status-text">Starting</span>'

        expect(received).toContain(expected)
      })

      it('getText() is called with state equal Stopping', () => {
        const propsData = {
          text: 'Stopping',
          displayText: true
        }

        router = createRouter()

        const wrapper = mount(Status, {
          localVue,
          router,
          i18n,
          propsData: propsData
        })

        const received = wrapper.html()
        const expected = '<span class="ant-badge-status-text">Stopping</span>'

        expect(received).toContain(expected)
      })

      it('getText() is called with state equal Suspended', () => {
        const propsData = {
          text: 'Suspended',
          displayText: true
        }

        router = createRouter()

        const wrapper = mount(Status, {
          localVue,
          router,
          i18n,
          propsData: propsData
        })

        const received = wrapper.html()
        const expected = '<span class="ant-badge-status-text">Suspended</span>'

        expect(received).toContain(expected)
      })

      it('getText() is called with state equal Pending', () => {
        const propsData = {
          text: 'Pending',
          displayText: true
        }

        router = createRouter()

        const wrapper = mount(Status, {
          localVue,
          router,
          i18n,
          propsData: propsData
        })

        const received = wrapper.html()
        const expected = '<span class="ant-badge-status-text">Pending</span>'

        expect(received).toContain(expected)
      })

      it('getText() is called with state equal Expunging', () => {
        const propsData = {
          text: 'Expunging',
          displayText: true
        }

        router = createRouter()

        const wrapper = mount(Status, {
          localVue,
          router,
          i18n,
          propsData: propsData
        })

        const received = wrapper.html()
        const expected = '<span class="ant-badge-status-text">Expunging</span>'

        expect(received).toContain(expected)
      })

      it('getText() is called with state equal Error', () => {
        const propsData = {
          text: 'Error',
          displayText: true
        }

        router = createRouter()

        const wrapper = mount(Status, {
          localVue,
          router,
          i18n,
          propsData: propsData
        })

        const received = wrapper.html()
        const expected = '<span class="ant-badge-status-text">Error</span>'

        expect(received).toContain(expected)
      })
    })

    describe('getBadgeStatus()', () => {
      it('getBadgeStatus() is called and the value returned is default status', () => {
        const propsData = {
          text: 'Another',
          displayText: true
        }

        router = createRouter()

        const wrapper = mount(Status, {
          localVue,
          router,
          i18n,
          propsData: propsData
        })

        const received = wrapper.html()
        const expected = '<span class="ant-badge-status-dot ant-badge-status-default"></span>'

        expect(received).toContain(expected)
      })

      it('getBadgeStatus() is called and the value returned is success status', () => {
        const propsData = {
          text: 'Active',
          displayText: true
        }

        router = createRouter()

        const wrapper = mount(Status, {
          localVue,
          router,
          i18n,
          propsData: propsData
        })

        const received = wrapper.html()
        const expected = '<span class="ant-badge-status-dot ant-badge-status-success"></span>'

        expect(received).toContain(expected)
      })

      it('getBadgeStatus() is called and the value returned is error status', () => {
        const propsData = {
          text: 'Disabled',
          displayText: true
        }

        router = createRouter()

        const wrapper = mount(Status, {
          localVue,
          router,
          i18n,
          propsData: propsData
        })

        const received = wrapper.html()
        const expected = '<span class="ant-badge-status-dot ant-badge-status-error"></span>'

        expect(received).toContain(expected)
      })

      it('getBadgeStatus() is called and the value returned is processing status', () => {
        const propsData = {
          text: 'Migrating',
          displayText: true
        }

        router = createRouter()

        const wrapper = mount(Status, {
          localVue,
          router,
          i18n,
          propsData: propsData
        })

        const received = wrapper.html()
        const expected = '<span class="ant-badge-status-dot ant-badge-status-processing"></span>'

        expect(received).toContain(expected)
      })

      it('getBadgeStatus() is called and the value returned is error status', () => {
        const propsData = {
          text: 'Alert',
          displayText: true
        }

        router = createRouter()

        const wrapper = mount(Status, {
          localVue,
          router,
          i18n,
          propsData: propsData
        })

        const received = wrapper.html()
        const expected = '<span class="ant-badge ant-badge-status ant-badge-not-a-wrapper" style="display: inline-flex;"><span class="ant-badge-status-dot ant-badge-status-error"></span><span class="ant-badge-status-text">Alert</span></span>'

        expect(received).toContain(expected)
      })

      it('getBadgeStatus() is called and the value returned is warning status with state equal Allocated', () => {
        const propsData = {
          text: 'Allocated',
          displayText: true
        }

        router = createRouter()

        const wrapper = mount(Status, {
          localVue,
          router,
          i18n,
          propsData: propsData
        })

        const received = wrapper.html()
        const expected = '<span class="ant-badge ant-badge-status ant-badge-not-a-wrapper" style="display: inline-flex;"><span class="ant-badge-status-dot ant-badge-status-warning"></span><span class="ant-badge-status-text">Allocated</span></span>'

        expect(received).toContain(expected)
      })

      it('getBadgeStatus() is called and the value returned is success status with state equal Allocated', () => {
        const propsData = {
          text: 'Allocated',
          displayText: true
        }

        router = createRouter([{
          name: 'testRouter1',
          path: '/publicip',
          meta: {
            icon: 'test-router-1'
          }
        }])
        router.push({ name: 'testRouter1' })

        const wrapper = mount(Status, {
          localVue,
          router,
          i18n,
          propsData: propsData
        })

        const received = wrapper.html()
        const expected = '<span class="ant-badge ant-badge-status ant-badge-not-a-wrapper" style="display: inline-flex;"><span class="ant-badge-status-dot ant-badge-status-success"></span><span class="ant-badge-status-text">Allocated</span></span>'

        expect(received).toContain(expected)
      })

      it('getBadgeStatus() is called and the value returned is warning status with state equal Created', () => {
        const propsData = {
          text: 'Created',
          displayText: true
        }

        router = createRouter()

        const wrapper = mount(Status, {
          localVue,
          router,
          i18n,
          propsData: propsData
        })

        const received = wrapper.html()
        const expected = '<span class="ant-badge ant-badge-status ant-badge-not-a-wrapper" style="display: inline-flex;"><span class="ant-badge-status-dot ant-badge-status-warning"></span><span class="ant-badge-status-text">Created</span></span>'

        expect(received).toContain(expected)
      })
    })

    describe('getTooltip()', () => {
      it('getTooltip() is called with `$route.path` equal `/vmsnapshot`', () => {
        const propsData = {
          text: 'Active',
          displayText: true
        }

        router = createRouter([{
          name: 'testRouter1',
          path: '/vmsnapshot',
          meta: {
            icon: 'test-router-1'
          }
        }])
        router.push({ name: 'testRouter1' })

        const wrapper = mount(Status, {
          localVue,
          router,
          i18n,
          propsData: propsData
        })

        const received = wrapper.html()
        const expected = '<span class="ant-badge ant-badge-status ant-badge-not-a-wrapper" style="display: inline-flex;"><span class="ant-badge-status-dot ant-badge-status-success"></span><span class="ant-badge-status-text">Active</span></span>'

        expect(received).toContain(expected)
      })

      it('getTooltip() is called with `$route.path` equal `/vm`', () => {
        const propsData = {
          text: 'Active',
          displayText: true
        }

        router = createRouter([{
          name: 'testRouter1',
          path: '/vm',
          meta: {
            icon: 'test-router-1'
          }
        }])
        router.push({ name: 'testRouter1' })

        const wrapper = mount(Status, {
          localVue,
          router,
          i18n,
          propsData: propsData
        })

        const received = wrapper.html()
        const expected = '<span class="ant-badge ant-badge-status ant-badge-not-a-wrapper" style="display: inline-flex;"><span class="ant-badge-status-dot ant-badge-status-success"></span><span class="ant-badge-status-text">Active</span></span>'

        expect(received).toContain(expected)
      })

      it('getTooltip() is called with `$route.path` equal `/volume`', () => {
        const propsData = {
          text: 'Active',
          displayText: true
        }

        router = createRouter([{
          name: 'testRouter1',
          path: '/volume',
          meta: {
            icon: 'test-router-1'
          }
        }])
        router.push({ name: 'testRouter1' })

        const wrapper = mount(Status, {
          localVue,
          router,
          i18n,
          propsData: propsData
        })

        const received = wrapper.html()
        const expected = '<span class="ant-badge ant-badge-status ant-badge-not-a-wrapper" style="display: inline-flex;"><span class="ant-badge-status-dot ant-badge-status-success"></span><span class="ant-badge-status-text">Active</span></span>'

        expect(received).toContain(expected)
      })

      it('getTooltip() is called with `$route.path` equal `/guestnetwork`', () => {
        const propsData = {
          text: 'Active',
          displayText: true
        }

        router = createRouter([{
          name: 'testRouter1',
          path: '/guestnetwork',
          meta: {
            icon: 'test-router-1'
          }
        }])
        router.push({ name: 'testRouter1' })

        const wrapper = mount(Status, {
          localVue,
          router,
          i18n,
          propsData: propsData
        })

        const received = wrapper.html()
        const expected = '<span class="ant-badge ant-badge-status ant-badge-not-a-wrapper" style="display: inline-flex;"><span class="ant-badge-status-dot ant-badge-status-success"></span><span class="ant-badge-status-text">Active</span></span>'

        expect(received).toContain(expected)
      })

      it('getTooltip() is called with `$route.path` equal `/publicip`', () => {
        const propsData = {
          text: 'Active',
          displayText: true
        }

        router = createRouter([{
          name: 'testRouter1',
          path: '/publicip',
          meta: {
            icon: 'test-router-1'
          }
        }])
        router.push({ name: 'testRouter1' })

        const wrapper = mount(Status, {
          localVue,
          router,
          i18n,
          propsData: propsData
        })

        const received = wrapper.html()
        const expected = '<span class="ant-badge ant-badge-status ant-badge-not-a-wrapper" style="display: inline-flex;"><span class="ant-badge-status-dot ant-badge-status-success"></span><span class="ant-badge-status-text">Active</span></span>'

        expect(received).toContain(expected)
      })
    })
  })
})
