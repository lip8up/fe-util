import colorParse from 'color-parse'

/** 将 px 转成 vw 的函数选项  */
export interface CssPx2vwOptions {
  /** 设计稿宽度 */
  designWidth?: number
  /** 保留位数 */
  digits?: number
}

/**
 * 将 px 转成 vw
 * @param px 像素值
 * @param options 选项，默认 `{ designWidth: 750, digits: 5 }`
 */
export function cssPx2vw(
  px: number,
  {
    designWidth = 750,
    digits = 5
  }: CssPx2vwOptions = {}
) {
  const vw = +(px / designWidth * 100).toFixed(digits)
  return vw
}

/**
 * 生成颜色透明度的选项
 */
export interface CssColorOpacityOptions {
  /** 开始刻度 */
  fromScale?: number
  /** 结束刻度 */
  toScale?: number
  /** 开始透明度，范围 0(完全透明) ~ 1(完全不透明) */
  fromOpacity?: number
  /** 结束透明度，范围 0(完全透明) ~ 1(完全不透明) */
  toOpacity?: number
  /** 透明度保留的位数 */
  opacityDigits?: number
}

/**
 * 根据相应刻度以及刻度范围，生成一个带透明度的颜色
 * @param scale 当前刻度
 * @param color 颜色值，支持所有 css 颜色值
 * @param options 选项，默认
 *  `{ fromScale: 0, toScale: 100, fromOpacity: 0, toOpacity: 1, opacityDigits: 5 }`
 */
export function cssColorOpacity(
  scale: number,
  color: string,
  {
    fromScale = 0,
    toScale = 100,
    fromOpacity = 0,
    toOpacity = 1,
    opacityDigits = 5,
  }: CssColorOpacityOptions = {}
) {
  const ratio = (toOpacity - fromOpacity) / (toScale - fromScale)
  const tOpacity = ratio * (scale - fromScale) + fromOpacity
  const fOpacity = Math.max(fromOpacity, Math.min(toOpacity, tOpacity))
  const opacity = +fOpacity.toFixed(opacityDigits)
  const { values: [ red, green, blue ]  } = colorParse(color)
  const result = `rgba(${red}, ${green}, ${blue}, ${opacity})`
  return result
}
