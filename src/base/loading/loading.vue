<template>
  <div class="loading">
    <img width="24" height="24" src="./loading.gif">
    <p class="desc">{{ title }}</p>
  </div>
</template>

<script>
  export default {
    props: {
      title: {
        type: String,
        default: '正在载入...'
      }
    }
  }
</script>

<style lang="stylus">
  @import "~common/stylus/variable"

  .loading
    width: 100%
    text-align: center // 由于loading组件在recommend中的width是100%，所以center后是居中于父元素的
    .desc
      line-height: 20px
      font-size: $font-size-small
      color: $color-text-l
</style>
