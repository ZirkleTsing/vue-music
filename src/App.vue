<template>
  <div id="app">
    <m-header></m-header>
    <tab></tab>
    <keep-alive>
      <router-view></router-view>
    </keep-alive>
    <music-box></music-box>
  </div>
</template>

<script>
import MHeader from 'components/m-header/m-header'
import Tab from 'components/tab/tab'
import MusicBox from 'components/music-box'
export default {
  name: 'app',
  components: {
    MHeader,
    Tab,
    MusicBox
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "common/stylus/variable"

  #app
    color: $color-theme
</style>
