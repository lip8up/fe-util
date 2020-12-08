import EventChain, { EventChainOptions } from './EventChain'
import { debounce } from 'lodash'
import raf from 'raf'

/**
 * 设置元素节点或 window 的竖向滚动位置
 * @param el 元素节点或 window
 * @param top 滚动位置
 */
export function scrollSetTop(el: HTMLElement | Window, top: number) {
  if ('scrollTop' in el) {
    // 对于元素节点
    el.scrollTop = top
  } else {
    // 对于 window 对象
    el.scrollTo(el.scrollX, top)
  }
}

/**
 * 获取页面根的竖向滚动位置，即 body 的竖向滚动位置
 */
export function scrollGetRootTop() {
  return window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0
}

/**
 * 设置页面根的竖向滚动位置，即 body 的竖向滚动位置
 * @param top 滚动位置
 */
export function scrollSetRootTop(top: number) {
  scrollSetTop(window, top)
  scrollSetTop(document.body, top)
}

/**
 * scrollWatch 函数选项
 */
export interface ScrollWatchOptions extends EventChainOptions {
  /** 节流毫秒数，默认 10 */
  throttle?: number
}

const eventNames = ['scroll', 'resize']

interface ScrollWatchEvent extends ScrollWatchOptions {
  event: EventChain
}

const scrollWatchEvents: ScrollWatchEvent[] = []

/**
 * 监听滚动改变（scroll、resize 等事件导致的滚动改变）
 * 并且节流事件发生的时间间隔，默认 10 毫秒
 *
 * 使用方法：
 * ```js
 * scrollWatch().then(() => {
 *   // 随着页面滚动，该回调函数会被不断调用
 * })
 * ```
 * 注意，这里虽然也有 `then`，但没有 `catch`，它也不是 `Promise`（`Promise` 的 `then` 也不会不断调用）
 */
export function scrollWatch({
  throttle = 10,
  handlerThis
}: ScrollWatchOptions = {}) {
  let item = scrollWatchEvents.find(it => it.throttle == throttle && it.handlerThis == handlerThis)
  if (item == null) {
    const event = new EventChain({ handlerThis })
    const handler = debounce(() => event!.emit(), throttle)
    eventNames.forEach(name => window.addEventListener(name, handler))
    handler()
    // 缓存之
    item = { throttle, handlerThis, event }
    scrollWatchEvents.push(item)
  }
  return item.event
}

/**
 * 监听页面根的竖向滚动位置
 *
 * 使用方法：
 * ```js
 * scrollUseRootTop().then(top => {
 *   // 随着页面滚动，该回调函数会被不断调用，top 不断改变
 * })
 * ```
 * 注意，这里虽然也有 `then`，但没有 `catch`，它也不是 `Promise`（`Promise` 的 `then` 也不会不断调用）
 */
export function scrollUseRootTop(options: ScrollWatchOptions = {}) {
  return scrollWatch(options).then(() => {
    const top = scrollGetRootTop()
    // 返回的值，会被作为参数，传给下一个 `then` 使用，
    // 这是类 `EventChain` 的特性，参见 `scrollWatch` 的实现
    return top
  })
}

/**
 * 动画滚动 top 到某个位置
 * @param to 位置
 * @param duration 动画进行时间，毫秒数，默认 288
 */
export function scrollTopTo(to: number, duration = 288) {
  return new Promise(resolve => {
    let current = scrollGetRootTop()
    const isDown = current < to
    const frames = duration === 0 ? 1 : Math.round(duration / 16)
    const step = (to - current) / frames

    const animate = () => {
      current += step

      if (isDown && current > to || !isDown && current < to) {
        current = to
      }

      scrollSetRootTop(current)

      if (isDown && current < to || !isDown && current > to) {
        raf(animate)
      } else {
        resolve()
      }
    }

    animate()
  })
}

const getElementTop = (el: HTMLElement) => {
  return el.getBoundingClientRect().top + scrollGetRootTop()
}

/**
 * 竖向滚动元素到视图内
 * @param el 要滚动的元素
 * @param box 容器元素
 * @param duration 动画进行时间，毫秒数，默认 288
 */
export function scrollTopIntoView(
  el: HTMLElement,
  box: HTMLElement,
  duration = 288
) {
  const boxTop = parseInt(getComputedStyle(box).top, 10)
  const boxBottom = boxTop + box.offsetHeight
  const top = Math.ceil(getElementTop(el)) - boxBottom
  return scrollTopTo(top, duration)
}
