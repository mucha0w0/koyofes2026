import 'server-only';

import manifest from '@/lib/microcms/image-manifest.json';
import { lookupDeliveredImage, rewriteMicroCmsUrls } from '@/lib/microcms/image-url';

type ManifestFile = {
  images?: Record<string, string>;
};

function readManifestImages(): Readonly<Record<string, string>> {
  const images = (manifest as ManifestFile).images;
  if (!images || typeof images !== 'object') return {};
  return images;
}

const images = readManifestImages();

/** ビルド時に保存した静的ファイルがあればそのパス。無ければ元の URL。 */
export function deliverCmsImage(url: string | undefined | null): string {
  if (!url) return '';
  return lookupDeliveredImage(url, images) ?? url;
}

/** 本文中の microCMS 画像だけを静的パスへ替える。 */
export function deliverCmsHtml(html: string | undefined | null): string {
  if (!html) return '';
  return rewriteMicroCmsUrls(html, images);
}
