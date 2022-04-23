import { MapType } from './types'
import { stringIsEmpty } from './string'

/**
 * toMap 键回调函数，该函数接收数组中的每一项 `item`，返回一个字符串
 *
 * @param item 数据中的每一项
 */
export type ArrayMapKeyCallback<T> = (item: T) => string | number | symbol

/**
 * toMap 值回调函数，该函数接收数组中的每一项 `item`，可返回任意值
 *
 * @param item 数据中的每一项
 */
export type ArrayMapValueCallback<T, R> = (item: T) => R

/**
 * 将一组数据，转换成 `map` 返回，`map` 指的是键值对结构，在 `js` 中对应的就是 `PlainObject`
 *
 * @example
 *
 * ```ts
 * import { arrayMap } from 'fe-util'
 *
 * // 不用预先判断 null，可以直接传进去，返回空 `map`（即空对象）
 * arrayMap(null, '')   // {}
 * arrayMap([], '')     // {}
 *
 * const list = [
 *   { name: 'lip', age: 22, sex: 1 },
 *   { name: 'coco', age: 16, sex: 0 },
 * ]
 *
 * // 基本用法：属性 => 属性
 * arrayMap(list, 'name', 'age')    // { lip: 22, coco: 16 }
 * arrayMap(list, 'name', 'sex')    // { lip: 1, coco: 0 }
 *
 * // 第二、三个参数 `key`、`value` 都支持传函数
 * arrayMap(
 *   list,
 *   ({ name, age }) => `${name}_${age}`,
 *   ({ sex }) => `sex ${sex}`
 * )
 * // 上述结果为：{ lip_22: 'sex 1', coco_16: 'sex 0' }
 *
 * // 不传第三个参数 `value`，则值为整个 `item`
 * arrayMap(list, 'name')
 * // 上述结果为：{
 * //   lip: { name: 'lip', age: 22, sex: 1 },
 * //   coco: { name: 'coco', age: 16, sex: 0 }
 * // }
 * ```
 * #### key 取值方式
 *
 * 第二个参数 `key` 的类型为 `string | ArrayMapCallback`，其取值方式为：
 *
 * - 传字符串时，用 `item[key]` 作为 `map` 的 `key`，其中 `item` 为数组中的每一项，下同
 * - 传函数时，用 `key(item)` 的调用结果作为 `key`
 *
 * ### value 取值方式
 *
 * 第三个参数 `value` 的类型与 `key` 相同，其取值方式为：
 *
 * - 当传入字符串或函数时，规则与 `key` 相同
 * - 若不传，则取 `item` 本身作为 `value`
 *
 * @param array  要操作的数组数据
 * @param key    map 的 `key` 取值，取值方式参见上面描述
 * @param value  map 的 `value` 取值，取值方式参见上面描述
 */
export function arrayMap<T>(array: T[] | null, key: string | ArrayMapKeyCallback<T>): MapType<T>
export function arrayMap<T, R, V extends keyof T>(array: T[] | null, key: string | ArrayMapKeyCallback<T>, value: V): MapType<T[V]>  // 为了自动推断 R。必须放在下行之前，约束更紧的放在签名。
export function arrayMap<T, R>(array: T[] | null, key: string | ArrayMapKeyCallback<T>, value: string): MapType<R>                   // 比上行约束更宽松，放在下面，不要求值必须是 T 的显式字段。
export function arrayMap<T, R, V>(array: T[] | null, key: string | ArrayMapKeyCallback<T>, value: ArrayMapValueCallback<T, V>): MapType<V>
export function arrayMap<T, R, V>(array: T[] | null, key: string | ArrayMapKeyCallback<T>, value?: string | ArrayMapValueCallback<T, V>) {
  return (array || []).reduce((map, item: any) => {
    const k = typeof key === 'function' ? key(item) : (item[key] as any as string)
    const v = value ? (typeof value === 'function' ? value(item) : item[value]) : item
    k != null && (map[k as any] = v)
    return map
  }, {} as MapType<any>)
}

/**
 * 将字符串解析成数组，支持以下格式：
 *
 * - JSON 串，若串的解析结果不是数组，则被当做普通字符串处理
 * - 以 , 号分割的字符串
 *
 * @example
 *
 * ```ts
 * import { arrayParse } from 'fe-util'
 *
 * // 不用预先判断 null，可以直接传进去，返回默认的 `defaultValue` 值: `[]`
 * arrayParse(null)             // []
 *
 * // 传数组，原封不动返回
 * arrayParse([])               // []
 * arrayParse([1, 2, 3])        // [1, 2, 3]
 *
 * // 传 JSON 串
 * arrayParse('[1, 2, 3]')      // [1, 2, 3]
 *
 * // 非数组 JSON 串，不被接受，被当做普通字符串处理
 * arrayParse('{ "sex": 1 }')   // ['{ "sex": 1 }']
 *
 * // 传字符串
 * arrayParse('')               // []
 * arrayParse('1')              // ['1']
 * arrayParse('1,2,3')          // ['1', '2', '3']
 *
 * // 空格与 , 随意添加，不影响结果
 * arrayParse(',1, 2,,3,')      // ['1', '2', '3']
 * ```
 *
 * @typeparam T         指定解析后的类型，默认 `string`，常用于 JSON 串解析
 * @param string        要解析的字符串，或本身就是数组，并对 `null` 进行了兼容性处理
 * @param defaultValue  默认值，解析不成功时的默认值，默认为空数组 `[]`
 * @throws              当 `string` 类型不一致时，抛出 `Error('param string type incorrect')`
 */
export function arrayParse<T = string>(
  string: string | T[] | null,
  defaultValue: T[] = []
): T[] {
  if (string == null) {
    return defaultValue
  }
  if (string instanceof Array) {
    return string
  }
  if (typeof string !== 'string') {
    throw Error('param `string` type incorrect')
  }

  const str = string.trim()
  if (str == '') {
    return defaultValue
  }

  try {
    const array = JSON.parse(str)
    if (array instanceof Array) {
      return array
    }
  } catch (_) {
  }

  const result = str.split(',')
  .map(it => it.trim())
  .filter(it => !stringIsEmpty(it))

  return result as any[]
}

const defaultDealId = (id: string) => parseInt(id, 10)

/**
 * 将以英文 , 号分隔的 ID 字符串如 1,2,3，解析成 int[]，如：[1, 2, 3]。
 *
 * @param string 以英文 , 号分隔的 ID 字符串如 1,2,3
 */
export function parseIds(string: string): number[]
/**
 * 将以英文 , 号分隔的 ID 字符串，解析成 T[]。
 *
 * @param string 以英文 , 号分隔的 ID 字符串
 * @param dealId 处理每一个 ID 的函数
 */
export function parseIds<T>(string: string, dealId: ((id: string) => T) | undefined): T[]
export function parseIds<T>(string: string, dealId?: (id: string) => T) {
  const finalDealId = dealId ?? defaultDealId
  const ids = arrayParse(string).map(id => finalDealId(id))
  return ids as any[]
}
