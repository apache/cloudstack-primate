import Vuex from 'vuex'

const mockStore = {
  state: {
    user: {
      apis: {}
    }
  },
  mock: (state) => {
    if (state && Object.keys(state).length > 0) {
      mockStore.state = { ...state }
    }
    return new Vuex.Store({
      getters: {
        apis: () => mockStore.state.user.apis
      }
    })
  }
}

export default mockStore
