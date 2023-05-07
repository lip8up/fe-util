import EventClass from './EventClass'
import { stringRandom } from './string'

/** 事件处理函数 */
export type EventOneHandler<DataType> = (data: DataType) => void

/**
 * 简单的单一参数事件。
 *
 * 注意：虽然有 `then`，但不是 `Promise`
 */
export default class EventOne<DataType = void> {
  private _event: EventClass

  private _name = stringRandom('EventOne')

  /**
   * 构造函数
   */
  constructor() {
    this._event = new EventClass({ falseBreak: false })
  }

  /**
   * 触发事件
   * @param data 数据
   */
  emit(data: DataType) {
    this._event.emit(this._name, data)
    return this
  }

  /**
   * 监听事件。对同一个 `handler`，可重复多次调用，不会产生副作用。
   * @param handler 事件处理函数
   */
  then(handler: EventOneHandler<DataType>) {
    // 先去掉 handler，避免多次调用产生副作用
    this._event.on(this._name, handler)
    return this
  }

  /**
   * 取消监听事件。对同一个 `handler`，可重复多次调用，不会产生副作用。
   * @param handler 事件处理函数
   */
  off(handler: EventOneHandler<DataType>) {
    this._event.off(this._name, handler)
    return this
  }
}
