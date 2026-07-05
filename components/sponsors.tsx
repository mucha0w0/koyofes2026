// @/components/sponsors.tsx
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { fetchSponsorsFromMicroCMS } from "@/lib/microcms";
import { transformMicroCMSSponsor } from "@/lib/sponsors";
import { SponsorsClient } from "./sponsors-client";

// 1. 親：サーバーコンポーネント（ここでデータを取得する）
export async function Sponsors() {
  let sponsorItems = [];

  try {
    const sponsors = await fetchSponsorsFromMicroCMS();
    sponsorItems = sponsors.map(transformMicroCMSSponsor);
  } catch (error) {
    console.error("協賛取得エラー:", error);
    return null; // エラー時はセクションごと非表示に
  }

  if (sponsorItems.length === 0) return null;

  return (
    <section className="py-12 md:py-16 bg-muted overflow-hidden">
      <div className="container mx-auto px-4 mb-8">
        <div className="text-center">
          <h2 className="text-xl md:text-2xl font-medium mb-2">ご協賛</h2>
        </div>
      </div>

      {/* 実際の無限スクロールアニメーションはクライアントコンポーネントに任せる */}
      <SponsorsClient sponsors={sponsorItems} />

      <div className="text-center mt-6">
        <Link
          href="/about/sponsor"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          すべて見る
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </section>
  );
}