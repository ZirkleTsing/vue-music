<template>
  <div class="singer">
    <scroll :data="data">

    </scroll>
  </div>
</template>

<script>
  import {getSingerList, getSortedList} from 'api/singer'
  import Scroll from 'base/scroll/scroll'

  export default {
    data() {
      return {
        singerList: null
      }
    },
    mounted() {
      this._getSingerList()
    },
    methods: {
      _getSingerList() {
        getSingerList().then((res) => {
        //  console.log(res.data.list)
          this.singerList = getSortedList(res.data.list)
          console.log('the singerList is: ')
          console.log(this.singerList)
        })
      }
    },
    components: {
      Scroll
    }
  }
</script>

<style lang="stylus">
  .singer
    position: fixed
    width: 100%
    top: 88px
    bottom: 0
</style>
