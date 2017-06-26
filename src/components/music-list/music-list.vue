<template>
  <div class="music-list">
    <div v-if="song.length">
      <div class="back">
      <i class="icon-back"></i>
      </div>
      <h1 class="title">
        {{title}}
      </h1>
      <div class="bg-image" :style="bgStyle" ref="bgImage">
      </div>
      <scroll :data="song"
              :probe-type="probeType"
              class="list"
              ref="list"
      >
        <div class="song-list-wrapper">
          <song-list :songs="song" :rank="rank" @select="selectItem"></song-list>
        </div>
      </scroll>
    </div>
    <loading v-else></loading>
  </div>
</template>

<script>
  import Loading from 'base/loading/loading'
  import SongList from 'base/song-list/song-list'

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
    created() {
      console.log(123, this.song)
      this.probeType = 3
      this.listenScroll = true
    },
    computed: {
      bgStyle() {
        return `background-image:url(${this.bgImage})`
      }
    },
    watch: {
      song() {
        console.log('change', this.song)
      }
    },
    components: {
      Loading,
      SongList
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
      position absolute
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
    .loading
      position: absolute
      margin-top: 300px
    .list
      .song-list-wrapper
        padding: 20px 30px
</style>
