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
  title,
  titleAs: TitleTag = 'h2',
  action,
  children,
}: CategorySectionProps) {
  return (
    <div className="ink-shell overflow-visible bg-card">
      <div className="flex items-center gap-3 p-4">
        <TitleTag className="text-lg font-medium">{title}</TitleTag>
        {action ? <div className="ml-auto">{action}</div> : null}
      </div>
      {children}
    </div>
  );
}
