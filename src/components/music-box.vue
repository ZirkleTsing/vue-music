<template>
  <div class="musicbox-wrapper" v-show="list.length > 0">
    <div class="normal-player" v-show="fullScreen">
      <div class="top">
        <div class="mini-icon" @click="minibox">
          <i class="icon-back"></i>
        </div>
        <div class="title">{{songName}}</div>
        <div class="subtitle">{{singerName}}</div>
      </div>
      <div class="middle">
        <div class="middle-l">
          <div class="cd-wrapper">
            <div class="cd">
               <img class="image" :src="albumImg"> 
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="mini-player" v-show="!fullScreen" @click="changeToNormalBox">
      <div class="cd-wrapper">
        <div class="cd">
          <img class="image" :src="albumImg">
        </div>
      </div>
      <div class="desc">
        <div class="title">{{songName}}</div>
        <div class="subtitle">{{singerName}}</div>
      </div>
    </div>
  </div>
</template>

<script>
  import {mapGetters, mapActions} from 'vuex'
  export default {
    data () {
      return {
        songName: '',
        singerName: '',
        albumImg: ''
      }
    },
    computed: {
      ...mapGetters([
        'list',
        'fullScreen',
        'currentIndex',
        'singer'
      ])
    },
    watch: {
      'list' () {
        this.songName = this.list[this.currentIndex].name
        this.singerName = this.list[this.currentIndex].singer
        // console.table(this.list[this.currentIndex])
        this.albumImg = this.list[this.currentIndex].image
        console.log(this.albumImg)
      }
    },
    methods: {
      minibox () {
        this.changeToMiniBox()
      },
      changeToNormalBox () {
        this.changeToNormalBox()
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
      // line-height: 60px
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
