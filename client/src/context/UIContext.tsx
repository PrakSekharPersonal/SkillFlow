import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import { createPortal } from "react-dom";
import { Theme, ToastType } from "../types";

interface UIContextType {
  theme: Theme;
  toggleTheme: () => void;
  showToast: (message: string, type: ToastType) => void;
}

interface ToastMessage {
  id: string;
  message: string;
  type: ToastType;
}

const UIContext = createContext<UIContextType | undefined>(undefined);

export const UIProvider = ({ children }: { children: React.ReactNode }) => {
  // Initialize theme from localStorage or system preference
  const [theme, setTheme] = useState<Theme>(() => {
    const saved = localStorage.getItem("skillflow-theme");
    if (saved === "light" || saved === "dark") return saved;

    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  });

  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Sync the theme to the HTML root element so that Tailwind's dark: classes work correctly.
  // This ensures components with createPortal also get the correct theme styles, since they are outside the normal React tree.
  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    localStorage.setItem("skillflow-theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    console.log("Current theme:", theme);
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  const showToast = useCallback((message: string, type: ToastType) => {
    const id = crypto.randomUUID();
    setToasts((prev) => [...prev, { id, message, type }]);

    setTimeout(
      () => setToasts((prev) => prev.filter((t) => t.id !== id)),
      3000, // Auto-hide toast after 3s
    );
  }, []);

  return (
    <UIContext.Provider value={{ theme, toggleTheme, showToast }}>
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 transition-colors duration-300">
        {children}

        {createPortal(
          <div className="fixed bottom-8 right-8 z-[200] flex flex-col gap-3">
            {toasts.map((toast) => (
              <div
                key={toast.id}
                className={`px-6 py-3 rounded-xl shadow-2xl text-white font-bold animate-bounce-in flex items-center gap-3
                ${toast.type === "success" ? "bg-emerald-500" : "bg-red-500"}`}
              >
                <span>{toast.type === "success" ? "✅" : "🗑️"}</span>
                {toast.message}
              </div>
            ))}
          </div>,
          document.body,
        )}
      </div>
    </UIContext.Provider>
  );
};

export const useUI = () => {
  const context = useContext(UIContext);
  if (!context) throw new Error("useUI must be used within a UIProvider");
  return context;
};
