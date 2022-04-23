/**
 * 尝试解析 JSON，解析不成功，返回默认值 null
 * @param json JSON 字符串
 */
export default function tryParseJson<T = any>(json: string | null | undefined): T | null
/**
 * 尝试解析 JSON，解析不成功，返回默认值 {}
 * @param json JSON 字符串
 * @param defaultValue 默认值，默认为 {}
 */
export default function tryParseJson(json: string | null | undefined, defaultValue: Record<string, never>): any
/**
 * 尝试解析 JSON，解析不成功，返回默认值
 * @param json JSON 字符串
 * @param defaultValue 默认值
 */
export default function tryParseJson<T>(json: string | null | undefined, defaultValue: T): T
export default function tryParseJson(json: string | null | undefined, defaultValue: any = null) {
  try {
    return json != null && json !== ''
      ? JSON.parse(json)
      : defaultValue
  } catch {
    return defaultValue
  }
}
