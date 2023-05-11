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
   * 清理所有过期的项目。
   */
  clean() {
    const now = Date.now()
    for (const name in this.#store) {
      const item = this.#store[name]!
      const span = now - item.time
      if (span > this.#maxAge) {
        delete this.#store[name]
      }
    }
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
   */
  get(name: string): ValueType | undefined {
    this.clean()
    return this.#store[name]?.value
  }
}
