export function escapeHtml(value: unknown): string {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

export function escapeAttribute(value: unknown): string {
  return escapeHtml(value);
}

export function escapeJsString(value: unknown): string {
  return JSON.stringify(String(value ?? ""));
}
