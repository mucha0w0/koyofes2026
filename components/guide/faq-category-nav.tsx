interface FAQCategoryNavProps {
  categories: string[];
}

export const FAQCategoryNav: React.FC<FAQCategoryNavProps> = ({ categories }) => {
  return (
    <nav aria-label="質問カテゴリー" className="mb-10 max-w-md">
      <ul className="flex flex-col">
        {categories.map((category, index) => {
          // 1桁の数字を「01」「02」の形式にフォーマット
          const itemNumber = String(index + 1).padStart(2, '0');

          return (
            <li key={category} className="last:border-none">
              <a
                className="flex items-center gap-4 py-4 text-lg font-medium text-foreground hover:bg-mist-hover rounded-md px-2 transition-colors group"
                href={`#${category}`}
              >
                {/* ナンバリング（薄めの色でスタイリッシュに表示） */}
                <span className="text-sm text-muted-foreground">
                  {itemNumber}
                </span>

                {/* カテゴリ名 */}
                <span>{category}</span>
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};
