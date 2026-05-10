export function isAdminSecretValid(secret: string | null | undefined) {
  const configured = process.env.ADMIN_SECRET;

  if (!configured) {
    return true;
  }

  return Boolean(secret && secret === configured);
}

export function getAdminSecretFromRequest(request: Request) {
  const headerSecret = request.headers.get("x-admin-secret");
  const urlSecret = new URL(request.url).searchParams.get("admin_secret");
  return headerSecret ?? urlSecret;
}
