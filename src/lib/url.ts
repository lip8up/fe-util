const wellKnownDefaultValueMap = {
  page: 1
}

/**
 * 美化请求参数
 * @param data 数据
 * @param defaultValueMap 默认数据
 * @deprecated 请使用浏览器标准 https://developer.mozilla.org/zh-CN/docs/Web/API/URL_API
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
 * @deprecated 请使用浏览器标准 https://developer.mozilla.org/zh-CN/docs/Web/API/URL_API
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
 * @deprecated 请使用浏览器标准 https://developer.mozilla.org/zh-CN/docs/Web/API/URL_API
 */
export function urlParam(name?: string, defaultValue = null) {
  const params = getParams()
  return name ? (name in params ? params[name] : defaultValue) : params
}
