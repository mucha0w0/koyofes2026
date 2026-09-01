'use client';

import parse, { domToReact, Element } from 'html-react-parser';
import React from 'react';

interface MarkdownProps {
  content: string;
  className?: string;
}

export function EventMarkdown({ content, className = '' }: MarkdownProps) {
  if (!content) {
    return null;
  }

  // HTML コンテンツの処理
  const htmlContent = parse(content, {
    replace: (domNode: any) => {
      // テキストノード・コメント以外をチェック
      if (!(domNode instanceof Element)) return domNode;

      // 画像タグのスタイル調整
      if (domNode.name === 'img') {
        return React.createElement('img', {
          ...domNode.attribs,
          className: 'max-w-full h-auto rounded-lg',
        });
      }

      // リンクタグのスタイル調整
      if (domNode.name === 'a') {
        return React.createElement(
          'a',
          {
            ...domNode.attribs,
            className: 'text-blue-600 hover:underline',
          },
          domToReact(domNode.children as any),
        );
      }

      // テーブルのスタイル調整
      if (domNode.name === 'table') {
        return React.createElement(
          'table',
          {
            className: 'w-full border-collapse border border-border',
          },
          domToReact(domNode.children as any),
        );
      }

      if (domNode.name === 'th' || domNode.name === 'td') {
        return React.createElement(
          domNode.name,
          {
            className: 'border border-border px-3 py-2',
          },
          domToReact(domNode.children as any),
        );
      }

      // その他のタグはデフォルトレンダリング
      return undefined;
    },
  });

  return (
    <div
      className={`prose max-w-none text-muted-foreground leading-relaxed space-y-3 [&_h1]:text-2xl [&_h1]:font-bold [&_h1]:mt-6 [&_h1]:mb-3 [&_h2]:text-xl [&_h2]:font-bold [&_h2]:mt-6 [&_h2]:mb-3 [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:mt-4 [&_h3]:mb-2 [&_p]:mb-3 [&_ul]:list-disc [&_ul]:list-inside [&_ol]:list-decimal [&_ol]:list-inside [&_li]:mb-1 [&_strong]:font-bold [&_em]:italic [&_u]:underline ${className}`}
    >
      {htmlContent}
    </div>
  );
}
