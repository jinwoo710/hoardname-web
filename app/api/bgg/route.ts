import { NextResponse } from "next/server";
import { getGameDetail } from "@/app/api/bgg/bgg";
export const runtime = "edge";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "BGG ID is required" },
        { status: 400 }
      );
    }

    const gameDetail = await getGameDetail(id);
    return NextResponse.json({ data: gameDetail });
  } catch (error) {
    if (error instanceof Error && error.message === "Game not found") {
      return NextResponse.json({ error: "Game not found" }, { status: 404 });
    }
    return NextResponse.json(
      { error: "Failed to fetch game details" },
      { status: 500 }
    );
  }
}
