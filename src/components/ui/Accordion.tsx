"use client";

import { useId, useState } from "react";

export function AccordionItem({
  question,
  answer,
  defaultOpen = false,
}: {
  question: React.ReactNode;
  answer: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  const id = useId();
  return (
    <div className="border-b border-border py-3">
      <button
        type="button"
        aria-expanded={open}
        aria-controls={id}
        onClick={() => setOpen((v) => !v)}
        className="flex min-h-11 w-full items-center justify-between gap-4 text-left font-semibold"
      >
        <span>{question}</span>
        <span aria-hidden="true" className={`shrink-0 transition-transform ${open ? "rotate-45" : ""}`}>
          +
        </span>
      </button>
      {open && (
        <div id={id} className="mt-2 text-ink-2">
          {answer}
        </div>
      )}
    </div>
  );
}
