import { arrayMap, arrayParse } from '../src'

test('arrayMap', () => {
  // 不用预先判断 null，可以直接传进去，返回空 `map`（即空对象）
  expect(arrayMap(null, '')).toEqual({})
  expect(arrayMap([], '')).toEqual({})

  const list = [
    { name: 'lip', age: 22, sex: 1 },
    { name: 'coco', age: 16, sex: 0 }
  ]

  // 基本用法：属性 => 属性
  expect(arrayMap(list, 'name', 'age')).toEqual({ lip: 22, coco: 16 })
  expect(arrayMap(list, 'name', 'sex')).toEqual({ lip: 1, coco: 0 })

  // 第二、三个参数 `key`、`value` 都支持传函数
  expect(arrayMap(list, 'name', ({ age, sex }) => `age ${age}, sex ${sex}`))
  .toEqual({
    lip: 'age 22, sex 1',
    coco: 'age 16, sex 0'
  })

  expect(
    arrayMap(
      list,
      ({ name, age }) => `${name}_${age}`,
      ({ sex }) => `sex ${sex}`
    )
  ).toEqual({ lip_22: 'sex 1', coco_16: 'sex 0' })

  // 不传第三个参数 `value`，则值为整个 `item`
  expect(arrayMap(list, 'name')).toEqual({ lip: list[0], coco: list[1] })
})

test('arrayParse', () => {
  // 不用预先判断 null，可以直接传进去，返回默认的 `defaultValue` 值: `[]`
  expect(arrayParse(null)).toEqual([])

  // 传数组，原封不动返回
  expect(arrayParse([])).toEqual([])
  expect(arrayParse([1, 2, 3])).toEqual([1, 2, 3])

  // 传 JSON 串
  expect(arrayParse('[1, 2, 3]')).toEqual([1, 2, 3])

  // 非数组 JSON 串，不被接受
  expect(arrayParse('{ "sex": 1 }')).toEqual(['{ "sex": 1 }'])

  // 传字符串
  expect(arrayParse('')).toEqual([])
  expect(arrayParse('1')).toEqual(['1'])
  expect(arrayParse('1,2,3')).toEqual(['1', '2', '3'])

  // 空格与 , 随意添加，不影响结果
  expect(arrayParse(',1, 2,,3,')).toEqual(['1', '2', '3'])

  // 其他类型，抛出异常
  const fakeString = 1 as any
  expect(() => arrayParse(fakeString)).toThrow(Error)
})
