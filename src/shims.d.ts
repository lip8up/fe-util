
declare module 'color-parse' {
  /**
   * 颜色处理结果
   */
  export interface ColorParseResult {
    /** 颜色空间，例如 `rgb`、`hsl` 等 */
    space: string
    /** 颜色值，`[ red, green, blue ]` */
    values: number[]
    /** 透明度，范围 0 ~ 1 */
		alpha: number
  }

  /**
   * 将 css 颜色，分析成特定格式，例如：
   * ```js
   * colorParse('#080')
   * ```
   * 结果为：
   * ```js
   * { alpha: 1, space: 'rgb', values: [0, 136, 0] }
   * ```
   * 更多文档参见：https://www.npmjs.com/package/color-parse
   * @param color 颜色字符串
   */
  export default function colorParse(color: string): ColorParseResult
}
