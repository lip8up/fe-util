/**
 * 生成 isType 函数，判断 null 或 undefined，请用 ===
 * @param type 类型
 */
export function isType(type: string) {
  return (value: any) => {
    return Object.prototype.toString.call(value) === `[object ${type}]`
  }
}

/** 判断是否为 object 对象，不包括 null */
export const isObject = isType('Object')

/** 判断是否为 string 值或 string 对象 */
export const isString = isType('String')

/** 判断是否为数组 */
export const isArray = Array.isArray || isType('Array')

/** 判断是否为函数 */
export const isFunction = isType('Function')

/** 判断是否为 number 值或 number 对象 */
export const isNumber = isType('Number')

/** 判断是否为 boolean 值或 boolean 对象 */
export const isBoolean = isType('Boolean')

/** 判断是否为正则表达式 */
export const isRegExp = isType('RegExp')

/** 判断是否为 Date 对象 */
export const isDate = isType('Date')
