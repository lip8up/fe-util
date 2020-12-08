/**
 * 尝试解析 JSON，解析不成功，返回默认值
 * @param json JSON 字符串
 * @param defaultValue 默认值，默认为 null
 */
export default function tryParseJson(
  json: string | null,
  defaultValue: any = null
) {
  try {
    return json != null && json !== ''
      ? JSON.parse(json)
      : defaultValue
  } catch (ex) {
    return defaultValue
  }
}
