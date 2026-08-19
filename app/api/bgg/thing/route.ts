import { NextResponse } from 'next/server';

import extractAttribute from '@/app/components/extractAttribute';
import extractFromXml from '@/app/components/extractFromXml';
import htmlSpecialCharConverter from '@/app/components/htmlSpecialCharConverter';
import { fetchBggXml } from '@/app/api/bgg/bggClient';

export const runtime = 'edge';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'id is required' }, { status: 400 });
    }

    const xml = await fetchBggXml('/thing', { id, stats: '1' }, 86400);

    const itemMatch = xml.match(
      /<items.*?>[\s\S]*?<item.*?>([\s\S]*?)<\/item>/
    );
    if (!itemMatch) {
      return NextResponse.json({ error: 'Game not found' }, { status: 404 });
    }

    const itemContent = itemMatch[1];
    const names: { type: string; value: string }[] = [];
    const nameRegex =
      /<name\s+type="([^"]+)"\s+sortindex="\d+"\s+value="([^"]+)"/g;
    let nameMatch;

    while ((nameMatch = nameRegex.exec(itemContent)) !== null) {
      names.push({
        type: nameMatch[1],
        value: nameMatch[2],
      });
    }

    const primaryName =
      names.find((name) => name.type === 'primary')?.value || '';
    const koreanName =
      names.find(
        (name) => name.type === 'alternate' && /[가-힣]/.test(name.value)
      )?.value || '';
    const bestWithRegex =
      /<result name="bestwith" value="Best with (\d+)[^"]*"/;
    const recommendedWithRegex =
      /<result name="recommmendedwith" value="Recommended with ([^"]+)"/;

    const bestWith = xml.match(bestWithRegex)?.[1] || '';
    const recommendedWith =
      xml
        .match(recommendedWithRegex)?.[1]
        ?.match(/\d[\d,–\s]*\d/)?.[0]
        ?.replace(/[–\s]/g, ',') || '';

    return NextResponse.json({
      id,
      primaryName: htmlSpecialCharConverter(primaryName),
      koreanName: htmlSpecialCharConverter(koreanName),
      thumbnail: extractFromXml(xml, 'thumbnail')[0] || '',
      description: extractFromXml(xml, 'description')[0] || '',
      yearPublished: extractAttribute(xml, 'yearpublished', 'value')[0] || '',
      minPlayers: extractAttribute(xml, 'minplayers', 'value')[0] || '',
      maxPlayers: extractAttribute(xml, 'maxplayers', 'value')[0] || '',
      playingTime: extractAttribute(xml, 'playingtime', 'value')[0] || '',
      minAge: extractAttribute(xml, 'minage', 'value')[0] || '',
      rating: extractAttribute(xml, 'average', 'value')[0] || '',
      weight: extractAttribute(xml, 'averageweight', 'value')[0] || '',
      bestWith: bestWith ? parseInt(bestWith) : null,
      recommendedWith: recommendedWith
        ? recommendedWith.split(',').map((n) => parseInt(n.trim()))
        : [],
    });
  } catch (error) {
    console.error('BGG thing error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch game detail' },
      { status: 500 }
    );
  }
}
