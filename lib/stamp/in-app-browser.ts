/**
 * LINE / Instagram 等のアプリ内ブラウザ判定
 */
export function isInAppBrowser(userAgent = typeof navigator !== 'undefined' ? navigator.userAgent : ''): boolean {
  if (!userAgent) {
    return false;
  }
  return (
    /Line\//i.test(userAgent) ||
    /FBAN|FBAV|FB_IAB/i.test(userAgent) ||
    /Instagram/i.test(userAgent) ||
    /Twitter/i.test(userAgent) ||
    /MicroMessenger/i.test(userAgent) ||
    /TikTok/i.test(userAgent) ||
    /; wv\)/i.test(userAgent)
  );
}
