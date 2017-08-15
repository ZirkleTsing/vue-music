import Vue from 'vue'
import Router from 'vue-router'
// import Recommend from 'components/recommend/recommend'
// import Singer from 'components/singer/singer'
// import Rank from 'components/rank/rank'
// import Search from 'components/search/search'
// import SingerDetail from 'components/singer-detail/singer-detail'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/recommend'
    },
    {
      path: '/recommend',
      component: () => import('components/recommend/recommend')
    },
    {
      path: '/singer',
      component: () => import('components/singer/singer'),
      children: [{
        path: ':id',
        component: () => import('components/singer-detail/singer-detail')
      }]
    },
    {
      path: '/rank',
      component: () => import('components/rank/rank')
    },
    {
      path: '/search',
      component: () => import('components/search/search')
    }
  ]
})