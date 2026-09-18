'use client';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export function InAppBrowserNotice() {
  return (
    <Alert>
      <AlertTitle className="font-medium">標準ブラウザで開いてください</AlertTitle>
      <AlertDescription>
        アプリ内ブラウザでは、スタンプが正しく保存されないことがあります。画面右上のメニュー（「…」や共有アイコン）から「ブラウザで開く」「Safari
        で開く」「Chrome で開く」を選んで、もう一度読み取り直してください。
      </AlertDescription>
    </Alert>
  );
}
