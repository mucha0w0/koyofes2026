'use client';

type AboutItem = {
  label: string;
  content: string;
};

const items: AboutItem[] = [
  {
    label: 'こうよう祭とは',
    content:
      'こうよう祭は、豊田高専で毎年秋に開催される文化祭です。 日頃の教育・文化活動の展示、豊田高専ならではのステージイベント及び、スペシャルゲストによるオンステージなどの企画を多数予定しています。',
  },
  {
    label: '名前の由来',
    content:
      '「秋で木々がこうようするころ、文化祭で気分をこうようさせに、豊田高専にいこうよう」というトリプルミーニングが由来です。',
  },
  {
    label: '歴史',
    content:
      'こうよう祭は〇〇年に第1回が開催され、今年で第△△回を迎えます。学生主体の実行委員会によって毎年企画・運営されており、年々来場者数も増加しています。',
  },
  {
    label: '開催内容',
    content:
      '学科・部活動・有志による展示や模擬店、メインステージでのパフォーマンスなど、多彩な企画が2日間にわたって行われます。',
  },
];

export default function AboutSection() {
  return (
    <div className="pb-6">
      {items.map((item, index) => (
        <div
          key={item.label}
          className={`py-8 ${index !== 0 ? 'border-t border-border' : ''}`}
        >
          <h3 className="text-lg font-medium text-foreground mb-4">
            {item.label}
          </h3>
          <p className="text-base leading-relaxed text-muted-foreground">
            {item.content}
          </p>
        </div>
      ))}
    </div>
  );
}