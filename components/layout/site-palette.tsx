'use client';

import { usePathname } from 'next/navigation';
import { useEffect, type ReactNode } from 'react';

import { getPaletteForPath } from '@/lib/config/palette';

export function SitePalette({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const palette = getPaletteForPath(pathname);

  useEffect(() => {
    document.documentElement.setAttribute('data-palette', palette);
  }, [palette]);

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground" data-palette={palette}>
      {children}
    </div>
  );
}
