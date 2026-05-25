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
        <a href="/">
          {/* On mobile (transparent nav over dark hero): show logo in original colours */}
          <img
            src="/brand/Inner Circle Landscap.svg"
            alt="4Ever Inner Circle"
            className="h-9 w-auto block md:hidden"
          />
          {/* On desktop (cream background): invert + hue-rotate keeps mauve as mauve, turns white dark */}
          <img
            src="/brand/Inner Circle Landscap.svg"
            alt="4Ever Inner Circle"
            className="h-9 w-auto hidden md:block"
            style={{ filter: 'invert(1) hue-rotate(180deg)' }}
          />
        </a>
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
      </div>
    </nav>
  );
}
