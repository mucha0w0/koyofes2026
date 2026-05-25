import { Suspense } from "react";
import { getEvents } from "@/lib/microcms";
import { Event } from "@/lib/types/event";
import { EventListClient } from "./client";

export const dynamic = "force-dynamic";

export default async function EventListPage() {
  let events: Event[] = [];
  let error: string | null = null;

  try {
    const fetchedEvents = await getEvents();
    events = fetchedEvents as Event[];
  } catch (err) {
    console.error("イベント取得エラー:", err);
    error = "イベント情報の読み込みに失敗しました。";
  }

  return (
    <Suspense fallback={<div>読み込み中...</div>}>
      <EventListClient events={events} error={error} />
    </Suspense>
  );
}
