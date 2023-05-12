import { ExpireCache, delay } from '../src'

test('ExpireCache', async () => {
  const cache = new ExpireCache(99)

  cache.set('foo', 'bar')
  expect(cache.get('foo')).toEqual('bar')
  await delay(199)
  expect(cache.get('foo')).toBeUndefined()

  const key = 'object'
  const value = { a: 1, b: { c: 2, d: 3, e: { f: 4, g: 5, h: 6 } } }
  cache.set(key, value)
  expect(cache.get(key)).toEqual(value)
  cache.clean(0)
  expect(cache.get(key)).toBeUndefined()
})
