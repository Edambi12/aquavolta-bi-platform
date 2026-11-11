/**
 * Extracts a human-readable message from a value caught in a `catch` block.
 * Handles `Error` instances and plain objects carrying a string `message`
 * (the shape returned by the Supabase client).
 */
export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  if (typeof error === "object" && error !== null && "message" in error) {
    const message = (error as { message: unknown }).message;
    return typeof message === "string" ? message : "";
  }
  return typeof error === "string" ? error : "";
}
