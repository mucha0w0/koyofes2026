'use client';

import { ChevronDown, Menu, X } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

import { getNavSections, type ResolvedNavSection } from '@/lib/config/nav';

/** 実マウスがあるときだけホバーで開く。タッチの疑似マウスイベントでは開かない。 */
function opensOnHover(pointerType: string) {
  return pointerType === 'mouse' && window.matchMedia('(hover: hover) and (pointer: fine)').matches;
}

function DropdownMenu({
  item,
  open,
  onOpenChange,
}: {
  item: ResolvedNavSection;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const rootRef = useRef<HTMLDivElement>(null);
  const pointerTypeRef = useRef('mouse');
  const openedByTouchRef = useRef(false);
  const onOpenChangeRef = useRef(onOpenChange);
  onOpenChangeRef.current = onOpenChange;

  useEffect(() => {
    if (open) return;
    openedByTouchRef.current = false;
  }, [open]);

  useEffect(() => {
    if (!open) return;

    const onPointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        openedByTouchRef.current = false;
        onOpenChangeRef.current(false);
      }
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        openedByTouchRef.current = false;
        onOpenChangeRef.current(false);
      }
    };

    document.addEventListener('pointerdown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('pointerdown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [open]);

  return (
    <div
      ref={rootRef}
      className="relative flex items-center"
      onPointerDown={(event) => {
        pointerTypeRef.current = event.pointerType;
      }}
      onPointerEnter={(event) => {
        if (openedByTouchRef.current) return;
        if (opensOnHover(event.pointerType)) onOpenChange(true);
      }}
      onPointerLeave={(event) => {
        if (openedByTouchRef.current) return;
        if (opensOnHover(event.pointerType)) onOpenChange(false);
      }}
    >
      <button
        aria-expanded={open}
        aria-haspopup="true"
        className="flex items-center gap-1 rounded-[var(--radius)] px-4 py-2 text-sm font-medium text-ink transition-colors hover:bg-mist-hover"
        type="button"
        onClick={(event) => {
          // タッチは pointerup で開閉済み。ここでの click はキーボードと、ホバーできないマウス用。
          if (event.detail === 0) {
            openedByTouchRef.current = false;
            onOpenChange(!open);
            return;
          }
          if (pointerTypeRef.current !== 'mouse' || opensOnHover(pointerTypeRef.current)) return;
          openedByTouchRef.current = false;
          onOpenChange(!open);
        }}
        onPointerUp={(event) => {
          if (event.pointerType === 'mouse') return;
          // リンク上の pointerup では閉じない。タッチで開いたあとの疑似 mouseleave でも閉じない。
          openedByTouchRef.current = !open;
          onOpenChange(!open);
        }}
      >
        {item.label}
        <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
      </button>
      <div className={`absolute top-full left-0 z-10 ${open ? 'visible' : 'invisible'}`}>
        <div className="ink-shell-hang min-w-50 bg-card p-1">
          {item.items.map((subItem) => (
            <Link
              key={subItem.href}
              className="block rounded-[var(--radius)] px-4 py-2.5 text-sm text-ink transition-colors hover:bg-mist-hover"
              href={subItem.href}
              prefetch={false}
              onClick={() => {
                openedByTouchRef.current = false;
                onOpenChange(false);
              }}
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
      aria-hidden={!isOpen}
      className={`fixed inset-0 z-50 bg-card transition-transform duration-300 ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      }`}
      inert={!isOpen}
    >
      <div className="flex h-16 items-center justify-between px-4">
        <span className="font-display text-lg font-bold text-ink">こうよう祭</span>
        <button
          aria-label="メニューを閉じる"
          className="flex size-11 items-center justify-center rounded-[var(--radius)] transition-colors hover:bg-mist-hover"
          onClick={onClose}
        >
          <X className="h-6 w-6" />
        </button>
      </div>
      <nav className="max-h-[calc(100vh-4rem)] overflow-y-auto p-4">
        <Accordion collapsible className="w-full" type="single">
          {navItems.map((item) => (
            <AccordionItem key={item.id} value={item.id}>
              <AccordionTrigger className="py-4 text-base font-medium">{item.label}</AccordionTrigger>
              <AccordionContent className="pb-4">
                {item.items.map((subItem) => (
                  <Link
                    key={subItem.href}
                    className="block rounded-[var(--radius)] py-2.5 pl-4 text-ink-soft transition-colors hover:bg-mist-hover hover:text-ink"
                    href={subItem.href}
                    prefetch={false}
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
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const navItems = getNavSections('header', rankingEnabled);

  return (
    <header className="sticky top-0 z-40 w-full border-b-[length:var(--shell-stroke)] border-ink bg-card">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4">
        <Link className="flex items-center gap-2" href="/" prefetch={false}>
          <span className="font-display text-2xl font-bold text-ink">こうよう祭</span>
        </Link>

        <nav aria-label="メインナビゲーション" className="hidden self-stretch gap-1 lg:flex">
          {navItems.map((item) => (
            <DropdownMenu
              key={item.id}
              item={item}
              open={openMenuId === item.id}
              onOpenChange={(next) => setOpenMenuId(next ? item.id : null)}
            />
          ))}
        </nav>

        <button
          aria-label="メニューを開く"
          className="flex size-11 items-center justify-center rounded-[var(--radius)] transition-colors hover:bg-mist-hover lg:hidden"
          onClick={() => setMobileMenuOpen(true)}
        >
          <Menu className="h-6 w-6" />
        </button>
      </div>

      <MobileMenu isOpen={mobileMenuOpen} navItems={navItems} onClose={() => setMobileMenuOpen(false)} />
    </header>
  );
}
