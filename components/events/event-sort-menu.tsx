'use client';

import { ArrowUpDown, Check } from 'lucide-react';
import { useEffect, useId, useRef, useState } from 'react';

import { EVENT_SORT_OPTIONS, type EventSortKey } from '@/lib/event-sort';
import { cn } from '@/lib/utils';

type EventSortMenuProps = {
  value: EventSortKey;
  onChange: (key: EventSortKey) => void;
};

export function EventSortMenu({ value, onChange }: EventSortMenuProps) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const menuId = useId();
  const isActive = value !== 'none';

  useEffect(() => {
    if (!open) {
      return;
    }

    const onPointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false);
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
    <div ref={rootRef} className="relative shrink-0">
      <button
        aria-controls={menuId}
        aria-expanded={open}
        aria-haspopup="menu"
        aria-label="並び替え"
        aria-pressed={isActive}
        className={cn('ink-shell ink-lift flex h-full min-h-12 items-center justify-center px-3', isActive ? 'bg-card' : 'bg-mist')}
        type="button"
        onClick={() => setOpen((prev) => !prev)}
      >
        <ArrowUpDown className="h-5 w-5" />
      </button>
      <div
        aria-hidden={!open}
        className={cn(
          'absolute top-full right-0 z-30 mt-1 min-w-52 rounded-md border-[length:var(--shell-stroke)] border-ink bg-card py-1 shadow-[var(--shell-ox)_var(--shell-oy)_0_0_var(--ink)] transition-all duration-200',
          open ? 'visible translate-y-0 opacity-100' : 'invisible -translate-y-2 opacity-0',
        )}
        id={menuId}
        inert={!open ? true : undefined}
        role="menu"
      >
        {EVENT_SORT_OPTIONS.map((option) => {
          const selected = option.key === value;
          return (
            <button
              key={option.key}
              className={cn(
                'flex w-full items-center justify-between gap-3 rounded-md px-4 py-2.5 text-left text-sm transition-colors',
                selected ? 'bg-card text-ink' : 'text-ink hover:bg-mist-hover',
              )}
              role="menuitem"
              type="button"
              onClick={() => {
                onChange(option.key);
                setOpen(false);
              }}
            >
              <span>{option.label}</span>
              {selected ? <Check aria-hidden className="h-4 w-4 shrink-0" /> : null}
            </button>
          );
        })}
      </div>
    </div>
  );
}
