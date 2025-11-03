export function handleApiError(data: any): string {
   
    if (!data) return "UNEXPECTED_ERROR";


    const message = (typeof data === "object"? data.title?.trim?.() || data.detail?.trim?.(): String(data).trim()) || "";
    if (!message) return "UNEXPECTED_ERROR";

    return message;
}