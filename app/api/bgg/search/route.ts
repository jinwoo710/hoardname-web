import { NextResponse } from "next/server";
import extractAttribute from "@/app/components/extractAttribute";
export const runtime = "edge";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const name = searchParams.get("name");
  const res = await fetch(
    `https://boardgamegeek.com/xmlapi2/search?query=${name}`
  );
  const xml = await res.text();

  const ids = extractAttribute(xml, "item", "id");
  const names = extractAttribute(xml, "name", "value");
  const years = extractAttribute(xml, "yearpublished", "value");

  const games = ids.map((id, index) => ({
    id,
    name: names[index],
    yearPublished: years[index],
  }));

  return NextResponse.json({ data: games });
}
