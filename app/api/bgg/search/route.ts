import { NextResponse } from 'next/server';

export const runtime = 'edge';

interface BggSearchItem {
  objectid: string;
  name: string;
  yearpublished: string;
  objecttype: string;
}

interface BggSearchResponse {
  items: BggSearchItem[];
  total: number;
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const name = searchParams.get('name');

    if (!name) {
      return NextResponse.json(
        { error: 'Search query is required' },
        { status: 400 }
      );
    }

    const res = await fetch(
      `https://boardgamegeek.com/search/boardgame/ajax?q=${encodeURIComponent(
        name
      )}&showcount=50&nosession=1`,
      {
        headers: {
          Accept: 'application/json',
          'User-Agent': 'BoardGameHoardName/1.0',
        },
        next: { revalidate: 300 },
      }
    );

    if (!res.ok) {
      throw new Error(`BGG API responded with status: ${res.status}`);
    }

    const data = (await res.json()) as BggSearchResponse;

    const games = data.items.map((item) => ({
      id: item.objectid,
      name: item.name,
      yearPublished: item.yearpublished,
    }));

    return NextResponse.json({ games });
  } catch (error) {
    console.error('BGG search error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch games' },
      { status: 500 }
    );
  }
}
