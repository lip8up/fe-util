import { EventChain } from '../src'

test('basic', () => {
  const event = new EventChain

  let bit = 0

  event.then((one, two) => {
    expect(one).toEqual(1 << bit)
    expect(two).toEqual(2 << bit)
    return 3 << bit
  })
  .then(three => {
    expect(three).toEqual(3 << bit)
    return [4 << bit, 5 << bit]
  })
  .then(list => {
    expect(list).toEqual([4 << bit, 5 << bit])
  })
  .emit(1, 2)

  bit = 8
  event.emit(1 << bit, 2 << bit)
})

test('off', () => {
  const event = new EventChain

  let count = 0
  const handler = () => ++count

  event.then(handler).emit()
  expect(count).toEqual(1)
  event.off(handler).emit()
  expect(count).toEqual(1)
})
