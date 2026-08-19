const BGG_API_BASE =
  process.env.BGG_API_BASE || 'https://boardgamegeek.com/xmlapi2';

export async function fetchBggXml(
  path: string,
  params: Record<string, string>,
  revalidateSeconds: number
): Promise<string> {
  const token = process.env.BGG_API_TOKEN;
  if (!token) {
    throw new Error('BGG_API_TOKEN is not set');
  }

  const url = new URL(`${BGG_API_BASE}${path}`);
  for (const [key, value] of Object.entries(params)) {
    url.searchParams.set(key, value);
  }

  const res = await fetch(url.toString(), {
    headers: {
      Authorization: `Bearer ${token}`,
      'User-Agent': 'BoardGameHoardName/1.0',
    },
    next: { revalidate: revalidateSeconds },
  });

  if (!res.ok) {
    throw new Error(`BGG API responded with status: ${res.status}`);
  }

  return res.text();
}
