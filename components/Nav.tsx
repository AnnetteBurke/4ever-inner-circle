export default function Nav() {
  const links = [
    { href: '#dashboard', label: 'Dashboard' },
    { href: '#journey', label: 'Journey' },
    { href: '#people', label: 'People' },
    { href: '#mood', label: 'Mood' },
    { href: '#edit', label: 'The Edit' },
    { href: '#calm', label: 'Calm Corner' }
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-transparent md:bg-cream/95 md:backdrop-blur-md md:border-b md:border-hairline">
      <div className="max-w-container mx-auto flex items-center justify-between px-12 py-5">
        <div className="brand-mark">
          <span className="brand-mark__four text-[30px]">4ever</span>
          <span className="brand-mark__pill">Inner Circle</span>
        </div>
        <div className="hidden md:flex gap-9">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-xs tracking-small-caps uppercase text-charcoal hover:text-mauve transition-colors"
            >
              {link.label}
            </a>
          ))}
        </div>
        <div className="hidden md:block text-[11px] tracking-small-caps uppercase text-mauve font-medium">
          Sarah &amp; James
        </div>
      </div>
    </nav>
  );
}
