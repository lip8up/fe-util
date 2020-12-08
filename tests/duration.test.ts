import { durationParse, durationFormat, durationAdd, durationSub } from '../src'

test('durationParse', () => {
  expect(() => durationParse(null as any)).toThrow(Error)
  expect(() => durationParse('')).toThrow(Error)
  expect(() => durationParse('08:-08')).toThrow(Error)
  expect(() => durationParse('08:08:08:08')).toThrow(Error)

  expect(durationParse('0')).toEqual(0)
  expect(durationParse('08')).toEqual(8)
  expect(durationParse('88')).toEqual(88)

  expect(durationParse('08:08')).toEqual(8 * 60 + 8)
  expect(durationParse('88:08')).toEqual(88 * 60 + 8)

  expect(durationParse('08:08:08')).toEqual(8 * 60 * 60 + 8 * 60 + 8)
  expect(durationParse('88:88:08')).toEqual(88 * 60 * 60 + 88 * 60 + 8)
})

test('durationFormat', () => {
  expect(() => durationFormat(-1)).toThrow(Error)

  expect(durationFormat(0)).toEqual('00:00')
  expect(durationFormat(8)).toEqual('00:08')
  expect(durationFormat(88)).toEqual('01:28')
  expect(durationFormat(3688)).toEqual('01:01:28')

  expect(durationFormat(0, { hour: false })).toEqual('00:00')
  expect(durationFormat(8, { hour: false })).toEqual('00:08')
  expect(durationFormat(88, { hour: false })).toEqual('01:28')
  expect(durationFormat(3688, { hour: false })).toEqual('61:28')

  expect(durationFormat(0, { hour: true })).toEqual('00:00:00')
  expect(durationFormat(8, { hour: true })).toEqual('00:00:08')
  expect(durationFormat(88, { hour: true })).toEqual('00:01:28')
  expect(durationFormat(3688, { hour: true })).toEqual('01:01:28')
})

test('durationAdd', () => {
  expect(durationAdd('00:00', '00:00')).toEqual('00:00')
  expect(durationAdd('00:01', '00:00')).toEqual('00:01')
  expect(durationAdd('00:01', '00:01')).toEqual('00:02')
  expect(durationAdd('00:08', '00:52')).toEqual('01:00')
  expect(durationAdd('00:08', '00:58')).toEqual('01:06')
  expect(durationAdd('58:08', '58:58')).toEqual('01:57:06')
  expect(durationAdd('58:58:08', '58:58:58')).toEqual('117:57:06')

  expect(durationAdd('00:00', '00:00', { hour: false })).toEqual('00:00')
  expect(durationAdd('00:01', '00:00', { hour: false })).toEqual('00:01')
  expect(durationAdd('00:01', '00:01', { hour: false })).toEqual('00:02')
  expect(durationAdd('00:08', '00:52', { hour: false })).toEqual('01:00')
  expect(durationAdd('00:08', '00:58', { hour: false })).toEqual('01:06')
  expect(durationAdd('58:08', '58:58', { hour: false })).toEqual('117:06')
  expect(durationAdd('58:58:08', '58:58:58', { hour: false })).toEqual('7077:06')

  expect(durationAdd('00:00', '00:00', { hour: true })).toEqual('00:00:00')
  expect(durationAdd('00:01', '00:00', { hour: true })).toEqual('00:00:01')
  expect(durationAdd('00:01', '00:01', { hour: true })).toEqual('00:00:02')
  expect(durationAdd('00:08', '00:52', { hour: true })).toEqual('00:01:00')
  expect(durationAdd('00:08', '00:58', { hour: true })).toEqual('00:01:06')
  expect(durationAdd('58:08', '58:58', { hour: true })).toEqual('01:57:06')
  expect(durationAdd('58:58:08', '58:58:58', { hour: true })).toEqual('117:57:06')
})

test('durationSub', () => {
  expect(durationSub('00:00', '00:00')).toEqual('00:00')
  expect(durationSub('00:01', '00:00')).toEqual('00:01')
  expect(durationSub('00:01', '00:01')).toEqual('00:00')
  expect(() => durationSub('00:08', '00:52')).toThrow(Error)
  expect(durationSub('01:58', '00:50')).toEqual('01:08')
  expect(durationSub('58:58:58', '56:56:08')).toEqual('02:02:50')

  expect(durationSub('00:00', '00:00', { hour: false })).toEqual('00:00')
  expect(durationSub('00:01', '00:00', { hour: false })).toEqual('00:01')
  expect(durationSub('00:01', '00:01', { hour: false })).toEqual('00:00')
  expect(() => durationSub('00:08', '00:52', { hour: false })).toThrow(Error)
  expect(durationSub('01:58', '00:50', { hour: false })).toEqual('01:08')
  expect(durationSub('58:58:58', '56:56:08', { hour: false })).toEqual('122:50')

  expect(durationSub('00:00', '00:00', { hour: true })).toEqual('00:00:00')
  expect(durationSub('00:01', '00:00', { hour: true })).toEqual('00:00:01')
  expect(durationSub('00:01', '00:01', { hour: true })).toEqual('00:00:00')
  expect(() => durationSub('00:08', '00:52', { hour: true })).toThrow(Error)
  expect(durationSub('01:58', '00:50', { hour: true })).toEqual('00:01:08')
  expect(durationSub('58:58:58', '56:56:08', { hour: true })).toEqual('02:02:50')
})

