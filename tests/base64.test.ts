import {
  base64Encode,
  base64Decode,
  safeUrlBase64Encode,
  safeUrlBase64Decode,
  jsonSafeUrlBase64Encode,
  jsonSafeUrlBase64Decode
} from '../src'

const list = [
  '',
  'a',
  'ab',
  'abc',
  'abcd',
  'abcde',
  'abcdef',
  'Hi, Python, U are very good!',
  '~!@#$%^&*()-_=+[]{}()|\\|;:\'",.<>?/±°²\x00\x80\xa0\xa1\xb0\xb1\xc0\xc1d0d1\xe0e1\f0\f1\ff',
  '春江潮水连海平，海上明月共潮生。',
  '你是🟢你是🔥你是永远的🟣我只❤️你'
]

test('base64', () => {
  for (const item of list) {
    const base = base64Encode(item)
    const text = base64Decode(base)
    expect(text).toEqual(item)
  }
})

test('safeUrlBase64', () => {
  for (const item of list) {
    const base = safeUrlBase64Encode(item)
    const text = safeUrlBase64Decode(base)
    expect(text).toEqual(item)
  }
})

test('jsonSafeUrlBase64', () => {
  const objectList = [
    ...list,
    { 字符串: list[0], other: true, number: 99, list, nil: null },
    { '🔥🌹': list[1], other: false, count: 66, deep: { nil: null, list } },
    { '🔥🔥🔥': list[1], other: false, count: 66, deep: { nil: null, list } }
  ]
  for (const item of objectList) {
    const base = jsonSafeUrlBase64Encode(item)
    const obj = jsonSafeUrlBase64Decode(base)
    expect(obj).toEqual(item)
  }
})
