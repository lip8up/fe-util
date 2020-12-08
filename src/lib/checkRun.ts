/**
 * 条件检查函数
 */
export type CheckRunCheck = (count: number) => boolean

/**
 * checkRun 选项
 */
export interface CheckRunOptions {
  /** 检查次数限制，默认为 10，为 0 则不做次数限制 */
  limit?: number
  /** 检查时间间隔，默认为 300，即 300 ms 检查一次 */
  span?: number
  /** 初始检查时间，默认为 0，即立即检查 */
  initSpan?: number
  /** 初始化函数，运行一次，若第一次自行 cond 函数即成功，则不会运行该函数 */
  initOnce?: () => void
}

export const defaultOptions: CheckRunOptions = {
  limit: 10,
  span: 300,
  initSpan: 0
}

/**
 * 循环检查条件 check，当满足时，resolved，否则 rejected
 * @param check 条件检查函数
 * @param options 选项
 */
export default function checkRun(
  check: CheckRunCheck,
  options: CheckRunOptions = {}
): Promise<number> {
  const { limit, span, initSpan, initOnce } = { ...defaultOptions, ...options }

  const max = limit! > 0 ? limit! : Number.MAX_VALUE

  return new Promise((resolve, reject) => {
    let count = 0
    let inited = false
    const checkIt = (ts: number) => {
      count++
      setTimeout(() => {
        if (check(count)) {
          resolve(count)
        } else if (count < max) {
          if (!inited && initOnce) {
            inited = true
            initOnce()
          }
          check(span!)
        } else {
          reject()
        }
      }, ts)
    }
    checkIt(initSpan || 0)
  })
}
