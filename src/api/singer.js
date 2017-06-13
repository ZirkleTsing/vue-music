import jsonp from 'common/js/jsonp'
import {commonParams, options} from './config'

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
  const avatarBaseAddress = 'https://y.gtimg.cn/music/photo_new/T001R300x300M000'
  const hot = {
    title: HOT_LIST_NAME,
    content: []
  }
  const map = {}
  list.forEach((item, index) => {
   // console.log(item, index)
    if (index < HOT_LIST_LENGTH) {
      let ele = {
       // Findex: item.Findex,
        Fsinger_id: item.Fsinger_id,
        avatar: `${avatarBaseAddress}${item.Fsinger_mid}.jpg`,
        Fsinger_name: item.Fsinger_name
      }
     // console.log(`the ele is: ${ele.Fsinger_name}`)
      hot.content.push(ele)
    }
    let key = item.Findex
    if (!map[key]) {
      map[key] = [{
        Fsinger_id: item.Fsinger_id,
        avatar: `${avatarBaseAddress}${item.Fsinger_mid}.jpg`,
        Fsinger_name: item.Fsinger_name
      }]
    } else {
      map[key].push({
        Fsinger_id: item.Fsinger_id,
        avatar: `${avatarBaseAddress}${item.Fsinger_mid}.jpg`,
        Fsinger_name: item.Fsinger_name
      })
    }
  })
 // console.log(map)
  return {
    hot,
    map
  }
}