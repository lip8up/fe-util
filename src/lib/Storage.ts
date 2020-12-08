import EventClass from './EventClass'
import tryParseJson from './tryParseJson'
import { MapType } from './types'

/**
 * Storage 选项
 */
export interface StorageOptions {
  /** 命名空间 */
  namespace?: string
}

/**
 * 默认 Storage 选项
 */
const defaultOptions: StorageOptions = {
  namespace: ''
}

/**
 * 带过期时间的本地存储
 */
export default class Storage extends EventClass {
  /**
   * 初始化存储对象
   * @param options 选项
   * @param storage 底层存储，默认 localStorage，可传入 sessionStorage
   */
  constructor(
    private options: StorageOptions,
    private storage = localStorage
  ) {
    super()
    this.options = {
      ...defaultOptions,
      ...options
    }
  }

  /**
   * 设置值
   * @param name 键
   * @param value 值
   * @param expire 过期时间，单位：秒，设置为 0 则不过期，默认为 0
   */
  set(name: string, value: any, expire = 0) {
    const json = JSON.stringify({
      value,
      expire: expire > 0 ? Date.now() + expire * 1000 : 0
    })
    this.storage.setItem(this.nsName(name), json)
  }

  /**
   * 获取值
   * @param name 键
   * @param defaultValue 默认值，默认 null
   */
  get(name: string, defaultValue = null) {
    const item = this.storage.getItem(this.nsName(name))
    if (item !== null) {
      const { expire, value } = tryParseJson(item, {})
      if (expire == 0 || expire >= Date.now()) {
        return value
      }
      this.remove(value)
    }
    return defaultValue
  }

  /**
   * 获取索引处的 key
   * @param index 索引
   */
  key(index: number) {
    return this.storage.key(index)
  }

  /**
   * 将 `name` 加上 `namespace` 返回
   * @param name 名称
   */
  nsName(name: string) {
    return (this.options.namespace || '') + name
  }

  /**
   * 获取所有 `name`，带 `namespace`
   */
  allNsNames() {
    const keys = []
    const ns = this.options.namespace || ''
    for (let i = 0; i < this.storage.length; i++) {
      const key = this.storage.key(i)!
      if (key.startsWith(ns)) {
        keys.push(key)
      }
    }
    return keys
  }

  /**
   * 获取所有 `name`，不带 `namespace`
   */
  allNames() {
    const ns = this.options.namespace || ''
    const start = ns.length
    const keys = this.allNsNames()
    const result = keys.map(it => it.slice(start))
    return result
  }

  /**
   * 获取所有（不包括过期的）键值，返回的 `MapType` 中的键不带 `namespace`
   */
  allEntries() {
    const names = this.allNames()
    const result = names.reduce((ret, name) => {
      const value = this.get(name, undefined)
      value !== undefined && (ret[name] = value)
      return ret
    }, {} as MapType)
    return result
  }

  /**
   * 移除项
   * @param name 名称
   */
  remove(name: string) {
    return this.storage.removeItem(this.nsName(name))
  }

  /**
   * 清除所有项（若设置了 `namespace`，则局限在本 `namespace`）
   */
  clear() {
    const keys = this.allNsNames()
    for (const key of keys) {
      this.storage.removeItem(key)
    }
  }
}
