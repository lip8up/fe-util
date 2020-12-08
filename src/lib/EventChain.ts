import EventClass, { EventHandler } from './EventClass'
import { stringRandom } from './string'

/**
 * EventChain 选项
 */
export interface EventChainOptions {
  /**
   * Event Handler 调用时的 `this` 值，若不指定，则使用内部 `EventClass` 的实例
   */
  handlerThis?: any
}

/**
 * 链式事件，通过 `then` 进行链式调用
 *
 * 注意：虽然有 `then`，但不是 `Promise`
 */
export default class EventChain {
  private _event: EventClass

  private _name = stringRandom('EventChain')

  /**
   * 构造函数
   * @param options 选项
   */
  constructor(options: EventChainOptions = {}) {
    const { handlerThis } = options
    this._event = new EventClass({
      chained: true,
      falseBreak: false,
      handlerThis
    })
  }

  /**
   * 触发事件
   * @param args 参数列表
   */
  emit(...args: any[]) {
    this._event.emit(this._name, ...args)
    return this
  }

  /**
   * 监听事件。对同一个 `handler`，可重复多次调用，不会产生副作用。
   * @param handler 事件处理函数
   */
  then(handler: EventHandler) {
    // 先去掉 handler，避免多次调用产生副作用
    this._event.on(this._name, handler)
    return this
  }

  /**
   * 取消监听事件。对同一个 `handler`，可重复多次调用，不会产生副作用。
   * @param handler 事件处理函数
   */
  off(handler: EventHandler) {
    this._event.off(this._name, handler)
    return this
  }
}
