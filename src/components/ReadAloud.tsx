"use client";

import { useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";

// Browser text-to-speech only speaks a language if the device has a voice for
// it. Chrome on Windows ships no Bangla voice at all, so previously asking for
// "bn-BD" produced silence (or English mispronouncing Bangla script). This now
// (1) waits for the voice list, (2) picks a real voice for the page language,
// (3) says so plainly when none exists, and (4) reads in short chunks, because
// Chrome silently stops very long single utterances.

function waitForVoices(): Promise<SpeechSynthesisVoice[]> {
  const synth = window.speechSynthesis;
  const now = synth.getVoices();
  if (now.length > 0) return Promise.resolve(now);
  return new Promise((resolve) => {
    const done = () => {
      synth.removeEventListener("voiceschanged", done);
      resolve(synth.getVoices());
    };
    synth.addEventListener("voiceschanged", done);
    setTimeout(done, 1500); // some browsers never fire the event
  });
}

function pickVoice(voices: SpeechSynthesisVoice[], locale: string): SpeechSynthesisVoice | null {
  const prefix = locale === "bn" ? "bn" : "en";
  const matches = voices.filter((v) => v.lang.toLowerCase().replace("_", "-").startsWith(prefix));
  if (matches.length === 0) return null;
  const preferred = locale === "bn" ? "bn-bd" : "en-us";
  return matches.find((v) => v.lang.toLowerCase().replace("_", "-") === preferred) ?? matches[0];
}

function chunk(text: string, max = 180): string[] {
  const sentences = text.split(/(?<=[.।!?])\s+/).filter(Boolean);
  const out: string[] = [];
  let current = "";
  for (const s of sentences) {
    if (current && (current + " " + s).length > max) {
      out.push(current);
      current = s;
    } else {
      current = current ? current + " " + s : s;
    }
  }
  if (current) out.push(current);
  return out;
}

export function ReadAloud({ text }: { text: string }) {
  const t = useTranslations("hazardPage");
  const locale = useLocale();
  // Remember WHICH text is being read, so switching language (new text) turns
  // the button back to "Read aloud" without any effect-driven state reset.
  const [speakingText, setSpeakingText] = useState<string | null>(null);
  const [problem, setProblem] = useState<"unsupported" | "noVoice" | null>(null);
  const speaking = speakingText === text;

  // Stop any speech when the text changes or the page is left.
  useEffect(() => {
    return () => {
      if (typeof window !== "undefined" && "speechSynthesis" in window) window.speechSynthesis.cancel();
    };
  }, [text]);

  async function toggle() {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      setProblem("unsupported");
      return;
    }
    const synth = window.speechSynthesis;
    if (speaking) {
      synth.cancel();
      setSpeakingText(null);
      return;
    }

    const voices = await waitForVoices();
    const voice = pickVoice(voices, locale);
    if (!voice) {
      setProblem("noVoice");
      return;
    }
    setProblem(null);

    synth.cancel();
    const parts = chunk(text);
    parts.forEach((part, i) => {
      const utter = new SpeechSynthesisUtterance(part);
      utter.voice = voice;
      utter.lang = voice.lang;
      if (i === parts.length - 1) utter.onend = () => setSpeakingText(null);
      utter.onerror = (e) => {
        if (e.error !== "canceled" && e.error !== "interrupted") setSpeakingText(null);
      };
      synth.speak(utter);
    });
    setSpeakingText(text);
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
      {problem === "unsupported" && <p className="mt-1 text-xs text-ink-3">{t("readAloudUnsupported")}</p>}
      {problem === "noVoice" && <p className="mt-1 max-w-md text-xs text-ink-3">{t("readAloudNoVoice")}</p>}
    </div>
  );
}
