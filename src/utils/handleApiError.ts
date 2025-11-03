export function handleApiError(data: unknown): string {
  if (!data) return "UNEXPECTED_ERROR";

  if (typeof data === "object" && data !== null) {
    const maybeError = data as { title?: string; detail?: string };
    const message =
      maybeError.title?.trim?.() ||
      maybeError.detail?.trim?.() ||
      "";
    return message || "UNEXPECTED_ERROR";
  }


  const message = String(data).trim();
  return message || "UNEXPECTED_ERROR";
}
