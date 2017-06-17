<template>
  <scroll :data="data"
          ref="listview"
          class="listview"
          :probeType="probeType"
          :listenScroll="listenScroll"
          @scroll="_scroll"
  >
    
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

  const ANCHOR_HEIGHT = 18

  export default {
    props: {
      data: {
        type: Array,
        default: []
      }
    },
    data() {
      return {
        currentPositionY: 0
      }
    },
    created() {
    // 由于并不关心这几个变量的变化情况,所以在created中初始化他们而不是在data中初始化
      this.posY = {}
      this.probeType = 3
      this.listenScroll = true
      // 这里不能监听scroll组件的'scroll'事件,因为dom还没渲染完毕,拿不到refs
    },
    // 参看vm.$on文档 'https://cn.vuejs.org/v2/api/#vm-on'
    // mounted() {
    // vm.$on(event, callback)
    // 监听当前实例上的自定义事件。事件可以由vm.$emit触发。回调函数会接收所有传入事件触发函数的额外参数
    // 不可以this.$on,因为是需要scroll组件去监听事件,需要拿到refs,传入函数即可,他会接受事件提供的参数,具体形式在method里写好
    // 一般这个监听函数注册在html模板中
    // <scroll @scroll="_scroll">...</scroll>
    // 好处是简单直观, 一目了然,下面注释掉的写法只是为了试一下文档API用法
    //   this.$refs.listview.$on('scroll', this._scroll)
    // },
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
        let firstTouch = e.touches[0] // 表示当前跟踪的触摸操作的touch对象的数组
        this.posY.touchStartY = firstTouch.pageY // 触摸目标在页面中的x坐标
       // console.log(this.posY)  // 经测试 clientY和pageY相同,clientY视口中的y坐标,pageY页面中的y坐标,但是与screenY不同,后者大
        this._scrollTo(anchorIndex)
        this.posY.anchorIndex = anchorIndex
      },
      _onListShortcutTouchMove(e) {
        let firstTouch = e.touches[0]
        this.posY.touchMoveY = firstTouch.pageY
        const delta = Math.floor((this.posY.touchMoveY - this.posY.touchStartY) / ANCHOR_HEIGHT)
        this._scrollTo(parseInt(this.posY.anchorIndex) + delta) // getElementAttribute返回的是String,如果没转 会出bug
      },
      _scrollTo(index) {
        this.$refs.listview.scrollToElement(this.$refs.listGroup[index], 0)
      },
      _scroll(positionY) {
        console.log(positionY)
        this.currentPositionY = positionY
      }
    },
    watch: {
      // 参看watch文档 'https://cn.vuejs.org/v2/api/#watch'
      data() {
        console.log('listview', this.data)
      },
      currentPositionY() {
        console.log('dang')
      }
    },
    components: {
      Scroll
    }
    // watch: {
    // 这个refresh不应该暴露给scroll组件外，其内部应该有一个刷新机制
    // 用户只需要把刷新机制所关心的数据变化传给scroll组件即可
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
