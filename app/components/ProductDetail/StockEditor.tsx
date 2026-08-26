"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

interface StockEditorProps {
  productId: number;
  productTitle: string;
  stock: number;
}

export default function StockEditor({
  productId,
  productTitle,
  stock,
}: StockEditorProps) {
  const router = useRouter();

  const [isOpen, setIsOpen] = useState(false);
  const [stockValue, setStockValue] = useState(stock);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const dialogRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  // Lock page scrolling while the modal is open.
  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;

    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen]);

  const closeDialog = useCallback(() => {
    if (isSaving) return;

    setIsOpen(false);
    setError(null);

    // Return keyboard focus to the button that opened the modal.
    requestAnimationFrame(() => {
      triggerRef.current?.focus();
    });
  }, [isSaving]);

  useEffect(() => {
    if (!isOpen) return;

    // Focus the input as soon as the dialog opens.
    inputRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        closeDialog();
        return;
      }

      if (event.key !== "Tab" || !dialogRef.current) {
        return;
      }

      const focusable = dialogRef.current.querySelectorAll<HTMLElement>(
        'button:not([disabled]), input:not([disabled]), [href], [tabindex]:not([tabindex="-1"])',
      );

      // Safely handle an empty focusable collection.
      if (focusable.length === 0) {
        return;
      }

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [closeDialog, isOpen, isSaving]);

  const openDialog = () => {
    setStockValue(stock);
    setError(null);
    setIsOpen(true);
  };

  const saveStock = async () => {
    // Don't make a request when nothing changed.
    if (stockValue === stock) {
      closeDialog();
      return;
    }

    if (!Number.isFinite(stockValue) || stockValue < 0) {
      setError("Stock quantity must be zero or greater.");
      return;
    }

    setIsSaving(true);
    setError(null);

    try {
      const response = await fetch(
        `http://localhost:4000/products/${productId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            stock: stockValue,
          }),
        },
      );

      if (!response.ok) {
        throw new Error("Unable to update stock");
      }

      // Close first, then ask Next.js to re-fetch the Server Component.
      setIsOpen(false);
      setError(null);

      router.refresh();

      requestAnimationFrame(() => {
        triggerRef.current?.focus();
      });
    } catch {
      setError("Stock could not be updated. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        onClick={openDialog}
        className="min-h-10 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-600 focus-visible:ring-offset-2"
      >
        Adjust Stock
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <button
            type="button"
            aria-label="Close stock editor"
            onClick={closeDialog}
            className="absolute inset-0 bg-slate-950/50 backdrop-blur-sm"
          />

          <div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="stock-modal-title"
            aria-describedby="stock-modal-description"
            className="relative z-10 w-full max-w-md rounded-2xl border border-slate-200 bg-white p-5 shadow-2xl sm:p-6"
          >
            <h2
              id="stock-modal-title"
              className="text-lg font-bold text-slate-950"
            >
              Adjust Stock
            </h2>

            <p
              id="stock-modal-description"
              className="mt-1 text-sm text-slate-500"
            >
              Update the inventory quantity for{" "}
              <span className="font-medium text-slate-700">{productTitle}</span>
              .
            </p>

            <label
              htmlFor="stock-quantity"
              className="mt-6 block text-sm font-medium text-slate-700"
            >
              Stock quantity
            </label>

            <input
              ref={inputRef}
              id="stock-quantity"
              type="number"
              min={0}
              step={1}
              inputMode="numeric"
              value={stockValue}
              disabled={isSaving}
              onChange={(event) => {
                const rawValue = event.target.value;

                // Handle empty input without producing NaN.
                if (rawValue === "") {
                  setStockValue(0);
                  return;
                }

                const value = Number(rawValue);

                if (Number.isFinite(value)) {
                  setStockValue(Math.max(0, Math.floor(value)));
                }
              }}
              className="mt-2 h-11 w-full rounded-lg border border-slate-300 px-3 text-sm text-slate-900 outline-none transition focus:border-violet-600 focus:ring-2 focus:ring-violet-600/20 disabled:cursor-not-allowed disabled:bg-slate-100"
            />

            {error && (
              <p role="alert" className="mt-2 text-sm text-red-600">
                {error}
              </p>
            )}

            <div className="mt-6 flex justify-end gap-2">
              <button
                type="button"
                onClick={closeDialog}
                disabled={isSaving}
                className="min-h-11 rounded-lg border border-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-600 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={saveStock}
                disabled={isSaving || stockValue === stock}
                className="min-h-11 rounded-lg bg-violet-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-violet-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-600 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isSaving ? "Saving..." : "Save Stock"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}