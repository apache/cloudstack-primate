import { shallowMount } from '@vue/test-utils'
import Login from '@/views/auth/Login'

describe('Login', () => {
	it('sets the correct default data', () => {
		expect(typeof Login.data).toBe('function')

		const defaultData = Login.data()
		console.log(defaultData)
	})
})