export function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export function isNullableString(
  value: unknown,
): value is string | null | undefined {
  return value === undefined || value === null || typeof value === "string";
}

export function isNullableBoolean(
  value: unknown,
): value is boolean | null | undefined {
  return value === undefined || value === null || typeof value === "boolean";
}
