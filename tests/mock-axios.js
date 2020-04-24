const mockAxios = {
  // eslint-disable-next-line no-undef
  get: jest.fn().mockImplementation(() => {
    // eslint-disable-next-line promise/param-names
    return new Promise((res, rej) => {
      mockAxios._resolve = res
      mockAxios._reject = rej
    })
  }),
  mockSuccess (resp) {
    this._resolve(resp)
  },
  mockError (resp) {
    this._reject(resp)
  },
  _resolve: null,
  _reject: null
}

export default mockAxios
