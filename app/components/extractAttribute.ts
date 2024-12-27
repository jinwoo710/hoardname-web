export default function extractAttribute(
  xml: string,
  tag: string,
  attr: string
): string[] {
  const regex = new RegExp(`<${tag}[^>]*${attr}="([^"]*)"`, "g");
  const matches = [...xml.matchAll(regex)];
  return matches.map((match) => match[1]);
}
