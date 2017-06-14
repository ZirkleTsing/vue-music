<template>
  <scroll :data="data" ref="listview" class="listview">
    <ul>
      <li v-for="group in data" class="list-group">
        <h2 class="list-group-title">{{ group.title }}</h2>
        <ul>
          <li class="list-group-item" v-for="item in group.content">
            <img class="avatar" :src="item.avatar">
            <span class="name">{{ item.Fsinger_name }}</span>
          </li>
        </ul>
      </li>
    </ul>
  </scroll>
</template>

<script>
  import Scroll from 'base/scroll/scroll'

  export default {
    props: {
      data: {
        type: Array,
        default: []
      }
    },
    components: {
      Scroll
    }
    // watch: {
    //   data() {
    //     this.$refs.scroll.refresh()
    //   }
    // }
  }
</script>

<style lang="stylus">
  @import "~common/stylus/variable"
  
  .listview
    position: relative
    width: 100%
    height: 100%
    overflow: hidden
    background: $color-background
    .list-group
      padding-bottom: 30px
      .list-group-title
        height: 30px
        line-height: 30px
        padding-left: 20px
        font-size: $font-size-small
        color: $color-text-l
        background: $color-highlight-background
      .list-group-item
        display: flex
        align-items: center
        padding: 20px 0 0 30px
        .avatar
          width: 50px
          height: 50px
          border-radius: 50%
        .name
          margin-left: 20px
          color: $color-text-l
          font-size: $font-size-medium
</style>
