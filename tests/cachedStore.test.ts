import { cachedStore } from '../src'

test('cachedStore', () => {
  // 声明两个存储库，两者互不相关
  const store1 = cachedStore()
  const store2 = cachedStore()

  // 第一次读取，必须提供第二个参数
  const key1 = store1('key1', () => 'value1')
  expect(key1).toBe('value1')

  // 再次读取，不必传第二个参数
  const key1Again = store1('key1')
  expect(key1Again).toBe('value1')

  // 不提供第二个参数，则返回 undefined
  const key2 = store1('key2')
  expect(key2).toBeUndefined()

  // 在 store2 中存储一个同名 key1，但值不同
  const key1InStore2 = store2('key1', () => 'key1InStore2')
  expect(key1InStore2).toBe('key1InStore2')

  // 两个 store 互不影响，store1 中的 key1 的值仍为 value1
  expect(store1('key1')).toBe('value1')
})
