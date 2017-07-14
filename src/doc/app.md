## header组件、导航栏tab组件

这里主要说一下整个页面的设计:App.vue是整个页面的入口文件,分为三部分:header组件、导航导航栏组件、router-link渲染入口。
```HTML
<template>
  <div id="app">
    <m-header></m-header>
    <tab></tab>
    <keep-alive>
      <router-view></router-view>
    </keep-alive>    
  </div>
</template>
```
#### header组件实现
头部组件是整个页面文档流中的第一个组件元素,位于视口的最上方,没什么特别。代码样式中由于使用了stylus方言,所以可以使用函数来书写样式:
```CSS
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .m-header
    position: relative
    height: 44px
    text-align: center
    color: $color-theme
    font-size: 0
    .icon
      display: inline-block
      vertical-align: top
      margin-top: 6px
      width: 30px
      height: 32px
      margin-right: 9px
      bg-image('logo')
      background-size: 30px 32px
    .text
      display: inline-block
      vertical-align: top
      line-height: 44px
      font-size: $font-size-large
```
#### tab导航栏组件实现
导航栏组件由于控制着下方router-view组件的渲染工作,所以每一个导航单元都需要包裹在router-link标签之中,并且标签属性中分别指向了不同的组件。为了平均分配视口宽度，这里使用了flex布局:
```HTML
<template>
  <div class="tab">
    <router-link tag="div" class="tab-item" to="/recommend">
      <span class="tab-link">推荐</span>
    </router-link>
    <router-link tag="div" class="tab-item" to="/singer">
      <span class="tab-link">歌手</span>
    </router-link>
    <router-link tag="div" class="tab-item" to="/rank">
      <span class="tab-link">排行</span>
    </router-link>
    <router-link tag="div" class="tab-item" to="/search">
      <span class="tab-link">搜索</span>
    </router-link>            
  </div>
</template>
```
```CSS
  @import "~common/stylus/variable"

  .tab
    display: flex
    height: 44px
    line-height: 44px
    font-size: $font-size-medium
    .tab-item
      flex: 1
      text-align: center
      .tab-link
        padding-bottom: 5px
        color: $color-text-l
      &.router-link-active
        .tab-link
          color: $color-theme
          border-bottom: 2px solid $color-theme   
```
