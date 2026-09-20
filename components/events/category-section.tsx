import type { LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';

interface CategorySectionProps {
  icon?: LucideIcon;
  title: string;
  titleAs?: 'h2' | 'h3';
  action?: ReactNode;
  children: ReactNode;
}

export function CategorySection({
  icon: Icon,
  title,
  titleAs: TitleTag = 'h2',
  action,
  children,
}: CategorySectionProps) {
  return (
    <div className="ink-shell overflow-visible bg-card">
      <div className="flex items-center gap-3 p-4">
        {Icon ? (
          <div className="shrink-0 rounded-md p-2 bg-paper-2">
            <Icon aria-hidden className="h-5 w-5 text-foreground" />
          </div>
        ) : null}
        <TitleTag className="text-lg font-medium">{title}</TitleTag>
        {action ? <div className="ml-auto">{action}</div> : null}
      </div>
      {children}
    </div>
  );
}
