'use client';

import { ChevronDown, Menu, X } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

interface DropdownItem {
  label: string;
  href: string;
}

interface NavItem {
  label: string;
  items: DropdownItem[];
}

const navItems: NavItem[] = [
  {
    label: '企画情報',
    items: [
      { label: '企画一覧・検索', href: '/events/list' },
      { label: 'おすすめ企画', href: '/events/recommended' },
      { label: 'タイムテーブル', href: '/events/timetable' },
    ],
  },
  {
    label: '公式コンテンツ',
    items: [
      { label: 'お知らせ', href: '/official/news' },
      { label: '公式SNS', href: '/official/social' },
      { label: '公式グッズ', href: '/official/goods' },
      { label: 'パンフレット', href: '/official/pamphlet' },
    ],
  },
  {
    label: 'ご案内',
    items: [
      { label: 'アクセス', href: '/guide/access' },
      { label: '会場マップ', href: '/guide/map' },
      { label: 'よくある質問', href: '/guide/faq' },
    ],
  },
  {
    label: 'こうよう祭について',
    items: [
      { label: 'こうよう祭とは', href: '/about/overview' },
      { label: 'テーマ', href: '/about/theme' },
      { label: 'パート', href: '/about/part' },
      { label: 'ご協賛', href: '/about/sponsor' },
      { label: 'お問い合わせ', href: '/about/contact' },
    ],
  },
];

function DropdownMenu({ item }: { item: NavItem }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative" onMouseEnter={() => setIsOpen(true)} onMouseLeave={() => setIsOpen(false)}>
      <button
        aria-expanded={isOpen}
        aria-haspopup="true"
        className="flex items-center gap-1 px-4 py-2 text-sm font-medium text-foreground hover:text-primary transition-colors"
      >
        {item.label}
        <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      <div
        className={`absolute top-full left-0 min-w-50 bg-popover border border-border rounded-none overflow-hidden transition-all duration-200 ${
          isOpen ? 'opacity-100 translate-y-0 visible' : 'opacity-0 -translate-y-2 invisible'
        }`}
      >
        <div className="py-2">
          {item.items.map((subItem) => (
            <Link
              key={subItem.href}
              className="block px-4 py-2.5 text-sm text-foreground hover:bg-primary hover:text-primary-foreground transition-colors"
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

function MobileMenu({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  return (
    <div
      className={`fixed inset-0 z-50 bg-background transition-transform duration-300 ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      }`}
    >
      <div className="flex items-center justify-between px-4 h-16 border-b border-border">
        <span className="text-lg font-medium text-foreground">こうよう祭 2026</span>
        <button aria-label="メニューを閉じる" className="p-2 hover:bg-muted transition-colors" onClick={onClose}>
          <X className="h-6 w-6" />
        </button>
      </div>
      <nav className="p-4 overflow-y-auto max-h-[calc(100vh-4rem)]">
        <Accordion collapsible className="w-full" type="single">
          {navItems.map((item) => (
            <AccordionItem key={item.label} className="last:border-b-0" value={item.label}>
              <AccordionTrigger className="text-base font-medium py-4">{item.label}</AccordionTrigger>
              <AccordionContent className="pb-4">
                {item.items.map((subItem) => (
                  <Link
                    key={subItem.href}
                    className="block py-2.5 pl-4 text-muted-foreground hover:text-foreground transition-colors"
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

export function SiteHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-background">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link className="flex items-center gap-2" href="/">
          <div className="flex items-center gap-1">
            <span className="text-2xl font-medium tracking-[0.08em] text-foreground">こうよう祭</span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav aria-label="メインナビゲーション" className="hidden lg:flex items-center gap-1">
          {navItems.map((item) => (
            <DropdownMenu key={item.label} item={item} />
          ))}
        </nav>

        {/* Mobile Menu Button */}
        <button
          aria-label="メニューを開く"
          className="lg:hidden p-2 hover:bg-muted transition-colors"
          onClick={() => setMobileMenuOpen(true)}
        >
          <Menu className="h-6 w-6" />
        </button>
      </div>

      {/* Mobile Menu */}
      <MobileMenu isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />
    </header>
  );
}
