<template>
  <div class="music-list">
    <div v-if="song.length">
      <div class="back">
      <i class="icon-back"></i>
      </div>
      <h1 class="title">
        {{title}}
      </h1>
      <div class="bg-Image"></div>
    </div>
    <loading v-else></loading>
  </div>
</template>

<script>
  import Loading from 'base/loading/loading'

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
      }
    },
    created() {
      console.log(123, this.song)
    },
    watch: {
      song() {
        console.log('change', this.song)
      }
    },
    components: {
      Loading
    }
  }
</script>

<style scoped lang="stylus">
  @import "~common/stylus/variable"

  .music-list
    // why must fixed???????
    position: fixed
    top: 0
    left: 0
    right: 0
    bottom: 0
    z-index: 100
    background: $color-background
</style>
