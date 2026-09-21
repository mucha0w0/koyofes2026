import { Button } from '@/components/ui/button';

interface FAQCategoryNavProps {
  categories: string[];
}

export function FAQCategoryNav({ categories }: FAQCategoryNavProps) {
  return (
    <nav aria-label="質問カテゴリー">
      <ul className="flex flex-wrap gap-2">
        {categories.map((category) => (
          <li key={category}>
            <Button asChild variant="outline">
              <a href={`#${category}`}>{category}</a>
            </Button>
          </li>
        ))}
      </ul>
    </nav>
  );
}
