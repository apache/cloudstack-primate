import { mount } from '@vue/test-utils'
import Status from '@/components/widgets/Status'

describe('Widgets > Status.vue', () => {
  describe('method', () => {
    describe('getText()', () => {
      it('should have a return value', () => {
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

      it('should have a return empty', () => {
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
      it('should have a return default status', () => {
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

      it('should have a return success status', () => {
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

      it('should have a return error status', () => {
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

      it('should have a return processing status', () => {
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

      it('should have a return warning status', () => {
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
