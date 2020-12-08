/** 事件处理函数 */
export type EventHandler = (...args: any[]) => any

/** 事件项 */
export interface EventHandlerMap {
  [name: string]: EventHandler
}

/** 事件处理函数与优先级 */
interface EventHandlerPriority {
  /** 事件处理函数 */
  handler: EventHandler
  /** 优先级 */
  priority: boolean
}

/** 事件 Map */
interface EventMap {
  [key: string]: EventHandlerPriority[]
}

/** 事件监听者 */
export type EventMonitor = (name: string, ...args: any[]) => void

/** 事件选项 */
export interface EventOptions {
  /**
   * 链式模式，在链式模式下，上一个 handler 返回的值，会被传入下一个 handler，默认 false
   */
  chained?: boolean

  /**
   * handler 返回 false，是否中断接下来的 handler，默认 true，即默认中断
   */
  falseBreak?: boolean

  /**
   * 阻止重复添加相同的 handler 函数，默认 true，即默认阻止重复添加
   */
  preventRepeat?: boolean

  /**
   * Event Handler 调用时的 `this` 值，若不指定，则使用当前 `EventClass` 实例
   */
  handlerThis?: any

  /**
   * 事件监听者，用于事件代理透传
   */
  monitor?: EventMonitor
}

/**
 * 已确定某些字段的选项，内部使用
 */
interface ResolvedEventOptions extends EventOptions {
  chained: boolean
  falseBreak: boolean
}

const defaultOptions: ResolvedEventOptions = {
  chained: false,
  falseBreak: true,
  preventRepeat: true,
}

/** 事件类 */
export default class EventClass {
  private _eventMap: EventMap = {}

  private _eventOptions: ResolvedEventOptions = defaultOptions

  /**
   * 构造函数
   * @param options 选项
   */
  constructor(options: EventOptions = {}) {
    this._eventOptions = {
      ...defaultOptions,
      ...options
    }
  }

  /**
   * 监听事件
   * @param name 事件名
   * @param handler 事件处理函数
   * @param priority 优先级，默认为 true
   */
  on(name: string, handler: EventHandler, priority?: boolean): this
  /**
   * 监听事件
   * @param handlerMap 事件处理 Map
   * @param priority 优先级，默认为 true
   */
  on(handlerMap: EventHandlerMap, priority?: boolean): this
  on(name: any, handlerOrPriority: any = true, last = true) {
    const [ map, priority ]: [ EventHandlerMap, boolean ] = typeof name === 'string'
      ? [ { [name]: handlerOrPriority }, last ]
      : [ name, handlerOrPriority ]

    const { preventRepeat } = this._eventOptions

    Object.entries(map).forEach(([key, handler]) => {
      const item = { handler, priority }
      // 若阻止重复，则查找该 handler 是否已存在
      const has = preventRepeat ? this._handlerIndex(key, handler).has : false
      !has && (this._eventMap[key] || (this._eventMap[key] = [])).push(item)
    })

    return this
  }

  _handlerIndex(name: string, handler: EventHandler) {
    const list: EventHandlerPriority[] = this._eventMap[name] || []
    const index = list.findIndex(it => it.handler === handler)
    return { list, index, has: index > -1 }
  }

  /**
   * 取消监听事件
   * @param name 事件名
   * @param handler 事件处理函数，可选，若不传，则取消 `name` 事件的所有监听者
   */
  off(name: string, handler?: EventHandler) {
    if (handler != null) {
      const { has, list, index } = this._handlerIndex(name, handler)
      has && list.splice(index, 1)
    } else {
      this._eventMap[name] = []
    }
    return this
  }

  /**
   * 触发事件
   * @param name 事件名
   * @param args 参数列表
   */
  emit(name: string, ...args: any[]) {
    const list = this._eventMap[name] || []

    const { chained, falseBreak, handlerThis, monitor } = this._eventOptions

    const self = handlerThis || this
    let lastArgs = args

    // 先优先执行 priority 为 true 的事件处理函数
    // 若 chained 为 true，则传给 handler 的参数，为上一个 handler 的返回值
    // 若 falseBreak 为 true，且某 handler，明确返回 false，则取消后续事件处理函数
    list.filter(it => it.priority)
    .concat(list.filter(it => !it.priority))
    .some(it => {
      const ret = it.handler.apply(self, lastArgs)
      chained && (lastArgs = [ret])
      return falseBreak && ret === false
    })

    // 若有事件监听者，调用之
    monitor && monitor(name, ...args)

    return this
  }

  /**
   * 判断事件 `name` 是否有关联的事件处理函数
   * @param name 事件名
   */
  hasHandler(name: string) {
    return name in this._eventMap
  }
}
