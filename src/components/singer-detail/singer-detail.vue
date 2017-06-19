<template>
  <transition name="slide">
    <div class="singer-detail" v-if="singer">
      {{ singer.Fsinger_name }}
    </div>
  </transition>
</template>

<script>
  import {mapGetters} from 'vuex'
  import {getSingerDetail} from 'api/singer'

  export default {
    computed: {
      ...mapGetters([
        'singer'
      ])
    },
    created() {
      if (this.singer === null) {
        this.$router.push('/singer')
        return
      }
      getSingerDetail(this.singer.Fsinger_id).then((res) => {
        console.log(res)
      })
    }
  }
</script>

<style scoped  lang="stylus">
  @import "~common/stylus/variable"

  .singer-detail
    position: fixed
    top: 0
    left: 0
    right: 0
    bottom: 0
    z-index: 100
    background: $color-background
  .slide-enter-active, .slide-leave-active
    transition: all .3s ease
  .slide-enter, .slide-leave-to
    transform: translate3d(100%, 0, 0)
</style>
