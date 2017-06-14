<template>
  <div class="singer">
    <listview :data="singerList"></listview>
  </div>
</template>

<script>
  import {getSingerList, getSortedList} from 'api/singer'
  import Listview from 'base/listview/listview'

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
      Listview
    }
  }
</script>

<style scoped lang="stylus">
  .singer
    position: fixed
    width: 100%
    top: 88px
    bottom: 0
</style>
