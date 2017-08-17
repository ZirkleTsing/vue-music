const getters = {

  singer: state => state.singer,

  playing: state => state.playing,

  fullScreen: state => state.fullScreen,

  list: state => state.list,

  mode: state => state.mode,

  sequenceList: state => state.sequenceList,

  currentIndex: state => state.currentIndex,

  playedSong: state => state.list[state.currentIndex] || {}  // v-show {}.xxx = undefined 不会报错
}

export default getters