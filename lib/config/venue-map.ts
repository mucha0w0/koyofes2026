/**
 * 会場マップ（`/guide/map`）の静的データ。
 * 企画配置は microCMS とつながない。場所が決まったらこのファイルの `location` / `use` を埋める。
 */

export const MAP_PENDING_LABEL = '調整中';

export type MapLocation = string | null;

export interface FestivalFacility {
  id: string;
  label: string;
  /** 確定した場所。未定なら null（「調整中」と表示） */
  location: MapLocation;
  /** 構内図から分かることなど、場所が未定でも出してよい補足 */
  hint?: string;
}

export interface CampusArea {
  id: string;
  name: string;
  /** こうよう祭での用途。未定なら null */
  use: MapLocation;
}

export interface CampusAreaGroup {
  id: string;
  label: string;
  areas: CampusArea[];
}

export interface MapLegendItem {
  id: string;
  label: string;
  mark: string;
}

export interface MapRelatedLink {
  href: string;
  label: string;
  description: string;
}

export interface MapPageSection {
  id: string;
  label: string;
}

export const MAP_STATUS_NOTE =
  '企画の配置は現在調整中です。校内の建物配置は下の構内図を参照してください。詳細な教室配置は、確定後にこのページとパンフレットへ掲載します。';

export const CAMPUS_MAP_ALT =
  '豊田高専の構内図。正門、第1・第2駐車場、一般管理棟、各学科棟、講義棟、図書館、第1・第2体育館、陸上競技場、野球場、AED、駐輪場などが記載されています。こうよう祭の企画配置は含まれていません。';

export const CAMPUS_MAP_CAPTION =
  '学校の構内図です。こうよう祭の企画配置は含まれていません。小さい画面では図を左右にスクロールするか、ピンチで拡大できます。';

export const MAP_PAGE_SECTIONS = [
  { id: 'campus-map', label: '構内図' },
  { id: 'facilities', label: '主要施設' },
  { id: 'areas', label: 'エリア' },
  { id: 'related', label: '関連案内' },
] as const satisfies MapPageSection[];

/** 現在の構内図に載っている凡例 */
export const CAMPUS_MAP_LEGEND = [
  { id: 'bicycle', label: '駐輪場', mark: '灰色の塗り' },
  { id: 'aed', label: 'AED', mark: 'ハートマーク' },
] as const satisfies MapLegendItem[];

/**
 * 来場案内として出す施設。
 * `location` が null のものは「調整中」。構内図から確実に言えることだけ `hint` に書く。
 */
export const FESTIVAL_FACILITIES = [
  { id: 'reception', label: '受付・案内', location: null },
  { id: 'headquarters', label: '本部', location: null },
  { id: 'first-aid', label: '救護室', location: null },
  {
    id: 'restroom',
    label: 'トイレ',
    location: null,
    hint: '構内図に屋外便所が掲載されています。',
  },
  { id: 'rest', label: '休憩スペース', location: null },
  { id: 'stage', label: 'ステージ', location: null },
  { id: 'food', label: '模擬店・飲食', location: null },
  { id: 'trash', label: 'ごみ置き場', location: null },
  {
    id: 'aed',
    label: 'AED',
    location: '構内図のハートマーク',
  },
  {
    id: 'bicycle',
    label: '駐輪場',
    location: '構内図の凡例（灰色の塗り）',
  },
] as const satisfies FestivalFacility[];

/**
 * 構内図に載っている来場者向けの建物・屋外。
 * 学生寮は来場案内から外している。`use` は祭での用途が決まってから入れる。
 */
export const CAMPUS_AREA_GROUPS = [
  {
    id: 'entry',
    label: '入口・駐車場',
    areas: [
      { id: 'main-gate', name: '正門', use: null },
      { id: 'parking-1', name: '第1駐車場', use: null },
      { id: 'parking-2', name: '第2駐車場', use: null },
    ],
  },
  {
    id: 'buildings',
    label: '建物',
    areas: [
      { id: 'admin', name: '一般管理棟', use: null },
      { id: 'architecture', name: '建築学科棟', use: null },
      { id: 'electrical', name: '電気・電子システム工学科棟', use: null },
      { id: 'mechanical', name: '機械工学科棟', use: null },
      { id: 'information', name: '情報工学科棟', use: null },
      { id: 'civil', name: '環境都市工学科棟', use: null },
      { id: 'advanced', name: '専攻科棟', use: null },
      { id: 'monozukuri', name: 'ものづくりセンター', use: null },
      { id: 'lecture-1', name: '第1講義棟', use: null },
      { id: 'lecture-2', name: '第2講義棟', use: null },
      { id: 'library', name: '図書館', use: null },
      { id: 'koyokai', name: '豊田工業会館', use: null },
      { id: 'welfare', name: '福利厚生施設（食堂）', use: null },
      { id: 'gym-1', name: '第1体育館', use: null },
      { id: 'gym-2', name: '第2体育館', use: null },
    ],
  },
  {
    id: 'outdoor',
    label: '屋外',
    areas: [
      { id: 'track', name: '陸上競技場', use: null },
      { id: 'baseball', name: '野球場', use: null },
      { id: 'handball', name: 'ハンドボールコート', use: null },
      { id: 'tennis', name: 'テニスコート', use: null },
      { id: 'pool', name: 'プール', use: null },
      { id: 'outdoor-restroom', name: '屋外便所', use: null },
    ],
  },
] as const satisfies CampusAreaGroup[];

export const MAP_RELATED_LINKS = [
  { href: '/guide/access', label: 'アクセス', description: '電車・バス・車での行き方' },
  { href: '/guide/faq', label: 'よくある質問', description: '入場や注意事項' },
  { href: '/official/pamphlet', label: 'パンフレット', description: '紙面の案内' },
] as const satisfies MapRelatedLink[];

export function mapLocationLabel(location: MapLocation): string {
  const value = location?.trim();
  return value ? value : MAP_PENDING_LABEL;
}

export function isMapLocationReady(location: MapLocation): boolean {
  return Boolean(location?.trim());
}
