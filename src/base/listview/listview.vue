<template>
  <scroll :data="data" ref="listview" class="listview">
    
    <ul>
      <li v-for="group in data" class="list-group" ref="listGroup">
        <h2 class="list-group-title">{{ group.title }}</h2>
        <ul>
          <li class="list-group-item" v-for="item in group.content">
            <img class="avatar" :src="item.avatar">
            <span class="name">{{ item.Fsinger_name }}</span>
          </li>
        </ul>
      </li>
    </ul>
    
    <div v-if="data.length" 
         class="list-shortcut"
         @touchstart="_onListShortcutTouchstart"
         @touchmove.prevent.stop="_onListShortcutTouchMove"
    >
        <ul>
          <li v-for="(item, index) in shortcutList" class="item" :data-index="index">
            {{ item }}
          </li>
        </ul>
    </div>
  
  </scroll>
</template>

<script>
  import Scroll from 'base/scroll/scroll'
  import {getElementAttribute} from 'common/js/dom'

  export default {
    props: {
      data: {
        type: Array,
        default: []
      }
    },
    computed: {
      shortcutList() {
        return this.data.map((group) => {
          return group.title.substr(0, 1)
        })
      }
    },
    methods: {
      _onListShortcutTouchstart(e) {
        let anchorIndex = getElementAttribute(e.target, 'index')
        this._scrollTo(anchorIndex)
      },
      _onListShortcutTouchMove(e) {
       // console.log('touchmove')
       // console.log(e.touches[0].pageY)
      },
      _scrollTo(index) {
        this.$refs.listview.scrollToElement(this.$refs.listGroup[index], 0)
      }
    },
    watch: {
      data() {
        console.log('listview', this.data)
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
    .list-shortcut
      position: absolute
      right: 0
      top: 50%
      transform: translateY(-50%)
      width: 20px
      padding: 20px 0
      border-radius: 10px
      background: $color-background-d
      font-family: Helvetica
      .item
        padding: 3px
        line-height: 1
        color: $color-text-l
        font-size: $font-size-small
        text-align: center
</style>
