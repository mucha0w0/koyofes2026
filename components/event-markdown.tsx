'use client'

import React from 'react'

interface MarkdownProps {
  content: string
  className?: string
}

export function EventMarkdown({ content, className = '' }: MarkdownProps) {
  const parseMarkdown = (md: string) => {
    const lines = md.split('\n')
    const elements: React.ReactNode[] = []
    let i = 0

    while (i < lines.length) {
      const line = lines[i]

      // H2見出し
      if (line.startsWith('## ')) {
        const title = line.replace(/^## /, '').trim()
        elements.push(
          <h2 key={`h2-${i}`} className="text-lg font-medium mt-6 mb-3 text-foreground">
            {title}
          </h2>
        )
        i++
        continue
      }

      // H3見出し
      if (line.startsWith('### ')) {
        const title = line.replace(/^### /, '').trim()
        elements.push(
          <h3 key={`h3-${i}`} className="text-base font-medium mt-4 mb-2 text-foreground">
            {title}
          </h3>
        )
        i++
        continue
      }

      // 箇条書きリスト
      if (line.startsWith('- ')) {
        const listItems: string[] = []
        while (i < lines.length && lines[i].startsWith('- ')) {
          listItems.push(lines[i].replace(/^- /, '').trim())
          i++
        }
        elements.push(
          <ul key={`ul-${i}`} className="list-disc list-inside space-y-1 mb-3 text-muted-foreground">
            {listItems.map((item, idx) => (
              <li key={idx}>{item}</li>
            ))}
          </ul>
        )
        continue
      }

      // 番号付きリスト
      if (line.match(/^\d+\. /)) {
        const listItems: string[] = []
        while (i < lines.length && lines[i].match(/^\d+\. /)) {
          listItems.push(lines[i].replace(/^\d+\. /, '').trim())
          i++
        }
        elements.push(
          <ol key={`ol-${i}`} className="list-decimal list-inside space-y-1 mb-3 text-muted-foreground">
            {listItems.map((item, idx) => (
              <li key={idx}>{item}</li>
            ))}
          </ol>
        )
        continue
      }

      // 空行
      if (line.trim() === '') {
        i++
        continue
      }

      // 通常段落
      if (line.trim()) {
        // インライン形式のパース（太字、斜体など）
        const parsed = parseInline(line)
        elements.push(
          <p key={`p-${i}`} className="mb-3 text-muted-foreground leading-relaxed">
            {parsed}
          </p>
        )
      }

      i++
    }

    return elements
  }

  const parseInline = (text: string): React.ReactNode[] => {
    const parts: React.ReactNode[] = []
    const tokens: Array<{ type: string; content: string }> = []

    // テキストをトークン化：**太字**と*斜体*と通常テキストを分別
    let remaining = text
    let key = 0

    while (remaining.length > 0) {
      // **太字**を探す（優先度高）
      const boldMatch = remaining.match(/^\*\*([^\*]+?)\*\*/)
      if (boldMatch) {
        tokens.push({ type: 'bold', content: boldMatch[1] })
        remaining = remaining.slice(boldMatch[0].length)
        continue
      }

      // *斜体*を探す（**ではない*で囲まれたもの）
      const italicMatch = remaining.match(/^\*([^\*]+?)\*(?!\*)/)
      if (italicMatch) {
        tokens.push({ type: 'italic', content: italicMatch[1] })
        remaining = remaining.slice(italicMatch[0].length)
        continue
      }

      // 次の特殊文字までの通常テキストを取得
      const nextSpecial = remaining.search(/\*/)
      if (nextSpecial === -1) {
        // 特殊文字がない場合は残り全部
        tokens.push({ type: 'text', content: remaining })
        remaining = ''
      } else if (nextSpecial > 0) {
        // 次の特殊文字まで取得
        tokens.push({ type: 'text', content: remaining.slice(0, nextSpecial) })
        remaining = remaining.slice(nextSpecial)
      } else {
        // *で始まるが上記の条件に当てはまらない場合は1文字進める
        tokens.push({ type: 'text', content: remaining[0] })
        remaining = remaining.slice(1)
      }
    }

    // トークンをReactノードに変換
    tokens.forEach((token) => {
      if (token.type === 'bold') {
        parts.push(
          <strong key={key++} className="font-medium">
            {token.content}
          </strong>
        )
      } else if (token.type === 'italic') {
        parts.push(
          <em key={key++} className="italic">
            {token.content}
          </em>
        )
      } else {
        parts.push(token.content)
      }
    })

    return parts.length > 0 ? parts : [text]
  }

  return <div className={`prose prose-invert max-w-none ${className}`}>{parseMarkdown(content)}</div>
}
