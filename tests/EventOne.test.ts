import { EventOne } from '../src'

test('basic', () => {
  const event = new EventOne<number>()

  event
    .then(one => {
      expect(one).toEqual(1)
    })
    .emit(1)
})

test('off', () => {
  const event = new EventOne()

  let count = 0
  const handler = () => ++count

  event.then(handler).emit()
  expect(count).toEqual(1)
  event.then(handler).emit()
  expect(count).toEqual(2)
  event.emit()
  expect(count).toEqual(3)
  event.off(handler).emit()
  expect(count).toEqual(3)
})
