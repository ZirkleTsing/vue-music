<template>
  <div>
    <div class="process-bar" ref="processBar">
      <div class="bar-inner">
        <div class="progress" ref="process"></div>
        <div class="progress-btn-wrapper">
          <div class="progress-btn"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    props: {
      percent: {
        default: 0,
        type: Number
      }
    },
    watch: {
      percent (newPercent) {
        // percent变化的时候,dom已经渲染了 可以取到dom宽度
        const process = this.$refs.processBar.clientWidth * newPercent
        this.$refs.process.style.width = `${process}px`
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
        left: -7px
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
