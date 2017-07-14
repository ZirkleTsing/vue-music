## scroll.vue滚动组件实现细节

#### 设计要点
抽象出scroll组件目的是实现一个可复用的、随着数据实时变化带来的高度不一的dom结构而及时变化的滚动栏。

#### 实现步骤
1. 该组件基于better-scroll库进行扩展,本着组件可复用的原则,对库的一些api进行了封装。
```javascript
    props: {
      probeType: {
        type: Number,
        default: 1
      },
      click: {
        type: Boolean,
        default: true
      },
      data: {
        type: Array,
        default: null
      },
      listenScroll: {
        type: Boolean,
        default: false
      }
    }
```
`probeType`代表滚动模式,默认值为`1`,会截流,只有在滚动结束的时候派发一个 scroll 事件;`2`在手指 move 的时候也会实时派发 scroll 事件，不会截流。 `3`除了手指 move 的时候派发scroll事件，在 swipe（手指迅速滑动一小段距离）的情况下，列表会有一个长距离的滚动动画，这个滚动的动画过程中也会实时派发滚动事件([详细文档](https://github.com/ustbhuangyi/better-scroll));
`click`表示是否派发click事件,默认值为true;
`data`十分重要,scroll组件会`watch`data值得变化,一旦变化,就会刷新scroll组件,重新计算高度,从而返回正确的`滚动栏`。
```javascript
    watch: {  // 这里需要注意,recommand组件传入的data值的过程是一个异步过程,一开始data为null,异步过程后refresh
      data() {//才会得到正确的滚动栏。
        setTimeout(() => {
          this.refresh()
        }, 20)
      }
    }
```
`listenScroll`由于不是所有使用scroll组件的外部组件都需要获取scroll的实时y坐标，所以该选项用于决定scroll组件是否监听scroll事件:
```javascript
    if (this.listenScroll) {
      this.scroll.on('scroll', (pos) => {
      this.$emit('scroll', pos.y)
      })
    }
```

2.组件生命周期内的行为:
首先外部组件将dom插入scroll组件中,并传入组件所需要的选项props;组件在`mounted`阶段会执行`_initScroll()`:
```javascript
      _initScroll() {
        if (!this.$refs.wrapper) {
          return
        }
        this.scroll = new BScroll(this.$refs.wrapper, {
          probeType: this.probeType,
          click: this.click
        })
        if (this.listenScroll) {
          this.scroll.on('scroll', (pos) => {
            this.$emit('scroll', pos.y)
          })
        }
      }
```
渲染完毕后,一旦data值发生变化,就会触发`this.refresh()`方法,用于刷新scroll组件的高度。此外,组件还想外暴露了一些方法,后续组件设计中会陆续介绍其作用,scroll的全部api请参见[文档](https://github.com/ustbhuangyi/better-scroll):
```javascript
      enable() {
        this.scroll && this.scroll.enable()
      },
      disable() {
        this.scroll && this.scroll.disable()
      },
      refresh() {
        this.scroll && this.scroll.refresh()
      },
      scrollTo() {
        this.scroll && this.scroll.scrollTo.apply(this.scroll, arguments)
      },
      scrollToElement() {
        this.scroll && this.scroll.scrollToElement.apply(this.scroll, arguments)
      }
```


#### [回到文档主页](https://github.com/ZirkleTsing/vue-music)