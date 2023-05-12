interface ExpireCacheItem<ValueType = any> {
  value: ValueType
  time: number
}

/**
 * 带过期时间的内存缓存。
 */
export default class ExpireCache<ValueType = any> {
  #maxAge = 999
  #store: Record<string, ExpireCacheItem<ValueType> | undefined> = Object.create(null)

  /**
   * 构造函数。
   * @param maxAge 最大过期时间，单位毫秒，默认 999 毫秒。
   */
  constructor(maxAge = 999) {
    this.#maxAge = maxAge
  }

  /**
   * 存储项目。
   * @param name 项目名。
   * @param value 项目值。
   */
  set(name: string, value: ValueType) {
    this.clean()
    this.#store[name] = {
      value,
      time: Date.now()
    }
  }

  /**
   * 获取缓存的项目，若不存在或过期，返回 undefined。
   * @param name 项目名
   * @param maxAge 可选的 maxAge，若设置，将取代默认 maxAge
   */
  get(name: string, maxAge?: number): ValueType | undefined {
    const age = maxAge || this.#maxAge
    if (name in this.#store) {
      const item = this.#store[name]!
      const span = Date.now() - item.time
      if (span <= age) {
        return item.value
      }
      // 删除已过期的项目
      delete this.#store[name]
    }
  }

  /**
   * 清理所有过期的项目。
   * @param maxAge 可选的 maxAge，若设置，将取代默认 maxAge，传入 0，则清空所有
   */
  clean(maxAge?: number) {
    // 若 age 为 0，则作为 -1 使用，因为同步情况下，下面的 now - item.time 有可能为 0，传入 0 应该删除所有
    const age = (maxAge ?? this.#maxAge) || -1
    const now = Date.now()
    for (const name in this.#store) {
      const item = this.#store[name]!
      const span = now - item.time
      if (span > age) {
        delete this.#store[name]
      }
    }
  }
}
