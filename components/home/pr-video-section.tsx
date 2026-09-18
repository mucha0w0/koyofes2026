import { ArrowRight, Instagram } from 'lucide-react';
import Link from 'next/link';

import { InstagramEmbed } from '@/components/home/instagram-embed';

import { getOfficialSocial } from '@/lib/config/social';

const INSTAGRAM_POST_URL = 'https://www.instagram.com/p/DZZpnTuAJZp/';
const INSTAGRAM_PROFILE_URL = getOfficialSocial('instagram').url;

function SectionHeading() {
  return (
    <h2 className="text-2xl font-medium text-foreground" style={{ letterSpacing: 0 }}>
      PR動画第１弾！
    </h2>
  );
}

function InstagramLink() {
  return (
    <Link
      className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
      href={INSTAGRAM_PROFILE_URL}
      rel="noopener noreferrer"
      target="_blank"
    >
      <Instagram className="h-4 w-4" />
      全てのPR動画をInstagramで見る
      <ArrowRight className="h-4 w-4" />
    </Link>
  );
}

export function PrVideoSection() {
  return (
    <section className="py-16 md:py-24 bg-paper-2">
      <div className="mx-auto w-full max-w-7xl px-4">
        <div className="flex flex-col items-center gap-8">
          <div className="flex flex-col items-center gap-2 text-center">
            <SectionHeading />
          </div>
          <InstagramEmbed permalink={INSTAGRAM_POST_URL} />
          <InstagramLink />
        </div>
      </div>
    </section>
  );
}
