<template>
  <div class="musicbox-wrapper" v-show="list.length > 0">

    <transition name="normal"
                @enter="enter"
                @after-enter="afterEnter"
                @leave="leave"
                @after-leave="afterLeave"
    >
      <div class="normal-player" v-show="fullScreen">
        <div class="background">
          <img width="100%" height="100%" :src="playedSong.image">
        </div>
        <div class="top">
          <div class="mini-icon" @click="changeToMiniBox">
            <i class="icon-back"></i>
          </div>
          <div class="title" v-html="playedSong.name"></div>
          <div class="subtitle" v-html="playedSong.singer"></div>
        </div>

        <div class="middle">
          <div class="middle-l">
            <div ref="cdWrapper" class="cd-wrapper">
              <div class="cd" :class="rotateState">
                <img class="image" :src="playedSong.image"> 
              </div>
            </div>
          </div>
        </div>

        <div class="bottom">
          <div class="progress-wrapper">
            <span class="time time-l">{{_format(currentTime)}}</span>
            <progress-bar :percent="percent" class="progress-bar-wrapper" ref="bar"></progress-bar>
            <span class="time time-r">{{_format(totalTime)}}</span>
          </div>
          <div class="operators">
            <div class="icon i-left" @click="changeMode">
              <i :class="modeIcon"></i>
            </div>
            <div @click="prev" class="icon i-left">
              <i class="icon-prev" :class="readyState"></i>
            </div>
            <div @click="togglePlay" class="icon i-center">
              <i :class="[playIcon,readyState]"></i>
            </div>
            <div @click="next" class="icon i-right">
              <i class="icon-next" :class="readyState"></i>
            </div>
            <div class="icon i-right">
              <i class="icon-not-favorite"></i>
            </div>
          </div>
        </div>
      </div>
    </transition>

    <transition name="mini">
      <div class="mini-player" v-show="!fullScreen" @click="changeToNormalBox">
        <div class="cd-wrapper">
          <div class="cd" :class="rotateState">
            <img class="image" :src="playedSong.image">
          </div>
        </div>
        <div class="desc">
          <div class="title" v-html="playedSong.name"></div>
          <div class="subtitle" v-html="playedSong.singer"></div>
        </div>
        <div @click.stop="togglePlay" class="control">
          <i class="icon-mini" :class="playMiniIcon"></i>
        </div>
        <div class="control">
          <i class="icon-mini icon-playlist"></i>
        </div>
      </div>
    </transition>

    <audio ref="audio" 
           :src="playedSong.url"
           @canplay="ready"
           @error="error"
           @timeupdate="timeUpdate"
    ></audio>
    <!--duration 返回当前音频/视频的长度（以秒计）  -->
    <!--currentTime 设置或返回音频/视频中的当前播放位置（以秒计） -->
  </div>
</template>

<script>
  import {mapGetters, mapActions, mapMutations} from 'vuex'
  import {MODE} from 'common/js/config'
  import {shuffle} from 'common/js/utils'
  import animations from 'create-keyframe-animation'
  import ProgressBar from 'base/progress-bar/progress-bar'
  export default {
    data () {
      return {
        audioReady: false,
        currentTime: 0,
        totalTime: 0,
        percent: 0.6
      }
    },
    // mounted() {
    //  display:none 此刻浏览器未'渲染',所以取不到值
    //   console.log('mounted', this.$refs.bar.$el.clientWidth)
    // },
    computed: {
      ...mapGetters([
        'list',
        'sequenceList',
        'fullScreen',
        'currentIndex',
        'singer',
        'playedSong',
        'playing',
        'mode'
      ]),
      playIcon () {
        return this.playing ? 'icon-pause' : 'icon-play'
      },
      playMiniIcon () {
        return this.playing ? 'icon-pause-mini' : 'icon-play-mini'
      },
      modeIcon () {
        return this.mode === MODE.SEQUENCE ? 'icon-sequence' : this.mode === MODE.LOOP ? 'icon-loop' : 'icon-random'
      },
      rotateState () {
        return this.playing ? 'rotating' : 'rotating pause'
      },
      readyState () {
        return this.audioReady ? '' : 'pending'
      }
    },
    watch: {
      // 切换歌曲时触发watcher,等待audio就绪时,根据playing状态,决定是否播放音乐
      playedSong (newSong) {
        console.log('change')
        // 更totalTime
        this.totalTime = newSong.duration
        let audio = this.$refs.audio
        this.$nextTick(() => {
          if (this.playing) {
            audio.play()
          } else {
            audio.pause()
          }
        })
      },
      playing (newPlayState) {
        let audio = this.$refs.audio
        this.$nextTick(() => {
          if (newPlayState) {
            audio.play()
          } else {
            audio.pause()
          }
        })
      },
      // 笔记: 当一个dom display为none时,是取不到clientWidth的,只有当展示出来以后才能取到真实值
      // fullScreen为true时，变更后下一个tick可以取到值
      fullScreen (current) {
        console.log('fullScreen', this.$refs.bar.$el.clientWidth)
        console.log(current)
        this.$nextTick(() => {
          console.log('fullScreen', this.$refs.bar.$el.clientWidth)
          console.log('nextTick', current)
        })
      }
    },
    methods: {
      enter (el, done) {
        const {x, y, scale} = this._getAnimationPos()
        let animation = {
          '0%': {
            transform: `translate3d(${-x}px, ${y}px, 0) scale(${scale})`
          },
          '60%': {
            transform: `translate3d(0,0,0) scale(1.1)`
          },
          '100%': {
            transform: `translate3d(0,0,0) scale(1)`
          }
        }

        animations.registerAnimation({
          name: 'show-normal-box',
          animation,
          presets: {
            duration: 400,
            easing: 'linear'
          }
        })
        animations.runAnimation(this.$refs.cdWrapper, 'show-normal-box', done)
      },
      afterEnter (el) {
        animations.unregisterAnimation('show-normal-box')
        this.$refs.cdWrapper.style.animation = ''
      },
      leave (el, done) {
        const {x, y, scale} = this._getAnimationPos()
        let animation = {
          '0%': {
            transform: `translate3d(0,0,0) scale(1)`
          },
          '100%': {
            transform: `translate3d(${-x}px,${y}px,0) scale(${scale})`
          }
        }
        animations.registerAnimation({
          name: 'hide-normal-box',
          animation,
          presets: {
            duration: 300,
            easing: 'linear'
          }
        })
        animations.runAnimation(this.$refs.cdWrapper, 'hide-normal-box', done)
      },
      afterLeave (el) {
        animations.unregisterAnimation('hide-normal-box')
        this.$refs.cdWrapper.style.animation = ''
      },
      _getAnimationPos () {
        let innerWidth = window.innerWidth   // 视口
        let innerHeight = window.innerHeight  // 视口
        let paddingTop = 80
        let paddingLeft = 20
        let paddingBottom = 10
        let widthMini = 40  // mini-box的直径
        let widthNormal = innerWidth * 0.8 // normal-box的直径
        return {
          y: innerHeight - paddingTop - widthNormal * 0.5 - paddingBottom - widthMini * 0.5,
          x: innerWidth * 0.5 - paddingLeft - widthMini * 0.5,
          scale: widthMini / widthNormal
        }
      },
      togglePlay () {
        this.setPlaying(!this.playing)
      },
      prev () {
        // 向前切歌,0是第一首歌曲,-1时循环列表
        // audio准备就绪后prev才会生效,否则直接return
        if (!this.audioReady) {
          return
        }
        let index = this.currentIndex - 1
        if (index === -1) {
          index = this.list.length - 1
        }
        this.setCurrentIndex(index)
        this.setPlaying(true)
        this.audioReady = false
      },
      next () {
        // 向后切歌,this.list.length-1是最后一首歌曲,变成0
        if (!this.audioReady) {
          return
        }
        let index = this.currentIndex + 1
        if (index === this.list.length) {
          index = 0
        }
        this.setCurrentIndex(index)
        this.setPlaying(true)
        this.audioReady = false
      },
      ...mapActions({
        changeToMiniBox: 'changeToMiniBox',
        changeToNormalBox: 'changeToNormalBox',
        randomPlay: 'randomPlay'
      }),
      ready () {
        // 恢复切换歌曲功能
        this.audioReady = true
      },
      changeMode () {
        // 递增mode，实现模式切换
        let currentMode = (this.mode + 1) % 3
        this.setMode(currentMode)
        if (this.mode === MODE.RANDOM) {
          // 如果是随机播放,取到当前播放的顺序列表,打乱放入播放列表中
          let sequenceList = this.sequenceList
          // 打乱的播放列表
          let randomList = shuffle(sequenceList)
          // 设置完列表后，也需要修改正在播放歌曲的index，否则来回切歌会导致顺序不对
          // 例如:当前菊花台，切下一首歌在切回来时，不是菊花台
          this.setList(randomList)
          let playedSong = this.playedSong
          // 设置乱序列表中对应歌曲的
          let index = randomList.findIndex((item) => {
            return item.id === playedSong.id
          })
          this.setCurrentIndex(index)
        }
      },
      error () {
        // 出现错误后,也要恢复ready状态,恢复切歌功能
        this.audioReady = true
      },
      timeUpdate (e) {
        this.currentTime = e.target.currentTime
        this.percent = this.currentTime / this.totalTime
      },
      _format (time) {
        let minute = Math.floor(time / 60)
        let second = this._pad(Math.floor(time % 60))
        return `${minute}:${second}`
      },
      _pad (minute) {
        let token = minute.toString()
        let len = token.length
        if (len < 2) {
          token = '0' + token
        }
        return token
      },
      ...mapMutations({
        setPlaying: 'SET_PLAYING',
        setCurrentIndex: 'SET_CURRENTINDEX',
        setMode: 'SET_MODE',
        setList: 'SET_LIST'
      })
    },
    components: {
      ProgressBar
    }
  }
</script>

<style lang="stylus" scoped>
  @import "~common/stylus/variable"
  .musicbox-wrapper
    .normal-player
      position: fixed
      top: 0
      left: 0
      width: 100%
      height: 100%
      background-color: $color-background
      color: #FFFFFF
      &.normal-enter-active, &.normal-leave-active
        transition: all .4s
        .top, .bottom
          transition: all .4s cubic-bezier(0.86, 0.18, 0.82, 1.32)
      &.normal-enter, &.normal-leave-to
        opacity: 0
      &.normal-enter
        .top
          transform: translate3d(0, -100px, 0)
        .bottom
          transform: translate3d(0, 100px, 0)
      .background
        position: absolute
        left: 0
        top: 0
        width: 100%
        height: 100%
        z-index: -1
        opacity: 0.6
        filter: blur(20px)
      .top
        position: relative
        margin-bottom: 25px
        .mini-icon
          position: absolute
          top: 0
          left: 6px
          z-index: 50
          font-size: 0
          .icon-back
            font-size: 22px
            padding: 9px
            display: block
            color: $color-theme
            transform: rotate(-90deg)
        .title
          width: 70%
          margin: 0 auto
          text-align: center
          overflow: hidden
          line-height: 40px
          font-size: 18px
          white-space: nowrap
          text-overflow: ellipsis
          color: #FFFFFF
        .subtitle
          line-height: 20px
          font-size: 14px
          text-align: center
          color: #FFFFFF
      .middle
        position: fixed
        width: 100%
        top: 80px
        .middle-l
          display: inline-block
          vertical-align: top
          position: relative
          width: 100%
          height: 0
          padding-top: 80%
          .cd-wrapper
            position: absolute
            top: 0
            left: 10%
            width: 80%
            height: 100%
            box-sizing: border-box
            .cd
              width: 100%
              height: 100%
              border-radius: 50%
              &.rotating
                animation: rotate 20s linear infinite
              &.rotating.pause
                animation-play-state: paused
              .image
                position: absolute
                box-sizing: border-box
                top: 0
                left: 0
                width: 100%
                height: 100%
                border-radius: 50%
                border: 10px solid hsla(0,0%,100%,.1)
      .bottom
        position: absolute
        bottom: 50px
        width: 100%
        .progress-wrapper
          width: 80%
          margin: 0 auto
          padding: 10px 0px
          box-sizing: border-box
          display: flex
          align-items: center
          .time
            flex: 0 0 30px
            width: 30px
            line-height: 30px
            font-size: 12px
            color: #fff
            &.time-l
              text-align: left
            &.time-r
              text-align: right
          .progress-bar-wrapper
            flex: 1
        .operators
          display: flex
          align-items: center
          .icon
            flex: 1
            color: $color-theme
            i
              font-size: 30px
              &.pending
                color: $color-theme-d
            &.i-left
              text-align: right
            &.i-center
              text-align: center
              padding: 0 20px
              i
                font-size: 40px
            &.i-right
              text-align: left
    .mini-player
      position: fixed
      display: flex
      align-items: center
      left: 0
      bottom: 0
      z-index: 180
      height: 60px
      width: 100%
      color: #FFFFFF
      background-color: $color-highlight-background
      &.mini-enter-active, &.mini-leave-active
        transition: all .4s
      &.mini-enter, &.mini-leave-to
        opacity: 0
      .cd-wrapper
        position: relative
        width: 40px
        height: 40px
        flex: 0 0 40px
        box-sizing: border-box
        margin-left: 20px
        margin-right: 10px
        .cd
          height: 100%
          width: 100%
          border-radius: 50%
          &.rotating
            animation: rotate 20s linear infinite
          &.rotating.pause
            animation-play-state: paused
          .image
            display: block
            border-radius: 50%
            width: 100%
            height: 100%
      .desc
        display: inline-block
        flex: 1
        .title
          font-size: 14px
          color: #FFFFFF
          margin-bottom: 5px
        .subtitle
          font-size: 12px
          color: hsla(0,0%,100%,.3)
      .control
        flex: 0 0 30px
        padding: 0 10px
        width: 30px
        .icon-mini
          font-size: 30px
          color: $color-theme-d
          &.icon-play-mini, &.icon-pause-mini
            font-size: 32px
  @keyframes rotate
    0%
      transform: rotate(0)
    100%
      transform: rotate(360deg)
</style>
