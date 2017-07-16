<template>
  <scroll :data="data"
          ref="listview"
          class="listview"
          :probeType="probeType"
          :listen-scroll="listenScroll"
          @scroll="_scroll"
  >

    <ul>
      <li v-for="(group, index) in data"
          class="list-group"
          ref="listGroup"
          :key="index"
      >
        <h2 class="list-group-title">{{ group.title }}</h2>
        <ul>
          <li class="list-group-item"
              v-for="(item,key) in group.content"
              @click="selectedSinger(item)"
              :key="key"
          >
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
          <li v-for="(item, index) in shortcutList"
              class="item"
              :data-index="index"
              :class="{'active': index === currentIndex}"
              :key="index"
          >
            {{ item }}
          </li>
        </ul>
    </div>

    <div class="list-fixed" v-if="fixedTitle" ref="fixed">
      <div class="fixed-title">{{fixedTitle}}</div>
    </div>
  
  </scroll>
</template>

<script>
  import Scroll from 'base/scroll/scroll'
  import {getElementAttribute} from 'common/js/dom'

  const ANCHOR_HEIGHT = 18
  const TITLE_HEIGHT = 30

  export default {
    props: {
      data: {
        type: Array,
        default: []
      }
    },
    data() {
      return {
        // currentPositionY 有两处赋值过程,1.左侧滑动返回实时位置;2.滑动右侧导航栏,返回带有边界检验的合法值
        currentPositionY: 0,
        currentIndex: 0,
        // diff一定是恒大于0的,所以设初始值为-1可以判定边界条件
        diff: -1
      }
    },
    created() {
    // 由于并不关心这几个变量的变化情况,所以在created中初始化他们而不是在data中初始化
      this.posY = {}
      this.probeType = 3
      this.listenScroll = true
    // 监控每一组dom的高度
      this.height = []
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
      },
      fixedTitle() {
        if (this.currentPositionY > 0) {
          return ''
        } else {
          return this.data[this.currentIndex] ? this.data[this.currentIndex].title : ''
        }
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
       // this.currentIndex = parseInt(this.posY.anchorIndex) + delta
      },
      _scrollTo(index) {
        if (index === null) {
          return
        }
        // 边界检验,防止this.height取不到数
        if (index < 0) {
          index = 0
        } else if (index > 22) {
          index = 22
        }
        // 注意此时是负值,与better-scroll设定是一样的
        // 这个函数适用用户滑动通讯录导航栏的情况,会检查边界,当滑动左侧通讯录时,currentPositionY依旧可以>0
        this.currentPositionY = -this.height[index]
        this.$refs.listview.scrollToElement(this.$refs.listGroup[index], 0)
      },
      _scroll(positionY) {
        this.currentPositionY = positionY
      },
      _calculateHeight() {
        const data = this.data
        let currentHeight = 0
        // 数据集中至少有一组数据
        if (data.length) {
          this.height.push(0)
        }
        // ref="listGroup" ==> [dom1, dom2, dom3, dom4]
        const listGroup = this.$refs.listGroup
        listGroup.forEach((ele, index) => {
          // clientHeight相关文档参阅:'todo'
          currentHeight += ele.clientHeight
          this.height.push(currentHeight)
        })
      },
      selectedSinger(item) {
        // 将选中的歌手信息条目发送给父组件
        this.$emit('selected', item)
      }
    },
    watch: {
      // 写法参看watch文档 'https://cn.vuejs.org/v2/api/#watch'
      data() {
      // 屏幕每17tick刷新一次 这样做是确保数据更新后dom一定更新了
        setTimeout(() => {
          this._calculateHeight()
        }, 20)
      },
      currentPositionY() {
        // scroll组件传出来的Y值一旦变化,就去判断这个Y值介于哪一个坐标区间,从而实现通讯录导航高亮效果
        // eg: dom集合的高度区间 [0, 760, 1030, 1370, 1780, ...]
        // 但是得到的currentPosition是负数,需要做一下转化
        // currentPositionY每一次变化都要计算一次diff: diff = this.height(this.currentIndex) + this.currentPositionY
        // 所以需要在currentIndex和currentPositionY变化后紧接着计算diff
        const currentY = this.currentPositionY
        const height = this.height
        // 这个流程是用于直接滑动左侧通讯录的边界检验
        if (currentY > 0) {
          this.currentIndex = 0
          return
        }
        for (let i = 0; i < this.height.length; i++) {
          // [0:0, 1:760, 2:1030, 3:1780]
          if (height[i + 1] && (-currentY) >= height[i] && (-currentY) <= height[i + 1]) {
            this.currentIndex = i
            this.diff = this.height[this.currentIndex + 1] + this.currentPositionY
            return
          }
        }
      },
      diff() {
        // 一旦diff值小于了标题的高度,就需要将absolute的title进行偏移
        // 如果在普通的 DOM 元素上使用，引用指向的就是 DOM 元素; 如果用在子组件上，引用就指向组件实例滑动
        // fixed的dom1和向上滑动的dom2之间的关系只有三种:
        // 1.两者还没有接触 2.两者接触了 3.滑动块完全滑到视口顶端
        // 又因为 diff值一定大于0, 所以if语句的两个情况只有 0-TITLE_HEIGHT 和 >TITLE_HEIGHT两种
        // 两者还没有接触的时候,diff值应该是大于TITLE_HEIGHT的,此时dom1不需要偏移,所以将offset设置为0,
        // 两者已经接触后,此时diff值应该是介于0和TITLE_HRIGHT之间的,此时的偏移值应该是diff-TITLE_HEIGHT(负数)，
        // 即fixed向上偏移的量。一旦diff=0了则将offset变为0
        const offset = (this.diff > 0 && this.diff < TITLE_HEIGHT) ? this.diff - TITLE_HEIGHT : 0
        // 这里比较前一次计算的offset是否等于此时,即防止两个dom没有接触的时候(一直为0)时频繁抓取refs.fixed的dom，效率很低
        if (this.offset === offset) {
          return
        }
        this.offset = offset
        this.$refs.fixed.style.transform = `translate3d(0, ${this.offset}px, 0)`
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
      .active
        color: $color-theme
    .list-fixed
      position: absolute
      top: 0
      left: 0
      width: 100%
      .fixed-title
        height: 30px
        line-height: 30px
        padding-left: 20px
        font-size: $font-size-small
        color: $color-text-l
        background: $color-highlight-background
</style>
