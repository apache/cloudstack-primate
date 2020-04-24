import { mount } from '@vue/test-utils'
import Status from '@/components/widgets/Status'

describe('Status', () => {
  it('test getText method with return value', () => {
    const propsData = {
      text: 'Running',
      displayText: true
    }

    const wrapper = mount(Status, {
      propsData: propsData
    })

    const received = wrapper.html()
    expect(received).toContain('<span class="ant-badge-status-text">Running</span>')
  })

  it('test getText method with return empty value', () => {
    const propsData = {
      text: 'Running',
      displayText: false
    }

    const wrapper = mount(Status, {
      propsData: propsData
    })

    const received = wrapper.html()
    expect(received).toContain('<span class="ant-badge-status-text"></span>')
  })

  it('test getBadgeStatus method with return default value', () => {
    const propsData = {
      text: 'Another',
      displayText: true
    }

    const wrapper = mount(Status, {
      propsData: propsData
    })

    const received = wrapper.html()
    expect(received).toContain('<span class="ant-badge-status-dot ant-badge-status-default"></span>')
  })

  it('test getBadgeStatus method with return success value', () => {
    const propsData = {
      text: 'Ready',
      displayText: true
    }

    const wrapper = mount(Status, {
      propsData: propsData
    })

    const received = wrapper.html()
    expect(received).toContain('<span class="ant-badge-status-dot ant-badge-status-success"></span>')
  })

  it('test getBadgeStatus method with return error value', () => {
    const propsData = {
      text: 'Disabled',
      displayText: true
    }

    const wrapper = mount(Status, {
      propsData: propsData
    })

    const received = wrapper.html()
    expect(received).toContain('<span class="ant-badge-status-dot ant-badge-status-error"></span>')
  })

  it('test getBadgeStatus method with return processing value', () => {
    const propsData = {
      text: 'Migrating',
      displayText: true
    }

    const wrapper = mount(Status, {
      propsData: propsData
    })

    const received = wrapper.html()
    expect(received).toContain('<span class="ant-badge-status-dot ant-badge-status-processing"></span>')
  })

  it('test getBadgeStatus method with return warning value', () => {
    const propsData = {
      text: 'Alert',
      displayText: true
    }

    const wrapper = mount(Status, {
      propsData: propsData
    })

    const received = wrapper.html()
    expect(received).toContain('<span class="ant-badge-status-dot ant-badge-status-warning"></span>')
  })
})
