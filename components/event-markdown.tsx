'use client'

import React from 'react'
import parse from 'html-react-parser'

interface MarkdownProps {
  content: string
  className?: string
}

export function EventMarkdown({ content, className = '' }: MarkdownProps) {
  if (!content) {
    return null
  }

  // HTML コンテンツの処理
  const htmlContent = parse(content, {
    replace: (domNode: any) => {
      // 画像タグのスタイル調整
      if (domNode.type === 'tag' && domNode.name === 'img') {
        return React.createElement('img', {
          ...domNode.attribs,
          className: 'max-w-full h-auto rounded-lg',
        })
      }

      // リンクタグのスタイル調整
      if (domNode.type === 'tag' && domNode.name === 'a') {
        return React.createElement(
          'a',
          {
            ...domNode.attribs,
            className: 'text-blue-600 hover:underline',
          },
          domNode.children,
        )
      }

      // テーブルのスタイル調整
      if (domNode.type === 'tag' && domNode.name === 'table') {
        return React.createElement(
          'table',
          {
            className: 'w-full border-collapse border border-border',
          },
          domNode.children,
        )
      }

      if (domNode.type === 'tag' && (domNode.name === 'th' || domNode.name === 'td')) {
        return React.createElement(
          domNode.name,
          {
            className: 'border border-border px-3 py-2',
          },
          domNode.children,
        )
      }

      return undefined
    },
  })

  return (
    <div
      className={`prose max-w-none text-muted-foreground leading-relaxed space-y-3 [&_h1]:text-2xl [&_h1]:font-bold [&_h1]:mt-6 [&_h1]:mb-3 [&_h2]:text-xl [&_h2]:font-bold [&_h2]:mt-6 [&_h2]:mb-3 [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:mt-4 [&_h3]:mb-2 [&_p]:mb-3 [&_ul]:list-disc [&_ul]:list-inside [&_ol]:list-decimal [&_ol]:list-inside [&_li]:mb-1 [&_strong]:font-bold [&_em]:italic [&_u]:underline ${className}`}
    >
      {htmlContent}
    </div>
  )
}
