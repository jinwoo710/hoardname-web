export default function extractFromXml(xml: string, tag: string): string[] {
  const regex = new RegExp(`<${tag}[^>]*>([^<]*)<\/${tag}>`, "g");
  const matches = [...xml.matchAll(regex)];
  return matches.map((match) => match[1]);
}
