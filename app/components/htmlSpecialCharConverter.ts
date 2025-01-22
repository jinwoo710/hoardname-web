export default function htmlSpecialCharConverter(str: string): string {
  return str
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&#39;/g, "'")
    .replace(/&#039;/g, "'")
    .replace(/&nbsp;/g, " ")
    .replace(/&#35;/g, "#")
    .replace(/&#035;/g, "#")
    .replace(/&copy;/g, "©")
    .replace(/&reg;/g, "®")
    .replace(/&trade;/g, "TM")
    .replace(/&euro;/g, "€")
    .replace(/&pound;/g, "£")
    .replace(/&cent;/g, "¢")
    .replace(/&yen;/g, "¥")
    .replace(/&sect;/g, "§");
}
