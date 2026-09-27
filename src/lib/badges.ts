"use client";

// Local progress tracking (P5-6). Deliberately client-only and per-device:
// there is no server table for this, so nothing here is shared across
// devices or shown to anyone else. Good enough for a kid or a classroom on
// one device; revisit with a real `profiles`-linked table if cross-device
// progress becomes a requirement.

const STORAGE_KEY = "surokkha-bd:progress:v1";

export interface Progress {
  quizzesCompleted: string[]; // hazard slugs
  gamesPlayed: Record<string, number>; // game id -> play count
  gameBestScores: Record<string, number>; // game id -> best score
}

const EMPTY: Progress = { quizzesCompleted: [], gamesPlayed: {}, gameBestScores: {} };

function read(): Progress {
  if (typeof window === "undefined") return EMPTY;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return EMPTY;
    const parsed = JSON.parse(raw);
    return { ...EMPTY, ...parsed };
  } catch {
    return EMPTY;
  }
}

function write(p: Progress) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(p));
  } catch {
    // Storage full or disabled -- progress just won't persist this session.
  }
}

export function getProgress(): Progress {
  return read();
}

export function recordQuizCompletion(hazardSlug: string): Progress {
  const p = read();
  if (!p.quizzesCompleted.includes(hazardSlug)) p.quizzesCompleted.push(hazardSlug);
  write(p);
  return p;
}

export function recordGamePlay(gameId: string, score: number): Progress {
  const p = read();
  p.gamesPlayed[gameId] = (p.gamesPlayed[gameId] ?? 0) + 1;
  p.gameBestScores[gameId] = Math.max(p.gameBestScores[gameId] ?? 0, score);
  write(p);
  return p;
}

export interface Badge {
  id: string;
  label_en: string;
  label_bn: string;
  earned: boolean;
}

export function computeBadges(p: Progress, totalHazards: number): Badge[] {
  return [
    {
      id: "first-quiz",
      label_en: "First quiz completed",
      label_bn: "প্রথম কুইজ সম্পন্ন",
      earned: p.quizzesCompleted.length >= 1,
    },
    {
      id: "five-quizzes",
      label_en: "5 hazard quizzes completed",
      label_bn: "৫টি হ্যাজার্ড কুইজ সম্পন্ন",
      earned: p.quizzesCompleted.length >= 5,
    },
    {
      id: "all-quizzes",
      label_en: "Every hazard quiz completed",
      label_bn: "সবগুলো হ্যাজার্ড কুইজ সম্পন্ন",
      earned: p.quizzesCompleted.length >= totalHazards,
    },
    {
      id: "go-bag-packed",
      label_en: "Packed a perfect go-bag",
      label_bn: "নিখুঁত জরুরি ব্যাগ গোছানো হয়েছে",
      earned: (p.gameBestScores["go-bag"] ?? 0) >= 100,
    },
    {
      id: "lightning-expert",
      label_en: "Lightning safety expert",
      label_bn: "বজ্রপাত নিরাপত্তা বিশেষজ্ঞ",
      earned: (p.gameBestScores["lightning"] ?? 0) >= 100,
    },
  ];
}
