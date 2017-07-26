<template>
  <div class="musicbox-wrapper" v-show="list.length > 0">
    <div class="normal-box" v-show="fullScreen">
      <div class="mini-box-icon" @click="minibox">按钮</div>
      <div class="title">{{songName}}</div>
      <div class="subtitle">{{singerName}}</div>
    </div>
    <div class="mini-box" v-show="!fullScreen" @click="changeToNormalBox">mini-box</div>
  </div>
</template>

<script>
  import {mapGetters, mapActions} from 'vuex'
  export default {
    data () {
      return {
        songName: '',
        singerName: ''
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
      'singer' () {
        this.singerName = this.singer.Fsinger_name
      },
      'list' () {
        this.songName = this.list[this.currentIndex].name
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
    .normal-box
      position: fixed
      top: 0
      left: 0
      width: 100%
      height: 100%
      background-color: $color-background
      color: #FFFFFF
      .mini-box-icon
        position: absolute
        top: 2px
        left: 3px
      .title
        text-align: center
      .subtitle
        text-align: center
    .mini-box
      position: fixed
      left: 0
      bottom: 0
      height: 60px
      width: 100%
      color: #FFFFFF
      background-color: #555
</style>
