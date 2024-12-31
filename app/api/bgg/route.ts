import extractAttribute from "@/app/components/extractAttribute";
import extractFromXml from "@/app/components/extractFromXml";
import { NextResponse } from "next/server";
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

    const response = await fetch(
      `https://boardgamegeek.com/xmlapi2/thing?id=${id}&stats=1`
    );
    const xml = await response.text();

    const itemMatch = xml.match(
      /<items.*?>[\s\S]*?<item.*?>([\s\S]*?)<\/item>/
    );
    if (!itemMatch) {
      return NextResponse.json({ error: "Game not found" }, { status: 404 });
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
      names.find((name) => name.type === "primary")?.value || "";
    const koreanName =
      names.find(
        (name) => name.type === "alternate" && /[가-힣]/.test(name.value)
      )?.value || "";

    const thumbnail = extractFromXml(xml, "thumbnail")[0] || "";
    const image = extractFromXml(xml, "image")[0] || "";
    const minPlayers = extractAttribute(xml, "minplayers", "value")[0] || "0";
    const maxPlayers = extractAttribute(xml, "maxplayers", "value")[0] || "0";
    const weight = extractAttribute(xml, "averageweight", "value")[0] || "0";
    const bestWithRegex =
      /<result name="bestwith" value="Best with (\d+)[^"]*"/;
    const recommendedWithRegex =
      /<result name="recommmendedwith" value="Recommended with ([^"]+)"/;
    const bestWith = xml.match(bestWithRegex)?.[1] || "";
    const recommendedWith =
      xml
        .match(recommendedWithRegex)?.[1]
        ?.match(/\d[\d,–\s]*\d/)?.[0]
        ?.replace(/[–\s]/g, ",") || "";

    return NextResponse.json({
      name: koreanName || primaryName,
      originalName: primaryName,
      thumbnailUrl: thumbnail,
      imageUrl: image,
      minPlayers: parseInt(minPlayers),
      maxPlayers: parseInt(maxPlayers),
      weight: parseFloat(weight),
      bestWith: bestWith ? parseInt(bestWith) : null,
      recommendedWith: recommendedWith
        ? recommendedWith.split(",").map((n) => parseInt(n.trim()))
        : [],
    });
  } catch (error) {
    console.error("Failed to fetch BGG data:", error);
    return NextResponse.json(
      { error: "Failed to fetch data from BoardGameGeek" },
      { status: 500 }
    );
  }
}
