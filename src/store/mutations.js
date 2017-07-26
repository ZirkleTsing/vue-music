import * as types from './mutations.types.js'

const mutations = {
  [types.SET_SINGER](state, payload) {
    state.singer = payload
  },
  [types.SET_PLAYING](state, flag) {
    state.playing = flag
  },
  [types.SET_FULLSCREEN](state, flag) {
    state.fullScreen = flag
  },
  [types.SET_LIST](state, list) {
    state.list = list
  },
  [types.SET_SEQUENCELIST](state, list) {
    state.sequenceList = list
  },
  [types.SET_CURRENTINDEX] (state, index) {
    state.currentIndex = index
  }
}

export default mutations