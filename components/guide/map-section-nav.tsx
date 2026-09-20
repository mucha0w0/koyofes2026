import { MAP_PAGE_SECTIONS } from '@/lib/config/venue-map';

export function MapSectionNav() {
  return (
    <nav aria-label="このページの案内">
      <ul className="flex flex-wrap gap-x-6 gap-y-2">
        {MAP_PAGE_SECTIONS.map((section) => (
          <li key={section.id}>
            <a className="ink-link text-sm" href={`#${section.id}`}>
              {section.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
