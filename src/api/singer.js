import jsonp from 'common/js/jsonp'
import {commonParams, options} from './config'
import {Singer, OrderedSinger} from 'common/js/singer'

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
/**
 * 对list进行数据结构变换:
 * 初始：
 * {
 *  hot: {
 *          title: "热门",
 *          content: [Singer] ==> {Fsinger_id, Fsinger_mid, avatar}
 *       },
 *  map: {
 *          // 未过滤
 *          9: [Singer] ==> {Fsinger_id, Fsinger_mid, avatar},
 *          A: [Singer] ==> {Fsinger_id, Fsinger_mid, avatar},
 *          B: [Singer] ==> {Fsinger_id, Fsinger_mid, avatar},
 *          0: [Singer] ==> {Fsinger_id, Fsinger_mid, avatar},
 *          ...
 *       }
 * }
 * 转换后:
 * [
 *   { //orderedSinger
 *     title: '热门'，
 *     content: [Singer] ==> {Fsinger_id, Fsinger_mid, avatar}
 *   },
 *   {
 *     title: 'A',
 *     content: [Singer] ==> {Fsinger_id, Fsinger_mid, avatar}
 *   }
 *   ...
 * ]
 * @param {qq音乐抓出歌手列表数据} list
 */
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
  let top = []
  let ret = []
  for (let key in map) { // key = ABCD....
  //  console.log(`the key is: ${key}`)
    let content = map[key]
  //  console.log(content)
    if (key.match(/[a-zA-Z]/)) {
      ret.push(new OrderedSinger({
        title: key,
        content: content
      }))
    }
  }
  top.push(new OrderedSinger({
    title: hot.title,
    content: hot.content
  }))

  ret.sort((a, b) => {
    return a.title.charCodeAt(0) - b.title.charCodeAt(0)
  })

  return top.concat(ret)
}

export function getSingerDetail(singerId) {
  const url = 'https://c.y.qq.com/v8/fcg-bin/fcg_v8_singer_track_cp.fcg'

  const data = Object.assign({}, commonParams, {
    loginUin: 0,
    hostUin: 0,
    platform: 'yqq',
    needNewCode: 0,
    singermid: singerId,
    order: 'listen',
    begin: 0,
    num: 100,
    songstatus: 1
  })

  let result = jsonp(url, data, options)
  return result
}