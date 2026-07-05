"use client"

import Link from "next/link"
import { useState } from "react"
import { ChevronDown, Menu, X } from "lucide-react"

interface DropdownItem {
  label: string
  href: string
}

interface NavItem {
  label: string
  items: DropdownItem[]
}

const navItems: NavItem[] = [
  {
    label: "企画情報",
    items: [
      { label: "企画一覧・検索", href: "/events/list" },
      { label: "おすすめ企画", href: "/events/recommended" },
      { label: "タイムテーブル", href: "/events/timetable" },
    ],
  },
  {
    label: "公式コンテンツ",
    items: [
      { label: "お知らせ", href: "/official/news" },
      { label: "公式SNS", href: "/official/social" },
      { label: "公式グッズ", href: "/official/goods" },
      { label: "パンフレット", href: "/official/pamphlet" },
    ],
  },
  {
    label: "ご案内",
    items: [
      { label: "アクセス", href: "/guide/access" },
      { label: "会場マップ", href: "/guide/map" },
      { label: "よくある質問", href: "/guide/faq" },
    ],
  },
  {
    label: "こうよう祭について",
    items: [
      { label: "こうよう祭とは", href: "/about/overview" },
      { label: "テーマ", href: "/about/theme" },
      { label: "パート", href: "/about/part" },
      { label: "ご協賛", href: "/about/sponsor" },
      { label: "お問い合わせ", href: "/about/contact" },
    ],
  },

]

function DropdownMenu({ item }: { item: NavItem }) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div
      className="relative"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <button
        className="flex items-center gap-1 px-4 py-2 text-sm font-medium text-foreground hover:text-primary transition-colors"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        {item.label}
        <ChevronDown
          className={`h-4 w-4 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>
      <div
        className={`absolute top-full left-0 min-w-[200px] bg-popover border border-border rounded-none overflow-hidden transition-all duration-200 ${
          isOpen
            ? "opacity-100 translate-y-0 visible"
            : "opacity-0 -translate-y-2 invisible"
        }`}
      >
        <div className="py-2">
          {item.items.map((subItem) => (
            <Link
              key={subItem.href}
              href={subItem.href}
              className="block px-4 py-2.5 text-sm text-foreground hover:bg-primary hover:text-primary-foreground transition-colors"
            >
              {subItem.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}

function MobileMenu({
  isOpen,
  onClose,
}: {
  isOpen: boolean
  onClose: () => void
}) {
  const [openSection, setOpenSection] = useState<string | null>(null)

  return (
    <div
      className={`fixed inset-0 z-50 bg-background transition-transform duration-300 ${
        isOpen ? "translate-x-0" : "translate-x-full"
      }`}
    >
      <div className="flex items-center justify-between px-4 h-16 border-b border-border">
        <span className="text-lg font-medium text-foreground">こうよう祭 2026</span>
        <button
          onClick={onClose}
          className="p-2 hover:bg-muted transition-colors"
          aria-label="メニューを閉じる"
        >
          <X className="h-6 w-6" />
        </button>
      </div>
      <nav className="p-4 overflow-y-auto max-h-[calc(100vh-4rem)]">
        {navItems.map((item) => (
          <div key={item.label} className="border-b border-border">
            <button
              onClick={() =>
                setOpenSection(openSection === item.label ? null : item.label)
              }
              className="flex items-center justify-between w-full py-4 text-left font-medium"
            >
              {item.label}
              <ChevronDown
                className={`h-5 w-5 transition-transform ${
                  openSection === item.label ? "rotate-180" : ""
                }`}
              />
            </button>
            <div
              className={`overflow-hidden transition-all duration-200 ${
                openSection === item.label ? "max-h-96 pb-4" : "max-h-0"
              }`}
            >
              {item.items.map((subItem) => (
                <Link
                  key={subItem.href}
                  href={subItem.href}
                  onClick={onClose}
                  className="block py-2.5 pl-4 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {subItem.label}
                </Link>
              ))}
            </div>
          </div>
        ))}
      </nav>
    </div>
  )
}

export function SiteHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-background">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            <span className="text-2xl font-medium tracking-[0.08em] text-foreground">
              こうよう祭
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-1" aria-label="メインナビゲーション">
          {navItems.map((item) => (
            <DropdownMenu key={item.label} item={item} />
          ))}
        </nav>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(true)}
          className="lg:hidden p-2 hover:bg-muted transition-colors"
          aria-label="メニューを開く"
        >
          <Menu className="h-6 w-6" />
        </button>
      </div>

      {/* Mobile Menu */}
      <MobileMenu
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
      />
    </header>
  )
}
