<template>
  <div class="singer">
    <listview :data="singerList"></listview>
    <router-view></router-view>
  </div>
</template>

<script>
  import {getSingerList, getSortedList} from 'api/singer'
  import Listview from 'base/listview/listview'
  // import SingerDetail from 'components/singer-detail/singer-detail'

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
          this.singerList = getSortedList(res.data.list)
        })
      }
    },
    components: {
      Listview
      // SingerDetail
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
