export default function Footer() {
  return (
    <footer className="w-full py-4 text-center text-xs text-muted-foreground pb-[calc(1rem+56px+env(safe-area-inset-bottom))] lg:pb-4">
      <a
        href="https://boardgamegeek.com"
        target="_blank"
        rel="noopener noreferrer"
        className="hover:underline"
      >
        Powered by BoardGameGeek
      </a>
    </footer>
  );
}
