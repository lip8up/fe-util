import { cssColorOpacity } from '../src'

test('cssColorOpacity', () => {
  expect(cssColorOpacity(50, '#000')).toEqual('rgba(0, 0, 0, 0.5)')
  expect(cssColorOpacity(30, '#000')).toEqual('rgba(0, 0, 0, 0.3)')
  expect(cssColorOpacity(88, '#080')).toEqual('rgba(0, 136, 0, 0.88)')
  expect(cssColorOpacity(88, '#c8d808', { toScale: 66 })).toEqual('rgba(200, 216, 8, 1)')
  expect(cssColorOpacity(88, '#c8d808', { toScale: 89 })).toEqual('rgba(200, 216, 8, 0.98876)')
  expect(cssColorOpacity(-8, '#c8d808', { toScale: 89 })).toEqual('rgba(200, 216, 8, 0)')
})
