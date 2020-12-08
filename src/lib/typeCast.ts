import { arrayParse } from './array'
import { isNumber, isArray } from './type'
import { MapType } from './types'

// NOTE: 该文件已被导出，请不要更改各导出函数的语义

/**
 * 获取特定值类型的属性集
 * @param object 对象
 * @param isType 类型函数
 */
export function getKeysByValueType(
  object: object,
  isType: (value: any) => boolean
) {
  return Object.entries(object)
    .filter(([ , value ]) => isType(value))
    .map(([ key ]) => key)
}

/**
 * 找出对象中的全部数字 key
 * @param object 对象
 */
export function numberKeys(object: object) {
  return getKeysByValueType(object, isNumber)
}

/**
 * 将对象中的指定的属性转成数字
 * @param object 对象
 * @param keys 指定属性
 */
export function numberify(object: object, keys: string | string[]) {
  const newObject: any = { ...object }
  arrayParse(keys).forEach(key => newObject[key] = +newObject[key])
  return newObject
}

/**
 * 找出对象中的全部数组 key
 * @param object 对象
 */
export function arrayKeys(object: object) {
  return getKeysByValueType(object, isArray)
}

const castMap: MapType<(value: any) => any> = {
  number: (value: any) => +value,
  keep: (value: any) => value
}

/**
 * 将对象中的一些属性转成数组
 * @param object 对象
 * @param referenceObject 参考对象，注意与 numberify 的区别
 */
export function arrayify(
  object: object,
  referenceObject: any
) {
  const newObject: any = { ...object }
  const keys = arrayKeys(referenceObject)
  keys.forEach(key => {
    const itemType = typeof referenceObject[key][0]
    const castFn = castMap[itemType] || castMap.keep
    const value = arrayParse(newObject[key], []).map(castFn)
    newObject[key] = value
  })
  return newObject
}

/**
 * 字符串转换成 bool
 * @param value 字符串
 * @param falseList 被当做 false 的字符串列表，默认：`['false', '0', 'null', 'undefined']`
 */
export function stringToBoolean(
  value: string | null,
  falseList = ['false', '0', 'null', 'undefined']
) {
  const val = String(value).trim().toLowerCase()
  return falseList.includes(val) ? false : Boolean(val)
}

/**
 * 转换成有效的数字，若不是数字，或无效的数字，则返回值本身
 * 若转换后的数字，是以指数形式表示的数字，则被认为是无效的
 * @param value 要转换的值
 */
export function toValidNumber(value: any) {
  const num = +value
  const result = isFinite(num) && String(num) == String(value)
    ? num
    : value
  return result
}

/**
 * 转换成有效的布尔值，若不是布尔值，则返回值本身
 * 与 stringToBoolean 不同，该函数只将明确的 'false'、'true'
 * 进行转换（必须全部为小写），其他并不转换
 * @param value 要转换的值
 */
export function toValidBoolean(value: any) {
  return value === 'true'
    ? true
    : (value === 'false' ? false : value)
}

/**
 * 将数组转换成正确的类型，只转换标量，对于对象，保持原样
 * @param array 数组
 */
export function castArray(array: any[]) {
  const result = (array || []).map(it => {
    if (it == null || typeof it === 'object') {
      return it
    }
    // 先猜想，它是一个数字，再猜想它是一个布尔值
    const value = toValidBoolean(toValidNumber(it))
    return value
  })
  return result
}

/**
 * 转换函数
 */
export type CastObjectCallback = (value: any) => any

/**
 * 转换对象的数据类型，不做深层次递归
 * @param object 要转换的对象
 * @param types 类型 Map
 */
export function castObject<T extends MapType = MapType>(
  object: T,
  types: MapType<CastObjectCallback>
) {
  const result = {} as T
  // tslint:disable-next-line: forin
  for (const key in object) {
    const value = object[key]
    const newValue = key in types ? types[key](value) : value
    result[key] = newValue
  }
  return result
}
