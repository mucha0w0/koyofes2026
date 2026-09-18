'use client';

import { ChevronDown, Menu, X } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

import { getNavSections, type ResolvedNavSection } from '@/lib/config/nav';

function DropdownMenu({ item }: { item: ResolvedNavSection }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative" onMouseEnter={() => setIsOpen(true)} onMouseLeave={() => setIsOpen(false)}>
      <button
        aria-expanded={isOpen}
        aria-haspopup="true"
        className="flex items-center gap-1 rounded-md px-4 py-2 text-sm font-medium text-ink hover:bg-mist-hover transition-colors"
      >
        {item.label}
        <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      <div
        className={`absolute top-full right-0 min-w-50 rounded-md bg-card overflow-hidden transition-all duration-200 ${
          isOpen ? 'opacity-100 translate-y-0 visible' : 'opacity-0 -translate-y-2 invisible'
        }`}
      >
        <div className="p-1">
          {item.items.map((subItem) => (
            <Link
              key={subItem.href}
              className="block rounded-md px-4 py-2.5 text-sm text-ink hover:bg-mist-hover transition-colors"
              href={subItem.href}
            >
              {subItem.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

function MobileMenu({
  isOpen,
  navItems,
  onClose,
}: {
  isOpen: boolean;
  navItems: ResolvedNavSection[];
  onClose: () => void;
}) {
  return (
    <div
      className={`fixed inset-0 z-50 bg-card transition-transform duration-300 ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      }`}
    >
      <div className="flex items-center justify-between px-4 h-16">
        <span className="font-display text-lg font-bold text-ink">こうよう祭</span>
        <button
          aria-label="メニューを閉じる"
          className="flex size-11 items-center justify-center rounded-md hover:bg-mist-hover transition-colors"
          onClick={onClose}
        >
          <X className="h-6 w-6" />
        </button>
      </div>
      <nav className="p-4 overflow-y-auto max-h-[calc(100vh-4rem)]">
        <Accordion collapsible className="w-full" type="single">
          {navItems.map((item) => (
            <AccordionItem key={item.id} value={item.id}>
              <AccordionTrigger className="text-base font-medium py-4">{item.label}</AccordionTrigger>
              <AccordionContent className="pb-4">
                {item.items.map((subItem) => (
                  <Link
                    key={subItem.href}
                    className="block rounded-md py-2.5 pl-4 text-ink-soft hover:bg-mist-hover hover:text-ink transition-colors"
                    href={subItem.href}
                    onClick={onClose}
                  >
                    {subItem.label}
                  </Link>
                ))}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </nav>
    </div>
  );
}

export function SiteHeader({ rankingEnabled = false }: { rankingEnabled?: boolean }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navItems = getNavSections('header', rankingEnabled);

  return (
    <header className="sticky top-0 z-40 w-full bg-card">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4">
        <Link className="flex items-center gap-2" href="/">
          <span className="font-display text-2xl font-bold text-ink">こうよう祭</span>
        </Link>

        <nav aria-label="メインナビゲーション" className="hidden lg:flex items-center gap-1">
          {navItems.map((item) => (
            <DropdownMenu key={item.id} item={item} />
          ))}
        </nav>

        <button
          aria-label="メニューを開く"
          className="lg:hidden flex size-11 items-center justify-center rounded-md hover:bg-mist-hover transition-colors"
          onClick={() => setMobileMenuOpen(true)}
        >
          <Menu className="h-6 w-6" />
        </button>
      </div>

      <MobileMenu isOpen={mobileMenuOpen} navItems={navItems} onClose={() => setMobileMenuOpen(false)} />
    </header>
  );
}
