## 通讯录组件实现细节

#### ~~功能一:实现手指滑动通讯录导航左侧通讯录列表滑动~~

1. 在touchStart时记录鼠标的纵坐标y1,写入vue实例,并且记录此时触摸的dom编号anchorIndex
2. 在touchMove时记录鼠标的纵坐标y2,写入vue实例;
3. 计算两个纵坐标的差值,y1-y2 根据单个list的dom高度得出划过的dom个数delta
4. 在anchorIndex的基础上加detla得到活动后的dom节点,调用_scrollTo()使左侧通讯录列表滑到相应位置



#### ~~功能二:实现左侧通讯录列表和右侧通讯录导航栏联动,高亮提示~~

1. 在get到音乐列表数据后计算通讯录每一类的高度,存入数组(用于判断目标y坐标落入哪个区间)
2. Scroll组件根据组件化思想提供一个可选择的监听scroll事件的接口,事件的回调函数中可以得到此时scroll顶端的y坐标
3. scroll事件回调函数中$emit一个事件,并携带y坐标值,父组件监听事件并将y值赋给一个watch对象,每次watch变化,将进入判断y值落入哪个dom区间的流程
4. 实现判断y值区间的函数

#### ~~功能三: 实现手指滑动左侧通讯录时分类标题栏动态滑动效果~~
1. 在样式上我们加入了一个名字为list_fixed的dom节点,固定于组件的顶部,用于提示用户此时通讯录组件滑动至以哪一个字母为首的list-group,该dom节点样式的高度与list-group-title的dom高度相同。
2. 经过分析,我们可以发现,此时当前字母所代表的list-group与其紧挨着的下一个list-group的list-fixed底部所处的状态位置只有四种情况: (1)未接触 (2)恰好接触 (3)部分重合 (4)完全重合
3. 我们初始化一个diff变量,用于表示步骤2中所分析的两个dom所处的状态。diff的值代表以当前字母为首对应的list-group的dom高度和currentPositionY之间的差值,由于该值不可能为负数,所以我们将其初始化为-1。
4. 接下来我们分析(1)(2)(3)(4)四种位置状态。我们根据diff值来判断list-fixed的向上偏移量。(1)(2)状态中两个dom并没有重合部分,所以此时 dom > TITLE_HEIGHT, 偏移量为0; (3)状态中两个dom部分重合,此时0 < diff < TITLE_HRIGHT,此时偏移量为diff-TITLE_HEIGHT; (4)状态中两个dom完全重合,此时字母区间已经恰好落入下一个区间中,此时的 list_fixed应该是偏移量为0的,所以最终我们的条件分支可分为两个: offset = (this.diff > 0 && this.diff < TITLE_HEIGHT) ? this.diff - TITLE_HEIGHT : 0 

## 具体实现

#### 功能一:

首先为了监听touchStart和touchMove,我们需要在包裹`li`组件的div上注册这个两个事件:

```Html
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
```

因为我们不需要响应式的y坐标变量，于是我们在`create`钩子中声明了:

```javascript
created() {
      this.posY = {}
    }
```

接着我们实现了两个事件函数:

```javascript
      _onListShortcutTouchstart(e) {
        let anchorIndex = getElementAttribute(e.target, 'index')
        let firstTouch = e.touches[0] // 表示当前跟踪的触摸操作的touch对象的数组
        this.posY.touchStartY = firstTouch.pageY // 触摸目标在页面中的x坐标
        console.log(this.posY)
        this._scrollTo(anchorIndex)
        this.posY.anchorIndex = anchorIndex
      },
      _onListShortcutTouchMove(e) {
        let firstTouch = e.touches[0]
        this.posY.touchMoveY = firstTouch.pageY
        const delta = Math.floor((this.posY.touchMoveY - this.posY.touchStartY) / ANCHOR_HEIGHT)
        this._scrollTo(parseInt(this.posY.anchorIndex) + delta)
      }
```

当touchStart事件触发时,通过记录此时的`touchStartY`值以及手指触摸的锚点dom`anchorIndex`,为touchMove事件提供必要的参数。当touchMove事件触发时,同样计算此时的TouchMoveY值可以得出手指按下与手指滑动时刻Y的坐标差值delta。由于我们知道每一个dom的高度,所以我们可以知道手指划过的dom个数。

#### 功能二:

由于歌手信息data的请求过程是一个异步过程,需要在每次更新data时重新计算dom高度,于是我们选择在`watch`钩子函数中监听data变化,执行`_calculateHeight`函数:
```javascript
    props: {
      data: {
        type: Array,
        default: []
      }
    },
    created() {
    // 由于并不关心变量的变化情况,所以在created中初始化它们而不是在data中初始化
    // 监控每一组dom的高度
      this.height = []
      // 这里不能监听scroll组件的'scroll'事件,因为dom还没渲染完毕,拿不到refs
    },
    methods: {
        _calculateHeight() {
          // TODO
          console.log('calculateHeight()')
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
            this，.height.push(currentHeight)
          })
          console.log('dom height', this.height)
        }
      }
    }
    watch() {
      data() {
      // 屏幕每17tick刷新一次 这样做是确保数据更新后dom一定更新了
        setTimeout(() => {
          this._calculateHeight()
        }, 20)
      }
    }
```
其中`data()`中我们使用了`setTimeout()`,原因是屏幕(60FPS)每17ms刷新一次 这样做是确保数据更新后dom渲染完毕。这样我们就得到了每一组dom的高度,用于后续计算流程:
```javascript
  console.log(this.height)
  //(24) [0, 760, 1030, 1370, 1780, 1910, 2110, 2450, 2720, 3060, 3190, 3950, 4430, 4700, 4900, 5100, 5370, 5570, 5980, 6460, 7010, 7560, 7900, 9010]
```
思考一下,我们需要用户在触摸滑动左侧通讯录列表时,需要右侧相对应的通讯录导航栏高亮,也就是说需要一个`currentIndex`来记录左侧通讯录区间坐标落在哪一个首字母坐标区间内。于是我们现在需要的是**实时更新**视窗通讯录模块的顶端实时的Y坐标`currentIndex`以及判断Y坐标落入哪个区间的判断函数。
**better-score**给我们提供了一个scroll事件,用于返回滚动过程中scroll组件视口顶部的Y坐标,这正是我们需要的。于是我们回到Scroll组件中,本着组件化、可复用的原则,我们给scroll的`props`属性中提供一个`listenScroll`选项,用户使用Scroll组件时需要传入该选项决定是否让Scroll组件监听scroll事件,这样做的好处是用户不需要该选项时会使用默认的false值,组件可以很灵活的适用于各种场景。
```javascript
  // Scroll    
    props: {
      // probeType:
      // 1 滚动的时候会派发scroll事件，会截流。
      // 2 滚动的时候实时派发scroll事件，不会截流。
      // 3 除了实时派发scroll事件，在swipe的情况下仍然能实时派发scroll事件
      probeType: {
        type: Number,
        default: 1
      },
      listenScroll: {
        type: Boolean,
        default: false
      }
    },
     methods: {
      _initScroll() {
        if (!this.$refs.wrapper) {
          return
        }
        this.scroll = new BScroll(this.$refs.wrapper, {
          probeType: this.probeType,
          click: this.click
        })
        // mounted钩子中监听scroll事件
        if (this.listenScroll) {
          this.scroll.on('scroll', (pos) => {
            this.$emit('scroll', pos.y)
          })
        }
      },
```
Scroll组件在滚动时触发scroll事件,回调函数中触发一个事件`this.$emit('scroll', pos.y)`,父组件中监听这个事件:
```HTML
  <scroll :data="data"
          ref="listview"
          class="listview"
          :probeType="probeType"
          :listenScroll="listenScroll"
          @scroll="_scroll"
  >
  ...
  </scroll>
```
通讯录导航中绑定了一个class,用于高亮此时左侧通讯录位于区间对应的首字母:
```HTML
  <ul>
    <li v-for="(item, index) in shortcutList"
        class="item"
        :data-index="index"
        :class="{'active': index === currentIndex}"
    >
      {{ item }}
    </li>
  </ul>
```
为active添加样式:
```CSS
    .item
      padding: 3px
      line-height: 1
      color: $color-text-l
      font-size: $font-size-small
      text-align: center
    .active
      color: $color-theme
```
接下来,我们来实现`_scroll`函数,和区间判断函数
```javascript
  data() {
      return {
        currentPositionY: 0,
        currentIndex: 0
      }
    },
  methods: {
    _scroll(positionY) {
      this.currentPositionY = positionY
    }
  }
  watch() {
    currentPositionY() {
        // scroll组件传出来的Y值一旦变化,就去判断这个Y值介于哪一个坐标区间,从而实现通讯录导航高亮效果
        // eg: dom集合的高度区间 [0, 760, 1030, 1370, 1780, ...]
        // 但是得到的currentPosition是负数,需要做一下转化
        const currentY = this.currentPositionY
        const height = this.height
        // console.log('currentY', currentY)
        console.log('currentY', currentY)
        if (currentY > 0) {
          this.currentIndex = 0
          return
        }
        for (let i = 0; i < this.height.length; i++) {
          // [0:0, 1:760, 2:1030, 3:1780]
          if (height[i + 1] && (-currentY) > height[i] && (-currentY) < height[i + 1]) {
            this.currentIndex = i
          }
        }
        console.log(this.currentIndex)
      }
    },
  }
```
这样通讯录列表和通讯录导航联动功能就完成啦。

#### ~~功能三:实现手指滑动左侧通讯录时分类标题栏动态滑动效果~~


#### [回到文档主页](https://github.com/ZirkleTsing/vue-music)