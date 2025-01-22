import { NextResponse } from "next/server";
import { searchGames } from "@/app/api/bgg/bgg";
export const runtime = "edge";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const name = searchParams.get("name");

    if (!name) {
      return NextResponse.json(
        { error: "Search query is required" },
        { status: 400 }
      );
    }

    const games = await searchGames(name);
    return NextResponse.json({ data: games });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to search games" },
      { status: 500 }
    );
  }
}
