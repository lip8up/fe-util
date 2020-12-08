import { EventClass } from '../src'

const eventName = 'OneEvent'

// 测试 falseBreak 选项：1. 默认 falseBreak 为 true
test('falseBreak:true', () => {
  let handler1Called = false
  let handler2Called = false
  let handler3Called = false
  const handler13 = () => handler3Called = true
  const event = new EventClass()
  event.on(eventName, () => handler1Called = true)
  event.on(eventName, () => { handler2Called = true; return false })
  event.on(eventName, () => handler3Called = true)
  event.emit(eventName)
  expect(handler1Called).toEqual(true)
  expect(handler2Called).toEqual(true)
  expect(handler3Called).toEqual(false)
})

// 测试 falseBreak 选项：1. 默认 falseBreak 为 true
test('falseBreak:false', () => {
  let handler1Called = false
  let handler2Called = false
  let handler3Called = false
  const handler13 = () => handler3Called = true
  const event = new EventClass({ falseBreak: false })
  event.on(eventName, () => handler1Called = true)
  event.on(eventName, () => { handler2Called = true; return false })
  event.on(eventName, () => handler3Called = true)
  event.emit(eventName)
  expect(handler1Called).toEqual(true)
  expect(handler2Called).toEqual(true)
  expect(handler3Called).toEqual(true)
})

/**********************************************************************
 * chained 选项的测试，与 EventChain 类重复，直接使用 EventChain 类的测试即可
 **********************************************************************/

// 测试 preventRepeat 选项：1. 默认 preventRepeat 为 true
test('preventRepeat:true', () => {
  let count = 0
  const handler = () => ++count
  const event = new EventClass()
  event.on(eventName, handler)
  event.on(eventName, handler)
  event.emit(eventName)
  expect(count).toEqual(1)
})

// 测试 preventRepeat 选项：2. 设置 preventRepeat 为 false
test('preventRepeat:false', () => {
  let count = 0
  const handler = () => ++count
  const event = new EventClass({ preventRepeat: false })
  event.on(eventName, handler)
  event.on(eventName, handler)
  event.emit(eventName)
  expect(count).toEqual(2)
})

// 测试 handlerThis 选项
test('handlerThis', () => {
  const nameKey = Symbol('name')
  const nameValue = 'testHandlerThis'

  class Test {
    [nameKey] = nameValue

    sayNull() {
      expect(this[nameKey]).toBeUndefined()
    }

    sayName() {
      expect(this[nameKey]).toEqual(nameValue)
    }
  }

  const test = new Test

  const event1 = new EventClass
  event1.on(eventName, test.sayNull)
  event1.emit(eventName)

  const event2 = new EventClass({ handlerThis: test })
  event2.on(eventName, test.sayName)
  event2.emit(eventName)
})

