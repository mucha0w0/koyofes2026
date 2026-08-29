'use client';

import { ExternalLink } from 'lucide-react';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export function InAppBrowserNotice() {
  return (
    <Alert className="rounded-none border-border bg-card shadow-none">
      <ExternalLink className="h-4 w-4" />
      <AlertTitle className="font-medium tracking-wide">標準ブラウザで開いてください</AlertTitle>
      <AlertDescription className="text-muted-foreground leading-loose tracking-wider">
        アプリ内ブラウザでは、スタンプが正しく保存されないことがあります。画面右上のメニュー（「…」や共有アイコン）から「ブラウザで開く」「Safari
        で開く」「Chrome で開く」を選んで、もう一度読み取り直してください。
      </AlertDescription>
    </Alert>
  );
}
