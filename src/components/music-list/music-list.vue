<template>
  <div class="music-list">
    
      <div @click="back" class="back">
        <i class="icon-back"></i>
      </div>
      <h1 class="title" v-html="title"></h1>
      <div class="bg-image" :style="bgStyle" ref="bgImage">
        <div class="filter" ref="filter"></div>
      </div>

      <div class="bg-layer" ref="layer"></div>
      
      <scroll :data="song"
              :probe-type="probeType"
              :listen-scroll="listenScroll"
              class="list"
              ref="list"
              @scroll="_scroll"
      >

        <div class="song-list-wrapper">
          <song-list :songs="song" :rank="rank"></song-list>
        </div>

        <loading class="loading" v-if="!song.length"></loading>
      
      </scroll>
    
    </div>

</template>

<script>
  import Loading from 'base/loading/loading'
  import SongList from 'base/song-list/song-list'
  import Scroll from 'base/scroll/scroll'

  const RESERVED_HEIGHT = 40

  export default {
    props: {
      song: {
        type: Array,
        default: []
      },
      title: {
        type: String,
        default: ''
      },
      bgImage: {
        type: String,
        default: ''
      },
      rank: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        currentPositionY: 0,
        paddingTop: '70%'
      }
    },
    created() {
      this.probeType = 3
      this.listenScroll = true
    },
    mounted() {
      this.imageHeight = this.$refs.bgImage.clientHeight
      // console.log(this.imageHeight)
      // -250
      this.minTranslate = -this.imageHeight + RESERVED_HEIGHT
      this.$refs.list.$el.style.top = `${this.imageHeight}px`
    },
    methods: {
      _scroll(posY) {
        this.currentPositionY = posY
        // console.log(this.currentPositionY)
      },
      back() {
        this.$router.back()
      }
    },
    computed: {
      bgStyle() {
        return `background-image:url(${this.bgImage})`
      }
    },
    watch: {
      currentPositionY(newVal) {
        const bgImage = this.$refs.bgImage
        let translateY = Math.max(this.minTranslate, newVal)
        console.log(translateY)
        this.$refs.layer.style.transform = `translate3d(0,${translateY}px,0)`
        if (newVal < this.minTranslate) {
          bgImage.style.paddingTop = ''
          bgImage.style.height = '40px'
        } else {
          bgImage.style.paddingTop = '70%'
          bgImage.style.height = '0px'
        }
        // 在临界值的时候将图片高度变矮 然后index覆盖list文字,使其hidden
        // let list = this.$refs.list.$el
        // if (newVal < this.minTranslate) {
        //   list.style.transform = `translate3d(0,${translateY}px,0)`
        //   this.$refs.layer.style.transform = `translate3d(0,${translateY}px,0)`
        // } else {
        //   this.$refs.list.$el.style.top = `${this.imageHeight}px`
        //   this.$refs.layer.style.transform = `translate3d(0,${newVal}px,0)`
        // }
      }
    },
    components: {
      Loading,
      SongList,
      Scroll
    }
  }
</script>

<style scoped lang="stylus">
  @import "~common/stylus/variable"

  .music-list
    position: fixed
    top: 0
    left: 0
    right: 0
    bottom: 0
    z-index: 100
    background: $color-background
    .back
      position: absolute
      top: 0
      left: 6px
      z-index: 50
      .icon-back
        display: block
        padding: 10px
        font-size: $font-size-large-x
        color: $color-theme
    .title
      position: absolute
      top: 0
      // 10% + 80% + 10%
      left: 10%
      z-index: 40
      width: 80%
      no-wrap()
      text-align: center
      line-height: 40px
      font-size: $font-size-large
      color: $color-text
    .bg-image
      position: relative
      width: 100%
      height: 0
      padding-top: 70%
      transform-origin: top
      background-size: cover
      // 蒙层效果
      .filter
        position: absolute
        top: 0
        left: 0
        width: 100%
        height: 100%
        background: rgba(7, 17, 27, 0.4)
    .bg-layer
      position: relative
      height: 100%
      background: $color-background

    // list 脱离文档流 和bg的relative布局重叠
    .list
      position: fixed
      top: 0
      bottom: 0
      width: 100%
      background: $color-background
      // overflow: hidden
      .song-list-wrapper
        padding: 20px 30px
</style>
