import React, { useEffect } from "react";

export function EventCard({ className = "", onClick, children, ariaLabel }) {
  return (
    <button
      type="button"
      data-event-card
      onClick={onClick}
      className={className}
      aria-label={ariaLabel ?? "Open event"}
    >
      {children ?? null}
    </button>
  );
}

export function EventPopup({ open, onClose, className = "", children }) {
  useEffect(() => {
    if (!open) return;

    const onKeyDown = (e) => {
      if (e.key === "Escape") onClose?.();
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className={["fixed inset-0 z-50", className].join(" ")}
      role="dialog"
      aria-modal="true"
    >
      <button
        type="button"
        onClick={onClose}
        aria-label="Close popup"
        className="absolute inset-0 bg-black/40"
      />

      <div className="pointer-events-none absolute inset-0 flex items-center justify-center p-4">
        <div className="pointer-events-auto relative min-h-[180px] w-full max-w-xl rounded-2xl bg-white p-6 shadow-[0_24px_80px_rgba(0,0,0,0.35)]">
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="absolute right-3 top-3 grid h-10 w-10 place-items-center rounded-xl bg-black/5 text-[18px] font-black text-[#07324a] transition hover:bg-black/10"
          >
            ×
          </button>

          {children ?? null}
        </div>
      </div>
    </div>
  );
}
