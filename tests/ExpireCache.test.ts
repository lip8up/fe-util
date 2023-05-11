import { ExpireCache, delay } from '../src'

test('ExpireCache', async () => {
  const cache = new ExpireCache(99)

  cache.set('foo', 'bar')
  expect(cache.get('foo')).toEqual('bar')
  await delay(199)
  expect(cache.get('foo')).toBeUndefined()
})
