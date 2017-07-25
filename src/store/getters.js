const getters = {

  singer: state => state.singer,

  playing: state => state.playing,

  fullScreen: state => state.fullScreen,

  list: state => state.list,

  sequenceList: state => state.sequenceList,

  currentIndex: state => state.currentIndex,

  playedSong: state => state.list[state.currentIndex]
}

export default getters