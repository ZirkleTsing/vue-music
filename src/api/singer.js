import jsonp from 'common/js/jsonp'
import {commonParams, options} from './config'
import Singer from 'common/js/singer'

const HOT_LIST_NAME = '热门'
const HOT_LIST_LENGTH = 10

export function getSingerList() {
  const url = 'https://c.y.qq.com/v8/fcg-bin/v8.fcg'

  const data = Object.assign({}, commonParams, {
    channel: 'singer',
    page: 'list',
    key: 'all_all_all',
    pagesize: 100,
    pagenum: 1,
    loginUin: 0,
    hostUin: 0,
    platform: 'yqq',
    needNewCode: 0
  })

  let result = jsonp(url, data, options)
  return result
}

export function getSortedList(list) {
  const hot = {
    title: HOT_LIST_NAME,
    content: []
  }
  const map = {}
  list.forEach((item, index) => {
   // console.log(item, index)
    if (index < HOT_LIST_LENGTH) {
      let ele = new Singer({
        name: item.Fsinger_name,
        id: item.Fsinger_mid
      })
     // console.log(`the ele is: ${ele.Fsinger_name}`)
      hot.content.push(ele)
    }
    let key = item.Findex
    if (!map[key]) {
      map[key] = [new Singer({
        name: item.Fsinger_name,
        id: item.Fsinger_mid
      })]
    } else {
      map[key].push(new Singer({
        name: item.Fsinger_name,
        id: item.Fsinger_mid
      }))
    }
  })
 // console.log(map)
  return {
    hot,
    map
  }
}