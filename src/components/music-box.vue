<template>
  <div class="musicbox-wrapper" v-show="list.length > 0">
    <div class="normal-box" v-show="fullScreen">normal-box</div>
    <div class="mini-box" v-show="!fullScreen">mini-box</div>
  </div>
</template>

<script>
  import {mapGetters} from 'vuex'
  export default {
    computed: {
      ...mapGetters([
        'list',
        'fullScreen'
      ])
    }
  }
</script>

<style lang="stylus" scoped>
  @import "~common/stylus/variable"
  .musicbox-wrapper
    position: fixed
    top: 0
    left: 0
    width: 100%
    height: 100%
    background-color: $color-background
    .normal-box
      color: #FFFFFF
    .mini-box
      color: #FFFFFF
</style>
