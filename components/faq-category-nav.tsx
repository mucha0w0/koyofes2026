interface FAQCategoryNavProps {
    categories: string[];
  }
  
  export const FAQCategoryNav: React.FC<FAQCategoryNavProps> = ({ categories }) => {
    return (
      <nav aria-label="質問カテゴリー" className="mb-10">
        <ul className="flex flex-wrap gap-3">
          {categories.map((category) => (
            <li key={category}>
              <a
                href={`#${category}`}
                className="inline-block px-4 py-2 border rounded-full text-sm text-primary hover:bg-primary hover:text-primary-foreground transition-colors"
              >
                {category}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    );
  };