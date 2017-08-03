<template>
  <div class="musicbox-wrapper" v-show="list.length > 0">

    <transition name="normal"
                @enter="enter"
                @after-enter="afterEnter"
                @leave="leave"
                @after-leave="afterLeave"
    >
      <div class="normal-player" v-show="fullScreen">
        <div class="top">
          <div class="mini-icon" @click="minibox">
            <i class="icon-back"></i>
          </div>
          <div v-if="playedSong" class="title">{{playedSong.name}}</div>
          <div v-if="playedSong" class="subtitle">{{playedSong.singer}}</div>
        </div>
        <div class="middle">
          <div class="middle-l">
            <div ref="cdWrapper" class="cd-wrapper">
              <div v-if="playedSong" class="cd">
                <img class="image" :src="playedSong.image"> 
              </div>
            </div>
          </div>
        </div>
      </div>
    </transition>

    <transition name="mini">
      <div class="mini-player" v-show="!fullScreen" @click="changeToNormalBox">
        <div class="cd-wrapper">
          <div v-if="playedSong" class="cd">
            <img class="image" :src="playedSong.image">
          </div>
        </div>
        <div v-if="playedSong" class="desc">
          <div class="title">{{playedSong.name}}</div>
          <div class="subtitle">{{playedSong.singer}}</div>
        </div>
      </div>
    </transition>

  </div>
</template>

<script>
  import {mapGetters, mapActions} from 'vuex'
  export default {
    data () {
      return {
      }
    },
    computed: {
      ...mapGetters([
        'list',
        'fullScreen',
        'currentIndex',
        'singer',
        'playedSong'
      ])
    },
    watch: {
      playedSong () {
        console.log(this.playedSong)
      }
    },
    methods: {
      minibox () {
        this.changeToMiniBox()
      },
      changeToNormalBox () {
        this.changeToNormalBox()
      },
      enter (el, done) {
        const {x, y, scale} = this._getAnimationPos()
        console.log(x, y, scale)
      },
      afterEnter (el) {},
      leave (el, done) {
      },
      afterLeave (el) {},
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
      ...mapActions({
        changeToMiniBox: 'changeToMiniBox',
        changeToNormalBox: 'changeToNormalBox'
      })
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
        .top
          transition: all .4s
      &.normal-enter, &.normal-leave-to
        opacity: 0
      &.normal-enter
        .top
          transform: translateY(-100px)
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
              .image
                position: absolute
                box-sizing: border-box
                top: 0
                left: 0
                width: 100%
                height: 100%
                border-radius: 50%
                border: 10px solid hsla(0,0%,100%,.1)
    .mini-player
      position: fixed
      display: block
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
        display: inline-block
        width: 40px
        height: 40px
        padding: 10px 10px 0 20px
        vertical-align: top
        .cd
          height: 100%
          width: 100%
          border-radius: 50%
          .image
            display: block
            border-radius: 50%
            width: 100%
            height: 100%
      .desc
        display: inline-block
        vertical-align: top
        padding-top: 10px
        .title
          font-size: 14px
          color: #FFFFFF
          margin-bottom: 15px
        .subtitle
          font-size: 12px
          color: hsla(0,0%,100%,.3)
</style>
