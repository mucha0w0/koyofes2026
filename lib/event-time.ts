/** microCMS の数値時間（例: 9001600）や Event の文字列時間（"09001600"）を扱うユーティリティ */

export interface EventTimeRange {
  startMin: number;
  endMin: number;
}

/** 数値型の時間を 8 桁文字列に変換（9001600 → "09001600"） */
export function formatTimeFromNumber(timeNum: number): string {
  if (!timeNum) return '';
  return String(timeNum).padStart(8, '0');
}

/** "HHMMHHMM" 形式の時間文字列を分単位の範囲にパース */
export function parseEventTime(timeStr: string): EventTimeRange | null {
  if (!timeStr || timeStr.length !== 8) return null;

  const sh = parseInt(timeStr.substring(0, 2), 10);
  const sm = parseInt(timeStr.substring(2, 4), 10);
  const eh = parseInt(timeStr.substring(4, 6), 10);
  const em = parseInt(timeStr.substring(6, 8), 10);

  if (isNaN(sh) || isNaN(sm) || isNaN(eh) || isNaN(em)) return null;

  return { startMin: sh * 60 + sm, endMin: eh * 60 + em };
}

/** 0 時からの経過分を "HH:MM" 形式に変換 */
export function formatMinutesAsTime(min: number): string {
  const h = Math.floor(min / 60)
    .toString()
    .padStart(2, '0');
  const m = (min % 60).toString().padStart(2, '0');
  return `${h}:${m}`;
}

/** 時間範囲の所要時間（分） */
export function eventTimeDuration({ startMin, endMin }: EventTimeRange): number {
  return endMin - startMin;
}

/** "HH:MM{separator}HH:MM" 形式で表示用にフォーマット */
export function formatEventTimeRange(time: EventTimeRange | string, separator = '~'): string {
  const parsed = typeof time === 'string' ? parseEventTime(time) : time;
  if (!parsed) return typeof time === 'string' ? time : '';
  return `${formatMinutesAsTime(parsed.startMin)}${separator}${formatMinutesAsTime(parsed.endMin)}`;
}
