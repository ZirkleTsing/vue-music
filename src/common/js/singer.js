const avatarBaseAddress = 'https://y.gtimg.cn/music/photo_new/T001R300x300M000'

export default class Singer {
  constructor({id, name}) {
    this.Fsinger_id = id
    this.Fsinger_name = name
    this.avatar = `${avatarBaseAddress}${id}.jpg?max_age=2592000`
  }
}