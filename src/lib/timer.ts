/**
 * CountDown Tick 回调
 */
export type CountDownTick = (seconds: number) => any

/**
 * 延迟一段时间
 *
 * @param ms 毫秒数
 *
 * @return {Promise} 时间到 resolve，从不 reject
 */
export function delay(ms: number) {
  return new Promise((resolve, reject) => {
    setTimeout(resolve, ms)
  })
}

/**
 * 执行倒计时
 *
 * @param seconds 倒计时秒数
 * @param tick    倒计时每个滴答执行的回调
 * @param options 配置参数，默认值 { span = 1, to = 0 }，其中：
 *                span 滴答间隔秒数，默认为 1，即 1 秒；to 结束秒数，默认为 0
 *
 * @return {Promise} 倒计时结束 resolve，从不 reject
 */
export async function countDown(
  seconds: number,
  tick: CountDownTick,
  { span = 1, to = 0 } = {}
) {
  for (; seconds > to; seconds -= span) {
    tick(seconds)
    await delay(span * 1000)
  }
}
