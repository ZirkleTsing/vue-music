<template>
  <transition name="slide">
    <music-list
        :song="song"
        :title="singer.Fsinger_name"
        :bgImage="singer.avatar"
      ></music-list>
  </transition>
</template>

<script>
  import {mapGetters} from 'vuex'
  import {getSingerDetail} from 'api/singer'
  import {ERR_OK} from 'api/config'
  import {createSong} from 'common/js/song'
  import MusicList from 'components/music-list/music-list'

  export default {
    data() {
      return {
        song: []
      }
    },
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
      // 异步过程 所以激活传入music-list中的song一开始为空
      getSingerDetail(this.singer.Fsinger_id).then((res) => {
        // res: {code, data, message, subcode}
        if (res.code === ERR_OK) {
          this.song = this._normalizeSong(res.data.list)
        }
      })
    },
    methods: {
      _normalizeSong(list) {
        const ret = []
        list.forEach((item) => {
          const {musicData} = item
          if (musicData.songid && musicData.albummid) {
            ret.push(createSong(musicData))
          }
        })
        return ret
      }
    },
    components: {
      MusicList
    }
  }
</script>

<style scoped lang="stylus">
  @import "~common/stylus/variable"

  .slide-enter-active, .slide-leave-active
    transition: all .3s ease
  .slide-enter, .slide-leave-to
    transform: translate3d(100%, 0, 0)
</style>
