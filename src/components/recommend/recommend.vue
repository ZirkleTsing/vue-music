<template>
  <div class="recommend">
    <div class="recommend-content">
      <div class="slider-wrapper">
        <ul class="demo">
          <li v-for="item in recommend">
            <a :href="item.linkUrl">
              <img :src="item.picUrl">
            </a>
          </li>
        </ul>
      </div>
      <div class=recommend-list>
        <h1 class="list-title">热门歌单推荐</h1>
        <ul></ul>
      </div>
    </div>
  </div>  
</template>

<script>
  import {getRecommend} from 'api/recommend'
  import {ERR_OK} from 'api/config'

  export default {
    data() {
      return {
        recommend: []
      }
    },
    created() {
      this._getRecommend()
    },
    methods: {
      _getRecommend() {
        getRecommend().then((res) => {
          if (res.code === ERR_OK) {
            this.recommend = res.data.slider
          }
        })
      }
    }
  }
</script>

<style lang="stylus">

</style>
