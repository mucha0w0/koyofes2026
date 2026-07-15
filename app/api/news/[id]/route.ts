import { NextRequest, NextResponse } from 'next/server';

import { getNewsByID } from '@/lib/microcms';

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const news = await getNewsByID(id);

    if (!news) {
      return NextResponse.json({ error: 'ニュースが見つかりません' }, { status: 404 });
    }

    return NextResponse.json(news);
  } catch (error) {
    console.error('ニュース取得エラー:', error);
    return NextResponse.json({ error: 'ニュースの取得に失敗しました' }, { status: 500 });
  }
}
