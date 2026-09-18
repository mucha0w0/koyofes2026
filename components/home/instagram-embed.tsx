'use client';

import Script from 'next/script';
import { useEffect } from 'react';

const INSTAGRAM_EMBED_SCRIPT = 'https://www.instagram.com/embed.js';

type InstagramEmbedApi = {
  Embeds: {
    process: () => void;
  };
};

function processInstagramEmbeds() {
  const instgrm = (window as typeof window & { instgrm?: InstagramEmbedApi }).instgrm;
  instgrm?.Embeds.process();
}

export function InstagramEmbed({ permalink }: Readonly<{ permalink: string }>) {
  useEffect(() => {
    processInstagramEmbeds();
  }, [permalink]);

  return (
    <>
      <div
        className="
          w-full max-w-135 mx-auto 
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
          data-instgrm-permalink={permalink}
          data-instgrm-version="14"
          style={{
            margin: 0,
            padding: 0,
            border: 0,
            background: 'transparent',
          }}
        >
          <a
            className="inline-block py-8 text-sm text-muted-foreground hover:text-foreground"
            href={permalink}
            rel="noopener noreferrer"
            target="_blank"
          >
            Instagramでこの投稿を見る
          </a>
        </blockquote>
      </div>

      <Script src={INSTAGRAM_EMBED_SCRIPT} strategy="afterInteractive" onReady={processInstagramEmbeds} />
    </>
  );
}
