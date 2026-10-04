"use client";

import { createContext, useCallback, useContext, useState } from "react";

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((message, opts = {}) => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, ...opts }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, opts.duration || 2600);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed bottom-5 left-1/2 -translate-x-1/2 z-[70] flex flex-col gap-2 items-center pointer-events-none">
        {toasts.map((t) => (
          <div
            key={t.id}
            className="pointer-events-auto bg-ink text-canvas px-5 py-3 rounded-sm shadow-xl flex items-center gap-3 font-mono text-xs animate-toast-in"
          >
            {t.icon !== false && (
              <svg viewBox="0 0 24 24" className="w-4 h-4 text-cobalt flex-none" fill="none">
                <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            )}
            <span>{t.message}</span>
            {t.actionLabel && t.actionHref && (
              <a href={t.actionHref} className="underline uppercase tracking-wider ml-1">
                {t.actionLabel}
              </a>
            )}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used inside <ToastProvider>");
  return ctx;
}
