export function isSameOrigin(req: Request): boolean {
  const originHeader = req.headers.get("origin");
  if (!originHeader) return true;
  try {
    const requestOrigin = new URL(req.url).origin;
    return originHeader === requestOrigin;
  } catch {
    return false;
  }
}
