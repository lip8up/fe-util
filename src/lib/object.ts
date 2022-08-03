import { at } from 'lodash'

/**
 * 取 object 的某些属性，作为新对象
 *
 * @param object 要提取属性的对象
 * @param keys 字符串数组，或以 , 号分割的字符串
 *
 * @return object 新生成的对象
 */
export function objectSlice(object: any, keys: string|string[]): object {
  if (object == null) {
    return {}
  }

  const keyList = keys instanceof Array ? keys : keys.split(',')
  const newo: any = {}
  for (const n in keyList) {
    if (keyList.hasOwnProperty(n)) {
      const key = keyList[n]
      const val = object[key]
      val !== undefined && (newo[key] = val)
    }
  }
  return newo
}

/**
 * 清除对象中的某些值，返回新对象
 * @param object 对象
 * @param cleanList 要清除的值，默认 [null, undefined, '']
 */
export function objectClean(object: any, cleanList: any[] = [null, undefined, '']) {
  if (object == null) {
    return {}
  }

  const newo: any = {}
  for (const key in object) {
    if (object.hasOwnProperty(key)) {
      const val = object[key]
      cleanList.includes(val) || (newo[key] = val)
    }
  }
  return newo
}

/**
 * 返回对象中的指定 `path` 值，该函数是对 `lodash` 的 `at` 函数的包装，
 * 与 `at` 不同的是，该函数接受单一 `path`，返回单一值，而不是 `array`
 *
 * https://lodash.com/docs/4.17.15#at
 *
 * @param object 对象
 * @param path 对象路径
 */
export function dot(object: any, path: string | number | symbol) {
  const list = at(object, path)
  return list[0]
}


/**
 * 复制数据，使用 JSON.parse(JSON.stringify(data)) 的方式。
 *
 * @param data 要复制的数据
 */
export const cloneData = <T>(data: T): T => data !== undefined ? JSON.parse(JSON.stringify(data)) : undefined
