import * as types from './mutations.types'

const actions = {
  sequencePlay ({commit, state}, {list, currentIndex}) {
    // 打开音乐盒: 记录当前有序列表->全屏播放->当前歌曲的index->设置播放状态
    commit(types.SET_FULLSCREEN, true)
    commit(types.SET_LIST, list)
    commit(types.SET_SEQUENCELIST, list)
    commit(types.SET_CURRENTINDEX, currentIndex)
    commit(types.SET_PLAYING, true)
  },
  changeToMiniBox ({commit, state}) {
    // 变换mini音乐盒: 改变fullScreen
    commit(types.SET_FULLSCREEN, false)
  },
  changeToNormalBox ({commit, state}) {
    // 变换normal音乐盒: 改变fullScreen
    commit(types.SET_FULLSCREEN, true)
  }
}

export default actions