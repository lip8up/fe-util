import urlJoin from 'url-join'

const wellKnownDefaultValueMap = {
  page: 1
}

/**
 * 美化请求参数
 * @param data 数据
 * @param defaultValueMap 默认数据
 */
export function prettyQuery(data: any, defaultValueMap: any = {}) {
  const defaultMap = {
    ...wellKnownDefaultValueMap,
    ...defaultValueMap
  }

  return Object.keys(data).reduce((map: any, key) => {
    const val = data[key]
    const str = (val + '').trim()
    const def = key in defaultMap ? defaultMap[key] : null
    if (val != null && str != '' && str != def) {
      map[key] = str
    }
    return map
  }, {})
}

const rUrlParams = /^([^?]*)(?:\?)?(.*)$/

const decode = (s: any) => (s != null ? decodeURIComponent(s).trim() : null)

const map2Param = (map: any) => {
  const list = Object.entries(map).map(it => {
    // 过滤掉 null，但不过滤空串，以便 k1=v1&onlykey&k2=v2
    const [key, val] = it.map(decode)
    return key !== '' && val !== null ? [key, val].join('=').replace(/=$/, '') : null
  })

  return list.join('&')
}

const param2Map = (str: string) => {
  return str.split('&').reduce((ret: any, it) => {
    const s = it.trim()
    if (s) {
      const [key, val] = s.split('=').map(decode)
      // 保留空串，以免丢掉不带值的 KEY
      ret[key!] = val || ''
    }
    return ret
  }, {})
}

const decodeParams = (obj: any) => {
  const newObj: any = {}
  Object.entries(obj).forEach(it => {
    const [key, val] = it.map(decode)
    newObj[key!] = val
  })
  return newObj
}

/**
 * 构建新的 URL
 * @param url 现有的 URL，可以带有 query 参数
 * @param query query 字符串或对象，去除某个参数，可以使用 { some: null }
 */
export function buildUrl(url: string, query: any) {
  const durl = decodeURI(url)
  const params = (typeof query === 'string' ? param2Map : decodeParams)(query)

  const [, prefix = '', oldQuery = ''] = durl.match(rUrlParams) || []
  const newParams = { ...param2Map(oldQuery), ...params }
  const newQuery = map2Param(newParams)

  return encodeURI((prefix + '?' + newQuery).replace(/\?$/, ''))
}

const getParams = () => param2Map(location.search.replace(/^\?/, ''))

/**
 * 获取 url 参数
 * @param name 参数名，不传则获取全部
 * @param defaultValue 参数默认值
 */
export function urlParam(name?: string, defaultValue = null) {
  const params = getParams()
  return name ? (name in params ? params[name] : defaultValue) : params
}

/**
 * 是否为绝对路径 url，诸如：http:、https:、sftp:、// 开头的网址，被认为是绝对路径
 * @param url url 路径
 */
export function isAbsoluteUrl(url: string) {
  return /^[a-z][a-z0-9+.-]*:|^\/\//.test(url)
}

/**
 * 加工成全路径的 url，若参数 `path` 为绝对路径，则直接返回 `path`
 * @param base 基础 url
 * @param path 路径部分
 */
export function fullUrl(base: string, path: string) {
  return isAbsoluteUrl(path) ? path : urlJoin(base, path)
}
