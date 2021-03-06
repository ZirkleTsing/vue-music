import {MODE} from 'common/js/config'
const state = {
  singer: null,
  // 是否处于播放状态
  playing: false,
  // 音乐盒是否全屏
  fullScreen: false,
  // 播放列表
  list: [],
  // 有序播放列表
  sequenceList: [],
  // 当前播放中歌曲序号
  currentIndex: -1,
  // 当前播放歌曲对象
  mode: MODE.SEQUENCE
  // 歌曲循环模式，默认顺序播放
}

export default state