import Link from 'next/link';
import Script from 'next/script';
import { ArrowRight, Instagram } from 'lucide-react';

// ── config ──────────────────────────────────────────────
const INSTAGRAM_POST_URL = 'https://www.instagram.com/p/DZZpnTuAJZp/';
const INSTAGRAM_PROFILE_URL = 'https://www.instagram.com/YOUR_ACCOUNT/';
// ────────────────────────────────────────────────────────

function SectionHeading() {
  return (
    <h2 className="text-2xl font-medium text-foreground" style={{ letterSpacing: 0 }}>
      PR動画第１弾！
    </h2>
  );
}

function InstagramEmbed() {
  return (
    <>
      <div
        className="
          w-full max-w-[540px] mx-auto 
          overflow-hidden 
          [&_.instagram-media]:min-w-0!
          [&_.instagram-media]:w-full!
          [&_.instagram-media]:max-w-full!
          [&_.instagram-media]:border-0!
          [&_.instagram-media]:bg-transparent!
          [&_.instagram-media]:m-0!
        "
      >
        <blockquote
          className="instagram-media"
          data-instgrm-permalink={INSTAGRAM_POST_URL}
          data-instgrm-version="14"
          style={{
            margin: 0,
            padding: 0,
            border: 0,
            background: 'transparent',
          }}
        />
      </div>

      <Script src="//www.instagram.com/embed.js" strategy="lazyOnload" />
    </>
  );
}

function InstagramLink() {
  return (
    <Link
      href={INSTAGRAM_PROFILE_URL}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
    >
      <Instagram className="h-4 w-4" />
      全てのPR動画をInstagramで見る
      <ArrowRight className="h-4 w-4" />
    </Link>
  );
}

export function PrVideoSection() {
  return (
    <section className="py-16 md:py-24 bg-muted">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center gap-8">
          <div className="flex flex-col items-center gap-2 text-center">
            <SectionHeading />
          </div>
          <InstagramEmbed />
          <InstagramLink />
        </div>
      </div>
    </section>
  );
}
