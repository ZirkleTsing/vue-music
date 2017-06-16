## listview.vue

#### ~~功能一:实现手指滑动通讯录导航左侧通讯录列表滑动~~

1. 在touchStart时记录鼠标的纵坐标y1,写入vue实例,并且记录此时触摸的dom编号anchorIndex
2. 在touchMove时记录鼠标的纵坐标y2,写入vue实例;
3. 计算两个纵坐标的差值,y1-y2 根据单个list的dom高度得出划过的dom个数delta
4. 在anchorIndex的基础上加detla得到活动后的dom节点,调用_scrollTo()使左侧通讯录列表滑到相应位置



#### 功能二:实现左侧通讯录列表和右侧通讯录导航栏联动,高亮提示

1. 在get到音乐列表数据后计算通讯录每一类的高度,存入数组(用于判断目标y坐标落入哪个区间)


2. Scroll组件根据组件化思想提供一个可选择的监听scroll事件的接口,事件的回调函数中可以得到此时scroll顶端的y坐标


3. scroll事件回调函数中$emit一个事件,并携带y坐标值,父组件监听事件并将y值赋给一个watch对象,每次watch变化,将进入判断y值落入哪个dom区间的流程
4. 实现判断y值区间的函数



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