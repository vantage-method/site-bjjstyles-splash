import { useState } from 'react';
import { NAV_ITEMS } from '../../lib/constants';

export default function MobileNav({ currentPath }: { currentPath: string }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(!open)}
        className="md:hidden flex flex-col justify-center items-center w-10 h-10 gap-1.5"
        aria-label={open ? 'Close menu' : 'Open menu'}
        aria-expanded={open}
      >
        <span
          className={`block w-6 h-0.5 bg-brand-white transition-all duration-200 ${
            open ? 'rotate-45 translate-y-2' : ''
          }`}
        />
        <span
          className={`block w-6 h-0.5 bg-brand-white transition-opacity duration-200 ${
            open ? 'opacity-0' : ''
          }`}
        />
        <span
          className={`block w-6 h-0.5 bg-brand-white transition-all duration-200 ${
            open ? '-rotate-45 -translate-y-2' : ''
          }`}
        />
      </button>

      {open && (
        <div className="fixed inset-0 top-16 z-40 bg-brand-dark/95 backdrop-blur-sm md:hidden">
          <nav className="flex flex-col items-center pt-12 gap-6">
            {NAV_ITEMS.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={`text-lg tracking-wide transition-colors duration-200 ${
                  currentPath === item.href
                    ? 'text-brand-red'
                    : 'text-brand-white hover:text-brand-red'
                }`}
              >
                {item.label}
              </a>
            ))}
          </nav>
        </div>
      )}
    </>
  );
}
