import { NextResponse } from 'next/server';

import extractAttribute from '@/app/components/extractAttribute';
import { fetchBggXml } from '@/app/api/bgg/bggClient';

export const runtime = 'edge';

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

    const xml = await fetchBggXml(
      '/search',
      { type: 'boardgame', query: name },
      300
    );

    const ids = extractAttribute(xml, 'item', 'id');
    const names = extractAttribute(xml, 'name', 'value');
    const years = extractAttribute(xml, 'yearpublished', 'value');

    const games = ids.map((id, index) => ({
      id,
      name: names[index],
      yearPublished: years[index],
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
