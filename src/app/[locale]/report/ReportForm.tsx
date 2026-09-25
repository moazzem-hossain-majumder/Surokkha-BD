"use client";

import dynamic from "next/dynamic";
import { useMemo, useRef, useState, useEffect } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { REPORT_TYPES, REPORT_TYPE_LABELS, type ReportInput, type ReportType } from "@/lib/reports";
import { compressImageToDataUrl } from "@/lib/compressImage";
import { enqueueReport } from "@/lib/offlineQueue";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

const PinPicker = dynamic(() => import("./PinPicker").then((m) => m.PinPicker), {
  ssr: false,
  loading: () => <div className="grid h-full place-items-center text-ink-3">…</div>,
});

type Status = "idle" | "submitting" | "success" | "queued" | "error";

export function ReportForm() {
  const t = useTranslations("report");
  const locale = useLocale();
  const router = useRouter();
  const startedAt = useRef<number>(0);

  const [type, setType] = useState<ReportType>("flooding");
  const [description, setDescription] = useState("");
  const [contact, setContact] = useState("");
  const [pin, setPin] = useState<{ lat: number; lng: number } | null>(null);
  const [photoDataUrl, setPhotoDataUrl] = useState<string | null>(null);
  const [status, setStatus] = useState<Status>("idle");
  const [errorKey, setErrorKey] = useState<string | null>(null);

  useEffect(() => {
    startedAt.current = Date.now();
  }, []);

  const canSubmit = useMemo(
    () => description.trim().length >= 10 && pin !== null && status !== "submitting",
    [description, pin, status]
  );

  function useMyLocation() {
    if (!("geolocation" in navigator)) return;
    navigator.geolocation.getCurrentPosition((pos) => setPin({ lat: pos.coords.latitude, lng: pos.coords.longitude }));
  }

  async function handlePhoto(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const dataUrl = await compressImageToDataUrl(file);
      setPhotoDataUrl(dataUrl);
    } catch {
      setErrorKey("photoFailed");
    }
  }

  async function submit(payload: Record<string, unknown>): Promise<boolean> {
    const res = await fetch("/api/reports", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    return res.ok;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!pin) return;
    setStatus("submitting");
    setErrorKey(null);

    const payload: ReportInput = {
      type,
      description: description.trim(),
      lat: pin.lat,
      lng: pin.lng,
      contactOptional: contact.trim() || undefined,
      photoDataUrl: photoDataUrl ?? undefined,
      website: "",
      elapsedMs: Date.now() - startedAt.current,
    };

    if (!navigator.onLine) {
      enqueueReport(payload);
      setStatus("queued");
      return;
    }

    try {
      const ok = await submit(payload);
      if (ok) {
        setStatus("success");
        router.refresh();
      } else {
        enqueueReport(payload);
        setStatus("queued");
      }
    } catch {
      enqueueReport(payload);
      setStatus("queued");
    }
  }

  if (status === "success") {
    return <Card className="p-6 text-brand">{t("thankYou")}</Card>;
  }
  if (status === "queued") {
    return <Card className="p-6">{t("queuedNotice")}</Card>;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Honeypot: hidden from real users via CSS, visible to naive bots that fill every field. */}
      <div aria-hidden="true" className="absolute -left-[9999px]">
        <label>
          Website
          <input tabIndex={-1} autoComplete="off" name="website" />
        </label>
      </div>

      <fieldset>
        <legend className="text-sm font-semibold">{t("type")}</legend>
        <div className="mt-2 flex flex-wrap gap-2">
          {REPORT_TYPES.map((rt) => (
            <button
              key={rt}
              type="button"
              aria-pressed={type === rt}
              onClick={() => setType(rt)}
              className="h-10 rounded-full border border-border bg-surface px-3 text-sm font-medium hover:bg-surface-2 aria-pressed:border-brand aria-pressed:bg-brand-soft"
            >
              {locale === "bn" ? REPORT_TYPE_LABELS[rt].bn : REPORT_TYPE_LABELS[rt].en}
            </button>
          ))}
        </div>
      </fieldset>

      <label className="block">
        <span className="text-sm font-semibold">{t("description")}</span>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          minLength={10}
          maxLength={1000}
          rows={4}
          className="mt-1 w-full rounded-input border border-border bg-surface px-3 py-2"
          placeholder={t("descriptionPlaceholder")}
        />
      </label>

      <div>
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold">{t("location")}</span>
          <button type="button" onClick={useMyLocation} className="text-sm font-semibold text-brand underline">
            {t("useLocation")}
          </button>
        </div>
        <p className="mt-1 text-xs text-ink-3">{t("locationHint")}</p>
        <div className="mt-2 h-64 overflow-hidden rounded-card border border-border">
          <PinPicker pin={pin} onChange={setPin} />
        </div>
      </div>

      <label className="block">
        <span className="text-sm font-semibold">{t("photo")}</span>
        <input type="file" accept="image/*" capture="environment" onChange={handlePhoto} className="mt-1 block text-sm" />
        <span className="mt-1 block text-xs text-ink-3">{t("photoHint")}</span>
      </label>

      <label className="block">
        <span className="text-sm font-semibold">{t("contact")}</span>
        <input
          value={contact}
          onChange={(e) => setContact(e.target.value)}
          className="mt-1 h-11 w-full rounded-input border border-border bg-surface px-3"
          placeholder={t("contactPlaceholder")}
        />
        <span className="mt-1 block text-xs text-ink-3">{t("contactHint")}</span>
      </label>

      <Button type="submit" disabled={!canSubmit} className="w-full">
        {status === "submitting" ? t("submitting") : t("submit")}
      </Button>
      {errorKey && <p className="text-sm text-sun">{t(`errors.${errorKey}`)}</p>}
      {!pin && <p className="text-sm text-ink-3">{t("pinRequired")}</p>}
    </form>
  );
}
