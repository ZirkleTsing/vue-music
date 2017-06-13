<template>
  <div class="singer">
    <div v-if="singerList" v-for="(item, index) in singerList.hot.content" class="avatar-wrapper">
      <div class="avatar-warpper">
        <img :src="item.avatar">
      </div>
      <div class="desc">
        <h2 class="name">{{ item.Fsinger_name }}</h2>
      </div>
    </div>
  </div>
</template>

<script>
  import {getSingerList, getSortedList} from 'api/singer'

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
