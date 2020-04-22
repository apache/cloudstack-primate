import Vue from 'vue'
import { mount } from '@vue/test-utils'
import { ATooltip } from 'ant-design-vue'
import Status from '@/components/widgets/Status'

describe('AutogenView', () => {
  // const $route = {
  //   path: '/account',
  //   fullPath: '/account',
  //   matched: []
  // }
  // const wrapper = mount(AutogenView, {
  //   mocks: {
  //     $route
  //   }
  // })



  it('renders the correct markup', () => {
    const propsData = {
      text: 'Running',
      displayText: true
    }

    const wrapper = mount(Status, {
      propsData: propsData
    })

    const received = wrapper.html()
    expect(received).toContain('<span class="ant-badge-status-dot ant-badge-status-success"></span>')
    expect(received).toContain('<span class="ant-badge-status-text">Running</span>')
  })
})
