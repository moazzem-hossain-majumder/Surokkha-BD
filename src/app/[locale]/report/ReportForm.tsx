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
  loading: () => (
    <div className="grid h-full place-items-center bg-surface-2 text-ink-3">
      <div className="flex flex-col items-center gap-2">
        <span className="h-5 w-5 rounded-full border-2 border-brand border-t-transparent animate-spin" />
        <span className="font-mono text-xs">Loading Google Maps…</span>
      </div>
    </div>
  ),
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
  const [locating, setLocating] = useState(false);

  useEffect(() => {
    startedAt.current = Date.now();
  }, []);

  const canSubmit = useMemo(
    () => description.trim().length >= 10 && pin !== null && status !== "submitting",
    [description, pin, status]
  );

  function useMyLocation() {
    if (!("geolocation" in navigator)) return;
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setPin({
          lat: Number(pos.coords.latitude.toFixed(6)),
          lng: Number(pos.coords.longitude.toFixed(6)),
        });
        setLocating(false);
      },
      () => setLocating(false),
      { enableHighAccuracy: true, timeout: 8000 }
    );
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
    return (
      <Card className="p-8 text-center border-brand/50">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-md bg-brand/10 text-brand font-bold text-xl">
          ✓
        </div>
        <h2 className="mt-4 text-xl font-bold text-ink">{t("thankYou")}</h2>
        <p className="mt-2 text-sm text-ink-2 max-w-md mx-auto">{t("moderationNote")}</p>
        <div className="mt-6">
          <Button onClick={() => setStatus("idle")} className="rounded-md">
            Submit another report
          </Button>
        </div>
      </Card>
    );
  }

  if (status === "queued") {
    return (
      <Card className="p-8 text-center border-amber-500/50">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-md bg-amber-500/10 text-amber-500 font-bold text-xl">
          ⚡
        </div>
        <h2 className="mt-4 text-xl font-bold text-ink">Queued Offline</h2>
        <p className="mt-2 text-sm text-ink-2 max-w-md mx-auto">{t("queuedNotice")}</p>
        <div className="mt-6">
          <Button onClick={() => setStatus("idle")} className="rounded-md">
            Done
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      {/* Honeypot: hidden from real users via CSS */}
      <div aria-hidden="true" className="absolute -left-[9999px]">
        <label>
          Website
          <input tabIndex={-1} autoComplete="off" name="website" />
        </label>
      </div>

      {/* LEFT COLUMN: Report Details (7 cols on desktop) */}
      <div className="lg:col-span-7 space-y-6">
        {/* 1. Incident Type */}
        <fieldset className="rounded-md border border-border bg-surface p-5">
          <legend className="px-1 text-sm font-semibold text-ink">
            {t("type")}
          </legend>
          <div className="mt-3 flex flex-wrap gap-2">
            {REPORT_TYPES.map((rt) => {
              const isSelected = type === rt;
              return (
                <button
                  key={rt}
                  type="button"
                  aria-pressed={isSelected}
                  onClick={() => setType(rt)}
                  className={`h-9 rounded-md px-3.5 text-xs font-semibold transition-colors duration-150 ${
                    isSelected
                      ? "bg-brand text-brand-ink"
                      : "border border-border bg-surface text-ink hover:bg-surface-2"
                  }`}
                >
                  {locale === "bn" ? REPORT_TYPE_LABELS[rt].bn : REPORT_TYPE_LABELS[rt].en}
                </button>
              );
            })}
          </div>
        </fieldset>

        {/* 2. Situation Description */}
        <div className="rounded-md border border-border bg-surface p-5">
          <div className="flex items-center justify-between">
            <label htmlFor="report-desc" className="text-sm font-semibold text-ink">
              {t("description")}
            </label>
            <span className="font-mono text-xs text-ink-3">
              {description.length}/1000 (min 10)
            </span>
          </div>
          <textarea
            id="report-desc"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            minLength={10}
            maxLength={1000}
            rows={5}
            className="mt-2 w-full rounded-md border border-border bg-bg px-3.5 py-2.5 text-sm text-ink placeholder:text-ink-3 focus:border-brand focus:outline-none transition-colors duration-150"
            placeholder={t("descriptionPlaceholder")}
          />
        </div>

        {/* 3. Photo Attachment */}
        <div className="rounded-md border border-border bg-surface p-5">
          <label className="block">
            <span className="text-sm font-semibold text-ink">{t("photo")}</span>
            <input
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handlePhoto}
              className="mt-2 block w-full text-xs text-ink-2 file:mr-3 file:h-9 file:rounded-md file:border file:border-border file:bg-surface file:px-3 file:text-xs file:font-semibold file:text-ink file:hover:bg-surface-2 cursor-pointer"
            />
            <span className="mt-1.5 block text-xs text-ink-3">{t("photoHint")}</span>
          </label>
          {photoDataUrl && (
            <div className="mt-3 flex items-center gap-3 rounded-md border border-border bg-bg p-2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={photoDataUrl}
                alt="Upload preview"
                className="h-16 w-16 rounded-md object-cover border border-border"
              />
              <div className="text-xs">
                <p className="font-semibold text-ink">Photo attached</p>
                <button
                  type="button"
                  onClick={() => setPhotoDataUrl(null)}
                  className="mt-1 text-xs text-rose-500 hover:underline"
                >
                  Remove photo
                </button>
              </div>
            </div>
          )}
        </div>

        {/* 4. Reporter Contact */}
        <div className="rounded-md border border-border bg-surface p-5">
          <label htmlFor="report-contact" className="block">
            <span className="text-sm font-semibold text-ink">{t("contact")}</span>
            <input
              id="report-contact"
              value={contact}
              onChange={(e) => setContact(e.target.value)}
              className="mt-2 h-10 w-full rounded-md border border-border bg-bg px-3.5 text-sm text-ink placeholder:text-ink-3 focus:border-brand focus:outline-none transition-colors duration-150"
              placeholder={t("contactPlaceholder")}
            />
            <span className="mt-1.5 block text-xs text-ink-3">{t("contactHint")}</span>
          </label>
        </div>

        {/* 5. Submit Controls */}
        <div className="space-y-3">
          <Button
            type="submit"
            disabled={!canSubmit}
            className="w-full h-11 rounded-md text-sm font-semibold"
          >
            {status === "submitting" ? t("submitting") : t("submit")}
          </Button>

          {errorKey && (
            <p className="rounded-md border border-rose-500/30 bg-rose-500/10 p-2.5 text-xs text-rose-400">
              {t(`errors.${errorKey}`)}
            </p>
          )}

          {!pin && (
            <p className="rounded-md border border-border bg-surface p-2.5 text-xs text-ink-3">
              {t("pinRequired")}
            </p>
          )}
        </div>
      </div>

      {/* RIGHT COLUMN: Google Maps Location Picker (5 cols on desktop, sticky) */}
      <div className="lg:col-span-5 lg:sticky lg:top-24 space-y-3">
        <div className="rounded-md border border-border bg-surface p-4">
          <div className="flex items-center justify-between pb-3 border-b border-border">
            <div>
              <p className="text-sm font-bold text-ink">{t("location")}</p>
              <p className="text-[11px] font-mono text-ink-3">GOOGLE MAPS INTERACTIVE PIN</p>
            </div>
            <button
              type="button"
              onClick={useMyLocation}
              disabled={locating}
              className="inline-flex h-8 items-center gap-1.5 rounded-md border border-border bg-surface px-2.5 text-xs font-semibold text-brand hover:bg-surface-2 transition-colors duration-150 disabled:opacity-50"
            >
              <span className="h-2 w-2 rounded-full bg-brand" />
              <span>{locating ? "Locating…" : t("useLocation")}</span>
            </button>
          </div>

          <p className="mt-2 text-xs text-ink-2">{t("locationHint")}</p>

          {/* Interactive Google Map */}
          <div className="mt-3 h-[420px] rounded-md border border-border overflow-hidden">
            <PinPicker pin={pin} onChange={setPin} />
          </div>

          {/* Coordinates HUD */}
          <div className="mt-3 rounded-md border border-border bg-bg p-3 font-mono text-xs">
            {pin ? (
              <div className="flex items-center justify-between">
                <span className="text-ink-3">PIN COORDINATES</span>
                <span className="font-semibold text-brand">
                  {pin.lat.toFixed(5)}° N, {pin.lng.toFixed(5)}° E
                </span>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-ink-3">
                <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                <span>No pin placed yet. Tap map to mark location.</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </form>
  );
}
