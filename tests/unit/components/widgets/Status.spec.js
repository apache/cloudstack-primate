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
import Status from '@/components/widgets/Status'

describe('Widgets > Status.vue', () => {
  describe('method', () => {
    describe('getText()', () => {
      it('called and the value returned is not null', () => {
        const propsData = {
          text: 'Running',
          displayText: true
        }

        const wrapper = mount(Status, {
          propsData: propsData
        })

        const received = wrapper.html()
        const expected = '<span class="ant-badge-status-text">Running</span>'

        expect(received).toContain(expected)
      })

      it('called and the value returned is null', () => {
        const propsData = {
          text: 'Running',
          displayText: false
        }

        const wrapper = mount(Status, {
          propsData: propsData
        })

        const received = wrapper.html()
        const expected = '<span class="ant-badge-status-text"></span>'

        expect(received).toContain(expected)
      })
    })

    describe('getBadgeStatus()', () => {
      it('called and the value returned is default status', () => {
        const propsData = {
          text: 'Another',
          displayText: true
        }

        const wrapper = mount(Status, {
          propsData: propsData
        })

        const received = wrapper.html()
        const expected = '<span class="ant-badge-status-dot ant-badge-status-default"></span>'

        expect(received).toContain(expected)
      })

      it('called and the value returned is success status', () => {
        const propsData = {
          text: 'Ready',
          displayText: true
        }

        const wrapper = mount(Status, {
          propsData: propsData
        })

        const received = wrapper.html()
        const expected = '<span class="ant-badge-status-dot ant-badge-status-success"></span>'

        expect(received).toContain(expected)
      })

      it('called and the value returned is error status', () => {
        const propsData = {
          text: 'Disabled',
          displayText: true
        }

        const wrapper = mount(Status, {
          propsData: propsData
        })

        const received = wrapper.html()
        const expected = '<span class="ant-badge-status-dot ant-badge-status-error"></span>'

        expect(received).toContain(expected)
      })

      it('called and the value returned is processing status', () => {
        const propsData = {
          text: 'Migrating',
          displayText: true
        }

        const wrapper = mount(Status, {
          propsData: propsData
        })

        const received = wrapper.html()
        const expected = '<span class="ant-badge-status-dot ant-badge-status-processing"></span>'

        expect(received).toContain(expected)
      })

      it('called and the value returned is warning status', () => {
        const propsData = {
          text: 'Alert',
          displayText: true
        }

        const wrapper = mount(Status, {
          propsData: propsData
        })

        const received = wrapper.html()
        const expected = '<span class="ant-badge-status-dot ant-badge-status-warning"></span>'

        expect(received).toContain(expected)
      })
    })
  })
})
