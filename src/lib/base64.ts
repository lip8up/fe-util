import tryParseJson from './tryParseJson'

/**
 * 将任意字符编码成 base64 串。
 */
export const base64Encode = (text: string): string => {
  const bytes = new TextEncoder().encode(text)
  return btoa(String.fromCharCode(...new Uint8Array(bytes)))
}

/**
 * 对 base64Encode 的解码。
 */
export const base64Decode = (text: string): string => {
  const bytes = Uint8Array.from(atob(text), c => c.charCodeAt(0))
  return new TextDecoder().decode(bytes)
}

/**
 * 将任意字符编码成 url 安全的 base64 串。
 */
export const safeUrlBase64Encode = (text: string): string => {
  return base64Encode(text).replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '')
}

/**
 *  对 safeUrlBase64Encode 的解码。
 */
export const safeUrlBase64Decode = (text: string): string => {
  text = text.replace(/\-/g, '+').replace(/_/g, '/')
  const padding = '='.repeat((4 - (text.length % 4)) % 4)
  return base64Decode(text + padding)
}

/**
 * 将任意对象转成 json 串，然后编码成 url 安全的 base64 串。
 */
export const jsonSafeUrlBase64Encode = (value: any): string => {
  const text = JSON.stringify(value)
  return safeUrlBase64Encode(text)
}

/**
 * 尝试 safeUrlBase64Encode 解码，并将结果解析为 JSON 对象，解析不成功，返回默认值 null
 * @param text url 安全的 base64 字符串
 */
export function jsonSafeUrlBase64Decode<T = any>(text: string): T | null
/**
 * 尝试 safeUrlBase64Encode 解码，并将结果解析为 JSON 对象，解析不成功，返回默认值 {}
 * @param text url 安全的 base64 字符串
 * @param defaultValue 默认值，默认为 {}
 */
export function jsonSafeUrlBase64Decode(text: string, defaultValue: Record<string, never>): any
/**
 * 尝试 safeUrlBase64Encode 解码，并将结果解析为 JSON 对象，解析不成功，返回默认值
 * @param text url 安全的 base64 字符串
 * @param defaultValue 默认值
 */
export function jsonSafeUrlBase64Decode<T>(text: string, defaultValue: T): T
export function jsonSafeUrlBase64Decode(text: string, defaultValue: any = null) {
  const json = safeUrlBase64Decode(text)
  return tryParseJson(json, defaultValue)
}
