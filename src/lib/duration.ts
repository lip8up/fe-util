const d2 = (n: number) => n > 9 ? n : '0' + n

/**
 * 将时间间隔字符串，解析成秒数
 * 支持的格式有：
 * - hh:mm:ss 时:分:秒
 * - mm:ss    分:秒
 * - ss       秒
 * @param duration 时间间隔字符串
 */
export function durationParse(duration: string) {
  const parts = String(duration).trim().split(':').map(it => parseInt(it, 10))
  if (parts.length > 3 || parts.some(it => isNaN(it) || it < 0)) {
    throw Error(`incorrect format ${duration}`)
  }
  const [ s, m = 0, h = 0 ] = parts.reverse()
  return h * 60 * 60 + m * 60 + s
}

/**
 * durationFormat 选项
 */
export interface DurationFormatOptions {
  /**
   * 显示小时数格式设置，默认为 'auto'。
   * - 为 auto 时，超出 1 小时，显示 hh:mm:ss，否则显示 mm:ss
   * - 为 false 时，始终隐藏小时数，则分部分可能会超过 60
   * - 为 true 是，始终显示小时数
   */
  hour?: boolean | 'auto'
}

/**
 * 将秒数格式化成时间间隔
 * @param seconds 秒数
 * @param options 选项
 */
export function durationFormat(
  seconds: number,
  { hour = 'auto' }: DurationFormatOptions = {}
) {
  if (seconds < 0) {
    throw Error('param seconds must > 0')
  }
  const h = parseInt(seconds / 3600 as any, 10)
  const remain = seconds - h * 3600
  const m = parseInt(remain / 60 as any, 10)
  const s = remain - m * 60
  const parts = hour === true || (hour === 'auto' && h > 0)
    ? [d2(h), d2(m), d2(s)]
    : [d2(h * 60 + m), d2(s)]
  return parts.join(':')
}

/**
 * 时间间隔相加，返回的仍然是时间间隔
 * @param duration1 时间间隔1
 * @param duration2 时间间隔2
 * @param options   选项
 */
export function durationAdd(
  duration1: string,
  duration2: string,
  options: DurationFormatOptions = {}
) {
  const sec1 = durationParse(duration1)
  const sec2 = durationParse(duration2)
  const sum = sec1 + sec2
  return durationFormat(sum, options)
}

/**
 * 时间间隔相减，返回的仍然是时间间隔
 * @param duration1 时间间隔1，被减数
 * @param duration2 时间间隔2，减数
 * @param options   选项
 */
export function durationSub(
  duration1: string,
  duration2: string,
  options: DurationFormatOptions = {}
) {
  const sec1 = durationParse(duration1)
  const sec2 = durationParse(duration2)
  const sub = sec1 - sec2
  return durationFormat(sub, options)
}
