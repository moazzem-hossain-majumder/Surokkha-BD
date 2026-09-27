"use client";

import { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { recordGamePlay } from "@/lib/badges";

// Essential items reflect the go-bag guidance already in the cyclone/flood
// hazard guides (drinking water, dry food, medicine, waterproof documents,
// torch, charged phone) plus standard, widely-taught emergency-kit staples
// (first aid, radio, whistle, cash, ORS). Distractors are deliberately
// "nice to have, not urgent" items (electronics, decor) rather than anything
// that could be someone's real accessibility need, so the game never scores
// a genuine necessity as "wrong".
interface Item {
  id: string;
  label: { en: string; bn: string };
  essential: boolean;
}

const ITEMS: Item[] = [
  { id: "water", label: { en: "Drinking water", bn: "খাবার পানি" }, essential: true },
  { id: "dry-food", label: { en: "Dry food (biscuits, muri)", bn: "শুকনো খাবার (বিস্কুট, মুড়ি)" }, essential: true },
  { id: "medicine", label: { en: "Essential medicines", bn: "প্রয়োজনীয় ওষুধ" }, essential: true },
  { id: "documents", label: { en: "Documents in a waterproof pouch", bn: "পানিরোধী ব্যাগে জরুরি কাগজপত্র" }, essential: true },
  { id: "torch", label: { en: "Torch / flashlight", bn: "টর্চ লাইট" }, essential: true },
  { id: "phone", label: { en: "Charged phone and power bank", bn: "চার্জ দেওয়া ফোন ও পাওয়ার ব্যাংক" }, essential: true },
  { id: "radio", label: { en: "Battery or hand-crank radio", bn: "ব্যাটারি বা হাতে চালানো রেডিও" }, essential: true },
  { id: "first-aid", label: { en: "First aid kit", bn: "প্রাথমিক চিকিৎসা বাক্স" }, essential: true },
  { id: "whistle", label: { en: "Whistle", bn: "বাঁশি" }, essential: true },
  { id: "cash", label: { en: "A little cash", bn: "সামান্য নগদ টাকা" }, essential: true },
  { id: "clothes", label: { en: "A change of dry clothes", bn: "শুকনো কাপড়ের বদল" }, essential: true },
  { id: "ors", label: { en: "ORS packets", bn: "খাবার স্যালাইন (ওআরএস)" }, essential: true },
  { id: "remote", label: { en: "TV remote control", bn: "টিভির রিমোট" }, essential: false },
  { id: "console", label: { en: "Video game console", bn: "ভিডিও গেম কনসোল" }, essential: false },
  { id: "boardgame", label: { en: "A board game", bn: "একটি বোর্ড গেম" }, essential: false },
  { id: "mirror", label: { en: "A decorative mirror", bn: "একটি শোপিস আয়না" }, essential: false },
  { id: "suit", label: { en: "A formal suit", bn: "একটি ফরমাল স্যুট" }, essential: false },
  { id: "pot", label: { en: "A heavy cooking pot", bn: "একটি ভারী রান্নার পাতিল" }, essential: false },
  { id: "jewelry", label: { en: "A jewelry box", bn: "একটি গহনার বাক্স" }, essential: false },
  { id: "umbrella-stand", label: { en: "A large umbrella stand", bn: "একটি বড় ছাতা স্ট্যান্ড" }, essential: false },
];

const MAX_ITEMS = 10;
const ESSENTIAL_COUNT = ITEMS.filter((i) => i.essential).length;

export function GoBagGame() {
  const t = useTranslations("games.goBag");
  const locale = useLocale();
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [submitted, setSubmitted] = useState(false);

  function toggle(id: string) {
    if (submitted) return;
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else if (next.size < MAX_ITEMS) next.add(id);
      return next;
    });
  }

  function submit() {
    const essentialPicked = ITEMS.filter((i) => i.essential && selected.has(i.id)).length;
    const wrongPicked = ITEMS.filter((i) => !i.essential && selected.has(i.id)).length;
    const score = Math.max(0, Math.min(100, Math.round((essentialPicked / Math.min(MAX_ITEMS, ESSENTIAL_COUNT)) * 100) - wrongPicked * 5));
    recordGamePlay("go-bag", score);
    setSubmitted(true);
  }

  function reset() {
    setSelected(new Set());
    setSubmitted(false);
  }

  const essentialPicked = ITEMS.filter((i) => i.essential && selected.has(i.id)).length;
  const wrongPicked = ITEMS.filter((i) => !i.essential && selected.has(i.id)).length;
  const missed = ITEMS.filter((i) => i.essential && !selected.has(i.id));

  return (
    <Card className="p-6">
      <p className="text-ink-2">{t("instructions", { max: MAX_ITEMS })}</p>
      <p className="mt-1 text-sm font-semibold">{t("selectedCount", { count: selected.size, max: MAX_ITEMS })}</p>

      <div className="mt-4 flex flex-wrap gap-2">
        {ITEMS.map((item) => {
          const isSelected = selected.has(item.id);
          const revealWrong = submitted && isSelected && !item.essential;
          const revealMissed = submitted && !isSelected && item.essential;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => toggle(item.id)}
              disabled={submitted}
              className={`rounded-full border px-3 py-1.5 text-sm font-medium ${
                revealWrong
                  ? "border-sun bg-sun/10"
                  : revealMissed
                    ? "border-dashed border-ink-3 text-ink-3"
                    : isSelected
                      ? "border-brand bg-brand/10"
                      : "border-border bg-surface hover:bg-surface-2"
              }`}
            >
              {locale === "bn" ? item.label.bn : item.label.en}
            </button>
          );
        })}
      </div>

      {!submitted ? (
        <div className="mt-5">
          <Button type="button" onClick={submit} disabled={selected.size === 0}>
            {t("packBag")}
          </Button>
        </div>
      ) : (
        <div className="mt-5 space-y-1 text-sm">
          <p className="font-semibold">{t("resultsTitle", { picked: essentialPicked, total: ESSENTIAL_COUNT })}</p>
          {wrongPicked > 0 && <p className="text-sun">{t("wrongPicked", { count: wrongPicked })}</p>}
          {missed.length > 0 && (
            <p className="text-ink-2">
              {t("missedItems")}: {missed.map((m) => (locale === "bn" ? m.label.bn : m.label.en)).join(", ")}
            </p>
          )}
          <button type="button" onClick={reset} className="mt-3 h-9 rounded-full border border-border bg-surface px-3 text-xs font-semibold hover:bg-surface-2">
            {t("playAgain")}
          </button>
        </div>
      )}
    </Card>
  );
}
