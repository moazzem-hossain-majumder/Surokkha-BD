"use client";

// A small localStorage-backed retry queue for community reports submitted
// while offline. This is a simpler substitute for the Background Sync API
// (which has poor browser support, notably on iOS Safari): it retries when
// the browser's `online` event fires, and lets the person retry manually.
const KEY = "offline-report-queue";

export interface QueuedReport {
  id: string;
  payload: Record<string, unknown>;
  queuedAt: string;
}

function readQueue(): QueuedReport[] {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as QueuedReport[]) : [];
  } catch {
    return [];
  }
}

function writeQueue(items: QueuedReport[]) {
  try {
    localStorage.setItem(KEY, JSON.stringify(items));
  } catch {
    // Storage full or unavailable: the report is lost, which is the best
    // this fallback can do without a real background-sync API.
  }
}

export function enqueueReport(payload: Record<string, unknown>): void {
  const items = readQueue();
  items.push({ id: crypto.randomUUID(), payload, queuedAt: new Date().toISOString() });
  writeQueue(items);
}

export function getQueueLength(): number {
  return readQueue().length;
}

export async function flushQueue(submit: (payload: Record<string, unknown>) => Promise<boolean>): Promise<number> {
  const items = readQueue();
  const remaining: QueuedReport[] = [];
  let sent = 0;
  for (const item of items) {
    const ok = await submit(item.payload).catch(() => false);
    if (ok) sent += 1;
    else remaining.push(item);
  }
  writeQueue(remaining);
  return sent;
}
