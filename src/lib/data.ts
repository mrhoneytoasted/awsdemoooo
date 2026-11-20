export type JsonObject = Record<string, unknown>;

export type TelemetrySample = {
  sample_id: string | number;
  device_id: string;
  measured_at: string | null;
  received_at: string;
  raw_payload: JsonObject;
};

export type Station = JsonObject & { id: string | number; name?: string | null };

export function asObject(value: unknown): JsonObject {
  return value !== null && typeof value === "object" && !Array.isArray(value) ? value as JsonObject : {};
}

export function asNumber(value: unknown): number | null {
  if (value === null || value === undefined || value === "") return null;
  const parsed = typeof value === "number" ? value : Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

export function formatNumber(value: unknown, fractionDigits = 0): string {
  const number = asNumber(value);
  return number === null ? "—" : number.toLocaleString("en-US", { maximumFractionDigits: fractionDigits });
}

export function formatDate(value: unknown): string {
  if (typeof value !== "string" || !value) return "Not provided";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : new Intl.DateTimeFormat("en-GB", { dateStyle: "medium", timeStyle: "short", timeZone: "Asia/Bangkok" }).format(date);
}

export function formatDateWithSeconds(value: unknown): string {
  if (typeof value !== "string" || !value) return "Not provided";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : new Intl.DateTimeFormat("en-GB", { dateStyle: "medium", timeStyle: "medium", timeZone: "Asia/Bangkok" }).format(date);
}

export function pick(object: JsonObject, ...keys: string[]): unknown {
  for (const key of keys) if (object[key] !== undefined) return object[key];
  return undefined;
}
