import { InstagramEmbed } from '@/components/home/instagram-embed';
import { InkTextLink } from '@/components/ui/ink-text-link';

import { getOfficialSocial } from '@/lib/config/social';

const INSTAGRAM_POST_URL = 'https://www.instagram.com/p/DeEl8zjDzMV/';
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
    <InkTextLink href={INSTAGRAM_PROFILE_URL} rel="noopener noreferrer" target="_blank">
      全てのPR動画をInstagramで見る
    </InkTextLink>
  );
}

export function PrVideoSection() {
  return (
    <section className="bg-paper-2 py-16 md:py-24" data-palette="green">
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
