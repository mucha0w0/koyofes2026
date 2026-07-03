/**
 * microCMS API クライアント
 */

export interface MicroCMSImageField {
  url: string;
  height?: number;
  width?: number;
}

export interface MicroCMSIconField {
  url: string;
  height?: number;
  width?: number;
}

export interface MicroCMSEvent {
  id: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  revisedAt: string;
  slug: string;
  title: string;
  catchphrase?: string; // オプション
  icon: MicroCMSIconField;
  images: MicroCMSImageField[];
  organization: string;
  location: string[]; // 配列
  floor: string[]; // 配列
  classroom: string;
  "time-day1": number; // 数値型（例: 9001600）
  "time-day2": number; // 数値型（例: 9001600）
  duration?: number; // オプション
  participantsUL: number;
  participantsLL?: number; // オプション
  description: string;
  "organ-description": string;
  author: string;
  category: string[]; // 配列
}

export interface MicroCMSEventResponse {
  contents: MicroCMSEvent[];
  totalCount: number;
  offset: number;
  limit: number;
}

export interface MicroCMSNews {
  id: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  revisedAt: string;
  date: string;
  title: string;
  content: string;
}

export interface MicroCMSNewsResponse {
  contents: MicroCMSNews[];
  totalCount: number;
  offset: number;
  limit: number;
}

export type MicroCMSPartCategory = "MC" | "PARTS" | "EXECUTIVE" | "HYPE CREW";

export interface MicroCMSPart {
  id: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  revisedAt: string;
  name: string;
  icon?: MicroCMSImageField;
  instaID?: string;
  explanation: string;
  category: MicroCMSPartCategory[];
  recommend?: string;
}

export interface MicroCMSPartResponse {
  contents: MicroCMSPart[];
  totalCount: number;
  offset: number;
  limit: number;
}

export interface MicroCMSSponsor {
  id: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  revisedAt: string;
  name: string;
  icon?: MicroCMSImageField;
  link?: string;
  explanation: string;
  category: string[];
}

export interface MicroCMSSponsorResponse {
  contents: MicroCMSSponsor[];
  totalCount: number;
  offset: number;
  limit: number;
}

/**
 * microCMS から全イベントを取得
 */
export async function fetchEventsFromMicroCMS(): Promise<MicroCMSEvent[]> {
  const apiKey = process.env.MICROCMS_API_KEY;
  const serviceDomain = process.env.MICROCMS_SERVICE_DOMAIN;

  if (!apiKey || !serviceDomain) {
    throw new Error("microCMS 環境変数が設定されていません");
  }

  const url = `https://${serviceDomain}.microcms.io/api/v1/events?limit=100`;

  try {
    const response = await fetch(url, {
      headers: {
        "X-MICROCMS-API-KEY": apiKey,
      },
      // 常に最新データを取得（キャッシュなし）
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(
        `microCMS API エラー: ${response.status} ${response.statusText}`,
      );
    }

    const data: MicroCMSEventResponse = await response.json();
    return data.contents;
  } catch (error) {
    console.error("microCMS データ取得エラー:", error);
    throw error;
  }
}

/**
 * 数値型の時間フォーマットを文字列に変換（9001600 → "09001600"）
 */
function formatTimeFromNumber(timeNum: number): string {
  if (!timeNum) return "";
  const timeStr = String(timeNum).padStart(8, "0");
  return timeStr;
}

/**
 * microCMS イベントを フロントエンド型に変換
 */
export function transformMicroCMSEvent(event: MicroCMSEvent): any {
  return {
    slug: event.slug,
    title: event.title,
    catchphrase: event.catchphrase ?? "", // オプションフィールド対応
    icon: event.icon?.url ?? "", // Lucide icon name (URL文字列として保存)
    images: event.images
      .map((img) => img.url)
      .filter((url) => url && url.length > 0), // URL配列
    organization: event.organization,
    location: Array.isArray(event.location)
      ? event.location[0] || ""
      : event.location, // 配列の最初の要素を取得
    floor: Array.isArray(event.floor) ? event.floor[0] || "" : event.floor, // 配列の最初の要素を取得
    classroom: event.classroom,
    "time-day1": formatTimeFromNumber(event["time-day1"]), // 数値を文字列に変換
    "time-day2": formatTimeFromNumber(event["time-day2"]), // 数値を文字列に変換
    duration: event.duration ?? 0, // オプションフィールド、デフォルト0
    participantsUL: event.participantsUL,
    participantsLL: event.participantsLL ?? 1, // オプションフィールド、デフォルト1
    description: event.description,
    "organ-description": event["organ-description"],
    author: event.author,
    category: Array.isArray(event.category)
      ? event.category[0] || "booth"
      : event.category, // 配列の最初の要素を取得、デフォルト"booth"
  };
}

/**
 * microCMS から全イベントを取得し、フロントエンド型に変換
 */
export async function getEvents() {
  try {
    const microCMSEvents = await fetchEventsFromMicroCMS();
    return microCMSEvents.map(transformMicroCMSEvent);
  } catch (error) {
    console.error("イベント取得に失敗しました:", error);
    throw error;
  }
}

/**
 * microCMS からニュース（お知らせ）を全件取得
 */
export async function fetchNewsFromMicroCMS(): Promise<MicroCMSNews[]> {
  const apiKey = process.env.MICROCMS_API_KEY;
  const serviceDomain = process.env.MICROCMS_SERVICE_DOMAIN;

  if (!apiKey || !serviceDomain) {
    throw new Error("microCMS 環境変数が設定されていません");
  }

  const url = `https://${serviceDomain}.microcms.io/api/v1/news`;

  try {
    const response = await fetch(url, {
      headers: {
        "X-MICROCMS-API-KEY": apiKey,
      },
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(
        `microCMS API エラー: ${response.status} ${response.statusText}`,
      );
    }

    const data: MicroCMSNewsResponse = await response.json();
    return data.contents;
  } catch (error) {
    console.error("microCMS ニュースデータ取得エラー:", error);
    throw error;
  }
}

/**
 * microCMS からニュースを取得
 */
export async function getNews() {
  try {
    const news = await fetchNewsFromMicroCMS();
    // 新しい順でソート（最新のものを最初に）
    return news.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
    );
  } catch (error) {
    console.error("ニュース取得に失敗しました:", error);
    throw error;
  }
}

/**
 * microCMS からニュースを ID で取得
 */
export async function getNewsByID(id: string) {
  try {
    const news = await fetchNewsFromMicroCMS();
    return news.find((item) => item.id === id);
  } catch (error) {
    console.error("ニュース取得に失敗しました:", error);
    throw error;
  }
}

/**
 * microCMS から全パートを取得
 */
export async function fetchPartsFromMicroCMS(): Promise<MicroCMSPart[]> {
  const apiKey = process.env.MICROCMS_API_KEY;
  const serviceDomain = process.env.MICROCMS_SERVICE_DOMAIN;

  if (!apiKey || !serviceDomain) {
    throw new Error("microCMS 環境変数が設定されていません");
  }

  const url = `https://${serviceDomain}.microcms.io/api/v1/parts`;

  try {
    const response = await fetch(url, {
      headers: {
        "X-MICROCMS-API-KEY": apiKey,
      },
      next: { revalidate: 60 },
    });

    if (!response.ok) {
      throw new Error(
        `microCMS API エラー: ${response.status} ${response.statusText}`,
      );
    }

    const data: MicroCMSPartResponse = await response.json();
    return data.contents;
  } catch (error) {
    console.error("microCMS パートデータ取得エラー:", error);
    throw error;
  }
}

/**
 * microCMS から全協賛を取得
 */
export async function fetchSponsorsFromMicroCMS(): Promise<MicroCMSSponsor[]> {
  const apiKey = process.env.MICROCMS_API_KEY;
  const serviceDomain = process.env.MICROCMS_SERVICE_DOMAIN;

  if (!apiKey || !serviceDomain) {
    throw new Error("microCMS 環境変数が設定されていません");
  }

  const url = `https://${serviceDomain}.microcms.io/api/v1/sponsors`;

  try {
    const response = await fetch(url, {
      headers: {
        "X-MICROCMS-API-KEY": apiKey,
      },
      next: { revalidate: 60 },
    });

    if (!response.ok) {
      throw new Error(
        `microCMS API エラー: ${response.status} ${response.statusText}`,
      );
    }

    const data: MicroCMSSponsorResponse = await response.json();
    return data.contents;
  } catch (error) {
    console.error("microCMS 協賛データ取得エラー:", error);
    throw error;
  }
}
