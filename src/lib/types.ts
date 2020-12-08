///
/// 通用类型，非通用的不要声明在这里
///

/**
 * 通用 Map 泛型，为了与新标准中的 Map 类相区分，这里使用名称 MapType
 */
export interface MapType<T = any> {
  [key: string]: T
  [index: number]: T
}

/**
 * 可取消的事件
 */
export interface CancelableEvent {
  /** 是否取消 */
  canceled: boolean
}

/**
 * 类型 `Type` 本身，或者一个返回 `Type` 类型的函数
 *
 * @example
 *
 * ```ts
 * type GetString = GetType<string>
 * const aa: GetString = 'xxx'
 * const bb: GetString = () => 'xxx'
 * const cc: GetString = param => 'xxx'
 * const dd: GetType<string, Route> => route => 'xxx'
 * // 禁止任何参数，第二个类型参数传 void
 * const ee: GetType<string, void> = () => 'xxx'
 * ```
 */
export type GetType<Type = any, ParamType = any> = Type | ((param: ParamType) => Type)
