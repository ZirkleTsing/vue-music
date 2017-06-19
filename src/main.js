import 'babel-polyfill'
import Vue from 'vue'
import App from './App'
import router from './router'
import store from 'store/index'

import 'common/stylus/index.styl'
import fastclick from 'fastclick'
import VueLazyLoad from 'vue-lazyload'

fastclick.attach(document.body) // 取消body dom下点击事件的300ms延迟
Vue.use(VueLazyLoad, {
  loading: require('common/image/default.png')
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
