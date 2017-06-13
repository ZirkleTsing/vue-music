<template>
  <div>
    歌手页面
  </div>
</template>

<script>
  import {getSingerList, getSortedList} from 'api/singer'

  export default {
    data() {
      return {
        singerList: []
      }
    },
    mounted() {
      this._getSingerList()
    },
    methods: {
      _getSingerList() {
        getSingerList().then((res) => {
        //  console.log(res.data.list)
          getSortedList(res.data.list)
        })
      }
    }
  }
</script>

<style lang="stylus">

</style>
