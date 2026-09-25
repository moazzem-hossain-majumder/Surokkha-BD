"use client";

import { useLocale, useTranslations } from "next-intl";
import { useState } from "react";

export function ReadAloud({ text }: { text: string }) {
  const t = useTranslations("hazardPage");
  const locale = useLocale();
  const [speaking, setSpeaking] = useState(false);
  const [unsupported, setUnsupported] = useState(false);

  function toggle() {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      setUnsupported(true);
      return;
    }
    if (speaking) {
      window.speechSynthesis.cancel();
      setSpeaking(false);
      return;
    }
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = locale === "bn" ? "bn-BD" : "en-US";
    utter.onend = () => setSpeaking(false);
    utter.onerror = () => setSpeaking(false);
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utter);
    setSpeaking(true);
  }

  return (
    <div>
      <button
        type="button"
        onClick={toggle}
        aria-pressed={speaking}
        className="inline-flex h-11 items-center gap-2 rounded-full border border-border bg-surface px-4 text-sm font-semibold hover:bg-surface-2"
      >
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M4 9v6h4l5 5V4L8 9H4Z" />
          {speaking ? <path d="M18 8a5 5 0 0 1 0 8M20.5 5.5a9 9 0 0 1 0 13" /> : <path d="M16 9a3 3 0 0 1 0 6" />}
        </svg>
        {speaking ? t("stopReading") : t("readAloud")}
      </button>
      {unsupported && <p className="mt-1 text-xs text-ink-3">{t("readAloudUnsupported")}</p>}
    </div>
  );
}
