type AboutItem = {
  label: string;
  content: string | readonly string[];
};

const items: AboutItem[] = [
  {
    label: 'こうよう祭とは',
    content: [
      'こうよう祭は、豊田高専で毎年秋に開催される文化祭です。',
      '日頃の教育をいかし、高専ならではの企画を展示します。その他にも、司会を中心としたステージイベントや有志による模擬店、キッチンカーなどの企画を予定しています。',
    ],
  },
  {
    label: '歴史',
    content: [
      '豊田高専の文化祭がいつ始まったのかは、資料が残っておらず分かっていません。かつては春に行われており、校花のかきつばたにちなんで「杜若祭」と呼ばれていました。',
      '開催が11月初めに移動したことで、固有の名前を付けず「文化祭」と呼ばれていました。2001年、当時の学生会がその呼び方では物足りないと考え、公募で名称を決めました。選ばれたのが「こうよう祭」です。',
      '名前の由来は、「秋で木々がこうようするころ、文化祭で気分をこうようさせに、豊田高専にいこうよう」というトリプルミーニングです。',
    ],
  },
  {
    label: '概要',
    content: [
      'こうよう祭は、学生会のこうよう祭実行委員会が企画し、運営します。委員会の下には「パート」と呼ばれる組織があり、仕事の種類ごとに担当が分かれています。各パートのリーダーは「パーリー」と呼ばれます。',
      '展示は、クラス・学科展と有志展示に分かれます。クラスや学科は、授業で学んだことをいかして、みんなが楽しめる展示をつくります。有志の団体や部活動は、それぞれの活動を形にした企画を出します。飲食は、有志の模擬店とキッチンカーが担います。',
      'メインステージでは、司会を中心にステージイベントが2日間行われます。出演や内容は時間ごとに替わり、開始時刻はタイムテーブルで案内します。',
    ],
  },
];

export function AboutSection() {
  return (
    <div className="pb-6">
      {items.map((item, index) => (
        <div key={item.label} className="py-8">
          <h3 className="text-lg font-medium text-foreground mb-4">{item.label}</h3>
          <div className="space-y-4">
            {(Array.isArray(item.content) ? item.content : [item.content]).map((paragraph) => (
              <p key={paragraph} className="text-base leading-relaxed text-muted-foreground">
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
