import extractAttribute from '@/app/components/extractAttribute';
import extractFromXml from '@/app/components/extractFromXml';
import htmlSpecialCharConverter from '@/app/components/htmlSpecialCharConverter';

interface Game {
  id: string;
  name: string;
  yearPublished: string;
}

interface GameDetail {
  id: string;
  primaryName: string;
  koreanName: string;
  thumbnail: string;
  description: string;
  yearPublished: string;
  minPlayers: string;
  maxPlayers: string;
  playingTime: string;
  minAge: string;
  rating: string;
  weight: string;
  bestWith: number | null;
  recommendedWith: number[] | null;
}

export const searchGamesFromBgg = async (name: string): Promise<Game[]> => {
  const response = await fetch(
    `/api/bgg/search?name=${encodeURIComponent(name)}`
  );
  if (!response.ok) {
    throw new Error('Failed to fetch games');
  }
  const { games } = (await response.json()) as { games: Game[] };
  return games;
};

export const searchGames = async (name: string): Promise<Game[]> => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BGG_API}/search?type=boardgame&query=${name}`
  );
  const xml = await res.text();

  const ids = extractAttribute(xml, 'item', 'id');
  const names = extractAttribute(xml, 'name', 'value');
  const years = extractAttribute(xml, 'yearpublished', 'value');

  return ids.map((id, index) => ({
    id,
    name: names[index],
    yearPublished: years[index],
  }));
};

export const getGameDetail = async (id: string): Promise<GameDetail> => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BGG_API}/thing?id=${id}&stats=1`
  );
  const xml = await response.text();

  const itemMatch = xml.match(/<items.*?>[\s\S]*?<item.*?>([\s\S]*?)<\/item>/);
  if (!itemMatch) {
    throw new Error('Game not found');
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
  const bestWithRegex = /<result name="bestwith" value="Best with (\d+)[^"]*"/;
  const recommendedWithRegex =
    /<result name="recommmendedwith" value="Recommended with ([^"]+)"/;

  const bestWith = xml.match(bestWithRegex)?.[1] || '';
  const recommendedWith =
    xml
      .match(recommendedWithRegex)?.[1]
      ?.match(/\d[\d,–\s]*\d/)?.[0]
      ?.replace(/[–\s]/g, ',') || '';

  return {
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
  };
};
