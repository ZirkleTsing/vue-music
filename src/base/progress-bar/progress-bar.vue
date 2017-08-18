<template>
  <div>
    <div class="process-bar" ref="processBar">
      <div class="bar-inner">
        <div class="progress" ref="process"></div>
        <div class="progress-btn-wrapper" 
             ref="processBtn"
             @touchstart="progressTouchStart"
             @touchmove="progressTouchMove"
             @touchend="progressTouchEnd"
        >
          <div class="progress-btn"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  const PROCESS_BTN_WIDTH = 16
  export default {
    props: {
      percent: {
        default: 0,
        type: Number
      }
    },
    data () {
      // 用于存储touch事件的相关信息
      return {
        touchInfo: {
          // 记录第一个手指按下的x坐标
          touchStartX: -1,
          touching: false
        }
      }
    },
    methods: {
      progressTouchStart (e) {
        this.touchInfo.touching = true
        let touch = e.touches[0]
        this.touchInfo.touchStartX = touch.pageX
      },
      progressTouchMove (e) {
        let touch = e.touches[0]
        // 当前进度条的宽度
        let currentWidth = this.touchInfo.processBarWidth
        // move事件触发，不断更新offset的值，利用该值移动processBar和Btn
        let fingerOffset = touch.pageX - this.touchInfo.touchStartX
        let offset = Math.min(Math.max(0, currentWidth + fingerOffset), this.$refs.processBar.clientWidth - PROCESS_BTN_WIDTH)
        this._offset(offset)
      },
      progressTouchEnd () {
        this.$emit('percent', this.$refs.process.style.width / (this.$refs.processBar.clientWidth - PROCESS_BTN_WIDTH))
        this.touchInfo.touching = false
      },
      _offset (offset) {
        this.$refs.process.style.width = `${offset}px`
        this.$refs.processBtn.style.transform = `translate3d(${offset}px,0,0)`
        console.log(offset)
      }
    },
    watch: {
      percent (newPercent) {
        // percent变化的时候,dom已经渲染了 可以取到dom宽度
        // button移动的距离实际上是整个进度条减去一个身位的button宽度 (totalX)
        // 所以button移动端位移 X 的计算方法是 用 totalX * percent
        if (this.touchInfo.touching) {
          return
        }
        const process = (this.$refs.processBar.clientWidth - PROCESS_BTN_WIDTH) * this.percent
        this.$refs.process.style.width = `${process}px`
        this.$refs.processBtn.style.transform = `translate3d(${process}px,0,0)`
        // 更新当前宽度
        this.touchInfo.processBarWidth = process
      }
    }
  }
</script>

<style lang="stylus" scoped>
  @import "~common/stylus/variable"
  .process-bar
    height: 30px
    .bar-inner
      position: relative
      top: 13px
      height: 4px
      background: rgba(0,0,0,0.3)
      .progress
        position: absolute
        height: 100%
        background: $color-theme
      .progress-btn-wrapper
        position: absolute
        width: 30px
        height: 30px
        top: -13px
        left: -8px
        .progress-btn
          position: relative
          box-sizing: border-box
          top: 7px
          left: 7px
          width: 16px
          height: 16px
          border: 3px solid #fff
          border-radius: 50%
          background: $color-theme
</style>
