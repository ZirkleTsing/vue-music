import * as types from './mutations.types.js'

const mutations = {
  [types.SET_SINGER](state, payload) {
    state.singer = payload
  }
}

export default mutations