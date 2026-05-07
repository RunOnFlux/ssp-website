type AnyObject = Record<string, unknown>

function isPlainObject(v: unknown): v is AnyObject {
  return typeof v === 'object' && v !== null && !Array.isArray(v) && Object.getPrototypeOf(v) === Object.prototype
}

export function deepMerge<T extends AnyObject>(base: T, override: AnyObject): T {
  const result: AnyObject = { ...base }
  for (const [key, overrideValue] of Object.entries(override)) {
    if (overrideValue == null) continue
    const baseValue = result[key]
    if (isPlainObject(baseValue) && isPlainObject(overrideValue)) {
      result[key] = deepMerge(baseValue, overrideValue)
    } else {
      result[key] = overrideValue
    }
  }
  return result as T
}
