import type { RankingTab, WaitLevel } from '@/lib/config/rankingConfig';

export type RankingVoteErrorCode =
  | 'RANKING_DISABLED'
  | 'DB_UNAVAILABLE'
  | 'BAD_REQUEST'
  | 'INVALID_SIGNATURE'
  | 'UNKNOWN_BOOTH'
  | 'RATE_LIMITED'
  | 'SERVER_ERROR';

export interface RankingVoteSuccess {
  ok: true;
}

export interface RankingVoteError {
  error: string;
  code: RankingVoteErrorCode;
}

export interface RankingOverallItem {
  rank: number;
  slug: string;
  title: string;
  organization: string;
  icon: string;
  score: number;
  average: number;
  voteCount: number;
}

export interface RankingTrendItem {
  rank: number;
  slug: string;
  title: string;
  organization: string;
  icon: string;
  uniqueVisitors: number;
}

export interface RankingOverallResponse {
  tab: 'overall';
  generatedAt: string;
  items: RankingOverallItem[];
}

export interface RankingTrendResponse {
  tab: 'trend';
  generatedAt: string;
  items: RankingTrendItem[];
}

export interface RankingWaitItem {
  rank: number;
  slug: string;
  title: string;
  organization: string;
  icon: string;
  level: WaitLevel;
  score: number;
  voteCount: number;
  lastVotedAt: string;
}

export interface RankingWaitResponse {
  tab: 'wait';
  generatedAt: string;
  items: RankingWaitItem[];
}

export type RankingResponse = RankingOverallResponse | RankingTrendResponse | RankingWaitResponse;

export interface RankingApiError {
  error: string;
  code: 'RANKING_DISABLED' | 'DB_UNAVAILABLE' | 'BAD_REQUEST' | 'SERVER_ERROR';
}

export type { RankingTab };
