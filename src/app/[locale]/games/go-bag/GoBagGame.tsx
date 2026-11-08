"use client";

import { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Confetti } from "@/components/ui/Confetti";
import { recordGamePlay } from "@/lib/badges";
import { playZip, playThud, playSuccessFanfare } from "@/lib/soundEffects";

interface Item {
  id: string;
  label: { en: string; bn: string };
  essential: boolean;
  category: "survival" | "food" | "medical" | "luxury";
}

const ITEMS: Item[] = [
  { id: "water", label: { en: "Drinking water", bn: "খাবার পানি" }, essential: true, category: "food" },
  { id: "dry-food", label: { en: "Dry food (biscuits, muri)", bn: "শুকনো খাবার (বিস্কুট, মুড়ি)" }, essential: true, category: "food" },
  { id: "medicine", label: { en: "Essential medicines", bn: "প্রয়োজনীয় ওষুধ" }, essential: true, category: "medical" },
  { id: "documents", label: { en: "Documents in waterproof pouch", bn: "পানিরোধী ব্যাগে জরুরি কাগজপত্র" }, essential: true, category: "survival" },
  { id: "torch", label: { en: "Torch / flashlight", bn: "টর্চ লাইট" }, essential: true, category: "survival" },
  { id: "phone", label: { en: "Charged phone & power bank", bn: "চার্জ দেওয়া ফোন ও পাওয়ার ব্যাংক" }, essential: true, category: "survival" },
  { id: "radio", label: { en: "Battery / hand-crank radio", bn: "ব্যাটারি বা হাতে চালানো রেডিও" }, essential: true, category: "survival" },
  { id: "first-aid", label: { en: "First aid kit", bn: "প্রাথমিক চিকিৎসা বাক্স" }, essential: true, category: "medical" },
  { id: "whistle", label: { en: "Rescue whistle", bn: "উদ্ধার বাঁশি" }, essential: true, category: "survival" },
  { id: "cash", label: { en: "Emergency cash", bn: "সামান্য নগদ টাকা" }, essential: true, category: "survival" },
  { id: "clothes", label: { en: "Change of dry clothes", bn: "শুকনো কাপড়ের বদল" }, essential: true, category: "survival" },
  { id: "ors", label: { en: "ORS packets", bn: "খাবার স্যালাইন (ওআরএস)" }, essential: true, category: "medical" },
  { id: "remote", label: { en: "TV remote control", bn: "টিভির রিমোট" }, essential: false, category: "luxury" },
  { id: "console", label: { en: "Video game console", bn: "ভিডিও গেম কনসোল" }, essential: false, category: "luxury" },
  { id: "boardgame", label: { en: "A board game", bn: "একটি বোর্ড গেম" }, essential: false, category: "luxury" },
  { id: "mirror", label: { en: "A decorative mirror", bn: "একটি শোপিস আয়না" }, essential: false, category: "luxury" },
  { id: "suit", label: { en: "A formal suit", bn: "একটি ফরমাল স্যুট" }, essential: false, category: "luxury" },
  { id: "pot", label: { en: "Heavy cooking pot", bn: "একটি ভারী রান্নার পাতিল" }, essential: false, category: "luxury" },
  { id: "jewelry", label: { en: "Jewelry box", bn: "একটি গহনার বাক্স" }, essential: false, category: "luxury" },
  { id: "umbrella-stand", label: { en: "Heavy umbrella stand", bn: "একটি বড় ছাতা স্ট্যান্ড" }, essential: false, category: "luxury" },
];

const MAX_ITEMS = 10;
const ESSENTIAL_COUNT = ITEMS.filter((i) => i.essential).length;

export function GoBagGame() {
  const t = useTranslations("games.goBag");
  const locale = useLocale();
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [filter, setFilter] = useState<"all" | "essentials" | "luxury">("all");
  const [submitted, setSubmitted] = useState(false);

  function toggle(id: string) {
    if (submitted) return;
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
        playThud();
      } else if (next.size < MAX_ITEMS) {
        next.add(id);
        playZip();
      }
      return next;
    });
  }

  function submit() {
    const essentialPicked = ITEMS.filter((i) => i.essential && selected.has(i.id)).length;
    const wrongPicked = ITEMS.filter((i) => !i.essential && selected.has(i.id)).length;
    const score = Math.max(0, Math.min(100, Math.round((essentialPicked / Math.min(MAX_ITEMS, ESSENTIAL_COUNT)) * 100) - wrongPicked * 5));
    recordGamePlay("go-bag", score);
    setSubmitted(true);
    playSuccessFanfare();
  }

  function reset() {
    setSelected(new Set());
    setSubmitted(false);
  }

  const essentialPicked = ITEMS.filter((i) => i.essential && selected.has(i.id)).length;
  const wrongPicked = ITEMS.filter((i) => !i.essential && selected.has(i.id)).length;
  const missed = ITEMS.filter((i) => i.essential && !selected.has(i.id));
  const score = Math.max(0, Math.min(100, Math.round((essentialPicked / Math.min(MAX_ITEMS, ESSENTIAL_COUNT)) * 100) - wrongPicked * 5));

  const filteredItems = ITEMS.filter((i) => {
    if (filter === "essentials") return i.essential;
    if (filter === "luxury") return !i.essential;
    return true;
  });

  return (
    <Card className="relative overflow-hidden border border-border p-6 sm:p-8 shadow-xl bg-surface">
      <Confetti active={submitted && score >= 75} />

      {/* Backpack capacity visualizer tray */}
      <div className="rounded-md border border-border bg-surface-2 p-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-sm bg-brand/10 border border-brand/20 text-brand">
              <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <rect x="4" y="4" width="16" height="16" rx="2" />
                <path d="M9 4v16M15 4v16M4 9h16M4 15h16" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-bold text-ink">
                {locale === "bn" ? "৭২ ঘণ্টার জরুরি গো-ব্যাগ প্যাক করুন" : "72-Hour Emergency Go-Bag"}
              </p>
              <p className="text-xs text-ink-3">{t("instructions", { max: MAX_ITEMS })}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span
              className={`rounded-sm px-2.5 py-1 text-xs font-mono font-semibold border ${
                selected.size === MAX_ITEMS
                  ? "bg-amber-500/10 border-amber-500/30 text-amber-700 dark:text-amber-300"
                  : "bg-surface border-border text-ink"
              }`}
            >
              {selected.size} / {MAX_ITEMS} ITEMS
            </span>
          </div>
        </div>

        {/* 10 Compartment Slots */}
        <div className="mt-3 grid grid-cols-5 gap-1.5 sm:grid-cols-10">
          {Array.from({ length: MAX_ITEMS }).map((_, slotIdx) => {
            const selectedItemIds = Array.from(selected);
            const itemId = selectedItemIds[slotIdx];
            const itemObj = itemId ? ITEMS.find((it) => it.id === itemId) : null;
            return (
              <div
                key={slotIdx}
                className={`flex h-8 items-center justify-center rounded-sm border text-xs font-mono transition-colors duration-150 ${
                  itemObj
                    ? "border-brand bg-brand/10 text-brand font-bold"
                    : "border-dashed border-border bg-surface text-ink-3"
                }`}
                title={itemObj ? (locale === "bn" ? itemObj.label.bn : itemObj.label.en) : `Slot ${slotIdx + 1}`}
              >
                {itemObj ? `✓ ${slotIdx + 1}` : slotIdx + 1}
              </div>
            );
          })}
        </div>
      </div>

      {/* Item Category Filters */}
      <div className="mt-5 flex flex-wrap gap-1.5 border-b border-border pb-2.5">
        {(["all", "essentials", "luxury"] as const).map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setFilter(cat)}
            className={`rounded-sm px-2.5 py-1 text-xs font-semibold transition-colors duration-150 cursor-pointer ${
              filter === cat
                ? "bg-brand text-brand-ink"
                : "text-ink-2 hover:bg-surface-2 hover:text-ink"
            }`}
          >
            {cat === "all"
              ? (locale === "bn" ? "সকল আইটেম" : "All Items")
              : cat === "essentials"
              ? (locale === "bn" ? "প্রয়োজনীয় সামগ্রী" : "Essentials")
              : (locale === "bn" ? "অপ্রয়োজনীয় সামগ্রী" : "Non-Essentials")}
          </button>
        ))}
      </div>

      {/* Item Selection Pills with tactile response */}
      <div className="mt-4 flex flex-wrap gap-2">
        {filteredItems.map((item) => {
          const isSelected = selected.has(item.id);
          const revealWrong = submitted && isSelected && !item.essential;
          const revealMissed = submitted && !isSelected && item.essential;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => toggle(item.id)}
              disabled={submitted}
              className={`flex items-center gap-2 rounded-md border px-3 py-2 text-xs font-medium transition-colors duration-150 cursor-pointer ${
                revealWrong
                  ? "border-sun bg-sun/10 text-sun font-bold"
                  : revealMissed
                  ? "border-dashed border-ink-3/70 bg-surface/50 text-ink-3"
                  : isSelected
                  ? "border-brand bg-brand text-brand-ink font-semibold"
                  : "border-border bg-surface hover:bg-surface-2 text-ink hover:border-ink-3/40"
              }`}
            >
              <span>{locale === "bn" ? item.label.bn : item.label.en}</span>
              {isSelected && !submitted && <span className="font-mono text-[10px] font-bold">[ADDED]</span>}
            </button>
          );
        })}
      </div>

      {/* Action / Results Display */}
      {!submitted ? (
        <div className="mt-6 flex justify-end">
          <Button
            type="button"
            onClick={submit}
            disabled={selected.size === 0}
            className="px-6 h-10 text-sm font-semibold cursor-pointer"
          >
            {t("packBag")}
          </Button>
        </div>
      ) : (
        <div className="mt-6 rounded-md border border-border bg-surface-2 p-5 space-y-3">
          <div className="flex items-center gap-3">
            <div>
              <p className="text-base font-bold text-ink">
                {t("resultsTitle", { picked: essentialPicked, total: ESSENTIAL_COUNT })}
              </p>
              <p className="font-mono text-xs text-ink-3">READINESS SCORE: {score}%</p>
            </div>
          </div>

          {wrongPicked > 0 && (
            <div className="rounded-md bg-sun/10 border border-sun/20 p-3 text-xs font-mono font-semibold text-sun">
              [WARNING] {t("wrongPicked", { count: wrongPicked })}
            </div>
          )}

          {missed.length > 0 && (
            <p className="text-xs text-ink-2 leading-relaxed">
              <strong className="text-ink">{t("missedItems")}:</strong>{" "}
              {missed.map((m) => `${locale === "bn" ? m.label.bn : m.label.en}`).join(", ")}
            </p>
          )}

          <div className="pt-2">
            <button
              type="button"
              onClick={reset}
              className="h-9 rounded-md border border-border bg-surface px-4 text-xs font-semibold text-ink hover:bg-surface-2 transition-colors duration-150 cursor-pointer"
            >
              {t("playAgain")}
            </button>
          </div>
        </div>
      )}
    </Card>
  );
}
