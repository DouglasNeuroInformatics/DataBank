/** Return nicely formatted version of cookie header */
function extractCookies(req: Request): Partial<Record<string, string>> {
  const cookies = req.headers.get('cookie');
  return cookies
    ? cookies
        .split(';')
        .map((v) => v.split('='))
        .reduce((acc, v) => {
          acc[decodeURIComponent(v[0].trim())] = decodeURIComponent(v[1].trim());
          return acc;
        }, {} as Record<string, string>)
    : {};
}

/** Attempt to parse the access token (JWT) from the request headers */
export function parseAccessToken(req: Request) {
  const cookies = extractCookies(req);
  return cookies['access-token'] ?? null;
}
