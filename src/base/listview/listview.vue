<template>
  <scroll :data="data" ref="scroll" class="scroll">
    <ul>
      <li v-for="group in data" class="list-group">
        <h2 class="list-group-title">{{ group.title }}</h2>
        <ul>
          <li class="list-group-item" v-for="item in group.content">
            <img width="60" height="60" class="avatar" :src="item.avatar">
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
    },
    watch: {
      data() {
        this.$refs.scroll.refresh()
      }
    }
  }
</script>

<style lang="stylus">
  .scroll
    height: 100%
    overflow: hidden
</style>
